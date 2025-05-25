# 🚀 Como Usar o Site da Maria Gulosa

## ⚡ Início Rápido

### 1. Instalar Dependências
```bash
npm run install:all
```

### 2. Executar o Projeto
```bash
npm run dev
```

Isso irá iniciar:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:5000

## 📱 Navegação do Site

### 🏠 Página Inicial
- Apresentação da Maria Gulosa
- Bolos em destaque
- Depoimentos de clientes
- Botões para WhatsApp

### 📋 Cardápio (/cardapio)
- Todos os bolos disponíveis
- Filtros por categoria:
  - Todos os Bolos
  - Chocolate
  - Frutas
  - Tradicionais
  - Especiais
- Busca por nome ou descrição
- Clique no carrinho para pedir via WhatsApp

### 👨‍💼 Admin (/admin)
- **Usuário**: maria
- **Senha**: gulosa123
- Dashboard com estatísticas
- Visão geral de pedidos

## 📱 Funcionalidades WhatsApp

### Botões de Pedido
1. Clique no ícone do carrinho em qualquer bolo
2. Será aberto o WhatsApp com mensagem pré-formatada
3. Inclui nome do bolo e preço automaticamente

### Links Fixos
- **WhatsApp**: Botão verde flutuante (canto inferior direito)
- **Instagram**: Botão roxo/rosa flutuante

## 🎨 Personalização

### Alterar Número do WhatsApp
Edite nos arquivos:
- `frontend/src/components/Header.tsx`
- `frontend/src/components/SocialLinks.tsx`
- `frontend/src/components/CakeCard.tsx`
- `frontend/src/pages/Home.tsx`

Número atual: `351914019142` (Portugal)

### Alterar Instagram
Edite em `frontend/src/components/SocialLinks.tsx`:
```javascript
href="https://instagram.com/mariagulosa_sabores"
```

### Adicionar Novos Bolos
Edite `frontend/src/pages/Catalog.tsx` no array `allCakes`.

### Alterar Moeda
Os preços estão configurados em **Euros (€)**. Para alterar:
1. Edite `frontend/src/config/currency.ts` para mudar a moeda
2. Atualize os preços em `frontend/src/pages/Catalog.tsx` e `frontend/src/pages/Home.tsx`
3. Use as funções utilitárias em `frontend/src/utils/currency.ts` para formatação

## 🔧 Configuração Avançada

### MongoDB (Opcional)
1. Crie um arquivo `.env` em `backend/`
2. Adicione: `MONGODB_URI=sua_string_de_conexao`
3. Reinicie o backend

### Customizar Cores
Edite `frontend/tailwind.config.js` na seção `colors`.

### Adicionar Novas Páginas
1. Crie arquivo em `frontend/src/pages/`
2. Adicione rota em `frontend/src/App.tsx`
3. Adicione link no `Header.tsx`

## 🚀 Deploy

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
```

### Backend (Heroku/Railway)
```bash
cd backend
# Configure variáveis de ambiente
# Deploy conforme plataforma escolhida
```

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se Node.js está instalado
2. Execute `npm run install:all` novamente
3. Verifique se as portas 5173 e 5000 estão livres
4. Consulte o README.md para mais detalhes

---

**🎂 Bom uso do site da Maria Gulosa!** 