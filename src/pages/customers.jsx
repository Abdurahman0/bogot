/* pages/customers.jsx */
const { useState: cuS, useMemo: cuM } = React;
const customerTuman = (customer) => customer?.district || "";
const customerMahalla = (customer) => customer?.mahalla || "";
const customerLocationLabel = (customer) => [customerTuman(customer), customerMahalla(customer)].filter(Boolean).join(" / ");
const hasCustomerLocation = (customer) => !!customerLocationLabel(customer);
const customerLocations = (locations) => locations || window.TUMAN_MAHALLA || {};
const customerDistrictOptions = (locations) => Object.keys(customerLocations(locations));
const mahallaOptionsFor = (district, locations) => customerLocations(locations)[district] || [];
const CUSTOMER_STATUS_COLOR_OPTIONS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#dc2626",
  "#ea580c",
  "#0891b2",
  "#ca8a04",
  "#64748b",
];
const CUSTOMER_STATUS_UZ = {
  new: "Yangi",
  active: "Faol",
  inactive: "Nofaol",
  pending: "Kutilmoqda",
  contacted: "Bog'langan",
  qualified: "Saralangan",
  confirmed: "Tasdiqlangan",
  closed: "Yopilgan",
  lost: "Yo'qotilgan",
};
const localizeCustomerStatusName = (value) => {
  const text = String(value || "").trim();
  if (!text) return "Belgilanmagan";
  return CUSTOMER_STATUS_UZ[text.toLowerCase()] || text;
};
const customerTextValue = (value, fallback = "Kiritilmagan") => {
  const text = String(value ?? "").trim();
  return text || fallback;
};
const customerSourceLabel = (source) => SOURCE_UZ[source] || customerTextValue(source);
const customerStatusTone = (customer) => {
  const key = String(customer?.statusName || customer?.status || "").toLowerCase();
  if (key.includes("inactive") || key.includes("lost") || key.includes("closed")) return "red";
  if (key.includes("pending") || key.includes("new")) return "amber";
  return "blue";
};
const customerStatusColor = (customer) => customer?.statusColor || customer?.color || "";
function statusColorToSoftBg(color, alpha = 0.14) {
  const clean = String(color || "").replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(clean)) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function StatusColorBadge({ label, color, tone = "blue", suffix = null }) {
  const softBg = statusColorToSoftBg(color);
  if (softBg && color) {
    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 10px",
        borderRadius: 999,
        background: softBg,
        color,
        border: `1px solid ${statusColorToSoftBg(color, 0.24)}`,
        fontSize: 12,
        fontWeight: 650,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
        <span>{label}</span>
        {suffix}
      </span>
    );
  }
  return <Badge color={tone} size="sm">{label}{suffix}</Badge>;
}

