# Itamar Imóveis - Sistema de Status de Corretores

## Visão Geral
Aplicativo web para controle em tempo real do status online/offline dos corretores da Itamar Imóveis. Sistema desenvolvido para uso interno pelas secretárias, permitindo gerenciamento rápido e visual da disponibilidade da equipe.

## Funcionalidades Implementadas

### ✅ MVP Completo
- **CRUD de Corretores**: Adicionar, editar, visualizar e excluir corretores
- **Toggle de Status**: Alternar status online/offline com um clique
- **Filtros Inteligentes**: Visualizar todos, apenas online ou apenas offline
- **Filtros por Região**: Organizar corretores por "Praia do Morro" e "Centro"
- **Atualizações em Tempo Real**: WebSocket para sincronização instantânea entre múltiplas telas
- **Dashboard Visual**: Cards elegantes com indicadores coloridos de status e região
- **Design Responsivo**: Interface adaptável para desktop, tablet e mobile

### Características Técnicas
- Interface em português brasileiro
- Validação completa de formulários
- Estados de loading e erro
- Animações suaves nas transições
- Contadores dinâmicos (Online/Offline/Total)
- Notificações toast para feedback de ações

## Stack Tecnológica

### Frontend
- **React 18** com TypeScript
- **Wouter** para roteamento
- **TanStack Query** para gerenciamento de estado e cache
- **Shadcn UI** para componentes (Dialog, Button, Switch, Tabs, Card, etc.)
- **Tailwind CSS** para estilização
- **WebSocket** para comunicação em tempo real
- **React Hook Form** + **Zod** para validação de formulários

### Backend
- **Express.js** para REST API
- **WebSocket (ws)** para atualizações em tempo real
- **Zod** para validação de dados
- **TypeScript** para type safety
- **MemStorage** para persistência em memória

### Endpoints API
```
GET    /api/brokers          # Listar todos os corretores
GET    /api/brokers/:id      # Buscar corretor específico
POST   /api/brokers          # Criar novo corretor
PATCH  /api/brokers/:id      # Atualizar corretor
PATCH  /api/brokers/:id/status # Atualizar status online/offline
DELETE /api/brokers/:id      # Deletar corretor
WS     /ws                   # WebSocket para atualizações em tempo real
```

### Schema de Dados
```typescript
Broker {
  id: string (UUID)
  name: string
  email: string
  phone: string
  photoUrl: string | null (opcional)
  region: "Praia do Morro" | "Centro"
  isOnline: boolean
}
```

## Design System

### Cores de Status
- **Online**: Verde vibrante `hsl(142 76% 45%)` - indica disponibilidade
- **Offline**: Vermelho `hsl(0 72% 55%)` - indica indisponibilidade
- **Primary**: Azul profissional `hsl(210 85% 45%)` - branding imobiliário

### Cores de Região
- **Praia do Morro**: Azul claro - badge com bordas azuis
- **Centro**: Laranja claro - badge com bordas laranjas

### Layout
- Desktop: Grid de 3 colunas
- Tablet: Grid de 2 colunas
- Mobile: Grid de 1 coluna
- Container: max-width 7xl com padding responsivo

### Componentes Principais
- **BrokerCard**: Card individual com avatar, info de contato, badges de status e região, e toggle
- **StatusBadge**: Indicador visual colorido com ícone e texto
- **AddBrokerDialog**: Modal para adicionar novo corretor (com seleção de região)
- **EditBrokerDialog**: Modal para editar dados do corretor (incluindo região)
- **DeleteConfirmDialog**: Confirmação antes de excluir

## Como Usar

### Para Secretárias
1. Acesse a aplicação no navegador
2. Visualize todos os corretores na tela principal
3. Use os **filtros de status** (Todos/Online/Offline) para encontrar corretores específicos
4. Use os **filtros de região** (Todas/Praia do Morro/Centro) para organizar por localização
5. **Toggle o switch** ao lado de cada corretor para mudar o status
6. Clique em **"Adicionar Corretor"** para cadastrar novos membros da equipe (selecione a região)
7. Use **"Editar"** para atualizar informações de contato e região
8. Use **"Excluir"** para remover corretores (requer confirmação)

### Atualizações em Tempo Real
- Quando uma secretária atualiza o status de um corretor, **todas as telas abertas são atualizadas automaticamente**
- Não é necessário recarregar a página
- Ideal para ambientes com múltiplas estações de trabalho

## Estrutura do Projeto

```
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   │   ├── BrokerCard.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── AddBrokerDialog.tsx
│   │   │   ├── EditBrokerDialog.tsx
│   │   │   └── DeleteConfirmDialog.tsx
│   │   ├── hooks/         # Custom hooks
│   │   │   └── useWebSocket.ts
│   │   ├── pages/         # Páginas
│   │   │   └── Home.tsx
│   │   └── lib/           # Utilitários
│   └── index.html
│
├── server/                # Backend Node.js
│   ├── routes.ts         # Endpoints REST + WebSocket
│   ├── storage.ts        # Interface de armazenamento
│   └── index.ts          # Configuração do servidor
│
├── shared/               # Código compartilhado
│   └── schema.ts        # Schemas Zod e tipos TypeScript
│
└── design_guidelines.md # Diretrizes de design
```

## Desenvolvimento

### Comandos
```bash
npm run dev    # Inicia servidor de desenvolvimento
```

### Portas
- Frontend + Backend: `http://localhost:5000`
- WebSocket: `ws://localhost:5000/ws`

### Ambiente
- Node.js 20
- TypeScript
- Vite para desenvolvimento rápido

## Estado Atual

### ✅ Implementado e Testado
- [x] CRUD completo de corretores
- [x] Toggle de status com feedback visual
- [x] Filtros por status (All/Online/Offline)
- [x] WebSocket para atualizações em tempo real
- [x] Design responsivo mobile-first
- [x] Validação de formulários
- [x] Estados de loading/erro
- [x] Animações e transições suaves
- [x] Testes end-to-end com Playwright

### 📝 Melhorias Futuras (Opcional)
- [ ] Autenticação para secretárias
- [ ] Histórico de disponibilidade dos corretores
- [ ] Página pública para clientes visualizarem corretores disponíveis
- [ ] Notificações push quando corretor muda status
- [ ] Persistência em banco de dados (PostgreSQL)
- [ ] Upload de fotos de perfil
- [ ] Filtro por nome/email

## Notas Técnicas

### Armazenamento
- Atualmente usa **MemStorage** (dados em memória)
- Dados são perdidos quando o servidor reinicia
- Para produção, considerar migração para PostgreSQL

### WebSocket
- Reconexão automática em caso de desconexão
- Mensagens tipadas: `broker_added`, `broker_updated`, `status_changed`, `broker_deleted`
- Invalidação automática de cache do TanStack Query

### Performance
- Skeleton screens durante carregamento
- Otimistic updates para melhor UX
- Cache inteligente com TanStack Query
- Lazy loading de componentes quando necessário

## Suporte
Sistema desenvolvido especificamente para Itamar Imóveis com foco em simplicidade, eficiência e design profissional.
