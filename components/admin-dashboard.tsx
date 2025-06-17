"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Plus, Trash2, Calendar, Users } from "lucide-react"

interface Menu {
  id: string
  fecha: string
  estado: "confirmado" | "a confirmar"
  platos: Array<{
    id: string
    tipo: "vegetariano" | "celiaco" | "general"
    nombre: string
    descripcion: string | null
  }>
}

export function AdminDashboard() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [menuEstado, setMenuEstado] = useState<"confirmado" | "a confirmar">("a confirmar")
  const [platos, setPlatos] = useState<
    Array<{
      tipo: "vegetariano" | "celiaco" | "general"
      nombre: string
      descripcion: string
    }>
  >([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadMenus()
    setSelectedDate(new Date().toISOString().split("T")[0])
  }, [])

  async function loadMenus() {
    try {
      const { data, error } = await supabase
        .from("menus")
        .select(`
          *,
          platos (*)
        `)
        .order("fecha", { ascending: false })

      if (error) throw error
      setMenus(data || [])
    } catch (error) {
      console.error("Error loading menus:", error)
    }
  }

  function addPlato() {
    if (platos.length >= 3) {
      alert("Solo se pueden agregar hasta 3 platos por día")
      return
    }

    setPlatos([...platos, { tipo: "general", nombre: "", descripcion: "" }])
  }

  function removePlato(index: number) {
    setPlatos(platos.filter((_, i) => i !== index))
  }

  function updatePlato(index: number, field: string, value: string) {
    const updated = [...platos]
    updated[index] = { ...updated[index], [field]: value }
    setPlatos(updated)
  }

  async function saveMenu() {
    if (!selectedDate || platos.length === 0) {
      alert("Selecciona una fecha y agrega al menos un plato")
      return
    }

    // Verificar que no haya tipos duplicados
    const tipos = platos.map((p) => p.tipo)
    const tiposUnicos = new Set(tipos)
    if (tipos.length !== tiposUnicos.size) {
      alert("No puede haber platos duplicados del mismo tipo")
      return
    }

    setLoading(true)
    try {
      // Crear o actualizar menú
      const { data: menuData, error: menuError } = await supabase
        .from("menus")
        .upsert({
          fecha: selectedDate,
          estado: menuEstado,
        })
        .select()
        .single()

      if (menuError) throw menuError

      // Eliminar platos existentes
      await supabase.from("platos").delete().eq("menu_id", menuData.id)

      // Insertar nuevos platos
      const platosToInsert = platos.map((plato) => ({
        menu_id: menuData.id,
        ...plato,
      }))

      const { error: platosError } = await supabase.from("platos").insert(platosToInsert)

      if (platosError) throw platosError

      alert("Menú guardado exitosamente")
      loadMenus()
      setPlatos([])
    } catch (error: any) {
      console.error("Error saving menu:", error)
      alert(error.message || "Error al guardar el menú")
    } finally {
      setLoading(false)
    }
  }

  async function deleteMenu(menuId: string) {
    if (!confirm("¿Estás seguro de que quieres eliminar este menú?")) return

    try {
      const { error } = await supabase.from("menus").delete().eq("id", menuId)

      if (error) throw error
      loadMenus()
    } catch (error) {
      console.error("Error deleting menu:", error)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Crear/Editar Menú</span>
          </CardTitle>
          <CardDescription>Administra el menú diario del comedor universitario</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input id="fecha" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado">Estado</Label>
              <Select value={menuEstado} onValueChange={(value: "confirmado" | "a confirmar") => setMenuEstado(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a confirmar">A Confirmar</SelectItem>
                  <SelectItem value="confirmado">Confirmado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Platos ({platos.length}/3)</h3>
              <Button
                onClick={addPlato}
                disabled={platos.length >= 3}
                size="sm"
                className="bg-unicen-dark-blue hover:bg-unicen-blue"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Plato
              </Button>
            </div>

            {platos.map((plato, index) => (
              <Card key={index} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Tipo</Label>
                    <Select value={plato.tipo} onValueChange={(value) => updatePlato(index, "tipo", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="vegetariano">Vegetariano</SelectItem>
                        <SelectItem value="celiaco">Celíaco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <Input
                      value={plato.nombre}
                      onChange={(e) => updatePlato(index, "nombre", e.target.value)}
                      placeholder="Nombre del plato"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <div className="flex space-x-2">
                      <Textarea
                        value={plato.descripcion}
                        onChange={(e) => updatePlato(index, "descripcion", e.target.value)}
                        placeholder="Descripción del plato"
                        className="flex-1"
                      />
                      <Button
                        onClick={() => removePlato(index)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button
            onClick={saveMenu}
            disabled={loading || platos.length === 0}
            className="w-full bg-unicen-dark-blue hover:bg-unicen-blue"
          >
            {loading ? "Guardando..." : "Guardar Menú"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Menús Existentes</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {menus.map((menu) => (
              <Card key={menu.id} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold">{new Date(menu.fecha).toLocaleDateString("es-AR")}</h3>
                    <Badge variant={menu.estado === "confirmado" ? "default" : "secondary"}>{menu.estado}</Badge>
                  </div>
                  <Button
                    onClick={() => deleteMenu(menu.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {menu.platos?.map((plato) => (
                    <div key={plato.id} className="text-sm text-gray-600">
                      <span className="font-medium">{plato.tipo}:</span> {plato.nombre}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
