//importing models from schema
const User = require('../models/user');
var nodemailer = require('nodemailer');
const jwt_decode = require('jwt-decode');
//importing other installed libraries
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const config = require('../config/config');
const { body, validationResult } = require('express-validator');
const {
  wrapedSendMail,
  generateEmailTemplateWithFile,
} = require('../util/nodemailer');

exports.validatePasswordChange = [
  body('oldPassword')
    .isString()
    .notEmpty()
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({
        _id: req.decoded.userId,
      });
      var checkUser = await bcrypt.compare(value, existingUser.password);
      if (checkUser) {
        return Promise.resolve();
      }
      return Promise.reject();
    })
    .withMessage('Please enter the correct password for current account')
    .custom(async (value, { req }) => {
      const existingUser = await User.findOne({
        _id: req.decoded.userId,
      });
      var checkUser = await bcrypt.compare(
        req.body.newPassword,
        existingUser.password
      );
      if (checkUser) {
        return Promise.reject();
      }
      return Promise.resolve();
    })
    .withMessage('Please enter a new password and not the old one'),
  body('newPassword')
    .isString()
    .notEmpty()
    .custom((value, { req }) => {
      let testResNew = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$|!%*#?&])[A-Za-z\d@$|!%*#?&]{8,}$/.test(
        value
      );
      let testResCnf = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$|!%*#?&])[A-Za-z\d@$|!%*#?&]{8,}$/.test(
        req.body.confirmPassword
      );
      if (testResCnf && testResNew && req.body.confirmPassword === value) {
        return true;
      }
      return false;
    })
    .withMessage(
      'Enter a password with minimum eight characters, at least one letter, one number and one special character & Match confirm and new Password'
    ),
];

exports.post_user_login = async function (req, res, next) {
  if (req.decoded !== undefined) {
    return res.send('You are already logged in');
  }
  let { errors } = validationResult(req);
  try {
    if (errors.length > 0) {
      return res.json({
        msg: 'error',
        errors,
      });
    }
    var userdata = await User.find({ email: req.body.email });
    if (userdata.length < 1) {
      return res.status(401).json({
        msg: 'error',
      });
    }
    if (!userdata[0].is_active) {
      return res.send({
        redirect: '/login',
      });
    }
    var result = await bcrypt.compare(req.body.password, userdata[0].password);
    if (result) {
      // const user_roles = ["SuperAdmin","Admin", "Manager", "TeamLead", "Expert"]
      // const user_types = ["Freelancer", "Employee", "Client"]
      if (userdata[0].is_active == false) {
        return res.send('error');
      } else {
        const userDetails =
          userdata[0].user_type !== 'Client'
            ? userdata[0].user_type !== 'Freelancer'
              ? {
                user_role: userdata[0].employee.user_role,
                redirectURL: `${userdata[0].employee.user_role
                  .substring(0, 2)
                  .toLowerCase()}/dashboard`,
              }
              : { user_role: undefined, redirectURL: 'fr/dashboard' }
            : { user_role: undefined, redirectURL: 'cl/dashboard' };

        const token = jwt.sign(
          {
            name: userdata[0].name,
            email: userdata[0].email,
            userId: userdata[0]._id,
            user_type: userdata[0].user_type,
            user_device: userdata[0].user_device,
            userDetails,
            redirectURL: userDetails.redirectURL,
          },
          config.secret,
          {
            expiresIn: '9h',
          }
        );
        res.cookie('auth', token);
        return res.send({ token: token, redirectURL: userDetails.redirectURL });
      }
    }
    return res.status(401).json({
      msg: 'error',
    });
  } catch (error) {
    res.send(error);
  }
};

exports.get_user_login = (req, res, next) => {
  console.log(req.redirectUrl)
  if (req.decoded !== undefined) {
    res.redirect(req.decoded.redirectURL);
  }
  res.render('auth/login', {
    pageTitle: 'Squalo | User Login',
  });
};

