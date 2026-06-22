/* pages/commerce.jsx - debtors and accounting */
const { useState: coS, useMemo: coM, useEffect: coE } = React;
const debtNum = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};
const orderLocations = (locations) => locations || {};
const orderDistrictOptions = (locations) => Object.keys(orderLocations(locations));
const orderTuman = (order) => order?.district || "";
const orderMahalla = (order) => order?.mahalla || "";
const orderLocationLabel = (order) => [orderTuman(order), orderMahalla(order)].filter(Boolean).join(" / ");
const hasOrderLocation = (order) => !!orderLocationLabel(order);
const debtorMahallasFor = (district, locations) => orderLocations(locations)[district] || [];
const ACCOUNTING_CATEGORY_OPTIONS = [
  { value: "cash_income", label: "Naqd kirim" },
  { value: "card_income", label: "Karta kirimi" },
  { value: "dollar_income", label: "Dollar kirimi" },
  { value: "daily_expense", label: "Kunlik xarajat" },
  { value: "credit_expense", label: "Kredit xarajati" },
  { value: "card_expense", label: "Karta chiqimi" },
  { value: "dollar_expense", label: "Dollar chiqimi" },
];

function OrderRow({ o, onClick }) {
  const overdueAmount = debtNum(o.overdueAmountUzs);
  const remainingDebt = debtNum(o.remainingDebtUzs);
  const locationText = orderLocationLabel(o);
  const metaParts = [o.businessLine, o.paymentType === "credit" ? "Kredit" : "Naqd", fmtDate(o.createdAt)].filter(Boolean);
  const subMetaParts = [locationText, o.deliveryAddress].filter(Boolean);
  return (
    <Card hover onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span className="tg-card-icon" style={{ color: "var(--amber)", background: "var(--amber-bg)" }}><I.wallet size={17} /></span>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div className="tg-cell-strong">{o.customerName}</div>
          <div className="tg-cell-sub">{o.businessLine} • {o.paymentType === "credit" ? "Kredit" : "Naqd"} • {fmtDate(o.createdAt)}</div>
          <div className="tg-cell-sub">{orderLocationLabel(o)} • {o.deliveryAddress}</div>
        </div>
        {hasOrderLocation(o) && <Badge color="slate" size="sm">{orderMahalla(o) || orderTuman(o)}</Badge>}
        <Badge color={overdueAmount > 0 ? "red" : remainingDebt > 0 ? "amber" : "green"} size="sm">
          {overdueAmount > 0 ? "Muddati o'tgan" : remainingDebt > 0 ? "Qoldiq bor" : "Yopilgan"}
        </Badge>
        <div style={{ fontWeight: 700, fontSize: 15, minWidth: 130, textAlign: "right" }}>{fmtUZS(remainingDebt)}</div>
      </div>
    </Card>
  );
}
window.OrderRow = OrderRow;

OrderRow = function OrderRowPatched({ o, onClick, onEdit, onDelete }) {
  const overdueAmount = debtNum(o.overdueAmountUzs);
  const remainingDebt = debtNum(o.remainingDebtUzs);
  const locationText = orderLocationLabel(o);
  const metaParts = [o.businessLine, o.paymentType === "credit" ? "Kredit" : "Naqd", fmtDate(o.createdAt)].filter(Boolean);
  const subMetaParts = [locationText, o.deliveryAddress].filter(Boolean);
  return (
    <Card hover onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span className="tg-card-icon" style={{ color: "var(--amber)", background: "var(--amber-bg)" }}><I.wallet size={17} /></span>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div className="tg-cell-strong">{o.customerName}</div>
          <div className="tg-cell-sub">{metaParts.join(" • ")}</div>
          {!!subMetaParts.length && <div className="tg-cell-sub">{subMetaParts.join(" • ")}</div>}
        </div>
        {hasOrderLocation(o) && <Badge color="slate" size="sm">{orderMahalla(o) || orderTuman(o)}</Badge>}
        <Badge color={overdueAmount > 0 ? "red" : remainingDebt > 0 ? "amber" : "green"} size="sm">
          {overdueAmount > 0 ? "Muddati o'tgan" : remainingDebt > 0 ? "Qoldiq bor" : "Yopilgan"}
        </Badge>
        {(onEdit || onDelete) && (
          <div onClick={(event) => event.stopPropagation()}>
            <Dropdown
              align="right"
              trigger={<IconButton icon={<I.dots size={16} />} label="Amallar" />}
              items={[
                { label: "Tahrirlash", icon: <I.edit size={16} />, onClick: onEdit },
                { divider: true },
                { label: "O'chirish", icon: <I.trash size={16} />, danger: true, onClick: onDelete },
              ].filter((item) => item.divider || item.onClick)}
            />
          </div>
        )}
        <div style={{ fontWeight: 700, fontSize: 15, minWidth: 130, textAlign: "right" }}>{fmtUZS(remainingDebt)}</div>
      </div>
    </Card>
  );
};
window.OrderRow = OrderRow;

