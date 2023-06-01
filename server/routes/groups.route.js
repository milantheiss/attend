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
    .route('/assigned')
    .get(verifyToken, groupController.getAssignedGroups)

router
    .route('/:groupID')
    .get(verifyToken, groupController.getGroupById)

router
    .route('/:groupID/members')
    .patch(verifyToken, groupController.updateMember)

router
    .route('/:groupID/getGroupName')
    .get(verifyToken, groupController.getGroupName)

router
    .route('/:groupID/removeMember/:memberID')
    .delete(verifyToken, groupController.removeMember)

module.exports = router;

