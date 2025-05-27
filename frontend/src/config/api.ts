// Configuração da API para Vercel
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000', // Vercel dev server
  },
  production: {
    baseURL: '', // Mesmo domínio no Vercel
  }
}

// Detectar ambiente
const isDevelopment = import.meta.env.DEV

// Configuração atual baseada no ambiente
export const API_BASE_URL = isDevelopment 
  ? API_CONFIG.development.baseURL 
  : (typeof window !== 'undefined' ? window.location.origin : '')

// Log da configuração para debug
console.log('🔧 API Configuration:', {
  isDevelopment,
  API_BASE_URL,
  windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'undefined'
})

// URLs completas da API - TODAS USANDO FIREBASE
export const API_ENDPOINTS = {
  cakes: `${API_BASE_URL}/api/manage-cakes`,
  orders: `${API_BASE_URL}/api/orders`,
  stats: `${API_BASE_URL}/api/stats`,
  updateOrder: `${API_BASE_URL}/api/update-order`,
  manageCakes: `${API_BASE_URL}/api/manage-cakes`,
}

// Configuração do Axios (se necessário)
export const API_CONFIG_AXIOS = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
}

// Log da configuração atual (apenas em desenvolvimento)
if (isDevelopment) {
  console.log('🔧 API Config:', { 
    environment: 'development', 
    baseURL: API_BASE_URL, 
    endpoints: API_ENDPOINTS,
    note: 'Using Firebase APIs via Vercel dev server'
  })
} 