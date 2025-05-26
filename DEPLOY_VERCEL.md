# 🚀 Guia de Deploy no Vercel - Maria Gulosa

## 📋 Pré-requisitos
- ✅ Conta no Vercel (vercel.com)
- ✅ Conta no GitHub (recomendado)
- ✅ Vercel CLI instalado (já feito)

## 🔧 Passo 1: Configurar Variáveis de Ambiente

### No Vercel Dashboard:
1. Acesse [vercel.com](https://vercel.com)
2. Faça login com GitHub
3. Vá em "Settings" > "Environment Variables"
4. Adicione as seguintes variáveis:

```
FIREBASE_API_KEY=AIzaSyCRyLCgUClshxZqQ3ZTRHx-6j26ucwVoRs
FIREBASE_AUTH_DOMAIN=maria-gulosa-b460f.firebaseapp.com
FIREBASE_PROJECT_ID=maria-gulosa-b460f
FIREBASE_STORAGE_BUCKET=maria-gulosa-b460f.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=373372889835
FIREBASE_APP_ID=1:373372889835:web:0577d99b04c94e75112cae
NODE_ENV=production
```

## 🚀 Passo 2: Deploy via CLI

### Opção A: Deploy Direto (Recomendado)
```bash
# 1. Fazer login (se ainda não fez)
vercel login

# 2. Deploy do projeto
vercel

# 3. Seguir as instruções:
# - Set up and deploy? Yes
# - Which scope? (escolha sua conta)
# - Link to existing project? No
# - Project name: maria-gulosa (ou outro nome)
# - Directory: ./ (raiz do projeto)

# 4. Deploy para produção
vercel --prod
```

### Opção B: Deploy via GitHub (Automático)
1. Crie um repositório no GitHub
2. Faça push do código:
```bash
git init
git add .
git commit -m "Initial commit - Maria Gulosa"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/maria-gulosa.git
git push -u origin main
```
3. No Vercel Dashboard:
   - Clique "New Project"
   - Importe do GitHub
   - Selecione o repositório
   - Configure as variáveis de ambiente
   - Deploy automático!

## ⚙️ Configurações Importantes

### Build Settings (já configurado no vercel.json):
- **Build Command**: `cd frontend && npm install && npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm install`

### Domínio Personalizado (Opcional):
1. No Vercel Dashboard > Settings > Domains
2. Adicione seu domínio personalizado
3. Configure DNS conforme instruções

## 🔍 Verificação Pós-Deploy

### URLs que devem funcionar:
- `/` - Página inicial
- `/catalog` - Catálogo de bolos
- `/admin` - Painel administrativo
- `/api/cakes` - API dos bolos
- `/api/orders` - API de pedidos
- `/api/stats` - API de estatísticas

### Teste de Funcionalidades:
1. ✅ Carregar página inicial
2. ✅ Navegar pelo catálogo
3. ✅ Adicionar bolos ao carrinho
4. ✅ Enviar pedido via WhatsApp
5. ✅ Acessar painel admin
6. ✅ APIs funcionando

## 🐛 Troubleshooting

### Erro de Build:
```bash
# Limpar e reinstalar dependências
npm run clean
npm run install-deps
npm run build
```

### Erro de Firebase:
- Verificar se todas as variáveis de ambiente estão configuradas
- Confirmar se o projeto Firebase está ativo
- Verificar permissões do Firestore

### Erro de API:
- Verificar se as rotas estão corretas no vercel.json
- Confirmar CORS configurado
- Testar endpoints individualmente

## 📱 URLs Finais

Após o deploy, você terá:
- **Site Principal**: `https://maria-gulosa.vercel.app`
- **API Base**: `https://maria-gulosa.vercel.app/api`
- **Admin**: `https://maria-gulosa.vercel.app/admin`

## 🔒 Segurança

- ✅ Variáveis de ambiente protegidas
- ✅ Firebase configurado corretamente
- ✅ CORS configurado para APIs
- ✅ Secrets não expostos no código

## 📞 Suporte

Se encontrar problemas:
1. Verificar logs no Vercel Dashboard
2. Testar build local: `npm run build`
3. Verificar configuração Firebase
4. Consultar documentação Vercel

---

**🎉 Seu site estará online em poucos minutos!** 