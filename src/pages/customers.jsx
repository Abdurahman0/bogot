/* pages/customers.jsx */
const { useState: cuS, useMemo: cuM, useEffect: cuE } = React;
const CUSTOMER_UI = {
  uz: {
    unspecified: "Belgilanmagan",
    notEntered: "Kiritilmagan",
    noNotes: "Qo'shimcha eslatma yo'q.",
    allStatuses: "Barcha holatlar",
    customer: "Mijoz",
    source: "Manba",
    system: "Tizim",
    payment: "To'lov",
    amountReceived: "Zalog summa",
    remainingDebt: "Qoldiq qarz",
    status: "Holat",
    actions: "Amallar",
    view: "Ko'rish",
    edit: "Tahrirlash",
    delete: "O'chirish",
    clients: "Mijozlar",
    statuses: "Statuslar",
    newStatus: "Yangi holat",
    newCustomer: "Yangi mijoz",
    searchCustomer: "Ism yoki telefon...",
    district: "Tuman",
    startDate: "Boshlanish sanasi",
    endDate: "Tugash sanasi",
    totalStatuses: "Jami statuslar",
    defaultStatus: "Asosiy status",
    customersWithStatus: "Statusli mijozlar",
    noValue: "Yo'q",
    customerAdded: "Mijoz qo'shildi",
    customerUpdated: "Mijoz yangilandi",
    customerDeleted: "Mijoz o'chirildi",
    deleteCustomer: "Mijozni o'chirish",
    deleteCustomerMessage: "mijoz yozuvini o'chirmoqchimisiz?",
    statusUpdated: "Holat yangilandi",
    statusAdded: "Yangi holat qo'shildi",
    statusDeleted: "Holat o'chirildi",
    deleteStatus: "Holatni o'chirish",
    deleteStatusMessage: "holatini o'chirmoqchimisiz?",
    editStatus: "Holatni tahrirlash",
    statusName: "Holat nomi",
    color: "Rang",
    order: "Tartib",
    slug: "Slug",
    save: "Saqlash",
    customerDetails: "Mijoz ma'lumotlari",
    fullName: "To'liq ism",
    phone: "Telefon",
    locationProject: "Hudud va loyiha",
    primaryData: "Asosiy ma'lumotlar",
    primaryDataSub: "Backenddagi asosiy client maydonlari",
    locationProjectSub: "Manzil, quvvat va subsidiya bilan bog'liq maydonlar",
    financeData: "Moliyaviy ma'lumotlar",
    financeDataSub: "To'lov, depozit, subsidiya va bank ma'lumotlari",
    officialData: "Rasmiy va audit ma'lumotlari",
    officialDataSub: "Shaxsiy identifikatsiya va audit bloklari",
    note: "Izoh",
    noteSub: "Faqat operator yozadigan eslatmalar",
    tuman: "Tuman",
    mahalla: "Mahalla",
    address: "Manzil",
    requestedPower: "So'ralgan quvvat",
    annualConsumption: "Yillik iste'mol (kWh)",
    estimatedSubsidy: "Taxminiy subsidiya kW",
    systemPower: "Tizim quvvati (kW)",
    availableDistricts: "Mavjud tumanlar",
    availableMahallas: "Mavjud mahallalar",
    paymentType: "To'lov turi",
    deposit: "Zalog summa",
    subsidyAmount: "Subsidiya",
    contractId: "Shartnoma ID",
    cardNumber: "Karta raqami",
    bankBranchCode: "Bank filiali kodi",
    bankAccountNumber: "Hisob raqami",
    auditorCompany: "Auditor kompaniya",
    auditorPhone: "Auditor telefoni",
    hokimHelper: "Hokim yordamchisi",
    helperPhone: "Yordamchi telefoni",
    passwordField: "Parol",
    cadastreField: "Kadastr",
    aiSummary: "AI xulosa",
    productNotSelected: "Mahsulot tanlanmagan",
    primaryStatus: "Asosiy holat",
    primaryStatusDefault: "Bu holat yangi mijozlar uchun default bo'ladi.",
    primaryStatusCurrent: "Joriy default:",
    customerNotFound: "Mijoz topilmadi",
    toCustomers: "Mijozlarga",
    tabOverview: "Umumiy",
    tabDebt: "Qarzdorlik",
    tabLedger: "Hisob-kitob",
    contactInfo: "Kontakt ma'lumotlari",
    activeProjects: "Aktiv loyiha",
    customerValue: "Mijoz qiymati",
    currency: "so'm",
    debtCard: "Qarzdorlik kartasi",
    direction: "Yo'nalish",
    totalAmount: "Jami summa",
    paid: "To'langan",
    remaining: "Qoldiq",
    overdueAmount: "Muddati o'tgan",
    deadline: "Muddat",
    projectComposition: "Loyiha tarkibi",
    noDebt: "Qarzdorlik yo'q",
    ledgerRecords: "Hisob-kitob yozuvlari",
    colDate: "Sana",
    colCategory: "Kategoriya",
    colAmount: "Summa",
    colMethod: "Usul",
    income: "Kirim",
    outcome: "Chiqim",
    registeredDate: "Ro'yxatdan o'tgan",
    defaultLabel: "Asosiy",
    linkedCustomers: "Biriktirilgan mijozlar",
    phoneLabel: "Telefon",
    regionLabel: "Hudud",
    countUnit: "ta ",
    statusesWord: "holat",
    customersWord: "mijoz",
    clearDates: "Tozalash",
    countItems: "ta",
    excelDownloaded: "Mijozlar Excel fayli yuklandi",
    excelFailed: "Excel eksport bajarilmadi",
    noteLabel: "Eslatma",
    openChat: "Suhbatni ochish",
  },
  ru: {
    unspecified: "Не указано",
    notEntered: "Не указано",
    noNotes: "Дополнительных заметок нет.",
    allStatuses: "Все статусы",
    customer: "Клиент",
    source: "Источник",
    system: "Система",
    payment: "Оплата",
    amountReceived: "Залоговая сумма",
    remainingDebt: "Остаток долга",
    status: "Статус",
    actions: "Действия",
    view: "Просмотр",
    edit: "Изменить",
    delete: "Удалить",
    clients: "Клиенты",
    statuses: "Статусы",
    newStatus: "Новый статус",
    newCustomer: "Новый клиент",
    searchCustomer: "Имя или телефон...",
    district: "Район",
    startDate: "Дата начала",
    endDate: "Дата окончания",
    totalStatuses: "Всего статусов",
    defaultStatus: "Основной статус",
    customersWithStatus: "Клиенты со статусом",
    noValue: "Нет",
    customerAdded: "Клиент добавлен",
    customerUpdated: "Клиент обновлен",
    customerDeleted: "Клиент удален",
    deleteCustomer: "Удалить клиента",
    deleteCustomerMessage: "Удалить запись клиента?",
    statusUpdated: "Статус обновлен",
    statusAdded: "Новый статус добавлен",
    statusDeleted: "Статус удален",
    deleteStatus: "Удалить статус",
    deleteStatusMessage: "Удалить этот статус?",
    editStatus: "Редактировать статус",
    statusName: "Название статуса",
    color: "Цвет",
    order: "Порядок",
    slug: "Slug",
    save: "Сохранить",
    customerDetails: "Данные клиента",
    fullName: "Полное имя",
    phone: "Телефон",
    locationProject: "Регион и проект",
    primaryData: "Основные данные",
    primaryDataSub: "Основные client-поля из backend",
    locationProjectSub: "Поля, связанные с адресом, мощностью и субсидией",
    financeData: "Финансовые данные",
    financeDataSub: "Оплата, депозит, субсидия и банковские данные",
    officialData: "Официальные и audit-данные",
    officialDataSub: "Личная идентификация и блоки аудита",
    note: "Заметка",
    noteSub: "Заметки, которые пишет только оператор",
    tuman: "Район",
    mahalla: "Махалля",
    address: "Адрес",
    requestedPower: "Запрошенная мощность",
    annualConsumption: "Годовое потребление (кВтч)",
    estimatedSubsidy: "Расч. субсидия кВт",
    systemPower: "Мощность системы (кВт)",
    availableDistricts: "Доступные районы",
    availableMahallas: "Доступные махалли",
    paymentType: "Тип оплаты",
    deposit: "Залоговая сумма",
    subsidyAmount: "Субсидия",
    contractId: "ID договора",
    cardNumber: "Номер карты",
    bankBranchCode: "Код банковского филиала",
    bankAccountNumber: "Номер счета",
    auditorCompany: "Аудиторская компания",
    auditorPhone: "Телефон аудитора",
    hokimHelper: "Помощник хокима",
    helperPhone: "Телефон помощника",
    passwordField: "Пароль",
    cadastreField: "Кадастр",
    aiSummary: "AI сводка",
    productNotSelected: "Продукт не выбран",
    primaryStatus: "Основной статус",
    primaryStatusDefault: "Этот статус будет default для новых клиентов.",
    primaryStatusCurrent: "Текущий default:",
    customerNotFound: "Клиент не найден",
    toCustomers: "К клиентам",
    tabOverview: "Общее",
    tabDebt: "Долги",
    tabLedger: "Расчеты",
    contactInfo: "Контактные данные",
    activeProjects: "Активные проекты",
    customerValue: "Ценность клиента",
    currency: "сум",
    debtCard: "Карточка долга",
    direction: "Направление",
    totalAmount: "Итого",
    paid: "Оплачено",
    remaining: "Остаток",
    overdueAmount: "Просрочено",
    deadline: "Срок",
    projectComposition: "Состав проекта",
    noDebt: "Нет задолженности",
    ledgerRecords: "Записи учета",
    colDate: "Дата",
    colCategory: "Категория",
    colAmount: "Сумма",
    colMethod: "Метод",
    income: "Приход",
    outcome: "Расход",
    registeredDate: "Зарегистрирован",
    defaultLabel: "Основной",
    linkedCustomers: "Привязанные клиенты",
    phoneLabel: "Телефон",
    regionLabel: "Регион",
    countUnit: "",
    statusesWord: "статусов",
    customersWord: "клиентов",
    clearDates: "Очистить",
    countItems: "шт",
    excelDownloaded: "Файл Excel клиентов загружен",
    excelFailed: "Экспорт Excel не выполнен",
    noteLabel: "Заметка",
    openChat: "Открыть чат",
  },
  en: {
    unspecified: "Unspecified",
    notEntered: "Not entered",
    noNotes: "No additional notes.",
    allStatuses: "All statuses",
    customer: "Customer",
    source: "Source",
    system: "System",
    payment: "Payment",
    amountReceived: "Pledge amount",
    remainingDebt: "Remaining debt",
    status: "Status",
    actions: "Actions",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    clients: "Clients",
    statuses: "Statuses",
    newStatus: "New status",
    newCustomer: "New customer",
    searchCustomer: "Name or phone...",
    district: "District",
    startDate: "Start date",
    endDate: "End date",
    totalStatuses: "Total statuses",
    defaultStatus: "Default status",
    customersWithStatus: "Customers with status",
    noValue: "None",
    customerAdded: "Customer added",
    customerUpdated: "Customer updated",
    customerDeleted: "Customer deleted",
    deleteCustomer: "Delete customer",
    deleteCustomerMessage: "Delete this customer record?",
    statusUpdated: "Status updated",
    statusAdded: "New status added",
    statusDeleted: "Status deleted",
    deleteStatus: "Delete status",
    deleteStatusMessage: "Delete this status?",
    editStatus: "Edit status",
    statusName: "Status name",
    color: "Color",
    order: "Order",
    slug: "Slug",
    save: "Save",
    customerDetails: "Customer details",
    fullName: "Full name",
    phone: "Phone",
    locationProject: "Location and project",
    primaryData: "Primary data",
    primaryDataSub: "Core client fields from backend",
    locationProjectSub: "Fields related to address, capacity, and subsidy",
    financeData: "Financial data",
    financeDataSub: "Payment, deposit, subsidy, and bank details",
    officialData: "Official and audit data",
    officialDataSub: "Personal identification and audit blocks",
    note: "Note",
    noteSub: "Notes written only by the operator",
    tuman: "District",
    mahalla: "Mahalla",
    address: "Address",
    requestedPower: "Requested power",
    annualConsumption: "Annual consumption (kWh)",
    estimatedSubsidy: "Estimated subsidy kW",
    systemPower: "System power (kW)",
    availableDistricts: "Available districts",
    availableMahallas: "Available mahallas",
    paymentType: "Payment type",
    deposit: "Pledge amount",
    subsidyAmount: "Subsidy",
    contractId: "Contract ID",
    cardNumber: "Card number",
    bankBranchCode: "Bank branch code",
    bankAccountNumber: "Account number",
    auditorCompany: "Auditor company",
    auditorPhone: "Auditor phone",
    hokimHelper: "Hokim's assistant",
    helperPhone: "Assistant phone",
    passwordField: "Password",
    cadastreField: "Cadastre",
    aiSummary: "AI summary",
    productNotSelected: "No product selected",
    primaryStatus: "Primary status",
    primaryStatusDefault: "This status will be the default for new customers.",
    primaryStatusCurrent: "Current default:",
    customerNotFound: "Customer not found",
    toCustomers: "To customers",
    tabOverview: "Overview",
    tabDebt: "Debt",
    tabLedger: "Ledger",
    contactInfo: "Contact info",
    activeProjects: "Active projects",
    customerValue: "Customer value",
    currency: "UZS",
    debtCard: "Debt card",
    direction: "Direction",
    totalAmount: "Total",
    paid: "Paid",
    remaining: "Balance",
    overdueAmount: "Overdue",
    deadline: "Deadline",
    projectComposition: "Project composition",
    noDebt: "No debt",
    ledgerRecords: "Ledger records",
    colDate: "Date",
    colCategory: "Category",
    colAmount: "Amount",
    colMethod: "Method",
    income: "Income",
    outcome: "Expense",
    registeredDate: "Registered",
    defaultLabel: "Default",
    linkedCustomers: "Linked customers",
    phoneLabel: "Phone",
    regionLabel: "Region",
    countUnit: "",
    statusesWord: "statuses",
    customersWord: "customers",
    clearDates: "Clear",
    countItems: "pcs",
    excelDownloaded: "Customers Excel file downloaded",
    excelFailed: "Excel export failed",
    noteLabel: "Note",
    openChat: "Open chat",
  },
};

