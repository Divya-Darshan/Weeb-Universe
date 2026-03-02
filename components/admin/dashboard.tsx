'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useState, useEffect } from 'react'
import { Id } from '@/convex/_generated/dataModel'

type OrderStatus = 'new_order' | 'pending' | 'delivered'

const OrdersDashboard = () => {
  // Fetch all orders
  const fetchedOrders = useQuery(api.orders.getAllOrders)
  const updateStatus = useMutation(api.orders.updateOrderStatus)
  const [localOrders, setLocalOrders] = useState<any[]>([])

  // Only sync orders once when data is loaded
  useEffect(() => {
    if (fetchedOrders !== undefined && fetchedOrders !== null) {
      setLocalOrders(fetchedOrders)
    }
  }, [fetchedOrders])

  const handleStatusChange = async (orderId: Id<'orders'>, newStatus: OrderStatus) => {
    try {
      await updateStatus({
        orderId,
        newStatus
      })
      // Update local state
      setLocalOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      )
    } catch (error) {
      console.error('Failed to update order status:', error)
    }
  }

  // Group orders by status
  const ordersByStatus = {
    new_order: localOrders.filter((o) => o.orderStatus === 'new_order'),
    pending: localOrders.filter((o) => o.orderStatus === 'pending'),
    delivered: localOrders.filter((o) => o.orderStatus === 'delivered')
  }

  const OrderCard = ({ order }: { order: any }) => (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 p-6 mb-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <p className="font-semibold text-gray-900 text-lg">{order.customerName}</p>
          <p className="text-sm text-gray-500 mt-1">{order.customerEmail}</p>
        </div>
        <p className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-800 bg-clip-text text-transparent">
          ₹{order.totalAmount?.toLocaleString('en-IN')}
        </p>
      </div>

      {/* Products */}
      <div className="mb-6">
        <p className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">Products</p>
        <div className="bg-gray-50/50 rounded-xl p-4 border border-gray-100">
          {order.products.map((product: any, index: number) => (
            <div key={index} className="text-sm text-gray-700 flex justify-between items-center mb-2 last:mb-0">
              <span className="font-medium">{product.name}</span>
              <span className="flex items-center gap-2">
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full">x{product.quantity}</span>
                <span className="font-semibold">₹{product.price.toLocaleString('en-IN')}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Order ID and Date */}
      <div className="grid grid-cols-2 gap-4 mb-6 text-sm text-gray-500">
        <div>
          <p className="font-semibold text-gray-700 mb-1">Order ID</p>
          <p className="font-mono bg-gray-100 px-3 py-1 rounded-lg text-xs">{order.razorpayOrderId}</p>
        </div>
        <div>
          <p className="font-semibold text-gray-700 mb-1">Phone</p>
          <p className="font-mono">{order.customerPhone}</p>
        </div>
        <div className="col-span-2">
          <p className="font-semibold text-gray-700 mb-1">Ordered</p>
          <p className="text-gray-500">
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-gray-100">
        {order.orderStatus === 'new_order' && (
          <button
            onClick={() => handleStatusChange(order._id, 'pending')}
            className="flex-1 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white py-3 px-4 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border border-amber-400/30 backdrop-blur-sm"
          >
            → Move to Pending
          </button>
        )}
        {order.orderStatus === 'pending' && (
          <button
            onClick={() => handleStatusChange(order._id, 'delivered')}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3 px-4 rounded-xl text-sm font-semibold shadow-lg hover:shadow-xl transition-all duration-200 border border-emerald-400/30 backdrop-blur-sm"
          >
            → Mark Delivered
          </button>
        )}
        {order.orderStatus === 'delivered' && (
          <div className="flex-1 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 py-3 px-4 rounded-xl text-sm font-semibold text-center shadow-inner border border-emerald-200/50 backdrop-blur-sm">
            ✓ Order Completed
          </div>
        )}
      </div>
    </div>
  )

  const Column = ({
    title,
    status,
    count,
    color
  }: {
    title: string
    status: OrderStatus
    count: number
    color: string
  }) => {
    const colorClasses = {
      blue: 'from-blue-50 to-indigo-50 border-blue-100 text-blue-900',
      yellow: 'from-amber-50 to-yellow-50 border-amber-100 text-amber-900',
      green: 'from-emerald-50 to-teal-50 border-emerald-100 text-emerald-900'
    }

    return (
      <div className={`flex-1 bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} rounded-2xl p-6 shadow-sm border border-opacity-50 shadow-lg backdrop-blur-sm`}>
       
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            {title}
          </h2>
          <span className={`bg-gradient-to-r ${color === 'blue' ? 'from-blue-500 to-indigo-600' : 
                                      color === 'yellow' ? 'from-amber-500 to-yellow-600' : 
                                      'from-emerald-500 to-teal-600'} text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg`}>
            {count}
          </span>
        </div>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {ordersByStatus[status].length === 0 ? (
            <div className="text-center py-12">
              <div className={`w-16 h-16 mx-auto mb-4 bg-gradient-to-r ${color === 'blue' ? 'from-blue-200 to-indigo-200' : 
                                                                    color === 'yellow' ? 'from-amber-200 to-yellow-200' : 
                                                                    'from-emerald-200 to-teal-200'} rounded-2xl flex items-center justify-center shadow-lg`}>
                📦
              </div>
              <p className="text-lg font-semibold text-gray-500">No orders</p>
            </div>
          ) : (
            ordersByStatus[status].map((order) => <OrderCard key={order._id} order={order} />)
          )}
        </div>
      </div>
    )
  }

  if (fetchedOrders === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center p-12">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500 mx-auto mb-6 shadow-xl"></div>
          <p className="text-xl font-semibold text-gray-600 backdrop-blur-sm bg-white/60 px-8 py-4 rounded-2xl shadow-lg">
            Loading orders...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Kanban Board */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Column
            title="New"
            status="new_order"
            count={ordersByStatus.new_order.length}
            color="blue"
          />
          <Column
            title="⏳ Pending"
            status="pending"
            count={ordersByStatus.pending.length}
            color="yellow"
          />
          <Column
            title="✓ Delivered"
            status="delivered"
            count={ordersByStatus.delivered.length}
            color="green"
          />
        </div>

        {/* Summary */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/50">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <p className="text-4xl font-black text-blue-600 mb-2">{ordersByStatus.new_order.length}</p>
              <p className="text-lg font-semibold text-gray-700">New Orders</p>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <p className="text-4xl font-black text-amber-600 mb-2">{ordersByStatus.pending.length}</p>
              <p className="text-lg font-semibold text-gray-700">Pending Orders</p>
            </div>
            <div className="group text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <p className="text-4xl font-black text-emerald-600 mb-2">{ordersByStatus.delivered.length}</p>
              <p className="text-lg font-semibold text-gray-700">Delivered Orders</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrdersDashboard;
