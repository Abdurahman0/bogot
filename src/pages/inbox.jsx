/* pages/inbox.jsx */
const { useState: ibS, useMemo: ibM, useRef: ibR, useEffect: ibE } = React;
const INBOX_STATUS_UZ = { new: "Yangi", active: "Faol", inactive: "Nofaol", pending: "Kutilmoqda", contacted: "Bog'langan", qualified: "Saralangan", confirmed: "Tasdiqlangan", closed: "Yopilgan", lost: "Yo'qotilgan" };
const inboxStatusLabel = (value) => INBOX_STATUS_UZ[String(value || "").trim().toLowerCase()] || value || "Belgilanmagan";

const CHANNEL_TABS = [
  { value: "all", label: "Barchasi" },
  { value: "instagram", label: "Instagram" },
  { value: "telegram", label: "Telegram" },
  { value: "handoff", label: "Operator" },
  { value: "closed", label: "Yopilgan" },
];

const AI_MODE_UZ = { ai: "AI faol", operator: "Operator nazorati", handoff: "Operatorga o'tkazildi" };
const AI_MODE_COLORS = { ai: "violet", operator: "blue", handoff: "amber" };
const CH_ICON = { instagram: "instagram", telegram: "send", phone: "phone", manual: "edit" };
const CH_COLOR = { instagram: "pink", telegram: "blue", phone: "green", manual: "slate" };

