"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  Menu,
  Home,
  UserPlus,
  LayoutDashboard,
  Users,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

/**
 * Interface representing a navigation item in the Navbar.
 */
interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  description: string;
}

/**
 * Static navigation items configuration.
 * Moved outside the component to prevent recreation on every render.
 */
const NAV_ITEMS: NavItem[] = [
  {
    path: "/",
    label: "Home",
    icon: Home,
    description: "Welcome page",
  },
  {
    path: "/register",
    label: "Register",
    icon: UserPlus,
    description: "Add new user",
  },
  {
    path: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    description: "Manage users",
  },
];

/**
 * Navbar component providing navigation links, branding, and mobile menu functionality.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /**
   * Effect to handle scroll-to-top on route changes.
   * Ensures the user starts at the top of the new page.
   */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  /**
   * Determines if a given path is currently active.
   * Wrapped in useCallback to maintain stable reference.
   * 
   * @param path - The path to check against the current pathname.
   * @returns boolean indicating if the path is active.
   */
  const isActive = useCallback(
    (path: string) => {
      if (path === "/") return pathname === "/";
      return pathname.startsWith(path);
    },
    [pathname]
  );

  return (
    <>
      <nav className='fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60'>
        <div className='container mx-auto px-4'>
          <div className='flex h-16 items-center justify-between'>
            {/* Logo */}
            <div className='flex items-center gap-2'>
              <Link href='/' className='flex items-center gap-3 group'>
                <div className='relative'>
                  <div className='w-9 h-9 rounded-xl bg-linear-to-br from-primary to-primary/80 shadow-lg flex items-center justify-center group-hover:scale-105 transition-transform'>
                    <Users className='w-5 h-5 text-primary-foreground' />
                  </div>
                </div>
                <div className='flex flex-col'>
                  <span className='font-bold text-xl tracking-tight bg-linear-to-r from-foreground to-foreground/80 bg-clip-text text-transparent'>
                    UserFlow
                  </span>
                  <span className='text-xs text-muted-foreground -mt-1'>
                    Management System
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className='hidden md:flex items-center gap-6'>
              <div className='flex items-center gap-1 bg-muted/50 rounded-full p-1.5'>
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={cn(
                        "relative px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2",
                        active
                          ? "bg-background shadow-sm text-primary"
                          : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-transform",
                          active ? "scale-110" : ""
                        )}
                      />
                      <span>{item.label}</span>
                      {active && (
                        <div className='absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-1 rounded-full bg-primary animate-pulse' />
                      )}
                    </Link>
                  );
                })}
              </div>

              <Separator orientation='vertical' className='h-6' />

              {/* Quick Actions */}
              <div className='flex items-center gap-2'>
                <Button
                  asChild
                  variant='outline'
                  size='sm'
                  className='h-9 gap-2 hover:bg-primary/5 hover:text-primary border-border/40'
                >
                  <Link href='/dashboard'>
                    <LayoutDashboard className='w-4 h-4' />
                    Quick View
                  </Link>
                </Button>
                <Button
                  asChild
                  size='sm'
                  className='h-9 gap-2 shadow-sm hover:shadow'
                >
                  <Link href='/register'>
                    <UserPlus className='w-4 h-4' />
                    New User
                  </Link>
                </Button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant='ghost'
                  size='icon'
                  className='md:hidden'
                  aria-label='Toggle menu'
                >
                  <Menu className='h-5 w-5' />
                </Button>
              </SheetTrigger>
              <SheetContent side='right' className='w-75 sm:w-87.5'>
                <SheetHeader className='mb-6'>
                  <SheetTitle className='text-left flex items-center gap-2'>
                    <div className='w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center'>
                      <Users className='w-5 h-5 text-primary' />
                    </div>
                    <div className='flex flex-col'>
                      <span className='font-bold'>UserFlow</span>
                      <span className='text-xs text-muted-foreground font-normal'>
                        Management System
                      </span>
                    </div>
                  </SheetTitle>
                </SheetHeader>

                <div className='space-y-1'>
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors group",
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <div className='flex items-center gap-3'>
                          <div
                            className={cn(
                              "w-8 h-8 rounded-lg flex items-center justify-center",
                              active
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            )}
                          >
                            <Icon className='w-4 h-4' />
                          </div>
                          <div className='flex flex-col'>
                            <span className='font-medium'>{item.label}</span>
                            <span className='text-xs text-muted-foreground'>
                              {item.description}
                            </span>
                          </div>
                        </div>
                        <ChevronRight
                          className={cn(
                            "w-4 h-4 transition-transform",
                            active
                              ? "text-primary"
                              : "text-muted-foreground"
                          )}
                        />
                      </Link>
                    );
                  })}
                </div>

                <Separator className='my-6' />

                {/* Mobile Quick Actions */}
                <div className='space-y-3 px-5'>
                  <h3 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2'>
                    Quick Actions
                  </h3>
                  <div className='space-y-2'>
                    <Button
                      asChild
                      variant='outline'
                      className='w-full justify-start gap-3 h-11'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href='/dashboard'>
                        <LayoutDashboard className='w-4 h-4' />
                        View Dashboard
                      </Link>
                    </Button>
                    <Button
                      asChild
                      className='w-full justify-start gap-3 h-11 shadow-sm'
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link href='/register'>
                        <UserPlus className='w-4 h-4' />
                        Register New User
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className='mt-8 p-4 rounded-lg bg-muted/50'>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='text-center'>
                      <div className='text-lg font-bold text-primary'>24/7</div>
                      <div className='text-xs text-muted-foreground'>
                        Support
                      </div>
                    </div>
                    <div className='text-center'>
                      <div className='text-lg font-bold text-primary'>
                        99.9%
                      </div>
                      <div className='text-xs text-muted-foreground'>
                        Uptime
                      </div>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Active Indicator */}
        <div className='absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-primary/30 to-transparent opacity-50' />
      </nav>

      {/* Spacer */}
      <div className='h-16' />
    </>
  );
}
