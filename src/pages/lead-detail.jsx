/* pages/lead-detail.jsx */
const { useState: ldS } = React;

function LeadDetailPage({ id }) {
  const { data, t, nav, toast, update } = useApp();
  const lead = data.leads.find(l => l.id === id);
  const [tab, setTab] = ldS("overview");
  const [noteText, setNoteText] = ldS("");
  const [taskOpen, setTaskOpen] = ldS(false);

  if (!lead) return <div className="page"><Card><EmptyState title="Lead topilmadi" action={<Button onClick={() => nav("/leads")}>Leadlarga qaytish</Button>} /></Card></div>;

  const op = data.users.find(u => u.id === lead.assignedUserId);
  const conv = data.conversations.find(c => c.leadId === lead.id);
  const calls = data.calls.filter(c => c.leadId === lead.id);
  const tasks = data.tasks.filter(tk => tk.leadId === lead.id);
  const recProducts = (lead.recommendedProductIds || []).map(pid => data.products.find(p => p.id === pid)).filter(Boolean);
  const debtor = data.orders.find(o => o.leadId === lead.id || o.customerName === lead.fullName);

  const setPipeline = (stage) => {
    update("leads", ls => ls.map(l => l.id === id ? { ...l, pipelineStage: stage, status: stage === "completed" ? "sold" : stage === "cancelled" ? "rejected" : "contacted" } : l));
    toast("Bosqich yangilandi");
  };
  const addNote = () => {
    if (!noteText.trim()) return;
    update("leads", ls => ls.map(l => l.id === id ? { ...l, notes: [noteText.trim(), ...(l.notes || [])] } : l));
    setNoteText("");
    toast("Eslatma qo'shildi");
  };

  const tabs = [
    { value: "overview", label: "Umumiy", icon: <I.user size={15} /> },
    { value: "convo", label: "Suhbat", icon: <I.message size={15} />, count: conv ? conv.messages.length : 0 },
    { value: "products", label: "Takliflar", icon: <I.box size={15} />, count: recProducts.length },
    { value: "tasks", label: "Vazifalar", icon: <I.checkCircle size={15} />, count: tasks.length },
    { value: "finance", label: "Moliyaviy holat", icon: <I.wallet size={15} /> },
    { value: "activity", label: "Faollik", icon: <I.history size={15} /> },
  ];

  return (
    <div className="page fade-in">
      <PageHeader crumbs={[{ label: "CRM" }, { label: t("page.leads"), to: "/leads" }, { label: lead.fullName }]} title={lead.fullName} />

      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
          <Avatar name={lead.fullName} size={62} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <h2 style={{ margin: 0, fontSize: 21, fontWeight: 720 }}>{lead.fullName}</h2>
              <StatusBadge status={lead.pipelineStage} label={PIPELINE_STAGE_UZ[lead.pipelineStage]} />
              <StatusBadge status={lead.priority} label={t("priority." + lead.priority)} />
              <Badge color={lead.paymentType === "credit" ? "amber" : "green"} size="sm">{lead.paymentTypeLabel}</Badge>
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", color: "var(--text-2)", fontSize: 13 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><I.phone size={14} />{lead.phone}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><SourceIcon source={lead.source} />{SOURCE_UZ[lead.source]}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><I.sun size={14} />{lead.requiredPowerKw} kW</span>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><I.user size={14} />{op ? op.fullName : "Tayinlanmagan"}</span>
            </div>
          </div>
          <div style={{ textAlign: "center", padding: "0 18px", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
            <div style={{ fontSize: 30, fontWeight: 760, color: lead.leadScore > 70 ? "var(--green)" : "var(--amber)", lineHeight: 1 }}>{lead.leadScore}</div>
            <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 4 }}>Lead score</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Button variant="default" size="sm" icon={<I.message size={15} />} onClick={() => nav("/inbox")}>Chat</Button>
            <Button variant="default" size="sm" icon={<I.checkCircle size={15} />} onClick={() => setTaskOpen(true)}>Vazifa</Button>
            <Dropdown align="right" width={220} trigger={<Button variant="primary" size="sm" icon={<I.flag size={15} />}>Bosqich <I.chevDown size={13} /></Button>}
              items={PIPELINE_STAGES.map(s => ({ label: PIPELINE_STAGE_UZ[s], onClick: () => setPipeline(s) }))} />
          </div>
        </div>
      </Card>

      <div style={{ marginBottom: 18 }}><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === "overview" && (
        <div className="grid-dash">
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Panel title="Lead ma'lumotlari" icon="user" color="accent">
              <div className="tg-meta">
                <div className="tg-meta-row"><span className="tg-meta-k">Talab quvvati</span><span className="tg-meta-v">{lead.requiredPowerKw} kW</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">Obyekt turi</span><span className="tg-meta-v">{lead.propertyType}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">Tom maydoni</span><span className="tg-meta-v">{lead.roofAreaM2} m²</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">Oylik svet</span><span className="tg-meta-v">{fmtUZS(lead.monthlyBillUzs)}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">Byudjet</span><span className="tg-meta-v">{fmtUZS(lead.budgetMinUzs)} – {fmtUZS(lead.budgetMaxUzs)}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">To'lov turi</span><span className="tg-meta-v">{lead.paymentTypeLabel}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">So'nggi aloqa</span><span className="tg-meta-v">{fmtDate(lead.lastContactAt, true)}</span></div>
              </div>
              {lead.tags.length > 0 && <div className="tg-chips" style={{ marginTop: 14 }}>{lead.tags.map(tg => <span key={tg} className="tg-chip"><I.tag size={11} />{tg}</span>)}</div>}
            </Panel>
            <Panel title="Eslatmalar" icon="note" color="amber">
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <Input value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Eslatma yozing..." onKeyDown={e => e.key === "Enter" && addNote()} />
                <Button variant="primary" icon={<I.plus size={15} />} onClick={addNote} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {(lead.notes || []).length === 0 && <div className="tg-cell-sub">Eslatmalar yo'q</div>}
                {(lead.notes || []).map((n, i) => <div key={i} style={{ padding: "10px 12px", background: "var(--surface-2)", borderRadius: 9, fontSize: 13, borderLeft: "2px solid var(--accent)" }}>{n}</div>)}
              </div>
            </Panel>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card className="ai-insight">
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div className="ai-insight-icon" style={{ width: 36, height: 36 }}><I.sparkle size={17} /></div>
                <div>
                  <strong style={{ fontSize: 13 }}>AI xulosasi</strong>
                  <p style={{ margin: "6px 0 0", fontSize: 13, lineHeight: 1.6, color: "var(--text-2)" }}>
                    Mijoz {lead.requiredPowerKw} kW quvvatli tizimga qiziqqan. {lead.paymentTypeLabel.toLowerCase()} asosidagi taklif kerak. Keyingi qadam sifatida texnik ma'lumotni to'ldirib, aniq tijoriy taklif yuborish tavsiya etiladi.
                  </p>
                </div>
              </div>
            </Card>
            <Panel title="Keyingi qadam" icon="target" color="teal">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Button variant="soft" full icon={<I.box size={15} />} onClick={() => setTab("products")}>Paket tavsiya qilish</Button>
                <Button variant="default" full icon={<I.calendar size={15} />} onClick={() => setTaskOpen(true)}>Qayta aloqa rejalashtirish</Button>
                <Button variant="default" full icon={<I.wallet size={15} />} onClick={() => nav("/debtors")}>Qarzdorlik yozuviga o'tkazish</Button>
              </div>
            </Panel>
            {calls.length > 0 && (
              <Panel title="So'nggi qo'ng'iroqlar" icon="phone" color="blue">
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {calls.slice(0, 3).map(c => (
                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <span>{c.outcome}</span>
                      <span className="tg-cell-sub">{fmtDate(c.datetime)}</span>
                    </div>
                  ))}
                </div>
              </Panel>
            )}
          </div>
        </div>
      )}

      {tab === "convo" && <LeadConversation conv={conv} lead={lead} />}
      {tab === "products" && <LeadProducts products={recProducts} />}
      {tab === "tasks" && <LeadTasks tasks={tasks} onAdd={() => setTaskOpen(true)} />}
      {tab === "finance" && <LeadFinance lead={lead} debtor={debtor} />}
      {tab === "activity" && <LeadActivity lead={lead} calls={calls} />}
      <TaskFormModal open={taskOpen} onClose={() => setTaskOpen(false)} leadId={lead.id} />
    </div>
  );
}