function customerLang() {
  return window.__TG_LANG || "uz";
}

function ctx(key) {
  const lang = customerLang();
  return CUSTOMER_UI[lang]?.[key] || CUSTOMER_UI.uz[key] || key;
}
const customerTuman = (customer) => customer?.district || "";
const customerMahalla = (customer) => customer?.mahalla || "";
const customerLocationLabel = (customer) => [customerTuman(customer), customerMahalla(customer)].filter(Boolean).join(" / ");
const hasCustomerLocation = (customer) => !!customerLocationLabel(customer);
const customerLocations = (locations) => locations || window.TUMAN_MAHALLA || {};
const customerDistrictOptions = (locations) => Object.keys(customerLocations(locations));
const mahallaOptionsFor = (district, locations) => customerLocations(locations)[district] || [];
const CUSTOMER_STATUS_COLOR_OPTIONS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#dc2626",
  "#ea580c",
  "#0891b2",
  "#ca8a04",
  "#64748b",
];
const CUSTOMER_STATUS_LABELS = {
  uz: { new: "Yangi", active: "Faol", inactive: "Nofaol", pending: "Kutilmoqda", contacted: "Bog'langan", qualified: "Saralangan", confirmed: "Tasdiqlangan", closed: "Yopilgan", lost: "Yo'qotilgan" },
  ru: { new: "Новый", active: "Активный", inactive: "Неактивный", pending: "Ожидание", contacted: "Связались", qualified: "Квалифицирован", confirmed: "Подтверждён", closed: "Закрыт", lost: "Потерян" },
  en: { new: "New", active: "Active", inactive: "Inactive", pending: "Pending", contacted: "Contacted", qualified: "Qualified", confirmed: "Confirmed", closed: "Closed", lost: "Lost" },
};
const CUSTOMER_STATUS_NORMALIZE = {
  "yangi": "new", "faol": "active", "nofaol": "inactive",
  "kutilmoqda": "pending", "bog'langan": "contacted", "bog`langan": "contacted",
  "saralangan": "qualified", "tasdiqlangan": "confirmed",
  "yopilgan": "closed", "yo'qotilgan": "lost", "yo`qotilgan": "lost",
  "новый": "new", "активный": "active", "неактивный": "inactive",
  "ожидание": "pending", "связались": "contacted",
  "квалифицирован": "qualified", "подтверждён": "confirmed",
  "закрыт": "closed", "потерян": "lost",
};
const localizeCustomerStatusName = (value) => {
  const text = String(value || "").trim();
  if (!text) return ctx("unspecified");
  const labels = CUSTOMER_STATUS_LABELS[customerLang()] || CUSTOMER_STATUS_LABELS.uz;
  const key = text.toLowerCase();
  const normalized = CUSTOMER_STATUS_NORMALIZE[key] || key;
  return labels[normalized] || CUSTOMER_STATUS_LABELS.uz[normalized] || text;
};
const customerTextValue = (value, fallback = ctx("notEntered")) => {
  const text = String(value ?? "").trim();
  return text || fallback;
};
const customerSourceLabel = (source) => SOURCE_UZ[source] || customerTextValue(source);
const customerCreatedDate = (customer) => String(customer?.createdAt || "").slice(0, 10);
const dateMatchesRange = (dateValue, from, to) => {
  const value = String(dateValue || "").slice(0, 10);
  if (!from && !to) return true;
  if (!value) return false;
  if (from && value < from) return false;
  if (to && value > to) return false;
  return true;
};
const customerStatusTone = (customer) => {
  const key = String(customer?.statusName || customer?.status || "").toLowerCase();
  if (key.includes("inactive") || key.includes("lost") || key.includes("closed")) return "red";
  if (key.includes("pending") || key.includes("new")) return "amber";
  return "blue";
};
const customerStatusColor = (customer) => customer?.statusColor || customer?.color || "";
function statusColorToSoftBg(color, alpha = 0.14) {
  const clean = String(color || "").replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(clean)) return null;
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
function StatusColorBadge({ label, color, tone = "blue", suffix = null }) {
  const softBg = statusColorToSoftBg(color);
  if (softBg && color) {
    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "4px 10px",
        borderRadius: 999,
        background: softBg,
        color,
        border: `1px solid ${statusColorToSoftBg(color, 0.24)}`,
        fontSize: 12,
        fontWeight: 650,
        lineHeight: 1.4,
        whiteSpace: "nowrap",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
        <span>{label}</span>
        {suffix}
      </span>
    );
  }
  return <Badge color={tone} size="sm">{label}{suffix}</Badge>;
}

