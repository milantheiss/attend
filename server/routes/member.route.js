const express = require('express');
const { memberController } = require('../controllers');
const verifyToken = require('../middlewares/auth');

const router = express.Router();

//TODO Add was geschehen soll wenn gewisse URL mit verschiedenen CRUD Operations angesprochen werden
router
    .route('/')
    .post(verifyToken, memberController.addMember)

module.exports = router;
