// @ /components/admin/dashboard.tsx

'use client'

import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useState, useEffect } from 'react'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'

// Support BOTH old states (legacy) and new extended states
type OrderStatus = 'new_order' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'pending'

const STATE_WORKFLOW: Record<string, { label: string; color: string; next: OrderStatus | null }> = {
  // NEW: Extended workflow
  new_order: { label: 'New', color: 'blue', next: 'confirmed' },
  confirmed: { label: 'Confirmed', color: 'purple', next: 'processing' },
  processing: { label: 'Processing', color: 'orange', next: 'shipped' },
  shipped: { label: 'Shipped', color: 'amber', next: 'delivered' },
  delivered: { label: 'Delivered', color: 'green', next: null },
  
  // LEGACY support (old single step workflow)
  pending: { label: 'Pending', color: 'amber', next: 'delivered' }
}

const OrdersDashboard = () => {
  const { user } = useUser()
  const userRole = 'vendor' as const

  // API calls
  const fetchedOrders = useQuery(api.orders.getAllOrders)
  const updateOrderStatus = useMutation(api.orders.updateOrderStatus)
  const bulkUpdateStatus = useMutation(api.orders.bulkUpdateOrderStatus)
  const addNote = useMutation(api.orders.addOrderNote)

  // Local state
  const [localOrders, setLocalOrders] = useState<any[]>([])
  const [summaryExpanded, setSummaryExpanded] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'all'>('all')
  const [sortBy, setSortBy] = useState<'urgency' | 'newest' | 'highest'>('urgency')
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())
  const [minOrderValue, setMinOrderValue] = useState(0)
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<'all' | 'paid' | 'pending'>('all')
  const [showConfirmModal, setShowConfirmModal] = useState<{
    type: 'single' | 'bulk'
    orderId?: string
    orderIds?: string[]
    newStatus?: OrderStatus
  } | null>(null)
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null)
  const [noteInput, setNoteInput] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (fetchedOrders?.length) {
      setLocalOrders(fetchedOrders)
      if (successMsg) setTimeout(() => setSuccessMsg(null), 3000)
      if (error) setTimeout(() => setError(null), 5000)
    }
  }, [fetchedOrders])

  const ordersByStatus: Record<OrderStatus, any[]> = {
    new_order: localOrders.filter(o => o.orderStatus === 'new_order'),
    confirmed: localOrders.filter(o => o.orderStatus === 'confirmed'),
    processing: localOrders.filter(o => o.orderStatus === 'processing'),
    shipped: localOrders.filter(o => o.orderStatus === 'shipped'),
    delivered: localOrders.filter(o => o.orderStatus === 'delivered'),
    pending: localOrders.filter(o => o.orderStatus === 'pending')
  }

  const totalRevenue = localOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const pendingRevenue = [ordersByStatus.new_order, ordersByStatus.confirmed, ordersByStatus.processing, ordersByStatus.shipped]
    .flat()
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const deliveredRevenue = ordersByStatus.delivered.reduce((sum, o) => sum + (o.totalAmount || 0), 0)
  const avgOrderValue = localOrders.length > 0 ? Math.round(totalRevenue / localOrders.length) : 0
  const completionRate = localOrders.length > 0 ? Math.round((ordersByStatus.delivered.length / localOrders.length) * 100) : 0

  const calculateUrgency = (order: any): 'normal' | 'urgent' | 'delayed' => {
    const hours = (Date.now() - order.createdAt) / (1000 * 60 * 60)
    if (order.orderStatus === 'new_order' && hours > 24) return 'urgent'
    if (['confirmed', 'processing'].includes(order.orderStatus) && hours > 48) return 'delayed'
    return 'normal'
  }

  const handleStatusChange = async (orderId: Id<'orders'>, newStatus: OrderStatus) => {
    if (!user || isUpdating) return

    setIsUpdating(true)
    try {
      await updateOrderStatus({
        orderId,
        newStatus,
        userId: user.id,
        userName: user.fullName || 'Unknown',
        userRole
      })

      setLocalOrders(prev =>
        prev.map(o => o._id === orderId ? { ...o, orderStatus: newStatus, isLocked: newStatus === 'delivered' } : o)
      )
      setSuccessMsg(`✅ Order moved to ${STATE_WORKFLOW[newStatus].label}`)
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Update failed'
      setError(`❌ ${errorMsg}`)
    } finally {
      setIsUpdating(false)
    }
  }

  // Get next valid state for an order
  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    if (currentStatus === 'new_order') return 'confirmed'
    if (currentStatus === 'confirmed') return 'processing'
    if (currentStatus === 'processing') return 'shipped'
    if (currentStatus === 'shipped') return 'delivered'
    if (currentStatus === 'pending') return 'delivered'
    if (currentStatus === 'delivered') return null
    return null
  }

  const handleBulkConfirmed = async () => {
    if (!user || isUpdating) return

    setIsUpdating(true)
    try {
      // Handle both single and bulk updates
      let orderIds: Id<'orders'>[] = []
      
      if (showConfirmModal?.type === 'single' && showConfirmModal?.orderId) {
        orderIds = [showConfirmModal.orderId as Id<'orders'>]
      } else if (showConfirmModal?.orderIds) {
        orderIds = showConfirmModal.orderIds.map(id => id as Id<'orders'>)
      } else {
        return
      }

      const result = await bulkUpdateStatus({
        orderIds,
        newStatus: showConfirmModal.newStatus || 'delivered',
        userId: user.id,
        userName: user.fullName || 'Unknown',
        userRole
      })

      const successIds = new Set(result.success)
      setLocalOrders(prev =>
        prev.map(o =>
          successIds.has(o._id)
            ? { ...o, orderStatus: showConfirmModal.newStatus, isLocked: showConfirmModal.newStatus === 'delivered' }
            : o
        )
      )

      setSelectedOrders(new Set())
      const targetStatus = showConfirmModal.newStatus as OrderStatus
      setShowConfirmModal(null)
      
      // Show detailed feedback
      if (result.success.length > 0) {
        setSuccessMsg(`✅ ${result.success.length} order${result.success.length !== 1 ? 's' : ''} moved to ${STATE_WORKFLOW[targetStatus].label}`)
      }
      if (result.failed.length > 0) {
        const failedMsg = result.failed.slice(0, 3).map(f => f.error).join('; ')
        setError(`⚠️ ${result.failed.length} failed: ${failedMsg}${result.failed.length > 3 ? '...' : ''}`)
      }
    } catch (err) {
      setError(`❌ ${err instanceof Error ? err.message : 'Bulk update failed'}`)
    } finally {
      setIsUpdating(false)
    }
  }

  const filterBySearch = (orders: any[]) => {
    if (!searchTerm) return orders
    const term = searchTerm.toLowerCase()
    return orders.filter(o =>
      o.customerName?.toLowerCase().includes(term) ||
      o.customerEmail?.toLowerCase().includes(term) ||
      o.customerPhone?.includes(term) ||
      o.razorpayOrderId?.toLowerCase().includes(term)
    )
  }

  const filterByPaymentStatus = (orders: any[]) => {
    if (paymentStatusFilter === 'all') return orders
    return orders.filter(o => o.paymentStatus === paymentStatusFilter)
  }

  const filterByOrderValue = (orders: any[]) => {
    if (minOrderValue === 0) return orders
    return orders.filter(o => (o.totalAmount || 0) >= minOrderValue)
  }

  const filterByDate = (orders: any[]) => {
    if (dateFilter === 'all') return orders
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 7)

    return orders.filter(o => {
      const orderDate = new Date(o.createdAt)
      if (dateFilter === 'today') return orderDate >= todayStart
      if (dateFilter === 'week') return orderDate >= weekStart
      return true
    })
  }

  const sortOrders = (orders: any[]) => {
    const sorted = [...orders]
    if (sortBy === 'urgency') {
      return sorted.sort((a, b) => {
        const urgencyMap = { urgent: 0, delayed: 1, normal: 2 }
        const aU = urgencyMap[calculateUrgency(a) as keyof typeof urgencyMap]
        const bU = urgencyMap[calculateUrgency(b) as keyof typeof urgencyMap]
        if (aU !== bU) return aU - bU
        return b.createdAt - a.createdAt
      })
    } else if (sortBy === 'newest') {
      return sorted.sort((a, b) => b.createdAt - a.createdAt)
    } else if (sortBy === 'highest') {
      return sorted.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
    }
    return sorted
  }

  const getFilteredAndSortedOrders = (orders: any[]) => {
    let filtered = orders
    filtered = filterBySearch(filtered)
    filtered = filterByDate(filtered)
    filtered = filterByPaymentStatus(filtered)
    filtered = filterByOrderValue(filtered)
    return sortOrders(filtered)
  }

  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders)
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId)
    } else {
      newSelected.add(orderId)
    }
    setSelectedOrders(newSelected)
  }

  const toggleSelectAll = (orders: any[]) => {
    if (selectedOrders.size === orders.length && orders.length > 0) {
      setSelectedOrders(new Set())
    } else {
      setSelectedOrders(new Set(orders.map(o => o._id)))
    }
  }

  const OrderCard = ({ order }: { order: any }) => {
    const isExpanded = expandedOrderId === order._id
    const urgency = calculateUrgency(order)
    const isLocked = order.orderStatus === 'delivered' || order.isLocked
    const nextStatus = STATE_WORKFLOW[order.orderStatus].next

    return (
      <div
        className={`border rounded-lg transition-all duration-150 ${
          selectedOrders.has(order._id) ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-200 hover:border-gray-300'
        } ${isExpanded ? 'ring-2 ring-blue-400' : ''}`}
      >
        {/* Collapsed view */}
        <div
          className="p-4 cursor-pointer"
          onClick={() => setExpandedOrderId(isExpanded ? null : order._id)}
        >
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={selectedOrders.has(order._id)}
              onChange={(e) => {
                e.stopPropagation()
                toggleOrderSelection(order._id)
              }}
              className="mt-1 w-4 h-4 rounded border-gray-300 cursor-pointer"
              disabled={isLocked}
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium text-gray-900 text-sm truncate">{order.customerName}</p>
                {urgency !== 'normal' && (
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    urgency === 'urgent'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {urgency === 'urgent' ? '🔴 Urgent' : '⚠️ Delayed'}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">{order.customerEmail}</p>
            </div>

            <div className="text-right">
              <p className="text-lg font-semibold text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
              <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            </div>
          </div>
        </div>

        {/* Expanded view */}
        {isExpanded && (
          <div className="border-t border-gray-100 p-5 space-y-5 bg-gray-50">
            {/* Customer Information Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Customer Information</h3>
              <div className="bg-white rounded-lg border border-gray-200 p-3 space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">First Name</p>
                    <p className="text-sm text-gray-900">{order.customerName?.split(' ')[0] || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 mb-1">Last Name</p>
                    <p className="text-sm text-gray-900">{order.customerName?.split(' ').slice(1).join(' ') || 'N/A'}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Email</p>
                  <p className="text-sm text-gray-900 break-all">{order.customerEmail}</p>
                </div>
                
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Phone</p>
                  <p className="text-sm text-gray-900">{order.customerPhone}</p>
                </div>

                {order.customerAddress && (
                  <>
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Delivery Address</p>
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Street Address</p>
                          <p className="text-sm text-gray-900">{order.customerAddress.street || 'N/A'}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">City</p>
                            <p className="text-sm text-gray-900">{order.customerAddress.city || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-xs font-semibold text-gray-600 mb-1">State</p>
                            <p className="text-sm text-gray-900">{order.customerAddress.state || 'N/A'}</p>
                          </div>
                        </div>
                        
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-1">Pincode</p>
                          <p className="text-sm text-gray-900">{order.customerAddress.pincode || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Order Details Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Order Details</h3>
              <div className="bg-white rounded-lg border border-gray-200 p-3 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Order ID</p>
                  <p className="font-mono text-sm text-gray-900 break-all">{order.razorpayOrderId}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Total Amount</p>
                  <p className="text-sm font-semibold text-gray-900">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Order Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    order.orderStatus === 'new_order' ? 'bg-blue-100 text-blue-700' :
                    order.orderStatus === 'confirmed' ? 'bg-purple-100 text-purple-700' :
                    order.orderStatus === 'processing' ? 'bg-orange-100 text-orange-700' :
                    order.orderStatus === 'shipped' ? 'bg-amber-100 text-amber-700' :
                    order.orderStatus === 'delivered' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {STATE_WORKFLOW[order.orderStatus].label}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Payment Status</p>
                  <span className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                    order.paymentStatus === 'captured' ? 'bg-green-100 text-green-700' :
                    order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1">Order Date</p>
                  <p className="text-sm text-gray-900">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
                </div>
              </div>
            </div>

            {/* Products Section */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Items Ordered</h3>
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="divide-y">
                  {order.products?.map((p: any, i: number) => (
                    <div key={i} className="p-3 flex items-start gap-3 hover:bg-gray-50 transition-colors">
                      {p.image_name_front && (
                        <img 
                          src={p.image_name_front} 
                          alt={p.name} 
                          className="w-12 h-12 rounded border border-gray-200 object-cover flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                        <p className="text-xs text-gray-500 mt-1">₹{p.price?.toLocaleString('en-IN')} × {p.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 flex-shrink-0">₹{(p.price * p.quantity)?.toLocaleString('en-IN')}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action button */}
            {!isLocked && nextStatus && (
              <button
                onClick={() => {
                  if (nextStatus === 'delivered') {
                    setShowConfirmModal({ type: 'single', orderId: order._id.toString(), newStatus: nextStatus })
                  } else {
                    handleStatusChange(order._id, nextStatus)
                  }
                }}
                disabled={isUpdating}
                className="w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
              >
                {isUpdating ? '⏳ Updating...' : `→ Move to ${STATE_WORKFLOW[nextStatus].label}`}
              </button>
            )}

            {isLocked && (
              <div className="w-full px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm font-semibold text-center">
                ✓ Order Locked - Cannot be modified
              </div>
            )}
          </div>
        )}
      </div>
    )
  }

  const Column = ({
    title,
    status,
    bgColor,
    textColor,
    borderColor
  }: {
    title: string
    status: OrderStatus
    bgColor: string
    textColor: string
    borderColor: string
  }) => {
    const filteredOrders = getFilteredAndSortedOrders(ordersByStatus[status])
    const selectedInColumn = filteredOrders.filter(o => selectedOrders.has(o._id))

    return (
      <div className="flex flex-col h-full">
        <div className={`${bgColor} ${borderColor} border rounded-lg p-4 mb-4 flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={filteredOrders.length > 0 && selectedInColumn.length === filteredOrders.length}
              onChange={() => toggleSelectAll(filteredOrders)}
              className="w-4 h-4 rounded border-gray-300 cursor-pointer"
            />
            <h2 className={`text-sm font-semibold ${textColor}`}>{title}</h2>
          </div>
          <span className={`${textColor} text-xl font-bold`}>{filteredOrders.length}</span>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-sm text-gray-500 font-medium">{searchTerm ? 'No matching orders' : 'No orders'}</p>
            </div>
          ) : (
            filteredOrders.map(order => <OrderCard key={order._id} order={order} />)
          )}
        </div>
      </div>
    )
  }

  if (!fetchedOrders) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-gray-300 border-t-gray-900 mx-auto mb-4"></div>
          <p className="text-sm font-medium text-gray-600">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Error/Success Messages */}
      {error && (
        <div className="fixed top-4 right-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm z-50">
          {error}
        </div>
      )}
      {successMsg && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded-lg text-sm z-50">
          {successMsg}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {showConfirmModal.type === 'single' ? 'Confirm Action' : 'Confirm Bulk Update'}
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              {showConfirmModal.type === 'single'
                ? `Move this order to ${STATE_WORKFLOW[showConfirmModal.newStatus!].label}? ${showConfirmModal.newStatus === 'delivered' ? 'Delivered orders cannot be edited.' : ''}`
                : `Move ${showConfirmModal.orderIds?.length || 0} order${showConfirmModal.orderIds?.length !== 1 ? 's' : ''} to ${STATE_WORKFLOW[showConfirmModal.newStatus!].label}?`}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(null)}
                disabled={isUpdating}
                className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 disabled:opacity-50 text-gray-900 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkConfirmed}
                disabled={isUpdating}
                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
              >
                {isUpdating ? '⏳ Confirming...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Orders</h1>
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-md border border-blue-200">
                  <span className="text-xs font-semibold text-blue-700">New:</span>
                  <span className="text-sm font-bold text-blue-900">{ordersByStatus.new_order.length}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-purple-50 rounded-md border border-purple-200">
                  <span className="text-xs font-semibold text-purple-700">Confirmed:</span>
                  <span className="text-sm font-bold text-purple-900">{ordersByStatus.confirmed.length}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-md border border-amber-200">
                  <span className="text-xs font-semibold text-amber-700">Processing:</span>
                  <span className="text-sm font-bold text-amber-900">{ordersByStatus.processing.length}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSummaryExpanded(!summaryExpanded)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-sm text-gray-700 border border-gray-300"
            >
              {summaryExpanded ? '▼' : '▶'} Summary
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Collapsible Summary */}
        {summaryExpanded && (
          <div className="mb-8 space-y-4">
            {/* Primary Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{localOrders.length}</p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-blue-700 font-medium mb-2">New</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-900">{ordersByStatus.new_order.length}</p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-purple-700 font-medium mb-2">Confirmed</p>
                <p className="text-2xl sm:text-3xl font-bold text-purple-900">{ordersByStatus.confirmed.length}</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-orange-700 font-medium mb-2">Processing</p>
                <p className="text-2xl sm:text-3xl font-bold text-orange-900">{ordersByStatus.processing.length}</p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-green-700 font-medium mb-2">Delivered</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-900">{ordersByStatus.delivered.length}</p>
              </div>
            </div>

            {/* Revenue Metrics */}
 {/*            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
           <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">Total Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-amber-700 font-medium mb-2">Pending Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-900">₹{pendingRevenue.toLocaleString('en-IN')}</p>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-green-700 font-medium mb-2">Delivered Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-green-900">₹{deliveredRevenue.toLocaleString('en-IN')}</p>
              </div>
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-indigo-700 font-medium mb-2">Avg Order Value</p>
                <p className="text-xl sm:text-2xl font-bold text-indigo-900">₹{avgOrderValue.toLocaleString('en-IN')}</p>
              </div>
            </div>
*/} 

            {/* Business KPIs */}
            <div className="grid grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-rose-700 font-medium mb-2">Completion Rate</p>
                <p className="text-2xl sm:text-3xl font-bold text-rose-900">{completionRate}%</p>
              </div>
              {/* <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 sm:p-6">
                <p className="text-xs sm:text-sm text-cyan-700 font-medium mb-2">Urgent Orders</p>
                <p className="text-2xl sm:text-3xl font-bold text-cyan-900">
                  {localOrders.filter(o => calculateUrgency(o) === 'urgent').length}
                </p>
              </div> */}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 flex-wrap items-start sm:items-center">
            {/* Date Filters */}
            <div className="flex gap-2">
              {(['today', 'week', 'all'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setDateFilter(f)}
                  className={`px-3 py-2 rounded-md text-xs font-medium border transition-colors ${
                    dateFilter === f
                      ? 'bg-blue-100 border-blue-300 text-blue-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {f === 'today' ? 'Today' : f === 'week' ? 'This Week' : 'All'}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              {(['urgency', 'newest', 'highest'] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setSortBy(s)}
                  className={`px-3 py-2 rounded-md text-xs font-medium border transition-colors ${
                    sortBy === s
                      ? 'bg-purple-100 border-purple-300 text-purple-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {s === 'urgency' ? '🔴 Urgent' : s === 'newest' ? '📅 Newest' : '💰 Highest'}
                </button>
              ))}
            </div>

            {/* Payment Status Filter */}
            <div className="flex gap-2">
              {(['all', 'paid', 'pending'] as const).map(p => (
                <button
                  key={p}
                  onClick={() => setPaymentStatusFilter(p)}
                  className={`px-3 py-2 rounded-md text-xs font-medium border transition-colors ${
                    paymentStatusFilter === p
                      ? 'bg-green-100 border-green-300 text-green-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p === 'all' ? 'All' : p === 'paid' ? '✓ Paid' : '⏳ Pending'}
                </button>
              ))}
            </div>

            {/* Clear Filters */}
            {(searchTerm || dateFilter !== 'all' || sortBy !== 'urgency' || paymentStatusFilter !== 'all' || minOrderValue > 0) && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setDateFilter('all')
                  setSortBy('urgency')
                  setPaymentStatusFilter('all')
                  setMinOrderValue(0)
                }}
                className="px-3 py-2 rounded-md text-xs font-medium bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                🗑️ Clear Filters
              </button>
            )}
          </div>

          {selectedOrders.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-blue-900">{selectedOrders.size} selected</p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    // Get the common next status for selected orders
                    const selectedOrdersList = Array.from(selectedOrders).map(id => localOrders.find(o => o._id === id)).filter(Boolean)
                    const nextStates = new Set(selectedOrdersList.map(o => getNextStatus(o.orderStatus)))
                    
                    if (nextStates.size === 1) {
                      const nextStatus = Array.from(nextStates)[0]
                      if (nextStatus) {
                        setShowConfirmModal({ 
                          type: 'bulk', 
                          orderIds: Array.from(selectedOrders), 
                          newStatus: nextStatus 
                        })
                      }
                    } else {
                      setError('⚠️ Selected orders are in different states and cannot be moved together')
                    }
                  }}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-md text-xs font-medium transition-colors"
                >
                  {isUpdating ? '⏳ Updating...' : 'Move Selected'}
                </button>
                <button
                  onClick={() => setSelectedOrders(new Set())}
                  disabled={isUpdating}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:opacity-50 text-gray-900 rounded-md text-xs font-medium transition-colors"
                >
                  Deselect
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6" style={{ minHeight: '60vh' }}>
          <Column title="New" status="new_order" bgColor="bg-blue-50" textColor="text-blue-900" borderColor="border-blue-200" />
          <Column title="Confirmed" status="confirmed" bgColor="bg-purple-50" textColor="text-purple-900" borderColor="border-purple-200" />
          <Column title="Processing" status="processing" bgColor="bg-orange-50" textColor="text-orange-900" borderColor="border-orange-200" />
          <Column title="Shipped" status="shipped" bgColor="bg-amber-50" textColor="text-amber-900" borderColor="border-amber-200" />
          <Column title="Delivered" status="delivered" bgColor="bg-green-50" textColor="text-green-900" borderColor="border-green-200" />
        </div>
      </div>
    </div>
  )
}

export default OrdersDashboard
