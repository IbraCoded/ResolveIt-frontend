"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { authService } from "@/services/auth"
import { Menu, Gavel, User, LogOut, Settings, Shield, HelpCircle } from "lucide-react"
import { NotificationCenter, useNotifications } from "@/components/notifications"

export function Navbar() {
  const [user, setUser] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { notifications, markAsRead, markAllAsRead, dismissNotification } = useNotifications()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    setUser(currentUser)
  }, [pathname])

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    router.push("/")
  }

  const isActive = (path) => pathname === path

  const NavLinks = ({ mobile = false, onItemClick = () => {} }) => (
    <>
      {!user ? (
        <>
          <Button
            variant={isActive("/login") ? "default" : "ghost"}
            asChild
            className={mobile ? "w-full justify-start" : ""}
            onClick={onItemClick}
          >
            <Link href="/login">Sign In</Link>
          </Button>
          <Button
            variant={isActive("/register") ? "default" : "outline"}
            asChild
            className={mobile ? "w-full justify-start" : ""}
            onClick={onItemClick}
          >
            <Link href="/register">Register</Link>
          </Button>
        </>
      ) : (
        <>
          {user.role === "admin" ? (
            <Button
              variant={isActive("/admin") ? "default" : "ghost"}
              asChild
              className={mobile ? "w-full justify-start" : ""}
              onClick={onItemClick}
            >
              <Link href="/admin">
                <Shield className="w-4 h-4 mr-2" />
                Admin Dashboard
              </Link>
            </Button>
          ) : (
            <Button
              variant={isActive("/dashboard") ? "default" : "ghost"}
              asChild
              className={mobile ? "w-full justify-start" : ""}
              onClick={onItemClick}
            >
              <Link href="/dashboard">
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          )}

          <Button
            variant={isActive("/help") ? "default" : "ghost"}
            asChild
            className={mobile ? "w-full justify-start" : ""}
            onClick={onItemClick}
          >
            <Link href="/help">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help
            </Link>
          </Button>

          {!mobile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={user.role === "admin" ? "/admin" : "/dashboard"}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {mobile && (
            <Button
              variant="ghost"
              onClick={() => {
                handleLogout()
                onItemClick()
              }}
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          )}
        </>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Gavel className="h-6 w-6 text-blue-600" />
          <span className="font-bold text-xl">ResolveIt</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="hidden md:flex items-center space-x-2">
            <NavLinks />
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onDismiss={dismissNotification}
            />
          </nav>

          <ThemeToggle />

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-4">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                  <Gavel className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-xl">ResolveIt</span>
                </Link>
                <nav className="flex flex-col space-y-2">
                  <NavLinks mobile onItemClick={() => setIsOpen(false)} />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
