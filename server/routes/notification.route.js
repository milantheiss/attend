const express = require("express");
const { notificationController } = require("../controllers");
const verifyToken = require("../middlewares/auth");

const router = express.Router();

//Wenn keine ID übergeben wird, werden alle Notifications des Users zurückgegeben
//Array von IDs kann übergeben werden, um bestimmte Notifications abzufragen (?ids[]=...&ids[]=...)
router.route("/").get(verifyToken, notificationController.getNotifications); 

//In Query Parameter wird die ID der Notification übergeben (?id=...)
router.route("/delete").delete(verifyToken, notificationController.deleteNotificationById); 

//In Query Parameter werden die IDs der Notifications übergeben (?ids[]=...&ids[]=...)
router.route("/deleteMany").delete(verifyToken, notificationController.deleteManyNotifications);

router.route("/deleteAll").delete(verifyToken, notificationController.deleteAllNotificationsOfUser); 

//In Query Parameter wird die ID der Notification übergeben (?id=...)
router.route("/read").get(verifyToken, notificationController.markNotificationAsRead); 

router.route("/readMany").get(verifyToken, notificationController.markManyNotificationsAsRead)

router.route("/readAll").get(verifyToken, notificationController.markAllNotificationsOfUserAsRead);  

//In Query Parameter wird die ID der Notification übergeben (?id=...)
router.route("/unread").get(verifyToken, notificationController.markNotificationAsUnread); 

router.route("/unreadAll").get(verifyToken, notificationController.markAllNotificationsOfUserAsUnread); 

router.route("/:notificationID").get(verifyToken, notificationController.getNotificationById); 

module.exports = router;
