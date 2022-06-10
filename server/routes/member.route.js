const express = require('express');
const { memberController } = require('../controllers')

const router = express.Router();

//TODO Add was geschehen soll wenn gewisse URL mit verschiedenen CRUD Operations angesprochen werden

router.get('/', memberController.getMembers);

router.post('/', memberController.addMember)

module.exports = router;
