const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const Metric = require('../models/Metric');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 465),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

function genOTP() { return Math.floor(100000 + Math.random()*900000).toString(); }

exports.register = async (req, res) => {
  try {
    const { username, name, email, password, phone, role='staff' } = req.body;
    if (!username || !email || !password) return res.status(400).json({ message: 'Missing fields' });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, name, email, passwordHash, phone, role });

    // create metric for total users (optional): increase users metric by 1
    await Metric.create({ name: 'users', value: 1, timestamp: new Date() });

    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req,res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Missing credentials' });
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });
    const payload = { id: user.id, role: user.role, username: user.username, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
    res.json({ token, user: payload });
  } catch(err) { console.error(err); res.status(500).json({message:'Server error'}); }
};

// send OTP for registration verification or forgot password
exports.sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otp = genOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 15*60*1000); // 15 min
    await user.save();

    await transporter.sendMail({
      to: user.email,
      from: process.env.SMTP_USER,
      subject: 'Your Manifest OTP',
      text: `Your OTP: ${otp}`
    });

    res.json({ message: 'OTP sent' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error' }); }
};

exports.verifyOtpReset = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (!user.otp || user.otp !== otp || new Date() > user.otpExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP' });
    }
    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.otp = null;
    user.otpExpires = null;
    await user.save();
    res.json({ message: 'Password updated' });
  } catch(err){ console.error(err); res.status(500).json({ message: 'Server error' }); }
};
