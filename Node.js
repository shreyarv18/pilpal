const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cron = require('node-cron');
const app = express();
const port = 5000;

app.use(bodyParser.json());


const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com',
    pass: 'your-email-password'
  }
});


app.post('/send-email', (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send('Error sending email');
    }
    console.log('Email sent: ' + info.response);
    res.status(200).send('Email sent successfully');
  });
});


cron.schedule('* * * * *', () => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: 'recipient-email@example.com',
    subject: 'Scheduled Email',
    text: 'This is an automated email sent every minute.'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Scheduled email sent: ' + info.response);
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Node.js server is running on http://0.0.0.0:${port}`);
});