function CustomersPage() {
  const { data, t, nav, upsert, remove, toast } = useApp();
  const loading = useLoading(300);
  const [viewMode, setViewMode] = cuS("clients");
  const [q, setQ] = cuS("");
  const [fDistrict, setFDistrict] = cuS("all");
  const [fStatus, setFStatus] = cuS("all");
  const [statusModalOpen, setStatusModalOpen] = cuS(false);
  const [editStatus, setEditStatus] = cuS(null);
  const [deleteStatus, setDeleteStatus] = cuS(null);
  const [statusForm, setStatusForm] = cuS({ name: "", slug: "", color: CUSTOMER_STATUS_COLOR_OPTIONS[0], isDefault: false, sortOrder: (data.clientStatuses || []).length + 1 });
  const [viewCustomer, setViewCustomer] = cuS(null);
  const [editCustomer, setEditCustomer] = cuS(null);
  const [addOpen, setAddOpen] = cuS(false);
  const [deleteCustomer, setDeleteCustomer] = cuS(null);
  const districts = customerDistrictOptions(data.locations);
  const statusOptions = [{ value: "all", label: "Barcha holatlar" }, ...(data.clientStatuses || []).map((status) => ({ value: status.id, label: localizeCustomerStatusName(status.name) }))];
  const defaultClientStatus = localizeCustomerStatusName((data.clientStatuses || []).find((status) => status.isDefault)?.name);
  const sortedStatuses = cuM(() => (data.clientStatuses || []).slice().sort((a, b) => {
    const orderDiff = Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
    if (orderDiff !== 0) return orderDiff;
    return String(a.name || "").localeCompare(String(b.name || ""), "uz");
  }), [data.clientStatuses]);

  const filtered = cuM(() => data.customers.filter(c => {
    if (q && !c.fullName.toLowerCase().includes(q.toLowerCase()) && !c.phone.includes(q)) return false;
    if (fDistrict !== "all" && customerTuman(c) !== fDistrict) return false;
    if (fStatus !== "all" && c.statusId !== fStatus) return false;
    return true;
  }), [data.customers, q, fDistrict, fStatus]);

  const columns = [
    { key: "name", label: "Mijoz", sortVal: r => r.fullName, render: r => <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={r.fullName} size={34} /><div><div className="tg-cell-strong">{r.fullName}</div><div className="tg-cell-sub">{r.phone}</div></div></div> },
    { key: "source", label: "Manba", render: r => <div style={{ display: "flex", alignItems: "center", gap: 6 }}><SourceIcon source={r.source} />{SOURCE_UZ[r.source]}</div> },
    { key: "system", label: "Tizim", sortVal: r => r.currentSystemKw, render: r => <span>{r.currentSystemKw} kW</span> },
    { key: "payment", label: "To'lov", render: r => <Badge color={r.paymentType === "credit" ? "amber" : "green"} size="sm">{r.paymentTypeLabel}</Badge> },
    { key: "spent", label: "Tushgan summa", sortVal: r => r.totalSpent, render: r => <span style={{ fontWeight: 650 }}>{fmtUZS(r.totalSpent)}</span> },
    { key: "debt", label: "Qoldiq qarz", sortVal: r => r.debtBalanceUzs, render: r => <Badge color={r.debtBalanceUzs > 0 ? "red" : "green"} size="sm">{fmtShort(r.debtBalanceUzs)}</Badge> },
    { key: "status", label: "Holat", render: r => <StatusColorBadge color={customerStatusColor(r)} tone={customerStatusTone(r)} label={localizeCustomerStatusName(r.statusName || r.status)} /> },
    { key: "actions", label: "", width: 44, render: r => (
      <div onClick={e => e.stopPropagation()}>
        <Dropdown align="right" trigger={<IconButton icon={<I.dots size={16} />} label="Amallar" />} items={[
          { label: "Ko'rish", icon: <I.eye size={16} />, onClick: () => setViewCustomer(r) },
          { label: "Tahrirlash", icon: <I.edit size={16} />, onClick: () => setEditCustomer(r) },
          { divider: true },
          { label: "O'chirish", icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteCustomer(r) },
        ]} />
      </div>
    ) },
  ];

  const statusUsageCount = (statusId) => data.customers.filter((customer) => customer.statusId === statusId).length;

  const openStatusCreate = () => {
    setEditStatus(null);
    setStatusForm({
      name: "",
      slug: "",
      color: CUSTOMER_STATUS_COLOR_OPTIONS[0],
      isDefault: false,
      sortOrder: (data.clientStatuses || []).length + 1,
    });
    setStatusModalOpen(true);
  };

  const openStatusEdit = (status) => {
    setEditStatus(status);
    setStatusForm({
      id: status.id,
      name: status.name || "",
      slug: status.slug || "",
      color: status.color || CUSTOMER_STATUS_COLOR_OPTIONS[0],
      isDefault: !!status.isDefault,
      sortOrder: Number(status.sortOrder || 0),
    });
    setStatusModalOpen(true);
  };

  const setStatusField = (key, value) => setStatusForm((current) => ({ ...current, [key]: value }));

  const saveStatus = async () => {
    if (!statusForm.name.trim()) return;
    await upsert("clientStatuses", {
      ...editStatus,
      name: statusForm.name.trim(),
      slug: (statusForm.slug || "").trim(),
      color: statusForm.color || "",
      isDefault: !!statusForm.isDefault,
      sortOrder: Number(statusForm.sortOrder || 0),
    });
    toast(editStatus ? "Holat yangilandi" : "Yangi holat qo'shildi");
    setStatusModalOpen(false);
    setEditStatus(null);
  };

  const statusColumns = [
    { key: "name", label: "Holat", sortVal: (row) => row.name, render: (row) => <div style={{ display: "flex", alignItems: "center", gap: 10 }}><StatusColorBadge color={row.color} tone={row.isDefault ? "green" : "blue"} label={localizeCustomerStatusName(row.name)} />{row.isDefault && <span className="tg-cell-sub">Asosiy</span>}</div> },
    { key: "slug", label: "Slug", sortVal: (row) => row.slug, render: (row) => <span className="tg-cell-sub" style={{ fontFamily: "monospace" }}>{row.slug || "-"}</span> },
    { key: "order", label: "Tartib", sortVal: (row) => Number(row.sortOrder || 0), render: (row) => <span>{row.sortOrder || 0}</span> },
    { key: "customers", label: "Mijozlar", sortVal: (row) => statusUsageCount(row.id), render: (row) => <Badge color="slate" size="sm">{statusUsageCount(row.id)} ta</Badge> },
    { key: "actions", label: "", width: 44, render: (row) => (
      <div onClick={(event) => event.stopPropagation()}>
        <Dropdown align="right" trigger={<IconButton icon={<I.dots size={16} />} label="Amallar" />} items={[
          { label: "Tahrirlash", icon: <I.edit size={16} />, onClick: () => openStatusEdit(row) },
          { divider: true },
          { label: "O'chirish", icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteStatus(row) },
        ]} />
      </div>
    ) },
  ];

  const modeChips = [
    { value: "clients", label: "Mijozlar", count: data.customers.length, icon: <I.users size={14} /> },
    { value: "statuses", label: "Statuslar", count: sortedStatuses.length, icon: <I.flag size={14} /> },
  ];
  const pageDesc = viewMode === "statuses" ? `${sortedStatuses.length} ta holat` : `${data.customers.length} ta mijoz`;

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.customers")} desc={pageDesc} crumbs={[{ label: "CRM" }, { label: t("page.customers") }]}
        actions={<>
          {viewMode === "clients" && <ExportDropdown label="Hisobot" size="sm" filename="mijozlar" rows={filtered} mapper={c => ({
            Ism: c.fullName,
            Telefon: c.phone,
            Tuman: customerTuman(c),
            Mahalla: customerMahalla(c),
            "Tizim (kW)": c.currentSystemKw,
            "Qoldiq qarz": c.debtBalanceUzs,
          })} />}
          {viewMode === "statuses" && <Button variant="soft" size="sm" icon={<I.flag size={15} />} onClick={openStatusCreate}>Yangi holat</Button>}
          {viewMode === "clients" && <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setAddOpen(true)}>Yangi mijoz</Button>}
        </>} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {modeChips.map((chip) => {
          const active = viewMode === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => setViewMode(chip.value)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                border: active ? "1px solid rgba(var(--accent-rgb), .35)" : "1px solid var(--border)",
                background: active ? "var(--accent-soft)" : "var(--surface)",
                color: active ? "var(--accent)" : "var(--text-2)",
                padding: "9px 14px",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all .18s",
              }}
            >
              {chip.icon}
              <span>{chip.label}</span>
              <span style={{
                minWidth: 22,
                height: 22,
                padding: "0 7px",
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: active ? "rgba(var(--accent-rgb), .14)" : "var(--surface-3)",
                color: active ? "var(--accent)" : "var(--text-3)",
                fontSize: 11.5,
                fontWeight: 700,
              }}>
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>
      {viewMode === "clients" && (
        <>
          <div className="toolbar">
            <SearchInput value={q} onChange={setQ} placeholder="Ism yoki telefon..." width={260} />
            <FilterSelect label="Tuman" icon="mapPin" value={fDistrict} onChange={setFDistrict} options={districts.map(d => ({ value: d, label: d }))} />
            <FilterSelect label="Holat" icon="flag" value={fStatus} onChange={setFStatus} options={statusOptions} />
            <div className="toolbar-spacer" />
            <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{filtered.length} ta</span>
          </div>
          <Card pad={false}>
            {loading ? <SkeletonRows rows={10} cols={7} /> : <DataTable columns={columns} rows={filtered} onRowClick={r => setViewCustomer(r)} defaultSort={{ key: "debt", dir: "desc" }} />}
          </Card>
        </>
      )}
      {viewMode === "statuses" && (
        <div style={{ display: "grid", gap: 16 }}>
          <div className="grid-3">
            <StatTile label="Jami statuslar" value={sortedStatuses.length} color="blue" />
            <StatTile label="Asosiy status" value={defaultClientStatus || "Yo'q"} color="green" />
            <StatTile label="Statusli mijozlar" value={data.customers.filter((customer) => customer.statusId).length} color="amber" />
          </div>
          <Card pad={false}>
            {loading ? <SkeletonRows rows={6} cols={5} /> : <DataTable columns={statusColumns} rows={sortedStatuses} onRowClick={openStatusEdit} defaultSort={{ key: "order", dir: "asc" }} />}
          </Card>
        </div>
      )}
      <CustomerStatusModal
        open={statusModalOpen}
        onClose={() => { setStatusModalOpen(false); setEditStatus(null); }}
        onSave={saveStatus}
        form={statusForm}
        setField={setStatusField}
        defaultClientStatus={defaultClientStatus}
        editing={!!editStatus}
      />
      <CustomerViewModal
        open={!!viewCustomer}
        onClose={() => setViewCustomer(null)}
        onEdit={() => { setEditCustomer(viewCustomer); setViewCustomer(null); }}
        onDelete={() => { setDeleteCustomer(viewCustomer); setViewCustomer(null); }}
        customer={viewCustomer}
      />
      <CustomerFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={async (customer) => {
          await upsert("customers", customer);
          toast("Mijoz qo'shildi");
          setAddOpen(false);
        }}
        locations={data.locations}
      />
      <CustomerFormModal
        open={!!editCustomer}
        onClose={() => setEditCustomer(null)}
        initial={editCustomer}
        onSave={async (customer) => {
          await upsert("customers", customer);
          toast("Mijoz yangilandi");
          setEditCustomer(null);
        }}
        locations={data.locations}
      />
      <ConfirmDialog
        open={!!deleteCustomer}
        onClose={() => setDeleteCustomer(null)}
        onConfirm={async () => {
          await remove("customers", deleteCustomer.id);
          toast("Mijoz o'chirildi");
          setDeleteCustomer(null);
        }}
        title="Mijozni o'chirish"
        message={`"${deleteCustomer?.fullName || ""}" mijoz yozuvini o'chirmoqchimisiz?`}
        details={deleteCustomer ? [`Telefon: ${deleteCustomer.phone}`, hasCustomerLocation(deleteCustomer) ? `Hudud: ${customerLocationLabel(deleteCustomer)}` : ""].filter(Boolean).join("\n") : ""}
        confirmLabel="O'chirish"
        danger
      />
      <ConfirmDialog
        open={!!deleteStatus}
        onClose={() => setDeleteStatus(null)}
        onConfirm={async () => {
          await remove("clientStatuses", deleteStatus.id);
          toast("Holat o'chirildi");
          setDeleteStatus(null);
        }}
        title="Holatni o'chirish"
        message={`"${localizeCustomerStatusName(deleteStatus?.name || "")}" holatini o'chirmoqchimisiz?`}
        details={deleteStatus ? `Slug: ${deleteStatus.slug || "-"}\nBiriktirilgan mijozlar: ${statusUsageCount(deleteStatus.id)} ta` : ""}
        confirmLabel="O'chirish"
        danger
      />
    </div>
  );
}
window.CustomersPage = CustomersPage;

