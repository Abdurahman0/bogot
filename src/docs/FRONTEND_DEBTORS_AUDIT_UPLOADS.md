# Frontend: Qarzdorlar, Audit Log, Uploadlar

## Qarzdor To'lovi Va Accounting

`POST /api/clients/debtor-payments/`

Accounting entry bor bo'lsa:

```json
{
  "debtor": "debtor_uuid",
  "accounting_entry": "accounting_entry_uuid",
  "amount": "200000.00",
  "paid_on": "2026-07-06",
  "notes": "Naqd berdi"
}
```

Accounting entry hali yozilmagan bo'lsa:

```json
{
  "debtor": "debtor_uuid",
  "amount": "200000.00",
  "paid_on": "2026-07-06",
  "notes": "Naqd berdi"
}
```

`accounting_entry` yuborilmasa backend accounting entry yaratmaydi. Shu payment uchun admin, developer va `accounting.manage` permission bor userlarga notification yuboradi.

Response ichida yangi fieldlar:

```json
{
  "id": "payment_uuid",
  "debtor": "debtor_uuid",
  "debtor_name": "Qarzdor Test",
  "accounting_entry": null,
  "accounting_entry_label": "",
  "created_by": "user_uuid",
  "created_by_username": "admin",
  "created_by_name": "admin",
  "amount": "200000.00",
  "paid_on": "2026-07-06",
  "notes": "Naqd berdi"
}
```

Notification type:

```text
debtor_payment_accounting_missing
```

## Qarzdor Fayllari

`POST /api/clients/debtor-attachments/`

Request `multipart/form-data` bo'lishi kerak.

Fields:

```text
debtor: debtor_uuid
file: image/video/document
file_type: image | video | file
notes: optional text
is_visit_proof: true | false
latitude: optional decimal
longitude: optional decimal
```

Example:

```text
debtor=debtor_uuid
file=visit.jpg
file_type=image
notes=Uyiga borildi
is_visit_proof=true
latitude=41.5500000
longitude=60.6300000
```

List/filter:

```text
GET /api/clients/debtor-attachments/
GET /api/clients/debtor-attachments/?debtor=debtor_uuid
GET /api/clients/debtor-attachments/?is_visit_proof=true
GET /api/clients/debtor-attachments/?file_type=image
```

Debtor detail ichida ham `attachments` keladi:

```text
GET /api/clients/debtors/{id}/
```

Attachment response:

```json
{
  "id": "attachment_uuid",
  "debtor": "debtor_uuid",
  "debtor_name": "Qarzdor Test",
  "uploaded_by": "user_uuid",
  "uploaded_by_username": "admin",
  "uploaded_by_name": "Admin",
  "file": "/media/debtors/debtor_uuid/visit.jpg",
  "file_url": "https://api-domain/media/debtors/debtor_uuid/visit.jpg",
  "file_type": "image",
  "notes": "Uyiga borildi",
  "is_visit_proof": true,
  "latitude": "41.5500000",
  "longitude": "60.6300000",
  "created_at": "2026-07-06T..."
}
```

`uploaded_by` frontenddan yuborilmaydi, backend login userdan o'zi yozadi.

## Audit Log

Audit log endpoint:

```text
GET /api/audit-logs/
```

Filterlar:

```text
GET /api/audit-logs/?actor=user_uuid
GET /api/audit-logs/?action=create
GET /api/audit-logs/?action=update
GET /api/audit-logs/?target_type=Debtor
GET /api/audit-logs/?date_from=2026-07-01&date_to=2026-07-06
```

Faqat admin va developer ko'radi. Admin developer loglarini ko'rmaydi. Developer hammasini ko'radi.

Muhim response fieldlar:

```json
{
  "id": "audit_uuid",
  "actor": "user_uuid",
  "actor_username": "admin",
  "action": "update",
  "target_type": "Debtor",
  "target_id": "debtor_uuid",
  "target_repr": "Qarzdor Test - 1000000.00",
  "before_data": {},
  "after_data": {},
  "metadata": {
    "target_label": "qarzdor",
    "action_label": "o'zgartirdi",
    "human_message": "qarzdor 'Qarzdor Test - 1000000.00' o'zgartirdi: Telefon: +998901234567 -> +998909999999",
    "changed_fields": [
      {
        "field": "phone",
        "label": "Telefon",
        "old": "+998901234567",
        "new": "+998909999999",
        "message": "Telefon: +998901234567 -> +998909999999"
      }
    ]
  },
  "created_at": "2026-07-06T..."
}
```

Frontendda asosiy ko'rsatish uchun `metadata.human_message` ishlatiladi. Detail modalda `metadata.changed_fields` ro'yxatini ko'rsatish kerak. Texnik JSON kerak bo'lsa `before_data` va `after_data` mavjud.

## Permissionlar

Qarzdorlar:

```text
debtors.view
debtors.manage
```

Accounting notification oladiganlar:

```text
role=admin
role=developer
accounting.manage permission bor user
```

Audit log:

```text
admin yoki developer role
```
