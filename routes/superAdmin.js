const express = require('express');
const router = express.Router();

const superAdminController = require('../controller/superAdmin');

const aitoolsController = require('../controller/gpt3/aitools')

const notificationsController = require('../controller/notifications');

const { checkAuth } = require('../middleware/check-auth');



router.get('/dashboard', checkAuth, superAdminController.get_su_dashboard);
router.get(
  '/notifications',
  checkAuth,
  superAdminController.get_su_notifications
);
router.get('/profile', checkAuth, superAdminController.get_su_profile);
router.get('/createtask', checkAuth, superAdminController.get_su_createtask);
router.get('/aitools/sectiongenerator', checkAuth, superAdminController.get_su_sectiongenerator);
router.get('/aitools/datasets', checkAuth, superAdminController.get_su_dataset);
router.get('/aitools/chat', checkAuth, superAdminController.get_su_chatbot);

//------------------su tools----------------------
router.get('/tools/docupdater', checkAuth, superAdminController.get_su_docupdater);





router.get('/aitools/email', checkAuth, superAdminController.get_su_content);
router.get('/aitools/answers', checkAuth, superAdminController.get_su_answers);
router.get('/aitools/topic', checkAuth, superAdminController.get_su_topic);
router.get('/bulk-task', checkAuth, superAdminController.get_su_bulk_task);
router.get('/finance', checkAuth, superAdminController.get_financial_records);
router.get('/sales', checkAuth, superAdminController.get_sales_records);
router.get('/payment', checkAuth, superAdminController.get_su_payment);
router.get('/payment/task', checkAuth, superAdminController.get_su_payment_task_list);
router.get(
  '/dashboardTopVendors',
  checkAuth,
  superAdminController.get_su_top_vendors
);
router.get('/samples', checkAuth, superAdminController.get_su_sample);

router.get('/transactions', checkAuth, superAdminController.get_su_transactions);

router.get('/geolocation', checkAuth, superAdminController.get_su_geo);
router.get('/clients', checkAuth, superAdminController.get_su_clients);
router.get(
  '/clients/orders',
  checkAuth,
  superAdminController.get_su_clients_orders
);
router.get('/task', checkAuth, superAdminController.get_su_task);
router.get('/team', checkAuth, superAdminController.get_su_team);
router.get('/employees', checkAuth, superAdminController.get_su_employees);
router.get('/attendance', checkAuth, superAdminController.get_su_attendance);
router.get('/freelancers', checkAuth, superAdminController.get_su_freelancers);
router.get('/alltask', checkAuth, superAdminController.get_su_all_task);
router.get('/razorpay', checkAuth, superAdminController.get_su_all_rpay);
router.get(
  '/client/:clientid',
  checkAuth,
  superAdminController.get_su_single_client
);
router.get(
  '/employee/:employeeid',
  checkAuth,
  superAdminController.get_su_single_employee
);
router.get('/task/:id', checkAuth, superAdminController.get_su_task_single);
module.exports = router;
router.post("/list/effort/:empid",superAdminController.post_effort_expert)
router.put("/list/approval/:effortid", superAdminController.put_approved_su)
router.put("/list/effortupdate/:effortid", superAdminController.put_effort_su)
router.delete("/list/deleteeffort/:effortid",superAdminController.delete_effort_su)
router.get("/list/effort/:empid",superAdminController.get_all_effort_su)
router.get("/list/taskeffort/:taskid",superAdminController.get_task_effort_su)
router.get("/list/taskid",superAdminController.get_taskid)
router.get("/list/paraphaser/training",superAdminController.get_paraphaser_train)
router.post("/list/paraphaser/training",superAdminController.post_paraphaser_train)
router.post("/list/paraphaser/content",superAdminController.post_paraphaser_content)
router.get("/payment/bda",superAdminController.get_payment_bda)
router.post("/api/v1/aitools/parphraser",superAdminController.post_paraphraser)
router.post("/api/v1/aitools/topicgenerator",superAdminController.post_topicgenerator)
router.post("/api/v1/aitools/parphraser/dataset",superAdminController.post_dataset)
router.get("/api/v1/aitools/parphraser/dataset",superAdminController.get_dataset)
router.put("/api/v1/aitools/parphraser/:dataid",superAdminController.put_dataset)
router.delete("/api/v1/aitools/parphraser/:dataid",superAdminController.delete_dataset)
router.put("/api/v1/aitools/chatbot",superAdminController.get_oslo_chatbot)
router.post("/api/v1/aitools/keywordextractor",superAdminController.get_keywords)

router.post("/api/v1/aitools/keywordextractor",superAdminController.get_keywords)

//aitools apis

router.post("/api/v1/aitools/credits", aitoolsController.create_credits )
router.get("/api/v1/aitools/credits/:userid", aitoolsController.get_credits )
router.get("/api/v1/aitools/tokens/:userid", aitoolsController.get_tokens )

router.post("/api/v1/aitools/datasets/emaildata",superAdminController.post_saveemail)



