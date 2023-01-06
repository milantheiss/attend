const express = require('express');
const { notificationController } = require('../controllers');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

//Wenn keine ID übergeben wird, werden alle Notifications des Users zurückgegeben
router
    .route('/')
    .get(verifyToken, notificationController.getNotifications)

router
    .route('/:notificationID')
    .get(verifyToken, notificationController.getNotificationById)

//In Query Parameter wird die ID der Notification übergeben (?notificationID=...)
router
    .route('/delete')
    .delete(verifyToken, notificationController.deleteNotificationById)

router
    .route('/deleteAll')
    .delete(verifyToken, notificationController.deleteAllNotificationsOfUser)


//In Query Parameter wird die ID der Notification übergeben (?notificationID=...)
router
    .route("/read")
    .patch(verifyToken, notificationController.markNotificationAsRead)

router
    .route("/readAll")
    .patch(verifyToken, notificationController.markAllNotificationsOfUserAsRead)

//In Query Parameter wird die ID der Notification übergeben (?notificationID=...)
router
    .route("/unread")
    .patch(verifyToken, notificationController.markNotificationAsUnread)

router
    .route("/unreadAll")
    .patch(verifyToken, notificationController.markAllNotificationsOfUserAsUnread)

module.exports = router;