function CustomersPage() {
  const { data, t, nav, upsert, remove, toast } = useApp();
  const canManage = canDo("clients.manage", data);
  const [viewMode, setViewMode] = cuS("clients");
  const [q, setQ] = cuS("");
  const [fDistrict, setFDistrict] = cuS("all");
  const [fMahalla, setFMahalla] = cuS("all");
  const [fStatus, setFStatus] = cuS("all");
  const [exporting, setExporting] = cuS(false);
  const [dateFrom, setDateFrom] = cuS("");
  const [dateTo, setDateTo] = cuS("");
  const [statusModalOpen, setStatusModalOpen] = cuS(false);
  const [editStatus, setEditStatus] = cuS(null);
  const [deleteStatus, setDeleteStatus] = cuS(null);
  const [statusForm, setStatusForm] = cuS({ name: "", slug: "", color: CUSTOMER_STATUS_COLOR_OPTIONS[0], isDefault: false, sortOrder: (data.clientStatuses || []).length + 1 });
  const [viewCustomer, setViewCustomer] = cuS(null);
  const [editCustomer, setEditCustomer] = cuS(null);
  const [addOpen, setAddOpen] = cuS(false);
  const [deleteCustomer, setDeleteCustomer] = cuS(null);
  const [cusPage, setCusPage] = cuS(1);
  const [cusTotal, setCusTotal] = cuS(0);
  const [cusRows, setCusRows] = cuS([]);
  const [cusLoading, setCusLoading] = cuS(false);

  cuE(() => { setCusPage(1); }, [q]);

  cuE(() => {
    let cancelled = false;
    setCusLoading(true);
    apiGetClientsPage({
      page: cusPage,
      page_size: 50,
      search: q || undefined,
      ordering: "-created_at",
    }).then(({ results, count }) => {
      if (cancelled) return;
      setCusRows(results);
      setCusTotal(count);
      setCusLoading(false);
    }).catch(() => { if (!cancelled) setCusLoading(false); });
    return () => { cancelled = true; };
  }, [cusPage, q]);

  const districts = customerDistrictOptions(data.locations);
  const mahallaOptions = cuM(() => {
    if (fDistrict !== "all") return mahallaOptionsFor(fDistrict, data.locations);
    const all = Object.values(data.locations || {}).flat();
    return [...new Set(all)].sort((a, b) => a.localeCompare(b, "uz"));
  }, [fDistrict, data.locations]);
  const statusOptions = [{ value: "all", label: ctx("allStatuses") }, ...(data.clientStatuses || []).map((status) => ({ value: status.id, label: localizeCustomerStatusName(status.name) }))];
  const defaultClientStatus = localizeCustomerStatusName((data.clientStatuses || []).find((status) => status.isDefault)?.name);
  const sortedStatuses = cuM(() => (data.clientStatuses || []).slice().sort((a, b) => {
    const orderDiff = Number(a.sortOrder || 0) - Number(b.sortOrder || 0);
    if (orderDiff !== 0) return orderDiff;
    return String(a.name || "").localeCompare(String(b.name || ""), "uz");
  }), [data.clientStatuses]);

  const filtered = cuM(() => cusRows.filter(c => {
    if (fDistrict !== "all" && customerTuman(c) !== fDistrict) return false;
    if (fMahalla !== "all" && customerMahalla(c) !== fMahalla) return false;
    if (fStatus !== "all" && c.statusId !== fStatus) return false;
    if (!dateMatchesRange(customerCreatedDate(c), dateFrom, dateTo)) return false;
    return true;
  }), [cusRows, fDistrict, fMahalla, fStatus, dateFrom, dateTo]);

  const columns = [
    { key: "name", label: ctx("customer"), sortVal: r => r.fullName, render: r => <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={r.fullName} size={34} /><div><div className="tg-cell-strong">{r.fullName}</div><div className="tg-cell-sub">{r.phone}</div></div></div> },
    { key: "source", label: ctx("source"), render: r => <div style={{ display: "flex", alignItems: "center", gap: 6 }}><SourceIcon source={r.source} />{SOURCE_UZ[r.source]}</div> },
    { key: "system", label: ctx("system"), sortVal: r => r.currentSystemKw, render: r => <span>{r.currentSystemKw} kW</span> },
    { key: "payment", label: ctx("payment"), render: r => <Badge color={r.paymentType === "credit" ? "amber" : "green"} size="sm">{r.paymentTypeLabel}</Badge> },
    { key: "spent", label: ctx("amountReceived"), sortVal: r => r.totalSpent, render: r => <span style={{ fontWeight: 650 }}>{fmtUZS(r.totalSpent)}</span> },
    { key: "subsidy", label: ctx("subsidyAmount"), sortVal: r => r.subsidyAmount, render: r => <span style={{ fontWeight: 650 }}>{fmtShort(r.subsidyAmount)}</span> },
    { key: "status", label: ctx("status"), render: r => (!r.statusId && !r.statusName) ? <Badge color="slate" size="sm">{ctx("unspecified")}</Badge> : <StatusColorBadge color={customerStatusColor(r)} tone={customerStatusTone(r)} label={localizeCustomerStatusName(r.statusName || r.status)} /> },
    { key: "password", label: ctx("passwordField"), render: r => r.password ? (
      <span
        className="tg-cell-sub"
        style={{ fontFamily: "monospace", fontSize: 12, cursor: "pointer", userSelect: "none" }}
        title="Nusxa olish uchun bosing"
        onClick={e => { e.stopPropagation(); navigator.clipboard.writeText(r.password).then(() => toast("Parol nusxalandi")).catch(() => toast("Nusxa olishda xato", "error")); }}
      >{r.password} <I.copy size={11} style={{ opacity: 0.45, verticalAlign: "middle" }} /></span>
    ) : <span style={{ color: "var(--text-4)" }}>—</span> },
    { key: "actions", label: "", width: 44, render: r => (
      <div onClick={e => e.stopPropagation()}>
        <Dropdown align="right" trigger={<IconButton icon={<I.dots size={16} />} label={ctx("actions")} />} items={[
          { label: ctx("view"), icon: <I.eye size={16} />, onClick: () => setViewCustomer(r) },
          { label: ctx("edit"), icon: <I.edit size={16} />, onClick: () => setEditCustomer(r) },
          { divider: true },
          { label: ctx("delete"), icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteCustomer(r) },
        ]} />
      </div>
    ) },
  ];

  const statusUsageCount = (statusId) => cusRows.filter((customer) => customer.statusId === statusId).length;

  const openStatusCreate = () => {
    setEditStatus(null);
    setStatusForm({
      name: "",
      slug: "",
      color: CUSTOMER_STATUS_COLOR_OPTIONS[0],
      isDefault: false,
      sortOrder: (data.clientStatuses || []).length + 1,
    });
    setStatusModalOpen(true);
  };

  const exportClientsExcel = async () => {
    try {
      setExporting(true);
      await apiDownloadClientsExcel({
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      });
      toast(ctx("excelDownloaded"));
    } catch (error) {
      toast(error.message || ctx("excelFailed"), "error");
    } finally {
      setExporting(false);
    }
  };

  const openStatusEdit = (status) => {
    setEditStatus(status);
    setStatusForm({
      id: status.id,
      name: status.name || "",
      slug: status.slug || "",
      color: status.color || CUSTOMER_STATUS_COLOR_OPTIONS[0],
      isDefault: !!status.isDefault,
      sortOrder: Number(status.sortOrder || 0),
    });
    setStatusModalOpen(true);
  };

  const setStatusField = (key, value) => setStatusForm((current) => ({ ...current, [key]: value }));

  const saveStatus = async () => {
    if (!statusForm.name.trim()) return;
    await upsert("clientStatuses", {
      ...editStatus,
      name: statusForm.name.trim(),
      slug: (statusForm.slug || "").trim(),
      color: statusForm.color || "",
      isDefault: !!statusForm.isDefault,
      sortOrder: Number(statusForm.sortOrder || 0),
    });
    toast(editStatus ? ctx("statusUpdated") : ctx("statusAdded"));
    setStatusModalOpen(false);
    setEditStatus(null);
  };

  const statusColumns = [
    { key: "name", label: ctx("status"), sortVal: (row) => row.name, render: (row) => <div style={{ display: "flex", alignItems: "center", gap: 10 }}><StatusColorBadge color={row.color} tone={row.isDefault ? "green" : "blue"} label={localizeCustomerStatusName(row.name)} />{row.isDefault && <span className="tg-cell-sub">{ctx("defaultLabel")}</span>}</div> },
    { key: "slug", label: ctx("slug"), sortVal: (row) => row.slug, render: (row) => <span className="tg-cell-sub" style={{ fontFamily: "monospace" }}>{row.slug || "-"}</span> },
    { key: "order", label: ctx("order"), sortVal: (row) => Number(row.sortOrder || 0), render: (row) => <span>{row.sortOrder || 0}</span> },
    { key: "customers", label: ctx("clients"), sortVal: (row) => statusUsageCount(row.id), render: (row) => <Badge color="slate" size="sm">{statusUsageCount(row.id)} {ctx("countItems")}</Badge> },
    { key: "actions", label: "", width: 44, render: (row) => (
      <div onClick={(event) => event.stopPropagation()}>
        <Dropdown align="right" trigger={<IconButton icon={<I.dots size={16} />} label={ctx("actions")} />} items={[
          { label: ctx("edit"), icon: <I.edit size={16} />, onClick: () => openStatusEdit(row) },
          { divider: true },
          { label: ctx("delete"), icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteStatus(row) },
        ]} />
      </div>
    ) },
  ];

  const modeChips = [
    { value: "clients", label: ctx("clients"), count: cusTotal, icon: <I.users size={14} /> },
    { value: "statuses", label: ctx("statuses"), count: sortedStatuses.length, icon: <I.flag size={14} /> },
  ];
  const pageDesc = viewMode === "statuses" ? `${sortedStatuses.length} ${ctx("countUnit")}${ctx("statusesWord")}` : `${cusTotal} ${ctx("countUnit")}${ctx("customersWord")}`;

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.customers")} desc={pageDesc} crumbs={[{ label: "CRM" }, { label: t("page.customers") }]}
        actions={<>
          {viewMode === "clients" && <Button variant="default" size="sm" icon={<I.download size={15} />} onClick={exportClientsExcel} disabled={exporting}>Excel</Button>}
          {viewMode === "statuses" && <Button variant="soft" size="sm" icon={<I.flag size={15} />} onClick={openStatusCreate}>{ctx("newStatus")}</Button>}
          {viewMode === "clients" && <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setAddOpen(true)}>{ctx("newCustomer")}</Button>}
        </>} />
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {modeChips.map((chip) => {
          const active = viewMode === chip.value;
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => setViewMode(chip.value)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                borderRadius: 999,
                border: active ? "1px solid rgba(var(--accent-rgb), .35)" : "1px solid var(--border)",
                background: active ? "var(--accent-soft)" : "var(--surface)",
                color: active ? "var(--accent)" : "var(--text-2)",
                padding: "9px 14px",
                fontSize: 12.5,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all .18s",
              }}
            >
              {chip.icon}
              <span>{chip.label}</span>
              <span style={{
                minWidth: 22,
                height: 22,
                padding: "0 7px",
                borderRadius: 999,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: active ? "rgba(var(--accent-rgb), .14)" : "var(--surface-3)",
                color: active ? "var(--accent)" : "var(--text-3)",
                fontSize: 11.5,
                fontWeight: 700,
              }}>
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>
      {viewMode === "clients" && (
        <>
          <div className="toolbar">
        <SearchInput value={q} onChange={setQ} placeholder={ctx("searchCustomer")} width={260} />
        <FilterSelect label={ctx("district")} icon="mapPin" value={fDistrict} onChange={v => { setFDistrict(v); setFMahalla("all"); }} options={districts.map(d => ({ value: d, label: d }))} />
        <FilterSelect label={ctx("mahalla")} icon="home" value={fMahalla} onChange={setFMahalla} options={mahallaOptions.map(m => ({ value: m, label: m }))} />
        <FilterSelect label={ctx("status")} icon="flag" value={fStatus} onChange={setFStatus} options={statusOptions} />
        <div style={{ width: 170 }}><DatePickerInput value={dateFrom} onChange={setDateFrom} placeholder={ctx("startDate")} /></div>
        <div style={{ width: 170 }}><DatePickerInput value={dateTo} onChange={setDateTo} placeholder={ctx("endDate")} /></div>
            {(dateFrom || dateTo) ? <Button variant="ghost" size="sm" onClick={() => { setDateFrom(""); setDateTo(""); }}>{ctx("clearDates")}</Button> : null}
            <div className="toolbar-spacer" />
            <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{cusTotal} ta</span>
          </div>
          <Card pad={false}>
            {cusLoading ? <SkeletonRows rows={10} cols={7} /> : <DataTable columns={columns} rows={filtered} onRowClick={r => setViewCustomer(r)} defaultSort={null} />}
            <PaginationBar page={cusPage} total={cusTotal} pageSize={50} onChange={setCusPage} />
          </Card>
        </>
      )}
      {viewMode === "statuses" && (
        <div style={{ display: "grid", gap: 16 }}>
          <div className="grid-3">
            <StatTile label={ctx("totalStatuses")} value={sortedStatuses.length} color="blue" />
            <StatTile label={ctx("defaultStatus")} value={defaultClientStatus || ctx("noValue")} color="green" />
            <StatTile label={ctx("customersWithStatus")} value={cusRows.filter((customer) => customer.statusId).length} color="amber" />
          </div>
          <Card pad={false}>
            <DataTable columns={statusColumns} rows={sortedStatuses} onRowClick={openStatusEdit} defaultSort={{ key: "order", dir: "asc" }} />
          </Card>
        </div>
      )}
      <CustomerStatusModal
        open={statusModalOpen}
        onClose={() => { setStatusModalOpen(false); setEditStatus(null); }}
        onSave={saveStatus}
        form={statusForm}
        setField={setStatusField}
        defaultClientStatus={defaultClientStatus}
        editing={!!editStatus}
      />
      <CustomerViewModal
        open={!!viewCustomer}
        onClose={() => setViewCustomer(null)}
        onEdit={canManage ? () => { setEditCustomer(viewCustomer); setViewCustomer(null); } : undefined}
        onDelete={canManage ? () => { setDeleteCustomer(viewCustomer); setViewCustomer(null); } : undefined}
        customer={viewCustomer}
      />
      <CustomerFormModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={async (customer) => {
          await upsert("customers", customer);
          toast(ctx("customerAdded"));
          setAddOpen(false);
        }}
        locations={data.locations}
      />
      <CustomerFormModal
        open={!!editCustomer}
        onClose={() => setEditCustomer(null)}
        initial={editCustomer}
        onSave={async (customer) => {
          await upsert("customers", customer);
          toast(ctx("customerUpdated"));
          setEditCustomer(null);
        }}
        locations={data.locations}
      />
      <ConfirmDialog
        open={!!deleteCustomer}
        onClose={() => setDeleteCustomer(null)}
        onConfirm={async () => {
          await remove("customers", deleteCustomer.id);
          toast(ctx("customerDeleted"));
          setDeleteCustomer(null);
        }}
        title={ctx("deleteCustomer")}
        message={customerLang() === "uz" ? `"${deleteCustomer?.fullName || ""}" ${ctx("deleteCustomerMessage")}` : ctx("deleteCustomerMessage")}
        details={deleteCustomer ? [`${ctx("phoneLabel")}: ${deleteCustomer.phone}`, hasCustomerLocation(deleteCustomer) ? `${ctx("regionLabel")}: ${customerLocationLabel(deleteCustomer)}` : ""].filter(Boolean).join("\n") : ""}
        confirmLabel={ctx("delete")}
        danger
      />
      <ConfirmDialog
        open={!!deleteStatus}
        onClose={() => setDeleteStatus(null)}
        onConfirm={async () => {
          await remove("clientStatuses", deleteStatus.id);
          toast(ctx("statusDeleted"));
          setDeleteStatus(null);
        }}
        title={ctx("deleteStatus")}
        message={customerLang() === "uz" ? `"${localizeCustomerStatusName(deleteStatus?.name || "")}" ${ctx("deleteStatusMessage")}` : ctx("deleteStatusMessage")}
        details={deleteStatus ? `Slug: ${deleteStatus.slug || "-"}\n${ctx("linkedCustomers")}: ${statusUsageCount(deleteStatus.id)} ${ctx("countItems")}` : ""}
        confirmLabel={ctx("delete")}
        danger
      />
    </div>
  );
}
window.CustomersPage = CustomersPage;

