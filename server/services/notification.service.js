const { Notification, User } = require("../models");
const { hasDeveloperRole } = require("../utils/roleCheck");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const { default: mongoose } = require("mongoose");

/**
 * Adds a new notification to DB
 * @returns {Promise<[Notification]>}
 */
const addNewNotification = async (body) => {
	//WARNING No access control here
	//TODO Restrictions for Notification creation --> z.B. @everyone nur für Admins
    body.date = body.date || new Date();
	const notification = await Notification.create(body);
	await User.updateMany({ _id: { $in: notification.recipients } }, { $addToSet: { notifications: notification._id } });
	return notification;
};

/**
 * Adds recipients to notification
 * @param {[mongoose.Types.ObjectId]} recipients
 * @returns {Promise<[Notification]>}
 */
const addRecipients = async (notificationID, recipients) => {
	//TODO Add access control here
    await User.updateMany({ _id: { $in: userIDs } }, { $addToSet: { notifications: notificationID } });
	return Notification.findByIdAndUpdate(notificationID, { $addToSet: { recipients: recipients } });
};

/**
 * Remove a recipient from notification
 * @returns {Promise<[Notification]>}
 */
const removeRecipients = async (notificationID, recipients) => {
	//TODO Add access control here
    await User.updateMany({ _id: { $in: recipients } }, { $pull: { notifications: notificationID } });
	return Notification.findByIdAndUpdate(notificationID, { $pull: { recipients: recipients } });
};

/**
 * Updates message of notification
 * @param {mongoose.Types.ObjectId} notificationID ID of notification to update
 * @param {Object} message Full updated message of notification
 * @returns {Promise<[Notification]>} Returns updated notification
 */
const updateMessage = async (notificationID, message) => {
	//TODO Add access control here
	return Notification.findByIdAndUpdate(notificationID, {$set: {message: message}}, { new: true });
};

/**
 * Updates data of notification
 * @param {mongoose.Types.ObjectId} notificationID ID of notification to update
 * @param {Object} data Full updated data of notification
 * @returns {Promise<[Notification]>} Returns updated notification
 */
const updateData = async (notificationID, data) => {
	//TODO Add access control here
	return Notification.findByIdAndUpdate(notificationID, {$set: {data: data}}, { new: true });
};

/**
 * Updates priority of notification
 * @param {mongoose.Types.ObjectId} notificationID ID of notification to update
 * @param {String} priority Changed priority of notification
 * @returns {Promise<[Notification]>} Returns updated notification
 */
const changePriority = async (notificationID, priority) => {
    return Notification.findByIdAndUpdate(notificationID, {$set: {priority: priority}}, { new: true });
}

module.exports = {
	addNewNotification,
	addRecipients,
	removeRecipients,
	updateMessage,
    updateData,
    changePriority
};
