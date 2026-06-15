/* pages/leads.jsx */
const { useState: lS, useMemo: lM } = React;

function LeadsPage() {
  const { data, t, nav, toast, update, upsert, remove } = useApp();
  const loading = useLoading(300);
  const [q, setQ] = lS("");
  const [fSource, setFSource] = lS([]);
  const [fStatus, setFStatus] = lS([]);
  const [fPriority, setFPriority] = lS([]);
  const [fAssigned, setFAssigned] = lS("all");
  const [selected, setSelected] = lS([]);
  const [addOpen, setAddOpen] = lS(false);
  const [bulkStatus, setBulkStatus] = lS(false);
  const [viewLead, setViewLead] = lS(null);
  const [editLead, setEditLead] = lS(null);
  const [deleteLead, setDeleteLead] = lS(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = lS(false);

  const ops = data.users.filter(u => u.role === "operator" || u.role === "manager");
  const filtered = lM(() => data.leads.filter(l => {
    const s = q.toLowerCase();
    if (q && !l.fullName.toLowerCase().includes(s) && !l.phone.includes(q) && !(l.username || "").toLowerCase().includes(s) && !l.id.toLowerCase().includes(s)) return false;
    if (fSource.length && !fSource.includes(l.source)) return false;
    if (fStatus.length && !fStatus.includes(l.pipelineStage)) return false;
    if (fPriority.length && !fPriority.includes(l.priority)) return false;
    if (fAssigned !== "all" && l.assignedUserId !== fAssigned) return false;
    return true;
  }), [data.leads, q, fSource, fStatus, fPriority, fAssigned]);

  const columns = [
    { key: "name", label: "Lead", sortVal: r => r.fullName, render: r => (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={r.fullName} size={34} />
        <div>
          <div className="tg-cell-strong">{r.fullName}</div>
          <div className="tg-cell-sub">{r.phone}</div>
        </div>
      </div>
    )},
    { key: "source", label: "Manba", render: r => <div style={{ display: "flex", alignItems: "center", gap: 6 }}><SourceIcon source={r.source} />{SOURCE_UZ[r.source]}</div> },
    { key: "need", label: "Talab", sortVal: r => r.requiredPowerKw, render: r => <span>{r.requiredPowerKw} kW • {r.propertyType}</span> },
    { key: "payment", label: "To'lov", render: r => <Badge color={r.paymentType === "credit" ? "amber" : "green"} size="sm">{r.paymentTypeLabel}</Badge> },
    { key: "pipelineStage", label: "Bosqich", sortVal: r => r.pipelineStage, render: r => <StatusBadge status={r.pipelineStage} label={PIPELINE_STAGE_UZ[r.pipelineStage]} /> },
    { key: "score", label: "Ball", sortVal: r => r.leadScore, render: r => <span style={{ fontWeight: 700, color: r.leadScore > 70 ? "var(--green)" : "var(--amber)" }}>{r.leadScore}</span> },
    { key: "assigned", label: "Mas'ul", render: r => {
      const u = ops.find(o => o.id === r.assignedUserId);
      return u ? <div style={{ display: "flex", alignItems: "center", gap: 7 }}><Avatar name={u.fullName} hue={u.avatarHue} size={26} /><span style={{ fontSize: 12.5 }}>{u.fullName.split(" ")[0]}</span></div> : <Badge color="amber" size="sm">Tayinlanmagan</Badge>;
    } },
    { key: "follow", label: "Qayta aloqa", sortVal: r => r.nextFollowUpAt || "", render: r => r.nextFollowUpAt ? <span style={{ fontSize: 12.5, color: new Date(r.nextFollowUpAt) < new Date() ? "var(--red)" : "var(--text-2)" }}>{fmtDate(r.nextFollowUpAt)}</span> : <span className="tg-cell-sub">—</span> },
    { key: "actions", label: "", width: 44, render: r => (
      <div onClick={e => e.stopPropagation()}>
        <Dropdown align="right" trigger={<IconButton icon={<I.dots size={17} />} label="Amallar" />} items={[
          { label: "Ko'rish", icon: <I.eye size={16} />, onClick: () => setViewLead(r) },
          { label: "Tahrirlash", icon: <I.edit size={16} />, onClick: () => setEditLead(r) },
          { label: "Chatga o'tish", icon: <I.message size={16} />, onClick: () => nav("/inbox") },
          { label: "Debitorlar sahifasi", icon: <I.wallet size={16} />, onClick: () => nav("/debtors") },
          { divider: true },
          { label: "O'chirish", icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteLead(r) },
        ]} />
      </div>
    ) },
  ];

  const bulkAssign = (uid) => {
    update("leads", ls => ls.map(l => selected.includes(l.id) ? { ...l, assignedUserId: uid } : l));
    toast(selected.length + " ta lead tayinlandi");
    setSelected([]);
  };
  const bulkSetStatus = (stage) => {
    update("leads", ls => ls.map(l => selected.includes(l.id) ? { ...l, pipelineStage: stage } : l));
    toast(selected.length + " ta lead bosqichi yangilandi");
    setSelected([]);
    setBulkStatus(false);
  };

  return (
    <div className="page fade-in">
      <PageHeader
        title={t("page.leads")}
        desc={`${data.leads.length} ta lead • ${data.leads.filter(l => l.pipelineStage === "greeted").length} ta yangi`}
        crumbs={[{ label: "CRM" }, { label: t("page.leads") }]}
        actions={<>
          <ExportDropdown label="Hisobot" size="sm" filename="leadlar" rows={filtered} mapper={l => ({
            ID: l.id,
            Ism: l.fullName,
            Telefon: l.phone,
            Manba: SOURCE_UZ[l.source],
            "Talab (kW)": l.requiredPowerKw,
            "To'lov turi": l.paymentTypeLabel,
            Bosqich: PIPELINE_STAGE_UZ[l.pipelineStage],
          })} />
          <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setAddOpen(true)}>Yangi lead</Button>
        </>}
      />

      <div className="toolbar">
        <SearchInput value={q} onChange={setQ} placeholder="Ism, telefon, username, ID..." width={280} />
        <FilterSelect label="Manba" icon="funnel" multi value={fSource} onChange={setFSource} options={SOURCES.map(s => ({ value: s, label: SOURCE_UZ[s] }))} />
        <FilterSelect label="Bosqich" icon="flag" multi value={fStatus} onChange={setFStatus} options={PIPELINE_STAGES.map(s => ({ value: s, label: PIPELINE_STAGE_UZ[s] }))} />
        <FilterSelect label="Muhimlik" icon="fire" multi value={fPriority} onChange={setFPriority} options={["low", "medium", "high", "urgent"].map(p => ({ value: p, label: t("priority." + p) }))} />
        <FilterSelect label="Mas'ul" icon="user" value={fAssigned} onChange={setFAssigned} options={ops.map(o => ({ value: o.id, label: o.fullName }))} />
        <div className="toolbar-spacer" />
        <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{filtered.length} natija</span>
      </div>

      {selected.length > 0 && (
        <div className="tg-bulkbar">
          <span><strong>{selected.length}</strong> tanlandi</span>
          <Dropdown align="left" direction="up" width={220} trigger={<Button variant="default" size="sm" icon={<I.user size={15} />}>Tayinlash <I.chevDown size={13} /></Button>}
            items={ops.map(o => ({ label: o.fullName, icon: <Avatar name={o.fullName} hue={o.avatarHue} size={22} />, onClick: () => bulkAssign(o.id) }))} />
          <Button variant="default" size="sm" icon={<I.flag size={15} />} onClick={() => setBulkStatus(true)}>Bosqich</Button>
          <Button variant="danger" size="sm" icon={<I.trash size={15} />} onClick={() => setBulkDeleteOpen(true)}>O'chirish</Button>
          <button className="tg-link" onClick={() => setSelected([])}>Bekor qilish</button>
        </div>
      )}

      <Card pad={false}>
        {loading ? <SkeletonRows rows={10} cols={7} /> : (
          <DataTable
            columns={columns}
            rows={filtered}
            selectable
            selected={selected}
            onSelect={setSelected}
            onRowClick={r => setViewLead(r)}
            pageSize={12}
            defaultSort={{ key: "score", dir: "desc" }}
            emptyState={<EmptyState icon={<I.target size={26} />} title="Lead topilmadi" message="Filtrlarni o'zgartiring yoki yangi lead qo'shing" action={<Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setAddOpen(true)}>Yangi lead</Button>} />}
          />
        )}
      </Card>

      <LeadFormModal open={addOpen} onClose={() => setAddOpen(false)} onSave={(lead) => { upsert("leads", lead); toast("Lead qo'shildi"); }} ops={ops} />
      <LeadViewModal
        open={!!viewLead}
        onClose={() => setViewLead(null)}
        onEdit={() => { setEditLead(viewLead); setViewLead(null); }}
        onDelete={() => { setDeleteLead(viewLead); setViewLead(null); }}
        lead={viewLead}
        ops={ops}
      />
      <LeadFormModal open={!!editLead} onClose={() => setEditLead(null)} initial={editLead} onSave={(lead) => { upsert("leads", lead); toast("Lead yangilandi"); setEditLead(null); }} ops={ops} />
      <Modal open={bulkStatus} onClose={() => setBulkStatus(false)} title="Bosqichni o'zgartirish" width={360}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {PIPELINE_STAGES.map(s => (
            <button key={s} className="tg-btn tg-btn-default" onClick={() => bulkSetStatus(s)} style={{ justifyContent: "flex-start", padding: "10px 14px", borderRadius: 10, width: "100%" }}>
              <StatusBadge status={s} label={PIPELINE_STAGE_UZ[s]} />
            </button>
          ))}
        </div>
      </Modal>
      <ConfirmDialog
        open={!!deleteLead}
        onClose={() => setDeleteLead(null)}
        onConfirm={() => { remove("leads", deleteLead.id); toast("Lead o'chirildi"); }}
        title="Leadni o'chirish"
        message={`"${deleteLead?.fullName || ""}" yozuvini o'chirmoqchimisiz?`}
        details={deleteLead ? `Telefon: ${deleteLead.phone}\nBosqich: ${PIPELINE_STAGE_UZ[deleteLead.pipelineStage]}` : ""}
        confirmLabel="O'chirish"
        danger
      />
      <ConfirmDialog
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={() => { selected.forEach(id => remove("leads", id)); toast(selected.length + " ta lead o'chirildi"); setSelected([]); }}
        title="Leadlarni o'chirish"
        message={`${selected.length} ta tanlangan leadni o'chirmoqchimisiz?`}
        details="Tanlangan yozuvlar ro'yxatdan butunlay olib tashlanadi."
        confirmLabel="Barchasini o'chirish"
        danger
      />
    </div>
  );
}

