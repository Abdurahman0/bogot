/* pages/analytics.jsx */
const { useState: anS, useMemo: anM } = React;
const ANALYTICS_UI = {
  uz: {
    pageDesc: "Lead, qarzdorlik va moliyaviy ko'rsatkichlar", generalCrumb: "Umumiy",
    heroTitle: "CRM analitikasi", heroSub: "Savdo, qarzdorlik va kunlik hisob-kitob holati",
    kpiIncome: "Kirim", kpiExpense: "Chiqim", kpiLeads: "Leadlar", kpiConversion: "Konversiya",
    deltaVs: "o'tgan davrga",
    panelIncomeTrend: "Kirim tendensiyasi", panelIncomeTrendSub: "Kunlik tushumlar (mln so'm)",
    panelLeadSources: "Lead manbalari",
    panelExpenseTrend: "Chiqim tendensiyasi", panelExpenseTrendSub: "Kunlik xarajatlar (mln so'm)",
    panelDebtDist: "Qarzdorlik taqsimoti", centerDebt: "Qarz",
    panelByCategory: "Kategoriya bo'yicha yozuvlar",
    panelActiveProducts: "Faol mahsulotlar",
    bizOld: "Eski biznes", bizSolar: "Quyosh panel biznesi",
  },
  ru: {
    pageDesc: "Показатели лидов, долгов и финансов", generalCrumb: "Общее",
    heroTitle: "CRM Аналитика", heroSub: "Продажи, задолженности и ежедневный учёт",
    kpiIncome: "Доход", kpiExpense: "Расход", kpiLeads: "Лиды", kpiConversion: "Конверсия",
    deltaVs: "к прошлому периоду",
    panelIncomeTrend: "Тенденция дохода", panelIncomeTrendSub: "Ежедневные поступления (млн сум)",
    panelLeadSources: "Источники лидов",
    panelExpenseTrend: "Тенденция расходов", panelExpenseTrendSub: "Ежедневные расходы (млн сум)",
    panelDebtDist: "Распределение долгов", centerDebt: "Долг",
    panelByCategory: "Записи по категориям",
    panelActiveProducts: "Активные товары",
    bizOld: "Старый бизнес", bizSolar: "Бизнес солнечных панелей",
  },
  en: {
    pageDesc: "Lead, debt and financial indicators", generalCrumb: "General",
    heroTitle: "CRM Analytics", heroSub: "Sales, debts and daily accounting status",
    kpiIncome: "Income", kpiExpense: "Expense", kpiLeads: "Leads", kpiConversion: "Conversion",
    deltaVs: "vs prev. period",
    panelIncomeTrend: "Income trend", panelIncomeTrendSub: "Daily receipts (mln UZS)",
    panelLeadSources: "Lead sources",
    panelExpenseTrend: "Expense trend", panelExpenseTrendSub: "Daily expenses (mln UZS)",
    panelDebtDist: "Debt distribution", centerDebt: "Debt",
    panelByCategory: "Records by category",
    panelActiveProducts: "Active products",
    bizOld: "Old business", bizSolar: "Solar panel business",
  },
};
function anLang() { return window.__TG_LANG || "uz"; }
function anTx(key) { return ANALYTICS_UI[anLang()]?.[key] || ANALYTICS_UI.uz[key] || key; }

