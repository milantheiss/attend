const attendanceService = require("../services/attendance.service");
const groupService = require("../services/group.service");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const mongoose = require("mongoose");
const { Department, Invoice, User, Notification } = require("../models");
const { addNewNotification } = require("../services/notification.service");
const { hasTrainerRole, hasAssistantRole, hasDepartmentHeadRole } = require("../utils/roleCheck");
const config = require("../config/config");
const { sendInvoiceApprovalEmail } = require("../services/email.service");

const getDatasetForNewInvoice = catchAsync(async (req, res) => {
	let dataset = {
		startdate: req.query.startdate,
		enddate: req.query.enddate,
		groups: [],
	};

	let department;

	for (groupID of req.query.groups) {
		const groupInfos = await groupService.getGroupById(groupID);

		if (typeof department === "undefined") {
			department = groupInfos._doc.department;
		}

		if (department._id.equals(groupInfos._doc.department._id)) {
			groupInfos._doc.trainingssessions = await attendanceService.getDataForInvoice(req.user._id, groupID, dataset.startdate, dataset.enddate);
			dataset.groups.push(await groupInfos);
		}

		delete groupInfos._doc.participants
	}

	dataset.department = {
		_id: department._id,
		name: department.name
	};

	//Hinzufügen --> Get User Info

	const submitter = await User.findById(req.user._id, { firstname: 1, lastname: 1, headerData: 1 });

	dataset.submittedBy = {
		userId: req.user._id,
		firstname: req.user.firstname,
		lastname: req.user.lastname,
		headerData: submitter.headerData ?? {}
	};

	await res.status(httpStatus.OK).send(await dataset);
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

			const submitter = await User.findById(req.user._id, { firstname: 1, lastname: 1, headerData: 1 });


			invoice.submittedBy = {
				...invoice.submittedBy,
				firstname: submitter.firstname,
				lastname: submitter.lastname
			};

			//Speichert HeaderData in User ab
			submitter.headerData = invoice.submittedBy.headerData;
			await submitter.save();

			invoice.dateOfLastChange = new Date();

			for (group of invoice.groups) {
				group.trainingssessions.sort((a, b) => new Date(a.date) - new Date(b.date));
				group.attendanceList = await attendanceService.getFormattedListForAttendanceListPDF(group._id, invoice.startdate, invoice.enddate);
				group.department = invoice.department;
			}

			//Sortiere Group nach Gruppenname
			invoice.groups.sort((a, b) => a.name.localeCompare(b.name));

			invoice = await Invoice.create(invoice);

			if (invoice === null || typeof invoice === "undefined") {
				throw new ApiError(httpStatus.BAD_REQUEST, "Invoice could not be created");
			}

			const notification = await addNewNotification({
				title: `${req.user.firstname} ${req.user.lastname} hat Abrechnung #${invoice.invoiceNumber} erstellt`,
				priority: "normal",
				from: req.user._id,
				recipients: departmentHeadIDs.map((val) => {
					return { userID: val, read: false };
				}),
				message: `Bitte überprüfe die [Abrechnung #${invoice.invoiceNumber}](https://${config.domain}/review-invoice?id=${invoice._id})`,
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
	const invoices = await Invoice.find({ assignedTo: req.user._id, $or: [{ status: "pending" }, { status: "reopened" }] });

	if (invoices === null || typeof invoices === "undefined") {
		throw new ApiError(httpStatus.BAD_REQUEST, "No invoices found");
	}

	res.status(httpStatus.OK).send(await invoices);
});

const getInvoiceByID = catchAsync(async (req, res) => {
	if (hasTrainerRole(req.user) || hasAssistantRole(req.user)) {
		const invoice = await Invoice.findById(req.params.id);

		if (invoice === null || typeof invoice === "undefined") {
			throw new ApiError(httpStatus.BAD_REQUEST, "No invoice found");
		}

		if (!invoice.assignedTo.includes(req.user._id) && !invoice.submittedBy.userId.equals(req.user._id)) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to view this invoice");
		}

		await res.status(httpStatus.OK).send(invoice);
	} else {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to get assigned invoices");
	}
});

const getOwnInvoices = catchAsync(async (req, res) => {
	if (hasTrainerRole(req.user) || hasAssistantRole(req.user)) {
		const invoices = await Invoice.find({ "submittedBy.userId": req.user._id });

		if (invoices === null || typeof invoices === "undefined") {
			throw new ApiError(httpStatus.BAD_REQUEST, "No invoices found");
		}

		await res.status(httpStatus.OK).send(invoices);
	} else {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to get assigned invoices");
	}
});

const approveInvoice = catchAsync(async (req, res) => {
	if (hasDepartmentHeadRole(req.user)) {

		const invoice = await Invoice.findById(req.params.id);

		if (invoice === null || typeof invoice === "undefined") {
			throw new ApiError(httpStatus.BAD_REQUEST, "No invoice found");
		}

		if (!invoice.assignedTo.includes(req.user._id)) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to approve invoice");
		}

		invoice.status = "approved";
		invoice.dateOfLastChange = new Date();
		invoice.reviewer = {
			userId: req.user._id,
			firstname: req.user.firstname,
			lastname: req.user.lastname
		};

		await invoice.save();

		//Notification an Kontrolleure wird gelöscht
		await Notification.findOneAndDelete({
			$and: [
				{ "data.invoiceID": invoice._id },
				{ "recipients.$.userID": req.user._id },
				{ "type": "invoice" },
				{ "from": invoice.submittedBy.userId }
			]
		});

		await addNewNotification({
			title: `Abrechnung #${invoice.invoiceNumber} genehmigt`,
			priority: "normal",
			from: req.user._id,
			recipients: [{ userID: invoice.submittedBy.userId, read: false }],
			message: `${req.user.firstname} ${req.user.lastname} hat deine Abrechnung genehmigt. Du kannst die Abrechnung dir hier herunterladen: [Abrechnung #${invoice.invoiceNumber}](https://${config.domain}/download-invoice?id=${invoice._id})`,
			type: "invoice",
			data: { invoiceID: invoice._id },
		});

		const reviewerMail = (await User.findById(reviewer.userId, { email: 1 })).email;
		const submitterMail = (await User.findById(invoice.submittedBy.userId, { email: 1 })).email;

		await sendInvoiceApprovalEmail(reviewerMail, submitterMail, invoice);

		await res.status(httpStatus.OK).send("Invoice approved");
	} else {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to approve invoice");
	}
});

