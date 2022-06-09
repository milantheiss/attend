//Implement GROUP ROUTE

const express = require('express');
const { groupController } = require('../controllers')

const router = express.Router();

//TODO Add was geschehen soll wenn gewisse URL mit verschiedenen CRUD Operations angesprochen werden

router.get('/groups', groupController.getGroups);

router.post('/groups', groupController.createGroup)

module.exports = router;

