// app/register-now/details/page.js

"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AlertTriangle, Lock } from 'lucide-react';
import MembershipPopup from '@/components/MembershipPopup';

// --- Data Updated with Dates for Workshops ---
const workshopOptions = [
  // 9th January Workshops
  { id: 'ws1', name: 'Hands-on: Advanced Implantology', price: 15, date: '9th January', speaker: 'Dr. ABC' },
  { id: 'ws2', name: 'Hands-on: Digital Smile Design', price: 13, date: '9th January', speaker: 'Dr. ABC' },

  // 10th January Workshops
  { id: 'ws3', name: 'Hands-on: Rotary Endodontics', price: 1200, date: '10th January', speaker: 'Dr. ABC' },
  { id: 'ws4', name: 'Hands-on: Laser Dentistry', price: 1600, date: '10th January', speaker: 'Dr. ABC' },

  // 11th January Workshops
  { id: 'ws5', name: 'Hands-on: Composite Artistry', price: 1100, date: '11th January', speaker: 'Dr. ABC' },
  { id: 'ws6', name: 'Hands-on: Periodontal Flap Surgery', price: 1400, date: '11th January', speaker: 'Dr. ABC' },
];

const presentationCategories = [
  { id: 'cat1', name: 'Prosthodontics and Crown & Bridge' },
  { id: 'cat2', name: 'Conservative Dentistry and Endodontics' },
  { id: 'cat3', name: 'Orthodontics & Dentofacial Orthopedics' },
  { id: 'cat4', name: 'Periodontology and Implantology' },
  { id: 'cat5', name: 'Oral & Maxillofacial Surgery' },
  { id: 'cat6', name: 'Pedodontics and Preventive Dentistry' },
  { id: 'cat7', name: 'Oral Medicine and Radiology' },
  { id: 'cat8', name: 'Public Health Dentistry' },
  { id: 'cat9', name: 'Oral Pathology & Microbiology' },
];

const NON_MEMBER_OPTIONS = [
  { id: 'nm_nidacon_only', label: 'Registration for NIDACON Only', price: 3000, breakdown: '₹3000' },
  { id: 'nm_new_membership', label: 'Registration + New Membership', price: 3750, breakdown: '₹2000 + ₹1750' },
  { id: 'nm_student_membership', label: 'Registration + Student Membership', price: 2350, breakdown: '₹2000 + ₹350', note: '(Valid for UG students only. Not for PG students)' },
];

const MEMBER_OPTIONS = [
  { id: 'm_new_membership', label: 'Registration + New Membership', price: 3750, breakdown: '₹2000 + ₹1750' },
  { id: 'm_renewal', label: 'Registration + Renewal of Membership', price: 3450, breakdown: '₹2000 + ₹1450' },
  { id: 'm_student', label: 'Registration + Student Membership', price: 2350, breakdown: '₹2000 + ₹350', note: '(Valid for UG students only. Not for PG students)' },
  { id: 'm_life', label: 'Registration for Life Member', price: 2000, breakdown: '₹2000' },
  { id: 'm_outside', label: 'Registration for Member Outside Nagpur', price: 2000, breakdown: '₹2000' },
];

const baseMemberFeatures = ["Registration to main event on 10th and 11th", "Registration Kit & Certificate", "Entry to Trade fair", "2 Lunches"];
const baseNonMemberFeatures = ["Registration to main event on 10th and 11th", "Registration Kit & Certificate", "Entry to Trade fair", "2 Lunches"];
const implantFeature = "WITH FREE IMPLANT";
const banquetFeature = "GALA Buffet Dinner";

