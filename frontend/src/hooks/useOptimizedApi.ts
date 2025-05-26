import { useState, useEffect, useCallback } from 'react'
import { apiCache } from '../utils/performance'

interface UseOptimizedApiOptions {
  cacheKey?: string
  retryAttempts?: number
  retryDelay?: number
  timeout?: number
}

interface ApiState<T> {
  data: T | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useOptimizedApi = <T = any>(
  url: string,
  options: UseOptimizedApiOptions = {}
): ApiState<T> => {
  const {
    cacheKey = url,
    retryAttempts = 3,
    retryDelay = 1000,
    timeout = 10000
  } = options

  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWithRetry = useCallback(async (attempt = 1): Promise<T> => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache'
        }
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()
      
      if (!result.success) {
        throw new Error(result.error || 'API returned error')
      }

      return result
    } catch (err) {
      clearTimeout(timeoutId)
      
      if (attempt < retryAttempts) {
        console.warn(`Tentativa ${attempt} falhou, tentando novamente em ${retryDelay}ms...`)
        await new Promise(resolve => setTimeout(resolve, retryDelay))
        return fetchWithRetry(attempt + 1)
      }
      
      throw err
    }
  }, [url, retryAttempts, retryDelay, timeout])

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Verificar cache primeiro
      const cachedData = apiCache.get(cacheKey)
      if (cachedData) {
        setData(cachedData)
        setLoading(false)
        return
      }

      const result = await fetchWithRetry()
      
      // Salvar no cache
      apiCache.set(cacheKey, result)
      setData(result)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido'
      setError(errorMessage)
      console.error('Erro na API:', errorMessage)
    } finally {
      setLoading(false)
    }
  }, [cacheKey, fetchWithRetry])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    data,
    loading,
    error,
    refetch: fetchData
  }
}

// Hook específico para dados do admin
export const useAdminData = () => {
  const stats = useOptimizedApi('/api/stats', { cacheKey: 'admin-stats' })
  const orders = useOptimizedApi('/api/orders?limit=10', { cacheKey: 'admin-orders' })
  const cakes = useOptimizedApi('/api/manage-cakes', { cacheKey: 'admin-cakes' })

  const refetchAll = useCallback(async () => {
    await Promise.all([
      stats.refetch(),
      orders.refetch(),
      cakes.refetch()
    ])
  }, [stats.refetch, orders.refetch, cakes.refetch])

  return {
    stats: stats.data,
    orders: orders.data?.orders || [],
    cakes: cakes.data?.cakes || [],
    loading: stats.loading || orders.loading || cakes.loading,
    error: stats.error || orders.error || cakes.error,
    refetchAll
  }
}

// Hook para dados do catálogo público
export const useCatalogData = () => {
  return useOptimizedApi('/api/cakes', { 
    cacheKey: 'public-cakes',
    retryAttempts: 2 
  })
} 