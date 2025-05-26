# 🎂 Maria Gulosa - Confeitaria Online

Sistema completo de confeitaria com catálogo de bolos, carrinho de compras e painel administrativo otimizado.

## 🌟 Funcionalidades

### **🛍️ Loja Online**
- ✅ **Catálogo Interativo**: 6 bolos artesanais com filtros
- ✅ **Carrinho Inteligente**: Sistema completo de encomendas
- ✅ **WhatsApp Integration**: Pedidos enviados automaticamente
- ✅ **Design Responsivo**: Funciona em todos os dispositivos
- ✅ **Performance Otimizada**: Bundle splitting + lazy loading

### **👨‍💼 Painel Administrativo**
- ✅ **Dashboard em Tempo Real**: Estatísticas e métricas
- ✅ **Gestão de Bolos**: CRUD completo do catálogo
- ✅ **Controle de Pedidos**: Status e acompanhamento
- ✅ **Exportação**: Relatórios em PDF e Excel
- ✅ **Sistema de Fallback**: Funciona mesmo offline

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
- `/api/manage-cakes` - CRUD completo de bolos
- `/api/orders` - Criar e listar pedidos
- `/api/stats` - Estatísticas para admin
- `/api/update-order` - Atualizar status de pedidos

## 📱 Páginas

- **Home** (`/`) - Página inicial com apresentação
- **Catálogo** (`/catalog`) - Todos os bolos disponíveis
- **Admin** (`/admin`) - Painel administrativo

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
# 1. Instalar dependências
npm install

# 2. Configurar Firebase (OBRIGATÓRIO)
# Windows:
./setup-firebase.ps1
# Linux/Mac:
chmod +x setup-firebase.sh && ./setup-firebase.sh

# 3. Configurar Vercel
vercel link --yes

# 4. Desenvolvimento local
npm run dev
# ou
vercel dev

# 5. Build para produção
npm run build

# 6. Deploy
vercel --prod
```

## 🔒 **Configuração de Segurança**

### **Firebase (Obrigatório)**
```bash
# Configuração automática
./setup-firebase.ps1  # Windows
./setup-firebase.sh   # Linux/Mac

# Ou manual
cp firebase.env.template .env.local
```

### **Vercel (Produção)**
Configure as variáveis de ambiente no dashboard:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 🚨 Resolução de Problemas

### **Erro: "Unexpected token 'T'"**
- **Causa**: API retornando HTML em vez de JSON
- **Solução**: Sistema de fallback automático ativo
- **Debug**: Verificar console do navegador (F12)
- **Documentação**: Ver `API_TROUBLESHOOTING.md`

### **APIs não funcionando**
```bash
# Verificar deploy
vercel ls

# Testar endpoints
curl https://seu-site.vercel.app/api/manage-cakes

# Verificar logs
vercel logs
```

## 🔒 Segurança

Este projeto segue as melhores práticas de segurança:
- ✅ Secrets protegidos com variáveis de ambiente
- ✅ Validação de configuração obrigatória
- ✅ .gitignore configurado corretamente

Para mais detalhes, consulte [SECURITY.md](./SECURITY.md)

## 📄 Licença

MIT License - Projeto desenvolvido para Maria Gulosa

---

**🎉 Site pronto para produção no Vercel!** 