function CustomerStatusModal({ open, onClose, onSave, form, setField, defaultClientStatus, editing }) {
  return (
    <Modal open={open} onClose={onClose} title={editing ? "Holatni tahrirlash" : "Yangi holat"} icon={<I.flag size={18} />} width={460}
      footer={<><Button variant="ghost" onClick={onClose}>Bekor qilish</Button><Button variant="primary" onClick={onSave}>Saqlash</Button></>}>
      <div style={{ display: "grid", gap: 14 }}>
        <Field label="Holat nomi" required><Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="Masalan, Faol mijoz" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 14 }}>
          <Field label="Slug"><Input value={form.slug} onChange={e => setField("slug", e.target.value)} placeholder="faol_mijoz" /></Field>
          <Field label="Tartib"><Input type="number" value={form.sortOrder} onChange={e => setField("sortOrder", Number(e.target.value || 0))} /></Field>
        </div>
        <Field label="Rang">
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CUSTOMER_STATUS_COLOR_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setField("color", color)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: form.color === color ? `2px solid ${color}` : "1px solid var(--border)",
                  background: color,
                  boxShadow: form.color === color ? `0 0 0 3px ${statusColorToSoftBg(color, 0.18)}` : "none",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </Field>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "12px 14px", borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 650 }}>Asosiy holat</div>
            <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
              {form.isDefault
                ? "Bu holat yangi mijozlar uchun default bo'ladi."
                : `Joriy default: ${localizeCustomerStatusName(defaultClientStatus) || "yo'q"}`}
            </div>
          </div>
          <Toggle checked={!!form.isDefault} onChange={value => setField("isDefault", value)} />
        </div>
      </div>
    </Modal>
  );
}

