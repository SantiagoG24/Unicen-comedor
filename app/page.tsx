import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Utensils, Users, Calendar, Shield } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="w-20 h-20 bg-unicen-dark-blue rounded-full flex items-center justify-center mx-auto mb-6">
          <Utensils className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-unicen-dark-blue mb-4">Comedor Universitario UNICEN</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Sistema de reservas online para el comedor de la Universidad Nacional del Centro de la Provincia de Buenos
          Aires - Sede Tandil
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/menu">
            <Button size="lg" className="bg-unicen-dark-blue hover:bg-unicen-blue">
              Ver Menú del Día
            </Button>
          </Link>
          <Link href="/login">
            <Button
              size="lg"
              variant="outline"
              className="border-unicen-dark-blue text-unicen-dark-blue hover:bg-unicen-dark-blue hover:text-white"
            >
              Iniciar Sesión
            </Button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="text-center">
          <CardHeader>
            <Calendar className="w-8 h-8 text-unicen-blue mx-auto mb-2" />
            <CardTitle className="text-lg">Reservas Diarias</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Reserva hasta 2 platos por día de forma simple y rápida</CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Utensils className="w-8 h-8 text-unicen-blue mx-auto mb-2" />
            <CardTitle className="text-lg">Opciones Variadas</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Menús adaptados para vegetarianos, celíacos y dieta general</CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Users className="w-8 h-8 text-unicen-blue mx-auto mb-2" />
            <CardTitle className="text-lg">Perfil Personalizado</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Configura tu perfil dietético para recomendaciones personalizadas</CardDescription>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
            <Shield className="w-8 h-8 text-unicen-blue mx-auto mb-2" />
            <CardTitle className="text-lg">Acceso Seguro</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>Autenticación con DNI para garantizar la seguridad del sistema</CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Information */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl text-unicen-dark-blue text-center">Información del Comedor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-unicen-dark-blue mb-2">Horarios de Atención</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Almuerzo: 12:00 - 14:30 hs</li>
                <li>• Cena: 19:30 - 21:30 hs</li>
                <li>• Lunes a Viernes</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-unicen-dark-blue mb-2">Ubicación</h3>
              <p className="text-gray-600">
                Campus Universitario UNICEN
                <br />
                Pinto 399, Tandil
                <br />
                Buenos Aires, Argentina
              </p>
            </div>
          </div>
          <div className="border-t pt-4">
            <h3 className="font-semibold text-unicen-dark-blue mb-2">Cómo Funciona</h3>
            <ol className="list-decimal list-inside space-y-1 text-gray-600">
              <li>Inicia sesión con tu DNI y nombre completo</li>
              <li>Revisa el menú del día disponible</li>
              <li>Selecciona hasta 2 platos que desees reservar</li>
              <li>Presenta tu DNI en el comedor para retirar tu pedido</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
