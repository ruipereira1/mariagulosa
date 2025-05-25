// Configuração da API para Vercel
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000', // Vercel dev
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
  : API_CONFIG.production.baseURL

// URLs completas da API
export const API_ENDPOINTS = {
  cakes: `${API_BASE_URL}/api/cakes`,
  orders: `${API_BASE_URL}/api/orders`,
  stats: `${API_BASE_URL}/api/stats`,
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
  console.log('🔧 API Config (Vercel Dev):', {
    environment: 'development',
    baseURL: API_BASE_URL,
    endpoints: API_ENDPOINTS
  })
} else {
  console.log('🚀 API Config (Vercel Production):', {
    environment: 'production',
    baseURL: API_BASE_URL || 'same-domain',
    endpoints: API_ENDPOINTS
  })
} 