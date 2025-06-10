import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
        }
    });
    async sendResetEmail(to: string, link: string) {
        await this.transporter.sendMail({
            from: `"Passwort auf Join zurücksetzen" <${process.env.MAIL_USER}>`,
            to,
            subject: '🔐 Reset your password',
            html: 
            `
            <div style="background-color:#2A3647; padding:50px 20px; font-family:Inter, sans-serif;">
            <div style="
                max-width:600px;
                margin:auto;
                background:#f6f7f8;
                border-radius:10px;
                padding:40px;
                box-shadow:0 0 20px rgba(0,0,0,0.05);
                text-align:center;
            ">
                <div style="margin-bottom:30px;">
                <img
                    src="https://raw.githubusercontent.com/RahmiEsen/Join/refs/heads/main/Frontend/src/assets/images/logo-dark.png"
                    alt="Join Logo"
                    width="100"
                    height="120"
                />
                </div>
                <h1 style="
                color:#000;
                font-size:35px;
                font-weight:700;
                margin-bottom:10px;
                ">
                Forgot your password?
                </h1>
                <p style="color:#555; font-size:16px; line-height:1.5;">
                Hey, we received a request to reset your password.<br />
                Let's get you a new one!
                </p>
                <div style="margin:30px 0;">
                <a
                    href="${link}"
                    style="
                    background:#29ABE2;
                    color:#fff;
                    padding:14px 30px;
                    text-decoration:none;
                    font-weight:bold;
                    border-radius:30px;
                    font-size:16px;
                    display:inline-block;
                    "
                >
                    RESET MY PASSWORD
                </a>
                </div>
                <p style="color:#aaa; font-size:12px;">
                Didn’t request a password reset? <br />
                You can ignore this message.
                </p>
            </div>
            <div style="text-align:center; margin-top:30px; color:#777; font-size:12px;">
                <div style="margin:10px 0;">
                <a href="https://www.instagram.com/kendricklamar/" style="margin:0 8px;">
                    <img
                    src="https://raw.githubusercontent.com/RahmiEsen/Join/refs/heads/main/Frontend/src/assets/images/insta.svg"
                    alt="Instagram"
                    width="18"
                    />
                </a>
                </div>
                <div>+49 123 456 7890</div>
                <div style="margin-top:8px;">
                This link will expire in the next 1 hour.
                </div>
                <div style="margin-top:8px;">
                <a href="#" style="color:#aaa;">Legal notice</a> ·
                <a href="#" style="color:#aaa;">Privacy Policy</a>
                </div>
                <div style="margin-top:10px; color:#bbb;">
                © ${new Date().getFullYear()} Join Project
                </div>
            </div>
            </div>
            `
        });
    }
}
