import axiosInstanceFastApi from "../lib/axiosFastApi.js"
import FormData from "form-data"


export const analyzeResume = async (req, res) => {
    try {
        const file = req.file
        const formdata = new FormData()
        formdata.append("file", file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
        })
        const response = await axiosInstanceFastApi.post('/analyze', formdata, {
             headers: {
                ...formdata.getHeaders()
            }
        })
        console.log(response.data)
        return res.json(response.data)

    } catch (error) {
        console.log("Error in AnalyzeResume Controller", error.message)
        return res.status(500).json({message: "server error"})
    }
}

export const editResume = () => {
    
}