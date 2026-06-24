/* pages/pipeline.jsx */
const { useState: piS, useMemo: piM, useCallback: piC, useEffect: piE, useRef: piR } = React;
const PIPELINE_UI = {
  uz: {
    deleteTitle: "O'chirish", noLeads: "Lead yo'q",
    totalLeads: "Jami leadlar", pipelineValue: "Jarayon qiymati",
    conversion: "Konversiya", overdueTask: "Muddati o'tgan task",
    allPriority: "Barcha prioritet", urgent: "Shoshilinch", high: "Yuqori", medium: "O'rta", low: "Past",
    leadUpdated: "Lead bosqichi yangilandi", leadDeleted: "Lead o'chirildi",
    deleteLeadTitle: "Leadni o'chirish", deleteConfirm: "O'chirish",
    detailsPhone: "Telefon:", detailsStage: "Bosqich:",
    desc: "Lidlarni tijoriy taklif va yopilish bosqichlari bo'yicha boshqarish",
    crmCrumb: "CRM",
  },
  ru: {
    deleteTitle: "Удалить", noLeads: "Нет лидов",
    totalLeads: "Всего лидов", pipelineValue: "Стоимость воронки",
    conversion: "Конверсия", overdueTask: "Просроченные задачи",
    allPriority: "Все приоритеты", urgent: "Срочно", high: "Высокий", medium: "Средний", low: "Низкий",
    leadUpdated: "Этап лида обновлён", leadDeleted: "Лид удалён",
    deleteLeadTitle: "Удалить лид", deleteConfirm: "Удалить",
    detailsPhone: "Телефон:", detailsStage: "Этап:",
    desc: "Управление лидами по этапам продаж и закрытия",
    crmCrumb: "CRM",
  },
  en: {
    deleteTitle: "Delete", noLeads: "No leads",
    totalLeads: "Total leads", pipelineValue: "Pipeline value",
    conversion: "Conversion", overdueTask: "Overdue tasks",
    allPriority: "All priorities", urgent: "Urgent", high: "High", medium: "Medium", low: "Low",
    leadUpdated: "Lead stage updated", leadDeleted: "Lead deleted",
    deleteLeadTitle: "Delete lead", deleteConfirm: "Delete",
    detailsPhone: "Phone:", detailsStage: "Stage:",
    desc: "Manage leads by commercial proposal and closing stages",
    crmCrumb: "CRM",
  },
};
function plLang() { return window.__TG_LANG || "uz"; }
function plTx(key) { return PIPELINE_UI[plLang()]?.[key] || PIPELINE_UI.uz[key] || key; }

const STAGE_CFG = {
  greeted: { color: "#6366f1", bg: "#eef2ff", icon: "zap" },
  need_identified: { color: "#7c3aed", bg: "#f5f3ff", icon: "target" },
  info_collected: { color: "#0891b2", bg: "#ecfeff", icon: "doc" },
  ready_to_order: { color: "#0d9488", bg: "#f0fdfa", icon: "wallet" },
  completed: { color: "#059669", bg: "#f0fdf4", icon: "checkCircle" },
  cancelled: { color: "#dc2626", bg: "#fef2f2", icon: "x" },
};

function moveLeadInList(leads, dragId, targetStage, targetIndex) {
  const dragged = leads.find((lead) => lead.id === dragId);
  if (!dragged) return leads;

  const nextLead = { ...dragged, pipelineStage: targetStage };
  const remaining = leads.filter((lead) => lead.id !== dragId);
  const stageRows = remaining
    .map((lead, index) => ({ lead, index }))
    .filter((row) => row.lead.pipelineStage === targetStage);

  let insertAt = remaining.length;
  if (stageRows.length) {
    if (targetIndex <= 0) insertAt = stageRows[0].index;
    else if (targetIndex >= stageRows.length) insertAt = stageRows[stageRows.length - 1].index + 1;
    else insertAt = stageRows[targetIndex].index;
  }

  const next = [...remaining];
  next.splice(insertAt, 0, nextLead);
  return next;
}

function PipelineCardBody({ lead, cfg, t, onDelete, interactive = true }) {
  return (
    <>
      <div className="pk-card-tags">
        <span className="pk-tag-pill" style={{ background: cfg.bg, color: cfg.color }}>{SOURCE_UZ[lead.source]}</span>
      </div>
      <div className="pk-card-title">{lead.fullName}</div>
      <div className="pk-card-desc">{lead.requiredPowerKw} kW • {lead.propertyType} • {lead.paymentTypeLabel}</div>
      <div className="pk-card-footer">
        <span className="pk-prio-badge">{t("priority." + lead.priority)}</span>
        {lead.nextFollowUpAt && <span className="pk-card-date"><I.calendar size={11} />{fmtDate(lead.nextFollowUpAt)}</span>}
        <div className="pk-footer-spacer" />
        {interactive && (
          <button className="pk-card-del" title={plTx("deleteTitle")} onClick={onDelete}>
            <I.trash size={12} />
          </button>
        )}
      </div>
    </>
  );
}

