const Razorpay = require('razorpay');
var request = require('request');
const User = require('../../models/user');
const { validationResult } = require('express-validator');

// live mode
let rzp = new Razorpay({
  key_id: 'rzp_live_zpRFNBpLLGZ90R', // your `KEY_ID`
  key_secret: 'RS1Yd0gVHzgxE1XPinlaA1Gw', // your `KEY_SECRET`
});

exports.get_payment_link = async (req, res, next) => {
  try {
    var date = new Date();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var daydate = date.getDate();
    var string = year + '-' + month + '-' + '1';
    var rpaytotal = await rzp.invoices.all();
    var datasorted = await rpaytotal.items.sort(function (x, y) {
      return x.created_at - y.created_at;
    });
    res.json({ count: rpaytotal.count, data: datasorted });
  } catch (e) {
    next(e);
  }
};

exports.post_customer_razorpay = async (req, res, next) => {
  //create customer

  //   rzp.customers
  //     .create({
  //       name: req.body.name,
  //       email: req.body.email,
  //       contact: req.body.phone
  //     })
  //     .then(data => {
  //       res.json(data);
  //     })
  //     .catch(error => {
  //       next(error);
  //     });

  // get all payment links
  // rzp.invoices
  //   .all({count:req.query.count})
  //   .then(data => {
  //     res.json(data);
  //   })
  //   .catch(error => {
  //     next(error);
  //   });
  //get payment link by ID
  // rzp.invoices.fetch(req.body.invoiceId).then(data => {
  //   res.json(data);
  // })
  // .catch(error => {
  //   next(error);
  // });

  //create virtual account
  // var vaccount = {
  //   receivers: {
  //     types: ["bank_account"]
  //   },
  //   description: "First Virtual Account",
  //   customer_id: "cust_EKndG2rKcvsA6v",
  //   notes: {
  //     reference_key: "reference_value"
  //   }
  // };
  // rzp.virtualAccounts
  //   .create({ vaccount }).then(data => {
  //     res.json(data);
  //   })
  //   .catch(error => {
  //   });

  //get customer by id
  // try{
  //   var cust = await rzp.customers.fetch(req.body.customer_id)
  //   res.json(cust)
  // }
  // catch(e){next(e)}

  //   try{
  //     //var cust = await rzp.payments.fetch("pay_EKno8mcfczynFU")
  //     request('https://rzp_test_g0tHfVg6F2DeQZ:uCeSRM6WH4XnaPr6sMg5QLqq@api.razorpay.com/v1/payments/pay_EKno8mcfczynFU/card', function (error, response, body) {
  // });
  //   }
  //   catch(e){next(e)}

  //create payment link
  // const paramet = {
  //   type: "link",
  //   amount: req.body.amount,
  //   currency: req.body.currency,
  //   description: req.body.description,
  //   partial_payment: req.body.partial_payment,
  //   customer: {
  //     name: req.body.cname,
  //     email: req.body.cemail,
  //     contact: req.body.cphone
  //   }
  // };
  // rzp.invoices
  //   .create(paramet)
  //   .then(data => {
  //     res.json(data);
  //   })
  //   .catch(error => {
  //     next(error);
  //   });
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return res.status(400).json({
      msg: 'error',
      errors,
    });
  }
  try {
    var userdetails = await User.findById(req.body.clientid);
    const paramet = {
      type: 'link',
      amount: req.body.amount * 100,
      currency: req.body.currency,
      description: userdetails.name,
      partial_payment: 1,
      customer: {
        name: userdetails.name,
        email: userdetails.email,
        contact: userdetails.phone,
      },
    };
    const data = await rzp.invoices
      .create(paramet);
    res.json(data);

  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.get_customer_link = async (req, res, next) => {
  try {
    cons;
    var payid = await rzp.payments.fetch('inv_FVgpPlgZcUJkIz');
    console.log('here');
    res.send(payid);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
