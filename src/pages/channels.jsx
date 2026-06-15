/* pages/channels.jsx */
const { useState: chS } = React;

const MOCK_INSTAGRAM_CONVS = [
  { id: "ig1", user: "@solar_house_uz", msg: "10 kW panel narxi qancha?", time: "5 daq oldin", led: true },
  { id: "ig2", user: "@fermer_205", msg: "Kredit bo'lsa bo'ladimi?", time: "18 daq oldin", led: true },
  { id: "ig3", user: "@hamza_build", msg: "Tom maydonini qanday hisoblaymiz?", time: "42 daq oldin", led: false },
];
const MOCK_TG_CONVS = [
  { id: "tg1", user: "Javlon T.", msg: "Web App orqali 15 kW paketni ko'rdim", time: "2 daq oldin", led: true },
  { id: "tg2", user: "Malika Y.", msg: "Batareya bilan variant bormi?", time: "14 daq oldin", led: true },
  { id: "tg3", user: "Otabek M.", msg: "Tom rasmini yubordim", time: "55 daq oldin", led: false },
];

function ChannelAIPage({ channel }) {
  const { toast } = useApp();
  const isIG = channel === "instagram";
  const [enabled, setEnabled] = chS(true);
  const [tab, setTab] = chS("overview");
  const [greeting, setGreeting] = chS(isIG
    ? "Assalomu alaykum. Bogot Armada NRG quyosh panel yechimlari bo'yicha yordamga tayyor."
    : "Salom. Telegram Web App buyurtmangiz bo'yicha kW talabi, to'lov turi va manzilni yuboring.");

  const convs = isIG ? MOCK_INSTAGRAM_CONVS : MOCK_TG_CONVS;
  const stats = [
    { l: "Handled conversations", v: isIG ? 247 : 189, color: "blue" },
    { l: "Leads captured", v: isIG ? 68 : 54, color: "green" },
    { l: "Human handoffs", v: isIG ? 23 : 17, color: "amber" },
    { l: "Est. conversion", v: isIG ? "18%" : "22%", color: "teal" },
  ];

  return (
    <div className="page fade-in">
      <PageHeader
        title={isIG ? "Instagram AI" : "Telegram Web App"}
        desc={isIG ? "Instagram DM orqali lead yig'ish va saralash" : "Telegram Web App orqali tushgan buyurtmalar va leadlar"}
        crumbs={[{ label: "Kanallar" }, { label: isIG ? "Instagram AI" : "Telegram Web App" }]}
        actions={<>
          <Button variant="default" size="sm" icon={<I.refresh size={15} />} onClick={() => toast("Sinxronlashtirildi")}>Sinxronlash</Button>
          <Button variant="primary" size="sm" icon={<I.zapline size={15} />} onClick={() => toast("Ulanish sinovdan o'tkazildi")}>Test qilish</Button>
        </>} />

      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: isIG ? "linear-gradient(135deg,#f09433,#dc2743,#bc1888)" : "linear-gradient(135deg,#2AABEE,#229ED9)", display: "grid", placeItems: "center", flexShrink: 0 }}>
            {isIG ? <I.instagram size={22} style={{ color: "#fff" }} /> : <I.send size={22} style={{ color: "#fff" }} />}
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontWeight: 640, fontSize: 15 }}>{isIG ? "@bogotarmadanrg" : "@bogot_armada_nrg_bot"}</div>
            <div style={{ color: "var(--text-3)", fontSize: 13, marginTop: 2 }}>So'nggi sinxronlash: {timeAgo(new Date(Date.now() - 180000).toISOString())}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "var(--text-3)" }}>AI:</span>
            <Toggle checked={enabled} onChange={setEnabled} label="AI yoqish" />
            <span style={{ fontSize: 13, fontWeight: 560, color: enabled ? "var(--green)" : "var(--text-3)" }}>{enabled ? "Faol" : "O'chiq"}</span>
          </div>
        </div>
      </Card>

      <div className="grid-kpi" style={{ marginBottom: 22 }}>
        {stats.map(s => <StatTile key={s.l} label={s.l} value={s.v} color={s.color} />)}
      </div>

      <div style={{ marginBottom: 18 }}>
        <Tabs tabs={[{ value: "overview", label: "Umumiy" }, { value: "conversations", label: "Suhbatlar" }, { value: "settings", label: "Sozlamalar" }]} active={tab} onChange={setTab} />
      </div>

      {tab === "overview" && (
        <div className="grid-dash">
          <Panel title="Agent vazifasi" icon="robot" color="violet">
            <div style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.7 }}>
              Agent foydalanuvchidan ism, telefon, kerakli quvvat (kW) va to'lov turini yig'adi. Yetarli ma'lumot to'plangach, lead avtomatik ravishda CRM ga yoziladi va mas'ul xodimga yuboriladi.
            </div>
          </Panel>
          <Panel title="Eng ko'p beriladigan savollar" icon="help" color="blue">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["10 kW narxi qancha?", "Kredit bormi?", "Batareya bilan variant bormi?", "Tom maydoni qancha bo'lishi kerak?", "Montaj necha kun davom etadi?"].map((faq, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 4 ? "1px solid var(--border-soft)" : "none" }}>
                  <span style={{ fontSize: 13 }}>{faq}</span>
                  <span style={{ fontSize: 12, color: "var(--text-3)" }}>{Math.max(6, 34 - i * 4)}%</span>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}

      {tab === "conversations" && (
        <Card pad={false}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}><strong>So'nggi suhbatlar</strong></div>
          {convs.map(cv => (
            <div key={cv.id} style={{ display: "flex", gap: 12, padding: "14px 16px", borderBottom: "1px solid var(--border-soft)", alignItems: "center" }}>
              <Avatar name={cv.user} size={38} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 640, fontSize: 13.5 }}>{cv.user}</span>
                  {cv.led && <Badge color="green" size="sm">Lead yaratildi</Badge>}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--text-3)", marginTop: 2 }}>{cv.msg}</div>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{cv.time}</div>
            </div>
          ))}
        </Card>
      )}

      {tab === "settings" && (
        <div className="grid-dash">
          <Panel title="Salomlashuv matni" icon="message" color="accent">
            <Textarea rows={5} value={greeting} onChange={e => setGreeting(e.target.value)} />
            <div style={{ marginTop: 10 }}><Button variant="primary" size="sm" onClick={() => toast("Salomlashuv saqlandi")}>Saqlash</Button></div>
          </Panel>
          <Panel title="Majburiy maydonlar" icon="target" color="teal">
            <div className="tg-meta">
              <div className="tg-meta-row"><span className="tg-meta-k">1</span><span className="tg-meta-v">Ism-familiya</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">2</span><span className="tg-meta-v">Telefon raqami</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">3</span><span className="tg-meta-v">Kerakli quvvat (kW)</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">4</span><span className="tg-meta-v">To'lov turi</span></div>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}

window.ChannelAIPage = ChannelAIPage;