function CustomerStatusModal({ open, onClose, onSave, form, setField, defaultClientStatus, editing }) {
  return (
    <Modal open={open} onClose={onClose} title={editing ? ctx("editStatus") : ctx("newStatus")} icon={<I.flag size={18} />} width={460}
      footer={<><Button variant="ghost" onClick={onClose}>{window.TRANSLATIONS?.[customerLang()]?.["common.cancel"] || "Bekor qilish"}</Button><Button variant="primary" onClick={onSave}>{ctx("save")}</Button></>}>
      <div style={{ display: "grid", gap: 14 }}>
        <Field label={ctx("statusName")} required><Input value={form.name} onChange={e => setField("name", e.target.value)} placeholder="Masalan, Faol mijoz" /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 120px", gap: 14 }}>
          <Field label={ctx("slug")}><Input value={form.slug} onChange={e => setField("slug", e.target.value)} placeholder="faol_mijoz" /></Field>
          <Field label={ctx("order")}><Input type="number" value={form.sortOrder} onChange={e => setField("sortOrder", Number(e.target.value || 0))} /></Field>
        </div>
        <Field label={ctx("color")}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {CUSTOMER_STATUS_COLOR_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setField("color", color)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: form.color === color ? `2px solid ${color}` : "1px solid var(--border)",
                  background: color,
                  boxShadow: form.color === color ? `0 0 0 3px ${statusColorToSoftBg(color, 0.18)}` : "none",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </Field>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, padding: "12px 14px", borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 650 }}>{ctx("primaryStatus")}</div>
            <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 2 }}>
              {form.isDefault
                ? ctx("primaryStatusDefault")
                : `${ctx("primaryStatusCurrent")} ${localizeCustomerStatusName(defaultClientStatus) || ctx("noValue")}`}
            </div>
          </div>
          <Toggle checked={!!form.isDefault} onChange={value => setField("isDefault", value)} />
        </div>
      </div>
    </Modal>
  );
}

