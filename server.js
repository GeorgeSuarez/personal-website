require('dotenv').config();
const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the current directory
app.use(express.static(__dirname));

// Handle contact form submission
app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error('Email credentials not set. Please set EMAIL_USER and EMAIL_PASS environment variables.');
    return res.status(500).send('Email configuration error.');
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Your Gmail address
      pass: process.env.EMAIL_PASS  // Your Gmail app password
    }
  });

  const mailOptions = {
    from: email,
    to: 'georgesuarezdev@gmail.com',
    subject: `Contact Form Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.redirect('/submitted.html');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).send('Error sending message. Please try again.');
  }
});

// Handle all routes by serving index.html (for single-page app behavior)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Personal website server running at:`);
  console.log(`   Local:   http://localhost:${PORT}`);
  console.log(`   Network: http://127.0.0.1:${PORT}`);
  console.log(`\n📁 Serving files from: ${__dirname}`);
  console.log(`\n🛑 Press Ctrl+C to stop the server`);
});