function AnalyticsPage() {
  const { data, t, nav } = useApp();
  const loading = useLoading(340);
  const [range, setRange] = anS("30d");
  const days = typeof range === "object" ? Math.max(1, Math.round((range.to - range.from) / 86400000)) : ({ today: 1, "7d": 7, "30d": 30, "90d": 90 }[range] || 30);

  const income = anM(() => data.payments.filter(p => p.direction === "income").reduce((s, p) => s + p.amountUzs, 0), [data.payments]);
  const expense = anM(() => data.payments.filter(p => p.direction === "expense").reduce((s, p) => s + p.amountUzs, 0), [data.payments]);
  const leads = data.leads.length;
  const converted = data.leads.filter(l => l.pipelineStage === "completed").length;
  const conversion = leads ? Math.round(converted / leads * 100) : 0;

  const cashflowSeries = anM(() => Array.from({ length: days <= 1 ? 12 : days }, (_, i) => 35 + Math.sin(i * 0.45) * 10 + i * 0.3), [days]);
  const expenseSeries = anM(() => Array.from({ length: days <= 1 ? 12 : days }, (_, i) => 14 + Math.cos(i * 0.55) * 6), [days]);
  const labels = anM(() => Array.from({ length: days <= 1 ? 12 : days }, (_, i) => {
    const d = new Date(Date.now() - (days - i) * 86400000);
    return window.formatUzDate ? window.formatUzDate(d, { day: "numeric", month: "short" }) : `${d.getDate()}-${d.getMonth() + 1}`;
  }), [days]);

  const bySource = anM(() => {
    const counts = {};
    data.leads.forEach(l => counts[l.source] = (counts[l.source] || 0) + 1);
    const colors = { instagram: "#E1306C", telegram: "#229ED9", phone: "#22C55E", manual: "#64748B" };
    return SOURCES.map(s => ({ label: SOURCE_UZ[s], value: counts[s] || 0, color: colors[s] }));
  }, [data.leads]);

  const byBusiness = anM(() => {
    const rows = [
      { label: anTx("bizOld"), value: data.orders.filter(o => o.businessLine === "Eski biznes").reduce((s, o) => s + o.remainingDebtUzs, 0), color: "var(--amber)" },
      { label: anTx("bizSolar"), value: data.orders.filter(o => o.businessLine === "Quyosh panel biznesi").reduce((s, o) => s + o.remainingDebtUzs, 0), color: "var(--blue)" },
    ];
    return rows;
  }, [data.orders]);

  const byCategory = anM(() => {
    const counts = {};
    data.payments.forEach(p => counts[p.category] = (counts[p.category] || 0) + p.amountUzs);
    return Object.entries(counts).map(([label, value], i) => ({ label, value: Math.round(value / 1e6), color: ["#22c55e", "#ef4444", "#3b82f6", "#a855f7", "#f59e0b"][i % 5] })).sort((a, b) => b.value - a.value);
  }, [data.payments]);

  const topProducts = anM(() => [...data.products].filter(p => p.status === "active").slice(0, 8).map((p, i) => ({ p, sales: 8 + (i * 3) + (p.powerKw % 7) })).sort((a, b) => b.sales - a.sales), [data.products]);

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.analytics")} desc={anTx("pageDesc")} crumbs={[{ label: anTx("generalCrumb") }, { label: t("page.analytics") }]}
        actions={<DateRange value={range} onChange={setRange} />} />

      <div className="dash-hero" style={{ background: "linear-gradient(135deg,#0f172a 0%,#1d4ed8 45%,#38bdf8 100%)" }}>
        <div className="dash-hero-content">
          <h1 className="dash-hero-title" style={{ display: "flex", alignItems: "center", gap: 10 }}><I.chart size={20} style={{ opacity: 0.85 }} /> {anTx("heroTitle")}</h1>
          <div className="dash-hero-sub">{anTx("heroSub")}</div>
          <div className="dash-hero-kpis" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            {[
              { label: anTx("kpiIncome"), value: fmtShort(income) + " so'm", delta: 14, icon: "wallet" },
              { label: anTx("kpiExpense"), value: fmtShort(expense) + " so'm", delta: -3, icon: "chart" },
              { label: anTx("kpiLeads"), value: leads, delta: 8, icon: "target" },
              { label: anTx("kpiConversion"), value: conversion + "%", delta: 5, icon: "trendUp" },
            ].map(k => (
              <div key={k.label} className={`dash-hero-tile ${k.delta >= 0 ? "dash-hero-tile-delta-up" : "dash-hero-tile-delta-dn"}`}>
                <div className="dash-hero-tile-head">{React.createElement(I[k.icon], { size: 15 })}<span>{k.label}</span></div>
                <div className="dash-hero-tile-value">{k.value}</div>
                <div className="dash-hero-tile-delta">{k.delta >= 0 ? <I.trendUp size={11} /> : <I.trendDown size={11} />}<span className="dash-hero-tile-delta-pct">{k.delta >= 0 ? "+" : ""}{k.delta}%</span><span className="dash-hero-tile-delta-vs">{anTx("deltaVs")}</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-dash" style={{ marginBottom: 16 }}>
        <Panel title={anTx("panelIncomeTrend")} subtitle={anTx("panelIncomeTrendSub")} icon="chart" color="green">
          {loading ? <div className="skeleton" style={{ height: 220 }} /> : <AreaChart series={cashflowSeries} labels={labels} height={230} color="var(--green)" format={v => v.toFixed(0) + " mln"} />}
        </Panel>
        <Panel title={anTx("panelLeadSources")} icon="funnel" color="violet">
          {loading ? <div className="skeleton" style={{ height: 220 }} /> : <TreemapChart data={bySource} height={230} />}
        </Panel>
      </div>

      <div className="grid-dash" style={{ marginBottom: 16 }}>
        <Panel title={anTx("panelExpenseTrend")} subtitle={anTx("panelExpenseTrendSub")} icon="wallet" color="red">
          {loading ? <div className="skeleton" style={{ height: 220 }} /> : <AreaChart series={expenseSeries} labels={labels} height={230} color="var(--red)" area={false} format={v => v.toFixed(0) + " mln"} />}
        </Panel>
        <Panel title={anTx("panelDebtDist")} icon="layers" color="amber">
          {loading ? <div className="skeleton" style={{ height: 220 }} /> : <Donut data={byBusiness} size={160} centerLabel={anTx("centerDebt")} />}
        </Panel>
      </div>

      <div className="grid-2" style={{ marginBottom: 16 }}>
        <Panel title={anTx("panelByCategory")} icon="box" color="blue">
          {loading ? <div className="skeleton" style={{ height: 200 }} /> : <BarChart data={byCategory} horizontal format={v => v + " mln"} />}
        </Panel>
        <Panel title={anTx("panelActiveProducts")} icon="sun" color="teal">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {topProducts.slice(0, 5).map(({ p, sales }) => (
              <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }} onClick={() => nav("/products/" + p.id)}>
                <ProductPhoto product={p} size="table" />
                <div style={{ flex: 1 }}>
                  <div className="tg-cell-strong">{p.model}</div>
                  <div className="tg-cell-sub">{p.powerKw} kW</div>
                </div>
                <Badge color="green" size="sm">{sales} ta</Badge>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

window.AnalyticsPage = AnalyticsPage;
