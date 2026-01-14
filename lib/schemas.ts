import z from "zod";

/**
 * User Registration Validation Schema
 * This schema defines the structural and data integrity requirements
 * for the user registration process using the Zod library.
 */
export const registerSchema = z.object({
  // 1. Full Name: Must be a string and at least 2 characters long
  fullName: z.string().min(2, "Full name must be at least 2 characters"),

  // 2. Email: Must be a valid email format
  email: z.string().email("Please enter a valid email address"),

  // 3. Phone: Must be exactly 10 digits (Standard Indian Mobile Format)
  // The regex ^\d{10}$ ensures only numbers are allowed and exactly 10 of them
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),

  // 4. Image URL: Must be a valid URL (returned from Cloudinary)
  imageUrl: z.string().url("Invalid profile picture URL"),

  // 5. Image Public ID: Required for Cloudinary management (deleting images later)
  imagePublicId: z.string().min(1, "Cloudinary Public ID is required"),
});
