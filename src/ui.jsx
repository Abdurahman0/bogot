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
  const { t } = useApp();
  return (
    <div className="tg-search" style={width ? { width } : undefined}>
      <I.search size={16} />
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder || t("common.search")} />
      {value && <button className="tg-search-clear" onClick={() => onChange("")} aria-label={t("common.clear")}><I.x size={14} /></button>}
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
const DATE_PICKER_LOCALE = {
  uz: {
    months: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun", "Iyul", "Avgust", "Sentabr", "Oktabr", "Noyabr", "Dekabr"],
    monthsShort: ["Yan", "Fev", "Mar", "Apr", "May", "Iyn", "Iyl", "Avg", "Sen", "Okt", "Noy", "Dek"],
    days: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"],
  },
  ru: {
    months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
    monthsShort: ["Янв", "Фев", "Мар", "Апр", "Май", "Июн", "Июл", "Авг", "Сен", "Окт", "Ноя", "Дек"],
    days: ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"],
  },
  en: {
    months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthsShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    days: ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
  },
};
const DATE_PICKER_MONTHS = DATE_PICKER_LOCALE.uz.months;
const DATE_PICKER_MONTHS_SHORT = DATE_PICKER_LOCALE.uz.monthsShort;
const DATE_PICKER_DAYS = DATE_PICKER_LOCALE.uz.days;

function datePickerPad(value) {
  return String(value).padStart(2, "0");
}

function datePickerParse(value, mode = "date") {
  const raw = String(value || "").trim();
  if (!raw) return null;
  const [datePart, timePart = ""] = raw.split("T");
  const [year, month, day] = datePart.split("-").map(Number);
  if (!year || !month || !day) return null;
  const [hours = 0, minutes = 0] = timePart.slice(0, 5).split(":").map(Number);
  return new Date(year, month - 1, day, mode === "datetime" ? (hours || 0) : 0, mode === "datetime" ? (minutes || 0) : 0, 0, 0);
}

function datePickerToDateValue(date) {
  return `${date.getFullYear()}-${datePickerPad(date.getMonth() + 1)}-${datePickerPad(date.getDate())}`;
}

function datePickerToDateTimeValue(date) {
  return `${datePickerToDateValue(date)}T${datePickerPad(date.getHours())}:${datePickerPad(date.getMinutes())}`;
}

function formatUzDate(date, options = {}) {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return "";
  const locale = DATE_PICKER_LOCALE[window.__TG_LANG || "uz"] || DATE_PICKER_LOCALE.uz;
  const monthIndex = date.getMonth();
  const monthName = options.month === "short" ? locale.monthsShort[monthIndex] : locale.months[monthIndex];
  if (options.day && options.month && options.year) return `${datePickerPad(date.getDate())} ${monthName} ${date.getFullYear()}`;
  if (options.day && options.month) return `${date.getDate()} ${monthName}`;
  if (options.month && options.year) return `${monthName} ${date.getFullYear()}`;
  return `${datePickerPad(date.getDate())}.${datePickerPad(monthIndex + 1)}.${date.getFullYear()}`;
}

function datePickerDisplay(value, mode = "date") {
  const parsed = datePickerParse(value, mode);
  if (!parsed) return "";
  const dateLabel = formatUzDate(parsed, { day: "2-digit", month: "long", year: "numeric" });
  if (mode !== "datetime") return dateLabel;
  const timeLabel = `${datePickerPad(parsed.getHours())}:${datePickerPad(parsed.getMinutes())}`;
  return `${dateLabel} • ${timeLabel}`;
}

function datePickerMonthMatrix(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstWeekDay = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekDay; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(new Date(year, month, day, 0, 0, 0, 0));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function datePickerIsDisabled(date, min, max) {
  if (!date) return true;
  const current = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const minDate = min ? datePickerParse(min, "date") : null;
  const maxDate = max ? datePickerParse(max, "date") : null;
  if (minDate && current < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime()) return true;
  if (maxDate && current > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()).getTime()) return true;
  return false;
}