function CustomerViewModal({ open, onClose, onEdit, onDelete, customer }) {
  const { data } = useApp();
  if (!customer) return null;
  const product = (data.products || []).find((row) => row.id === customer.productId);
  const productLabel = product?.model || product?.name || product?.title || customer.productId || "";
  return (
    <Modal open={open} onClose={onClose} title="Mijoz ma'lumotlari" icon={<I.users size={18} />} width={760}
      footer={<>
        <Button variant="ghost" icon={<I.edit size={15} />} onClick={onEdit}>Tahrirlash</Button>
        <Button variant="danger" icon={<I.trash size={15} />} onClick={onDelete}>O'chirish</Button>
        <Button variant="primary" onClick={onClose}>Yopish</Button>
      </>}>
      <div className="tg-customer-view-shell">
        <section className="tg-customer-view-hero">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar name={customer.fullName} size={52} />
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h4 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-.03em" }}>{customer.fullName}</h4>
                <StatusColorBadge color={customerStatusColor(customer)} tone={customerStatusTone(customer)} label={localizeCustomerStatusName(customer.statusName || customer.status)} />
              </div>
              <div className="tg-customer-view-pills">
                <span className="tg-customer-view-pill"><SourceIcon source={customer.source} />{customerSourceLabel(customer.source)}</span>
                <span className="tg-customer-view-pill"><I.box size={14} />{customerTextValue(productLabel, "Mahsulot tanlanmagan")}</span>
                <span className="tg-customer-view-pill"><I.phone size={14} />{customerTextValue(customer.phone)}</span>
              </div>
            </div>
          </div>
          <div className="tg-customer-view-kpis">
            <div className="tg-customer-view-kpi"><span>Tushgan summa</span><strong>{fmtUZS(customer.totalSpent)}</strong></div>
            <div className="tg-customer-view-kpi"><span>Qoldiq qarz</span><strong>{fmtUZS(customer.debtBalanceUzs)}</strong></div>
            <div className="tg-customer-view-kpi"><span>So'ralgan quvvat</span><strong>{customer.currentSystemKw || 0} kW</strong></div>
          </div>
        </section>

        <div className="tg-customer-view-grid">
          <section className="tg-customer-view-card">
            <div className="tg-customer-view-card-title">Asosiy ma'lumotlar</div>
            <div className="tg-customer-view-meta">
              <div className="tg-customer-view-row"><span>Telefon</span><strong>{customerTextValue(customer.phone)}</strong></div>
              <div className="tg-customer-view-row"><span>Manba</span><strong>{customerSourceLabel(customer.source)}</strong></div>
              <div className="tg-customer-view-row"><span>Mahsulot</span><strong>{customerTextValue(productLabel, "Tanlanmagan")}</strong></div>
              <div className="tg-customer-view-row"><span>Holat</span><strong>{localizeCustomerStatusName(customer.statusName || customer.status)}</strong></div>
              <div className="tg-customer-view-row"><span>Yaratilgan</span><strong>{customer.createdAt ? fmtDate(customer.createdAt, true) : "Kiritilmagan"}</strong></div>
              <div className="tg-customer-view-row"><span>Yangilangan</span><strong>{customer.updatedAt ? fmtDate(customer.updatedAt, true) : "Kiritilmagan"}</strong></div>
            </div>
          </section>

          <section className="tg-customer-view-card">
            <div className="tg-customer-view-card-title">Hudud va loyiha</div>
            <div className="tg-customer-view-meta">
              <div className="tg-customer-view-row"><span>Tuman</span><strong>{customerTextValue(customerTuman(customer))}</strong></div>
              <div className="tg-customer-view-row"><span>Mahalla</span><strong>{customerTextValue(customerMahalla(customer))}</strong></div>
              <div className="tg-customer-view-row"><span>Manzil</span><strong>{customerTextValue(customer.address)}</strong></div>
              <div className="tg-customer-view-row"><span>So'ralgan quvvat</span><strong>{customer.currentSystemKw || 0} kW</strong></div>
              <div className="tg-customer-view-row"><span>Yillik iste'mol</span><strong>{customerTextValue(customer.annualConsumptionKwh, "Kiritilmagan")}</strong></div>
              <div className="tg-customer-view-row"><span>Taxminiy subsidiya kW</span><strong>{customerTextValue(customer.estimatedSubsidyKw, "Kiritilmagan")}</strong></div>
            </div>
          </section>

          <section className="tg-customer-view-card">
            <div className="tg-customer-view-card-title">Moliyaviy ma'lumotlar</div>
            <div className="tg-customer-view-meta">
              <div className="tg-customer-view-row"><span>To'lov turi</span><strong>{customerTextValue(customer.paymentTypeLabel)}</strong></div>
              <div className="tg-customer-view-row"><span>Depozit</span><strong>{fmtUZS(customer.totalSpent)}</strong></div>
              <div className="tg-customer-view-row"><span>Subsidiya</span><strong>{fmtUZS(customer.debtBalanceUzs)}</strong></div>
              <div className="tg-customer-view-row"><span>Shartnoma ID</span><strong>{customerTextValue(customer.contractId)}</strong></div>
              <div className="tg-customer-view-row"><span>Karta raqami</span><strong>{customerTextValue(customer.cardNumber)}</strong></div>
              <div className="tg-customer-view-row"><span>Bank filiali kodi</span><strong>{customerTextValue(customer.bankBranchCode)}</strong></div>
              <div className="tg-customer-view-row"><span>Hisob raqami</span><strong>{customerTextValue(customer.bankAccountNumber)}</strong></div>
            </div>
          </section>

          <section className="tg-customer-view-card">
            <div className="tg-customer-view-card-title">Rasmiy va audit ma'lumotlari</div>
            <div className="tg-customer-view-meta">
              <div className="tg-customer-view-row"><span>PNFL</span><strong>{customerTextValue(customer.pnfl)}</strong></div>
              <div className="tg-customer-view-row"><span>Kadastr</span><strong>{customerTextValue(customer.cadastre)}</strong></div>
              <div className="tg-customer-view-row"><span>Auditor kompaniya</span><strong>{customerTextValue(customer.auditorCompanyName)}</strong></div>
              <div className="tg-customer-view-row"><span>Auditor telefoni</span><strong>{customerTextValue(customer.auditorCompanyPhone)}</strong></div>
              <div className="tg-customer-view-row"><span>Hokim yordamchisi</span><strong>{customerTextValue(customer.hokimHelperName)}</strong></div>
              <div className="tg-customer-view-row"><span>Yordamchi telefoni</span><strong>{customerTextValue(customer.hokimHelperPhone)}</strong></div>
            </div>
          </section>
        </div>

        <div className="tg-customer-view-grid">
          <section className="tg-customer-view-card">
            <div className="tg-customer-view-card-title">AI xulosa</div>
            <div className="tg-customer-view-note">{customer.aiXulosa || "Kiritilmagan"}</div>
          </section>
          <section className="tg-customer-view-card">
            <div className="tg-customer-view-card-title">Eslatma</div>
            <div className="tg-customer-view-note">{customer.notes || "Qo'shimcha eslatma yo'q."}</div>
          </section>
        </div>
      </div>
    </Modal>
  );
}

