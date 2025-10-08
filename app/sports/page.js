"use client"

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trophy, Shirt, Utensils, Info, User, Cake, Phone, VenetianMask, ArrowRight, X } from 'lucide-react';
import MembershipPopup from '@/components/MembershipPopup';
import { initiateSportsPayment } from '@/app/actions';

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
  const [memberType, setMemberType] = useState('member');
  const [selectedSports, setSelectedSports] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    mobile: '',
    gender: '',
    tshirtSize: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);

  useEffect(() => {
    const calculatePrice = () => {
      const basePrice = memberType === 'member' ? 1500 : 2000;
      const additionalSportsCount = Math.max(0, selectedSports.length - 1);
      const additionalSportsPrice = additionalSportsCount * 500;
      setTotalPrice(basePrice + additionalSportsPrice);
    };
    calculatePrice();
  }, [memberType, selectedSports]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSizeChartOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSportChange = (sportId) => {
    setSelectedSports((prev) =>
      prev.includes(sportId) ? prev.filter((s) => s !== sportId) : [...prev, sportId]
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full Name is required.';
    if (!formData.age) newErrors.age = 'Age is required.';
    if (!/^\d+$/.test(formData.age) || parseInt(formData.age, 10) <= 0) newErrors.age = 'Please enter a valid age.';
    if (!formData.mobile) newErrors.mobile = 'Mobile Number is required.';
    if (!/^\d{10}$/.test(formData.mobile)) newErrors.mobile = 'Mobile number must be 10 digits.';
    if (!formData.gender) newErrors.gender = 'Please select a gender.';
    if (!formData.tshirtSize) newErrors.tshirtSize = 'Please select a T-shirt size.';
    if (selectedSports.length === 0) newErrors.sports = 'Please select at least one sport.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // --- MAJOR CHANGE ---
  // The handleSubmit function now correctly processes the form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);

    const formElement = e.currentTarget; // e.currentTarget is the form
    const formDataObj = new FormData(formElement);

    formDataObj.append('memberType', memberType);
    selectedSports.forEach(sport => formDataObj.append('selectedSports', sport));
    formDataObj.append('totalPrice', totalPrice);

    const payuData = await initiateSportsPayment(formDataObj);

    if (payuData.error) {
      alert(`Error: ${payuData.error}`);
      setIsSubmitting(false);
      return;
    }

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
        <Image
          width={450}
          height={450}
          src="/sports/cricket.png"
          alt="Cricket player illustration"
          className="absolute top-10 -left-20 w-[250px] opacity-20 pointer-events-none lg:w-[450px] lg:opacity-40 lg:top-24 lg:left-4 lg:-translate-x-1/3"
        />
        <Image
          width={380}
          height={380}
          src="/sports/badminton.png"
          alt="Badminton player illustration"
          className="absolute top-96 -right-20 w-[200px] opacity-25 pointer-events-none lg:w-[380px] lg:opacity-50 lg:top-24 lg:right-0 lg:translate-x-1/4"
        />
        <Image
          width={350}
          height={350}
          src="/sports/pickleball.png"
          alt="Pickleball player illustration"
          className="absolute bottom-0 -right-24 w-[250px] opacity-20 pointer-events-none lg:hidden"
        />

        <div className="container mx-auto px-6 py-24 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-purple-600 to-blue-600">
              NIDASPORTZ 2025 Season 6
            </h1>
            <p className="mt-6 text-lg text-gray-700 font-medium">
              Unleash your inner champion. Join us for a day of thrilling competition, camaraderie, and fun.
            </p>
          </div>

          {/* --- MAJOR CHANGE: The <form> now wraps both columns --- */}
          <form onSubmit={handleSubmit} noValidate className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl p-8 shadow-xl">
              <div className="flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Choose Your Status</h2>
                <div className="relative flex w-full max-w-xl p-1 bg-gray-100 rounded-full">
                  <div
                    className="absolute top-1 bottom-1 w-1/2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 shadow-md transition-transform duration-300 ease-in-out"
                    style={{ transform: memberType === 'member' ? 'translateX(0%)' : 'translateX(100%)' }}
                  ></div>
                  <button
                    type="button"
                    onClick={() => setMemberType('member')}
                    className={`relative z-10 w-1/2 py-2 rounded-full text-center font-semibold transition-colors duration-300 ${memberType === 'member' ? 'text-white' : 'text-gray-800'}`}
                  >
                    Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setMemberType('non-member')}
                    className={`relative z-10 w-1/2 py-2 rounded-full text-center font-semibold transition-colors duration-300 ${memberType === 'non-member' ? 'text-white' : 'text-gray-800'}`}
                  >
                    Non-Member
                  </button>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Select Your Sports</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {sports.map((sport) => (
                    <button
                      type="button"
                      key={sport.id}
                      onClick={() => handleSportChange(sport.id)}
                      className={`p-4 border rounded-lg transition-all text-center ${selectedSports.includes(sport.id)
                        ? 'bg-purple-100 border-purple-500 text-purple-700 shadow-md'
                        : 'bg-white border-gray-300 text-gray-700 hover:border-purple-400 hover:shadow'
                        }`}
                    >
                      <div className="w-16 h-16 mx-auto mb-2 relative">
                        <Image
                          src={sport.image}
                          alt={`${sport.name} icon`}
                          fill
                          sizes="64px"
                          className="object-contain"
                        />
                      </div>
                      <span className="font-semibold">{sport.name}</span>
                    </button>
                  ))}
                </div>
                {errors.sports && <p className="mt-2 text-sm text-red-600">{errors.sports}</p>}
              </div>

              <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">Your Details</h2>
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
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.gender && <p className="mt-1 text-xs text-red-600">{errors.gender}</p>}
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
                        <button type="button" onClick={() => setIsSizeChartOpen(true)} className="flex-shrink-0 text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors">
                          View Size Chart
                        </button>
                      </div>
                      {errors.tshirtSize && <p className="mt-1 text-xs text-red-600">{errors.tshirtSize}</p>}
                    </div>
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
                      <p>Base Price:</p>
                      <p className="font-semibold">₹{memberType === 'member' ? 1500 : 2000}</p>
                    </div>
                    <div className="flex justify-between">
                      <p>Selected Sports:</p>
                      <p className="font-semibold">{selectedSports.length}</p>
                    </div>
                  </div>
                  <div className="my-6 border-t border-gray-300"></div>
                  <div className="flex justify-between items-center text-2xl font-bold text-gray-900">
                    <p>Total:</p>
                    <p className="text-purple-600">₹{totalPrice}</p>
                  </div>
                  <div className="mt-8">
                    <h3 className="font-semibold mb-2 text-gray-900">What&apos;s Included:</h3>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center"><Shirt className="w-5 h-5 mr-2 text-purple-600" />Official Event T-shirt</li>
                      <li className="flex items-center"><Utensils className="w-5 h-5 mr-2 text-purple-600" />Breakfast & High Tea</li>
                    </ul>
                  </div>
                  
                  {/* --- MAJOR CHANGE: This is now the submit button for the form --- */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-8 relative w-full py-4 px-6 text-lg font-semibold text-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group bg-gradient-to-r from-purple-600 to-blue-600"
                  >
                    <div
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"
                      style={{ background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.25), transparent)', width: '50%' }}
                    />
                    <span className="relative z-10 flex items-center justify-center">
                      {isSubmitting ? 'Processing...' : 'Pay & Register'}
                      <ArrowRight className="inline w-5 h-5 ml-2" />
                    </span>
                  </button>

                </div>
                <div className="mt-4 text-center text-sm text-red-600 font-bold p-4 bg-white/90 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-center mb-2">
                    <MembershipPopup text='RENEW/JOIN MEMBERSHIP' textColor='black' />
                  </div>
                  If you select/renew the membership, it will be valid until 31st December of the current year.
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}