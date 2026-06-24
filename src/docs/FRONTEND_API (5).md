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
- `product`
- `product_name`
- `district`
- `neighborhood`
- `requested_kw`
- `annual_consumption_kwh`
- `estimated_subsidy_kw`
- `source`
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

Optional fields:

- `product`
- `address`
- `district`
- `neighborhood`
- `requested_kw`
- `annual_consumption_kwh`
- `estimated_subsidy_kw`
- `payment_type`
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
- `color`
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

- `GET /api/products/categories/`
- `POST /api/products/categories/`
- `GET /api/products/categories/{id}/`
- `PATCH /api/products/categories/{id}/`
- `DELETE /api/products/categories/{id}/`
- `GET /api/products/`
- `POST /api/products/`
- `GET /api/products/{id}/`
- `PATCH /api/products/{id}/`
- `DELETE /api/products/{id}/`

### Product Categories

Fields:

- `name`
- `code`
- `sort_order`

Fields:

- `category`
- `category_name`
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

Task column fields:

- `name`
- `slug`
- `color`
- `sort_order`

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
- optional: `requested_kw`
- optional: `annual_consumption_kwh`
- optional: `payment_type`

Subsidy logic used by backend and AI:

- `0-1500` yearly kWh -> `5 kW` -> `4,500,000` so'm
- `1500-3000` yearly kWh -> `10 kW` -> `9,000,000` so'm
- `3000-4500` yearly kWh -> `15 kW` -> `13,500,000` so'm
- `4500-6000` yearly kWh -> `20 kW` -> `18,000,000` so'm

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
- subsidy estimate in chat relies on `calculate_subsidy_estimate`

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

### Instagram Webhook

- `GET /api/settings/integrations/instagram/webhook/`
- `POST /api/settings/integrations/instagram/webhook/`

Verify token config key:

- `provider=instagram`
- `key=verify_token`
- default value: `:killer;`

Current webhook behavior:

- `GET` is used by Meta webhook verification
- `POST` accepts incoming Instagram messaging payloads
- text messages are converted into chat inbound messages and sent into AI flow

Future config keys that backend is ready to store:

- `provider=instagram`, `key=business_id`
- `provider=instagram`, `key=access_token`

### Telegram Bot Webhook

- `POST /api/settings/integrations/telegram/webhook/`
- `POST /api/settings/integrations/telegram/webhook/setup/`
- `GET /api/settings/integrations/telegram/webhook/setup/`

Config key:

- `provider=telegram`
- `key=bot_token`

Behavior:

- Telegram bot text messages are converted into chat inbound messages
- AI reply is automatically sent back to the same Telegram chat
- operator replies from CRM to a Telegram chat are also sent to Telegram
- Telegram and Instagram webhooks use a 5-second debounce window so if customer sends 2-3 quick messages, AI gets them together and returns one reply

`POST /api/settings/integrations/telegram/webhook/setup/`:

- if `webhook_url` is provided, backend sets that exact Telegram webhook URL
- if not provided, backend uses its own `telegram/webhook/` absolute URL

Example setup body:

```json
{
  "webhook_url": "https://armada.solar.api.cognilabs.org/api/settings/integrations/telegram/webhook/"
}
```

### Telegram WebApp

- `POST /api/settings/integrations/telegram/webapp/auth/`
- `GET /api/clients/telegram-webapp/products/`
- `GET /api/clients/telegram-webapp/products/{id}/`
- `GET /api/clients/telegram-webapp/subsidy-estimate/`
- `POST /api/clients/telegram-webapp/clients/`

Telegram WebApp requests must send init data in one of these ways:

- header: `X-Telegram-Init-Data`
- query param: `init_data`
- body field: `init_data`

Bot token source:

- `provider=telegram`
- `key=bot_token`

`GET /api/clients/telegram-webapp/subsidy-estimate/` query params:

- `annual_consumption_kwh`
- or `requested_kw`

Example response:

```json
{
  "status": "success",
  "data": {
    "annual_consumption_kwh": "3200.00",
    "estimated_subsidy_kw": "15.00",
    "subsidy_amount": "13500000",
    "based_on": "annual_consumption_kwh"
  }
}
```

`POST /api/clients/telegram-webapp/clients/` required fields:

- `full_name`
- `phone`

At least one of these must also be provided:

- `product`
- `requested_kw`
- `annual_consumption_kwh`

Optional fields:

- `address`
- `district`
- `neighborhood`

Create response returns both saved client and subsidy estimate.

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

## Excel export

All export endpoints return binary `.xlsx` files.

Frontend request rules:

- send normal authenticated `GET` request with `Authorization: Bearer <access_token>`
- set client `responseType` to `blob`
- download returned blob as file

### Clients export

- `GET /api/clients/export/excel/`

Purpose:

- export all clients
- or export filtered clients by created date range

Query params:

- `date_from` optional, format: `YYYY-MM-DD`
- `date_to` optional, format: `YYYY-MM-DD`

Behavior:

- if no params are sent, backend returns full export
- if `date_from` and/or `date_to` are sent, backend filters by `created_at`

Example:

```txt
/api/clients/export/excel/?date_from=2026-06-01&date_to=2026-06-30
```

File contents:

- full name
- phone
- status
- source
- product
- address
- district
- neighborhood
- requested kW
- annual consumption
- estimated subsidy kW
- subsidy amount
- payment type
- contract id
- auditor company info
- notes
- ai summary
- created/updated timestamps

### Debtors export

- `GET /api/clients/debtors/export/excel/`

Purpose:

- export all debtors
- or export debtors with filters

Query params:

- `date_from` optional, format: `YYYY-MM-DD`
- `date_to` optional, format: `YYYY-MM-DD`
- `district` optional, text filter, partial match
- `neighborhood` optional, text filter, partial match

Behavior:

- if no params are sent, backend returns full export
- date filtering uses `debt_taken_on`
- district filtering uses `district__icontains`
- neighborhood filtering uses `neighborhood__icontains`

Examples:

```txt
/api/clients/debtors/export/excel/
/api/clients/debtors/export/excel/?date_from=2026-06-01&date_to=2026-06-30
/api/clients/debtors/export/excel/?district=Bog'ot
/api/clients/debtors/export/excel/?district=Bog'ot&neighborhood=Navbahor
/api/clients/debtors/export/excel/?date_from=2026-06-01&date_to=2026-06-30&district=Bog'ot&neighborhood=Navbahor
```

File contents:

- debtor type
- full name
- phone
- city
- district
- neighborhood
- debt amount
- debt taken date
- repayment due date
- notes
- created/updated timestamps

### Frontend blob download example

```ts
const response = await axios.get("/api/clients/export/excel/", {
  responseType: "blob",
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
  params: {
    date_from: "2026-06-01",
    date_to: "2026-06-30",
  },
});

const blob = new Blob([response.data], {
  type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
});

const url = window.URL.createObjectURL(blob);
const link = document.createElement("a");
link.href = url;
link.download = "clients_export.xlsx";
link.click();
window.URL.revokeObjectURL(url);
```

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
