/* pages/leads.jsx */
const { useState: lS, useMemo: lM } = React;
const LEADS_UI = {
  uz: {
    colLead: "Lead", colSource: "Manba", colNeed: "Talab", colPayment: "To'lov",
    colStage: "Bosqich", colScore: "Ball", colAssigned: "Mas'ul", colFollowUp: "Qayta aloqa",
    unassigned: "Tayinlanmagan", newLead: "Yangi lead", emptyLeads: "Lead topilmadi",
    emptyMsg: "Filtrlarni o'zgartiring yoki yangi lead qo'shing",
    actions: "Amallar", view: "Ko'rish", edit: "Tahrirlash", delete: "O'chirish",
    toChat: "Chatga o'tish", toDebtors: "Debitorlar sahifasi",
    leadAdded: "Lead qo'shildi", leadUpdated: "Lead yangilandi", leadDeleted: "Lead o'chirildi",
    bulkAssigned: "ta lead tayinlandi", bulkStageUpdated: "ta lead bosqichi yangilandi",
    bulkDeleted: "ta lead o'chirildi",
    assignAction: "Tayinlash", stageAction: "Bosqich", deleteAction: "O'chirish",
    cancel: "Bekor qilish", save: "Saqlash",
    changeStage: "Bosqichni o'zgartirish",
    deleteLeadTitle: "Leadni o'chirish", deleteBulkTitle: "Leadlarni o'chirish",
    deleteBulkMsg: "ta tanlangan leadni o'chirmoqchimisiz?",
    deleteBulkDetails: "Tanlangan yozuvlar ro'yxatdan butunlay olib tashlanadi.",
    deleteAllConfirm: "Barchasini o'chirish",
    deleteConfirm: "O'chirish",
    detailsPhone: "Telefon:", detailsStage: "Bosqich:",
    viewTitle: "Lead ma'lumotlari", formNewTitle: "Yangi lead", formEditTitle: "Leadni tahrirlash",
    fieldFullName: "To'liq ism", fieldPhone: "Telefon", fieldSource: "Manba",
    fieldPower: "Talab quvvati (kW)", fieldProperty: "Obyekt turi",
    fieldPayment: "To'lov turi", fieldAssigned: "Mas'ul", fieldStage: "Bosqich",
    fieldPriority: "Muhimlik",
    viewLead: "Lead", viewPhone: "Telefon", viewSource: "Manba", viewNeed: "Talab",
    viewPayment: "To'lov", viewStage: "Bosqich", viewPriority: "Muhimlik",
    viewAssigned: "Mas'ul", viewValue: "Baholangan qiymat",
    descFormat: "ta lead • {0} ta yangi",
    crmCrumb: "CRM", selected: "tanlandi",
  },
  ru: {
    colLead: "Лид", colSource: "Источник", colNeed: "Потребность", colPayment: "Оплата",
    colStage: "Этап", colScore: "Балл", colAssigned: "Ответственный", colFollowUp: "Следующий контакт",
    unassigned: "Не назначен", newLead: "Новый лид", emptyLeads: "Лиды не найдены",
    emptyMsg: "Измените фильтры или добавьте новый лид",
    actions: "Действия", view: "Просмотр", edit: "Редактировать", delete: "Удалить",
    toChat: "Перейти в чат", toDebtors: "Страница должников",
    leadAdded: "Лид добавлен", leadUpdated: "Лид обновлён", leadDeleted: "Лид удалён",
    bulkAssigned: "лидов назначено", bulkStageUpdated: "этапов лидов обновлено",
    bulkDeleted: "лидов удалено",
    assignAction: "Назначить", stageAction: "Этап", deleteAction: "Удалить",
    cancel: "Отмена", save: "Сохранить",
    changeStage: "Изменить этап",
    deleteLeadTitle: "Удалить лид", deleteBulkTitle: "Удалить лиды",
    deleteBulkMsg: "выбранных лидов удалить?",
    deleteBulkDetails: "Выбранные записи будут полностью удалены из списка.",
    deleteAllConfirm: "Удалить всё",
    deleteConfirm: "Удалить",
    detailsPhone: "Телефон:", detailsStage: "Этап:",
    viewTitle: "Информация о лиде", formNewTitle: "Новый лид", formEditTitle: "Редактировать лид",
    fieldFullName: "Полное имя", fieldPhone: "Телефон", fieldSource: "Источник",
    fieldPower: "Мощность (кВт)", fieldProperty: "Тип объекта",
    fieldPayment: "Тип оплаты", fieldAssigned: "Ответственный", fieldStage: "Этап",
    fieldPriority: "Приоритет",
    viewLead: "Лид", viewPhone: "Телефон", viewSource: "Источник", viewNeed: "Потребность",
    viewPayment: "Оплата", viewStage: "Этап", viewPriority: "Приоритет",
    viewAssigned: "Ответственный", viewValue: "Ожидаемая стоимость",
    descFormat: "лидов • {0} новых",
    crmCrumb: "CRM", selected: "выбрано",
  },
  en: {
    colLead: "Lead", colSource: "Source", colNeed: "Need", colPayment: "Payment",
    colStage: "Stage", colScore: "Score", colAssigned: "Assigned", colFollowUp: "Follow-up",
    unassigned: "Unassigned", newLead: "New lead", emptyLeads: "No leads found",
    emptyMsg: "Change filters or add a new lead",
    actions: "Actions", view: "View", edit: "Edit", delete: "Delete",
    toChat: "Go to chat", toDebtors: "Debtors page",
    leadAdded: "Lead added", leadUpdated: "Lead updated", leadDeleted: "Lead deleted",
    bulkAssigned: "leads assigned", bulkStageUpdated: "lead stages updated",
    bulkDeleted: "leads deleted",
    assignAction: "Assign", stageAction: "Stage", deleteAction: "Delete",
    cancel: "Cancel", save: "Save",
    changeStage: "Change stage",
    deleteLeadTitle: "Delete lead", deleteBulkTitle: "Delete leads",
    deleteBulkMsg: "selected leads delete?",
    deleteBulkDetails: "Selected records will be permanently removed from the list.",
    deleteAllConfirm: "Delete all",
    deleteConfirm: "Delete",
    detailsPhone: "Phone:", detailsStage: "Stage:",
    viewTitle: "Lead info", formNewTitle: "New lead", formEditTitle: "Edit lead",
    fieldFullName: "Full name", fieldPhone: "Phone", fieldSource: "Source",
    fieldPower: "Required power (kW)", fieldProperty: "Property type",
    fieldPayment: "Payment type", fieldAssigned: "Assigned", fieldStage: "Stage",
    fieldPriority: "Priority",
    viewLead: "Lead", viewPhone: "Phone", viewSource: "Source", viewNeed: "Need",
    viewPayment: "Payment", viewStage: "Stage", viewPriority: "Priority",
    viewAssigned: "Assigned", viewValue: "Estimated value",
    descFormat: "leads • {0} new",
    crmCrumb: "CRM", selected: "selected",
  },
};
function ldLang() { return window.__TG_LANG || "uz"; }
function ldTx(key) { return LEADS_UI[ldLang()]?.[key] || LEADS_UI.uz[key] || key; }

