# SolarArmada Frontend API Guide

This document describes the current backend APIs and the WebSocket contract for the frontend.

## Base

- Local API base: `http://localhost:8000`
- Swagger: `http://localhost:8000/api/docs/`
- Schema: `http://localhost:8000/api/schema/`

All protected HTTP APIs use:

```http
Authorization: Bearer <access_token>
```

## Auth

### Login

- `POST /api/auth/login/`

Request:

```json
{
  "username": "developer",
  "password": "Password123!"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "access": "...",
    "refresh": "...",
    "user": {
      "id": "...",
      "username": "developer",
      "email": "",
      "first_name": "",
      "last_name": "",
      "role": "developer",
      "is_active": true,
      "is_staff": true,
      "permissions": ["..."]
    }
  }
}
```

### Refresh

- `POST /api/auth/refresh/`

Request:

```json
{
  "refresh": "..."
}
```

### Me

- `GET /api/auth/me/`

### Permissions

- `GET /api/auth/permissions/`
- `GET /api/auth/permissions/all/`
- `GET /api/auth/roles/`

## Users

- `GET /api/users/`
- `POST /api/users/`
- `GET /api/users/{id}/`
- `PATCH /api/users/{id}/`
- `DELETE /api/users/{id}/`
- `GET /api/users/{id}/permissions/`

List endpoints use DRF pagination:

```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": []
}
```

## Clients

### Clients

- `GET /api/clients/`
- `POST /api/clients/`
- `GET /api/clients/{id}/`
- `PATCH /api/clients/{id}/`
- `DELETE /api/clients/{id}/`

Fields:

- `full_name`
- `status`
- `notes`
- `subsidy_amount`
- `deposit_amount`
- `phone`
- `district`
- `neighborhood`
- `requested_kw`
- `pnfl`
- `password`
- `cadastre`
- `address`
- `contract_id`
- `payment_type`
- `auditor_company_name`
- `auditor_company_phone`
- `hokim_helper_name`
- `hokim_helper_phone`
- `card_number`
- `bank_branch_code`
- `bank_account_number`
- `created_at`
- `updated_at`

Required lead fields for AI-created clients:

- `full_name`
- `phone`
- `address`
- `requested_kw`
- `payment_type`

Optional fields:

- `district`
- `neighborhood`
- `contract_id`
- `auditor_company_name`
- `auditor_company_phone`
- `subsidy_amount`
- `deposit_amount`
- `pnfl`
- `password`
- `cadastre`
- `hokim_helper_name`
- `hokim_helper_phone`
- `card_number`
- `bank_branch_code`
- `bank_account_number`

`payment_type` values:

- `cash`
- `credit`

Example create request:

```json
{
  "full_name": "Ali Valiyev",
  "phone": "+998901234567",
  "address": "Xorazm viloyati, Bog'ot tumani",
  "district": "Bog'ot",
  "neighborhood": "Yangiobod",
  "requested_kw": "12.50",
  "payment_type": "cash",
  "contract_id": "CNT-1001",
  "auditor_company_name": "Audit Firma",
  "auditor_company_phone": "+998901112233",
  "status": "client-status-uuid"
}
```

### Client Statuses

- `GET /api/clients/statuses/`
- `POST /api/clients/statuses/`
- `GET /api/clients/statuses/{id}/`
- `PATCH /api/clients/statuses/{id}/`
- `DELETE /api/clients/statuses/{id}/`

Fields:

- `name`
- `slug`
- `is_default`
- `sort_order`

### Debtors

- `GET /api/clients/debtors/`
- `POST /api/clients/debtors/`
- `GET /api/clients/debtors/{id}/`
- `PATCH /api/clients/debtors/{id}/`
- `DELETE /api/clients/debtors/{id}/`

Fields:

- `debtor_type`
  - `solar_panel`
  - `moto_business`
- `full_name`
- `phone`
- `city`
- `district`
- `neighborhood`
- `debt_amount`
- `debt_taken_on`
- `repayment_due_date`
- `notes`

