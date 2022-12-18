const express = require('express');
const { invoiceController } = require('../controllers')
const verifyToken = require('../middlewares/auth');

const router = express.Router();

router
    .route('/')
    .get(verifyToken, invoiceController.getDatasetForInvoice)
    
module.exports = router;