// --- FileInput Component (Unchanged) ---
function FileInput({ label, file, setFile, id, onFileError, type }) {
  const MAX_FILE_SIZE = 15 * 1024 * 1024;

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      if (onFileError) onFileError(null);
      return;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      if (onFileError) onFileError(`File is too large (Max 10MB).`);
      setFile(null);
      e.target.value = null;
      return;
    }
    if (onFileError) onFileError(null);
    setFile(selectedFile);
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className={`mt-2 flex justify-center rounded-lg border border-dashed ${file ? 'border-purple-400' : 'border-gray-900/25'} px-6 py-4`}>
        <div className="text-center">
          <div className="mt-2 flex text-sm leading-6 text-gray-600">
            <label htmlFor={id} className="relative cursor-pointer rounded-md bg-white font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500">
              {type == 'paper' && <span>Upload abstract:</span>}
              {type == 'poster' && <span>Upload poster:</span>}
              <input id={id} name={id} type="file" className="sr-only" onChange={handleChange} />
              {file ? (
                <p className="text-xs leading-5 text-purple-700 font-medium mt-1">{file.name}</p>
              ) : (
                <>
                  {type == 'paper' && <p className="text-xs leading-5 text-gray-600">PDF, DOCX up to 10MB</p>}
                  {type == 'poster' && <p className="text-xs leading-5 text-gray-600">JPEG up to 10MB</p>}
                </>
              )}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
