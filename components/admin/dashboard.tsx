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

  // Calculate total revenue
  const totalRevenue = localOrders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

  const OrderCard = ({ order }: { order: any }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors duration-150">
      {/* Header with customer and amount */}
      <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
        <div className="flex-1">
          <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
          <p className="text-xs text-gray-500 mt-1">{order.customerEmail}</p>
        </div>
        <p className="text-lg font-semibold text-gray-900 ml-2">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
      </div>

      {/* Products */}
      <div className="mb-3">
        <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">Items</p>
        <div className="space-y-1">
          {order.products.map((product: any, index: number) => (
            <div key={index} className="text-xs text-gray-700 flex justify-between items-center">
              <span className="truncate flex-1">{product.name}</span>
              <span className="text-gray-500 ml-2">x{product.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Order details */}
      <div className="mb-3 pb-3 border-t border-gray-100 pt-3 space-y-1">
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Order ID</span>
          <span className="font-mono text-gray-700 text-xs truncate ml-2">{order.razorpayOrderId}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Phone</span>
          <span className="text-gray-700">{order.customerPhone}</span>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="text-gray-500">Ordered</span>
          <span className="text-gray-700">
            {new Date(order.createdAt).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-gray-100">
        {order.orderStatus === 'new_order' && (
          <button
            onClick={() => handleStatusChange(order._id, 'pending')}
            className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded-md text-xs font-medium transition-colors duration-150 border border-blue-200"
          >
            Move to Pending
          </button>
        )}
        {order.orderStatus === 'pending' && (
          <button
            onClick={() => handleStatusChange(order._id, 'delivered')}
            className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-2 px-3 rounded-md text-xs font-medium transition-colors duration-150 border border-green-200"
          >
            Mark Delivered
          </button>
        )}
        {order.orderStatus === 'delivered' && (
          <div className="w-full bg-gray-50 text-gray-600 py-2 px-3 rounded-md text-xs font-medium text-center border border-gray-200">
            ✓ Completed
          </div>
        )}
      </div>
    </div>
  )

  const Column = ({
    title,
    status,
    count,
    bgColor,
    textColor,
    borderColor
  }: {
    title: string
    status: OrderStatus
    count: number
    bgColor: string
    textColor: string
    borderColor: string
  }) => {
    return (
      <div className="flex flex-col h-full">
        {/* Column Header */}
        <div className={`${bgColor} ${borderColor} border rounded-lg p-4 mb-4 flex items-center justify-between`}>
          <h2 className={`text-sm font-semibold ${textColor}`}>{title}</h2>
          <span className={`${textColor} text-xl font-bold`}>{count}</span>
        </div>

        {/* Orders Container */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {ordersByStatus[status].length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-sm text-gray-500 font-medium">No orders</p>
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
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-sm font-medium text-gray-600">Loading</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders</h1>
        </div>

        {/* Summary Section - AT THE TOP */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
          {/* Total Orders */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">Total Orders</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">{localOrders.length}</p>
            <p className="text-xs text-gray-400 mt-2">All time</p>
          </div>

          {/* New Orders */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-blue-700 font-medium mb-2">New Orders</p>
            <p className="text-2xl sm:text-3xl font-bold text-blue-900">{ordersByStatus.new_order.length}</p>
            <p className="text-xs text-blue-600 mt-2">Awaiting</p>
          </div>

          {/* Pending Orders */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-amber-700 font-medium mb-2">Pending</p>
            <p className="text-2xl sm:text-3xl font-bold text-amber-900">{ordersByStatus.pending.length}</p>
            <p className="text-xs text-amber-600 mt-2">In progress</p>
          </div>

          {/* Delivered Orders */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-green-700 font-medium mb-2">Delivered</p>
            <p className="text-2xl sm:text-3xl font-bold text-green-900">{ordersByStatus.delivered.length}</p>
            <p className="text-xs text-green-600 mt-2">Completed</p>
          </div>

          {/* Total Revenue - spans full width on mobile, fits naturally on desktop */}
          <div className="col-span-2 lg:col-span-4 bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">Total Revenue</p>
            <p className="text-2xl sm:text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-xs text-gray-400 mt-2">Combined order value</p>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" style={{ minHeight: '60vh' }}>
          <Column
            title="New"
            status="new_order"
            count={ordersByStatus.new_order.length}
            bgColor="bg-blue-50"
            textColor="text-blue-900"
            borderColor="border-blue-200"
          />
          <Column
            title="Pending"
            status="pending"
            count={ordersByStatus.pending.length}
            bgColor="bg-amber-50"
            textColor="text-amber-900"
            borderColor="border-amber-200"
          />
          <Column
            title="Delivered"
            status="delivered"
            count={ordersByStatus.delivered.length}
            bgColor="bg-green-50"
            textColor="text-green-900"
            borderColor="border-green-200"
          />
        </div>
      </div>
    </div>
  )
}

export default OrdersDashboard;
