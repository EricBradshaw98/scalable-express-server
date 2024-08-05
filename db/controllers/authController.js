const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
require('dotenv').config();
const { addToBlacklist } = require('../../utilities/blacklist');
const { generateToken } = require('../../utilities/jwttoken');
const camelCaseKeys = require('../../utilities/camelCase');
const mailgun = require('mailgun-js')
    ({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MG_DOMAIN });




// Utility function to send emails
const sendConfirmationEmail = async (email, token) => {
  const domain = process.env.MG_DOMAIN;

  const data = {
    from: `Mailgun Sandbox <postmaster@${domain}>`,
    to: email,
    subject: "Account Confirmation",
    text: `Please confirm your account by clicking the following link: http://localhost:3001/api/auth/confirm/${token}`
  };

  return new Promise((resolve, reject) => {
    mailgun.messages().send(data, (error, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};


const sendResetEmail = async (email, token) => {
  const domain = process.env.MG_DOMAIN;

  const data = {
    from: `Mailgun Sandbox <postmaster@${domain}>`,
    to: email,
    subject: "Password Reset Request",
    text: `Please reset your password by clicking the following link: http://localhost:3001/api/auth/reset-password. Your token is ${token}`
  };

  return new Promise((resolve, reject) => {
    mailgun.messages().send(data, (error, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};



// Utility function to send emails
const sendTestEmail = async (email) => {
  const domain = process.env.MG_DOMAIN;

  const data = {
    from: `Mailgun Sandbox <postmaster@${domain}>`,
    to: email,
    subject: "Account Test Email",
    text: `Please view this test email.`
  };

  return new Promise((resolve, reject) => {
    mailgun.messages().send(data, (error, body) => {
      if (error) {
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
};

exports.testEmail = async (req, res) => {
  const { email } = req.body;
  try {
    
    
    await sendTestEmail(email);
    res.status(201).json({ message: 'Test email sent' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
};





// Register a new user
exports.registerUser = async (req, res) => {
  const { name, email, password, address, phoneNumber, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    const result = await pool.query(
      'INSERT INTO users (name, email, password, address, phone_number, role, confirmation_token, confirmed) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, email, hashedPassword, address, phoneNumber, role, confirmationToken, false]
    );
    const camelCasedResult = camelCaseKeys(result.rows[0]);
    await sendConfirmationEmail(email, confirmationToken);
    res.status(201).json({ data: camelCasedResult });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'An error occurred while registering the user' });
  }
};

  




// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Email not found' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    await pool.query('UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3', [token, Date.now() + 3600000, email]); // Token expires in 1 hour

    
    await sendResetEmail(email, token);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error processing forgot password request:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > $2', [token, Date.now()]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2', [hashedPassword, result.rows[0].id]);

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ error: 'An error occurred while resetting your password' });
  }
};


exports.confirmToken = async (req, res) => {
  const { token } = req.params;

  try {
    const result = await pool.query('SELECT * FROM users WHERE confirmation_token = $1', [token]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid token' });
    }

    const user = result.rows[0];
    await pool.query('UPDATE users SET confirmed = true, confirmation_token = NULL WHERE id = $1', [user.id]);

    res.status(200).json({ message: 'Account confirmed successfully' });
  } catch (error) {
    console.error('Error confirming account:', error);
    res.status(500).json({ error: 'An error occurred while confirming the account' });
  }
};






