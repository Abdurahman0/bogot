/* pages/dashboard.jsx */
const { useState: pS, useMemo: pM, useEffect: pE } = React;
const DASHBOARD_UI = {
  uz: {
    heroSub: "Bogot Armada NRG ichki CRM • mijozlar, vazifalar, qarzdorlar va hisob-kitob bitta panelda",
    kpiCustomers: "Jami mijozlar", kpiDebtors: "Qarzdorlar",
    kpiOverdue: "Muddati o'tgan qarz", kpiActiveTasks: "Faol vazifalar",
    panelCashflow: "Pul oqimi tendensiyasi", panelCashflowSub: "Kirim minus chiqim (mln so'm)",
    panelStatus: "Mijoz holatlari", panelStatusSub: "Backend statuslari bo'yicha taqsimot",
    statusNotFound: "Statuslar topilmadi",
    panelDebtorTypes: "Qarzdor turlari", panelDebtorTypesSub: "Backend debtor type kesimi",
    noDebtorTypes: "Qarzdor turlari yo'q", centerStatuses: "Holatlar", centerTypes: "Turlar",
    panelDebtorStatus: "Qarzdor holatlari", panelDebtorStatusSub: "Holat bo'yicha taqsimot",
    debtorHasBalance: "Qoldiq bor", debtorOverdue: "Muddati o'tgan", debtorClosed: "Yopilgan", noDebtorStatus: "Qarzdorlar topilmadi",
    panelAccDay: "Bugungi hisobot kuni", panelAccDaySub: "Accounting day overview",
    accDaySana: "Sana", accDayIzoh: "Izoh", accDayYaratilgan: "Yaratilgan", accDayEmpty: "Kiritilmagan",
    noAccDay: "Accounting day topilmadi", noAccDayMsg: "Backend bugungi hisob kunini hali qaytarmadi.",
    panelOverdue: "Muddati o'tgan qarzdorlar", panelOverdueSub: "Tezkor undirish kerak bo'lgan mijozlar",
    noOverdue: "Muddati o'tgan qarz yo'q",
    panelUpcoming: "Yaqin vazifalar", panelUpcomingSub: "Pipeline o'rniga faol ish taxtasi",
    taskFallback: "Vazifa", unassigned: "Tayinlanmagan", noTasks: "Vazifalar yo'q",
    panelNewCustomers: "Yangi mijozlar", panelNewCustomersSub: "Oxirgi qo'shilgan kartalar",
    colCustomer: "Mijoz", colPhone: "Telefon", colStatus: "Holat", colSubsidy: "Subsidya",
    panelProducts: "Faol mahsulotlar", panelProductsSub: "Ombordagi asosiy pozitsiyalar",
    panelTeamLoad: "Jamoa yuklamasi", panelTeamLoadSub: "Xodimlar bo'yicha vazifa taqsimoti",
    colEmployee: "Xodim", colOpenTasks: "Ochiq vazifa", colDone: "Bajarilgan",
    debtorTypeSolar: "Quyosh panel", debtorTypeOld: "Eski biznes", userFallback: "Foydalanuvchi",
    accIncomeUzs: "Kirim (so'm)", accIncomeUsd: "Dollar kirim", accExpenseUzs: "Chiqim (so'm)", accNetUzs: "Sof oqim",
  },
  ru: {
    heroSub: "Bogot Armada NRG внутренняя CRM • клиенты, задачи, должники и расчёты в одной панели",
    kpiCustomers: "Всего клиентов", kpiDebtors: "Должники",
    kpiOverdue: "Просроченный долг", kpiActiveTasks: "Активные задачи",
    panelCashflow: "Тенденция денежного потока", panelCashflowSub: "Доход минус расход (млн сум)",
    panelStatus: "Статусы клиентов", panelStatusSub: "Распределение по статусам бэкенда",
    statusNotFound: "Статусы не найдены",
    panelDebtorTypes: "Типы должников", panelDebtorTypesSub: "Срез по типам должников бэкенда",
    noDebtorTypes: "Нет типов должников", centerStatuses: "Статусы", centerTypes: "Типы",
    panelDebtorStatus: "Статусы должников", panelDebtorStatusSub: "Разбивка по статусам",
    debtorHasBalance: "Есть остаток", debtorOverdue: "Просрочено", debtorClosed: "Закрыто", noDebtorStatus: "Должники не найдены",
    panelAccDay: "Отчётный день", panelAccDaySub: "Обзор учётного дня",
    accDaySana: "Дата", accDayIzoh: "Комментарий", accDayYaratilgan: "Создано", accDayEmpty: "Не указано",
    noAccDay: "Отчётный день не найден", noAccDayMsg: "Бэкенд ещё не вернул данные за сегодня.",
    panelOverdue: "Просроченные должники", panelOverdueSub: "Клиенты, требующие срочного взыскания",
    noOverdue: "Нет просроченных долгов",
    panelUpcoming: "Ближайшие задачи", panelUpcomingSub: "Активная доска задач",
    taskFallback: "Задача", unassigned: "Не назначено", noTasks: "Нет задач",
    panelNewCustomers: "Новые клиенты", panelNewCustomersSub: "Последние добавленные карточки",
    colCustomer: "Клиент", colPhone: "Телефон", colStatus: "Статус", colSubsidy: "Субсидия",
    panelProducts: "Активные товары", panelProductsSub: "Основные позиции на складе",
    panelTeamLoad: "Нагрузка команды", panelTeamLoadSub: "Распределение задач по сотрудникам",
    colEmployee: "Сотрудник", colOpenTasks: "Открытых задач", colDone: "Выполнено",
    debtorTypeSolar: "Солнечная панель", debtorTypeOld: "Старый бизнес", userFallback: "Пользователь",
    accIncomeUzs: "Приход (сум)", accIncomeUsd: "Приход ($)", accExpenseUzs: "Расход (сум)", accNetUzs: "Чистый поток",
  },
  en: {
    heroSub: "Bogot Armada NRG internal CRM • clients, tasks, debtors and payments in one panel",
    kpiCustomers: "Total clients", kpiDebtors: "Debtors",
    kpiOverdue: "Overdue debt", kpiActiveTasks: "Active tasks",
    panelCashflow: "Cash flow trend", panelCashflowSub: "Income minus expense (mln UZS)",
    panelStatus: "Customer statuses", panelStatusSub: "Distribution by backend statuses",
    statusNotFound: "No statuses found",
    panelDebtorTypes: "Debtor types", panelDebtorTypesSub: "Backend debtor type breakdown",
    noDebtorTypes: "No debtor types", centerStatuses: "Statuses", centerTypes: "Types",
    panelDebtorStatus: "Debtor statuses", panelDebtorStatusSub: "Distribution by status",
    debtorHasBalance: "Has balance", debtorOverdue: "Overdue", debtorClosed: "Closed", noDebtorStatus: "No debtors found",
    panelAccDay: "Today's accounting day", panelAccDaySub: "Accounting day overview",
    accDaySana: "Date", accDayIzoh: "Notes", accDayYaratilgan: "Created", accDayEmpty: "Not set",
    noAccDay: "Accounting day not found", noAccDayMsg: "Backend hasn't returned today's accounting day yet.",
    panelOverdue: "Overdue debtors", panelOverdueSub: "Clients requiring urgent collection",
    noOverdue: "No overdue debts",
    panelUpcoming: "Upcoming tasks", panelUpcomingSub: "Active task board",
    taskFallback: "Task", unassigned: "Unassigned", noTasks: "No tasks",
    panelNewCustomers: "New clients", panelNewCustomersSub: "Recently added cards",
    colCustomer: "Client", colPhone: "Phone", colStatus: "Status", colSubsidy: "Subsidy",
    panelProducts: "Active products", panelProductsSub: "Key positions in stock",
    panelTeamLoad: "Team workload", panelTeamLoadSub: "Task distribution by employees",
    colEmployee: "Employee", colOpenTasks: "Open tasks", colDone: "Done",
    debtorTypeSolar: "Solar panel", debtorTypeOld: "Moto business", userFallback: "User",
    accIncomeUzs: "Income (UZS)", accIncomeUsd: "Dollar income", accExpenseUzs: "Expense (UZS)", accNetUzs: "Net flow",
  },
};
function dashLang() { return window.__TG_LANG || "uz"; }
function dashTx(key) { return DASHBOARD_UI[dashLang()]?.[key] || DASHBOARD_UI.uz[key] || key; }
const DASHBOARD_STATUS_LABELS = {
  uz: { new: "Yangi", active: "Faol", inactive: "Nofaol", pending: "Kutilmoqda", contacted: "Bog'langan", qualified: "Saralangan", confirmed: "Tasdiqlangan", closed: "Yopilgan", lost: "Yo'qotilgan" },
  ru: { new: "Новый", active: "Активный", inactive: "Неактивный", pending: "Ожидание", contacted: "Связались", qualified: "Квалифицирован", confirmed: "Подтверждён", closed: "Закрыт", lost: "Потерян" },
  en: { new: "New", active: "Active", inactive: "Inactive", pending: "Pending", contacted: "Contacted", qualified: "Qualified", confirmed: "Confirmed", closed: "Closed", lost: "Lost" },
};
const DASH_STATUS_NORMALIZE = {
  // Uzbek → canonical key
  "yangi": "new", "faol": "active", "nofaol": "inactive",
  "kutilmoqda": "pending", "bog'langan": "contacted", "bog`langan": "contacted",
  "saralangan": "qualified", "tasdiqlangan": "confirmed",
  "yopilgan": "closed", "yo'qotilgan": "lost", "yo`qotilgan": "lost",
  // Russian → canonical key
  "новый": "new", "активный": "active", "неактивный": "inactive",
  "ожидание": "pending", "связались": "contacted",
  "квалифицирован": "qualified", "подтверждён": "confirmed",
  "закрыт": "closed", "потерян": "lost",
};
const dashboardStatusLabel = (value) => {
  const labels = DASHBOARD_STATUS_LABELS[dashLang()] || DASHBOARD_STATUS_LABELS.uz;
  const raw = String(value || "").trim();
  const key = raw.toLowerCase();
  const normalized = DASH_STATUS_NORMALIZE[key] || key;
  return labels[normalized] || DASHBOARD_STATUS_LABELS.uz[normalized] || raw || dashTx("unassigned");
};

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

