import { Document, model, Schema, Types } from "mongoose";

export interface IFile extends Document {
  owner: Types.ObjectId;
  originalName: string;
  storedName: string;
  size: number;
  mimeType: string;
  createdAt: Date;
}

const fileSchema = new Schema<IFile>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    storedName: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default model<IFile>("File", fileSchema);
