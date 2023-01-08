const { Notification, User } = require("../models");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { default: mongoose } = require("mongoose");
const { hasAdminRole } = require("../utils/roleCheck");

/**
 * Adds a new notification to DB
 * @returns {Promise<[Notification]>}
 */
const addNewNotification = async (body) => {
	//WARNING No access control here
	//TODO Restrictions for Notification creation --> z.B. @everyone nur für Admins
	body.date = body.date || new Date();
	const notification = await Notification.create(body, { new: true });
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
	console.log("🚀 ~ file: notification.service.js:33 ~ removeRecipient ~ notificationID", notificationID);
	console.log("🚀 ~ file: notification.service.js:33 ~ removeRecipient ~ userID", userID);
	//TODO FIX THIS

	return Notification.findByIdAndUpdate(notificationID, { $pull: { recipients: { userID: userID } } }, { new: true });
};

/**
 * Updates message of notification
 * @param {mongoose.Types.ObjectId} notificationID ID of notification to update
 * @param {Object} message Full updated message of notification
 * @returns {Promise<[Notification]>} Returns updated notification
 */
const updateMessage = async (notificationID, message) => {
	//TODO Add access control here
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
};
