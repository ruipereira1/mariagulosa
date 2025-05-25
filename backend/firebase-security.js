import readline from 'readline'

// Interface para input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Regras de segurança
const securityRules = {
  basic: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 🎂 BOLOS - Apenas leitura pública
    match /cakes/{cakeId} {
      allow read: if true;
      allow write: if false;
    }
    
    // 📦 PEDIDOS - Apenas criação pública
    match /orders/{orderId} {
      allow create: if true;
      allow read, update, delete: if false;
    }
  }
}`,

  intermediate: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 🎂 BOLOS - Leitura pública, escrita para autenticados
    match /cakes/{cakeId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // 📦 PEDIDOS - Criação pública, admin pode ler/editar
    match /orders/{orderId} {
      allow create: if true;
      allow read, update: if request.auth != null 
        && request.auth.token.admin == true;
      allow delete: if false;
    }
  }
}`,

  advanced: `rules_version = '2';
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
    
    // 📦 PEDIDOS - Criação com validação
    match /orders/{orderId} {
      allow create: if request.auth == null
        && resource == null
        && request.resource.data.keys().hasAll([
          'orderNumber', 'items', 'totalPrice', 'createdAt'
        ]);
      
      allow read, update: if isAdmin();
      allow delete: if false;
    }
  }
}`
}

// Função principal
const main = async () => {
  console.log('🔒 CONFIGURAÇÃO DE SEGURANÇA FIREBASE')
  console.log('====================================\n')
  
  console.log('⚠️  ATENÇÃO: Suas regras atuais são INSEGURAS!')
  console.log('   Qualquer pessoa pode acessar e modificar seus dados.\n')
  
  console.log('🛡️  OPÇÕES DE SEGURANÇA DISPONÍVEIS:\n')
  console.log('1. 🟢 BÁSICA - Recomendada para começar')
  console.log('   • Bolos: apenas leitura')
  console.log('   • Pedidos: apenas criação')
  console.log('')
  console.log('2. 🟡 INTERMEDIÁRIA - Com autenticação')
  console.log('   • Bolos: leitura pública, escrita autenticada')
  console.log('   • Pedidos: criação pública, admin pode gerenciar')
  console.log('')
  console.log('3. 🔴 AVANÇADA - Máxima segurança')
  console.log('   • Validação completa de dados')
  console.log('   • Controle granular de permissões')
  console.log('')
  
  const choice = await new Promise((resolve) => {
    rl.question('Escolha uma opção (1, 2 ou 3): ', (answer) => {
      resolve(answer.trim())
    })
  })
  
  let selectedRules
  let ruleName
  
  switch (choice) {
    case '1':
      selectedRules = securityRules.basic
      ruleName = 'BÁSICA'
      break
    case '2':
      selectedRules = securityRules.intermediate
      ruleName = 'INTERMEDIÁRIA'
      break
    case '3':
      selectedRules = securityRules.advanced
      ruleName = 'AVANÇADA'
      break
    default:
      console.log('❌ Opção inválida. Usando regras BÁSICAS.')
      selectedRules = securityRules.basic
      ruleName = 'BÁSICA'
  }
  
  console.log(`\n🔒 REGRAS DE SEGURANÇA ${ruleName}:`)
  console.log('=' + '='.repeat(30 + ruleName.length))
  console.log(selectedRules)
  console.log('')
  
  console.log('📋 COMO APLICAR:')
  console.log('1. Acesse: https://console.firebase.google.com')
  console.log('2. Projeto: maria-gulosa-b460f')
  console.log('3. Firestore Database → Regras')
  console.log('4. Copie e cole as regras acima')
  console.log('5. Clique "Publicar"')
  console.log('')
  
  console.log('✅ BENEFÍCIOS:')
  console.log('• Proteção contra ataques')
  console.log('• Dados dos clientes protegidos')
  console.log('• Conformidade com LGPD/GDPR')
  console.log('• Controle de acesso adequado')
  console.log('')
  
  if (choice === '2' || choice === '3') {
    console.log('⚠️  NOTA: Opções 2 e 3 requerem Firebase Authentication')
    console.log('   Para usar o painel admin, você precisará configurar login.')
  }
  
  console.log('\n🎂 Após aplicar as regras, seu sistema estará seguro!')
  
  rl.close()
}

// Executar
main().catch(console.error) 