exports.get_user_token = (req, res, next) => {
  let token = null;
  if (req.headers.authorization) {
    token = req.headers.authorization.split('Bearer ')[1];
  }
  if (req.cookies.auth) {
    token = req.cookies.auth;
  }
  res.json({
    user: { ...req.decoded, token },
  });
};

exports.get_user_logout = (req, res, next) => {
  if (req.decoded !== undefined) {
    return res.redirect(req.decoded.redirectURL);
  }
  res.render('auth/logout', {
    pageTitle: 'Squalo | User Logout',
  });
};

//user logout module
exports.post_user_logout = function (req, res, next) {
  res.clearCookie('auth');
  res.send('/logout');
  // res.redirect("/logout")
};

exports.put_change_user_password = async function (req, res, next) {
  try {
    const { errors } = validationResult(req);
    if (errors.length) {
      return res.status(400).json({
        error: errors[0].msg,
      });
    }
    const { newPassword } = req.body;
    var encryptedpass = await bcrypt.hash(newPassword, 10);
    const updateUserPassord = await User.updateOne(
      {
        _id: req.decoded.userId,
      },
      {
        $set: {
          password: encryptedpass,
          originalpass: newPassword,
        },
      }
    );
    if (updateUserPassord.nModified !== 1 || updateUserPassord.ok !== 1) {
      return res.status(400).json({
        error: 'There was an error modifying password for your account',
      });
    }
    res.json({
      status: 'OK',
      msg: 'Changed the user passord successfully',
    });
  } catch (error) {
    res.send(error);
  }
};

