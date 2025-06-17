"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { signOut, getCurrentUser, type UserData } from "@/lib/auth"
import { LogOut, Menu, X, User } from "lucide-react"

export function Navbar() {
  const [user, setUser] = useState<UserData | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadUser()

    // Escuchar cambios en localStorage
    const handleStorageChange = () => {
      loadUser()
    }

    window.addEventListener("storage", handleStorageChange)
    window.addEventListener("focus", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("focus", handleStorageChange)
    }
  }, [])

  async function loadUser() {
    try {
      const userData = await getCurrentUser()
      setUser(userData)
    } catch (error) {
      console.error("Error loading user:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  async function handleSignOut() {
    try {
      await signOut()
      setUser(null)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <nav className="bg-unicen-dark-blue text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-unicen-light-blue rounded-full flex items-center justify-center">
                <span className="text-unicen-dark-blue font-bold text-sm">U</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg">Comedor UNICEN</span>
                <span className="text-xs text-blue-200 hidden sm:block">Universidad Nacional del Centro</span>
              </div>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/" className="hover:text-unicen-light-blue transition-colors">
              Inicio
            </Link>
            <Link href="/menu" className="hover:text-unicen-light-blue transition-colors">
              Menú del Día
            </Link>
            {user?.rol === "admin" && (
              <Link href="/admin" className="hover:text-unicen-light-blue transition-colors">
                Administración
              </Link>
            )}

            {loading ? (
              <div className="w-8 h-8 animate-pulse bg-unicen-blue rounded-full"></div>
            ) : user ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span className="text-sm">{user.nombre}</span>
                  {user.rol === "admin" && (
                    <span className="text-xs bg-unicen-light-blue text-unicen-dark-blue px-2 py-1 rounded">Admin</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-white hover:text-unicen-light-blue hover:bg-unicen-blue"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white hover:text-unicen-dark-blue"
                >
                  Iniciar Sesión
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-unicen-blue">
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="hover:text-unicen-light-blue transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Inicio
              </Link>
              <Link
                href="/menu"
                className="hover:text-unicen-light-blue transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Menú del Día
              </Link>
              {user?.rol === "admin" && (
                <Link
                  href="/admin"
                  className="hover:text-unicen-light-blue transition-colors py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Administración
                </Link>
              )}

              {user ? (
                <div className="flex flex-col space-y-2 pt-2 border-t border-unicen-blue">
                  <div className="flex items-center space-x-2 py-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm">{user.nombre}</span>
                    {user.rol === "admin" && (
                      <span className="text-xs bg-unicen-light-blue text-unicen-dark-blue px-2 py-1 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSignOut}
                    className="text-white hover:text-unicen-light-blue hover:bg-unicen-blue justify-start"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              ) : (
                <Link href="/login" className="pt-2 border-t border-unicen-blue">
                  <Button
                    variant="outline"
                    className="border-white text-white hover:bg-white hover:text-unicen-dark-blue w-full"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Iniciar Sesión
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
