// Utilitários para formatação de moeda em Euros

export const formatEuro = (value: number): string => {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value)
}

export const parseEuroString = (euroString: string): number => {
  // Remove o símbolo € e espaços, substitui vírgula por ponto
  const cleanString = euroString.replace(/[€\s]/g, '').replace(',', '.')
  return parseFloat(cleanString)
}

export const formatEuroSimple = (value: number): string => {
  return `€ ${value.toFixed(2).replace('.', ',')}`
}

// Conversão aproximada de Real para Euro (taxa exemplo: 1 EUR = 5.5 BRL)
export const convertBrlToEur = (brlValue: number): number => {
  const exchangeRate = 5.5 // Taxa de câmbio exemplo
  return Math.round((brlValue / exchangeRate) * 100) / 100
}

export default {
  formatEuro,
  parseEuroString,
  formatEuroSimple,
  convertBrlToEur
} 