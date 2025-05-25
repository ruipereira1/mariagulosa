# 🛒 Sistema de Carrinho e Encomendas - Maria Gulosa

## 📋 Funcionalidades Implementadas

### 1. **Modal de Confirmação**
- Quando o usuário clica em um bolo, abre um modal elegante
- Permite escolher a quantidade desejada
- Mostra o preço total calculado
- Botões para adicionar ou cancelar

### 2. **Carrinho Inteligente**
- Botão flutuante no canto inferior direito
- Badge com número de itens quando há produtos
- Animação quando itens são adicionados
- Persistência durante a sessão

### 3. **Gestão de Itens**
- Adicionar múltiplas quantidades
- Aumentar/diminuir quantidade no carrinho
- Remover itens individuais
- Limpar carrinho completo

### 4. **Envio para WhatsApp**
- Mensagem formatada automaticamente
- Inclui todos os itens com quantidades
- Calcula subtotais e total geral
- Limpa carrinho após envio

## 🎯 Fluxo de Uso

1. **Escolher Bolo**: Usuário clica no botão do bolo desejado
2. **Modal Abre**: Pergunta se quer adicionar à encomenda
3. **Selecionar Quantidade**: Usuário escolhe quantos quer
4. **Adicionar**: Bolo vai para o carrinho
5. **Repetir**: Pode adicionar mais bolos
6. **Revisar**: Clica no carrinho para ver resumo
7. **Enviar**: Envia tudo para WhatsApp formatado

## 📱 Componentes Criados

### `CartContext.tsx`
- Gerencia estado global do carrinho
- Funções para adicionar, remover, atualizar
- Calcula totais e gera mensagem WhatsApp

### `AddToCartModal.tsx`
- Modal elegante para confirmação
- Seletor de quantidade com +/-
- Cálculo de preço em tempo real
- Animações suaves

### `CartSummary.tsx`
- Botão flutuante do carrinho
- Modal com resumo completo
- Gestão de quantidades
- Botão de envio para WhatsApp

## 💬 Formato da Mensagem WhatsApp

```
Olá! Gostaria de fazer a seguinte encomenda:

🎂 Bolo de Chocolate Especial
   Quantidade: 2
   Preço unitário: € 25,00
   Subtotal: € 50,00

🎂 Bolo de Morango
   Quantidade: 1
   Preço unitário: € 23,00
   Subtotal: € 23,00

💰 Total: € 73,00

Obrigado!
```

## 🎨 Design e UX

- **Cores**: Mantém paleta rosa-dourado da marca
- **Animações**: Framer Motion para transições suaves
- **Responsivo**: Funciona em mobile e desktop
- **Intuitivo**: Fluxo natural e familiar
- **Feedback**: Alertas e animações de confirmação

## 🔧 Integração

- **WhatsApp**: +351 914 019 142 (Portugal)
- **Moeda**: Euros com formatação europeia
- **Idioma**: Português de Portugal
- **Persistência**: Durante a sessão do navegador

## ✨ Melhorias Futuras

- [ ] Salvar carrinho no localStorage
- [ ] Opções de personalização dos bolos
- [ ] Data de entrega preferida
- [ ] Múltiplos endereços de entrega
- [ ] Histórico de pedidos
- [ ] Notificações push

---

**Desenvolvido com ❤️ para Maria Gulosa**
*Sistema completo de encomendas online* 