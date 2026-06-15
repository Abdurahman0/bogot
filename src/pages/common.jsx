/* pages/common.jsx — shared page-level helpers */
const { useState: pS, useMemo: pM, useEffect: pE } = React;

function PageHeader({ title, desc, crumbs, actions }) {
  const { nav } = { nav: window.navTo };
  return (
    <div>
      {crumbs && (
        <div className="breadcrumb">
          {crumbs.map((c, i) => (
            <React.Fragment key={i}>
              {i > 0 && <I.chevRight size={13} />}
              {c.to ? <a href={c.to} onClick={(e) => { e.preventDefault(); window.navTo(c.to); }}>{c.label}</a> : <span style={{ color: "var(--text-2)" }}>{c.label}</span>}
            </React.Fragment>
          ))}
        </div>
      )}
      <div className="page-head">
        <div>
          <h1 className="page-title">{title}</h1>
          {desc && <div className="page-desc">{desc}</div>}
        </div>
        {actions && <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>{actions}</div>}
      </div>
    </div>
  );
}

// ---------- Custom Calendar picker ----------
const MONTHS_UZ = ["Yanvar","Fevral","Mart","Aprel","May","Iyun","Iyul","Avgust","Sentabr","Oktabr","Noyabr","Dekabr"];
const DAYS_UZ   = ["Du","Se","Ch","Pa","Ju","Sh","Ya"];

