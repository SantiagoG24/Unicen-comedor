"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"
import { Settings, Loader2 } from "lucide-react"

interface MenuStatusControlProps {
  menuId: string
  currentStatus: "confirmado" | "a confirmar"
  onUpdate: () => void
}

export function MenuStatusControl({ menuId, currentStatus, onUpdate }: MenuStatusControlProps) {
  const [status, setStatus] = useState(currentStatus)
  const [loading, setLoading] = useState(false)

  async function handleStatusChange() {
    if (status === currentStatus) return

    setLoading(true)
    try {
      const { error } = await supabase.from("menus").update({ estado: status }).eq("id", menuId)

      if (error) throw error

      onUpdate()
    } catch (error: any) {
      console.error("Error updating menu status:", error)
      alert(error.message || "Error al actualizar el estado del menú")
      setStatus(currentStatus) // Revertir cambio
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-unicen-dark-blue">
          <Settings className="w-5 h-5" />
          <span>Control de Menú (Admin)</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-2 block">Estado del Menú:</label>
            <Select value={status} onValueChange={(value: "confirmado" | "a confirmar") => setStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="a confirmar">A Confirmar</SelectItem>
                <SelectItem value="confirmado">Confirmado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleStatusChange}
            disabled={loading || status === currentStatus}
            className="bg-unicen-dark-blue hover:bg-unicen-blue"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Actualizar Estado
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
