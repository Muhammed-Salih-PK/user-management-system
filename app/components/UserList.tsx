"use client";

import {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useDeferredValue,
  memo,
} from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Calendar,
  TrendingUp,
  Clock,
  Search,
  User,
  Mail,
  Phone,
  Copy,
  Edit,
  Trash2,
  AlertCircle,
  UserPlus,
  RefreshCw,
  Grid,
  List,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DeleteConfirmDialog } from "./DeleteConfirmDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  imageUrl: string;
  imagePublicId?: string;
  createdAt: string;
}

interface UserListProps {
  searchTerm?: string;
}

/**
 * StatCard component to display a single metric with an icon and gradient background.
 */
const StatCard = memo(
  ({
    value,
    label,
    icon: Icon,
    gradient,
  }: {
    value: string;
    label: string;
    icon: React.ComponentType<any>;
    gradient: string;
  }) => (
    <Card className={cn("border-0 text-white overflow-hidden", gradient)}>
      <CardContent className='p-2 px-5'>
        <div className='flex items-center justify-between'>
          <div>
            <div className='text-3xl font-bold'>{value}</div>
            <div className='text-sm opacity-90 mt-1'>{label}</div>
          </div>
          <div className='w-12 h-12 rounded-full bg-white/20 flex items-center justify-center'>
            <Icon className='w-6 h-6' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
);

StatCard.displayName = "StatCard";

/**
 * GridViewCard component to display user information in a card-based grid layout.
 */
const GridViewCard = memo(
  ({
    user,
    onEdit,
    onDelete,
    onCopyEmail,
  }: {
    user: User;
    onEdit: (id: string) => void;
    onDelete: (id: string, publicId?: string) => void;
    deletingId: string | null;
    onCopyEmail: (email: string) => void;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <Card className='group border-border/40 hover:border-primary/30 transition-all duration-300 overflow-hidden h-full'>
        {/* Header with Image */}
        <div className='relative h-48 bg-linear-to-br from-primary/5 to-primary/10'>
          <Avatar className='absolute inset-0 w-full h-full rounded-none'>
            <AvatarImage
              src={user.imageUrl}
              alt={user.fullName}
              className='object-cover'
            />
            <AvatarFallback className='text-4xl'>
              {user.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* Date Badge */}
          <Badge
            variant='secondary'
            className='absolute top-4 right-4 bg-background/90 backdrop-blur-sm'
          >
            <Calendar className='w-3 h-3 mr-1' />
            {new Date(user.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </Badge>
        </div>

        <CardContent className='p-6'>
          {/* Name and Actions */}
          <div className='flex items-start justify-between mb-4'>
            <div>
              <CardTitle className='text-xl mb-1 line-clamp-1'>
                {user.fullName}
              </CardTitle>
              <CardDescription className='flex items-center gap-1 text-sm'>
                <User className='w-3 h-3' />
                ID: {user._id.slice(-6)}
              </CardDescription>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='icon' variant='ghost' className='h-8 w-8'>
                  <MoreVertical className='w-4 h-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem onClick={() => onEdit(user._id)}>
                  <Edit className='w-4 h-4 mr-2' />
                  Edit User
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onCopyEmail(user.email)}>
                  <Copy className='w-4 h-4 mr-2' />
                  Copy Email
                </DropdownMenuItem>
                <Separator />
                <DropdownMenuItem
                  onClick={() => onDelete(user._id, user.imagePublicId)}
                  className='text-destructive focus:text-destructive'
                >
                  <Trash2 className='w-4 h-4 mr-2' />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Contact Info */}
          <div className='space-y-3 mb-6'>
            <div className='flex items-center gap-3 text-sm'>
              <Mail className='w-4 h-4 text-muted-foreground shrink-0' />
              <a
                href={`mailto:${user.email}`}
                className='text-muted-foreground hover:text-primary transition-colors line-clamp-1'
                title={user.email}
              >
                {user.email}
              </a>
            </div>
            <div className='flex items-center gap-3 text-sm'>
              <Phone className='w-4 h-4 text-muted-foreground shrink-0' />
              <a
                href={`tel:${user.phone}`}
                className='text-muted-foreground hover:text-primary transition-colors'
              >
                {user.phone}
              </a>
            </div>
          </div>

          {/* Quick Actions */}
          <CardFooter className='p-0'>
            <div className='flex gap-2 w-full'>
              <Button
                variant='outline'
                size='sm'
                className='flex-1'
                onClick={() => onEdit(user._id)}
              >
                <Edit className='w-4 h-4 mr-2' />
                Edit
              </Button>
              <Button variant='outline' size='sm' className='flex-1' asChild>
                <a href={`mailto:${user.email}`}>
                  <Mail className='w-4 h-4 mr-2' />
                  Email
                </a>
              </Button>
            </div>
          </CardFooter>
        </CardContent>
      </Card>
    </motion.div>
  )
);

GridViewCard.displayName = "GridViewCard";

/**
 * ListViewCard component to display user information in a row-based list layout.
 */
const ListViewCard = memo(
  ({
    user,
    onEdit,
    onDelete,
    deletingId,
    onCopyEmail,
  }: {
    user: User;
    onEdit: (id: string) => void;
    onDelete: (id: string, publicId?: string) => void;
    deletingId: string | null;
    onCopyEmail: (email: string) => void;
  }) => (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
      <Card className='border-border/40 hover:border-primary/30 transition-all duration-300'>
        <CardContent className='p-4'>
          <div className='flex items-center gap-4'>
            {/* Avatar */}
            <Avatar className='h-16 w-16 border-2 border-background'>
              <AvatarImage
                src={user.imageUrl}
                alt={user.fullName}
                className='object-cover'
              />
              <AvatarFallback className='text-lg'>
                {user.fullName.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* User Info */}
            <div className='flex-1 min-w-0'>
              <div className='flex items-start justify-between'>
                <div className='min-w-0'>
                  <CardTitle className='text-lg mb-1 truncate'>
                    {user.fullName}
                  </CardTitle>
                  <CardDescription className='flex items-center gap-2 text-sm truncate'>
                    <Mail className='w-3 h-3 flexshrink-0' />
                    <span className='truncate'>{user.email}</span>
                  </CardDescription>
                </div>
                <Badge
                  variant='outline'
                  className='ml-2 shrink-0 hidden md:block '
                >
                  <div className='flex items-center gap-1'>
                    <Calendar className='w-3 h-3 mr-1' />
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </Badge>
              </div>

              <div className='flex items-center gap-4 mt-3 text-sm text-muted-foreground'>
                <div className='flex items-center gap-2'>
                  <Phone className='w-3 h-3' />
                  <span>{user.phone}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <User className='w-3 h-3' />
                  <span>ID: {user._id.slice(-6)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className='flex items-center gap-2'>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => onEdit(user._id)}
                className='h-8 w-8'
              >
                <Edit className='w-4 h-4' />
              </Button>
              <Button
                size='icon'
                variant='ghost'
                onClick={() => onCopyEmail(user.email)}
                className='h-8 w-8 hidden md:block'
              >
                <div className='flex items-center justify-center'>
                  <Copy className='w-4 h-4' />
                </div>
              </Button>
              <div className='hidden md:block'>
                <DeleteConfirmDialog
                  loading={deletingId === user._id}
                  onConfirm={() => onDelete(user._id, user.imagePublicId)}
                >
                  <Button
                    size='icon'
                    variant='ghost'
                    className='h-8 w-8 text-destructive hover:text-destructive'
                  >
                    <Trash2 className='w-4 h-4' />
                  </Button>
                </DeleteConfirmDialog>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size='icon' variant='ghost' className='h-8 w-8'>
                    <MoreVertical className='w-4 h-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    onClick={() =>
                      window.open(`mailto:${user.email}`, "_blank")
                    }
                  >
                    <Mail className='w-4 h-4 mr-2' />
                    Send Email
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => window.open(`tel:${user.phone}`, "_blank")}
                  >
                    <Phone className='w-4 h-4 mr-2' />
                    Call User
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem
                    onClick={() => onDelete(user._id, user.imagePublicId)}
                    className='text-destructive focus:text-destructive'
                  >
                    <Trash2 className='w-4 h-4 mr-2' />
                    Delete User
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
);

ListViewCard.displayName = "ListViewCard";

export default function UserList({ searchTerm = "" }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  const deferredSearchTerm = useDeferredValue(searchTerm);

  /**
   * Fetches all users from the API.
   * Uses no-store to ensure data is always fresh.
   */
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users", {
        cache: "no-store",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Failed to fetch users: ${res.status}`);
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /**
   * Memoized filtered users based on the deferred search term.
   * Optimized for performance to avoid filtering on every keystroke.
   */
  const filteredUsers = useMemo(() => {
    if (!deferredSearchTerm.trim()) return users;
    const term = deferredSearchTerm.toLowerCase().trim();
    return users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phone.toLowerCase().includes(term)
    );
  }, [users, deferredSearchTerm]);

  /**
   * Handles user deletion from both the state and the database.
   */
  const handleDelete = useCallback(
    async (userId: string, imagePublicId?: string) => {
      setDeletingId(userId);
      try {
        // Optimistic update
        setUsers((prev) => prev.filter((user) => user._id !== userId));
        const res = await fetch(`/api/users/${userId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: imagePublicId ? JSON.stringify({ imagePublicId }) : undefined,
        });
        if (!res.ok) throw new Error("Failed to delete user");
      } catch (err: any) {
        setError(err.message);
        fetchUsers(); // Rollback on error
      } finally {
        setDeletingId(null);
      }
    },
    [fetchUsers]
  );

  /**
   * Navigation to the edit user page.
   */
  const handleEdit = useCallback(
    (userId: string) => {
      router.push(`/dashboard/edit-user/${userId}`);
    },
    [router]
  );

  /**
   * Copies user email to clipboard.
   */
  const handleCopyEmail = useCallback(async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      toast.success("Email Copied");
    } catch (err) {
      toast.error("Failed to copy:");
    }
  }, []);

  /**
   * Memoized statistics for users registered recently.
   */
  const stats = useMemo(() => {
    const now = Date.now();
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneDayAgo = now - 24 * 60 * 60 * 1000;

    return {
      recent: users.filter((u) => new Date(u.createdAt).getTime() > oneWeekAgo)
        .length,
      today: users.filter((u) => new Date(u.createdAt).getTime() > oneDayAgo)
        .length,
    };
  }, [users]);

  // Loading State
  if (loading) {
    return (
      <div className='space-y-8'>
        {/* Stats Skeletons */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {[...Array(4)].map((_, i) => (
            <Card key={i} className='border-border/40'>
              <CardContent className='p-6'>
                <Skeleton className='h-8 w-16 mb-2' />
                <Skeleton className='h-4 w-24' />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* User Cards Skeletons */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <Card key={i} className='border-border/40'>
              <Skeleton className='h-48 w-full rounded-t-lg' />
              <CardContent className='p-6 space-y-4'>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-full' />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <Card className='border-destructive/20 bg-destructive/5'>
        <CardContent className='p-8 text-center'>
          <div className='w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4'>
            <AlertCircle className='w-8 h-8 text-destructive' />
          </div>
          <CardTitle className='mb-2'>Error Loading Users</CardTitle>
          <CardDescription className='mb-6'>{error}</CardDescription>
          <div className='flex gap-3 justify-center'>
            <Button onClick={fetchUsers}>
              <RefreshCw className='w-4 h-4 mr-2' />
              Retry
            </Button>
            <Button variant='outline' onClick={() => router.push("/register")}>
              <UserPlus className='w-4 h-4 mr-2' />
              Add User
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Empty State
  if (users.length === 0) {
    return (
      <Card className='border-border/40 bg-linear-to-br from-primary/5 to-primary/10'>
        <CardContent className='p-12 text-center'>
          <div className='w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6'>
            <Users className='w-12 h-12 text-primary' />
          </div>
          <CardTitle className='text-2xl mb-3'>No Users Found</CardTitle>
          <CardDescription className='mb-6 max-w-md mx-auto'>
            Start building your user database by adding your first registered
            user
          </CardDescription>
          <Button size='lg' onClick={() => router.push("/register")}>
            <UserPlus className='w-5 h-5 mr-2' />
            Add First User
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='space-y-8'>
      {/* Header with Stats and View Toggle */}
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        {/* Stats Overview */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 flex-1'>
          <StatCard
            value={users.length.toString()}
            label='Total Users'
            icon={Users}
            gradient='bg-gradient-to-br from-primary to-primary/80'
          />
          <StatCard
            value={stats.recent.toString()}
            label='This Week'
            icon={TrendingUp}
            gradient='bg-gradient-to-br from-emerald-500 to-emerald-600'
          />
          <StatCard
            value={stats.today.toString()}
            label='Today'
            icon={Clock}
            gradient='bg-gradient-to-br from-violet-500 to-violet-600'
          />
          <StatCard
            value={filteredUsers.length.toString()}
            label='Showing'
            icon={Search}
            gradient='bg-gradient-to-br from-amber-500 to-amber-600'
          />
        </div>

        {/* View Toggle */}
        <div className='flex items-center gap-2'>
          <span className='text-sm text-muted-foreground'>View:</span>
          <div className='flex bg-muted rounded-lg p-1'>
            <Button
              size='sm'
              variant={viewMode === "grid" ? "default" : "ghost"}
              onClick={() => setViewMode("grid")}
              className='h-8 px-3'
            >
              <Grid className='w-4 h-4 mr-2' />
              Grid
            </Button>
            <Button
              size='sm'
              variant={viewMode === "list" ? "default" : "ghost"}
              onClick={() => setViewMode("list")}
              className='h-8 px-3'
            >
              <List className='w-4 h-4 mr-2' />
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Search Results */}
      <AnimatePresence>
        {deferredSearchTerm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Alert className='border-primary/20 bg-primary/5'>
              <Search className='h-4 w-4' />
              <AlertTitle>
                Found {filteredUsers.length} user
                {filteredUsers.length !== 1 ? "s" : ""}
              </AlertTitle>
              <AlertDescription>
                Matching "{deferredSearchTerm}"
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Grid/List */}
      {viewMode === "grid" ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          <AnimatePresence mode='wait'>
            {filteredUsers.map((user) => (
              <GridViewCard
                key={user._id}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
                onCopyEmail={handleCopyEmail}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className='space-y-3'>
          <AnimatePresence mode='wait'>
            {filteredUsers.map((user) => (
              <ListViewCard
                key={user._id}
                user={user}
                onEdit={handleEdit}
                onDelete={handleDelete}
                deletingId={deletingId}
                onCopyEmail={handleCopyEmail}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Empty Search Results */}
      <AnimatePresence>
        {deferredSearchTerm && filteredUsers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className='text-center py-12'
          >
            <Card className='max-w-md mx-auto border-border/40'>
              <CardContent className='p-8'>
                <div className='w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6'>
                  <Search className='w-8 h-8 text-muted-foreground' />
                </div>
                <CardTitle className='mb-2'>No users found</CardTitle>
                <CardDescription className='mb-6'>
                  Try adjusting your search terms
                </CardDescription>
                <div className='flex gap-3 justify-center'>
                  <Button
                    onClick={() =>
                      setViewMode(viewMode === "grid" ? "list" : "grid")
                    }
                  >
                    Switch to {viewMode === "grid" ? "List" : "Grid"} View
                  </Button>
                  <Button
                    variant='outline'
                    onClick={() => router.push("/register")}
                  >
                    <UserPlus className='w-4 h-4 mr-2' />
                    Add New User
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
