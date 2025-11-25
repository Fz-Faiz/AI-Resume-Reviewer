import axiosInstanceFastApi from "../lib/axiosFastApi.js"
import FormData from "form-data"
import { PDFDocument, rgb, StandardFonts } from "pdf-lib"
import fs from "fs"
import fontkit from '@pdf-lib/fontkit';



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


export const editResume =  async (req, res) => {
    try {
        const file = req.file
        const formdata = new FormData()
        formdata.append("file", file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype
        })
        const response = await axiosInstanceFastApi.post('/textExtract', formdata, {
             headers: {
                ...formdata.getHeaders()
            }
        })
        return res.status(200).json(response.data)
    } catch (error) {
        console.log("Error in editResume controller", error.message)
        return res.status(500).json({ message: "Error in pdf extracting"})
    }
}

export const uploadResume = async (req, res) => {
    try {
        const file = req.file;
        const formdata = new FormData();
        formdata.append("file", file.buffer,{
            filename: file.originalname,
            contentType: file.mimetype
        })

        await axiosInstanceFastApi.post('/chat/upload', formdata, {
            headers: formdata.getHeaders()
        })
        return res.status(200).json({message: "resume uploaded successfully "})
    } catch (error) {
        console.log("Error in upload controller", error.message)
        return res.status(500).json({mesage: "Error in upload controller"})
    }
}

export const chatResume = async (req, res) => {
  try {
    const { question } = req.body;

    const response = await axiosInstanceFastApi.post("/chat", { question });

    return res.status(200).json({
      answer: response.data.answer,  // <--- FIX
    });

  } catch (error) {
    console.log("Error in chatresume controller:", error.response?.data || error.message);
    return res.status(500).json({ message: "Error in chatResume controller" });
  }
};

export const generatePdf = async (req, res) => {
    try {
        const { textAreaContent } = req.body;

        if(!textAreaContent){
            return res.status(400).json({ message: "No text is provided"})
        }

        const pdfDoc = await PDFDocument.create();
        pdfDoc.registerFontkit(fontkit)
        const page = pdfDoc.addPage();

        const fontBytes = fs.readFileSync("backend/fonts/NotoSans-Regular.ttf");
        const font = await pdfDoc.embedFont(fontBytes);

        page.drawText(textAreaContent, {
             x: 50,
            y: page.getHeight() - 50,
            font,
            size: 12,
            color: rgb(0, 0, 0),
            maxWidth: page.getWidth() - 100
        })

        const pdfBytes = await pdfDoc.save();

        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=generated.pdf",
            "Content-Length": pdfBytes.length,
        });

        return res.status(200).send(Buffer.from(pdfBytes));
    } catch (error) {
        console.log("Error in generatePdf controller", error)
        return res.status(500).json({message: error.mesage})
    }
}
