require('dotenv').config();  // Make sure to load environment variables from .env

const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the HTML file for the form
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission and send email
app.post('/submit', (req, res) => {
    const { name, email, message } = req.body;

    // Create a transporter for Nodemailer
    const transporter = nodemailer.createTransport({
        service: 'gmail',  // Gmail service (use a different one if necessary)
        auth: {
            user: process.env.EMAIL_USER,  // Email address from .env
            pass: process.env.EMAIL_PASS,  // App password from .env
        },
    });

    // Set up email options
    const mailOptions = {
        from: email,  // Email address of the person who submitted the form
        to: 'laurengregory23@gmail.com',  // The email address you want to send form responses to
        subject: 'New Contact Form Submission from Website',
        text: `
            You have received a new message from the contact form:

            Name: ${name}
            Email: ${email}
            Message: ${message}
        `,
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred: ' + error);
            return res.send('Error sending message. Please try again.');
        }
        console.log('Email sent: ' + info.response);
        res.send('Thank you for your message! I will get back to you soon.');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});