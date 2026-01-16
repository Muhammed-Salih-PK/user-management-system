"use client";

import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
    // Reset the error boundary state
    
  }, [error]);

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 flex items-center justify-center">
      <div className="max-w-md w-full">
        <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Something went wrong!</h2>
            <p className="text-muted-foreground mb-4">
              { "Failed to load user data"}
            </p>
            {error.digest && (
              <p className="text-xs text-muted-foreground mb-6">
                Error ID: {error.digest}
              </p>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset} className="gap-2">
                <RefreshCw className="w-4 h-4" />
                Try Again
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