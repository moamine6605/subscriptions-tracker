import nodemailer from 'nodemailer';
import 'dotenv/config.js';

export const accountEmail = process.env.EMAIL_USER;

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: accountEmail,
        pass: process.env.EMAIL_PASSWORD
    }
})

export default transporter;