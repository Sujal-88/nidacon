"use client"

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AlertTriangle, Lock, X, BadgeInfo, Trash2, ArrowLeft, HelpCircle, ChevronDown, ChevronUp, MapPin, PaperclipIcon, Clock } from 'lucide-react';
import MembershipPopup from '@/components/MembershipPopup';
import DownloadGuidelines from '@/components/DownloadGuidelines';

// --- Data Updated with Dates for Workshops ---
const workshopOptions = [
  // 9th January Workshops
  {
    id: 'ws1',
    name: `Implants Made Easy: A GP's Guide from Placement to Impression`,
    price: 2700,
    date: '9th January',
    speaker: 'Dr. Dhawal Pandya',
    image: '/workshops/P2.jpeg',
    description: "This comprehensive workshop is designed for General Practitioners to master implant dentistry. It covers the entire workflow from surgical placement to final impression, ensuring predictable and successful outcomes.",
    coordinators: "Dr. Anuj Jain: 8055251111, Dr. Geetika Soni: 9822977950"
  },
  {
    id: 'ws2',
    name: 'Back to Basics: Core Endodontic Skills Every Clinician Must Master',
    price: 2800,
    date: '9th January',
    speaker: 'Dr. Rohit Khatavkar',
    image: '/workshops/P1.jpeg',
    description: "Refine your endodontic techniques with a focus on core skills. This session covers access opening, canal location, biomechanical preparation, and obturation to help you handle complex cases with confidence.",
    coordinators: "Dr. Snehal Sonarkar: 9967111642, Dr. Himani Kakade: 9511752780"
  },

  // 10th January Workshops
  {
    id: 'ws3',
    name: 'Hands-on: Smile Sculpting: The Art of Anterior Composites',
    price: 3100,
    date: '10th January',
    speaker: 'Dr. Niranjan Vatkar',
    image: '/workshops/H1.jpeg',
    description: "Master the art of smile design using direct anterior composites. Learn layering protocols, shade selection, finishing, and polishing to create lifelike restorations.",
    coordinators: "Dr. Snehal Sonarkar: 9967111642, Dr. Himani Kakade: 9511752780"
  },
  {
    id: 'ws4',
    name: 'Hands-on: Instant Space Maintainers in Pediatric Dentistry',
    price: 900,
    date: '10th January',
    speaker: 'Dr. Yusuf Chunawala',
    image: '/workshops/H2.jpeg',
    description: "A practical guide to space management in pediatric dentistry. Learn quick and effective techniques for fabricating and placing space maintainers chairside.",
    coordinators: "Dr. Bhavik Jain: 8806611009"
  },
  {
    id: 'ws5',
    name: 'Hands-on: Rebuilding Strength: Post & Core Simplified',
    price: 1900,
    date: '10th January',
    speaker: 'Dr. Uma Mahajan',
    image: '/workshops/H3.jpeg',
    description: "Demystifying the post and core procedure. This workshop focuses on the selection of posts, bonding protocols, and core build-up techniques to salvage badly broken-down teeth.",
    coordinators: "Dr. Rashmi Tonage: 9960134606"
  },

  // 11th January Workshops
  {
    id: 'ws6',
    name: 'Hands-on: Gateway to Instagram: Unveiling the Secrets of the Instagram Algorithm',
    price: 600,
    date: '11th January',
    speaker: 'Dr. Prathmesh Kshatriya',
    image: '/workshops/H4.jpeg',
    description: "Unlock the power of social media for your dental practice. Understand the Instagram algorithm, content creation strategies, and how to build a personal brand to attract patients.",
    coordinators: "Dr. Geetika Soni: 9822977950"
  },
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
  { id: 'nm_nidacon_only', label: 'Registration for NIDACON Only', price: 3500, breakdown: '₹3500' },
  { id: 'nm_new_membership', label: 'Registration + New Membership', price: 4250, breakdown: '₹2500 + ₹1750' },
  { id: 'nm_student_membership', label: 'Registration + Student Membership', price: 2500, breakdown: '₹2500', note: '(Valid for UG students only. Not for PG students)' },
];

