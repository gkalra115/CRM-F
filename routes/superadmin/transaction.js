const express = require('express');
const router = express.Router();
const transactionController = require('../../controller/transaction');

router.get('/view', transactionController.getAllTransactions);
router.get('/stats', transactionController.getTransactionStats);
router.put('/verify', transactionController.toggleTransactionVerification);

module.exports = router;
