# 👤 **ADMIN FIREBASE - MARIA GULOSA**

## 🎯 **Como criar painel admin seguro no Firebase**

Para ter acesso admin seguro, você precisa configurar **Firebase Authentication**.

---

## 📝 **PASSO 1: ATIVAR AUTHENTICATION**

### **1.1 No Firebase Console:**
1. **Acesse:** https://console.firebase.google.com
2. **Projeto:** maria-gulosa-b460f
3. **Menu lateral:** "Authentication"
4. **Clique:** "Começar"

### **1.2 Configurar método de login:**
1. **Aba:** "Sign-in method"
2. **Escolha:** "Email/senha"
3. **Ative:** "Email/senha"
4. **Salvar**

---

## 👤 **PASSO 2: CRIAR USUÁRIO ADMIN**

### **2.1 Criar primeiro usuário:**
1. **Aba:** "Users"
2. **Clique:** "Add user"
3. **Email:** `admin@maria-gulosa.com`
4. **Senha:** `gulosa123` (ou sua preferência)
5. **Clique:** "Add user"

### **2.2 Anotar o UID:**
- Copie o **UID** do usuário criado
- Exemplo: `abc123def456ghi789`

---

## 🔧 **PASSO 3: CONFIGURAR CUSTOM CLAIMS**

### **3.1 Instalar Firebase Admin SDK:**
```bash
cd backend
npm install firebase-admin
```

### **3.2 Criar script para definir admin:**
Crie o arquivo `backend/set-admin.js`:

```javascript
import admin from 'firebase-admin'

// Configuração do Admin SDK
const serviceAccount = {
  // Você vai pegar essas informações do Firebase Console
  type: "service_account",
  project_id: "maria-gulosa-b460f",
  // ... outras configurações
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

// UID do usuário que será admin
const adminUID = 'SEU_UID_AQUI' // Substitua pelo UID copiado

// Definir como admin
admin.auth().setCustomUserClaims(adminUID, { admin: true })
  .then(() => {
    console.log('✅ Usuário definido como admin!')
  })
  .catch(console.error)
```

---

## 🔑 **PASSO 4: OBTER CHAVE DE SERVIÇO**

### **4.1 No Firebase Console:**
1. **Configurações do projeto** (ícone engrenagem)
2. **Aba:** "Service accounts"
3. **Clique:** "Generate new private key"
4. **Download** do arquivo JSON

### **4.2 Configurar no projeto:**
1. **Salve** o arquivo como `backend/firebase-admin-key.json`
2. **Adicione** ao `.gitignore`:
   ```
   firebase-admin-key.json
   ```

---

## 🛡️ **PASSO 5: REGRAS DE SEGURANÇA COM AUTH**

### **5.1 Atualize as regras do Firestore:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Função para verificar admin
    function isAdmin() {
      return request.auth != null 
        && request.auth.token.admin == true;
    }
    
    // 🎂 BOLOS - Leitura pública, escrita apenas admin
    match /cakes/{cakeId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // 📦 PEDIDOS - Criação pública, admin pode gerenciar
    match /orders/{orderId} {
      allow create: if true;
      allow read, update: if isAdmin();
      allow delete: if false; // Nunca deletar pedidos
    }
    
    // 📊 STATS - Apenas admin
    match /stats/{document=**} {
      allow read, write: if isAdmin();
    }
  }
}
```

---

## 💻 **PASSO 6: FRONTEND COM LOGIN**

### **6.1 Instalar Firebase no frontend:**
```bash
cd frontend
npm install firebase
```

### **6.2 Criar componente de login:**
```jsx
// src/components/AdminLogin.jsx
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase-config'

export default function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Verificar se é admin
      const token = await user.getIdTokenResult()
      if (token.claims.admin) {
        onLogin(user)
      } else {
        alert('Acesso negado: Você não é administrador')
      }
    } catch (error) {
      alert('Erro no login: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login">
      <h2>🔐 Login Admin</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  )
}
```

---

## 🎯 **OPÇÃO SIMPLES (SEM AUTH)**

### **Se você quer algo mais simples:**

1. **Use as regras básicas** (sem autenticação)
2. **Acesse diretamente** o Firebase Console
3. **Gerencie dados** pela interface visual

### **Firebase Console como admin:**
- **URL:** https://console.firebase.google.com
- **Projeto:** maria-gulosa-b460f
- **Firestore Database:** Ver e editar todos os dados
- **Authentication:** Gerenciar usuários

---

## 🚀 **COMANDOS ÚTEIS**

### **Para configurar admin:**
```bash
cd backend
npm install firebase-admin
node set-admin.js
```

### **Para regras seguras:**
```bash
npm run firebase:security
# Escolha opção 2 ou 3
```

---

## 📊 **ACESSO AOS DADOS**

### **Via Firebase Console (Mais fácil):**
1. **Firestore Database**
2. **Ver coleções:** `cakes`, `orders`
3. **Editar documentos** diretamente
4. **Adicionar/remover** dados

### **Via painel web (Mais complexo):**
1. **Configure autenticação**
2. **Crie componentes admin**
3. **Implemente CRUD** com regras seguras

---

## 💡 **RECOMENDAÇÃO**

### **Para começar:**
**Use o Firebase Console** como admin - é mais simples e seguro!

### **Para produção:**
**Configure autenticação completa** com login seguro.

**Quer que eu te ajude a configurar qual opção?** 🔐🎂 