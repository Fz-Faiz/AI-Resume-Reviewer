import { create } from "zustand";
import axiosInstance from "../lib/axios.js";
import { toast } from "react-hot-toast";



export const useResumeStore = create((set, get) => ({
  analysis: null,
  loading: false,         // resume loading (upload/edit/analyze)
  chatLoading: false,     // chat loading (AI typing)
  filename: "",
  messages: [],
  editable: null,

  setFilename: (name) => set({ filename: name }),

  analyzeResume: async (file) => {
    try {
      set({ loading: true });
      const formdata = new FormData();
      formdata.append("file", file);

      const res = await axiosInstance.post("/resume/analyze", formdata);
      set({ analysis: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Error during analysis");
    }
  },

  editResume: async (file) => {
    try {
      set({ loading: true });

      const formdata = new FormData();
      formdata.append("file", file);

      const res = await axiosInstance.post("/resume/edit", formdata);
      set({ editable: res.data, loading: false });
    } catch (error) {
      set({ loading: false });
      toast.error(error.response?.data?.message || "Error during editing");
    }
  },

  uploadResume: async (file) => {
    try {
      set({ loading: true });

      const formdata = new FormData();
      formdata.append("file", file);

      await axiosInstance.post("/resume/upload", formdata);

      set({ loading: false }); // you forgot this earlier!
    } catch (error) {
      set({ loading: false });
      toast.error("Error uploading resume");
    }
  },

  chatResume: async (question) => {
    try {
      set({ chatLoading: true });   // FIX HERE

      // Add user message
      set((state) => ({
        messages: [...state.messages, { type: "user", content: question }],
      }));

      // Call backend
      const res = await axiosInstance.post("/resume/chat", { question });

      // Add bot response
      set((state) => ({
        messages: [...state.messages, { type: "bot", content: res.data.answer }],
        chatLoading: false,        // FIX HERE
      }));
    } catch (error) {
      set({ chatLoading: false });  // FIX HERE
      toast.error("Chat error");
    }
  },

  downloadPdf: async (textArea) => {
    try {
        const res = await axiosInstance.post(
          '/resume/generate-pdf',
          { textAreaContent: textArea },
          { responseType: 'blob' } // IMPORTANT
        );

        // Create PDF blob
        const file = new Blob([res.data], { type: 'application/pdf' });

        // Create download link
        const url = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.download = "resume.pdf"; // file name
        link.click();

        // Cleanup
        window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Error in downloading")
    }
  }
}));
