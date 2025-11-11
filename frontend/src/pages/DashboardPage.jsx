import { Upload, FileText, BarChart3, Edit3, LogOut } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useResumeStore } from '../store/useResumeStore.js'

export default function DashboardPage({ onLogout }) {
  const [analyzeFile, setAnalyzeFile] = useState(null);
  const [editFile, setEditFile] = useState(null);
  const analyzeInputRef = useRef(null);
  const editInputRef = useRef(null);
  const navigate = useNavigate()
  const { analyzeResume, setFilename } = useResumeStore();
  

  const handleFileSelect = (e, type) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      if (type === 'analyze') {
        setFilename(file.name)
        setAnalyzeFile(file);
        analyzeResume(file)
        navigate("/analyze-resume")
      } else {
        setEditFile(file);
      }
    } else {
      alert('Please select a PDF file');
    }
  };

  const handleAnalyzeClick = () => {
    analyzeInputRef.current?.click();
  };

  const handleEditClick = () => {
    editInputRef.current?.click();
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            Resume Tools
          </h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-red-600 font-medium transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome</h2>
          <p className="text-lg text-gray-600">Choose an option to get started with your resume</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Analyze Resume Card */}
          <div
            onClick={handleAnalyzeClick}
            className="group relative aspect-square bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-300" />

            <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-10 h-10 text-white" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-3">Analyze Resume</h3>
              <p className="text-gray-600 mb-6">Upload your resume to get AI-powered insights and feedback</p>

          
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold group-hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
                <Upload size={20} />
                {analyzeFile ? 'Change File' : 'Upload PDF'}
              </div>
            </div>

            <input
              ref={analyzeInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileSelect(e, 'analyze')}
              className="hidden"
            />
          </div>

          {/* Edit Resume Card */}
          <div
            onClick={handleEditClick}
            className="group relative aspect-square bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-all duration-300" />

            <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-6 transform group-hover:scale-110 transition-transform duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Edit3 className="w-10 h-10 text-white" />
                </div>
              </div>

              <h3 className="text-3xl font-bold text-gray-900 mb-3">Edit Resume</h3>
              <p className="text-gray-600 mb-6">Upload and edit your resume with our intuitive editor</p>

              {editFile && (
                <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-900 flex items-center gap-2">
                    <FileText size={16} />
                    {editFile.name}
                  </p>
                </div>
              )}

              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-semibold group-hover:shadow-lg transition-all duration-200 transform group-hover:scale-105">
                <Upload size={20} />
                {editFile ? 'Change File' : 'Upload PDF'}
              </div>
            </div>

            <input
              ref={editInputRef}
              type="file"
              accept="application/pdf"
              onChange={(e) => handleFileSelect(e, 'edit')}
              className="hidden"
            />
          </div>
        </div>

       
      </div>
    </div>
  );
}
