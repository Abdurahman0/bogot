/* charts.jsx — lightweight SVG charts */
const { useState: cS, useRef: cR, useEffect: cE } = React;

function useWidth() {
  const ref = cR(null);
  const [w, setW] = cS(600);
  cE(() => {
    if (!ref.current) return;
    const ro = new ResizeObserver(es => { for (const e of es) setW(e.contentRect.width); });
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return [ref, w];
}

function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M ${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx},${y0} ${cx},${y1} ${x1},${y1}`;
  }
  return d;
}

// ---------- Area / Line ----------
function AreaChart({ series, height = 220, color = "var(--accent)", labels, format = (v) => v, area = true }) {
  const [ref, w] = useWidth();
  const [hover, setHover] = cS(null);
  const [mounted, setMounted] = cS(false);
  cE(() => { const id = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(id); }, []);
  const labelH = labels ? 20 : 0;
  const svgH = height - labelH;
  const padL = 44, padR = 12, padT = 14, padB = 10;
  const data = series;
  const max = Math.max(...data) * 1.12 || 1;
  const min = Math.min(...data, 0);
  const iw = Math.max(10, w - padL - padR), ih = svgH - padT - padB;
  const x = i => padL + (data.length === 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const y = v => padT + ih - ((v - min) / (max - min)) * ih;
  const pts = data.map((v, i) => [x(i), y(v)]);
  const line = smoothPath(pts);
  const areaPath = line + ` L ${x(data.length - 1)},${padT + ih} L ${x(0)},${padT + ih} Z`;
  const gid = "ag" + Math.round(height + data.length);
  const ticks = 4;
  return (
    <div ref={ref} style={{ width: "100%", height, overflow: "hidden" }}>
      <svg width="100%" height={svgH} style={{ display: "block" }} onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id={gid} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {Array.from({ length: ticks + 1 }).map((_, i) => {
          const v = min + (max - min) * (i / ticks);
          const yy = y(v);
          return <g key={i}>
            <line x1={padL} x2={w - padR} y1={yy} y2={yy} stroke="var(--border-soft)" strokeWidth="1" />
            <text x={padL - 8} y={yy + 4} textAnchor="end" fontSize="10.5" fill="var(--text-3)">{fmtShort(Math.round(v))}</text>
          </g>;
        })}
        {area && <path d={areaPath} fill={`url(#${gid})`}
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.9s ease 0.4s" }} />}
        <path d={line} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={mounted ? 0 : 1}
          style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)" }} />
        {pts.map((p, i) => (
          <g key={i}>
            <rect x={x(i) - iw / data.length / 2} y={padT} width={iw / data.length} height={ih} fill="transparent"
              onMouseEnter={() => setHover(i)} style={{ cursor: "crosshair" }} />
            {hover === i && <>
              <line x1={p[0]} x2={p[0]} y1={padT} y2={padT + ih} stroke={color} strokeWidth="1" strokeDasharray="3 3" opacity="0.5" />
              <circle cx={p[0]} cy={p[1]} r="4.5" fill="var(--surface)" stroke={color} strokeWidth="2.5" />
            </>}
          </g>
        ))}
        {hover != null && (
          <g>
            <rect x={Math.min(Math.max(x(hover) - 46, 2), w - 94)} y={Math.max(y(data[hover]) - 40, 2)} width="92" height="30" rx="7" fill="var(--elevated)" stroke="var(--border)" />
            <text x={Math.min(Math.max(x(hover) - 46, 2), w - 94) + 46} y={Math.max(y(data[hover]) - 40, 2) + 19} textAnchor="middle" fontSize="11.5" fontWeight="650" fill="var(--text)">{format(data[hover])}</text>
          </g>
        )}
      </svg>
      {labels && (() => {
        const step = Math.ceil(labels.length / 7);
        const visible = labels.filter((_, i) => i % step === 0).slice(0, 7);
        return (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "0 12px 0 44px", fontSize: 10.5, color: "var(--text-3)", height: labelH, alignItems: "center", overflow: "hidden" }}>
            {visible.map((l, i) => <span key={i}>{l}</span>)}
          </div>
        );
      })()}
    </div>
  );
}

