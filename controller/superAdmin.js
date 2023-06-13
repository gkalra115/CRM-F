const keyword_extractor = require("keyword-extractor");
const User = require('../models/user');
const Paraphaser = require('../models/paraphaser');
const Task = require('../models/task');
const Transaction = require('../models/transaction')
const Emailcontent = require('../models/emailgenrator')
const EffortSheet = require('../models/effortsheet');
const { getIO } = require('../util/socket-io');
const axios = require('axios');
const mongoose = require('mongoose');
const { Configuration, OpenAIApi } = require("openai");
//const {encode, decode} = require('gpt-3-encoder')
var stringSimilarity = require("string-similarity");
// Load wink-nlp package  & helpers.
//const nlp = require('compromise/one');
const fs = require('fs');
const configuration = new Configuration({
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);
const dirTree = require("directory-tree");


exports.get_su_dashboard = (req, res, next) => {
  res.render('superAdmin/dashboard', {
    pageTitle: 'SU | Dashboard',
  });
};


exports.get_su_dataset = (req, res, next) => {
  res.render('superAdmin/dataset', {
    pageTitle: 'SU | Dataset',
  });
};



exports.get_su_sectiongenerator = (req, res, next) => {
  res.render('superAdmin/sectiongenerator', {
    pageTitle: 'SU | AI-Tools | Section Generator',
  });
};

exports.get_su_chatbot = (req, res, next) => {
  res.render('superAdmin/chat', {
    pageTitle: 'SU | AI-Tools | Chat',
  });
};

exports.get_su_docupdater = (req, res, next) => {
  res.render('superAdmin/docupdater', {
    pageTitle: 'SU | Tools | Doc Editor',
  });
};

exports.get_su_notifications = (req, res, next) => {
  res.render('superAdmin/notifications', {
    pageTitle: 'SU | Notifications',
  });
};

exports.get_su_topic = (req, res, next) => {
  res.render('superAdmin/topicgenerator', {
    pageTitle: 'SU | Topic Generator',
  });
};

exports.get_su_profile = (req, res, next) => {
  res.render('superAdmin/profile', {
    pageTitle: 'SU | Profile',
  });
};

exports.get_su_createtask = (req, res, next) => {
  res.render('superAdmin/createtask', {
    pageTitle: 'SU | Create Task',
  });
};

exports.get_su_content = (req, res, next) => {
  res.render('superAdmin/generatemail', {
    pageTitle: 'SU | Generate E-mail',
  });
};
exports.get_su_answers = (req, res, next) => {
  res.render('superAdmin/answers', {
    pageTitle: 'SU | Quiz solver',
  });
};

exports.get_su_bulk_task = (req, res, next) => {
  res.render('superAdmin/bulktask', {
    pageTitle: 'SU | Bulk Task Creator',
  });
};

exports.get_su_task_single = (req, res, next) => {
  res.render('superAdmin/singletask', {
    pageTitle: req.params.id,
  });
};

exports.get_su_task_single = (req, res, next) => {
  res.render('superAdmin/singletask', {
    pageTitle: req.params.id,
  });
};

exports.get_su_single_client = (req, res, next) => {
  res.render('superAdmin/clientsingle', {
    pageTitle: req.params.clientid,
    pageLink: true,
  });
};

exports.get_su_single_employee = (req, res, next) => {
  res.render('superAdmin/employeesingle', {
    pageTitle: req.params.employeeid,
  });
};

exports.get_su_task = (req, res, next) => {
  res.render('superAdmin/task', {
    pageTitle: 'SU | Task List',
  });
};

exports.get_su_all_task = (req, res, next) => {
  res.render('superAdmin/alltask', {
    pageTitle: 'SU | All Task',
  });
};

exports.get_su_all_rpay = (req, res, next) => {
  res.render('superAdmin/rpay', {
    pageTitle: 'SU | Razorpay',
  });
};

exports.get_su_team = (req, res, next) => {
  res.render('superAdmin/team', {
    pageTitle: 'SU | Team',
    treeViewCallId: req.decoded.userId,
  });
};
exports.get_su_clients = (req, res, next) => {
  res.render('superAdmin/clients', {
    pageTitle: 'SU | Clients',
  });
};
exports.get_su_clients_orders = (req, res, next) => {
  res.render('superAdmin/clientOrders', {
    pageTitle: 'SU | Client Orders',
  });
};
exports.get_su_employees = (req, res, next) => {
  res.render('superAdmin/employees', {
    pageTitle: 'SU | Employees',
  });
};
exports.get_su_attendance = (req, res, next) => {
  res.render('superAdmin/attendance', {
    pageTitle: 'SU | Attendance',
  });
};
exports.get_su_freelancers = (req, res, next) => {
  res.render('superAdmin/freelancers', {
    pageTitle: 'SU | Freelancers',
  });
};
exports.get_su_payment = (req, res, next) => {
  res.render('superAdmin/payment', {
    pageTitle: 'SU | Payments',
  });
};
exports.get_su_payment_task_list = (req, res, next) => {
  res.render('superAdmin/paymenttasklist', {
    pageTitle: 'SU | Payment Task',
    pageLink: true,
  });
};
exports.get_defined_tasklist = (req, res, next) => {
  res.render('superAdmin/tasklist', {
    pageTitle: 'SU | Task List',
  });
};

exports.get_su_sample = (req, res, next) => {
  res.render('superAdmin/sample', {
    pageTitle: 'SU | Samples',
  });
};

exports.get_su_transactions = (req, res, next) => {
  res.render('superAdmin/transactions', {
    pageTitle: 'SU | Transactions',
    pageLink: true,
  });
};

exports.get_su_geo = (req, res, next) => {
  res.render('superAdmin/geolocation', {
    pageTitle: 'SU | Geo Location',
  });
};

exports.get_su_top_vendors = async (req, res, next) => {
  try {
    
    const { month, year } = req.query;
  let query = {};

  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    query = { receivedOn: { $gte: startDate, $lte: endDate } };
  }

    const transactions = await Transaction.aggregate([
      {
        $match: query,
      },
      {
        $group: {
          _id: '$clientId',
          totalTransactionValue: { $sum: '$transactionValue' },
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'clientDetails',
        },
      },
      {
        $addFields: {
          clientName: { $arrayElemAt: ['$clientDetails.name', 0] },
        },
      },
      {
        $sort: { totalTransactionValue: -1 },
      },
      {
        $limit: 3,
      },
    ]);
    console.log(transactions)
    const result = transactions.map((transaction) => ({
      clientName: transaction.clientName,
      totalTransactionValue: transaction.totalTransactionValue+" INR",
    }));

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

exports.get_financial_records = async (req, res, next) => {
  if (req.query.month == null) {
    var financevalue = await Transaction.aggregate([
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: '_id',
          as: 'payments',
        },
      },
      { $unwind: '$payments' },
      {
        $project: {
          month: { $month: '$hard_deadline' },
          year: { $year: '$hard_deadline' },
          currency: '$payments.currency',
          paid: '$payments.amount_paid',
          budget: '$payments.budget',
        },
      },
      {
        $group: {
          _id: '$currency',
          totalamount: {
            $sum: '$budget',
          },
          totalpaid: {
            $sum: '$paid',
          },
        },
      },
    ]);
  } else {
    const month = req.query.month;
    const year = req.query.year;
    var financevalue = await Task.aggregate([
      {
        $lookup: {
          from: 'payments',
          localField: '_id',
          foreignField: '_id',
          as: 'payments',
        },
      },
      { $unwind: '$payments' },
      {
        $project: {
          cmonth: { $month: '$hard_deadline' },
          cyear: { $year: '$hard_deadline' },
          currency: '$payments.currency',
          paid: '$payments.amount_paid',
          budget: '$payments.budget',
        },
      },
      {
        $match: {
          cmonth: Number(month),
          cyear: Number(year),
        },
      },
      {
        $group: {
          _id: '$currency',
          totalamount: {
            $sum: '$budget',
          },
          totalpaid: {
            $sum: '$paid',
          },
        },
      },
    ]);
  }
  var lengthfinan = financevalue.length;
  var currencydata = {
    AUD: 0.021,
    GBP: 0.01,
    NZD: 0.022,
    USD: 0.014,
    INR: 1,
  };
  var sum = 0;
  var paid = 0;
  for (i = 0; i < lengthfinan; i++) {
    var inr = financevalue[i].totalamount / currencydata[financevalue[i]._id];
    var inrpaid = financevalue[i].totalpaid / currencydata[financevalue[i]._id];
    sum += inr;
    paid += inrpaid;
  }

  sum = Math.round(sum);
  paid = Math.round(paid);

  pending = sum - paid;
  res.json({ totalamount: sum, totalpaid: paid, totalpending: pending });
};

