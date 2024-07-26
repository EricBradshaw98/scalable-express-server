const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
require('dotenv').config();

const { addToBlacklist } = require('../../utilities/blacklist');
const { generateToken } = require('../../utilities/jwttoken');
const camelCaseKeys = require('../../utilities/camelCase');
const mailgun = require('mailgun-js')
    ({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MG_DOMAIN });

// Utility function to send emails
const sendEmail = (to, subject, text) => {
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
  });
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = result.rows[0];
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const resetLink = `http://localhost:3000/reset-password?token=${token}`;
    sendEmail(user.email, 'Password Reset Request', `Please click on the link to reset your password: ${resetLink}`);

    res.json({ message: 'Password reset link has been sent to your email' });
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query('UPDATE users SET password = $1 WHERE id = $2', [hashedPassword, decoded.id]);

    res.json({ message: 'Password has been reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Invalid or expired token' });
  }
};


exports.testEmail = async (req, res) => {
  try {
    const domain = process.env.MG_DOMAIN;
    const { email } = req.body;

    

    // Create email data
    const data = {
      from: `Mailgun Sandbox <postmaster@${domain}>`,
      to: email,
      subject: "Hello",
      text: `Your one-time token is: ` // Include token in the email
    };

    // Send email using Mailgun
    mailgun.messages().send(data, async (error, body) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send email" });
      } else {
        console.log(body);
        try {
          
          res.status(200).json({ message: "Email sent successfully" });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: "Failed to insert token into the database" });
        }
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to send email" });
  }
}



