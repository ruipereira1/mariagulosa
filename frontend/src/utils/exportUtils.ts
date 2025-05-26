import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

// Tipos para os dados
interface OrderData {
  orderNumber: string
  customerInfo?: {
    name?: string
    phone?: string
    email?: string
  }
  items: Array<{
    cakeName: string
    quantity: number
    price: number
  }>
  totalPrice: number
  status: string
  createdAt: string
  deliveryDate?: string
  notes?: string
}

interface CakeData {
  id: string
  name: string
  price: number
  description: string
  category: string
  available: boolean
  createdAt: string
}

interface StatsData {
  totalOrders: number
  todayOrders: number
  totalRevenue: number
  todayRevenue: number
  totalCakes: number
  availableCakes: number
  statusBreakdown: Array<{
    _id: string
    count: number
  }>
}

// Exportar pedidos para PDF
export const exportOrdersToPDF = (orders: OrderData[], stats: StatsData) => {
  // Validar dados de entrada
  if (!orders || !Array.isArray(orders)) {
    throw new Error('Dados de pedidos inválidos')
  }
  if (!stats) {
    throw new Error('Dados de estatísticas inválidos')
  }

  const doc = new jsPDF()
  
  // Cabeçalho
  doc.setFontSize(20)
  doc.setTextColor(139, 69, 19) // Cor chocolate
  doc.text('Maria Gulosa - Relatório de Pedidos', 20, 20)
  
  // Data do relatório
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 20, 30)
  
  // Estatísticas resumidas
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text('Resumo Geral:', 20, 45)
  
  doc.setFontSize(10)
  doc.text(`Total de Pedidos: ${stats.totalOrders}`, 20, 55)
  doc.text(`Pedidos Hoje: ${stats.todayOrders}`, 20, 62)
  doc.text(`Receita Total: € ${stats.totalRevenue.toFixed(2)}`, 20, 69)
  doc.text(`Receita Hoje: € ${stats.todayRevenue.toFixed(2)}`, 20, 76)
  
  // Tabela de pedidos
  const tableData = orders.map(order => [
    order.orderNumber,
    order.customerInfo?.name || 'N/A',
    order.customerInfo?.phone || 'N/A',
    order.items.map(item => `${item.cakeName} (${item.quantity}x)`).join(', '),
    `€ ${order.totalPrice.toFixed(2)}`,
    order.status,
    new Date(order.createdAt).toLocaleDateString('pt-PT')
  ])
  
  autoTable(doc, {
    head: [['Pedido', 'Cliente', 'Telefone', 'Itens', 'Total', 'Status', 'Data']],
    body: tableData,
    startY: 85,
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [218, 165, 32], // Cor dourada
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248]
    }
  })
  
  // Salvar o PDF
  doc.save(`maria-gulosa-pedidos-${new Date().toISOString().split('T')[0]}.pdf`)
}

// Exportar bolos para PDF
export const exportCakesToPDF = (cakes: CakeData[]) => {
  // Validar dados de entrada
  if (!cakes || !Array.isArray(cakes)) {
    throw new Error('Dados de bolos inválidos')
  }

  const doc = new jsPDF()
  
  // Cabeçalho
  doc.setFontSize(20)
  doc.setTextColor(139, 69, 19)
  doc.text('Maria Gulosa - Catálogo de Bolos', 20, 20)
  
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Gerado em: ${new Date().toLocaleString('pt-PT')}`, 20, 30)
  
  // Estatísticas
  const availableCakes = cakes.filter(cake => cake.available).length
  const avgPrice = cakes.length > 0 ? cakes.reduce((sum, cake) => sum + cake.price, 0) / cakes.length : 0
  
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text('Resumo do Catálogo:', 20, 45)
  
  doc.setFontSize(10)
  doc.text(`Total de Bolos: ${cakes.length}`, 20, 55)
  doc.text(`Bolos Disponíveis: ${availableCakes}`, 20, 62)
  doc.text(`Preço Médio: € ${avgPrice.toFixed(2)}`, 20, 69)
  
  // Tabela de bolos
  const tableData = cakes.map(cake => [
    cake.name,
    cake.category,
    `€ ${cake.price.toFixed(2)}`,
    cake.available ? 'Sim' : 'Não',
    cake.description.substring(0, 50) + (cake.description.length > 50 ? '...' : ''),
    new Date(cake.createdAt).toLocaleDateString('pt-PT')
  ])
  
  autoTable(doc, {
    head: [['Nome', 'Categoria', 'Preço', 'Disponível', 'Descrição', 'Criado em']],
    body: tableData,
    startY: 80,
    styles: {
      fontSize: 8,
      cellPadding: 3
    },
    headStyles: {
      fillColor: [218, 165, 32],
      textColor: [255, 255, 255]
    },
    alternateRowStyles: {
      fillColor: [248, 248, 248]
    }
  })
  
  doc.save(`maria-gulosa-bolos-${new Date().toISOString().split('T')[0]}.pdf`)
}

// Exportar pedidos para Excel
export const exportOrdersToExcel = (orders: OrderData[], stats: StatsData) => {
  // Validar dados de entrada
  if (!orders || !Array.isArray(orders)) {
    throw new Error('Dados de pedidos inválidos')
  }
  if (!stats) {
    throw new Error('Dados de estatísticas inválidos')
  }

  // Planilha de pedidos
  const ordersData = orders.map(order => ({
    'Número do Pedido': order.orderNumber,
    'Nome do Cliente': order.customerInfo?.name || 'N/A',
    'Telefone': order.customerInfo?.phone || 'N/A',
    'Email': order.customerInfo?.email || 'N/A',
    'Itens': order.items.map(item => `${item.cakeName} (${item.quantity}x)`).join(', '),
    'Valor Total': order.totalPrice,
    'Status': order.status,
    'Data do Pedido': new Date(order.createdAt).toLocaleDateString('pt-PT'),
    'Data de Entrega': order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString('pt-PT') : 'N/A',
    'Observações': order.notes || 'N/A'
  }))
  
  // Planilha de estatísticas
  const statsData = [
    { 'Métrica': 'Total de Pedidos', 'Valor': stats.totalOrders },
    { 'Métrica': 'Pedidos Hoje', 'Valor': stats.todayOrders },
    { 'Métrica': 'Receita Total', 'Valor': `€ ${stats.totalRevenue.toFixed(2)}` },
    { 'Métrica': 'Receita Hoje', 'Valor': `€ ${stats.todayRevenue.toFixed(2)}` },
    { 'Métrica': 'Total de Bolos', 'Valor': stats.totalCakes },
    { 'Métrica': 'Bolos Disponíveis', 'Valor': stats.availableCakes }
  ]
  
  // Criar workbook
  const wb = XLSX.utils.book_new()
  
  // Adicionar planilhas
  const wsOrders = XLSX.utils.json_to_sheet(ordersData)
  const wsStats = XLSX.utils.json_to_sheet(statsData)
  
  XLSX.utils.book_append_sheet(wb, wsOrders, 'Pedidos')
  XLSX.utils.book_append_sheet(wb, wsStats, 'Estatísticas')
  
  // Salvar arquivo
  const fileName = `maria-gulosa-dados-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, fileName)
}

