// Configuração de contatos da Maria Gulosa

export const CONTACTS = {
  // WhatsApp
  whatsapp: {
    number: '351914019142', // Portugal
    countryCode: '+351',
    fullNumber: '+351 914 019 142',
    url: 'https://wa.me/351914019142',
    defaultMessage: 'Olá! Gostaria de fazer um pedido'
  },
  
  // Instagram
  instagram: {
    username: 'mariagulosa_sabores',
    url: 'https://instagram.com/mariagulosa_sabores',
    displayName: '@mariagulosa_sabores'
  },
  
  // Outros contatos (para futuro)
  email: 'contato@mariagulosa.pt',
  website: 'https://mariagulosa.pt',
  
  // Localização
  location: {
    country: 'Portugal',
    region: 'Europa'
  }
}

// Função para gerar URL do WhatsApp com mensagem personalizada
export const getWhatsAppUrl = (message?: string): string => {
  const encodedMessage = encodeURIComponent(message || CONTACTS.whatsapp.defaultMessage)
  return `${CONTACTS.whatsapp.url}?text=${encodedMessage}`
}

// Função para gerar mensagem de pedido de bolo
export const getCakeOrderMessage = (cakeName: string, price: string): string => {
  return `Olá! Gostaria de encomendar: ${cakeName} - ${price}`
}

export default CONTACTS 