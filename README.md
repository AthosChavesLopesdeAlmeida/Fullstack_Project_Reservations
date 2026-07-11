
## Visão geral

Sistema de reservas de salas com dois papéis: **usuário comum** (reserva salas) e **admin** (gerencia salas e vê todas as reservas).

## Entidades (Prisma)

- **User**: id, name, email, password (hash), role (`USER` | `ADMIN`), createdAt
- **Room**: id, name, capacity, location, description, isActive
- **Reservation**: id, userId, roomId, startTime, endTime, status (`CONFIRMED` | `CANCELLED`), createdAt

## Páginas (App Router)

| Rota | Descrição | Acesso |
|---|---|---|
| `/login` | Login | Público |
| `/register` | Cadastro | Público |
| `/` (dashboard) | Visão geral: próximas reservas do usuário | Autenticado |
| `/rooms` | Listagem de salas disponíveis (com filtro por capacidade/data) | Autenticado |
| `/rooms/[id]` | Detalhe da sala + calendário de disponibilidade + form de reserva | Autenticado |
| `/reservations` | Minhas reservas (futuras/passadas, cancelar) | Autenticado |
| `/admin/rooms` | CRUD de salas | Admin |
| `/admin/reservations` | Visão de todas as reservas do sistema | Admin |

Total: **8 páginas**.

## Features principais

1. **Autenticação** — cadastro/login (ex: NextAuth ou JWT manual), sessão persistida
2. **CRUD de salas** — apenas admin cria/edita/desativa salas
3. **Criação de reserva** — usuário escolhe sala, data e horário
4. **Validação de conflito de horário** — não permitir duas reservas sobrepostas na mesma sala (regra de negócio central do projeto)
5. **Cancelamento de reserva** — usuário cancela a própria reserva; admin cancela qualquer uma
6. **Visualização de disponibilidade** — calendário/agenda mostrando horários livres/ocupados de uma sala
7. **Autorização por papel (role-based)** — rotas e ações de admin protegidas
8. **Filtro/busca de salas** — por capacidade, localização, disponibilidade em um horário específico

## Possíveis extensões (fora do escopo inicial, mas fáceis de plugar depois)

- Notificação por e-mail ao confirmar/cancelar reserva
- Reservas recorrentes (ex: toda segunda às 10h)
- Aprovação de reserva pelo admin antes de confirmar (workflow)
- Tempo real (WebSockets) pra atualizar disponibilidade sem refresh

## Estimativa de complexidade

- Ponto mais delicado tecnicamente: **validação de conflito de horário** no backend (query Prisma com `AND`/`OR` de intervalos sobrepostos) — é o principal salto de dificuldade em relação à todo-list.
- Segundo ponto: **autenticação + autorização por role**, que a todo-list provavelmente não tinha.

