const express = require('express');
const { memberController } = require('../controllers');
const verifyToken = require('../middlewares/auth');
const { memberValidation } = require('../validations');
const validate = require('../middlewares/validate');

const router = express.Router();

//TODO Add was geschehen soll wenn gewisse URL mit verschiedenen CRUD Operations angesprochen werden
router
    .route('/update')
    .post(verifyToken, validate(memberValidation.updateMember), memberController.updateMember)

router
    .route('/')
    .get(verifyToken, memberController.getAllMembers)
    .post(verifyToken, memberController.addMember)

module.exports = router;
