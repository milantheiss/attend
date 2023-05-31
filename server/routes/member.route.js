const express = require('express');
const { memberController } = require('../controllers');
const verifyToken = require('../middlewares/auth');
const { memberValidation } = require('../validations');
const validate = require('../middlewares/validate');

const router = express.Router();

//TODO Add was geschehen soll wenn gewisse URL mit verschiedenen CRUD Operations angesprochen werden
router
    .route('/')
    //WARNING Nimmt nur Firstname, Lastname und Birthday an
    .post(verifyToken, validate(memberValidation.createMember), memberController.createMember)
    
    
    router
    .route('/:id')
    .delete(verifyToken, validate(memberValidation.deleteMember), memberController.deleteMember)
    .put(verifyToken, validate(memberValidation.updateMember), memberController.updateMember)
    .patch(verifyToken, validate(memberValidation.updateMember), memberController.updateMember)

module.exports = router;