function LeadsPage() {
  const { data, t, nav, toast, update, upsert, remove } = useApp();
  const canManage = canDo("clients.manage", data);
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
    { key: "name", label: ldTx("colLead"), sortVal: r => r.fullName, render: r => (
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name={r.fullName} size={34} />
        <div>
          <div className="tg-cell-strong">{r.fullName}</div>
          <div className="tg-cell-sub">{r.phone}</div>
        </div>
      </div>
    )},
    { key: "source", label: ldTx("colSource"), render: r => <div style={{ display: "flex", alignItems: "center", gap: 6 }}><SourceIcon source={r.source} />{SOURCE_UZ[r.source]}</div> },
    { key: "need", label: ldTx("colNeed"), sortVal: r => r.requiredPowerKw, render: r => <span>{r.requiredPowerKw} kW • {r.propertyType}</span> },
    { key: "payment", label: ldTx("colPayment"), render: r => <Badge color={r.paymentType === "credit" ? "amber" : "green"} size="sm">{r.paymentTypeLabel}</Badge> },
    { key: "pipelineStage", label: ldTx("colStage"), sortVal: r => r.pipelineStage, render: r => <StatusBadge status={r.pipelineStage} label={PIPELINE_STAGE_UZ[r.pipelineStage]} /> },
    { key: "score", label: ldTx("colScore"), sortVal: r => r.leadScore, render: r => <span style={{ fontWeight: 700, color: r.leadScore > 70 ? "var(--green)" : "var(--amber)" }}>{r.leadScore}</span> },
    { key: "assigned", label: ldTx("colAssigned"), render: r => {
      const u = ops.find(o => o.id === r.assignedUserId);
      return u ? <div style={{ display: "flex", alignItems: "center", gap: 7 }}><Avatar name={u.fullName} hue={u.avatarHue} size={26} /><span style={{ fontSize: 12.5 }}>{u.fullName.split(" ")[0]}</span></div> : <Badge color="amber" size="sm">{ldTx("unassigned")}</Badge>;
    } },
    { key: "follow", label: ldTx("colFollowUp"), sortVal: r => r.nextFollowUpAt || "", render: r => r.nextFollowUpAt ? <span style={{ fontSize: 12.5, color: new Date(r.nextFollowUpAt) < new Date() ? "var(--red)" : "var(--text-2)" }}>{fmtDate(r.nextFollowUpAt)}</span> : <span className="tg-cell-sub">—</span> },
    { key: "actions", label: "", width: 44, render: r => (
      <div onClick={e => e.stopPropagation()}>
        <Dropdown align="right" trigger={<IconButton icon={<I.dots size={17} />} label={ldTx("actions")} />} items={[
          { label: ldTx("view"), icon: <I.eye size={16} />, onClick: () => setViewLead(r) },
          { label: ldTx("edit"), icon: <I.edit size={16} />, onClick: () => setEditLead(r) },
          { label: ldTx("toChat"), icon: <I.message size={16} />, onClick: () => nav("/inbox") },
          { label: ldTx("toDebtors"), icon: <I.wallet size={16} />, onClick: () => nav("/debtors") },
          { divider: true },
          { label: ldTx("delete"), icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteLead(r) },
        ]} />
      </div>
    ) },
  ];

  const bulkAssign = (uid) => {
    update("leads", ls => ls.map(l => selected.includes(l.id) ? { ...l, assignedUserId: uid } : l));
    toast(selected.length + " " + ldTx("bulkAssigned"));
    setSelected([]);
  };
  const bulkSetStatus = (stage) => {
    update("leads", ls => ls.map(l => selected.includes(l.id) ? { ...l, pipelineStage: stage } : l));
    toast(selected.length + " " + ldTx("bulkStageUpdated"));
    setSelected([]);
    setBulkStatus(false);
  };

  return (
    <div className="page fade-in">
      <PageHeader
        title={t("page.leads")}
        desc={`${data.leads.length} ${ldTx("descFormat").replace("{0}", data.leads.filter(l => l.pipelineStage === "greeted").length)}`}
        crumbs={[{ label: ldTx("crmCrumb") }, { label: t("page.leads") }]}
        actions={<Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setAddOpen(true)}>{ldTx("newLead")}</Button>}
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
          <span><strong>{selected.length}</strong> {ldTx("selected")}</span>
          <Dropdown align="left" direction="up" width={220} trigger={<Button variant="default" size="sm" icon={<I.user size={15} />}>{ldTx("assignAction")} <I.chevDown size={13} /></Button>}
            items={ops.map(o => ({ label: o.fullName, icon: <Avatar name={o.fullName} hue={o.avatarHue} size={22} />, onClick: () => bulkAssign(o.id) }))} />
          <Button variant="default" size="sm" icon={<I.flag size={15} />} onClick={() => setBulkStatus(true)}>{ldTx("stageAction")}</Button>
          <Button variant="danger" size="sm" icon={<I.trash size={15} />} onClick={() => setBulkDeleteOpen(true)}>{ldTx("deleteAction")}</Button>
          <button className="tg-link" onClick={() => setSelected([])}>{ldTx("cancel")}</button>
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
            emptyState={<EmptyState icon={<I.target size={26} />} title={ldTx("emptyLeads")} message={ldTx("emptyMsg")} action={<Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setAddOpen(true)}>{ldTx("newLead")}</Button>} />}
          />
        )}
      </Card>

      <LeadFormModal open={addOpen} onClose={() => setAddOpen(false)} onSave={(lead) => { upsert("leads", lead); toast(ldTx("leadAdded")); }} ops={ops} />
      <LeadViewModal
        open={!!viewLead}
        onClose={() => setViewLead(null)}
        onEdit={canManage ? () => { setEditLead(viewLead); setViewLead(null); } : undefined}
        onDelete={canManage ? () => { setDeleteLead(viewLead); setViewLead(null); } : undefined}
        lead={viewLead}
        ops={ops}
      />
      <LeadFormModal open={!!editLead} onClose={() => setEditLead(null)} initial={editLead} onSave={(lead) => { upsert("leads", lead); toast(ldTx("leadUpdated")); setEditLead(null); }} ops={ops} />
      <Modal open={bulkStatus} onClose={() => setBulkStatus(false)} title={ldTx("changeStage")} width={360}>
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
        onConfirm={() => { remove("leads", deleteLead.id); toast(ldTx("leadDeleted")); }}
        title={ldTx("deleteLeadTitle")}
        message={`"${deleteLead?.fullName || ""}" yozuvini o'chirmoqchimisiz?`}
        details={deleteLead ? `${ldTx("detailsPhone")} ${deleteLead.phone}\n${ldTx("detailsStage")} ${PIPELINE_STAGE_UZ[deleteLead.pipelineStage]}` : ""}
        confirmLabel={ldTx("deleteConfirm")}
        danger
      />
      <ConfirmDialog
        open={bulkDeleteOpen}
        onClose={() => setBulkDeleteOpen(false)}
        onConfirm={() => { selected.forEach(id => remove("leads", id)); toast(selected.length + " " + ldTx("bulkDeleted")); setSelected([]); }}
        title={ldTx("deleteBulkTitle")}
        message={`${selected.length} ${ldTx("deleteBulkMsg")}`}
        details={ldTx("deleteBulkDetails")}
        confirmLabel={ldTx("deleteAllConfirm")}
        danger
      />
    </div>
  );
}

