/* shell.jsx — sidebar, header, command palette, notifications, login, toasts */
const { useState: shS, useEffect: shE, useMemo: shM, useRef: shR } = React;

const NAV = [
  {
    group: "nav.crm", items: [
      { path: "/dashboard", key: "page.dashboard", icon: "home" },
      { path: "/customers", key: "page.customers", icon: "users" },
      { path: "/tasks", key: "page.tasks", icon: "checkCircle" },
      { path: "/inbox", key: "page.inbox", icon: "inbox" },
    ]
  },
  {
    group: "nav.catalog", items: [
      { path: "/products", key: "page.products", icon: "box" },
      { path: "/debtors", key: "page.orders", icon: "wallet" },
      { path: "/accounting", key: "page.payments", icon: "chart" },
    ]
  },
  {
    group: "nav.system", items: [
      { path: "/users", key: "page.users", icon: "users" },
      { path: "/roles", key: "page.roles", icon: "lock" },
      { path: "/notifications", key: "page.notifications", icon: "bell" },
      { path: "/integrations", key: "page.integrations", icon: "link" },
      { path: "/settings", key: "page.settings", icon: "settings" },
    ]
  },
];
window.NAV = NAV;

// role-based access: which paths each role can see
const ROLE_ACCESS = {
  developer: null,
  admin: null,
  operator: ["/dashboard", "/customers", "/tasks", "/inbox", "/products", "/debtors", "/accounting", "/notifications", "/integrations", "/settings"],
};
window.ROLE_ACCESS = ROLE_ACCESS;
function canAccess(role, path) { const a = ROLE_ACCESS[role]; return a == null || a.includes(path); }
window.canAccess = canAccess;

// ---------- Logo ----------
function Logo({ compact }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 34, height: 34, borderRadius: 10, background: "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 60%, #000))", display: "grid", placeItems: "center", flexShrink: 0, boxShadow: "0 2px 8px rgba(var(--accent-rgb),.4)" }}>
        <I.sun size={19} style={{ color: "#fff" }} />
      </div>
      {!compact && <div style={{ lineHeight: 1.1 }}>
        <div style={{ fontWeight: 760, fontSize: 15, letterSpacing: "-.02em" }}>Bogot Armada NRG</div>
        <div style={{ fontSize: 10.5, color: "var(--text-3)", fontWeight: 560, letterSpacing: ".02em" }}>CRM • Cognilabs</div>
      </div>}
    </div>
  );
}
window.Logo = Logo;

