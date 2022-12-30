const express = require('express');
const { invoiceController } = require('../controllers')
const verifyToken = require('../middlewares/auth');

const router = express.Router();

router
    .route('/create')
    .get(verifyToken, invoiceController.getDatasetForNewInvoice)

router
    .route("/submit")   
    .post(verifyToken, invoiceController.submitInvoice)
    
module.exports = router;