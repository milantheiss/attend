const logger = require("../config/logger");
const { notificationService } = require("../services");
const catchAsync = require("../utils/catchAsync");
const httpStatus = require("http-status");
const { hasAdminRole } = require("../utils/roleCheck");

const getNotifications = catchAsync(async (req, res) => {
	const notificationIDs = req.query.ids || null;
	
	if (notificationIDs) {
		//Wenn notificationIDs übergeben wurden, werden diese abgefragt
		const notifications = await notificationService.getNotificationsByIds(notificationIDs);
		
		if (!notifications) {
			//Wenn keine Notifications gefunden wurden, wird ein Fehler zurückgegeben
			logger.debug("No notifications found");
			return res.status(httpStatus.NOT_FOUND).send("No notifications found");
		} else if (
			!notifications.every(
				(notification) => notification.recipients.some((recipient) => recipient.userID.equals(req.user._id)) || notification.from.equals(req.user._id)
			) &&
			!hasAdminRole(req.user)
		) {
			//Wenn der User nicht Admin ist und nicht alle Notifications abgefragt werden, wird ein Fehler zurückgegeben
			logger.debug("User does not have access to all notifications");
			return res.status(httpStatus.FORBIDDEN).send("User does not have access to all notifications");
		}

		return res.send(notifications);
	} else {
		//Access control wird nicht benötigt, da nur die eigenen Notifications abgefragt werden
		const notifications = await notificationService.getAllNotificationsOfUser(req.user._id);
		if (!notifications) {
			logger.debug("No notifications found");
			return res.status(httpStatus.NOT_FOUND).send("No notifications found");
		}
		return res.send(notifications);
	}
});

const getNotificationById = catchAsync(async (req, res) => {
	const notification = await notificationService.getNotificationById(req.params.notificationID);
	if (!notification) {
		//Wenn die Notification nicht gefunden wird, wird ein Fehler zurückgegeben
		logger.debug("No notification found");
		return res.status(httpStatus.NOT_FOUND).send("No notification found");
	} else if (!notification.recipients.some((recipient) => recipient.userID.equals(req.user._id)) && !notification.from.equals(req.user._id)) {
		//User darf nur Notifications abfragen, die er empfangen hat
		logger.debug("User does not have access to this notification");
		return res.status(httpStatus.FORBIDDEN).send("User does not have access to this notification");
	}
	return res.send(notification);
});

const deleteNotificationById = catchAsync(async (req, res) => {
	const notificationID = req.query.id || null;

	if (!notificationID) {
		//Wenn keine NotificationID übergeben wird, wird ein Fehler zurückgegeben
		logger.debug("No notificationID provided");
		return res.status(httpStatus.BAD_REQUEST).send("No notificationID provided");
	} else {
		let notification = await notificationService.getNotificationById(notificationID);
		if (!notification) {
			//Wenn die Notification nicht gefunden wird, wird ein Fehler zurückgegeben
			logger.debug("No notification found");
			return res.status(httpStatus.NOT_FOUND).send("No notification found");
		} else if (!notification.recipients.some((recipient) => recipient.userID.equals(req.user._id))) {
			//User darf nur Notifications löschen, die er empfangen hat
			//Admins haben über diese Methode keinen Zugriff auf Notifications, die sie nicht empfangen haben
			//TODO: Admins Methode erstellen, worüber Notifications gelöscht werden können, die sie nicht empfangen haben, wenn sie die NotificationID kennen
			logger.debug("User does not have access to this notification");
			return res.status(httpStatus.FORBIDDEN).send("User does not have access to this notification");
		} else if (notification.recipients.length > 1) {
			//Wenn die Notification noch an andere User gesendet wird, wird der User nur aus der Liste der Empfänger entfernt
			notification = await notificationService.removeRecipient(notificationID, req.user._id);
		} else {
			//Wenn die Notification nur noch an den User gesendet wird, wird sie gelöscht
			notification = await notificationService.deleteNotificationById(notificationID);
		}

		if (!notification) {
			//Wenn die Notification nicht gefunden wird, wird ein Fehler zurückgegeben
			logger.debug("No notification found");
			return res.status(httpStatus.NOT_FOUND).send("No notification found");
		}
		return res.send(notification); //Die Notification wird zurückgegeben
	}
});

const deleteManyNotifications = catchAsync(async (req, res) => {
	const notificationIDs = req.query.ids || null;

	if (!notificationIDs) {
		//Wenn keine NotificationIDs übergeben wird, wird ein Fehler zurückgegeben
		logger.debug("No notificationIDs provided");
		return res.status(httpStatus.BAD_REQUEST).send("No notificationIDs provided");
	} else {
		let notifications = await notificationService.getNotificationsByIds(notificationIDs);

		if (!notifications) {
			//Wenn die Notification nicht gefunden wird, wird ein Fehler zurückgegeben
			logger.debug("No notification found");
			return res.status(httpStatus.NOT_FOUND).send("No notification found");
		} else if (!notifications.every((notification) => notification.recipients.some((recipient) => recipient.userID.equals(req.user._id)))) {
			//User darf nur Notifications löschen, die er empfangen hat
			//Admins haben über diese Methode keinen Zugriff auf Notifications, die sie nicht empfangen haben
			//TODO: Admins Methode erstellen, worüber Notifications gelöscht werden können, die sie nicht empfangen haben, wenn sie die NotificationID kennen
			logger.debug("User does not have access to all notifications");
			return res.status(httpStatus.FORBIDDEN).send("User does not have access to all notifications");
		}

		notifications = notifications.map(async (notification) => {
			if (notification.recipients.length > 1) {
				//Wenn die Notification noch an andere User gesendet wird, wird der User nur aus der Liste der Empfänger entfernt
				return await notificationService.removeRecipient(notification._id, req.user._id);
			} else {
				//Wenn die Notification nur noch an den User gesendet wird, wird sie gelöscht
				return await notificationService.deleteNotificationById(notification._id);
			}
		});

		if (!notifications || notifications.length === 0) {
			//Wenn die Notification nicht gefunden wird, wird ein Fehler zurückgegeben
			logger.debug("No notification found");
			return res.status(httpStatus.NOT_FOUND).send("No notification found");
		}

		return res.send(notifications); //Die Notifications werden zurückgegeben
	}
});

