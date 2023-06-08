const { Notification, User } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { hasAdminRole } = require("../utils/roleCheck");

/**
 * Adds a new notification to DB
 * @returns {Promise<[Notification]>}
 */
const addNewNotification = async (body) => {
	body.date = body.date || new Date();
	const notification = await Notification.create(body);

	return notification;
};

/**
 * Adds recipients to notification
 * @param {[mongoose.Types.ObjectId]} userID
 * @returns {Promise<[Notification]>}
 */
const addRecipients = async (notificationID, userID) => {
	return Notification.findByIdAndUpdate(notificationID, { $addToSet: { recipients: { userID: userID } } }, { new: true });
};

/**
 * Remove a recipient from notification
 * @returns {Promise<[Notification]>}
 */
const removeRecipient = async (notificationID, userID) => {
	const notification = await Notification.findById(notificationID);

	notification.recipients = notification.recipients.filter((recipient) => !recipient.userID.equals(userID));

	return notification.save();
};

/**
 * Updates message of notification
 * @param {mongoose.Types.ObjectId} notificationID ID of notification to update
 * @param {Object} message Full updated message of notification
 * @returns {Promise<[Notification]>} Returns updated notification
 */
const updateMessage = async (notificationID, message) => {
	return Notification.findByIdAndUpdate(notificationID, { $set: { message: message } }, { new: true });
};

/**
 * Updates data of notification
 * @param {mongoose.Types.ObjectId} notificationID ID of notification to update
 * @param {Object} data Full updated data of notification
 * @returns {Promise<[Notification]>} Returns updated notification
 */
const updateData = async (notificationID, data) => {
	return Notification.findByIdAndUpdate(notificationID, { $set: { data: data } }, { new: true });
};

/**
 * Updates priority of notification
 * @param {mongoose.Types.ObjectId} notificationID ID of notification to update
 * @param {String} priority Changed priority of notification
 * @returns {Promise<[Notification]>} Returns updated notification
 */
const changePriority = async (notificationID, priority) => {
	return Notification.findByIdAndUpdate(notificationID, { $set: { priority: priority } }, { new: true });
};

/**
 * Get notification by ID
 * @param {mongoose.Types.ObjectId} notificationID
 * @returns {Promise<[Notification]>}
 */
const getNotificationById = async (notificationID) => {
	return Notification.findById(notificationID);
};

/**
 * Get notifications by IDs
 * @param {[mongoose.Types.ObjectId]} notificationIDs
 * @returns {Promise<[Notification]>}
 */
const getNotificationsByIds = async (notificationIDs) => {
	return Notification.find({ _id: { $in: notificationIDs } });
};

/**
 * Get all notifications of a user
 * @param {mongoose.Types.ObjectId} userID
 * @returns {Promise<[Notification]>}
 */
const getAllNotificationsOfUser = async (userID) => {
	return Notification.find({ recipients: { $elemMatch: { userID: userID } } });
};

/**
 * Delete notification by ID
 * @param {mongoose.Types.ObjectId} notificationID
 * @returns {Promise<[Notification]>}
 */
const deleteNotificationById = async (notificationID) => {
	return Notification.findByIdAndDelete(notificationID, { new: true });
};

/**
 * Mark notification as read
 * @param {mongoose.Types.ObjectId} userID
 * @returns {Promise<[Notification]>}
 */
const markNotificationAsRead = async (notificationID, userID) => {
	return Notification.findOneAndUpdate(
		{ _id: notificationID, recipients: { $elemMatch: { userID: userID } } },
		{ $set: { "recipients.$.read": true } },
		{ new: true }
	);
};

/**
 * Mark many notifications as read
 * @param {mongoose.Types.ObjectId} userID
 * @returns {Promise<[Notification]>}
 */
const markManyNotificationsAsRead = async (notificationIDs, userID) => {
	return Notification.updateMany(
		{ _id: { $in: notificationIDs }, recipients: { $elemMatch: { userID: userID } } },
		{ $set: { "recipients.$.read": true } }
	)
};

/**
 * Mark all notifications of a user as read
 * @param {mongoose.Types.ObjectId} userID
 * @returns {Promise<[Notification]>}
 */
const markAllNotificationsOfUserAsRead = async (userID) => {
	return Notification.updateMany({ recipients: { $elemMatch: { userID: userID } } }, { $set: { "recipients.$.read": true } }, { new: true });
};

/**
 * Mark notification as unread
 * @param {mongoose.Types.ObjectId} userID
 * @returns {Promise<[Notification]>}
 */
const markNotificationAsUnread = async (notificationID, userID) => {
	return Notification.findOneAndUpdate(
		{ _id: notificationID, recipients: { $elemMatch: { userID: userID } } },
		{ $set: { "recipients.$.read": false } },
		{ new: true }
	);
};

/**
 * Mark all notifications of a user as unread
 * @param {mongoose.Types.ObjectId} userID
 * @returns {Promise<[Notification]>}
 */
const markAllNotificationsOfUserAsUnread = async (userID) => {
	return Notification.updateMany({ recipients: { $elemMatch: { userID: userID } } }, { $set: { "recipients.$.read": false } }, { new: true });
};

const sendNotificationToAllUsers = async (body) => {
	const users = await User.find({ deactivated: { $ne: true } });

	Object.assign(body, {
		recipients: users.map((user) => ({
			userID: user._id,
			read: false,
			_id: user._id
		}))
	});

	return Notification.create(body);
}

module.exports = {
	addNewNotification,
	addRecipients,
	removeRecipient,
	updateMessage,
	updateData,
	changePriority,
	getNotificationById,
	getNotificationsByIds,
	getAllNotificationsOfUser,
	deleteNotificationById,
	markNotificationAsRead,
	markAllNotificationsOfUserAsRead,
	markNotificationAsUnread,
	markAllNotificationsOfUserAsUnread,
	markManyNotificationsAsRead,
	sendNotificationToAllUsers,
};
