/* pages/inbox.jsx */
const { useState: ibS, useMemo: ibM, useRef: ibR, useEffect: ibE } = React;
const INBOX_UI = {
  uz: {
    heading: "Yagona inbox", convCount: "suhbat",
    tabAll: "Barchasi", tabHandoff: "Operator", tabClosed: "Yopilgan",
    aiActive: "AI faol", aiOperator: "Operator nazorati", aiHandoff: "Operatorga o'tkazildi",
    statusOpen: "Ochiq", statusClosed: "Yopilgan", statusHandoff: "Operator",
    resumeAI: "AI ni davom ettirish", stopAI: "AI ni to'xtatish", deleteChat: "O'chirish",
    aiPausedUntil: "AI to'xtatildi:",
    searchConvs: "Suhbat qidirish...", noConvs: "Suhbat yo'q", selectConv: "Suhbat tanlang",
    newConv: "Yangi suhbat",
    msgPlaceholder: "Xabar yozing...", sending: "Yuborilmoqda...", send: "Yuborish",
    msgSent: "Xabar yuborildi", msgFailed: "Xabar yuborilmadi", modeUpdated: "Rejim yangilanmadi",
    convLoadFailed: "Suhbat yuklanmadi",
    noPhone: "Telefon yo'q", openCustomer: "Mijoz kartasini ochish",
    customerInfo: "Mijoz ma'lumotlari", responsibleStaff: "Mas'ul xodim",
    noCustomer: "Mijoz topilmadi", noCustomerMsg: "Bu suhbat hali CRM mijoz kartasi bilan bog'lanmagan",
    metaAddress: "Manzil", metaPnfl: "PNFL", metaSubsidy: "Subsidya", metaDeposit: "Depozit",
    notEntered: "Kiritilmagan",
    deleteChatTitle: "Chatni o'chirish", deleteChatMsg: '"{0}" chatini o\'chirmoqchimisiz?',
    chatDeleted: "Chat o'chirildi", chatDeleteFailed: "Chat o'chirilmadi",
    deleting: "O'chirilmoqda...", deleteConfirm: "O'chirish",
    pauseModalTitle: "AI ni to'xtatish", pauseUntilLabel: "AI qachongacha to'xtasin",
    cancel: "Bekor", pauseConfirm: "To'xtatish", pauseSaving: "Saqlanmoqda...",
    selectTime: "Vaqtni tanlang", futureTime: "Kelajak vaqtini tanlang",
    minuteSuffix: "daqiqa",
    aiSuggestion: "AI javobi taklifi",
  },
  ru: {
    heading: "Единый inbox", convCount: "диалог",
    tabAll: "Все", tabHandoff: "Оператор", tabClosed: "Закрытые",
    aiActive: "AI активен", aiOperator: "Под наблюдением оператора", aiHandoff: "Передано оператору",
    statusOpen: "Открыт", statusClosed: "Закрыт", statusHandoff: "Оператор",
    resumeAI: "Возобновить AI", stopAI: "Остановить AI", deleteChat: "Удалить",
    aiPausedUntil: "AI приостановлен до:",
    searchConvs: "Поиск диалогов...", noConvs: "Нет диалогов", selectConv: "Выберите диалог",
    newConv: "Новый диалог",
    msgPlaceholder: "Введите сообщение...", sending: "Отправка...", send: "Отправить",
    msgSent: "Сообщение отправлено", msgFailed: "Сообщение не отправлено", modeUpdated: "Режим не обновлён",
    convLoadFailed: "Диалог не загружен",
    noPhone: "Нет телефона", openCustomer: "Открыть карточку клиента",
    customerInfo: "Информация о клиенте", responsibleStaff: "Ответственный сотрудник",
    noCustomer: "Клиент не найден", noCustomerMsg: "Этот диалог ещё не связан с карточкой клиента CRM",
    metaAddress: "Адрес", metaPnfl: "ПНФЛ", metaSubsidy: "Субсидия", metaDeposit: "Депозит",
    notEntered: "Не указано",
    deleteChatTitle: "Удалить чат", deleteChatMsg: 'Удалить чат "{0}"?',
    chatDeleted: "Чат удалён", chatDeleteFailed: "Чат не удалён",
    deleting: "Удаление...", deleteConfirm: "Удалить",
    pauseModalTitle: "Остановить AI", pauseUntilLabel: "До какого времени остановить AI",
    cancel: "Отмена", pauseConfirm: "Остановить", pauseSaving: "Сохранение...",
    selectTime: "Выберите время", futureTime: "Выберите время в будущем",
    minuteSuffix: "мин",
    aiSuggestion: "Предложение AI",
  },
  en: {
    heading: "Unified inbox", convCount: "conversation",
    tabAll: "All", tabHandoff: "Operator", tabClosed: "Closed",
    aiActive: "AI active", aiOperator: "Operator monitoring", aiHandoff: "Handed to operator",
    statusOpen: "Open", statusClosed: "Closed", statusHandoff: "Operator",
    resumeAI: "Resume AI", stopAI: "Stop AI", deleteChat: "Delete",
    aiPausedUntil: "AI paused until:",
    searchConvs: "Search conversations...", noConvs: "No conversations", selectConv: "Select a conversation",
    newConv: "New conversation",
    msgPlaceholder: "Type a message...", sending: "Sending...", send: "Send",
    msgSent: "Message sent", msgFailed: "Message not sent", modeUpdated: "Mode not updated",
    convLoadFailed: "Conversation not loaded",
    noPhone: "No phone", openCustomer: "Open customer card",
    customerInfo: "Customer info", responsibleStaff: "Responsible staff",
    noCustomer: "Customer not found", noCustomerMsg: "This conversation is not yet linked to a CRM customer card",
    metaAddress: "Address", metaPnfl: "PNFL", metaSubsidy: "Subsidy", metaDeposit: "Deposit",
    notEntered: "Not entered",
    deleteChatTitle: "Delete chat", deleteChatMsg: 'Delete chat "{0}"?',
    chatDeleted: "Chat deleted", chatDeleteFailed: "Chat not deleted",
    deleting: "Deleting...", deleteConfirm: "Delete",
    pauseModalTitle: "Stop AI", pauseUntilLabel: "Pause AI until",
    cancel: "Cancel", pauseConfirm: "Stop", pauseSaving: "Saving...",
    selectTime: "Select time", futureTime: "Select a future time",
    minuteSuffix: "min",
    aiSuggestion: "AI suggestion",
  },
};
function ibLang() { return window.__TG_LANG || "uz"; }
function ibTx(key) { return INBOX_UI[ibLang()]?.[key] || INBOX_UI.uz[key] || key; }
const INBOX_STATUS_LABELS = {
  uz: { new: "Yangi", active: "Faol", inactive: "Nofaol", pending: "Kutilmoqda", contacted: "Bog'langan", qualified: "Saralangan", confirmed: "Tasdiqlangan", closed: "Yopilgan", lost: "Yo'qotilgan" },
  ru: { new: "Новый", active: "Активный", inactive: "Неактивный", pending: "Ожидание", contacted: "Связались", qualified: "Квалифицирован", confirmed: "Подтверждён", closed: "Закрыт", lost: "Потерян" },
  en: { new: "New", active: "Active", inactive: "Inactive", pending: "Pending", contacted: "Contacted", qualified: "Qualified", confirmed: "Confirmed", closed: "Closed", lost: "Lost" },
};
const inboxStatusLabel = (value) => {
  const labels = INBOX_STATUS_LABELS[ibLang()] || INBOX_STATUS_LABELS.uz;
  const key = String(value || "").trim().toLowerCase();
  return labels[key] || INBOX_STATUS_LABELS.uz[key] || value || "—";
};
const CHANNEL_TABS_FN = () => [
  { value: "all", label: ibTx("tabAll") },
  { value: "instagram", label: "Instagram" },
  { value: "telegram", label: "Telegram" },
];
const AI_MODE_LABELS = () => ({ ai: ibTx("aiActive"), operator: ibTx("aiOperator"), handoff: ibTx("aiHandoff") });
const AI_MODE_COLORS = { ai: "violet", operator: "blue", handoff: "amber" };
const CH_ICON = { instagram: "instagram", telegram: "send", phone: "phone", manual: "edit" };
const CH_COLOR = { instagram: "pink", telegram: "blue", phone: "green", manual: "slate" };
const inboxPauseDefault = () => {
  const target = new Date(Date.now() + 30 * 60 * 1000);
  const pad = (value) => String(value).padStart(2, "0");
  return `${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}`;
};