### Accounting Days

- `GET /api/clients/accounting/days/`
- `POST /api/clients/accounting/days/`
- `GET /api/clients/accounting/days/{id}/`
- `PATCH /api/clients/accounting/days/{id}/`
- `DELETE /api/clients/accounting/days/{id}/`

List response returns daily totals.
Detail response also returns `entries`.

### Accounting Entries

- `GET /api/clients/accounting/entries/`
- `POST /api/clients/accounting/entries/`
- `GET /api/clients/accounting/entries/{id}/`
- `PATCH /api/clients/accounting/entries/{id}/`
- `DELETE /api/clients/accounting/entries/{id}/`

Fields:

- `accounting_day`
- `category`
  - `credit_expense`
  - `daily_expense`
  - `cash_income`
  - `card_income`
  - `card_expense`
  - `dollar_income`
  - `dollar_expense`
- `counterparty_name`
- `amount`
- `currency`
- `notes`
- `sort_order`

## Products

- `GET /api/products/`
- `POST /api/products/`
- `GET /api/products/{id}/`
- `PATCH /api/products/{id}/`
- `DELETE /api/products/{id}/`

Fields:

- `name`
- `description`
- `price`
- `amount`
- `pictures`
- `picture_files`

### Product create/update with images

Use `multipart/form-data`.

Example fields:

- `name`
- `description`
- `price`
- `amount`
- `picture_files`

`picture_files` supports maximum `3` images.

## Tasks

- `GET /api/tasks/`
- `POST /api/tasks/`
- `GET /api/tasks/{id}/`
- `PATCH /api/tasks/{id}/`
- `DELETE /api/tasks/{id}/`
- `POST /api/tasks/{id}/move/`
- `GET /api/tasks/columns/`
- `POST /api/tasks/columns/`
- `GET /api/tasks/columns/{id}/`
- `PATCH /api/tasks/columns/{id}/`
- `DELETE /api/tasks/columns/{id}/`
- `GET /api/tasks/assignees/`

Task fields:

- `title`
- `description`
- `column_id`
- `assigned_to_id`
- `position`
- `due_at`

`move` request:

```json
{
  "column_id": "uuid",
  "position": 1
}
```

Notes:

- non-developer users cannot see developer in assignee list
- non-developer users cannot assign task to developer
- when a task is assigned, notification goes to that assigned user
- when a task moves to column `done`, all admins receive notification

Default task column slugs:

- `todo`
- `in_progress`
- `done`
- `canceled`

## Notifications

- `GET /api/notifications/`
- `GET /api/notifications/{id}/`
- `DELETE /api/notifications/{id}/`
- `POST /api/notifications/{id}/read/`
- `POST /api/notifications/read-all/`
- `DELETE /api/notifications/clear-all/`

Query params:

- `is_read=true|false`
- `type=client_created|task_assigned|task_done`
- `ordering=-created_at|created_at`

Notification fields:

- `id`
- `type`
- `title`
- `body`
- `data`
- `is_read`
- `read_at`
- `created_at`

Notification rules:

- when AI creates a new client, notification goes to all CRM users
- when a task is assigned, notification goes to that user
- when a task is moved to `done`, notification goes to admins
- `read-all` only affects current authenticated user
- `clear-all` only deletes notifications of current authenticated user

## Chats

### Chat Sessions

- `GET /api/chats/sessions/`
- `GET /api/chats/sessions/{id}/`
- `DELETE /api/chats/sessions/{id}/`

Query params:

- `search`
- `ordering`
- `platform`

### Chat Messages

- `GET /api/chats/sessions/{id}/messages/`

### Operator Send Message

- `POST /api/chats/sessions/{id}/send-message/`

Request:

```json
{
  "content": "Assalomu alaykum"
}
```

### Pause AI

- `POST /api/chats/sessions/{id}/pause-ai/`

Request:

```json
{
  "paused_until": "2026-06-15T18:30:00+05:00",
  "reason": "manual_pause"
}
```

### Resume AI

