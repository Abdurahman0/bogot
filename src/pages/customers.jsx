/* pages/customers.jsx */
const { useState: cuS, useMemo: cuM } = React;
const customerTuman = (customer) => customer?.district || "";
const customerMahalla = (customer) => customer?.mahalla || "";
const customerLocationLabel = (customer) => [customerTuman(customer), customerMahalla(customer)].filter(Boolean).join(" / ") || "Kiritilmagan";
const customerLocations = (locations) => locations || window.TUMAN_MAHALLA || {};
const customerDistrictOptions = (locations) => Object.keys(customerLocations(locations));
const mahallaOptionsFor = (district, locations) => customerLocations(locations)[district] || [];
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
const customerStatusTone = (customer) => {
  const key = String(customer?.statusName || customer?.status || "").toLowerCase();
  if (key.includes("inactive") || key.includes("lost") || key.includes("closed")) return "red";
  if (key.includes("pending") || key.includes("new")) return "amber";
  return "blue";
};

function CustomersPage() {
  const { data, t, nav, upsert, remove, toast } = useApp();
  const loading = useLoading(300);
  const [q, setQ] = cuS("");
  const [fDistrict, setFDistrict] = cuS("all");
  const [fStatus, setFStatus] = cuS("all");
  const [statusModalOpen, setStatusModalOpen] = cuS(false);
  const [statusForm, setStatusForm] = cuS({ name: "", slug: "", isDefault: false, sortOrder: (data.clientStatuses || []).length + 1 });
  const [viewCustomer, setViewCustomer] = cuS(null);
  const [editCustomer, setEditCustomer] = cuS(null);
  const [addOpen, setAddOpen] = cuS(false);
  const [deleteCustomer, setDeleteCustomer] = cuS(null);
  const districts = customerDistrictOptions(data.locations);
  const statusOptions = [{ value: "all", label: "Barcha holatlar" }, ...(data.clientStatuses || []).map((status) => ({ value: status.id, label: localizeCustomerStatusName(status.name) }))];
  const defaultClientStatus = localizeCustomerStatusName((data.clientStatuses || []).find((status) => status.isDefault)?.name);

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
    { key: "status", label: "Holat", render: r => <Badge color={customerStatusTone(r)} size="sm">{localizeCustomerStatusName(r.statusName || r.status)}</Badge> },
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

  const openStatusCreate = () => {
    setStatusForm({
      name: "",
      slug: "",
      isDefault: false,
      sortOrder: (data.clientStatuses || []).length + 1,
    });
    setStatusModalOpen(true);
  };

  const setStatusField = (key, value) => setStatusForm((current) => ({ ...current, [key]: value }));

  const saveStatus = async () => {
    if (!statusForm.name.trim()) return;
    await upsert("clientStatuses", {
      name: statusForm.name.trim(),
      slug: (statusForm.slug || "").trim(),
      isDefault: !!statusForm.isDefault,
      sortOrder: Number(statusForm.sortOrder || 0),
    });
    toast("Yangi holat qo'shildi");
    setStatusModalOpen(false);
  };

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.customers")} desc={`${data.customers.length} ta mijoz`} crumbs={[{ label: "CRM" }, { label: t("page.customers") }]}
        actions={<>
          <ExportDropdown label="Hisobot" size="sm" filename="mijozlar" rows={filtered} mapper={c => ({
            Ism: c.fullName,
            Telefon: c.phone,
            Tuman: customerTuman(c),
            Mahalla: customerMahalla(c),
            "Tizim (kW)": c.currentSystemKw,
            "Qoldiq qarz": c.debtBalanceUzs,
          })} />
          <Button variant="soft" size="sm" icon={<I.flag size={15} />} onClick={openStatusCreate}>Yangi holat</Button>
          <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setAddOpen(true)}>Yangi mijoz</Button>
        </>} />
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
      <CustomerStatusModal
        open={statusModalOpen}
        onClose={() => setStatusModalOpen(false)}
        onSave={saveStatus}
        form={statusForm}
        setField={setStatusField}
        statuses={data.clientStatuses || []}
        defaultClientStatus={defaultClientStatus}
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
        details={deleteCustomer ? `Telefon: ${deleteCustomer.phone}\nHudud: ${customerLocationLabel(deleteCustomer)}` : ""}
        confirmLabel="O'chirish"
        danger
      />
    </div>
  );
}
window.CustomersPage = CustomersPage;