function LeadViewModal({ open, onClose, onEdit, onDelete, lead, ops }) {
  if (!lead) return null;
  const assignee = ops.find(o => o.id === lead.assignedUserId);
  return (
    <Modal open={open} onClose={onClose} title="Lead ma'lumotlari" icon={<I.target size={18} />} width={520}
      footer={<>
        <Button variant="ghost" icon={<I.edit size={15} />} onClick={onEdit}>Tahrirlash</Button>
        <Button variant="danger" icon={<I.trash size={15} />} onClick={onDelete}>O'chirish</Button>
        <Button variant="primary" onClick={onClose}>Yopish</Button>
      </>}>
      <div className="tg-meta">
        <div className="tg-meta-row"><span className="tg-meta-k">Lead</span><span className="tg-meta-v">{lead.fullName}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Telefon</span><span className="tg-meta-v">{lead.phone}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Manba</span><span className="tg-meta-v">{SOURCE_UZ[lead.source]}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Talab</span><span className="tg-meta-v">{lead.requiredPowerKw} kW • {lead.propertyType}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">To'lov</span><span className="tg-meta-v">{lead.paymentTypeLabel}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Bosqich</span><span className="tg-meta-v">{PIPELINE_STAGE_UZ[lead.pipelineStage]}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Muhimlik</span><span className="tg-meta-v">{lead.priority}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Mas'ul</span><span className="tg-meta-v">{assignee ? assignee.fullName : "Tayinlanmagan"}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">Baholangan qiymat</span><span className="tg-meta-v">{fmtUZS(lead.estimatedValue)}</span></div>
      </div>
    </Modal>
  );
}

