# Frontend CRM Changes - 2026-07-01

Bu hujjat CRM backenddagi oxirgi o'zgarishlarni frontendga qo'shish uchun yozildi.

## 1. Clients Excel Export

Endpoint o'zgarmagan:

```http
GET /api/clients/export/excel/
```

Query params o'zgarmagan:

```http
GET /api/clients/export/excel/?date_from=2026-01-01&date_to=2026-12-31
```

Excel ichidagi ustun tartibi o'zgardi.

Oldingi tartib:

```text
F.I.SH | Telefon | ...
```

Yangi tartib:

```text
F.I.SH | Parol | Telefon | ...
```

Frontendda maxsus mapping yoki preview bo'lsa, `Parol` ustuni `F.I.SH`dan keyin, `Telefon`dan oldin turishi kerak.

Muhim: export download qilish logikasi o'zgarmaydi. Faqat Excel ichidagi column order o'zgargan.

## 2. Debtor Payments: Kim Qo'shganini Ko'rsatish

Qarzdor to'lovi yaratilganda backend avtomatik current userni yozadi.

Endpoint o'zgarmagan:

```http
POST /api/clients/debtor-payments/
```

Frontend requestda user yubormaydi. Backend token orqali userni o'zi oladi.

Request:

```json
{
  "debtor": "DEBTOR_ID",
  "amount": "200000",
  "paid_on": "2026-07-01",
  "notes": "Naqd to'ladi"
}
```

Response endi qo'shimcha fieldlar qaytaradi:

```json
{
  "id": "PAYMENT_ID",
  "debtor": "DEBTOR_ID",
  "debtor_name": "Ali Valiyev",
  "created_by": "USER_ID",
  "created_by_username": "admin",
  "created_by_name": "Admin User",
  "amount": "200000.00",
  "paid_on": "2026-07-01",
  "notes": "Naqd to'ladi",
  "created_at": "2026-07-01T15:00:00+05:00",
  "updated_at": "2026-07-01T15:00:00+05:00"
}
```

UI'da ko'rsatish kerak bo'lgan joylar:

- Qarzdor detail ichidagi to'lovlar jadvali.
- Debtor payments list sahifasi bo'lsa, o'sha jadval.

Tavsiya qilingan columns:

```text
Sana | Summa | Izoh | Qo'shgan user | Yaratilgan vaqt
```

`Qo'shgan user` uchun:

```ts
payment.created_by_name || payment.created_by_username || "-"
```

## 3. Debtor Detail Response

Endpoint:

```http
GET /api/clients/debtors/{DEBTOR_ID}/
```

`payments` array ichidagi har bir paymentda endi user fieldlari bor:

```json
{
  "payments": [
    {
      "id": "PAYMENT_ID",
      "created_by": "USER_ID",
      "created_by_username": "operator1",
      "created_by_name": "Operator One",
      "amount": "200000.00",
      "paid_on": "2026-07-01",
      "notes": "Naqd to'ladi"
    }
  ]
}
```

Frontend qarzdor detailda to'lov tarixi ko'rsatayotgan bo'lsa, har bir qatorda kim qo'shgani ham chiqishi kerak.

## 4. Debtor Amount Qoidasi

Backend endi amountlarni auto millionga ko'paytirmaydi.

Oldin:

```text
8 -> 8,000,000
```

Endi:

```text
8 -> 8.00
8000000 -> 8,000,000.00
```

Frontend inputda foydalanuvchi qancha yozsa, backend shuni saqlaydi.

Shuning uchun frontendda:

- Placeholder aniq bo'lsin: `Masalan: 200000`
- Mask/format bor bo'lsa, backendga numeric string to'liq yuborilsin.
- `200 000`, `200,000`, `200000` kabi formatlardan frontend o'zi `200000` qilib yuborsa yaxshi.

To'lov yozish misoli:

```json
{
  "debtor": "DEBTOR_ID",
  "amount": "200000",
  "paid_on": "2026-07-01",
  "notes": "Naqd to'ladi"
}
```

## 5. Accounting Excel Export

Endpointlar:

```http
GET /api/clients/accounting/export/excel/
GET /api/clients/accounting/export/entries/
```

Ikkalasi ham Excel qaytaradi.

Filterlar:

```http
GET /api/clients/accounting/export/excel/?date_from=2026-07-01&date_to=2026-07-01
GET /api/clients/accounting/export/excel/?report_date=2026-07-01
```

Frontend download logicasi o'zgarmaydi:

- `responseType: "blob"` ishlatish kerak.
- Filename backend `Content-Disposition`dan olinadi yoki fallback beriladi.

Excel ichidagi format o'zgardi:

- Birinchi sheet: `Касса`
- Ikkinchi sheet: `Tranzaksiyalar`

`Касса` sheetda:

- Har kun alohida blok.
- Chiqimlar qizil rangda.
- Kunlik chiqim och qizil rangda.
- Kirimlar yashil rangda.
- Jami qator ko'k rangda.
- Qoldiq qatorlar yashil rangda.

Frontendda bu uchun qo'shimcha UI o'zgarish shart emas, chunki ranglar Excel ichida backendda beriladi.

## 6. Migration Eslatmasi

Backend deploydan keyin migration ishlashi kerak:

```bash
python manage.py migrate
```

Yangi DB field:

```text
DebtorPayment.created_by
```

Migration:

```text
clients/migrations/0011_debtorpayment_created_by.py
```

## 7. Frontend Checklist

- Clients Excel download ishlayotganini tekshirish.
- Download qilingan Excelda ustunlar `F.I.SH | Parol | Telefon` tartibida ekanini tekshirish.
- Debtor detail payments jadvaliga `Qo'shgan user` column qo'shish.
- Debtor payment create requestga `created_by` yubormaslik.
- Payment response va debtor detail response ichidan `created_by_name` yoki `created_by_username`ni ko'rsatish.
- Amount inputda auto millionga ishonmaslik.
- `200000` yuborilsa `200000.00` qaytishini tekshirish.
- `8` yuborilsa `8.00` qaytishini tekshirish.
- Accounting Excel download qilib `Касса` sheet ranglari va `Tranzaksiyalar` sheet borligini tekshirish.
