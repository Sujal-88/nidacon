import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
// You'll need to use an email service that allows SMTP, like Gmail (with an App Password), SendGrid, etc.
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER, // Still rangcreationwebsite@gmail.com for login
        pass: process.env.EMAIL_PASS,
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
        subject: 'Your NIDACON 2026 Registration is Confirmed!',
        html: receiptHtml,
    };

    // Notification to Admin
    const ownerMailOptions = {
        from: `"NIDACON Notifier" <${process.env.EMAIL_USER}>`,
        to: ownerEmail,
        subject: `New NIDACON Registration: ${user.name}`,
        html: `<p>A new user has registered for the event.</p>${receiptHtml}`,
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

export async function sendSportsRegistrationEmail(registration, paymentDetails) {
    const ownerEmail = process.env.OWNER_EMAIL;

    const sportsList = registration.selectedSports.join(', ');

    const receiptHtml = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
             <h2>Thank you for registering for NIDASPORTZ 2025!</h2>
             <p>Hello ${registration.name},</p>
             <p>Your registration is confirmed. We are excited to have you join us.</p>
             <h3>Registration Details:</h3>
             <ul>
                 <li><strong>User ID:</strong> ${registration.userId}</li>
                 <li><strong>Email:</strong> ${registration.email}</li>
                 <li><strong>Mobile:</strong> ${registration.mobile}</li>
                 <li><strong>Selected Sports:</strong> ${sportsList}</li>
             </ul>
             <h3>Payment Details:</h3>
             <ul>
                 <li><strong>Transaction ID:</strong> ${paymentDetails.txnid}</li>
                 <li><strong>Amount Paid:</strong> ₹${paymentDetails.amount}</li>
                 <li><strong>Payment Status:</strong> ${paymentDetails.status}</li>
             </ul>
             <p>We look forward to seeing you at the event!</p>
             <p><strong>- Team IDA Nagpur</strong></p>
     <br>
     <p><strong>For any queries please contact: Dr. Mitul Mishra at +91 98765 43210</strong></p>
         </div>
    `;

    // 1. Email to the User
    const userMailOptions = {
        from: `"NIDASPORTZ 2025" <${process.env.EMAIL_USER}>`,
        to: registration.email, 
        subject: 'Your NIDASPORTZ 2025 Registration is Confirmed!',
        html: receiptHtml,
    };
    
    // 2. Notification to Admin
    const ownerMailOptions = {
        from: `"NIDASPORTZ Notifier" <${process.env.EMAIL_USER}>`,
        to: ownerEmail,
        subject: `New Sports Registration: ${registration.name}`,
        html: `
            <p>A new user has registered for the sports event.</p>
            ${receiptHtml}
        `,
    };

    try {
        if(registration.email) {
            await transporter.sendMail(userMailOptions);
            console.log('Sports confirmation email sent to user:', registration.email);
        }
        await transporter.sendMail(ownerMailOptions);
        console.log('Sports notification email sent to owner:', ownerEmail);
    } catch (error) {
        console.error('Error sending sports registration emails:', error);
    }
}

// <!-- 
// Online HTML, CSS and JavaScript editor to run code online.
// -->
// <!DOCTYPE html>
// <html lang="en">

// <head>
//   <meta charset="UTF-8" />
//   <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//   <link rel="stylesheet" href="style.css" />
//   <title>Browser</title>
// </head>

// <body>
//   <div style="font-family: Arial, sans-serif; line-height: 1.6;">
//             <h2>Thank you for registering for NIDACON 2026!</h2>
//             <p>Hello ${user.name},</p>
//             <p>Your registration is confirmed. We are excited to have you join us.</p>
//             <h3>Registration Details:</h3>
//             <ul>
//                 <li><strong>User ID:</strong> ${user.userId}</li>
//                 <li><strong>Email:</strong> ${user.email}</li>
//                 <li><strong>Mobile:</strong> ${user.mobile}</li>
//                 <li><strong>Registration Type:</strong> ${user.registrationType}</li>
//             </ul>
//             <h3>Payment Details:</h3>
//             <ul>
//                 <li><strong>Transaction ID:</strong> ${paymentDetails.txnid}</li>
//                 <li><strong>Amount Paid:</strong> ₹${paymentDetails.amount}</li>
//                 <li><strong>Payment Status:</strong> ${paymentDetails.status}</li>
//             </ul>
//             <p>We look forward to seeing you at the event!</p>
//             <p><strong>- Team IDA Nagpur</strong></p>
//     <br>
//     <p><strong>for any queries please contact- Dr.Mitul Mishra [00000000000]</strong></p>
//         </div>
// </body>

// </html>