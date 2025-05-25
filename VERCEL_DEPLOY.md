# 🚀 Deploy Completo no Vercel (Frontend + Backend)

## ✅ Por que Vercel?

- ✅ **Frontend + Backend** no mesmo projeto
- ✅ **Gratuito** para projetos pessoais
- ✅ Deploy automático via Git
- ✅ API Routes serverless
- ✅ Domínio automático (.vercel.app)
- ✅ HTTPS automático
- ✅ Performance excelente
- ✅ Fácil configuração

## 🏗️ Estrutura do Projeto

```
site/
├── frontend/          # React app
│   ├── src/
│   ├── package.json
│   └── ...
├── api/              # Backend API Routes (NOVO)
│   ├── cakes.js
│   ├── orders.js
│   ├── stats.js
│   └── ...
├── vercel.json       # Configuração (NOVO)
└── package.json      # Root package.json (NOVO)
```

## 📋 Preparação

### 1. Mover backend para API Routes

O Vercel usa **API Routes** em vez de servidor Express tradicional.
Vamos converter seu backend Express para API Routes.

### 2. Configurar estrutura

- Frontend fica em `/frontend`
- Backend vira API Routes em `/api`
- Configuração no `vercel.json`

## 🔧 Configuração

### 1. Criar vercel.json na raiz

```json
{
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "functions": {
    "api/*.js": {
      "maxDuration": 10
    }
  }
}
```

### 2. Package.json na raiz

```json
{
  "name": "maria-gulosa",
  "version": "1.0.0",
  "scripts": {
    "build": "cd frontend && npm install && npm run build",
    "dev": "vercel dev"
  }
}
```

## 🔄 Converter Backend para API Routes

### Exemplo: api/cakes.js
```javascript
// api/cakes.js
export default async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    // Lógica para buscar bolos
    const cakes = [
      {
        id: 1,
        name: "Bolo de Chocolate",
        price: "€ 25,00",
        image: "/cake-chocolate.jpg"
      },
      // ... outros bolos
    ];
    
    return res.status(200).json({
      success: true,
      cakes
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
```

### Exemplo: api/orders.js
```javascript
// api/orders.js
import { connectToDatabase } from '../lib/mongodb'; // Se usar MongoDB

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const orderData = req.body;
      
      // Gerar número do pedido
      const orderNumber = `MG${Date.now()}`;
      
      const order = {
        ...orderData,
        orderNumber,
        status: 'pendente',
        createdAt: new Date()
      };

      // Salvar no banco (Firebase/MongoDB)
      // const db = await connectToDatabase();
      // await db.collection('orders').insertOne(order);

      return res.status(200).json({
        success: true,
        order
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
```

## 🔗 Atualizar Frontend

### Configurar URLs da API

```typescript
// frontend/src/config/api.ts
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:3000', // Vercel dev
  },
  production: {
    baseURL: '', // Mesmo domínio no Vercel
  }
}

export const API_ENDPOINTS = {
  cakes: `${API_BASE_URL}/api/cakes`,
  orders: `${API_BASE_URL}/api/orders`,
  stats: `${API_BASE_URL}/api/stats`,
}
```

## 🚀 Deploy

### Passo 1: Preparar repositório
```bash
git add .
git commit -m "Configurar para Vercel"
git push
```

### Passo 2: Conectar ao Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Login com GitHub
3. "New Project"
4. Selecione seu repositório
5. **Deploy automático!**

### Passo 3: Configurar variáveis
- No painel Vercel: Settings → Environment Variables
- Adicionar variáveis do Firebase/MongoDB

## 🎯 Vantagens do Vercel

### Performance
- ✅ CDN global
- ✅ Edge functions
- ✅ Cache automático
- ✅ Otimização de imagens

### Desenvolvimento
- ✅ `vercel dev` para desenvolvimento local
- ✅ Preview deployments
- ✅ Rollback fácil

### Custos
- ✅ **Gratuito** para projetos pessoais
- ✅ 100GB bandwidth/mês
- ✅ Domínio .vercel.app incluído

## 🔄 Migração Passo a Passo

Quer que eu converta seu backend atual para API Routes do Vercel?

1. ✅ Criar estrutura de pastas
2. ✅ Converter rotas Express para API Routes
3. ✅ Configurar vercel.json
4. ✅ Atualizar frontend
5. ✅ Testar localmente
6. ✅ Deploy

## 🎉 Resultado Final

- **URL única**: `https://maria-gulosa.vercel.app`
- **Frontend**: `https://maria-gulosa.vercel.app`
- **API**: `https://maria-gulosa.vercel.app/api/cakes`
- **Admin**: `https://maria-gulosa.vercel.app/admin`

---

**Vercel = Solução completa em um só lugar!** 🚀

Quer que eu configure tudo para o Vercel agora? 