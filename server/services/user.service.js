const httpStatus = require("http-status");
const { User, Notification, Department } = require("../models");
const ApiError = require("../utils/ApiError");
const nanoid = require("nanoid");
const groupService = require('./group.service');
const notificationService = require('./notification.service');
const _ = require('lodash');

/**
 * Get all members.
 * @param {mongoose.Types.ObjectId}
 * @returns {User}
 */
const getUserInfo = async (userID) => {
	const user = await User.findById(userID);
	return {
		email: user.email,
		firstname: user.firstname,
		lastname: user.lastname,
	};
};

const getUserById = async (userID) => {
	return await User.findById(userID);
};

const getUsers = async () => {
	//Get all users which are not deactivated oder undefined
	return await User.find({ deactivated: { $ne: true } });
};

const createUser = async (userBody) => {
	if (await User.isEmailTaken(userBody.email)) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
	}

	if (await User.isUsernameTaken(userBody.username)) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
	}

	const password = nanoid.nanoid(10);

	console.log(password);

	//TODO Add send email with password

	userBody.password = password;

	return await User.create(userBody);
}

const updateUser = async (userID, updateBody) => {
	const user = await getUserById(userID);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	if (updateBody.email && (await User.isEmailTaken(updateBody.email, userID))) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
	}

	if (updateBody.username && (await User.isUsernameTaken(updateBody.username, userID))) {
		throw new ApiError(httpStatus.BAD_REQUEST, "Username already taken");
	}

	if (!_.isEqual(user.accessible_groups, updateBody.accessible_groups)) {
		//Remove Member from Group
		const removedGroups = user.accessible_groups.filter(group => !updateBody.accessible_groups.includes(group))
		for (groupId of removedGroups) {
			await groupService.removeTrainer(groupId, user._id)
		}
		//Add Member to Group
		const newGroups = updateBody.accessible_groups.filter(group => !user.accessible_groups.includes(group))
		for (groupId of newGroups) {
			await groupService.addTrainer(groupId, { id: user._id, role: user.roles.includes("trainer") ? "trainer" : "assistant" })
		}
	}

	Object.assign(user, updateBody);

	await user.save();
	return user;
};

const deleteUser = async (userID) => {
	//INFO Ein User Document sollte nicht gesamt gelöscht werden, da es in anderen Documents referenziert sein könnte
	//Diese Methode deaktiviert den User nur

	const user = await getUserById(userID);

	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	//TODO Delete all groups,notifications, invoices where user is involved
	for (groupID of user.accessible_groups) {
		await groupService.deleteTrainer(groupID, userID);
	}

	const notifications = await Notification.find({ "recipients.userID": userID });

	for (notification of notifications) {
		await notificationService.removeRecipient(notification._id, userID);
	}

	//Remove user from department head array
	const departments = await Department.find({ head: userID });
	for (department of departments) {
		department.head = undefined;
		await department.save();
	}

	user.deactivated = true;

	await user.save();
	return user;
};

const resendPassword = async (userID) => {
	const user = await getUserById(userID);
	if (!user) {
		throw new ApiError(httpStatus.NOT_FOUND, "User not found");
	}

	const password = nanoid.nanoid(10);
	//TODO Send email with new password

	console.log(password);

	user.password = password;
	await user.save();
	return
}

module.exports = {
	getUserInfo,
	getUserById,
	getUsers,
	createUser,
	deleteUser,
	updateUser,
	resendPassword
};
