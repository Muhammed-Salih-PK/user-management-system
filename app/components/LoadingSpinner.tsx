"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "default" | "primary" | "destructive";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  color = "default",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };

  const colorClasses = {
    default: "text-muted-foreground",
    primary: "text-primary",
    destructive: "text-destructive",
  };

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <Loader2
        className={cn(sizeClasses[size], colorClasses[color], "animate-spin")}
      />
    </div>
  );
}