function LeadViewModal({ open, onClose, onEdit, onDelete, lead, ops }) {
  if (!lead) return null;
  const assignee = ops.find(o => o.id === lead.assignedUserId);
  return (
    <Modal open={open} onClose={onClose} title={ldTx("viewTitle")} icon={<I.target size={18} />} width={520}
      footer={<>
        {onEdit && <Button variant="ghost" icon={<I.edit size={15} />} onClick={onEdit}>{ldTx("edit")}</Button>}
        {onDelete && <Button variant="danger" icon={<I.trash size={15} />} onClick={onDelete}>{ldTx("delete")}</Button>}
        <Button variant="primary" onClick={onClose}>{window.TRANSLATIONS?.[window.__TG_LANG || "uz"]?.["common.close"] || "Yopish"}</Button>
      </>}>
      <div className="tg-meta">
        <div className="tg-meta-row"><span className="tg-meta-k">{ldTx("viewLead")}</span><span className="tg-meta-v">{lead.fullName}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{ldTx("viewPhone")}</span><span className="tg-meta-v">{lead.phone}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{ldTx("viewSource")}</span><span className="tg-meta-v">{SOURCE_UZ[lead.source]}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{ldTx("viewNeed")}</span><span className="tg-meta-v">{lead.requiredPowerKw} kW • {lead.propertyType}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{ldTx("viewPayment")}</span><span className="tg-meta-v">{lead.paymentTypeLabel}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{ldTx("viewStage")}</span><span className="tg-meta-v">{PIPELINE_STAGE_UZ[lead.pipelineStage]}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{ldTx("viewPriority")}</span><span className="tg-meta-v">{lead.priority}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{ldTx("viewAssigned")}</span><span className="tg-meta-v">{assignee ? assignee.fullName : ldTx("unassigned")}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{ldTx("viewValue")}</span><span className="tg-meta-v">{fmtUZS(lead.estimatedValue)}</span></div>
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
    <Modal open={open} onClose={onClose} title={initial ? ldTx("formEditTitle") : ldTx("formNewTitle")} icon={<I.target size={18} />} width={520}
      footer={<><Button variant="ghost" onClick={onClose}>{ldTx("cancel")}</Button><Button variant="primary" onClick={save}>{ldTx("save")}</Button></>}>
      <div style={{ display: "grid", gap: 14 }}>
        <Field label={ldTx("fieldFullName")} required><Input value={form.fullName} onChange={e => set("fullName", e.target.value)} placeholder="Aziz Karimov" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label={ldTx("fieldPhone")}><Input value={form.phone} onChange={e => set("phone", e.target.value)} /></Field>
          <Field label={ldTx("fieldSource")}><Select value={form.source} onChange={v => set("source", v)} options={SOURCES.map(s => ({ value: s, label: SOURCE_UZ[s] }))} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label={ldTx("fieldPower")}><Input type="number" value={form.requiredPowerKw} onChange={e => set("requiredPowerKw", +e.target.value)} /></Field>
          <Field label={ldTx("fieldProperty")}><Select value={form.propertyType} onChange={v => set("propertyType", v)} options={["Hovli", "Ofis", "Do'kon", "Ferma", "Ombor"].map(v => ({ value: v, label: v }))} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label={ldTx("fieldPayment")}><Select value={form.paymentType} onChange={v => set("paymentType", v)} options={PAYMENT_TYPES.map(v => ({ value: v, label: PAYMENT_TYPE_UZ[v] }))} /></Field>
          <Field label={ldTx("fieldAssigned")}><Select value={form.assignedUserId} onChange={v => set("assignedUserId", v)} options={[{ value: "", label: ldTx("unassigned") }, ...ops.map(o => ({ value: o.id, label: o.fullName }))]} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label={ldTx("fieldStage")}><Select value={form.pipelineStage} onChange={v => set("pipelineStage", v)} options={PIPELINE_STAGES.map(s => ({ value: s, label: PIPELINE_STAGE_UZ[s] }))} /></Field>
          <Field label={ldTx("fieldPriority")}><Select value={form.priority} onChange={v => set("priority", v)} options={["low", "medium", "high", "urgent"].map(p => ({ value: p, label: t("priority." + p) }))} /></Field>
        </div>
      </div>
    </Modal>
  );
}

window.LeadViewModal = LeadViewModal;
window.LeadFormModal = LeadFormModal;
window.LeadsPage = LeadsPage;