function LeadFormModal({ open, onClose, onSave, ops, initial }) {
  const { t } = useApp();
  const [form, setForm] = lS(initial || {
    fullName: "",
    phone: "+998 ",
    source: "instagram",
    pipelineStage: "greeted",
    status: "contacted",
    priority: "medium",
    requiredPowerKw: 10,
    propertyType: "Hovli",
    paymentType: "cash",
    assignedUserId: "",
  });
  React.useEffect(() => {
    setForm(initial || {
      fullName: "",
      phone: "+998 ",
      source: "instagram",
      pipelineStage: "greeted",
      status: "contacted",
      priority: "medium",
      requiredPowerKw: 10,
      propertyType: "Hovli",
      paymentType: "cash",
      assignedUserId: "",
    });
  }, [initial, open]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = () => {
    if (!form.fullName.trim()) return;
    onSave(initial ? {
      ...initial,
      ...form,
      paymentTypeLabel: PAYMENT_TYPE_UZ[form.paymentType],
      username: form.source === "instagram" || form.source === "telegram" ? (initial.username || username()) : null,
      budgetMinUzs: form.requiredPowerKw * 8e6,
      budgetMaxUzs: Math.round(form.requiredPowerKw * 10.5e6),
      estimatedValue: Math.round(form.requiredPowerKw * 10.5e6),
      roofAreaM2: form.requiredPowerKw * 9,
      roomAreaM2: form.requiredPowerKw * 9,
      btu: form.requiredPowerKw * 1000,
      lastContactAt: new Date().toISOString(),
    } : {
      id: "L" + Math.floor(Math.random() * 9000 + 1000),
      ...form,
      paymentTypeLabel: PAYMENT_TYPE_UZ[form.paymentType],
      leadScore: 58,
      sentiment: "neutral",
      username: form.source === "instagram" || form.source === "telegram" ? username() : null,
      budgetMinUzs: form.requiredPowerKw * 8e6,
      budgetMaxUzs: Math.round(form.requiredPowerKw * 10.5e6),
      preferredBrands: [],
      requestedFeatures: [],
      selectedProductIds: [],
      recommendedProductIds: [],
      notes: [],
      tags: [],
      hasUnread: false,
      lastContactAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      estimatedValue: Math.round(form.requiredPowerKw * 10.5e6),
      roofAreaM2: form.requiredPowerKw * 9,
      roomAreaM2: form.requiredPowerKw * 9,
      btu: form.requiredPowerKw * 1000,
    });
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={initial ? "Leadni tahrirlash" : "Yangi lead"} icon={<I.target size={18} />} width={520}
      footer={<><Button variant="ghost" onClick={onClose}>Bekor qilish</Button><Button variant="primary" onClick={save}>Saqlash</Button></>}>
      <div style={{ display: "grid", gap: 14 }}>
        <Field label="To'liq ism" required><Input value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Aziz Karimov" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Telefon"><Input value={form.phone} onChange={e => set("phone", e.target.value)} /></Field>
          <Field label="Manba"><Select value={form.source} onChange={v => set("source", v)} options={SOURCES.map(s => ({ value: s, label: SOURCE_UZ[s] }))} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Talab quvvati (kW)"><Input type="number" value={form.requiredPowerKw} onChange={e => set("requiredPowerKw", +e.target.value)} /></Field>
          <Field label="Obyekt turi"><Select value={form.propertyType} onChange={v => set("propertyType", v)} options={["Hovli", "Ofis", "Do'kon", "Ferma", "Ombor"].map(v => ({ value: v, label: v }))} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="To'lov turi"><Select value={form.paymentType} onChange={v => set("paymentType", v)} options={PAYMENT_TYPES.map(v => ({ value: v, label: PAYMENT_TYPE_UZ[v] }))} /></Field>
          <Field label="Mas'ul"><Select value={form.assignedUserId} onChange={v => set("assignedUserId", v)} options={[{ value: "", label: "Tayinlanmagan" }, ...ops.map(o => ({ value: o.id, label: o.fullName }))]} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Bosqich"><Select value={form.pipelineStage} onChange={v => set("pipelineStage", v)} options={PIPELINE_STAGES.map(s => ({ value: s, label: PIPELINE_STAGE_UZ[s] }))} /></Field>
          <Field label="Muhimlik"><Select value={form.priority} onChange={v => set("priority", v)} options={["low", "medium", "high", "urgent"].map(p => ({ value: p, label: t("priority." + p) }))} /></Field>
        </div>
      </div>
    </Modal>
  );
}

window.LeadViewModal = LeadViewModal;
window.LeadFormModal = LeadFormModal;
window.LeadsPage = LeadsPage;
