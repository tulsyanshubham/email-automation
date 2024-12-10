require('dotenv').config();

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 5000;
const mailpsw = process.env.MAILPSW;
const mailid = process.env.MAILID;
const service_psw = process.env.SERVICE_PSW;

app.use(bodyParser.json());
app.use(cors())

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: mailid,
        pass: mailpsw
    }
});

const mailsend = (mail, service_name, otp) => {
    const mailOptions = {
        from: mailid,
        to: mail,
        subject: `Sending OTP for ${service_name}`,
        html: `<div style="position: inherit; padding: 20px; margin: 20px auto; width: 80%; max-width: 600px; border-radius: 10px; box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1); border: 1px solid #fbfbfb;">
        <div style="text-align: center; padding-bottom: 0px;">
            <h1>Welcome to <div style="color: purple">${service_name}!</div></h1>
          	<h3>Your OTP is:</h3>
          	<h1 style="color: purple">${otp}</h1>
            <h5>Thank you for registering on our site. We're excited to have you with us.</h5>
        </div>
    </div>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

app.get('/', async (req, res) => {
    res.send(`Backend running on PORT: ${port}<br>
        Endpoint: /sendmail<br>
        Body:<br>
        {<br>
            "psw": "password",<br>
            "mail": "receiver's mail",<br>
            "service_name": "service name",<br>
            "otp": "otp"<br>
        }`)
})

app.post('/sendmail', async (req, res) => {
    const { psw, mail, service_name, otp } = req.body;
    if (psw !== service_psw) {
        res.status(401).send('Unauthorized Access! Incorrect Password');
        return;
    }
    try {
        mailsend(mail, service_name, otp);
        res.status(200).send({
            success: true,
            message: 'Mail sent successfully'
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: 'Error sending mail'
        });
    }
})

app.listen(port, () => {
    console.log(`Backend listening on port ${port}`)
})