function dashboardStatusFallback(customers = []) {
  const counts = {};
  customers.forEach((customer) => {
    const key = String(customer?.statusName || customer?.status || "").trim();
    if (!key) return;
    counts[key] = (counts[key] || 0) + 1;
  });
  return Object.entries(counts).map(([label, value]) => ({ label, value }));
}

function DashboardPage() {
  const { data, t, role, nav, theme } = useApp();
  const isLight = resolveLight(theme);
  const [range, setRange] = pS("30d");
  const loading = useLoading(320);
  const me = data.users.find((user) => user.role === role) || data.authUser || data.users[0] || { fullName: dashTx("userFallback") };
  const overview = data.dashboardOverview || {};
  const clientSummary = overview.clients || {};
  const debtorSummary = overview.debtors || {};
  const accountingDay = overview.accounting_day || null;

  const [dashClients, setDashClients] = pS([]);
  const [dashOrders, setDashOrders] = pS([]);
  const [dashPayments, setDashPayments] = pS([]);
  pE(() => {
    apiGetClientsPage({ page: 1, page_size: 5, ordering: "-created_at" }).then(r => setDashClients(r.results || [])).catch(() => {});
    apiGetDebtorsPage({ page: 1, page_size: 5, ordering: "-overdue_amount_uzs" }).then(r => setDashOrders(r.results || [])).catch(() => {});
    apiGetPaymentsPage({ page: 1, page_size: 200, ordering: "-date" }).then(r => setDashPayments((r.results || []).map(e => {
      const dayMap = Object.fromEntries((data.accountingDays || []).map(d => [d.id, d]));
      return mapApiAccountingEntry ? mapApiAccountingEntry(e, dayMap) : e;
    }))).catch(() => {});
  }, []);
  const days = typeof range === "object" ? Math.max(1, Math.round((range.to - range.from) / 86400000)) : ({ today: 1, "7d": 7, "30d": 30, "90d": 90 }[range] || 30);
  const hour = new Date().getHours();
  const greet = hour < 12 ? t("greeting.morning") : hour < 18 ? t("greeting.day") : t("greeting.evening");

  const customerCount = clientSummary.total_clients ?? dashClients.length;
  const debtorCount = debtorSummary.total_debtors ?? dashOrders.length;
  const overdueDebt = debtorSummary.overdue_amount ?? dashOrders.reduce((sum, row) => sum + (row.overdueAmountUzs || 0), 0);
  const activeTasks = data.tasks.filter((task) => task.columnSlug !== "done" && task.columnSlug !== "canceled");
  const taskColumnsById = Object.fromEntries((data.taskColumns || []).map((column) => [column.id, column]));

  const heroKpis = [
    { label: dashTx("kpiCustomers"), value: customerCount, icon: "users", route: "/customers" },
    { label: dashTx("kpiDebtors"), value: debtorCount, icon: "wallet", route: "/debtors" },
    { label: dashTx("kpiOverdue"), value: `${fmtShort(overdueDebt)} so'm`, icon: "alert", route: "/debtors" },
    { label: dashTx("kpiActiveTasks"), value: activeTasks.length, icon: "checkCircle", route: "/tasks" },
  ];

  const statusData = pM(() => {
    const colorByName = {};
    dashClients.forEach((c) => { if (c.statusName && c.statusColor) colorByName[c.statusName] = c.statusColor; });
    const fallbackColors = ["#2563eb", "#7c3aed", "#0f766e", "#f59e0b", "#dc2626", "#64748b"];
    const byStatus = clientSummary.by_status;
    let rows;
    if (Array.isArray(byStatus) && byStatus.length) {
      rows = byStatus.map((row) => ({
        label: row.status_name || row.label || "",
        value: Number(row.count ?? 0),
        color: row.status_color || colorByName[row.status_name] || null,
      }));
    } else {
      rows = dashboardStatusFallback(dashClients).map((row) => ({
        ...row,
        color: colorByName[row.label] || null,
      }));
    }
    const active = rows.filter((row) => row.value > 0);
    const result = active.length ? active : rows;
    return result.map((row, index) => ({
      label: dashboardStatusLabel(row.label),
      value: row.value,
      color: row.color || fallbackColors[index % fallbackColors.length],
    }));
  }, [clientSummary.by_status, dashClients]);

  const debtorTypeData = pM(() => {
    const rows = dashboardEntries(debtorSummary.by_type, "debtor_type", "count");
    return rows.map((row) => ({
      label: row.label === "solar_panel" ? dashTx("debtorTypeSolar") : row.label === "moto_business" ? dashTx("debtorTypeOld") : row.label,
      value: row.value,
      color: row.label === "solar_panel" ? "#2563eb" : row.label === "moto_business" ? "#f59e0b" : "#06b6d4",
    }));
  }, [debtorSummary.by_type]);

  const debtorStatusData = pM(() => {
    const byStatus = debtorSummary.by_status;
    if (Array.isArray(byStatus) && byStatus.length) {
      const colorMap = { with_debt: "#f59e0b", overdue: "#dc2626", closed: "#10b981" };
      const labelMap = { with_debt: dashTx("debtorHasBalance"), overdue: dashTx("debtorOverdue"), closed: dashTx("debtorClosed") };
      return byStatus.map(row => ({
        label: labelMap[row.status] || row.status,
        value: Number(row.count || row.value || 0),
        color: colorMap[row.status] || "#64748b",
      })).filter(row => row.value > 0);
    }
    const hasBalance = dashOrders.filter(o => Number(o.remainingDebtUzs) > 0 && Number(o.overdueAmountUzs) <= 0).length;
    const overdue = dashOrders.filter(o => Number(o.overdueAmountUzs) > 0).length;
    const closed = dashOrders.filter(o => Number(o.remainingDebtUzs) <= 0).length;
    return [
      { label: dashTx("debtorHasBalance"), value: hasBalance, color: "#f59e0b" },
      { label: dashTx("debtorOverdue"),    value: overdue,     color: "#dc2626" },
      { label: dashTx("debtorClosed"),     value: closed,      color: "#10b981" },
    ].filter(row => row.value > 0);
  }, [debtorSummary.by_status, dashOrders]);

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
    dashPayments.forEach((payment) => {
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
  }, [dashPayments, days]);

  const overdueDebtors = dashOrders.filter((row) => row.overdueAmountUzs > 0).slice(0, 5);

  const upcomingTasks = pM(() => [...data.tasks]
    .filter((task) => task.columnSlug !== "done" && task.columnSlug !== "canceled")
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 6), [data.tasks]);

  const latestCustomers = dashClients.slice(0, 5);

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

  const accIsDollar = (p) => { const m = String(p.method || p.currency || "").toLowerCase(); return m.includes("dollar") || p.rawCategory === "dollar_income" || p.rawCategory === "dollar_expense"; };
  const accUzsIncome = pM(() => dashPayments.filter(p => p.direction === "income" && !accIsDollar(p)).reduce((s, p) => s + p.amountUzs, 0), [dashPayments]);
  const accUsdIncome = pM(() => dashPayments.filter(p => p.direction === "income" && accIsDollar(p)).reduce((s, p) => s + p.amountUzs, 0), [dashPayments]);
  const accUzsExpense = pM(() => dashPayments.filter(p => p.direction === "expense" && !accIsDollar(p)).reduce((s, p) => s + p.amountUzs, 0), [dashPayments]);
  const accUzsNet = accUzsIncome - accUzsExpense;

  return (
    <div className="page fade-in">
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
        <DateRange value={range} onChange={setRange} />
      </div>

      <div className="dash-hero" style={{ background: heroAccentBg(isLight) }}>
        <div className="dash-hero-content">
          <h1 className="dash-hero-title">{greet}, {String(me.fullName || "Foydalanuvchi").split(" ")[0]}</h1>
          <div className="dash-hero-sub">{dashTx("heroSub")}</div>
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

      <div className="grid-kpi" style={{ marginBottom: 16 }}>
        <StatTile label={dashTx("accIncomeUzs")} value={fmtShort(accUzsIncome)} sub="so'm" color="green" />
        <StatTile label={dashTx("accIncomeUsd")} value={Number(accUsdIncome).toLocaleString("en-US")} sub="$" color="teal" />
        <StatTile label={dashTx("accExpenseUzs")} value={fmtShort(accUzsExpense)} sub="so'm" color="red" />
        <StatTile label={dashTx("accNetUzs")} value={fmtShort(accUzsNet)} sub="so'm" color={accUzsNet >= 0 ? "green" : "red"} />
      </div>

      <div className="grid-dash" style={{ marginBottom: 16 }}>
        <Panel title={dashTx("panelCashflow")} subtitle={dashTx("panelCashflowSub")} icon="chart" color="accent">
          {loading ? <div className="skeleton" style={{ height: 220 }} /> : <AreaChart series={finance.series} labels={finance.labels} height={230} format={(value) => `${value} mln`} />}
        </Panel>
        <Panel title={dashTx("panelStatus")} subtitle={dashTx("panelStatusSub")} icon="users" color="violet">
          {loading ? <div className="skeleton" style={{ height: 220 }} /> : statusData.length ? <Donut data={statusData} size={180} centerLabel={dashTx("centerStatuses")} /> : <EmptyState icon={<I.users size={22} />} title={dashTx("statusNotFound")} />}
        </Panel>
      </div>

      <div className="grid-dash" style={{ marginBottom: 16 }}>
        <Panel title={dashTx("panelDebtorStatus")} subtitle={dashTx("panelDebtorStatusSub")} icon="wallet" color="red">
          {debtorStatusData.length ? <Donut data={debtorStatusData} size={180} centerLabel={dashTx("centerStatuses")} /> : <EmptyState icon={<I.wallet size={22} />} title={dashTx("noDebtorStatus")} />}
        </Panel>
        <Panel title={dashTx("panelAccDay")} subtitle={dashTx("panelAccDaySub")} icon="calendar" color="amber">
          {accountingDay ? (
            <div className="tg-meta">
              {[
                [dashTx("accDaySana"), accountingDay.report_date || "—"],
                [dashTx("accDayIzoh"), accountingDay.notes || dashTx("accDayEmpty")],
                [dashTx("accDayYaratilgan"), accountingDay.created_at ? fmtDate(accountingDay.created_at, true) : "—"],
              ].map(([key, value]) => (
                <div key={key} className="tg-meta-row"><span className="tg-meta-k">{key}</span><span className="tg-meta-v">{value}</span></div>
              ))}
            </div>
          ) : (
            <EmptyState icon={<I.calendar size={22} />} title={dashTx("noAccDay")} message={dashTx("noAccDayMsg")} />
          )}
        </Panel>
      </div>

      <div className="grid-dash" style={{ marginBottom: 16 }}>
        <Panel title={dashTx("panelOverdue")} subtitle={dashTx("panelOverdueSub")} icon="wallet" color="red">
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
            {!overdueDebtors.length && <EmptyState title={dashTx("noOverdue")} />}
          </div>
        </Panel>
        <Panel title={dashTx("panelUpcoming")} subtitle={dashTx("panelUpcomingSub")} icon="checkCircle" color="green">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {upcomingTasks.map((task) => {
              const user = data.users.find((row) => row.id === task.assignedUserId);
              return (
                <div key={task.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => nav("/tasks")}>
                    <Badge color={new Date(task.dueDate).getTime() < Date.now() ? "red" : "blue"} size="sm">
                      {taskColumnsById[task.columnId]?.name || dashTx("taskFallback")}
                    </Badge>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="tg-cell-strong">{task.title}</div>
                    <div className="tg-cell-sub">{user?.fullName || dashTx("unassigned")} • {fmtDate(task.dueDate, true)}</div>
                  </div>
                </div>
              );
            })}
            {!upcomingTasks.length && <EmptyState title={dashTx("noTasks")} />}
          </div>
        </Panel>
      </div>

      <div className="grid-dash">
        <Panel title={dashTx("panelNewCustomers")} subtitle={dashTx("panelNewCustomersSub")} icon="users" color="blue" pad={false}>
          <div className="tg-table-wrap">
            <table className="tg-table">
              <thead><tr><th>{dashTx("colCustomer")}</th><th>{dashTx("colPhone")}</th><th>{dashTx("colStatus")}</th><th>{dashTx("colSubsidy")}</th></tr></thead>
              <tbody>
                {latestCustomers.map((customer) => (
                  <tr key={customer.id} data-clickable="1" onClick={() => nav("/customers/" + customer.id)}>
                    <td><div className="tg-cell-strong">{customer.fullName}</div></td>
                    <td>{customer.phone || "—"}</td>
                    <td>
                      {(!customer.statusId && !customer.statusName) ? (
                        <Badge color="slate" size="sm">{dashTx("unassigned")}</Badge>
                      ) : customer.statusColor ? (
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 500, backgroundColor: customer.statusColor + "22", color: customer.statusColor, border: `1px solid ${customer.statusColor}55` }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: customer.statusColor, flexShrink: 0 }} />
                          {dashboardStatusLabel(customer.statusName || customer.status)}
                        </span>
                      ) : (
                        <StatusBadge status={customer.status || "active"} label={dashboardStatusLabel(customer.statusName || customer.status)} />
                      )}
                    </td>
                    <td>{fmtUZS(customer.debtBalanceUzs || 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
        <Panel title={dashTx("panelProducts")} subtitle={dashTx("panelProductsSub")} icon="box" color="green">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {bestProducts.map((product) => (
              <div key={product.id} style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }} onClick={() => nav("/products/" + product.id)}>
                <ProductPhoto product={product} size="table" />
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
          <Panel title={dashTx("panelTeamLoad")} subtitle={dashTx("panelTeamLoadSub")} icon="users" color="violet" pad={false}>
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead><tr><th>{dashTx("colEmployee")}</th><th>{dashTx("colOpenTasks")}</th><th>{dashTx("colDone")}</th></tr></thead>
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