function LeadConversation({ conv, lead }) {
  if (!conv) return <Card><EmptyState icon={<I.message size={26} />} title="Suhbat yo'q" message="Bu lead bilan hali yozishuv bo'lmagan" /></Card>;
  return (
    <Panel title="Suhbat tarixi" subtitle={SOURCE_UZ[conv.channel]} icon="message" color="blue">
      <div className="tg-chat" style={{ maxHeight: 460 }}>
        {conv.messages.map(m => <ChatBubble key={m.id} m={m} name={lead.fullName} />)}
      </div>
    </Panel>
  );
}

function ChatBubble({ m, name }) {
  const mine = m.from !== "customer";
  return (
    <div className={"tg-msg " + (mine ? "tg-msg-out" : "tg-msg-in")}>
      {!mine && <Avatar name={name} size={28} />}
      <div>
        {mine && <div className="tg-msg-from">{m.from === "ai" ? <><I.robot size={12} /> AI assistant</> : <><I.user size={12} /> Operator</>}</div>}
        <div className="tg-msg-bubble" data-ai={m.from === "ai" ? "1" : undefined}>{m.text}</div>
        <div className="tg-msg-time">{fmtDate(m.at, true)}</div>
      </div>
    </div>
  );
}

function LeadProducts({ products }) {
  const { toast } = useApp();
  if (!products.length) return <Card><EmptyState icon={<I.box size={26} />} title="Takliflar yo'q" message="Bu lead uchun hali mahsulot biriktirilmagan" /></Card>;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <strong>Tavsiya etilgan {products.length} ta paket</strong>
        <Button variant="primary" size="sm" icon={<I.send size={15} />} onClick={() => toast("Taklif mijozga yuborildi")}>Mijozga yuborish</Button>
      </div>
      <div className="grid-3">
        {products.map(p => <ProductCard key={p.id} product={p} compact />)}
      </div>
    </div>
  );
}

