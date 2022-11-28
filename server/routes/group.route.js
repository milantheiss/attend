//Implement GROUP ROUTE

const express = require('express');
const { groupController } = require('../controllers');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

router
    .route('/')
    .get(verifyToken, groupController.getGroups)
    .post(verifyToken, groupController.createGroup)

router
    .route('/:groupID')
    .get(verifyToken, groupController.getGroupById)

    //TODO Auth adden + In Service/Controller die returnten Daten auf Permission beschränken
    /*
    .put(groupController.updateGroup)
    .patch(groupController.updateGroup)
    .delete(groupController.deleteGroup)
    */

router
    .route('/:groupID/updateMember')
    .patch(verifyToken, groupController.updateMember)

router
    .route('/:groupID/removeMember/:memberID')
    .delete(verifyToken, groupController.removeMember)

router
    .route('/:groupID/getInfo')
    .get(verifyToken, groupController.getGroupInfo)

router
    .route("/search")
    .get(verifyToken, groupController.searchGroups)

//TODO Add capability to update members by /:groupID/addmember
//Backend soll Teilnehmer Liste ziehen und den neuen Teilnehmer anhängen und dann neue Liste in DB pushen

module.exports = router;

