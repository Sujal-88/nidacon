export async function POST(request) {
  console.log("⚠️ ROOT ROUTE: Received POST (this should not happen)");
  
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);
    
    console.log("📋 Misdirected PayU data:", {
      status: data.status,
      txnid: data.txnid,
      keys: Object.keys(data)
    });
    
    // Redirect to the correct success/failure handler based on status
    if (data.status === 'success') {
      console.log("↗️ Redirecting to success handler");
      return NextResponse.redirect(new URL('/api/payment/success', request.url), { 
        status: 307,  // Preserve POST method
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
    } else {
      console.log("↗️ Redirecting to failure handler");
      return NextResponse.redirect(new URL('/api/payment/failure', request.url), { 
        status: 307,  // Preserve POST method
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
    }
    
  } catch (error) {
    console.error("💥 ROOT ROUTE ERROR:", error);
    return NextResponse.redirect(new URL('/payment/failure?error=routing_error', request.url));
  }
}