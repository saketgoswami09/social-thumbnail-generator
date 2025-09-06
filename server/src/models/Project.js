import mongoose from "mongoose";

const { Schema } = mongoose;

const projectSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    platform: {
      type: String,
      required: true,
      enum: ["youtube", "instagram", "twitter"],
    },
    prompt: {
      type: String,
      required: false,
    },
    genratedImage: {
      type: String,
      required: false,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
