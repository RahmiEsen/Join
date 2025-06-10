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
            subject: '🔐 Passwort zurücksetzen',
            html: 
            `
            <div style="background-color:#e8ecfc;padding:50px 20px;font-family:sans-serif;">
                <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;padding:40px;box-shadow:0 0 20px rgba(0,0,0,0.05);text-align:center;">
                <div style="margin-bottom:30px;">
                    <img src="https://i.imgur.com/AV3VfVu.png" alt="Lock Icon" width="48" height="48" />
                </div>

                <h2 style="color:#1d1d1d;font-size:24px;margin-bottom:10px;">Forgot your password?</h2>
                <p style="color:#555;font-size:16px;line-height:1.5;">Hey, we received a request to reset your password.<br />Let's get you a new one!</p>

                <div style="margin:30px 0;">
                    <a href="${link}" style="background:#4f46e5;color:#fff;padding:14px 30px;text-decoration:none;font-weight:bold;border-radius:6px;font-size:16px;display:inline-block;">
                    RESET MY PASSWORD
                    </a>
                </div>

                <p style="color:#888;font-size:13px;margin:0 0 10px;">
                    Having trouble? <a href="https://instagram.com/jointeam" style="color:#4f46e5;text-decoration:none;">@jointeam</a>
                </p>
                <p style="color:#aaa;font-size:12px;">Didn’t request a password reset? You can ignore this message.</p>
                </div>

                <div style="text-align:center;margin-top:30px;color:#777;font-size:12px;">
                <img src="https://i.imgur.com/TtNjDpa.png" alt="Your Logo" style="height:32px;margin-bottom:10px;" />
                <div style="margin:10px 0;">
                    <a href="https://instagram.com" style="margin:0 8px;"><img src="https://i.imgur.com/J1jAIPK.png" alt="Instagram" width="18" /></a>
                    <a href="https://x.com" style="margin:0 8px;"><img src="https://i.imgur.com/6YcZhdV.png" alt="X" width="18" /></a>
                </div>
                <div>+49 123 456 7890</div>
                <div style="margin-top:8px;">This link will expire in the next 1 hour.</div>
                <div style="margin-top:8px;">Need help? <a href="mailto:join@yourproject.com" style="color:#4f46e5;">join@yourproject.com</a></div>
                <div style="margin-top:8px;">
                    <a href="#" style="color:#aaa;">Unsubscribe</a> · 
                    <a href="#" style="color:#aaa;">Preferences</a> · 
                    <a href="#" style="color:#aaa;">Privacy Policy</a>
                </div>
                <div style="margin-top:10px;color:#bbb;">© ${new Date().getFullYear()} Join Project</div>
                </div>
            </div>
            `
        });
    }
}