function CalendarPicker({ onSelect, onClose }) {
  const now = new Date(); now.setHours(0,0,0,0);
  const [vy, setVy] = pS(now.getFullYear());
  const [vm, setVm] = pS(now.getMonth());
  const [from, setFrom] = pS(null);
  const [hover, setHover] = pS(null);

  const prevM = () => { if (vm === 0) { setVy(y=>y-1); setVm(11); } else setVm(m=>m-1); };
  const nextM = () => { if (vm === 11) { setVy(y=>y+1); setVm(0); } else setVm(m=>m+1); };

  const firstDow = (new Date(vy, vm, 1).getDay() + 6) % 7; // Mon=0
  const daysInM  = new Date(vy, vm + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInM; d++) {
    const dt = new Date(vy, vm, d);
    cells.push(dt);
  }

  const sameDay = (a, b) => a && b && a.getTime() === b.getTime();
  const inRange = (d) => {
    if (!from || !hover || !d) return false;
    const lo = from < hover ? from : hover;
    const hi = from < hover ? hover : from;
    return d > lo && d < hi;
  };

  const handleDay = (d) => {
    if (!from) { setFrom(d); return; }
    let a = from, b = d;
    if (b < a) { [a,b] = [b,a]; }
    onSelect({ from: a, to: b });
  };

  const navBtn = (onClick, icon) => (
    <button onClick={onClick} style={{
      width: 28, height: 28, borderRadius: 8, border: "none", cursor: "pointer",
      background: "transparent", color: "var(--text-2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "background .12s, color .12s",
    }}
    onMouseEnter={e => { e.currentTarget.style.background="var(--surface-3)"; e.currentTarget.style.color="var(--text)"; }}
    onMouseLeave={e => { e.currentTarget.style.background="transparent"; e.currentTarget.style.color="var(--text-2)"; }}>
      {icon}
    </button>
  );

  return (
    <div className="pop-in" style={{
      position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 300,
      width: 272, background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 16, boxShadow: "0 12px 40px rgba(0,0,0,0.45)", padding: 16,
      userSelect: "none",
    }}>
      {/* Month nav */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        {navBtn(prevM, <I.chevLeft size={15} />)}
        <span style={{ fontWeight: 660, fontSize: 13.5, color: "var(--text)" }}>
          {MONTHS_UZ[vm]} {vy}
        </span>
        {navBtn(nextM, <I.chevRight size={15} />)}
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 }}>
        {DAYS_UZ.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 10.5, fontWeight: 650, color: "var(--text-3)", padding: "2px 0" }}>{d}</div>
        ))}
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const isFrom = sameDay(d, from);
          const isHov  = sameDay(d, hover);
          const isEnd  = from && hover && sameDay(d, from < hover ? hover : from) && !sameDay(d, from);
          const isStart= from && sameDay(d, from) && hover && !sameDay(d, hover);
          const sel    = sameDay(d, from) || (from && hover && sameDay(d, from < hover ? hover : from));
          const inR    = inRange(d);
          const isToday= sameDay(d, now);

          const bg = sel ? "var(--accent)"
                   : inR  ? "rgba(var(--accent-rgb),0.14)"
                   : "transparent";
          const col = sel ? "#fff"
                    : inR  ? "var(--text)"
                    : isToday ? "var(--accent)"
                    : "var(--text-2)";
          const fw = sel || isToday ? 700 : 400;

          return (
            <button key={i}
              onClick={() => handleDay(d)}
              onMouseEnter={() => from && setHover(d)}
              onMouseLeave={() => from && setHover(null)}
              style={{
                width: "100%", aspectRatio: "1", border: "none", cursor: "pointer",
                borderRadius: 8, background: bg, color: col, fontSize: 12.5,
                fontWeight: fw, transition: "background .1s, color .1s",
                position: "relative",
              }}
              onMouseOver={e => { if (!sel && !inR) e.currentTarget.style.background="var(--surface-3)"; }}
              onMouseOut={e => { if (!sel && !inR) e.currentTarget.style.background=bg; }}
            >
              {d.getDate()}
              {isToday && !sel && (
                <span style={{
                  position: "absolute", bottom: 3, left: "50%", transform: "translateX(-50%)",
                  width: 3, height: 3, borderRadius: "50%", background: "var(--accent)",
                }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer hint */}
      <div style={{ marginTop: 12, fontSize: 11.5, color: "var(--text-3)", textAlign: "center" }}>
        {from ? "Tugash sanasini tanlang" : "Boshlanish sanasini tanlang"}
      </div>
    </div>
  );
}

// date-range selector
function DateRange({ value, onChange }) {
  const [calOpen, setCalOpen] = pS(false);
  const ref = React.useRef(null);

  pE(() => {
    if (!calOpen) return;
    const on = (e) => { if (ref.current && !ref.current.contains(e.target)) setCalOpen(false); };
    document.addEventListener("mousedown", on);
    return () => document.removeEventListener("mousedown", on);
  }, [calOpen]);

  const presets = [
    { value: "today", label: "Bugun" },
    { value: "7d",    label: "7 kun" },
    { value: "30d",   label: "30 kun" },
    { value: "90d",   label: "90 kun" },
  ];

  const isCustom = value && typeof value === "object";

  const fmtDate = (d) => d.toLocaleDateString("ru", { day: "numeric", month: "short" });
  const customLabel = isCustom ? `${fmtDate(value.from)} – ${fmtDate(value.to)}` : null;

  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }} ref={ref}>
      {/* Preset segmented */}
      <div className="tg-seg">
        {presets.map(p => (
          <button key={p.value} className="tg-seg-btn"
            data-active={!isCustom && value === p.value ? "1" : undefined}
            onClick={() => { onChange(p.value); setCalOpen(false); }}>
            <span>{p.label}</span>
          </button>
        ))}
      </div>

      {/* Calendar trigger */}
      <div style={{ position: "relative" }}>
        <button
          className="tg-seg-btn"
          data-active={isCustom || calOpen ? "1" : undefined}
          onClick={() => setCalOpen(o => !o)}
          title="Sana oralig'i tanlash"
          style={{
            height: 34, borderRadius: 8, gap: 6,
            background: isCustom ? "rgba(var(--accent-rgb),0.13)" : undefined,
            color: isCustom ? "var(--accent)" : undefined,
            border: isCustom ? "1px solid rgba(var(--accent-rgb),0.35)" : "1px solid transparent",
            padding: isCustom ? "0 10px" : "0 8px",
          }}>
          <I.calendar size={14} />
          {isCustom && <span style={{ fontSize: 12, fontWeight: 600 }}>{customLabel}</span>}
        </button>

        {calOpen && (
          <CalendarPicker
            onSelect={(range) => { onChange(range); setCalOpen(false); }}
            onClose={() => setCalOpen(false)}
          />
        )}
      </div>
    </div>
  );
}

// KPI card
function KpiCard({ label, value, delta, icon, color = "accent", spark, onClick }) {
  const Ico = I[icon] || I.chart;
  return (
    <Card hover={!!onClick} onClick={onClick} className="kpi-card">
      <div className="kpi">
        <div className="kpi-top">
          <div>
            <div className="kpi-label">{label}</div>
            <div className="kpi-val" style={{ marginTop: 8 }}>{value}</div>
          </div>
          <div className="kpi-icon" style={{ color: `var(--${color})`, background: `var(--${color}-bg)` }}><Ico size={20} /></div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          {delta != null ? <Delta value={delta} /> : <span />}
          {spark && <div style={{ width: 80 }}><Sparkline data={spark} height={28} color={`var(--${color})`} /></div>}
        </div>
      </div>
    </Card>
  );
}

