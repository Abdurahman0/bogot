/* ui.jsx — shared UI primitives */
const { useState: uS, useEffect: uE, useRef: uR, useMemo: uM } = React;

// ---------- Card ----------
function Card({ children, className = "", style, pad = true, hover, ...rest }) {
  return (
    <div className={"tg-card " + className} style={style} data-hover={hover ? "1" : undefined} {...rest}>
      {pad ? <div className="tg-card-pad">{children}</div> : children}
    </div>
  );
}
function CardHead({ title, subtitle, icon, action, color }) {
  return (
    <div className="tg-card-head">
      <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
        {icon && <span className="tg-card-icon" style={color ? { color: `var(--${color})`, background: `var(--${color}-bg)` } : {}}>{icon}</span>}
        <div style={{ minWidth: 0 }}>
          <div className="tg-card-title">{title}</div>
          {subtitle && <div className="tg-card-sub">{subtitle}</div>}
        </div>
      </div>
      {action}
    </div>
  );
}

// ---------- Button ----------
function Button({ children, variant = "default", size = "md", icon, iconRight, full, active, ...rest }) {
  return (
    <button className={`tg-btn tg-btn-${variant} tg-btn-${size}`} data-active={active ? "1" : undefined}
      style={full ? { width: "100%" } : undefined} {...rest}>
      {icon}{children && <span>{children}</span>}{iconRight}
    </button>
  );
}
function IconButton({ icon, label, badge, ...rest }) {
  return (
    <button className="tg-iconbtn" aria-label={label} title={label} {...rest}>
      {icon}
      {badge != null && badge !== 0 && <span className="tg-iconbtn-badge">{badge > 99 ? "99+" : badge}</span>}
    </button>
  );
}

// ---------- Badge ----------
function Badge({ children, color = "slate", soft = true, dot, size }) {
  const styleMap = {
    slate: { c: "var(--text-2)", bg: "var(--surface-3)" },
  };
  const c = color === "slate" ? "var(--text-2)" : `var(--${color})`;
  const bg = color === "slate" ? "var(--surface-3)" : `var(--${color}-bg)`;
  return (
    <span className="tg-badge" style={{ color: c, background: bg, fontSize: size === "sm" ? 11 : 12 }}>
      {dot && <span className="tg-dot" style={{ background: c }} />}{children}
    </span>
  );
}
const STATUS_COLORS = {
  greeted: "blue", need_identified: "violet", info_collected: "cyan", ready_to_order: "teal", completed: "green", cancelled: "slate",
  contacted: "cyan", sold: "green", rejected: "red",
  active: "green", draft: "amber", archived: "slate", inactive: "slate", suspended: "red",
  verified: "green", "needs-review": "amber", incomplete: "red",
  pending: "amber", overdue: "red", done: "green",
  paid: "green", partial: "amber", unpaid: "slate", cancelled: "red",
  positive: "green", neutral: "slate", negative: "red",
  open: "blue", missed: "red", handoff: "violet", closed: "slate",
  successful: "green", expired: "slate", scheduled: "blue",
  low: "slate", medium: "blue", high: "amber", urgent: "red",
};
const STATUS_ICONS = {
  greeted: "message", need_identified: "target", info_collected: "doc",
  ready_to_order: "cart", completed: "checkCircle", cancelled: "x",
  contacted: "phone", sold: "checkCircle", rejected: "x",
  active: "checkCircle", draft: "edit", archived: "inbox", inactive: "x", suspended: "x",
  verified: "checkCircle", "needs-review": "eye", incomplete: "x",
  pending: "clock", overdue: "clock", done: "checkCircle",
  paid: "checkCircle", partial: "clock", unpaid: "x",
  positive: "trendUp", neutral: "minus", negative: "trendDown",
  open: "message", missed: "phone", handoff: "arrowRight", closed: "x",
  successful: "checkCircle", expired: "x", scheduled: "calendar",
  low: "trendDown", medium: "minus", high: "trendUp", urgent: "zapline",
};
window.STATUS_ICONS = STATUS_ICONS;
function StatusBadge({ status, label, dot = true }) {
  const color = STATUS_COLORS[status] || "slate";
  const iconName = STATUS_ICONS[status];
  const Ico = iconName && I[iconName];
  const textColor = color === "slate" ? "var(--text-2)" : `var(--${color})`;
  const bgColor = color === "slate" ? "var(--surface-3)" : `var(--${color}-bg)`;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "3px 9px 3px 7px", borderRadius: 999,
      background: bgColor, fontSize: 12, fontWeight: 550,
      color: textColor, whiteSpace: "nowrap", lineHeight: 1.4,
    }}>
      {Ico && <Ico size={11} style={{ flexShrink: 0 }} />}
      {label || status}
    </span>
  );
}
window.STATUS_COLORS = STATUS_COLORS;