// Exportar bolos para Excel
export const exportCakesToExcel = (cakes: CakeData[]) => {
  // Validar dados de entrada
  if (!cakes || !Array.isArray(cakes)) {
    throw new Error('Dados de bolos inválidos')
  }

  const cakesData = cakes.map(cake => ({
    'ID': cake.id,
    'Nome': cake.name,
    'Preço': cake.price,
    'Categoria': cake.category,
    'Disponível': cake.available ? 'Sim' : 'Não',
    'Descrição': cake.description,
    'Criado em': new Date(cake.createdAt).toLocaleDateString('pt-PT')
  }))
  
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(cakesData)
  
  XLSX.utils.book_append_sheet(wb, ws, 'Bolos')
  
  const fileName = `maria-gulosa-bolos-${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, fileName)
}

// Exportar relatório completo
export const exportCompleteReport = (orders: OrderData[], _cakes: CakeData[], stats: StatsData) => {
  // PDF completo
  const doc = new jsPDF()
  
  // Página 1 - Capa e Resumo
  doc.setFontSize(24)
  doc.setTextColor(139, 69, 19)
  doc.text('Maria Gulosa', 105, 50, { align: 'center' })
  
  doc.setFontSize(18)
  doc.text('Relatório Completo de Gestão', 105, 70, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setTextColor(100, 100, 100)
  doc.text(`Período: ${new Date().toLocaleDateString('pt-PT')}`, 105, 90, { align: 'center' })
  
  // Resumo executivo
  doc.setFontSize(16)
  doc.setTextColor(0, 0, 0)
  doc.text('Resumo Executivo', 20, 120)
  
  doc.setFontSize(12)
  const summary = [
    `• Total de Pedidos: ${stats.totalOrders}`,
    `• Receita Total: € ${stats.totalRevenue.toFixed(2)}`,
    `• Bolos no Catálogo: ${stats.totalCakes}`,
    `• Taxa de Disponibilidade: ${((stats.availableCakes / stats.totalCakes) * 100).toFixed(1)}%`
  ]
  
  summary.forEach((line, index) => {
    doc.text(line, 20, 135 + (index * 10))
  })
  
  // Nova página para pedidos
  doc.addPage()
  doc.setFontSize(16)
  doc.text('Detalhes dos Pedidos', 20, 20)
  
  // Tabela de pedidos (versão resumida)
  const ordersTableData = orders.slice(0, 20).map(order => [
    order.orderNumber,
    order.customerInfo?.name || 'N/A',
    `€ ${order.totalPrice.toFixed(2)}`,
    order.status,
    new Date(order.createdAt).toLocaleDateString('pt-PT')
  ])
  
  autoTable(doc, {
    head: [['Pedido', 'Cliente', 'Total', 'Status', 'Data']],
    body: ordersTableData,
    startY: 30,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [218, 165, 32] }
  })
  
  doc.save(`maria-gulosa-relatorio-completo-${new Date().toISOString().split('T')[0]}.pdf`)
} 