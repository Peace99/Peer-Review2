import mongoose, { Schema } from "mongoose";

/** Article schema defined with validation rules */
const ArticleSchema = mongoose.Schema(
  {
   userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Author",
    },

    url: {
      type: String,
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    abstract: {
      type: String,
      required: true,
    },
    
    fieldOfResearch: {
      type: String,
      required: true,
    },

    keywords: {
        type: String,
        required: true,
    },
   
    status: {
      type: Array,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

/** Article model to be used for interacting with our collection. Refer to mongoose docs for the difference between a schema {@link https://mongoosejs.com/docs/guide.html} and a model {@link https://mongoosejs.com/docs/models.html} */
export const ArticleModel = mongoose.model("Article", ArticleSchema);
