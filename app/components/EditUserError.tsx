"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, ArrowLeft, Link, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export default function EditUserError() {
  const router = useRouter();
  const handleRetry = async () => {
    // Force a refresh of the page
    router.refresh();
  };
  return (
    <div className='min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center'>
      <div className='max-w-md w-full'>
        <Card className='border-border/40 bg-card/50 backdrop-blur-sm'>
          <CardContent className='p-8 text-center'>
            <div className='w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6'>
              <AlertCircle className='w-8 h-8 text-destructive' />
            </div>
            <h2 className='text-2xl font-bold mb-3'>Failed to Load User</h2>
            <p className='text-muted-foreground mb-6'>
              There was an error loading the user data. Please try again.
            </p>
            <div className='flex flex-col sm:flex-row gap-3 justify-center'>
              <Button onClick={handleRetry} className='gap-2'>
                <RefreshCw className='w-4 h-4' />
                Retry
              </Button>
              <Button variant='outline' asChild>
                <Link href='/dashboard'>
                  <ArrowLeft className='w-4 h-4 mr-2' />
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
