# 🎂 Maria Gulosa - Bolos Artesanais

Site completo para a confeitaria Maria Gulosa, especializada em bolos artesanais deliciosos.

## 🌟 Funcionalidades

- ✅ **Catálogo de Bolos**: 6 bolos artesanais únicos
- ✅ **Carrinho de Compras**: Sistema completo de encomendas
- ✅ **Integração WhatsApp**: Pedidos enviados diretamente
- ✅ **Painel Admin**: Gestão de pedidos e estatísticas
- ✅ **Design Responsivo**: Funciona em todos os dispositivos
- ✅ **Performance Otimizada**: Carregamento rápido

## 🏗️ Tecnologias

### Frontend
- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **Framer Motion** (animações)
- **Lucide React** (ícones)

### Backend
- **Vercel API Routes** (serverless)
- **Firebase Firestore** (banco de dados)
- **JavaScript ES6+**
- **CORS** configurado

### Deploy
- **Vercel** (frontend + backend)
- **Firebase** (banco de dados)
- **GitHub** (controle de versão)

## 🚀 Deploy

Este projeto está configurado para deploy automático no **Vercel**.

### Estrutura do Projeto
```
mariagulosa/
├── frontend/          # React app
│   ├── src/
│   ├── public/
│   └── package.json
├── api/              # Backend API Routes + Firebase
│   ├── cakes.js      # Catálogo de bolos
│   ├── orders.js     # Sistema de pedidos
│   └── stats.js      # Estatísticas admin
├── lib/              # Utilitários
│   └── firebase.js   # Configuração Firebase
├── vercel.json       # Configuração Vercel
└── package.json      # Scripts principais
```

### URLs da API
- `/api/cakes` - Lista todos os bolos
- `/api/orders` - Criar e listar pedidos
- `/api/stats` - Estatísticas para admin

## 📱 Páginas

- **Home** (`/`) - Página inicial com apresentação
- **Catálogo** (`/catalog`) - Todos os bolos disponíveis
- **Admin** (`/admin`) - Painel administrativo (maria/gulosa123)

## 🎂 Catálogo de Bolos

1. **Bolo de Chocolate** - € 25,00
2. **Bolo de Morango** - € 28,00
3. **Bolo de Cenoura** - € 22,00
4. **Bolo Red Velvet** - € 32,00
5. **Bolo de Limão** - € 26,00
6. **Bolo de Coco** - € 24,00

## 📞 Contato

- **WhatsApp**: +351 914 019 142
- **Pedidos**: Através do site com redirecionamento automático

## 🔧 Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Desenvolvimento com Vercel
npm run dev

# Build para produção
npm run build
```

## 📄 Licença

MIT License - Projeto desenvolvido para Maria Gulosa

---

**🎉 Site pronto para produção no Vercel!** 