/* app.jsx — router + root */
const { useState: aS, useEffect: aE } = React;

const PLACEHOLDER_LABELS = {
  "/notifications": "Bildirishnomalar",
  "/integrations": "Integratsiyalar",
};

function Placeholder({ label }) {
  return (
    <div className="page fade-in">
      <PageHeader title={label} desc="Ushbu modul tayyorlanmoqda" />
      <Card>
        <EmptyState icon={<I.layers size={26} />} title={label}
          message="Bu sahifa prototipning keyingi bosqichida to'ldiriladi. Asosiy modullar to'liq ishlaydi."
          action={<Button variant="primary" icon={<I.home size={16} />} onClick={() => window.navTo("/dashboard")}>Bosh sahifaga</Button>} />
      </Card>
    </div>
  );
}

function Router() {
  const { authed, role, dataLoading, data, lang } = useApp();
  const [route, nav] = useRoute();
  const [mobileOpen, setMobileOpen] = aS(false);
  const [cmdOpen, setCmdOpen] = aS(false);
  const [custOpen, setCustOpen] = aS(false);

  // ⌘K
  aE(() => {
    const on = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setCmdOpen(o => !o); }
    };
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, []);

  aE(() => {
    if (route === "/calendar" || route.startsWith("/calendar/")) nav("/dashboard");
  }, [route, nav]);

  aE(() => {
    const hidden = ["/instagram", "/telegram", "/audit", "/help"];
    if (hidden.some((path) => route === path || route.startsWith(path + "/"))) nav("/dashboard");
  }, [route, nav]);

  aE(() => {
    if (route === "/roles" || route.startsWith("/roles/")) nav("/users", { replace: true });
  }, [route, nav]);

  aE(() => {
    if (route === "/pipeline" || route.startsWith("/pipeline/")) nav("/tasks", { replace: true });
    if (route === "/leads" || route.startsWith("/leads/")) nav("/customers", { replace: true });
  }, [route, nav]);

  aE(() => {
    if (!data?.authUser || !role) return;
    const bp = "/" + route.split("/")[1];
    const ap = bp === "/pipeline" ? "/tasks" : bp === "/leads" ? "/customers" : bp;
    if (!canAccess(role, ap, data)) {
      const first = NAV.flatMap(g => g.items).find(it => canAccess(role, it.path, data));
      toast("Bu bo'limga ruxsat yo'q", "error");
      nav(first ? first.path : "/dashboard", { replace: true });
    }
  }, [route, role, data]);

  if (!authed) return <Login />;
  if (!data.authUser) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "var(--bg)" }}>
        <Card style={{ maxWidth: 420, width: "100%" }}>
          <div style={{ display: "grid", gap: 12, textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "center" }}><I.refresh size={24} className="spin" /></div>
            <strong>CRM ma'lumotlari yuklanmoqda</strong>
            <div style={{ fontSize: 13, color: "var(--text-3)" }}>Backend bilan ulanish tekshirilmoqda.</div>
          </div>
        </Card>
        </div>
    );
  }

  // access guard
  const basePath = "/" + route.split("/")[1];
  const accessPath = basePath === "/pipeline" ? "/tasks" : basePath === "/leads" ? "/customers" : basePath;
  if (!canAccess(role, accessPath, data)) return null;

  const seg = route.split("/").filter(Boolean);
  let page = null;
  const main = seg[0], id = seg[1];

  switch (main) {
    case "dashboard": page = <DashboardPage />; break;
    case "leads": page = id ? <CustomerDetailPage id={id} /> : <CustomersPage />; break;
    case "pipeline": page = <TasksPage />; break;
    case "customers": page = id ? <CustomerDetailPage id={id} /> : <CustomersPage />; break;
    case "tasks": page = <TasksPage />; break;
    case "inbox": page = <InboxPage initialSessionId={id} />; break;
    case "products": page = id ? <ProductDetailPage id={id} /> : <ProductsPage />; break;
    case "orders":
    case "debtors": page = id ? <OrderDetailPage id={id} /> : <OrdersPage />; break;
    case "payments":
    case "accounting": page = <PaymentsPage />; break;
    case "locations": page = <LocationsPage />; break;
    case "users": page = <UsersPage />; break;
    case "settings": page = <SettingsPage />; break;
    case "notifications": page = window.NotificationsPage ? <NotificationsPage /> : <Placeholder label="Bildirishnomalar" />; break;
    case "integrations": page = window.IntegrationsPage ? <IntegrationsPage /> : <Placeholder label="Integratsiyalar" />; break;
    default: page = <DashboardPage />;
  }

  return (
    <div className="app-shell">
      <Sidebar route={route} nav={nav} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="main-col">
        <Header route={route} nav={nav} onMenu={() => setMobileOpen(true)} onCmdK={() => setCmdOpen(true)} custOpen={custOpen} onCustToggle={() => setCustOpen(o => !o)} onCustClose={() => setCustOpen(false)} />
        <div className="content" key={main + lang}>{page}</div>
      </div>
      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} nav={nav} />
      <Toasts />
    </div>
  );
}

function App() {
  return <AppProvider><Router /></AppProvider>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
