//Implement GROUP ROUTE

const express = require('express');
const { groupController } = require('../controllers')

const router = express.Router();

//TODO Add was geschehen soll wenn gewisse URL mit verschiedenen CRUD Operations angesprochen werden

router
    .route('/')
    .get(groupController.getGroups)
    .post(groupController.createGroup)

router
    .route('/:groupID')
    .put(groupController.updateGroup)
    .patch(groupController.updateGroup)

//TODO Add capability to update members by /:groupID/addmember
//Backend soll Teilnehmer Liste ziehen und den neuen Teilnehmer anhängen und dann neue Liste in DB pushen

module.exports = router;

