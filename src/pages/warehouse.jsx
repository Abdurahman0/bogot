/* pages/warehouse.jsx */
const { useState: whS, useMemo: whM, useEffect: whE } = React;

const whNum = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};
const whCurrencyLabel = (value) => String(value || "uzs").toUpperCase();
const whMoney = (value, currency = "uzs") => {
  const amount = whNum(value);
  return String(currency).toLowerCase() === "usd"
    ? `$${amount.toLocaleString("en-US")}`
    : fmtUZS(amount);
};
const whDateTimeForApi = (value) => value ? new Date(value).toISOString() : undefined;
const whItemName = (row) => row?.item_name || row?.item?.name || row?.name || "—";
const whItemUnit = (item) => item?.unit || "dona";
const whPayTypeColor = (type) => ({ cash: "green", card: "blue", transfer: "violet", debt: "amber", other: "slate" })[type] || "slate";
const whStatCurrency = (obj, currency) => whNum(obj?.[currency] || 0);
const PANEL_UNIT = "kilowatt";

function whTx(t, key) { return t(`warehouse.${key}`); }
function whPayTypeLabel(t, value) { return whTx(t, `pay.${value}`) || value; }

function WarehouseMetricChip({ label, value, sub, icon, color = "slate" }) {
  const Ico = I[icon] || I.layers;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 12, padding: "12px 15px", borderRadius: 9, border: "1px solid var(--border)", background: "var(--surface-2)", minHeight: 58 }}>
      <span style={{ width: 34, height: 34, borderRadius: 8, display: "grid", placeItems: "center", flexShrink: 0, color: `var(--${color})`, background: `var(--${color}-bg)` }}>
        <Ico size={17} />
      </span>
      <span style={{ display: "grid", gap: 3 }}>
        <span style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.15 }}>{label}</span>
        <strong style={{ fontSize: 17, color: "var(--text)", lineHeight: 1.15 }}>
          {value}{sub && <span style={{ fontSize: 13, fontWeight: 500, color: "var(--text-3)", marginLeft: 5 }}>{sub}</span>}
        </strong>
      </span>
    </div>
  );
}

function WarehouseChartCard({ title, icon, color = "blue", children, footer }) {
  const Ico = I[icon] || I.layers;
  return (
    <Card>
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="tg-card-icon" style={{ color: `var(--${color})`, background: `var(--${color}-bg)` }}><Ico size={18} /></span>
          <div className="tg-card-title">{title}</div>
        </div>
        {children}
        {footer && <div className="tg-chips">{footer}</div>}
      </div>
    </Card>
  );
}