exports.get_sales_records = async (req, res, next) => {
  if (req.query.month == null) {
    var financevalue = await Task.aggregate([
      {
        $lookup: {
          from: 'status',
          localField: '_id',
          foreignField: '_id',
          as: 'status',
        },
      },
      { $unwind: '$status' },
      {
        $project: {
          month: { $month: '$hard_deadline' },
          year: { $year: '$hard_deadline' },
          wordcount: 1,
          status: '$status.status',
        },
      },
      {
        $group: {
          _id: '$status',
          wordcount: {
            $sum: '$wordcount',
          },
          totaltask: { $sum: 1 },
        },
      },
    ]);
  } else {
    const month = req.query.month;
    const year = req.query.year;
    var financevalue = await Task.aggregate([
      {
        $lookup: {
          from: 'status',
          localField: '_id',
          foreignField: '_id',
          as: 'status',
        },
      },
      { $unwind: '$status' },
      {
        $project: {
          month: { $month: '$hard_deadline' },
          year: { $year: '$hard_deadline' },
          wordcount: 1,
          status: '$status.status',
        },
      },
      {
        $match: {
          month: Number(month),
          year: Number(year),
        },
      },
      {
        $group: {
          _id: '$status',
          wordcount: {
            $sum: '$wordcount',
          },
          totaltask: { $sum: 1 },
        },
      },
    ]);
  }

  res.json(financevalue);
};

