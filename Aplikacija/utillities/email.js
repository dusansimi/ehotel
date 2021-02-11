const nodemailer = require('nodemailer');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = 'Administracija E-hotel <ehotel333@gmail.com>';
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendWelcome() {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Dobrodosli na E-hotel portal',
      text: 'Uspesno ste se registrovali na E-hotel portal!'
    };

    await this.newTransport().sendMail(mailOptions);
  }

  async sendReset() {
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Resetovanje lozinke E-hotel',
      text: `Kliknite na link u nastavku kako bi resetovali vasu lozinku, link za resetovanje ce vaziti u narednih 10 minuta od slanja ovog mejla \n ${this.url}`
    };

    await this.newTransport().sendMail(mailOptions);
  }
};
