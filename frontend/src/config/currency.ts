// Configuração de moeda para o projeto Maria Gulosa

// Função para formatar preço em Euros (única função utilizada)
export const formatPrice = (value: number): string => {
  return `€ ${value.toFixed(2).replace('.', ',')}`
}

// Configuração básica (mantida para compatibilidade)
export const CURRENCY_CONFIG = {
  currency: 'EUR',
  symbol: '€',
  locale: 'pt-PT'
}

export default CURRENCY_CONFIG 