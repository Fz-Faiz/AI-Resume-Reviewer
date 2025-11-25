import { ArrowLeft, Send, Loader, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { useResumeStore } from "../store/useResumeStore";

export default function EditResume({ onBack }) {
  const [resumeText, setResumeText] = useState("");
  const [message, setMessages] = useState([]);
  const [question, setQuestion] = useState("");

  const messagesEndRef = useRef(null);
  const scrollBoxRef = useRef(null);

  const {
    editable,
    filename,
    loading,
    messages,
    chatLoading,
    chatResume,
    downloadPdf,
  } = useResumeStore();

  // Load resume in editor
  useEffect(() => {
    if (editable) setResumeText(editable);
  }, [editable]);

  // Load chat messages into local state
  useEffect(() => {
    setMessages(messages);
  }, [messages]);

  // Auto-scroll when messages update
  useLayoutEffect(() => {
    if (!scrollBoxRef.current) return;
    requestAnimationFrame(() => {
      scrollBoxRef.current.scrollTop = scrollBoxRef.current.scrollHeight;
    });
  }, [messages, chatLoading]);

  const handleSendQuestion = () => {
    if (!question.trim()) return;
    chatResume(question);
    setQuestion("");
  };

  const handleKeyPress = (event) => {
    if(event.key == 'Enter'){
      if (!question.trim()) return;
      chatResume(question);
      setQuestion("");
    }
  }
    const handleDownloadButton = () => {
        downloadPdf(resumeText)
    }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Navbar */}
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
              Edit Resume
            </span>
            <button 
             className="px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium hover:shadow-lg transition-all"
             onClick={handleDownloadButton}
            >
              Download
            </button>
          </div>
        </div>
      </nav>

      {/* Body */}
      <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* Left Editor */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col">
            <div className="flex-1 overflow-hidden">
              <div className="p-6 h-full overflow-y-auto">
                <div className="mb-4">
                  <p className="text-gray-600 text-sm">Editing file:</p>
                  <p className="font-semibold text-gray-900">{filename}</p>
                </div>

                {loading ? (
                  <div className="flex items-center justify-center h-96">
                    <Loader className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
                    <p className="text-gray-600">Loading resume...</p>
                  </div>
                ) : (
                  <textarea
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                    className="w-full h-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none font-mono text-sm"
                    placeholder="Resume content will appear here..."
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right Chat */}
          <div className="lg:col-span-1 flex flex-col h-full min-h-0">
            <div className="bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden flex-1 min-h-0">
              
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
              </div>

              {/* Chat Messages */}
              <div
                className="flex-1 p-4 space-y-4 overflow-y-auto min-h-0"
                ref={scrollBoxRef}
                style={{ scrollBehavior: "smooth" }}
              >
                {message.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <MessageSquare className="w-12 h-12 text-gray-200 mb-3" />
                    <p className="text-gray-500 text-sm">
                      Ask questions about your resume
                    </p>
                  </div>
                ) : (
                  <>
                    {message.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${
                          msg.type === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[80%] break-words px-4 py-2 rounded-lg text-sm ${
                            msg.type === "user"
                              ? "bg-blue-600 text-white rounded-br-none"
                              : "bg-gray-100 text-gray-900 rounded-bl-none"
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    ))}

                    {/* AI Typing Loader */}
                    {chatLoading && (
                      <div className="flex justify-start mt-2">
                        <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-lg text-sm rounded-bl-none">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                            <div
                              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div className="border-t border-gray-200 p-4">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    onKeyDown={handleKeyPress}
                    placeholder="Ask about your resume..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />

                  <button
                    onClick={handleSendQuestion}
                    disabled={!question.trim() || chatLoading}
                    className="px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                  >
                    <Send size={18} />
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