function InboxPage({ initialSessionId }) {
  const { data, toast, ensureConversationMessages, sendConversationMessage, deleteConversation, setConversationMode } = useApp();
  const [tab, setTab] = ibS("all");
  const [activeId, setActiveId] = ibS(null);
  const [q, setQ] = ibS("");
  const [msgText, setMsgText] = ibS("");
  const [busy, setBusy] = ibS(false);
  const [deleteBusy, setDeleteBusy] = ibS(false);
  const [deleteTarget, setDeleteTarget] = ibS(null);
  const [pauseOpen, setPauseOpen] = ibS(false);
  const [pauseValue, setPauseValue] = ibS(inboxPauseDefault());
  const [pauseBusy, setPauseBusy] = ibS(false);
  const [panelOpen, setPanelOpen] = ibS(true);
  const [fetchedCustomer, setFetchedCustomer] = ibS(null);
  const msgEndRef = ibR(null);

  const convs = ibM(() => {
    let list = [...data.conversations];
    if (tab === "instagram" || tab === "telegram") list = list.filter((conversation) => conversation.channel === tab);
    if (tab === "handoff") list = list.filter((conversation) => conversation.status === "handoff" || conversation.aiMode === "handoff");
    if (tab === "closed") list = list.filter((conversation) => conversation.status === "closed");
    if (q) list = list.filter((conversation) => conversation.name.toLowerCase().includes(q.toLowerCase()));
    const handoffPriority = (c) => (c.status === "handoff" || c.aiMode === "handoff") ? 0 : 1;
    list.sort((a, b) => handoffPriority(a) - handoffPriority(b) || new Date(b.lastAt) - new Date(a.lastAt));
    return list;
  }, [data.conversations, tab, q]);

  const active = ibM(() => convs.find((conversation) => conversation.id === activeId) || null, [convs, activeId]);
  const activeUser = ibM(() => active ? data.users.find((user) => user.id === active.assignedUserId) : null, [active, data.users]);

  ibE(() => {
    if (!activeId) return;
    if (!convs.some((conversation) => conversation.id === activeId)) setActiveId(null);
  }, [convs, activeId]);

  ibE(() => {
    if (initialSessionId && convs.some(c => c.id === initialSessionId)) {
      setActiveId(initialSessionId);
    }
  }, [initialSessionId, convs]);

  ibE(() => {
    if (!active?.clientId) { setFetchedCustomer(null); return; }
    if (data.customers.find(c => c.id === active.clientId)) { setFetchedCustomer(null); return; }
    apiGetClientById(active.clientId).then(c => setFetchedCustomer(c || null));
  }, [active?.clientId, data.customers]);

  const activeCustomer = ibM(() => {
    if (!active) return null;
    return data.customers.find(c => c.id === active.clientId) || fetchedCustomer || null;
  }, [active, data.customers, fetchedCustomer]);
  ibE(() => { if (msgEndRef.current) msgEndRef.current.scrollIntoView({ behavior: "smooth" }); }, [active?.messages?.length]);
  ibE(() => {
    if (!active?.id) return;
    ensureConversationMessages(active.id).catch((error) => toast(error.message || ibTx("convLoadFailed"), "error"));
  }, [active?.id, ensureConversationMessages, toast]);

  const sendMsg = async () => {
    if (!msgText.trim() || !active) return;
    setBusy(true);
    const content = msgText.trim();
    setMsgText("");
    try {
      await sendConversationMessage(active.id, content);
      toast("Xabar yuborildi");
    } catch (error) {
      setMsgText(content);
      toast(error.message || ibTx("msgFailed"), "error");
    } finally {
      setBusy(false);
    }
  };

  const setAiMode = async (mode, options = {}) => {
    if (!active) return;
    setBusy(true);
    try {
      await setConversationMode(active.id, mode, options);
      toast(AI_MODE_LABELS()[mode]);
    } catch (error) {
      toast(error.message || ibTx("modeUpdated"), "error");
    } finally {
      setBusy(false);
    }
  };
  const aiPaused = active ? active.aiMode !== "ai" : false;
  const pauseUntilLabel = active?.rawSession?.ai_paused_until ? fmtDate(active.rawSession.ai_paused_until, true) : "";

  const openPauseEditor = () => {
    setPauseValue(inboxPauseDefault());
    setPauseOpen(true);
  };

  const quickPause = (minutes) => {
    const target = new Date(Date.now() + minutes * 60 * 1000);
    const pad = (value) => String(value).padStart(2, "0");
    setPauseValue(`${target.getFullYear()}-${pad(target.getMonth() + 1)}-${pad(target.getDate())}T${pad(target.getHours())}:${pad(target.getMinutes())}`);
  };

  const submitPause = async () => {
    if (!active) return;
    const target = pauseValue ? new Date(pauseValue) : null;
    if (!target || Number.isNaN(target.getTime())) {
      toast(ibTx("selectTime"), "error");
      return;
    }
    if (target.getTime() <= Date.now()) {
      toast(ibTx("futureTime"), "error");
      return;
    }
    setPauseBusy(true);
    try {
      await setAiMode("operator", { pausedUntil: target.toISOString() });
      setPauseOpen(false);
    } finally {
      setPauseBusy(false);
    }
  };

  return (
    <div style={{ height: "calc(100vh - var(--header-h))", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 20px 0", borderBottom: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 720 }}>{ibTx("heading")}</h2>
            <Badge color="blue">{data.conversations.length} {ibTx("convCount")}</Badge>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0 }}>
          {CHANNEL_TABS_FN().map((item) => (
            <button key={item.value} className="tg-tab" data-active={tab === item.value ? "1" : undefined} onClick={() => setTab(item.value)} style={{ marginBottom: -1 }}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tg-inbox" style={{ flex: 1, gridTemplateColumns: `280px 1fr ${panelOpen ? "300px" : "0px"}`, transition: "grid-template-columns 0.25s ease" }}>
        <div className="tg-inbox-sidebar">
          <div style={{ padding: "10px 12px" }}>
            <SearchInput value={q} onChange={setQ} placeholder={ibTx("searchConvs")} />
          </div>
          {convs.length === 0 ? <EmptyState icon={<I.inbox size={22} />} title={ibTx("noConvs")} /> : convs.map((conversation) => {
            const lastMsg = (conversation.messages || []).slice(-1)[0];
            const ChIco = I[CH_ICON[conversation.channel] || "message"];
            const isHandoff = conversation.status === "handoff" || conversation.aiMode === "handoff";
            return (
              <div key={conversation.id} className="tg-inbox-conv-item" data-active={active?.id === conversation.id ? "1" : undefined} onClick={() => setActiveId(conversation.id)} style={isHandoff ? { borderLeft: "3px solid var(--amber)", background: active?.id === conversation.id ? undefined : "var(--amber-bg)" } : undefined}>
                <div style={{ position: "relative" }}>
                  <Avatar name={conversation.name} size={38} />
                  <span style={{ position: "absolute", bottom: -2, right: -2, width: 16, height: 16, background: `var(--${CH_COLOR[conversation.channel] || "slate"})`, borderRadius: 4, display: "grid", placeItems: "center", border: "2px solid var(--surface)" }}>
                    <ChIco size={9} style={{ color: "#fff" }} />
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: 13.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{conversation.name}</span>
                    <span style={{ fontSize: 11, color: "var(--text-3)" }}>{timeAgo(conversation.lastAt)}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lastMsg ? lastMsg.text : ibTx("newConv")}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="tg-inbox-thread">
          {!active ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}><EmptyState icon={<I.inbox size={26} />} title={ibTx("selectConv")} /></div> : <>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={active.name} size={36} />
                <div>
                  <div style={{ fontWeight: 640, fontSize: 14.5 }}>{active.name}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                    <Badge color={AI_MODE_COLORS[active.aiMode || "ai"]} size="sm">{AI_MODE_LABELS()[active.aiMode || "ai"]}</Badge>
                    <StatusBadge status={active.status || "open"} label={active.status === "closed" ? ibTx("statusClosed") : active.status === "handoff" ? ibTx("statusHandoff") : ibTx("statusOpen")} />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {aiPaused ? (
                  <Button variant="default" size="sm" icon={<I.play size={14} />} onClick={() => setAiMode("ai")} disabled={busy}>{ibTx("resumeAI")}</Button>
                ) : (
                  <Button variant="default" size="sm" icon={<I.pause size={14} />} onClick={openPauseEditor} disabled={busy}>{ibTx("stopAI")}</Button>
                )}
                <Button variant="danger" size="sm" icon={<I.trash size={14} />} onClick={() => setDeleteTarget(active)} disabled={busy || deleteBusy}>{ibTx("deleteChat")}</Button>
                <IconButton icon={<I.user size={16} />} label={panelOpen ? "Yopish" : "Mijoz"} onClick={() => setPanelOpen(v => !v)} style={{ background: panelOpen ? "var(--accent-soft)" : undefined, color: panelOpen ? "var(--accent)" : undefined }} />
              </div>
            </div>
            {aiPaused && pauseUntilLabel ? (
              <div style={{ padding: "8px 18px", borderBottom: "1px solid var(--border-soft)", background: "var(--surface)" }}>
                <div style={{ fontSize: 12, color: "var(--amber)", fontWeight: 600 }}>{ibTx("aiPausedUntil")} {pauseUntilLabel}</div>
              </div>
            ) : null}

            <div className="tg-inbox-msg-list">
              {(active.messages || []).map((msg, index) => {
                const isAI = msg.from === "ai";
                const isOut = msg.from === "operator" || isAI;
                return (
                  <div key={msg.id || index} className={`tg-msg-bubble ${isOut ? "outgoing" : "incoming"}${isAI ? " ai-msg" : ""}`}>
                    {!isOut && (
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                        {isAI ? <><span style={{ width: 18, height: 18, borderRadius: 4, background: "var(--violet)", display: "grid", placeItems: "center" }}><I.robot size={11} style={{ color: "#fff" }} /></span><span style={{ fontSize: 11, color: "var(--violet)" }}>AI</span></> : <><Avatar name={active.name} size={18} /><span style={{ fontSize: 11, color: "var(--text-3)" }}>{active.name}</span></>}
                      </div>
                    )}
                    <div className="tg-msg-text">{msg.text}</div>
                    <div className="tg-msg-meta">{timeAgo(msg.at)}{isAI && <Badge color="violet" size="sm"><I.robot size={9} /> AI</Badge>}</div>
                  </div>
                );
              })}
              <div ref={msgEndRef} />
            </div>

            <div style={{ padding: "6px 16px", background: "var(--surface)", borderTop: "1px solid var(--border-soft)" }}>
              <button style={{ display: "inline-flex", alignItems: "center", gap: 7, background: "var(--violet-bg)", color: "var(--violet)", border: "1px solid rgba(167,139,250,.2)", borderRadius: 9, padding: "5px 12px", fontSize: 12.5, fontWeight: 560 }}
                onClick={() => setMsgText("Assalomu alaykum. Talab qilinayotgan kW, to'lov turi va obyekt manzilini yuborsangiz sizga aniq taklif tayyorlayman.")}>
                <I.sparkle size={13} /> {ibTx("aiSuggestion")}
              </button>
            </div>

            <div className="tg-inbox-composer">
              <textarea value={msgText} onChange={(event) => setMsgText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMsg(); } }} placeholder={ibTx("msgPlaceholder")} className="tg-input" rows={2} style={{ flex: 1, resize: "none" }} />
              <Button variant="primary" size="sm" icon={<I.send size={15} />} onClick={sendMsg} disabled={!msgText.trim() || busy}>{busy ? ibTx("sending") : ibTx("send")}</Button>
            </div>
          </>}
        </div>

        <div className="tg-inbox-panel" style={{ width: panelOpen ? 300 : 0, minWidth: 0, overflow: "hidden", transition: "width 0.25s ease", borderLeft: panelOpen ? undefined : "none" }}>
          {activeCustomer ? (
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <Avatar name={activeCustomer.fullName} size={44} />
                  <div>
                    <div style={{ fontWeight: 640, fontSize: 14 }}>{activeCustomer.fullName}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>{activeCustomer.phone || ibTx("noPhone")}</div>
                  </div>
                </div>
                <div className="tg-chips" style={{ marginBottom: 10 }}>
                  <StatusBadge status={activeCustomer.status || "active"} label={inboxStatusLabel(activeCustomer.statusName || activeCustomer.status)} />
                  <Badge color="blue" size="sm">{fmtUZS(activeCustomer.debtBalanceUzs || 0)}</Badge>
                </div>
                <Button variant="ghost" size="sm" full onClick={() => window.navTo("/customers/" + activeCustomer.id)} icon={<I.arrowRight size={14} />}>{ibTx("openCustomer")}</Button>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                <div className="tg-section-title">{ibTx("customerInfo")}</div>
                <div className="tg-meta">
                  <div className="tg-meta-row"><span className="tg-meta-k">{ibTx("metaAddress")}</span><span className="tg-meta-v">{activeCustomer.address || ibTx("notEntered")}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">{ibTx("metaPnfl")}</span><span className="tg-meta-v">{activeCustomer.pnfl || ibTx("notEntered")}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">{ibTx("metaSubsidy")}</span><span className="tg-meta-v">{fmtUZS(activeCustomer.debtBalanceUzs || 0)}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">{ibTx("metaDeposit")}</span><span className="tg-meta-v">{fmtUZS(activeCustomer.totalSpent || 0)}</span></div>
                </div>
              </div>

              {activeUser && (
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                  <div className="tg-section-title">{ibTx("responsibleStaff")}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <Avatar name={activeUser.fullName} hue={activeUser.avatarHue} size={32} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 560 }}>{activeUser.fullName}</div>
                      <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{activeUser.label || activeUser.role}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : <div style={{ padding: 16 }}><EmptyState icon={<I.user size={22} />} title={ibTx("noCustomer")} message={ibTx("noCustomerMsg")} /></div>}
        </div>
      </div>
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => { if (!deleteBusy) setDeleteTarget(null); }}
        onConfirm={async () => {
          if (!deleteTarget?.id) return;
          setDeleteBusy(true);
          try {
            await deleteConversation(deleteTarget.id);
            if (activeId === deleteTarget.id) setActiveId(null);
            toast(ibTx("chatDeleted"));
            setDeleteTarget(null);
          } catch (error) {
            toast(error.message || ibTx("chatDeleteFailed"), "error");
          } finally {
            setDeleteBusy(false);
          }
        }}
        title={ibTx("deleteChatTitle")}
        message={ibTx("deleteChatMsg").replace("{0}", deleteTarget?.name || "")}
        details={deleteTarget ? `Kanal: ${deleteTarget.channel || "-"}\nHolat: ${deleteTarget.status || "open"}\nPlatform user: ${deleteTarget.platformUserId || "-"}` : ""}
        confirmLabel={deleteBusy ? ibTx("deleting") : ibTx("deleteConfirm")}
        danger
      />
      <Modal
        open={pauseOpen}
        onClose={() => { if (!pauseBusy) setPauseOpen(false); }}
        title={ibTx("pauseModalTitle")}
        icon={<I.pause size={18} />}
        width={440}
        footer={<>
          <Button variant="ghost" onClick={() => setPauseOpen(false)} disabled={pauseBusy}>{ibTx("cancel")}</Button>
          <Button variant="primary" onClick={submitPause} disabled={pauseBusy}>{pauseBusy ? ibTx("pauseSaving") : ibTx("pauseConfirm")}</Button>
        </>}
      >
        <div style={{ display: "grid", gap: 14 }}>
          <Field label={ibTx("pauseUntilLabel")}>
            <DatePickerInput value={pauseValue} onChange={setPauseValue} mode="datetime" />
          </Field>
          <div className="tg-chips" style={{ gap: 8 }}>
            {[15, 30, 60, 120].map((minutes) => (
              <Button key={minutes} variant="ghost" size="sm" onClick={() => quickPause(minutes)}>{minutes} {ibTx("minuteSuffix")}</Button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}

window.InboxPage = InboxPage;