- `POST /api/chats/sessions/{id}/resume-ai/`

### Request Operator

- `POST /api/chats/sessions/{id}/request-operator/`

### Mark Read

- `POST /api/chats/sessions/{id}/mark-read/`

### Inbound Chat Message

- `POST /api/chats/inbound/`

Request:

```json
{
  "platform": "manual",
  "platform_user_id": "demo-1",
  "title": "Ali",
  "message": "Salom",
  "raw_payload": {}
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "session": {},
    "incoming": {},
    "outgoing": {}
  }
}
```

## AI Lead Intake Rules

Frontend should assume the active AI prompt is collecting these lead fields from chat:

- `full_name`
- `phone`
- `address`
- `requested_kw`
- `payment_type`

Frontend should not require AI to collect every optional CRM field before client creation.

Built-in company facts currently used by AI:

- Company: `Armada NRG kompaniya`
- Addresses:
  - `Xorazm viloyati Bo'g'ot tumani`
  - `Qashqadaryo viloyati Yakkabog'`
- Phone numbers:
  - `+99899 869 40-40`
  - `+99899 232-40-40`
  - `+99895 867-22-22`
  - `+99899 336 88-66`
  - `+99899 676 79-14`

If frontend exposes AI settings editing, keep in mind:

- backend AI architecture is `system prompt + function calls`
- client create/update in chat relies on `create_client` and `update_current_customer_client`
- required client creation fields in AI flow are stricter than generic manual CRM create

## Integrations

- `GET /api/settings/integrations/`
- `POST /api/settings/integrations/`
- `GET /api/settings/integrations/{id}/`
- `PATCH /api/settings/integrations/{id}/`
- `DELETE /api/settings/integrations/{id}/`
- `GET /api/settings/integrations/events/`

Main config fields:

- `provider`
- `key`
- `value`
- `is_active`
- `description`

## AI Settings

- `GET /api/settings/ai/`
- `POST /api/settings/ai/`
- `GET /api/settings/ai/{id}/`
- `PATCH /api/settings/ai/{id}/`
- `DELETE /api/settings/ai/{id}/`
- `GET /api/settings/ai/active/`

Fields:

- `name`
- `model`
- `temperature`
- `system_prompt`
- `function_calling_enabled`
- `is_active`

## Dashboard

- `GET /api/dashboard/overview/`

Query params:

- `date_from`
- `date_to`
- `report_date`
- `client_status`
- `debtor_type`

Response shape:

```json
{
  "status": "success",
  "data": {
    "filters": {},
    "clients": {},
    "debtors": {},
    "accounting_day": {}
  }
}
```

`accounting_day` returns the selected day plus full `entries` list.

## Audit Logs

- `GET /api/audit-logs/`

Query params:

- `actor`
- `action`
- `target_type`
- `date_from`
- `date_to`

Returns paginated audit logs.

## WebSocket

JWT auth is passed through query string:

```txt
?token=<access_token>
```

### All chat events

- `ws://localhost:8000/ws/chats/?token=<access_token>`

Events:

```json
{
  "type": "connection.ready",
  "scope": "chats"
}
```

```json
{
  "type": "chat.session_updated",
  "session": {}
}
```

```json
{
  "type": "chat.message_created",
  "session_id": "uuid",
  "message": {}
}
```

### Single session events

- `ws://localhost:8000/ws/chats/{session_id}/?token=<access_token>`

Events:

```json
{
  "type": "connection.ready",
  "scope": "chat",
  "session_id": "uuid"
}
```

and then the same:

- `chat.session_updated`
- `chat.message_created`

## Frontend integration order

1. Login and store `access` + `refresh`.
2. Load `me`, permissions, and roles.
3. Connect WebSocket with `?token=<access_token>`.
4. Load initial paginated lists over HTTP.
5. Apply real-time updates from WebSocket:
   - update session list on `chat.session_updated`
   - append messages on `chat.message_created`
6. Use standard paginated list parsing for all list endpoints:
   - `count`
   - `next`
   - `previous`
   - `results`