const deleteAllNotificationsOfUser = catchAsync(async (req, res) => {
	const notifications = await notificationService.getAllNotificationsOfUser(req.user._id);
	if (!notifications) {
		//Wenn keine Notifications gefunden werden, wird ein Fehler zurückgegeben
		logger.debug("No notifications found");
		return res.status(httpStatus.NOT_FOUND).send("No notifications found");
	}

	//Kein Access control, da nur die eigenen Notifications gelöscht werden

	notifications.forEach(async (notification) => {
		if (notification.recipients.length > 1) {
			//Wenn die Notification noch an andere User gesendet wird, wird der User nur aus der Liste der Empfänger entfernt
			await notificationService.removeRecipient(notification._id, req.user._id);
		} else {
			//Wenn die Notification nur noch an den User gesendet wird, wird sie gelöscht
			await notificationService.deleteNotificationById(notification._id);
		}
	});
	return res.send(notifications);
});

const markNotificationAsRead = catchAsync(async (req, res) => {
	const notificationID = req.query.id;
	if (!notificationID) {
		logger.debug("No notificationID provided");
		return res.status(httpStatus.BAD_REQUEST).send("No notificationID provided");
	} else {
		const notification = await notificationService.markNotificationAsRead(notificationID, req.user._id);
		if (!notification) {
			//Wenn die Notification nicht gefunden wird, wird ein Fehler zurückgegeben
			logger.debug("No notification found");
			return res.status(httpStatus.NOT_FOUND).send("No notification found");
		}
		return res.send(notification);
	}
});

const markAllNotificationsOfUserAsRead = catchAsync(async (req, res) => {
	//Kein Access control, da nur die eigenen Notifications gelesen werden
	const notifications = await notificationService.markAllNotificationsOfUserAsRead(req.user._id);
	if (!notifications) {
		//Wenn keine Notifications gefunden werden, wird ein Fehler zurückgegeben
		logger.debug("No notifications found");
		return res.status(httpStatus.NOT_FOUND).send("No notifications found");
	}
	return res.send(notifications);
});

const markNotificationAsUnread = catchAsync(async (req, res) => {
	const notificationID = req.query.id;
	if (!notificationID) {
		logger.debug("No notificationID provided");
		return res.status(httpStatus.BAD_REQUEST).send("No notificationID provided");
	} else {
		const notification = await notificationService.markNotificationAsUnread(notificationID, req.user._id);
		if (!notification) {
			//Wenn die Notification nicht gefunden wird, wird ein Fehler zurückgegeben
			logger.debug("No notification found");
			return res.status(httpStatus.NOT_FOUND).send("No notification found");
		}
		return res.send(notification);
	}
});

const markAllNotificationsOfUserAsUnread = catchAsync(async (req, res) => {
	const notifications = await notificationService.markAllNotificationsOfUserAsUnread(req.user._id);
	if (!notifications) {
		//Wenn keine Notifications gefunden werden, wird ein Fehler zurückgegeben
		logger.debug("No notifications found");
		return res.status(httpStatus.NOT_FOUND).send("No notifications found");
	}
	return res.send(notifications);
});

const markManyNotificationsAsRead = catchAsync(async (req, res) => {
	const notificationIDs = req.query.ids || null;

	if (!notificationIDs) {
		logger.debug("No notificationIDs provided");
		return res.status(httpStatus.BAD_REQUEST).send("No notificationIDs provided");
	} else {
		const notifications = await notificationService.markManyNotificationsAsRead(notificationIDs, req.user._id);
		if (!notifications) {
			//Wenn die Notification nicht gefunden wird, wird ein Fehler zurückgegeben
			logger.debug("No notification found");
			return res.status(httpStatus.NOT_FOUND).send("No notification found");
		}
		return res.send(notifications);
	}
});

const changeDate = catchAsync(async (req, res) => {
	const notificationID = req.query.id;
	const date = req.query.date;
	if (!notificationID) {
		logger.debug("No notificationID provided");
		return res.status(httpStatus.BAD_REQUEST).send("No notificationID provided");
	} else {
		const notification = await notificationService.changeDate(notificationID, date);
		if (!notification) {
			//Wenn die Notification nicht gefunden wird, wird ein Fehler zurückgegeben
			logger.debug("No notification found");
			return res.status(httpStatus.NOT_FOUND).send("No notification found");		}
		return res.send(notification);
	}
});

module.exports = {
	getNotifications,
	getNotificationById,
	deleteNotificationById,
	deleteAllNotificationsOfUser,
	markNotificationAsRead,
	markAllNotificationsOfUserAsRead,
	markNotificationAsUnread,
	markAllNotificationsOfUserAsUnread,
	deleteManyNotifications,
	markManyNotificationsAsRead,
	changeDate,
};
