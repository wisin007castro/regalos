import { auth } from '@/auth'
import { redirect } from 'next/navigation'
import AdminRegalosList from '@/components/AdminRegalosList'
import AdminOpcionesList from '@/components/AdminOpcionesList'
import AdminFotosList from '@/components/AdminFotosList'

export default async function AdminPage() {
  const session = await auth()

  if (!session) {
    redirect('/admin/login')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Panel de Administracion</h1>

      <div className="space-y-6">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-6 text-slate-200">Gestion de Regalos</h2>
          <AdminRegalosList />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-1 text-slate-200">Opciones de Pago</h2>
          <p className="text-sm text-slate-500 mb-5">QR e enlaces de pago por opcion de torta</p>
          <AdminOpcionesList />
        </div>

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-lg font-bold mb-1 text-slate-200">Galeria de Fotos</h2>
          <p className="text-sm text-slate-500 mb-5">Sube y administra las fotos del cumpleanos</p>
          <AdminFotosList />
        </div>
      </div>
    </div>
  )
}
