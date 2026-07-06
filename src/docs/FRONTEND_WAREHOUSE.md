# Frontend: Sklad

## Permissionlar

Sklad alohida permission bilan ishlaydi:

```text
warehouse.view
warehouse.manage
```

`GET` endpointlar uchun `warehouse.view`, create uchun `warehouse.manage` kerak.

## Sklad Summary

```text
GET /api/products/warehouse/summary/
```

Response:

```json
{
  "status": "success",
  "data": {
    "products_count": 1,
    "total_stock_value": "5000000.00",
    "total_sold_quantity": 2,
    "total_sales_amount": "2400000.00",
    "total_received_quantity": 10,
    "total_received_cost": "7000000.00",
    "products": [
      {
        "id": "product_uuid",
        "name": "550W Panel",
        "category": "Panel",
        "price": "1000000.00",
        "amount": 5,
        "stock_value": "5000000.00"
      }
    ]
  }
}
```

`amount` mahsulotning hozirgi sklad qoldig'i.

## Sklad Kirim

```text
POST /api/products/stock-entries/
```

Request:

```json
{
  "product": "product_uuid",
  "quantity": 10,
  "unit_cost": "700000.00",
  "supplier_name": "Supplier",
  "received_at": "2026-07-06T12:00:00+05:00",
  "notes": "Kirim"
}
```

`unit_cost`, `supplier_name`, `received_at`, `notes` optional. Kirim yaratilganda `Product.amount` avtomatik `quantity` ga oshadi.

Response:

```json
{
  "id": "stock_entry_uuid",
  "product": "product_uuid",
  "product_name": "550W Panel",
  "created_by": "user_uuid",
  "created_by_username": "admin",
  "created_by_name": "Admin",
  "quantity": 10,
  "unit_cost": "700000.00",
  "total_cost": "7000000.00",
  "supplier_name": "Supplier",
  "received_at": "2026-07-06T12:00:00+05:00",
  "notes": "Kirim",
  "created_at": "2026-07-06T..."
}
```

List/filter:

```text
GET /api/products/stock-entries/
GET /api/products/stock-entries/?product=product_uuid
```

Kirim yozuvi update/delete qilinmaydi. Xato bo'lsa yangi yozuv qo'shiladi.

## Sklad Sotuv

```text
POST /api/products/sales/
```

Request client tanlanmasdan:

```json
{
  "product": "product_uuid",
  "client_name": "Ali",
  "client_phone": "+998901234567",
  "quantity": 2,
  "unit_price": "1200000.00",
  "paid_amount": "2400000.00",
  "payment_type": "cash",
  "sold_at": "2026-07-06T12:00:00+05:00",
  "notes": "Naqd sotildi"
}
```

Request CRM client bilan:

```json
{
  "product": "product_uuid",
  "client": "client_uuid",
  "quantity": 1,
  "unit_price": "1200000.00",
  "paid_amount": "1200000.00",
  "payment_type": "cash"
}
```

Accounting entry bilan:

```json
{
  "product": "product_uuid",
  "accounting_entry": "accounting_entry_uuid",
  "quantity": 1,
  "unit_price": "1200000.00",
  "paid_amount": "1200000.00",
  "payment_type": "cash"
}
```

`payment_type` values:

```text
cash
card
transfer
debt
other
```

Sotuv yaratilganda:

```text
Product.amount = Product.amount - quantity
```

Agar skladda yetarli mahsulot bo'lmasa API `400` qaytaradi.

`paid_amount > 0` va `accounting_entry` yuborilmagan bo'lsa, admin/developer/accounting.manage userlarga notification boradi.

Notification type:

```text
warehouse_sale_accounting_missing
```

Response:

```json
{
  "id": "sale_uuid",
  "product": "product_uuid",
  "product_name": "550W Panel",
  "sold_by": "user_uuid",
  "sold_by_username": "admin",
  "sold_by_name": "Admin",
  "client": null,
  "client_full_name": null,
  "accounting_entry": null,
  "accounting_entry_label": "",
  "client_name": "Ali",
  "client_phone": "+998901234567",
  "quantity": 2,
  "unit_price": "1200000.00",
  "total_amount": "2400000.00",
  "paid_amount": "2400000.00",
  "payment_type": "cash",
  "sold_at": "2026-07-06T12:00:00+05:00",
  "notes": "Naqd sotildi",
  "created_at": "2026-07-06T..."
}
```

List/filter:

```text
GET /api/products/sales/
GET /api/products/sales/?product=product_uuid
GET /api/products/sales/?client=client_uuid
GET /api/products/sales/?payment_type=cash
```

Sotuv yozuvi update/delete qilinmaydi. Xato bo'lsa yangi yozuv qo'shiladi.

## Product Detail Ichida Tarix

```text
GET /api/products/{id}/
```

Product detail response ichida:

```json
{
  "id": "product_uuid",
  "name": "550W Panel",
  "amount": 5,
  "sales_history": [],
  "stock_entries_history": []
}
```

`sales_history` oxirgi 50 ta sotuvni qaytaradi. `stock_entries_history` oxirgi 50 ta kirimni qaytaradi.

Product listda bu historylar bo'sh array bo'lib keladi, og'ir query bo'lmasligi uchun.
