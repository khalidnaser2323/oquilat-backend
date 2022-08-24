const _ = require("lodash");
const BaseService = require("../BaseService");
const nodemailer = require("nodemailer");
const inlineBase64 = require('nodemailer-plugin-inline-base64');

const transporter = nodemailer.createTransport({
  // TODO: need to be reviseted
  service: "Gmail",
  auth: {
    user: "ninjasolutions2020@gmail.com",
    pass: "0126517426",
  },
});

class EmailService extends BaseService {
  async send(
    userData,
    to = '',
    subject = "",
    message = "",
    html = "",
    attachments = [],
    list = {}
  ) {
    // to = to.join(", ") || "";
    const mailOptions = {
      from: '"‪Ninja Solutions‬‏" <ninjasolutions2020@gmail.com>',
      to,
      subject: String(subject),
      text: message,
      html,
      attachments,
      list,
    };
    transporter.use('compile', inlineBase64({cidPrefix: 'somePrefix_'}));
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("sendmail" + error);
        // return error.message;
      } else {
        console.log("Email sent: " + info.response);
        transporter.close();
      }
    });
  }
}

module.exports = new EmailService();
