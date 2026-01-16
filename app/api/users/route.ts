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
    console.log(err);
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
    const formData = await req.formData();
    const fullName = formData.get("fullName")?.toString().trim();
    const email = formData.get("email")?.toString().trim().toLowerCase();
    const phone = formData.get("phone")?.toString().trim();
    const image = formData.get("image"); // don't cast

    // Check all fields present
    if (!fullName || !email || !phone || !image || !(image instanceof Blob)) {
      console.log("Missing or invalid fields");
      return NextResponse.json(
        { message: "All fields including profile image are required" },
        { status: 400 }
      );
    }

    // Zod validation
    let validatedData;
    try {
      validatedData = registerSchema.parse({ fullName, email, phone });
    } catch (err: any) {
      return NextResponse.json(
        { message: "Validation failed", errors: err.errors },
        { status: 400 }
      );
    }

    // Connect DB
    await connectDB();

    // Check email uniqueness
    const existingUser = await User.findOne({ email: validatedData.email })
      .select("_id")
      .lean();
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 400 }
      );
    }

    // Prepare image buffer
    const imageBuffer = Buffer.from(await image.arrayBuffer());

    // Upload to Cloudinary
    const uploadResult = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "hachberriesprofiles",
            resource_type: "image",
            width: 800,
            height: 800,
            crop: "limit",
          },
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        )
        .end(imageBuffer);
    });

    // Create user
    const user = await User.create({
      ...validatedData,
      imageUrl: uploadResult.secure_url,
      imagePublicId: uploadResult.public_id,
    });

    // Send response with cookie
    const res = NextResponse.json({ success: true, user }, { status: 201 });
    res.cookies.set("registered", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch (err: any) {
    if (err.name === "ZodError") {
      console.log("Zod error caught in outer catch:", err.errors);
      return NextResponse.json(
        { message: "Validation failed", errors: err.errors },
        { status: 400 }
      );
    }
    console.error("Unhandled registration error:", err);
    return NextResponse.json(
      { message: "Registration failed" },
      { status: 500 }
    );
  }
}
