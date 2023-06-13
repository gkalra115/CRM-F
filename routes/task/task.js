const express = require('express');
const router = express.Router();
const { check, body } = require('express-validator');
const multer = require('multer');

const storage = multer.diskStorage({
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  destination: function (req, file, cb) {
    cb(null, 'upload/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now().toString() + file.originalname);
  },
});

const upload = multer({ storage: storage });

const createTaskValidate = [
  body('data').custom((value, { req }) => {
    const { taskDetail, clientData } = JSON.parse(value);
    let result = true;
    Object.keys(taskDetail).map((key) => {
      if (taskDetail[key] === '' && key !== 'description') {
        throw new Error(`Please enter a valid value for ${key}`);
      }
    });
    clientData.map((data) => {
      if (data.title.length === 0 || data.client.length === 0) {
        result = false;
        return result && true;
      } else {
        return result;
      }
    });
    if (
      !(
        new Date(taskDetail.soft_deadline).valueOf() <=
        new Date(taskDetail.hard_deadline).valueOf()
      )
    ) {
      throw new Error('Soft Deadline should not be greater then Hard Deadline');
    }
    return true;
  }),
];

const editTaskValidate = [
  body('title').notEmpty().withMessage('Please enter a valid Title'),
  body('wordcount').notEmpty().withMessage('Please enter a valid Wordcount'),
  body('soft_deadline')
    .notEmpty()
    .custom((value, { req }) => {
      const dateCheck =
        new Date(value).valueOf() <= new Date(req.body.hard_deadline).valueOf();
      if (!dateCheck) {
        throw new Error(
          'Soft Deadline should not be greater then Hard Deadline'
        );
      }
      return true;
    }),
  body('hard_deadline')
    .notEmpty()
    .withMessage('Please enter a Valid HardDeadline'),
  body('client').notEmpty().withMessage('Please enter a valid Client'),
];

const task_controller = require('../../controller/task/task');

router.post('/create', createTaskValidate, task_controller.post_task_create);
router.post(
  '/create-bulk-task',
  upload.single('file'),
  task_controller.post_bulk_task_create
);
router.get('/get-bulk-task', task_controller.get_bulk_task);
router.get('/view', task_controller.get_task_week); // view task within deadline of one week with status not equal to delivered, completed.
router.get('/by-week', task_controller.get_task_by_week); // view task within deadline of one week with status not equal to delivered, completed.
router.get('/filter', task_controller.get_task_ultimate); // view task within deadline of one week with status not equal to delivered, completed.
router.get('/alltask', task_controller.get_task_all); // view all task with status not equal to delivered, completed.
router.get('/progress', task_controller.get_task_progress); // view all task which are in progress.
router.get('/payment/task', task_controller.get_payment_status_task); // payment sheet with status, client
router.get('/payment/tasklist', task_controller.get_su_payment_task_filters)
router.get('/payment/client', task_controller.get_payment_client); //payment according to client
router.get('/unassigned', task_controller.get_task_unassigned); // view all task which are unassigned.
router.get('/full', task_controller.get_task_full); // view all task
router.get('/delayed', task_controller.get_task_delayed); // view task whose deadline has passed away
router.get('/client/:clientid', task_controller.get_task_client); // view task of particular client
// router.get("/test", task_controller.test)
router.get('/:id', task_controller.get_task_single);
router.put('/status/:id', task_controller.put_status_update); // mark task as completed
router.put('/:id', editTaskValidate, task_controller.put_task_update);
router.delete('/hard/:id', task_controller.delete_task_hard);
router.delete('/delete-bulk/:bulkId', task_controller.delete_bulk_task_hard);
router.delete('/:id', task_controller.delete_task_soft);
router.get('/calendar/getStats', task_controller.getCalendarEvents);


module.exports = router;
