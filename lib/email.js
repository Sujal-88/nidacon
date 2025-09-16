// lib/email.js

import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
// You'll need to use an email service that allows SMTP, like Gmail (with an App Password), SendGrid, etc.
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // e.g., 'smtp.gmail.com'
    port: process.env.EMAIL_PORT, // e.g., 587
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },
});

// Function to generate the HTML for the receipt
function createReceiptHtml(user, paymentDetails) {
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Thank you for registering for NIDACON 2026!</h2>
            <p>Hello ${user.name},</p>
            <p>Your registration is confirmed. We are excited to have you join us.</p>
            <h3>Registration Details:</h3>
            <ul>
                <li><strong>User ID:</strong> ${user.userId}</li>
                <li><strong>Email:</strong> ${user.email}</li>
                <li><strong>Mobile:</strong> ${user.mobile}</li>
                <li><strong>Registration Type:</strong> ${user.registrationType}</li>
            </ul>
            <h3>Payment Details:</h3>
            <ul>
                <li><strong>Transaction ID:</strong> ${paymentDetails.txnid}</li>
                <li><strong>Amount Paid:</strong> ₹${paymentDetails.amount}</li>
                <li><strong>Payment Status:</strong> ${paymentDetails.status}</li>
            </ul>
            <p>We look forward to seeing you at the event!</p>
            <p><strong>- The NIDACON 2026 Team</strong></p>
        </div>
    `;
}

// Main function to send emails
export async function sendRegistrationEmail(user, paymentDetails) {
    const ownerEmail = process.env.OWNER_EMAIL; // The admin's email address
    const receiptHtml = createReceiptHtml(user, paymentDetails);

    // 1. Email to the User
    const userMailOptions = {
        from: `"NIDACON 2026" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Your Registration for NIDACON 2026 is Confirmed!',
        html: receiptHtml,
    };

    // 2. Notification Email to the Owner/Admin
    const ownerMailOptions = {
        from: `"NIDACON 2026 Notifier" <${process.env.EMAIL_USER}>`,
        to: ownerEmail,
        subject: `New Registration for NIDACON 2026: ${user.name}`,
        html: `
            <p>A new user has successfully registered and paid for the event.</p>
            ${receiptHtml}
        `,
    };

    try {
        // Send both emails
        await transporter.sendMail(userMailOptions);
        console.log('Confirmation email sent to user:', user.email);
        
        await transporter.sendMail(ownerMailOptions);
        console.log('Notification email sent to owner:', ownerEmail);

    } catch (error) {
        console.error('Error sending registration emails:', error);
    }
}