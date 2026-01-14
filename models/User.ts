import mongoose, { Schema, Document } from "mongoose";

/**
 * TypeScript Interface for the User Document
 * Extends mongoose.Document to include built-in MongoDB properties like _id.
 */
export interface IUser extends Document {
  fullName: string;
  email: string;
  phone: string;
  imageUrl: string; // URL of the image hosted on Cloudinary
  imagePublicId: string; // Required to identify and delete the image from Cloudinary
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User Schema Definition
 * Defines the structure, data types, and constraints for the Users collection.
 */
const UserSchema = new Schema<IUser>(
  {
    // Full Name: Mandatory field
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },

    // Email: Must be unique; an index is created in MongoDB for this
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // Standardizes email format
      trim: true,
    },

    // Phone: Stored as string to preserve formatting/leading zeros
    phone: {
      type: String,
      required: [true, "Phone number is required"],
    },

    // Profile Image: Storage of the Cloudinary Secure URL
    imageUrl: {
      type: String,
      required: [true, "Image URL is required"],
    },

    // Cloudinary ID: Critical for the 'Delete' functionality to clean up cloud storage
    imagePublicId: {
      type: String,
      required: [true, "Image Public ID is required"],
    },
  },
  {
    // Automatically creates 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

/**
 * Model Export
 * In Next.js, we check if the model already exists in the 'models' cache.
 * If it doesn't, we create it. This prevents "Cannot overwrite model once compiled" errors.
 */
export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
