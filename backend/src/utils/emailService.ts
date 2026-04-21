import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: "gmail",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMTP_USER||"[EMAIL_ADDRESS]",
        pass: process.env.SMTP_PASS||"[PASSWORD]"
    }

});

export const sendEmail = async (to: string | string[], subject: string, html: string) => {
    try {
        const mailOptions = {
            from: process.env.SMTP_USER || "[EMAIL_ADDRESS]",
            to: Array.isArray(to) ? to.join(',') : to,
            subject,
            html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw, just log so it doesn't break the main flow
        return null;
    }
};
