const logger = require("../config/logger");
const { groupService, attendanceService, userService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");
const { Department, Invoice, Group, User } = require("../models");
const { addNewNotification } = require("../services/notification.service");
const { hasTrainerRole, hasAssistantRole } = require("../utils/roleCheck");

const getDatasetForNewInvoice = catchAsync(async (req, res) => {
	let dataset = {
		startdate: req.query.startdate,
		enddate: req.query.enddate,
		groups: [],
	};

	let department;

	for (groupID of req.query.groups) {
		const groupInfos = (await groupService.getGroupInfo(req.user, groupID))._doc;

		if (typeof department === "undefined") {
			department = groupInfos.department;
		}

		if (department._id.equals(groupInfos.department._id)) {
			dataset.groups.push(groupInfos);

			let trainingssessions = await attendanceService.getDataForInvoice(req.user, groupID, dataset.startdate, dataset.enddate);

			dataset.groups.find((val) => val._id.equals(new mongoose.Types.ObjectId(groupID))).trainingssessions = [];

			for (session of trainingssessions) {
				const weekday = ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];

				session._doc.venue = groupInfos.venue
				session._doc.groupID = groupID

				dataset.groups.find((val) => val._id.equals(new mongoose.Types.ObjectId(groupID))).trainingssessions.push(session._doc);
			}
		}
	}

	dataset.department = department;

	//Hinzufügen --> Get User Info

	dataset.userInfo = {
		userID: req.user._id,
		email: req.user.email,
		firstname: req.user.firstname,
		lastname: req.user.lastname,
	};

	await res.status(httpStatus.OK).send(dataset);
});

const submitInvoice = catchAsync(async (req, res) => {
	if (hasTrainerRole(req.user) || hasAssistantRole(req.user)) {
		let invoice = req.body;

		//Invoice is not empty
		if (invoice !== null && typeof invoice !== "undefined") {
			//Check if department head exists
			const departmentHeadIDs = (await Department.findById(invoice.department._id)).head;

			if (departmentHeadIDs === null || typeof departmentHeadIDs === "undefined") {
				throw new ApiError(httpStatus.BAD_REQUEST, "No department head found");
			}

			//Set invoice properties
			invoice.assignedTo = departmentHeadIDs;
			invoice.status = "pending";
			invoice.dateOfReceipt = new Date();
			invoice.submittedBy = req.user._id;
			invoice.dateOfLastChange = new Date();

			//TODO: Add access control
			invoice = await Invoice.create(invoice);

			if (invoice === null || typeof invoice === "undefined") {
				throw new ApiError(httpStatus.BAD_REQUEST, "Invoice could not be created");
			}

			const notification = await addNewNotification({
				title: "Neue Abrechnung",
				priority: "normal",
				from: req.user._id,
				recipients: departmentHeadIDs.map((val) => {
					return { userID: val, read: false };
				}),
				message: `${req.user.firstname} ${req.user.lastname} hat eine neue Abrechnung erstellt`,
				type: "invoice",
				data: { invoiceID: invoice._id },
			});

			if (notification === null || typeof notification === "undefined") {
				throw new ApiError(httpStatus.BAD_REQUEST, "Notification could not be created");
			}

			await res.status(httpStatus.OK).send("Invoice submitted");
		} else {
			throw new ApiError(httpStatus.BAD_REQUEST, "No invoice data found");
		}
	} else {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to submit invoices");
	}
});

const getAllAssignedInvoices = catchAsync(async (req, res) => {
	if (hasTrainerRole(req.user) || hasAssistantRole(req.user)) {
		const invoices = await Invoice.find({ assignedTo: req.user._id });

		if (invoices === null || typeof invoices === "undefined") {
			throw new ApiError(httpStatus.BAD_REQUEST, "No invoices found");
		}

		const i = Promise.all(invoices.map(async (val) => {
			const obj = {
				id: val._id,
				department: val.department,
				dateOfReceipt: val.dateOfReceipt,
				status: val.status,
				submittedBy: undefined,
				startdate: val.startdate,
				enddate: val.enddate,
				submittedBy: await userService.getUserInfo(val.submittedBy)
			}

			return await obj
		}));

		console.log(await i);

		res.status(httpStatus.OK).send(await i);
	} else {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to get assigned invoices");
	}
});

const getInvoiceByID = catchAsync(async (req, res) => {
	if (hasTrainerRole(req.user) || hasAssistantRole(req.user)) {
		const invoice = await Invoice.findById(req.params.id);
		
		if (invoice === null || typeof invoice === "undefined") {
			throw new ApiError(httpStatus.BAD_REQUEST, "No invoice found");
		}

		if(!invoice.assignedTo.includes(req.user._id)) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to get assigned invoices");
		}

		await res.status(httpStatus.OK).send(invoice);
	} else {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to get assigned invoices");
	}
});

const getOwnInvoices = catchAsync(async (req, res) => {
	if (hasTrainerRole(req.user) || hasAssistantRole(req.user)) {
		const invoices = await Invoice.find({ submittedBy: req.user._id });

		if (invoices === null || typeof invoices === "undefined") {
			throw new ApiError(httpStatus.BAD_REQUEST, "No invoices found");
		}

		await res.status(httpStatus.OK).send(invoices);
	} else {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to get assigned invoices");
	}
});

module.exports = {
	getDatasetForNewInvoice,
	submitInvoice,
	getAllAssignedInvoices,
	getInvoiceByID,
	getOwnInvoices,
};
