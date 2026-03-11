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
  const [summaryExpanded, setSummaryExpanded] = useState(true)
  
  // NEW: Search, filter, sort, and bulk action states
  const [searchTerm, setSearchTerm] = useState('')
  const [dateFilter, setDateFilter] = useState<'today' | 'week' | 'all'>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'oldest'>('newest')
  const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set())

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

  // NEW: Bulk status update
  const handleBulkStatusChange = async (newStatus: OrderStatus) => {
    if (selectedOrders.size === 0) return
    
    try {
      for (const orderId of selectedOrders) {
        await updateStatus({
          orderId: orderId as Id<'orders'>,
          newStatus
        })
      }
      
      // Update local state
      setLocalOrders((prevOrders) =>
        prevOrders.map((order) =>
          selectedOrders.has(order._id) ? { ...order, orderStatus: newStatus } : order
        )
      )
      
      setSelectedOrders(new Set())
    } catch (error) {
      console.error('Failed to bulk update orders:', error)
    }
  }

  // NEW: Filter orders by search term
  const filterBySearch = (orders: any[]) => {
    if (!searchTerm) return orders
    const term = searchTerm.toLowerCase()
    return orders.filter((order) =>
      order.customerName?.toLowerCase().includes(term) ||
      order.customerEmail?.toLowerCase().includes(term) ||
      order.customerPhone?.includes(term) ||
      order.razorpayOrderId?.toLowerCase().includes(term)
    )
  }

  // NEW: Filter orders by date
  const filterByDate = (orders: any[]) => {
    if (dateFilter === 'all') return orders
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 7)

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt)
      if (dateFilter === 'today') return orderDate >= todayStart
      if (dateFilter === 'week') return orderDate >= weekStart
      return true
    })
  }

  // NEW: Sort orders
  const sortOrders = (orders: any[]) => {
    const sorted = [...orders]
    if (sortBy === 'newest') {
      return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    } else if (sortBy === 'highest') {
      return sorted.sort((a, b) => (b.totalAmount || 0) - (a.totalAmount || 0))
    } else if (sortBy === 'oldest') {
      return sorted.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    }
    return sorted
  }

  // NEW: Apply all filters and sorting
  const getFilteredAndSortedOrders = (orders: any[]) => {
    let filtered = filterByDate(filterBySearch(orders))
    return sortOrders(filtered)
  }

  // NEW: Toggle order selection for bulk actions
  const toggleOrderSelection = (orderId: string) => {
    const newSelected = new Set(selectedOrders)
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId)
    } else {
      newSelected.add(orderId)
    }
    setSelectedOrders(newSelected)
  }

  // NEW: Select/deselect all orders in current filtered view
  const toggleSelectAll = (orders: any[]) => {
    if (selectedOrders.size === orders.length && orders.length > 0) {
      setSelectedOrders(new Set())
    } else {
      setSelectedOrders(new Set(orders.map((o) => o._id)))
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
  const pendingRevenue = ordersByStatus.pending.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
  const deliveredRevenue = ordersByStatus.delivered.reduce((sum, order) => sum + (order.totalAmount || 0), 0)

  const OrderCard = ({ order }: { order: any }) => (
    <div className={`bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors duration-150 ${selectedOrders.has(order._id) ? 'bg-blue-50 border-blue-300' : ''}`}>
      {/* Header with checkbox, customer and amount */}
      <div className="flex justify-between items-start mb-3 pb-3 border-b border-gray-100">
        <div className="flex items-start gap-2 flex-1">
          <input
            type="checkbox"
            checked={selectedOrders.has(order._id)}
            onChange={() => toggleOrderSelection(order._id)}
            className="mt-0.5 cursor-pointer w-4 h-4 rounded border-gray-300"
          />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-sm">{order.customerName}</p>
            <p className="text-xs text-gray-500 mt-1 truncate">{order.customerEmail}</p>
          </div>
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
    const filteredOrders = getFilteredAndSortedOrders(ordersByStatus[status])
    const selectedInColumn = filteredOrders.filter((o) => selectedOrders.has(o._id))

    return (
      <div className="flex flex-col h-full">
        {/* Column Header */}
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

        {/* Orders Container */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {filteredOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="text-3xl mb-2">📦</div>
              <p className="text-sm text-gray-500 font-medium">{searchTerm ? 'No matching orders' : 'No orders'}</p>
            </div>
          ) : (
            filteredOrders.map((order) => <OrderCard key={order._id} order={order} />)
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
      {/* Sticky Summary Header - Always Visible */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg sm:text-xl font-bold text-gray-900">Orders Dashboard</h1>
              <div className="hidden sm:flex items-center gap-3">
                <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 rounded-md border border-blue-200">
                  <span className="text-xs font-semibold text-blue-700">New:</span>
                  <span className="text-sm font-bold text-blue-900">{ordersByStatus.new_order.length}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-amber-50 rounded-md border border-amber-200">
                  <span className="text-xs font-semibold text-amber-700">Pending:</span>
                  <span className="text-sm font-bold text-amber-900">{ordersByStatus.pending.length}</span>
                </div>
                <div className="flex items-center gap-1 px-3 py-1 bg-green-50 rounded-md border border-green-200">
                  <span className="text-xs font-semibold text-green-700">Delivered:</span>
                  <span className="text-sm font-bold text-green-900">{ordersByStatus.delivered.length}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSummaryExpanded(!summaryExpanded)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-150 font-medium text-sm text-gray-700 border border-gray-300"
            >
              {summaryExpanded ? '▼' : '▶'} Summary
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Manage Orders</h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Total {localOrders.length} orders</p>
        </div>

        {/* Collapsible Summary Section */}
        {summaryExpanded && (
          <div className="mb-8 animate-in fade-in-50 duration-200">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {/* Total Orders */}
              <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-gray-300 transition-colors duration-150">
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">Total Orders</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{localOrders.length}</p>
                <p className="text-xs text-gray-400 mt-2">All time</p>
              </div>

              {/* New Orders */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 hover:border-blue-300 transition-colors duration-150">
                <p className="text-xs sm:text-sm text-blue-700 font-medium mb-2">New Orders</p>
                <p className="text-2xl sm:text-3xl font-bold text-blue-900">{ordersByStatus.new_order.length}</p>
                <p className="text-xs text-blue-600 mt-2">Awaiting</p>
              </div>

              {/* Pending Orders */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6 hover:border-amber-300 transition-colors duration-150">
                <p className="text-xs sm:text-sm text-amber-700 font-medium mb-2">Pending</p>
                <p className="text-2xl sm:text-3xl font-bold text-amber-900">{ordersByStatus.pending.length}</p>
                <p className="text-xs text-amber-600 mt-2">In progress</p>
              </div>

              {/* Delivered Orders */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 hover:border-green-300 transition-colors duration-150">
                <p className="text-xs sm:text-sm text-green-700 font-medium mb-2">Delivered</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-900">{ordersByStatus.delivered.length}</p>
                <p className="text-xs text-green-600 mt-2">Completed</p>
              </div>

              <div id='revenue-section' className=' hidden grid grid-cols-1 md:grid-cols-2 gap-4' >

              {/* Total Revenue - spans full width on mobile, fits naturally on desktop */}
              <div className="col-span-2 lg:col-span-4 bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6 hover:border-gray-300 transition-colors duration-150">
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-2">Total Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-gray-400 mt-2">Combined order value</p>
              </div>

              {/* Revenue Breakdown - Pending vs Delivered */}
              <div className="col-span-2 lg:col-span-2 bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-6 hover:border-amber-300 transition-colors duration-150">
                <p className="text-xs sm:text-sm text-amber-700 font-medium mb-3">Pending Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-900">₹{pendingRevenue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-amber-600 mt-2">To be completed</p>
              </div>

              <div className="col-span-2 lg:col-span-2 bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 hover:border-green-300 transition-colors duration-150">
                <p className="text-xs sm:text-sm text-green-700 font-medium mb-3">Delivered Revenue</p>
                <p className="text-xl sm:text-2xl font-bold text-green-900">₹{deliveredRevenue.toLocaleString('en-IN')}</p>
                <p className="text-xs text-green-600 mt-2">Completed</p>
              </div>

              </div>

            </div>
          </div>
        )}

        {/* NEW: Search, Filter, Sort Bar */}
        <div className="mb-6 space-y-3">
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name, email, phone, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter and Sort Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center flex-wrap">
            {/* Date Filter */}
            <div className="flex gap-2">
              {(['today', 'week', 'all'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDateFilter(filter)}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150 border ${
                    dateFilter === filter
                      ? 'bg-blue-100 border-blue-300 text-blue-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {filter === 'today' ? 'Today' : filter === 'week' ? 'This Week' : 'All'}
                </button>
              ))}
            </div>

            {/* Sort Options */}
            <div className="flex gap-2">
              {(['newest', 'oldest', 'highest'] as const).map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-3 py-2 rounded-md text-xs font-medium transition-colors duration-150 border ${
                    sortBy === sort
                      ? 'bg-purple-100 border-purple-300 text-purple-900'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {sort === 'newest' ? 'Newest' : sort === 'oldest' ? 'Oldest' : 'Highest'}
                </button>
              ))}
            </div>

            {/* Clear Filters */}
            {(searchTerm || dateFilter !== 'all' || sortBy !== 'newest') && (
              <button
                onClick={() => {
                  setSearchTerm('')
                  setDateFilter('all')
                  setSortBy('newest')
                }}
                className="px-3 py-2 rounded-md text-xs font-medium bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200 transition-colors duration-150"
              >
                Clear Filters
              </button>
            )}
          </div>

          {/* Bulk Actions - Show when orders are selected */}
          {selectedOrders.size > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <p className="text-sm font-medium text-blue-900">{selectedOrders.size} order{selectedOrders.size !== 1 ? 's' : ''} selected</p>
              <div className="flex gap-2">
                {selectedOrders.size > 0 && (
                  <>
                    <button
                      onClick={() => handleBulkStatusChange('pending')}
                      className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-xs font-medium transition-colors duration-150"
                    >
                      → Move to Pending
                    </button>
                    <button
                      onClick={() => handleBulkStatusChange('delivered')}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md text-xs font-medium transition-colors duration-150"
                    >
                      → Mark Delivered
                    </button>
                    <button
                      onClick={() => setSelectedOrders(new Set())}
                      className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-900 rounded-md text-xs font-medium transition-colors duration-150"
                    >
                      Deselect All
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
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
