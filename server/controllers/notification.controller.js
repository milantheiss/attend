const logger = require("../config/logger");
const { notificationService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { hasAdminRole } = require("../utils/roleCheck");

const getNotifications = catchAsync(async (req, res) => {
	const notificationIDs = req.query.notificationIds || null;
	if (notificationIDs) {
		const notifications = await notificationService.getNotificationsByIds(notificationIDs);
		if (!notifications) {
			logger.debug("No notifications found");
			return res.status(httpStatus.NOT_FOUND).send("No notifications found");
		} else if (
			!notifications.every((notification) => notification.recipients.includes(req.user.id) || notification.from.equals(req.user.id)) &&
			!hasAdminRole(req.user)
		) {
			logger.debug("User does not have access to all notifications");
			return res.status(httpStatus.FORBIDDEN).send("User does not have access to all notifications");
		}
		return res.send(notifications);
	} else {
		//Access control wird nicht benötigt, da nur die eigenen Notifications abgefragt werden
		const notifications = await notificationService.getNotificationsOfUser(req.user.id);
		if (!notifications) {
			logger.debug("No notifications found");
			return res.status(httpStatus.NOT_FOUND).send("No notifications found");
		}
		return res.send(notifications);
	}
});

const getNotificationById = catchAsync(async (req, res) => {
	const notification = await notificationService.getNotificationById(req.params.notificationId);
	if (!notification) {
		logger.debug("No notification found");
		return res.status(httpStatus.NOT_FOUND).send("No notification found");
	} else if (!notification.recipients.includes(req.user.id) && !notification.from.equals(req.user.id) && !hasAdminRole(req.user)) {
		logger.debug("User does not have access to this notification");
		return res.status(httpStatus.FORBIDDEN).send("User does not have access to this notification");
	}
	return res.send(notification);
});

const deleteNotificationById = catchAsync(async (req, res) => {
	const notificationID = req.query.notificationId;
	if (!notificationID) {
		logger.debug("No notificationID provided");
		return res.status(httpStatus.BAD_REQUEST).send("No notificationID provided");
	} else {
		const notification = await notificationService.deleteNotificationById(notificationID);
		if (!notification) {
			logger.debug("No notification found");
			return res.status(httpStatus.NOT_FOUND).send("No notification found");
		}
		return res.send(notification);
	}
});

//TODO Access control weitermachen und service erweitern

const deleteAllNotificationsOfUser = catchAsync(async (req, res) => {
	return res.send(await notificationService.deleteAllNotificationsOfUser(req.user.id));
});

const markNotificationAsRead = catchAsync(async (req, res) => {
	const notificationID = req.query.notificationId;
	if (!notificationID) {
		logger.debug("No notificationID provided");
		return res.status(httpStatus.BAD_REQUEST).send("No notificationID provided");
	} else {
		return res.send(await notificationService.markNotificationAsRead(notificationID));
	}
});

const markAllNotificationsAsRead = catchAsync(async (req, res) => {
	res.send(await notificationService.markAllNotificationsAsRead(req.user.id));
});

const markNotificationAsUnread = catchAsync(async (req, res) => {
	const notificationID = req.query.notificationId;
	if (!notificationID) {
		logger.debug("No notificationID provided");
		return res.status(httpStatus.BAD_REQUEST).send("No notificationID provided");
	} else {
		return res.send(await notificationService.markNotificationAsUnread(notificationID));
	}
});

const markAllNotificationsAsUnread = catchAsync(async (req, res) => {
	return res.send(await notificationService.markAllNotificationsAsUnread(req.user.id));
});

module.exports = {
	getNotifications,
	getNotificationById,
	deleteNotificationById,
	deleteAllNotificationsOfUser,
	markNotificationAsRead,
	markAllNotificationsAsRead,
	markNotificationAsUnread,
	markAllNotificationsAsUnread,
};