// ---------- Sidebar ----------
function Sidebar({ route, nav, mobileOpen, setMobileOpen }) {
  const { t, sidebarCollapsed, role } = useApp();
  const collapsed = sidebarCollapsed && !mobileOpen;
  const [closedGroups, setClosedGroups] = shS({});
  const toggleGroup = (key) => setClosedGroups(g => ({ ...g, [key]: !g[key] }));
  return (
    <>
      {mobileOpen && <div className="tg-sidebar-backdrop" onClick={() => setMobileOpen(false)} />}
      <aside className={"tg-sidebar" + (collapsed ? " collapsed" : "") + (mobileOpen ? " mobile-open" : "")}>
        <div className="tg-sidebar-head">
          <Logo compact={collapsed} />
        </div>
        <nav className="tg-sidebar-nav">
          {NAV.map(grp => {
            const items = grp.items.filter(it => canAccess(role, it.path));
            if (!items.length) return null;
            const isClosed = !!closedGroups[grp.group];
            return (
              <div key={grp.group} className="tg-nav-group">
                {!collapsed && (
                  <button className="tg-nav-grouptitle" onClick={() => toggleGroup(grp.group)}>
                    <span>{t(grp.group)}</span>
                    <I.chevDown size={13} className={"tg-nav-chev" + (isClosed ? " tg-nav-chev-closed" : "")} />
                  </button>
                )}
                <div className={"tg-nav-group-items" + (isClosed && !collapsed ? " tg-nav-group-closed" : "")}>
                  {items.map(it => {
                    const Ico = I[it.icon];
                    const active = route === it.path || route.startsWith(it.path + "/");
                    return (
                      <button key={it.path} className="tg-nav-item" data-active={active ? "1" : undefined}
                        title={collapsed ? t(it.key) : undefined}
                        onClick={() => { nav(it.path); setMobileOpen(false); }}>
                        <Ico size={18} />
                        {!collapsed && <span>{t(it.key)}</span>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
        <div className="tg-sidebar-foot" />
      </aside>
    </>
  );
}

// ---------- Header ----------
// Sun/moon theme switch — circular reveal via View Transitions API
function ThemeToggle() {
  const { theme, setTheme } = useApp();
  const isLight = resolveLight(theme);

  const onToggle = (e) => {
    const next = isLight ? "dark" : "light";
    const run = () => ReactDOM.flushSync(() => setTheme(next));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!document.startViewTransition || reduce) { run(); return; }

    const x = e.clientX, y = e.clientY;
    const endR = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const transition = document.startViewTransition(run);
    transition.ready.then(() => {
      document.documentElement.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${endR}px at ${x}px ${y}px)`] },
        { duration: 540, easing: "cubic-bezier(.4,0,.2,1)", pseudoElement: "::view-transition-new(root)" }
      );
    });
  };

  return (
    <button className="tg-theme-toggle" data-light={isLight ? "1" : "0"} onClick={onToggle}
      title={isLight ? "Tungi rejim" : "Kunduzgi rejim"} aria-label="Theme toggle">
      <span className="tg-theme-icon">{isLight ? <I.sun size={16} /> : <I.moon size={15} />}</span>
    </button>
  );
}

function Header({ route, nav, onMenu, onCmdK, custOpen, onCustToggle, onCustClose }) {
  const app = useApp();
  const { t, sidebarCollapsed, setSidebarCollapsed, role, data, logout } = app;
  const [notifOpen, setNotifOpen] = shS(false);
  const unread = data.notifications.filter(n => !n.read).length;
  const me = data.authUser || data.users.find(u => u.role === role) || data.users[0] || {
    fullName: "Foydalanuvchi",
    role,
    label: role === "developer" ? "Developer" : role === "admin" ? "Administrator" : "Operator",
    avatarHue: 220,
  };

  return (
    <header className="tg-header">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <IconButton icon={<I.panelLeft size={19} />} label="Sidebar" onClick={() => { if (window.innerWidth <= 1024) onMenu(); else setSidebarCollapsed(!sidebarCollapsed); }} />
        <button className="tg-cmdk-trigger" onClick={onCmdK}>
          <I.search size={16} />
          <span>{t("common.search")}</span>
          <span className="tg-kbd" style={{ marginLeft: "auto" }}>⌘K</span>
        </button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <QuickCreate />
        {/* theme switch */}
        <ThemeToggle />
        {/* customize */}
        <IconButton icon={<I.sliders size={19} />} label={t("customize.title")} onClick={onCustToggle} />
        {custOpen && <CustomizePanel onClose={onCustClose} />}
        {/* language */}
        <LangSelector />
        {/* notifications */}
        <div style={{ position: "relative" }}>
          <IconButton icon={<I.bell size={19} />} label="Bildirishnomalar" badge={unread} onClick={() => setNotifOpen(o => !o)} />
          {notifOpen && <NotifPanel onClose={() => setNotifOpen(false)} nav={nav} />}
        </div>
        {/* account */}
        <Dropdown align="right" width={230} trigger={
          <button className="tg-account-btn">
            <Avatar name={me.fullName} hue={me.avatarHue} size={32} />
            <div className="tg-account-info">
              <div className="tg-account-name">{me.fullName}</div>
              <div className="tg-account-role">{me.label || t("role." + role)}</div>
            </div>
            <I.chevDown size={15} style={{ color: "var(--text-3)" }} />
          </button>
        } items={[
          { label: me.label || t("role." + role), icon: <I.shield size={16} />, right: <I.check size={15} style={{ color: "var(--accent)" }} />, onClick: () => {} },
          { divider: true },
          { label: t("page.settings"), icon: <I.settings size={16} />, onClick: () => nav("/settings") },
          { label: "Chiqish", icon: <I.logout size={16} />, danger: true, onClick: logout },
        ]} />
      </div>
    </header>
  );
}

// ---------- Language selector ----------
const LANGS = [
  { value: "uz", label: "O'zbek",  flag: "🇺🇿" },
  { value: "ru", label: "Русский", flag: "🇷🇺" },
  { value: "en", label: "English", flag: "🇬🇧" },
];

function LangSelector() {
  const { lang, setLang } = useApp();
  const [open, setOpen] = shS(false);
  const ref = shR(null);
  shE(() => {
    if (!open) return;
    const on = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", on);
    return () => document.removeEventListener("mousedown", on);
  }, [open]);
  const current = LANGS.find(l => l.value === lang) || LANGS[0];
  return (
    <div style={{ position: "relative" }} ref={ref}>
      <button className="tg-iconbtn" onClick={() => setOpen(o => !o)} title="Tilni o'zgartirish">
        <I.globe size={19} />
      </button>
      {open && (
        <div className="tg-dd-menu pop-in tg-dd-right"
          style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, width: 172, zIndex: 200 }}>
          {LANGS.map(l => (
            <button key={l.value} className="tg-dd-item"
              style={{ gap: 10 }}
              onClick={() => { setLang(l.value); setOpen(false); }}>
              <span style={{ fontSize: 20, lineHeight: 1, flexShrink: 0 }}>{l.flag}</span>
              <span style={{ flex: 1 }}>{l.label}</span>
              {lang === l.value && <I.check size={14} style={{ color: "var(--accent)" }} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function QuickCreate() {
  const { t, toast } = useApp();
  const items = [
    { key: "qc.customer", icon: "user", to: "/customers" },
    { key: "qc.order", icon: "wallet", to: "/debtors" }, { key: "qc.task", icon: "checkCircle", to: "/tasks" },
    { key: "qc.product", icon: "box", to: "/products" }, { key: "qc.call", icon: "chart", to: "/accounting" },
  ];
  return (
    <Dropdown align="right" width={210} trigger={<Button variant="primary" size="sm" icon={<I.plus size={16} />}><span className="hide-sm">{t("common.quickCreate")}</span></Button>}
      items={items.map(it => { const Ico = I[it.icon]; return { label: t(it.key), icon: <Ico size={16} />, onClick: () => { window.navTo(it.to); toast(t(it.key) + " — forma ochildi"); } }; })} />
  );
}

function NotifPanel({ onClose, nav }) {
  const { data, markNotificationRead, markAllNotificationsRead } = useApp();
  const ref = shR(null);
  const TYPE_ICON = { client_created: "users", task_assigned: "checkCircle", task_done: "checkCircle", system: "settings" };
  const TYPE_COLOR = { client_created: "blue", task_assigned: "violet", task_done: "green", system: "slate" };
  shE(() => {
    const on = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener("mousedown", on), 0);
    return () => document.removeEventListener("mousedown", on);
  }, []);
  const notifs = data.notifications.slice(0, 10);
  return (
    <div className="tg-notif-panel pop-in" ref={ref}>
      <div className="tg-notif-head">
        <strong>Bildirishnomalar</strong>
        <button className="tg-link" onClick={() => markAllNotificationsRead().catch(() => null)}>Hammasini o'qilgan</button>
      </div>
      <div className="tg-notif-list">
        {notifs.map(n => {
          const Ico = I[TYPE_ICON[n.type] || "bell"];
          const color = TYPE_COLOR[n.type] || "slate";
          return (
            <button key={n.id} className="tg-notif-item" data-unread={!n.read ? "1" : undefined}
              onClick={() => { markNotificationRead(n.id).catch(() => null); }}>
              <span className="tg-notif-icon" style={{ color: `var(--${color})`, background: `var(--${color}-bg)` }}><Ico size={16} /></span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="tg-notif-text">{n.message || n.title}</div>
                <div className="tg-notif-time">{timeAgo(n.at)}</div>
              </div>
              {!n.read && <span className="tg-notif-dot" />}
            </button>
          );
        })}
      </div>
      <button className="tg-notif-foot" onClick={() => { nav("/notifications"); onClose(); }}>Barchasini ko'rish</button>
    </div>
  );
}

// ---------- Command palette ----------
function CommandPalette({ open, onClose, nav }) {
  const { data, t, role } = useApp();
  const [q, setQ] = shS("");
  const [idx, setIdx] = shS(0);
  const inputRef = shR(null);
  shE(() => { if (open) { setQ(""); setIdx(0); setTimeout(() => inputRef.current && inputRef.current.focus(), 30); } }, [open]);

  const results = shM(() => {
    const ql = q.toLowerCase().trim();
    const groups = [];
    const pages = NAV.flatMap(g => g.items).filter(it => canAccess(role, it.path)).map(it => ({ type: "Sahifa", label: t(it.key), icon: it.icon, to: it.path }));
    const matchPages = pages.filter(p => !ql || p.label.toLowerCase().includes(ql)).slice(0, 6);
    if (matchPages.length) groups.push({ title: "Sahifalar", items: matchPages });
    if (ql) {
      const custs = data.customers.filter(c => c.fullName.toLowerCase().includes(ql)).slice(0, 3).map(c => ({ type: "Mijoz", label: c.fullName, sub: [c.district, c.mahalla].filter(Boolean).join(" / "), icon: "user", to: "/customers/" + c.id }));
      if (custs.length) groups.push({ title: "Mijozlar", items: custs });
      const prods = data.products.filter(p => p.model.toLowerCase().includes(ql) || p.brand.toLowerCase().includes(ql)).slice(0, 4).map(p => ({ type: "Mahsulot", label: `${p.brand} ${p.model}`, sub: `${p.powerKw} kW • ${fmtUZS(p.priceUzs)}`, icon: "box", to: "/products/" + p.id }));
      if (prods.length) groups.push({ title: "Mahsulotlar", items: prods });
      const debtors = data.orders.filter(o => o.id.toLowerCase().includes(ql) || o.customerName.toLowerCase().includes(ql)).slice(0, 3).map(o => ({ type: "Qarzdor", label: o.customerName, sub: fmtUZS(o.remainingDebtUzs), icon: "wallet", to: "/debtors/" + o.id }));
      if (debtors.length) groups.push({ title: "Qarzdorlar", items: debtors });
    }
    const actions = [
      { type: "Amal", label: "Yangi mijoz qo'shish", icon: "plus", to: "/customers" },
      { type: "Amal", label: "Yangi qarzdor ochish", icon: "wallet", to: "/debtors" },
      { type: "Amal", label: "Yangi vazifa ochish", icon: "checkCircle", to: "/tasks" },
    ].filter(a => !ql || a.label.toLowerCase().includes(ql));
    if (actions.length && (ql || groups.length < 2)) groups.push({ title: "Amallar", items: actions.slice(0, 3) });
    return groups;
  }, [q, data, role]);

  const flat = results.flatMap(g => g.items);
  shE(() => { setIdx(0); }, [q]);

  const go = (item) => { nav(item.to); onClose(); };

  shE(() => {
    if (!open) return;
    const on = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") { e.preventDefault(); setIdx(i => Math.min(i + 1, flat.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setIdx(i => Math.max(i - 1, 0)); }
      else if (e.key === "Enter") { e.preventDefault(); if (flat[idx]) go(flat[idx]); }
    };
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, [open, flat, idx]);

  if (!open) return null;
  let runningIdx = -1;
  return (
    <div className="tg-overlay" style={{ alignItems: "flex-start", paddingTop: "12vh" }} onMouseDown={onClose}>
      <div className="tg-cmdk pop-in" onMouseDown={e => e.stopPropagation()}>
        <div className="tg-cmdk-input">
          <I.search size={19} style={{ color: "var(--text-3)" }} />
          <input ref={inputRef} value={q} onChange={e => setQ(e.target.value)} placeholder="Sahifalar, mijozlar, mahsulotlar..." />
          <span className="tg-kbd">ESC</span>
        </div>
        <div className="tg-cmdk-results">
          {flat.length === 0 && <div className="tg-cmdk-empty">Natija topilmadi</div>}
          {results.map(g => (
            <div key={g.title} className="tg-cmdk-group">
              <div className="tg-cmdk-grouptitle">{g.title}</div>
              {g.items.map(item => {
                runningIdx++; const ci = runningIdx; const Ico = I[item.icon] || I.arrowRight;
                return (
                  <button key={ci} className="tg-cmdk-item" data-active={idx === ci ? "1" : undefined}
                    onMouseEnter={() => setIdx(ci)} onClick={() => go(item)}>
                    <Ico size={17} />
                    <span className="tg-cmdk-label">{item.label}</span>
                    {item.sub && <span className="tg-cmdk-sub">{item.sub}</span>}
                    <span className="tg-cmdk-type">{item.type}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- Customize Panel ----------
const ACCENT_COLORS = [
  { key: "customize.color.emerald", value: "#10b981" },
  { key: "customize.color.blue",    value: "#3b82f6" },
  { key: "customize.color.violet",  value: "#6366f1" },
  { key: "customize.color.rose",    value: "#f43f5e" },
  { key: "customize.color.orange",  value: "#f97316" },
  { key: "customize.color.slate",   value: "#64748b" },
];

const DEFAULTS = { theme: "dark", accent: "#6366f1", density: "comfortable", layout: "sidebar", container: "fluid", direction: "ltr", lang: "uz" };

function CustomizePanel({ onClose }) {
  const { t, accent, setAccent, density, setDensity, layout, setLayout, container, setContainer, direction, setDirection, lang, setLang } = useApp();
  const ref = shR(null);

  // draft — tiles mutate this only; nothing touches app state until Apply
  const [draft, setDraft] = shS({ accent, density, container });
  const set = (k, v) => setDraft(d => ({ ...d, [k]: v }));

  // snapshot of app state at panel-open time
  const snap = shR({ accent, density, container });
  const changed = draft.accent !== snap.current.accent ||
                  draft.density !== snap.current.density || draft.container !== snap.current.container;

  shE(() => {
    const on = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    setTimeout(() => document.addEventListener("mousedown", on), 0);
    return () => document.removeEventListener("mousedown", on);
  }, []);

  shE(() => {
    const on = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, []);

  const applyDraft = () => {
    setAccent(draft.accent);
    setDensity(draft.density);
    setContainer(draft.container);
    onClose();
  };

  const resetDefaults = () => {
    setDraft({ accent: DEFAULTS.accent, density: DEFAULTS.density, container: DEFAULTS.container });
  };

  function Section({ label, children }) {
    return <div className="tg-cust-section"><div className="tg-cust-label">{label}</div><div className="tg-cust-row">{children}</div></div>;
  }

  function Tile({ icon, label, active, onClick, wide }) {
    return (
      <button className={"tg-cust-tile" + (active ? " active" : "") + (wide ? " wide" : "")} onClick={onClick}>
        {icon && <span className="tg-cust-tile-icon">{icon}</span>}
        <span className="tg-cust-tile-label">{label}</span>
      </button>
    );
  }

  return ReactDOM.createPortal(
    <div className="tg-cust-panel pop-in" ref={ref}>
        <div className="tg-cust-head">
          <div>
            <div className="tg-cust-title">{t("customize.title")}</div>
            <div className="tg-cust-sub">{t("customize.subtitle")}</div>
          </div>
          <button className="tg-cust-close" onClick={onClose}><I.x size={18} /></button>
        </div>

        <div className="tg-cust-body">
          <Section label={t("customize.section.color")}>
            {ACCENT_COLORS.map(c => (
              <button key={c.value} className={"tg-cust-color" + (draft.accent === c.value ? " active" : "")} onClick={() => set("accent", c.value)} title={t(c.key)}>
                <span className="tg-cust-color-dot" style={{ background: c.value }} />
                <span className="tg-cust-color-name">{t(c.key)}</span>
              </button>
            ))}
          </Section>

          <Section label={t("customize.section.density")}>
            <Tile icon={<I.list size={20} />}   label={t("customize.density.compact")}     active={draft.density === "compact"}     onClick={() => set("density", "compact")} />
            <Tile icon={<I.menu size={20} />}   label={t("customize.density.comfortable")} active={draft.density === "comfortable"} onClick={() => set("density", "comfortable")} />
            <Tile icon={<I.layers size={20} />} label={t("customize.density.spacious")}    active={draft.density === "spacious"}    onClick={() => set("density", "spacious")} />
          </Section>

          <Section label={t("customize.section.container")}>
            <Tile wide icon={<I.external size={20} />} label={t("customize.container.fluid")} active={draft.container === "fluid"} onClick={() => set("container", "fluid")} />
            <Tile wide icon={<I.grid size={20} />}     label={t("customize.container.boxed")} active={draft.container === "boxed"} onClick={() => set("container", "boxed")} />
          </Section>
        </div>

        <div className="tg-cust-foot" style={{ display: "flex", gap: 10 }}>
          <button className="tg-cust-reset" style={{ flex: 1 }} onClick={resetDefaults}>{t("customize.reset")}</button>
          <button
            className="tg-cust-reset"
            disabled={!changed}
            onClick={applyDraft}
            style={{
              flex: 1,
              background: changed ? "var(--accent)" : undefined,
              color: changed ? "#fff" : undefined,
              borderColor: changed ? "var(--accent)" : undefined,
              opacity: changed ? 1 : 0.4,
              cursor: changed ? "pointer" : "not-allowed",
              fontWeight: changed ? 700 : undefined,
              transition: "all .2s",
            }}>
            {t("common.apply")}
          </button>
        </div>
      </div>
    ,
    document.body
  );
}

// ---------- Toasts ----------
function Toasts() {
  const { toasts, dismissToast } = useApp();
  const iconFor = { success: { i: "checkCircle", c: "green" }, error: { i: "alert", c: "red" }, info: { i: "info", c: "blue" } };
  return (
    <div className="tg-toasts">
      {toasts.map(tt => {
        const cfg = iconFor[tt.kind] || iconFor.success; const Ico = I[cfg.i];
        return (
          <div key={tt.id} className="tg-toast" onClick={() => dismissToast(tt.id)}>
            <span className="tg-toast-icon" style={{ color: `var(--${cfg.c})`, background: `var(--${cfg.c}-bg)` }}><Ico size={16} /></span>
            <span className="tg-toast-msg">{tt.msg}</span>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Login ----------
function Login() {
  const { login, dataLoading } = useApp();
  const [username, setUsername] = shS("developer");
  const [pw, setPw] = shS("Password123!");
  const accounts = [
    { username: "developer", password: "Password123!", label: "Developer", desc: "Live backend bilan to'liq kirish" },
  ];
  const submit = async (e) => {
    e && e.preventDefault();
    try {
      await login(username, pw);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div className="tg-login">
      <div className="tg-login-art">
        <div className="tg-login-art-inner">
          <Logo />
          <h1>Quyosh panel savdosini<br />bitta CRM da boshqaring</h1>
          <p>Instagram AI, Telegram Web App leadlari, mijoz kartalari, qarzdorlar nazorati va kundalik hisob-kitob bitta panelda boshqariladi.</p>
          <div className="tg-login-stats">
            <div><strong>CRM</strong><span>lead markaz</span></div>
            <div><strong>AI</strong><span>Instagram agenti</span></div>
            <div><strong>1</strong><span>moliyaviy panel</span></div>
          </div>
        </div>
        <div className="tg-login-glow" />
      </div>
      <div className="tg-login-form">
        <form onSubmit={submit}>
          <h2>Tizimga kirish</h2>
          <p className="tg-login-note"><I.info size={14} /> Hozir tizim live backend orqali ishlaydi. Test foydalanuvchi: <strong>developer</strong></p>
          <Field label="Username"><Input value={username} onChange={e => setUsername(e.target.value)} autoComplete="username" /></Field>
          <div style={{ height: 14 }} />
          <Field label="Parol"><Input value={pw} onChange={e => setPw(e.target.value)} type="password" autoComplete="current-password" /></Field>
          <div style={{ height: 20 }} />
          <Button variant="primary" size="lg" full type="submit" disabled={dataLoading}>{dataLoading ? "Yuklanmoqda..." : <>Kirish <I.arrowRight size={17} /></>}</Button>
        </form>
        <div className="tg-login-accounts">
          <div className="tg-login-accounts-title">Tez kirish</div>
          {accounts.map(a => (
            <button key={a.username} type="button" className="tg-login-account" onClick={() => { setUsername(a.username); setPw(a.password); }}>
              <Avatar name={a.label} size={36} />
              <div style={{ flex: 1, textAlign: "left" }}>
                <div style={{ fontWeight: 600, fontSize: 13.5 }}>{a.label}</div>
                <div style={{ fontSize: 12, color: "var(--text-3)" }}>{a.username}</div>
              </div>
              <I.arrowRight size={16} style={{ color: "var(--text-3)" }} />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- time helpers ----------
function timeAgo(iso) {
  const d = new Date(iso), now = new Date(), s = (now - d) / 1000;
  if (s < 60) return "hozir"; if (s < 3600) return Math.floor(s / 60) + " daq oldin";
  if (s < 86400) return Math.floor(s / 3600) + " soat oldin";
  if (s < 604800) return Math.floor(s / 86400) + " kun oldin";
  return d.toLocaleDateString("uz", { day: "numeric", month: "short" });
}
function fmtDate(iso, withTime) {
  const d = new Date(iso);
  const date = d.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" });
  return withTime ? date + " " + d.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) : date;
}
function fmtDuration(s) { const m = Math.floor(s / 60), ss = s % 60; return `${m}:${ss.toString().padStart(2, "0")}`; }
Object.assign(window, { Sidebar, Header, CommandPalette, Toasts, Login, CustomizePanel, timeAgo, fmtDate, fmtDuration });
