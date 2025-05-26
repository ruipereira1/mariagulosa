# 🔗 Conexão Admin ↔ Sistema de Encomendas

## 📊 **Fluxo Completo de Dados**

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   PÁGINA WEB    │    │   APIs VERCEL    │    │  FIREBASE DB    │
│   (Frontend)    │    │   (Backend)      │    │   (Database)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  CartSummary    │───▶│  /api/orders     │───▶│  orders/        │
│  (Criar Pedido) │    │  (POST)          │    │  collection     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   WhatsApp      │    │  /api/stats      │    │  Dados          │
│   (Notificação) │    │  (GET)           │    │  Agregados      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  PÁGINA ADMIN   │◀───│  /api/orders     │◀───│  orders/        │
│  (Visualizar)   │    │  (GET)           │    │  collection     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Atualizar      │───▶│ /api/update-order│───▶│  Atualizar      │
│  Status         │    │  (PUT)           │    │  Documento      │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛒 **1. Criação de Pedidos (Frontend → Admin)**

### **Passo 1: Cliente Adiciona Itens ao Carrinho**
```typescript
// frontend/src/components/CakeCard.tsx
const handleAddToCart = () => {
  addItem({
    id: cake.id,
    name: cake.name,
    price: cake.price,
    image: cake.image
  })
}
```

### **Passo 2: Cliente Finaliza Pedido**
```typescript
// frontend/src/components/CartSummary.tsx
const handleSendToWhatsApp = async () => {
  // 1. Preparar dados do pedido
  const orderData = {
    items: items.map(item => ({
      cakeName: item.name,
      quantity: item.quantity,
      unitPrice: parseFloat(item.price.replace(/[€\s]/g, '').replace(',', '.')),
      subtotal: parseFloat(item.price.replace(/[€\s]/g, '').replace(',', '.')) * item.quantity
    })),
    customerInfo: {
      phone: CONTACTS.whatsapp.number
    },
    whatsappMessage: message,
    notes: "Pedido feito através do site"
  }
  
  // 2. Salvar no backend
  const response = await fetch(API_ENDPOINTS.orders, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  })
  
  // 3. Abrir WhatsApp
  const whatsappUrl = `${CONTACTS.whatsapp.url}?text=${encodeURIComponent(message)}`
  window.open(whatsappUrl, '_blank')
}
```

### **Passo 3: API Salva no Firebase**
```javascript
// api/orders.js
export default async function handler(req, res) {
  if (req.method === 'POST') {
    // 1. Gerar número único do pedido
    const orderNumber = `MG${year}${month}${day}${timestamp}`
    
    // 2. Criar objeto do pedido
    const order = {
      orderNumber,
      items: orderData.items,
      totalItems,
      totalPrice,
      customerInfo: orderData.customerInfo,
      status: 'pendente',
      createdAt: now.toISOString()
    }
    
    // 3. Salvar no Firebase
    const ordersRef = collection(db, 'orders')
    const docRef = await addDoc(ordersRef, order)
    
    return res.json({ success: true, order })
  }
}
```

## 👨‍💼 **2. Visualização no Admin**

### **Passo 1: Admin Faz Login**
```typescript
// frontend/src/pages/Admin.tsx
const handleLogin = (e: React.FormEvent) => {
  if (credentials.username === 'maria' && credentials.password === 'julho2010') {
    setIsLoggedIn(true)
    loadDashboardData() // Carrega dados automaticamente
  }
}
```

### **Passo 2: Carregamento de Dados**
```typescript
// frontend/src/pages/Admin.tsx
const loadDashboardData = async () => {
  // 1. Buscar estatísticas
  const statsResponse = await fetch(API_ENDPOINTS.stats)
  const statsData = await statsResponse.json()
  setStats(statsData.stats)
  
  // 2. Buscar pedidos recentes
  const ordersResponse = await fetch(`${API_ENDPOINTS.orders}?limit=10`)
  const ordersData = await ordersResponse.json()
  setOrders(ordersData.orders)
}
```

### **Passo 3: APIs Retornam Dados do Firebase**
```javascript
// api/orders.js (GET)
if (req.method === 'GET') {
  const ordersRef = collection(db, 'orders')
  const q = query(ordersRef, orderBy('createdAt', 'desc'), limit(10))
  const snapshot = await getDocs(q)
  
  const orders = []
  snapshot.forEach((doc) => {
    orders.push({ id: doc.id, ...doc.data() })
  })
  
  return res.json({ success: true, orders })
}
```

## 🔄 **3. Atualização de Status (Admin → Sistema)**