function CustomerStatusModal({ open, onClose, onSave, form, setField, statuses, defaultClientStatus }) {
  return (
    <Modal open={open} onClose={onClose} title="Yangi holat" icon={<I.flag size={18} />} width={520}
      footer={<><Button variant="ghost" onClick={onClose}>Bekor qilish</Button><Button variant="primary" onClick={onSave}>Saqlash</Button></>}>
      <div style={{ display: "grid", gap: 16 }}>
        <Card style={{ padding: 14, background: "linear-gradient(135deg, rgba(20,184,166,.08), rgba(59,130,246,.08))", border: "1px solid rgba(20,184,166,.18)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 4 }}>Joriy asosiy holat</div>
              <div style={{ fontSize: 16, fontWeight: 760 }}>{localizeCustomerStatusName(defaultClientStatus)}</div>
            </div>
            <Badge color="teal" size="sm">{statuses.length} ta holat</Badge>
          </div>
        </Card>
        <Field label="Holat nomi" required><Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="Masalan, Faol mijoz" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 14 }}>
          <Field label="Qisqa nom"><Input value={form.slug} onChange={e => setField("slug", e.target.value)} placeholder="ixtiyoriy" /></Field>
          <Field label="Tartib"><Input type="number" value={form.sortOrder} onChange={e => setField("sortOrder", Number(e.target.value || 0))} /></Field>
        </div>
        <Field label="Asosiy holat"><Toggle checked={!!form.isDefault} onChange={value => setField("isDefault", value)} /></Field>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {statuses.map((status) => (
            <Badge key={status.id} color={status.isDefault ? "green" : "slate"} size="sm">
              {localizeCustomerStatusName(status.name)}
            </Badge>
          ))}
          {!statuses.length && <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>Hali holatlar yo'q</span>}
        </div>
      </div>
    </Modal>
  );
}

function CustomerViewModal({ open, onClose, onEdit, onDelete, customer }) {
  if (!customer) return null;
  return (
    <Modal open={open} onClose={onClose} title="Mijoz ma'lumotlari" icon={<I.users size={18} />} width={520}
      footer={<>
        <Button variant="ghost" icon={<I.edit size={15} />} onClick={onEdit}>Tahrirlash</Button>
        <Button variant="danger" icon={<I.trash size={15} />} onClick={onDelete}>O'chirish</Button>
        <Button variant="primary" onClick={onClose}>Yopish</Button>
      </>}>
      <div className="tg-meta">
        <div className="tg-meta-row"><span className="tg-meta-k">Mijoz</span><span className="tg-meta-v">{customer.fullName}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Telefon</span><span className="tg-meta-v">{customer.phone}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Tuman</span><span className="tg-meta-v">{customerTuman(customer)}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Mahalla</span><span className="tg-meta-v">{customerMahalla(customer) || "Kiritilmagan"}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Manzil</span><span className="tg-meta-v">{customer.address}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Tizim</span><span className="tg-meta-v">{customer.currentSystemKw} kW</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">To'lov turi</span><span className="tg-meta-v">{customer.paymentTypeLabel}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Tushgan summa</span><span className="tg-meta-v">{fmtUZS(customer.totalSpent)}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Qoldiq qarz</span><span className="tg-meta-v">{fmtUZS(customer.debtBalanceUzs)}</span></div>
      </div>
    </Modal>
  );
}

function CustomerFormModal({ open, onClose, onSave, initial, locations }) {
  const { data } = useApp();
  const districts = customerDistrictOptions(locations);
  const statusOptions = (data.clientStatuses || []).map((status) => ({ value: status.id, label: localizeCustomerStatusName(status.name) }));
  const defaultStatus = (data.clientStatuses || []).find((status) => status.isDefault) || data.clientStatuses?.[0] || null;
  const defaultDistrict = districts[0] || "";
  const defaultMahalla = mahallaOptionsFor(defaultDistrict, locations)[0] || "";
  const blank = {
    fullName: "",
    phone: "+998 ",
    district: defaultDistrict,
    mahalla: defaultMahalla,
    address: `${defaultDistrict} tumani`,
    currentSystemKw: 10,
    paymentType: "cash",
    statusId: defaultStatus?.id || null,
    statusName: defaultStatus?.name || "",
    totalSpent: 0,
    debtBalanceUzs: 0,
    notes: "",
  };
  const normalizeLocation = (item) => {
    const district = item?.district || defaultDistrict;
    const mahalla = item?.mahalla || mahallaOptionsFor(district, locations)[0] || "";
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
  const districtMahallas = mahallaOptionsFor(form.district, locations);
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Mijozni tahrirlash" : "Yangi mijoz"} icon={<I.user size={18} />} width={540}
      footer={<><Button variant="ghost" onClick={onClose}>Bekor qilish</Button><Button variant="primary" onClick={save}>Saqlash</Button></>}>
      <div style={{ display: "grid", gap: 14 }}>
        <Field label="To'liq ism" required><Input value={form.fullName} onChange={e => set("fullName", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Telefon"><Input value={form.phone} onChange={e => set("phone", e.target.value)} /></Field>
          <Field label="Tuman"><Select value={form.district} onChange={v => setForm(f => ({ ...f, district: v, mahalla: mahallaOptionsFor(v, locations)[0] || "" }))} options={districts.map(d => ({ value: d, label: d }))} /></Field>
        </div>
        <Field label="Mahalla"><Select value={form.mahalla} onChange={v => set("mahalla", v)} options={districtMahallas.map(m => ({ value: m, label: m }))} /></Field>
        <Field label="Manzil"><Input value={form.address} onChange={e => set("address", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Tizim quvvati (kW)"><Input type="number" value={form.currentSystemKw} onChange={e => set("currentSystemKw", e.target.value)} /></Field>
          <Field label="To'lov turi"><Select value={form.paymentType} onChange={v => set("paymentType", v)} options={PAYMENT_TYPES.map(v => ({ value: v, label: PAYMENT_TYPE_UZ[v] }))} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Tushgan summa"><Input type="number" value={form.totalSpent} onChange={e => set("totalSpent", e.target.value)} /></Field>
          <Field label="Qoldiq qarz"><Input type="number" value={form.debtBalanceUzs} onChange={e => set("debtBalanceUzs", e.target.value)} /></Field>
        </div>
        <Field label="Holat"><Select value={form.statusId || ""} onChange={v => set("statusId", v)} options={statusOptions.map((status) => ({ value: status.value, label: status.label }))} /></Field>
        <Field label="Eslatma"><Textarea rows={3} value={form.notes} onChange={e => set("notes", e.target.value)} /></Field>
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
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><h2 style={{ margin: 0, fontSize: 21, fontWeight: 720 }}>{c.fullName}</h2><Badge color={customerStatusTone(c)} size="sm">{localizeCustomerStatusName(c.statusName || c.status)}</Badge></div>
            <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", color: "var(--text-2)", fontSize: 13 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><I.phone size={14} />{c.phone}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><I.mapPin size={14} />{customerLocationLabel(c)}</span>
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
              <div className="tg-meta-row"><span className="tg-meta-k">Tuman</span><span className="tg-meta-v">{customerTuman(c)}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Mahalla</span><span className="tg-meta-v">{customerMahalla(c) || "Kiritilmagan"}</span></div>
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
