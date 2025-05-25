# 🔥 Firebase + Vercel - Configuração Otimizada

## ✅ **Configuração Atual**

O projeto está **100% otimizado** para usar Firebase com Vercel:

- ✅ **API Routes** integradas com Firebase Firestore
- ✅ **Configuração automática** via variáveis de ambiente
- ✅ **Fallback para dados padrão** se Firebase estiver vazio
- ✅ **Estatísticas em tempo real** calculadas do Firebase

## 🔧 **Variáveis de Ambiente no Vercel**

### 1. **No painel do Vercel:**
- Vá em **Settings** → **Environment Variables**
- Adicione as seguintes variáveis:

```env
FIREBASE_API_KEY=AIzaSyCRyLCgUClshxZqQ3ZTRHx-6j26ucwVoRs
FIREBASE_AUTH_DOMAIN=maria-gulosa-b460f.firebaseapp.com
FIREBASE_PROJECT_ID=maria-gulosa-b460f
FIREBASE_STORAGE_BUCKET=maria-gulosa-b460f.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=373372889835
FIREBASE_APP_ID=1:373372889835:web:0577d99b04c94e75112cae
```

### 2. **Configuração Automática**
- ✅ Se as variáveis não estiverem definidas, usa valores padrão
- ✅ Funciona imediatamente após deploy
- ✅ Sem necessidade de configuração manual

## 🗄️ **Estrutura do Firebase**

### Coleções criadas automaticamente:

#### **`cakes`** - Catálogo de bolos
```javascript
{
  name: "Bolo de Chocolate",
  description: "Delicioso bolo de chocolate...",
  price: "€ 25,00",
  image: "/cake-chocolate.jpg",
  category: "chocolate",
  available: true,
  createdAt: "2024-12-25T10:00:00.000Z",
  updatedAt: "2024-12-25T10:00:00.000Z"
}
```

#### **`orders`** - Pedidos dos clientes
```javascript
{
  orderNumber: "MG2412251234",
  items: [
    {
      cakeName: "Bolo de Chocolate",
      quantity: 1,
      unitPrice: 25.00,
      subtotal: 25.00
    }
  ],
  totalItems: 1,
  totalPrice: 25.00,
  customerInfo: {
    phone: "351914019142",
    name: "Cliente",
    email: ""
  },
  whatsappMessage: "Olá! Gostaria de encomendar...",
  notes: "Pedido feito através do site",
  status: "pendente",
  createdAt: "2024-12-25T10:00:00.000Z",
  updatedAt: "2024-12-25T10:00:00.000Z"
}
```

## 🚀 **APIs Funcionais**

### **GET /api/cakes**
- ✅ Busca bolos do Firebase
- ✅ Se vazio, retorna catálogo padrão (6 bolos)
- ✅ Resposta inclui `source: 'firebase'` ou `source: 'default'`

### **POST /api/cakes**
- ✅ Adiciona novos bolos ao Firebase
- ✅ Validação automática de dados
- ✅ Timestamps automáticos

### **GET /api/orders**
- ✅ Lista pedidos do Firebase (ordenados por data)
- ✅ Suporte a paginação (`?limit=10`)
- ✅ Dados em tempo real

### **POST /api/orders**
- ✅ Cria pedidos no Firebase
- ✅ Gera número único automaticamente
- ✅ Calcula totais automaticamente
- ✅ Integração com WhatsApp mantida

### **GET /api/stats**
- ✅ Estatísticas calculadas em tempo real
- ✅ Total de pedidos e receita
- ✅ Pedidos de hoje
- ✅ Breakdown por status
- ✅ Bolos mais populares

## 🔒 **Regras de Segurança Firebase**

### **Configuração Recomendada:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bolos - apenas leitura pública
    match /cakes/{cakeId} {
      allow read: if true;
      allow write: if false; // Apenas via API
    }
    
    // Pedidos - apenas criação pública
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if false; // Apenas via API
    }
  }
}
```

## 📊 **Painel Admin**

### **Funcionalidades:**
- ✅ **Estatísticas em tempo real** do Firebase
- ✅ **Lista de pedidos** atualizada automaticamente
- ✅ **Breakdown por status** calculado dinamicamente
- ✅ **Bolos mais populares** baseado em pedidos reais

### **Login:**
- **Usuário:** `maria`
- **Senha:** `gulosa123`

## 🎯 **Vantagens da Otimização**

### **Performance:**
- ✅ **Dados em tempo real** sem cache desnecessário
- ✅ **Consultas otimizadas** com índices automáticos
- ✅ **Fallback inteligente** para dados padrão

### **Escalabilidade:**
- ✅ **Serverless** - escala automaticamente
- ✅ **Firebase** - suporta milhões de operações
- ✅ **Vercel** - CDN global automático

### **Manutenção:**
- ✅ **Zero configuração** após deploy
- ✅ **Logs automáticos** no Vercel
- ✅ **Backup automático** no Firebase

## 🚀 **Deploy**

### **1. Fazer push das mudanças:**
```bash
git add .
git commit -m "🔥 Otimização Firebase + Vercel"
git push
```

### **2. Deploy automático no Vercel:**
- ✅ Detecta mudanças automaticamente
- ✅ Instala dependências Firebase
- ✅ Configura API Routes
- ✅ Aplica variáveis de ambiente

### **3. Resultado:**
- **Site:** `https://mariagulosa.vercel.app`
- **API:** `https://mariagulosa.vercel.app/api/cakes`
- **Firebase:** Integração automática

---

**🎉 Sistema 100% otimizado e pronto para produção!** 