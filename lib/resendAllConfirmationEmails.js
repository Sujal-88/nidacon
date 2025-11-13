// scripts/resendAllConfirmationEmails.js
// This script re-sends confirmation emails to all users based on their
// current registration type and membership status, using the templates
// from lib/email.js.

import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import 'dotenv/config'; // Make sure .env variables are loaded

const prisma = new PrismaClient();

// --- CONFIGURATION ---
const CONFIG = {
  // A short delay (in milliseconds) between each email to avoid
  // being rate-limited or marked as spam. 500ms is a safe value.
  DELAY_BETWEEN_EMAILS: 500,

  // Set this to true to run a "test" without actually sending emails.
  // It will log who it *would* have emailed.
  DRY_RUN: false, // Set to false to send emails for real.
};
// ---------------------------------

// --- 1. COPIED FROM YOUR lib/email.js ---
// We copy all the functions directly into this script to make it self-contained.

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

function createMembershipReceiptHtml(user, paymentDetails) {
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
                                        <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">${user.memberType}</td>
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

// Main function to send NIDACON emails
async function sendRegistrationEmail(user, paymentDetails) {
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
    if (CONFIG.DRY_RUN) {
      console.log(`[DRY RUN] Would send NIDACON email to ${user.email}`);
      return;
    }
    await transporter.sendMail(userMailOptions);
    console.log('Confirmation email sent to user:', user.email);
    
    await transporter.sendMail(ownerMailOptions);
    console.log('Notification email sent to owner:', ownerEmail);
  } catch (error) {
    console.error('Error sending registration emails:', error);
  }
}

// Main function to send Membership emails
async function sendMembershipEmail(user, paymentDetails) {
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
    if (CONFIG.DRY_RUN) {
      console.log(`[DRY RUN] Would send Membership email to ${user.email}`);
      return;
    }
    await transporter.sendMail(userMailOptions);
    console.log('Membership confirmation email sent to user:', user.email);
    
    await transporter.sendMail(ownerMailOptions);
    console.log('Membership notification email sent to owner:', ownerEmail);
  } catch (error) {
    console.error('Error sending membership emails:', error);
  }
}

// --- END OF COPIED CODE ---

/**
 * Helper function for the delay
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Main script function
 */
async function main() {
  console.log('Starting bulk email resend script...');
  if (CONFIG.DRY_RUN) {
    console.log('*********************************');
    console.log('**** RUNNING IN DRY-RUN    ****');
    console.log('**** NO EMAILS WILL BE SENT ****');
    console.log('*********************************');
  }

  // 1. Check for all required .env variables
  const requiredEnv = ['EMAIL_HOST', 'EMAIL_PORT', 'EMAIL_USER', 'EMAIL_PASS', 'OWNER_EMAIL'];
  let missingEnv = false;
  for (const key of requiredEnv) {
    if (!process.env[key]) {
      console.error(`❌ ERROR: ${key} is not set in your .env file.`);
      missingEnv = true;
    }
  }
  if (missingEnv) {
    console.error('Please add all required email variables to your .env or .env.local file.');
    return;
  }

  // 2. Define the database query
  const whereClause = {};
  if (CONFIG.USER_TYPE_TO_EMAIL) {
    whereClause.registrationType = CONFIG.USER_TYPE_TO_EMAIL;
    console.log(`Fetching all users with registrationType: "${CONFIG.USER_TYPE_TO_EMAIL}"`);
  } else {
    console.log('Fetching ALL users in the database.');
  }

  // 3. Fetch all users from the database
  const users = await prisma.user.findMany({
    where: whereClause,
    select: {
      email: true,
      name: true,
      userId: true,
      memberId: true,
      mobile: true,
      registrationType: true,
      paymentStatus: true,
      paymentAmount: true,
      transactionId: true,
    },
  });

  if (users.length === 0) {
    console.log('No users found matching your criteria. Exiting.');
    return;
  }

  console.log(`Found ${users.length} total users to process.`);
  let nidaconEmailsSent = 0;
  let memberEmailsSent = 0;
  let skippedCount = 0;

  // 4. Loop through and send email to each user
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    console.log(`\nProcessing user ${i + 1} of ${users.length}: ${user.email}`);
    
    // Create the paymentDetails object from the user's data
    const paymentDetails = {
      txnid: user.transactionId || 'N/A',
      amount: user.paymentAmount || 0,
      status: user.paymentStatus === 'success' ? 'Success' : 'Pending',
    };

    let sentAnEmail = false;

    // --- LOGIC FOR NIDACON REGISTRATION EMAIL ---
    // (delegate, workshop, paper-poster, etc. - but NOT 'membership' or 'sports')
    const isNidaconReg = user.registrationType && user.registrationType !== 'membership' && user.registrationType !== 'sports';
    
    if (isNidaconReg) {
      if (!user.userId || !user.mobile) {
        console.warn(`SKIPPING NIDACON email: User ${user.email} is missing a UserID or Mobile (for password).`);
        skippedCount++;
      } else {
        await sendRegistrationEmail(user, paymentDetails);
        nidaconEmailsSent++;
        sentAnEmail = true;
      }
    }

    // --- LOGIC FOR MEMBERSHIP EMAIL ---
    if (user.memberId) {
      if (!user.mobile) {
        console.warn(`SKIPPING Membership email: User ${user.email} is missing a Mobile (for password).`);
        skippedCount++;
      } else {
        // If we already sent the NIDACON email, wait before sending this one
        if (sentAnEmail) {
          await wait(CONFIG.DELAY_BETWEEN_EMAILS);
        }
        await sendMembershipEmail(user, paymentDetails);
        memberEmailsSent++;
        sentAnEmail = true;
      }
    }

    if (!isNidaconReg && !user.memberId) {
      console.log(`SKIPPING: User ${user.email} has no NIDACON reg or Member ID.`);
      skippedCount++;
    }

    // Wait for the specified delay before moving to the *next user*
    if (sentAnEmail) {
      await wait(CONFIG.DELAY_BETWEEN_EMAILS);
    }
  }

  // 5. Log the final summary
  console.log('\n--- Bulk Email Send Complete ---');
  console.log(`Total users processed: ${users.length}`);
  console.log(`NIDACON emails sent: ${nidaconEmailsSent}`);
  console.log(`Membership emails sent: ${memberEmailsSent}`);
  console.log(`Skipped (missing data or no type): ${skippedCount}`);
  console.log('----------------------------------');
}

// Run the script
main()
  .catch((e) => {
    console.error('A critical error occurred:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Database connection closed.');
  });