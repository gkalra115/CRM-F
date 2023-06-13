const UserAccountInfo = require('../models/userAccountInfo');

exports.post_user_accountInfo = async (req, res, next) => {
  try {
    const userAccountInfo = await UserAccountInfo.findOne({
      userId: req.decoded.userId,
    });
    if (!!userAccountInfo) {
      const { accountNumber, ifsc, accountHolder, bank } = req.body;
      const updatedAccountInfo = await UserAccountInfo.findOneAndUpdate(
        { userId: req.decoded.userId },
        {
          accountNumber: accountNumber,
          IFSC: ifsc,
          accountHolder: accountHolder,
          bank: bank,
        },
        { new: true }
      );
      return res.status(200).json({
        message: 'Account Info update Successfully',
        updatedAccountInfo,
      });
    } else {
      const { accountNumber, ifsc, accountHolder, bank } = req.body;
      const userAccountInfo = new UserAccountInfo({
        accountNumber: accountNumber,
        IFSC: ifsc,
        accountHolder: accountHolder,
        bank: bank,
        userId: req.decoded.userId,
      });
      const createdAccountInfo = await userAccountInfo.save();

      res.status(201).json(createdAccountInfo);
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

exports.get_user_accountInfo = async (req, res, next) => {
  try {
    const userAccountInfo = await UserAccountInfo.find({
      userId: req.decoded.userId,
    });
    res.status(200).json(userAccountInfo);
  } catch (error) {
    next(error);
  }
};

exports.put_user_accountInfo = async (req, res, next) => {
  try {
    const { accountNumber, ifsc, accountHolder, bank } = req.body;
    console.log(req.params.id, req.body);
    const updatedAccountInfo = await UserAccountInfo.findOneAndUpdate(
      { userId: req.params.id },
      {
        accountNumber: accountNumber,
        IFSC: ifsc,
        accountHolder: accountHolder,
        bank: bank,
      },
      { new: true }
    );
    res.status(200).json({
      message: 'Account Info update Successfully',
      updatedAccountInfo,
    });
  } catch (error) {
    next(error);
  }
};

exports.delete_user_accountInfo = async (req, res, next) => {
  try {
    const deletedAccountInfo = await UserAccountInfo.findOneAndDelete({
      userId: req.params.id,
    });
    res.status(200).json({
      msg: 'User Account Info Deleted Permanently',
      deletedAccountInfo,
    });
  } catch (error) {
    next(error);
  }
};