function OrdersPage() {
  const { data, t, nav, upsert, remove, toast } = useApp();
  const loading = useLoading(320);
  const [q, setQ] = coS("");
  const [statusTab, setStatusTab] = coS("all");
  const [districtFilter, setDistrictFilter] = coS("all");
  const [mahallaFilter, setMahallaFilter] = coS("all");
  const [createOpen, setCreateOpen] = coS(false);
  const [editOrder, setEditOrder] = coS(null);
  const [deleteOrder, setDeleteOrder] = coS(null);
  const districts = coM(() => [...new Set(data.orders.map((order) => orderTuman(order)).filter(Boolean))].sort((a, b) => a.localeCompare(b, "uz")), [data.orders]);
  const districtOptions = coM(() => districts.map((district) => ({ value: district, label: district })), [districts]);
  const mahallaOptions = coM(() => {
    const source = districtFilter === "all"
      ? data.orders
      : data.orders.filter((order) => orderTuman(order) === districtFilter);
    return [...new Set(source.map((order) => orderMahalla(order)).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "uz"))
      .map((mahalla) => ({ value: mahalla, label: mahalla }));
  }, [data.orders, districtFilter]);
  const showGrouped = statusTab === "all";

  coE(() => {
    if (mahallaFilter !== "all" && !mahallaOptions.some((option) => option.value === mahallaFilter)) {
      setMahallaFilter("all");
    }
  }, [districtFilter, mahallaFilter, mahallaOptions]);

  const filtered = coM(() => data.orders.filter(o => {
    const query = q.toLowerCase();
    if (q && !o.id.toLowerCase().includes(query) && !o.customerName.toLowerCase().includes(query) && !orderTuman(o).toLowerCase().includes(query) && !orderMahalla(o).toLowerCase().includes(query)) return false;
    if (statusTab === "overdue" && debtNum(o.overdueAmountUzs) <= 0) return false;
    if (statusTab === "open" && debtNum(o.remainingDebtUzs) <= 0) return false;
    if (statusTab === "closed" && debtNum(o.remainingDebtUzs) > 0) return false;
    if (showGrouped && districtFilter !== "all" && orderTuman(o) !== districtFilter) return false;
    if (showGrouped && mahallaFilter !== "all" && orderMahalla(o) !== mahallaFilter) return false;
    return true;
  }), [data.orders, q, statusTab, showGrouped, districtFilter, mahallaFilter]);

  const grouped = coM(() => {
    const map = new Map();
    const ungrouped = [];
    filtered
      .slice()
      .sort((a, b) =>
        orderTuman(a).localeCompare(orderTuman(b), "uz") ||
        orderMahalla(a).localeCompare(orderMahalla(b), "uz") ||
        a.customerName.localeCompare(b.customerName, "uz")
      )
      .forEach((o) => {
        const tuman = orderTuman(o);
        const mahalla = orderMahalla(o);
        if (!tuman) {
          ungrouped.push(o);
          return;
        }
        if (!map.has(tuman)) map.set(tuman, new Map());
        const mahallaMap = map.get(tuman);
        if (!mahallaMap.has(mahalla || "")) mahallaMap.set(mahalla || "", []);
        mahallaMap.get(mahalla || "").push(o);
      });
    return {
      located: Array.from(map.entries()).map(([district, mahallaMap]) => {
        const mahallas = Array.from(mahallaMap.entries()).map(([mahalla, orders]) => ({
          mahalla,
          orders,
          totalDebt: orders.reduce((sum, row) => sum + debtNum(row.remainingDebtUzs), 0),
          overdueDebt: orders.reduce((sum, row) => sum + debtNum(row.overdueAmountUzs), 0),
        }));
        return {
          district,
          mahallas,
          orders: mahallas.flatMap(group => group.orders),
          totalDebt: mahallas.reduce((sum, group) => sum + group.totalDebt, 0),
          overdueDebt: mahallas.reduce((sum, group) => sum + group.overdueDebt, 0),
        };
      }),
      ungrouped,
    };
  }, [filtered]);

  const totalDebt = data.orders.reduce((sum, o) => sum + debtNum(o.remainingDebtUzs), 0);
  const overdue = data.orders.reduce((sum, o) => sum + debtNum(o.overdueAmountUzs), 0);
  const tabs = [
    { value: "all", label: "Barchasi", count: data.orders.length },
    { value: "open", label: "Qoldiq bor", count: data.orders.filter(o => debtNum(o.remainingDebtUzs) > 0).length },
    { value: "overdue", label: "Muddati o'tgan", count: data.orders.filter(o => debtNum(o.overdueAmountUzs) > 0).length },
    { value: "closed", label: "Yopilgan", count: data.orders.filter(o => debtNum(o.remainingDebtUzs) === 0).length },
  ];

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.orders")} desc={`${data.orders.length} ta qarzdor yozuvi`} crumbs={[{ label: "Katalog va moliya" }, { label: t("page.orders") }]}
        actions={<>
          <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setCreateOpen(true)}>Yangi qarzdor</Button>
        </>} />
      <div className="grid-kpi" style={{ marginBottom: 18 }}>
        <StatTile label="Jami qarzdorlik" value={fmtShort(totalDebt)} sub="so'm" color="red" />
        <StatTile label="Muddati o'tgan" value={fmtShort(overdue)} sub="so'm" color="amber" />
        <StatTile label="Kredit mijozlar" value={data.orders.filter(o => o.paymentType === "credit").length} color="blue" />
        <StatTile label="Tumanlar" value={new Set(data.orders.map(o => orderTuman(o)).filter(Boolean)).size} color="violet" />
      </div>
      <div className="toolbar">
        <SearchInput value={q} onChange={setQ} placeholder="Mijoz, ID, tuman yoki mahalla..." width={260} />
        {showGrouped && <FilterSelect label="Tuman" icon="mapPin" value={districtFilter} onChange={setDistrictFilter} options={districtOptions} />}
        {showGrouped && <FilterSelect label="Mahalla" icon="home" value={mahallaFilter} onChange={setMahallaFilter} options={mahallaOptions} />}
        <div className="toolbar-spacer" />
        <ExportDropdown label="Hisobot" size="sm" filename="qarzdorlar" rows={filtered} mapper={o => ({
          ID: o.id,
          Mijoz: o.customerName,
          Tuman: orderTuman(o),
          Mahalla: orderMahalla(o),
          "Yo'nalish": o.businessLine,
          "Qoldiq qarz": debtNum(o.remainingDebtUzs),
          "Muddati o'tgan": debtNum(o.overdueAmountUzs),
        })} />
      </div>
      <div style={{ marginBottom: 16 }}><Tabs tabs={tabs} active={statusTab} onChange={setStatusTab} /></div>
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 76, borderRadius: 14 }} />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><EmptyState icon={<I.wallet size={26} />} title="Qarzdorlar topilmadi" /></Card>
      ) : !showGrouped ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {filtered.map(o => <OrderRow key={o.id} o={o} onClick={() => nav("/debtors/" + o.id)} onEdit={() => setEditOrder(o)} onDelete={() => setDeleteOrder(o)} />)}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {grouped.located.map(group => (
            <div key={group.district}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="tg-card-icon" style={{ color: "var(--blue)", background: "var(--blue-bg)" }}><I.mapPin size={15} /></span>
                    <div style={{ fontSize: 16, fontWeight: 760 }}>{group.district}</div>
                    <Badge color="slate" size="sm">{group.orders.length} ta</Badge>
                  </div>
                  <div className="tg-cell-sub" style={{ marginTop: 4 }}>
                    Qoldiq: {fmtUZS(group.totalDebt)}{group.overdueDebt > 0 ? ` • Muddati o'tgan: ${fmtUZS(group.overdueDebt)}` : ""}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {group.mahallas.map((mahallaGroup) => (
                  <Card key={`${group.district}_${mahallaGroup.mahalla || "no_mahalla"}`} style={{ padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                      {mahallaGroup.mahalla ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="tg-card-icon" style={{ color: "var(--violet)", background: "var(--violet-bg)" }}><I.home size={14} /></span>
                          <div style={{ fontSize: 14, fontWeight: 720 }}>{mahallaGroup.mahalla}</div>
                          <Badge color="slate" size="sm">{mahallaGroup.orders.length} ta</Badge>
                        </div>
                      ) : <div />}
                      <div className="tg-cell-sub">
                        Qoldiq: {fmtUZS(mahallaGroup.totalDebt)}{mahallaGroup.overdueDebt > 0 ? ` • Muddati o'tgan: ${fmtUZS(mahallaGroup.overdueDebt)}` : ""}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {mahallaGroup.orders.map(o => <OrderRow key={o.id} o={o} onClick={() => nav("/debtors/" + o.id)} onEdit={() => setEditOrder(o)} onDelete={() => setDeleteOrder(o)} />)}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
          {!!grouped.ungrouped.length && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {grouped.ungrouped.map(o => <OrderRow key={o.id} o={o} onClick={() => nav("/debtors/" + o.id)} onEdit={() => setEditOrder(o)} onDelete={() => setDeleteOrder(o)} />)}
            </div>
          )}
        </div>
      )}
      <OrderFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        locations={data.locations}
        onSave={async (order) => {
          await upsert("orders", order);
          toast("Qarzdor yozuvi yaratildi");
          setCreateOpen(false);
        }}
      />
      <OrderFormModal
        open={!!editOrder}
        onClose={() => setEditOrder(null)}
        initial={editOrder}
        locations={data.locations}
        onSave={async (order) => {
          await upsert("orders", order);
          toast("Qarzdor yozuvi yangilandi");
          setEditOrder(null);
        }}
      />
      <ConfirmDialog
        open={!!deleteOrder}
        onClose={() => setDeleteOrder(null)}
        onConfirm={async () => {
          await remove("orders", deleteOrder.id);
          toast("Qarzdor yozuvi o'chirildi");
          setDeleteOrder(null);
        }}
        title="Qarzdor yozuvini o'chirish"
        message={`"${deleteOrder?.customerName || ""}" yozuvini o'chirmoqchimisiz?`}
        details={deleteOrder ? [`Telefon: ${deleteOrder.phone || "-"}`, `Qoldiq qarz: ${fmtUZS(debtNum(deleteOrder.remainingDebtUzs))}`, hasOrderLocation(deleteOrder) ? `Hudud: ${orderLocationLabel(deleteOrder)}` : ""].filter(Boolean).join("\n") : ""}
        confirmLabel="O'chirish"
        danger
      />
    </div>
  );
}
window.OrdersPage = OrdersPage;

function OrderFormModal({ open, onClose, onSave, initial, locations }) {
  const { data, toast } = useApp();
  const districts = orderDistrictOptions(locations);
  const blank = {
    customerName: "",
    phone: "",
    district: "",
    mahalla: "",
    businessLine: "Quyosh panel biznesi",
    deliveryAddress: "",
    paymentType: "credit",
    totalUzs: 0,
    paidUzs: 0,
    overdueAmountUzs: 0,
    dueDate: new Date().toISOString().slice(0, 10),
    nextReminderAt: new Date().toISOString().slice(0, 10),
    note: "",
  };
  const normalizeLocation = (item) => {
    const district = item?.district || "";
    const mahalla = item?.mahalla || "";
    return { ...blank, ...item, district, mahalla };
  };
  const [form, setForm] = coS(normalizeLocation(initial || blank));

  React.useEffect(() => {
    setForm(normalizeLocation(initial || blank));
  }, [initial, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Qarzdor yozuvini tahrirlash" : "Yangi qarzdor"} icon={initial ? <I.edit size={18} /> : <I.plus size={18} />} width={620}
      footer={<>
        <Button variant="ghost" onClick={onClose}>Bekor qilish</Button>
        <Button variant="primary" onClick={async () => {
          const phone = (form.phone || "").trim();
          if (!phone) {
            toast("Telefon raqamini kiriting", "error");
            return;
          }
          const totalUzs = +form.totalUzs || 0;
          const paidUzs = +form.paidUzs || 0;
          const overdueAmountUzs = +form.overdueAmountUzs || 0;
          const remainingDebtUzs = Math.max(0, totalUzs - paidUzs);
          const linkedCustomer = data.customers.find(c => c.fullName.toLowerCase() === (form.customerName || "").trim().toLowerCase());
          const linkedLead = data.leads.find(l => l.fullName.toLowerCase() === (form.customerName || "").trim().toLowerCase());
          await onSave({
            ...form,
            id: form.id || `DBT${Date.now()}`,
            customerId: linkedCustomer?.id || null,
            leadId: linkedLead?.id || null,
            customerName: (form.customerName || "").trim(),
            phone: phone || linkedCustomer?.phone || "",
            district: (form.district || "").trim(),
            mahalla: form.mahalla || linkedCustomer?.mahalla || "",
            businessLine: form.businessLine,
            deliveryAddress: (form.deliveryAddress || linkedCustomer?.address || "").trim(),
            paymentType: form.paymentType,
            totalUzs,
            principalUzs: totalUzs,
            paidUzs,
            remainingDebtUzs,
            overdueAmountUzs,
            paymentStatus: remainingDebtUzs === 0 ? "paid" : paidUzs > 0 ? "partial" : "unpaid",
            status: overdueAmountUzs > 0 ? "processing" : "confirmed",
            dueDate: form.dueDate,
            nextReminderAt: form.nextReminderAt,
            lastPaymentAt: paidUzs > 0 ? new Date().toISOString() : null,
            discountUzs: form.discountUzs || 0,
            productItems: form.productItems || [],
            note: form.note || "",
            createdAt: form.createdAt || new Date().toISOString(),
          });
        }}>{initial ? "Saqlash" : "Yaratish"}</Button>
      </>}>
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <Field label="Mijoz"><Input value={form.customerName} onChange={e => set("customerName", e.target.value)} /></Field>
          <Field label="Telefon" required><Input value={form.phone || ""} onChange={e => set("phone", e.target.value)} placeholder="+998 90 123 45 67" /></Field>
          <Field label="Tuman"><Input value={form.district} onChange={e => set("district", e.target.value)} placeholder="Masalan, Bog'ot" /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <Field label="Mahalla"><Input value={form.mahalla} onChange={e => set("mahalla", e.target.value)} placeholder="Masalan, Yangiobod" /></Field>
          <Field label="Yo'nalish"><Select value={form.businessLine} onChange={v => set("businessLine", v)} options={[{ value: "Quyosh panel biznesi", label: "Quyosh panel biznesi" }, { value: "Eski biznes", label: "Eski biznes" }]} /></Field>
          <Field label="To'lov turi"><Select value={form.paymentType} onChange={v => set("paymentType", v)} options={[{ value: "credit", label: "Kredit" }, { value: "cash", label: "Naqd" }]} /></Field>
        </div>
        {!!districts.length && (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>Mavjud tumanlar</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {districts.slice(0, 10).map((district) => (
                <button
                  key={district}
                  type="button"
                  onClick={() => set("district", district)}
                  style={{
                    border: "1px solid var(--border)",
                    background: form.district === district ? "var(--accent-soft)" : "var(--surface-2)",
                    color: form.district === district ? "var(--accent)" : "var(--text-2)",
                    borderRadius: 999,
                    padding: "6px 10px",
                    fontSize: 12.5,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {district}
                </button>
              ))}
            </div>
          </div>
        )}
        {!!form.district && !!debtorMahallasFor(form.district, locations).length && (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>Mavjud mahallalar</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {debtorMahallasFor(form.district, locations).slice(0, 12).map((mahalla) => (
                <button
                  key={mahalla}
                  type="button"
                  onClick={() => set("mahalla", mahalla)}
                  style={{
                    border: "1px solid var(--border)",
                    background: form.mahalla === mahalla ? "var(--accent-soft)" : "var(--surface-2)",
                    color: form.mahalla === mahalla ? "var(--accent)" : "var(--text-2)",
                    borderRadius: 999,
                    padding: "6px 10px",
                    fontSize: 12.5,
                    cursor: "pointer",
                    fontWeight: 600,
                  }}
                >
                  {mahalla}
                </button>
              ))}
            </div>
          </div>
        )}
        <Field label="Manzil"><Input value={form.deliveryAddress} onChange={e => set("deliveryAddress", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <Field label="Jami summa"><Input type="number" value={form.totalUzs} onChange={e => set("totalUzs", e.target.value)} /></Field>
          <Field label="To'langan"><Input type="number" value={form.paidUzs} onChange={e => set("paidUzs", e.target.value)} /></Field>
          <Field label="Muddati o'tgan"><Input type="number" value={form.overdueAmountUzs} onChange={e => set("overdueAmountUzs", e.target.value)} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Muddat"><DatePickerInput value={(form.dueDate || "").slice(0, 10)} onChange={(value) => set("dueDate", value)} /></Field>
          <Field label="Keyingi eslatma"><DatePickerInput value={(form.nextReminderAt || "").slice(0, 10)} onChange={(value) => set("nextReminderAt", value)} /></Field>
        </div>
        <Field label="Izoh"><Textarea rows={4} value={form.note || ""} onChange={e => set("note", e.target.value)} placeholder="To'lov kelishuvi yoki eslatma..." /></Field>
      </div>
    </Modal>
  );
}

function OrderDetailPage({ id }) {
  const { data, nav } = useApp();
  const o = data.orders.find(x => x.id === id);
  if (!o) return <div className="page"><Card><EmptyState title="Qarzdor topilmadi" action={<Button onClick={() => nav("/debtors")}>Qarzdorlarga</Button>} /></Card></div>;
  const cust = data.customers.find(c => c.id === o.customerId);
  const payments = data.payments.filter(p => p.orderId === o.id).slice(0, 8);
  const totalUzs = debtNum(o.totalUzs);
  const paidUzs = debtNum(o.paidUzs);
  const remainingDebt = debtNum(o.remainingDebtUzs);
  const overdueAmount = debtNum(o.overdueAmountUzs);
  return (
    <div className="page fade-in">
      <PageHeader crumbs={[{ label: "Katalog va moliya" }, { label: "Qarzdorlar", to: "/debtors" }, { label: o.customerName }]} title={o.customerName} />
      <div className="grid-dash">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Panel title="Qarzdorlik tarkibi" icon="wallet" color="amber">
            <div className="tg-meta">
              <div className="tg-meta-row"><span className="tg-meta-k">Biznes yo'nalishi</span><span className="tg-meta-v">{o.businessLine}</span></div>
              {!!orderTuman(o) && <div className="tg-meta-row"><span className="tg-meta-k">Tuman</span><span className="tg-meta-v">{orderTuman(o)}</span></div>}
              {!!orderMahalla(o) && <div className="tg-meta-row"><span className="tg-meta-k">Mahalla</span><span className="tg-meta-v">{orderMahalla(o)}</span></div>}
              <div className="tg-meta-row"><span className="tg-meta-k">Manzil</span><span className="tg-meta-v">{o.deliveryAddress}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Jami summa</span><span className="tg-meta-v">{fmtUZS(totalUzs)}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">To'langan</span><span className="tg-meta-v">{fmtUZS(paidUzs)}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Qoldiq</span><span className="tg-meta-v">{fmtUZS(remainingDebt)}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Muddati o'tgan</span><span className="tg-meta-v">{fmtUZS(overdueAmount)}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Muddat</span><span className="tg-meta-v">{fmtDate(o.dueDate)}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Keyingi eslatma</span><span className="tg-meta-v">{fmtDate(o.nextReminderAt)}</span></div>
            </div>
          </Panel>
          <Panel title="Loyiha tarkibi" icon="box" color="green" pad={false}>
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead><tr><th>Mahsulot</th><th>Soni</th><th>Narx</th></tr></thead>
                <tbody>
                  {(o.productItems || []).map((it, i) => <tr key={i}><td className="tg-cell-strong">{it.name}</td><td>{it.quantity}</td><td>{fmtUZS(debtNum(it.unitPriceUzs))}</td></tr>)}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Panel title="Mijoz" icon="user" color="violet">
            {cust ? <div style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }} onClick={() => nav("/customers/" + cust.id)}><Avatar name={cust.fullName} size={40} /><div><div className="tg-cell-strong">{cust.fullName}</div><div className="tg-cell-sub">{cust.phone}</div></div></div> : <div>{o.customerName}</div>}
          </Panel>
          <Panel title="Oxirgi to'lovlar" icon="chart" color="blue" pad={false}>
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead><tr><th>Sana</th><th>Summa</th><th>Usul</th></tr></thead>
                <tbody>
                  {payments.length ? payments.map(p => <tr key={p.id}><td>{fmtDate(p.date)}</td><td style={{ fontWeight: 650 }}>{fmtUZS(p.amountUzs)}</td><td>{p.method}</td></tr>) : <tr><td colSpan="3">To'lov yozuvi yo'q</td></tr>}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
window.OrderDetailPage = OrderDetailPage;

function PaymentsPage() {
  const { data, t, upsert, remove, toast } = useApp();
  const loading = useLoading(320);
  const [q, setQ] = coS("");
  const [direction, setDirection] = coS("all");
  const [createOpen, setCreateOpen] = coS(false);
  const [viewPayment, setViewPayment] = coS(null);
  const [editPayment, setEditPayment] = coS(null);
  const [deletePayment, setDeletePayment] = coS(null);
  const filtered = coM(() => data.payments.filter(p => {
    if (q && !p.customerName.toLowerCase().includes(q.toLowerCase()) && !(p.orderId || "").toLowerCase().includes(q.toLowerCase()) && !p.category.toLowerCase().includes(q.toLowerCase())) return false;
    if (direction !== "all" && p.direction !== direction) return false;
    return true;
  }), [data.payments, q, direction]);
  const income = data.payments.filter(p => p.direction === "income").reduce((s, p) => s + p.amountUzs, 0);
  const expense = data.payments.filter(p => p.direction === "expense").reduce((s, p) => s + p.amountUzs, 0);
  const columns = [
    { key: "date", label: "Sana", sortVal: r => r.date, render: r => <span className="tg-cell-sub">{fmtDate(r.date)}</span> },
    { key: "direction", label: "Yo'nalish", render: r => <Badge color={r.direction === "income" ? "green" : "red"} size="sm">{r.direction === "income" ? "Kirim" : "Chiqim"}</Badge> },
    { key: "category", label: "Kategoriya", sortVal: r => r.category, render: r => r.category },
    { key: "customer", label: "Subyekt", sortVal: r => r.customerName, render: r => r.customerName },
    { key: "amount", label: "Summa", sortVal: r => r.amountUzs, render: r => <span style={{ fontWeight: 650 }}>{fmtUZS(r.amountUzs)}</span> },
    { key: "method", label: "Usul", render: r => <Badge color="slate" size="sm">{r.method}</Badge> },
    { key: "by", label: "Kiritdi", render: r => <span style={{ fontSize: 12.5 }}>{r.processedBy.split(" ")[0]}</span> },
    { key: "actions", label: "", width: 44, render: r => (
      <div onClick={e => e.stopPropagation()}>
        <Dropdown align="right" trigger={<IconButton icon={<I.dots size={16} />} label="Amallar" />} items={[
          { label: "Ko'rish", icon: <I.eye size={16} />, onClick: () => setViewPayment(r) },
          { label: "Tahrirlash", icon: <I.edit size={16} />, onClick: () => setEditPayment(r) },
          { divider: true },
          { label: "O'chirish", icon: <I.trash size={16} />, danger: true, onClick: () => setDeletePayment(r) },
        ]} />
      </div>
    ) },
  ];
  return (
    <div className="page fade-in">
      <PageHeader title={t("page.payments")} desc="Kunlik kirim-chiqim va moliyaviy nazorat" crumbs={[{ label: "Katalog va moliya" }, { label: t("page.payments") }]}
        actions={<Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setCreateOpen(true)}>Yangi yozuv</Button>} />
      <div className="grid-kpi" style={{ marginBottom: 18 }}>
        <StatTile label="Kirim" value={fmtShort(income)} sub="so'm" color="green" />
        <StatTile label="Chiqim" value={fmtShort(expense)} sub="so'm" color="red" />
        <StatTile label="Sof oqim" value={fmtShort(income - expense)} sub="so'm" color={(income - expense) >= 0 ? "green" : "red"} />
        <StatTile label="Yozuvlar" value={data.payments.length} color="blue" />
      </div>
      <div className="toolbar">
        <SearchInput value={q} onChange={setQ} placeholder="Kategoriya, mijoz, ID..." width={260} />
        <FilterSelect label="Yo'nalish" icon="chart" value={direction} onChange={setDirection} options={[{ value: "income", label: "Kirim" }, { value: "expense", label: "Chiqim" }]} />
        <div className="toolbar-spacer" />
        <ExportDropdown label="Hisobot" size="sm" filename="hisob-kitob" rows={filtered} mapper={p => ({
          Sana: p.date,
          Yonalish: p.direction,
          Kategoriya: p.category,
          Subyekt: p.customerName,
          Summa: p.amountUzs,
        })} />
      </div>
      <Card pad={false}>{loading ? <SkeletonRows rows={10} cols={7} /> : <DataTable columns={columns} rows={filtered} onRowClick={r => setViewPayment(r)} defaultSort={{ key: "date", dir: "desc" }} />}</Card>
      <PaymentViewModal
        open={!!viewPayment}
        onClose={() => setViewPayment(null)}
        onEdit={() => { setEditPayment(viewPayment); setViewPayment(null); }}
        onDelete={() => { setDeletePayment(viewPayment); setViewPayment(null); }}
        payment={viewPayment}
      />
      <PaymentFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={async (payment) => {
          await upsert("payments", payment);
          toast("Yozuv qo'shildi");
          setCreateOpen(false);
        }}
      />
      <PaymentFormModal
        open={!!editPayment}
        onClose={() => setEditPayment(null)}
        initial={editPayment}
        onSave={async (payment) => {
          await upsert("payments", payment);
          toast("Yozuv yangilandi");
          setEditPayment(null);
        }}
      />
      <ConfirmDialog
        open={!!deletePayment}
        onClose={() => setDeletePayment(null)}
        onConfirm={async () => {
          await remove("payments", deletePayment.id);
          toast("Yozuv o'chirildi");
          setDeletePayment(null);
        }}
        title="Moliyaviy yozuvni o'chirish"
        message={`"${deletePayment?.customerName || ""}" bo'yicha yozuvni o'chirmoqchimisiz?`}
        details={deletePayment ? `Kategoriya: ${deletePayment.category}\nSumma: ${fmtUZS(deletePayment.amountUzs)}` : ""}
        confirmLabel="O'chirish"
        danger
      />
    </div>
  );
}
window.PaymentsPage = PaymentsPage;

function PaymentViewModal({ open, onClose, onEdit, onDelete, payment }) {
  if (!payment) return null;
  return (
    <Modal open={open} onClose={onClose} title="Hisob-kitob yozuvi" icon={<I.chart size={18} />} width={480}
      footer={<>
        <Button variant="ghost" icon={<I.edit size={15} />} onClick={onEdit}>Tahrirlash</Button>
        <Button variant="danger" icon={<I.trash size={15} />} onClick={onDelete}>O'chirish</Button>
        <Button variant="primary" onClick={onClose}>Yopish</Button>
      </>}>
      <div className="tg-meta">
        <div className="tg-meta-row"><span className="tg-meta-k">Sana</span><span className="tg-meta-v">{fmtDate(payment.date)}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Yo'nalish</span><span className="tg-meta-v">{payment.direction === "income" ? "Kirim" : "Chiqim"}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Kategoriya</span><span className="tg-meta-v">{payment.category}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Subyekt</span><span className="tg-meta-v">{payment.customerName}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Summa</span><span className="tg-meta-v">{fmtUZS(payment.amountUzs)}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Valyuta</span><span className="tg-meta-v">{payment.currency || payment.method || "UZS"}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Tartib</span><span className="tg-meta-v">{payment.sortOrder || 0}</span></div>
      </div>
    </Modal>
  );
}

function PaymentFormModal({ open, onClose, onSave, initial }) {
  const blank = { date: new Date().toISOString().slice(0, 10), rawCategory: "cash_income", category: "Naqd kirim", customerName: "", amountUzs: 0, currency: "UZS", note: "", sortOrder: 0 };
  const [form, setForm] = coS(initial || blank);
  React.useEffect(() => { setForm(initial || blank); }, [initial, open]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Hisob-kitobni tahrirlash" : "Yangi hisob-kitob yozuvi"} icon={initial ? <I.edit size={18} /> : <I.plus size={18} />} width={520}
      footer={<><Button variant="ghost" onClick={onClose}>Bekor qilish</Button><Button variant="primary" onClick={async () => {
        const selectedCategory = ACCOUNTING_CATEGORY_OPTIONS.find((option) => option.value === form.rawCategory);
        await onSave({
          ...form,
          amountUzs: +form.amountUzs,
          category: selectedCategory?.label || form.category,
          rawCategory: form.rawCategory,
        });
      }}>Saqlash</Button></>}>
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Sana"><DatePickerInput value={(form.date || "").slice(0, 10)} onChange={(value) => set("date", value)} /></Field>
          <Field label="Kategoriya"><Select value={form.rawCategory} onChange={v => {
            const selected = ACCOUNTING_CATEGORY_OPTIONS.find((option) => option.value === v);
            set("rawCategory", v);
            set("category", selected?.label || "");
          }} options={ACCOUNTING_CATEGORY_OPTIONS} /></Field>
        </div>
        <Field label="Subyekt"><Input value={form.customerName} onChange={e => set("customerName", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Summa"><Input type="number" value={form.amountUzs} onChange={e => set("amountUzs", e.target.value)} /></Field>
          <Field label="Valyuta"><Input value={form.currency || form.method || ""} onChange={e => set("currency", e.target.value)} placeholder="UZS yoki USD" /></Field>
        </div>
        <Field label="Tartib"><Input type="number" value={form.sortOrder || 0} onChange={e => set("sortOrder", +e.target.value || 0)} /></Field>
        <Field label="Izoh"><Textarea rows={3} value={form.note || ""} onChange={e => set("note", e.target.value)} /></Field>
      </div>
    </Modal>
  );
}
