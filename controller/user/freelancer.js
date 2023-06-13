//importing models from schema
const User = require("../../models/user");

//importing other installed libraries
const bcrypt = require("bcrypt");
var generator = require("generate-password");

//create freelancer
exports.post_create_freelancer = async (req, res, next) => {
  var password = await generator.generate({
    length: 10,
    numbers: true
  });
  var decryptedpass = await bcrypt.hash(password, 10);
  const freelancer = new User({
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
    user_type: "Freelancer",
    is_active: req.body.is_active,
    password: decryptedpass,
    originalpass: password,
    createdby: req.decoded.userId
  });

  try {
    var freelancersaved = await freelancer.save();
    res.status(201).send({
      status: "created",
      data: freelancersaved
    });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view all Freelancer
exports.get_freelancer_all = async (req, res, next) => {
  try {
    var allfreelancer = await User.find({ user_type: { $eq: "Freelancer" } });
    res.status(200).send({
      status: "OK",
      data: allfreelancer
    });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view single Freelancer details
exports.get_freelancer_single = async (req, res, next) => {
  try {
    var singlefreelancer = await User.findById(req.params.id);
    res.status(200).send(singlefreelancer);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//update Freelancer details
exports.put_freelancer_update = async (req, res, next) => {
    try {
      var updatefreelancer = await User.findByIdAndUpdate(req.params.id, {
        email: req.body.email,
      name: req.body.name,
      phone: req.body.phone,
      is_active: req.body.is_active,
      },{new: true});
      res.status(200).send(updatefreelancer);
    } catch (e) {
      res.status(400).send({ error: e.errmsg });
    }
  };

//hard delete Freelancer
exports.delete_freelancer_hard = async (req, res, next) => {
  try {
    var deleteuser = await User.findByIdAndRemove(req.params.id);
    res.status(200).send("User Deleted permanently");
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//soft delete Freelancer
exports.delete_freelancer_soft = async (req, res, next) => {
  try {
    var deleteuser = await User.findByIdAndUpdate(req.params.id, {
      is_active: false
    });
    res.status(200).send("User Deleted");
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