exports.post_effort_expert = async (req, res, next) => {
  try {
    var empid = mongoose.Types.ObjectId(req.params.empid);
    
    if(req.body.taskid != null){
      var validatetaskid = await Task.count({"_id":req.body.taskid});
      if(validatetaskid == 0){
      res.status(400).send("Task Dont Exist");
      }
      else{
        const { taskid, submittedon, achived_wordcount } = req.body;
        const doneby = empid;
        const createeffort = new EffortSheet({
          taskid: taskid,
          submittedon: submittedon,
          achived_wordcount: achived_wordcount,
          doneby: doneby
        });
        await createeffort.save();
        res.status(201).json({
          createeffort
        });
      }
    }
    if(req.body.title != null){
      const { title, submittedon, achived_wordcount } = req.body;
        const doneby = empid;
        const createeffort = new EffortSheet({
          title: title,
          submittedon: submittedon,
          achived_wordcount: achived_wordcount,
          doneby: doneby
        });
        await createeffort.save();
        res.status(201).json({
          createeffort
        });
    }
    else{
        res.status(400).send({
        error:"error"
      });
    }
    // 
    
    // else{
    //   const { taskid, submittedon, achived_wordcount } = req.body;
    //   const doneby = empid;
    //   const createeffort = new EffortSheet({
    //     taskid: taskid,
    //     submittedon: submittedon,
    //     achived_wordcount: achived_wordcount,
    //     doneby: doneby
    //   });
    //   await createeffort.save();
    //   res.status(201).json({
    //     createeffort
    //   });
    // }
    
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
}
//get effort sheet for SU
exports.get_all_effort_su = async (req, res, next) => {
  try {
    var empid = mongoose.Types.ObjectId(req.params.empid);
    if (req.query.month == null) {
      var effortsheet = await EffortSheet.aggregate([
        {
          $match: { doneby: empid }
        },
        {
          $project: {
            approved: 1,
            task:1,
            taskid: 1,
            submittedon: 1,
            achived_wordcount: 1
          },
        },
        { $sort: { submittedon: -1 } },
        ])
        var statssheet = await EffortSheet.aggregate([
          {
            $match: { doneby: empid }
          },
          {
            $project: {
              taskid: 1,
              achived_wordcount: 1
            },
          },
          {
            $group: {
              _id: '$aprroved',
              totalwordcount: {
                $sum: '$achived_wordcount',
              },
              totaltask: { $sum: 1 },
            },
          }
          ])
    }
    else{
      const month = req.query.month;
      const year = req.query.year;
      var effortsheet = await EffortSheet.aggregate([
        {
          $match: { doneby: empid }
        },
        {
          $project: {
            approved: 1,
            taskid: 1,
            title:1,
            submittedon: 1,
            achived_wordcount: 1,
            month: { $month: '$submittedon' },
            year: { $year: '$submittedon' },
          },
        },
        {
          $match: {
            month: Number(month),
            year: Number(year),
          },
        },
        { $sort: { submittedon: -1 } }
        
      ])
      var statssheet = await EffortSheet.aggregate([
        {
          $match: { doneby: empid }
        },
        {
          $project: {
            taskid: 1,
            achived_wordcount: 1,
            month: { $month: '$submittedon' },
            year: { $year: '$submittedon' },
          },
        },
        {
          $match: {
            month: Number(month),
            year: Number(year),
          },
        },
        {
          $group: {
            _id: '$aprroved',
            totalwordcount: {
              $sum: '$achived_wordcount',
            },
            totaltask: { $sum: 1 },
          },
        }
        ])
    }
    

      // var effortsheet = await EffortSheet.aggregate([
      //   {
      //     $match: { doneby: ObjectId("6273d83f160afc28013f47df") }
      //   }
      //   ]);
       
   
    
    res.status(200).json({ status: "OK", stats:statssheet, data: effortsheet });
    //var alleffort = await EffortSheet.find({"doneby":req.decoded.userId});
    //res.status(200).json({ status: "OK", data: alleffort });
  } catch (e) {
    res.status(400).send({ e });
  }
};

exports.put_approved_su = async (req, res, next) => {
  try {
    var effortid = req.params.effortid;  
    var effortsheet = await EffortSheet.findOneAndUpdate({ _id: effortid},{approved:true})
    
    res.status(200).json({ status: "OK", data: effortsheet });
    //var alleffort = await EffortSheet.find({"doneby":req.decoded.userId});
    //res.status(200).json({ status: "OK", data: alleffort });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

exports.put_effort_su = async (req, res, next) => {
  try {
    var effortid = req.params.effortid;  
    var data = req.body
    var effortsheet = await EffortSheet.findOneAndUpdate({ _id: effortid},data)
    
    res.status(200).json({ status: "OK", data: effortsheet });
    //var alleffort = await EffortSheet.find({"doneby":req.decoded.userId});
    //res.status(200).json({ status: "OK", data: alleffort });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

exports.delete_effort_su = async (req, res, next) => {
  try {
    var effortid = req.params.effortid;  
    console.log(effortid)
    await EffortSheet.findOneAndDelete({ _id: effortid})
    
    res.status(200).json({ status: "OK" });
    //var alleffort = await EffortSheet.find({"doneby":req.decoded.userId});
    //res.status(200).json({ status: "OK", data: alleffort });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

exports.get_taskid = async (req, res, next) => {
try{
  var taskkey= req.params.taskkey;
  console.log(taskkey);
}
catch(e){
  res.status(400).send({ error: e.errmsg });
}

}

exports.get_task_effort_su = async (req, res, next) => {
  try{
  var taskid = req.params.taskid;
  var effortsheet = await EffortSheet.aggregate([
    {
      $match: { taskid: taskid }
    },
    {
      $project: {
        doneby: 1,
        achived_wordcount: 1,
        approved: 1
      }
    }
    ])
    await User.populate(effortsheet,{path:'doneby',select: 'name'})
      res.status(200).json({ status: "OK", data: effortsheet });
    }
    catch(e){
      res.status(400).send({ error: e.errmsg });
    }
}

exports.post_topicgenerator = async (req, res, next) => {
  try{
    var title = req.body.topic;
    const response = await openai.createCompletion({
      model: "davinci-instruct-beta-v3",
      prompt: "Generate blog topics on: "+title+"\n\n1.",
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    //for genrating outline
    // const response = await openai.createCompletion({
    //   model: "text-davinci-002",
    //   prompt: "Create the outline for report on topic: "+title+"\nKey words: "+keywords+"-->",
    //   temperature: 0.7,
    //   max_tokens: 1000,
    //   top_p: 1.0,
    //   frequency_penalty: 0.0,
    //   presence_penalty: 0.0,
    // });
    // var generatedtext = response.data.choices[0]["text"];
    // var htmlcontent = generatedtext.replace(/\n/g, "<br />");
   res.status(200).json({"titles":response.data.choices[0]["text"]});
      }
      catch(e){
        res.status(400).send({ error: e });
      }
}


// exports.post_openai_su = async (req, res, next) => {
//   try{ 
//     const sentence1 = 'Terminology mining, term extraction, term recognition, or glossary extraction, is a subtask of information extraction. The goal of terminology extraction is to automatically extract relevant terms from a given corpus. In the semantic web era, a growing number of communities and networked enterprises started to access and interoperate through the internet. Modeling these communities and their information needs is important for several web applications, like topic-driven web crawlers, web services, recommender systems, etc. The development of terminology extraction is essential to the language industry. One of the first steps to model the knowledge domain of a virtual community is to collect a vocabulary of domain-relevant terms, constituting the linguistic surface manifestation of domain concepts. Several methods to automatically extract technical terms from domain-specific document warehouses have been described in the literature. Typically, approaches to automatic term extraction make use of linguistic processors (part of speech tagging, phrase chunking) to extract terminological candidates, i.e. syntactically plausible terminological noun phrases, NPs (e.g. compounds "credit card", adjective-NPs "local tourist information office", and prepositional-NPs "board of directors" - in English, the first two constructs are the most frequent). Terminological entries are then filtered from the candidate list using statistical and machine learning methods. Once filtered, because of their low ambiguity and high specificity, these terms are particularly useful for conceptualizing a knowledge domain or for supporting the creation of a domain ontology. Furthermore, terminology extraction is a very useful starting point for semantic similarity, knowledge management, human translation and machine translation, etc.';
//     const sentence =
//     "President Obama woke up Monday facing a Congressional defeat that many in both parties believed could hobble his presidency."
    
//     //  Extract the keywords
//     const extraction_result =
//     keyword_extractor.extract(sentence1,{
//         language:"english",
//         remove_digits: true,
//         return_changed_case:true,
//         remove_duplicates: false
    
//     });
//     res.status(200).json(extraction_result);
  
//   }
//   catch(e){
//           res.status(400).send({ error: e });
//   }
// }
exports.get_paraphaser_train = async (req, res, next) => {
  try{ 
    // var dataset = await Paraphaser.aggregate([
    //   {
    //     $project: {
    //       _id:0,
    //       pro:1,
    //       hard_deadline:1,
    //       wordcount:1,
    //       BDA:'$users.assignedTo',
    //       currency: '$payments.currency',
    //       paid: '$payments.amount_paid',
    //       budget: '$payments.budget',
    //       clientname: '$users.name',
    //       month: { $month: '$hard_deadline' },
    //       year: { $year: '$hard_deadline' },
    //     },
    //   },
    //   {
    //     $match: {
    //       month: Number(months),
    //       year: Number(years),
    //       BDA: bdaid
    //     },
    //   }
    // ])
    // const configuration = new Configuration({
    //   apiKey: "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",
    // });
    
    // const openai = new OpenAIApi(configuration);
    // const response = await openai.createCompletion({
    //   model: "davinci-instruct-beta",
    //   prompt: "I am a diverse paraphrasing expert. I will generate many random pairs of original and paraphrased sentences.\n\nHere are a few:\n\nOriginal: This report is based on requirement engineering, which begins with requirement elicitation.\nparaphrased: Requirement elicitation is the starting point for this report's approach to requirements engineering.\n\nOriginal: These findings suggest that the recent decline in the US labor force participation rate is driven by a decline in the number of prime-age men.\nparaphrased: Men in their prime appear to be a major factor in the recent drop in the US labour force participation rate.\n\nOriginal: The researchers will also investigate the role of alcohol consumption in driving the association between obesity and mortality.\nparaphrased: The researchers will investigate how alcohol consumption might be linked to obesity and mortality.\n\nOriginal:",
    //   temperature: 0.7,
    //   max_tokens: 100,
    //   top_p: 0.9,
    //   frequency_penalty: 0.5,
    //   presence_penalty: 0.6,
    //   stop: ["Original"],
    // });
    // let doc = nlp(response.data.choices[0]["text"])
    // let arr = doc.json().map(o=> o.text)
    // var originalsen = arr[0];
    // var paraphasedsen = arr[1].replace('paraphrased: ','');
    res.status(200).json({"Original":originalsen, "Paraphased": paraphasedsen});
    }
  catch(e){
          res.status(400).send({ error: e });
  }
}


exports.post_paraphaser_train = async (req, res, next) => {
  try{ 
    const praphasetrainingdata = new Paraphaser({
      prompt: req.body.prompt,
      completion: req.body.completion
    });
    await praphasetrainingdata.save();
    res.status(201).json({
      praphasetrainingdata
    });
    }
  catch(e){
          res.status(400).send({ error: e });
  }
}



exports.post_paraphaser_content = async (req, res, next) => {
  try{ 
    //const configuration = new Configuration({
    //  apiKey: "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",
    //});
    //const openai = new OpenAIApi(configuration);
    //const arrfinal = [];
    //let doc=nlp(req.body.content)
    //let arr = doc.json().map(o=> o.text)
    //for(i=0;i<arr.length;i++){
    //  var prompt123 = "I am a diverse paraphrasing expert. I will rewrite any any given sentence with the diverse choice of words preserving the meaning and mainintaing subject verb agreement\n\n";
    //  var promtexmp = "ORIGINAL:"+arr[i]+"\n\n"+"REWRITE:";
    //    const response = await openai.createCompletion({
    //    model: "text-ada-001",
    //    prompt: prompt123+promtexmp,
    //    temperature: 0.7,
    //    max_tokens: 100,
    //    top_p: 0.9,
    //    frequency_penalty: 0.5,
    //    presence_penalty: 0.6,
    //    stop: ["ORIGINAL", "REWRITE"],
    //  });
    //  arrfinal.push(response.data.choices[0]["text"]); 
    //}
    //console.log(nlp.text(arrfinal))
    // const arrfinal = [];
    // for(i=0;i<arr.length;i++){
    
    //   var paraphasedsen = response.data.choices[0]["text"].replace('paraphrased: ','');
    //   arrfinal.push(paraphasedseny); 
    // }
    // const response = await openai.createCompletion({
    //   model: "text-ada-001",
    //   prompt: finalexmp1+"\nOriginal: In 2021, Australia�s sustainable energy sector exploded, producing faster renewable power than previously and & introducing unprecedented additional capacity.",
    //   temperature: 0.7,
    //   max_tokens: 100,
    //   top_p: 0.9,
    //   frequency_penalty: 0.5,
    //   presence_penalty: 0.6,
    //   stop: ["Original"],
    // });
    res.status(200).send("hello");
    }
  catch(e){
          res.status(400).send({ error: e });
  }
}

exports.get_payment_bda = async (req, res, next) => {
  try{
    var bdaid = mongoose.Types.ObjectId(req.query.bda);
    var reqmonth = req.query.month;
    var reqyear = req.query.year;
    if(req.query.bda == "all"){
      const d = new Date();
      let months = d.getMonth() + 1;
      let years = d.getFullYear();
      var paymentsheet = await Task.aggregate([
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: '_id',
            as: 'payments',
          },
        },
        {$unwind:'$payments'},
        {
          $lookup:{
            from: 'users',
                    localField: 'client',
                    foreignField: '_id',
                    as: 'users'
          }
        },
        {$unwind:'$users'},
        {
          $project: {
            _id:1,
            title:1,
            hard_deadline:1,
            wordcount:1,
            BDA:'$users.assignedTo',
            currency: '$payments.currency',
            paid: '$payments.amount_paid',
            budget: '$payments.budget',
            clientname: '$users.name',
            month: { $month: '$hard_deadline' },
            year: { $year: '$hard_deadline' },
            deadline: '$hard_deadline'
          },
        },
        {
          $match: {
            month: Number(months),
            year: Number(years)
          },
        }
      ])
    }
    else{
      var paymentsheet = await Task.aggregate([
        {
          $lookup: {
            from: 'payments',
            localField: '_id',
            foreignField: '_id',
            as: 'payments',
          },
        },
        {$unwind:'$payments'},
        {
          $lookup:{
            from: 'users',
                    localField: 'client',
                    foreignField: '_id',
                    as: 'users'
          }
        },
        {$unwind:'$users'},
        {
          $project: {
            _id:1,
            title:1,
            hard_deadline:1,
            wordcount:1,
            BDA:'$users.assignedTo',
            currency: '$payments.currency',
            paid: '$payments.amount_paid',
            budget: '$payments.budget',
            clientname: '$users.name',
            month: { $month: '$hard_deadline' },
            year: { $year: '$hard_deadline' },
          },
        },
        {
          $match: {
            month: Number(reqmonth),
            year: Number(reqyear),
            BDA: bdaid
          },
        }
      ])
    }
     await User.populate(paymentsheet,{path:'BDA',select: 'name'})
    res.status(200).json({"status": "OK",data:paymentsheet});
  }
  catch(e){
    res.status(400).send({ error: e });
}
}


exports.post_paraphraser = async (req, res, next) => {
  try{ 
    //const usercontent = req.body.usercontent;

    //const configuration = new Configuration({
    //  apiKey: "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",
    //});
    
    //const openai = new OpenAIApi(configuration);
    //let doc=nlp(req.body.usercontent)
    //let arr = doc.json().map(o=> o.text)
    //const arrfinal = [];
    //const arrold = [];
    //for(i=0;i<arr.length;i++){
    //const response = await openai.createCompletion({
    //  model: "curie:ft-personal:paraphaser-curie-testing-2022-07-17-20-50-58",
    //  prompt: "I am a diverse paraphraser. I will rewrite the original sentence with a completely different choice of words preserving the meaning:\n\n\nSENTENCE: "+arr[i]+"\n\n\nPARAPHRASED:",
    //  temperature: 0.9,
    //  max_tokens: 50,
    //  top_p: 1,
    //  frequency_penalty: 0.6,
    //  presence_penalty: 0.6,
    //  stop: ["SENTENCE", "PARAPHRASED","\n"],
    //});
    //var randomColor = Math.floor(Math.random()*16777215).toString(16);
    //     var paraphasedsen = response.data.choices[0]["text"].replace(/\n/g, '');
    //     var trimmedresult1 = "<span style='color:#"+randomColor+"'>"+paraphasedsen.substring(1) + "</span>--"
    //     var oldcontent = "<span style='color:#"+randomColor+"'>"+arr[i] + "</span>--"
    //     arrold.push(oldcontent)
    //  arrfinal.push(trimmedresult1);
  //}
   //var stringresult = arrfinal.toString();
   //var originalresult = arrold.toString();
   //var finalresult = stringresult.replace(/--,/g, ' ')
   //var originalfinalresult = originalresult.replace(/--,/g, ' ')
    //res.status(200).json({"original": originalfinalresult.replace(/--/g, ' '), "paraphrased":finalresult.replace(/--/g, ' ')});
    }
  catch(e){
          res.status(400).send({ error: e });
  }
}

exports.post_dataset = async (req, res, next) => {
  try{
      const { prompt, completion} = req.body;
      const createdataset = new Paraphaser({
        prompt: prompt,
        completion: completion
      });
      
      await createdataset.save();
      res.status(201).json({
        createdataset
      });
    }
  catch(e){
          res.status(400).send({ error: e });
  }
}

exports.get_dataset = async (req, res, next) => {
  try{ 
    var paraphaserdataset = await Paraphaser.aggregate([
      {
        $project: {
          _id:1,
          prompt:1,
          completion:1,
          checked:1
        },
      }
    ])
    var plagpercentage = stringSimilarity.compareTwoStrings(
      "Olive-green table for sale, in extremely good condition.",
      "For sale: table in very good  condition, olive green in colour."
    );
    res.status(200).json({"status": "OK", "data":paraphaserdataset});
    }
  catch(e){
          res.status(400).send({ error: e });
  }
}


exports.put_dataset = async (req, res, next) => {
  try{ 
    var updateddata = {
      checked: req.body.checked
    }
    var paraphaserdataset = await Paraphaser.findOneAndUpdate({_id:req.params.dataid}, updateddata)
    res.status(200).json({"status": "OK", "Data":paraphaserdataset});
    }
  catch(e){
          res.status(400).send({ error: e });
  }
}

exports.delete_dataset = async (req, res, next) => {
  try{ 
    var paraphaserdataset = await Paraphaser.deleteOne({_id:req.params.dataid})
    res.status(200).json({"status": "OK", "Response":paraphaserdataset});
    }
  catch(e){
          res.status(400).send({ error: e });
  }
}

exports.get_oslo_chatbot = async (req, res, next) => {
  try{ 
    const configuration = new Configuration({
      apiKey: "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",
    });
   
    const openai = new OpenAIApi(configuration);
    let date_ob = new Date();
    var day = ("0" + date_ob.getDate()).slice(-2);
    var month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    var year = date_ob.getFullYear();
    var hours = date_ob.getHours();
    var datetimename = req.decoded.userId+year + "-" + month + "-" + day + "-" + hours;

    const tree = dirTree('public/chat/');
    var filestructure = tree.children
    let obj = filestructure.find(o => o.name === datetimename);
    if(obj==true){
      fs.readFile("public/chat/"+datetimename, 'utf8', async (err, data) => {
        if (err) {
            if (err) throw err;       
        }
        const response = await openai.createCompletion({
          model: "text-davinci-002",
          prompt: data+"User: "+req.body.userinput+"\n",
          temperature: 0.7,
          max_tokens: 256,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stop: ["User"],
        });
        fs.appendFile("public/chat/"+datetimename, "User: "+req.body.userinput+"\n"+response.data.choices[0]["text"]+"\n", (err) => {
          if (err) throw err;
          res.status(200).send(response.data.choices[0]["text"])
      });
      })
    }
    else{
      const response = await openai.createCompletion({
        model: "curie:ft-personal:oslowisetutor-2022-07-19-20-40-44",
        prompt: "User: "+req.body.userinput+"\n",
        temperature: 0.7,
        max_tokens: 256,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["User"],
      });
      fs.appendFile("public/chat/"+datetimename, "User: "+req.body.userinput+"\n"+response.data.choices[0]["text"]+"\n", (err) => {
        if (err) throw err;
        res.status(200).send(response.data.choices[0]["text"])
      })
    }
    






    // fs.readFile('/util/chat/'+req.decoded.userId+datetimename, 'utf8', async (err, data) => {
    //   if (err) {
    //     var data =''
    //     fs.open('/util/chat/'+req.decoded.userId+datetimename, 'w', function (err, file) {
    //       if (err) throw err;
    //       console.log('Saved!');
    //     }); 
    //   }
    //   const response = await openai.createCompletion({
    //     model: "curie:ft-personal:oslowisetutor-2022-07-19-20-40-44",
    //     prompt: data+"User: "+req.body.userinput+"\n",
    //     temperature: 0.7,
    //     max_tokens: 256,
    //     top_p: 1,
    //     frequency_penalty: 0,
    //     presence_penalty: 0,
    //     stop: ["User"],
    //   });
    //   fs.appendFile('/util/chat/'+req.decoded.userId+datetimename, "User: "+req.body.userinput+"\n"+response.data.choices[0]["text"]+"\n", (err) => {
    //     if (err) throw err;
    //     res.status(200).send(response.data.choices[0]["text"])
    // });
    // })
    }
  catch(e){
          res.status(400).send({ error: e });
  }
}

exports.get_keywords = async (req, res, next) => {
  try{
    var textpost = req.body.inputtext;
    const configuration = new Configuration({
      apiKey: "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",
    });
    const openai = new OpenAIApi(configuration);
      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: "Extract top 10 keywords from this text:\n\n"+textpost+"\n\nKEYWORDS:",
        temperature: 0.7,
        max_tokens: 60,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        stop: ["KEYWORDS"],
      });
    res.status(201).json({ "keywords": response.data.choices[0]["text"] });
  }
  catch(e){
    res.status(400).send({ error: e });
}
}




exports.post_saveemail = async (req, res, next) => {
  try{
    var empid = mongoose.Types.ObjectId(req.params.empid);
    
      const { rawemail, finalemail, token } = req.body;
      const createdby = empid;
      const createmail = new Emailcontent({
        prompt: rawemail,
        completion: finalemail,
        tokenconsumed: token,
        createdby: createdby
      });
      await createmail.save();
      res.status(201).json({
        "status":"ok"
      });
  }
  catch(e){
    res.status(400).send({ error: e });
}
}

//generates logs for gpt3