function WarehouseItemModal({ open, initial, t, onClose, onSave }) {
  const blank = {
    name: "",
    category: "",
    description: "",
    unit: "dona",
    default_currency: "uzs",
    default_price: "",
    is_panel: false,
    panel_watt: "",
    panel_count: "",
    panel_price: "",
    low_stock_threshold: "0",
  };
  const [form, setForm] = whS(blank);
  const [saving, setSaving] = whS(false);
  const [error, setError] = whS("");

  whE(() => {
    setForm(initial ? { ...blank, ...initial, unit: initial.is_panel ? PANEL_UNIT : (initial.unit || blank.unit) } : blank);
    setError("");
  }, [initial, open]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setPanelMode = (checked) => {
    setForm((current) => ({
      ...current,
      is_panel: checked,
      unit: checked ? PANEL_UNIT : (current.unit === PANEL_UNIT ? "dona" : current.unit),
    }));
  };
  const panelTotalWatt = whNum(form.panel_watt) * whNum(form.panel_count);
  const panelTotalPrice = panelTotalWatt * whNum(form.panel_price);

  const handleSave = async () => {
    if (!String(form.name || "").trim()) { setError(whTx(t, "itemRequired")); return; }
    if (!String(form.category || "").trim()) { setError(whTx(t, "categoryRequired")); return; }
    setSaving(true); setError("");
    try {
      const payload = { ...form };
      if (payload.is_panel) delete payload.default_price;
      await onSave(payload);
      onClose();
    } catch (e) {
      setError(e?.message || whTx(t, "itemSaveFail"));
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={initial ? whTx(t, "editItem") : whTx(t, "newItem")} size="md"
      footer={<><Button variant="ghost" onClick={onClose}>{whTx(t, "cancel")}</Button><Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? `${whTx(t, "save")}...` : whTx(t, "save")}</Button></>}>
      <div style={{ display: "grid", gap: 14 }}>
        {error && <div style={{ color: "var(--red)", fontSize: 13, padding: "8px 12px", background: "var(--red-bg)", borderRadius: 6 }}>{error}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label={whTx(t, "itemName")}><Input value={form.name} onChange={e => set("name", e.target.value)} /></Field>
          <Field label={whTx(t, "category")}><Input value={form.category} onChange={e => set("category", e.target.value)} /></Field>
        </div>
        <Field label={whTx(t, "description")}><Input value={form.description || ""} onChange={e => set("description", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label={whTx(t, "unit")}><Input value={form.unit} onChange={e => set("unit", e.target.value)} disabled={!!form.is_panel} /></Field>
          <Field label={whTx(t, "currency")}>
            <Select value={form.default_currency} onChange={v => set("default_currency", v)} options={[{ value: "uzs", label: "UZS" }, { value: "usd", label: "USD" }]} />
          </Field>
          <Field label={whTx(t, "lowStock")}><Input type="number" min="0" value={form.low_stock_threshold} onChange={e => set("low_stock_threshold", e.target.value)} /></Field>
        </div>
        <label style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, color: "var(--text-2)" }}>
          <input type="checkbox" checked={!!form.is_panel} onChange={e => setPanelMode(e.target.checked)} />
          {whTx(t, "isPanel")}
        </label>
        {!form.is_panel && (
          <Field label={`${whTx(t, "defaultPrice")} (${whCurrencyLabel(form.default_currency)})`}>
            <Input type="number" min="0" step="0.01" value={form.default_price} onChange={e => set("default_price", e.target.value)} />
          </Field>
        )}
        {form.is_panel && (
          <div style={{ display: "grid", gap: 12, padding: 12, border: "1px solid var(--border)", borderRadius: 8, background: "var(--surface-2)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
              <Field label={whTx(t, "panelWatt")}><Input type="number" min="0" value={form.panel_watt} onChange={e => set("panel_watt", e.target.value)} /></Field>
              <Field label={whTx(t, "panelCount")}><Input type="number" min="0" value={form.panel_count} onChange={e => set("panel_count", e.target.value)} /></Field>
              <Field label={whTx(t, "panelPrice")}><Input type="number" min="0" step="0.01" value={form.panel_price} onChange={e => set("panel_price", e.target.value)} /></Field>
            </div>
            <div className="tg-chips">
              <span className="tg-chip">{whTx(t, "panelTotalWatt")}: {fmtNum(panelTotalWatt)} W</span>
              <span className="tg-chip">{whTx(t, "panelTotalPrice")}: {whMoney(panelTotalPrice, form.default_currency)}</span>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function StockEntryModal({ open, items, t, onClose, onSave }) {
  const [form, setForm] = whS({ item: "", quantity: "", currency: "uzs", unit_cost: "", supplier_name: "", received_at: "", notes: "" });
  const [saving, setSaving] = whS(false);
  const [error, setError] = whS("");

  whE(() => {
    if (!open) return;
    setForm({ item: "", quantity: "", currency: "uzs", unit_cost: "", supplier_name: "", received_at: "", notes: "" });
    setError("");
  }, [open]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const selected = items.find((item) => item.id === form.item);
  const total = whNum(form.quantity) * whNum(form.unit_cost);
  const itemOptions = whM(() => [
    { value: "", label: whTx(t, "chooseItem") },
    ...items.map((item) => ({ value: item.id, label: `${item.name} · ${fmtNum(whNum(item.current_quantity))} ${whItemUnit(item)}` })),
  ], [items, t]);

  const handleSave = async () => {
    if (!form.item) { setError(whTx(t, "itemRequired")); return; }
    if (whNum(form.quantity) <= 0) { setError(whTx(t, "quantityRequired")); return; }
    setSaving(true); setError("");
    try {
      await onSave({ ...form, received_at: whDateTimeForApi(form.received_at) });
      onClose();
    } catch (e) {
      setError(e?.message || whTx(t, "stockCreateFail"));
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={whTx(t, "stockFormTitle")} size="md"
      footer={<><Button variant="ghost" onClick={onClose}>{whTx(t, "cancel")}</Button><Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? `${whTx(t, "save")}...` : whTx(t, "create")}</Button></>}>
      <div style={{ display: "grid", gap: 14 }}>
        {error && <div style={{ color: "var(--red)", fontSize: 13, padding: "8px 12px", background: "var(--red-bg)", borderRadius: 6 }}>{error}</div>}
        <Field label={whTx(t, "item")}><Select value={form.item} onChange={v => { set("item", v); const item = items.find(x => x.id === v); if (item) set("currency", item.default_currency || "uzs"); }} options={itemOptions} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label={whTx(t, "quantity")}><Input type="number" min="0" value={form.quantity} onChange={e => set("quantity", e.target.value)} /></Field>
          <Field label={whTx(t, "currency")}><Select value={form.currency} onChange={v => set("currency", v)} options={[{ value: "uzs", label: "UZS" }, { value: "usd", label: "USD" }]} /></Field>
          <Field label={whTx(t, "unitCost")}><Input type="number" min="0" value={form.unit_cost} onChange={e => set("unit_cost", e.target.value)} /></Field>
        </div>
        {total > 0 && <div className="tg-chips"><span className="tg-chip">{whTx(t, "totalCost")}: {whMoney(total, form.currency)}</span>{selected && <span className="tg-chip">{whTx(t, "unit")}: {whItemUnit(selected)}</span>}</div>}
        <Field label={whTx(t, "supplier")}><Input value={form.supplier_name} onChange={e => set("supplier_name", e.target.value)} /></Field>
        <Field label={whTx(t, "receivedAt")}><DatePickerInput value={form.received_at} onChange={v => set("received_at", v)} mode="datetime" /></Field>
        <Field label={whTx(t, "notes")}><Input value={form.notes} onChange={e => set("notes", e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

function SaleModal({ open, items, customers, t, onClose, onSave }) {
  const [form, setForm] = whS({ item: "", client: "", quantity: "1", currency: "uzs", unit_price: "", paid_amount: "", payment_type: "cash", client_name: "", client_phone: "", sold_at: "", notes: "" });
  const [saving, setSaving] = whS(false);
  const [error, setError] = whS("");

  whE(() => {
    if (!open) return;
    setForm({ item: "", client: "", quantity: "1", currency: "uzs", unit_price: "", paid_amount: "", payment_type: "cash", client_name: "", client_phone: "", sold_at: "", notes: "" });
    setError("");
  }, [open]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const selected = items.find((item) => item.id === form.item);
  const total = whNum(form.quantity) * whNum(form.unit_price);
  const itemOptions = whM(() => [
    { value: "", label: whTx(t, "chooseItem") },
    ...items.map((item) => ({ value: item.id, label: `${item.name} · ${fmtNum(whNum(item.current_quantity))} ${whItemUnit(item)}` })),
  ], [items, t]);
  const payTypeOptions = ["cash", "card", "transfer", "debt", "other"].map((value) => ({ value, label: whPayTypeLabel(t, value) }));
  const customerOptions = whM(() => [
    { value: "", label: whTx(t, "chooseItem") },
    ...((customers || []).map((c) => ({ value: c.id, label: c.fullName || c.full_name || [c.first_name, c.last_name].filter(Boolean).join(" ") || c.name || c.phone || c.id }))),
  ], [customers, t]);

  const handleSave = async () => {
    if (!form.item) { setError(whTx(t, "itemRequired")); return; }
    if (whNum(form.quantity) <= 0) { setError(whTx(t, "quantityRequired")); return; }
    if (whNum(form.unit_price) <= 0) { setError(whTx(t, "priceRequired")); return; }
    setSaving(true); setError("");
    try {
      await onSave({ ...form, sold_at: whDateTimeForApi(form.sold_at) });
      onClose();
    } catch (e) {
      setError(e?.message || whTx(t, "saleCreateFail"));
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;
  return (
    <Modal open={open} onClose={onClose} title={whTx(t, "saleFormTitle")} size="md"
      footer={<><Button variant="ghost" onClick={onClose}>{whTx(t, "cancel")}</Button><Button variant="primary" onClick={handleSave} disabled={saving}>{saving ? `${whTx(t, "save")}...` : whTx(t, "create")}</Button></>}>
      <div style={{ display: "grid", gap: 14 }}>
        {error && <div style={{ color: "var(--red)", fontSize: 13, padding: "8px 12px", background: "var(--red-bg)", borderRadius: 6 }}>{error}</div>}
        <Field label={whTx(t, "item")}><Select value={form.item} onChange={v => { set("item", v); const item = items.find(x => x.id === v); if (item) set("currency", item.default_currency || "uzs"); }} options={itemOptions} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
          <Field label={whTx(t, "quantity")}><Input type="number" min="0" value={form.quantity} onChange={e => set("quantity", e.target.value)} /></Field>
          <Field label={whTx(t, "currency")}><Select value={form.currency} onChange={v => set("currency", v)} options={[{ value: "uzs", label: "UZS" }, { value: "usd", label: "USD" }]} /></Field>
          <Field label={whTx(t, "unitPrice")}><Input type="number" min="0" value={form.unit_price} onChange={e => set("unit_price", e.target.value)} /></Field>
        </div>
        {total > 0 && <div className="tg-chips"><span className="tg-chip">{whTx(t, "totalAmount")}: {whMoney(total, form.currency)}</span>{selected && <span className="tg-chip">{whTx(t, "currentStock")}: {fmtNum(whNum(selected.current_quantity))} {whItemUnit(selected)}</span>}</div>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label={whTx(t, "paidAmount")}><Input type="number" min="0" value={form.paid_amount} onChange={e => set("paid_amount", e.target.value)} /></Field>
          <Field label={whTx(t, "paymentType")}><Select value={form.payment_type} onChange={v => set("payment_type", v)} options={payTypeOptions} /></Field>
        </div>
        {customers && customers.length > 0 && (
          <Field label={whTx(t, "clientLink")}>
            <Select value={form.client} onChange={v => {
              const c = (customers || []).find(x => x.id === v);
              set("client", v);
              if (c) {
                set("client_name", c.fullName || c.full_name || [c.first_name, c.last_name].filter(Boolean).join(" ") || c.name || form.client_name);
                set("client_phone", c.phone || form.client_phone);
              }
            }} options={customerOptions} />
          </Field>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Field label={whTx(t, "clientName")}><Input value={form.client_name} onChange={e => set("client_name", e.target.value)} /></Field>
          <Field label={whTx(t, "clientPhone")}><Input value={form.client_phone} onChange={e => set("client_phone", e.target.value)} placeholder="+998" /></Field>
        </div>
        <Field label={whTx(t, "soldAt")}><DatePickerInput value={form.sold_at} onChange={v => set("sold_at", v)} mode="datetime" /></Field>
        <Field label={whTx(t, "notes")}><Input value={form.notes} onChange={e => set("notes", e.target.value)} /></Field>
      </div>
    </Modal>
  );
}

function WarehousePage() {
  const { data, t, toast } = useApp();
  const canView = canDo("warehouse.view", data) || canDo("warehouse.manage", data);
  const canManage = canDo("warehouse.manage", data);

  const [tab, setTab] = whS("items");
  const [items, setItems] = whS([]);
  const [stats, setStats] = whS(null);
  const [stockEntries, setStockEntries] = whS([]);
  const [sales, setSales] = whS([]);
  const [loadingItems, setLoadingItems] = whS(true);
  const [loadingStats, setLoadingStats] = whS(true);
  const [loadingStock, setLoadingStock] = whS(false);
  const [loadingSales, setLoadingSales] = whS(false);
  const [stockOpen, setStockOpen] = whS(false);
  const [saleOpen, setSaleOpen] = whS(false);
  const [itemOpen, setItemOpen] = whS(false);
  const [editItem, setEditItem] = whS(null);
  const [deleteItem, setDeleteItem] = whS(null);
  const [exporting, setExporting] = whS(false);
  const [dateRange, setDateRange] = whS("all");
  const [currencyFilter, setCurrencyFilter] = whS("all");
  const [categoryFilter, setCategoryFilter] = whS("all");
  const [itemFilter, setItemFilter] = whS("all");
  const [tick, setTick] = whS(0);

  const { dateFrom, dateTo } = whM(() => {
    if (!dateRange || dateRange === "all") return { dateFrom: "", dateTo: "" };
    const toStr = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const today = new Date();
    if (dateRange === "today") return { dateFrom: toStr(today), dateTo: toStr(today) };
    const days = { "7d": 6, "30d": 29, "90d": 89 }[dateRange];
    if (days !== undefined) {
      const from = new Date(today);
      from.setDate(from.getDate() - days);
      return { dateFrom: toStr(from), dateTo: toStr(today) };
    }
    if (dateRange && typeof dateRange === "object" && dateRange.from) {
      return { dateFrom: toStr(dateRange.from), dateTo: dateRange.to ? toStr(dateRange.to) : toStr(today) };
    }
    return { dateFrom: "", dateTo: "" };
  }, [dateRange]);

  const filters = whM(() => ({
    ...(dateFrom ? { date_from: dateFrom } : {}),
    ...(dateTo ? { date_to: dateTo } : {}),
    ...(currencyFilter !== "all" ? { currency: currencyFilter } : {}),
    ...(categoryFilter !== "all" ? { category: categoryFilter } : {}),
    ...(itemFilter !== "all" ? { item: itemFilter } : {}),
  }), [dateFrom, dateTo, currencyFilter, categoryFilter, itemFilter]);

  const refresh = () => setTick((value) => value + 1);

  whE(() => {
    if (!canView) return;
    setLoadingItems(true);
    apiGetWarehouseItems().then(res => setItems(res.results || [])).catch(() => setItems([])).finally(() => setLoadingItems(false));
  }, [canView, tick]);

  whE(() => {
    if (!canView) return;
    setLoadingStats(true);
    apiGetWarehouseStats(filters).then(res => setStats(res || {})).catch(() => setStats({})).finally(() => setLoadingStats(false));
  }, [canView, filters, tick]);

  whE(() => {
    if (!canView || tab !== "stock") return;
    setLoadingStock(true);
    apiGetStockEntries(filters).then(res => setStockEntries(res.results || [])).catch(() => setStockEntries([])).finally(() => setLoadingStock(false));
  }, [canView, tab, filters, tick]);

  whE(() => {
    if (!canView || tab !== "sales") return;
    setLoadingSales(true);
    apiGetWarehouseSales(filters).then(res => setSales(res.results || [])).catch(() => setSales([])).finally(() => setLoadingSales(false));
  }, [canView, tab, filters, tick]);

  const categoryOptions = whM(() => [
    { value: "all", label: t("common.all") },
    ...Array.from(new Set(items.map((item) => item.category).filter(Boolean))).sort((a, b) => a.localeCompare(b)).map((category) => ({ value: category, label: category })),
  ], [items, t]);

  const itemOptions = whM(() => [
    { value: "all", label: t("common.all") },
    ...items.map((item) => ({ value: item.id, label: item.name })),
  ], [items, t]);

  const filteredItems = whM(() => {
    return items.filter((item) => (
      (categoryFilter === "all" || item.category === categoryFilter) &&
      (currencyFilter === "all" || item.default_currency === currencyFilter) &&
      (itemFilter === "all" || item.id === itemFilter)
    ));
  }, [items, categoryFilter, currencyFilter, itemFilter]);

  const exportExcel = async () => {
    setExporting(true);
    try {
      await apiDownloadWarehouseExcel(filters);
      toast(whTx(t, "excelOk"), "success");
    } catch (e) {
      toast(e?.message || whTx(t, "excelFail"), "error");
    } finally {
      setExporting(false);
    }
  };

  if (!canView) {
    return <div className="page"><Card><EmptyState icon={<I.lock size={28} />} title={whTx(t, "noPermission")} /></Card></div>;
  }

  const statData = stats || {};
  const stockCostUzs = whStatCurrency(statData.stock_total_cost, "uzs");
  const stockCostUsd = whStatCurrency(statData.stock_total_cost, "usd");
  const salesPaidUzs = whStatCurrency(statData.sales_paid_amount, "uzs");
  const salesPaidUsd = whStatCurrency(statData.sales_paid_amount, "usd");
  const salesTotalUzs = whStatCurrency(statData.sales_total_amount, "uzs");
  const salesTotalUsd = whStatCurrency(statData.sales_total_amount, "usd");
  const categoryChartData = (() => {
    const apiRows = Array.isArray(statData.by_category) ? statData.by_category : [];
    const rows = apiRows.map((row) => ({
      label: row.category || row.name || row.category_name || "—",
      value: whNum(row.total_quantity ?? row.quantity ?? row.items_count ?? row.count ?? row.sales_count),
    })).filter((row) => row.value > 0);
    if (rows.length) return rows.slice(0, 6);
    const grouped = {};
    filteredItems.forEach((item) => {
      const key = item.category || "—";
      grouped[key] = (grouped[key] || 0) + whNum(item.current_quantity);
    });
    return Object.entries(grouped)
      .map(([label, value]) => ({ label, value }))
      .filter((row) => row.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
  })();
  const moneyChartDataUzs = [
    { label: whTx(t, "stockCostUzs"), value: stockCostUzs, color: "var(--green)" },
    { label: whTx(t, "salesPaidUzs"), value: salesPaidUzs, color: "var(--blue)" },
  ];
  const moneyChartDataUsd = [
    { label: whTx(t, "stockCostUsd"), value: stockCostUsd, color: "var(--teal)" },
    { label: whTx(t, "salesPaidUsd"), value: salesPaidUsd, color: "var(--violet)" },
  ];
  const activityChartData = [
    { label: whTx(t, "stockEntriesCount"), value: whNum(statData.stock_entries_count), color: "var(--violet)" },
    { label: whTx(t, "salesCount"), value: whNum(statData.sales_count), color: "var(--amber)" },
    { label: whTx(t, "panelCount"), value: whNum(statData.panel_total_count), color: "var(--blue)" },
  ];

  const tabs = [
    { value: "items", label: whTx(t, "tabItems"), count: filteredItems.length },
    { value: "stock", label: whTx(t, "tabStock"), count: statData.stock_entries_count },
    { value: "sales", label: whTx(t, "tabSales"), count: statData.sales_count },
  ];

  return (
    <div className="page fade-in">
      <PageHeader
        title={whTx(t, "title")}
        desc={whTx(t, "desc")}
        crumbs={[{ label: whTx(t, "crumb") }, { label: whTx(t, "title") }]}
        actions={canManage && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button variant="default" size="sm" icon={<I.download size={15} />} onClick={exportExcel} disabled={exporting}>Excel</Button>
            <Button variant="ghost" size="sm" icon={<I.plus size={15} />} onClick={() => { setEditItem(null); setItemOpen(true); }}>{whTx(t, "newItem")}</Button>
            <Button variant="ghost" size="sm" icon={<I.plus size={15} />} onClick={() => setStockOpen(true)}>{whTx(t, "newStock")}</Button>
            <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setSaleOpen(true)}>{whTx(t, "newSale")}</Button>
          </div>
        )}
      />

      <div className="toolbar" style={{ marginBottom: 12 }}>
        <DateRange value={dateRange} onChange={setDateRange} />
        <FilterSelect label={whTx(t, "currency")} icon="wallet" value={currencyFilter} onChange={setCurrencyFilter} options={[{ value: "all", label: t("common.all") }, { value: "uzs", label: "UZS" }, { value: "usd", label: "USD" }]} />
        <FilterSelect label={whTx(t, "category")} icon="layers" value={categoryFilter} onChange={setCategoryFilter} options={categoryOptions} />
        <FilterSelect label={whTx(t, "item")} icon="box" value={itemFilter} onChange={setItemFilter} options={itemOptions} />
        {(dateRange !== "all" || currencyFilter !== "all" || categoryFilter !== "all" || itemFilter !== "all") && (
          <Button variant="ghost" size="sm" onClick={() => { setDateRange("all"); setCurrencyFilter("all"); setCategoryFilter("all"); setItemFilter("all"); }}>{t("common.clear")}</Button>
        )}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        <WarehouseMetricChip label={whTx(t, "itemsCount")} value={loadingStats ? "..." : (statData.items_count ?? items.length)} icon="box" color="blue" />
        <WarehouseMetricChip label={whTx(t, "totalQuantity")} value={loadingStats ? "..." : fmtNum(whNum(statData.total_quantity))} icon="layers" color="green" />
        <WarehouseMetricChip label={whTx(t, "lowStock")} value={loadingStats ? "..." : (statData.low_stock_count ?? 0)} icon="alert" color="red" />
        <WarehouseMetricChip label={whTx(t, "panelItems")} value={loadingStats ? "..." : (statData.panel_items_count ?? 0)} icon="zap" color="violet" />
        <WarehouseMetricChip label={whTx(t, "panelWattTotal")} value={loadingStats ? "..." : fmtNum(whNum(statData.panel_total_watt))} sub="W" icon="zapline" color="amber" />
        <WarehouseMetricChip label={whTx(t, "panelTotalCount")} value={loadingStats ? "..." : fmtNum(whNum(statData.panel_total_count))} icon="layers" color="teal" />
        <WarehouseMetricChip label={whTx(t, "panelTotalPrice")} value={loadingStats ? "..." : `$${whNum(statData.panel_total_price).toLocaleString("en-US")}`} icon="wallet" color="green" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.25fr) minmax(260px, .75fr)", gap: 12, marginBottom: 16 }}>
        <WarehouseChartCard
          title={whTx(t, "moneySummary")}
          icon="wallet"
          color="green"
          footer={<>
            <span className="tg-chip">{whTx(t, "salesTotalUzs")}: {fmtShort(salesTotalUzs)} {whTx(t, "som")}</span>
            <span className="tg-chip">{whTx(t, "salesTotalUsd")}: ${salesTotalUsd.toLocaleString("en-US")}</span>
          </>}
        >
          {loadingStats ? <div className="skeleton" style={{ height: 126 }} /> : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>So'm</div>
                <BarChart data={moneyChartDataUzs} horizontal height={90} labelWidth={120} valueWidth={72} wrapLabels format={(value) => fmtShort(value)} />
              </div>
              <div>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: "var(--text-3)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>USD</div>
                <BarChart data={moneyChartDataUsd} horizontal height={90} labelWidth={120} valueWidth={72} wrapLabels format={(value) => `$${value.toLocaleString("en-US")}`} />
              </div>
            </div>
          )}
        </WarehouseChartCard>
        <WarehouseChartCard title={whTx(t, "activitySummary")} icon="chart" color="amber">
          {loadingStats ? <div className="skeleton" style={{ height: 168 }} /> : <Donut data={activityChartData} size={138} thickness={20} centerLabel={whTx(t, "activitySummary")} centerValue={whNum(statData.stock_entries_count) + whNum(statData.sales_count)} />}
        </WarehouseChartCard>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: 12, marginBottom: 16 }}>
        <WarehouseChartCard title={whTx(t, "categorySummary")} icon="layers" color="blue">
          {loadingStats ? <div className="skeleton" style={{ height: 120 }} /> : categoryChartData.length ? (
            <BarChart data={categoryChartData.map((row, index) => ({ ...row, color: ["var(--blue)", "var(--green)", "var(--amber)", "var(--violet)", "var(--teal)", "var(--red)"][index % 6] }))} horizontal height={130} format={(value) => fmtNum(value)} />
          ) : <EmptyState icon={<I.layers size={22} />} title={t("common.noData")} />}
        </WarehouseChartCard>
      </div>

      <Tabs tabs={tabs} active={tab} onChange={setTab} />

      <div style={{ marginTop: 16 }}>
        {tab === "items" && (
          <Card pad={false}>
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead>
                  <tr>
                    <th>{whTx(t, "item")}</th>
                    <th>{whTx(t, "category")}</th>
                    <th>{whTx(t, "currency")}</th>
                    <th style={{ textAlign: "right" }}>{whTx(t, "currentStock")}</th>
                    <th>{whTx(t, "panel")}</th>
                    <th style={{ textAlign: "right" }}>{whTx(t, "lowStock")}</th>
                    {canManage && <th style={{ width: 82 }}></th>}
                  </tr>
                </thead>
                <tbody>
                  {loadingItems ? (
                    <tr><td colSpan={canManage ? 7 : 6}><SkeletonRows cols={canManage ? 7 : 6} rows={6} /></td></tr>
                  ) : filteredItems.length === 0 ? (
                    <tr><td colSpan={canManage ? 7 : 6} style={{ textAlign: "center", color: "var(--text-3)", padding: 24 }}>{whTx(t, "noEntries")}</td></tr>
                  ) : filteredItems.map((item) => {
                    const qty = whNum(item.current_quantity);
                    const threshold = whNum(item.low_stock_threshold);
                    const low = threshold > 0 && qty <= threshold;
                    return (
                      <tr key={item.id}>
                        <td>
                          <span className="tg-cell-strong">{item.name}</span>
                          {item.description && <span className="tg-cell-sub">{item.description}</span>}
                        </td>
                        <td>{item.category || "—"}</td>
                        <td><Badge color={item.default_currency === "usd" ? "teal" : "green"} size="sm">{whCurrencyLabel(item.default_currency)}</Badge></td>
                        <td style={{ textAlign: "right", fontWeight: 700, color: low ? "var(--red)" : "var(--text)" }}>{fmtNum(qty)} <span style={{ color: "var(--text-3)", fontWeight: 400 }}>{whItemUnit(item)}</span></td>
                        <td>
                          {item.is_panel ? (
                            <div className="tg-chips">
                              <span className="tg-chip">{fmtNum(whNum(item.panel_total_watt))} W</span>
                              <span className="tg-chip">{whMoney(item.panel_total_price, item.default_currency)}</span>
                            </div>
                          ) : <span className="tg-cell-sub">—</span>}
                        </td>
                        <td style={{ textAlign: "right" }}>{threshold ? fmtNum(threshold) : "—"}</td>
                        {canManage && (
                          <td>
                            <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                              <IconButton icon={<I.edit size={13} />} label={whTx(t, "edit")} onClick={() => { setEditItem(item); setItemOpen(true); }} />
                              <IconButton icon={<I.trash size={13} />} label={whTx(t, "delete")} onClick={() => setDeleteItem(item)} />
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
                    <th>{whTx(t, "item")}</th>
                    <th style={{ textAlign: "right" }}>{whTx(t, "quantity")}</th>
                    <th>{whTx(t, "currency")}</th>
                    <th style={{ textAlign: "right" }}>{whTx(t, "unitCost")}</th>
                    <th style={{ textAlign: "right" }}>{whTx(t, "totalCost")}</th>
                    <th>{whTx(t, "supplier")}</th>
                    <th>{whTx(t, "receivedAt")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingStock ? (
                    <tr><td colSpan="7"><SkeletonRows cols={7} rows={6} /></td></tr>
                  ) : stockEntries.length === 0 ? (
                    <tr><td colSpan="7" style={{ textAlign: "center", color: "var(--text-3)", padding: 24 }}>{whTx(t, "noEntries")}</td></tr>
                  ) : stockEntries.map((entry) => {
                    const currency = entry.currency || entry.item?.default_currency || "uzs";
                    return (
                      <tr key={entry.id}>
                        <td><span className="tg-cell-strong">{whItemName(entry)}</span></td>
                        <td style={{ textAlign: "right", fontWeight: 700 }}>{fmtNum(whNum(entry.quantity))}</td>
                        <td><Badge color={currency === "usd" ? "teal" : "green"} size="sm">{whCurrencyLabel(currency)}</Badge></td>
                        <td style={{ textAlign: "right" }}>{entry.unit_cost ? whMoney(entry.unit_cost, currency) : "—"}</td>
                        <td style={{ textAlign: "right", color: "var(--green)", fontWeight: 700 }}>{entry.total_cost ? whMoney(entry.total_cost, currency) : whMoney(whNum(entry.quantity) * whNum(entry.unit_cost), currency)}</td>
                        <td>{entry.supplier_name || "—"}</td>
                        <td><span className="tg-cell-sub">{fmtDate(entry.received_at || entry.created_at, true)}</span></td>
                      </tr>
                    );
                  })}
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
                    <th>{whTx(t, "item")}</th>
                    <th>{whTx(t, "clientName")}</th>
                    <th style={{ textAlign: "right" }}>{whTx(t, "quantity")}</th>
                    <th>{whTx(t, "currency")}</th>
                    <th style={{ textAlign: "right" }}>{whTx(t, "unitPrice")}</th>
                    <th style={{ textAlign: "right" }}>{whTx(t, "totalAmount")}</th>
                    <th style={{ textAlign: "right" }}>{whTx(t, "paidAmount")}</th>
                    <th>{whTx(t, "paymentType")}</th>
                    <th>{whTx(t, "soldAt")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingSales ? (
                    <tr><td colSpan="9"><SkeletonRows cols={9} rows={6} /></td></tr>
                  ) : sales.length === 0 ? (
                    <tr><td colSpan="9" style={{ textAlign: "center", color: "var(--text-3)", padding: 24 }}>{whTx(t, "noEntries")}</td></tr>
                  ) : sales.map((sale) => {
                    const currency = sale.currency || sale.item?.default_currency || "uzs";
                    return (
                      <tr key={sale.id}>
                        <td><span className="tg-cell-strong">{whItemName(sale)}</span></td>
                        <td>{sale.client_full_name || sale.client_name || "—"}{sale.client_phone && <span className="tg-cell-sub">{sale.client_phone}</span>}</td>
                        <td style={{ textAlign: "right", fontWeight: 700 }}>{fmtNum(whNum(sale.quantity))}</td>
                        <td><Badge color={currency === "usd" ? "teal" : "green"} size="sm">{whCurrencyLabel(currency)}</Badge></td>
                        <td style={{ textAlign: "right" }}>{whMoney(sale.unit_price, currency)}</td>
                        <td style={{ textAlign: "right", color: "var(--green)", fontWeight: 700 }}>{whMoney(sale.total_amount || whNum(sale.quantity) * whNum(sale.unit_price), currency)}</td>
                        <td style={{ textAlign: "right" }}>{whMoney(sale.paid_amount, currency)}</td>
                        <td><Badge color={whPayTypeColor(sale.payment_type)} size="sm">{whPayTypeLabel(t, sale.payment_type)}</Badge></td>
                        <td><span className="tg-cell-sub">{fmtDate(sale.sold_at || sale.created_at, true)}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <WarehouseItemModal
        open={itemOpen}
        initial={editItem}
        t={t}
        onClose={() => { setItemOpen(false); setEditItem(null); }}
        onSave={async (item) => {
          await apiSaveWarehouseItem(item);
          toast(editItem ? whTx(t, "itemUpdated") : whTx(t, "itemCreated"), "success");
          refresh();
        }}
      />
      <StockEntryModal
        open={stockOpen}
        items={items}
        t={t}
        onClose={() => setStockOpen(false)}
        onSave={async (payload) => {
          await apiCreateStockEntry(payload);
          toast(whTx(t, "stockCreated"), "success");
          setTab("stock");
          refresh();
        }}
      />
      <SaleModal
        open={saleOpen}
        items={items}
        customers={data.customers || []}
        t={t}
        onClose={() => setSaleOpen(false)}
        onSave={async (payload) => {
          await apiCreateWarehouseSale(payload);
          toast(whTx(t, "saleCreated"), "success");
          setTab("sales");
          refresh();
        }}
      />
      <ConfirmDialog
        open={!!deleteItem}
        onClose={() => setDeleteItem(null)}
        title={whTx(t, "deleteItemTitle")}
        message={`"${deleteItem?.name || ""}" ${whTx(t, "deleteItemMsg")}`}
        onConfirm={async () => {
          await apiDeleteWarehouseItem(deleteItem.id);
          toast(whTx(t, "itemDeleted"), "success");
          setDeleteItem(null);
          refresh();
        }}
        danger
      />
    </div>
  );
}
window.WarehousePage = WarehousePage;
