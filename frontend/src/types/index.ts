// Tipos centralizados para a aplicação Maria Gulosa

export interface CakeData {
  id: number | string
  name: string
  price: string | number
  description?: string
  image?: string
  category?: string
  available?: boolean
  createdAt?: string
  updatedAt?: string
  rating?: number
}

export interface CartItem {
  id: number | string
  name: string
  price: string | number
  quantity: number
  image?: string
}

export interface OrderData {
  id: string
  orderNumber: string
  items: Array<{
    cakeName: string
    quantity: number
    unitPrice: number
    subtotal?: number
  }>
  totalItems?: number
  totalPrice: number
  status: 'pendente' | 'confirmado' | 'em_preparo' | 'pronto' | 'entregue' | 'cancelado'
  createdAt: string
  updatedAt?: string
  customerInfo?: {
    name?: string
    phone?: string
    email?: string
  }
  whatsappMessage?: string
  notes?: string
  adminNotes?: string
}

export interface StatsData {
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  todayRevenue: number
  totalCakes: number
  statusBreakdown: Array<{
    _id: string
    count: number
  }>
  popularCakes: Array<{
    name: string
    orders: number
  }>
  recentActivity: Array<{
    type: string
    message: string
    timestamp: string
  }>
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ToastState {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  isVisible: boolean
} 