exports.post_password_recover = async (req, res, next) => {
  try {
    var userdata = await User.find({ email: req.body.email });
    if (userdata.length < 1) {
      return res.status(401).json({
        msg: 'Invalid Email Address',
      });
    }
    const token = jwt.sign(
      {
        email: userdata[0].email,
        userId: userdata[0]._id,
      },
      config.secret,
      {
        expiresIn: '1h',
      }
    );
    var mailstring =
      'http://thesqualo.com/recover?passwordtoken=' + token;
    var html = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">

    <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
    <head>
    <!--[if gte mso 9]><xml><o:OfficeDocumentSettings><o:AllowPNG/><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml><![endif]-->
    <meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
    <meta content="width=device-width" name="viewport"/>
    <!--[if !mso]><!-->
    <meta content="IE=edge" http-equiv="X-UA-Compatible"/>
    <!--<![endif]-->
    <title></title>
    <!--[if !mso]><!-->
    <link href="https://fonts.googleapis.com/css?family=Ubuntu" rel="stylesheet" type="text/css"/>
    <!--<![endif]-->
    <style type="text/css">
        body {
          margin: 0;
          padding: 0;
        }
    
        table,
        td,
        tr {
          vertical-align: top;
          border-collapse: collapse;
        }
    
        * {
          line-height: inherit;
        }
    
        a[x-apple-data-detectors=true] {
          color: inherit !important;
          text-decoration: none !important;
        }
      </style>
    <style id="media-query" type="text/css">
        @media (max-width: 520px) {
    
          .block-grid,
          .col {
            min-width: 320px !important;
            max-width: 100% !important;
            display: block !important;
          }
    
          .block-grid {
            width: 100% !important;
          }
    
          .col {
            width: 100% !important;
          }
    
          .col>div {
            margin: 0 auto;
          }
    
          img.fullwidth,
          img.fullwidthOnMobile {
            max-width: 100% !important;
          }
    
          .no-stack .col {
            min-width: 0 !important;
            display: table-cell !important;
          }
    
          .no-stack.two-up .col {
            width: 50% !important;
          }
    
          .no-stack .col.num2 {
            width: 16.6% !important;
          }
    
          .no-stack .col.num3 {
            width: 25% !important;
          }
    
          .no-stack .col.num4 {
            width: 33% !important;
          }
    
          .no-stack .col.num5 {
            width: 41.6% !important;
          }
    
          .no-stack .col.num6 {
            width: 50% !important;
          }
    
          .no-stack .col.num7 {
            width: 58.3% !important;
          }
    
          .no-stack .col.num8 {
            width: 66.6% !important;
          }
    
          .no-stack .col.num9 {
            width: 75% !important;
          }
    
          .no-stack .col.num10 {
            width: 83.3% !important;
          }
    
          .video-block {
            max-width: none !important;
          }
    
          .mobile_hide {
            min-height: 0px;
            max-height: 0px;
            max-width: 0px;
            display: none;
            overflow: hidden;
            font-size: 0px;
          }
    
          .desktop_hide {
            display: block !important;
            max-height: none !important;
          }
        }
      </style>
    </head>
    <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #FFFFFF;">
    <!--[if IE]><div class="ie-browser"><![endif]-->
    <table bgcolor="#FFFFFF" cellpadding="0" cellspacing="0" class="nl-container" role="presentation" style="table-layout: fixed; vertical-align: top; min-width: 320px; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #FFFFFF; width: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td style="word-break: break-word; vertical-align: top;" valign="top">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color:#FFFFFF"><![endif]-->
    <div style="background-color:transparent;overflow:hidden">
    <div class="block-grid" style="min-width: 320px; max-width: 500px; overflow-wrap: break-word; word-wrap: break-word; word-break: break-word; Margin: 0 auto; width: 100%; background-color: transparent;">
    <div style="border-collapse: collapse;display: table;width: 100%;background-color:transparent;">
    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:transparent;"><tr><td align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px"><tr class="layout-full-width" style="background-color:transparent"><![endif]-->
    <!--[if (mso)|(IE)]><td align="center" width="500" style="background-color:transparent;width:500px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px;"><![endif]-->
    <div class="col num12" style="min-width: 320px; max-width: 500px; display: table-cell; vertical-align: top; width: 500px;">
    <div style="width:100% !important;">
    <!--[if (!mso)&(!IE)]><!-->
    <div style="border-top:0px solid transparent; border-left:0px solid transparent; border-bottom:0px solid transparent; border-right:0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;">
    <!--<![endif]-->
    
    <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <div style="line-height: 1.2; font-size: 12px; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 14px;">
    <p style="font-size: 24px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 29px; margin: 0;"><span style="font-size: 24px;"><strong>Forgot your password?</strong></span></p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <div style="line-height: 1.2; font-size: 12px; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 14px;">
    <p style="font-size: 15px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 18px; margin: 0;"><span style="font-size: 15px;">No worries - it happens</span></p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <div style="line-height: 1.2; font-size: 12px; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 14px;">
    <p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">Just click on the button below to choose a new one. It's that easy!</p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <div align="center" class="button-container" style="padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-spacing: 0; border-collapse: collapse; mso-table-lspace:0pt; mso-table-rspace:0pt;"><tr><td style="padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px" align="center"><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href=${mailstring} style="height:31.5pt; width:354pt; v-text-anchor:middle;" arcsize="10%" stroke="false" fillcolor="#2c90c9"><w:anchorlock/><v:textbox inset="0,0,0,0"><center style="color:#ffffff; font-family:Arial, sans-serif; font-size:16px"><![endif]--><a href=${mailstring} style="-webkit-text-size-adjust: none; text-decoration: none; display: block; color: #ffffff; background-color: #2c90c9; border-radius: 4px; -webkit-border-radius: 4px; -moz-border-radius: 4px; width: 90%; width: calc(90% - 2px); border-top: 1px solid #2c90c9; border-right: 1px solid #2c90c9; border-bottom: 1px solid #2c90c9; border-left: 1px solid #2c90c9; padding-top: 5px; padding-bottom: 5px; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; text-align: center; mso-border-alt: none; word-break: keep-all;" target="_blank"><span style="padding-left:20px;padding-right:20px;font-size:16px;display:inline-block;"><span style="font-size: 16px; line-height: 2; word-break: break-word; mso-line-height-alt: 32px;">Reset Password</span></span></a>
    <!--[if mso]></center></v:textbox></v:roundrect></td></tr></table><![endif]-->
    </div>
    <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
    <p style="font-size: 12px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 14px; margin: 0;"><span style="font-size: 12px;"><span style="color: #808080;">Copyright © 2019-2020 All rights reserved. This email was sent by Squalo Solutions pvt. ltd. 2/670, malviya nagar, jaipur, Rajasthan, India.</span>  </span></p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <table border="0" cellpadding="0" cellspacing="0" class="divider" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td class="divider_inner" style="word-break: break-word; vertical-align: top; min-width: 100%; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; padding-top: 10px; padding-right: 10px; padding-bottom: 10px; padding-left: 10px;" valign="top">
    <table align="center" border="0" cellpadding="0" cellspacing="0" class="divider_content" height="0" role="presentation" style="table-layout: fixed; vertical-align: top; border-spacing: 0; border-collapse: collapse; mso-table-lspace: 0pt; mso-table-rspace: 0pt; border-top: 0px solid transparent; height: 0px; width: 100%;" valign="top" width="100%">
    <tbody>
    <tr style="vertical-align: top;" valign="top">
    <td height="0" style="word-break: break-word; vertical-align: top; -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;" valign="top"><span></span></td>
    </tr>
    </tbody>
    </table>
    </td>
    </tr>
    </tbody>
    </table>
    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Arial, sans-serif"><![endif]-->
    <div style="color:#555555;font-family:Arial, Helvetica Neue, Helvetica, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
    <div style="line-height: 1.2; font-size: 12px; color: #555555; font-family: Arial, Helvetica Neue, Helvetica, sans-serif; mso-line-height-alt: 14px;">
    <p style="font-size: 14px; line-height: 1.2; word-break: break-word; text-align: center; mso-line-height-alt: 17px; margin: 0;"><a href="google" rel="noopener" style="text-decoration: underline; color: #0068A5;" target="_blank">Privacy policy</a> | <a href="google.com" rel="noopener" style="text-decoration: underline; color: #0068A5;" target="_blank">Terms &amp; Conditions</a></p>
    </div>
    </div>
    <!--[if mso]></td></tr></table><![endif]-->
    <!--[if (!mso)&(!IE)]><!-->
    </div>
    <!--<![endif]-->
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->
    </div>
    </div>
    </div>
    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
    </td>
    </tr>
    </tbody>
    </table>
    <!--[if (IE)]></div><![endif]-->
    </body>
    </html>
    `;

    var mailOptions = {
      from: 'squalosolutions@gmail.com',
      to: req.body.email,
      subject: `Reset your password`,
      html: html,
    };
    
    var response = await wrapedSendMail(mailOptions);
    if (!response) {
      throw 'Not able send mail';
    }
    console.log(response)
    res.send('Email Sent');
  } catch (error) {
    res.send(error);
  }
};

exports.post_password_recover_link = async (req, res, next) => {
  try {
    const decode = jwt.verify(req.query.passwordtoken, config.secret);
    if (decode) {
      var newpassword = req.body.newpassword;
      var decryptedpass = await bcrypt.hash(newpassword, 10);
      try {
        var updateclient = await User.findByIdAndUpdate(decode.userId, {
          $set: { password: decryptedpass, originalpass: newpassword },
        });
        res.send('updated');
      } catch (e) {
        console.log(e);
      }
    }
  } catch (e) {
    res.send(error);
  }
};

exports.get_password_recover = async (req, res, next) => {
  try {
    const decode = jwt.verify(req.query.passwordtoken, config.secret);
    if (decode) {
      res.render('auth/reset', {
        pageTitle: 'Squalo | Change Password',
      });
    } else {
      res.render('auth/logout', {
        pageTitle: 'Squalo | Token Expired',
      });
    }
  } catch (e) {
    res.render('auth/logout', {
      pageTitle: 'Squalo | Token Expired',
    });
  }
};
