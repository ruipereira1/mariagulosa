# 🚀 Deploy do Backend no Railway

## Por que Railway?

- ✅ **Gratuito** para começar ($5 de crédito mensal)
- ✅ Deploy automático via Git
- ✅ Suporta Node.js + MongoDB
- ✅ Configuração super simples
- ✅ URL automática gerada
- ✅ Logs em tempo real
- ✅ Variáveis de ambiente fáceis

## 📋 Preparação do Backend

### 1. Verificar arquivos necessários

Seu backend precisa ter:
- ✅ `package.json` com script `start`
- ✅ Arquivo principal (ex: `server.js`)
- ✅ Configuração de porta dinâmica

### 2. Configurar porta dinâmica

No seu `server.js` ou `server-firebase.js`:

```javascript
// Usar porta do Railway ou 5000 local
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
```

### 3. Configurar variáveis de ambiente

Criar arquivo `.env.example` no backend:
```
# MongoDB
MONGODB_URI=sua-string-de-conexao-mongodb

# Firebase (se usando)
FIREBASE_PROJECT_ID=maria-gulosa-b460f
FIREBASE_PRIVATE_KEY=sua-chave-privada
FIREBASE_CLIENT_EMAIL=seu-email-cliente

# Outras configurações
NODE_ENV=production
```

## 🚀 Deploy no Railway

### Passo 1: Criar conta
1. Acesse [railway.app](https://railway.app)
2. Faça login com GitHub
3. Conecte seu repositório

### Passo 2: Novo projeto
1. Clique em "New Project"
2. Escolha "Deploy from GitHub repo"
3. Selecione seu repositório
4. Escolha a pasta `backend` (se necessário)

### Passo 3: Configurar variáveis
1. No painel do Railway
2. Vá em "Variables"
3. Adicione suas variáveis de ambiente:
   - `MONGODB_URI`
   - `FIREBASE_PROJECT_ID`
   - etc.

### Passo 4: Deploy automático
- ✅ Railway detecta automaticamente que é Node.js
- ✅ Instala dependências (`npm install`)
- ✅ Executa `npm start`
- ✅ Gera URL automática

## 🔗 Configurar Frontend

Após deploy do backend:

1. **Copiar URL do Railway** (ex: `https://maria-gulosa-api.railway.app`)

2. **Configurar no Netlify:**
   - Environment variables → `VITE_API_BASE_URL`
   - Valor: URL do Railway

3. **Ou editar diretamente:**
   ```typescript
   // frontend/src/config/api.ts
   const API_CONFIG = {
     production: {
       baseURL: 'https://maria-gulosa-api.railway.app',
     }
   }
   ```

## 🔧 Configurações Avançadas

### Custom Domain
- Railway permite domínio personalizado
- Ex: `api.mariagulosa.com`

### Monitoramento
- Logs em tempo real
- Métricas de uso
- Alertas automáticos

### Scaling
- Escala automaticamente
- Paga apenas pelo que usar

## 🐛 Troubleshooting

### Backend não inicia
1. Verificar logs no Railway
2. Confirmar script `start` no `package.json`
3. Verificar porta dinâmica

### Erro de CORS
Configurar CORS no backend:
```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://maria-gulosa.netlify.app'
  ]
}));
```

### MongoDB não conecta
1. Verificar `MONGODB_URI` nas variáveis
2. Confirmar IP whitelist no MongoDB Atlas
3. Testar conexão local primeiro

## 💰 Custos

### Plano Gratuito
- $5 de crédito mensal
- Suficiente para sites pequenos
- Sem hibernação

### Plano Pago
- $5/mês por serviço ativo
- Recursos ilimitados
- Suporte prioritário

## 🎯 Resultado Final

Após deploy completo:
- **Frontend**: `https://maria-gulosa.netlify.app`
- **Backend**: `https://maria-gulosa-api.railway.app`
- **Integração**: Funcionando perfeitamente

## 📱 Teste Final

1. ✅ API responde: `https://sua-api.railway.app/api/cakes`
2. ✅ Frontend conecta com backend
3. ✅ Pedidos são salvos
4. ✅ Admin funciona
5. ✅ WhatsApp integrado

---

**Railway é a melhor opção para seu backend Node.js!** 🚀 