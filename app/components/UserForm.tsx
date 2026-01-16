"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Mail, 
  Phone, 
  Upload, 
  Camera, 
  CheckCircle, 
  AlertCircle, 
  Loader2, 
  Shield,
  Sparkles,
  ArrowRight,
  X,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/**
 * UserForm component for registering new users.
 * Handles input validation, image uploads (simulated progress), and API submission.
 */
export default function UserForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();

  /**
   * Cleanup preview URL to prevent memory leaks when the component unmounts
   * or when a new image is selected.
   */
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
  });

  /**
   * Handles file selection from the input.
   */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  /**
   * Validates and processes the selected image file.
   * Also simulates an upload progress for better UX.
   */
  const handleImageFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    // Revoke old URL if it exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 50);

    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageFile(file);
    }
  };

  /**
   * Removes the currently selected image and cleans up the preview URL.
   */
  const removeImage = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
  };

  /**
   * Submits the form data to the registration API.
   * Sends data as Multipart Form Data to include the image file.
   */
  const onSubmit = async (data: RegisterFormData) => {
    if (!imageFile) {
      setError("Profile picture is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);
      formData.append("image", imageFile);

      const userRes = await fetch("/api/users", {
        method: "POST",
        body: formData,
      });

      if (!userRes.ok) {
        const errorData = await userRes.json();
        throw new Error(errorData.message || "Registration failed");
      }

      setSuccess(true);
      reset();
      
      // Cleanup preview URL
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(null);
      setImageFile(null);

      // Redirect to dashboard after a short delay to show success state
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 2000);
    } catch (err: any) {
      toast.error("An error occurred while creating the account.");
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const watchedValues = watch();

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-primary to-primary/80 rounded-2xl shadow-lg mb-6">
            <UserPlus className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">
            Join Our{" "}
            <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Community
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto">
            Create your account and start managing users with our powerful platform
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardHeader className="pb-6">
              <CardTitle className="text-2xl flex items-center gap-2">
                <User className="w-6 h-6 text-primary" />
                User Registration
              </CardTitle>
              <CardDescription>
                Fill in your details to create a new user account
              </CardDescription>
            </CardHeader>

            <CardContent className="pb-6">
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-6"
                  >
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Personal Information */}
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <h3 className="font-semibold text-lg">Personal Information</h3>
                    <Badge variant="outline" className="ml-2">
                      Required
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        {...register("fullName")}
                        placeholder="John Doe"
                        className={cn(
                          errors.fullName && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="john@example.com"
                        className={cn(
                          errors.email && "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      placeholder="+1 (555) 123-4567"
                      className={cn(
                        errors.phone && "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive flex items-center gap-1">
                        <AlertCircle className="w-4 h-4" />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Profile Picture */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <h3 className="font-semibold text-lg">Profile Picture</h3>
                    </div>
                    {imageFile && (
                      <Badge variant="secondary">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Uploaded
                      </Badge>
                    )}
                  </div>

                  <div
                    className={cn(
                      "border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer",
                      dragOver
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50",
                      previewUrl && "border-solid"
                    )}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById("imageInput")?.click()}
                  >
                    <input
                      id="imageInput"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />

                    <div className="p-6 text-center">
                      {previewUrl ? (
                        <div className="space-y-4">
                          <div className="relative inline-block">
                            <Avatar className="w-32 h-32 border-4 border-background shadow-lg">
                              <AvatarImage src={previewUrl} alt="Profile preview" />
                              <AvatarFallback className="text-lg">
                                {watchedValues.fullName?.charAt(0) || "U"}
                              </AvatarFallback>
                            </Avatar>
                            <Button
                              type="button"
                              size="icon"
                              variant="destructive"
                              className="absolute -top-2 -right-2 h-8 w-8 rounded-full"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                              }}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                          {uploadProgress > 0 && uploadProgress < 100 && (
                            <Progress value={uploadProgress} className="w-32 mx-auto" />
                          )}
                          <p className="text-sm text-muted-foreground">
                            Click or drag to change image
                          </p>
                        </div>
                      ) : (
                        <div>
                          <div className="w-20 h-20 bg-linear-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Camera className="w-10 h-10 text-primary" />
                          </div>
                          <p className="font-medium mb-2">Upload your photo</p>
                          <p className="text-sm text-muted-foreground mb-4">
                            Drag & drop or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG, GIF • Max 5MB
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Form Status */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-500" />
                      <span className="text-muted-foreground">Your data is secured</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isValid && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <span className={cn(
                        "font-medium",
                        isValid ? "text-green-600" : "text-muted-foreground"
                      )}>
                        {isValid ? "All requirements met" : "Fill all required fields"}
                      </span>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading || success || !isValid || !imageFile}
                    className="w-full h-12 text-base shadow-lg hover:shadow-xl transition-all"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>

            <CardFooter className="bg-muted/30 border-t pt-6">
              <div className="w-full text-center text-sm text-muted-foreground">
                By registering, you agree to our{" "}
                <Button variant="link" className="p-0 h-auto font-semibold">
                  Terms of Service
                </Button>{" "}
                and{" "}
                <Button variant="link" className="p-0 h-auto font-semibold">
                  Privacy Policy
                </Button>
              </div>
            </CardFooter>
          </Card>
        </motion.div>

        {/* Success Modal */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-md w-full"
              >
                <Card className="border-0 shadow-2xl">
                  <CardContent className="p-8 text-center">
                    <div className="w-20 h-20 bg-linear-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold mb-3">Account Created!</h3>
                    <p className="text-muted-foreground mb-6">
                      Your account has been successfully created. Redirecting to dashboard...
                    </p>
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full">
                      <Loader2 className="w-6 h-6 text-primary animate-spin" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}