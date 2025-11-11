import { ArrowLeft, CheckCircle, AlertCircle, Lightbulb } from 'lucide-react';
import { useResumeStore } from '../store/useResumeStore';

export default function AnalyzeResume({ onBack }) {

  const {analysis, loading, filename} = useResumeStore()

  


  const getScoreTextColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Back
            </button>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Resume Analysis
            </span>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <p className="text-gray-600">Analyzing file:</p>
              <p className="font-semibold text-gray-900">{filename}</p>
            </div>
            {!loading && (
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
            )}
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mb-6 animate-pulse"></div>
                <div className="w-48 h-8 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                <div className="w-32 h-6 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((col) => (
                <div
                  key={col}
                  className="bg-white rounded-2xl shadow-lg p-6 space-y-3"
                >
                  <div className="w-40 h-6 bg-gray-200 rounded-lg mb-4 animate-pulse"></div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-5 h-5 bg-gray-200 rounded mt-1 flex-shrink-0 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="w-3/4 h-4 bg-gray-200 rounded mt-2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : analysis ? (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col items-center">
                <div className="relative w-40 h-40 mb-6">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="54"
                      fill="none"
                      strokeWidth="8"
                      className={`stroke-current transition-all duration-1000 ${
                        analysis.ats_score >= 80
                          ? 'text-green-500'
                          : analysis.ats_score >= 60
                          ? 'text-orange-500'
                          : 'text-red-500'
                      }`}
                      strokeDasharray={`${(analysis.ats_score / 100) * 339.29} 339.29`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div
                      className={`text-5xl font-bold ${getScoreTextColor(analysis.ats_score)}`}
                    >
                      {analysis.ats_score}
                    </div>
                    <div className="text-gray-600 text-sm">out of 100</div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {analysis.ats_score >= 80
                    ? 'Excellent ATS Score!'
                    : analysis.ats_score >= 60
                    ? 'Good Progress!'
                    : 'Room for Improvement'}
                </h2>
                <p className="text-gray-600 text-center max-w-md">
                  {analysis.ats_score >= 80
                    ? 'Your resume is well-optimized for ATS systems. Keep it up!'
                    : analysis.ats_score >= 60
                    ? 'Your resume looks good. Consider the suggestions below to improve further.'
                    : 'Follow the suggestions below to significantly improve your ATS compatibility.'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-amber-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Missing Keywords ({analysis?.missing_keywords?.length  || 0})
                  </h3>
                </div>
                <div className="space-y-3">
                  {analysis.missing_keywords.map((keyword, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 hover:border-amber-300 transition-colors"
                    >
                      <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700">{keyword}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Lightbulb className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Suggestions ({analysis.suggestions.length})
                  </h3>
                </div>
                <div className="space-y-3">
                  {analysis.suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      <span className="text-gray-700 text-sm">{suggestion}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
