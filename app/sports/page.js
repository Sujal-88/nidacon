// app/sports/page.js

"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trophy, Shirt, Utensils, Info, User, Cake, Phone, VenetianMask, ArrowRight, X, ArrowLeft, Calendar, MapPin, Mail, Upload } from 'lucide-react';
import { initiateSportsPayment } from '@/app/actions';
import Link from 'next/link';
import MembershipPopup from '@/components/MembershipPopup';


// --- THIS IS THE UPDATED COMPONENT ---
// It now correctly positions the arc downwards with Indian flag colors for IDA
const CurvedText = ({ text }) => {
  const characters = text.split('');
  const radius = 400; // Larger radius to accommodate bigger font size
  const totalAngle = 140; // Wider angle spread to prevent letter overlap

  const anglePerChar = totalAngle / (characters.length > 1 ? characters.length - 1 : 1);
  const startAngle = -totalAngle / 2;

  // Function to get color for specific characters (I, D, A in "Indian Dental Association")
  const getCharColor = (char, index) => {
    // Find positions of I, D, A in "Indian Dental Association"
    const upperText = text.toUpperCase();
    if (index === 0 && char === 'I') return '#FF9933'; // Saffron/Orange
    if (index === 7 && char === 'D') return '#FFFFFF'; // White
    if (index === 14 && char === 'A') return '#138808'; // Green
    return '#1F2937'; // Default dark gray
  };

  return (
    <div className="text-curve" style={{ height: '110px', position: 'relative', overflow: 'visible' }}>
      {characters.map((char, i) => {
        const charAngle = startAngle + (i * anglePerChar);
        const color = getCharColor(char, i);
        return (
          <span
            key={i}
            style={{
              position: 'absolute',
              left: '50%',
              top: '0px',
              transform: `rotate(${charAngle}deg)`,
              transformOrigin: `0 ${radius}px`,
              fontSize: '2.25rem',
              fontWeight: '700',
              color: color,
              textShadow: color === '#FFFFFF' ? '0 0 3px rgba(0,0,0,0.4)' : 'none',
              letterSpacing: '0.02em',
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        );
      })}
    </div>
  );
};
// --- End of component update ---


const sports = [
  { id: 'cricket', name: 'Cricket', image: '/sports/cricket-svg.svg' },
  { id: 'badminton', name: 'Badminton', image: '/sports/badminton-svg.svg' },
  { id: 'football', name: 'Football', image: '/sports/football-svg.svg' },
  { id: 'pickleball', name: 'Pickle Ball', image: '/sports/pickleball-svg.png' },
  { id: 'shooting', name: 'Shooting', image: '/sports/shooting-svg.svg' },
];

const tshirtSizes = ['S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL'];

const SizeChartPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col bg-white p-4 sm:p-6 rounded-lg shadow-2xl max-w-md w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors z-20"
          aria-label="Close size chart"
        >
          <X size={24} />
        </button>
        <h3 className="text-xl font-bold mb-4 text-center text-gray-800 flex-shrink-0">
          T-Shirt Size Guide
        </h3>
        <div className="overflow-y-auto">
          <Image
            src="/sports/tshirt-size-chart.png"
            alt="T-shirt size chart"
            width={641}
            height={1133}
            sizes="100vw"
            className="w-full h-auto rounded-md"
          />
        </div>
      </div>
    </div>
  );
};

