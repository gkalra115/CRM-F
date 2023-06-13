const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const { body } = require('express-validator');

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'DO002WYV2RBBKGRGMK99',
  secretAccessKey: '+8yFDFUgsxjwKs32wiwoKkZ3gGr6PZ7iUPWqUtqooNY',
  // accessKeyId: "CGQMKIUCBKA5Y5ITKXLM",
  // secretAccessKey: "ae2CDc/HH5Ta/k/kXa8jLsIYnjCvnhJ0JL4UihGkO0U"
});

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 100,
  },
  storage: multerS3({
    s3: s3,
    bucket: 'myrequinappspace',
    acl: 'public-read',
    key: function (req, file, cb) {
     cb(
        null,
        'dev/task_files/' +
          req.params.id +
          '/assessment_brief/' +
          Date.now().toString() +
          file.originalname
      );
    },
  }),
});

// Require the controllers WHICH WE DID NOT CREATE YET!!
const taskfiles_controller = require('../../controller/task/briefupload');

router.get('/view', taskfiles_controller.taskfiles_view);
router.get('/:id', taskfiles_controller.taskfiles_view_id);
router.post(
  '/brief/:id',
  upload.array('files[]', 5),
  taskfiles_controller.taskfiles_create
);
router.put(
  '/:id',
  upload.single('files'),
  taskfiles_controller.taskfiles_update
);

router.delete('/:id', taskfiles_controller.taskfiles_delete);

module.exports = router;
