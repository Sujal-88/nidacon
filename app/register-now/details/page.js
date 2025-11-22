// app/register-now/details/page.js

"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image'; // Import Image
import { AlertTriangle, Lock } from 'lucide-react'; // Added Lock icon
import MembershipPopup from '@/components/MembershipPopup'; // Import MembershipPopup

// --- Data (workshopOptions, presentationCategories remain the same) ---
const workshopOptions = [
  // ... (keep existing workshop options)
  { id: 'ws1', name: 'Hands-on: Advanced Implantology', price: 1.5 }, { id: 'ws2', name: 'Hands-on: Digital Smile Design', price: 1.3 }, { id: 'ws3', name: 'Hands-on: Rotary Endodontics', price: 1.2 }, { id: 'ws4', name: 'Hands-on: Laser Dentistry', price: 1.6 }, { id: 'ws5', name: 'Hands-on: Composite Artistry', price: 1100 }, { id: 'ws6', name: 'Hands-on: Periodontal Flap Surgery', price: 1400 },
];
const presentationCategories = [
  // ... (keep existing presentation categories)
  { id: 'cat1', name: 'Prosthodontics and Crown & Bridge' }, { id: 'cat2', name: 'Conservative Dentistry and Endodontics' }, { id: 'cat3', name: 'Orthodontics & Dentofacial Orthopedics' }, { id: 'cat4', name: 'Periodontology and Implantology' }, { id: 'cat5', name: 'Oral & Maxillofacial Surgery' }, { id: 'cat6', name: 'Pedodontics and Preventive Dentistry' }, { id: 'cat7', name: 'Oral Medicine and Radiology' }, { id: 'cat8', name: 'Public Health Dentistry' }, { id: 'cat9', name: 'Oral Pathology & Microbiology' },
];

// --- Features Lists ---
const baseMemberFeatures = ["Registration to main event on 10th and 11th", "Registration Kit & Certificate", "Entry to Trade fair", "2 Lunches"];
const baseNonMemberFeatures = ["Registration to main event on 10th and 11th", "Registration Kit & Certificate", "Entry to Trade fair", "2 Lunches"];
const implantFeature = "WITH FREE IMPLANT"; // Define feature text
const banquetFeature = "GALA Buffet Dinner"; // Define feature text

// --- PaperPosterRegistrationForm and FileInput components remain unchanged ---
// app/register-now/details/page.js

// ...

// --- FileInput components ---
function FileInput({ label, file, setFile, id, onFileError }) { // <-- ADD onFileError PROP
  const MAX_FILE_SIZE = 15 * 1024 * 1024; // 10MB limit for documents/posters

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      setFile(null);
      if (onFileError) onFileError(null); // Clear error
      return;
    }

    // Check File Size
    if (selectedFile.size > MAX_FILE_SIZE) {
      if (onFileError) onFileError(`File is too large (Max 10MB).`);
      setFile(null);
      e.target.value = null; // Clear the input field
      return;
    }

    // Success
    if (onFileError) onFileError(null); // Clear error
    setFile(selectedFile);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className={`mt-2 flex justify-center rounded-lg border border-dashed ${file ? 'border-purple-400' : 'border-gray-900/25'} px-6 py-4`}>
        <div className="text-center">
          {/* ... svg icon ... */}
          <div className="mt-2 flex text-sm leading-6 text-gray-600">
            <label htmlFor={id} className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500">
              <span>Upload a file:</span>
              <input
                id={id}
                name={id}
                type="file"
                className="sr-only"
                onChange={handleChange} // <-- Use our new handler
              />
              {file ? (
                <p className="text-xs leading-5 text-purple-700 font-medium mt-1">{file.name}</p>
              ) : (
                <p className="text-xs leading-5 text-gray-600">PDF, DOCX, JPG, PNG up to 10MB</p> // This warning is already here!
              )}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

// ...

