// Configuração de moeda para o projeto Maria Gulosa

export const CURRENCY_CONFIG = {
  // Moeda principal
  currency: 'EUR',
  symbol: '€',
  locale: 'pt-PT', // Português de Portugal para formatação de Euro
  
  // Formatação
  decimalPlaces: 2,
  thousandsSeparator: '.',
  decimalSeparator: ',',
  
  // Posição do símbolo
  symbolPosition: 'before', // 'before' ou 'after'
  
  // Configurações regionais
  region: 'Europe',
  country: 'Portugal',
  
  // Taxa de conversão (exemplo)
  exchangeRates: {
    BRL: 5.5, // 1 EUR = 5.5 BRL (exemplo)
    USD: 1.1, // 1 EUR = 1.1 USD (exemplo)
  }
}

// Função para formatar preço conforme configuração
export const formatPrice = (value: number): string => {
  if (CURRENCY_CONFIG.symbolPosition === 'before') {
    return `${CURRENCY_CONFIG.symbol} ${value.toFixed(CURRENCY_CONFIG.decimalPlaces).replace('.', CURRENCY_CONFIG.decimalSeparator)}`
  } else {
    return `${value.toFixed(CURRENCY_CONFIG.decimalPlaces).replace('.', CURRENCY_CONFIG.decimalSeparator)} ${CURRENCY_CONFIG.symbol}`
  }
}

// Função para converter de Real para Euro
export const convertFromBRL = (brlValue: number): number => {
  return Math.round((brlValue / CURRENCY_CONFIG.exchangeRates.BRL) * 100) / 100
}

export default CURRENCY_CONFIG 