const MEMBER_OPTIONS = [
  { id: 'm_new_membership', label: 'Registration + New Membership', price: 4250, breakdown: '₹2500 + ₹1750' },
  { id: 'm_renewal', label: 'Registration + Renewal of Membership', price: 3950, breakdown: '₹2500 + ₹1450' },
  { id: 'm_student', label: 'Registration + Student Membership', price: 2850, breakdown: '₹2500 + ₹350', note: '(Valid for UG students only. Not for PG students)' },
  { id: 'm_life', label: 'Registration for Life Member', price: 2500, breakdown: '₹2500' },
  { id: 'm_outside', label: 'Registration for Member Outside Nagpur', price: 2500, breakdown: '₹2500' },
];

const SPECIAL_QR_OPTION = { 
  id: 'm_special_qr', 
  label: 'NIDACON Delegate', 
  price: 2000, 
  breakdown: '₹2000', 
  note: '✨ Special QR Code Offer' 
};

const baseMemberFeatures = ["Registration to main event on 10th and 11th", "Registration Kit & Certificate", "Entry to Trade fair", "2 Lunches"];
const baseNonMemberFeatures = ["Registration to main event on 10th and 11th", "Registration Kit & Certificate", "Entry to Trade fair", "2 Lunches"];
const implantFeature = "WITH FREE IMPLANT";
const banquetFeature = "GALA Buffet Dinner";

