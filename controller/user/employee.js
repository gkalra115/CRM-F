//importing models from schema
const User = require('../../models/user');
const AccUser = require('../../models/userAccountInfo');
const Task = require('../../models/task');

//importing other installed libraries
const bcrypt = require('bcrypt');
var generator = require('generate-password');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const nodemailer = require('../../util/nodemailer');

const ObjectId = mongoose.Types.ObjectId;
const Notification = require('../../models/notification');

const { matchReqNSendNotification } = require('../../util/socket-io');

const sendNotificationForEmployee = async (type, payload, req) => {
  let actionEffectsToIds = await User.find({
    user_type: 'Employee',
    'employee.user_role': { $in: ['SuperAdmin', 'Admin'] },
  }).select('_id');
  actionEffectsToIds = actionEffectsToIds.filter(function (obj) {
    return String(obj._id) !== String(req.decoded.userId);
  });
  switch (type) {
    case 'taskEmployeeCreate':
      {
        let title = `${req.body.name} employee created.`;
        let subTitle = `by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: 'User',
          actionTakenById: req.decoded.userId,
          resourceId: payload,
          typeof: 'Client Create',
          actionEffectsToId: actionEffectsToIds,
          title: title,
          subTitle: subTitle,
          action: '/su/employees/' + payload,
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) {
          return String(el._id);
        });
        await NotificationCreate.save();
        matchReqNSendNotification(
          actionEffectsToIds,
          { title, subTitle },
          'taskEmployeeCreate'
        );
      }
      break;
    case 'taskEmployeeEdit':
      {
        let title = `${req.body.name} employee edited.`;
        let subTitle = `by ${req.decoded.email}`;
        const NotificationCreate = new Notification({
          resource: 'User',
          actionTakenById: req.decoded.userId,
          resourceId: req.params.id,
          typeof: 'Client Edit',
          actionEffectsToId: actionEffectsToIds,
          title: title,
          subTitle: subTitle,
          action: '/su/employees/' + payload,
        });
        actionEffectsToIds = actionEffectsToIds.map(function (el) {
          return String(el._id);
        });
        await NotificationCreate.save();
        matchReqNSendNotification(
          actionEffectsToIds,
          { title, subTitle },
          'taskEmployeeEdit'
        );
      }
      break;

    default:
      break;
  }
};
//create employee
exports.post_create_employee = async (req, res, next) => {
  const { errors } = validationResult(req);
  if (errors.length > 0) {
    return res.status(400).json({
      msg: 'error',
      errors,
    });
  }
  var password = await generator.generate({
    length: 10,
    numbers: true,
  });
  var decryptedpass = await bcrypt.hash(password, 10);
  const employee = new User({
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
    user_type: 'Employee',
    is_active: req.body.is_active,
    password: decryptedpass,
    originalpass: password,
    employee: {
      salary: req.body.salary,
      joiningDate: req.body.joiningDate,
      user_role: req.body.user_role,
    },
    assignedTo: req.decoded.userId,
    createdby: req.decoded.userId,
  });

  let name = req.body.name;
  let email = req.body.email;

  let html = `
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
  <div align="center" class="img-container center fixedwidth" style="padding-right: 0px;padding-left: 0px;">
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="padding-right: 0px;padding-left: 0px;" align="center"><![endif]--><img align="center" alt="Alternate text" border="0" class="center fixedwidth" src="https://zmyrnpacflqa.nyc3.digitaloceanspaces.com/mailer/requin-logo-3.png" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 250px; display: block;" title="Alternate text" width="250"/>
  <!--[if mso]></td></tr></table><![endif]-->
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
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
  <div style="color:#555555;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
  <div style="line-height: 1.2; font-size: 12px; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 14px;">
  <p style="text-align: center; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; font-size: 18px; mso-line-height-alt: 22px; margin: 0;"><span style="font-size: 18px; color: #000000;">Welcome ${name} !!</span></p>
  </div>
  </div>
  <!--[if mso]></td></tr></table><![endif]-->
  <div align="center" class="img-container center autowidth">
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr style="line-height:0px"><td style="" align="center"><![endif]--><img align="center" border="0" class="center autowidth" src="https://zmyrnpacflqa.nyc3.digitaloceanspaces.com/mailer/welcome.gif" style="text-decoration: none; -ms-interpolation-mode: bicubic; height: auto; border: 0; width: 100%; max-width: 286px; display: block;" width="286"/>
  <!--[if mso]></td></tr></table><![endif]-->
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
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
  <div style="color:#555555;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
  <div style="line-height: 1.2; font-size: 12px; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 14px;">
  <p style="font-size: 15px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 18px; margin: 0;"><span style="font-size: 15px;">This email includes your account information. Please keep it safe !</span></p>
  </div>
  </div>
  <!--[if mso]></td></tr></table><![endif]-->
  <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px; font-family: Tahoma, Verdana, sans-serif"><![endif]-->
  <div style="color:#555555;font-family:'Ubuntu', Tahoma, Verdana, Segoe, sans-serif;line-height:1.2;padding-top:10px;padding-right:10px;padding-bottom:10px;padding-left:10px;">
  <div style="line-height: 1.2; font-size: 12px; font-family: 'Ubuntu', Tahoma, Verdana, Segoe, sans-serif; color: #555555; mso-line-height-alt: 14px;">
  <p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">Account url: <a href="https://app.squalo.in/" rel="noopener" style="text-decoration: underline; color: #0068A5;" target="_blank">Squalo tool</a></p>
  <p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">Email: ${email}</p>
  <p style="font-size: 14px; line-height: 1.2; font-family: Ubuntu, Tahoma, Verdana, Segoe, sans-serif; word-break: break-word; mso-line-height-alt: 17px; margin: 0;">Password: ${password}</p>
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

  let mailOptions = {
    from: 'squalosolutions@gmail.com',
    to: req.body.email,
    subject: 'Welcome Email',
    html: html,
  };

  try {
    nodemailer.wrapedSendMail(mailOptions);
    var employeesaved = await employee.save();
    res.status(201).send({
      status: 'created',
      data: employeesaved,
    });
    await sendNotificationForEmployee(
      'taskEmployeeCreate',
      employeesaved._id,
      req
    );
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view all employee
exports.get_employee_all = async (req, res, next) => {
  try {
      const { type } = req.query;
    let empTypeFilter = {};
    if (!!type) {
      empTypeFilter = { 'employee.user_role': type };
    }
    const allemployee = await User.aggregate([
      {
        $match: {
          ...empTypeFilter,
          user_type: 'Employee',
          _id: { $ne: req.decoded.userId },
          is_active: true
        },
      },
      {
        $project: {
          _id: 1,
          is_active: {
            $cond: {
              if: {
                $eq: ['$is_active', true],
              },
              then: 'Active',
              else: 'Deleted',
            },
          },
          email: 1,
          name: 1,
          phone: 1,
          user_type: 1,
          user_role: {
            $cond: {
              if: {
                $eq: ['$employee.user_role', 'SuperAdmin'],
              },
              then: 'Super',
              else: '$employee.user_role',
            },
          },
          employee: 1,
          assignedTo: 1,
        },
      },
    ]);
 
   
    
    // var allemployee = await User.find(
    //   { user_type: { $eq: 'Employee' }, _id: { $ne: req.decoded.userId } },
    //   {
    //     _id: 1,
    //     is_active: 1,
    //     email: 1,
    //     name: 1,
    //     phone: 1,
    //     user_type: 1,
    //     employee: '$employee.user_role',
    //     assignedTo: 1,
    //   }
    // );
    res.status(200).send({
      status: 'OK',
      data: allemployee,
      totalCount: allemployee.length,
    });
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//view single employee details
exports.get_employee_single = async (req, res, next) => {
  try {
    var singleemployee = await User.findById(req.params.id);
    var emplaccountinfo = await AccUser.find({"userId":req.params.id})
    data = {empinfo:singleemployee, accountinfo: emplaccountinfo}
    console.log(data)
    res.status(200).send(data);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//update employee details
exports.put_employee_update = async (req, res, next) => {
  try {
    const { errors } = validationResult(req);
    if (errors.length > 0) {
      return res.json({
        msg: 'error',
        errors,
      });
    }
    var updateemployee = await User.findByIdAndUpdate(
      req.params.id,
      {
        email: req.body.email,
        name: req.body.name,
        phone: req.body.phone,
        user_type: 'Employee',
        is_active: req.body.is_active === 'true',
        employee: {
          salary: req.body.salary,
          joiningDate: req.body.joiningDate,
          user_role: req.body.user_role,
          endDate: req.body.endDate,
        },
      },
      { new: true }
    );
    await sendNotificationForEmployee('taskEmployeeEdit', null, req);
    res.status(200).send(updateemployee);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

exports.get_employee_tree = async (req, res, next) => {
  var user_id = req.query.parent;
  const user = await User.aggregate([
    { $match: { _id: ObjectId(user_id) } },
    {
      $lookup: {
        from: 'users',
        localField: '_id',
        foreignField: 'assignedTo',
        as: 'team',
      },
    },
    { $unwind: '$team' },
    {
      $project: {
        _id: 0,
        id: '$team._id',
        // "icon" : "fa fa-user icon-lg kt-font-success",
        icon: {
          $switch: {
            branches: [
              {
                case: { $eq: ['$team.employee.user_role', 'SuperAdmin'] },
                then: 'fa fa-user icon-lg',
              },
              {
                case: { $eq: ['$team.employee.user_role', 'Admin'] },
                then: 'fa fa-user icon-lg kt-font-danger',
              },
              {
                case: { $eq: ['$team.employee.user_role', 'Manager'] },
                then: 'fa fa-user icon-lg kt-font-warning',
              },
              {
                case: { $eq: ['$team.employee.user_role', 'TeamLead'] },
                then: 'fa fa-user icon-lg kt-font-success',
              },
            ],
            default: 'fa fa-user icon-lg kt-font-brand',
          },
        },
        text: {
          $concat: ['$team.name', ' [', '$team.employee.user_role', ']'],
        },
        // "children" : {$toBool: ""},
        children: {
          $cond: {
            if: { $eq: ['$team.employee.user_role', 'Expert'] },
            then: false,
            else: true,
          },
        },
        user_type: '$team.user_type',
        is_active: '$team.is_active',
      },
    },
    { $match: { user_type: 'Employee', is_active: true } },
  ]);
  //  const result = await User.populate(user, {path: 'team.assignedTo'})
  res.send(user);
};

exports.get_employee_getTeam = async (req, res, next) => {
  try {
    const userTeam = await User.aggregate([
      { $match: { _id: ObjectId(req.decoded.userId), is_active: true } },
      {
        $graphLookup: {
          from: 'users',
          startWith: '$_id',
          connectFromField: '_id',
          connectToField: 'assignedTo',
          as: 'team',
        },
      },
      { $unwind: '$team' },
      { $match: { 'team.user_type': 'Employee', 'team.is_active': true } },
      {
        $project: {
          _id: 0,
          id: '$team._id',
          name: '$team.name',
          role: '$team.employee.user_role',
          parent: '$team.assignedTo',
        },
      },
    ]);
    await User.populate(userTeam, {
      select: 'name employee.user_role',
      path: 'parent',
    });
    res.send(userTeam);
  } catch (error) {
    next(error);
  }
};

exports.post_employee_assignTo = async (req, res, next) => {
  try {
    const userRoleChange = {
      Admin: 'SuperAdmin',
      Manager: 'Admin',
      TeamLead: 'Manager',
      Expert: 'TeamLead',
    };
    const user = await User.findById(req.body.id, {
      name: 1,
      email: 1,
      'employee.user_role': 1,
    }).populate({ path: 'assignedTo' });
    const getAboveHierarchy = await User.find(
      {
        'employee.user_role': userRoleChange[user.employee.user_role],
        _id: { $ne: user.assignedTo._id },
      },
      {
        name: 1,
        email: 1,
        'employee.user_role': 1,
      }
    );
    res.send({
      user,
      getAboveHierarchy,
    });
  } catch (error) {
    next(error);
  }
};

exports.get_employee_assignTo = async (req, res, next) => {
  const userRoleChange = {
    Admin: 'SuperAdmin',
    Manager: 'Admin',
    TeamLead: 'Manager',
    Expert: 'TeamLead',
  };
  try {
    const { role, id } = req.query;
    const user = await User.find(
      {
        _id: { $ne: id },
        user_type: 'Employee',
        'employee.user_role': userRoleChange[role],
      },
      {
        name: 1,
        employee: 1,
        email: 1,
      }
    );
    res.send({
      user,
    });
  } catch (error) {
    next(error);
  }
};

exports.put_employee_assignTo = async (req, res, next) => {
  const { userId, assignToId, assignNewRole } = req.body;
  let params = { assignedTo: assignToId };
  if (assignNewRole !== undefined && assignNewRole !== '') {
    const newRoleUserCheck = await User.find({
      assignedTo: userId,
      user_type: 'Employee',
    }).count();
    if (newRoleUserCheck > 0) {
      return res.send({
        msg: 'Need to remove the users from Hierarchy.',
      });
    }
    params = Object.assign(params, {
      $set: { 'employee.user_role': assignNewRole },
    });
  }
  // next()
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, params);
    res.send({
      result: 'OK',
      msg: 'User reassigned Successfully',
    });
  } catch (error) {
    next(error);
  }
};

//hard delete employee
exports.delete_employee_hard = async (req, res, next) => {
  try {
    var deleteuser = await User.findByIdAndRemove(req.params.id);
    res.status(200).send('User Deleted permanently');
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

//soft delete employee
exports.delete_employee_soft = async (req, res, next) => {
  try {
    var deleteuser = await User.findByIdAndUpdate(
      req.params.id,
      {
        is_active: false,
      },
      { new: true }
    );
    res.status(200).send(deleteuser);
  } catch (e) {
    res.status(400).send({ error: e.errmsg });
  }
};

exports.get_employee_getTestData = async (req, res, next) => {
  const alltask = await Task.aggregate([
    {
      $lookup: {
        from: 'comms',
        localField: '_id',
        foreignField: 'taskid',
        as: 'taskCommRel',
      },
    },
    { $unwind: '$taskCommRel' },
    {
      $project: {
        _id: 1,
        assignedto: 1,
        title: 1,
        wordcount: 1,
        soft_deadline: 1,
        hard_deadline: 1,
        client: 1,
        description: 1,
        createdby: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
        deleted: 1,
        taskcomm: '$taskCommRel._id',
      },
    },
  ]);
  res.json(alltask);
};
