// app/profile/page.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { 
    User, Mail, Phone, Home, Ticket, BadgeCheck, FileText, 
    Hash, Award, ShieldCheck, ClipboardList, Briefcase, Download, Utensils, GraduationCap
} from 'lucide-react';
import React from 'react';
import Link from 'next/link';

async function getUser() {
    const sessionId = cookies().get('session')?.value;
    if (!sessionId) {
        return null;
    }
    // UPDATE: Fetch user WITH relations to the new tables
    const user = await prisma.user.findUnique({
        where: { id: sessionId },
        include: {
            membership: true,
            workshops: true,
            submissions: true
        }
    });
    return user;
}

const getStatusBadge = (status) => {
    if (status === 'success') return 'bg-green-100 text-green-800';
    if (status === 'failure') return 'bg-red-100 text-red-800';
    if (status === 'pending') return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
};

const formatText = (text) => {
    if (!text) return 'N/A';
    return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default async function ProfilePage() {
    const user = await getUser();

    if (!user) {
        redirect('/login/event');
    }

    // --- HELPER: Consolidate Data ---
    
    // 1. Membership: Check new table first, then legacy
    const memberId = user.membership?.memberId || user.memberId;
    const isMember = !!memberId;
    const membershipType = user.membership?.type || user.memberType;

    // 2. Workshops: Merge Legacy Array + New Relations
    // New structure: user.workshops is an array of objects, each having a 'workshops' string array
    const newWorkshopList = user.workshops.flatMap(w => w.workshops); 
    const legacyWorkshopList = user.workshops_legacy || [];
    const allWorkshops = [...new Set([...legacyWorkshopList, ...newWorkshopList])]; // Unique list

    // 3. Submissions: Merge Legacy Fields + New Relations
    const allSubmissions = [];
    
    // Add Legacy Paper/Poster if exists
    if (user.hasPaperOrPoster) {
        if (user.paperCategory) {
            allSubmissions.push({
                type: 'Paper',
                title: 'Scientific Paper (Legacy)',
                category: user.paperCategory,
                downloadUrl: user.paperUrl,
                abstractUrl: user.abstractUrl,
                status: 'Submitted'
            });
        }
        if (user.posterCategory) {
            allSubmissions.push({
                type: 'Poster',
                title: 'Scientific Poster (Legacy)',
                category: user.posterCategory,
                downloadUrl: user.posterUrl,
                status: 'Submitted'
            });
        }
    }

    // Add New Submissions (from PaperPoster table)
    if (user.submissions && user.submissions.length > 0) {
        user.submissions.forEach(sub => {
            allSubmissions.push({
                type: formatText(sub.type),
                title: sub.title,
                category: sub.category,
                downloadUrl: sub.fullPaperUrl || sub.posterUrl,
                status: sub.status,
                college: sub.collegeName
            });
        });
    }

    return (
        <main className="bg-gray-50 min-h-screen py-24 sm:py-32">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
                    
                    {/* --- Profile Header --- */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md flex-shrink-0">
                            {user.photoUrl ? (
                                <Image src={user.photoUrl} alt="Profile" fill className="object-cover" sizes="160px" />
                            ) : (
                                <User className="w-full h-full text-gray-400 p-8" />
                            )}
                        </div>
                        <div className="text-center sm:text-left pt-2">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                                Welcome, {user.name}!
                            </h1>
                            <p className="mt-2 text-lg text-gray-600">NIDACON 2026 Dashboard</p>
                            
                            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    <Ticket className="w-4 h-4" />
                                    User ID: {user.userId}
                                </span>
                                {isMember && (
                                     <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                        <ShieldCheck className="w-4 h-4" />
                                        Member ID: {memberId}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* --- Personal Information --- */}
                    <div className="mt-8 border-t pt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Information</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <InfoItem icon={<Mail />} label="Email" value={user.email} />
                            <InfoItem icon={<Phone />} label="Mobile" value={user.mobile || 'Not Provided'} />
                            <InfoItem icon={<Home />} label="Address" value={user.address || 'Not Provided'} className="sm:col-span-2" />
                        </div>
                    </div>

                    {/* --- Delegate / Conference Status --- */}
                    <div className="mt-8 border-t pt-8">
                         <h2 className="text-2xl font-bold text-gray-800 mb-4">Conference Registration</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Only show main payment status if they registered as a delegate */}
                            {user.registrationType === 'delegate' ? (
                                <>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <p className="text-sm font-medium text-gray-500 mb-1">Payment Status</p>
                                        <span className={`inline-flex items-center gap-2 px-3 py-1 ${getStatusBadge(user.paymentStatus)} rounded-full text-sm font-medium`}>
                                            <BadgeCheck className="w-4 h-4" />
                                            {formatText(user.paymentStatus)}
                                        </span>
                                    </div>
                                    <InfoItem icon={<Hash />} label="Transaction ID" value={user.transactionId || 'N/A'} />
                                    <InfoItem icon={<ClipboardList />} label="Pass Type" value={formatText(user.registrationType)} />
                                    
                                    {/* Add-ons */}
                                    {(user.purchasedBanquetAddon || user.purchasedImplantAddon) && (
                                        <div className="bg-indigo-50 p-4 rounded-lg sm:col-span-2">
                                            <p className="text-sm font-medium text-indigo-800 mb-2">Purchased Add-ons</p>
                                            <ul className="space-y-1 text-indigo-700">
                                                {user.purchasedBanquetAddon && <li className="flex items-center gap-2"><Utensils className="w-4 h-4" /> Gala Banquet Dinner</li>}
                                                {user.purchasedImplantAddon && <li className="flex items-center gap-2"><Award className="w-4 h-4" /> Implant Add-on</li>}
                                            </ul>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="sm:col-span-2 bg-yellow-50 p-4 rounded-lg text-yellow-800">
                                    You have not registered as a Delegate yet. <Link href="/register-now" className="underline font-bold">Register Here</Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- Workshops --- */}
                    {allWorkshops.length > 0 && (
                        <div className="mt-8 border-t pt-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Workshops</h2>
                            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
                                <ul className="space-y-2">
                                    {allWorkshops.map((ws, idx) => (
                                        <li key={idx} className="flex items-start gap-3">
                                            <BadgeCheck className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-gray-800 font-medium">{ws}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    {/* --- Scientific Submissions --- */}
                    {allSubmissions.length > 0 && (
                        <div className="mt-8 border-t pt-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Scientific Submissions</h2>
                            <div className="space-y-4">
                                {allSubmissions.map((sub, idx) => (
                                    <div key={idx} className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold uppercase rounded">{sub.type}</span>
                                                    <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${sub.status === 'submitted' ? 'bg-green-100 text-green-700' : 'bg-gray-100'}`}>{sub.status}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-gray-900">{sub.title}</h3>
                                                <p className="text-sm text-gray-600 mt-1">Category: {sub.category}</p>
                                                {sub.college && <p className="text-sm text-gray-500 flex items-center gap-1 mt-1"><GraduationCap className="w-3 h-3"/> {sub.college}</p>}
                                            </div>
                                        </div>
                                        <div className="mt-4 flex gap-3">
                                            {sub.downloadUrl && (
                                                <DownloadLink href={sub.downloadUrl} label={`Download ${sub.type}`} />
                                            )}
                                            {sub.abstractUrl && (
                                                <DownloadLink href={sub.abstractUrl} label="Download Abstract" />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

// --- Helpers ---
function InfoItem({ icon, label, value, className = "" }) {
    return (
        <div className={`bg-gray-50 p-4 rounded-lg ${className}`}>
            <div className="flex items-start">
                <div className="flex-shrink-0 text-gray-500 mt-1">{React.cloneElement(icon, { className: "w-5 h-5" })}</div>
                <div className="ml-3">
                    <p className="text-sm font-medium text-gray-500">{label}</p>
                    <p className="text-base font-semibold text-gray-800 break-words">{value}</p>
                </div>
            </div>
        </div>
    );
}

function DownloadLink({ href, label }) {
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-md transition-colors">
            <Download className="w-4 h-4" />
            {label}
        </Link>
    );
}