function InboxPage() {
  const { data, toast, ensureConversationMessages, sendConversationMessage, setConversationMode } = useApp();
  const [tab, setTab] = ibS("all");
  const [activeId, setActiveId] = ibS(null);
  const [q, setQ] = ibS("");
  const [msgText, setMsgText] = ibS("");
  const [busy, setBusy] = ibS(false);
  const msgEndRef = ibR(null);

  const convs = ibM(() => {
    let list = [...data.conversations];
    if (tab === "instagram" || tab === "telegram") list = list.filter((conversation) => conversation.channel === tab);
    if (tab === "handoff") list = list.filter((conversation) => conversation.status === "handoff" || conversation.aiMode === "handoff");
    if (tab === "closed") list = list.filter((conversation) => conversation.status === "closed");
    if (q) list = list.filter((conversation) => conversation.name.toLowerCase().includes(q.toLowerCase()));
    return list;
  }, [data.conversations, tab, q]);

  const active = ibM(() => data.conversations.find((conversation) => conversation.id === activeId) || convs[0] || null, [data.conversations, activeId, convs]);
  const activeCustomer = ibM(() => active ? data.customers.find((customer) => customer.id === active.clientId) || null : null, [active, data.customers]);
  const activeUser = ibM(() => active ? data.users.find((user) => user.id === active.assignedUserId) : null, [active, data.users]);

  ibE(() => { if (convs[0] && !activeId) setActiveId(convs[0].id); }, [convs, activeId]);
  ibE(() => { if (msgEndRef.current) msgEndRef.current.scrollIntoView({ behavior: "smooth" }); }, [active?.messages?.length]);
  ibE(() => {
    if (!active?.id) return;
    ensureConversationMessages(active.id).catch((error) => toast(error.message || "Suhbat yuklanmadi", "error"));
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
      toast(error.message || "Xabar yuborilmadi", "error");
    } finally {
      setBusy(false);
    }
  };

  const setAiMode = async (mode) => {
    if (!active) return;
    setBusy(true);
    try {
      await setConversationMode(active.id, mode);
      toast(AI_MODE_UZ[mode]);
    } catch (error) {
      toast(error.message || "Rejim yangilanmadi", "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ height: "calc(100vh - var(--header-h))", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "14px 20px 0", borderBottom: "1px solid var(--border)", background: "var(--surface)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 720 }}>Yagona inbox</h2>
            <Badge color="blue">{data.conversations.length} suhbat</Badge>
          </div>
        </div>
        <div style={{ display: "flex", gap: 0, overflow: "auto" }}>
          {CHANNEL_TABS.map((item) => (
            <button key={item.value} className="tg-tab" data-active={tab === item.value ? "1" : undefined} onClick={() => setTab(item.value)} style={{ marginBottom: -1 }}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="tg-inbox" style={{ flex: 1 }}>
        <div className="tg-inbox-sidebar">
          <div style={{ padding: "10px 12px" }}>
            <SearchInput value={q} onChange={setQ} placeholder="Suhbat qidirish..." />
          </div>
          {convs.length === 0 ? <EmptyState icon={<I.inbox size={22} />} title="Suhbat yo'q" /> : convs.map((conversation) => {
            const lastMsg = (conversation.messages || []).slice(-1)[0];
            const ChIco = I[CH_ICON[conversation.channel] || "message"];
            return (
              <div key={conversation.id} className="tg-inbox-conv-item" data-active={active?.id === conversation.id ? "1" : undefined} onClick={() => setActiveId(conversation.id)}>
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
                  <div style={{ fontSize: 12, color: "var(--text-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lastMsg ? lastMsg.text : "Yangi suhbat"}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="tg-inbox-thread">
          {!active ? <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}><EmptyState icon={<I.inbox size={26} />} title="Suhbat tanlang" /></div> : <>
            <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Avatar name={active.name} size={36} />
                <div>
                  <div style={{ fontWeight: 640, fontSize: 14.5 }}>{active.name}</div>
                  <div style={{ display: "flex", gap: 8, marginTop: 2 }}>
                    <Badge color={AI_MODE_COLORS[active.aiMode || "ai"]} size="sm">{AI_MODE_UZ[active.aiMode || "ai"]}</Badge>
                    <StatusBadge status={active.status || "open"} label={active.status === "closed" ? "Yopilgan" : active.status === "handoff" ? "Operator" : "Ochiq"} />
                  </div>
                </div>
              </div>
              <Segmented value={active.aiMode || "ai"} onChange={setAiMode} options={[{ value: "ai", label: "AI", icon: <I.robot size={14} /> }, { value: "operator", label: "Operator", icon: <I.user size={14} /> }, { value: "handoff", label: "O'tkazish", icon: <I.arrowRight size={14} /> }]} disabled={busy} />
            </div>

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
                <I.sparkle size={13} /> AI javobi taklifi
              </button>
            </div>

            <div className="tg-inbox-composer">
              <IconButton icon={<I.image size={17} />} label="Fayl" />
              <textarea value={msgText} onChange={(event) => setMsgText(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMsg(); } }} placeholder="Xabar yozing..." className="tg-input" rows={2} style={{ flex: 1, resize: "none" }} />
              <Button variant="primary" size="sm" icon={<I.send size={15} />} onClick={sendMsg} disabled={!msgText.trim() || busy}>{busy ? "Yuborilmoqda..." : "Yuborish"}</Button>
            </div>
          </>}
        </div>

        <div className="tg-inbox-panel">
          {activeCustomer ? (
            <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <Avatar name={activeCustomer.fullName} size={44} />
                  <div>
                    <div style={{ fontWeight: 640, fontSize: 14 }}>{activeCustomer.fullName}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)" }}>{activeCustomer.phone || "Telefon yo'q"}</div>
                  </div>
                </div>
                <div className="tg-chips" style={{ marginBottom: 10 }}>
                  <StatusBadge status={activeCustomer.status || "active"} label={inboxStatusLabel(activeCustomer.statusName || activeCustomer.status)} />
                  <Badge color="blue" size="sm">{fmtUZS(activeCustomer.debtBalanceUzs || 0)}</Badge>
                </div>
                <Button variant="ghost" size="sm" full onClick={() => window.navTo("/customers/" + activeCustomer.id)} icon={<I.arrowRight size={14} />}>Mijoz kartasini ochish</Button>
              </div>

              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                <div className="tg-section-title">Mijoz ma'lumotlari</div>
                <div className="tg-meta">
                  <div className="tg-meta-row"><span className="tg-meta-k">Manzil</span><span className="tg-meta-v">{activeCustomer.address || "Kiritilmagan"}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">PNFL</span><span className="tg-meta-v">{activeCustomer.pnfl || "Kiritilmagan"}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">Subsidya</span><span className="tg-meta-v">{fmtUZS(activeCustomer.debtBalanceUzs || 0)}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">Depozit</span><span className="tg-meta-v">{fmtUZS(activeCustomer.totalSpent || 0)}</span></div>
                </div>
              </div>

              {activeUser && (
                <div style={{ borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                  <div className="tg-section-title">Mas'ul xodim</div>
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
          ) : <div style={{ padding: 16 }}><EmptyState icon={<I.user size={22} />} title="Mijoz topilmadi" message="Bu suhbat hali CRM mijoz kartasi bilan bog'lanmagan" /></div>}
        </div>
      </div>
    </div>
  );
}

window.InboxPage = InboxPage;