function DatePickerInput({ value, onChange, mode = "date", placeholder, disabled, min, max }) {
  const { t, lang } = useApp();
  const ref = uR(null);
  const popRef = uR(null);
  const parsedValue = datePickerParse(value, mode);
  const [open, setOpen] = uS(false);
  const [popoverStyle, setPopoverStyle] = uS(null);
  const [viewDate, setViewDate] = uS(parsedValue || new Date());
  const [draft, setDraft] = uS(value || "");

  const syncFromValue = React.useCallback(() => {
    const nextParsed = datePickerParse(value, mode) || new Date();
    setDraft(value || "");
    setViewDate(nextParsed);
  }, [value, mode]);

  uE(() => {
    if (!open) return;
    syncFromValue();
  }, [open, syncFromValue]);

  const updatePosition = React.useCallback(() => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const popWidth = 324;
    const popHeight = mode === "datetime" ? 420 : 378;
    const gap = 8;
    const viewportPad = 12;
    const spaceBelow = window.innerHeight - rect.bottom - gap - viewportPad;
    const spaceAbove = rect.top - gap - viewportPad;
    const openUp = spaceBelow < popHeight && spaceAbove > spaceBelow;
    const left = Math.min(Math.max(viewportPad, rect.left), window.innerWidth - popWidth - viewportPad);
    const top = openUp
      ? Math.max(viewportPad, rect.top - popHeight - gap)
      : Math.min(rect.bottom + gap, window.innerHeight - popHeight - viewportPad);
    setPopoverStyle({
      position: "fixed",
      top,
      left,
      width: popWidth,
      zIndex: 1250,
    });
  }, [mode]);

  uE(() => {
    if (!open) return;
    updatePosition();
    const handlePointerDown = (event) => {
      if (ref.current && ref.current.contains(event.target)) return;
      if (popRef.current && popRef.current.contains(event.target)) return;
      setOpen(false);
    };
    const handleViewport = () => updatePosition();
    document.addEventListener("pointerdown", handlePointerDown, true);
    window.addEventListener("resize", handleViewport);
    window.addEventListener("scroll", handleViewport, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      window.removeEventListener("resize", handleViewport);
      window.removeEventListener("scroll", handleViewport, true);
    };
  }, [open, updatePosition]);

  const selectedDate = datePickerParse(mode === "datetime" ? draft : value, mode);
  const displayValue = datePickerDisplay(value, mode);
  const timeHours = datePickerPad((selectedDate || new Date()).getHours());
  const timeMinutes = datePickerPad((selectedDate || new Date()).getMinutes());
  const today = new Date();
  const locale = DATE_PICKER_LOCALE[lang] || DATE_PICKER_LOCALE.uz;

  const moveMonth = (delta) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + delta, 1));
  };

  const setTimePart = (key, nextValue) => {
    const current = datePickerParse(draft, "datetime") || new Date();
    const numeric = Math.max(0, Math.min(key === "hours" ? 23 : 59, Number(nextValue) || 0));
    if (key === "hours") current.setHours(numeric);
    if (key === "minutes") current.setMinutes(numeric);
    setDraft(datePickerToDateTimeValue(current));
  };

  const commitValue = (next) => {
    onChange && onChange(next);
  };

  const pickDay = (date) => {
    if (datePickerIsDisabled(date, min, max)) return;
    const current = selectedDate || new Date();
    const next = new Date(date.getFullYear(), date.getMonth(), date.getDate(), current.getHours(), current.getMinutes(), 0, 0);
    setViewDate(next);
    if (mode === "datetime") {
      setDraft(datePickerToDateTimeValue(next));
      return;
    }
    commitValue(datePickerToDateValue(next));
    setOpen(false);
  };

  const applyToday = () => {
    const current = mode === "datetime" ? (selectedDate || new Date()) : new Date();
    const next = new Date(today.getFullYear(), today.getMonth(), today.getDate(), current.getHours(), current.getMinutes(), 0, 0);
    if (mode === "datetime") {
      setDraft(datePickerToDateTimeValue(next));
      setViewDate(next);
      return;
    }
    commitValue(datePickerToDateValue(next));
    setOpen(false);
  };

  const clearValue = () => {
    if (mode === "datetime") setDraft("");
    commitValue("");
    setOpen(false);
  };

  const saveDateTime = () => {
    commitValue(draft || "");
    setOpen(false);
  };

  const cells = datePickerMonthMatrix(viewDate);

  return (
    <div className="tg-dd" ref={ref}>
      <button
        type="button"
        className="tg-input tg-date-trigger"
        disabled={disabled}
        onClick={() => !disabled && setOpen((current) => !current)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="tg-date-trigger-value" data-empty={displayValue ? undefined : "1"}>
          {displayValue || placeholder || (mode === "datetime" ? t("common.selectDateTime") : t("common.selectDate"))}
        </span>
        <span className="tg-date-trigger-icon"><I.calendar size={16} /></span>
      </button>
      {open && popoverStyle && ReactDOM.createPortal(
        <div ref={popRef} className="tg-date-pop pop-in" style={popoverStyle}>
          <div className="tg-date-pop-head">
            <div>
              <div className="tg-date-pop-title">{locale.months[viewDate.getMonth()]} {viewDate.getFullYear()}</div>
              <div className="tg-date-pop-sub">{mode === "datetime" ? t("common.pickDateTime") : t("common.pickDate")}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button type="button" className="tg-date-nav" onClick={() => moveMonth(-1)}><I.chevLeft size={15} /></button>
              <button type="button" className="tg-date-nav" onClick={() => moveMonth(1)}><I.chevRight size={15} /></button>
            </div>
          </div>

          <div className="tg-date-quick">
            <button type="button" className="tg-date-chip" onClick={applyToday}>{t("common.today")}</button>
            {mode === "datetime" && <button type="button" className="tg-date-chip" onClick={() => setDraft(datePickerToDateTimeValue(new Date()))}>{t("common.now")}</button>}
            <button type="button" className="tg-date-chip" onClick={clearValue}>{t("common.clear")}</button>
          </div>

          <div className="tg-date-weekdays">
            {locale.days.map((day) => <span key={day}>{day}</span>)}
          </div>

          <div className="tg-date-grid">
            {cells.map((date, index) => {
              if (!date) return <span key={`empty_${index}`} />;
              const selected = selectedDate
                && date.getFullYear() === selectedDate.getFullYear()
                && date.getMonth() === selectedDate.getMonth()
                && date.getDate() === selectedDate.getDate();
              const isToday = date.getFullYear() === today.getFullYear()
                && date.getMonth() === today.getMonth()
                && date.getDate() === today.getDate();
              const disabledDate = datePickerIsDisabled(date, min, max);
              return (
                <button
                  key={`${date.getFullYear()}_${date.getMonth()}_${date.getDate()}`}
                  type="button"
                  className="tg-date-day"
                  data-selected={selected ? "1" : undefined}
                  data-today={isToday ? "1" : undefined}
                  disabled={disabledDate}
                  onClick={() => pickDay(date)}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {mode === "datetime" && (
            <div className="tg-date-time">
              <div className="tg-date-time-field">
                <span>{t("common.hour")}</span>
                <input
                  className="tg-input"
                  type="number"
                  min="0"
                  max="23"
                  value={timeHours}
                  onChange={(event) => setTimePart("hours", event.target.value)}
                />
              </div>
              <div className="tg-date-time-sep">:</div>
              <div className="tg-date-time-field">
                <span>{t("common.minute")}</span>
                <input
                  className="tg-input"
                  type="number"
                  min="0"
                  max="59"
                  value={timeMinutes}
                  onChange={(event) => setTimePart("minutes", event.target.value)}
                />
              </div>
            </div>
          )}

          {mode === "datetime" && (
            <div className="tg-date-actions">
              <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>{t("common.cancel")}</Button>
              <Button variant="primary" size="sm" onClick={saveDateTime}>{t("common.save")}</Button>
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}
function Select({ value, defaultValue, onChange, options, placeholder, style, disabled, ...rest }) {
  const { t } = useApp();
  const [open, setOpen] = uS(false);
  const [innerValue, setInnerValue] = uS(defaultValue ?? options?.[0]?.value ?? "");
  const ref = uR(null);
  const controlled = value !== undefined;
  const currentValue = controlled ? value : innerValue;
  const selected = options.find(o => o.value === currentValue) || null;
  uE(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("pointerdown", onDoc, true);
    return () => document.removeEventListener("pointerdown", onDoc, true);
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
          {selected ? selected.label : (placeholder || t("common.select"))}
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
  const menuRef = uR(null);
  const [menuStyle, setMenuStyle] = uS(null);

  const updatePosition = () => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const gap = 6;
    const viewportPad = 12;
    const menuWidth = Number(width) || 200;
    const estimatedHeight = Math.min(320, items.filter((item) => !item.divider).length * 42 + items.filter((item) => item.divider).length * 12 + 12);
    const spaceBelow = window.innerHeight - rect.bottom - gap - viewportPad;
    const spaceAbove = rect.top - gap - viewportPad;
    const openUp = direction === "up" || (direction !== "down" && spaceBelow < estimatedHeight && spaceAbove > spaceBelow);
    const left = align === "left"
      ? Math.min(Math.max(viewportPad, rect.left), window.innerWidth - menuWidth - viewportPad)
      : Math.min(Math.max(viewportPad, rect.right - menuWidth), window.innerWidth - menuWidth - viewportPad);
    const top = openUp
      ? Math.max(viewportPad, rect.top - estimatedHeight - gap)
      : Math.min(rect.bottom + gap, window.innerHeight - estimatedHeight - viewportPad);

    setMenuStyle({
      position: "fixed",
      top,
      left,
      width: menuWidth,
      maxHeight: Math.max(120, window.innerHeight - top - viewportPad),
      overflowY: "auto",
      zIndex: 1200,
    });
  };

  uE(() => {
    if (!open) return;
    updatePosition();
    const on = (e) => {
      if (ref.current && ref.current.contains(e.target)) return;
      if (menuRef.current && menuRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onViewportChange = () => updatePosition();
    document.addEventListener("pointerdown", on, true);
    window.addEventListener("resize", onViewportChange);
    window.addEventListener("scroll", onViewportChange, true);
    return () => {
      document.removeEventListener("pointerdown", on, true);
      window.removeEventListener("resize", onViewportChange);
      window.removeEventListener("scroll", onViewportChange, true);
    };
  }, [open, align, direction, items, width]);

  uE(() => {
    if (!open || !menuRef.current || !ref.current) return;
    const frame = window.requestAnimationFrame(() => {
      const rect = ref.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      const gap = 6;
      const viewportPad = 12;
      const openUp = direction === "up" || (direction !== "down" && window.innerHeight - rect.bottom - gap - viewportPad < menuRect.height && rect.top > window.innerHeight - rect.bottom);
      const left = align === "left"
        ? Math.min(Math.max(viewportPad, rect.left), window.innerWidth - menuRect.width - viewportPad)
        : Math.min(Math.max(viewportPad, rect.right - menuRect.width), window.innerWidth - menuRect.width - viewportPad);
      const top = openUp
        ? Math.max(viewportPad, rect.top - menuRect.height - gap)
        : Math.min(rect.bottom + gap, window.innerHeight - menuRect.height - viewportPad);
      setMenuStyle((current) => current ? { ...current, top, left, width: menuRect.width, maxHeight: Math.max(120, window.innerHeight - top - viewportPad) } : current);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [open, align, direction, items.length]);
  return (
    <div className="tg-dd" ref={ref}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && menuStyle && ReactDOM.createPortal((
        <div ref={menuRef} className="tg-dd-menu pop-in" style={menuStyle}>
          {items.map((it, i) => it.divider ? <div key={i} className="tg-dd-divider" /> : (
            <button key={i} className="tg-dd-item" data-danger={it.danger ? "1" : undefined}
              onClick={() => { setOpen(false); it.onClick && it.onClick(); }}>
              {it.icon}<span>{it.label}</span>{it.right}
            </button>
          ))}
        </div>
      ), document.body)}
    </div>
  );
}

// ---------- Modal ----------
function Modal({ open, onClose, title, children, footer, width = 540, icon }) {
  const { t } = useApp();
  uE(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const on = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", on);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", on);
    };
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
          <IconButton icon={<I.x size={18} />} label={t("common.close")} onClick={onClose} />
        </div>
        <div className="tg-modal-body">{children}</div>
        {footer && <div className="tg-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- Drawer ----------
function Drawer({ open, onClose, title, children, footer, width = 460, side = "right" }) {
  const { t } = useApp();
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
          <IconButton icon={<I.x size={18} />} label={t("common.close")} onClick={onClose} />
        </div>
        <div className="tg-drawer-body">{children}</div>
        {footer && <div className="tg-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

// ---------- ConfirmDialog ----------
function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = "Tasdiqlash", danger, details }) {
  const { t } = useApp();
  uE(() => {
    if (!open) return;
    const on = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", on);
    return () => document.removeEventListener("keydown", on);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="tg-confirm-overlay" onMouseDown={onClose}>
      <section className="tg-confirm-dialog pop-in" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={title}>
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span className="tg-card-icon" style={{ width: 34, height: 34, color: danger ? "var(--red)" : "var(--amber)", background: danger ? "var(--red-bg)" : "var(--amber-bg)" }}>
                <I.alert size={17} />
              </span>
              <div style={{ fontSize: 11, fontWeight: 760, letterSpacing: ".14em", textTransform: "uppercase", color: danger ? "var(--red)" : "var(--amber)" }}>
                {danger ? t("common.warning") : t("common.confirm")}
              </div>
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, lineHeight: 1.05, letterSpacing: "-.03em" }}>{title}</div>
            <p style={{ color: "var(--text-2)", margin: 0, lineHeight: 1.65 }}>{message}</p>
          </div>
          {details && (
            <div style={{ padding: "12px 14px", borderRadius: 16, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <div className="tg-cell-sub" style={{ whiteSpace: "pre-line", lineHeight: 1.6 }}>{details}</div>
            </div>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: 10 }}>
            <Button variant="ghost" onClick={onClose}>{t("common.cancel")}</Button>
            <Button variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel === "Tasdiqlash" ? t("common.confirm") : confirmLabel}</Button>
          </div>
        </div>
      </section>
    </div>
  );
}


// ---------- EmptyState ----------
function EmptyState({ icon, title, message, action }) {
  const { t } = useApp();
  return (
    <div className="tg-empty">
      <div className="tg-empty-icon">{icon || <I.inbox size={26} />}</div>
      <div className="tg-empty-title">{title || t("common.noData")}</div>
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
  const accent = window.productAccentColor ? window.productAccentColor(product) : "var(--accent)";
  const categoryLabel = window.productDisplayCategory ? window.productDisplayCategory(product) : (product.category || "Kategoriyasiz");
  const powerLabel = categoryLabel || "CRM";
  const image = (product.images || []).find(img => img.isPrimary) || (product.images || [])[0];
  return (
    <div className={"ac-illu ac-" + size + " " + className} style={{ "--brand": accent }}>
      <div className="ac-bg" style={{ background: `radial-gradient(120% 120% at 30% 10%, ${accent}22, transparent 60%)` }} />
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
            <div className="ac-led" style={{ background: accent }} />
            <div className="ac-brandtag" style={{ color: "#64748b" }}>{categoryLabel}</div>
          </>
        )}
      </div>
      <div className="ac-airflow"><span /><span /><span /></div>
      <div className="ac-btu">{powerLabel}</div>
    </div>
  );
}

function productImageSrc(image) {
  if (!image) return "";
  if (typeof image === "string") return window.apiMediaUrl ? window.apiMediaUrl(image) : image;
  const raw = image.url || image.image_url || image.image || image.picture || image.photo || image.thumbnail || "";
  return window.apiMediaUrl ? window.apiMediaUrl(raw) : raw;
}

function productImages(product = {}) {
  const images = [
    ...(product.images || []),
    ...(product.pictures || []),
    ...(product.product_pictures || []),
  ];
  ["image_url", "image", "picture", "photo", "thumbnail"].forEach((key) => {
    if (product[key]) images.push({ id: `${product.id || "product"}_${key}`, [key]: product[key] });
  });
  return images
    .map((image, index) => ({
      id: image.id || `product_img_${product.id || "new"}_${index}`,
      url: productImageSrc(image),
      alt: image.alt || image.name || product.name || product.model || "Mahsulot rasmi",
      isPrimary: !!image.isPrimary || !!image.is_primary || index === 0,
    }))
    .filter((image) => image.url);
}

function ProductPhoto({ product, image, size = "md", fit = "cover", className = "", onClick }) {
  const selected = image ? {
    id: image.id || "selected",
    url: productImageSrc(image),
    alt: image.alt || product?.name || product?.model || "Mahsulot rasmi",
    isPrimary: !!image.isPrimary,
  } : productImages(product)[0];
  const hasImage = !!selected?.url;
  const name = window.productDisplayName ? window.productDisplayName(product) : (product?.name || product?.model || "Mahsulot");
  const Tag = hasImage && onClick ? "button" : "div";

  return (
    <Tag
      {...(Tag === "button" ? { type: "button" } : {})}
      className={`product-photo product-photo-${size} ${className}`}
      data-empty={hasImage ? undefined : "1"}
      onClick={hasImage ? onClick : undefined}
      title={hasImage && onClick ? "Rasmni kattalashtirish" : name}
    >
      {hasImage ? (
        <img src={selected.url} alt={selected.alt || name} style={{ objectFit: fit }} loading="lazy" />
      ) : (
        <ACUnit product={product} size={size === "thumb" ? "sm" : size} />
      )}
    </Tag>
  );
}

function ProductImageModal({ open, onClose, product, image }) {
  const selected = image ? {
    url: productImageSrc(image),
    alt: image.alt || product?.name || product?.model || "Mahsulot rasmi",
  } : productImages(product)[0];
  if (!selected?.url) return null;
  return (
    <Modal open={open} onClose={onClose} title={selected.alt || "Mahsulot rasmi"} icon={<I.image size={18} />} width={1120}>
      <div className="product-lightbox">
        <img src={selected.url} alt={selected.alt || "Mahsulot rasmi"} />
      </div>
    </Modal>
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
    document.addEventListener("pointerdown", on, true);
    return () => document.removeEventListener("pointerdown", on, true);
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
  SearchInput, Field, Input, Textarea, DatePickerInput, Select, Toggle, Dropdown, Modal, Drawer,
  ConfirmDialog, EmptyState, SkeletonRows, useLoading, Progress, Delta, ACUnit,
  productImages, productImageSrc, ProductPhoto, ProductImageModal,
  ExportDropdown, formatUzDate, DATE_PICKER_MONTHS, DATE_PICKER_MONTHS_SHORT,
});
