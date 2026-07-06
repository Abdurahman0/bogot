/* pages/warehouse.jsx */
const { useState: whS, useMemo: whM, useEffect: whE, useRef: whR } = React;

const WH_UI = {
  uz: {
    title: "Sklad", desc: "Mahsulot kirim va sotuv boshqaruvi",
    crumb: "Katalog va moliya",
    summaryProducts: "Mahsulotlar", summaryStockValue: "Sklad qiymati",
    summarySold: "Sotilgan", summaryReceived: "Kirim (jami)",
    tabSummary: "Umumiy", tabStock: "Kirim", tabSales: "Sotuv",
    newStock: "Kirim qilish", newSale: "Sotuv", newProduct: "Yangi mahsulot",
    stockEntries: "Kirim yozuvlari", salesEntries: "Sotuv yozuvlari",
    product: "Mahsulot", quantity: "Miqdor", unitCost: "Birlik narxi",
    totalCost: "Jami narx", supplier: "Yetkazuvchi", receivedAt: "Kelish sanasi",
    unitPrice: "Birlik narxi", totalAmount: "Jami summa", paidAmount: "To'langan",
    paymentType: "To'lov turi", soldAt: "Sotilgan sana", clientName: "Mijoz ismi",
    clientPhone: "Telefon", notes: "Izoh", soldBy: "Sotdi", addedBy: "Qo'shdi",
    stockValue: "Qoldiq qiymati", currentStock: "Joriy qoldiq",
    cash: "Naqd", card: "Karta", transfer: "O'tkazma", debt: "Qarz", other: "Boshqa",
    save: "Saqlash", cancel: "Bekor qilish", create: "Yaratish", close: "Yopish",
    edit: "Tahrirlash", delete: "O'chirish", actions: "Amallar",
    stockCreated: "Kirim yozildi", saleCreated: "Sotuv yozildi",
    stockCreateFail: "Kirim yozilmadi", saleCreateFail: "Sotuv yozilmadi",
    productCreated: "Mahsulot yaratildi", productUpdated: "Mahsulot yangilandi",
    productDeleted: "Mahsulot o'chirildi", deleteProductTitle: "Mahsulotni o'chirish",
    deleteProductMsg: "mahsulotini o'chirmoqchimisiz?",
    productRequired: "Mahsulotni tanlang", quantityRequired: "Miqdorni kiriting",
    priceRequired: "Narxni kiriting", chooseProduct: "Mahsulot tanlang",
    noEntries: "Yozuvlar yo'q", loading: "Yuklanmoqda...",
    createdAt: "Vaqt", som: "so'm", dona: "dona",
    stockFormTitle: "Mahsulot kirimi", saleFormTitle: "Mahsulot sotuvi",
    noPermission: "Sklad ko'rish huquqi yo'q",
  },
  ru: {
    title: "Склад", desc: "Управление приходом и продажами",
    crumb: "Каталог и финансы",
    summaryProducts: "Продукты", summaryStockValue: "Стоимость склада",
    summarySold: "Продано", summaryReceived: "Приход (всего)",
    tabSummary: "Обзор", tabStock: "Приход", tabSales: "Продажи",
    newStock: "Приход", newSale: "Продажа", newProduct: "Новый продукт",
    stockEntries: "Записи прихода", salesEntries: "Записи продаж",
    product: "Продукт", quantity: "Количество", unitCost: "Цена за единицу",
    totalCost: "Общая стоимость", supplier: "Поставщик", receivedAt: "Дата прихода",
    unitPrice: "Цена за единицу", totalAmount: "Общая сумма", paidAmount: "Оплачено",
    paymentType: "Тип оплаты", soldAt: "Дата продажи", clientName: "Имя клиента",
    clientPhone: "Телефон", notes: "Примечание", soldBy: "Продал", addedBy: "Добавил",
    stockValue: "Стоимость остатка", currentStock: "Текущий остаток",
    cash: "Наличные", card: "Карта", transfer: "Перевод", debt: "Долг", other: "Другое",
    save: "Сохранить", cancel: "Отмена", create: "Создать", close: "Закрыть",
    edit: "Редактировать", delete: "Удалить", actions: "Действия",
    stockCreated: "Приход записан", saleCreated: "Продажа записана",
    stockCreateFail: "Ошибка записи прихода", saleCreateFail: "Ошибка записи продажи",
    productCreated: "Продукт создан", productUpdated: "Продукт обновлён",
    productDeleted: "Продукт удалён", deleteProductTitle: "Удалить продукт",
    deleteProductMsg: "продукт удалить?",
    productRequired: "Выберите продукт", quantityRequired: "Введите количество",
    priceRequired: "Введите цену", chooseProduct: "Выберите продукт",
    noEntries: "Записей нет", loading: "Загрузка...",
    createdAt: "Время", som: "сум", dona: "шт",
    stockFormTitle: "Приход на склад", saleFormTitle: "Продажа со склада",
    noPermission: "Нет доступа к складу",
  },
  en: {
    title: "Warehouse", desc: "Stock entry and sales management",
    crumb: "Catalog & Finance",
    summaryProducts: "Products", summaryStockValue: "Stock value",
    summarySold: "Sold", summaryReceived: "Received (total)",
    tabSummary: "Overview", tabStock: "Stock in", tabSales: "Sales",
    newStock: "Stock in", newSale: "New sale", newProduct: "New product",
    stockEntries: "Stock entries", salesEntries: "Sales records",
    product: "Product", quantity: "Quantity", unitCost: "Unit cost",
    totalCost: "Total cost", supplier: "Supplier", receivedAt: "Received at",
    unitPrice: "Unit price", totalAmount: "Total amount", paidAmount: "Paid",
    paymentType: "Payment type", soldAt: "Sold at", clientName: "Client name",
    clientPhone: "Phone", notes: "Notes", soldBy: "Sold by", addedBy: "Added by",
    stockValue: "Stock value", currentStock: "Current stock",
    cash: "Cash", card: "Card", transfer: "Transfer", debt: "Debt", other: "Other",
    save: "Save", cancel: "Cancel", create: "Create", close: "Close",
    edit: "Edit", delete: "Delete", actions: "Actions",
    stockCreated: "Stock entry saved", saleCreated: "Sale recorded",
    stockCreateFail: "Stock entry failed", saleCreateFail: "Sale failed",
    productCreated: "Product created", productUpdated: "Product updated",
    productDeleted: "Product deleted", deleteProductTitle: "Delete product",
    deleteProductMsg: "delete this product?",
    productRequired: "Choose a product", quantityRequired: "Enter quantity",
    priceRequired: "Enter price", chooseProduct: "Choose product",
    noEntries: "No records", loading: "Loading...",
    createdAt: "Time", som: "UZS", dona: "pcs",
    stockFormTitle: "Add stock entry", saleFormTitle: "Record sale",
    noPermission: "No warehouse access",
  },
};