// --- 1. Paper Poster Form (Updated) ---
function PaperPosterRegistrationForm() {
  const router = useRouter();
  const [registrationId, setRegistrationId] = useState('');

  // New State for Applicant Category
  const [applicantType, setApplicantType] = useState(''); // 'UG', 'PG', 'PP' (Private Practitioner)

  const [selection, setSelection] = useState({ paper: false, poster: false });
  const [userData, setUserData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const [paperCategory, setPaperCategory] = useState('');
  const [abstractFile, setAbstractFile] = useState(null);
  const [paperFile, setPaperFile] = useState(null);
  const [posterCategory, setPosterCategory] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [isPaperPosterOpen, setIsPaperPosterOpen] = useState(false);

  useEffect(() => {
    const openDate = new Date('2025-11-15T00:00:00');
    const currentDate = new Date();
    setIsPaperPosterOpen(currentDate >= openDate);
  }, []);

  const handleFetchDetails = async () => {
    if (!registrationId) {
      setFetchError('Please enter a Registration ID.');
      return;
    }
    setIsFetching(true);
    setFetchError('');
    setUserData(null);
    try {
      const res = await fetch(`/api/members/${registrationId.trim()}`);
      const data = await res.json();

      if (res.ok) {
        setUserData(data);
        setFetchError('');
      } else if (res.status === 404) {
        setFetchError('Registration ID not found.');
      } else {
        setFetchError(data.error || 'Failed to fetch details.');
      }
    } catch (error) {
      setFetchError('Network error occurred.');
    } finally {
      setIsFetching(false);
    }
  };

  const uploadFile = async (file) => {
    if (!file) return null;
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    try {
      const response = await fetch('/api/upload', { method: 'POST', body: uploadFormData });
      const result = await response.json();
      if (response.ok && result.url) return result.url;
      else throw new Error(result.message || 'Upload failed');
    } catch (error) {
      setFetchError(`Error uploading ${file.name}.`);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsFetching(true);
    setFetchError('');

    let abstractUrl = null;
    let paperUrl = null;
    let posterUrl = null;
    let uploadSuccess = true;

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

    setIsFetching(false);

    if (!uploadSuccess) return;

    const queryParams = new URLSearchParams({
      type: 'paper-poster',
      applicantType: applicantType,
      ...(selection.paper && { paperCat: paperCategory }),
      ...(selection.poster && { posterCat: posterCategory }),
      ...(abstractUrl && { abstractUrl: abstractUrl }),
      ...(paperUrl && { paperUrl: paperUrl }),
      ...(posterUrl && { posterUrl: posterUrl }),
    });

    if (userData) {
      queryParams.set('name', userData.name || '');
      queryParams.set('email', userData.email || '');
      queryParams.set('mobile', userData.mobile || '');
      queryParams.set('address', userData.address || '');
    }

    router.push(`/register-now/user-info?${queryParams.toString()}`);
  };

  // Logic: Only PG gets to select categories. Others just upload.
  const isPg = applicantType === 'PG';

  // Validation: 
  // 1. If PG: Need (Category AND File)
  // 2. If UG/PP: Need (File only)
  const isPaperDataComplete = !selection.paper || ((!isPg || paperCategory) && paperFile);
  const isPosterDataComplete = !selection.poster || ((!isPg || posterCategory) && posterFile);
  
  const isSelectionMade = selection.paper || selection.poster;

  const isFormValid = isPaperPosterOpen && applicantType && isSelectionMade && isPaperDataComplete && isPosterDataComplete;

  if (!isPaperPosterOpen) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center"><p>Registration Closed until Nov 15th</p></div>
      </main>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <Image src="/NIDACON/nida_logo.png" alt="NIDACON Logo" width={300} height={300} className="mx-auto mb-6" />
            <p className="text-base font-semibold text-purple-600">Scientific Submission</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">Paper & Poster Presentation</h1>
          </div>

          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-8">
            <div className="flex justify-center -mt-2 mb-6 px-4">
              <MembershipPopup text='To Become an IDA Nagpur Member / Renew Membership' textColor='black' />
            </div>

            {/* Registration ID Input */}
            <div>
              <label htmlFor="registration-id-fetch" className="block text-sm font-medium text-gray-800">
                Enter your NIDACON 2026 Registration ID (Optional)
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="text"
                  id="registration-id-fetch"
                  value={registrationId}
                  onChange={(e) => setRegistrationId(e.target.value.toUpperCase())}
                  placeholder="e.g., NIDA101"
                  className="uppercase block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={handleFetchDetails}
                  disabled={isFetching || !registrationId}
                  className="whitespace-nowrap rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isFetching ? 'Fetching...' : 'Fetch Details'}
                </button>
              </div>
              {fetchError && <p className="mt-2 text-sm text-red-500">{fetchError}</p>}
              {userData && <p className="mt-2 text-sm text-green-700">Details fetched for {userData.name}.</p>}
            </div>

            {/* Applicant Category Selection */}
            <div className="pt-8 border-t border-gray-200">
              <label className="block text-base font-medium text-gray-800 mb-4">Select Applicant Category</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {['Under Graduate (UG)', 'Post Graduate (PG)', 'Private Practitioner'].map((type) => {
                  const val = type.includes('UG') ? 'UG' : type.includes('PG') ? 'PG' : 'PP';
                  return (
                    <div key={val} className="flex items-center">
                      <input
                        id={`app-${val}`}
                        name="applicantType"
                        type="radio"
                        value={val}
                        checked={applicantType === val}
                        onChange={(e) => setApplicantType(e.target.value)}
                        className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      <label htmlFor={`app-${val}`} className="ml-3 block text-sm font-medium leading-6 text-gray-900">
                        {type}
                      </label>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Form Content - Shown for ALL applicant types, but fields vary */}
            {applicantType && (
              <div className="animate-fade-in space-y-8">
                
                {/* Submission Type Selection */}
                <div className="pt-8 border-t border-gray-200">
                  <label className="block text-base font-medium text-gray-800">Select submission type(s)</label>
                  <div className="mt-4 space-y-3">
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input id="paper" type="checkbox" checked={selection.paper} onChange={(e) => setSelection({ ...selection, paper: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                      </div>
                      <div className="ml-3 text-sm leading-6"><label htmlFor="paper" className="font-medium text-gray-900">Paper Submission</label></div>
                    </div>
                    <div className="relative flex items-start">
                      <div className="flex h-6 items-center">
                        <input id="poster" type="checkbox" checked={selection.poster} onChange={(e) => setSelection({ ...selection, poster: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                      </div>
                      <div className="ml-3 text-sm leading-6"><label htmlFor="poster" className="font-medium text-gray-900">Poster Submission</label></div>
                    </div>
                  </div>
                </div>

                {/* Paper Details Section */}
                {selection.paper && (
                  <div className="pt-8 border-t border-gray-200 space-y-6">
                    <h3 className="text-lg font-semibold text-purple-800">Paper Details</h3>
                    
                    {/* Only Show Category Selection if PG */}
                    {isPg && (
                      <fieldset>
                        <legend className="text-sm font-medium text-gray-800 mb-2">Select one category (PG Only)</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                          {presentationCategories.map(cat => (
                            <div key={cat.id} className="flex items-center">
                              <input id={`p-${cat.id}`} name="paper-category" type="radio" value={cat.name} onChange={(e) => setPaperCategory(e.target.value)} className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500" />
                              <label htmlFor={`p-${cat.id}`} className="ml-3 block text-sm font-medium leading-6 text-gray-900">{cat.name}</label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    )}

                    <FileInput label="Upload your full paper" file={paperFile} setFile={setPaperFile} id="paper-file" onFileError={setFetchError} type="paper" />
                  </div>
                )}

                {/* Poster Details Section */}
                {selection.poster && (
                  <div className="pt-8 border-t border-gray-200 space-y-6">
                    <h3 className="text-lg font-semibold text-purple-800">Poster Details</h3>
                    
                    {/* Only Show Category Selection if PG */}
                    {isPg && (
                      <fieldset>
                        <legend className="text-sm font-medium text-gray-800 mb-2">Select one category (PG Only)</legend>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                          {presentationCategories.map(cat => (
                            <div key={cat.id} className="flex items-center">
                              <input id={`ps-${cat.id}`} name="poster-category" type="radio" value={cat.name} onChange={(e) => setPosterCategory(e.target.value)} className="h-4 w-4 border-gray-300 text-purple-600 focus:ring-purple-500" />
                              <label htmlFor={`ps-${cat.id}`} className="ml-3 block text-sm font-medium leading-6 text-gray-900">{cat.name}</label>
                            </div>
                          ))}
                        </div>
                      </fieldset>
                    )}

                    <FileInput label="Upload your poster" file={posterFile} setFile={setPosterFile} id="poster-file" onFileError={setFetchError} type="poster" />
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || isFetching}
                className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isFetching ? 'Processing...' : 'Submit'}
              </button>
              {!isFormValid && (
                <p className="mt-2 text-xs text-center text-gray-500">
                  {!applicantType 
                    ? "Please select an applicant category." 
                    : "Please select a submission type and complete the required uploads."}
                </p>
              )}
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
  const [isWorkshopOpen, setIsWorkshopOpen] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const openDate = new Date('2025-11-15T00:00:00');
    const currentDate = new Date();
    setIsWorkshopOpen(currentDate >= openDate);
  }, []);

  const handleFetchDetails = async () => {
    if (!registrationId) {
      setFetchError('Please enter a Registration ID.');
      return;
    }
    setIsFetching(true);
    setFetchError('');
    setUserData(null);
    try {
      const res = await fetch(`/api/members/${registrationId.trim()}`);
      const data = await res.json();
      if (res.ok) {
        setUserData(data);
        setFetchError('');
      } else if (res.status === 404) {
        setFetchError('Registration ID not found.');
      } else {
        setFetchError(data.error || 'Failed to fetch details.');
      }
    } catch (error) {
      setFetchError('Network error occurred.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleNoRegistration = () => {
    setHasRegistered(false);
    setRedirectMessage('NIDACON registration is compulsory. Please register first.');
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

  const getUserDataParams = () => {
    if (!userData) return '';
    const params = new URLSearchParams();
    if (userData.name) params.set('name', userData.name);
    if (userData.email) params.set('email', userData.email);
    if (userData.mobile) params.set('mobile', userData.mobile);
    if (userData.address) params.set('address', userData.address);
    return params.toString() ? `&${params.toString()}` : '';
  };
  const workshopTypeParam = hasRegistered ? 'workshop-registered' : 'workshop-only';
  const regIdParam = hasRegistered ? `&regId=${registrationId}` : '';
  const selectedWorkshopsParam = Object.keys(selectedWorkshops).filter(k => selectedWorkshops[k]).join(',');

  if (!isWorkshopOpen) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center"><p>Workshops Closed until Nov 15th</p></div>
      </main>
    );
  }

  // Enhanced workshop section renderer
  const renderWorkshopSection = (dateTitle) => {
    const workshopsForDate = workshopOptions.filter(w => w.date === dateTitle);

    if (workshopsForDate.length === 0) return null;

    return (
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-grow"></div>
          <h4 className="text-base font-bold text-purple-700 px-4 py-2 bg-gradient-to-r from-purple-50 to-purple-100 rounded-full shadow-sm">
            {dateTitle}
          </h4>
          <div className="h-px bg-gradient-to-r from-transparent via-purple-300 to-transparent flex-grow"></div>
        </div>
        
        <div className={`grid gap-4 ${isWorkshopSelectionDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
          {workshopsForDate.map((workshop) => {
            const isSelected = !!selectedWorkshops[workshop.id];
            return (
              <div
                key={workshop.id}
                onClick={() => !isWorkshopSelectionDisabled && handleWorkshopChange(workshop)}
                className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 ${
                  isSelected
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-white shadow-lg scale-[1.02]'
                    : 'border-gray-200 bg-white hover:border-purple-300 hover:shadow-md'
                }`}
              >
                {/* Selected indicator badge */}
                {isSelected && (
                  <div className="absolute -top-2 -right-2 bg-purple-600 text-white rounded-full p-1.5 shadow-md z-10">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Custom checkbox */}
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-purple-600 border-purple-600'
                            : 'bg-white border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* Workshop content */}
                    <div className="flex-grow min-w-0">
                      <h5 className={`text-lg font-bold mb-2 transition-colors ${
                        isSelected ? 'text-purple-900' : 'text-gray-900'
                      }`}>
                        {workshop.name}
                      </h5>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="font-medium">{workshop.speaker}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${
                          isSelected 
                            ? 'bg-purple-600 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ₹{workshop.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <div className="w-48 h-48 bg-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <span className="text-4xl font-bold text-purple-600">NIDACON</span>
            </div>
            <p className="text-base font-semibold text-purple-600">Workshop Registration</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">Hands-On Workshops</h1>
          </div>

          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
            <div className="flex justify-center -mt-2 mb-6 px-4">
              <MembershipPopup text='To Become an IDA Nagpur Member / Renew Membership' textColor='black' />
            </div>

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
                <Link href="/register-now" className="mt-4 inline-block px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg">Register Now</Link>
              </div>
            )}

            {hasRegistered === true && !redirectMessage && (
              <div className="mt-8 pt-6 border-t border-gray-200 space-y-6">
                <div>
                  <label htmlFor="registration-id-fetch" className="block text-sm font-medium text-gray-800">
                    Enter your NIDACON 2026 Registration ID (Optional)
                  </label>
                  <div className="mt-2 flex items-center gap-2">
                    <input
                      type="text"
                      id="registration-id-fetch"
                      value={registrationId}
                      onChange={(e) => setRegistrationId(e.target.value.toUpperCase())}
                      placeholder="e.g., NIDA101"
                      className="uppercase block w-full rounded-md border-gray-300 py-3 px-4 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                    />
                    <button
                      type="button"
                      onClick={handleFetchDetails}
                      disabled={isFetching || !registrationId}
                      className="whitespace-nowrap rounded-md bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                    >
                      {isFetching ? 'Fetching...' : 'Fetch Details'}
                    </button>
                  </div>
                  {fetchError && <p className="mt-2 text-sm text-red-500">{fetchError}</p>}
                  {userData && <div className="mt-4 text-sm text-green-700">Details for {userData.name} fetched.</div>}
                </div>

                <fieldset className={'mt-8'} disabled={isWorkshopSelectionDisabled}>
                  <legend className={`text-sm font-medium mb-6 ${isWorkshopSelectionDisabled ? 'text-gray-400' : 'text-gray-800'}`}>
                    2. Select your desired workshop {isWorkshopSelectionDisabled ? '(Enter Registration ID first)' : ''}
                  </legend>

                  <div className="mt-4">
                    {renderWorkshopSection('9th January')}
                    {renderWorkshopSection('10th January')}
                    {renderWorkshopSection('11th January')}
                  </div>
                </fieldset>

                {selectedCount > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    {selectedCount > 1 && (<p className="text-xs text-red-600 font-bold mb-4">* You have selected multiple workshops. Please ensure their timings do not clash.</p>)}
                    <div className="flex justify-between items-center"><span className="text-lg font-medium text-gray-900">Total:</span><span className="text-2xl font-bold text-purple-700">₹{totalAmount.toLocaleString('en-IN')}</span></div>
                  </div>
                )}

                <div className="mt-10">
                  <Link href={`/register-now/user-info?type=${workshopTypeParam}${regIdParam}&workshops=${selectedWorkshopsParam}&price=${totalAmount}${getUserDataParams()}`} passHref>
                    <button type="button" disabled={isProceedButtonDisabled} className="w-full py-4 px-6 text-lg font-semibold text-white bg-purple-600 rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed">
                      Proceed to User Info
                    </button>
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

function DelegateRegistrationForm({ registrationType }) {
  const router = useRouter();
  const [isMember, setIsMember] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null); // New state for specific option
  const [addOns, setAddOns] = useState({
    implant: false,
    banquet: false,
  });

  // Reset specific selection if user switches between Member/Non-Member tabs
  useEffect(() => {
    setSelectedOptionId(null);
  }, [isMember]);

  // Helper to get the full object of the currently selected option
  const getSelectedOption = () => {
    if (isMember === null || !selectedOptionId) return null;
    const options = isMember ? MEMBER_OPTIONS : NON_MEMBER_OPTIONS;
    return options.find(opt => opt.id === selectedOptionId);
  };

  const calculateTotal = () => {
    const option = getSelectedOption();
    if (!option) return 0;

    let total = option.price;
    if (addOns.implant) total += 2200;
    if (addOns.banquet) total += 2000;
    return total;
  };

  const totalAmount = calculateTotal();

  const handleAddOnChange = (e) => {
    const { name, checked } = e.target;
    setAddOns(prev => ({ ...prev, [name]: checked }));
  };

  const handleProceed = () => {
    const option = getSelectedOption();
    if (!option) return;

    // We pass the specific label as 'subCategory' so you know exactly what they bought
    const queryParams = new URLSearchParams({
      type: registrationType,
      memberType: isMember ? 'member' : 'non-member',
      subCategory: option.label,
      price: totalAmount.toString(),
    });

    if (addOns.implant) queryParams.set('implant', 'true');
    if (addOns.banquet) queryParams.set('banquet', 'true');

    router.push(`/register-now/user-info?${queryParams.toString()}`);
  }

  const displayType = registrationType.charAt(0).toUpperCase() + registrationType.slice(1);
  const isProceedDisabled = !selectedOptionId;

  // Get current options list based on tab
  const currentOptions = isMember === null ? [] : (isMember ? MEMBER_OPTIONS : NON_MEMBER_OPTIONS);

  // Determine features list for display
  let currentFeatures = isMember ? [...baseMemberFeatures] : [...baseNonMemberFeatures];
  if (addOns.implant) currentFeatures.unshift(implantFeature);
  if (addOns.banquet) currentFeatures.unshift(banquetFeature);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <Image
              src="/NIDACON/nida_logo.png"
              alt="NIDACON Logo"
              width={300}
              height={300}
              className="mx-auto mb-6"
            />
            <p className="text-base font-semibold text-purple-600">Step 2 of 3</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">Delegate Registration</h1>
            <p className="mt-6 text-lg text-gray-600">
              Choose your category and optional add-ons below.
            </p>
            <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded-lg inline-flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-semibold">Early Bird Registration ends 25th November!</span>
            </div>
          </div>

          <div className="mt-12">
            <div className="flex justify-center mb-8 px-4">
              <MembershipPopup text='To Become an IDA Nagpur Member / Renew Membership' textColor='black' />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-8 h-full flex flex-col">

                {/* 1. Member / Non-Member Toggle */}
                <div>
                  <label className="block text-base font-medium text-gray-800 mb-4 text-center">1. Select Your Status</label>
                  <div className="relative flex w-full max-w-sm mx-auto p-1 bg-gray-200 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setIsMember(false)}
                      className={`relative w-1/2 rounded-md py-3 text-sm font-semibold transition-colors duration-300 ${isMember === false ? 'bg-white text-purple-700 shadow-md' : 'bg-transparent text-gray-700 hover:text-gray-900'}`}
                    >
                      Non-Member
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsMember(true)}
                      className={`relative w-1/2 rounded-md py-3 text-sm font-semibold transition-colors duration-300 ${isMember === true ? 'bg-white text-purple-700 shadow-md' : 'bg-transparent text-gray-700 hover:text-gray-900'}`}
                    >
                      IDA Member
                    </button>
                  </div>
                </div>

                {/* 2. Specific Registration Options */}
                {isMember !== null && (
                  <div className="animate-fade-in">
                    <label className="block text-base font-medium text-gray-800 mb-4">2. Select Category</label>
                    <div className="space-y-3">
                      {currentOptions.map((option) => (
                        <div
                          key={option.id}
                          onClick={() => setSelectedOptionId(option.id)}
                          className={`relative flex flex-col p-4 border rounded-xl cursor-pointer transition-all duration-200 ${selectedOptionId === option.id
                              ? 'border-purple-600 bg-purple-50 ring-1 ring-purple-600'
                              : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
                            }`}
                        >
                          <div className="flex justify-between items-start w-full">
                            <div className="flex items-center">
                              <div className={`flex items-center justify-center w-5 h-5 rounded-full border ${selectedOptionId === option.id ? 'border-purple-600 bg-purple-600' : 'border-gray-400'}`}>
                                {selectedOptionId === option.id && <div className="w-2 h-2 bg-white rounded-full" />}
                              </div>
                              <span className={`ml-3 font-medium ${selectedOptionId === option.id ? 'text-purple-900' : 'text-gray-900'}`}>
                                {option.label}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="block font-bold text-gray-900">₹{option.price}</span>
                              <span className="block text-xs text-gray-500">({option.breakdown})</span>
                            </div>
                          </div>
                          {option.note && (
                            <p className="mt-1 ml-8 text-xs text-red-500 font-medium">{option.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Add-ons Section */}
                {/* <div className={`pt-6 border-t border-gray-200 ${!selectedOptionId ? 'opacity-50 pointer-events-none' : ''}`}>
                  <fieldset>
                    <legend className="text-base font-medium text-gray-800">3. Optional Add-ons</legend>
                    <div className="mt-4 space-y-4">
                      <div className={`relative flex items-start p-4 border rounded-lg transition-colors ${addOns.implant ? 'bg-green-50 border-green-500' : 'hover:bg-gray-50'}`}>
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

                      <div className={`relative flex items-start p-4 border rounded-lg transition-colors ${addOns.banquet ? 'bg-green-50 border-green-500' : 'hover:bg-gray-50'}`}>
                        <div className="flex h-6 items-center">
                          <input
                            id="banquet"
                            name="banquet"
                            type="checkbox"
                            checked={addOns.banquet}
                            onChange={handleAddOnChange}
                            className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
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
                <div className="mt-auto pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                    <span className="text-3xl font-bold text-purple-700">₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: What's Included */}
              <div className="bg-purple-50 p-8 rounded-2xl border border-purple-200 h-full sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900">What&apos;s Included</h3>
                {isMember === null ? (
                  <p className="mt-4 text-gray-500">Select Member or Non-Member status to see included features.</p>
                ) : (
                  <ul className="mt-5 space-y-3 text-gray-700">
                    {currentFeatures.map((feature, index) => {
                      let textColorClass = "text-gray-700";
                      if (feature === implantFeature && addOns.implant) textColorClass = "text-green-700 font-semibold";
                      else if (feature === banquetFeature && addOns.banquet) textColorClass = "text-green-700 font-semibold";

                      return (
                        <li key={index} className="flex items-start">
                          <svg className={`flex-shrink-0 w-5 h-5 ${textColorClass === 'text-gray-700' ? 'text-purple-500' : 'text-green-500'} mr-2 mt-0.5`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className={textColorClass}>{feature}</span>
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
                  Please select a status and a category to proceed.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function RegistrationDetails() {
  const searchParams = useSearchParams();
  const registrationType = searchParams.get('type');
  switch (registrationType) {
    case 'workshop': return <WorkshopRegistrationForm />;
    case 'paper-poster': return <PaperPosterRegistrationForm />;
    case 'delegate': default: return <DelegateRegistrationForm registrationType={'delegate'} />;
  }
}

export default function RegistrationDetailsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen">Loading...</div>}>
      <RegistrationDetails />
    </Suspense>
  );
}