// ---------- Avatar ----------
function Avatar({ name = "?", hue, size = 34, src }) {
  const initials = name.split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
  const h = hue != null ? hue : (name.charCodeAt(0) * 37) % 360;
  return (
    <div className="tg-avatar" style={{
      width: size, height: size, fontSize: size * 0.4,
      background: `linear-gradient(135deg, hsl(${h} 60% 52%), hsl(${(h + 40) % 360} 62% 44%))`,
    }}>{initials}</div>
  );
}

// ---------- Tabs ----------
function Tabs({ tabs, active, onChange, size = "md" }) {
  return (
    <div className={"tg-tabs tg-tabs-" + size} role="tablist">
      {tabs.map(tb => (
        <button key={tb.value} role="tab" aria-selected={active === tb.value}
          className="tg-tab" data-active={active === tb.value ? "1" : undefined}
          onClick={() => onChange(tb.value)}>
          {tb.icon}{tb.label}{tb.count != null && <span className="tg-tab-count">{tb.count}</span>}
        </button>
      ))}
    </div>
  );
}

// ---------- Segmented ----------
function Segmented({ options, value, onChange }) {
  return (
    <div className="tg-seg">
      {options.map(o => (
        <button key={o.value} className="tg-seg-btn" data-active={value === o.value ? "1" : undefined} onClick={() => onChange(o.value)} title={o.label}>
          {o.icon}{o.label && <span>{o.label}</span>}
        </button>
      ))}
    </div>
  );
}

