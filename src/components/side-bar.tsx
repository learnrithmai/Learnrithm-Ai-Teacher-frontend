"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Compass, Home, Layout, Menu, LogOut, FileText } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Separator } from "./ui/separator"

export default function Sidebar() {
  const pathname = usePathname()

  // Navigation items with their paths and icons
  const navItems = [
    { href: "/pricing", label: "Pricing", icon: Home },
    { href: "/dashboard", label: "Dashboard", icon: Layout },
    { href: "/profile", label: "Profile", icon: Compass },
  ]

  // Function to check if a path is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const handleSignOut = () => {
    // In a real app, this would handle the sign out logic
    console.log("Signing out...")
    // Redirect to login page or home page after sign out
  }

  return (
    <div>
      {/* Mobile Navigation */}
      <div className="md:hidden fixed top-0 left-0 right-0 p-3 bg-background border-b z-50 shadow-sm">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icon.svg" alt="Learnrithm AI Logo" width={32} height={32} className="rounded-md" />
            <span className="font-semibold text-lg">Learnrithm</span>
          </Link>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0 sm:max-w-xs">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="flex items-center gap-2">
                  <Link href="/" className="flex items-center gap-2">
                    <Image src="/icon.svg" alt="Learnrithm AI Logo" width={32} height={32} className="rounded-md" />
                    <span className="font-semibold text-lg">Learnrithm</span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant="ghost"
                        className={cn(
                          "w-full justify-start gap-2 px-3 py-2 h-auto hover:text-gray-900 hover:bg-gray-100/80 transition-colors",
                          active
                            ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-medium border-l-2 border-blue-600"
                            : "text-gray-600",
                        )}
                      >
                        <Icon className="h-5 w-5" /> {item.label}
                      </Button>
                    </Link>
                  )
                })}

                <Link href="/policies">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 px-3 py-2 h-auto hover:text-gray-900 hover:bg-gray-100/80 transition-colors",
                      isActive("/policies")
                        ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-medium border-l-2 border-blue-600"
                        : "text-gray-600",
                    )}
                  >
                    <FileText className="h-5 w-5" /> Policies & Terms
                  </Button>
                </Link>
              </nav>

              <div className="p-4 mt-auto border-t">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 px-3 py-2 h-auto text-red-600 hover:text-red-700 hover:bg-red-50/80 transition-colors"
                  onClick={handleSignOut}
                >
                  <LogOut className="h-5 w-5" /> Sign Out
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-card p-4 border-r hidden md:flex md:flex-col shadow-sm">
        <div className="flex items-center gap-2 mb-8 px-2">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image src="/icon.svg" alt="Learnrithm AI Logo" width={32} height={32} className="rounded-md" />
            <span className="font-semibold text-xl">Learnrithm</span>
          </Link>
        </div>

        <nav className="space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 px-3 py-2 h-auto hover:text-gray-900 hover:bg-gray-100/80 transition-colors",
                    active
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-medium border-l-2 border-blue-600"
                      : "text-gray-600",
                  )}
                >
                  <Icon className="h-5 w-5" /> {item.label}
                </Button>
              </Link>
            )
          })}

          <Link href="/policies">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 px-3 py-2 h-auto hover:text-gray-900 hover:bg-gray-100/80 transition-colors",
                isActive("/policies")
                  ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 font-medium border-l-2 border-blue-600"
                  : "text-gray-600",
              )}
            >
              <FileText className="h-5 w-5" /> Policies & Terms
            </Button>
          </Link>
        </nav>

        <div className="mt-auto pt-4">
          <Separator className="mb-4" />
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 px-3 py-2 h-auto text-red-600 hover:text-red-700 hover:bg-red-50/80 transition-colors"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" /> Sign Out
          </Button>
        </div>
      </aside>
    </div>
  )
}

