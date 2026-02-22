'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function AdminDashboard() {
  const { user } = useUser()
  const [statusFilter, setStatusFilter] = useState('all')
  
  const ADMIN_EMAIL = 'darshanpec2@gmail.com'
  const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL

  // 🔥 REAL CONVEX DATA
  const orders = useQuery(api.razor.orders.list) || []
  const updateStatus = useMutation(api.razor.orders.updateStatus)

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto bg-white/10 backdrop-blur-xl rounded-3xl p-12 text-center border border-white/20 shadow-2xl">
          <div className="w-24 h-24 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <ArrowLeftIcon className="w-12 h-12 text-red-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-6">
            🔒 Admin Only
          </h1>
          <p className="text-xl text-gray-300 mb-8">Contact store owner for access</p>
        </div>
      </div>
    )
  }

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'new' || o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'delivered').length,
    todayRevenue: orders
      .filter(o => {
        const orderDate = new Date(o._creationTime)
        const today = new Date()
        return orderDate.toDateString() === today.toDateString()
      })
      .reduce((sum, o) => sum + o.grandTotal, 0)
  }

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  )

  const handleStatusChange = (id: any, newStatus: string) => {
    updateStatus({ id, status: newStatus as any })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
              Weeb Store Admin
            </h1>
            <p className="text-xl text-gray-600 mt-2">Manage orders • Real-time updates</p>
          </div>
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3 bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-all font-semibold text-sm"
          >
            <option value="all">All Orders ({orders.length})</option>
            <option value="new">🆕 New ({stats.pending})</option>
            <option value="processing">⚙️ Processing</option>
            <option value="delivered">✅ Delivered</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 group-hover:text-indigo-600 transition-colors">Total Orders</p>
                <p className="text-4xl font-black text-gray-900 mt-2">{stats.total}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                📦
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 group-hover:text-orange-500 transition-colors">Pending Orders</p>
                <p className="text-4xl font-black text-orange-500 mt-2">{stats.pending}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                ⏳
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 group-hover:text-green-600 transition-colors">Delivered</p>
                <p className="text-4xl font-black text-green-600 mt-2">{stats.shipped}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                ✅
              </div>
            </div>
          </div>

          <div className="group bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 group-hover:text-purple-600 transition-colors">Today's Revenue</p>
                <p className="text-4xl font-black text-purple-900 mt-2">₹{stats.todayRevenue.toLocaleString()}</p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all">
                💰
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table WITH STATUS CHANGER */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          <div className="p-8 border-b border-gray-100">
            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              Recent Orders 
              <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                {filteredOrders.length}
              </span>
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-100">
                  <th className="px-8 py-6 text-left text-lg font-bold text-gray-900">Order</th>
                  <th className="px-6 py-6 text-left text-lg font-bold text-gray-900 hidden md:table-cell">Customer</th>
                  <th className="px-6 py-6 text-left text-lg font-bold text-gray-900 hidden lg:table-cell">Items</th>
                  <th className="px-6 py-6 text-right text-lg font-bold text-gray-900">Total</th>
                  <th className="px-6 py-6 text-left text-lg font-bold text-gray-900 w-56">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order: any) => (
                  <tr key={order._id} className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-6 font-mono font-semibold text-indigo-600">
                      #{order.paymentId.slice(-8)}
                    </td>
                    <td className="px-6 py-6 hidden md:table-cell">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {order.customer.firstName} {order.customer.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{order.customer.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6 hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {order.items.slice(0, 2).map((item: any, i: number) => (
                          <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700">
                            {item.name}
                          </span>
                        ))}
                        {order.items.length > 2 && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <p className="text-2xl font-black text-gray-900">₹{order.grandTotal.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-6">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-semibold w-full"
                      >
                        <option value="new">🆕 New</option>
                        <option value="processing">⚙️ Processing</option>
                        <option value="delivered">✅ Delivered</option>
                        <option value="cancelled">❌ Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-24">
              <div className="w-24 h-24 bg-gray-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                📦
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try changing the filter above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
