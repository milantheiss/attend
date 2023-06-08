const express = require("express");
const { notificationController } = require("../controllers");
const verifyToken = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const notificationValidation = require("../validations/notification.validation");

const router = express.Router();

//Wenn keine ID übergeben wird, werden alle Notifications des Users zurückgegeben
//Array von IDs kann übergeben werden, um bestimmte Notifications abzufragen (?ids[]=...&ids[]=...)
router.route("/").get(verifyToken, notificationController.getNotifications); 

//In Query Parameter wird die ID der Notification übergeben (?id=...)
router.route("/delete").delete(verifyToken, validate(notificationValidation.deleteNotificationById), notificationController.deleteNotificationById); 

//In Query Parameter werden die IDs der Notifications übergeben (?ids[]=...&ids[]=...)
router.route("/deleteMany").delete(verifyToken, validate(notificationValidation.deleteManyNotifications), notificationController.deleteManyNotifications);

router.route("/deleteAll").delete(verifyToken, notificationController.deleteAllNotificationsOfUser); 

//In Query Parameter wird die ID der Notification übergeben (?id=...)
router.route("/read").get(verifyToken, validate(notificationValidation.markNotificationAsRead), notificationController.markNotificationAsRead); 

router.route("/readMany").get(verifyToken, validate(notificationValidation.markNotificationAsRead), notificationController.markManyNotificationsAsRead)

router.route("/readAll").get(verifyToken, notificationController.markAllNotificationsOfUserAsRead);  

//In Query Parameter wird die ID der Notification übergeben (?id=...)
router.route("/unread").get(verifyToken, validate(notificationValidation.markNotificationAsUnread), notificationController.markNotificationAsUnread); 

router.route("/unreadAll").get(verifyToken, validate(notificationValidation.markManyNotificationsAsUnread), notificationController.markAllNotificationsOfUserAsUnread); 

router.route("/:notificationID").get(verifyToken, notificationController.getNotificationById); 

module.exports = router;
