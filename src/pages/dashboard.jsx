/* pages/dashboard.jsx */
const { useState: pS, useMemo: pM } = React;
const DASHBOARD_STATUS_UZ = { new: "Yangi", active: "Faol", inactive: "Nofaol", pending: "Kutilmoqda", contacted: "Bog'langan", qualified: "Saralangan", confirmed: "Tasdiqlangan", closed: "Yopilgan", lost: "Yo'qotilgan" };
const dashboardStatusLabel = (value) => DASHBOARD_STATUS_UZ[String(value || "").trim().toLowerCase()] || value || "Belgilanmagan";

const heroAccentBg = (isLight) => (
  isLight
    ? "linear-gradient(135deg, color-mix(in srgb, var(--accent) 92%, #ffffff) 0%, color-mix(in srgb, var(--accent) 76%, #ffffff) 46%, color-mix(in srgb, var(--accent) 52%, #ffffff) 100%)"
    : "linear-gradient(135deg, color-mix(in srgb, var(--accent) 18%, #020617) 0%, color-mix(in srgb, var(--accent) 42%, #0f172a) 44%, color-mix(in srgb, var(--accent) 68%, #1e293b) 100%)"
);

function dashboardEntries(rows, labelKey = "label", valueKey = "value") {
  if (Array.isArray(rows)) {
    return rows.map((row, index) => ({
      label: row?.[labelKey] || row?.name || row?.status || row?.type || `#${index + 1}`,
      value: Number(row?.[valueKey] ?? row?.count ?? row?.total ?? 0) || 0,
    }));
  }
  if (rows && typeof rows === "object") {
    return Object.entries(rows).map(([label, value]) => ({ label, value: Number(value) || 0 }));
  }
  return [];
}

