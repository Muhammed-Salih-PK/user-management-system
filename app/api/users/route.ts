import connectDB from "@/lib/mongodb";
import { registerSchema } from "@/lib/schemas";
import User from "@/models/User";
import { NextResponse } from "next/server";

/**
 * @route   GET /api/users
 * @desc    Fetch all registered users for the dashboard list
 * @access  Private (Regulated by middleware/cookies)
 * @returns {Array} 200 - Array of user objects sorted by newest first
 * @returns {Object} 500 - Error message
 */
export async function GET() {
  try {
    // Establish database connection
    await connectDB();

    // Retrieve all users from MongoDB, sorted by creation date (descending)
    const users = await User.find().sort({ createdAt: -1 });

    return NextResponse.json(users);
  } catch (err) {
    console.error("GET_USERS_ERROR:", err);
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

    // 2. Parse and Validate Request Body
    // Note: If handling actual Files, use await req.formData() instead
    const body = await req.json();

    // Validate data against Zod/Joi schema defined in @/lib/schemas
    const data = registerSchema.parse(body);

    // 3. Unique Email Check (Requirement: "Email ID must be unique")
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return NextResponse.json(
        { message: "This email ID is already registered." },
        { status: 400 }
      );
    }

    // 4. Create User Record in MongoDB
    const user = await User.create(data);

    // 5. Prepare Success Response
    const response = NextResponse.json(
      { success: true, user: user },
      { status: 201 }
    );

    // 6. Set "Pseudo-Session" Cookie
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

    console.error("POST_USER_ERROR:", error);
    return NextResponse.json(
      { message: "Registration failed. Please try again later." },
      { status: 500 }
    );
  }
}
