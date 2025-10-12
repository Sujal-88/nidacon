import nodemailer from 'nodemailer';

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Function to generate the HTML for NIDACON 2026 receipt
function createReceiptHtml(user, paymentDetails) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 1px;">NIDACON 2026</h1>
                                    <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Registration Confirmed</p>
                                </td>
                            </tr>
                            
                            <!-- Success Message -->
                            <tr>
                                <td style="padding: 40px 30px 20px 30px; text-align: center;">
                                    <div style="display: inline-block; background-color: #10b981; width: 60px; height: 60px; border-radius: 50%; text-align: center; line-height: 60px; margin-bottom: 20px;">
                                        <span style="color: white; font-size: 30px;">✓</span>
                                    </div>
                                    <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">Thank You, ${user.name}!</h2>
                                    <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Your registration has been successfully confirmed. We're thrilled to have you join us at NIDACON 2026!</p>
                                </td>
                            </tr>
                            
                            <!-- Registration Details -->
                            <tr>
                                <td style="padding: 20px 30px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                                        <tr>
                                            <td colspan="2" style="padding-bottom: 15px;">
                                                <h3 style="color: #667eea; margin: 0; font-size: 18px; font-weight: 600;">Registration Details</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">User ID:</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${user.userId}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${user.email}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Mobile:</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${user.mobile}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Registration Type:</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${user.registrationType}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Payment Details -->
                            <tr>
                                <td style="padding: 20px 30px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-radius: 8px; padding: 20px; border: 2px solid #667eea;">
                                        <tr>
                                            <td colspan="2" style="padding-bottom: 15px;">
                                                <h3 style="color: #667eea; margin: 0; font-size: 18px; font-weight: 600;">Payment Details</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Transaction ID:</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${paymentDetails.txnid}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Amount Paid:</td>
                                            <td style="padding: 8px 0; color: #10b981; font-size: 16px; font-weight: 700;">₹${paymentDetails.amount}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Status:</td>
                                            <td style="padding: 8px 0;">
                                                <span style="background-color: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${paymentDetails.status}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Contact Section -->
                            <tr>
                                <td style="padding: 20px 30px 30px 30px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 15px;">
                                        <tr>
                                            <td>
                                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                                    <strong>Need Help?</strong><br>
                                                    For any queries, please contact:<br>
                                                    <strong>Dr. Mitul Mishra</strong> | <a href="tel:+919876543210" style="color: #92400e; text-decoration: none;">+91 98765 43210</a>
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">We look forward to seeing you at the event!</p>
                                    <p style="color: #6b7280; margin: 0; font-size: 14px;">— Team IDA Nagpur</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}

// Function to generate the HTML for NIDASPORTZ 2025 receipt
function createSportsReceiptHtml(registration, paymentDetails) {
    const sportsList = registration.selectedSports.join(', ');
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f7; padding: 40px 0;">
                <tr>
                    <td align="center">
                        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                            <!-- Header -->
                            <tr>
                                <td style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 1px;">NIDASPORTZ 2025</h1>
                                    <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Sports Registration Confirmed</p>
                                </td>
                            </tr>
                            
                            <!-- Success Message -->
                            <tr>
                                <td style="padding: 40px 30px 20px 30px; text-align: center;">
                                    <div style="display: inline-block; background-color: #10b981; width: 60px; height: 60px; border-radius: 50%; text-align: center; line-height: 60px; margin-bottom: 20px;">
                                        <span style="color: white; font-size: 30px;">✓</span>
                                    </div>
                                    <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">Welcome to the NIDASPORTZ 2025, ${registration.name}!</h2>
                                    <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Your sports registration has been successfully confirmed. Get ready to unleash your athletic spirit!</p>
                                </td>
                            </tr>
                            
                            <!-- Registration Details -->
                            <tr>
                                <td style="padding: 20px 30px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                                        <tr>
                                            <td colspan="2" style="padding-bottom: 15px;">
                                                <h3 style="color: #f59e0b; margin: 0; font-size: 18px; font-weight: 600;">Registration Details</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">User ID:</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${registration.userId}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${registration.email}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Mobile:</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${registration.mobile}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; vertical-align: top;">Selected Sports:</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${sportsList}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Payment Details -->
                            <tr>
                                <td style="padding: 20px 30px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #f59e0b15 0%, #ef444415 100%); border-radius: 8px; padding: 20px; border: 2px solid #f59e0b;">
                                        <tr>
                                            <td colspan="2" style="padding-bottom: 15px;">
                                                <h3 style="color: #f59e0b; margin: 0; font-size: 18px; font-weight: 600;">Payment Details</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Transaction ID:</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${paymentDetails.txnid}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Amount Paid:</td>
                                            <td style="padding: 8px 0; color: #10b981; font-size: 16px; font-weight: 700;">₹${paymentDetails.amount}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Payment Status:</td>
                                            <td style="padding: 8px 0;">
                                                <span style="background-color: #10b981; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600;">${paymentDetails.status}</span>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Contact Section -->
                            <tr>
                                <td style="padding: 20px 30px 30px 30px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 15px;">
                                        <tr>
                                            <td>
                                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                                    <strong>Need Help?</strong><br>
                                                    For any queries, please contact:<br>
                                                    <strong>Dr. Anshul Mahajan</strong> | <a href="tel:+919960403696" style="color: #92400e; text-decoration: none;">+91 99604 03696</a>
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <!-- Footer -->
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">We look forward to seeing you at the event!</p>
                                    <p style="color: #6b7280; margin: 0; font-size: 14px;">— Team IDA Nagpur</p>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;
}

// Main function to send NIDACON emails
export async function sendRegistrationEmail(user, paymentDetails) {
    const ownerEmail = process.env.OWNER_EMAIL;
    const receiptHtml = createReceiptHtml(user, paymentDetails);

    const userMailOptions = {
        from: `"NIDACON 2026" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '✓ Your NIDACON 2026 Registration is Confirmed!',
        html: receiptHtml,
    };

    const ownerMailOptions = {
        from: `"NIDACON Notifier" <${process.env.EMAIL_USER}>`,
        to: ownerEmail,
        subject: `🔔 New NIDACON Registration: ${user.name}`,
        html: `<p style="font-family: Arial, sans-serif; color: #1f2937;">A new user has registered for the event.</p>${receiptHtml}`,
    };

    try {
        await transporter.sendMail(userMailOptions);
        console.log('Confirmation email sent to user:', user.email);
        
        await transporter.sendMail(ownerMailOptions);
        console.log('Notification email sent to owner:', ownerEmail);
    } catch (error) {
        console.error('Error sending registration emails:', error);
    }
}

// Main function to send NIDASPORTZ emails
export async function sendSportsRegistrationEmail(registration, paymentDetails) {
    const ownerEmail = process.env.OWNER_EMAIL;
    const receiptHtml = createSportsReceiptHtml(registration, paymentDetails);

    const userMailOptions = {
        from: `"NIDASPORTZ 2025" <${process.env.EMAIL_USER}>`,
        to: registration.email, 
        subject: '✓ Your NIDASPORTZ 2025 Registration is Confirmed!',
        html: receiptHtml,
    };
    
    const ownerMailOptions = {
        from: `"NIDASPORTZ Notifier" <${process.env.EMAIL_USER}>`,
        to: ownerEmail,
        subject: `🔔 New Sports Registration: ${registration.name}`,
        html: `<p style="font-family: Arial, sans-serif; color: #1f2937;">A new user has registered for the sports event.</p>${receiptHtml}`,
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