const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');

const spacesEndpoint = new AWS.Endpoint('nyc3.digitaloceanspaces.com');
const s3 = new AWS.S3({
  endpoint: spacesEndpoint,
  accessKeyId: 'YWIGNHOGQNDYSGB6WDMM',
  secretAccessKey: '4yEuWAlkZTsBK3a8nkez8XgvOD1tELWW0ZQUoc6zyM4',
});

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
          req.params.id +
          '/assessment_solutions/' +
          Date.now().toString() +
          file.originalname
      );
    },
  }),
});

// Require the controllers WHICH WE DID NOT CREATE YET!!
const taskfiles_controller = require('../../controller/task/solutionupload');

router.get('/view', taskfiles_controller.solution_view);
router.get('/:id', taskfiles_controller.solution_view_id);
router.post(
  '/solution/:id',
  upload.array('files1[]', 5),
  taskfiles_controller.solution_create
);
router.get('/get/taskfile/:type/:id', taskfiles_controller.solution_file_get);
router.post('/send-mail', taskfiles_controller.solution_send_to_client);
router.put(
  '/:id',
  upload.single('files'),
  taskfiles_controller.solution_update
);

router.delete('/:id', taskfiles_controller.solution_delete);

module.exports = router;
