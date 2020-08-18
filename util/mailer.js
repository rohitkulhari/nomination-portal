const nodemailer = require('nodemailer');
const pug = require('pug');
const htmttotext = require('html-to-text');

module.exports = class Email {
  constructor(user, url, password) {
    this.from = 'electioncommission.iitk@gmail.com';
    this.to = user.email;
    this.url = url;
    this.name = user.name;
    //
  }
  createTransporter() {
    return nodemailer.createTransport({
      service: 'SendGrid',
      auth: {
        user: process.env.SENDGRID_USER,
        pass: process.env.SENDGRID_PASSWORD,
      },
      // host: process.env.EMAIL_HOST,
      // port: process.env._PORT,
      // auth: {
      //   user: process.env.EMAIL_USERNAME,
      //   pass: process.env.EMAIL_PASSWORD,
      // },
    });
  }
  async send(template, subject) {
    const html = pug.renderFile(
      `${__dirname}/../views/emails/${template}.pug`,
      {
        name: this.name,
        url: this.url,
        subject,
      }
    );

    const option = {
      from: this.from,
      to: this.to,
      subject: subject,
      text: htmttotext.fromString(html),
      html,
    };
    await this.createTransporter().sendMail(option);
  }
  async welcomemail() {
    await this.send('welcome', 'Thanx for registering');
  }
  async forgotmail() {
    await this.send('forgetpassword', 'Reset password link');
  }
};
