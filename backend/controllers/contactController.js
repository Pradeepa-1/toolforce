const nodemailer = require('nodemailer');

const sendContactEmail = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
    }

    // Gmail SMTP transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.CONTACT_EMAIL,       // உன் Gmail: example@gmail.com
        pass: process.env.CONTACT_APP_PASSWORD, // Gmail App Password (16-char)
      },
    });

    const subjectLabels = {
      bug: '🐛 Bug Report',
      feature: '💡 Feature Request',
      partnership: '🤝 Partnership / Affiliate',
      feedback: '💬 General Feedback',
      other: '📩 Other',
    };
    const subjectLabel = subjectLabels[subject] || '📩 Contact Form';

    // Mail உனக்கு வரும் — visitor details
    const ownerMailOptions = {
      from: `"ToolForge Contact" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL, // உன் mail-க்கே வரும்
      replyTo: email,                // Reply பண்ணா directly visitor-க்கு போகும்
      subject: `[ToolForge] ${subjectLabel} from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f1a; color: #e4e4e7; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #14b8a6, #8b5cf6); padding: 24px 32px;">
            <h1 style="margin: 0; font-size: 22px; color: white;">📬 New Contact Message</h1>
            <p style="margin: 6px 0 0; color: rgba(255,255,255,0.8); font-size: 14px;">ToolForge Contact Form</p>
          </div>
          <div style="padding: 28px 32px;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #71717a; font-size: 13px; width: 100px; vertical-align: top;">Name</td>
                <td style="padding: 10px 0; color: #f4f4f5; font-size: 14px; font-weight: 600;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #71717a; font-size: 13px; vertical-align: top;">Email</td>
                <td style="padding: 10px 0;">
                  <a href="mailto:${email}" style="color: #14b8a6; font-size: 14px;">${email}</a>
                </td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #71717a; font-size: 13px; vertical-align: top;">Topic</td>
                <td style="padding: 10px 0; color: #f4f4f5; font-size: 14px;">${subjectLabel}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #71717a; font-size: 13px; vertical-align: top;">Message</td>
                <td style="padding: 10px 0; color: #d4d4d8; font-size: 14px; line-height: 1.6;">${message.replace(/\n/g, '<br>')}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding: 16px; background: rgba(20,184,166,0.08); border: 1px solid rgba(20,184,166,0.2); border-radius: 8px;">
              <p style="margin: 0; font-size: 12px; color: #71717a;">💡 Reply to this email to respond directly to <strong style="color: #14b8a6;">${email}</strong></p>
            </div>
          </div>
          <div style="padding: 16px 32px; background: rgba(255,255,255,0.03); border-top: 1px solid rgba(255,255,255,0.06);">
            <p style="margin: 0; font-size: 11px; color: #52525b;">Sent from ToolForge contact form • ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
          </div>
        </div>
      `,
    };

    // Auto-reply — visitor-க்கு confirmation
    const visitorMailOptions = {
      from: `"ToolForge" <${process.env.CONTACT_EMAIL}>`,
      to: email,
      subject: `We received your message, ${name}! ✅`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f0f1a; color: #e4e4e7; border-radius: 12px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #14b8a6, #8b5cf6); padding: 24px 32px;">
            <h1 style="margin: 0; font-size: 22px; color: white;">Thanks for reaching out! 🙌</h1>
          </div>
          <div style="padding: 28px 32px; line-height: 1.7;">
            <p style="color: #d4d4d8; font-size: 15px;">Hi <strong style="color: white;">${name}</strong>,</p>
            <p style="color: #a1a1aa; font-size: 14px;">We received your message and will get back to you within <strong style="color: #14b8a6;">24 hours</strong>.</p>
            <div style="margin: 20px 0; padding: 16px 20px; background: rgba(255,255,255,0.04); border-left: 3px solid #14b8a6; border-radius: 4px;">
              <p style="margin: 0; font-size: 13px; color: #71717a; margin-bottom: 6px;">Your message:</p>
              <p style="margin: 0; font-size: 14px; color: #d4d4d8;">${message.replace(/\n/g, '<br>')}</p>
            </div>
            <p style="color: #a1a1aa; font-size: 14px;">Meanwhile, try our free tools at <a href="https://toolforge.app" style="color: #14b8a6;">toolforge.app</a></p>
          </div>
          <div style="padding: 16px 32px; background: rgba(255,255,255,0.03); border-top: 1px solid rgba(255,255,255,0.06);">
            <p style="margin: 0; font-size: 11px; color: #52525b;">ToolForge — Free Online Tools • Please don't reply to this email</p>
          </div>
        </div>
      `,
    };

    // இரண்டு mails-உம் அனுப்பு
    await transporter.sendMail(ownerMailOptions);
    await transporter.sendMail(visitorMailOptions);

    res.json({ success: true, message: 'Message sent successfully!' });
  } catch (err) {
    console.error('Contact email error:', err);
    res.status(500).json({ success: false, message: 'Failed to send message. Please try again.' });
  }
};

module.exports = { sendContactEmail };
