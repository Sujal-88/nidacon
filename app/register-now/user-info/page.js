"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, Mail, Phone, Home, Image as ImageIcon, ArrowRight, Info, Receipt, Percent, CircleDollarSign, School, FileText } from 'lucide-react'; // Added Receipt, Percent, CircleDollarSign
import Image from 'next/image';
import { initiatePayment, saveSubmission } from '@/app/actions';

function UserInfoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const registrationType = searchParams.get('type');

  const [formData, setFormData] = useState({
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    mobile: searchParams.get('mobile') || '',
    address: searchParams.get('address') || '',
    // NEW FIELDS
    collegeName: '',
    title: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  // --- State for calculated amounts ---
  const [subtotal, setSubtotal] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // --- Calculate amounts ---
  useEffect(() => {
    const priceString = searchParams.get('price');
    const basePrice = parseFloat(priceString) || 0;

    if (basePrice > 0) {
      const fee = basePrice * 0.025;
      const finalTotal = basePrice + fee;
      setSubtotal(basePrice);
      setPlatformFee(fee);
      setTotalAmount(finalTotal);
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const MAX_FILE_SIZE = 1 * 1024 * 1024; // 5MB
  // Handler for photo upload (keep existing)
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setPhoto(null);
      setPhotoPreview('');
      setErrors(prev => ({ ...prev, photo: null }));
      return;
    }

    // Check 1: File Size
    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, photo: 'Image is too large. Please upload a file under 1MB.' }));
      setPhoto(null);
      setPhotoPreview('');
      return;
    }

    // Check 2: File Type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, photo: 'Invalid file type. Please upload an image.' }));
      setPhoto(null);
      setPhotoPreview('');
      return;
    }

    // Success
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    if (errors.photo) setErrors(prev => ({ ...prev, photo: null }));
  };

  // Form validation (keep existing)
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Full Name is required.';
    if (!formData.email.trim()) newErrors.email = 'Email Address is required.';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email address is invalid.';
    if (!formData.mobile.trim()) newErrors.mobile = 'Mobile Number is required.';
    else if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits.';
    
    // Address is required for everyone
    if (!formData.address.trim()) newErrors.address = 'Address is required.';

    // NEW VALIDATION FOR PAPER/POSTER
    if (registrationType === 'paper-poster') {
        if (!formData.collegeName.trim()) newErrors.collegeName = 'College Name is required.';
        if (!formData.title.trim()) newErrors.title = 'Title of Paper/Poster is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (keep existing)
  const handleSubmit = async (e) => {
  e.preventDefault();
  const formElement = e.currentTarget;
  
  if (!validateForm()) return;
  
  setIsSubmitting(true);
  setErrors({});

  // --- 1. PAPER/POSTER SUBMISSION FLOW ---
  if (registrationType === 'paper-poster') {
    // ... (This part looks fine, keep existing code)
    try {
      // ... existing submission logic ...
    } catch (error) {
      // ... existing catch ...
      setIsSubmitting(false);
    }
    return;
  }

  // --- 2. PAYMENT FLOW ---
  
  // FIX 1: Use 'totalAmount' instead of 'amount'
  if (!totalAmount || totalAmount <= 0) {
    alert("Error: Invalid registration amount. Cannot proceed with payment.");
    setIsSubmitting(false);
    return;
  }

  try { // FIX 2: Added try/catch block for safety
    let photoUrl = '';
    if (photo) {
      // ... (keep your existing photo upload logic) ...
    }

    const txnid = `NIDA${Date.now()}`;
    const memberType = searchParams.get('memberType');
    const subCategory = searchParams.get('subCategory') || '';
    const implantAddon = searchParams.get('implant') === 'true';
    const banquetAddon = searchParams.get('banquet') === 'true';

    let productinfoText = `NIDACON 2026 - ${registrationType}`;
    if (registrationType === 'delegate') {
      productinfoText += ` (${memberType === 'member' ? 'Member' : 'Non-Member'})`;
    } else if (registrationType && registrationType.startsWith('workshop')) {
      const workshops = searchParams.get('workshops');
      if (workshops) productinfoText += ` Workshops: ${workshops}`;
    }

    const formDataObj = new FormData(formElement);
    
    // FIX 3: Use 'totalAmount' here as well
    formDataObj.append('amount', totalAmount.toFixed(2)); 
    
    formDataObj.append('txnid', txnid);
    formDataObj.append('productinfo', productinfoText);
    formDataObj.append('registrationType', registrationType);
    formDataObj.append('memberType', memberType || '');
    formDataObj.append('subCategory', subCategory);
    formDataObj.append('implant', implantAddon.toString());
    formDataObj.append('banquet', banquetAddon.toString());
    
    // FIX 4: Ensure photoUrl is appended if you generated it
    if (photoUrl) {
       formDataObj.append('photoUrl', photoUrl);
    }

    // Server Action Call
    const payuData = await initiatePayment(formDataObj);

    if (payuData.error) {
      alert(`Error initializing payment: ${payuData.error}`);
      setIsSubmitting(false);
      return;
    }

    // Construct PayU Form
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://secure.payu.in/_payment';

    for (const key in payuData) {
      if (payuData.hasOwnProperty(key) && payuData[key] !== null && payuData[key] !== undefined) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = payuData[key];
        form.appendChild(input);
      }
    }
    document.body.appendChild(form);
    form.submit();
    
  } catch (error) {
    console.error("Critical Payment Error:", error);
    alert("An unexpected error occurred. Please try again.");
    setIsSubmitting(false); // Resets button if crash occurs
  }
};
  const isPaymentFlow = registrationType !== 'paper-poster';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <Image src="/NIDACON/nida_logo.png" alt="NIDACON Logo" width={300} height={300} className="mx-auto mb-6" />
            <p className="text-base font-semibold text-purple-600">
              {isPaymentFlow ? 'Step 3 of 3' : 'Final Step'}
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Your Information
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Please provide your details below to complete the process.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            
            {/* --- FORM SECTION --- */}
            <form onSubmit={handleSubmit} id="user-info-form" className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-8 ${isPaymentFlow ? 'md:col-span-2' : 'md:col-span-3'}`}>
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                
                {/* Standard Fields */}
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
                  <div className="mt-2 relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600" required />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Email Address</label>
                  <div className="mt-2 relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600" required />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium leading-6 text-gray-900">Mobile Number</label>
                  <div className="mt-2 relative">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600" required pattern="\d{10}" />
                  </div>
                  {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium leading-6 text-gray-900">Address</label>
                  <div className="mt-2 relative">
                    <Home className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                    <textarea name="address" rows={3} value={formData.address} onChange={handleChange} className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600" required></textarea>
                  </div>
                  {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                </div>

                {/* --- NEW FIELDS ONLY FOR PAPER/POSTER --- */}
                {registrationType === 'paper-poster' && (
                  <>
                    <div className="sm:col-span-2 border-t pt-6 mt-2">
                      <h3 className="text-lg font-semibold text-purple-800 mb-4">Academic Details</h3>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900">College / Institute Name</label>
                      <div className="mt-2 relative">
                        <School className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600" placeholder="Enter your college name" />
                      </div>
                      {errors.collegeName && <p className="mt-1 text-xs text-red-600">{errors.collegeName}</p>}
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium leading-6 text-gray-900">Title of Paper / Poster</label>
                      <div className="mt-2 relative">
                        <FileText className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" name="title" value={formData.title} onChange={handleChange} className="block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-purple-600" placeholder="Enter the full title" />
                      </div>
                      {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
                    </div>
                  </>
                )}
              </div>

              {errors.form && <div className="rounded-md bg-red-50 p-4"><p className="text-sm font-medium text-red-800">{errors.form}</p></div>}

              {/* Submit Button for Paper/Poster (No Payment Side) */}
              {!isPaymentFlow && (
                <div className="pt-6 border-t border-gray-200">
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-all disabled:opacity-50 flex items-center justify-center">
                    {isSubmitting ? 'Submitting...' : <>Finalize Submission <ArrowRight className="inline w-5 h-5 ml-2" /></>}
                  </button>
                </div>
              )}
            </form>

            {/* --- PAYMENT SIDEBAR (Only for Payment Flows) --- */}
            {isPaymentFlow && (
              <div className="md:col-span-1">
                <div className="sticky top-24 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-3">Payment Summary</h2>
                  <div className="space-y-4 text-sm text-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="flex items-center"><Receipt size={16} className="mr-2 text-gray-400" /> Base Amount:</span>
                      <span className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="flex items-center"><Percent size={16} className="mr-2 text-gray-400" /> Platform Fee (2.5%):</span>
                      <span className="font-medium text-gray-800">₹{platformFee.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="my-5 border-t border-dashed border-gray-300"></div>
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-6">
                    <span className="flex items-center"><CircleDollarSign size={20} className="mr-2 text-purple-600" /> Total Payable:</span>
                    <span className="text-2xl text-purple-600">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <button type="submit" form="user-info-form" disabled={isSubmitting || totalAmount <= 0} className="w-full py-3 px-6 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center">
                    {isSubmitting ? 'Processing...' : <>Proceed to Payment <ArrowRight className="inline w-5 h-5 ml-2" /></>}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

// Keep Suspense wrapper
export default function UserInfoPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen text-lg font-semibold text-gray-600">Loading form...</div>}>
      <UserInfoForm />
    </Suspense>
  );
}