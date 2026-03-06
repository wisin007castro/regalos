import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminRegalosList from '@/components/AdminRegalosList'
import LogoutButton from '@/components/LogoutButton'

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-pink-600">
            Panel de Administracion
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Sesion iniciada como <span className="font-semibold text-purple-600">{session.user?.name}</span>
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="bg-white rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-purple-600">
          Gestion de Regalos
        </h2>
        <AdminRegalosList />
      </div>
    </div>
  )
}