export default function SportsEventPage() {
  const [step, setStep] = useState(1);
  const [memberType, setMemberType] = useState('member');
  const [selectedSports, setSelectedSports] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [basePrice, setBasePrice] = useState(1500);
  const [additionalPrice, setAdditionalPrice] = useState(0);
  const [formData, setFormData] = useState({
    name: '', age: '', mobile: '', gender: '', tshirtSize: '', email: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');

  useEffect(() => {
    const newBasePrice = memberType === 'member' ? 1500 : 2000;
    const additionalSportsCount = Math.max(0, selectedSports.length - 1);
    const newAdditionalPrice = additionalSportsCount * 500;

    setBasePrice(newBasePrice);
    setAdditionalPrice(newAdditionalPrice);
    setTotalPrice(newBasePrice + newAdditionalPrice);
  }, [memberType, selectedSports]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsSizeChartOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSportChange = (sportId) => {
    setSelectedSports((prev) =>
      prev.includes(sportId) ? prev.filter((s) => s !== sportId) : [...prev, sportId]
    );
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      if (errors.photo) setErrors(prev => ({ ...prev, photo: null }));
    } else {
      setPhoto(null);
      setPhotoPreview('');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    if (selectedSports.length === 0) {
      alert('Please select at least one sport to continue.');
      return false;
    }
    return true;
  }

  const validateStep2 = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full Name is required.';
    if (!formData.age) newErrors.age = 'Age is required.';
    if (!/^\d+$/.test(formData.age) || parseInt(formData.age, 10) <= 0) newErrors.age = 'Please enter a valid age.';
    if (!formData.mobile) newErrors.mobile = 'Mobile Number is required.';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits.';
    if (!formData.gender) newErrors.gender = 'Please select a gender.';
    if (!formData.tshirtSize) newErrors.tshirtSize = 'Please select a T-shirt size.';
    if (!formData.email) {
      newErrors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setStep(2);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) {
      return;
    }

    setIsSubmitting(true);

    let photoUrl = ''; // Default to an empty string

    // Step 1: Upload the image if it exists
    if (photo) {
      try {
        const response = await fetch(
          `/api/upload`, // Remove the query parameter
          {
            method: 'POST',
            headers: {
              'x-vercel-filename': photo.name, // Send the filename in the header
            },
            body: photo,
          },
        );

        const newBlob = await response.json();

        // --- THIS IS THE FIX ---
        // Only assign the URL if it actually exists in the response.
        if (newBlob && newBlob.url) {
          photoUrl = newBlob.url;
        } else {
            // Optional: Log an error if the upload response is not what we expect
            console.error('Upload completed but no URL was returned:', newBlob);
        }

      } catch (error) {
        console.error('Error uploading image:', error);
        alert('Error uploading image. Please try again.');
        setIsSubmitting(false);
        return;
      }
    }

    // Step 2: Manually create the FormData object
    const formDataObj = new FormData();
    
    // Append data from state
    formDataObj.append('name', formData.name);
    formDataObj.append('age', formData.age);
    formDataObj.append('mobile', formData.mobile);
    formDataObj.append('gender', formData.gender);
    formDataObj.append('email', formData.email);
    formDataObj.append('tshirtSize', formData.tshirtSize);
    
    // Append other dynamic values
    formDataObj.append('memberType', memberType);
    selectedSports.forEach(sport => formDataObj.append('selectedSports', sport));
    formDataObj.append('totalPrice', totalPrice);
    formDataObj.append('photoUrl', photoUrl); // Add the photoUrl (now safely a string)

    // Step 3: Call the server action
    const payuData = await initiateSportsPayment(formDataObj);

    if (payuData.error) {
      alert(`Error: ${payuData.error}`);
      setIsSubmitting(false);
      return;
    }

    // Step 4: Redirect to PayU
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://test.payu.in/_payment';

    for (const key in payuData) {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = payuData[key];
      form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
  };

  const getSportName = (sportId) => {
    const sport = sports.find(s => s.id === sportId);
    return sport ? sport.name : '';
  }


  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 font-sans relative">
      <div className="fixed inset-0 z-0">
        <video autoPlay loop muted playsInline className="w-full h-full object-cover">
          <source src="/video/sports-bg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-white/75 backdrop-blur-sm"></div>
      </div>

      <SizeChartPopup isOpen={isSizeChartOpen} onClose={() => setIsSizeChartOpen(false)} />

      <div className="relative z-10 isolate overflow-hidden pt-16">
        <Image width={450} height={450} src="/sports/cricket.png" alt="" className="absolute top-20 -left-48 w-[250px] opacity-20 pointer-events-none lg:w-[400px] lg:-left-40" />
        <Image width={380} height={380} src="/sports/badminton.png" alt="" className="absolute top-52 -right-40 w-[200px] opacity-15 pointer-events-none lg:w-[350px] lg:-right-20" />

        <div className="container mx-auto px-6 py-12 sm:py-20">

          <div className="max-w-xl mx-auto text-center mb-12">
            <div className="relative mb-2">
              <CurvedText text="Indian Dental Association, Nagpur Branch Presents" />
            </div>
            <Image src="/sports/title.png" alt="NIDASPORTZ 2025 SEASON-6" width={400} height={200} className="mx-auto" />

            <div className="mt-6 flex flex-col sm:flex-row justify-center items-center gap-4 text-gray-800 font-semibold">
              <Link href="https://www.google.com/maps/dir//KT+Nagar,+Nagpur,+Maharashtra+440013/@21.1734469,78.9654397,24741m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x3bd4c1b12072bf49:0x68bb5618d03e914b!2m2!1d79.0478414!2d21.1734669?entry=ttu&g_ep=EgoyMDI1MTAwNC4wIKXMDSoASAFQAw%3D%3D" target='blank' rel="noopener noreferrer" className="space-y-2 sm:space-y-0 sm:space-x-4 flex flex-col sm:flex-row">
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 flex items-center shadow-sm"><Calendar size={18} className="mr-2 text-purple-600" />Sat, 15th & Sun, 16th Nov 2025</div>
                <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg px-4 py-2 flex items-center shadow-sm"><MapPin size={18} className="mr-2 text-purple-600" />ADBA Sports Complex, Nagpur</div>
              </Link>
            </div>
          </div>

          {/* The rest of the page logic remains unchanged */}
          <form onSubmit={handleSubmit} noValidate>
            {step === 1 && (
              <div className="max-w-4xl mx-auto">
                <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-6 shadow-xl mb-8">
                  <h2 className="text-2xl font-bold text-center text-gray-900 mb-4">Registration Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <h3 className="font-bold text-purple-800">IDA Members</h3>
                      <p className="text-2xl font-bold text-gray-800 mt-1">₹1500</p>
                    </div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h3 className="font-bold text-blue-800">Non-Members</h3>
                      <p className="text-2xl font-bold text-gray-800 mt-1">₹2000</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-bold text-center text-gray-800">Registration Fee Includes:</h4>
                    <ul className="mt-2 text-center text-sm text-gray-600 space-y-1">
                      <li><span className="font-semibold text-purple-700">✓</span> Participation in <strong>any one sport</strong></li>
                      <li><span className="font-semibold text-purple-700">✓</span> Official Event <strong>T-shirt</strong></li>
                      <li><span className="font-semibold text-purple-700">✓</span> <strong>Food & Refreshments</strong> for 2 Days</li>
                    </ul>
                    <p className="text-center font-bold text-gray-700 mt-3">
                      Each additional sport is just <span className="text-purple-700">₹500</span> per game.
                    </p>
                  </div>
                </div>

                <div className="text-center text-sm text-red-600 font-bold p-4 bg-white/90 rounded-lg border border-gray-200 mb-8">
                  <div className="flex items-center justify-center mb-2 space-x-4">
                    <Link href="/membership" className="text-black font-bold underline">RENEW MEMBERSHIP</Link>
                    <span className='text-black'>/</span>
                    <Link href="/membership" className="text-black font-bold underline">JOIN MEMBERSHIP</Link>
                    <MembershipPopup text='' />
                  </div>
                  Even if you have a current membership, it is only valid until Dec 31st of this year. <br />
                  To get member benefits for NIDASPORTZ, please renew your membership for the next year.
                </div>

                <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-xl">
                  <div className="flex flex-col items-center">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900">1. Choose Your Registration Type</h2>
                    <div className="relative flex w-full max-w-sm p-1 bg-gray-100 rounded-full">
                      <div className="absolute top-1 bottom-1 w-1/2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-md transition-transform duration-300 ease-in-out" style={{ transform: memberType === 'member' ? 'translateX(0%)' : 'translateX(100%)' }}></div>
                      <button type="button" onClick={() => setMemberType('member')} className={`relative z-10 w-1/2 py-2 rounded-full text-center font-semibold transition-colors duration-300 ${memberType === 'member' ? 'text-white' : 'text-gray-800'}`}>IDA Member</button>
                      <button type="button" onClick={() => setMemberType('non-member')} className={`relative z-10 w-1/2 py-2 rounded-full text-center font-semibold transition-colors duration-300 ${memberType === 'non-member' ? 'text-white' : 'text-gray-800'}`}>Non IDA Member</button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-gray-900 text-center">2. Select Your Sports</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {sports.map((sport) => (
                        <button type="button" key={sport.id} onClick={() => handleSportChange(sport.id)} className={`p-4 border rounded-lg transition-all text-center ${selectedSports.includes(sport.id) ? 'bg-purple-100 border-purple-500 text-purple-700 shadow-md' : 'bg-white border-gray-300 text-gray-700 hover:border-purple-400 hover:shadow'}`}>
                          <div className="w-16 h-16 mx-auto mb-2 relative"><Image src={sport.image} alt={`${sport.name} icon`} fill sizes="64px" className="object-contain" /></div>
                          <span className="font-semibold">{sport.name}</span>
                        </button>
                      ))}
                      <div className="p-4 border rounded-lg bg-gray-50 text-left text-sm">
                        <h3 className="font-bold text-gray-800 mb-2">Your Selection:</h3>
                        {selectedSports.length === 0 ? (
                          <p className="text-gray-500">No sports selected yet.</p>
                        ) : (
                          <ul className="space-y-1">
                            {selectedSports.map(sportId => (
                              <li key={sportId} className="capitalize text-gray-700">{getSportName(sportId)}</li>
                            ))}
                          </ul>
                        )}
                        <div className="border-t my-2"></div>
                        <div className="font-bold">Total: ₹{totalPrice}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 text-center">
                    <button type="button" onClick={handleNextStep} className="w-full max-w-xs py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 transition-colors">Next <ArrowRight className="inline w-5 h-5 ml-2" /></button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-xl">
                  <h2 className="text-2xl font-bold mb-6 text-gray-900">Your Details</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="relative">
                        <User className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className={`w-full p-3 pl-10 bg-white border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900`} />
                        {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                      </div>
                      <div className="relative">
                        <Cake className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="number" name="age" placeholder="Age" value={formData.age} onChange={handleInputChange} className={`w-full p-3 pl-10 bg-white border ${errors.age ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900`} />
                        {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age}</p>}
                      </div>
                      <div className="relative">
                        <Phone className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleInputChange} className={`w-full p-3 pl-10 bg-white border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900`} />
                        {errors.mobile && <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>}
                      </div>
                      <div className="relative">
                        <VenetianMask className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <select name="gender" value={formData.gender} onChange={handleInputChange} className={`w-full p-3 pl-10 bg-white border ${errors.gender ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 appearance-none`}>
                          <option value="">Select Gender</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
                      </div>
                      <div className="relative">
                        <Mail className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className={`w-full p-3 pl-10 bg-white border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900`} />
                        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email}</p>}
                      </div>

                      <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">
                        Profile Photo
                      </label>
                      <div className="mt-2 flex items-center gap-x-3">
                        {photoPreview ? (
                          <Image src={photoPreview} alt="Photo preview" className="h-16 w-16 rounded-full object-cover" width={64} height={64} />
                        ) : (
                          <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center">
                            <Upload className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <label htmlFor="photo-upload" className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                          <span>Upload a file</span>
                          <input id="photo-upload" name="photo" type="file" onChange={handlePhotoChange} className="sr-only" accept="image/*" />
                        </label>
                      </div>


                      <div className="relative md:col-span-2">
                        <div className="flex items-center gap-2">
                          <div className="relative flex-grow">
                            <Shirt className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2 z-10" />
                            <select name="tshirtSize" value={formData.tshirtSize} onChange={handleInputChange} className={`relative w-full p-3 pl-10 bg-white border ${errors.tshirtSize ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 appearance-none`}>
                              <option value="">Select T-shirt Size</option>
                              {tshirtSizes.map(size => <option key={size} value={size}>{size}</option>)}
                            </select>
                          </div>
                          <button type="button" onClick={() => setIsSizeChartOpen(true)} className="flex-shrink-0 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">View Size Chart</button>
                        </div>
                        {errors.tshirtSize && <p className="mt-1 text-xs text-red-600">{errors.tshirtSize}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <div className="bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-xl">
                      <h2 className="text-2xl font-bold mb-4 text-gray-900">Registration Summary</h2>

                      <div className="space-y-3 text-gray-700">
                        <div className="flex justify-between">
                          <span>Base Fee ({getSportName(selectedSports[0])}):</span>
                          <span className="font-semibold">₹{basePrice}</span>
                        </div>
                        {additionalPrice > 0 && (
                          <div className="border-t pt-3 mt-3">
                            <p className="font-semibold mb-2">Additional Sports:</p>
                            <ul className="space-y-1 pl-2">
                              {selectedSports.slice(1).map(sportId => (
                                <li key={sportId} className="flex justify-between">
                                  <span className='capitalize'>{getSportName(sportId)}:</span>
                                  <span>₹500</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="my-6 border-t border-gray-300"></div>
                      <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
                        <p>Total:</p>
                        <p className="text-purple-600">₹{totalPrice}</p>
                      </div>

                      <button type="submit" disabled={isSubmitting} className="mt-8 relative w-full py-4 px-6 text-lg font-semibold text-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group bg-gradient-to-r from-purple-600 to-blue-600">
                        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)', width: '50%' }} />
                        <span className="relative z-10 flex items-center justify-center"> {isSubmitting ? 'Processing...' : 'Pay & Register'} <ArrowRight className="inline w-5 h-5 ml-2" /> </span>
                      </button>

                      <button type="button" onClick={() => setStep(1)} className="mt-4 w-full py-3 text-sm font-semibold text-gray-700 hover:text-black">
                        <ArrowLeft className="inline w-4 h-4 mr-2" />Go Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}