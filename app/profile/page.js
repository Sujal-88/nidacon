// app/profile/page.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import Link from 'next/link';
import { 
    User, Mail, Phone, Home, Ticket, BadgeCheck, FileText, 
    DollarSign, Hash, Award, ShieldCheck, ClipboardList, Briefcase, Download, Utensils
} from 'lucide-react';
import React from 'react'; // Import React for InfoItem helper

async function getUser() {
    const sessionId = cookies().get('session')?.value;
    if (!sessionId) {
        return null;
    }
    // Fetch user and all related NIDACON details
    const user = await prisma.user.findUnique({
        where: { id: sessionId },
    });
    return user;
}

const getStatusBadge = (status) => {
    if (status === 'success') {
        return 'bg-green-100 text-green-800';
    }
    if (status === 'failure') {
        return 'bg-red-100 text-red-800';
    }
     if (status === 'pending') {
        return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
};

// Helper to format titles like 'paper-poster' to 'Paper Poster'
const formatRegistrationType = (type) => {
    if (!type) return 'N/A';
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

export default async function ProfilePage() {
    const user = await getUser();

    if (!user) {
        redirect('/login/event'); // Redirect to event login
    }

    return (
        <main className="bg-gray-50 min-h-screen py-24 sm:py-32">
            <div className="container mx-auto px-6">
                <div className="max-w-3xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-lg border border-gray-200">
                    
                    {/* --- Profile Header --- */}
                    <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden bg-gray-100 border-4 border-white shadow-md flex-shrink-0">
                            {user.photoUrl ? (
                                <Image
                                    src={user.photoUrl}
                                    alt="Profile Photo"
                                    fill
                                    className="object-cover"
                                    sizes="160px"
                                />
                            ) : (
                                <User className="w-full h-full text-gray-400 p-8" />
                            )}
                        </div>
                        <div className="text-center sm:text-left pt-2">
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">
                                Welcome, {user.name}!
                            </h1>
                            <p className="mt-2 text-lg text-gray-600">
                                Your NIDACON 2026 Dashboard
                            </p>
                            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                                <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                    <Ticket className="w-4 h-4" />
                                    User ID: {user.userId}
                                </span>
                                {user.isMember && user.memberId && (
                                     <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                                        <ShieldCheck className="w-4 h-4" />
                                        Member ID: {user.memberId}
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

                    {/* --- Registration & Payment Details --- */}
                    <div className="mt-8 border-t pt-8">
                         <h2 className="text-2xl font-bold text-gray-800 mb-4">Registration Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Payment Status */}
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm font-medium text-gray-500 mb-1">Payment Status</p>
                                <span className={`inline-flex items-center gap-2 px-3 py-1 ${getStatusBadge(user.paymentStatus)} rounded-full text-sm font-medium`}>
                                    <BadgeCheck className="w-4 h-4" />
                                    {user.paymentStatus ? user.paymentStatus.charAt(0).toUpperCase() + user.paymentStatus.slice(1) : 'N/A'}
                                </span>
                            </div>

                            
                            
                            {/* Transaction ID */}
                            <InfoItem icon={<Hash />} label="Transaction ID" value={user.transactionId || 'N/A'} />

                            {/* Registration Type */}
                            <InfoItem icon={<ClipboardList />} label="Registration Type" value={formatRegistrationType(user.registrationType)} />
                            
                            {/* Member Type */}
                            {user.memberType && (
                                <InfoItem icon={<Briefcase />} label="Membership Category" value={formatRegistrationType(user.memberType)} />
                            )}
                        </div>
                    </div>

                    {/* --- Purchased Add-ons & Workshops --- */}
                    <div className="mt-8 border-t pt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Selections</h2>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <ul className="space-y-3">
                                {/* Workshops */}
                                {user.workshops && user.workshops.length > 0 && (
                                    <li className="flex items-start">
                                        <Award className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                        <div className="ml-3">
                                            <strong className="text-gray-900">Registered Workshops:</strong>
                                            <ul className="list-disc list-inside pl-2 space-y-1 text-gray-700">
                                                {user.workshops.map(ws => <li key={ws}>{ws}</li>)}
                                            </ul>
                                        </div>
                                    </li>
                                )}

                                {/* Banquet Add-on */}
                                {user.purchasedBanquetAddon && (
                                    <li className="flex items-center">
                                        <Utensils className="w-5 h-5 text-green-600 flex-shrink-0" />
                                        <strong className="ml-3 text-gray-900">Purchased:</strong>
                                        <span className="ml-2 text-gray-700">Gala Banquet Add-on</span>
                                    </li>
                                )}

                                {/* Implant Add-on */}
                                {user.purchasedImplantAddon && (
                                    <li className="flex items-center">
                                        <Award className="w-5 h-5 text-green-600 flex-shrink-0" /> {/* Re-using Award icon */}
                                        <strong className="ml-3 text-gray-900">Purchased:</strong>
                                        <span className="ml-2 text-gray-700">Implant Add-on</span>
                                    </li>
                                )}

                                {/* No selections message */}
                                {(!user.workshops || user.workshops.length === 0) && !user.purchasedBanquetAddon && !user.purchasedImplantAddon && (
                                    <p className="text-gray-500">No workshops or add-ons selected for this registration.</p>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* --- Scientific Submissions --- */}
                    {user.hasPaperOrPoster && (
                        <div className="mt-8 border-t pt-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Scientific Submissions</h2>
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                                {user.paperCategory && (
                                    <div>
                                        <strong className="text-gray-900">Paper Submission:</strong>
                                        <span className="text-gray-700 ml-2">{user.paperCategory}</span>
                                        <div className="flex flex-col sm:flex-row gap-4 mt-2">
                                            {user.abstractUrl && <DownloadLink href={user.abstractUrl} label="Download Abstract" />}
                                            {user.paperUrl && <DownloadLink href={user.paperUrl} label="Download Full Paper" />}
                                        </div>
                                    </div>
                                )}
                                {user.posterCategory && (
                                    <div>
                                        <strong className="text-gray-900">Poster Submission:</strong>
                                        <span className="text-gray-700 ml-2">{user.posterCategory}</span>
                                        <div className="flex gap-4 mt-2">
                                            {user.posterUrl && <DownloadLink href={user.posterUrl} label="Download Poster" />}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

// Helper component for info items
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

// Helper component for download links
function DownloadLink({ href, label }) {
    return (
        <Link href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-800">
            <Download className="w-4 h-4" />
            {label}
        </Link>
    );
}