const rejectInvoice = catchAsync(async (req, res) => {
	if (hasDepartmentHeadRole(req.user)) {
		const invoice = await Invoice.findById(req.params.id);

		if (invoice === null || typeof invoice === "undefined") {
			throw new ApiError(httpStatus.BAD_REQUEST, "No invoice found");
		}

		if (!invoice.assignedTo.includes(req.user._id)) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to reject invoice");
		}

		invoice.status = "rejected";
		invoice.dateOfLastChange = new Date();
		invoice.reviewer = req.user._id;

		await invoice.save();

		//Notification an Kontrolleure wird gelöscht
		await Notification.findOneAndDelete({
			$and: [
				{ "data.invoiceID": invoice._id },
				{ "recipients.$.userID": req.user._id },
				{ "type": "invoice" },
				{ "from": invoice.submittedBy.userId }
			]
		});

		await addNewNotification({
			title: `Abrechnung #${invoice.invoiceNumber} abgelehnt`,
			priority: "normal",
			from: req.user._id,
			recipients: [{ userID: invoice.submittedBy.userId, read: false }],
			message: `${req.user.firstname} ${req.user.lastname} hat deine [Abrechnung #${invoice.invoiceNumber}](https://${config.domain}/download-invoice?id=${invoice._id}) abgelehnt`,
			type: "invoice",
			data: { invoiceID: invoice._id },
		});
		await res.status(httpStatus.OK).send("Invoice rejected");
	} else {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to reject invoice");
	}
});

const reopenInvoice = catchAsync(async (req, res) => {
	if (hasDepartmentHeadRole(req.user)) {
		const invoice = await Invoice.findById(req.params.id);

		if (invoice === null || typeof invoice === "undefined") {
			throw new ApiError(httpStatus.BAD_REQUEST, "No invoice found");
		}

		if (!invoice.assignedTo.includes(req.user._id) && !invoice.submittedBy.userId.equals(req.user._id)) {
			throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to reopen invoice");
		}

		invoice.status = "pending";
		invoice.dateOfLastChange = new Date();

		await addNewNotification({
			title: `Abrechnung #${invoice.invoiceNumber} wieder geöffnet`,
			message: `${req.user.firstName} ${req.user.lastName} hat die [Abrechnung #${invoice.invoiceNumber}](https://${config.domain}/download-invoice?id=${invoice._id}) wieder geöffnet`,
			from: req.user._id,
			recipients: [{ userID: invoice.assignedTo, read: false }],
			type: "invoice",
			date: new Date(),
			data: {
				invoiceID: invoice._id
			}
		});

		await invoice.save();

		await res.status(httpStatus.OK).send("Invoice reopened");
	} else {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to reopen invoice");
	}
});

const getPendingInvoices = catchAsync(async (req, res) => {
	if (hasDepartmentHeadRole(req.user)) {
		const invoices = await Invoice.find({ assignedTo: req.user._id, status: "pending" });

		if (invoices === null || typeof invoices === "undefined" || invoices.length === 0) {
			throw new ApiError(httpStatus.BAD_REQUEST, "No invoices found");
		}

		await res.status(httpStatus.OK).send(invoices);
	} else {
		throw new ApiError(httpStatus.UNAUTHORIZED, "User is not authorized to get pending invoices");
	}
});

const getAllInYear = catchAsync(async (req, res) => {
	const start = new Date(req.params.year, 0, 1);
	const end = new Date(Number(req.params.year) + 1, 0, 1);

	await res.status(httpStatus.OK).send(await Invoice.find({ "submittedBy.userId": req.user._id, dateOfReceipt: { $gte: new Date(start), $lt: new Date(end) } }));
});


module.exports = {
	getDatasetForNewInvoice,
	submitInvoice,
	getAllAssignedInvoices,
	getInvoiceByID,
	getOwnInvoices,
	approveInvoice,
	rejectInvoice,
	getPendingInvoices,
	reopenInvoice,
	getAllInYear
};
