const express = require('express');
const { groupController } = require('../controllers');
const verifyToken = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { groupValidation } = require('../validations');

const router = express.Router();

router
    .route('/')
    .get(verifyToken, groupController.getGroups)
    .post(verifyToken, validate(groupValidation.createGroup), groupController.createGroup)

router
    .route('/assigned')
    .get(verifyToken, groupController.getAssignedGroups)

router
    .route('/:groupID')
    .get(verifyToken, validate(groupValidation.getGroupById), groupController.getGroupById)

router
    .route('/:groupID/getGroupName')
    .get(verifyToken, groupController.getGroupName)

module.exports = router;

