// lib/email.mjs
import nodemailer from 'nodemailer';

export const sendOTPEmail = async (email, otp) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Verification OTP from Converse',
        html: `
            <h1>Your Verification OTP</h1>
            <p>Your OTP for email verification is:</p>
            <h2>${otp}</h2>
            <p>This OTP will expire in 10 minutes.</p>
        `
    };

    await transporter.sendMail(mailOptions);
};
