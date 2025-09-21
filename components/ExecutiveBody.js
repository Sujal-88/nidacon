import Image from 'next/image';
import { Linkedin, Twitter } from 'lucide-react';

// Sample data with added 'socials' for demonstration
const executiveBodyMembers = [
  {
    id: 1,
    name: 'Dr. Tushar Shrirao',
    qualification: 'President',
    description: 'A visionary leader with over 20 years of experience in architectural innovation and sustainable design practices.',
    image: '/committee/tusharShrirao.jpeg',
    socials: {
      linkedin: '#',
      twitter: '#',
    }
  },
  {
    id: 2,
    name: 'Dr. Ketan Garg',
    qualification: 'HON.Secreatary',
    description: 'Specializes in large-scale urban planning and smart city projects, blending technology with human-centric design.',
    image: '/committee/ketanGarg.jpeg',
    socials: {
      linkedin: '#',
      twitter: '#',
    }
  },
  {
    id: 3,
    name: 'Dr. Rohit Mude',
    qualification: 'Treasurer',
    description: 'An expert in material science and interior design, focusing on creating functional and aesthetically pleasing spaces.',
    image: '/committee/rohitMude.jpeg',
    socials: {
      linkedin: '#',
      twitter: null, // Example of a missing social link
    }
  },
];


export default function ExecutiveBody() {
  return (
    <section id='executive' className="bg-slate-50 text-slate-900 py-24 sm:py-32">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">
            Our Executive Body
          </h2>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Meet the visionary minds and leading experts who form the backbone of IDA Nagpur.
          </p>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
          {executiveBodyMembers.map((member) => (
            <div 
              key={member.id} 
              className="bg-white rounded-xl shadow-md hover:shadow-xl border border-slate-200/80 transition-all duration-300 ease-in-out hover:-translate-y-2 flex flex-col group"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden rounded-t-xl">
                <Image
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
                  src={member.image}
                  alt={`Photo of ${member.name}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              
              {/* Content Container */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Main Info */}
                <div className="flex-grow">
                  <p className="text-sm font-semibold text-indigo-600 mb-3">{member.qualification}</p>
                  <h3 className="text-2xl font-bold mb-2 text-slate-800">{member.name}</h3>
                  <p className="text-slate-600 text-base leading-relaxed line-clamp-3">
                    {member.description}
                  </p>
                </div>
                
                {/* Social Links */}
                <div className="mt-6 pt-4 border-t border-slate-200">
                  <div className="flex items-center space-x-4">
                    {member.socials.linkedin && (
                      <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-600 transition-colors">
                        <Linkedin className="w-5 h-5" />
                        <span className="sr-only">LinkedIn</span>
                      </a>
                    )}
                    {member.socials.twitter && (
                      <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-indigo-600 transition-colors">
                        <Twitter className="w-5 h-5" />
                        <span className="sr-only">Twitter</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}