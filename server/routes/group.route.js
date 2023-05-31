//Implement GROUP ROUTE

const express = require('express');
const { groupController } = require('../controllers');
const verifyToken = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { groupValidation } = require('../validations');

const router = express.Router();

router
    .route('/')
    //WARNING Noch nicht implementiert mit id aus Body
    // .patch(verifyToken, validate(groupValidation.updateGroup), groupController.updateGroup)
    .post(verifyToken, validate(groupValidation.createGroup), groupController.createGroup)

router
    .route('/:groupID')
    //TODO Query String hinzufügen um nur bestimmte Felder zu bekommen
    .get(verifyToken, validate(groupValidation.getGroupById), groupController.getGroupById)

//TODO Auth adden + In Service/Controller die returnten Daten auf Permission beschränken
/*
.patch(groupController.updateGroup)
.delete(groupController.deleteGroup)
*/

router
    .route('/:groupID/member')
    .post(verifyToken, validate(groupValidation.addMember), groupController.addMember)
    .patch(verifyToken, validate(groupValidation.updateMember), groupController.updateMember)

router
    .route('/:groupID/member/:memberID')
    .delete(verifyToken, validate(groupValidation.removeMember), groupController.removeMember)

module.exports = router;

