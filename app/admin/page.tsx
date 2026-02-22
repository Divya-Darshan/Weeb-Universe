'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

const STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200'
}

export default function AdminDashboard() {
  const { user } = useUser()
  const [statusFilter, setStatusFilter] = useState('all')
  
  const ADMIN_EMAIL = 'darshanpec2@gmail.com'
  const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL

  const orders = useQuery(api.razor.orders.list) || []
  const updateStatus = useMutation(api.razor.orders.updateStatus)

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <div className="max-w-md bg-white rounded-2xl p-12 text-center shadow-xl border">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <ArrowLeftIcon className="w-10 h-10 text-gray-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Admin Access Required</h1>
          <p className="text-lg text-gray-600">Contact store owner for access</p>
        </div>
      </div>
    )
  }

  // Clean stats calculation
  const stats = {
    total: orders.length,
    pending: orders.filter(o => ['new', 'processing'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    // revenue: orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0)
  }

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  )

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatus({ id: id as any, status: newStatus as any })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Weeb Store Admin</h1>
          <p className="text-xl text-gray-600">Manage orders • Real-time updates</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Orders', value: stats.total, icon: '📦', color: 'blue' },
            { label: 'Pending', value: stats.pending, icon: '⏳', color: 'yellow' },
            { label: 'Completed', value: stats.completed, icon: '✅', color: 'green' },
            // { label: 'Revenue', value: `₹${stats.revenue.toLocaleString()}`, icon: '💰', color: 'purple' }
          ].map(({ label, value, icon, color }, i) => (
            <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
                </div>
                <div className={`w-12 h-12 bg-${color}-100 rounded-xl flex items-center justify-center text-${color}-600 text-lg font-bold`}>
                  {icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table Header */}
          <div className="px-8 py-6 border-b border-gray-100 bg-gray-50">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>
              {/* ✅ FIXED SELECT - DARK MODE COMPATIBLE */}
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 bg-white border-2 border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium w-full sm:w-48 text-gray-900"
              >
                <option value="all" className="bg-white text-gray-900">All Orders ({orders.length})</option>
                <option value="new" className="bg-white text-gray-900">New Orders</option>
                <option value="processing" className="bg-white text-gray-900">Processing</option>
                <option value="delivered" className="bg-white text-gray-900">Delivered</option>
                <option value="cancelled" className="bg-white text-gray-900">Cancelled</option>
              </select>
            </div>
          </div>

          {/* Table Content */}
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">Items</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono font-semibold text-sm text-indigo-600">
                      #{order.paymentId?.slice(-8) || 'N/A'}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">
                          {order.customer?.firstName} {order.customer?.lastName}
                        </p>
                        <p className="text-sm text-gray-500">{order.customer?.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {order.items?.slice(0, 2).map((item: any, i: number) => (
                          <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-700">
                            {item.name}
                          </span>
                        ))}
                        {order.items?.length > 2 && (
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded-md text-gray-500">
                            +{order.items.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <p className="text-2xl font-bold text-gray-900">
                        ₹{order.grandTotal?.toLocaleString('en-IN') || '0'}
                      </p>
                    </td>
                    {/* ✅ FIXED STATUS SELECT - DARK MODE SAFE */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="px-3 py-2 bg-white border-2 border-gray-200 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm font-medium w-40 text-gray-900"
                      >
                        <option value="new" className="bg-white text-gray-900">New</option>
                        <option value="processing" className="bg-white text-gray-900">Processing</option>
                        <option value="delivered" className="bg-white text-gray-900">Delivered</option>
                        <option value="cancelled" className="bg-white text-gray-900">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredOrders.length === 0 && (
            <div className="text-center py-16 bg-gray-50">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                📦
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting the filter above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