// ---------- Multi-line ----------
function MultiLine({ datasets, height = 220, labels }) {
  const [ref, w] = useWidth();
  const padL = 44, padR = 12, padT = 14, padB = 10;
  const all = datasets.flatMap(d => d.data);
  const max = Math.max(...all) * 1.12 || 1, min = 0;
  const len = datasets[0].data.length;
  const iw = Math.max(10, w - padL - padR), ih = height - padT - padB;
  const x = i => padL + (i / (len - 1)) * iw;
  const y = v => padT + ih - ((v - min) / (max - min)) * ih;
  return (
    <div ref={ref} style={{ width: "100%" }}>
      <svg width="100%" height={height}>
        {Array.from({ length: 5 }).map((_, i) => {
          const yy = padT + (ih * i / 4);
          return <line key={i} x1={padL} x2={w - padR} y1={yy} y2={yy} stroke="var(--border-soft)" />;
        })}
        {datasets.map((ds, di) => (
          <path key={di} d={smoothPath(ds.data.map((v, i) => [x(i), y(v)]))} fill="none" stroke={ds.color} strokeWidth="2.2" strokeLinecap="round" />
        ))}
      </svg>
    </div>
  );
}

// ---------- Sparkline ----------
function Sparkline({ data, height = 34, color = "var(--accent)", fill = true }) {
  const [ref, w] = useWidth();
  const max = Math.max(...data), min = Math.min(...data);
  const iw = Math.max(10, w), ih = height - 4;
  const x = i => (i / (data.length - 1)) * iw;
  const y = v => 2 + ih - ((v - min) / ((max - min) || 1)) * ih;
  const pts = data.map((v, i) => [x(i), y(v)]);
  const line = smoothPath(pts);
  const gid = "sp" + Math.round(Math.random() * 1e6);
  return (
    <div ref={ref} style={{ width: "100%" }}>
      <svg width="100%" height={height} preserveAspectRatio="none">
        <defs><linearGradient id={gid} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.25" /><stop offset="100%" stopColor={color} stopOpacity="0" /></linearGradient></defs>
        {fill && <path d={line + ` L ${iw},${height} L 0,${height} Z`} fill={`url(#${gid})`} />}
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </svg>
    </div>
  );
}

// ---------- Donut ----------
function Donut({ data, size = 180, thickness = 26, centerLabel, centerValue }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const hoverThickness = thickness + 4;
  const hoverPad = Math.ceil((hoverThickness - thickness) / 2) + 4;
  const svgSize = size + hoverPad * 2;
  const r = (size - hoverThickness) / 2;
  const cx = svgSize / 2;
  const cy = svgSize / 2;
  const C = 2 * Math.PI * r;
  let offset = 0;
  const [hover, setHover] = cS(null);
  const [mounted, setMounted] = cS(false);
  cE(() => { const id = requestAnimationFrame(() => setTimeout(() => setMounted(true), 30)); return () => cancelAnimationFrame(id); }, []);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap", justifyContent: "center" }}>
      <svg width={svgSize} height={svgSize} viewBox={`0 0 ${svgSize} ${svgSize}`} style={{ flexShrink: 0, overflow: "visible" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-3)" strokeWidth={thickness} />
        {data.map((d, i) => {
          const frac = d.value / total;
          const dash = frac * C;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={d.color} strokeWidth={hover === i ? thickness + 4 : thickness}
              strokeDasharray={mounted ? `${dash} ${C - dash}` : `0 ${C}`}
              strokeDashoffset={-offset} transform={`rotate(-90 ${cx} ${cy})`}
              strokeLinecap="butt"
              style={{ transition: `stroke-dasharray 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 80}ms, stroke-width .15s`, cursor: "pointer" }}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} />
          );
          offset += dash;
          return el;
        })}
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="22" fontWeight="730" fill="var(--text)"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.4s ease 0.5s" }}>
          {hover != null ? data[hover].value : (centerValue ?? total)}
        </text>
        <text x={cx} y={cy + 15} textAnchor="middle" fontSize="11" fill="var(--text-3)"
          style={{ opacity: mounted ? 1 : 0, transition: "opacity 0.4s ease 0.5s" }}>
          {hover != null ? data[hover].label : (centerLabel || "Jami")}
        </text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: 9, minWidth: 130 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, opacity: hover == null || hover === i ? 1 : 0.5, transition: "opacity .15s", cursor: "pointer" }}
            onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
            <span style={{ flex: 1, color: "var(--text-2)" }}>{d.label}</span>
            <span style={{ fontWeight: 650 }}>{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Bars ----------
function BarChart({ data, height = 220, horizontal = false, format = (v) => v, color = "var(--accent)", labelWidth = 96, valueWidth = 64, wrapLabels = false }) {
  const [ref, w] = useWidth();
  const [mounted, setMounted] = cS(false);
  cE(() => { const id = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(id); }, []);
  const max = Math.max(...data.map(d => d.value)) * 1.1 || 1;
  if (horizontal) {
    return (
      <div ref={ref} style={{ display: "flex", flexDirection: "column", gap: 11 }}>
        {data.map((d, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: labelWidth,
              fontSize: 12.5,
              color: "var(--text-2)",
              textAlign: "right",
              flexShrink: 0,
              whiteSpace: wrapLabels ? "normal" : "nowrap",
              overflow: wrapLabels ? "visible" : "hidden",
              textOverflow: wrapLabels ? "clip" : "ellipsis",
              lineHeight: 1.25,
            }}>{d.label}</div>
            <div style={{ flex: 1, background: "var(--surface-3)", borderRadius: 7, height: 22, overflow: "hidden" }}>
              <div style={{ width: mounted ? `${d.value / max * 100}%` : "0%", height: "100%", borderRadius: 7, background: d.color || color, transition: `width 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 60}ms`, minWidth: mounted ? 3 : 0 }} />
            </div>
            <div style={{ width: valueWidth, fontSize: 12.5, fontWeight: 650, textAlign: "right", flexShrink: 0 }}>{format(d.value)}</div>
          </div>
        ))}
      </div>
    );
  }
  const padB = 26, padT = 8;
  const bw = Math.max(10, (w - 8) / data.length);
  return (
    <div ref={ref} style={{ width: "100%" }}>
      <svg width="100%" height={height}>
        {data.map((d, i) => {
          const bh = (d.value / max) * (height - padB - padT);
          const bx = i * bw + bw * 0.18;
          const bwid = bw * 0.64;
          return <g key={i}>
            <rect x={bx} y={height - padB - bh} width={bwid} height={bh} rx="5" fill={d.color || color} opacity="0.9">
              <title>{d.label}: {format(d.value)}</title>
            </rect>
            <text x={bx + bwid / 2} y={height - padB + 15} textAnchor="middle" fontSize="10.5" fill="var(--text-3)">{d.label}</text>
          </g>;
        })}
      </svg>
    </div>
  );
}