function getDropTarget(clientX, clientY, dragId) {
  const el = document.elementFromPoint(clientX, clientY);
  const col = el && el.closest ? el.closest("[data-pk-stage]") : null;
  if (!col) return null;

  const stage = col.dataset.pkStage;
  const cards = Array.from(col.querySelectorAll(".pk-card[data-pk-id]"))
    .filter((card) => card.dataset.pkId !== dragId);

  let index = cards.length;
  for (let i = 0; i < cards.length; i++) {
    const rect = cards[i].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) {
      index = i;
      break;
    }
  }

  return { stage, index };
}

function PipelinePage() {
  const { data, t, toast, update, upsert, remove } = useApp();
  const [q, setQ] = piS("");
  const [prioFilter, setPrioFilter] = piS("all");
  const [dragState, setDragState] = piS(null);
  const [viewLead, setViewLead] = piS(null);
  const [editLead, setEditLead] = piS(null);
  const [deleteLead, setDeleteLead] = piS(null);
  const pendingRef = piR(null);
  const suppressClickRef = piR(false);
  const ops = data.users.filter(u => u.role === "operator" || u.role === "manager");

  const leadsByStage = piM(() => {
    const map = Object.fromEntries(PIPELINE_STAGES.map((stage) => [stage, []]));
    data.leads
      .filter((lead) => (!q || lead.fullName.toLowerCase().includes(q.toLowerCase()) || lead.phone.includes(q)) && (prioFilter === "all" || lead.priority === prioFilter))
      .forEach((lead) => map[lead.pipelineStage].push(lead));
    return map;
  }, [data.leads, q, prioFilter]);

  const dragLead = piM(() => {
    if (!dragState) return null;
    return data.leads.find((lead) => lead.id === dragState.id) || null;
  }, [data.leads, dragState]);

  const pipelineVal = data.leads.filter((lead) => !["completed", "cancelled"].includes(lead.pipelineStage)).reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0);
  const convRate = data.leads.length ? Math.round((data.leads.filter((lead) => lead.pipelineStage === "completed").length / data.leads.length) * 100) : 0;

  piE(() => {
    if (!dragState) return;
    const prevUserSelect = document.body.style.userSelect;
    const prevCursor = document.body.style.cursor;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
    return () => {
      document.body.style.userSelect = prevUserSelect;
      document.body.style.cursor = prevCursor;
    };
  }, [dragState]);

  piE(() => {
    const onPointerMove = (event) => {
      const pending = pendingRef.current;
      if (!pending) return;

      const dx = event.clientX - pending.startX;
      const dy = event.clientY - pending.startY;
      const distance = Math.hypot(dx, dy);

      if (!dragState) {
        if (distance < 6) return;
        suppressClickRef.current = true;
        const target = getDropTarget(event.clientX, event.clientY, pending.id) || { stage: pending.fromStage, index: pending.fromIndex };
        setDragState({
          id: pending.id,
          fromStage: pending.fromStage,
          overStage: target.stage,
          overIndex: target.index,
          pointerX: event.clientX,
          pointerY: event.clientY,
          offsetX: pending.offsetX,
          offsetY: pending.offsetY,
          width: pending.width,
          height: pending.height,
        });
        return;
      }

      const target = getDropTarget(event.clientX, event.clientY, pending.id);
      setDragState((prev) => prev ? {
        ...prev,
        pointerX: event.clientX,
        pointerY: event.clientY,
        overStage: target ? target.stage : prev.overStage,
        overIndex: target ? target.index : prev.overIndex,
      } : prev);
    };

    const onPointerUp = () => {
      const pending = pendingRef.current;
      pendingRef.current = null;

      if (!dragState) return;

      const nextStage = dragState.overStage || dragState.fromStage;
      const nextIndex = dragState.overIndex == null ? 0 : dragState.overIndex;
      update("leads", (leads) => moveLeadInList(leads, dragState.id, nextStage, nextIndex));
      toast(plTx("leadUpdated"));
      setDragState(null);

      window.setTimeout(() => {
        suppressClickRef.current = false;
      }, 0);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [dragState, toast, update]);

  const handlePointerDown = piC((event, lead, stage, index) => {
    if (event.button !== 0) return;
    if (event.target.closest("button")) return;

    const rect = event.currentTarget.getBoundingClientRect();
    pendingRef.current = {
      id: lead.id,
      fromStage: stage,
      fromIndex: index,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
  }, []);

  const handleCardClick = piC((leadId) => {
    if (suppressClickRef.current) return;
    const lead = data.leads.find(l => l.id === leadId);
    if (lead) setViewLead(lead);
  }, [data.leads]);

  return (
    <div className="pk-page fade-in">
      <div className="pk-page-head">
        <PageHeader title={t("page.pipeline")} desc={plTx("desc")} crumbs={[{ label: plTx("crmCrumb") }, { label: t("page.pipeline") }]}
          actions={<>
            <SearchInput value={q} onChange={setQ} placeholder="Lead qidirish..." width={210} />
            <FilterSelect value={prioFilter} onChange={setPrioFilter} options={[{ value: "all", label: plTx("allPriority") }, { value: "urgent", label: plTx("urgent") }, { value: "high", label: plTx("high") }, { value: "medium", label: plTx("medium") }, { value: "low", label: plTx("low") }]} />
          </>} />

        <div className="pk-stats-row">
          <div className="pk-stat-pill"><span>{plTx("totalLeads")}</span><strong>{data.leads.length}</strong></div>
          <div className="pk-stat-pill pk-stat-pill-accent"><span>{plTx("pipelineValue")}</span><strong>{fmtShort(pipelineVal)}</strong></div>
          <div className="pk-stat-pill"><span>{plTx("conversion")}</span><strong>{convRate}%</strong></div>
          <div className="pk-stat-pill"><span>{plTx("overdueTask")}</span><strong>{data.leads.filter((lead) => lead.hasOverdueTask).length}</strong></div>
        </div>
      </div>

      <div className="pk-board">
        {PIPELINE_STAGES.map((stage) => {
          const cfg = STAGE_CFG[stage];
          const rawItems = leadsByStage[stage] || [];
          const items = dragState ? rawItems.filter((lead) => lead.id !== dragState.id) : rawItems;
          const hasDropTarget = dragState && dragState.overStage === stage;
          const insertIndex = hasDropTarget ? Math.max(0, Math.min(dragState.overIndex ?? items.length, items.length)) : -1;

          return (
            <div
              key={stage}
              className={`pk-col${hasDropTarget ? " pk-col-over" : ""}`}
              style={{ "--col-color": cfg.color }}
              data-pk-stage={stage}
            >
              <div className="pk-col-header">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="pk-col-name">{PIPELINE_STAGE_UZ[stage]}</span>
                  <span className="pk-col-cnt">{rawItems.length}</span>
                </div>
                <span className="pk-col-total">{fmtShort(rawItems.reduce((sum, lead) => sum + (lead.estimatedValue || 0), 0))}</span>
              </div>

              <div className={`pk-cards${hasDropTarget ? " pk-cards-over" : ""}`}>
                {!items.length && !hasDropTarget && (
                  <div className="pk-empty-col">
                    <div className="pk-empty-icon" style={{ background: cfg.bg, color: cfg.color }}>{React.createElement(I[cfg.icon], { size: 18 })}</div>
                    <span>{plTx("noLeads")}</span>
                  </div>
                )}

                {items.map((lead, index) => (
                  <React.Fragment key={lead.id}>
                    {insertIndex === index && <div className="pk-ghost" style={{ height: dragState?.height || 92 }} />}
                    <div
                      className="pk-card"
                      data-pk-id={lead.id}
                      onPointerDown={(event) => handlePointerDown(event, lead, stage, index)}
                      onClick={() => handleCardClick(lead.id)}
                      style={{ "--idx": index }}
                    >
                      <PipelineCardBody
                        lead={lead}
                        cfg={cfg}
                        t={t}
                        onDelete={(event) => {
                          event.stopPropagation();
                          remove("leads", lead.id);
                          toast(plTx("leadDeleted"));
                        }}
                      />
                    </div>
                  </React.Fragment>
                ))}

                {insertIndex === items.length && dragState && dragState.overStage === stage && (
                  <div className="pk-ghost" style={{ height: dragState.height || 92 }} />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {dragLead && dragState && (
        <div
          className="pk-drag-layer"
          style={{
            width: dragState.width || 296,
            transform: `translate3d(${dragState.pointerX - dragState.offsetX}px, ${dragState.pointerY - dragState.offsetY}px, 0)`,
          }}
        >
          <div className="pk-card pk-card-floating">
            <PipelineCardBody lead={dragLead} cfg={STAGE_CFG[dragState.overStage || dragLead.pipelineStage]} t={t} interactive={false} />
          </div>
        </div>
      )}
      <LeadViewModal
        open={!!viewLead}
        onClose={() => setViewLead(null)}
        onEdit={() => { setEditLead(viewLead); setViewLead(null); }}
        onDelete={() => { setDeleteLead(viewLead); setViewLead(null); }}
        lead={viewLead}
        ops={ops}
      />
      <LeadFormModal open={!!editLead} onClose={() => setEditLead(null)} initial={editLead} onSave={(lead) => { upsert("leads", lead); toast(plTx("leadUpdated")); setEditLead(null); }} ops={ops} />
      <ConfirmDialog
        open={!!deleteLead}
        onClose={() => setDeleteLead(null)}
        onConfirm={() => { remove("leads", deleteLead.id); toast(plTx("leadDeleted")); }}
        title={plTx("deleteLeadTitle")}
        message={`"${deleteLead?.fullName || ""}" yozuvini o'chirmoqchimisiz?`}
        details={deleteLead ? `${plTx("detailsPhone")} ${deleteLead.phone}\n${plTx("detailsStage")} ${PIPELINE_STAGE_UZ[deleteLead.pipelineStage]}` : ""}
        confirmLabel={plTx("deleteConfirm")}
        danger
      />
    </div>
  );
}

window.PipelinePage = PipelinePage;
