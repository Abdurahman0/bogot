# Frontend: Mustaqil Sklad

Sklad endi `products` bilan bog'liq emas. Sklad uchun alohida endpointlar ishlatiladi.

## Permissionlar

```text
warehouse.view
warehouse.manage
```

## Mahsulotlar

```text
GET /api/warehouse/items/
POST /api/warehouse/items/
GET /api/warehouse/items/{id}/
PATCH /api/warehouse/items/{id}/
DELETE /api/warehouse/items/{id}/
```

Create:

```json
{
  "name": "Jinko panel",
  "category": "Panel",
  "description": "620W panel",
  "unit": "dona",
  "default_currency": "usd",
  "is_panel": true,
  "panel_watt": "620",
  "panel_count": "10",
  "panel_price": "0.12",
  "low_stock_threshold": "2"
}
```

Panel hisoblash avtomatik:

```text
panel_total_watt = panel_watt * panel_count
panel_total_price = panel_total_watt * panel_price
```

Detail response ichida oxirgi 50 ta `stock_entries_history` va `sales_history` keladi.

## Kirim

```text
POST /api/warehouse/stock-entries/
GET /api/warehouse/stock-entries/?item=&currency=&category=&date_from=&date_to=
```

Create:

```json
{
  "item": "warehouse_item_uuid",
  "quantity": "12",
  "currency": "usd",
  "unit_cost": "80",
  "supplier_name": "Supplier",
  "received_at": "2026-07-07T12:00:00+05:00",
  "notes": "Kirim"
}
```

Kirim yaratilganda `WarehouseItem.current_quantity` oshadi.

## Sotuv

```text
POST /api/warehouse/sales/
GET /api/warehouse/sales/?item=&currency=&category=&date_from=&date_to=
```

Create:

```json
{
  "item": "warehouse_item_uuid",
  "client": "client_uuid",
  "client_name": "Ali",
  "client_phone": "+998901234567",
  "quantity": "2",
  "currency": "uzs",
  "unit_price": "1000000",
  "paid_amount": "2000000",
  "payment_type": "cash",
  "sold_at": "2026-07-07T12:00:00+05:00",
  "notes": "Naqd sotildi"
}
```

Sotuv yaratilganda `WarehouseItem.current_quantity` kamayadi. Skladda yetarli mahsulot bo'lmasa `400` qaytadi.

`payment_type`:

```text
cash
card
transfer
debt
other
```

## Stats

```text
GET /api/warehouse/stats/?date_from=&date_to=&currency=&category=
```

Response:

```json
{
  "status": "success",
  "data": {
    "items_count": 1,
    "total_quantity": "10.00",
    "low_stock_count": 0,
    "stock_entries_count": 1,
    "sales_count": 1,
    "stock_total_cost": {
      "uzs": "0",
      "usd": "500"
    },
    "sales_total_amount": {
      "uzs": "0",
      "usd": "160"
    },
    "sales_paid_amount": {
      "uzs": "0",
      "usd": "160"
    },
    "panel_items_count": 1,
    "panel_total_count": "10",
    "panel_total_watt": "6200",
    "panel_total_price": "620",
    "by_category": []
  }
}
```

## Excel Export

```text
GET /api/warehouse/export/excel/?date_from=&date_to=&currency=&category=
```

Excel sheetlar:

```text
Sklad qoldiq
Kirimlar
Sotuvlar
Panel hisob-kitob
Stats
```