### **Passo 1: Admin Clica em Botão de Status**
```typescript
// frontend/src/pages/Admin.tsx
<button onClick={() => handleUpdateOrderStatus(order.orderNumber, 'confirmado')}>
  Confirmar
</button>
```

### **Passo 2: Função de Atualização**
```typescript
const handleUpdateOrderStatus = async (orderNumber: string, newStatus: string) => {
  const response = await fetch(API_ENDPOINTS.updateOrder, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderNumber, status: newStatus })
  })
  
  if (response.ok) {
    // Atualizar lista local
    setOrders(orders.map(order => 
      order.orderNumber === orderNumber 
        ? { ...order, status: newStatus }
        : order
    ))
  }
}
```

### **Passo 3: API Atualiza Firebase**
```javascript
// api/update-order.js
export default async function handler(req, res) {
  if (req.method === 'PUT') {
    // 1. Buscar pedido pelo orderNumber
    const ordersRef = collection(db, 'orders')
    const q = query(ordersRef, where('orderNumber', '==', orderNumber))
    const querySnapshot = await getDocs(q)
    
    // 2. Atualizar documento
    const orderDoc = querySnapshot.docs[0]
    const orderRef = doc(db, 'orders', orderDoc.id)
    
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    })
    
    return res.json({ success: true })
  }
}
```

## 📊 **4. Estatísticas em Tempo Real**

### **API de Estatísticas**
```javascript
// api/stats.js
export default async function handler(req, res) {
  // 1. Buscar todos os pedidos
  const ordersSnapshot = await getDocs(collection(db, 'orders'))
  
  // 2. Calcular estatísticas
  let totalRevenue = 0
  const statusBreakdown = {}
  
  ordersSnapshot.forEach((doc) => {
    const order = doc.data()
    totalRevenue += order.totalPrice || 0
    statusBreakdown[order.status] = (statusBreakdown[order.status] || 0) + 1
  })
  
  // 3. Retornar dados agregados
  return res.json({
    success: true,
    stats: {
      totalOrders: ordersSnapshot.size,
      totalRevenue,
      statusBreakdown: Object.entries(statusBreakdown).map(([status, count]) => ({
        _id: status,
        count
      }))
    }
  })
}
```

## 🔗 **5. Endpoints de Conexão**

### **Configuração Centralizada**
```typescript
// frontend/src/config/api.ts
export const API_ENDPOINTS = {
  cakes: `${API_BASE_URL}/api/cakes`,
  orders: `${API_BASE_URL}/api/orders`,        // GET/POST pedidos
  stats: `${API_BASE_URL}/api/stats`,          // GET estatísticas
  updateOrder: `${API_BASE_URL}/api/update-order`, // PUT atualizar status
  manageCakes: `${API_BASE_URL}/api/manage-cakes`  // Gerenciar catálogo
}
```

## 📱 **6. Integração WhatsApp**

### **Notificação Automática**
```typescript
// Quando pedido é criado, cliente é redirecionado para WhatsApp
const whatsappUrl = `${CONTACTS.whatsapp.url}?text=${encodeURIComponent(message)}`
window.open(whatsappUrl, '_blank')

// Admin pode responder diretamente do painel
<button onClick={() => window.open(`https://wa.me/${order.customerInfo?.phone}`)}>
  WhatsApp
</button>
```

## 🔄 **7. Fluxo de Estados do Pedido**

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  PENDENTE   │───▶│ CONFIRMADO  │───▶│   PRONTO    │───▶│  ENTREGUE   │
│ (Inicial)   │    │ (Admin)     │    │ (Admin)     │    │ (Admin)     │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       │                                                        ▲
       ▼                                                        │
┌─────────────┐                                                 │
│ CANCELADO   │─────────────────────────────────────────────────┘
│ (Admin)     │
└─────────────┘
```

## 🎯 **Resumo da Conexão**

1. **Cliente** adiciona itens ao carrinho no site
2. **CartSummary** envia pedido para API `/api/orders` (POST)
3. **API** salva no Firebase e gera número único
4. **Cliente** é redirecionado para WhatsApp
5. **Admin** visualiza pedidos em tempo real via `/api/orders` (GET)
6. **Admin** atualiza status via `/api/update-order` (PUT)
7. **Estatísticas** são calculadas em tempo real via `/api/stats` (GET)

**🔑 Pontos-chave:**
- ✅ **Dados centralizados** no Firebase
- ✅ **APIs RESTful** para comunicação
- ✅ **Tempo real** via polling automático
- ✅ **Estados sincronizados** entre frontend e backend
- ✅ **Integração WhatsApp** para notificações 