// app/register-now/details/page.js

"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

// --- Data for All Flows ---
const allDelegateOptions = [
  { id: 'new-membership', label: 'Registration + New Membership', rcPrice: 5250, nonRcPrice: 3750, rcDesc: '₹3500 + ₹1750', nonRcDesc: '₹2000 + ₹1750' },
  { id: 'renewal-membership', label: 'Registration + Renewal of Membership', rcPrice: 4950, nonRcPrice: 3450, rcDesc: '₹3500 + ₹1450', nonRcDesc: '₹2000 + ₹1450' },
  { id: 'student-membership', label: 'Registration + Student Membership', rcPrice: 3850, nonRcPrice: 2350, rcDesc: '₹3500 + ₹350', nonRcDesc: '₹2000 + ₹350' },
  { id: 'non-member', label: 'Registration (for Non-Member)', rcPrice: 5250, nonRcPrice: 3750, rcDesc: 'Delegate fee only', nonRcDesc: 'Delegate fee only' },
  { id: 'life-member', label: 'Registration for Life Member', rcPrice: 3500, nonRcPrice: 2000, rcDesc: 'Delegate fee only', nonRcDesc: 'Delegate fee only' },
  { id: 'outside-nagpur', label: 'Registration for Member Outside Nagpur', rcPrice: 3500, nonRcPrice: 2000, rcDesc: 'Delegate fee only', nonRcDesc: 'Delegate fee only' }
];
const rcMemberFeatures = ["NIDA Master Class on 9th January", "GALA Buffet Dinner", "Free Implant", "Registration to main event on 10th and 11th", "Registration Kit & Certificate", "Entry to Trade fair", "2 Lunches"];
const nonMemberFeatures = ["Registration to main event on 10th and 11th", "Registration Kit & Certificate", "Entry to Trade fair", "2 Lunches"];
const workshopOptions = [
  { id: 'ws1', name: 'Hands-on: Advanced Implantology', price: 1500 }, { id: 'ws2', name: 'Hands-on: Digital Smile Design', price: 1300 }, { id: 'ws3', name: 'Hands-on: Rotary Endodontics', price: 1200 }, { id: 'ws4', name: 'Hands-on: Laser Dentistry', price: 1600 }, { id: 'ws5', name: 'Hands-on: Composite Artistry', price: 1100 }, { id: 'ws6', name: 'Hands-on: Periodontal Flap Surgery', price: 1400 },
];
const presentationCategories = [
  { id: 'cat1', name: 'Prosthodontics and Crown & Bridge' }, { id: 'cat2', name: 'Conservative Dentistry and Endodontics' }, { id: 'cat3', name: 'Orthodontics & Dentofacial Orthopedics' }, { id: 'cat4', name: 'Periodontology and Implantology' }, { id: 'cat5', name: 'Oral & Maxillofacial Surgery' }, { id: 'cat6', name: 'Pedodontics and Preventive Dentistry' }, { id: 'cat7', name: 'Oral Medicine and Radiology' }, { id: 'cat8', name: 'Public Health Dentistry' }, { id: 'cat9', name: 'Oral Pathology & Microbiology' },
];


// ##################################################################
// ##               PAPER/POSTER REGISTRATION COMPONENT             ##
// ##################################################################
function FileInput({ label, file, setFile, id }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className={`mt-2 flex justify-center rounded-lg border border-dashed ${file ? 'border-purple-400' : 'border-gray-900/25'} px-6 py-4`}>
        <div className="text-center">
          <svg className="mx-auto h-10 w-10 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12A2.25 2.25 0 0120.25 20.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" /></svg>
          <div className="mt-2 flex text-sm leading-6 text-gray-600">
            <label htmlFor={id} className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500">
              <span>Upload a file</span>
              <input id={id} name={id} type="file" className="sr-only" onChange={(e) => setFile(e.target.files[0])} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          {file ? <p className="text-xs leading-5 text-purple-700 font-medium mt-1">{file.name}</p> : <p className="text-xs leading-5 text-gray-600">PDF, DOCX, JPG, PNG up to 10MB</p>}
        </div>
      </div>
    </div>
  );
}

