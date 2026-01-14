import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary Configuration Utility
 * * This module initializes the Cloudinary SDK with environment variables.
 * Using '!' (Non-null assertion operator) ensures TypeScript that these
 * variables will be provided at runtime via the .env file.
 */

cloudinary.config({
  // The cloud name found in your Cloudinary Dashboard
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,

  // API Key for authentication
  api_key: process.env.CLOUDINARY_API_KEY!,

  // API Secret for secure server-side signing (Must never be exposed to the client)
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export default cloudinary;
