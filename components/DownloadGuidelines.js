import React from 'react'
import { FileDown } from 'lucide-react'

const DownloadGuidelines = () => {
  return (
    <div className="mt-6 mb-8">
      <a 
        href="/paper/GUIDELINES.pdf" // <--- REPLACE with your actual file path
        download="NIDACON_Submission_Guidelines.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="group block"
      >
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl transition-all duration-300 hover:shadow-md hover:border-blue-300 cursor-pointer">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
              <FileDown size={20} />
            </div>
            <div>
              <h4 className="font-bold text-gray-800 text-md group-hover:text-blue-700 transition-colors">
                View Submission Guidelines
              </h4>
              <p className='text-sm text-gray-600'>Check the guidelines before submitting your work.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center bg-white px-3 py-1.5 rounded-full text-xs font-bold text-blue-600 shadow-sm border border-blue-100 group-hover:bg-blue-600 group-hover:text-white transition-all">
            View PDF
          </div>
        </div>
      </a>
    </div>
  )
}

export default DownloadGuidelines
