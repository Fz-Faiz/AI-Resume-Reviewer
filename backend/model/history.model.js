import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        action: {
            type: String,
            required: true
        },
        createdAt:{
            time: Date,
            default: Date.now,
        }
    }
)

const History = mongoose.model("history", historySchema)
export default History;

