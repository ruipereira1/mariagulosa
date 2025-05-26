#!/bin/bash

# 🚀 Script de Deploy Automatizado - Maria Gulosa
echo "🎂 Iniciando deploy do Maria Gulosa..."

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na pasta raiz do projeto"
    exit 1
fi

# Limpar e instalar dependências
echo "📦 Instalando dependências..."
npm run install-deps

# Fazer build local para testar
echo "🔨 Testando build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build. Corrija os erros antes de fazer deploy."
    exit 1
fi

echo "✅ Build local funcionando!"

# Verificar se Vercel CLI está instalado
if ! command -v vercel &> /dev/null; then
    echo "📥 Instalando Vercel CLI..."
    npm install -g vercel
fi

# Fazer deploy
echo "🚀 Fazendo deploy no Vercel..."
echo "ℹ️ Se for a primeira vez, configure:"
echo "   - Project name: maria-gulosa"
echo "   - Directory: ./"
echo "   - Link to existing project: No"

vercel

echo ""
echo "🎉 Deploy concluído!"
echo "📱 Acesse seu site em: https://maria-gulosa.vercel.app"
echo "⚙️ Configure as variáveis de ambiente no Vercel Dashboard"
echo "📖 Consulte README.md para instruções detalhadas" 