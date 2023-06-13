const express = require('express');
const router = express.Router();

const bdmController = require('../../controller/bdm/task');
const transactionController = require('../../controller/transaction')

router.post('/create', bdmController.post_task_create);
router.get('/sales', bdmController.get_sales_records);
router.get('/view', bdmController.get_task_week); // view task within deadline of one week with status not equal to delivered, completed.
router.get('/filter', bdmController.get_task_ultimate); // view task within deadline of one week with status not equal to delivered, completed.
router.get('/alltask', bdmController.get_task_all); // view all task with status not equal to delivered, completed.
router.get('/progress', bdmController.get_task_progress); // view all task which are in progress.
router.get('/payment/task', bdmController.get_payment_status_task); // payment sheet with status, client
router.get('/payment/client', bdmController.get_payment_client); //payment according to client
router.get('/unassigned', bdmController.get_task_unassigned); // view all task which are unassigned.
router.get('/full', bdmController.get_task_full); // view all task
router.get('/delayed', bdmController.get_task_delayed); // view task whose deadline has passed away
router.get('/client/:clientid', bdmController.get_task_client); // view task of particular client
router.get('/test', bdmController.test);

router.post('/transaction', transactionController.createTransaction);
router.get('/transaction', transactionController.getBdaTransactions);
router.get('/transaction/stats', transactionController.getTransactionStats);
router.get('/stats', bdmController.get_bd_stats);
router.get('/cprofile', bdmController.get_bd_profile);
router.get('/:id', bdmController.get_task_single);
router.put('/:id', bdmController.put_task_update);
router.delete('/hard/:id', bdmController.delete_task_hard);
router.put('/delivered/:id', bdmController.deliver_task);
router.delete('/:id', bdmController.delete_task_soft);

module.exports = router;
