// app/register-now/user-info/page.js
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, Mail, Phone, Home, Image as ImageIcon, ArrowRight, Info, Receipt, Percent, CircleDollarSign } from 'lucide-react'; // Added Receipt, Percent, CircleDollarSign
import Image from 'next/image';
import { initiatePayment, saveSubmission } from '@/app/actions';

function UserInfoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for form fields, photo, errors, submitting status
  const [formData, setFormData] = useState({
    name: searchParams.get('name') || '',
    email: searchParams.get('email') || '',
    mobile: searchParams.get('mobile') || '',
    address: searchParams.get('address') || '',
  });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- State for calculated amounts ---
  const [subtotal, setSubtotal] = useState(0);
  const [platformFee, setPlatformFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // --- Calculate amounts ---
  useEffect(() => {
    const priceString = searchParams.get('price');
    const basePrice = parseFloat(priceString) || 0;

    if (basePrice > 0) {
      const fee = basePrice * 0.025; // Calculate 2.5% fee
      const finalTotal = basePrice + fee;

      setSubtotal(basePrice);
      setPlatformFee(fee);
      setTotalAmount(finalTotal);
    } else {
      setSubtotal(0);
      setPlatformFee(0);
      setTotalAmount(0);
    }
  }, [searchParams]);

  // Handler for text input changes (keep existing)
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
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
      setErrors(prev => ({ ...prev, photo: 'Image is too large. Please upload a file under 5MB.' }));
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
    if (!formData.address.trim()) newErrors.address = 'Address is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission (keep existing)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);
    setErrors({});

    const registrationType = searchParams.get('type');
    const memberType = searchParams.get('memberType');
    const subCategory = searchParams.get('subCategory') || '';
    const amount = totalAmount; // Use state variable
    const implantAddon = searchParams.get('implant') === 'true';
    const banquetAddon = searchParams.get('banquet') === 'true';

    // --- PAPER/POSTER SUBMISSION LOGIC (Keep existing) ---
    if (registrationType === 'paper-poster') {
      try {
        const submissionData = {
          name: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
          paperCategory: searchParams.get('paperCat') || null,
          abstractUrl: searchParams.get('abstractUrl') || null,
          paperUrl: searchParams.get('paperUrl') || null,
          posterCategory: searchParams.get('posterCat') || null,
          posterUrl: searchParams.get('posterUrl') || null,
        };
        const result = await saveSubmission(submissionData);
        if (result.success) {
          router.push('/register-now/submission-success');
        } else {
          throw new Error(result.error || 'Failed to save submission');
        }
      } catch (error) {
        console.error("Submission save error:", error);
        setErrors(prev => ({ ...prev, form: error.message || 'Could not save submission.' }));
        setIsSubmitting(false);
      }
      return;
    }
    // --- END PAPER/POSTER SUBMISSION LOGIC ---


    // --- PAYMENT LOGIC (Keep existing) ---
    if (!amount || amount <= 0) {
      alert("Error: Invalid registration amount. Cannot proceed with payment.");
      setIsSubmitting(false);
      return;
    }

    let photoUrl = '';
    if (photo) {
      const uploadFormData = new FormData();
      uploadFormData.append('file', photo);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });
        const result = await response.json();
        if (response.ok && result.url) {
          photoUrl = result.url;
        } else {
          throw new Error(result.message || 'Upload failed');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        setErrors(prev => ({ ...prev, form: 'Error uploading image. Please try again.' }));
        setIsSubmitting(false);
        return;
      }
    }

    const txnid = `NIDA${Date.now()}`;
    let productinfoText = `NIDACON 2026 - ${registrationType}`;
    if (registrationType === 'delegate') {
      productinfoText += ` (${memberType === 'member' ? 'Member' : 'Non-Member'})`;
      if (implantAddon) productinfoText += ' + Implant';
      if (banquetAddon) productinfoText += ' + Banquet';
    } else if (registrationType === 'workshop-registered' || registrationType === 'workshop-only') {
      const workshops = searchParams.get('workshops');
      if (workshops) productinfoText += ` Workshops: ${workshops}`;
    } else if (registrationType === 'membership') {
      productinfoText += ` - ${memberType}`;
    }

    const formElement = e.currentTarget;
    const formDataObj = new FormData(formElement);
    formDataObj.append('amount', amount.toFixed(2));
    formDataObj.append('txnid', txnid);
    formDataObj.append('productinfo', productinfoText);
    formDataObj.append('registrationType', registrationType);
    formDataObj.append('memberType', memberType || '');
    formDataObj.append('subCategory', subCategory);
    formDataObj.append('implant', implantAddon.toString());
    formDataObj.append('banquet', banquetAddon.toString());

    // Append photo if it exists
    if (photo) {
      formDataObj.append('photo', photo);
    }

    const payuData = await initiatePayment(formDataObj);

    if (payuData.error) {
      alert(`Error initializing payment: ${payuData.error}`);
      setIsSubmitting(false);
      return;
    }

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://secure.payu.in/_payment'; // Use test URL if needed

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
  };

  const isPaymentFlow = searchParams.get('type') !== 'paper-poster';

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto"> {/* Adjusted max-width */}
          {/* Header (keep existing) */}
          <div className="text-center">
            {/* ADDED: NIDACON Logo */}
            <Image
              src="/NIDACON/nida_logo.png"
              alt="NIDACON Logo"
              width={300}
              height={300}
              className="mx-auto mb-6"
            />
            <p className="text-base font-semibold text-purple-600">
              {isPaymentFlow ? 'Step 3 of 3' : 'Step 2 of 2'}
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Your Information
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              {isPaymentFlow
                ? "Please provide your details below and confirm the payment summary."
                : "Please provide your details below. This information will be used for communication regarding your submission."}
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Form - Takes 2 columns on medium screens */}
            <form onSubmit={handleSubmit} id="user-info-form" className="md:col-span-2 bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-8">
              {/* Form Fields (keep existing) */}
              {/* ... (Name, Email, Mobile, Address, Photo fields - unchanged) ... */}
              <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
                  <div className="mt-2 relative">
                    <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${errors.name ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600`} required />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                {/* Email Address */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email Address</label>
                  <div className="mt-2 relative">
                    <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600`} required />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                </div>

                {/* Mobile Number */}
                <div>
                  <label htmlFor="mobile" className="block text-sm font-medium leading-6 text-gray-900">Mobile Number</label>
                  <div className="mt-2 relative">
                    <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input type="tel" name="mobile" id="mobile" value={formData.mobile} onChange={handleChange} className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${errors.mobile ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600`} required pattern="\d{10}" title="Mobile number must be 10 digits" />
                  </div>
                  {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                </div>

                {/* Full Address */}
                <div className="sm:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">Full Address</label>
                  <div className="mt-2 relative">
                    <Home className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                    <textarea name="address" id="address" rows={3} value={formData.address} onChange={handleChange} className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${errors.address ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600`} required></textarea>
                  </div>
                  {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
                </div>

                {/* Profile Photo (Optional) - Only show if not paper/poster */}
                {searchParams.get('type') !== 'paper-poster' && (
                  <div className="sm:col-span-2">
                    <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">Profile Photo <span className="text-xs text-gray-500">(Optional)</span></label>
                    <div className="mt-2 flex items-center gap-x-3">
                      {photoPreview ? (
                        <Image src={photoPreview} alt="Photo preview" className="h-16 w-16 rounded-full object-cover" width={64} height={64} />
                      ) : (
                        <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                      <label htmlFor="photo-upload" className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <span>Upload photo</span>
                        <input id="photo-upload" name="photo-upload-field" type="file" onChange={handlePhotoChange} className="sr-only" accept="image/*" />
                      </label>
                    </div>
                    {errors.photo && <p className="mt-1 text-xs text-red-600">{errors.photo}</p>}
                  </div>
                )}
              </div>

              {/* Display Form-wide Error (keep existing) */}
              {errors.form && (
                <div className="rounded-md bg-red-50 p-4">
                  <p className="text-sm font-medium text-red-800">{errors.form}</p>
                </div>
              )}

              {/* Submit Button Section (Only if NOT Payment Flow - keep existing) */}
              {!isPaymentFlow && (
                <div className="pt-6 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      <>Submit Details <ArrowRight className="inline w-5 h-5 ml-2" /></>
                    )}
                  </button>
                </div>
              )}
            </form>

            {/* --- IMPROVED Payment Summary Sidebar --- */}
            {isPaymentFlow && (
              <div className="md:col-span-1">
                <div className="sticky top-24 bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
                  <h2 className="text-xl font-bold mb-6 text-gray-900 border-b pb-3">Payment Summary</h2>
                  <div className="space-y-4 text-sm"> {/* Reduced text size for items */}
                    {/* Base Amount */}
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="flex items-center">
                        <Receipt size={16} className="mr-2 text-gray-400" />
                        Base Amount:
                      </span>
                      <span className="font-medium text-gray-800">₹{subtotal.toFixed(2)}</span>
                    </div>

                    {/* Platform Fee */}
                    <div className="flex justify-between items-center text-gray-600">
                      <span className="flex items-center">
                        <Percent size={16} className="mr-2 text-gray-400" />
                        Platform Fee (2.5%):
                        {/* Tooltip Icon */}
                        <span className="ml-1.5 group relative flex items-center justify-center">
                          <Info size={14} className="text-gray-400 cursor-help" />
                          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 text-xs text-white bg-gray-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-lg">
                            A small fee for payment processing and platform maintenance.
                            <svg className="absolute text-gray-700 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255"><polygon className="fill-current" points="0,0 127.5,127.5 255,0" /></svg>
                          </span>
                        </span>
                      </span>
                      <span className="font-medium text-gray-800">₹{platformFee.toFixed(2)}</span>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="my-5 border-t border-dashed border-gray-300"></div>

                  {/* Total Payable */}
                  <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-6"> {/* Increased bottom margin */}
                    <span className="flex items-center">
                      <CircleDollarSign size={20} className="mr-2 text-purple-600" />
                      Total Payable:
                    </span>
                    <span className="text-2xl text-purple-600">₹{totalAmount.toFixed(2)}</span> {/* Larger total */}
                  </div>

                  {/* Submit Button Section */}
                  <div className="mt-6"> {/* Removed top margin as it's spaced by mb-6 above */}
                    <button
                      type="submit"
                      form="user-info-form"
                      disabled={isSubmitting || totalAmount <= 0}
                      className="w-full py-3 px-6 text-base font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex items-center justify-center" // Adjusted padding/text size
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        <>
                          Proceed to Payment
                          <ArrowRight className="inline w-5 h-5 ml-2" />
                        </>
                      )}
                    </button>
                    {totalAmount <= 0 && <p className="mt-2 text-xs text-center text-red-600">Total amount is invalid.</p>}
                  </div>
                </div>
              </div>
            )}
            {/* --- End IMPROVED Payment Summary --- */}
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