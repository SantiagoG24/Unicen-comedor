"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signInWithDNI } from "@/lib/auth"
import { AlertCircle, Loader2, CheckCircle } from "lucide-react"

export function LoginForm() {
  const [dni, setDni] = useState("")
  const [nombre, setNombre] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)

    // Validaciones
    const dniTrimmed = dni.trim()
    const nombreTrimmed = nombre.trim()

    if (!dniTrimmed || !nombreTrimmed) {
      setError("Por favor completa todos los campos")
      setLoading(false)
      return
    }

    if (dniTrimmed.length < 7 || dniTrimmed.length > 8 || !/^\d+$/.test(dniTrimmed)) {
      setError("El DNI debe tener entre 7 y 8 dígitos numéricos")
      setLoading(false)
      return
    }

    if (nombreTrimmed.length < 2) {
      setError("El nombre debe tener al menos 2 caracteres")
      setLoading(false)
      return
    }

    try {
      console.log("Iniciando proceso de login...")

      const result = await signInWithDNI(dniTrimmed, nombreTrimmed)

      if (result.success && result.user) {
        console.log("Login exitoso")
        setSuccess(true)

        // Esperar un momento para mostrar el mensaje de éxito
        setTimeout(() => {
          router.push("/menu")
          // Recargar la página para actualizar el navbar
          setTimeout(() => {
            window.location.reload()
          }, 100)
        }, 1000)
      }
    } catch (error: any) {
      console.error("Error en login:", error)

      let errorMessage = "Error al iniciar sesión"

      if (error.message) {
        errorMessage = error.message
      }

      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-green-800 mb-2">¡Login exitoso!</h3>
          <p className="text-gray-600">Redirigiendo al menú...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-unicen-dark-blue">Iniciar Sesión</CardTitle>
        <CardDescription>Ingresa tu DNI y nombre completo para acceder al sistema del comedor</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dni">DNI</Label>
            <Input
              id="dni"
              type="text"
              placeholder="12345678"
              value={dni}
              onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))}
              required
              maxLength={8}
              className="focus:border-unicen-blue focus:ring-unicen-blue text-center text-lg"
            />
            <p className="text-xs text-gray-500">Solo números, sin puntos ni espacios</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nombre">Nombre Completo</Label>
            <Input
              id="nombre"
              type="text"
              placeholder="Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="focus:border-unicen-blue focus:ring-unicen-blue"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full bg-unicen-dark-blue hover:bg-unicen-blue" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Iniciando sesión...
              </>
            ) : (
              "Iniciar Sesión"
            )}
          </Button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">Usuarios de prueba:</h4>
          <div className="space-y-1 text-xs text-blue-800">
            <div>
              <strong>Admin:</strong> DNI 12345678, Nombre "Administrador UNICEN"
            </div>
            <div>
              <strong>Usuario:</strong> DNI 87654321, Nombre "Juan Pérez"
            </div>
          </div>
          <p className="text-xs text-blue-700 mt-2">Si es tu primera vez, se creará automáticamente tu cuenta</p>
        </div>
      </CardContent>
    </Card>
  )
}
