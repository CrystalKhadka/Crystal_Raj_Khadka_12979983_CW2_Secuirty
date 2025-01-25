const nodemailer = require('nodemailer');

const createEmailTemplate = async (email, otp, isRegistration = false) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // Move to environment variables for security
      pass: process.env.EMAIL_PASS,
    },
  });

  const getWelcomeMessage = () => {
    return isRegistration
      ? "Welcome to Movie Tickets! We're excited to have you join us."
      : 'Welcome back to Movie Tickets!';
  };

  const mailOptions = {
    from: {
      name: 'Movie Tickets',
      address: process.env.EMAIL_USER,
    },
    to: email,
    subject: isRegistration
      ? 'Welcome to Movie Tickets - Verify Your Email'
      : 'Movie Tickets - Verify Your Login',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Inter', Arial, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f4f4f5;">
          <!-- Main Container -->
          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Logo Header -->
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #2a7d73; font-size: 32px; font-weight: 700; margin: 0;">Movie Tickets</h1>
              <p style="color: #2a7d73; font-size: 16px; margin: 4px 0 0 0;">Your Gateway to Entertainment</p>
            </div>
            
            <!-- Content Card -->
            <div style="background-color: #ffffff; border-radius: 16px; padding: 48px 32px; margin: 0 0 24px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <h2 style="margin: 0 0 24px; color: #1a1a1a; font-size: 24px; font-weight: 600; text-align: center;">
                Verify Your Email Address
              </h2>
              
              <p style="margin: 0 0 16px; color: #4b5563; font-size: 16px;">
                Hi there,
              </p>
              
              <p style="margin: 0 0 24px; color: #4b5563; font-size: 16px;">
                ${getWelcomeMessage()} Please verify your email address by entering this verification code:
              </p>
              
              <!-- OTP Container -->
              <div style="text-align: center; margin: 32px 0;">
                <div style="background-color: #f8fafc; border: 2px dashed #2a7d73; border-radius: 12px; padding: 24px; display: inline-block;">
                  <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; color: #2a7d73; letter-spacing: 8px;">
                    ${otp}
                  </span>
                </div>
                <p style="margin: 16px 0 0 0; font-size: 14px; color: #64748b;">
                  This code will expire in 10 minutes
                </p>
              </div>
              
              <!-- Action Button -->
              <div style="text-align: center; margin: 32px 0;">
                <a href="https://movietickets.com/verify" 
                   style="display: inline-block; background-color: #2a7d73; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 8px; font-weight: 500; font-size: 16px;">
                  Verify Email Address
                </a>
              </div>
              
              <p style="margin: 24px 0; color: #4b5563; font-size: 16px;">
                If you didn't request this verification, please ignore this email or contact our support team if you have concerns.
              </p>
              
              <!-- Security Notice -->
              <div style="background-color: #f8fafc; border-radius: 12px; padding: 16px; margin: 32px 0; border-left: 4px solid #2a7d73;">
                <p style="margin: 0; font-size: 14px; color: #64748b;">
                  🔒 For your security, never share this verification code with anyone, including Movie Tickets staff.
                </p>
              </div>
            </div>
            
            <!-- Featured Movies Section -->
            <div style="background-color: #ffffff; border-radius: 16px; padding: 32px; margin: 24px 0; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
              <h3 style="margin: 0 0 16px; color: #1a1a1a; font-size: 18px; font-weight: 600;">
                Now Showing
              </h3>
              <p style="margin: 0; color: #4b5563; font-size: 14px;">
                Don't miss out on the latest blockbusters! Book your tickets now and enjoy the best cinema experience.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; padding: 32px 0; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 16px; font-size: 14px; color: #64748b;">
                © ${new Date().getFullYear()} Movie Tickets. All rights reserved.
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; color: #64748b;">
                123 Cinema Street, Entertainment District, MB 12345
              </p>
              <div style="margin-bottom: 24px;">
                <a href="#" style="color: #2a7d73; text-decoration: none; margin: 0 12px; font-size: 14px; font-weight: 500;">Privacy Policy</a>
                <a href="#" style="color: #2a7d73; text-decoration: none; margin: 0 12px; font-size: 14px; font-weight: 500;">Terms of Service</a>
                <a href="#" style="color: #2a7d73; text-decoration: none; margin: 0 12px; font-size: 14px; font-weight: 500;">Contact Us</a>
              </div>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Please do not reply to this email. For assistance, please contact our support team.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

// Export both functions using the same template
module.exports = {
  sendLoginVerificationEmail: (email, otp) =>
    createEmailTemplate(email, otp, false),
  sendRegisterOtp: (email, otp) => createEmailTemplate(email, otp, true),
};
