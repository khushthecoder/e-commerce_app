const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please add all fields');
    }

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashed,
        },
    });

    if (user) {
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user.id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials (Email or Password)');
    }
});

const getMe = asyncHandler(async (req, res) => {
    res.status(200).json(req.user);
});

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

async function sendResetEmail(to, resetLink) {
    const from = process.env.SMTP_FROM || process.env.SMTP_USER;
    const info = await transporter.sendMail({
        from,
        to,
        subject: 'Password Reset',
        html: `<p>We received a request to reset your password. Click the link below to reset it. The link is valid for 1 hour.</p>
           <p><a href="${resetLink}">Reset your password</a></p>
           <p>If you didn't request this, ignore this email.</p>`,
    });
    return info;
}

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    if (!email) {
        res.status(400);
        throw new Error('Email is required');
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.json({ message: 'If the email exists, a reset link was sent.' });

    const token = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await prisma.passwordResetToken.create({ data: { userId: user.id, tokenHash, expiresAt } });

    const clientUrl = process.env.CLIENT_URL || 'http:
    const resetLink = `${clientUrl}/reset-password?token=${token}&id=${user.id}`;

    try {
        await sendResetEmail(user.email, resetLink);
    } catch (err) {
        console.error('Failed to send reset email', err);
    }

    res.json({ message: 'If the email exists, a reset link was sent.' });
});

const resetPassword = asyncHandler(async (req, res) => {
    const { token, id, newPassword } = req.body;
    if (!token || !id || !newPassword) {
        res.status(400);
        throw new Error('Token, id and newPassword are required');
    }
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!record || record.userId !== Number(id) || record.expiresAt < new Date()) {
        res.status(400);
        throw new Error('Invalid or expired token');
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({ where: { id: Number(id) }, data: { password: hashed } });
    await prisma.passwordResetToken.deleteMany({ where: { userId: Number(id) } });

    res.json({ message: 'Password reset successful' });
});


module.exports = {
    registerUser,
    loginUser,
    getMe,
    forgotPassword,
    resetPassword,
};