function whLang() { return window.__TG_LANG || "uz"; }
function whtx(key) { return WH_UI[whLang()]?.[key] || WH_UI.uz[key] || key; }

const payTypeLabel = (v) => ({ cash: whtx("cash"), card: whtx("card"), transfer: whtx("transfer"), debt: whtx("debt"), other: whtx("other") })[v] || v;

function StockEntryModal({ open, products, onClose, onSave }) {
  const [product, setProduct] = whS("");
  const [quantity, setQuantity] = whS("");
  const [unitCost, setUnitCost] = whS("");
  const [supplier, setSupplier] = whS("");
  const [receivedAt, setReceivedAt] = whS("");
  const [notes, setNotes] = whS("");
  const [saving, setSaving] = whS(false);
  const [error, setError] = whS("");

  const reset = () => { setProduct(""); setQuantity(""); setUnitCost(""); setSupplier(""); setReceivedAt(""); setNotes(""); setError(""); };

  const handleClose = () => { reset(); onClose(); };
  const handleSave = async () => {
    if (!product) { setError(whtx("productRequired")); return; }
    if (!quantity || Number(quantity) <= 0) { setError(whtx("quantityRequired")); return; }
    setSaving(true); setError("");
    try {
      const payload = { product, quantity: Number(quantity) };
      if (unitCost) payload.unit_cost = unitCost;
      if (supplier) payload.supplier_name = supplier;
      if (receivedAt) payload.received_at = new Date(receivedAt).toISOString();
      if (notes) payload.notes = notes;
      await onSave(payload);
      reset();
    } catch (e) {
      setError(e?.message || whtx("stockCreateFail"));
    } finally {
      setSaving(false);
    }
  };

  const productOptions = whM(() => [
    { value: "", label: whtx("chooseProduct") },
    ...(products || []).map(p => ({ value: p.id, label: `${p.name}  ·  ${p.stockQuantity ?? p.amount ?? 0} ${whtx("dona")}` })),
  ], [products]);

  if (!open) return null;
  return (
    <Modal open={open} onClose={handleClose} title={whtx("stockFormTitle")} size="md"
      footer={<><Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? whtx("save") + "..." : whtx("create")}</Button><Button variant="ghost" onClick={handleClose}>{whtx("cancel")}</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {error && <div style={{ color: "var(--red)", fontSize: 13, padding: "8px 12px", background: "var(--red-bg)", borderRadius: 6 }}>{error}</div>}
        <Field label={whtx("product")}>
          <Select value={product} onChange={setProduct} options={productOptions} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label={whtx("quantity")}><Input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="10" /></Field>
          <Field label={whtx("unitCost")}><Input type="number" min="0" value={unitCost} onChange={e => setUnitCost(e.target.value)} placeholder="700 000" /></Field>
        </div>
        <Field label={whtx("supplier")}><Input value={supplier} onChange={e => setSupplier(e.target.value)} /></Field>
        <Field label={whtx("receivedAt")}><DatePickerInput value={receivedAt} onChange={setReceivedAt} mode="datetime" /></Field>
        <Field label={whtx("notes")}><Input value={notes} onChange={e => setNotes(e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

function SaleModal({ open, products, customers, onClose, onSave }) {
  const [product, setProduct] = whS("");
  const [quantity, setQuantity] = whS("1");
  const [unitPrice, setUnitPrice] = whS("");
  const [paidAmount, setPaidAmount] = whS("");
  const [paymentType, setPaymentType] = whS("cash");
  const [clientName, setClientName] = whS("");
  const [clientPhone, setClientPhone] = whS("");
  const [soldAt, setSoldAt] = whS("");
  const [notes, setNotes] = whS("");
  const [saving, setSaving] = whS(false);
  const [error, setError] = whS("");

  const reset = () => { setProduct(""); setQuantity("1"); setUnitPrice(""); setPaidAmount(""); setPaymentType("cash"); setClientName(""); setClientPhone(""); setSoldAt(""); setNotes(""); setError(""); };
  const handleClose = () => { reset(); onClose(); };

  const total = (Number(quantity) || 0) * (Number(unitPrice) || 0);

  const handleSave = async () => {
    if (!product) { setError(whtx("productRequired")); return; }
    if (!quantity || Number(quantity) <= 0) { setError(whtx("quantityRequired")); return; }
    if (!unitPrice || Number(unitPrice) <= 0) { setError(whtx("priceRequired")); return; }
    setSaving(true); setError("");
    try {
      const payload = {
        product, quantity: Number(quantity),
        unit_price: unitPrice, paid_amount: paidAmount || "0",
        payment_type: paymentType,
      };
      if (clientName) payload.client_name = clientName;
      if (clientPhone) payload.client_phone = clientPhone;
      if (soldAt) payload.sold_at = new Date(soldAt).toISOString();
      if (notes) payload.notes = notes;
      await onSave(payload);
      reset();
    } catch (e) {
      setError(e?.message || whtx("saleCreateFail"));
    } finally {
      setSaving(false);
    }
  };

  const productOptions = whM(() => [
    { value: "", label: whtx("chooseProduct") },
    ...(products || []).map(p => ({ value: p.id, label: `${p.name}  ·  ${p.stockQuantity ?? p.amount ?? 0} ${whtx("dona")}` })),
  ], [products]);

  const payTypeOptions = ["cash", "card", "transfer", "debt", "other"].map(v => ({ value: v, label: payTypeLabel(v) }));

  if (!open) return null;
  return (
    <Modal open={open} onClose={handleClose} title={whtx("saleFormTitle")} size="md"
      footer={<><Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? whtx("save") + "..." : whtx("create")}</Button><Button variant="ghost" onClick={handleClose}>{whtx("cancel")}</Button></>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {error && <div style={{ color: "var(--red)", fontSize: 13, padding: "8px 12px", background: "var(--red-bg)", borderRadius: 6 }}>{error}</div>}
        <Field label={whtx("product")}>
          <Select value={product} onChange={setProduct} options={productOptions} />
        </Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label={whtx("quantity")}><Input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} /></Field>
          <Field label={whtx("unitPrice")}><Input type="number" min="0" value={unitPrice} onChange={e => setUnitPrice(e.target.value)} placeholder="1 200 000" /></Field>
        </div>
        {total > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", background: "var(--green-bg)", borderRadius: 8, border: "1px solid color-mix(in srgb, var(--green) 30%, transparent)" }}>
            <I.check size={15} style={{ color: "var(--green)", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "var(--text-2)" }}>{whtx("totalAmount")}:</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: "var(--green)" }}>{fmtUZS(total)}</span>
          </div>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label={whtx("paidAmount")}><Input type="number" min="0" value={paidAmount} onChange={e => setPaidAmount(e.target.value)} placeholder="0" /></Field>
          <Field label={whtx("paymentType")}>
            <Select value={paymentType} onChange={setPaymentType} options={payTypeOptions} />
          </Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label={whtx("clientName")}><Input value={clientName} onChange={e => setClientName(e.target.value)} /></Field>
          <Field label={whtx("clientPhone")}><Input value={clientPhone} onChange={e => setClientPhone(e.target.value)} placeholder="+998" /></Field>
        </div>
        <Field label={whtx("soldAt")}><DatePickerInput value={soldAt} onChange={setSoldAt} mode="datetime" /></Field>
        <Field label={whtx("notes")}><Input value={notes} onChange={e => setNotes(e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

function WarehousePage() {
  const { data, t, toast, upsert, remove } = useApp();
  const canView = canDo("warehouse.view", data) || canDo("warehouse.manage", data);
  const canManage = canDo("warehouse.manage", data);

  const [tab, setTab] = whS("summary");
  const [summary, setSummary] = whS(null);
  const [stockEntries, setStockEntries] = whS([]);
  const [sales, setSales] = whS([]);
  const [loadingSum, setLoadingSum] = whS(true);
  const [loadingStock, setLoadingStock] = whS(false);
  const [loadingSales, setLoadingSales] = whS(false);
  const [stockOpen, setStockOpen] = whS(false);
  const [saleOpen, setSaleOpen] = whS(false);
  const [newProductOpen, setNewProductOpen] = whS(false);
  const [editProduct, setEditProduct] = whS(null);
  const [deleteProduct, setDeleteProduct] = whS(null);
  const [tick, setTick] = whS(0);

  const products = data.products || [];

  whE(() => {
    setLoadingSum(true);
    apiGetWarehouseSummary().then(res => setSummary(res)).catch(() => {}).finally(() => setLoadingSum(false));
  }, [tick]);

  whE(() => {
    if (tab !== "stock") return;
    setLoadingStock(true);
    apiGetStockEntries().then(res => setStockEntries(res.results || [])).catch(() => {}).finally(() => setLoadingStock(false));
  }, [tab, tick]);

  whE(() => {
    if (tab !== "sales") return;
    setLoadingSales(true);
    apiGetWarehouseSales().then(res => setSales(res.results || [])).catch(() => {}).finally(() => setLoadingSales(false));
  }, [tab, tick]);

  const refresh = () => setTick(v => v + 1);

  if (!canView) {
    return (
      <div className="page">
        <Card><EmptyState icon={<I.lock size={28} />} title={whtx("noPermission")} /></Card>
      </div>
    );
  }

  const sumData = summary || {};
  const prodList = sumData.products || [];

  const tabs = [
    { value: "summary", label: whtx("tabSummary") },
    { value: "stock", label: whtx("tabStock") },
    { value: "sales", label: whtx("tabSales") },
  ];

  return (
    <div className="page fade-in">
      <PageHeader
        title={whtx("title")}
        desc={whtx("desc")}
        crumbs={[{ label: whtx("crumb") }, { label: whtx("title") }]}
        actions={canManage && (
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="ghost" size="sm" icon={<I.plus size={15} />} onClick={() => setNewProductOpen(true)}>{whtx("newProduct")}</Button>
            <Button variant="ghost" size="sm" icon={<I.plus size={15} />} onClick={() => setStockOpen(true)}>{whtx("newStock")}</Button>
            <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setSaleOpen(true)}>{whtx("newSale")}</Button>
          </div>
        )}
      />

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <StatTile label={whtx("summaryProducts")} value={sumData.products_count ?? prodList.length} color="blue" loading={loadingSum} />
        <StatTile label={whtx("summaryStockValue")} value={fmtShort(Number(sumData.total_stock_value || 0))} sub={whtx("som")} color="green" loading={loadingSum} />
        <StatTile label={whtx("summarySold")} value={sumData.total_sold_quantity ?? 0} sub={whtx("dona")} color="amber" loading={loadingSum} />
        <StatTile label={whtx("summaryReceived")} value={sumData.total_received_quantity ?? 0} sub={whtx("dona")} color="violet" loading={loadingSum} />
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      <div style={{ marginTop: 16 }}>
        {tab === "summary" && (
          <Card pad={false}>
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead>
                  <tr>
                    <th>{whtx("product")}</th>
                    <th style={{ textAlign: "right" }}>{whtx("currentStock")}</th>
                    <th style={{ textAlign: "right" }}>{whtx("unitPrice")}</th>
                    <th style={{ textAlign: "right" }}>{whtx("stockValue")}</th>
                    {canManage && <th style={{ width: 80 }}></th>}
                  </tr>
                </thead>
                <tbody>
                  {loadingSum ? (
                    <tr><td colSpan={canManage ? 5 : 4}><SkeletonRows cols={canManage ? 5 : 4} rows={5} /></td></tr>
                  ) : prodList.length === 0 ? (
                    <tr><td colSpan={canManage ? 5 : 4} style={{ textAlign: "center", color: "var(--text-3)", padding: 24 }}>{whtx("noEntries")}</td></tr>
                  ) : prodList.map(p => {
                    const fullProduct = products.find(x => x.id === p.id);
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            {fullProduct && <ProductPhoto product={fullProduct} size="table" style={{ width: 40, height: 40, borderRadius: 6, flexShrink: 0 }} />}
                            <div>
                              <span className="tg-cell-strong">{p.name}</span>
                              {p.category && <span className="tg-cell-sub">{p.category}</span>}
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: "right", fontWeight: 700 }}>
                          {p.amount ?? 0} <span style={{ color: "var(--text-3)", fontWeight: 400 }}>{whtx("dona")}</span>
                        </td>
                        <td style={{ textAlign: "right" }}>{fmtUZS(Number(p.price || 0))}</td>
                        <td style={{ textAlign: "right", color: "var(--green)", fontWeight: 700 }}>{fmtUZS(Number(p.stock_value || 0))}</td>
                        {canManage && (
                          <td>
                            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                              <IconButton icon={<I.edit size={13} />} label={whtx("edit")} onClick={() => setEditProduct(fullProduct || { id: p.id, name: p.name, priceUzs: Number(p.price || 0), stockQuantity: p.amount ?? 0 })} />
                              <IconButton icon={<I.trash size={13} />} label={whtx("delete")} onClick={() => setDeleteProduct(fullProduct || { id: p.id, name: p.name })} />
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === "stock" && (
          <Card pad={false}>
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead>
                  <tr>
                    <th>{whtx("product")}</th>
                    <th style={{ textAlign: "right" }}>{whtx("quantity")}</th>
                    <th style={{ textAlign: "right" }}>{whtx("unitCost")}</th>
                    <th style={{ textAlign: "right" }}>{whtx("totalCost")}</th>
                    <th>{whtx("supplier")}</th>
                    <th>{whtx("addedBy")}</th>
                    <th>{whtx("createdAt")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingStock ? (
                    <tr><td colSpan="7"><SkeletonRows cols={7} rows={5} /></td></tr>
                  ) : stockEntries.length === 0 ? (
                    <tr><td colSpan="7" style={{ textAlign: "center", color: "var(--text-3)", padding: 24 }}>{whtx("noEntries")}</td></tr>
                  ) : stockEntries.map(e => (
                    <tr key={e.id}>
                      <td><span className="tg-cell-strong">{e.product_name}</span></td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>{e.quantity} <span style={{ color: "var(--text-3)", fontWeight: 400 }}>{whtx("dona")}</span></td>
                      <td style={{ textAlign: "right" }}>{e.unit_cost ? fmtUZS(Number(e.unit_cost)) : "—"}</td>
                      <td style={{ textAlign: "right", color: "var(--green)" }}>{e.total_cost ? fmtUZS(Number(e.total_cost)) : "—"}</td>
                      <td>{e.supplier_name || "—"}</td>
                      <td><span className="tg-cell-sub">{e.created_by_name || e.created_by_username || "—"}</span></td>
                      <td><span className="tg-cell-sub">{e.created_at ? fmtDate(e.created_at, true) : "—"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {tab === "sales" && (
          <Card pad={false}>
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead>
                  <tr>
                    <th>{whtx("product")}</th>
                    <th>{whtx("clientName")}</th>
                    <th style={{ textAlign: "right" }}>{whtx("quantity")}</th>
                    <th style={{ textAlign: "right" }}>{whtx("unitPrice")}</th>
                    <th style={{ textAlign: "right" }}>{whtx("totalAmount")}</th>
                    <th style={{ textAlign: "right" }}>{whtx("paidAmount")}</th>
                    <th>{whtx("paymentType")}</th>
                    <th>{whtx("soldBy")}</th>
                    <th>{whtx("createdAt")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingSales ? (
                    <tr><td colSpan="9"><SkeletonRows cols={9} rows={5} /></td></tr>
                  ) : sales.length === 0 ? (
                    <tr><td colSpan="9" style={{ textAlign: "center", color: "var(--text-3)", padding: 24 }}>{whtx("noEntries")}</td></tr>
                  ) : sales.map(s => (
                    <tr key={s.id}>
                      <td><span className="tg-cell-strong">{s.product_name}</span></td>
                      <td>{s.client_full_name || s.client_name || "—"}{s.client_phone && <span className="tg-cell-sub">{s.client_phone}</span>}</td>
                      <td style={{ textAlign: "right", fontWeight: 700 }}>{s.quantity} <span style={{ color: "var(--text-3)", fontWeight: 400 }}>{whtx("dona")}</span></td>
                      <td style={{ textAlign: "right" }}>{fmtUZS(Number(s.unit_price || 0))}</td>
                      <td style={{ textAlign: "right", color: "var(--green)", fontWeight: 700 }}>{fmtUZS(Number(s.total_amount || 0))}</td>
                      <td style={{ textAlign: "right" }}>{fmtUZS(Number(s.paid_amount || 0))}</td>
                      <td><Badge>{payTypeLabel(s.payment_type)}</Badge></td>
                      <td><span className="tg-cell-sub">{s.sold_by_name || s.sold_by_username || "—"}</span></td>
                      <td><span className="tg-cell-sub">{s.created_at ? fmtDate(s.created_at, true) : "—"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <StockEntryModal
        open={stockOpen}
        products={products}
        onClose={() => setStockOpen(false)}
        onSave={async (payload) => {
          await apiCreateStockEntry(payload);
          toast(whtx("stockCreated"), "success");
          setStockOpen(false);
          refresh();
        }}
      />
      <SaleModal
        open={saleOpen}
        products={products}
        customers={data.customers || []}
        onClose={() => setSaleOpen(false)}
        onSave={async (payload) => {
          await apiCreateWarehouseSale(payload);
          toast(whtx("saleCreated"), "success");
          setSaleOpen(false);
          refresh();
        }}
      />
      {window.ProductFormModal && <>
        <ProductFormModal
          open={newProductOpen}
          onClose={() => setNewProductOpen(false)}
          onSave={async (product) => {
            await upsert("products", product);
            toast(whtx("productCreated"), "success");
            setNewProductOpen(false);
            refresh();
          }}
        />
        <ProductFormModal
          open={!!editProduct}
          initial={editProduct}
          onClose={() => setEditProduct(null)}
          onSave={async (product) => {
            await upsert("products", product);
            toast(whtx("productUpdated"), "success");
            setEditProduct(null);
            refresh();
          }}
        />
      </>}
      <ConfirmDialog
        open={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        title={whtx("deleteProductTitle")}
        message={`"${deleteProduct?.name || deleteProduct?.model || ""}" ${whtx("deleteProductMsg")}`}
        onConfirm={async () => {
          await remove("products", deleteProduct.id);
          toast(whtx("productDeleted"), "success");
          setDeleteProduct(null);
          refresh();
        }}
        danger
      />
    </div>
  );
}
window.WarehousePage = WarehousePage;
