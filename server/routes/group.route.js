//Implement GROUP ROUTE

const express = require('express');
const { groupController } = require('../controllers');
const verifyToken = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { groupValidation } = require('../validations');

const router = express.Router();

router
    .route('/')
    // .patch(verifyToken, validate(groupValidation.updateGroup), groupController.updateGroup)
    .post(verifyToken, validate(groupValidation.createGroup), groupController.createGroup)

router
    .route('/:groupID')
    .get(verifyToken, validate(groupValidation.getGroupById), groupController.getGroupById)
    .patch(verifyToken, validate(groupValidation.updateGroup), groupController.updateGroup)
    .delete(verifyToken, validate(groupValidation.deleteGroup), groupController.deleteGroup)

router
    .route("/:groupID/multipleMembers")
    .post(verifyToken, validate(groupValidation.addMultipleMembers), groupController.addMultipleMembers)

router
    .route('/:groupID/member')
    .post(verifyToken, validate(groupValidation.createAndAddMember), groupController.createAndAddMember)
    
    router
    .route('/:groupID/member/:memberID')
    .post(verifyToken, validate(groupValidation.addMember), groupController.addMember)
    .patch(verifyToken, validate(groupValidation.updateMember), groupController.updateMember)
    .delete(verifyToken, validate(groupValidation.removeMember), groupController.removeMember)

router
    .route("/:groupID/multipleTrainer")
    .post(verifyToken, validate(groupValidation.addMultipleTrainer), groupController.addMultipleTrainer)

router
    .route('/:groupID/trainer')
    .post(verifyToken, validate(groupValidation.addTrainer), groupController.addTrainer)

router
    .route('/:groupID/trainer/:userID')
    .patch(verifyToken, validate(groupValidation.updateTrainer), groupController.updateTrainer)
    .delete(verifyToken, validate(groupValidation.removeTrainer), groupController.removeTrainer)

module.exports = router;