// ---------- Inputs ----------
function SearchInput({ value, onChange, placeholder, width }) {
  return (
    <div className="tg-search" style={width ? { width } : undefined}>
      <I.search size={16} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || "Qidirish..."} />
      {value && <button className="tg-search-clear" onClick={() => onChange("")} aria-label="clear"><I.x size={14} /></button>}
    </div>
  );
}
function Field({ label, children, hint, required }) {
  return (
    <label className="tg-field">
      {label && <span className="tg-field-label">{label}{required && <span style={{ color: "var(--red)" }}> *</span>}</span>}
      {children}
      {hint && <span className="tg-field-hint">{hint}</span>}
    </label>
  );
}
function Input(props) { return <input className="tg-input" {...props} />; }
function Textarea(props) { return <textarea className="tg-input" rows={3} {...props} />; }
function Select({ value, defaultValue, onChange, options, placeholder, style, disabled, ...rest }) {
  const [open, setOpen] = uS(false);
  const [innerValue, setInnerValue] = uS(defaultValue ?? options?.[0]?.value ?? "");
  const ref = uR(null);
  const controlled = value !== undefined;
  const currentValue = controlled ? value : innerValue;
  const selected = options.find(o => o.value === currentValue) || null;
  uE(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  uE(() => {
    if (controlled) return;
    if (defaultValue !== undefined) setInnerValue(defaultValue);
  }, [defaultValue, controlled]);
  const pick = (next) => {
    if (!controlled) setInnerValue(next);
    onChange && onChange(next);
    setOpen(false);
  };
  return (
    <div className="tg-dd" ref={ref} style={style}>
      <button
        type="button"
        className="tg-input tg-select"
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, textAlign: "left", cursor: disabled ? "not-allowed" : "pointer" }}
        {...rest}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: selected ? "var(--text)" : "var(--text-3)" }}>
          {selected ? selected.label : (placeholder || "Tanlang")}
        </span>
        <I.chevDown size={15} style={{ color: "var(--text-3)", flexShrink: 0 }} />
      </button>
      {open && (
        <div className="tg-dd-menu pop-in" style={{ width: "100%", maxHeight: 280, overflowY: "auto" }} role="listbox">
          {options.map(o => {
            const active = o.value === currentValue;
            return (
              <button key={o.value} className="tg-dd-item" onClick={() => pick(o.value)} type="button" role="option" aria-selected={active}>
                <span style={{ flex: 1 }}>{o.label}</span>
                {active && <I.check size={15} style={{ color: "var(--accent)" }} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
function Toggle({ checked, onChange, label }) {
  return (
    <button className="tg-toggle" data-on={checked ? "1" : undefined} onClick={() => onChange(!checked)} role="switch" aria-checked={checked} aria-label={label}>
      <span className="tg-toggle-knob" />
    </button>
  );
}

// ---------- Dropdown menu ----------
function Dropdown({ trigger, items, align = "right", width = 200, direction = "down" }) {
  const [open, setOpen] = uS(false);
  const ref = uR(null);
  uE(() => {
    if (!open) return;
    const on = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", on);
    return () => document.removeEventListener("mousedown", on);
  }, [open]);
  return (
    <div className="tg-dd" ref={ref}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && (
        <div className={"tg-dd-menu pop-in tg-dd-" + align + (direction === "up" ? " tg-dd-up" : "")} style={{ width }}>
          {items.map((it, i) => it.divider ? <div key={i} className="tg-dd-divider" /> : (
            <button key={i} className="tg-dd-item" data-danger={it.danger ? "1" : undefined}
              onClick={() => { setOpen(false); it.onClick && it.onClick(); }}>
              {it.icon}<span>{it.label}</span>{it.right}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- Modal ----------
function Modal({ open, onClose, title, children, footer, width = 540, icon }) {
  uE(() => {
    if (!open) return;
    const on = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="tg-overlay" onMouseDown={onClose}>
      <div className="tg-modal pop-in" style={{ maxWidth: width }} onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="tg-modal-head">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {icon && <span className="tg-card-icon">{icon}</span>}
            <h3>{title}</h3>
          </div>
          <IconButton icon={<I.x size={18} />} label="Yopish" onClick={onClose} />
        </div>
        <div className="tg-modal-body">{children}</div>
        {footer && <div className="tg-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- Drawer ----------
function Drawer({ open, onClose, title, children, footer, width = 460, side = "right" }) {
  uE(() => {
    if (!open) return;
    const on = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="tg-overlay" onMouseDown={onClose}>
      <div className={"tg-drawer tg-drawer-" + side} style={{ maxWidth: width }} onMouseDown={e => e.stopPropagation()} role="dialog" aria-modal="true">
        <div className="tg-modal-head">
          <h3>{title}</h3>
          <IconButton icon={<I.x size={18} />} label="Yopish" onClick={onClose} />
        </div>
        <div className="tg-drawer-body">{children}</div>
        {footer && <div className="tg-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- ConfirmDialog ----------
function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Tasdiqlash", danger, details }) {
  return (
    <Modal open={open} onClose={onClose} title={title} width={420} icon={<I.alert size={18} style={{ color: danger ? "var(--red)" : "var(--amber)" }} />}
      footer={<>
        <Button variant="ghost" onClick={onClose}>Bekor qilish</Button>
        <Button variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button>
      </>}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ padding: "14px 16px", borderRadius: 14, border: `1px solid ${danger ? "rgba(239,68,68,.22)" : "rgba(245,158,11,.22)"}`, background: danger ? "var(--red-bg)" : "var(--amber-bg)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <span className="tg-card-icon" style={{ width: 30, height: 30, color: danger ? "var(--red)" : "var(--amber)", background: "#fff" }}>
              <I.alert size={16} />
            </span>
            <strong style={{ fontSize: 13.5 }}>{danger ? "Amal qaytarib bo'lmaydi" : "Tasdiqlash talab qilinadi"}</strong>
          </div>
          <p style={{ color: "var(--text-2)", margin: 0, lineHeight: 1.6 }}>{message}</p>
        </div>
        {details && (
          <div style={{ padding: "12px 14px", borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <div className="tg-cell-sub" style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>{details}</div>
          </div>
        )}
      </div>
    </Modal>
  );
}


// ---------- EmptyState ----------
function EmptyState({ icon, title, message, action }) {
  return (
    <div className="tg-empty">
      <div className="tg-empty-icon">{icon || <I.inbox size={26} />}</div>
      <div className="tg-empty-title">{title || "Ma'lumot yo'q"}</div>
      {message && <div className="tg-empty-msg">{message}</div>}
      {action && <div style={{ marginTop: 14 }}>{action}</div>}
    </div>
  );
}

// ---------- Skeleton table ----------
function SkeletonRows({ rows = 6, cols = 5 }) {
  return (
    <div style={{ padding: 6 }}>
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} style={{ display: "flex", gap: 16, padding: "13px 12px", alignItems: "center" }}>
          {Array.from({ length: cols }).map((_, c) => (
            <div key={c} className="skeleton" style={{ height: 13, flex: c === 0 ? 2 : 1, borderRadius: 6 }} />
          ))}
        </div>
      ))}
    </div>
  );
}
// generic loader hook to simulate skeleton
function useLoading(ms = 480) {
  const [loading, setLoading] = uS(true);
  uE(() => { const id = setTimeout(() => setLoading(false), ms); return () => clearTimeout(id); }, []);
  return loading;
}

// ---------- Progress ----------
function Progress({ value, color = "accent", height = 7 }) {
  return (
    <div className="tg-progress" style={{ height }}>
      <div className="tg-progress-bar" style={{ width: Math.min(100, value) + "%", background: color === "accent" ? "var(--accent)" : `var(--${color})` }} />
    </div>
  );
}

// ---------- Stat delta ----------
function Delta({ value, suffix = "%" }) {
  const up = value >= 0;
  return (
    <span className="tg-delta" style={{ color: up ? "var(--green)" : "var(--red)", background: up ? "var(--green-bg)" : "var(--red-bg)" }}>
      {up ? <I.trendUp size={13} /> : <I.trendDown size={13} />}{Math.abs(value)}{suffix}
    </span>
  );
}

// ---------- Product illustration ----------
function ACUnit({ product, size = "md", className = "" }) {
  const brandColor = BRAND_COLORS[product.brand] || "#6366f1";
  const powerLabel = product.powerKw ? `${product.powerKw} kW` : product.btu ? `${product.btu / 1000}K` : (product.category || "CRM");
  const image = (product.images || []).find(img => img.isPrimary) || (product.images || [])[0];
  return (
    <div className={"ac-illu ac-" + size + " " + className} style={{ "--brand": brandColor }}>
      <div className="ac-bg" style={{ background: `radial-gradient(120% 120% at 30% 10%, ${brandColor}22, transparent 60%)` }} />
      <div className="ac-unit" style={{ background: "linear-gradient(170deg, #ffffff, #e2e8f0)", color: "#0f172a", overflow: "hidden" }}>
        {image && image.url ? (
          <img
            src={image.url}
            alt={image.alt || product.model || product.name || "Mahsulot rasmi"}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        ) : (
          <>
            <div className="ac-louvers">
              <span /><span /><span /><span />
            </div>
            <div className="ac-led" style={{ background: brandColor }} />
            <div className="ac-brandtag" style={{ color: "#64748b" }}>{product.brand}</div>
          </>
        )}
      </div>
      <div className="ac-airflow"><span /><span /><span /></div>
      <div className="ac-btu">{powerLabel}</div>
    </div>
  );
}

// ---------- Export / Report dropdown ----------
function FileTypeIcon({ type }) {
  if (type === "pdf") return (
    <svg viewBox="0 0 26 32" width="26" height="32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M2 2.5 C2 1.4 2.9 0.5 4 0.5 L16.5 0.5 L24 8 L24 29.5 C24 30.6 23.1 31.5 22 31.5 L4 31.5 C2.9 31.5 2 30.6 2 29.5 Z" fill="white" stroke="#e03232" strokeWidth="1.8" />
      <path d="M16.5 0.5 L24 8 L17.5 8 C16.95 8 16.5 7.55 16.5 7 Z" fill="white" stroke="#e03232" strokeWidth="1.8" strokeLinejoin="round" />
      <line x1="6" y1="12" x2="18" y2="12" stroke="#c0c0c0" strokeWidth="1" strokeLinecap="round" />
      <line x1="6" y1="14.5" x2="18" y2="14.5" stroke="#c0c0c0" strokeWidth="1" strokeLinecap="round" />
      <line x1="6" y1="17" x2="18" y2="17" stroke="#c0c0c0" strokeWidth="1" strokeLinecap="round" />
      <line x1="6" y1="19.5" x2="18" y2="19.5" stroke="#c0c0c0" strokeWidth="1" strokeLinecap="round" />
      <line x1="6" y1="22" x2="15" y2="22" stroke="#c0c0c0" strokeWidth="1" strokeLinecap="round" />
      <rect x="1" y="23.5" width="17" height="8" rx="1.5" fill="#e03232" />
      <text x="9.5" y="30.2" fill="white" fontSize="5.6" fontWeight="800" textAnchor="middle" fontFamily="Arial, sans-serif" letterSpacing="0.3">PDF</text>
    </svg>
  );

  const label = type === "xlsx" ? "XLSX" : "CSV";
  const body = "#1e8449";
  const fold = "#196f3d";
  const badge = "#145a32";

  return (
    <svg viewBox="0 0 26 32" width="26" height="32" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M2 3 C2 1.9 2.9 1 4 1 L16.5 1 L24 8.5 L24 29 C24 30.1 23.1 31 22 31 L4 31 C2.9 31 2 30.1 2 29 Z" fill={body} />
      <path d="M16.5 1 L24 8.5 L17.5 8.5 C16.95 8.5 16.5 8.05 16.5 7.5 Z" fill={fold} />
      <rect x="1" y="22" width="22" height="9" rx="1.5" fill={badge} />
      <text x="12" y="29.2" fill="white" fontSize={type === "xlsx" ? "4.8" : "5.4"} fontWeight="900" textAnchor="middle" fontFamily="Arial, sans-serif" letterSpacing="0.4">{label}</text>
    </svg>
  );
}

function ExportDropdown({ label = "Hisobot", size = "sm", filename = "export", rows, mapper }) {
  const [open, setOpen] = uS(false);
  const ref = uR(null);
  uE(() => {
    if (!open) return;
    const on = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", on);
    return () => document.removeEventListener("mousedown", on);
  }, [open]);

  const handle = (fmt) => {
    setOpen(false);
    if (fmt !== "pdf" && (!rows || !rows.length || !mapper)) {
      window.toast && window.toast("Eksport uchun ma'lumot topilmadi");
      return;
    }
    if (fmt === "csv")  { window.exportCSV && window.exportCSV(`${filename}.csv`, rows, mapper); return; }
    if (fmt === "xlsx") { window.exportXLS && window.exportXLS(`${filename}.xls`, rows, mapper); return; }
    if (fmt === "pdf")  { window.print(); return; }
  };

  const formats = [
    { key: "csv",  label: "CSV" },
    { key: "xlsx", label: "Excel (XLSX)" },
    { key: "pdf",  label: "PDF" },
  ];

  return (
    <div className="tg-dd" ref={ref} style={{ position: "relative" }}>
      <Button variant="default" size={size} icon={<I.download size={15} />}
        iconRight={<I.chevDown size={13} style={{ opacity: 0.6, marginLeft: -2 }} />}
        onClick={() => setOpen(o => !o)}>
        {label}
      </Button>
      {open && (
        <div className="tg-dd-menu pop-in tg-dd-right" style={{ width: 180, padding: "4px 0" }}>
          {formats.map(fmt => (
            <button key={fmt.key} className="tg-dd-item" style={{ gap: 10, alignItems: "center", padding: "7px 12px" }}
              onClick={() => handle(fmt.key)}>
              <FileTypeIcon type={fmt.key} />
              <span style={{ fontWeight: 600, fontSize: 13 }}>{fmt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  Card, CardHead, Button, IconButton, Badge, StatusBadge, Avatar, Tabs, Segmented,
  SearchInput, Field, Input, Textarea, Select, Toggle, Dropdown, Modal, Drawer,
  ConfirmDialog, EmptyState, SkeletonRows, useLoading, Progress, Delta, ACUnit,
  ExportDropdown,
});
