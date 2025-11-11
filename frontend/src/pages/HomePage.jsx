import { ArrowRight, Gauge, Edit3, History } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
 
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto">


            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
                Land your dream job
                <span  className="block bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent pb-2 leading-[1.1]">
                    with AI-powered Resume Edge
                </span>
            </h1>

          <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            Upload your resume and let our AI instantly analyze it for ATS compatibility, keyword optimization, and professional strength. Get a personalized score, actionable improvement tips, and even edit your resume right here — all in one seamless platform.
          </p>
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-200"
            >
              Get Started!
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">

            {/* ATS Score Checker */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Gauge className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">ATS Score Analyzer</h3>
                <p className="text-gray-600">
                Instantly evaluate your resume against applicant tracking systems to see how well it matches job descriptions and key skills.
                </p>
            </div>

            {/* Resume Editor */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <Edit3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Resume Editor</h3>
                <p className="text-gray-600">
                Edit and refine your resume with AI-powered suggestions to improve clarity, structure, and keyword optimization effortlessly.
                </p>
            </div>

            {/* History Tracking */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl hover:shadow-lg transition-shadow duration-200">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <History className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Resume History</h3>
                <p className="text-gray-600">
                Keep track of your recent uploads, edits, and ATS scores — all securely stored for easy access anytime.
                </p>
            </div>

            </div>

        </div>
      </div>
    </section>
  );
}
