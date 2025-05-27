// Utilitários de performance para otimização da aplicação

// Lazy loading de componentes
import { lazy } from 'react'

// Componentes lazy-loaded para reduzir bundle inicial
export const LazyAdmin = lazy(() => import('../pages/Admin'))
export const LazyCatalog = lazy(() => import('../pages/Catalog'))

// Debounce para otimizar inputs
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle para otimizar eventos de scroll/resize
export const throttle = <T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Memoização simples para cálculos custosos
export const memoize = <Args extends readonly unknown[], Return>(
  fn: (...args: Args) => Return
): ((...args: Args) => Return) => {
  const cache = new Map<string, Return>()
  return (...args: Args): Return => {
    const key = JSON.stringify(args)
    if (cache.has(key)) {
      return cache.get(key)!
    }
    const result = fn(...args)
    cache.set(key, result)
    return result
  }
}

// Formatação de preços otimizada
export const formatPrice = memoize((price: string | number): string => {
  const numPrice = typeof price === 'string' 
    ? parseFloat(price.replace(/[€\s]/g, '').replace(',', '.'))
    : price
  
  if (isNaN(numPrice)) return '€ 0,00'
  
  return `€ ${numPrice.toFixed(2).replace('.', ',')}`
})

// Validação de preços otimizada
export const validatePrice = memoize((price: string | number): boolean => {
  const numPrice = typeof price === 'string' 
    ? parseFloat(price.replace(/[€\s]/g, '').replace(',', '.'))
    : price
  
  return !isNaN(numPrice) && numPrice > 0
})

// Intersection Observer para lazy loading de imagens
export const createImageObserver = (callback: (entry: IntersectionObserverEntry) => void) => {
  if (typeof window === 'undefined') return null
  
  return new IntersectionObserver(
    (entries) => {
      entries.forEach(callback)
    },
    {
      rootMargin: '50px 0px',
      threshold: 0.1
    }
  )
}

// Preload de recursos críticos
export const preloadResource = (href: string, as: string) => {
  if (typeof window === 'undefined') return
  
  const link = document.createElement('link')
  link.rel = 'preload'
  link.href = href
  link.as = as
  document.head.appendChild(link)
}

// Cache simples para requisições
class SimpleCache {
  private cache = new Map<string, { data: unknown; timestamp: number }>()
  private ttl = 5 * 60 * 1000 // 5 minutos

  set(key: string, data: unknown) {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  get(key: string) {
    const item = this.cache.get(key)
    if (!item) return null
    
    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return item.data
  }

  clear() {
    this.cache.clear()
  }
}

export const apiCache = new SimpleCache()

// Hook para detectar conexão lenta
export const useSlowConnection = () => {
  if (typeof navigator === 'undefined') return false
  
  const connection = (navigator as unknown as { connection?: { effectiveType: string } }).connection
  if (!connection) return false
  
  return connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g'
}

// Otimização de imagens
export const optimizeImageUrl = (url: string, width?: number, quality = 80) => {
  if (!url || url.startsWith('data:')) return url
  
  // Se for uma URL externa, retornar como está
  if (url.startsWith('http')) return url
  
  // Para imagens locais, adicionar parâmetros de otimização se suportado
  const params = new URLSearchParams()
  if (width) params.set('w', width.toString())
  params.set('q', quality.toString())
  
  return `${url}?${params.toString()}`
} 