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

const formatText = (text) => {
    if (!text) return 'N/A';
    return text
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

// Function to generate the HTML for NIDACON 2026 receipt
function createReceiptHtml(user, paymentDetails) {
    const mobilePassword = user.mobile || 'NOT_FOUND';

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
                    <tr>
                        <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 1px;">NIDACON 2026</h1>
                            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Registration Confirmed</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 40px 30px 20px 30px; text-align: center;">
                            <div style="display: inline-block; background-color: #10b981; width: 60px; height: 60px; border-radius: 50%; text-align: center; line-height: 60px; margin-bottom: 20px;">
                                <span style="color: white; font-size: 30px;">✓</span>
                            </div>
                            <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">Thank You, ${user.name}!</h2>
                            <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Your registration has been successfully confirmed. We're thrilled to have you join us at NIDACON 2026!</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 20px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px;">
                                <tr>
                                    <td colspan="2" style="padding-bottom: 15px;">
                                        <h3 style="color: #92400e; margin: 0; font-size: 18px; font-weight: 600;">Your Login Credentials</h3>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #b45309; font-size: 14px; width: 40%;">Your User ID:</td>
                                    <td style="padding: 8px 0; color: #92400e; font-size: 16px; font-weight: 700;">${user.userId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #b45309; font-size: 14px;">Your Password:</td>
                                    <td style="padding: 8px 0; color: #92400e; font-size: 16px; font-weight: 700;">${mobilePassword}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding-top: 15px;">
                                        <p style="color: #b45309; font-size: 12px; margin: 0;">Please use these details to log in to the event portal. Your password is your registered mobile number.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 20px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #dcfce7; border: 2px solid #25D366; border-radius: 8px; padding: 20px;">
                                <tr>
                                    <td style="text-align: center;">
                                        <div style="display: inline-block; background-color: #25D366; width: 50px; height: 50px; border-radius: 50%; text-align: center; line-height: 50px; margin-bottom: 15px;">
                                            <span style="color: white; font-size: 28px; font-weight: bold;">📱</span>
                                        </div>
                                        <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Join Our NIDACON WhatsApp</h3>
                                        <p style="color: #15803d; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">Connect with fellow attendees, get event updates, and stay informed about NIDACON 2026!</p>
                                        <a href="https://chat.whatsapp.com/J2zI20Gdnw7I11LW1KIZKc?mode=hqrt1" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(37, 211, 102, 0.3);">
                                            Join WhatsApp Group
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

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
                                    <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${formatText(user.registrationType)}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
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
                    
                    <tr>
                        <td style="padding: 20px 30px 30px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 15px;">
                                <tr>
                                    <td>
                                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                            <strong>Need Help?</strong><br>
                                            For any queries, please contact:<br>
                                            <strong>Dr. Anshul Mahajan</strong> | <a href="tel:+919960403696" style="color: #92400e; text-decoration: none;">+91 98765 43210</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
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
    const mobilePassword = registration.mobile || 'NOT_FOUND';

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
                            <tr>
                                <td style="background: linear-gradient(135deg, #f59e0b 0%, #ef4444 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 1px;">NIDASPORTZ 2025</h1>
                                    <p style="color: #fef3c7; margin: 10px 0 0 0; font-size: 16px;">Sports Registration Confirmed</p>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="padding: 40px 30px 20px 30px; text-align: center;">
                                    <div style="display: inline-block; background-color: #10b981; width: 60px; height: 60px; border-radius: 50%; text-align: center; line-height: 60px; margin-bottom: 20px;">
                                        <span style="color: white; font-size: 30px;">✓</span>
                                    </div>
                                    <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">Welcome to the NIDASPORTZ 2025, ${registration.name}!</h2>
                                    <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Your sports registration has been successfully confirmed. Get ready to unleash your athletic spirit!</p>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 20px 30px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px;">
                                        <tr>
                                            <td colspan="2" style="padding-bottom: 15px;">
                                                <h3 style="color: #92400e; margin: 0; font-size: 18px; font-weight: 600;">Your Login Credentials</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #b45309; font-size: 14px; width: 40%;">Your User ID:</td>
                                            <td style="padding: 8px 0; color: #92400e; font-size: 16px; font-weight: 700;">${registration.userId}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #b45309; font-size: 14px;">Your Password:</td>
                                            <td style="padding: 8px 0; color: #92400e; font-size: 16px; font-weight: 700;">${mobilePassword}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" style="padding-top: 15px;">
                                                <p style="color: #b45309; font-size: 12px; margin: 0;">Please use these details to log in to the sports portal. Your password is your registered mobile number.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
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

// Function to generate the HTML for Workshops receipt
function createWorkshopReceiptHtml(user, paymentDetails) {
    const mobilePassword = user.mobile || 'NOT_FOUND';
    // Assume workshops are stored in user.workshops array
    let workshopList = 'No workshops selected';

    // 1. Check if workshops exist
    if (user.workshops && Array.isArray(user.workshops)) {
        // 2. Check if it is the new Prisma Schema (Array of Objects)
        if (user.workshops.length > 0 && typeof user.workshops[0] === 'object') {
            // Find the specific registration for THIS transaction
            const currentRegistration = user.workshops.find(w => w.transactionId === paymentDetails.txnid);
            
            if (currentRegistration) {
                // Found the matching payment, use these workshops
                workshopList = Array.isArray(currentRegistration.workshops) 
                    ? currentRegistration.workshops.join(', ') 
                    : currentRegistration.workshops;
            } else {
                // Fallback: If we can't match the transaction ID (rare), 
                // list all workshops from all registrations nicely.
                workshopList = user.workshops
                    .flatMap(r => r.workshops) // Flatten all workshop arrays
                    .join(', ');
            }
        } 
        // 3. Handle Legacy/Simple Case (Array of Strings)
        else {
            workshopList = user.workshops.join(', ');
        }
    } 
    // 4. Fallback to subCategory if needed
    else if (user.subCategory) {
        workshopList = user.subCategory;
    }
    
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
                            <tr>
                                <td style="background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 1px;">NIDACON Workshops</h1>
                                    <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Workshop Registration Confirmed</p>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="padding: 40px 30px 20px 30px; text-align: center;">
                                    <div style="display: inline-block; background-color: #10b981; width: 60px; height: 60px; border-radius: 50%; text-align: center; line-height: 60px; margin-bottom: 20px;">
                                        <span style="color: white; font-size: 30px;">✓</span>
                                    </div>
                                    <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">Registration Successful, ${user.name}!</h2>
                                    <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Your seat has been reserved for the selected workshop(s). We are excited to have you learn with us.</p>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 20px 30px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px;">
                                        <tr>
                                            <td colspan="2" style="padding-bottom: 15px;">
                                                <h3 style="color: #92400e; margin: 0; font-size: 18px; font-weight: 600;">Your Login Credentials</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #b45309; font-size: 14px; width: 40%;">Your User ID:</td>
                                            <td style="padding: 8px 0; color: #92400e; font-size: 16px; font-weight: 700;">${user.userId}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #b45309; font-size: 14px;">Your Password:</td>
                                            <td style="padding: 8px 0; color: #92400e; font-size: 16px; font-weight: 700;">${mobilePassword}</td>
                                        </tr>
                                        <tr>
                                            <td colspan="2" style="padding-top: 15px;">
                                                <p style="color: #b45309; font-size: 12px; margin: 0;">Please use these details to log in to the event portal. Your password is your registered mobile number.</p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 20px 30px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                                        <tr>
                                            <td colspan="2" style="padding-bottom: 15px;">
                                                <h3 style="color: #0891b2; margin: 0; font-size: 18px; font-weight: 600;">Workshop Details</h3>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Registered Workshops:</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600; line-height: 1.4;">${workshopList}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">User ID:</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${user.userId}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td>
                                            <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${user.email}</td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="padding: 20px 30px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #06b6d415 0%, #3b82f615 100%); border-radius: 8px; padding: 20px; border: 2px solid #0891b2;">
                                        <tr>
                                            <td colspan="2" style="padding-bottom: 15px;">
                                                <h3 style="color: #0891b2; margin: 0; font-size: 18px; font-weight: 600;">Payment Details</h3>
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
                            
                            <tr>
                                <td style="padding: 20px 30px 30px 30px;">
                                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 15px;">
                                        <tr>
                                            <td>
                                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                                    <strong>Need Help?</strong><br>
                                                    For any workshop queries, please contact:<br>
                                                    <strong>Dr. Anshul Mahajan</strong> | <a href="tel:+919960403696" style="color: #92400e; text-decoration: none;">+91 98765 43210</a>
                                                </p>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            
                            <tr>
                                <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                                    <p style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">We look forward to your participation!</p>
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

function createMembershipReceiptHtml(user, paymentDetails) {
    const mobilePassword = user.mobile || 'NOT_FOUND';
    // Format the memberType correctly
    const displayMemberType = formatText(user.memberType);

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
                    <tr>
                        <td style="background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 32px; font-weight: bold; letter-spacing: 1px;">IDA Nagpur Membership</h1>
                            <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">Membership Confirmed</p>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 40px 30px 20px 30px; text-align: center;">
                            <div style="display: inline-block; background-color: #10b981; width: 60px; height: 60px; border-radius: 50%; text-align: center; line-height: 60px; margin-bottom: 20px;">
                                <span style="color: white; font-size: 30px;">✓</span>
                            </div>
                            <h2 style="color: #1f2937; margin: 0 0 10px 0; font-size: 24px;">Welcome, ${user.name}!</h2>
                            <p style="color: #6b7280; margin: 0; font-size: 16px; line-height: 1.6;">Your IDA Nagpur membership has been successfully confirmed. We're thrilled to have you as a member.</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 20px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px;">
                                <tr>
                                    <td colspan="2" style="padding-bottom: 15px;">
                                        <h3 style="color: #92400e; margin: 0; font-size: 18px; font-weight: 600;">Your Membership Credentials</h3>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #b45309; font-size: 14px; width: 40%;">Your Member ID:</td>
                                    <td style="padding: 8px 0; color: #92400e; font-size: 16px; font-weight: 700;">${user.memberId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #b45309; font-size: 14px;">Your Password:</td>
                                    <td style="padding: 8px 0; color: #92400e; font-size: 16px; font-weight: 700;">${mobilePassword}</td>
                                </tr>
                                <tr>
                                    <td colspan="2" style="padding-top: 15px;">
                                        <p style="color: #b45309; font-size: 12px; margin: 0;">Please use these details to log in to the member portal. Your password is your registered mobile number.</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 20px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #dcfce7; border: 2px solid #25D366; border-radius: 8px; padding: 20px;">
                                <tr>
                                    <td style="text-align: center;">
                                        <div style="display: inline-block; background-color: #25D366; width: 50px; height: 50px; border-radius: 50%; text-align: center; line-height: 50px; margin-bottom: 15px;">
                                            <span style="color: white; font-size: 28px; font-weight: bold;">📱</span>
                                        </div>
                                        <h3 style="color: #166534; margin: 0 0 10px 0; font-size: 18px; font-weight: 600;">Join Our WhatsApp Group</h3>
                                        <p style="color: #15803d; margin: 0 0 20px 0; font-size: 14px; line-height: 1.6;">Stay connected with fellow members, get instant updates !</p>
                                        <a href="https://chat.whatsapp.com/CzGGgEW3See3z4M63hWceg?mode=hqrt1" style="display: inline-block; background-color: #25D366; color: #ffffff; text-decoration: none; padding: 14px 30px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 2px 4px rgba(37, 211, 102, 0.3);">
                                            Join WhatsApp Group
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 20px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f9fafb; border-radius: 8px; padding: 20px;">
                                <tr>
                                    <td colspan="2" style="padding-bottom: 15px;">
                                        <h3 style="color: #007bff; margin: 0; font-size: 18px; font-weight: 600;">Membership Details</h3>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 40%;">Member ID:</td>
                                    <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${user.memberId}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Email:</td>
                                    <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${user.email}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Membership Type:</td>
                                    <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${displayMemberType}</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 20px 30px 30px 30px;">
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 15px;">
                                <tr>
                                    <td>
                                        <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                            <strong>Need Help?</strong><br>
                                            For any membership queries, please contact:<br>
                                            <strong>Dr. Anshul Mahajan</strong> | <a href="tel:+919960403696" style="color: #92400e; text-decoration: none;">+91 98765 43210</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="color: #1f2937; margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">We look forward to your active participation!</p>
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

export async function sendMembershipEmail(user, paymentDetails) {
    const ownerEmail = process.env.OWNER_EMAIL;
    const receiptHtml = createMembershipReceiptHtml(user, paymentDetails);

    const userMailOptions = {
        from: `"IDA Nagpur" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '✓ Your IDA Nagpur Membership is Confirmed!',
        html: receiptHtml,
    };

    const ownerMailOptions = {
        from: `"IDA Nagpur Notifier" <${process.env.EMAIL_USER}>`,
        to: ownerEmail,
        subject: `🔔 New Membership Registration: ${user.name}`,
        html: `<p style="font-family: Arial, sans-serif; color: #1f2937;">A new user has registered for membership.</p>${receiptHtml}`,
    };

    try {
        await transporter.sendMail(userMailOptions);
        console.log('Membership confirmation email sent to user:', user.email);

        await transporter.sendMail(ownerMailOptions);
        console.log('Membership notification email sent to owner:', ownerEmail);
    } catch (error) {
        console.error('Error sending membership emails:', error);
    }
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
        if (registration.email) {
            await transporter.sendMail(userMailOptions);
            console.log('Sports confirmation email sent to user:', registration.email);
        }
        await transporter.sendMail(ownerMailOptions);
        console.log('Sports notification email sent to owner:', ownerEmail);
    } catch (error) {
        console.error('Error sending sports registration emails:', error);
    }
}

// NEW: Main function to send Workshop emails
export async function sendWorkshopEmail(user, paymentDetails) {
    const ownerEmail = process.env.OWNER_EMAIL;
    const receiptHtml = createWorkshopReceiptHtml(user, paymentDetails);

    const userMailOptions = {
        from: `"NIDACON Workshops" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: '✓ Your Workshop Registration is Confirmed!',
        html: receiptHtml,
    };

    const ownerMailOptions = {
        from: `"Workshop Notifier" <${process.env.EMAIL_USER}>`,
        to: ownerEmail,
        subject: `🔔 New Workshop Registration: ${user.name}`,
        html: `<p style="font-family: Arial, sans-serif; color: #1f2937;">A new user has registered for a workshop.</p>${receiptHtml}`,
    };

    try {
        await transporter.sendMail(userMailOptions);
        console.log('Workshop confirmation email sent to user:', user.email);

        await transporter.sendMail(ownerMailOptions);
        console.log('Workshop notification email sent to owner:', ownerEmail);
    } catch (error) {
        console.error('Error sending workshop emails:', error);
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
