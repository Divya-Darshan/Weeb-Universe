'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'

export default function AdminDashboard() {
  const { user } = useUser()
  const [statusFilter, setStatusFilter] = useState('all')
  
  const ADMIN_EMAIL = 'darshanpec2@gmail.com'
  const isAdmin = user?.emailAddresses[0]?.emailAddress === ADMIN_EMAIL

  const orders = useQuery(api.razor.orders.list) || []
  const updateStatus = useMutation(api.razor.orders.updateStatus)

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-red-500 p-8 text-center text-white">
            <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Admin Access Required</h1>
          </div>
          <div className="p-8 text-center">
            <p className="text-gray-600 mb-6">Please contact store administrator for access.</p>
          </div>
        </div>
      </div>
    )
  }

  // Clean professional stats
  const stats = {
    total: orders.length,
    newOrders: orders.filter(o => o.status === 'new').length,
    processing: orders.filter(o => o.status === 'processing').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.reduce((sum, o) => sum + (o.grandTotal || 0), 0)
  }

  const filteredOrders = orders.filter(order => 
    statusFilter === 'all' || order.status === statusFilter
  )

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'new': return 'bg-blue-anyxt-blue-800 border-blue-200'
      case 'processing': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'delivered': return 'bg-green-100 text-green-800 border-green-200'
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleStatusChange = (id: string, newStatus: string) => {
    updateStatus({ id: id as any, status: newStatus as any })
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Order Management</h1>
              <p className="mt-2 text-lg text-gray-600">
                {stats.total} total orders • ₹{stats.revenue.toLocaleString()} revenue
              </p>
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white font-medium"
            >
              <option value="all">All Orders ({orders.length})</option>
              <option value="new">New Orders ({stats.newOrders})</option>
              <option value="processing">Processing ({stats.processing})</option>
              <option value="delivered">Delivered ({stats.delivered})</option>
            </select>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Orders</h3>
            <p className="mt-2 text-3xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">New Orders</h3>
            <p className="mt-2 text-3xl font-bold text-blue-600">{stats.newOrders}</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Processing</h3>
            <p className="mt-2 text-3xl font-bold text-orange-600">{stats.processing}</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Delivered</h3>
            <p className="mt-2 text-3xl font-bold text-green-600">{stats.delivered}</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">Total Revenue</h3>
            <p className="mt-2 text-3xl font-bold text-indigo-600">₹{stats.revenue.toLocaleString()}</p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Orders ({filteredOrders.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider hidden lg:table-cell">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider hidden xl:table-cell">Items</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider w-48">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono font-semibold text-indigo-600">
                        #{order.paymentId.slice(-8)}
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <div className="text-sm font-medium text-gray-900">
                        {order.customer.firstName} {order.customer.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{order.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 hidden xl:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {order.items.slice(0, 3).map((item: any, i: number) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
                            {item.name}
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                            +{order.items.length - 3} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-lg font-bold text-gray-900">
                        ₹{order.grandTotal?.toLocaleString() || '0'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(order.status || 'new')}`}>
                        {order.status?.toUpperCase() || 'NEW'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={order.status || 'new'}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                      >
                        <option value="new">New</option>
                        <option value="processing">Processing</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
            <div className="text-center py-12 bg-gray-50">
              <div className="w-16 h-16 bg-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500">Try adjusting the filter above</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
