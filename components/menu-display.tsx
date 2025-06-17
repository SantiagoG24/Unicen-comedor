"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { supabase } from "@/lib/supabase"
import { getCurrentUser, type UserData } from "@/lib/auth"
import { EditPlatoModal } from "./edit-plato-modal"
import { MenuStatusControl } from "./menu-status-control"
import { Leaf, Wheat, Utensils, Check, AlertCircle, LogIn, Edit, Plus } from "lucide-react"
import Link from "next/link"

interface Plato {
  id: string
  tipo: "vegetariano" | "celiaco" | "general"
  nombre: string
  descripcion: string | null
}

interface Menu {
  id: string
  fecha: string
  estado: "confirmado" | "a confirmar"
  platos: Plato[]
}

export function MenuDisplay() {
  const [menu, setMenu] = useState<Menu | null>(null)
  const [user, setUser] = useState<UserData | null>(null)
  const [reservas, setReservas] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [reserving, setReserving] = useState<string | null>(null)
  const [editingPlato, setEditingPlato] = useState<Plato | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Cargar menú del día
      const today = new Date().toISOString().split("T")[0]
      const { data: menuData, error: menuError } = await supabase
        .from("menus")
        .select(`
          *,
          platos (*)
        `)
        .eq("fecha", today)
        .single()

      if (menuError && menuError.code !== "PGRST116") {
        console.error("Error loading menu:", menuError)
      } else if (menuData) {
        setMenu(menuData)
      }

      // Cargar datos del usuario
      const userData = await getCurrentUser()
      setUser(userData)

      // Cargar reservas si hay usuario y no es admin
      if (userData && userData.rol !== "admin" && menuData) {
        const { data: reservasData, error: reservasError } = await supabase
          .from("reservas")
          .select("plato_id")
          .eq("user_id", userData.id)
          .eq("fecha", today)

        if (!reservasError && reservasData) {
          setReservas(reservasData.map((r) => r.plato_id))
        }
      }
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  async function handleReserva(platoId: string) {
    if (!user || user.rol === "admin") return

    setReserving(platoId)
    try {
      const today = new Date().toISOString().split("T")[0]

      if (reservas.includes(platoId)) {
        // Cancelar reserva
        const { error } = await supabase
          .from("reservas")
          .delete()
          .eq("user_id", user.id)
          .eq("plato_id", platoId)
          .eq("fecha", today)

        if (error) throw error
        setReservas((prev) => prev.filter((id) => id !== platoId))
      } else {
        // Hacer reserva
        if (reservas.length >= 2) {
          alert("Solo puedes reservar hasta 2 platos por día")
          return
        }

        const { error } = await supabase.from("reservas").insert({
          user_id: user.id,
          plato_id: platoId,
          fecha: today,
        })

        if (error) throw error
        setReservas((prev) => [...prev, platoId])
      }
    } catch (error: any) {
      console.error("Error with reservation:", error)
      alert(error.message || "Error al procesar la reserva")
    } finally {
      setReserving(null)
    }
  }

  async function addNewPlato() {
    if (!menu) return

    const tipos = menu.platos.map((p) => p.tipo)
    const tiposDisponibles = ["general", "vegetariano", "celiaco"].filter((tipo) => !tipos.includes(tipo as any))

    if (tiposDisponibles.length === 0) {
      alert("Ya existen los 3 tipos de platos para este menú")
      return
    }

    const tipoSeleccionado = tiposDisponibles[0] as "general" | "vegetariano" | "celiaco"

    try {
      const { data: newPlato, error } = await supabase
        .from("platos")
        .insert({
          menu_id: menu.id,
          tipo: tipoSeleccionado,
          nombre: `Nuevo plato ${tipoSeleccionado}`,
          descripcion: "Descripción del plato",
        })
        .select()
        .single()

      if (error) throw error

      // Recargar datos
      loadData()
    } catch (error: any) {
      console.error("Error adding plato:", error)
      alert(error.message || "Error al agregar el plato")
    }
  }

  function getIconForTipo(tipo: string) {
    switch (tipo) {
      case "vegetariano":
        return <Leaf className="w-5 h-5 text-green-600" />
      case "celiaco":
        return <Wheat className="w-5 h-5 text-amber-600" />
      default:
        return <Utensils className="w-5 h-5 text-blue-600" />
    }
  }

  function getBadgeForTipo(tipo: string) {
    switch (tipo) {
      case "vegetariano":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Vegetariano
          </Badge>
        )
      case "celiaco":
        return (
          <Badge variant="secondary" className="bg-amber-100 text-amber-800">
            Sin Gluten
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            General
          </Badge>
        )
    }
  }

  function canReserve(plato: Plato) {
    if (!user || user.rol === "admin") return false

    // Verificar restricciones dietéticas
    if (plato.tipo === "general" && (user.es_vegetariano || user.es_celiaco)) {
      return false
    }

    return true
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-unicen-dark-blue"></div>
      </div>
    )
  }

  if (!menu) {
    return (
      <div className="space-y-6">
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay menú disponible</h3>
            <p className="text-gray-500">El menú para hoy aún no ha sido publicado.</p>
            {user?.rol === "admin" && (
              <div className="mt-4">
                <Link href="/admin">
                  <Button className="bg-unicen-dark-blue hover:bg-unicen-blue">Crear Menú del Día</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-unicen-dark-blue">Menú del Día</CardTitle>
          <CardDescription>
            {new Date(menu.fecha).toLocaleDateString("es-AR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </CardDescription>
          <div className="flex justify-center">
            <Badge
              variant={menu.estado === "confirmado" ? "default" : "secondary"}
              className={menu.estado === "confirmado" ? "bg-green-600" : "bg-yellow-600"}
            >
              {menu.estado === "confirmado" ? "Confirmado" : "A Confirmar"}
            </Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Control de estado del menú para admins */}
      {user?.rol === "admin" && <MenuStatusControl menuId={menu.id} currentStatus={menu.estado} onUpdate={loadData} />}

      {!user && (
        <Alert>
          <LogIn className="h-4 w-4" />
          <AlertDescription>
            <Link href="/login" className="text-unicen-blue hover:underline font-medium">
              Inicia sesión
            </Link>{" "}
            para poder reservar platos del menú.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 max-w-2xl mx-auto">
        {menu.platos?.map((plato) => (
          <Card key={plato.id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getIconForTipo(plato.tipo)}
                    <h3 className="text-lg font-semibold">{plato.nombre}</h3>
                    {getBadgeForTipo(plato.tipo)}
                  </div>
                  {plato.descripcion && <p className="text-gray-600 mb-4">{plato.descripcion}</p>}

                  {user && user.rol !== "admin" && !canReserve(plato) && (
                    <div className="flex items-center space-x-2 text-amber-600 text-sm mb-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>No recomendado según tu perfil dietético</span>
                    </div>
                  )}
                </div>

                {/* Botones para usuarios normales */}
                {user && user.rol !== "admin" && (
                  <Button
                    onClick={() => handleReserva(plato.id)}
                    disabled={reserving === plato.id || (!canReserve(plato) && !reservas.includes(plato.id))}
                    variant={reservas.includes(plato.id) ? "default" : "outline"}
                    className={
                      reservas.includes(plato.id)
                        ? "bg-green-600 hover:bg-green-700"
                        : "border-unicen-blue text-unicen-blue hover:bg-unicen-blue hover:text-white"
                    }
                  >
                    {reserving === plato.id ? (
                      "Procesando..."
                    ) : reservas.includes(plato.id) ? (
                      <>
                        <Check className="w-4 h-4 mr-2" />
                        Reservado
                      </>
                    ) : (
                      "Reservar"
                    )}
                  </Button>
                )}

                {/* Botón para administradores */}
                {user?.rol === "admin" && (
                  <Button
                    onClick={() => setEditingPlato(plato)}
                    variant="outline"
                    className="border-unicen-blue text-unicen-blue hover:bg-unicen-blue hover:text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar Plato
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Botón para agregar nuevo plato (solo admins) */}
        {user?.rol === "admin" && menu.platos.length < 3 && (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="p-6 text-center">
              <Button
                onClick={addNewPlato}
                variant="outline"
                className="border-unicen-blue text-unicen-blue hover:bg-unicen-blue hover:text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Nuevo Plato
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Información de reservas para usuarios normales */}
      {user && user.rol !== "admin" && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">Reservas realizadas: {reservas.length}/2</p>
            {reservas.length === 2 && (
              <p className="text-xs text-amber-600 mt-1">Has alcanzado el límite de reservas diarias</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Información para administradores */}
      {user?.rol === "admin" && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardContent className="p-4 text-center">
            <p className="text-sm text-gray-600">
              Platos configurados: {menu.platos.length}/3 • Estado: {menu.estado}
            </p>
            <p className="text-xs text-blue-600 mt-1">Haz clic en "Editar Plato" para modificar los detalles</p>
          </CardContent>
        </Card>
      )}

      {/* Modal de edición de plato */}
      {editingPlato && (
        <EditPlatoModal
          plato={editingPlato}
          isOpen={!!editingPlato}
          onClose={() => setEditingPlato(null)}
          onUpdate={loadData}
        />
      )}
    </div>
  )
}
