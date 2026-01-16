"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, RegisterFormData } from "@/lib/schemas";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  Camera,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  Shield,
  ArrowLeft,
  Save,
  Copy,
  Trash2,
  X,
  Key,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  imageUrl: string;
  imagePublicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface EditUserFormProps {
  initialUser: User;
}

/**
 * EditUserForm component for updating existing user profiles.
 * Allows updating personal info and profile pictures with real-time preview.
 *
 * @param initialUser - The user data to prepopulate the form with.
 */
export default function EditUserForm({ initialUser }: EditUserFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialUser.imageUrl
  );
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  /**
   * Cleanup effect for the preview URL to prevent memory leaks.
   */
  useEffect(() => {
    return () => {
      // Only revoke if it's a blob URL (newly uploaded image)
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: initialUser.fullName,
      email: initialUser.email,
      phone: initialUser.phone,
    },
    mode: "onChange",
  });

  /**
   * Syncs form state when initialUser prop changes.
   */
  useEffect(() => {
    reset({
      fullName: initialUser.fullName,
      email: initialUser.email,
      phone: initialUser.phone,
    });
    setPreviewUrl(initialUser.imageUrl);
    setImageFile(null);
  }, [initialUser, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  };

  /**
   * Processes the selected image file and generates a preview URL.
   */
  const handleImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, GIF)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size should be less than 5MB");
      return;
    }

    // Revoke old blob URL if it exists
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    // Simulate upload progress for UX feedback
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
   * Resets the image selection back to the original user image.
   */
  const removeImage = () => {
    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
    setImageFile(null);
    setPreviewUrl(initialUser.imageUrl);
    setUploadProgress(0);
  };

  /**
   * Copies text to clipboard and shows a temporary success message.
   */
  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard", {
        duration: 1500,
      });
    } catch (err) {
      setError("Failed to copy to clipboard");
    }
  };

  /**
   * Submits the updated user data to the API.
   */
  const onSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("fullName", data.fullName);
      formData.append("email", data.email);
      formData.append("phone", data.phone);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await fetch(`/api/users/${initialUser.id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message);
      }

      toast.success("User updated successfully");

      // Cleanup blob URL on success
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }

      setTimeout(() => {
        router.push("/dashboard");
        router.refresh();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Deletes the user after confirmation.
   */
  const handleDeleteUser = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/users/${initialUser.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: initialUser.imagePublicId
          ? JSON.stringify({ imagePublicId: initialUser.imagePublicId })
          : undefined,
      });

      if (!res.ok) {
        throw new Error("Failed to delete user");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const watchedValues = watch();

  return (
    <div className='min-h-screen bg-linear-to-br from-background via-background to-primary/5 py-8 px-4'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className='mb-8'
        >
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-4'>
              <Button
                variant='outline'
                size='icon'
                asChild
                className='rounded-full'
              >
                <Link href='/dashboard'>
                  <ArrowLeft className='w-5 h-5' />
                </Link>
              </Button>
              <div>
                <h1 className='text-3xl font-bold tracking-tight'>
                  Edit User Profile
                </h1>
                <p className='text-muted-foreground mt-1'>
                  Update user information and profile picture
                </p>
              </div>
            </div>

            <Badge variant='outline' className='px-3 py-1.5'>
              <Key className='w-3 h-3 mr-1' />
              ID: {initialUser.id.substring(0, 8)}...
            </Badge>
          </div>
        </motion.div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className='mb-6'
            >
              <Alert variant='destructive'>
                <AlertCircle className='h-4 w-4' />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}

        </AnimatePresence>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Left Column - Form */}
          <div className='lg:col-span-2 space-y-8'>
            <Card className='border-border/40 bg-card/50 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='w-5 h-5 text-primary' />
                  Personal Information
                </CardTitle>
                <CardDescription>
                  Update the user's basic information
                </CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-2'>
                      <Label
                        htmlFor='fullName'
                        className='flex items-center gap-2'
                      >
                        <User className='w-4 h-4' />
                        Full Name
                      </Label>
                      <Input
                        id='fullName'
                        {...register("fullName")}
                        placeholder='John Doe'
                        className={cn(
                          errors.fullName &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.fullName && (
                        <p className='text-sm text-destructive flex items-center gap-1'>
                          <AlertCircle className='w-4 h-4' />
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div className='space-y-2'>
                      <Label
                        htmlFor='email'
                        className='flex items-center gap-2'
                      >
                        <Mail className='w-4 h-4' />
                        Email Address
                      </Label>
                      <Input
                        id='email'
                        type='email'
                        {...register("email")}
                        placeholder='john@example.com'
                        className={cn(
                          errors.email &&
                            "border-destructive focus-visible:ring-destructive"
                        )}
                      />
                      {errors.email && (
                        <p className='text-sm text-destructive flex items-center gap-1'>
                          <AlertCircle className='w-4 h-4' />
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className='space-y-2'>
                    <Label htmlFor='phone' className='flex items-center gap-2'>
                      <Phone className='w-4 h-4' />
                      Phone Number
                    </Label>
                    <Input
                      id='phone'
                      {...register("phone")}
                      placeholder='+1 (555) 123-4567'
                      className={cn(
                        errors.phone &&
                          "border-destructive focus-visible:ring-destructive"
                      )}
                    />
                    {errors.phone && (
                      <p className='text-sm text-destructive flex items-center gap-1'>
                        <AlertCircle className='w-4 h-4' />
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className='flex items-center gap-2 pt-4'>
                    <Shield className='w-4 h-4 text-green-500' />
                    <span className='text-sm text-muted-foreground'>
                      All user data is encrypted and securely stored
                    </span>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Profile Picture Card */}
            <Card className='border-border/40 bg-card/50 backdrop-blur-sm'>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Camera className='w-5 h-5 text-primary' />
                  Profile Picture
                </CardTitle>
                <CardDescription>
                  Update the user's profile image
                </CardDescription>
              </CardHeader>

              <CardContent>
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
                    id='imageInput'
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    className='hidden'
                  />

                  <div className='p-8 text-center'>
                    {previewUrl ? (
                      <div className='space-y-4'>
                        <div className='relative inline-block'>
                          <Avatar className='w-32 h-32 border-4 border-background shadow-lg'>
                            <AvatarImage
                              src={previewUrl}
                              alt='Profile preview'
                            />
                            <AvatarFallback className='text-2xl'>
                              {watchedValues.fullName?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          {imageFile && (
                            <Button
                              type='button'
                              size='icon'
                              variant='destructive'
                              className='absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-lg'
                              onClick={(e) => {
                                e.stopPropagation();
                                removeImage();
                              }}
                            >
                              <X className='w-4 h-4' />
                            </Button>
                          )}
                        </div>
                        {uploadProgress > 0 && uploadProgress < 100 && (
                          <Progress
                            value={uploadProgress}
                            className='w-48 mx-auto'
                          />
                        )}
                        <p className='text-sm text-muted-foreground'>
                          Click or drag to change image
                        </p>
                      </div>
                    ) : (
                      <div>
                        <div className='w-20 h-20 bg-linear-to-br from-primary/10 to-primary/5 rounded-full flex items-center justify-center mx-auto mb-4'>
                          <Upload className='w-10 h-10 text-primary' />
                        </div>
                        <p className='font-medium mb-2'>Upload new photo</p>
                        <p className='text-sm text-muted-foreground mb-4'>
                          Drag & drop or click to browse
                        </p>
                        <p className='text-xs text-muted-foreground'>
                          JPG, PNG, GIF • Max 5MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className='space-y-6'>
            {/* Profile Preview Card */}
            <Card className='border-border/40 bg-card/50 backdrop-blur-sm'>
              <CardHeader className='pb-4'>
                <CardTitle className='text-lg'>Profile Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='text-center'>
                  <Avatar className='w-32 h-32 mx-auto border-4 border-background shadow-lg'>
                    <AvatarImage
                      src={previewUrl || "/default-avatar.png"}
                      alt='Profile'
                    />
                    <AvatarFallback className='text-3xl'>
                      {watchedValues.fullName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className='text-xl font-semibold mt-4'>
                    {watchedValues.fullName || "User Name"}
                  </h3>
                  <p className='text-muted-foreground text-sm mt-1'>
                    {watchedValues.email || "email@example.com"}
                  </p>

                  <div className='mt-6 space-y-3'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>Status</span>
                      <Badge
                        variant='outline'
                        className='bg-green-500/10 text-green-700 border-green-500/20'
                      >
                        <CheckCircle className='w-3 h-3 mr-1' />
                        Active
                      </Badge>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>
                        Last Updated
                      </span>
                      <span className='font-medium'>Just now</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card className='border-border/40 bg-card/50 backdrop-blur-sm'>
              <CardHeader className='pb-4'>
                <CardTitle className='text-lg'>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3'>
                  <Button
                    variant='outline'
                    className='w-full justify-start gap-3'
                    onClick={() => handleCopyToClipboard(initialUser.email)}
                  >
                    <Copy className='w-4 h-4' />
                    Copy Email
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full justify-start gap-3'
                    asChild
                  >
                    <a href={`mailto:${initialUser.email}`}>
                      <Mail className='w-4 h-4' />
                      Send Email
                    </a>
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full justify-start gap-3'
                    asChild
                  >
                    <a href={`tel:${initialUser.phone}`}>
                      <Phone className='w-4 h-4' />
                      Call User
                    </a>
                  </Button>
                  <Button
                    variant='outline'
                    className='w-full justify-start gap-3'
                    onClick={() => handleCopyToClipboard(initialUser.id)}
                  >
                    <Key className='w-4 h-4' />
                    Copy User ID
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions Card */}
            <Card className='border-border/40 bg-card/50 backdrop-blur-sm'>
              <CardContent className='p-6'>
                <div className='space-y-4'>
                  <div className='flex items-center gap-2'>
                    <CheckCircle
                      className={cn(
                        "w-5 h-5",
                        isDirty || imageFile
                          ? "text-green-500"
                          : "text-muted-foreground"
                      )}
                    />
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isDirty || imageFile
                          ? "text-green-700"
                          : "text-muted-foreground"
                      )}
                    >
                      {isDirty || imageFile ? "Unsaved changes" : "No changes"}
                    </span>
                  </div>

                  <div className='grid grid-cols-2 gap-3'>
                    <Button
                      type='submit'
                      onClick={handleSubmit(onSubmit)}
                      disabled={loading || (!isDirty && !imageFile)}
                      className='gap-2 shadow-sm'
                    >
                      {loading ? (
                        <>
                          <Loader2 className='w-4 h-4 animate-spin' />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className='w-4 h-4' />
                          Save Changes
                        </>
                      )}
                    </Button>

                    <Button
                      variant='outline'
                      onClick={() => router.back()}
                      disabled={loading}
                    >
                      Cancel
                    </Button>
                  </div>

                  <Separator />

                  <Dialog
                    open={showDeleteDialog}
                    onOpenChange={setShowDeleteDialog}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant='destructive'
                        className='w-full gap-2'
                        disabled={deleting}
                      >
                        {deleting ? (
                          <>
                            <Loader2 className='w-4 h-4 animate-spin' />
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className='w-4 h-4' />
                            Delete User
                          </>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle className='flex items-center gap-2 text-destructive'>
                          <AlertCircle className='w-5 h-5' />
                          Delete User
                        </DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete{" "}
                          <strong>{initialUser.fullName}</strong>? This action
                          cannot be undone. All user data will be permanently
                          removed.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant='outline'
                          onClick={() => setShowDeleteDialog(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant='destructive'
                          onClick={handleDeleteUser}
                          disabled={deleting}
                        >
                          {deleting ? (
                            <>
                              <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                              Deleting...
                            </>
                          ) : (
                            "Delete Permanently"
                          )}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
