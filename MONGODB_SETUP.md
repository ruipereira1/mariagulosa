# 🗄️ Configuração do MongoDB - Maria Gulosa

## 📋 **Status Atual**

✅ **MongoDB está funcionando!** Seu sistema já está conectado e operacional.

## 🎯 **Como Usar o Banco de Dados**

### **1. Gerenciador Interativo**

Execute o gerenciador do banco para ver e manipular dados:

```bash
cd backend
node db-manager.js
```

**Opções disponíveis:**
- 📊 Ver estatísticas completas
- 🎂 Listar todos os bolos
- 📋 Ver pedidos recentes
- ➕ Adicionar pedidos de exemplo
- 🔄 Resetar banco de dados
- 🚪 Sair

### **2. Verificação Rápida**

Para apenas verificar o status:

```bash
cd backend
node setup-db.js
```

## 🚀 **Instalação do MongoDB (se necessário)**

### **Windows:**

1. **Baixar MongoDB Community Server**:
   - Acesse: https://www.mongodb.com/try/download/community
   - Baixe a versão para Windows
   - Execute o instalador

2. **Instalar como Serviço**:
   - Durante a instalação, marque "Install MongoDB as a Service"
   - Deixe as configurações padrão

3. **Verificar Instalação**:
   ```bash
   mongod --version
   ```

### **Alternativa: MongoDB Atlas (Cloud)**

Se preferir usar MongoDB na nuvem:

1. Acesse: https://www.mongodb.com/atlas
2. Crie uma conta gratuita
3. Crie um cluster
4. Obtenha a string de conexão
5. Configure no backend

## ⚙️ **Configuração do Projeto**

### 1. **Configurar Variáveis de Ambiente**

Crie um arquivo `.env` na pasta `backend/`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/maria-gulosa
NODE_ENV=development

# Configurações da aplicação
JWT_SECRET=maria_gulosa_secret_key_2024
ADMIN_USERNAME=maria
ADMIN_PASSWORD=gulosa123

# Configurações do WhatsApp
WHATSAPP_NUMBER=351914019142
```

### 2. **Para MongoDB Atlas (Cloud)**

Se usar MongoDB Atlas, substitua a URI:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/maria-gulosa
```

## 🎯 **Testando a Conexão**

1. **Iniciar MongoDB Local**:
   ```bash
   # Windows (se não estiver como serviço)
   mongod
   ```

2. **Iniciar o Backend**:
   ```bash
   cd backend
   npm run dev
   ```

3. **Verificar Logs**:
   - Deve aparecer: "✅ MongoDB conectado com sucesso!"
   - Se aparecer erro, o sistema funciona em modo demo

## 📊 **Funcionalidades com MongoDB**

### ✅ **Com Banco de Dados**:
- ✅ Pedidos salvos permanentemente
- ✅ Estatísticas reais no admin
- ✅ Histórico completo de encomendas
- ✅ Dados persistentes entre reinicializações

### ⚠️ **Sem Banco de Dados (Modo Demo)**:
- ⚠️ Dados mock/simulados
- ⚠️ Pedidos não são salvos
- ⚠️ Estatísticas fixas
- ⚠️ Reinicialização perde dados

## 🧪 **Testando o Sistema Completo**

### **1. Testar Carrinho → Banco → WhatsApp**

1. Acesse: http://localhost:5173
2. Escolha um bolo → Adicione ao carrinho
3. Clique "Enviar Encomenda"
4. Verifique se o pedido foi salvo no banco:
   ```bash
   cd backend
   node db-manager.js
   # Escolha opção 3 (Ver pedidos)
   ```

### **2. Testar Admin Dashboard**

1. Acesse: http://localhost:5173/admin
2. Login: `maria` / `gulosa123`
3. Veja as estatísticas em tempo real
4. Clique "Atualizar" para ver novos pedidos

### **3. Adicionar Dados de Teste**

```bash
cd backend
node db-manager.js
# Escolha opção 4 (Adicionar pedidos de exemplo)
```

## 🔧 **Comandos Úteis**

### **Verificar Status do MongoDB**:
```bash
# Windows
net start MongoDB

# Verificar se está rodando
tasklist | findstr mongod
```

### **Conectar ao MongoDB**:
```bash
# Usando MongoDB Compass (GUI)
mongodb://localhost:27017

# Usando linha de comando
mongosh
```

### **Ver Dados do Projeto**:
```bash
mongosh
use maria-gulosa
db.orders.find()
db.cakes.find()
```

## 🎉 **Resultado Final**

Com MongoDB configurado:

1. **🛒 Carrinho** → Salva pedido no banco → **📱 WhatsApp**
2. **👨‍💼 Admin** → Mostra dados reais do banco
3. **📊 Estatísticas** → Calculadas em tempo real
4. **📋 Pedidos** → Histórico completo e pesquisável

---

**🎂 Sistema Maria Gulosa com persistência completa!** 