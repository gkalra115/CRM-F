const router = require('express').Router();
const gpt3Controller = require('../controller/gpt3/gpt3')


//email apis
router.post("/aitools/emailgenerator",gpt3Controller.get_email)
router.post("/aitools/quizanswer",gpt3Controller.get_answers)
router.post("/aitools/codegenerate",gpt3Controller.get_codegenerate)
router.get('/aitools/tokens', gpt3Controller.get_tokencount);
router.post("/aitools/query",gpt3Controller.create_record)
router.post("/getheadlines",gpt3Controller.get_headlines)
router.post("/aitools/open/emailgenerator",gpt3Controller.get_openemail)
//router.post("/aitools/open/quizanswer",gpt3Controller.get_openanswers)

module.exports = router;