// ---------- Funnel ----------
function Funnel({ stages }) {
  const max = Math.max(...stages.map(s => s.value)) || 1;
  const [mounted, setMounted] = cS(false);
  cE(() => { const id = requestAnimationFrame(() => setMounted(true)); return () => cancelAnimationFrame(id); }, []);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {stages.map((s, i) => {
        const pct = s.value / max * 100;
        const conv = i > 0 ? Math.round(s.value / stages[i - 1].value * 100) : 100;
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 110, fontSize: 13, color: "var(--text-2)", flexShrink: 0 }}>{s.label}</div>
            <div style={{ flex: 1, position: "relative", height: 34, background: "var(--surface-2)", borderRadius: 8, overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, width: mounted ? `${Math.max(pct, 6)}%` : "0%", background: `linear-gradient(90deg, ${s.color}, ${s.color}cc)`, borderRadius: 8, display: "flex", alignItems: "center", paddingLeft: 12, transition: `width 0.7s cubic-bezier(0.4,0,0.2,1) ${i * 70}ms` }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>{s.value}</span>
              </div>
            </div>
            <div style={{ width: 44, fontSize: 12, color: "var(--text-3)", textAlign: "right", flexShrink: 0 }}>{i > 0 ? conv + "%" : ""}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---------- Gauge ----------
function Gauge({ value, max = 100, size = 130, label, color = "var(--accent)" }) {
  const r = size / 2 - 12, cx = size / 2, cy = size / 2;
  const C = Math.PI * r;
  const frac = Math.min(1, value / max);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <svg width={size} height={size / 2 + 14}>
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="var(--surface-3)" strokeWidth="11" strokeLinecap="round" />
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke={color} strokeWidth="11" strokeLinecap="round"
          strokeDasharray={`${frac * C} ${C}`} style={{ transition: "stroke-dasharray .6s var(--ease)" }} />
        <text x={cx} y={cy - 4} textAnchor="middle" fontSize="24" fontWeight="730" fill="var(--text)">{value}</text>
        {label && <text x={cx} y={cy + 12} textAnchor="middle" fontSize="11" fill="var(--text-3)">{label}</text>}
      </svg>
    </div>
  );
}

/* ── Treemap ────────────────────────────────────────────── */
const SOURCE_ICON_MAP = {
  instagram: "instagram", telegram: "send", phone: "phone",
  manual: "user", referral: "gift",
};

function squarify(items, W, H) {
  if (!items.length || W <= 0 || H <= 0) return [];
  const total = items.reduce((s, d) => s + d.value, 0);
  if (total === 0) return [];
  const normalized = [...items]
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value)
    .map(d => ({ ...d, area: (d.value / total) * W * H }));

  const result = [];

  function worst(row, w) {
    if (!row.length) return Infinity;
    const s = row.reduce((sum, r) => sum + r.area, 0);
    const mx = Math.max(...row.map(r => r.area));
    const mn = Math.min(...row.map(r => r.area));
    return Math.max(w * w * mx / (s * s), s * s / (w * w * mn));
  }

  function placeRow(row, x, y, w, h) {
    const s = row.reduce((sum, r) => sum + r.area, 0);
    if (w >= h) {
      const sw = s / h; let cy = y;
      row.forEach(item => { const th = item.area / sw; result.push({ ...item, x, y: cy, w: sw, h: th }); cy += th; });
      return { x: x + sw, y, w: w - sw, h };
    } else {
      const sh = s / w; let cx = x;
      row.forEach(item => { const tw = item.area / sh; result.push({ ...item, x: cx, y, w: tw, h: sh }); cx += tw; });
      return { x, y: y + sh, w, h: h - sh };
    }
  }

  function layout(rem, x, y, w, h) {
    if (!rem.length || w <= 0 || h <= 0) return;
    let row = [], i = 0;
    while (i < rem.length) {
      const test = [...row, rem[i]];
      if (!row.length || worst(test, Math.min(w, h)) <= worst(row, Math.min(w, h))) { row = test; i++; }
      else { const next = placeRow(row, x, y, w, h); layout(rem.slice(i), next.x, next.y, next.w, next.h); return; }
    }
    if (row.length) placeRow(row, x, y, w, h);
  }

  layout(normalized, 0, 0, W, H);
  return result;
}

function TreemapChart({ data, height = 280 }) {
  const [w, setW] = React.useState(0);
  const ref = React.useRef(null);

  React.useEffect(() => {
    if (!ref.current) return;
    setW(ref.current.getBoundingClientRect().width);
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);

  const GAP = 4;
  const tiles = w > 0 ? squarify(data, w, height) : [];

  return (
    <div ref={ref} style={{ position: "relative", height, overflow: "hidden" }}>
      {tiles.map(tile => {
        const tx = tile.x + GAP, ty = tile.y + GAP;
        const tw = tile.w - GAP * 2, th = tile.h - GAP * 2;
        const iconKey = SOURCE_ICON_MAP[tile.source];
        const iconSize = Math.min(22, tw * 0.22, th * 0.22);
        const fontSize = Math.max(11, Math.min(14, tw / 8));
        const valSize  = Math.max(13, Math.min(18, tw / 6));
        return (
          <div key={tile.source || tile.label}
            style={{
              position: "absolute", left: tx, top: ty, width: tw, height: th,
              background: tile.color, borderRadius: 12,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              color: "#fff", overflow: "hidden", padding: 6,
              userSelect: "none", cursor: "default",
              transition: "filter .15s",
            }}
            onMouseEnter={e => e.currentTarget.style.filter = "brightness(1.1)"}
            onMouseLeave={e => e.currentTarget.style.filter = ""}>
            {iconKey && tw > 44 && th > 44 &&
              React.createElement(I[iconKey] || I.user, { size: iconSize, style: { opacity: 0.92, flexShrink: 0 } })}
            <div style={{ fontSize: Math.max(10, Math.min(13, tw / 7)), fontWeight: 640, marginTop: 5, textAlign: "center", lineHeight: 1.2, opacity: 0.92, maxWidth: tw - 8, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>
              {tile.label}
            </div>
            <div style={{ fontSize: valSize, fontWeight: 740, marginTop: 3, textAlign: "center", lineHeight: 1 }}>
              {tile.value} ta
            </div>
          </div>
        );
      })}
    </div>
  );
}

Object.assign(window, { AreaChart, MultiLine, Sparkline, Donut, BarChart, Funnel, Gauge, TreemapChart });
