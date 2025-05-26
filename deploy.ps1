# 🚀 Script de Deploy Automatizado - Maria Gulosa (PowerShell)
Write-Host "🎂 Iniciando deploy do Maria Gulosa..." -ForegroundColor Green

# Verificar se está na pasta correta
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script na pasta raiz do projeto" -ForegroundColor Red
    exit 1
}

# Limpar e instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm run install-deps

# Fazer build local para testar
Write-Host "🔨 Testando build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build. Corrija os erros antes de fazer deploy." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build local funcionando!" -ForegroundColor Green

# Verificar se Vercel CLI está instalado
try {
    vercel --version | Out-Null
} catch {
    Write-Host "📥 Instalando Vercel CLI..." -ForegroundColor Yellow
    npm install -g vercel
}

# Fazer deploy
Write-Host "🚀 Fazendo deploy no Vercel..." -ForegroundColor Green
Write-Host "ℹ️ Se for a primeira vez, configure:" -ForegroundColor Cyan
Write-Host "   - Project name: maria-gulosa" -ForegroundColor Cyan
Write-Host "   - Directory: ./" -ForegroundColor Cyan
Write-Host "   - Link to existing project: No" -ForegroundColor Cyan

vercel

Write-Host ""
Write-Host "🎉 Deploy concluído!" -ForegroundColor Green
Write-Host "📱 Acesse seu site em: https://maria-gulosa.vercel.app" -ForegroundColor Cyan
Write-Host "⚙️ Configure as variáveis de ambiente no Vercel Dashboard" -ForegroundColor Yellow
Write-Host "📖 Consulte DEPLOY_VERCEL.md para instruções detalhadas" -ForegroundColor Cyan 