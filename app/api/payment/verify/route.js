// // app/api/payment/verify/route.js
// import { NextResponse } from 'next/server';
// import { verifyHash } from '@/lib/payu-utils';
// import { prisma } from '@/lib/prisma';
// import { generateUserId } from '@/lib/userId';
// import { sendRegistrationEmail } from '@/lib/email';

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const merchantSalt = process.env.PAYU_MERCHANT_SALT;

//     if (!merchantSalt) {
//       return NextResponse.json(
//         { error: 'PayU configuration missing' },
//         { status: 500 }
//       );
//     }

//     const isValidHash = verifyHash(body, merchantSalt);

//     if (!isValidHash) {
//       return NextResponse.json(
//         { error: 'Invalid hash - transaction verification failed' },
//         { status: 400 }
//       );
//     }

//     const isSuccess = body.status === 'success';

//     if (isSuccess) {
//       const userId = await generateUserId();
//       const newUser = await prisma.user.create({
//         data: {
//           userId: userId,
//           name: body.firstname,
//           email: body.email,
//           mobile: body.phone,
//           address: body.udf1,
//           registrationType: body.udf2,
//           memberType: body.udf3,
//           subCategory: body.udf4,
//         }
//       });

//       await sendRegistrationEmail(newUser, {
//         txnid: body.txnid,
//         amount: body.amount,
//         status: body.status,
//       });

//       return NextResponse.json({
//         success: true,
//         message: 'Payment verified successfully',
//         transactionId: body.txnid,
//         payuId: body.mihpayid,
//         amount: body.amount,
//         status: body.status,
//         userId: newUser.userId
//       });
//     } else {
//       return NextResponse.json({
//         success: false,
//         message: 'Payment verification failed',
//         error: body.error_Message || 'Payment failed',
//         transactionId: body.txnid,
//         status: body.status,
//       });
//     }

//   } catch (error) {
//     console.error('Payment verification error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }
// app/api/payment/verify/route.js
import { NextResponse } from 'next/server';
import { verifyHash } from '@/lib/payu-utils';
import { prisma } from '@/lib/prisma';
import { generateUserId } from '@/lib/userId';
import { sendRegistrationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const body = await request.json();
    const merchantSalt = process.env.PAYU_MERCHANT_SALT;

    if (!merchantSalt) {
      return NextResponse.json(
        { error: 'PayU configuration missing' },
        { status: 500 }
      );
    }

    const isValidHash = verifyHash(body, merchantSalt);

    if (!isValidHash) {
      return NextResponse.json(
        { error: 'Invalid hash - transaction verification failed' },
        { status: 400 }
      );
    }

    const isSuccess = body.status === 'success';

    if (isSuccess) {
      const userId = await generateUserId();
      const newUser = await prisma.user.create({
        data: {
          userId: userId,
          name: body.firstname,
          email: body.email,
          mobile: body.phone,
          address: body.udf1,
          registrationType: body.udf2,
          memberType: body.udf3,
          subCategory: body.udf4,
        }
      });

      await sendRegistrationEmail(newUser, {
        txnid: body.txnid,
        amount: body.amount,
        status: body.status,
      });

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        transactionId: body.txnid,
        payuId: body.mihpayid,
        amount: body.amount,
        status: body.status,
        userId: newUser.userId
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Payment verification failed',
        error: body.error_Message || 'Payment failed',
        transactionId: body.txnid,
        status: body.status,
      });
    }

  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}