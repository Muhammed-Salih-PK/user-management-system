import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

/**
 * @route   POST /api/upload
 * @desc    Process and upload a profile picture to Cloudinary
 * @access  Public
 * @param   {Request} req - Request object containing Multipart FormData
 * @returns {Object} 200 - Success: { imageUrl: string, imagePublicId: string }
 * @returns {Object} 400 - Error: Image missing
 * @returns {Object} 500 - Error: Upload failed
 */
export async function POST(req: Request) {
  try {
    // 1. Extract Multipart Form Data
    const formData = await req.formData();
    const image = formData.get("image") as File;

    // 2. Validate Image Presence
    if (!image) {
      return NextResponse.json(
        { message: "Image is required" },
        { status: 400 }
      );
    }

    // 3. Convert File to Buffer for Cloudinary Stream
    // We convert the file to an ArrayBuffer and then to a Node.js Buffer
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 4. Handle Cloudinary Upload via Stream
    // Using a Promise wrapper to handle the asynchronous stream upload
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "hachberriesprofiles", // Organizes images in a specific Cloudinary folder
            resource_type: "image",
          },
          (error, result) => {
            if (error) {
              console.error("Cloudinary Stream Error:", error);
              reject(error);
            } else {
              resolve(result);
            }
          }
        )
        .end(buffer); // Write the buffer to the upload stream
    });

    // 5. Return the Cloudinary Asset Details
    // These values should be saved to the MongoDB User model
    return NextResponse.json({
      imageUrl: uploadResult.secure_url, // The public URL for the image
      imagePublicId: uploadResult.public_id, // Useful for future deletions/transformations
    });
    
  } catch (error) {
    // 6. Log and Handle Unexpected Failures
    console.error("UPLOAD_FAILURE:", error);
    return NextResponse.json(
      { message: "Upload failed" }, 
      { status: 500 }
    );
  }
}