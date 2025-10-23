// app/register-now/user-info/page.js

// app/register-now/user-info/page.js

"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { User, Mail, Phone, Home, Image as ImageIcon, ArrowRight } from 'lucide-react';
import Image from 'next/image';
// --- Import the NEW server action ---
import { initiatePayment, saveSubmission } from '@/app/actions';
// --- End Import ---

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
  const [isSubmitting, setIsSubmitting] = useState(false);


  // Handler for text input changes
  const handleChange = (e) => {
    // ... (keep existing) ...
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
     // Clear error when user starts typing
     if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Handler for photo upload
  const handlePhotoChange = (e) => {
    // ... (keep existing) ...
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
    // ... (keep existing) ...
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
        return;
    }
    setIsSubmitting(true);
    setErrors({}); // Clear previous form-wide errors

    const registrationType = searchParams.get('type');
    const memberType = searchParams.get('memberType');
    const subCategory = searchParams.get('subCategory') || '';
    const amount = searchParams.get('price');
    const implantAddon = searchParams.get('implant') === 'true';
    const banquetAddon = searchParams.get('banquet') === 'true';

    // --- PAPER/POSTER SUBMISSION LOGIC ---
    if (registrationType === 'paper-poster') {
        try {
            const submissionData = {
                name: formData.name,
                email: formData.email,
                mobile: formData.mobile,
                address: formData.address,
                // Get categories and URLs from searchParams
                paperCategory: searchParams.get('paperCat') || null, // Use null if param missing
                abstractUrl: searchParams.get('abstractUrl') || null,
                paperUrl: searchParams.get('paperUrl') || null,
                posterCategory: searchParams.get('posterCat') || null,
                posterUrl: searchParams.get('posterUrl') || null,
                // registrationId: searchParams.get('registrationId') || null // Pass if needed for linking update
            };

            console.log("Sending data to saveSubmission:", submissionData);

            // --- Call the server action ---
            const result = await saveSubmission(submissionData);
            // --- End call ---

            if (result.success) {
                console.log("Submission saved successfully, redirecting...");
                router.push('/register-now/submission-success');
                // No need to reset isSubmitting, page navigates away
            } else {
                throw new Error(result.error || 'Failed to save submission');
            }

        } catch (error) {
            console.error("Submission save error:", error);
            setErrors(prev => ({ ...prev, form: error.message || 'Could not save submission.' }));
             setIsSubmitting(false); // Reset on error
        }
        return; // Stop execution for paper/poster here
    }
    // --- END PAPER/POSTER SUBMISSION LOGIC ---


    // --- PAYMENT LOGIC for other types ---
    if (!amount) {
        alert("Error: Price not found. Cannot proceed with payment.");
        setIsSubmitting(false);
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
    formDataObj.append('registrationType', registrationType);
    formDataObj.append('memberType', memberType || '');
    formDataObj.append('subCategory', subCategory);
    formDataObj.append('implant', implantAddon.toString());
    formDataObj.append('banquet', banquetAddon.toString());

    // Call the initiatePayment Server Action
    const payuData = await initiatePayment(formDataObj);


    if (payuData.error) {
      alert(`Error initializing payment: ${payuData.error}`);
      setIsSubmitting(false);
      return;
    }

    // Create and submit a dynamic form to PayU
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://secure.payu.in/_payment'; // Use https://test.payu.in for testing

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
    console.log("Submitting form to PayU...");
    form.submit();
    // No need to reset isSubmitting here
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center">
             <p className="text-base font-semibold text-purple-600">
               {searchParams.get('type') === 'paper-poster' ? 'Step 2 of 2' : 'Step 3 of 3'}
             </p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Your Information
            </h1>
            <p className="mt-6 text-lg text-gray-600">
               {searchParams.get('type') === 'paper-poster'
                    ? "Please provide your details below. This information will be used for communication regarding your submission."
                    : "Please provide your details below. This information will be used for your delegate pass and certificate."}
            </p>
          </div>

           <form onSubmit={handleSubmit} className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-8">
            {/* Form Fields */}
             <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              {/* --- Keep existing fields: Name, Email, Mobile, Address, Photo --- */}
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

               {/* Profile Photo (Optional) - Only show if not paper/poster */}
               {searchParams.get('type') !== 'paper-poster' && (
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
                        <span>Upload photo</span>
                        <input id="photo-upload" name="photo" type="file" onChange={handlePhotoChange} className="sr-only" accept="image/*" />
                      </label>
                    </div>
                    {errors.photo && <p className="mt-1 text-xs text-red-600">{errors.photo}</p>}
                  </div>
                )}
            </div>

            {/* Display Form-wide Error */}
            {errors.form && (
                 <div className="rounded-md bg-red-50 p-4">
                     <p className="text-sm font-medium text-red-800">{errors.form}</p>
                 </div>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center" // Added flex for centering loading
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
                        {searchParams.get('type') === 'paper-poster' ? 'Submit Details' : 'Proceed to Payment'}
                        <ArrowRight className="inline w-5 h-5 ml-2" />
                    </>
                 )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}

// --- Keep Suspense wrapper ---
export default function UserInfoPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <UserInfoForm />
    </Suspense>
  )
}