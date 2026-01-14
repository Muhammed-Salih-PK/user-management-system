import { cookies } from "next/headers";
import { NextResponse } from "next/server";

/**
 * @route   GET /api/session
 * @desc    Check if the user is currently "registered" (session check)
 * @access  Public
 */
export async function GET() {
  const cookieStore = await cookies();
  const isRegistered = cookieStore.get("registered");

  if (!isRegistered) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({ authenticated: true });
}

/**
 * @route   DELETE /api/session
 * @desc    Logout - Clears the registration cookie
 * @access  Public
 * @logic   Requirement: "The user must register again using a new email ID to access the list page"
 */
export async function DELETE() {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    // Expire the cookie immediately to remove it from the browser
    response.cookies.set("registered", "", {
      path: "/",
      expires: new Date(0), // Set expiration to the past
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: "Logout failed" }, { status: 500 });
  }
}