function PaperPosterRegistrationForm() {
  const router = useRouter();
  const [hasRegistered, setHasRegistered] = useState(true);
  const [registrationId, setRegistrationId] = useState('');
  const [selection, setSelection] = useState({ paper: false, poster: false });

  const [userData, setUserData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const [paperCategory, setPaperCategory] = useState('');
  const [abstractFile, setAbstractFile] = useState(null);
  const [paperFile, setPaperFile] = useState(null);

  const [posterCategory, setPosterCategory] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [redirectMessage, setRedirectMessage] = useState('');

  const handleNoRegistration = () => {
    setHasRegistered(false);
    setRedirectMessage('NIDACON registration is compulsory. Please register for the conference first.');
  };

  const handleFetchDetails = async () => {
    if (!registrationId) {
      setFetchError('Please enter a Registration ID.');
      return;
    }
    setIsFetching(true);
    setFetchError('');
    setUserData(null);
    try {
      const res = await fetch(`/api/users/${registrationId}`);
      const data = await res.json();

      if (res.ok) {
        setUserData(data);
      } else {
        setFetchError(data.error || 'Failed to fetch details.');
      }
    } catch (error) {
      setFetchError('An error occurred while fetching details.');
    } finally {
      setIsFetching(false);
    }
  };

  // **CORRECTED LOGIC**: Handle submission by navigating to the user info page.
  const handleSubmit = () => {
    // Build the query string for the next page
    const queryParams = new URLSearchParams({
      type: 'paper-poster',
    });

    if (userData) {
      queryParams.set('name', userData.name);
      queryParams.set('email', userData.email);
      queryParams.set('mobile', userData.mobile);
      queryParams.set('address', userData.address);
    }

    router.push(`/register-now/user-info?${queryParams.toString()}`);
  };

  const isPaperDataComplete = selection.paper ? paperCategory && abstractFile && paperFile : true;
  const isPosterDataComplete = selection.poster ? posterCategory && posterFile : true;
  const isRegIdPresent = hasRegistered ? registrationId.trim() !== '' : true;
  const isSelectionMade = selection.paper || selection.poster;
  const isFormValid = isRegIdPresent && isSelectionMade && isPaperDataComplete && isPosterDataComplete;

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <p className="text-base font-semibold text-purple-600">Scientific Submission</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">Paper & Poster Presentation</h1>
            <p className="mt-6 text-lg text-gray-600">Submit your scientific work for NIDACON 2026.</p>
          </div>

          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-8">
            <div>
              <label htmlFor="registration-id" className="block text-sm font-medium text-gray-800">Please enter your NIDACON 2026 Registration ID</label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  id="registration-id"
                  value={registrationId}
                  onChange={(e) => setRegistrationId(e.target.value)}
                  placeholder="e.g., NIDA2026-XXXXX"
                  className="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={handleFetchDetails}
                  disabled={isFetching}
                  className="whitespace-nowrap rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                  {isFetching ? 'Fetching...' : 'Fetch Details'}
                </button>
              </div>
              {fetchError && <p className="mt-2 text-sm text-red-500">{fetchError}</p>}
              {userData && (
                <div className="mt-4 rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-700">
                  <p>
                    Details for <strong>{userData.name}</strong> fetched successfully.
                  </p>
                </div>
              )}
            </div>

            {redirectMessage && (
              <div className="mt-4 text-center">
                <p className="text-red-600 font-semibold">{redirectMessage}</p>
                <Link href="/register-now" className="mt-4 inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300">
                  Register Now
                </Link>
              </div>
            )}

            {hasRegistered && !redirectMessage && (
              <>
                <div>
                  <label htmlFor="registration-id" className="block text-sm font-medium text-gray-800">Please enter your NIDACON 2026 Registration ID</label>
                  <input type="text" id="registration-id" value={registrationId} onChange={(e) => setRegistrationId(e.target.value)} placeholder="e.g., NIDA2026-XXXXX" className="mt-2 block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-purple-500 focus:ring-purple-500" />
                </div>

                <div className="pt-8 border-t border-gray-200">
                  <label className="block text-base font-medium text-gray-800">2. Select submission type(s)</label>
                  <div className="mt-4 space-y-3">
                    <div className="relative flex items-start"><div className="flex h-6 items-center"><input id="paper" type="checkbox" checked={selection.paper} onChange={(e) => setSelection({ ...selection, paper: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" /></div><div className="ml-3 text-sm leading-6"><label htmlFor="paper" className="font-medium text-gray-900">Paper Submission</label></div></div>
                    <div className="relative flex items-start"><div className="flex h-6 items-center"><input id="poster" type="checkbox" checked={selection.poster} onChange={(e) => setSelection({ ...selection, poster: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" /></div><div className="ml-3 text-sm leading-6"><label htmlFor="poster" className="font-medium text-gray-900">Poster Submission</label></div></div>
                  </div>
                </div>

                {selection.paper && (
                  <div className="pt-8 border-t border-gray-200 space-y-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-purple-800">Paper Details</h3>
                    <fieldset>
                      <legend className="text-sm font-medium text-gray-800 mb-2">Select one category</legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        {presentationCategories.map(cat => (<div key={cat.id} className="flex items-center"><input id={`p-${cat.id}`} name="paper-category" type="radio" value={cat.id} onChange={(e) => setPaperCategory(e.target.value)} className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500" /><label htmlFor={`p-${cat.id}`} className="ml-3 block text-sm font-medium leading-6 text-gray-900">{cat.name}</label></div>))}
                      </div>
                    </fieldset>
                    <FileInput label="Upload your abstract" file={abstractFile} setFile={setAbstractFile} id="abstract-file" />
                    <FileInput label="Upload your full paper" file={paperFile} setFile={setPaperFile} id="paper-file" />
                  </div>
                )}

                {selection.poster && (
                  <div className="pt-8 border-t border-gray-200 space-y-6 animate-fade-in">
                    <h3 className="text-lg font-semibold text-purple-800">Poster Details</h3>
                    <fieldset>
                      <legend className="text-sm font-medium text-gray-800 mb-2">Select one category</legend>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        {presentationCategories.map(cat => (<div key={cat.id} className="flex items-center"><input id={`ps-${cat.id}`} name="poster-category" type="radio" value={cat.id} onChange={(e) => setPosterCategory(e.target.value)} className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500" /><label htmlFor={`ps-${cat.id}`} className="ml-3 block text-sm font-medium leading-6 text-gray-900">{cat.name}</label></div>))}
                      </div>
                    </fieldset>
                    <FileInput label="Upload your poster" file={posterFile} setFile={setPosterFile} id="poster-file" />
                  </div>
                )}

                <div className="pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!isFormValid}
                    className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    Submit and Proceed
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


// ##################################################################
// ##               WORKSHOP REGISTRATION COMPONENT                ##
// ##################################################################

function WorkshopRegistrationForm() {
  const router = useRouter();
  const [hasRegistered, setHasRegistered] = useState(null);
  const [registrationId, setRegistrationId] = useState('');
  const [selectedWorkshops, setSelectedWorkshops] = useState({});
  const [redirectMessage, setRedirectMessage] = useState('');

  const handleNoRegistration = () => {
    setHasRegistered(false);
    setRedirectMessage('NIDACON registration is compulsory to attend workshops. Please register for the conference first.');
  };

  const totalAmount = Object.keys(selectedWorkshops).reduce((sum, key) => {
    return selectedWorkshops[key] ? sum + workshopOptions.find(w => w.id === key).price : sum;
  }, 0);
  const selectedCount = Object.values(selectedWorkshops).filter(Boolean).length;

  const handleWorkshopChange = (workshop) => {
    const newSelection = { ...selectedWorkshops, [workshop.id]: !selectedWorkshops[workshop.id] };
    setSelectedWorkshops(newSelection);
  };

  const isWorkshopSelectionDisabled = hasRegistered === true && !registrationId;
  const isProceedButtonDisabled = selectedCount === 0 || isWorkshopSelectionDisabled;
  const workshopTypeParam = hasRegistered ? 'workshop-registered' : 'workshop-only';
  const regIdParam = hasRegistered ? `&regId=${registrationId}` : '';
  const selectedWorkshopsParam = Object.keys(selectedWorkshops).filter(k => selectedWorkshops[k]).join(',');

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <p className="text-base font-semibold text-purple-600">Workshop Registration</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">Hands-On Workshops</h1>
            <p className="mt-6 text-lg text-gray-600">Select from our exclusive range of hands-on workshops.</p>
          </div>
          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div>
              <label className="block text-base font-medium text-gray-800">1. Have you already registered for NIDACON 2026?</label>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <button onClick={() => { setHasRegistered(true); setRedirectMessage(''); }} className={`py-3 px-4 rounded-lg font-semibold transition-all ${hasRegistered === true ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>Yes</button>
                <button onClick={handleNoRegistration} className={`py-3 px-4 rounded-lg font-semibold transition-all ${hasRegistered === false ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}> No</button>
              </div>
            </div>

            {redirectMessage && (
              <div className="mt-8 text-center">
                <p className="text-red-600 font-semibold">{redirectMessage}</p>
                <Link href="/register-now" className="mt-4 inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300">
                  Register Now
                </Link>
              </div>
            )}

            {hasRegistered === true && !redirectMessage && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div>
                  <label htmlFor="registration-id" className="block text-sm font-medium text-gray-800">Please enter your NIDACON 2026 Registration ID</label>
                  <input type="text" id="registration-id" value={registrationId} onChange={(e) => setRegistrationId(e.target.value)} placeholder="e.g., NIDA2026-XXXXX" className="mt-2 block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-purple-500 focus:ring-purple-500" />
                </div>
                <fieldset className={'mt-8'} disabled={isWorkshopSelectionDisabled}>
                  <legend className={`text-sm font-medium ${isWorkshopSelectionDisabled ? 'text-gray-400' : 'text-gray-800'}`}>2. Select your desired workshop(s)</legend>
                  <div className={`mt-4 space-y-4 ${isWorkshopSelectionDisabled ? 'opacity-50' : ''}`}>
                    {workshopOptions.map((workshop) => (
                      <div key={workshop.id} className="relative flex items-start p-3 border rounded-lg">
                        <div className="flex h-6 items-center"><input id={workshop.id} name="workshops" type="checkbox" onChange={() => handleWorkshopChange(workshop)} checked={!!selectedWorkshops[workshop.id]} className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500" /></div>
                        <div className="ml-3 text-sm leading-6 flex-grow"><label htmlFor={workshop.id} className="font-medium text-gray-900">{workshop.name}</label></div>
                        <p className="ml-4 font-semibold text-gray-800">₹{workshop.price.toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </fieldset>
                {selectedCount > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    {selectedCount > 1 && (<p className="text-xm text-red-600 font-bold mb-4">* You have selected multiple workshops. Please ensure their timings do not clash.</p>)}
                    <div className="flex justify-between items-center"><span className="text-lg font-medium text-gray-900">Workshop Total:</span><span className="text-2xl font-bold text-purple-700">₹{totalAmount.toLocaleString('en-IN')}</span></div>
                  </div>
                )}
                <div className="mt-10">
                  <Link href={`/register-now/user-info?type=${workshopTypeParam}${regIdParam}&workshops=${selectedWorkshopsParam}&price=${totalAmount}`} passHref>
                    <button type="button" disabled={isProceedButtonDisabled} className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed">Proceed to Payment</button>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


// ##################################################################
// ##               DELEGATE REGISTRATION COMPONENT                ##
// ##################################################################

function DelegateRegistrationForm({ registrationType }) {
  const [isRcMember, setIsRcMember] = useState(true);
  const [subCategory, setSubCategory] = useState('');
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => { setSubCategory(''); setTotalAmount(0); }, [isRcMember]);

  const handleSubCategoryChange = (option) => {
    setSubCategory(option.id);
    const newPrice = isRcMember ? option.rcPrice : option.nonRcPrice;
    setTotalAmount(newPrice);
  };

  const currentFeatures = isRcMember ? rcMemberFeatures : nonMemberFeatures;
  const memberTypeParam = isRcMember ? 'rc-member' : 'without-rc-member';
  const displayType = registrationType.charAt(0).toUpperCase() + registrationType.slice(1);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-base font-semibold text-purple-600">Step 2 of 3</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">Confirm Your Details</h1>
            <p className="mt-6 text-lg text-gray-600">You&apos;ve selected: <span className="font-bold text-purple-700">{displayType} Registration</span>.<br />Now, please specify your membership status.</p>
          </div>
          <div className="mt-12">
            <div className="max-w-md mx-auto relative flex w-full p-1 bg-gray-200 rounded-full mb-12">
              <span className="absolute top-0 bottom-0 w-1/2 h-full transition-transform duration-300 ease-in-out bg-white rounded-full shadow-md" style={{ transform: isRcMember ? 'translateX(0%)' : 'translateX(100%)' }}></span>
              <button onClick={() => setIsRcMember(true)} className={`relative z-10 w-1/2 py-3 text-sm sm:text-base font-semibold text-center rounded-full transition-colors duration-300 ${isRcMember ? 'text-purple-700' : 'text-gray-500'}`}>With RC Member</button>
              <button onClick={() => setIsRcMember(false)} className={`relative z-10 w-1/2 py-3 text-sm sm:text-base font-semibold text-center rounded-full transition-colors duration-300 ${!isRcMember ? 'text-purple-700' : 'text-gray-500'}`}>Without RC Member</button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 h-full flex flex-col">
                <fieldset>
                  <legend className="text-lg font-semibold text-gray-900">Choose Your Registration Category</legend>
                  <div className="mt-5 space-y-4">
                    {allDelegateOptions.map((option) => (
                      <div key={option.id} className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${subCategory === option.id ? 'bg-purple-50 border-purple-400 ring-2 ring-purple-300' : 'border-gray-300 hover:border-gray-400'}`} onClick={() => handleSubCategoryChange(option)}>
                        <div className="flex items-center">
                          <input id={option.id} name="sub-category" type="radio" checked={subCategory === option.id} onChange={() => handleSubCategoryChange(option)} className="h-5 w-5 border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" />
                          <div className="ml-3 text-sm leading-6 flex-grow"><label htmlFor={option.id} className="font-medium text-gray-800 cursor-pointer">{option.label}</label><p className="text-xs text-gray-500">{isRcMember ? option.rcDesc : option.nonRcDesc}</p></div>
                          <p className="ml-4 text-sm font-bold text-purple-700">₹{isRcMember ? option.rcPrice.toLocaleString('en-IN') : option.nonRcPrice.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </fieldset>
                <div className="mt-auto pt-6 border-t border-gray-200 mt-6"><div className="flex justify-between items-center"><span className="text-lg font-medium text-gray-900">Total Amount:</span><span className="text-2xl font-bold text-purple-700">₹{totalAmount.toLocaleString('en-IN')}</span></div></div>
              </div>
              <div className="bg-purple-50 p-8 rounded-2xl border border-purple-200 h-full">
                <h3 className="text-lg font-semibold text-gray-900">What&apos;s Included</h3>
                <ul className="mt-5 space-y-3 text-gray-700">
                  {currentFeatures.map((feature, index) => (<li key={index} className="flex items-start"><svg className="flex-shrink-0 w-5 h-5 text-purple-500 mr-2 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg><span>{feature}</span></li>))}
                </ul>
              </div>
            </div>
            <div className="mt-10">
              <Link href={`/register-now/user-info?type=${registrationType}&memberType=${memberTypeParam}&subCategory=${subCategory}&price=${totalAmount}`} passHref>
                <button type="button" disabled={!subCategory} className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed">Proceed to Next Step</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


// ##################################################################
// ##               MAIN PAGE COMPONENT (ROUTER)                   ##
// ##################################################################

function RegistrationDetails() {
  const searchParams = useSearchParams();
  const registrationType = searchParams.get('type');

  switch (registrationType) {
    case 'workshop':
      return <WorkshopRegistrationForm />;
    case 'paper-poster':
      return <PaperPosterRegistrationForm />;
    case 'delegate':
    default:
      return <DelegateRegistrationForm registrationType={registrationType || 'delegate'} />;
  }
}

export default function RegistrationDetailsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen text-lg font-semibold text-gray-600">Loading Registration Form...</div>}>
      <RegistrationDetails />
    </Suspense>
  );
}