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
  const { authed, role, dataLoading, data } = useApp();
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
    if (route === "/pipeline" || route.startsWith("/pipeline/")) nav("/tasks", { replace: true });
    if (route === "/leads" || route.startsWith("/leads/")) nav("/customers", { replace: true });
  }, [route, nav]);

  if (!authed) return <Login />;
  if (dataLoading && !data.authUser && data.users.length === 0) {
    return (
      <div className="tg-login">
        <div className="tg-login-form" style={{ justifyContent: "center" }}>
          <Card style={{ maxWidth: 420, width: "100%" }}>
            <div style={{ display: "grid", gap: 12, textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center" }}><I.refresh size={24} className="spin" /></div>
              <strong>CRM ma'lumotlari yuklanmoqda</strong>
              <div style={{ fontSize: 13, color: "var(--text-3)" }}>Backend bilan ulanish tekshirilmoqda.</div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // access guard
  const basePath = "/" + route.split("/")[1];
  const accessPath = basePath === "/pipeline" ? "/tasks" : basePath === "/leads" ? "/customers" : basePath;
  if (!canAccess(role, accessPath) && accessPath !== "/dashboard") {
    return (
      <div className="app-shell">
        <Sidebar route={route} nav={nav} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        <div className="main-col">
          <Header route={route} nav={nav} onMenu={() => setMobileOpen(true)} onCmdK={() => setCmdOpen(true)} custOpen={custOpen} onCustToggle={() => setCustOpen(o => !o)} onCustClose={() => setCustOpen(false)} />
          <div className="content">
            <div className="page">
              <Card><EmptyState icon={<I.lock size={26} />} title="Ruxsat yo'q"
                message={`"${role}" roli uchun bu bo'limga kirish cheklangan. Boshqa rolga o'ting yoki administrator bilan bog'laning.`}
                action={<Button variant="primary" onClick={() => nav("/dashboard")}>Bosh sahifaga</Button>} /></Card>
            </div>
          </div>
        </div>
        <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} nav={nav} />
        <Toasts />
      </div>
    );
  }

  const seg = route.split("/").filter(Boolean);
  let page = null;
  const main = seg[0], id = seg[1];

  switch (main) {
    case "dashboard": page = <DashboardPage />; break;
    case "leads": page = id ? <CustomerDetailPage id={id} /> : <CustomersPage />; break;
    case "pipeline": page = <TasksPage />; break;
    case "customers": page = id ? <CustomerDetailPage id={id} /> : <CustomersPage />; break;
    case "tasks": page = <TasksPage />; break;
    case "inbox": page = <InboxPage />; break;
    case "products": page = id ? <ProductDetailPage id={id} /> : <ProductsPage />; break;
    case "orders":
    case "debtors": page = id ? <OrderDetailPage id={id} /> : <OrdersPage />; break;
    case "payments":
    case "accounting": page = <PaymentsPage />; break;
    case "users": page = <UsersPage />; break;
    case "roles": page = <RolesPage />; break;
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
        <div className="content" key={main}>{page}</div>
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
