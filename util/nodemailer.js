var nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const wrapedSendMail = async (mailOptions) => {
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, function (error, info) {
      
      if (error) {
        resolve(false); // or use rejcet(false) but then you will have to handle errors
      } else {
        resolve(true);
      }
    });
  });
};

const generateEmailTemplateWithFile = (files) => {
  let newfiles = files.data.map((file) => {
    return `<tr><td height="20" style="font-size:0px" >&nbsp;</td></tr><tr ><td><table class="full" align="center" border="0" cellpadding="0" cellspacing="0"><tr><td><table style="background: #f5f5f5; border-radius: 4px;" width="510" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0"><tr><td><table class="full" align="center" border="0" cellpadding="0" cellspacing="0"><tr><td height="16" style="font-size:0px" >&nbsp;</td></tr><tr ><td class="res-left" style="text-align: left; color: #707070; font-family: 'Nunito', Arial, Sans-serif; font-size: 15px; letter-spacing: 0.7px; word-break: break-word; font-weight: 600; line-height: 14px; padding-left: 13px;" >${file.files}</td></tr><tr><td height="3" style="font-size:0px" >&nbsp;</td></tr><tr ><td class="res-left" style="text-align: left; color: #F5F5F5; font-family: 'Nunito', Arial, Sans-serif; font-size: 16px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word; padding-right: 10px; padding-left: 13px; pointer-events:none;user-select: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;" > Nullam consectetur ultrices diam at iaculis enim</td></tr><tr><td height="16" style="font-size:0px" >&nbsp;</td></tr></table></td></tr></table><table width="1" align="right" class="res-full" border="0" cellpadding="0" cellspacing="0"><tr><td height="20" style="font-size:0px">&nbsp;</td></tr></table><table width="80" align="left" class="res-full" border="0" cellpadding="0" cellspacing="0"><tr ><td><table align="left" style="border: 2px solid #e6a049; padding: 26px; border-radius: 3px;" class="res-full" border="0" cellpadding="0" cellspacing="0"><tr><td><table align="center" border="0" cellpadding="0" cellspacing="0"><tr><td> <a href="${file.uploadpath}"> <img width="20" style="max-width: 20px; width: 100%; display: block; line-height: 0px; font-size: 0px; border: 0px;" src="http://app.squalo.in/assets/media/files/dowload.png"> </a></td></tr></table></td></tr></table></td></tr></table></td></tr></table></td></tr> `;
  });
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge" /><!--<![endif]--><meta name="viewport" content="width=device-width, initial-scale=1.0" /><meta name="x-apple-disable-message-reformatting"><style type="text/css">@import url(https://fonts.googleapis.com/css?family=Nunito:200,300,400,600,700,800,900|Raleway:200,300,400,500,600,700,800,900);html{width:100%}body{-webkit-text-size-adjust:none;-ms-text-size-adjust:none;margin:0;padding:0;font-family:'Open Sans',Arial,Sans-serif!important}table{border-spacing:0;table-layout:auto;margin:0 auto}img{display:block!important;overflow:hidden!important}a{text-decoration:none;color:unset}.ReadMsgBody{width:100%;background-color:#fff}.ExternalClass{width:100%;background-color:#fff}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div{line-height:100%}.yshortcuts a{border-bottom:none!important}.full{width:100%}.pad{width:92%}@media only screen and (max-width: 650px){.res-pad{width:92%;max-width:92%}.res-full{width:100%;max-width:100%}.res-left{text-align:left!important}.res-right{text-align:right!important}.res-center{text-align:center!important}}@media only screen and (max-width: 750px){.margin-full{width:100%;max-width:100%}.margin-pad{width:92%;max-width:92%;max-width:600px}}</style></head><body><table bgcolor="#f5f5f5" align="center" class="full" border="0" cellpadding="0" cellspacing="0"><tr><td><table bgcolor="white" width="750" align="center" class="margin-full" border="0" cellpadding="0" cellspacing="0"><tr><td><table width="600" align="center" class="margin-pad" border="0" cellpadding="0" cellspacing="0"><tr><td height="35" style="font-size:0px" >&nbsp;</td></tr><tr ><td class="res-center" style="text-align: center; color: #707070; font-family: 'Nunito', Arial, Sans-serif; font-size: 14px; letter-spacing: 0.7px; word-break: break-word; font-weight: 600;" > ${files.name}</td></tr><tr><td height="7" style="font-size:0px" >&nbsp;</td></tr><tr ><td class="res-center" style="text-align: center; color: #505050; font-family: 'Raleway', Arial, Sans-serif; font-size: 22px; letter-spacing: 0.7px; word-break: break-word" >Task -  ${files.title}</td></tr><tr><td height="13" style="font-size:0px" >&nbsp;</td></tr><tr ><td><table align="center" class="res-full" border="0" cellpadding="0" cellspacing="0"><tr><td><table bgcolor="#ff636d" align="center" style="border-radius: 10px;" border="0" cellpadding="0" cellspacing="0"><tr><td width="50" height="3" style="font-size:0px" >&nbsp;</td></table></td></tr></table></td></tr><tr><td height="25" style="font-size:0px" >&nbsp;</td></tr><tr ><td class="res-center" style="text-align: center; color: #707070; font-family: 'Nunito', Arial, Sans-serif; font-size: 17px; letter-spacing: 0.4px; line-height: 23px; word-break: break-word" > Please find all the files with links below. For any further queries of contact us. We'll be happy to help you out.</td></tr> ${newfiles}<tr><td height="70" style="font-size:0px" >&nbsp;</td></tr></table></td></tr></table></td></tr></table></body></html>`;
};
module.exports = {
  wrapedSendMail,
  generateEmailTemplateWithFile,
};

