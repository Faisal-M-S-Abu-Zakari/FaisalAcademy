import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

export const subscribeNewsletter = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Email is required' });
      return;
    }

    let transporter;

    // If real credentials are provided in .env, use them
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback: Generate test SMTP service account from ethereal.email
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user, // generated ethereal user
          pass: testAccount.pass, // generated ethereal password
        },
      });
    }

    // 3. Send mail with defined transport object
    const info = await transporter.sendMail({
      from: '"Noon Academy MVP" <noreply@noonacademy.local>',
      to: email,
      subject: 'Welcome to Noon Academy Newsletter! 🎉',
      text: 'Thank you for subscribing to our newsletter! You will receive the latest updates, course drops, and offers right here.',
      html: `
        <div style="font-family: sans-serif; max-w: 600px; margin: auto; padding: 20px; text-align: center; border: 1px solid #e0e7ff; border-radius: 10px;">
          <h2 style="color: #4f46e5;">Welcome to Noon Academy! 🎉</h2>
          <p style="color: #374151; font-size: 16px;">Thank you for subscribing to our newsletter.</p>
          <p style="color: #374151; font-size: 16px;">You are now on the list to receive the latest course drops, special discounts, and community updates!</p>
          <hr style="border: none; border-top: 1px solid #e0e7ff; margin: 20px 0;" />
          <p style="color: #9ca3af; font-size: 12px;">This is an automated message. Please do not reply.</p>
        </div>
      `,
    });

    if (!process.env.SMTP_USER) {
      console.log('Message sent: %s', info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    }

    res.status(200).json({
      success: true,
      message: 'Successfully subscribed! Please check your email.',
      previewUrl: !process.env.SMTP_USER ? nodemailer.getTestMessageUrl(info) : null,
    });
  } catch (error: any) {
    console.error('Newsletter error:', error);
    res.status(500).json({ success: false, message: 'Failed to send email' });
  }
};
