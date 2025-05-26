# 🔥 Script de Configuração Firebase - Maria Gulosa (PowerShell)
Write-Host "🔥 Configurando Firebase para desenvolvimento local..." -ForegroundColor Green

# Verificar se o template existe
if (-not (Test-Path "firebase.env.template")) {
    Write-Host "❌ Erro: firebase.env.template não encontrado!" -ForegroundColor Red
    exit 1
}

# Verificar se .env.local já existe
if (Test-Path ".env.local") {
    Write-Host "⚠️ Arquivo .env.local já existe!" -ForegroundColor Yellow
    $response = Read-Host "Deseja sobrescrever? (y/N)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "❌ Configuração cancelada." -ForegroundColor Red
        exit 1
    }
}

# Copiar template para .env.local
try {
    Copy-Item "firebase.env.template" ".env.local"
    Write-Host "✅ Arquivo .env.local criado com sucesso!" -ForegroundColor Green
    Write-Host "Localizacao: $((Get-Location).Path)\.env.local" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Seguranca:" -ForegroundColor Yellow
    Write-Host "   - O arquivo .env.local esta no .gitignore" -ForegroundColor White
    Write-Host "   - Suas credenciais NAO serao commitadas" -ForegroundColor White
    Write-Host "   - Apenas voce tem acesso local" -ForegroundColor White
    Write-Host ""
    Write-Host "Proximos passos:" -ForegroundColor Green
    Write-Host "   1. npm run dev (para testar localmente)" -ForegroundColor White
    Write-Host "   2. Configure as mesmas variaveis no Vercel para producao" -ForegroundColor White
    Write-Host "   3. Consulte FIREBASE_CONFIG.md para mais detalhes" -ForegroundColor White
} catch {
    Write-Host "Erro ao criar .env.local: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
} 