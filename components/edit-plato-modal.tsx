"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

interface Plato {
  id: string
  tipo: "vegetariano" | "celiaco" | "general"
  nombre: string
  descripcion: string | null
}

interface EditPlatoModalProps {
  plato: Plato
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function EditPlatoModal({ plato, isOpen, onClose, onUpdate }: EditPlatoModalProps) {
  const [nombre, setNombre] = useState(plato.nombre)
  const [descripcion, setDescripcion] = useState(plato.descripcion || "")
  const [tipo, setTipo] = useState(plato.tipo)
  const [loading, setLoading] = useState(false)

  async function handleSave() {
    if (!nombre.trim()) {
      alert("El nombre del plato es obligatorio")
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from("platos")
        .update({
          nombre: nombre.trim(),
          descripcion: descripcion.trim() || null,
          tipo,
        })
        .eq("id", plato.id)

      if (error) throw error

      onUpdate()
      onClose()
    } catch (error: any) {
      console.error("Error updating plato:", error)
      alert(error.message || "Error al actualizar el plato")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm("¿Estás seguro de que quieres eliminar este plato?")) return

    setLoading(true)
    try {
      const { error } = await supabase.from("platos").delete().eq("id", plato.id)

      if (error) throw error

      onUpdate()
      onClose()
    } catch (error: any) {
      console.error("Error deleting plato:", error)
      alert(error.message || "Error al eliminar el plato")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar Plato</DialogTitle>
          <DialogDescription>Modifica los detalles del plato o elimínalo del menú.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="tipo">Tipo de Plato</Label>
            <Select value={tipo} onValueChange={(value: "vegetariano" | "celiaco" | "general") => setTipo(value)}>
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
            <Label htmlFor="nombre">Nombre del Plato</Label>
            <Input
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Nombre del plato"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Textarea
              id="descripcion"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Descripción del plato"
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Eliminar Plato
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={loading} className="bg-unicen-dark-blue hover:bg-unicen-blue">
              {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Guardar Cambios
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
