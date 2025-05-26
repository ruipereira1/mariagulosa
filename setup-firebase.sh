#!/bin/bash

# 🔥 Script de Configuração Firebase - Maria Gulosa
echo "🔥 Configurando Firebase para desenvolvimento local..."

# Verificar se o template existe
if [ ! -f "firebase.env.template" ]; then
    echo "❌ Erro: firebase.env.template não encontrado!"
    exit 1
fi

# Verificar se .env.local já existe
if [ -f ".env.local" ]; then
    echo "⚠️ Arquivo .env.local já existe!"
    read -p "Deseja sobrescrever? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Configuração cancelada."
        exit 1
    fi
fi

# Copiar template para .env.local
cp firebase.env.template .env.local

if [ $? -eq 0 ]; then
    echo "✅ Arquivo .env.local criado com sucesso!"
    echo "📁 Localização: $(pwd)/.env.local"
    echo ""
    echo "🔒 Segurança:"
    echo "   - O arquivo .env.local está no .gitignore"
    echo "   - Suas credenciais NÃO serão commitadas"
    echo "   - Apenas você tem acesso local"
    echo ""
    echo "🚀 Próximos passos:"
    echo "   1. npm run dev (para testar localmente)"
    echo "   2. Configure as mesmas variáveis no Vercel para produção"
    echo "   3. Consulte FIREBASE_CONFIG.md para mais detalhes"
else
    echo "❌ Erro ao criar .env.local"
    exit 1
fi 