const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const { body } = require('express-validator');
const multerS3 = require('multer-s3');

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'YWIGNHOGQNDYSGB6WDMM',
  secretAccessKey: '4yEuWAlkZTsBK3a8nkez8XgvOD1tELWW0ZQUoc6zyM4',
});

const upload = multer({
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
  storage: multerS3({
    s3: s3,
    bucket: 'zmyrnpacflqa',
    acl: 'public-read',
    key: function (req, file, cb) {
      cb(
        null,
        'dev/task_files/' +
          req.decoded.userId +
          '/comments/' +
          Date.now().toString() +
          file.originalname
      );
    },
  }),
});

const comment_controller = require('../../controller/task/comment');

router.get('/view', comment_controller.get_comment_all);
router.post(
  '/create/:id',
  upload.single('attachemntFile'),
  [
    body('comment')
      .custom((value, { req }) => {
        if (value.length > 0) {
          return true;
        }
        return false;
      })
      .withMessage('comment is required'),
    body('commentto')
      .custom((value, { req }) => {
        if (value !== 'null' && value.length > 0) {
          return true;
        }
        return false;
      })
      .withMessage('sent to is required'),
  ],
  comment_controller.post_create_comment
);
router.get('/task/:taskid', comment_controller.get_comment_task);
// router.put("/:id", comment_controller.put_comm_update);

module.exports = router;