function DashboardPage() {
  const { data, t, role, nav, theme } = useApp();
  const isLight = resolveLight(theme);
  const [range, setRange] = pS("30d");
  const loading = useLoading(320);
  const me = data.users.find((user) => user.role === role) || data.authUser || data.users[0] || { fullName: "Foydalanuvchi" };
  const overview = data.dashboardOverview || {};
  const clientSummary = overview.clients || {};
  const debtorSummary = overview.debtors || {};
  const accountingDay = overview.accounting_day || null;
  const days = typeof range === "object" ? Math.max(1, Math.round((range.to - range.from) / 86400000)) : ({ today: 1, "7d": 7, "30d": 30, "90d": 90 }[range] || 30);
  const hour = new Date().getHours();
  const greet = hour < 12 ? t("greeting.morning") : hour < 18 ? t("greeting.day") : t("greeting.evening");

  const customerCount = clientSummary.total_clients ?? data.customers.length;
  const debtorCount = debtorSummary.total_debtors ?? data.orders.length;
  const overdueDebt = debtorSummary.overdue_amount ?? data.orders.reduce((sum, row) => sum + (row.overdueAmountUzs || 0), 0);
  const activeTasks = data.tasks.filter((task) => task.columnSlug !== "done" && task.columnSlug !== "canceled");
  const taskColumnsById = Object.fromEntries((data.taskColumns || []).map((column) => [column.id, column]));

  const heroKpis = [
    { label: "Jami mijozlar", value: customerCount, icon: "users", route: "/customers" },
    { label: "Qarzdorlar", value: debtorCount, icon: "wallet", route: "/debtors" },
    { label: "Muddati o'tgan qarz", value: `${fmtShort(overdueDebt)} so'm`, icon: "alert", route: "/debtors" },
    { label: "Faol vazifalar", value: activeTasks.length, icon: "checkCircle", route: "/tasks" },
  ];

  const statusData = pM(() => {
    const rows = dashboardEntries(clientSummary.by_status, "status_name", "count");
    return rows.map((row, index) => ({
      label: dashboardStatusLabel(row.label),
      value: row.value,
      color: ["#2563eb", "#7c3aed", "#0f766e", "#f59e0b", "#dc2626", "#64748b"][index % 6],
    }));
  }, [clientSummary.by_status]);

  const debtorTypeData = pM(() => {
    const rows = dashboardEntries(debtorSummary.by_type, "debtor_type", "count");
    return rows.map((row) => ({
      label: row.label === "solar_panel" ? "Quyosh panel" : row.label === "moto_business" ? "Eski biznes" : row.label,
      value: row.value,
      color: row.label === "solar_panel" ? "#2563eb" : row.label === "moto_business" ? "#f59e0b" : "#06b6d4",
    }));
  }, [debtorSummary.by_type]);

  const finance = pM(() => {
    const totalDays = days <= 1 ? 7 : days;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - totalDays + 1);
    const buckets = Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return {
        key: date.toISOString().slice(0, 10),
        label: window.formatUzDate ? window.formatUzDate(date, { day: "numeric", month: "short" }) : `${date.getDate()}-${date.getMonth() + 1}`,
        value: 0,
      };
    });
    const indexByKey = Object.fromEntries(buckets.map((bucket, index) => [bucket.key, index]));
    data.payments.forEach((payment) => {
      const key = new Date(payment.date || payment.createdAt || payment.updatedAt || Date.now()).toISOString().slice(0, 10);
      const idx = indexByKey[key];
      if (idx == null) return;
      const amount = Number(payment.amountUzs || 0);
      buckets[idx].value += payment.direction === "expense" ? -amount : amount;
    });
    return {
      labels: buckets.map((bucket) => bucket.label),
      series: buckets.map((bucket) => Math.round((bucket.value / 1000000) * 10) / 10),
    };
  }, [data.payments, days]);

  const overdueDebtors = pM(() => [...data.orders]
    .filter((row) => row.overdueAmountUzs > 0)
    .sort((a, b) => b.overdueAmountUzs - a.overdueAmountUzs)
    .slice(0, 5), [data.orders]);

  const upcomingTasks = pM(() => [...data.tasks]
    .filter((task) => task.columnSlug !== "done" && task.columnSlug !== "canceled")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 6), [data.tasks]);

  const latestCustomers = pM(() => [...data.customers]
    .sort((a, b) => new Date(b.createdAt || b.lastActivity || 0) - new Date(a.createdAt || a.lastActivity || 0))
    .slice(0, 5), [data.customers]);

  const bestProducts = pM(() => [...data.products]
    .filter((product) => product.status === "active")
    .sort((a, b) => (b.stockQuantity || 0) - (a.stockQuantity || 0))
    .slice(0, 5), [data.products]);

  const taskLoad = pM(() => data.users
    .map((user) => ({
      user,
      openTasks: data.tasks.filter((task) => task.assignedUserId === user.id && task.columnSlug !== "done").length,
      doneTasks: data.tasks.filter((task) => task.assignedUserId === user.id && task.columnSlug === "done").length,
    }))
    .filter((row) => row.openTasks || row.doneTasks)
    .sort((a, b) => b.openTasks - a.openTasks)
    .slice(0, 5), [data.tasks, data.users]);

  return (
    <div className="page fade-in">
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <DateRange value={range} onChange={setRange} />
        <ExportDropdown label="Hisobot" size="sm" filename="dashboard" rows={data.customers} mapper={(row) => ({ Mijoz: row.fullName, Telefon: row.phone, Holat: dashboardStatusLabel(row.statusName || row.status), Qarzdorlik: row.debtBalanceUzs || 0 })} />
      </div>

      <div className="dash-hero" style={{ background: heroAccentBg(isLight) }}>
        <div className="dash-hero-content">
          <h1 className="dash-hero-title">{greet}, {String(me.fullName || "Foydalanuvchi").split(" ")[0]}</h1>
          <div className="dash-hero-sub">Bogot Armada NRG ichki CRM • mijozlar, vazifalar, qarzdorlar va hisob-kitob bitta panelda</div>
          <div className="dash-hero-kpis">
            {heroKpis.map((kpi) => (
              <div key={kpi.label} className="dash-hero-tile" onClick={() => nav(kpi.route)}>
                <div className="dash-hero-tile-head">
                  {React.createElement(I[kpi.icon], { size: 15 })}
                  <span>{kpi.label}</span>
                </div>
                <div className="dash-hero-tile-value">{kpi.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-dash" style={{ marginBottom: 16 }}>
        <Panel title="Pul oqimi tendensiyasi" subtitle="Kirim minus chiqim (mln so'm)" icon="chart" color="accent">
          {loading ? <div className="skeleton" style={{ height: 220 }} /> : <AreaChart series={finance.series} labels={finance.labels} height={230} format={(value) => `${value} mln`} />}
        </Panel>
        <Panel title="Mijoz holatlari" subtitle="Backend statuslari bo'yicha taqsimot" icon="users" color="violet">
          {loading ? <div className="skeleton" style={{ height: 220 }} /> : statusData.length ? <Donut data={statusData} size={180} centerLabel="Holatlar" /> : <EmptyState icon={<I.users size={22} />} title="Statuslar topilmadi" />}
        </Panel>
      </div>

      <div className="grid-dash" style={{ marginBottom: 16 }}>
        <Panel title="Qarzdor turlari" subtitle="Backend debtor type kesimi" icon="layers" color="cyan">
          {debtorTypeData.length ? <Donut data={debtorTypeData} size={180} centerLabel="Turlar" /> : <EmptyState icon={<I.wallet size={22} />} title="Qarzdor turlari yo'q" />}
        </Panel>
        <Panel title="Bugungi hisobot kuni" subtitle="Accounting day overview" icon="calendar" color="amber">
          {accountingDay ? (
            <div className="tg-meta">
              {[
                ["Sana", accountingDay.report_date || "—"],
                ["Izoh", accountingDay.notes || "Kiritilmagan"],
                ["Yaratilgan", accountingDay.created_at ? fmtDate(accountingDay.created_at, true) : "—"],
              ].map(([key, value]) => (
                <div key={key} className="tg-meta-row"><span className="tg-meta-k">{key}</span><span className="tg-meta-v">{value}</span></div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<I.calendar size={22} />} title="Accounting day topilmadi" message="Backend bugungi hisob kunini hali qaytarmadi." />
          )}
        </Panel>
      </div>

      <div className="grid-dash" style={{ marginBottom: 16 }}>
        <Panel title="Muddati o'tgan qarzdorlar" subtitle="Tezkor undirish kerak bo'lgan mijozlar" icon="wallet" color="red">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {overdueDebtors.map((debtor) => (
              <div key={debtor.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => nav("/debtors/" + debtor.id)}>
                <Avatar name={debtor.customerName} size={32} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="tg-cell-strong">{debtor.customerName}</div>
                  <div className="tg-cell-sub">{debtor.district || debtor.city || debtor.businessLine}</div>
                </div>
                <Badge color="red" size="sm">{fmtShort(debtor.overdueAmountUzs)}</Badge>
              </div>
            ))}
            {!overdueDebtors.length && <EmptyState title="Muddati o'tgan qarz yo'q" />}
          </div>
        </Panel>
        <Panel title="Yaqin vazifalar" subtitle="Pipeline o'rniga faol ish taxtasi" icon="checkCircle" color="green">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {upcomingTasks.map((task) => {
              const user = data.users.find((row) => row.id === task.assignedUserId);
              return (
                <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => nav("/tasks")}>
                    <Badge color={new Date(task.dueDate).getTime() < Date.now() ? "red" : "blue"} size="sm">
                      {taskColumnsById[task.columnId]?.name || "Vazifa"}
                    </Badge>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="tg-cell-strong">{task.title}</div>
                    <div className="tg-cell-sub">{user?.fullName || "Tayinlanmagan"} • {fmtDate(task.dueDate, true)}</div>
                  </div>
                </div>
              );
            })}
            {!upcomingTasks.length && <EmptyState title="Vazifalar yo'q" />}
          </div>
        </Panel>
      </div>

      <div className="grid-dash">
        <Panel title="Yangi mijozlar" subtitle="Oxirgi qo'shilgan kartalar" icon="users" color="blue" pad={false}>
          <div className="tg-table-wrap">
            <table className="tg-table">
              <thead><tr><th>Mijoz</th><th>Telefon</th><th>Holat</th><th>Subsidya</th></tr></thead>
              <tbody>
                {latestCustomers.map((customer) => (
                  <tr key={customer.id} data-clickable="1" onClick={() => nav("/customers/" + customer.id)}>
                    <td><div className="tg-cell-strong">{customer.fullName}</div></td>
                    <td>{customer.phone || "—"}</td>
                    <td><StatusBadge status={customer.status || "active"} label={dashboardStatusLabel(customer.statusName || customer.status)} /></td>
                    <td>{fmtUZS(customer.debtBalanceUzs || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title="Faol mahsulotlar" subtitle="Ombordagi asosiy pozitsiyalar" icon="box" color="green">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bestProducts.map((product) => (
              <div key={product.id} style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }} onClick={() => nav("/products/" + product.id)}>
                <div style={{ width: 42, height: 42, flexShrink: 0 }}><ACUnit product={product} size="sm" /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{product.model}</div>
                  <div style={{ fontSize: 11.5, color: "var(--text-3)" }}>{fmtUZS(product.priceUzs)}</div>
                </div>
                <Badge color={(product.stockQuantity || 0) < 5 ? "amber" : "green"} size="sm">{product.stockQuantity || 0} ta</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      {taskLoad.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <Panel title="Jamoa yuklamasi" subtitle="Xodimlar bo'yicha vazifa taqsimoti" icon="users" color="violet" pad={false}>
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead><tr><th>Xodim</th><th>Ochiq vazifa</th><th>Bajarilgan</th></tr></thead>
                <tbody>
                  {taskLoad.map(({ user, openTasks, doneTasks }) => (
                    <tr key={user.id}>
                      <td><div style={{ display: "flex", alignItems: "center", gap: 9 }}><Avatar name={user.fullName} hue={user.avatarHue} size={30} /><span className="tg-cell-strong">{user.fullName}</span></div></td>
                      <td><Badge color="blue" size="sm">{openTasks}</Badge></td>
                      <td><Badge color="green" size="sm">{doneTasks}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
}

window.DashboardPage = DashboardPage;
