// app/register-now/user-info/page.js

"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, Mail, Phone, Home, Image as ImageIcon, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { initiatePayment } from '@/app/actions';

function UserInfoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State for form fields and photo preview
  const [formData, setFormData] = useState({
        name: searchParams.get('name') || '',
        email: searchParams.get('email') || '',
        mobile: searchParams.get('mobile') || '',
        address: searchParams.get('address') || '',
    });
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state


  // Handler for text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
     // Clear error when user starts typing
     if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handler for photo upload
  const handlePhotoChange = (e) => {
    // ... (keep existing photo change logic)
     const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      if (errors.photo) setErrors(prev => ({ ...prev, photo: null }));
    } else {
      setPhoto(null);
      setPhotoPreview('');
      setErrors(prev => ({ ...prev, photo: 'Please select a valid image file.' }));
    }
  };

  // Form validation
  const validateForm = () => {
    // ... (keep existing validation logic)
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        return; // Stop submission if validation fails
    }
    setIsSubmitting(true); // Set submitting state

    const registrationType = searchParams.get('type');
    const memberType = searchParams.get('memberType');
    // For delegate, subCategory can represent add-ons or be empty
    const subCategory = searchParams.get('subCategory') || '';
    const amount = searchParams.get('price'); // Get price from URL

    // --- NEW: Get Add-on Flags ---
    const implantAddon = searchParams.get('implant') === 'true';
    const banquetAddon = searchParams.get('banquet') === 'true';
    // --- End NEW ---


    // If the registration is for a paper/poster, redirect without payment.
    if (registrationType === 'paper-poster') {
        // Here you would typically save the user's data + submission info to your database.
        // For this example, we'll just redirect.
        // TODO: Add logic here to save paper/poster data before redirecting
        router.push('/register-now/submission-success');
        setIsSubmitting(false); // Reset submitting state
        return;
    }

    // --- Payment Logic for other types ---
    if (!amount) {
        alert("Error: Price not found. Cannot proceed with payment.");
        setIsSubmitting(false); // Reset submitting state
        return;
    }

    const txnid = `NIDA${Date.now()}`;
    // Construct productinfo more dynamically
    let productinfoText = `NIDACON 2026 - ${registrationType}`;
    if (registrationType === 'delegate') {
      productinfoText += ` (${memberType === 'member' ? 'Member' : 'Non-Member'})`;
      if (implantAddon) productinfoText += ' + Implant';
      if (banquetAddon) productinfoText += ' + Banquet';
    } else if (registrationType === 'workshop-registered' || registrationType === 'workshop-only') {
       const workshops = searchParams.get('workshops');
       if (workshops) productinfoText += ` Workshops: ${workshops}`;
    }


    const formElement = e.currentTarget;
    const formDataObj = new FormData(formElement);

    formDataObj.append('amount', amount);
    formDataObj.append('txnid', txnid);
    formDataObj.append('productinfo', productinfoText);
    formDataObj.append('registrationType', registrationType); // e.g., 'delegate', 'workshop-registered'
    formDataObj.append('memberType', memberType || ''); // e.g., 'member', 'non-member', or empty for workshop-only
    formDataObj.append('subCategory', subCategory); // Keep original subCategory if needed, otherwise maybe add-on info here?

    // --- NEW: Append Add-on Flags to FormData ---
    formDataObj.append('implant', implantAddon.toString()); // Send as 'true' or 'false' string
    formDataObj.append('banquet', banquetAddon.toString());
    // --- End NEW ---

    // Call the Server Action
    const payuData = await initiatePayment(formDataObj);


    if (payuData.error) {
      alert(`Error initializing payment: ${payuData.error}`);
      setIsSubmitting(false); // Reset submitting state
      return;
    }

    // Create and submit a dynamic form to PayU
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://secure.payu.in/_payment'; // Use https://test.payu.in for testing

    for (const key in payuData) {
      if (payuData.hasOwnProperty(key) && payuData[key] !== null && payuData[key] !== undefined) { // Check for null/undefined
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = payuData[key];
        form.appendChild(input);
      }
    }

    document.body.appendChild(form);
    form.submit();
    // No need to reset isSubmitting here as the page will navigate away
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          {/* Header and Progress */}
          <div className="text-center">
            {/* Adjust Step number if paper/poster skips this */}
             <p className="text-base font-semibold text-purple-600">
               {searchParams.get('type') === 'paper-poster' ? 'Step 2 of 2' : 'Step 3 of 3'}
             </p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Your Information
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Please provide your details below. This information will be used for your delegate pass and certificate.
            </p>
          </div>

           <form onSubmit={handleSubmit} className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-8">
            {/* Form Fields */}
            {/* --- Keep existing form fields for name, email, mobile, address, photo --- */}
             <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
                <div className="mt-2 relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${errors.name ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600`} />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email Address</label>
                <div className="mt-2 relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600`} />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

               {/* Mobile Number */}
              <div>
                <label htmlFor="mobile" className="block text-sm font-medium leading-6 text-gray-900">Mobile Number</label>
                <div className="mt-2 relative">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="tel" name="mobile" id="mobile" value={formData.mobile} onChange={handleChange} className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${errors.mobile ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600`} />
                </div>
                {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
              </div>

              {/* Full Address */}
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">Full Address</label>
                <div className="mt-2 relative">
                  <Home className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                  <textarea name="address" id="address" rows={3} value={formData.address} onChange={handleChange} className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${errors.address ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600`}></textarea>
                </div>
                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
              </div>

               {/* Profile Photo (Optional) */}
               <div className="sm:col-span-2">
                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">Profile Photo <span className="text-xs text-gray-500">(Optional - Used for delegate pass if provided)</span></label>
                 <div className="mt-2 flex items-center gap-x-3">
                  {photoPreview ? (
                    <Image src={photoPreview} alt="Photo preview" className="h-16 w-16 rounded-full object-cover" width={64} height={64} />
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <label htmlFor="photo-upload" className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    <span>Upload a file</span>
                    <input id="photo-upload" name="photo" type="file" onChange={handlePhotoChange} className="sr-only" accept="image/*" />
                  </label>
                  {/* TODO: Add photo upload logic if needed */}
                </div>
                 {errors.photo && <p className="mt-1 text-xs text-red-600">{errors.photo}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting} // Disable button while submitting
                className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                 {isSubmitting
                    ? 'Processing...' // Show loading text
                    : (searchParams.get('type') === 'paper-poster' ? 'Submit' : 'Proceed to Payment')}
                 <ArrowRight className="inline w-5 h-5 ml-2" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

// Wrap in Suspense because useSearchParams is a Client Component hook
export default function UserInfoPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <UserInfoForm />
    </Suspense>
  )
}