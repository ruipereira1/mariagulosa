import readline from 'readline'
import fs from 'fs'

// Interface para input do usuário
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// Função para obter configuração do Firebase
const getFirebaseConfig = () => {
  return new Promise((resolve) => {
    console.log('🔥 CONFIGURAÇÃO FIREBASE')
    console.log('========================\n')
    console.log('Vamos configurar seu projeto Firebase!')
    console.log('Você precisará das informações do seu projeto Firebase.\n')
    
    const config = {}
    
    rl.question('1. API Key: ', (apiKey) => {
      config.apiKey = apiKey
      
      rl.question('2. Auth Domain (ex: maria-gulosa.firebaseapp.com): ', (authDomain) => {
        config.authDomain = authDomain
        
        rl.question('3. Project ID (ex: maria-gulosa): ', (projectId) => {
          config.projectId = projectId
          
          rl.question('4. Storage Bucket (ex: maria-gulosa.appspot.com): ', (storageBucket) => {
            config.storageBucket = storageBucket
            
            rl.question('5. Messaging Sender ID: ', (messagingSenderId) => {
              config.messagingSenderId = messagingSenderId
              
              rl.question('6. App ID: ', (appId) => {
                config.appId = appId
                resolve(config)
              })
            })
          })
        })
      })
    })
  })
}

// Atualizar arquivo de configuração
const updateFirebaseConfig = (config) => {
  try {
    const configPath = './firebase-config.js'
    let configContent = fs.readFileSync(configPath, 'utf8')
    
    // Substituir a configuração
    const newConfig = `const firebaseConfig = {
  apiKey: "${config.apiKey}",
  authDomain: "${config.authDomain}",
  projectId: "${config.projectId}",
  storageBucket: "${config.storageBucket}",
  messagingSenderId: "${config.messagingSenderId}",
  appId: "${config.appId}"
}`
    
    configContent = configContent.replace(
      /const firebaseConfig = {[\s\S]*?}/,
      newConfig
    )
    
    fs.writeFileSync(configPath, configContent)
    console.log('✅ Configuração do Firebase atualizada!')
    return true
  } catch (error) {
    console.error('❌ Erro ao atualizar configuração:', error.message)
    return false
  }
}

// Criar arquivo .env
const createEnvFile = (config) => {
  const envContent = `PORT=5000
NODE_ENV=development

# Configurações Firebase
FIREBASE_API_KEY=${config.apiKey}
FIREBASE_AUTH_DOMAIN=${config.authDomain}
FIREBASE_PROJECT_ID=${config.projectId}
FIREBASE_STORAGE_BUCKET=${config.storageBucket}
FIREBASE_MESSAGING_SENDER_ID=${config.messagingSenderId}
FIREBASE_APP_ID=${config.appId}

# Configurações da aplicação
JWT_SECRET=maria_gulosa_secret_key_2024
ADMIN_USERNAME=maria
ADMIN_PASSWORD=gulosa123

# Configurações do WhatsApp
WHATSAPP_NUMBER=351914019142`

  try {
    fs.writeFileSync('.env', envContent)
    console.log('✅ Arquivo .env criado!')
    return true
  } catch (error) {
    console.error('❌ Erro ao criar .env:', error.message)
    return false
  }
}

// Testar configuração
const testFirebaseConfig = async (config) => {
  try {
    console.log('\n🔄 Testando configuração do Firebase...')
    
    // Importar dinamicamente para testar
    const { initializeApp } = await import('firebase/app')
    const { getFirestore, connectFirestoreEmulator } = await import('firebase/firestore')
    
    const app = initializeApp(config)
    const db = getFirestore(app)
    
    console.log('✅ Configuração do Firebase válida!')
    console.log(`📍 Projeto: ${config.projectId}`)
    return true
  } catch (error) {
    console.error('❌ Erro na configuração:', error.message)
    console.log('\n💡 Dicas para resolver:')
    console.log('   1. Verifique se todas as informações estão corretas')
    console.log('   2. Confirme se o projeto existe no Firebase Console')
    console.log('   3. Verifique se o Firestore está habilitado')
    return false
  }
}

// Função principal
const main = async () => {
  try {
    console.log('🔥 CONFIGURAÇÃO FIREBASE PARA MARIA GULOSA')
    console.log('==========================================\n')
    
    console.log('📋 ANTES DE COMEÇAR:')
    console.log('1. Acesse: https://console.firebase.google.com')
    console.log('2. Crie um novo projeto ou use um existente')
    console.log('3. Ative o Firestore Database')
    console.log('4. Vá em Project Settings > General > Your apps')
    console.log('5. Adicione um app web e copie as configurações')
    console.log('')
    
    const continuar = await new Promise((resolve) => {
      rl.question('Você já tem as configurações do Firebase? (s/n): ', (answer) => {
        resolve(answer.toLowerCase() === 's')
      })
    })
    
    if (!continuar) {
      console.log('\n📖 GUIA RÁPIDO:')
      console.log('1. Acesse: https://console.firebase.google.com')
      console.log('2. Clique em "Criar um projeto"')
      console.log('3. Nome: "maria-gulosa"')
      console.log('4. Desabilite Google Analytics (opcional)')
      console.log('5. Clique em "Criar projeto"')
      console.log('6. Vá em "Firestore Database" > "Criar banco de dados"')
      console.log('7. Escolha "Iniciar no modo de teste"')
      console.log('8. Escolha uma localização próxima')
      console.log('9. Vá em "Configurações do projeto" > "Geral"')
      console.log('10. Role até "Seus apps" e clique no ícone web (</>)')
      console.log('11. Nome do app: "maria-gulosa-web"')
      console.log('12. Copie as configurações mostradas')
      console.log('')
      console.log('Execute este script novamente quando tiver as configurações!')
      rl.close()
      return
    }
    
    const config = await getFirebaseConfig()
    
    console.log('\n📝 Configuração recebida:')
    console.log(`   Project ID: ${config.projectId}`)
    console.log(`   Auth Domain: ${config.authDomain}`)
    console.log('')
    
    const configValid = await testFirebaseConfig(config)
    
    if (!configValid) {
      console.log('❌ Configuração inválida. Tente novamente.')
      rl.close()
      return
    }
    
    const configUpdated = updateFirebaseConfig(config)
    const envCreated = createEnvFile(config)
    
    if (configUpdated && envCreated) {
      console.log('\n🎉 FIREBASE CONFIGURADO COM SUCESSO!')
      console.log('=====================================')
      console.log('✅ Configuração atualizada')
      console.log('✅ Arquivo .env criado')
      console.log('✅ Pronto para usar')
      console.log('')
      console.log('🚀 PRÓXIMOS PASSOS:')
      console.log('1. Execute: node server-firebase.js')
      console.log('2. Ou execute: npm run dev:firebase')
      console.log('3. Acesse: http://localhost:5000')
      console.log('')
      console.log('🔥 Seu sistema agora usa Firebase!')
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message)
  } finally {
    rl.close()
  }
}

// Executar
main() 