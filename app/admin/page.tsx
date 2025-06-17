import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-unicen-dark-blue">Panel de Administración</h1>
        <p className="text-gray-600">Gestiona los menús del comedor universitario</p>
      </div>
      <AdminDashboard />
    </div>
  )
}
