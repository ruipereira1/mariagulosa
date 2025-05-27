# 🚀 Configuração Manual Vercel - Maria Gulosa

## 🔧 **Como Configurar Variáveis de Ambiente no Vercel Dashboard**

### **Passo 1: Acessar Dashboard**
1. Acesse: https://vercel.com/dashboard
2. Encontre o projeto: `site` ou `maria-gulosa`
3. Clique em **Settings**
4. Vá para **Environment Variables**

### **Passo 2: Adicionar Variáveis**
Adicione cada variável com os valores abaixo:

| Nome da Variável | Valor | Ambiente |
|------------------|-------|----------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyCRyLCgUClshxZqQ3ZTRHx-6j26ucwVoRs` | Production |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `maria-gulosa-b460f.firebaseapp.com` | Production |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `maria-gulosa-b460f` | Production |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `maria-gulosa-b460f.firebasestorage.app` | Production |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `373372889835` | Production |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:373372889835:web:0577d99b04c94e75112cae` | Production |

### **Passo 3: Fazer Redeploy**
1. Após adicionar todas as variáveis
2. Vá para **Deployments**
3. Clique nos **3 pontos** do último deploy
4. Selecione **Redeploy**

### **Passo 4: Verificar**
- Acesse: https://seu-projeto.vercel.app/admin
- Verifique se carrega sem erros
- Console do navegador deve mostrar: "✅ Firebase initialized"

## 🔍 **Troubleshooting**

### **Se ainda não funcionar:**
1. Verifique se todas as 6 variáveis foram adicionadas
2. Confirme que estão marcadas como "Production"
3. Faça redeploy completo
4. Aguarde 2-3 minutos para propagação

### **URLs para Testar:**
- Home: https://seu-projeto.vercel.app/
- Catálogo: https://seu-projeto.vercel.app/cardapio
- Admin: https://seu-projeto.vercel.app/admin

## ⚠️ **IMPORTANTE**
- **NÃO** use credenciais hardcoded no código
- **USE** sempre variáveis de ambiente
- **MANTENHA** a configuração segura em `lib/firebase.js` 