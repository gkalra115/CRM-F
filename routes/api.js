const express = require('express');
const router = express.Router();
const data_controller = require('../controller/bulkdata');
const razorpay_controller = require('../controller/razorpay/payment');
const attendance_controller = require('../controller/attendance');
const { checkAuth, grantAccess } = require('../middleware/check-auth');
const { body } = require('express-validator');
const gpt3route = require('./gpt3')
const toolsController = require('../controller/tools/tools')

const multer = require('multer');

const fs = require('fs').promises;


const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/files");
  },
  filename: (req, file, cb) => {
    const filename = file.originalname;
    const ext = filename.split(".").pop();
    cb(null, `${file.originalname}.${ext}`);
  },
});

const upload = multer({
  storage: multerStorage,
});


//call client apis
router.use(
  '/api/client',
  checkAuth,
  grantAccess('readAny', 'client'),
  require('./user/client')
);


router.use(
  '/api/freelancer',
  checkAuth,
  grantAccess('readAny', 'freelancer'),
  require('./user/freelancer')
);


router.use(
  '/api/employee',
  checkAuth,
  grantAccess('readAny', 'employee'),
  require('./user/employee')
);
router.use(
  '/api/userAccountInfo',
  checkAuth,
  require('./user/userAccountInfo')
);
router.use(
  '/api/task',
  checkAuth,
  grantAccess('readAny', 'task'),
  require('./task/task')
);
router.use(
  '/api/order',
  checkAuth,
  grantAccess('readAny', 'order'),
  require('./task/order')
);
router.use(
  '/api/status',
  checkAuth,
  grantAccess('readAny', 'status'),
  require('./task/status')
);

router.use('/api/transactions', checkAuth, grantAccess('readAny', 'transactions'), require('./superadmin/transaction'))

router.use(
  '/api/payment',
  checkAuth,
  grantAccess('readAny', 'payment'),
  require('./task/payment')
);
router.use(
  '/api/taskcomm',
  checkAuth,
  grantAccess('readOwn', 'taskcomm'),
  require('./task/comm')
);
router.use(
  '/api/comment',
  checkAuth,
  grantAccess('readAny', 'comment'),
  require('./task/comment')
);
router.use('/api/briefupload', checkAuth, require('./task/briefupload'));
router.use('/api/solutionupload', checkAuth, require('./task/solutionupload'));

// tools api

router.post('/api/tools/docupdater', checkAuth, upload.single("docFile"), toolsController.post_docproperties_updator);
router.get('/api/tools/getfiles', checkAuth, toolsController.get_filesinfolder);
router.use(
  '/admin/employee',
  checkAuth,
  grantAccess('readAny', 'adminemployee'),
  require('./admin/employee')
);
router.use(
  '/admin/task',
  checkAuth,
  grantAccess('readAny', 'admintask'),
  require('./admin/task')
);

// BDM API
router.use(
  '/bdm/client',
  checkAuth,
  grantAccess('readAny', 'bdmclient'),
  require('./bdm/clients')
);

router.use(
  '/bdm/task',
  checkAuth,
  grantAccess('readAny', 'bdmtask'),
  require('./bdm/task')
);

// MANAGER API
router.use(
  '/manager/employee',
  checkAuth,
  grantAccess('readAny', 'manageremployee'),
  require('./manager/employee')
);
router.use(
  '/manager/task',
  checkAuth,
  grantAccess('readAny', 'managertask'),
  require('./manager/task')
);

// TeamLead API
router.use(
  '/teamlead/employee',
  checkAuth,
  grantAccess('readAny', 'tlemployee'),
  require('./teamlead/employee')
);
router.use(
  '/teamlead/task',
  checkAuth,
  grantAccess('readAny', 'tltask'),
  require('./teamlead/task')
);
router.use(
  '/teamlead/aitools',
  checkAuth,
  grantAccess('readAny', 'tltask'),
  require('./teamlead/aitools')
);

// Expert API
router.use(
  '/expert/task',
  checkAuth,
  grantAccess('readAny', 'experttask'),
  require('./expert/task')
);

//Client API
router.use('/client/task', checkAuth, require('./client/task'));

router.post(
  '/razorpay/createcustomer',
  razorpay_controller.post_customer_razorpay
);
router.get('/razorpay/getpaymentlink', razorpay_controller.get_payment_link);
router.get('/razorpay/getcustomer', razorpay_controller.get_customer_link);
router.get('/', function (req, res) {
  res.render('home');
});
router.get('/privacy', function (req, res) {
  res.render('privacy');
});
router.get('/events', function (req, res) {
  res.render('events');
});
router.get('/payment', function (req, res) {
  res.render('payment');
});
router.post('/apis/bulkdata/create', data_controller.post_datalink_bulk);
router.get('/apis/bulkdata/files/year', data_controller.get_year_datafiles);
router.get('/apis/bulkdata/view/year', data_controller.get_year_data);
router.get('/apis/bulkdata/download', data_controller.get_download_data);
router.get('/apis/bulkdata/table/data', data_controller.get_table_data);
router.get('/apis/bulkdata/locus/data', data_controller.get_graph_locus);
router.post('/apis/createtaskcomm', data_controller.post_taskcomm);
router.put('/apis/updatetask', data_controller.put_task);

router.post(
  '/razorpay/createcustomer',
  [
    body('amount').trim().notEmpty().withMessage('Please enter a amount'),
    body('currency').trim().notEmpty().withMessage('Please select a currency'),
    body('clientid').trim().notEmpty().withMessage('Please select a client'),
  ],
  razorpay_controller.post_customer_razorpay
);
router.get('/razorpay/getpaymentlink', razorpay_controller.get_payment_link);

/* Attendace */
router.get(
  '/api/attendance',
  attendance_controller.validateDateQuery,
  attendance_controller.get_user_lists
);
router.put('/api/attendance/:id', attendance_controller.update_user_timings);
router.get(
  '/api/attendance/user',
  attendance_controller.get_user_single_timings
);

/*  System */
router.use(
  '/api/system',
  checkAuth,
  grantAccess('readAny', 'system'),
  require('./system')
);

router.use(
  '/api/v1',
  gpt3route
);



module.exports = router;
