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

  // Handler for text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handler for photo upload
  const handlePhotoChange = (e) => {
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
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full Name is required.';
    if (!formData.email) newErrors.email = 'Email Address is required.';
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email address is invalid.';
    if (!formData.mobile) newErrors.mobile = 'Mobile Number is required.';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits.';
    if (!formData.address) newErrors.address = 'Address is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const registrationType = searchParams.get('type');

      // If the registration is for a paper/poster, redirect to a success page without payment.
      if (registrationType === 'paper-poster') {
        // Here you would typically save the user's data to your database.
        // For this example, we'll just redirect.
        router.push('/register-now/submission-success');
        return;
      }

      // --- Dynamic pricing logic (for other registration types) ---
      const memberType = searchParams.get('memberType');
      const subCategory = searchParams.get('subCategory');
      let amount = 2000;

      if (registrationType === 'workshop') {
        amount += 3500;
      } else if (registrationType === 'presenter') {
        amount += 2500;
      }

      const txnid = `NIDA${Date.now()}`;
      const productinfo = `NIDACON 2026 - ${registrationType}`;

      // --- REPLACEMENT LOGIC STARTS HERE ---

      // 2. Create a FormData object from the form element
      const formElement = e.currentTarget;
      const formDataObj = new FormData(formElement);

      // 3. Append your dynamic/calculated values to the FormData object
      formDataObj.append('amount', amount);
      formDataObj.append('txnid', txnid);
      formDataObj.append('productinfo', productinfo);
      formDataObj.append('registrationType', registrationType);
      formDataObj.append('memberType', memberType);
      formDataObj.append('subCategory', subCategory);

      // 4. Call the Server Action directly with the FormData
      const payuData = await initiatePayment(formDataObj);

      // --- REPLACEMENT LOGIC ENDS HERE ---

      if (payuData.error) {
        alert(`Error: ${payuData.error}`);
        return;
      }

      // This part remains the same: create and submit a dynamic form to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = 'https://payu.in/_payment'; // Use https://secure.payu.in for production

      for (const key in payuData) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = payuData[key];
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-6 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          {/* Header and Progress */}
          <div className="text-center">
            <p className="text-base font-semibold text-purple-600">Step 3 of 4</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
              Your Information
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Please provide your details below. This information will be used for your delegate pass and certificate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-8">
            {/* Form Fields */}
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
                <div className="mt-2 relative">
                  <User className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${errors.name ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600`} />
                </div>
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email Address</label>
                <div className="mt-2 relative">
                  <Mail className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${errors.email ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600`} />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="mobile" className="block text-sm font-medium leading-6 text-gray-900">Mobile Number</label>
                <div className="mt-2 relative">
                  <Phone className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="tel" name="mobile" id="mobile" value={formData.mobile} onChange={handleChange} className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${errors.mobile ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600`} />
                </div>
                {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium leading-6 text-gray-900">Full Address</label>
                <div className="mt-2 relative">
                  <Home className="w-5 h-5 text-gray-400 absolute left-3 top-4" />
                  <textarea name="address" id="address" rows={3} value={formData.address} onChange={handleChange} className={`block w-full rounded-md border-0 py-3 pl-10 text-gray-900 shadow-sm ring-1 ring-inset ${errors.address ? 'ring-red-500' : 'ring-gray-300'} placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600`}></textarea>
                </div>
                {errors.address && <p className="mt-1 text-xs text-red-600">{errors.address}</p>}
              </div>

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
                    <span>Upload a file</span>
                    <input id="photo-upload" name="photo" type="file" onChange={handlePhotoChange} className="sr-only" accept="image/*" />
                  </label>
                </div>
                {errors.photo && <p className="mt-1 text-xs text-red-600">{errors.photo}</p>}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-gray-200">
              <button
                type="submit"
                className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                {searchParams.get('type') === 'paper-poster' ? 'Submit' : 'Proceed to Payment'} <ArrowRight className="inline w-5 h-5 ml-2" />
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