const nodemailer = require('nodemailer');
require('dotenv').config();

// Debug: Log environment variables (without showing full password)
console.log('📧 Email Configuration Debug:');
console.log('EMAIL_USER:', process.env.EMAIL_USER || 'NOT SET');
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? 'SET (hidden)' : 'NOT SET');

// Create Gmail SMTP transporter
const createTransporter = () => {
  console.log('🔧 Creating email transporter...');
  
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    },
    debug: true, // Enable debug logging
    logger: true  // Enable logger
  });

  console.log('✅ Transporter created');
  return transporter;
};

// Send approval email to student
const sendApprovalEmail = async (studentEmail, studentName, roomNumber) => {
  console.log('\n📧 === SENDING APPROVAL EMAIL ===');
  console.log('To:', studentEmail);
  console.log('Student Name:', studentName);
  console.log('Room Number:', roomNumber);
  console.log('From:', process.env.EMAIL_USER);
  
  try {
    const transporter = createTransporter();

    // Verify transporter is ready
    console.log('🔍 Verifying transporter...');
    await transporter.verify();
    console.log('✅ Transporter verified successfully');

    const emailContent = {
      from: `"Smart Hostel" <${process.env.EMAIL_USER}>`,
      to: studentEmail,
      subject: 'Congratulations! Your Hostel Application is Approved',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 24px;">🎉 Congratulations!</h1>
          </div>
          
          <div style="padding: 30px; background: #ffffff;">
            <h2 style="color: #333; margin-top: 0;">Your Hostel Application is Approved</h2>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Dear <strong>${studentName}</strong>,
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              We are delighted to inform you that your application for accommodation at <strong>Smart Hostel</strong> has been approved!
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #667eea; margin-top: 0; font-size: 18px;">📋 Your Assignment Details:</h3>
              <table style="width: 100%; color: #555;">
                <tr>
                  <td style="padding: 8px 0;"><strong>Student Name:</strong></td>
                  <td style="padding: 8px 0;">${studentName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Assigned Room:</strong></td>
                  <td style="padding: 8px 0;">Room ${roomNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0;"><strong>Hostel:</strong></td>
                  <td style="padding: 8px 0;">Smart Hostel</td>
                </tr>
              </table>
            </div>
            
            <h3 style="color: #333; font-size: 18px;">📌 Move-in Instructions:</h3>
            <ul style="color: #555; line-height: 1.8; padding-left: 20px;">
              <li>Please report to the hostel office within 3 days of receiving this email</li>
              <li>Bring your student ID and a copy of this approval email</li>
              <li>Office hours: Monday to Friday, 9:00 AM - 5:00 PM</li>
              <li>Contact the warden if you need to arrange a different move-in date</li>
            </ul>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 25px 0;">
              <h4 style="color: #856404; margin: 0 0 10px 0;">📞 Contact Information:</h4>
              <p style="color: #856404; margin: 5px 0;">
                <strong>Email:</strong> nk4054420@gmail.com<br>
                <strong>Office Phone:</strong> +1 (555) 123-4567<br>
                <strong>Address:</strong> Smart Hostel, University Campus
              </p>
            </div>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6; margin-top: 30px;">
              Welcome to Smart Hostel! We look forward to having you as part of our community.
            </p>
            
            <p style="color: #555; font-size: 16px; line-height: 1.6;">
              Best regards,<br>
              <strong>Smart Hostel Management</strong>
            </p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; border-top: 1px solid #e0e0e0;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              This is an automated email from Smart Hostel Management System.<br>
              Please do not reply to this email.
            </p>
          </div>
        </div>
      `
    };

    console.log('📤 Sending email...');
    const info = await transporter.sendMail(emailContent);
    console.log('✅ Email sent successfully!');
    console.log('📧 Message ID:', info.messageId);
    console.log('=====================================\n');
    
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('\n❌ === EMAIL SEND ERROR ===');
    console.error('Error Message:', error.message);
    console.error('Error Code:', error.code);
    console.error('Full Error:', error);
    console.error('=============================\n');
    throw error; // Re-throw to handle in controller
  }
};

// Test email configuration
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server is ready to send messages');
    return true;
  } catch (error) {
    console.error('❌ Email configuration error:', error.message);
    return false;
  }
};

module.exports = {
  sendApprovalEmail,
  testEmailConfig
};
