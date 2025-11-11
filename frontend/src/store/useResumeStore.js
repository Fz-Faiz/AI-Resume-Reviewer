import {create} from "zustand"
import axiosInstance from "../lib/axios.js"
import {toast} from "react-hot-toast"

export const useResumeStore = create((set, get) => ({
    analysis: null,
    loading: false,
    filename: "",
    setFilename: (name) => set({ filename: name }),

    

    analyzeResume: async (file) => {
        try {
            set({ loading : true})
            const formdata = new FormData()
            formdata.append("file", file)

            const res = await axiosInstance.post("/resume/analyze", formdata);
            set({ analysis: res.data, loading: false})
        } catch (error) {
            set({ loading: false})
            console.log("Analyze error", error.message)
            toast.error(error.response.data.message || "An error occurred during analysis")
        }
    }
}))