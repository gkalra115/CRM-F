const Transaction = require('../models/transaction');
const User = require('../models/user');
var ObjectId = require('mongoose').Types.ObjectId;


exports.createTransaction = async (req, res, next) => {
  try {

    var { client, amount, currency, transactionDate, paymentAccount } = req.body;
    const transaction = new Transaction({
      clientId: client,
      transactionValue: amount,
      transactionCurrency: currency,
      receivedOn: transactionDate,
      paymentAccount,
      createdby: req.user.userId
    });

    await transaction.save();

    res.status(201).json({
      message: 'Transaction created successfully',
      transaction
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: 'Server error'
    });
  }
};

exports.getBdaTransactions = async (req, res, next) => {
  try {

    const { month, year } = req.query;
    let filter = { createdby: req.user.userId };
    if (month && year) {
      filter.$expr = {
        $and: [
          { $eq: [{ $year: "$receivedOn" }, parseInt(year)] },
          { $eq: [{ $month: "$receivedOn" }, parseInt(month)] },
        ],
      };
    }
    const transactions = await Transaction
      .find(filter)
      .populate("clientId", "name")
      .sort({ receivedOn: 1 });

    res.json({
      data: transactions,
      status: "OK",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving transactions'
    });
  }
};


exports.getTransactionStats = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    let match = {};

    if (month && year) {
      var startDate = new Date(`${year}-${month}-01`);
      var endDate = new Date(new Date(startDate).setMonth(startDate.getMonth() + 1));

      match.receivedOn = {
        $gte: startDate,
        $lt: endDate,
      };
    }
    if(req.user.userDetails.user_role === "BDM"){
      match.createdby = ObjectId(req.user.userId);
    }
    

    const stats = await Transaction.aggregate([
      {
        $match: match,
      },
      {
        $group: {
          _id: "$transactionCurrency",
          totalAmount: { $sum: "$transactionValue" },
          totalTransactions: { $sum: 1 },
        },
      },
    ]);

    const result = {
      totalAmount: {},
      totalTransactions: {},
    };

    stats.forEach((stat) => {
      const currency = stat._id;
      const amount = stat.totalAmount;
      const transactionCount = stat.totalTransactions;

      result.totalAmount[currency] = amount;
      result.totalTransactions[currency] = transactionCount;
    });

    res.json({
      data: result,
      status: "OK",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error retrieving transaction stats",
    });
  }
};

exports.getAllTransactions = async (req, res, next) => {
  const { month, year } = req.query;
  let query = {};

  if (month && year) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    query = { receivedOn: { $gte: startDate, $lte: endDate } };
  }

  try {
    const transactions = await Transaction.find(query)
      .populate('createdby', 'name')
      .populate('clientId', 'name email')
      .sort('-createdAt');
    var totalrecords = transactions.length
    res.json({ totalrecords: totalrecords, data: transactions });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

exports.toggleTransactionVerification = async (req, res, next) => {
  const transactionId = req.body.id;
  const newVerifyStatus = req.body.verified;

  try {
    // Find the transaction by ID
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      // Return 404 if transaction not found
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Update the verified property
    transaction.verified = newVerifyStatus;

    // Save the updated transaction to the database
    await transaction.save();
    // Return the updated transaction
    return res.json(transaction);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}