function PaperPosterRegistrationForm() {
  const router = useRouter();
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
  const [isPaperPosterOpen, setIsPaperPosterOpen] = useState(false); // State for date check

  useEffect(() => {
    // Check if the current date is on or after November 15th, 2025
    const openDate = new Date('2025-11-15T00:00:00');
    const currentDate = new Date();
    // SETTING TO TRUE FOR TESTING - REMOVE IN PRODUCTION
    // setIsPaperPosterOpen(true);

    // PRODUCTION LOGIC
    setIsPaperPosterOpen(currentDate >= openDate);
  }, []);

  const handleFetchDetails = async () => {
    // ... (keep existing handleFetchDetails code)
    if (!registrationId) {
      setFetchError('Please enter a Registration ID.');
      return;
    }
    setIsFetching(true);
    setFetchError('');
    setUserData(null); // Clear previous data
    try {
      // Call the API endpoint
      const res = await fetch(`/api/members/${registrationId.trim()}`); // Trim input
      const data = await res.json();

      if (res.ok) { // Status 200-299
        setUserData(data);
        setFetchError(''); // Clear error on success
      } else if (res.status === 404) {
        setFetchError('Registration ID not found. Please check and try again.');
      } else if (res.status === 400) {
        setFetchError(data.error || 'Invalid Registration ID format.');
      } else {
        // Handle other errors (like 500 Internal Server Error)
        setFetchError(data.error || 'Failed to fetch details due to a server issue.');
      }
    } catch (error) {
      console.error('Fetch details error:', error); // Log the actual error
      setFetchError('An network error occurred while fetching details. Please check your connection.');
    } finally {
      setIsFetching(false);
    }
  };

  const uploadFile = async (file) => {
    // ... (keep existing uploadFile code)
    if (!file) return null; // Return null if no file

    const uploadFormData = new FormData();
    uploadFormData.append('file', file);

    try {
      // Use the existing endpoint (or create a dedicated one if needed)
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      const result = await response.json();

      if (response.ok && result.url) {
        return result.url; // Return the URL on success
      } else {
        throw new Error(result.message || `Upload failed for ${file.name}`);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setFetchError(`Error uploading ${file.name}. Please try again.`); // Show error to user
      return null; // Indicate failure
    }
  };

  const handleSubmit = async () => {
    // ... (keep existing handleSubmit code)
    // Basic validation check
    if (!isFormValid) return;

    setIsFetching(true); // Reuse isFetching state for loading indicator
    setFetchError(''); // Clear previous errors

    let abstractUrl = null;
    let paperUrl = null;
    let posterUrl = null;
    let uploadSuccess = true;

    // Upload files sequentially (or in parallel with Promise.all if preferred)
    if (selection.paper && abstractFile) {
      abstractUrl = await uploadFile(abstractFile);
      if (!abstractUrl) uploadSuccess = false;
    }
    if (selection.paper && paperFile && uploadSuccess) {
      paperUrl = await uploadFile(paperFile);
      if (!paperUrl) uploadSuccess = false;
    }
    if (selection.poster && posterFile && uploadSuccess) {
      posterUrl = await uploadFile(posterFile);
      if (!posterUrl) uploadSuccess = false;
    }

    setIsFetching(false); // Stop loading indicator

    if (!uploadSuccess) {
      // Error message is already set by uploadFile helper
      return; // Stop if any upload failed
    }

    // Construct query parameters ONLY if uploads were successful
    const queryParams = new URLSearchParams({
      type: 'paper-poster',
      // Include categories
      ...(selection.paper && { paperCat: paperCategory }),
      ...(selection.poster && { posterCat: posterCategory }),
      // Include File URLs
      ...(abstractUrl && { abstractUrl: abstractUrl }),
      ...(paperUrl && { paperUrl: paperUrl }),
      ...(posterUrl && { posterUrl: posterUrl }),
    });

    // Add user data if fetched
    if (userData) {
      queryParams.set('name', userData.name || ''); // Ensure fallback empty strings
      queryParams.set('email', userData.email || '');
      queryParams.set('mobile', userData.mobile || '');
      queryParams.set('address', userData.address || '');
    }

    console.log("Navigating to user-info with params:", queryParams.toString());
    router.push(`/register-now/user-info?${queryParams.toString()}`);
  };

  const isPaperDataComplete = !selection.paper || (paperCategory && abstractFile && paperFile);
  const isPosterDataComplete = !selection.poster || (posterCategory && posterFile);
  const isSelectionMade = selection.paper || selection.poster;
  // Check form validity AND if registration is open
  const isFormValid = isPaperPosterOpen && isSelectionMade && isPaperDataComplete && isPosterDataComplete;

  // Render message if registration is not open yet
  if (!isPaperPosterOpen) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-xl mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            {/* ADDED: NIDACON Logo */}
            <Image
              src="/NIDACON/nida_logo.png"
              alt="NIDACON Logo"
              width={200}
              height={200}
              className="mx-auto mb-4"
            />
            <Lock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Paper & Poster Submission</h1>
            <p className="mt-4 text-lg text-gray-600">
              Submissions for Paper & Poster Presentations will open on <strong>November 15th, 2025</strong>. Please check back then.
            </p>
            <Link href="/register-now" className="mt-8 inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300">
              Back to Registration Options
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="text-center">
            {/* ADDED: NIDACON Logo */}
            <Image
              src="/NIDACON/nida_logo.png"
              alt="NIDACON Logo"
              width={300}
              height={300}
              className="mx-auto mb-6"
            />
            <p className="text-base font-semibold text-purple-600">Scientific Submission</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">Paper & Poster Presentation</h1>
            <p className="mt-6 text-lg text-gray-600">Submit your scientific work for NIDACON 2026.</p>
          </div>

          {/* Form Content */}
          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-8">
            {/* Membership Popup Integration */}
            <div className="flex justify-center -mt-2 mb-6 px-4">
              <MembershipPopup text='Become an IDA Nagpur Member / Renew Membership' textColor='black' />
            </div>

            {/* Registration ID Input (Optional Prefill) */}
            <div>
              <label htmlFor="registration-id" className="block text-sm font-medium text-gray-800">
                Enter your NIDACON 2026 Registration ID to pre-fill your details (Optional).
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  id="registration-id"
                  value={registrationId}
                  onChange={(e) => setRegistrationId(e.target.value)}
                  placeholder="e.g., NIDA101"
                  className="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={handleFetchDetails}
                  disabled={isFetching || !registrationId}
                  className="whitespace-nowrap rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
                >
                  {isFetching ? 'Fetching...' : 'Fetch Details'}
                </button>
              </div>
              {fetchError && <p className="mt-2 text-sm text-red-500">{fetchError}</p>}
              {userData && (
                <div className="mt-4 rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-700">
                  <p>Details for <strong>{userData.name}</strong> fetched successfully. You can still edit them on the next page.</p>
                </div>
              )}
            </div>

            {/* Submission Type Selection */}
            <div className="pt-8 border-t border-gray-200">
              <label className="block text-base font-medium text-gray-800">Select submission type(s)</label>
              <div className="mt-4 space-y-3">
                {/* Paper Checkbox */}
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input id="paper" type="checkbox" checked={selection.paper} onChange={(e) => setSelection({ ...selection, paper: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="paper" className="font-medium text-gray-900">Paper Submission</label>
                  </div>
                </div>
                {/* Poster Checkbox */}
                <div className="relative flex items-start">
                  <div className="flex h-6 items-center">
                    <input id="poster" type="checkbox" checked={selection.poster} onChange={(e) => setSelection({ ...selection, poster: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  </div>
                  <div className="ml-3 text-sm leading-6">
                    <label htmlFor="poster" className="font-medium text-gray-900">Poster Submission</label>
                  </div>
                </div>
              </div>
            </div>

            {/* Paper Details Section */}
            {selection.paper && (
              <div className="pt-8 border-t border-gray-200 space-y-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-purple-800">Paper Details</h3>
                {/* Category Selection */}
                <fieldset>
                  <legend className="text-sm font-medium text-gray-800 mb-2">Select one category</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {presentationCategories.map(cat => (
                      <div key={cat.id} className="flex items-center">
                        <input id={`p-${cat.id}`} name="paper-category" type="radio" value={cat.name} onChange={(e) => setPaperCategory(e.target.value)} className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500" />
                        <label htmlFor={`p-${cat.id}`} className="ml-3 block text-sm font-medium leading-6 text-gray-900">{cat.name}</label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                {/* File Inputs */}
                <FileInput label="Upload your full paper" file={paperFile} setFile={setPaperFile} id="paper-file" onFileError={setFetchError} />
              </div>
            )}
            {/* Poster Details Section */}
            {selection.poster && (
              <div className="pt-8 border-t border-gray-200 space-y-6 animate-fade-in">
                <h3 className="text-lg font-semibold text-purple-800">Poster Details</h3>
                {/* Category Selection */}
                <fieldset>
                  <legend className="text-sm font-medium text-gray-800 mb-2">Select one category</legend>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                    {presentationCategories.map(cat => (
                      <div key={cat.id} className="flex items-center">
                        <input id={`ps-${cat.id}`} name="poster-category" type="radio" value={cat.name} onChange={(e) => setPosterCategory(e.target.value)} className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500" />
                        <label htmlFor={`ps-${cat.id}`} className="ml-3 block text-sm font-medium leading-6 text-gray-900">{cat.name}</label>
                      </div>
                    ))}
                  </div>
                </fieldset>
                {/* File Input */}
                <FileInput label="Upload your poster" file={posterFile} setFile={setPosterFile} id="poster-file" />
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || isFetching} // Disable during fetching too
                className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isFetching ? 'Uploading & Submitting...' : (userData ? 'Submit & Prefill Info' : 'Submit & Enter Info')}
              </button>
              {/* Helpful message for disabled button */}
              {!isFormValid && (
                <p className="mt-2 text-xs text-center text-gray-500">
                  Please select at least one submission type and complete the required fields (category & file uploads) to proceed.
                </p>
              )}
              {/* Display upload/submit errors */}
              {fetchError && !isFetching && <p className="mt-2 text-sm text-red-500 text-center">{fetchError}</p>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


function WorkshopRegistrationForm() {
  const router = useRouter();
  const [hasRegistered, setHasRegistered] = useState(null);
  const [registrationId, setRegistrationId] = useState('');
  const [selectedWorkshops, setSelectedWorkshops] = useState({});
  const [redirectMessage, setRedirectMessage] = useState('');

  // ADDED: State for workshop date check
  const [isWorkshopOpen, setIsWorkshopOpen] = useState(false);

  // ADDED: State for fetch logic (like paper-poster)
  const [userData, setUserData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    // Check if the current date is on or after November 15th, 2025
    const openDate = new Date('2025-11-15T00:00:00');
    const currentDate = new Date();
    // SETTING TO TRUE FOR TESTING - REMOVE IN PRODUCTION
    // setIsWorkshopOpen(true);

    // PRODUCTION LOGIC
    setIsWorkshopOpen(currentDate >= openDate);
  }, []);

  // ADDED: Fetch details logic (like paper-poster)
  const handleFetchDetails = async () => {
    if (!registrationId) {
      setFetchError('Please enter a Registration ID.');
      return;
    }
    setIsFetching(true);
    setFetchError('');
    setUserData(null); // Clear previous data
    try {
      // Call the API endpoint
      const res = await fetch(`/api/members/${registrationId.trim()}`);
      const data = await res.json();

      if (res.ok) {
        setUserData(data);
        setFetchError('');
      } else if (res.status === 404) {
        setFetchError('Registration ID not found. Please check and try again.');
      } else if (res.status === 400) {
        setFetchError(data.error || 'Invalid Registration ID format.');
      } else {
        setFetchError(data.error || 'Failed to fetch details due to a server issue.');
      }
    } catch (error) {
      console.error('Fetch details error:', error);
      setFetchError('A network error occurred while fetching details. Please check your connection.');
    } finally {
      setIsFetching(false);
    }
  };


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

  // ADDED: Build user data params like paper-poster
  const getUserDataParams = () => {
    if (!userData) return '';
    const params = new URLSearchParams();
    if (userData.name) params.set('name', userData.name);
    if (userData.email) params.set('email', userData.email);
    if (userData.mobile) params.set('mobile', userData.mobile);
    if (userData.address) params.set('address', userData.address);
    return params.toString() ? `&${params.toString()}` : '';
  };

  // ADDED: Render message if registration is not open yet
  if (!isWorkshopOpen) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="container mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-xl mx-auto text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            {/* ADDED: NIDACON Logo */}
            <Image
              src="/NIDACON/nida_logo.png"
              alt="NIDACON Logo"
              width={200}
              height={200}
              className="mx-auto mb-4"
            />
            <Lock className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Hands-on Workshops</h1>
            <p className="mt-4 text-lg text-gray-600">
              Enrollment for Hands-on Workshops will open on <strong>November 15th, 2025</strong>. Please check back then.
            </p>
            <Link href="/register-now" className="mt-8 inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300">
              Back to Registration Options
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center">
            {/* ADDED: NIDACON Logo */}
            <Image
              src="/NIDACON/nida_logo.png"
              alt="NIDACON Logo"
              width={300}
              height={300}
              className="mx-auto mb-6"
            />
            <p className="text-base font-semibold text-purple-600">Workshop Registration</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">Hands-On Workshops</h1>
            <p className="mt-6 text-lg text-gray-600">Select from our exclusive range of hands-on workshops.</p>
            {/* MOVED Membership Popup */}
          </div>
          {/* Form Content */}
          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            {/* Membership Popup Integration */}
            <div className="flex justify-center -mt-2 mb-6 px-4">
              <MembershipPopup text='Become an IDA Nagpur Member / Renew Membership' textColor='black' />
            </div>

            {/* NIDACON Registration Check */}
            <div>
              <label className="block text-base font-medium text-gray-800">1. Have you already registered for NIDACON 2026?</label>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <button onClick={() => { setHasRegistered(true); setRedirectMessage(''); }} className={`py-3 px-4 rounded-lg font-semibold transition-all ${hasRegistered === true ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}>Yes</button>
                <button onClick={handleNoRegistration} className={`py-3 px-4 rounded-lg font-semibold transition-all ${hasRegistered === false ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700'}`}> No</button>
              </div>
            </div>
            {/* Redirect Message */}
            {redirectMessage && (
              <div className="mt-8 text-center">
                <p className="text-red-600 font-semibold">{redirectMessage}</p>
                <Link href="/register-now" className="mt-4 inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition-colors duration-300">
                  Register Now
                </Link>
              </div>
            )}
            {/* Workshop Selection */}
            {hasRegistered === true && !redirectMessage && (
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-6">
                {/* Registration ID Input (Optional Prefill) - ADDED: Like paper-poster */}
                <div>
                  <label htmlFor="registration-id-fetch" className="block text-sm font-medium text-gray-800">
                    Enter your NIDACON 2026 Registration ID to pre-fill your details (Optional).
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      id="registration-id-fetch"
                      value={registrationId}
                      onChange={(e) => setRegistrationId(e.target.value)}
                      placeholder="e.g., NIDA101"
                      className="block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={handleFetchDetails}
                      disabled={isFetching || !registrationId}
                      className="whitespace-nowrap rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:outline-2 focus:outline-offset-2 focus:outline-indigo-600 disabled:opacity-50"
                    >
                      {isFetching ? 'Fetching...' : 'Fetch Details'}
                    </button>
                  </div>
                  {fetchError && <p className="mt-2 text-sm text-red-500">{fetchError}</p>}
                  {userData && (
                    <div className="mt-4 rounded-lg border border-green-300 bg-green-50 p-4 text-sm text-green-700">
                      <p>Details for <strong>{userData.name}</strong> fetched successfully. You can still edit them on the next page.</p>
                    </div>
                  )}
                </div>

                {/* Workshop Checkboxes */}
                <fieldset className={'mt-8'} disabled={isWorkshopSelectionDisabled}>
                  <legend className={`text-sm font-medium ${isWorkshopSelectionDisabled ? 'text-gray-400' : 'text-gray-800'}`}>2. Select your desired workshop(s) {isWorkshopSelectionDisabled ? '(Enter Registration ID first)' : ''}</legend>
                  <div className={`mt-4 space-y-4 ${isWorkshopSelectionDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
                    {workshopOptions.map((workshop) => (
                      <div key={workshop.id} className="relative flex items-start p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex h-6 items-center"><input id={workshop.id} name="workshops" type="checkbox" onChange={() => handleWorkshopChange(workshop)} checked={!!selectedWorkshops[workshop.id]} className="h-5 w-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 cursor-pointer" /></div>
                        <div className="ml-3 text-sm leading-6 flex-grow"><label htmlFor={workshop.id} className="font-medium text-gray-900 cursor-pointer">{workshop.name}</label></div>
                        <p className="ml-4 font-semibold text-gray-800">₹{workshop.price.toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </fieldset>

                {/* Total and Proceed Button */}
                {selectedCount > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    {selectedCount > 1 && (<p className="text-xs text-red-600 font-bold mb-4">* You have selected multiple workshops. Please ensure their timings do not clash.</p>)}
                    <div className="flex justify-between items-center"><span className="text-lg font-medium text-gray-900">Workshop Total:</span><span className="text-2xl font-bold text-purple-700">₹{totalAmount.toLocaleString('en-IN')}</span></div>
                  </div>
                )}
                <div className="mt-10">
                  <Link href={`/register-now/user-info?type=${workshopTypeParam}${regIdParam}&workshops=${selectedWorkshopsParam}&price=${totalAmount}${getUserDataParams()}`} passHref>
                    <button type="button" disabled={isProceedButtonDisabled} className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed">
                      Proceed to User Info
                    </button>
                  </Link>
                  {isProceedButtonDisabled && selectedCount === 0 && (
                    <p className="mt-2 text-xs text-center text-gray-500">Please select at least one workshop.</p>
                  )}
                  {isWorkshopSelectionDisabled && (
                    <p className="mt-2 text-xs text-center text-gray-500">Please enter your Registration ID to select workshops.</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}


function DelegateRegistrationForm({ registrationType }) {
  const router = useRouter();
  const [isMember, setIsMember] = useState(null); // Keep null to force selection
  const [addOns, setAddOns] = useState({
    implant: false,
    banquet: false,
  });

  const calculateTotal = () => {
    if (isMember === null) return 0;
    let basePrice = isMember ? 2000 : 3000;
    if (addOns.implant) basePrice += 2200;
    if (addOns.banquet) basePrice += 2000;
    return basePrice;
  };

  const totalAmount = calculateTotal();

  const handleAddOnChange = (e) => {
    const { name, checked } = e.target;
    setAddOns(prev => ({ ...prev, [name]: checked }));
  };

  const handleProceed = () => {
    if (isMember === null) return;
    const queryParams = new URLSearchParams({
      type: registrationType,
      memberType: isMember ? 'member' : 'non-member',
      price: totalAmount.toString(),
    });
    if (addOns.implant) queryParams.set('implant', 'true');
    if (addOns.banquet) queryParams.set('banquet', 'true');
    router.push(`/register-now/user-info?${queryParams.toString()}`);
  }

  const displayType = registrationType.charAt(0).toUpperCase() + registrationType.slice(1);
  const isProceedDisabled = isMember === null; // Logic remains correct

  // --- Determine current features list ---
  let currentFeatures = [];
  if (isMember !== null) {
    currentFeatures = isMember ? [...baseMemberFeatures] : [...baseNonMemberFeatures]; // Create copies

    // Add add-on features if selected
    if (addOns.implant) {
      // Find index of "Registration to main event..." to insert before it, or add to start
      const insertIndex = currentFeatures.findIndex(f => f.startsWith("Registration to main event"));
      if (insertIndex !== -1) {
        currentFeatures.splice(insertIndex, 0, implantFeature);
      } else {
        currentFeatures.unshift(implantFeature);
      }
    }
    if (addOns.banquet) {
      // Find index of "NIDA Master Class..." or "Registration to main event..."
      const insertIndex = currentFeatures.findIndex(f => f === "NIDA Master Class on 9th January" || f.startsWith("Registration to main event"));
      if (insertIndex !== -1) {
        currentFeatures.splice(insertIndex, 0, banquetFeature);
      } else {
        currentFeatures.unshift(banquetFeature);
      }
    }
  }
  // --- End determine current features list ---


  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            {/* ADDED: NIDACON Logo */}
            <Image
              src="/NIDACON/nida_logo.png"
              alt="NIDACON Logo"
              width={300}
              height={300}
              className="mx-auto mb-6"
            />
            <p className="text-base font-semibold text-purple-600">Step 2 of 3</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">Delegate Registration Options</h1>
            <p className="mt-6 text-lg text-gray-600">You&apos;ve selected: <span className="font-bold text-purple-700">{displayType} Registration</span>.<br />Choose your status and optional add-ons below.</p>
            <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg inline-flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Early Bird Registration ends 25th November! Prices will increase after this date.</span>
            </div>
          </div>
          <div className="mt-12">
            {/* Membership Popup Integration */}
            <div className="flex justify-center mb-8 px-4">
              <MembershipPopup text='Become an IDA Nagpur Member / Renew Membership' textColor='black' />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-8 h-full flex flex-col">

                {/* === UPDATED: Member/Non-Member Selection (Segmented Control) === */}
                <div>
                  <label className="block text-base font-medium text-gray-800 mb-4 text-center">1. Select Your Status</label>
                  <div className="relative flex w-full max-w-sm mx-auto p-1 bg-gray-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setIsMember(false)}
                      className={`relative w-1/2 rounded-md py-3 text-sm font-semibold transition-colors duration-300 ${isMember === false ? 'bg-white text-purple-700 shadow-md' : 'bg-transparent text-gray-700 hover:text-gray-900'
                        }`}
                    >
                      Non-Member
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMember(true)}
                      className={`relative w-1/2 rounded-md py-3 text-sm font-semibold transition-colors duration-300 ${isMember === true ? 'bg-white text-purple-700 shadow-md' : 'bg-transparent text-gray-700 hover:text-gray-900'
                        }`}
                    >
                      IDA Member
                    </button>
                  </div>

                  {/* Show prices based on selection */}
                  {isMember !== null && (
                    <div className="text-center mt-4 animate-fade-in">
                      <p className="text-3xl font-bold text-purple-700">
                        {isMember ? '₹2000' : '₹3000'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {isMember ? '(Member Base Price - Early Bird)' : '(Non-Member Base Price - Early Bird)'}
                      </p>
                    </div>
                  )}
                </div>
                {/* === END UPDATED SECTION === */}


                {/* Add-ons Section */}
                {/* <div className={`pt-8 border-t border-gray-200 ${isMember === null ? 'opacity-50 pointer-events-none' : ''}`}>
                  <fieldset>
                    <legend className="text-base font-medium text-gray-800">2. Optional Add-ons {isMember === null ? '(Select Status First)' : ''}</legend>
                    <div className="mt-4 space-y-4">

                      <div className="relative flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex h-6 items-center">
                          <input
                            id="implant"
                            name="implant"
                            type="checkbox"
                            checked={addOns.implant}
                            onChange={handleAddOnChange}
                            className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6 flex-grow">
                          <label htmlFor="implant" className="font-medium text-gray-900 cursor-pointer">
                            WITH FREE IMPLANT
                          </label>
                        </div>
                        <p className="ml-4 font-semibold text-gray-800">+ ₹2200</p>
                      </div>
                      // Banquet Checkout
                      <div className="relative flex items-start p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex h-6 items-center">
                          <input
                            id="banquet"
                            name="banquet"
                            type="checkbox"
                            checked={addOns.banquet}
                            onChange={handleAddOnChange}
                            className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer" // Red color for banquet
                          />
                        </div>
                        <div className="ml-3 text-sm leading-6 flex-grow">
                          <label htmlFor="banquet" className="font-medium text-gray-900 cursor-pointer">
                            WITH BANQUET AND GALA DINNER
                          </label>
                        </div>
                        <p className="ml-4 font-semibold text-gray-800">+ ₹2000</p>
                      </div>
                    </div>
                  </fieldset>
                </div> */}

                {/* Total Amount */}
                <div className="mt-auto pt-8 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                    <span className="text-2xl font-bold text-purple-700">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* --- Right Column: What's Included --- */}
              <div className="bg-purple-50 p-8 rounded-2xl border border-purple-200 h-full">
                <h3 className="text-lg font-semibold text-gray-900">What&apos;s Included</h3>
                {isMember === null ? (
                  <p className="mt-4 text-gray-500">Select Member or Non-Member status to see included features.</p>
                ) : (
                  <ul className="mt-5 space-y-3 text-gray-700">
                    {currentFeatures.map((feature, index) => {
                      // Define colors based on feature text
                      let textColorClass = "text-gray-700"; // Default
                      if (feature === implantFeature && addOns.implant) {
                        textColorClass = "text-green-700 font-semibold"; // Green for implant
                      } else if (feature === banquetFeature && addOns.banquet) {
                        textColorClass = "text-green-700 font-semibold"; // Red for banquet
                      }

                      return (
                        <li key={index} className="flex items-start">
                          <svg className={`flex-shrink-0 w-5 h-5 ${feature === implantFeature && addOns.implant ? 'text-green-500' :
                            feature === banquetFeature && addOns.banquet ? 'text-green-500' :
                              'text-purple-500' // Default purple check
                            } mr-2 mt-0.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className={textColorClass}>{feature}</span> {/* Apply conditional text color */}
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            {/* Proceed Button */}
            <div className="mt-10">
              <button
                type="button"
                onClick={handleProceed}
                disabled={isProceedDisabled}
                className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md transition-all duration-300 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Proceed to Enter Information
              </button>
              {isProceedDisabled && (
                <p className="mt-2 text-xs text-center text-gray-500">
                  Please select Member or Non-Member status first.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


// --- Main Page Component (ROUTER) remains unchanged ---
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
      return <DelegateRegistrationForm registrationType={'delegate'} />;
  }
}

export default function RegistrationDetailsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen text-lg font-semibold text-gray-600">Loading Registration Form...</div>}>
      <RegistrationDetails />
    </Suspense>
  );
}