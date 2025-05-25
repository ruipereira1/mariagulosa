# 🔒 Guia de Segurança

## ⚠️ **Alertas de Segurança Resolvidos**

Este projeto foi atualizado para resolver os seguintes alertas de segurança:
- ✅ Google API Key removida do código
- ✅ Secrets hardcoded removidos da documentação
- ✅ Validação de variáveis de ambiente implementada

## 🛡️ **Configuração Segura**

### 1. **Variáveis de Ambiente**

**NUNCA** commite secrets no código. Use sempre variáveis de ambiente:

```javascript
// ❌ ERRADO - Secret hardcoded
const apiKey = "AIzaSyExample_NEVER_DO_THIS_12345678901234";

// ✅ CORRETO - Usando variável de ambiente
const apiKey = process.env.FIREBASE_API_KEY;
```

### 2. **Configuração no Vercel**

1. Acesse o painel do Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione as variáveis necessárias:

```
FIREBASE_API_KEY=sua_chave_real_aqui
FIREBASE_AUTH_DOMAIN=seu_dominio.firebaseapp.com
FIREBASE_PROJECT_ID=seu_projeto_id
FIREBASE_STORAGE_BUCKET=seu_bucket.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=seu_sender_id
FIREBASE_APP_ID=seu_app_id
```

### 3. **Desenvolvimento Local**

1. Crie um arquivo `.env.local` (já está no .gitignore)
2. Adicione suas variáveis de ambiente
3. **NUNCA** commite este arquivo

```bash
# Criar arquivo de ambiente local
cp .env.example .env.local
# Editar com seus valores reais
nano .env.local
```

### 4. **Rotação de Secrets**

Se algum secret foi exposto:

1. **Firebase API Key:**
   - Acesse Firebase Console
   - Vá em Project Settings → General
   - Regenere a API Key
   - Atualize no Vercel

2. **MongoDB URI:**
   - Acesse MongoDB Atlas
   - Vá em Database Access
   - Crie novo usuário ou altere senha
   - Atualize a connection string

### 5. **Verificação de Segurança**

Execute regularmente:

```bash
# Verificar se não há secrets no código
git log --grep="password\|key\|secret" --oneline

# Verificar arquivos que podem conter secrets
grep -r "AIza\|mongodb+srv\|password\|secret" . --exclude-dir=node_modules
```

## 🔍 **Monitoramento**

### GitHub Security Alerts
- Ative as notificações de segurança no repositório
- Revise regularmente os alertas de dependências
- Mantenha as dependências atualizadas

### Vercel Security
- Use apenas variáveis de ambiente para secrets
- Ative logs de auditoria se disponível
- Monitore acessos não autorizados

## 📋 **Checklist de Segurança**

- [ ] Todos os secrets removidos do código
- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] .gitignore atualizado
- [ ] Documentação atualizada sem secrets
- [ ] Secrets antigos rotacionados
- [ ] Monitoramento ativo

## 🚨 **Em Caso de Exposição**

1. **Imediatamente:**
   - Rotacione todos os secrets expostos
   - Revogue acessos comprometidos
   - Atualize variáveis de ambiente

2. **Investigação:**
   - Verifique logs de acesso
   - Identifique possível uso malicioso
   - Documente o incidente

3. **Prevenção:**
   - Implemente verificações automáticas
   - Treine a equipe sobre boas práticas
   - Revise processos de deploy

---

**🔐 Mantenha sempre a segurança como prioridade!** 