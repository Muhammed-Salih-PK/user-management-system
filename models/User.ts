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
      trim: true,
    },

    // Email: Must be unique; an index is created in MongoDB for this
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true, // Standardizes email format
      trim: true,
      index: true, // Add index for faster lookups
    },

    // Phone: Stored as string to preserve formatting/leading zeros
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
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

// Add compound index for better query performance
UserSchema.index({ createdAt: -1 });
UserSchema.index({ email: 1, createdAt: -1 });

/**
 * Model Export
 * In Next.js, we check if the model already exists in the 'models' cache.
 * If it doesn't, we create it. This prevents "Cannot overwrite model once compiled" errors.
 */
export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
