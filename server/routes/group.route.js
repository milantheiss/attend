//Implement GROUP ROUTE

const express = require('express');
const { verify } = require('jsonwebtoken');
const { groupController } = require('../controllers');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

//TODO Add was geschehen soll wenn gewisse URL mit verschiedenen CRUD Operations angesprochen werden

router
    .route('/')
    .get(verifyToken, groupController.getGroups)
    .post(groupController.createGroup)

router
    .route('/:groupID')
    .get(groupController.getGroupById)
    .put(groupController.updateGroup)
    .patch(groupController.updateGroup)
    .delete(groupController.deleteGroup)

//TODO Add capability to update members by /:groupID/addmember
//Backend soll Teilnehmer Liste ziehen und den neuen Teilnehmer anhängen und dann neue Liste in DB pushen

module.exports = router;

