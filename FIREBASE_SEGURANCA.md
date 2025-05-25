# 🔒 **SEGURANÇA FIREBASE - MARIA GULOSA**

## ⚠️ **IMPORTANTE: REGRAS DE SEGURANÇA**

Você está certo! As regras atuais são **INSEGURAS** para produção.

```javascript
// ❌ REGRA ATUAL (INSEGURA)
allow read, write: if true; // Qualquer pessoa pode acessar!
```

---

## 🛡️ **REGRAS SEGURAS PARA PRODUÇÃO**

### **1. Acesse o Firebase Console:**
- **URL:** https://console.firebase.google.com
- **Projeto:** maria-gulosa-b460f
- **Firestore Database** → **Regras**

### **2. Substitua pelas regras seguras:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // 🎂 BOLOS - Apenas leitura pública
    match /cakes/{cakeId} {
      allow read: if true; // Qualquer um pode ver os bolos
      allow write: if false; // Ninguém pode modificar via web
    }
    
    // 📦 PEDIDOS - Apenas criação pública, leitura restrita
    match /orders/{orderId} {
      allow create: if true; // Qualquer um pode criar pedidos
      allow read: if false; // Ninguém pode ler pedidos de outros
      allow update, delete: if false; // Ninguém pode modificar
    }
    
    // 👤 ADMIN - Apenas para administradores autenticados
    match /admin/{document=**} {
      allow read, write: if false; // Bloqueado por padrão
    }
  }
}
```

---

## 🔐 **OPÇÕES DE SEGURANÇA**

### **OPÇÃO 1: BÁSICA (Recomendada para início)**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bolos: apenas leitura
    match /cakes/{cakeId} {
      allow read: if true;
      allow write: if false;
    }
    
    // Pedidos: apenas criação
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

### **OPÇÃO 2: COM AUTENTICAÇÃO (Mais segura)**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bolos: leitura pública
    match /cakes/{cakeId} {
      allow read: if true;
      allow write: if request.auth != null; // Apenas usuários logados
    }
    
    // Pedidos: criação pública, admin pode ler/editar
    match /orders/{orderId} {
      allow create: if true;
      allow read, update: if request.auth != null 
        && request.auth.token.admin == true; // Apenas admins
      allow delete: if false; // Nunca deletar pedidos
    }
  }
}
```

### **OPÇÃO 3: MÁXIMA SEGURANÇA**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Função para verificar admin
    function isAdmin() {
      return request.auth != null 
        && request.auth.token.admin == true;
    }
    
    // Bolos: leitura pública, escrita apenas admin
    match /cakes/{cakeId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    
    // Pedidos: criação com validação
    match /orders/{orderId} {
      allow create: if request.auth == null // Permitir sem login
        && resource == null // Novo documento
        && request.resource.data.keys().hasAll([
          'orderNumber', 'items', 'totalPrice', 'createdAt'
        ]); // Campos obrigatórios
      
      allow read, update: if isAdmin();
      allow delete: if false;
    }
  }
}
```

---

## 🚀 **IMPLEMENTAÇÃO RECOMENDADA**

### **Para começar (OPÇÃO 1):**
1. **Use a OPÇÃO 1** (básica)
2. **Teste se tudo funciona**
3. **Depois evolua** para opções mais seguras

### **Regras básicas seguras:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /cakes/{cakeId} {
      allow read: if true;
      allow write: if false;
    }
    
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}
```

---

## 🔧 **COMO APLICAR:**

1. **Copie as regras** da OPÇÃO 1
2. **Cole no Firebase Console** (Firestore → Regras)
3. **Clique "Publicar"**
4. **Teste o sistema**

---

## ✅ **VERIFICAR SEGURANÇA:**

### **O que deve funcionar:**
- ✅ Ver bolos no site
- ✅ Criar novos pedidos
- ✅ API de estatísticas (se configurada)

### **O que deve estar bloqueado:**
- ❌ Modificar bolos via web
- ❌ Ler pedidos de outros clientes
- ❌ Deletar dados

---

## 🛡️ **BENEFÍCIOS DAS REGRAS SEGURAS:**

✅ **Proteção contra ataques**  
✅ **Dados dos clientes protegidos**  
✅ **Bolos não podem ser alterados**  
✅ **Pedidos não podem ser deletados**  
✅ **Conformidade com LGPD/GDPR**  

---

## 📱 **PARA O ADMIN:**

Se você precisar de um painel admin, considere:

1. **Firebase Authentication** para login seguro
2. **Custom claims** para definir admins
3. **Regras específicas** para administradores

---

## 💡 **PRÓXIMOS PASSOS:**

1. **Aplique a OPÇÃO 1** (regras básicas)
2. **Teste o sistema**
3. **Se precisar de admin**, configure autenticação
4. **Evolua para regras mais complexas** conforme necessário

**Segurança primeiro!** 🔒🎂 