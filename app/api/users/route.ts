
import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/mongodb";
import { registerSchema } from "@/lib/schemas";
import User from "@/models/User";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * @route   GET /api/users
 * @desc    Fetch all registered users for the dashboard list
 * @access  Private (Regulated by middleware/cookies)
 * @returns {Array} 200 - Array of user objects sorted by newest first
 * @returns {Object} 500 - Error message
 */
export async function GET() {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const isRegistered = cookieStore.get("registered");

    if (!isRegistered) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Establish database connection
    await connectDB();

    // Retrieve all users from MongoDB, sorted by creation date (descending)
    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: "Something went wrong!" },
      { status: 500 }
    );
  }
}

/**
 * @route   POST /api/users
 * @desc    Registers a new user with profile image upload
 * @access  Public
 * @param   {Request} req - JSON body containing fullName, email, phone, and profilePicture
 * @returns {Object} 201 - Success object with user data and session cookie
 * @returns {Object} 400 - Email uniqueness or validation error
 * @returns {Object} 500 - Server error
 */
export async function POST(req: Request) {
  try {
    // 1. Initialize Database Connection
    await connectDB();

    // 2️. Parse multipart/form-data
    const formData = await req.formData();
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const image = formData.get("image") as File | null;

    // 3. Validate required fields
    if (!image) {
      return NextResponse.json(
        { message: "Profile image is required" },
        { status: 400 }
      );
    }

    // 4. Validate data against Zod/Joi schema defined in @/lib/schemas
    const validatedData = registerSchema.parse({
      fullName,
      email,
      phone,
    });

    // 5. Unique Email Check (Requirement: "Email ID must be unique")
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "This email ID is already registered." },
        { status: 400 }
      );
    }

    // 6️. Upload Image to Cloudinary
    const buffer = Buffer.from(await image.arrayBuffer());

    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "hachberriesprofiles",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    // 7. Create User Record in MongoDB
    const user = await User.create({
      ...validatedData,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
    });

    // 8. Prepare Success Response
    const response = NextResponse.json(
      { success: true, user: user },
      { status: 201 }
    );

    // 9. Set "Pseudo-Session" Cookie
    // Requirement: "User must register again using a new email ID to access the list page again"
    // httpOnly: true prevents client-side JS from tampering with the cookie for security
    response.cookies.set("registered", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only use HTTPS in production
      sameSite: "lax",
      path: "/",
    });

    return response;
  } catch (error: any) {
    // Handle Zod validation errors specifically if needed
    if (error.name === "ZodError") {
      return NextResponse.json(
        { message: "Validation failed", errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Registration failed. Please try again later." },
      { status: 500 }
    );
  }
}
