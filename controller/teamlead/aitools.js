const {Configuration, OpenAIApi} = require("openai");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const Openailogs = require('../../models/openailogs')
const mongoose = require('mongoose');

//configuring packages
dotenv.config();
const configuration = new Configuration({apiKey: process.env.GPT3_KEY});
const openai = new OpenAIApi(configuration);
const tokenSheet = require('../../models/token');


exports.post_aitools_answers = async (req, res, next) => {
  try {
    var questions = req.body.question;
    
    if(req.decoded.userDetails.user_role == "SuperAdmin"){
        const response = await openai.createCompletion({
            model: "text-davinci-002",
            prompt: "Answer the following question.\n\nQUESTION:" + questions + "\n\nANSWER:\n",
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
        });
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
            const response = await openai.createCompletion({
                model: "text-davinci-002",
                prompt: "Answer the following question.\n\nQUESTION:" + questions + "\n\nANSWER:\n",
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
                "qanswer": response.data.choices[0]['text'],
                tokenlength: response.data.usage.total_tokens
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