function CustomerViewModal({ open, onClose, onEdit, onDelete, customer }) {
  const { data } = useApp();
  const canManage = canDo("clients.manage", data);
  if (!customer) return null;
  const product = (data.products || []).find((row) => row.id === customer.productId);
  const productLabel = product?.model || product?.name || product?.title || customer.productId || "";
  const customerSession = (data.conversations || []).find(s => s.clientId === customer.id);
  return (
    <Modal open={open} onClose={onClose} title={ctx("customerDetails")} icon={<I.users size={18} />} width={760}
      footer={<>
        {customerSession && <Button variant="ghost" size="sm" icon={<I.message size={14} />} onClick={() => window.navTo("/inbox/" + customerSession.id)}>{ctx("openChat")}</Button>}
        {canManage && <Button variant="ghost" icon={<I.edit size={15} />} onClick={onEdit}>{ctx("edit")}</Button>}
        {canManage && <Button variant="danger" icon={<I.trash size={15} />} onClick={onDelete}>{ctx("delete")}</Button>}
        <Button variant="primary" onClick={onClose}>{window.TRANSLATIONS?.[customerLang()]?.["common.close"] || "Yopish"}</Button>
      </>}>
      <div className="tg-customer-view-shell">
        <section className="tg-customer-view-hero">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar name={customer.fullName} size={52} />
            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <h4 style={{ margin: 0, fontSize: 22, fontWeight: 800, letterSpacing: "-.03em" }}>{customer.fullName}</h4>
                <StatusColorBadge color={customerStatusColor(customer)} tone={customerStatusTone(customer)} label={localizeCustomerStatusName(customer.statusName || customer.status)} />
              </div>
              <div className="tg-customer-view-pills">
                <span className="tg-customer-view-pill"><SourceIcon source={customer.source} />{customerSourceLabel(customer.source)}</span>
                <span className="tg-customer-view-pill"><I.box size={14} />{customerTextValue(productLabel, ctx("productNotSelected"))}</span>
                <span className="tg-customer-view-pill"><I.phone size={14} />{customerTextValue(customer.phone)}</span>
              </div>
            </div>
          </div>
          <div className="tg-customer-view-kpis">
            <div className="tg-customer-view-kpi"><span>{ctx("amountReceived")}</span><strong>{fmtUZS(customer.totalSpent)}</strong></div>
            <div className="tg-customer-view-kpi"><span>{ctx("subsidyAmount")}</span><strong>{fmtUZS(customer.subsidyAmount)}</strong></div>
            <div className="tg-customer-view-kpi"><span>{ctx("requestedPower")}</span><strong>{customer.currentSystemKw || 0} kW</strong></div>
          </div>
        </section>

        <div className="tg-customer-view-grid">
          <section className="tg-customer-view-card">
            <div className="tg-customer-view-card-title">{ctx("primaryData")}</div>
            <div className="tg-customer-view-meta">
              <div className="tg-customer-view-row"><span>{ctx("phone")}</span><strong>{customerTextValue(customer.phone)}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("source")}</span><strong>{customerSourceLabel(customer.source)}</strong></div>
              <div className="tg-customer-view-row"><span>{window.TRANSLATIONS?.[customerLang()]?.["common.product"] || "Mahsulot"}</span><strong>{customerTextValue(productLabel, "Tanlanmagan")}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("status")}</span><strong>{(!customer.statusId && !customer.statusName) ? ctx("unspecified") : localizeCustomerStatusName(customer.statusName || customer.status)}</strong></div>
              <div className="tg-customer-view-row"><span>{window.TRANSLATIONS?.[customerLang()]?.["common.created"] || "Yaratilgan"}</span><strong>{customer.createdAt ? fmtDate(customer.createdAt, true) : ctx("notEntered")}</strong></div>
              <div className="tg-customer-view-row"><span>{window.TRANSLATIONS?.[customerLang()]?.["common.updated"] || "Yangilangan"}</span><strong>{customer.updatedAt ? fmtDate(customer.updatedAt, true) : ctx("notEntered")}</strong></div>
            </div>
          </section>

          <section className="tg-customer-view-card">
            <div className="tg-customer-view-card-title">{ctx("locationProject")}</div>
            <div className="tg-customer-view-meta">
              <div className="tg-customer-view-row"><span>{ctx("tuman")}</span><strong>{customerTextValue(customerTuman(customer))}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("mahalla")}</span><strong>{customerTextValue(customerMahalla(customer))}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("address")}</span><strong>{customerTextValue(customer.address)}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("requestedPower")}</span><strong>{customer.currentSystemKw || 0} kW</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("annualConsumption")}</span><strong>{customerTextValue(customer.annualConsumptionKwh, ctx("notEntered"))}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("estimatedSubsidy")}</span><strong>{customerTextValue(customer.estimatedSubsidyKw, ctx("notEntered"))}</strong></div>
            </div>
          </section>

          <section className="tg-customer-view-card">
            <div className="tg-customer-view-card-title">{ctx("financeData")}</div>
            <div className="tg-customer-view-meta">
              <div className="tg-customer-view-row"><span>{ctx("paymentType")}</span><strong>{customerTextValue(customer.paymentTypeLabel)}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("deposit")}</span><strong>{fmtUZS(customer.totalSpent)}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("subsidyAmount")}</span><strong>{fmtUZS(customer.subsidyAmount)}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("contractId")}</span><strong>{customerTextValue(customer.contractId)}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("cardNumber")}</span><strong>{customerTextValue(customer.cardNumber)}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("bankBranchCode")}</span><strong>{customerTextValue(customer.bankBranchCode)}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("bankAccountNumber")}</span><strong>{customerTextValue(customer.bankAccountNumber)}</strong></div>
            </div>
          </section>

          <section className="tg-customer-view-card">
            <div className="tg-customer-view-card-title">{ctx("officialData")}</div>
            <div className="tg-customer-view-meta">
              <div className="tg-customer-view-row"><span>PNFL</span><strong>{customerTextValue(customer.pnfl)}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("cadastreField")}</span><strong>{customerTextValue(customer.cadastre)}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("auditorCompany")}</span><strong>{customerTextValue(customer.auditorCompanyName)}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("auditorPhone")}</span><strong>{customerTextValue(customer.auditorCompanyPhone)}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("hokimHelper")}</span><strong>{customerTextValue(customer.hokimHelperName)}</strong></div>
              <div className="tg-customer-view-row"><span>{ctx("helperPhone")}</span><strong>{customerTextValue(customer.hokimHelperPhone)}</strong></div>
            </div>
          </section>
        </div>

        <div className="tg-customer-view-grid">
          <section className="tg-customer-view-card">
            <div className="tg-customer-view-card-title">{ctx("aiSummary")}</div>
            <div className="tg-customer-view-note">{customer.aiXulosa || ctx("notEntered")}</div>
          </section>
          <section className="tg-customer-view-card">
            <div className="tg-customer-view-card-title">{ctx("note")}</div>
            <div className="tg-customer-view-note">{customer.notes || ctx("noNotes")}</div>
          </section>
        </div>
      </div>
    </Modal>
  );
}

