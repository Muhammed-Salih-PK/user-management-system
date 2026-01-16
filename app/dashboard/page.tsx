"use client";

import { useState, useCallback, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";;
import { 
  Users, 
  Search, 
  X, 
  Plus, 
  LogOut, 
  Download, 
  Upload, 
  RefreshCw,
  BarChart3,
  Shield,
  Filter
} from "lucide-react";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

const UserList = dynamic(() => import("@/app/components/UserList"), {
  loading: () => (
    <div className="space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  ),
  ssr: false,
});

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function DashboardPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/session`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Logout failed");
      router.push("/register");
      router.refresh();
    } catch (error) {
      toast.error("An error occurred while logging out.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  }, []);

  const clearSearch = useCallback(() => setSearchTerm(""), []);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-primary/5 pt-20 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-linear-to-br from-primary to-primary/80 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
                    User Management
                  </h1>
                  <Badge variant="secondary" className="mt-2">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin Dashboard
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground text-sm lg:text-base max-w-2xl">
                Manage and organize your registered users efficiently with real-time updates and advanced search capabilities
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="lg"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              
              <Button asChild size="lg" className="gap-2 shadow-sm">
                <Link href="/register">
                  <Plus className="w-5 h-5" />
                  New User
                </Link>
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform z-10 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search users by name, email, or phone..."
                value={searchTerm}
                onChange={handleSearch}
                className="pl-12 pr-12 py-3.5 h-14 text-base rounded-xl border-border/40 bg-background/50 backdrop-blur-sm"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="mb-12">
          <Suspense fallback={<Skeleton className="h-96 w-full rounded-xl" />}>
            <UserList searchTerm={debouncedSearchTerm} />
          </Suspense>
        </main>

        {/* Admin Actions */}
        <motion.footer
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 pt-8 border-t border-border/40"
        >
          <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Admin Actions
              </CardTitle>
              <CardDescription>
                Manage your user database with these advanced tools
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Users
                </Button>
                <Button variant="outline" className="gap-2">
                  <Upload className="w-4 h-4" />
                  Import Users
                </Button>
                <Button variant="outline" className="gap-2">
                  <Filter className="w-4 h-4" />
                  Advanced Filter
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleLogout}
                  disabled={loading}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  {loading ? "Logging out..." : "Logout"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.footer>
      </div>
    </div>
  );
}