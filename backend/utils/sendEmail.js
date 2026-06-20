import nodemailer from 'nodemailer';

const sendEmail = async ({ to, subject, html }) => {
  try {
    // If no credentials, we log and return success to avoid blocking the app flow
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log(`[SMTP MOCK] Email Sent!`);
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body (HTML length): ${html.length} chars`);
      return true;
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"College Placement Portal" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`Email sending failed: ${error.message}`);
    // Do not crash the application, return false
    return false;
  }
};

export default sendEmail;
