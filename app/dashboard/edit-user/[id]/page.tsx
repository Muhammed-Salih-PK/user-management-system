import EditUserForm from "@/app/components/EditUserForm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: { id: string };
}

// Loading component
function EditUserLoading() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 pt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header skeleton */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column skeleton */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="border-border/40">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-24" />
                    <Skeleton className="h-24" />
                  </div>
                  <Skeleton className="h-24" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-40 mb-4" />
                <Skeleton className="h-64 rounded-xl" />
              </CardContent>
            </Card>
          </div>

          {/* Right column skeleton */}
          <div className="space-y-6">
            <Card className="border-border/40">
              <CardContent className="p-6">
                <Skeleton className="h-32 w-32 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-3/4 mx-auto mb-2" />
                <Skeleton className="h-4 w-1/2 mx-auto" />
              </CardContent>
            </Card>

            <Card className="border-border/40">
              <CardContent className="p-6">
                <Skeleton className="h-8 w-32 mb-4" />
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full mb-3" />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Error component
function EditUserError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Failed to Load User</h2>
            <p className="text-muted-foreground mb-6">
              There was an error loading the user data. Please try again.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={onRetry} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default async function EditUserPage({ params }: PageProps) {
  const { id } = await params;

  async function getUserData() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${id}`,
        {
          cache: "no-store",
          next: { tags: [`user-${id}`] }, // Add cache tag for revalidation
        }
      );

      if (!res.ok) {
        if (res.status === 404) {
          return { user: null, error: "notFound" as const };
        }
        return { user: null, error: "fetchError" as const };
      }

      const data = await res.json();
      
      if (!data.user) {
        return { user: null, error: "notFound" as const };
      }

      const { _id, fullName, email, phone, imageUrl, imagePublicId } = data.user;

      return {
        user: {
          id: String(_id),
          fullName,
          email,
          phone,
          imageUrl,
          imagePublicId: imagePublicId || "",
        },
        error: null,
      };
    } catch (error) {
      
      return { user: null, error: "fetchError" as const };
    }
  }

  const { user, error } = await getUserData();

  // Handle different error states
  if (error === "notFound") {
    notFound();
  }

  if (error === "fetchError") {
    return <EditUserError onRetry={getUserData} />;
  }

  if (!user) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5">
      <Suspense fallback={<EditUserLoading />}>
        <EditUserForm initialUser={user} />
      </Suspense>
    </div>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${id}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const { user } = await res.json();
      return {
        title: `Edit ${user.fullName} - User Management`,
        description: `Edit user profile for ${user.fullName}`,
      };
    }
  } catch (error) {
    console.error("Error fetching user:", error);
  }

  return {
    title: "Edit User - User Management",
    description: "Edit user profile",
  };
}