"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { LoadingSpinner } from "./LoadingSpinner";

interface DeleteConfirmDialogProps {
  onConfirm: () => void;
  loading?: boolean;
  children: React.ReactNode;
}

export function DeleteConfirmDialog({
  onConfirm,
  loading,
  children,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent className='rounded-2xl'>
        <AlertDialogHeader>
          <AlertDialogTitle className='text-red-600'>
            Delete User
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the user
            and remove their data from the system.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className='bg-red-600 hover:bg-red-700 text-white'
            disabled={loading}
          >
            {loading ? <LoadingSpinner size='sm' color='default' /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