// simple multiselect filter dropdown
function FilterSelect({ label, icon, options, value, onChange, multi }) {
  const [open, setOpen] = pS(false);
  const ref = React.useRef(null);
  pE(() => {
    if (!open) return;
    const on = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", on); return () => document.removeEventListener("mousedown", on);
  }, [open]);
  const Ico = icon ? I[icon] : null;
  const count = multi ? value.length : (value && value !== "all" ? 1 : 0);
  const toggle = (v) => {
    if (multi) onChange(value.includes(v) ? value.filter(x => x !== v) : [...value, v]);
    else { onChange(v); setOpen(false); }
  };
  return (
    <div className="tg-dd" ref={ref}>
      <button className="tg-btn tg-btn-default tg-btn-sm" data-active={count ? "1" : undefined} onClick={() => setOpen(o => !o)} style={count ? { borderColor: "var(--accent)", color: "var(--accent)" } : {}}>
        {Ico && <Ico size={15} />}{label}{count > 0 && <span className="tg-tab-count" style={{ background: "var(--accent)", color: "#fff" }}>{count}</span>}<I.chevDown size={14} />
      </button>
      {open && (
        <div className="tg-dd-menu tg-dd-left pop-in" style={{ width: 210, maxHeight: 320, overflowY: "auto" }}>
          {!multi && <button className="tg-dd-item" onClick={() => toggle("all")}><span>Barchasi</span>{(value === "all" || !value) && <I.check size={15} style={{ color: "var(--accent)", marginLeft: "auto" }} />}</button>}
          {options.map(o => {
            const sel = multi ? value.includes(o.value) : value === o.value;
            return (
              <button key={o.value} className="tg-dd-item" onClick={() => toggle(o.value)}>
                {multi && <span className="tg-check" data-on={sel ? "1" : undefined} style={{ width: 16, height: 16 }}>{sel && <I.check size={11} stroke={3} />}</span>}
                <span style={{ flex: 1 }}>{o.label}</span>
                {!multi && sel && <I.check size={15} style={{ color: "var(--accent)" }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// stat tile (small)
function StatTile({ label, value, sub, color }) {
  return (
    <div style={{ padding: "14px 16px", background: "var(--surface-2)", borderRadius: 12, border: "1px solid var(--border)" }}>
      <div style={{ fontSize: 12, color: "var(--text-3)", fontWeight: 540 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 720, marginTop: 4, color: color ? `var(--${color})` : "var(--text)", letterSpacing: "-.02em" }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: "var(--text-3)", marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// section card with title
function Panel({ title, subtitle, icon, color, action, children, pad = true, className = "" }) {
  return (
    <Card pad={false} className={className}>
      {(title || action) && (
        <div style={{ padding: "16px 18px", borderBottom: pad ? "1px solid var(--border)" : "none", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <CardHead title={title} subtitle={subtitle} icon={icon ? React.createElement(I[icon], { size: 17 }) : null} color={color} />
          {action}
        </div>
      )}
      <div style={pad ? { padding: 18 } : {}}>{children}</div>
    </Card>
  );
}

// feature chips for products
const FEATURE_ICONS = { hybrid: "zapline", battery: "zap", monitoring: "chart", threePhase: "layers", fastInstall: "clock", netMetering: "refresh" };
const FEATURE_LABELS = { hybrid: "Gibrid", battery: "Batareya", monitoring: "Monitoring", threePhase: "3 faza", fastInstall: "Tez montaj", netMetering: "Net-metering" };
function FeatureChips({ product, max = 4 }) {
  const feats = [];
  if (product.category === "Gibrid stansiya") feats.push("hybrid");
  if (product.batteryCapacityKwh > 0) feats.push("battery");
  if (product.phaseCount === 3) feats.push("threePhase");
  if ((product.installationDays || 0) <= 3) feats.push("fastInstall");
  if (product.monthlyYieldKwh > 0) feats.push("monitoring");
  const shown = feats.slice(0, max);
  return (
    <div className="tg-chips">
      {shown.map(f => { const Ico = I[FEATURE_ICONS[f]]; return <span key={f} className="tg-chip"><Ico size={12} />{FEATURE_LABELS[f]}</span>; })}
      {feats.length > max && <span className="tg-chip">+{feats.length - max}</span>}
    </div>
  );
}

function SourceIcon({ source, size = 15 }) {
  const map = { instagram: { i: "instagram", c: "pink" }, telegram: { i: "send", c: "blue" }, phone: { i: "phone", c: "green" }, manual: { i: "edit", c: "slate" }, referral: { i: "gift", c: "amber" } };
  const cfg = map[source] || map.manual; const Ico = I[cfg.i];
  return <span style={{ color: cfg.c === "slate" ? "var(--text-2)" : `var(--${cfg.c})`, display: "inline-flex" }}><Ico size={size} /></span>;
}

Object.assign(window, { PageHeader, DateRange, KpiCard, FilterSelect, StatTile, Panel, FeatureChips, SourceIcon, FEATURE_ICONS, FEATURE_LABELS });