// --- FileInput Component (Unchanged) ---
function FileInput({ label, file, setFile, id, onFileError, type }) {
  const MAX_FILE_SIZE = 2 * 1024 * 1024; // 10MB

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    // 1. Size Validation
    if (selectedFile.size > MAX_FILE_SIZE) {
      if (onFileError) onFileError(`File is too large (Max 2MB).`);
      setFile(null);
      e.target.value = null;
      return;
    }

    // 2. Type Validation
    let isValidType = true;
    let errorMessage = '';

    if (type === 'paper') {
      // Allow only PDF
      if (selectedFile.type !== 'application/pdf') {
        isValidType = false;
        errorMessage = 'Only PDF files are allowed for papers.';
      }
    } else if (type === 'poster') {
      // Allow only JPEG/JPG
      if (selectedFile.type !== 'image/jpeg' && selectedFile.type !== 'image/jpg') {
        isValidType = false;
        errorMessage = 'Only JPEG images are allowed for posters.';
      }
    }

    if (!isValidType) {
      if (onFileError) onFileError(errorMessage);
      setFile(null);
      e.target.value = null; // Reset input
      return;
    }

    // Success
    if (onFileError) onFileError(null);
    setFile(selectedFile);
  };

  function TimeBadge({ time }) {
    return (
      <div className="flex justify-center -mt-2 mb-5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-100 rounded-md text-xs font-medium text-purple-800">
          <Clock className="w-3 h-3" />
          <span>{time}</span>
        </div>
      </div>
    );
  }

  function VenueBadge() {
    return (
      <div className="flex items-center justify-center mt-4 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-sm text-gray-700">
          <MapPin className="w-4 h-4 text-purple-600" />
          <span className="font-semibold">Venue:</span>
          <span>Naivedyam North Star, Koradi, Nagpur</span>
        </div>
      </div>
    );
  }

  const handleRemove = (e) => {
    e.preventDefault(); // Prevent triggering the file input again
    setFile(null);
    if (onFileError) onFileError(null);
    // Reset the input value so the same file can be selected again if needed
    const input = document.getElementById(id);
    if (input) input.value = '';
  };

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>
      <div className={`mt-2 flex justify-center rounded-lg border border-dashed ${file ? 'border-purple-400 bg-purple-50' : 'border-gray-900/25'} px-6 py-4 transition-colors`}>
        <div className="text-center w-full">
          {file ? (
            // 3. File Selected View with Remove Option
            <div className="flex items-center justify-between bg-white p-3 rounded-md border border-purple-200 shadow-sm">
              <div className="flex items-center overflow-hidden">
                <span className="text-sm font-medium text-purple-700 truncate max-w-[200px]">{file.name}</span>
                <span className="ml-2 text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <button
                onClick={handleRemove}
                className="ml-4 p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Remove file"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ) : (
            // Default Upload View
            <div className="mt-2 flex text-sm leading-6 text-gray-600 justify-center">
              <label htmlFor={id} className="relative cursor-pointer rounded-md font-semibold text-purple-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-purple-600 focus-within:ring-offset-2 hover:text-purple-500">
                <span>{type === 'paper' ? 'Upload Abstract (PDF)' : 'Upload Poster (JPEG)'}</span>
                <input id={id} name={id} type="file" className="sr-only" onChange={handleChange} accept={type === 'paper' ? '.pdf' : '.jpeg,.jpg'} />
              </label>
            </div>
          )}

          {!file && (
            <p className="text-xs leading-5 text-gray-600 mt-1">
              {type === 'paper' ? 'PDF only, up to 2MB' : 'JPEG/JPG only, up to 2MB'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function PaperPosterRegistrationForm() {
  const router = useRouter();
  const [registrationId, setRegistrationId] = useState('');

  // New State for Applicant Category
  const [applicantType, setApplicantType] = useState(''); // 'UG', 'PG', 'PP' (Private Practitioner)

  // CHANGED: Use a string for single selection instead of object
  const [submissionType, setSubmissionType] = useState(''); // 'paper' or 'poster'
  
  // CHANGED: New state to track if user already submitted
  const [isAlreadySubmitted, setIsAlreadySubmitted] = useState(false);

  const [userData, setUserData] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const [paperCategory, setPaperCategory] = useState('');
  const [abstractFile, setAbstractFile] = useState(null);
  const [paperFile, setPaperFile] = useState(null);
  const [posterCategory, setPosterCategory] = useState('');
  const [posterFile, setPosterFile] = useState(null);
  const [isPaperPosterOpen, setIsPaperPosterOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

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
    setIsAlreadySubmitted(false); // Reset status initially

    try {
      const res = await fetch(`/api/members/${registrationId.trim()}`);
      const data = await res.json();

      if (res.ok) {
        setUserData(data);
        setFetchError('');

        // --- FIX STARTS HERE ---
        // Use the strict flag from the backend
        if (data.hasSubmitted) {
          setIsAlreadySubmitted(true);
        }
        // --- FIX ENDS HERE ---

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

    // CHANGED: Check submissionType state instead of selection object
    if (submissionType === 'paper' && abstractFile) {
      abstractUrl = await uploadFile(abstractFile);
      if (!abstractUrl) uploadSuccess = false;
    }
    if (submissionType === 'paper' && paperFile && uploadSuccess) {
      paperUrl = await uploadFile(paperFile);
      if (!paperUrl) uploadSuccess = false;
    }
    if (submissionType === 'poster' && posterFile && uploadSuccess) {
      posterUrl = await uploadFile(posterFile);
      if (!posterUrl) uploadSuccess = false;
    }

    setIsFetching(false);

    if (!uploadSuccess) return;

    const queryParams = new URLSearchParams({
      type: submissionType,
      applicantType: applicantType,
      // CHANGED: Conditional params based on submissionType
      ...(submissionType === 'paper' && { paperCat: paperCategory }),
      ...(submissionType === 'poster' && { posterCat: posterCategory }),
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
  // CHANGED: Updated validation logic for radio button state
  const isPaperDataComplete = submissionType !== 'paper' || ((!isPg || paperCategory) && paperFile);
  const isPosterDataComplete = submissionType !== 'poster' || ((!isPg || posterCategory) && posterFile);

  const isSelectionMade = submissionType !== '';

  const isFormValid = isPaperPosterOpen && applicantType && isSelectionMade && isPaperDataComplete && isPosterDataComplete;

  if (!isPaperPosterOpen) {
    return (
      <main className="bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="text-center"><p>Registration Closed until Nov 15th</p></div>
      </main>
    );
  }

  // ... (Keep your HelpPopup component code here) ...
  function HelpPopup({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 mb-4">
            <HelpCircle className="h-6 w-6 text-purple-600" />
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please check confirmation email for your Registration ID.
          </p>
          <p className="text-sm text-gray-600 mb-4">
            For any queries regarding registration or submission, please contact:
          </p>

          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <p className="font-bold text-purple-800">Dr. Mitul Mishra</p>
            <a href="tel:+918087074183" className="text-purple-600 font-semibold hover:underline block mt-1">
              +91 8087074183
            </a>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <HelpPopup isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <button
          onClick={() => router.back()}
          className="absolute flex items-center top-20 text-gray-600 hover:text-purple-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <Image src="/NIDACON/nida_logo.png" alt="NIDACON Logo" width={300} height={300} className="mx-auto mb-6" />
            <p className="text-base font-semibold text-purple-600">Scientific Submission</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">Paper & Poster Presentation</h1>
          </div>

          <div>
            <DownloadGuidelines />
          </div>

          <div className="mt-12 bg-white p-8 rounded-2xl shadow-lg border border-gray-200 space-y-8">

            <div className="flex justify-center -mt-2 mb-6 px-4">
              <MembershipPopup text='To Become an IDA Nagpur Member / Renew Membership' textColor='black' />
            </div>

            {/* Registration ID Input */}
            <div>
              <label htmlFor="registration-id-fetch" className="block text-sm font-medium text-gray-800">
                Enter your NIDACON 2026 Registration ID
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
                  className="whitespace-nowrap rounded-md bg-indigo-600 px-4 py-3 text-md font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                >
                  {isFetching ? 'Fetching...' : 'Fetch Details'}
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShowHelp(true)}
                className="flex items-center justify-center mt-3 text-xs font-bold text-purple-600 hover:text-purple-800 underline"
              >
                <HelpCircle className="w-6 h-6 mr-1" />
                Need Help?
              </button>
              {fetchError && <p className="mt-2 text-sm text-red-500">{fetchError}</p>}
              {userData && !isAlreadySubmitted && (
                <span className="mt-2 font-bold text-md text-green-700">Details fetched for {userData.name}. <p className='text-red-500'>please confirm before proceeding</p></span>
              )}
            </div>

            {/* CHANGED: Show Success Message if Already Submitted */}
            {isAlreadySubmitted ? (
               <div className="animate-fade-in p-6 bg-green-50 border border-green-200 rounded-lg text-center">
                 <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 mb-3">
                   <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                   </svg>
                 </div>
                 <h3 className="text-lg font-medium text-green-900">Submitted Successfully</h3>
                 <p className="mt-2 text-sm text-green-700">
                   You have already submitted a paper/poster presentation.
                 </p>
               </div>
            ) : (
              /* Show Form if NOT submitted */
              <>
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

                {/* Form Content */}
                {applicantType && (
                  <div className="animate-fade-in space-y-8">

                    {/* Submission Type Selection (CHANGED TO RADIO) */}
                    <div className="pt-8 border-t border-gray-200">
                      <label className="block text-base font-medium text-gray-800">Select submission type</label>
                      <div className="mt-4 space-y-3">
                        <div className="relative flex items-start">
                          <div className="flex h-6 items-center">
                            <input
                              id="paper"
                              name="submissionType"
                              type="radio"
                              checked={submissionType === 'paper'}
                              onChange={() => setSubmissionType('paper')}
                              className="h-4 w-4 rounded-full border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                          </div>
                          <div className="ml-3 text-sm leading-6"><label htmlFor="paper" className="font-medium text-gray-900">Paper Submission</label></div>
                        </div>
                        <div className="relative flex items-start">
                          <div className="flex h-6 items-center">
                            <input
                              id="poster"
                              name="submissionType"
                              type="radio"
                              checked={submissionType === 'poster'}
                              onChange={() => setSubmissionType('poster')}
                              className="h-4 w-4 rounded-full border-gray-300 text-purple-600 focus:ring-purple-500"
                            />
                          </div>
                          <div className="ml-3 text-sm leading-6"><label htmlFor="poster" className="font-medium text-gray-900">Poster Submission</label></div>
                        </div>
                      </div>
                    </div>

                    {/* Paper Details Section */}
                    {submissionType === 'paper' && (
                      <div className="pt-8 border-t border-gray-200 space-y-6 animate-fade-in">
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
                    {submissionType === 'poster' && (
                      <div className="pt-8 border-t border-gray-200 space-y-6 animate-fade-in">
                        <h3 className="text-lg font-semibold text-purple-800">Poster Details (In aspect ratio 16:9)</h3>

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
              </>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

function WorkshopImagePopup({ isOpen, onClose, imageSrc, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onClose}>
      <div
        className="relative bg-white rounded-xl overflow-hidden shadow-2xl max-w-lg w-full animate-fade-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-sm font-bold text-gray-800 line-clamp-1 pr-4">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative w-full h-[65vh] sm:h-[500px] bg-gray-100 flex items-center justify-center">
          {/* Fallback if no image is provided */}
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={title}
              fill
              className="object-contain" // Keeps aspect ratio
            />
          ) : (
            <p className="text-gray-500">No details available</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TimeBadge({ time }) {
  return (
    <div className="flex justify-center -mt-2 mb-5">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-100 rounded-md text-xs font-medium text-purple-800">
        <Clock className="w-3 h-3" />
        <span>{time}</span>
      </div>
    </div>
  );
}

function Highlight({ text }) {
  return (
    <div className="flex justify-center -mt-2 mb-5">
      <div className="inline-flex flex-col items-center gap-1.5 px-3 py-1 bg-purple-50 border border-purple-100 rounded-md text-xs font-medium text-purple-800">
        <div className='flex justify-around gap-1 items-center'>

        <PaperclipIcon className="w-3 h-3" />
        <span className="font-bold">Inclusions:</span>
        </div>
        <span>{text}</span>
      </div>
    </div>
  );
}

function VenueBadge() {
  return (
    <div className="flex items-center justify-center mt-4 animate-fade-in">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full shadow-sm text-sm text-gray-700">
        <MapPin className="w-4 h-4 text-purple-600" />
        <span className="font-semibold">Venue: </span>
        <span>Naivedyam North Star, Koradi, Nagpur</span>
      </div>
    </div>
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
  const [popupData, setPopupData] = useState({ isOpen: false, img: '', title: '' });
  const [showHelp, setShowHelp] = useState(false);
  const [expandedWorkshop, setExpandedWorkshop] = useState(null);

  useEffect(() => {
    const openDate = new Date('2025-11-15T00:00:00');
    const currentDate = new Date();
    setIsWorkshopOpen(currentDate >= openDate);
  }, []);

  const handleKnowMore = (e, workshop) => {
    e.stopPropagation(); // CRITICAL: This prevents the row from being selected/deselected when clicking 'Know More'
    setPopupData({
      isOpen: true,
      img: workshop.image, // Ensure this exists in your data
      title: workshop.name
    });
  };

  const toggleDetails = (e, workshopId) => {
    e.stopPropagation(); // Stop click from triggering the "Select Workshop" checkbox
    if (expandedWorkshop === workshopId) {
      setExpandedWorkshop(null); // Close if already open
    } else {
      setExpandedWorkshop(workshopId); // Open the clicked one
    }
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
        <div>
          <TimeBadge time={dateTitle.includes("9th") ? "10:30 AM to 4 PM" : "4 PM to 7 PM"} />
        </div>
        <div>
          {dateTitle.includes("9th") && <Highlight text="General Material required for a hands on, lunch, tea, certificate" />}
        </div>

        <div className={`grid gap-4 ${isWorkshopSelectionDisabled ? 'opacity-50 pointer-events-none' : ''}`}>
          {workshopsForDate.map((workshop) => {
            const isSelected = !!selectedWorkshops[workshop.id];
            const isExpanded = expandedWorkshop === workshop.id;
            return (
              <div
                key={workshop.id}
                onClick={() => !isWorkshopSelectionDisabled && handleWorkshopChange(workshop)}
                className={`relative cursor-pointer rounded-xl border-2 transition-all duration-300 ${isSelected
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

                <div className="p-5 left-0">
                  <div className="flex items-start gap-4 ">
                    {/* Custom checkbox */}
                    <div className="flex-shrink-0 mt-1">
                      <div
                        className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isSelected
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
                      <h5 className={`text-md font-bold mb-2 transition-colors flex items-center justify-center gap-3 ${isSelected ? 'text-purple-900' : 'text-gray-900'
                        }`}>
                        <svg className="w-4 h-4 text-purple-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className='w-full'>
                          {workshop.speaker}
                        </span>
                      </h5>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <span className="font-medium">{workshop.name}</span>
                      </div>

                      <div className="flex items-center justify-between gap-1.5">
                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${isSelected
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                          }`}>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          ₹{workshop.price.toLocaleString('en-IN')}
                        </div>
                        <button
                          type="button"
                          onClick={(e) => toggleDetails(e, workshop.id)}
                          className={`z-20 flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${isExpanded
                            ? 'bg-purple-100 text-purple-700 border-purple-300'
                            : 'bg-white text-gray-500 border-gray-200 hover:border-purple-300 hover:text-purple-600'
                            }`}
                        >
                          <BadgeInfo size={14} />
                          {isExpanded ? 'Hide Info' : 'Know More'}
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* 4. EXPANDABLE TEXT SECTION */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0'
                      }`}
                    onClick={(e) => e.stopPropagation()} // Allows text selection without toggling the card
                  >
                    <div className="overflow-hidden">
                      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600 leading-relaxed border border-gray-100">
                        <p className="font-semibold text-gray-900 mb-1">About this workshop:</p>
                        <p>{workshop.description}</p>
                        <p className='font-bold text-gray-600' >Course Coordinators: <br /> </p>
                        <p className='font-bold text-black text-xs'>{workshop.coordinators}</p>
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

  function HelpPopup({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
        <div className="bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full text-center relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 mb-4">
            <HelpCircle className="h-6 w-6 text-purple-600" />
          </div>

          <h3 className="text-lg font-bold text-gray-900 mb-2">Need Help?</h3>
          <p className="text-sm text-gray-600 mb-4">
            Please check confirmation email for your Registration ID.
          </p>
          <p className="text-sm text-gray-600 mb-4">
            For any queries regarding registration or submission, please contact:
          </p>

          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
            <p className="font-bold text-purple-800">Dr. Mitul Mishra</p>
            <a href="tel:+918087074183" className="text-purple-600 font-semibold hover:underline block mt-1">
              +91 8087074183
            </a>
          </div>

          <button
            onClick={onClose}
            className="mt-6 w-full bg-gray-900 text-white py-2 rounded-lg text-sm font-semibold hover:bg-gray-800"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-gray-50 min-h-screen">
      <HelpPopup isOpen={showHelp} onClose={() => setShowHelp(false)} />
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <button
          onClick={() => router.back()}
          className="absolute flex items-center top-20 text-gray-600 hover:text-purple-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
        <div className="max-w-2xl mx-auto">
          <div className="text-center">
            <Image src="/NIDACON/nida_logo.png" alt="NIDACON Logo" width={300} height={300} className="mx-auto mb-6" />
            <p className="text-base font-semibold text-purple-600">Workshop Registration</p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">Pre Conference & Hands On</h1>
            <VenueBadge />
          </div>

          <div className="mt-12 bg-white p-4 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
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
                  <button
                    type="button"
                    onClick={() => setShowHelp(true)}
                    className="flex items-center justify-center mt-3 text-xs font-bold text-purple-600 hover:text-purple-800 underline"
                  >
                    <HelpCircle className="w-6 h-6 mr-1" />
                    Need Help?
                  </button>
                  {fetchError && <p className="mt-2 text-sm text-red-500">{fetchError}</p>}
                  {userData && <span className="mt-2 font-bold text-md text-green-700">Details fetched for {userData.name}. <p className='text-red-500'>please confirm before proceeding</p></span>}
                </div>

                <fieldset className={'mt-8'} disabled={isWorkshopSelectionDisabled}>
                  <legend className={`text-sm font-medium mb-6 ${isWorkshopSelectionDisabled ? 'text-gray-400' : 'text-gray-800'}`}>
                    2. Select your desired workshop {isWorkshopSelectionDisabled ? '(Enter Registration ID first)' : ''}
                  </legend>

                  <div className="mt-4 left-0">
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

      {/* Pop Up */}
      <WorkshopImagePopup
        isOpen={popupData.isOpen}
        onClose={() => setPopupData({ ...popupData, isOpen: false })}
        imageSrc={popupData.img}
        title={popupData.title}
      />

    </main>
  );
}

function DelegateRegistrationForm({ registrationType }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasQrAccess = searchParams.get('access') === 'qr';
  
  const [isMember, setIsMember] = useState(null);
  const [selectedOptionId, setSelectedOptionId] = useState(null); // New state for specific option
  const [addOns, setAddOns] = useState({
    implant: false,
    banquet: false,
  });

  useEffect(() => {
    if (hasQrAccess && isMember === null) {
      setIsMember(true);
    }
  }, [hasQrAccess, isMember]);

  useEffect(() => {
    setSelectedOptionId(null);
  }, [isMember]);

  // 4. Dynamic Options Logic
  const getDisplayOptions = () => {
    if (isMember === null) return [];
    
    if (isMember) {
      // If QR access is true, prepend the special option
      return hasQrAccess ? [SPECIAL_QR_OPTION, ...MEMBER_OPTIONS] : MEMBER_OPTIONS;
    }
    
    return NON_MEMBER_OPTIONS;
  };
  const currentOptions = getDisplayOptions();
  
  const getSelectedOption = () => {
    if (isMember === null || !selectedOptionId) return null;
    return currentOptions.find(opt => opt.id === selectedOptionId);
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

    if (hasQrAccess) queryParams.set('access', 'qr');
    if (addOns.implant) queryParams.set('implant', 'true');
    if (addOns.banquet) queryParams.set('banquet', 'true');

    router.push(`/register-now/user-info?${queryParams.toString()}`);
  }

  const displayType = registrationType.charAt(0).toUpperCase() + registrationType.slice(1);
  const isProceedDisabled = !selectedOptionId;


  // Determine features list for display
  let currentFeatures = isMember ? [...baseMemberFeatures] : [...baseNonMemberFeatures];
  
  if (addOns.implant) currentFeatures.unshift(implantFeature);
  if (addOns.banquet) currentFeatures.unshift(banquetFeature);

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-24 sm:py-32">
        <button
          onClick={() => router.back()}
          className="absolute flex items-center top-20 text-gray-600 hover:text-purple-600 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </button>
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
                        <p className={`mt-1 ml-8 text-xs font-medium ${option.id === 'm_special_qr' ? 'text-purple-600 font-bold' : 'text-red-500'}`}>
                          {option.note}
                        </p>
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
