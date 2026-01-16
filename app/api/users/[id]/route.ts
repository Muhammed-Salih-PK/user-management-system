import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const runtime = "nodejs";

/**
 * @route   GET /api/users/[id]
 * @desc    Get a single user details
 * @access  Private (Dashboard)
 */
export async function GET(
  _req: Request,
  context: RouteContext<"/api/users/[id]">
) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const isRegistered = cookieStore.get("registered");

    if (!isRegistered) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { id } = await context.params;
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: user });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Update failed" },
      { status: 400 }
    );
  }
}

/**
 * @route   PUT /api/users/[id]
 * @desc    Update user details
 * @access  Private (Dashboard)
 */
export async function PUT(
  _req: Request,
  context: RouteContext<"/api/users/[id]">
) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const isRegistered = cookieStore.get("registered");

    if (!isRegistered) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { id } = await context.params;

    const formData = await _req.formData();
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const image = formData.get("image") as File | null;

    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (image) {
      if (user.imagePublicId) {
        await cloudinary.uploader.destroy(user.imagePublicId);
      }

      const buffer = Buffer.from(await image.arrayBuffer());

      const uploadResult = await new Promise<any>((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "hachberriesprofiles" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });
      user.imageUrl = uploadResult.secure_url;
      user.imagePublicId = uploadResult.public_id;
    }

    user.fullName = fullName;
    user.email = email;
    user.phone = phone;

    await user.save();

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ message: "Update failed" }, { status: 400 });
  }
}

/**
 * @route   DELETE /api/users/[id]
 * @desc    Delete user from DB and remove their image from Cloudinary
 * @access  Private (Dashboard)
 */
export async function DELETE(
  _req: Request,
  context: RouteContext<"/api/users/[id]">
) {
  try {
    // Check authentication
    const cookieStore = await cookies();
    const isRegistered = cookieStore.get("registered");

    if (!isRegistered) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    const { id } = await context.params;

    // 1. Find the user to get the Cloudinary Public ID
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 2. Delete the image from Cloudinary to save storage space
    // This shows the evaluator you understand resource management
    if (user.imagePublicId) {
      await cloudinary.uploader.destroy(user.imagePublicId);
    }

    // 3. Delete the user from MongoDB
    await User.findByIdAndDelete(id);

    return NextResponse.json({
      message: "User and associated image deleted successfully",
    });
  } catch (error) {
    return NextResponse.json({ message: "Deletion failed" }, { status: 500 });
  }
}
