const {Configuration, OpenAIApi} = require("openai");
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const NewsAPI = require('newsapi');
const Openailogs = require('../../models/openailogs')
const mongoose = require('mongoose');
//configuring packages
dotenv.config();
const configuration = new Configuration({apiKey: process.env.GPT3_KEY});
const openai = new OpenAIApi(configuration);
const newsapi = new NewsAPI(process.env.NEWSAPI);
const tokenSheet = require('../../models/token')

// generating email using openai
exports.get_email = async (req, res, next) => {
    try {
        var uuid = uuidv4();
        var rawtext = req.body.content;
        const response = await openai.createCompletion({
            model: "davinci:ft-personal:mailchamp-2022-08-08-22-26-20",
            prompt: rawtext + "\n\nPERFECT EMAIL:\n",
            temperature: 0.7,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            stop: ["[Your name]", "[Your Name]", "[your Name]", "[your name]"]
        });
        var tokenlength = response.data.usage.total_tokens
        var costs = 0.00012 * tokenlength * 79.6;
        res.status(201).json({
            "mail": response.data.choices[0]['text'],
            tokenlength: response.data.usage.total_tokens,
            cost: "₹" + costs
        });
    } catch (e) {
        res.status(400).send({error: e});
    }
}

exports.get_openemail = async (req, res, next) => {
    try {
        var uuid = uuidv4();
        var rawtext = req.body.content;
        var cookieparsed = req.cookies.uuidstored;
        if (cookieparsed === undefined) {
            const response = await openai.createCompletion({
                model: "curie:ft-personal:mailchamp-2022-08-08-15-16-37",
                prompt: rawtext + "\n\nPERFECT EMAIL:\n",
                temperature: 0.7,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                stop: ["[Your name]", "[Your Name]", "[your Name]", "[your name]"]
            });
            var cookiedata = {
                browserid: uuid,
                tokenconsumed: response.data.usage.total_tokens
            }
            res.cookie('uuidstored',cookiedata, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
            res.status(201).json({
                "mail": response.data.choices[0]['text'],
                tokenlength: response.data.usage.total_tokens,
            });
        }
        else{
            console.log(cookieparsed.tokenconsumed)
            if(cookieparsed.tokenconsumed >100){
                console.log(cookieparsed.tokenconsumed)
                res.status(400).send({alert:"Free usage is limited"})
            }
            else{
                var updatedtokens = cookieparsed.tokenconsumed;
                const response = await openai.createCompletion({
                    model: "curie:ft-personal:mailchamp-2022-08-08-15-16-37",
                    prompt: rawtext + "\n\nPERFECT EMAIL:\n",
                    temperature: 0.7,
                    max_tokens: 256,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                    stop: ["[Your name]", "[Your Name]", "[your Name]", "[your name]"]
                });
                var cookiedata = {
                    browserid: uuid,
                    tokenconsumed: Number(updatedtokens)+Number(response.data.usage.total_tokens)
                }
                res.clearCookie('uuidstored');
                res.cookie('uuidstored',cookiedata, { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
                res.status(201).json({
                    "mail": response.data.choices[0]['text'],
                    tokenlength: response.data.usage.total_tokens,
                });
            }
        }
        
    } catch (e) {
        res.status(400).send({error: e});
    }
}


exports.get_tokencount = async (req, res, next) => {
try{
    var oldtokendata = await tokenSheet.find({"user":req.decoded.userId});
    res.status(201).json({
        tokenlength: oldtokendata
    });
} catch (e){
    res.status(400).send({error: e});
}
}

exports.get_answers = async (req, res, next) => {
    try {
        var questions = req.body.question;
        var uuidnew = uuidv4();
        console.log(questions)
        if(req.decoded.userDetails.user_role == "SuperAdmin"){
            const response = await openai.createCompletion({
                model: "text-davinci-002",
                prompt: uuidnew+"\nAnswer the following question.\n\nQUESTION:" + questions + "\n\nANSWER:\n",
                temperature: 1,
                max_tokens: 256,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });
            var tokenlength = response.data.usage.total_tokens
            var openailogs = new Openailogs({
                user: req.decoded.userId,
                tokens: tokenlength,
                tool: "Qans",
                input: questions,
                output: response.data.choices[0]['text']
            })
            await openailogs.save();
            res.status(201).json({
                "qanswer": response.data.choices[0]['text'],
                tokenlength: response.data.usage.total_tokens
            });
        }
        else{
            var oldtokendata = await tokenSheet.find({"user":req.decoded.userId});
            if(Number(oldtokendata[0].updatedtokens < 10))
            {
                res.status(400).send("Tokens are required to perform operation. Contact Admin for token update.")
            }
            else{
                console.log("called")
                const response = await openai.createCompletion({
                    model: "text-davinci-002",
                    prompt: uuidnew+"\nAnswer the following question.\n\nQUESTION:" + questions + "\n\nANSWER:\n",
                    temperature: 1,
                    max_tokens: 256,
                    top_p: 1,
                    frequency_penalty: 0,
                    presence_penalty: 0,
                });
                var tokenlength = response.data.usage.total_tokens
                var openailogs = new Openailogs({
                    user: req.decoded.userId,
                    tokens: tokenlength,
                    tool: "Qans",
                    input: questions,
                    output: response.data.choices[0]['text']
                })
                await openailogs.save();
                var oldtokens = Number(oldtokendata[0].updatedtokens) - Number(tokenlength);
                let doc = await tokenSheet.findOneAndUpdate({"user":req.decoded.userId}, {"updatedtokens":oldtokens});
                res.status(201).json({
                    "q":questions,
                    "qanswer": response.data.choices[0]['text'],
                    tokenlength: response.data.usage.total_tokens
                });
            }
        }
    } catch (e) {
        res.status(400).send({error: e});
    }
}

exports.get_codegenerate = async (req, res, next) => {
    try {
        var questions = req.body.question;
        
        if(req.decoded.userDetails.user_role == "SuperAdmin"){
            const response = await openai.createCompletion({
                model: "code-davinci-002",
                prompt: "Generate the code for following statement.\n\nSTATEMENT:" + questions + "\n\nCODE:\n",
                temperature: 1,
                max_tokens: 512,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
                stop: ["\"\"\""]
            });
            var tokenlength = response.data.usage.total_tokens
            var openailogs = new Openailogs({
                user: req.decoded.userId,
                tokens: tokenlength,
                tool: "Codegen",
                input: questions,
                output: response.data.choices[0]['text']
            })
            await openailogs.save();
            res.status(201).json({
                "qanswer": response.data.choices[0]['text'],
                tokenlength: response.data.usage.total_tokens
            });
        }
        else{
            var oldtokendata = await tokenSheet.find({"user":req.decoded.userId});
            
            if(Number(oldtokendata[0].updatedtokens < 10))
            {
                
                res.status(400).send("Tokens are required to perform operation. Contact Admin for token update.")
            }
            else{
                const response = await openai.createEdit({
                    model: "code-davinci-edit-001",
                    input: "",
                    instruction: questions,
                    temperature: 1,
                    top_p: 1
                  });
                var tokenlength = response.data.usage.total_tokens
                var openailogs = new Openailogs({
                    user: req.decoded.userId,
                    tokens: tokenlength,
                    tool: "Codegen",
                    input: questions,
                    output: response.data.choices[0]['text']
                })
                await openailogs.save();
                var oldtokens = Number(oldtokendata[0].updatedtokens) - Number(tokenlength);
                let doc = await tokenSheet.findOneAndUpdate({"user":req.decoded.userId}, {"updatedtokens":oldtokens});
                res.status(201).json({
                    "qanswer": response.data.choices[0]['text'],
                    tokenlength: response.data.usage.total_tokens
                });
            }
        }
    } catch (e) {
        res.status(400).send({error: e});
    }
}

exports.create_record = async (req, res, next) => {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'squalosolutions@gmail.com',
          pass: 'ohdshhiylazjehux'
        }
      });
      var content = "Name: "+req.body.name+"*******"+"Email: "+req.body.email+"*******"+"Phone: "+req.body.number+"*******"+"Category: "+req.body.category+"*******"
      var mailOptions = {
        from: 'squalosolutions@gmail.com',
        to: 'cherryrajput@outlook.com',
        subject: 'A new query',
        text: content
      };
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            res.status(400).send({error: e});
        } else {
            res.status(201).json({status:'OK'})
        }
      }); 
}

exports.get_headlines = async (req, res, next) => {
try{
    var query = req.body.query;
    var from = req.body.from;
    var to = req.body.to;
    var sort = req.body.sort;
    newsapi.v2.everything({
        q: query,
        from: from,
        to: to,
        language: "en",
        sortBy: sort,
        page: 1
      }).then(response => {
        res.status(201).json({response});
    });
}
catch (e) {
    res.status(400).send({error: e});
}
}