function CustomerFormModal({ open, onClose, onSave, initial, locations }) {
  const { data } = useApp();
  const districts = customerDistrictOptions(locations);
  const statusOptions = (data.clientStatuses || []).map((status) => ({ value: status.id, label: localizeCustomerStatusName(status.name) }));
  const sourceOptions = Array.from(new Set([...(window.SOURCES || []), initial?.source || "manual"].filter(Boolean))).map((source) => ({ value: source, label: customerSourceLabel(source) }));
  const productOptions = [{ value: "", label: "Tanlanmagan" }, ...(data.products || []).map((product) => ({ value: product.id, label: product.model || product.name || product.title || product.id }))];
  if (initial?.productId && !productOptions.some((option) => option.value === initial.productId)) {
    productOptions.push({ value: initial.productId, label: initial.productId });
  }
  const defaultStatus = (data.clientStatuses || []).find((status) => status.isDefault) || data.clientStatuses?.[0] || null;
  const blank = {
    fullName: "",
    phone: "+998 ",
    source: "manual",
    productId: "",
    district: "",
    mahalla: "",
    address: "",
    currentSystemKw: 10,
    annualConsumptionKwh: "",
    estimatedSubsidyKw: "",
    paymentType: "cash",
    statusId: defaultStatus?.id || null,
    statusName: defaultStatus?.name || "",
    totalSpent: 0,
    debtBalanceUzs: 0,
    contractId: "",
    pnfl: "",
    password: "",
    cadastre: "",
    auditorCompanyName: "",
    auditorCompanyPhone: "",
    hokimHelperName: "",
    hokimHelperPhone: "",
    cardNumber: "",
    bankBranchCode: "",
    bankAccountNumber: "",
    notes: "",
  };
  const normalizeLocation = (item) => {
    const district = item?.district || "";
    const mahalla = item?.mahalla || "";
    return { ...blank, ...item, district, mahalla };
  };
  const [form, setForm] = cuS(normalizeLocation(initial || blank));
  React.useEffect(() => { setForm(normalizeLocation(initial || blank)); }, [initial, open]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = async () => {
    if (!form.fullName.trim()) return;
    await onSave(initial ? {
      ...initial,
      ...form,
      paymentTypeLabel: PAYMENT_TYPE_UZ[form.paymentType],
      debtBalanceUzs: +form.debtBalanceUzs,
      totalSpent: +form.totalSpent,
      currentSystemKw: +form.currentSystemKw,
      statusId: form.statusId || null,
      statusName: data.clientStatuses.find((status) => status.id === form.statusId)?.name || form.statusName || "",
      lifetimeValue: +form.totalSpent + +form.debtBalanceUzs,
    } : {
      id: "C" + Math.floor(Math.random() * 9000 + 1000),
      ...form,
      paymentTypeLabel: PAYMENT_TYPE_UZ[form.paymentType],
      currentSystemKw: +form.currentSystemKw,
      totalSpent: +form.totalSpent,
      debtBalanceUzs: +form.debtBalanceUzs,
      overdueDebtUzs: 0,
      ordersCount: 1,
      lastPurchase: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      lifetimeValue: +form.totalSpent + +form.debtBalanceUzs,
      source: "manual",
      preferredChannel: "manual",
      createdAt: new Date().toISOString(),
      statusId: form.statusId || null,
      statusName: data.clientStatuses.find((status) => status.id === form.statusId)?.name || form.statusName || "",
    });
  };
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Mijozni tahrirlash" : "Yangi mijoz"} icon={<I.user size={18} />} width={820}
      footer={<><Button variant="ghost" onClick={onClose}>Bekor qilish</Button><Button variant="primary" onClick={save}>Saqlash</Button></>}>
      <div className="tg-customer-form-shell">
        <section className="tg-customer-form-card">
          <div className="tg-customer-form-head">
            <div className="tg-customer-form-title">Asosiy ma'lumotlar</div>
            <div className="tg-customer-form-sub">Backenddagi asosiy client maydonlari</div>
          </div>
          <div className="tg-customer-form-grid tg-customer-form-grid-2">
            <Field label="To'liq ism" required><Input value={form.fullName} onChange={e => set("fullName", e.target.value)} /></Field>
            <Field label="Telefon"><Input value={form.phone} onChange={e => set("phone", e.target.value)} /></Field>
            <Field label="Holat"><Select value={form.statusId || ""} onChange={v => set("statusId", v)} options={statusOptions.map((status) => ({ value: status.value, label: status.label }))} /></Field>
            <Field label="Manba"><Select value={form.source || "manual"} onChange={v => set("source", v)} options={sourceOptions} /></Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Mahsulot"><Select value={form.productId || ""} onChange={v => set("productId", v)} options={productOptions} /></Field>
            </div>
          </div>
        </section>

        <section className="tg-customer-form-card">
          <div className="tg-customer-form-head">
            <div className="tg-customer-form-title">Hudud va loyiha</div>
            <div className="tg-customer-form-sub">Manzil, quvvat va subsidiya bilan bog'liq maydonlar</div>
          </div>
          <div className="tg-customer-form-grid tg-customer-form-grid-2">
            <Field label="Tuman"><Input value={form.district} onChange={e => set("district", e.target.value)} placeholder="Masalan, Bog'ot" /></Field>
            <Field label="Mahalla"><Input value={form.mahalla} onChange={e => set("mahalla", e.target.value)} placeholder="Masalan, Yangiobod" /></Field>
            <div style={{ gridColumn: "1 / -1" }}><Field label="Manzil"><Input value={form.address} onChange={e => set("address", e.target.value)} /></Field></div>
            <Field label="Tizim quvvati (kW)"><Input type="number" value={form.currentSystemKw} onChange={e => set("currentSystemKw", e.target.value)} /></Field>
            <Field label="Yillik iste'mol (kWh)"><Input type="number" value={form.annualConsumptionKwh} onChange={e => set("annualConsumptionKwh", e.target.value)} /></Field>
            <Field label="Taxminiy subsidiya kW"><Input type="number" value={form.estimatedSubsidyKw} onChange={e => set("estimatedSubsidyKw", e.target.value)} /></Field>
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
          {!!form.district && !!mahallaOptionsFor(form.district, locations).length && (
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>Mavjud mahallalar</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {mahallaOptionsFor(form.district, locations).slice(0, 12).map((mahalla) => (
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
        </section>

        <section className="tg-customer-form-card">
          <div className="tg-customer-form-head">
            <div className="tg-customer-form-title">Moliyaviy ma'lumotlar</div>
            <div className="tg-customer-form-sub">To'lov, depozit, subsidiya va bank ma'lumotlari</div>
          </div>
          <div className="tg-customer-form-grid tg-customer-form-grid-2">
            <Field label="To'lov turi"><Select value={form.paymentType} onChange={v => set("paymentType", v)} options={PAYMENT_TYPES.map(v => ({ value: v, label: PAYMENT_TYPE_UZ[v] }))} /></Field>
            <Field label="Shartnoma ID"><Input value={form.contractId} onChange={e => set("contractId", e.target.value)} /></Field>
            <Field label="Tushgan summa"><Input type="number" value={form.totalSpent} onChange={e => set("totalSpent", e.target.value)} /></Field>
            <Field label="Qoldiq qarz"><Input type="number" value={form.debtBalanceUzs} onChange={e => set("debtBalanceUzs", e.target.value)} /></Field>
            <Field label="Karta raqami"><Input value={form.cardNumber} onChange={e => set("cardNumber", e.target.value)} /></Field>
            <Field label="Bank filiali kodi"><Input value={form.bankBranchCode} onChange={e => set("bankBranchCode", e.target.value)} /></Field>
            <div style={{ gridColumn: "1 / -1" }}><Field label="Hisob raqami"><Input value={form.bankAccountNumber} onChange={e => set("bankAccountNumber", e.target.value)} /></Field></div>
          </div>
        </section>

        <section className="tg-customer-form-card">
          <div className="tg-customer-form-head">
            <div className="tg-customer-form-title">Rasmiy va audit ma'lumotlari</div>
            <div className="tg-customer-form-sub">Shaxsiy identifikatsiya va audit bloklari</div>
          </div>
          <div className="tg-customer-form-grid tg-customer-form-grid-2">
            <Field label="PNFL"><Input value={form.pnfl} onChange={e => set("pnfl", e.target.value)} /></Field>
            <Field label="Parol"><Input value={form.password} onChange={e => set("password", e.target.value)} /></Field>
            <Field label="Kadastr"><Input value={form.cadastre} onChange={e => set("cadastre", e.target.value)} /></Field>
            <Field label="Auditor kompaniya"><Input value={form.auditorCompanyName} onChange={e => set("auditorCompanyName", e.target.value)} /></Field>
            <Field label="Auditor telefoni"><Input value={form.auditorCompanyPhone} onChange={e => set("auditorCompanyPhone", e.target.value)} /></Field>
            <Field label="Hokim yordamchisi"><Input value={form.hokimHelperName} onChange={e => set("hokimHelperName", e.target.value)} /></Field>
            <Field label="Yordamchi telefoni"><Input value={form.hokimHelperPhone} onChange={e => set("hokimHelperPhone", e.target.value)} /></Field>
          </div>
        </section>

        <section className="tg-customer-form-card">
          <div className="tg-customer-form-head">
            <div className="tg-customer-form-title">Izoh</div>
            <div className="tg-customer-form-sub">Faqat operator yozadigan eslatmalar</div>
          </div>
          <Field label="Eslatma"><Textarea rows={4} value={form.notes} onChange={e => set("notes", e.target.value)} /></Field>
        </section>
      </div>
    </Modal>
  );
}

function CustomerDetailPage({ id }) {
  const { data, t, nav } = useApp();
  const c = data.customers.find(x => x.id === id);
  const [tab, setTab] = cuS("overview");
  if (!c) return <div className="page"><Card><EmptyState title="Mijoz topilmadi" action={<Button onClick={() => nav("/customers")}>Mijozlarga</Button>} /></Card></div>;

  const debtor = data.orders.find(o => o.customerId === c.id || o.customerName === c.fullName);
  const ledger = data.payments.filter(p => p.customerName === c.fullName).slice(0, 8);
  const tabs = [
    { value: "overview", label: "Umumiy", icon: <I.user size={15} /> },
    { value: "debt", label: "Qarzdorlik", icon: <I.wallet size={15} /> },
    { value: "ledger", label: "Hisob-kitob", icon: <I.chart size={15} />, count: ledger.length },
  ];

  return (
    <div className="page fade-in">
      <PageHeader crumbs={[{ label: "CRM" }, { label: t("page.customers"), to: "/customers" }, { label: c.fullName }]} title={c.fullName} />
      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
          <Avatar name={c.fullName} size={62} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><h2 style={{ margin: 0, fontSize: 21, fontWeight: 720 }}>{c.fullName}</h2><StatusColorBadge color={customerStatusColor(c)} tone={customerStatusTone(c)} label={localizeCustomerStatusName(c.statusName || c.status)} /></div>
            <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", color: "var(--text-2)", fontSize: 13 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><I.phone size={14} />{c.phone}</span>
              {hasCustomerLocation(c) && <span style={{ display: "flex", alignItems: "center", gap: 5 }}><I.mapPin size={14} />{customerLocationLabel(c)}</span>}
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><I.sun size={14} />{c.currentSystemKw} kW</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 22 }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 760, color: "var(--teal)" }}>{fmtShort(c.totalSpent)}</div><div style={{ fontSize: 11, color: "var(--text-3)" }}>Tushgan summa</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 760, color: c.debtBalanceUzs > 0 ? "var(--red)" : "var(--green)" }}>{fmtShort(c.debtBalanceUzs)}</div><div style={{ fontSize: 11, color: "var(--text-3)" }}>Qoldiq qarz</div></div>
          </div>
        </div>
      </Card>
      <div style={{ marginBottom: 18 }}><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === "overview" && (
        <div className="grid-dash">
          <Panel title="Kontakt ma'lumotlari" icon="user" color="accent">
            <div className="tg-meta">
              <div className="tg-meta-row"><span className="tg-meta-k">Manzil</span><span className="tg-meta-v">{c.address}</span></div>
              {!!customerTuman(c) && <div className="tg-meta-row"><span className="tg-meta-k">Tuman</span><span className="tg-meta-v">{customerTuman(c)}</span></div>}
              {!!customerMahalla(c) && <div className="tg-meta-row"><span className="tg-meta-k">Mahalla</span><span className="tg-meta-v">{customerMahalla(c)}</span></div>}
              <div className="tg-meta-row"><span className="tg-meta-k">To'lov turi</span><span className="tg-meta-v">{c.paymentTypeLabel}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Ro'yxatdan o'tgan</span><span className="tg-meta-v">{fmtDate(c.createdAt)}</span></div>
            </div>
          </Panel>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="grid-2">
              <StatTile label="Aktiv loyiha" value={c.ordersCount} color="blue" />
              <StatTile label="Mijoz qiymati" value={fmtShort(c.lifetimeValue)} sub="so'm" color="green" />
            </div>
            <Panel title="Eslatma" icon="note" color="amber">
              <div style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6 }}>{c.notes || "Qo'shimcha eslatma yo'q."}</div>
            </Panel>
          </div>
        </div>
      )}

      {tab === "debt" && (
        debtor ? (
          <div className="grid-dash">
            <Panel title="Qarzdorlik kartasi" icon="wallet" color="amber">
              <div className="tg-meta">
                <div className="tg-meta-row"><span className="tg-meta-k">Yo'nalish</span><span className="tg-meta-v">{debtor.businessLine}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">Jami summa</span><span className="tg-meta-v">{fmtUZS(debtor.totalUzs)}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">To'langan</span><span className="tg-meta-v">{fmtUZS(debtor.paidUzs)}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">Qoldiq</span><span className="tg-meta-v">{fmtUZS(debtor.remainingDebtUzs)}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">Muddati o'tgan</span><span className="tg-meta-v">{fmtUZS(debtor.overdueAmountUzs)}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">Muddat</span><span className="tg-meta-v">{fmtDate(debtor.dueDate)}</span></div>
              </div>
            </Panel>
            <Panel title="Loyiha tarkibi" icon="box" color="green">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {debtor.productItems.map((item, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span>{item.name}</span><strong>{fmtUZS(item.unitPriceUzs)}</strong></div>)}
              </div>
            </Panel>
          </div>
        ) : <Card><EmptyState icon={<I.wallet size={26} />} title="Qarzdorlik yo'q" /></Card>
      )}

      {tab === "ledger" && (
        <Panel title="Hisob-kitob yozuvlari" icon="chart" color="blue" pad={false}>
          <div className="tg-table-wrap">
            <table className="tg-table">
              <thead><tr><th>Sana</th><th>Yo'nalish</th><th>Kategoriya</th><th>Summa</th><th>Usul</th></tr></thead>
              <tbody>
                {ledger.map(r => (
                  <tr key={r.id}>
                    <td>{fmtDate(r.date)}</td>
                    <td><Badge color={r.direction === "income" ? "green" : "red"} size="sm">{r.direction === "income" ? "Kirim" : "Chiqim"}</Badge></td>
                    <td>{r.category}</td>
                    <td style={{ fontWeight: 650 }}>{fmtUZS(r.amountUzs)}</td>
                    <td>{r.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}

window.CustomerDetailPage = CustomerDetailPage;