function LeadTasks({ tasks, onAdd }) {
  const { update, toast } = useApp();
  return (
    <Panel title="Vazifalar" icon="checkCircle" color="teal" action={<Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={onAdd}>Yangi vazifa</Button>}>
      {!tasks.length ? <EmptyState title="Vazifalar yo'q" /> : (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tasks.map(tk => (
            <div key={tk.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 0", borderBottom: "1px solid var(--border-soft)" }}>
              <span className="tg-check" data-on={tk.status === "done" ? "1" : undefined} onClick={() => { update("tasks", ts => ts.map(x => x.id === tk.id ? { ...x, status: x.status === "done" ? "pending" : "done" } : x)); toast("Vazifa yangilandi"); }}>{tk.status === "done" && <I.check size={12} stroke={3} />}</span>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 540 }}>{tk.title}</div><div className="tg-cell-sub">{fmtDate(tk.dueDate, true)}</div></div>
              <Badge color={STATUS_COLORS[tk.status]} size="sm">{tk.status}</Badge>
            </div>
          ))}
        </div>
      )}
    </Panel>
  );
}

function LeadFinance({ lead, debtor }) {
  if (!debtor) return <Card><EmptyState icon={<I.wallet size={26} />} title="Moliyaviy yozuv yo'q" message="Bu lead hali mijoz yoki qarzdor yozuviga o'tkazilmagan" /></Card>;
  return (
    <div className="grid-dash">
      <Panel title="Qarzdorlik holati" icon="wallet" color="amber">
        <div className="tg-meta">
          <div className="tg-meta-row"><span className="tg-meta-k">Biznes yo'nalishi</span><span className="tg-meta-v">{debtor.businessLine}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Jami loyiha</span><span className="tg-meta-v">{fmtUZS(debtor.totalUzs)}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">To'langan</span><span className="tg-meta-v">{fmtUZS(debtor.paidUzs)}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Qoldiq</span><span className="tg-meta-v">{fmtUZS(debtor.remainingDebtUzs)}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Muddati o'tgan</span><span className="tg-meta-v">{fmtUZS(debtor.overdueAmountUzs)}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Muddat</span><span className="tg-meta-v">{fmtDate(debtor.dueDate)}</span></div>
        </div>
      </Panel>
      <Panel title="Taklif qilingan mahsulotlar" icon="box" color="green">
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {debtor.productItems.map((item, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span>{item.name}</span><strong>{fmtUZS(item.unitPriceUzs)}</strong></div>)}
        </div>
      </Panel>
    </div>
  );
}

function LeadActivity({ lead, calls }) {
  const events = [
    { icon: "target", color: "blue", text: "Lead yaratildi", at: lead.createdAt },
    { icon: "flag", color: "amber", text: `Bosqich: ${PIPELINE_STAGE_UZ[lead.pipelineStage]}`, at: lead.lastContactAt },
    ...calls.map(c => ({ icon: "phone", color: "cyan", text: `Qo'ng'iroq - ${c.outcome}`, at: c.datetime })),
  ].sort((a, b) => new Date(b.at) - new Date(a.at));
  return (
    <Panel title="Faollik tarixi" icon="history" color="blue">
      <div className="tg-activity">
        {events.map((e, i) => {
          const Ico = I[e.icon];
          return (
            <div key={i} className="tg-activity-item">
              <div className="tg-activity-line"><span className="tg-activity-dot" style={{ background: `var(--${e.color})` }}><Ico size={11} style={{ color: "#fff" }} /></span></div>
              <div style={{ flex: 1, paddingBottom: 16 }}><div style={{ fontSize: 13.5, fontWeight: 540 }}>{e.text}</div><div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>{fmtDate(e.at, true)}</div></div>
            </div>
          );
        })}
      </div>
    </Panel>
  );
}

window.LeadDetailPage = LeadDetailPage;
window.ChatBubble = ChatBubble;