function CustomerFormModal({ open, onClose, onSave, initial, locations }) {
  const { data } = useApp();
  const apiDistricts = data.districts || [];
  const apiNeighborhoods = data.neighborhoods || [];
  const districts = apiDistricts.length ? apiDistricts.map(d => d.name) : customerDistrictOptions(locations);
  const statusOptions = (data.clientStatuses || []).map((status) => ({ value: status.id, label: localizeCustomerStatusName(status.name) }));
  const sourceOptions = Array.from(new Set([...(window.SOURCES || []), initial?.source || "manual"].filter(Boolean))).map((source) => ({ value: source, label: customerSourceLabel(source) }));
  const productOptions = [{ value: "", label: ctx("productNotSelected") }, ...(data.products || []).map((product) => ({ value: product.id, label: product.model || product.name || product.title || product.id }))];
  if (initial?.productId && !productOptions.some((option) => option.value === initial.productId)) {
    productOptions.push({ value: initial.productId, label: initial.productId });
  }
  const defaultStatus = (data.clientStatuses || []).find((status) => status.isDefault) || data.clientStatuses?.[0] || null;
  const blank = {
    fullName: "",
    phone: "+998 ",
    source: "manual",
    productId: "",
    district: "",
    mahalla: "",
    address: "",
    currentSystemKw: 10,
    annualConsumptionKwh: "",
    estimatedSubsidyKw: "",
    paymentType: "cash",
    statusId: defaultStatus?.id || null,
    statusName: defaultStatus?.name || "",
    totalSpent: 0,
    subsidyAmount: 0,
    debtBalanceUzs: 0,
    contractId: "",
    pnfl: "",
    password: "",
    cadastre: "",
    auditorCompanyName: "",
    auditorCompanyPhone: "",
    hokimHelperName: "",
    hokimHelperPhone: "",
    cardNumber: "",
    bankBranchCode: "",
    bankAccountNumber: "",
    notes: "",
  };
  const normalizeLocation = (item) => {
    const district = item?.district || "";
    const mahalla = item?.mahalla || "";
    return { ...blank, ...item, district, mahalla };
  };
  const [form, setForm] = cuS(normalizeLocation(initial || blank));
  React.useEffect(() => { setForm(normalizeLocation(initial || blank)); }, [initial, open]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const save = async () => {
    if (!form.fullName.trim()) return;
    await onSave(initial ? {
      ...initial,
      ...form,
      paymentTypeLabel: PAYMENT_TYPE_UZ[form.paymentType],
      subsidyAmount: +form.subsidyAmount,
      totalSpent: +form.totalSpent,
      currentSystemKw: +form.currentSystemKw,
      statusId: form.statusId || null,
      statusName: data.clientStatuses.find((status) => status.id === form.statusId)?.name || form.statusName || "",
      lifetimeValue: +form.totalSpent + +form.subsidyAmount,
    } : {
      id: "C" + Math.floor(Math.random() * 9000 + 1000),
      ...form,
      paymentTypeLabel: PAYMENT_TYPE_UZ[form.paymentType],
      currentSystemKw: +form.currentSystemKw,
      totalSpent: +form.totalSpent,
      subsidyAmount: +form.subsidyAmount,
      debtBalanceUzs: 0,
      overdueDebtUzs: 0,
      ordersCount: 1,
      lastPurchase: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      lifetimeValue: +form.totalSpent + +form.subsidyAmount,
      source: "manual",
      preferredChannel: "manual",
      createdAt: new Date().toISOString(),
      statusId: form.statusId || null,
      statusName: data.clientStatuses.find((status) => status.id === form.statusId)?.name || form.statusName || "",
    });
  };
  return (
    <Modal open={open} onClose={onClose} title={initial ? ctx("edit") + " " + ctx("customer").toLowerCase() : ctx("newCustomer")} icon={<I.user size={18} />} width={820}
      footer={<><Button variant="ghost" onClick={onClose}>{window.TRANSLATIONS?.[customerLang()]?.["common.cancel"] || "Bekor qilish"}</Button><Button variant="primary" onClick={save}>{ctx("save")}</Button></>}>
      <div className="tg-customer-form-shell">
        <section className="tg-customer-form-card">
          <div className="tg-customer-form-head">
            <div className="tg-customer-form-title">{ctx("primaryData")}</div>
            <div className="tg-customer-form-sub">{ctx("primaryDataSub")}</div>
          </div>
          <div className="tg-customer-form-grid tg-customer-form-grid-2">
            <Field label={ctx("fullName")} required><Input value={form.fullName} onChange={e => set("fullName", e.target.value)} /></Field>
            <Field label={ctx("phone")}><Input value={form.phone} onChange={e => set("phone", e.target.value)} /></Field>
            <Field label={ctx("status")}><Select value={form.statusId || ""} onChange={v => set("statusId", v)} options={statusOptions.map((status) => ({ value: status.value, label: status.label }))} /></Field>
            <Field label={ctx("source")}><Select value={form.source || "manual"} onChange={v => set("source", v)} options={sourceOptions} /></Field>
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label={window.TRANSLATIONS?.[customerLang()]?.["common.product"] || "Mahsulot"}><Select value={form.productId || ""} onChange={v => set("productId", v)} options={productOptions} /></Field>
            </div>
          </div>
        </section>

        <section className="tg-customer-form-card">
          <div className="tg-customer-form-head">
            <div className="tg-customer-form-title">{ctx("locationProject")}</div>
            <div className="tg-customer-form-sub">{ctx("locationProjectSub")}</div>
          </div>
          <div className="tg-customer-form-grid tg-customer-form-grid-2">
            <Field label={ctx("tuman")}>{apiDistricts.length ? <Select value={form.district} onChange={v => { set("district", v); set("mahalla", ""); }} options={[{ value: "", label: "— tanlang —" }, ...apiDistricts.map(d => ({ value: d.name, label: d.name }))]} /> : <Input value={form.district} onChange={e => set("district", e.target.value)} />}</Field>
            <Field label={ctx("mahalla")}>{apiDistricts.length ? <Select value={form.mahalla} onChange={v => set("mahalla", v)} options={[{ value: "", label: "— tanlang —" }, ...apiNeighborhoods.filter(n => { const d = apiDistricts.find(d => d.name === form.district); return d && n.district === d.id; }).map(n => ({ value: n.name, label: n.name }))]} /> : <Input value={form.mahalla} onChange={e => set("mahalla", e.target.value)} />}</Field>
            <div style={{ gridColumn: "1 / -1" }}><Field label={ctx("address")}><Input value={form.address} onChange={e => set("address", e.target.value)} /></Field></div>
            <Field label={ctx("systemPower")}><Input type="number" value={form.currentSystemKw} onChange={e => set("currentSystemKw", e.target.value)} /></Field>
            <Field label={ctx("annualConsumption")}><Input type="number" value={form.annualConsumptionKwh} onChange={e => set("annualConsumptionKwh", e.target.value)} /></Field>
            <Field label={ctx("estimatedSubsidy")}><Input type="number" value={form.estimatedSubsidyKw} onChange={e => set("estimatedSubsidyKw", e.target.value)} /></Field>
          </div>
          {!!districts.length && (
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>{ctx("availableDistricts")}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {districts.slice(0, 10).map((district) => (
                  <button
                    key={district}
                    type="button"
                    onClick={() => set("district", district)}
                    style={{
                      border: "1px solid var(--border)",
                      background: form.district === district ? "var(--accent-soft)" : "var(--surface-2)",
                      color: form.district === district ? "var(--accent)" : "var(--text-2)",
                      borderRadius: 999,
                      padding: "6px 10px",
                      fontSize: 12.5,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {district}
                  </button>
                ))}
              </div>
            </div>
          )}
          {!!form.district && !!mahallaOptionsFor(form.district, locations).length && (
            <div style={{ display: "grid", gap: 8 }}>
              <div style={{ fontSize: 12, color: "var(--text-3)" }}>{ctx("availableMahallas")}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {mahallaOptionsFor(form.district, locations).slice(0, 12).map((mahalla) => (
                  <button
                    key={mahalla}
                    type="button"
                    onClick={() => set("mahalla", mahalla)}
                    style={{
                      border: "1px solid var(--border)",
                      background: form.mahalla === mahalla ? "var(--accent-soft)" : "var(--surface-2)",
                      color: form.mahalla === mahalla ? "var(--accent)" : "var(--text-2)",
                      borderRadius: 999,
                      padding: "6px 10px",
                      fontSize: 12.5,
                      cursor: "pointer",
                      fontWeight: 600,
                    }}
                  >
                    {mahalla}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="tg-customer-form-card">
          <div className="tg-customer-form-head">
            <div className="tg-customer-form-title">{ctx("financeData")}</div>
            <div className="tg-customer-form-sub">{ctx("financeDataSub")}</div>
          </div>
          <div className="tg-customer-form-grid tg-customer-form-grid-2">
            <Field label={ctx("paymentType")}><Select value={form.paymentType} onChange={v => set("paymentType", v)} options={PAYMENT_TYPES.map(v => ({ value: v, label: PAYMENT_TYPE_UZ[v] }))} /></Field>
            <Field label={ctx("contractId")}><Input value={form.contractId} onChange={e => set("contractId", e.target.value)} /></Field>
            <Field label={ctx("amountReceived")}><Input type="number" value={form.totalSpent} onChange={e => set("totalSpent", e.target.value)} /></Field>
            <Field label={ctx("subsidyAmount")}><Input type="number" value={form.subsidyAmount} onChange={e => set("subsidyAmount", e.target.value)} /></Field>
            <Field label={ctx("cardNumber")}><Input value={form.cardNumber} onChange={e => set("cardNumber", e.target.value)} /></Field>
            <Field label={ctx("bankBranchCode")}><Input value={form.bankBranchCode} onChange={e => set("bankBranchCode", e.target.value)} /></Field>
            <div style={{ gridColumn: "1 / -1" }}><Field label={ctx("bankAccountNumber")}><Input value={form.bankAccountNumber} onChange={e => set("bankAccountNumber", e.target.value)} /></Field></div>
          </div>
        </section>

        <section className="tg-customer-form-card">
          <div className="tg-customer-form-head">
            <div className="tg-customer-form-title">{ctx("officialData")}</div>
            <div className="tg-customer-form-sub">{ctx("officialDataSub")}</div>
          </div>
          <div className="tg-customer-form-grid tg-customer-form-grid-2">
            <Field label="PNFL"><Input value={form.pnfl} onChange={e => set("pnfl", e.target.value)} /></Field>
            <Field label={ctx("passwordField")}><Input value={form.password} onChange={e => set("password", e.target.value)} /></Field>
            <Field label={ctx("cadastreField")}><Input value={form.cadastre} onChange={e => set("cadastre", e.target.value)} /></Field>
            <Field label={ctx("auditorCompany")}><Input value={form.auditorCompanyName} onChange={e => set("auditorCompanyName", e.target.value)} /></Field>
            <Field label={ctx("auditorPhone")}><Input value={form.auditorCompanyPhone} onChange={e => set("auditorCompanyPhone", e.target.value)} /></Field>
            <Field label={ctx("hokimHelper")}><Input value={form.hokimHelperName} onChange={e => set("hokimHelperName", e.target.value)} /></Field>
            <Field label={ctx("helperPhone")}><Input value={form.hokimHelperPhone} onChange={e => set("hokimHelperPhone", e.target.value)} /></Field>
          </div>
        </section>

        <section className="tg-customer-form-card">
          <div className="tg-customer-form-head">
            <div className="tg-customer-form-title">{ctx("note")}</div>
            <div className="tg-customer-form-sub">{ctx("noteSub")}</div>
          </div>
          <Field label={ctx("noteLabel")}><Textarea rows={4} value={form.notes} onChange={e => set("notes", e.target.value)} /></Field>
        </section>
      </div>
    </Modal>
  );
}

function CustomerDetailPage({ id }) {
  const { data, t, nav } = useApp();
  const [detailCustomer, setDetailCustomer] = cuS(null);
  const [detailDebtor, setDetailDebtor] = cuS(null);
  const [detailLedger, setDetailLedger] = cuS([]);
  const [tab, setTab] = cuS("overview");
  cuE(() => {
    apiGetClientById(id).then(c => {
      if (!c) return;
      setDetailCustomer(c);
      apiGetDebtorsPage({ page: 1, page_size: 1, search: c.fullName }).then(r => { if (r.results.length) setDetailDebtor(r.results[0]); }).catch(() => {});
      apiGetPaymentsPage({ page: 1, page_size: 8, ordering: "-date", search: c.fullName }).then(r => {
        const dayMap = Object.fromEntries((data.accountingDays || []).map(d => [d.id, d]));
        setDetailLedger((r.results || []).map(e => mapApiAccountingEntry(e, dayMap)));
      }).catch(() => {});
    }).catch(() => {});
  }, [id]);
  const c = detailCustomer || data.customers.find(x => x.id === id);
  if (!c) return <div className="page"><Card><EmptyState title={ctx("customerNotFound")} action={<Button onClick={() => nav("/customers")}>{ctx("toCustomers")}</Button>} /></Card></div>;

  const debtor = detailDebtor;
  const ledger = detailLedger;
  const customerSession = (data.conversations || []).find(s => s.clientId === c.id);
  const tabs = [
    { value: "overview", label: ctx("tabOverview"), icon: <I.user size={15} /> },
    { value: "debt", label: ctx("tabDebt"), icon: <I.wallet size={15} /> },
    { value: "ledger", label: ctx("tabLedger"), icon: <I.chart size={15} />, count: ledger.length },
  ];

  return (
    <div className="page fade-in">
      <PageHeader crumbs={[{ label: "CRM" }, { label: t("page.customers"), to: "/customers" }, { label: c.fullName }]} title={c.fullName}
        actions={customerSession ? <Button variant="ghost" size="sm" icon={<I.message size={14} />} onClick={() => window.navTo("/inbox/" + customerSession.id)}>{ctx("openChat")}</Button> : null} />
      <Card style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "center" }}>
          <Avatar name={c.fullName} size={62} />
          <div style={{ flex: 1, minWidth: 220 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}><h2 style={{ margin: 0, fontSize: 21, fontWeight: 720 }}>{c.fullName}</h2><StatusColorBadge color={customerStatusColor(c)} tone={customerStatusTone(c)} label={localizeCustomerStatusName(c.statusName || c.status)} /></div>
            <div style={{ display: "flex", gap: 16, marginTop: 8, flexWrap: "wrap", color: "var(--text-2)", fontSize: 13 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><I.phone size={14} />{c.phone}</span>
              {hasCustomerLocation(c) && <span style={{ display: "flex", alignItems: "center", gap: 5 }}><I.mapPin size={14} />{customerLocationLabel(c)}</span>}
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><I.sun size={14} />{c.currentSystemKw} kW</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 22 }}>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 760, color: "var(--teal)" }}>{fmtShort(c.totalSpent)}</div><div style={{ fontSize: 11, color: "var(--text-3)" }}>{ctx("amountReceived")}</div></div>
            <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 760, color: "var(--teal)" }}>{fmtShort(c.subsidyAmount)}</div><div style={{ fontSize: 11, color: "var(--text-3)" }}>{ctx("subsidyAmount")}</div></div>
          </div>
        </div>
      </Card>
      <div style={{ marginBottom: 18 }}><Tabs tabs={tabs} active={tab} onChange={setTab} /></div>

      {tab === "overview" && (
        <div className="grid-dash">
          <Panel title={ctx("contactInfo")} icon="user" color="accent">
            <div className="tg-meta">
              <div className="tg-meta-row"><span className="tg-meta-k">{ctx("address")}</span><span className="tg-meta-v">{c.address}</span></div>
              {!!customerTuman(c) && <div className="tg-meta-row"><span className="tg-meta-k">{ctx("tuman")}</span><span className="tg-meta-v">{customerTuman(c)}</span></div>}
              {!!customerMahalla(c) && <div className="tg-meta-row"><span className="tg-meta-k">{ctx("mahalla")}</span><span className="tg-meta-v">{customerMahalla(c)}</span></div>}
              <div className="tg-meta-row"><span className="tg-meta-k">{ctx("paymentType")}</span><span className="tg-meta-v">{c.paymentTypeLabel}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">{ctx("registeredDate")}</span><span className="tg-meta-v">{fmtDate(c.createdAt)}</span></div>
            </div>
          </Panel>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="grid-2">
              <StatTile label={ctx("activeProjects")} value={c.ordersCount} color="blue" />
              <StatTile label={ctx("customerValue")} value={fmtShort(c.lifetimeValue)} sub={ctx("currency")} color="green" />
            </div>
            <Panel title={ctx("note")} icon="note" color="amber">
              <div style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.6 }}>{c.notes || ctx("noNotes")}</div>
            </Panel>
          </div>
        </div>
      )}

      {tab === "debt" && (
        debtor ? (
          <div className="grid-dash">
            <Panel title={ctx("debtCard")} icon="wallet" color="amber">
              <div className="tg-meta">
                <div className="tg-meta-row"><span className="tg-meta-k">{ctx("direction")}</span><span className="tg-meta-v">{debtor.businessLine}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">{ctx("totalAmount")}</span><span className="tg-meta-v">{fmtUZS(debtor.totalUzs)}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">{ctx("paid")}</span><span className="tg-meta-v">{fmtUZS(debtor.paidUzs)}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">{ctx("remaining")}</span><span className="tg-meta-v">{fmtUZS(debtor.remainingDebtUzs)}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">{ctx("overdueAmount")}</span><span className="tg-meta-v">{fmtUZS(debtor.overdueAmountUzs)}</span></div>
                <div className="tg-meta-row"><span className="tg-meta-k">{ctx("deadline")}</span><span className="tg-meta-v">{fmtDate(debtor.dueDate)}</span></div>
              </div>
            </Panel>
            <Panel title={ctx("projectComposition")} icon="box" color="green">
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {debtor.productItems.map((item, i) => <div key={i} style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span>{item.name}</span><strong>{fmtUZS(item.unitPriceUzs)}</strong></div>)}
              </div>
            </Panel>
          </div>
        ) : <Card><EmptyState icon={<I.wallet size={26} />} title={ctx("noDebt")} /></Card>
      )}

      {tab === "ledger" && (
        <Panel title={ctx("ledgerRecords")} icon="chart" color="blue" pad={false}>
          <div className="tg-table-wrap">
            <table className="tg-table">
              <thead><tr><th>{ctx("colDate")}</th><th>{ctx("direction")}</th><th>{ctx("colCategory")}</th><th>{ctx("colAmount")}</th><th>{ctx("colMethod")}</th></tr></thead>
              <tbody>
                {ledger.map(r => (
                  <tr key={r.id}>
                    <td>{fmtDate(r.date)}</td>
                    <td><Badge color={r.direction === "income" ? "green" : "red"} size="sm">{r.direction === "income" ? ctx("income") : ctx("outcome")}</Badge></td>
                    <td>{r.category}</td>
                    <td style={{ fontWeight: 650 }}>{fmtUZS(r.amountUzs)}</td>
                    <td>{r.method}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}
    </div>
  );
}

window.CustomerDetailPage = CustomerDetailPage;
