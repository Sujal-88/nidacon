// app/membership/page.js
"use client"

import { useState, useEffect } from 'react';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { initiatePayment } from '@/app/actions';

const MembershipPage = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        msdcRegistration: '',
        number: '',
        email: '',
        mobile: '',
        address: '',
    });
    const [renewalRegNumber, setRenewalRegNumber] = useState('');
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState('');

    const plans = [
        { name: 'New Member', price: 1750, features: ['Full access to all events', 'Monthly newsletter', 'Voting rights'], popular: true },
        { name: 'Renewal', price: 1450, features: ['Continue your membership', 'Access to member directory', 'Discounted event fees'] },
        { name: 'Student Member', price: 350, features: ['Access to student workshops', 'Networking opportunities', 'Digital newsletter'] },
    ];

    useEffect(() => {
        if (selectedPlan) {
            const formElement = document.getElementById('registration-form');
            if (formElement) {
                formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
    }, [selectedPlan]);

    const handlePlanSelection = (plan) => {
        setSelectedPlan(plan);
        setFormData({ name: '', msdcRegistration: '', number: '', email: '', mobile: '', address: '' });
        setFetchError('');
        setRenewalRegNumber('');
    };
  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    
    const handleFetchDetails = async () => {
        if (!renewalRegNumber) {
            setFetchError('Please enter a registration number.');
            return;
        }
        setIsFetching(true);
        setFetchError('');
        try {
            const res = await fetch(`/api/members/${renewalRegNumber}`);
            const data = await res.json();

            if (res.ok) {
                setFormData({
                    name: data.name || '',
                    msdcRegistration: data.msdcRegistration || '',
                    number: data.number || renewalRegNumber,
                    email: data.email || '',
                    mobile: data.mobile || '',
                    address: data.address || '',
                });
            } else {
                setFetchError(data.error || 'Member not found.');
                setFormData({ name: '', msdcRegistration: '', number: '', email: '', mobile: '', address: '' });
            }
        } catch (error) {
            setFetchError('An error occurred while fetching details.');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedPlan) return;

        const txnid = `NIDA${Date.now()}`;
        
        const formDataObj = new FormData(e.currentTarget);
        formDataObj.append('amount', selectedPlan.price);
        formDataObj.append('txnid', txnid);
        formDataObj.append('productinfo', `NIDACON 2026 - ${selectedPlan.name}`);
        formDataObj.append('registrationType', 'membership');
        formDataObj.append('memberType', selectedPlan.name.toLowerCase().replace(' ', '-'));
        formDataObj.append('subCategory', '');


        const payuData = await initiatePayment(formDataObj);

        if (payuData.error) {
          alert(`Error: ${payuData.error}`);
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
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
            <div className="container mx-auto px-4 py-20">
                <div className="text-center mb-16">
                    <h1 className="text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">Join the IDA Nagpur Family</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">Become a part of a thriving community dedicated to advancing the dental profession.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {plans.map((plan) => (
                        <div key={plan.name} className={`relative rounded-xl shadow-2xl p-8 text-center backdrop-blur-lg bg-white/50 border border-white/30 transition-all duration-300 hover:shadow-blue-200 ${selectedPlan?.name === plan.name ? 'ring-4 ring-blue-500' : ''} ${plan.popular ? 'transform scale-105' : 'hover:scale-105'}`}>
                            {plan.popular && <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg rounded-tr-xl">Most Popular</div>}
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">{plan.name}</h2>
                            <p className="text-6xl font-black text-blue-600 mb-6">₹{plan.price}</p>
                            <ul className="text-gray-700 mb-10 space-y-4 text-left">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center"><CheckCircleIcon className="w-6 h-6 text-green-500 mr-3" /><span>{feature}</span></li>
                                ))}
                            </ul>
                            <button onClick={() => handlePlanSelection(plan)} className="w-full bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-blue-700 transition-transform duration-300 transform hover:scale-105 shadow-lg">Choose Plan</button>
                        </div>
                    ))}
                </div>

                <div id="registration-form" className="mt-20">
                    {selectedPlan && (
                        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-4xl mx-auto">
                            <h2 className="text-4xl font-bold text-gray-800 mb-8 text-center">
                                You&apos;ve selected: <span className="text-blue-600">{selectedPlan.name}</span>
                            </h2>

                            {selectedPlan.name === 'Renewal' && (
                                <div className="mb-8 p-6 bg-indigo-50 rounded-lg border border-indigo-200">
                                    <label htmlFor="renewalRegNumber" className="block text-lg font-semibold text-gray-700 mb-2">Already a member? Fetch your details.</label>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <input
                                            type="text"
                                            id="renewalRegNumber"
                                            value={renewalRegNumber}
                                            onChange={(e) => setRenewalRegNumber(e.target.value)}
                                            placeholder="Enter Your Registration Number"
                                            className="w-full p-3 border rounded-lg bg-white focus:ring-2 focus:ring-indigo-500"
                                        />
                                        <button
                                            type="button"
                                            onClick={handleFetchDetails}
                                            disabled={isFetching}
                                            className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-700 transition duration-300 disabled:bg-indigo-300 flex items-center justify-center whitespace-nowrap"
                                        >
                                            {isFetching ? 'Fetching...' : 'Fetch Details'}
                                        </button>
                                    </div>
                                    {fetchError && <p className="text-red-500 mt-2 text-sm">{fetchError}</p>}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleInputChange} className="w-full p-4 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" required />
                                    <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleInputChange} className="w-full p-4 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" required />
                                    <input type="tel" name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleInputChange} className="w-full p-4 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" required />
                                    
                                    {(selectedPlan.name === 'New Member' || selectedPlan.name === 'Renewal') && (
                                        <input type="text" name="msdcRegistration" placeholder="MSDC Registration (Optional)" value={formData.msdcRegistration} onChange={handleInputChange} className="w-full p-4 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" />
                                    )}

                                    {selectedPlan.name === 'Renewal' && (
                                        <>
                                            <input type="text" name="number" placeholder="Membership Number" value={formData.number} onChange={handleInputChange} className="w-full p-4 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500" />
                                            <textarea name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} className="w-full p-4 border rounded-lg md:col-span-2 bg-gray-50 focus:ring-2 focus:ring-blue-500"></textarea>
                                        </>
                                    )}
                                </div>
                                <div className="text-center pt-4">
                                    <button type="submit" className="bg-green-500 text-white font-bold py-4 px-12 rounded-lg text-xl hover:bg-green-600 transition-transform duration-300 transform hover:scale-105 shadow-lg">Pay ₹{selectedPlan.price} & Complete Registration</button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MembershipPage;