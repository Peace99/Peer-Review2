import mongoose, { Schema } from "mongoose";

const journalSchema = mongoose.Schema({
    journalName: {
        type: String,
        required: true
    },

    articleName: {
        type: String,
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Author",
    },

    Abstract: {
        type: String,
        required: true
    },

    URL: {
        type: String,
        required: true
    }, 

}, 
    {
        timestamp: new Date
    }

)

export const journalModel = mongoose.model('Journal', journalSchema)