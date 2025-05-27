# 🔥 Script para Configurar Variáveis de Ambiente no Vercel
Write-Host "🔥 Configurando variáveis de ambiente Firebase no Vercel..." -ForegroundColor Green

# Ler credenciais do arquivo .env.local
if (-not (Test-Path ".env.local")) {
    Write-Host "❌ Erro: .env.local não encontrado!" -ForegroundColor Red
    Write-Host "Execute primeiro: ./setup-firebase.ps1" -ForegroundColor Yellow
    exit 1
}

# Extrair valores do .env.local
$envContent = Get-Content ".env.local"
$apiKey = ($envContent | Where-Object { $_ -match "NEXT_PUBLIC_FIREBASE_API_KEY=" }) -replace "NEXT_PUBLIC_FIREBASE_API_KEY=", ""
$authDomain = ($envContent | Where-Object { $_ -match "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=" }) -replace "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=", ""
$projectId = ($envContent | Where-Object { $_ -match "NEXT_PUBLIC_FIREBASE_PROJECT_ID=" }) -replace "NEXT_PUBLIC_FIREBASE_PROJECT_ID=", ""
$storageBucket = ($envContent | Where-Object { $_ -match "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=" }) -replace "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=", ""
$messagingSenderId = ($envContent | Where-Object { $_ -match "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=" }) -replace "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=", ""
$appId = ($envContent | Where-Object { $_ -match "NEXT_PUBLIC_FIREBASE_APP_ID=" }) -replace "NEXT_PUBLIC_FIREBASE_APP_ID=", ""

Write-Host "📋 Configurando variáveis no Vercel..." -ForegroundColor Cyan

# Configurar cada variável
Write-Host "1. NEXT_PUBLIC_FIREBASE_API_KEY" -ForegroundColor White
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY production --value="$apiKey"

Write-Host "2. NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN" -ForegroundColor White
vercel env add NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN production --value="$authDomain"

Write-Host "3. NEXT_PUBLIC_FIREBASE_PROJECT_ID" -ForegroundColor White
vercel env add NEXT_PUBLIC_FIREBASE_PROJECT_ID production --value="$projectId"

Write-Host "4. NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET" -ForegroundColor White
vercel env add NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET production --value="$storageBucket"

Write-Host "5. NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID" -ForegroundColor White
vercel env add NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID production --value="$messagingSenderId"

Write-Host "6. NEXT_PUBLIC_FIREBASE_APP_ID" -ForegroundColor White
vercel env add NEXT_PUBLIC_FIREBASE_APP_ID production --value="$appId"

Write-Host "✅ Variáveis configuradas! Fazendo redeploy..." -ForegroundColor Green
vercel --prod

Write-Host "🚀 Deploy concluído! Verifique: https://mariagulosa.vercel.app/admin" -ForegroundColor Green 