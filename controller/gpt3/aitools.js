const {Configuration, OpenAIApi} = require("openai");
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require('nodemailer');
const NewsAPI = require('newsapi');
const User = require('../../models/user');

//configuring packages
dotenv.config();
const configuration = new Configuration({apiKey: process.env.GPT3_KEY});
const openai = new OpenAIApi(configuration);
const newsapi = new NewsAPI(process.env.NEWSAPI);
const CreditSheet = require('../../models/credits');
const tokenSheet = require('../../models/token')
// generating email using openai
exports.create_credits = async (req, res, next) => {
    try {
       var updatedBy = req.decoded.userId;
       var user = req.body.user;
       var tokens = req.body.tokens;
       var activity = "transferred";
       var currentdate = new Date(); 
       var expiry = currentdate.setDate(currentdate.getDate() + 30);
       const createcredits = new CreditSheet({
        updatedBy:updatedBy,
        user:user,
        tokens: tokens,
        activity: activity,
        expiry: expiry
      });
      await createcredits.save();
      var count = await tokenSheet.count({"user":user})
      if(count == 0){
        const createtokens = new tokenSheet({
            user:user,
            updatedtokens: tokens,
            activity: activity});
        await createtokens.save();
        res.status(201).json({"status":"ok","data":createcredits})
      }
      else{
        var oldtokendata = await tokenSheet.find({"user":user});
        var oldtokens = Number(oldtokendata[0].updatedtokens) + Number(tokens);
        let doc = await tokenSheet.findOneAndUpdate({"user":user}, {"updatedtokens":oldtokens});
        res.status(201).json({"status":"ok","data":createcredits})
      }
       
       
    } catch (e) {
        res.status(400).send({error: e});
    }
}

exports.get_credits = async (req, res, next) => {
    try {
        
        var alleffort = await CreditSheet.find({"user":req.params.userid});
 
        res.status(200).json({"status":"ok","data":alleffort})
    } catch (e) {
        res.status(400).send({error: e});
    }
}

exports.get_tokens = async (req, res, next) =>{
    try{
        var alleffort = await tokenSheet.find({"user":req.params.userid});
        res.status(200).send({data:alleffort});
    } catch (e){
        res.status(400).send({error:e})
    }
}