import EditUserForm from "@/app/components/EditUserForm";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import EditUserError from "@/app/components/EditUserError";
import { cookies } from "next/headers";

interface PageProps {
  params: { id: string };
}

// Loading component
function EditUserLoading() {
  return (
    <div className='min-h-screen bg-linear-to-br from-background via-background to-primary/5 pt-20'>
      <div className='max-w-6xl mx-auto px-4 py-8'>
        {/* Header skeleton */}
        <div className='mb-8'>
          <div className='flex items-center gap-4 mb-6'>
            <Skeleton className='h-10 w-10 rounded-full' />
            <div>
              <Skeleton className='h-8 w-48 mb-2' />
              <Skeleton className='h-4 w-64' />
            </div>
          </div>
          <Skeleton className='h-4 w-32' />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left column skeleton */}
          <div className='lg:col-span-2 space-y-8'>
            <Card className='border-border/40'>
              <CardContent className='p-6'>
                <Skeleton className='h-6 w-40 mb-4' />
                <div className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <Skeleton className='h-24' />
                    <Skeleton className='h-24' />
                  </div>
                  <Skeleton className='h-24' />
                </div>
              </CardContent>
            </Card>

            <Card className='border-border/40'>
              <CardContent className='p-6'>
                <Skeleton className='h-6 w-40 mb-4' />
                <Skeleton className='h-64 rounded-xl' />
              </CardContent>
            </Card>
          </div>

          {/* Right column skeleton */}
          <div className='space-y-6'>
            <Card className='border-border/40'>
              <CardContent className='p-6'>
                <Skeleton className='h-32 w-32 rounded-full mx-auto mb-4' />
                <Skeleton className='h-6 w-3/4 mx-auto mb-2' />
                <Skeleton className='h-4 w-1/2 mx-auto' />
              </CardContent>
            </Card>

            <Card className='border-border/40'>
              <CardContent className='p-6'>
                <Skeleton className='h-8 w-32 mb-4' />
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className='h-10 w-full mb-3' />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function EditUserPage({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  async function getUserData() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${id}`,
        {
          headers: {
            cookie: cookieStore.toString(),
          },
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

      const { _id, fullName, email, phone, imageUrl, imagePublicId } =
        data.user;

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
    return <EditUserError />;
  }

  if (!user) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-linear-to-br from-background via-background to-primary/5'>
      <Suspense fallback={<EditUserLoading />}>
        <EditUserForm initialUser={user} />
      </Suspense>
    </div>
  );
}

// Generate metadata for the page
export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const cookieStore = await cookies();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/users/${id}`,
      {
        headers: {
          cookie: cookieStore.toString(),
        },
        cache: "no-store",
      }
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
