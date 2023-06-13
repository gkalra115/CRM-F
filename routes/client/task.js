const express = require('express');
const router = express.Router();

const orderController = require('../../controller/client/task');

const { checkAuth, grantAccess } = require('../../middleware/check-auth');

const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const { body } = require('express-validator');

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'YWIGNHOGQNDYSGB6WDMM',
  secretAccessKey: '4yEuWAlkZTsBK3a8nkez8XgvOD1tELWW0ZQUoc6zyM4',
  // accessKeyId: "CGQMKIUCBKA5Y5ITKXLM",
  // secretAccessKey: "ae2CDc/HH5Ta/k/kXa8jLsIYnjCvnhJ0JL4UihGkO0U"
});

const getFormData = multer();
const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 50,
  },
  storage: multerS3({
    s3: s3,
    bucket: 'zmyrnpacflqa',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        'dev/task_files/' +
          '/order_brief/' +
          Date.now().toString() +
          file.originalname
      );
    },
  }),
});

router.post(
  '/order',
  getFormData.any(),
  grantAccess('createOwn', 'clientTask'),
  orderController.post_create_task_order
);
router.post(
  '/order/files/:id',
  grantAccess('createOwn', 'clientTask'),
  upload.array('files', 5),
  orderController.post_upload_order_files
);

router.get(
  '/approved-order',
  grantAccess('readOwn', 'clientOrder'),
  orderController.get_orders_approved
);

router.get(
  '/un-approved-order',
  grantAccess('readOwn', 'clientOrder'),
  orderController.get_orders_unapproved
);

router.get(
  '/rejected',
  grantAccess('readOwn', 'clientOrder'),
  orderController.get_orders_rejected
);

module.exports = router;
