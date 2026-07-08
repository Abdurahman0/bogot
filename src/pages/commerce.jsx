/* pages/commerce.jsx - debtors and accounting */
const { useState: coS, useMemo: coM, useEffect: coE } = React;
const COMMERCE_UI = {
  uz: {
    overdue: "Muddati o'tgan", withDebt: "Qoldiq bor", closed: "Yopilgan",
    credit: "Kredit", cash: "Naqd",
    totalDebtKpi: "Jami qarzdorlik", creditCustomers: "Kredit mijozlar", districts: "Tumanlar",
    newDebtor: "Yangi qarzdor", emptyDebtors: "Qarzdorlar topilmadi",
    colCustomer: "Mijoz", colDistrict: "Tuman", colMahalla: "Mahalla", colDebt: "Qoldiq",
    excelOk: "Qarzdorlar Excel fayli yuklandi", excelFail: "Excel eksport bajarilmadi",
    debtorCreated: "Qarzdor yozuvi yaratildi", debtorUpdated: "Qarzdor yozuvi yangilandi",
    debtorDeleted: "Qarzdor yozuvi o'chirildi", deleteDebtorTitle: "Qarzdor yozuvini o'chirish",
    debtorNotFound: "Qarzdor topilmadi", backToDebtors: "Qarzdorlarga",
    debtPanel: "Qarzdorlik tarkibi", businessLine: "Biznes yo'nalishi", address: "Manzil",
    totalAmount: "Jami summa", paid: "To'langan", remaining: "Qoldiq",
    overdueAmount: "Muddati o'tgan", deadline: "Muddat", nextReminder: "Keyingi eslatma",
    projectPanel: "Loyiha tarkibi", productCol: "Mahsulot", countCol: "Soni", priceCol: "Narx",
    customerPanel: "Mijoz", lastPaymentsPanel: "To'lovlar tarixi",
    addPayment: "To'lov yozish", editPaymentEntry: "To'lovni tahrirlash", deleteDebtorPayment: "To'lovni o'chirish",
    debtorPaymentAdded: "To'lov yozildi", debtorPaymentUpdated: "To'lov yangilandi", debtorPaymentDeleted: "To'lov o'chirildi",
    openingPaid: "Boshlang'ich to'lov", amountRequired: "Summani kiriting",
    dateCol: "Sana", amountCol: "Summa", methodCol: "Izoh", noPayments: "To'lov yozuvi yo'q", addedBy: "Qo'shgan", createdAtCol: "Vaqt",
    paymentAdded: "Yozuv qo'shildi", paymentUpdated: "Yozuv yangilandi", paymentDeleted: "Yozuv o'chirildi",
    deletePaymentTitle: "Moliyaviy yozuvni o'chirish",
    paymentFormNew: "Yangi hisob-kitob yozuvi", paymentFormEdit: "Hisob-kitobni tahrirlash",
    paymentViewTitle: "Hisob-kitob yozuvi",
    income: "Kirim", expense: "Chiqim", netFlow: "Sof oqim", records: "Yozuvlar",
    direction: "Yo'nalish", category: "Kategoriya", subject: "Subyekt",
    currency: "Valyuta", sortOrder: "Tartib", note: "Izoh", newRecord: "Yangi yozuv",
    paymentsDesc: "Kunlik kirim-chiqim va moliyaviy nazorat",
    debtorsDescUnit: "ta qarzdor yozuvi", availableDistricts: "Mavjud tumanlar",
    availableMahallas: "Mavjud mahallalar", paymentType: "To'lov turi",
    tabAll: "Barchasi", tabOpen: "Qoldiq bor", tabOverdue: "Muddati o'tgan", tabClosed: "Yopilgan",
    remainingLabel: "Qoldiq:", overdueLabel: "Muddati o'tgan:",
    debtorsSearch: "Mijoz, ID, tuman yoki mahalla...", paymentsSearch: "Kategoriya, mijoz, ID...",
    solar: "Quyosh panel biznesi", oldBiz: "Moto biznes",
    filterDebtorType: "Tur", colStatus: "Holat",
    notePlaceholder: "To'lov kelishuvi yoki eslatma...", currencyPh: "UZS yoki USD",
    phoneRequired: "Telefon raqamini kiriting", phoneLabel: "Telefon", debtorLabel: "Mijoz",
    debtorFormNew: "Yangi qarzdor", debtorFormEdit: "Qarzdor yozuvini tahrirlash",
    by: "Kiritdi", countSuffix: "ta", view: "Ko'rish",
    deleteMsg: "Yozuvni o'chirmoqchimisiz?", debtorDeleteMsg: "yozuvini o'chirmoqchimisiz?",
    detailsPhone: "Telefon:", detailsDebt: "Qoldiq qarz:", detailsRegion: "Hudud:",
    detailsCat: "Kategoriya:", detailsAmount: "Summa:",
    startDate: "Boshlanish sanasi", endDate: "Tugash sanasi",
    noDateData: "Tanlangan sana oralig'ida ma'lumot topilmadi", emptyPayments: "Yozuvlar topilmadi",
    districtPh: "Masalan, Bog'ot", mahallaPh: "Masalan, Yangiobod",
    catalogCrumb: "Katalog va moliya", actions: "Amallar", edit: "Tahrirlash", delete: "O'chirish", view: "Ko'rish", cancel: "Bekor qilish", save: "Saqlash", create: "Yaratish", close: "Yopish", clear: "Tozalash",
    incomeUzs: "Kirim (so'm)", incomeUsd: "Dollar kirim", expenseUzs: "Chiqim (so'm)", expenseUsd: "Dollar chiqim", netUzs: "Sof oqim (so'm)", netUsd: "Sof oqim ($)",
    cardIncome: "Karta kirimi", cardExpense: "Karta chiqimi", cardNet: "Karta sof",
    attachmentsPanel: "Fayllar va rasmlar", addAttachment: "Fayl yuklash", noAttachments: "Fayllar yo'q",
    attachmentUploaded: "Fayl yuklandi", attachmentUploadFail: "Fayl yuklanmadi",
    visitProof: "Tashrif dalili", fileTypeImage: "Rasm", fileTypeVideo: "Video", fileTypeFile: "Fayl",
    attachNotes: "Izoh", uploadingFile: "Yuklanmoqda...", attachUploadBtn: "Yuklash",
    fileTypePh: "Fayl turi", attUploadedBy: "Yuklagan", attUploadedAt: "Vaqt",
    dropOrClick: "Fayl tanlash yoki tashlang",
    recallAt: "Qo'ng'iroq vaqti", tabRecall: "Qo'ng'iroq", recallOverdue: "Kechikkan", recallToday: "Bugun", recallSet: "Qo'ng'iroq belgilangan", clearRecall: "Qo'ng'iroqni tozalash",
  },
  ru: {
    overdue: "Просрочено", withDebt: "Есть остаток", closed: "Закрыто",
    credit: "Кредит", cash: "Наличные",
    totalDebtKpi: "Общий долг", creditCustomers: "Кредитные клиенты", districts: "Районы",
    newDebtor: "Новый должник", emptyDebtors: "Должники не найдены",
    colCustomer: "Клиент", colDistrict: "Район", colMahalla: "Махалля", colDebt: "Остаток",
    excelOk: "Файл Excel с должниками загружен", excelFail: "Ошибка экспорта Excel",
    debtorCreated: "Запись должника создана", debtorUpdated: "Запись должника обновлена",
    debtorDeleted: "Запись должника удалена", deleteDebtorTitle: "Удалить запись должника",
    debtorNotFound: "Должник не найден", backToDebtors: "К должникам",
    debtPanel: "Состав долга", businessLine: "Направление бизнеса", address: "Адрес",
    totalAmount: "Общая сумма", paid: "Оплачено", remaining: "Остаток",
    overdueAmount: "Просрочено", deadline: "Срок", nextReminder: "Следующее напоминание",
    projectPanel: "Состав проекта", productCol: "Продукт", countCol: "Кол-во", priceCol: "Цена",
    customerPanel: "Клиент", lastPaymentsPanel: "История платежей",
    addPayment: "Добавить платёж", editPaymentEntry: "Редактировать платёж", deleteDebtorPayment: "Удалить платёж",
    debtorPaymentAdded: "Платёж добавлен", debtorPaymentUpdated: "Платёж обновлён", debtorPaymentDeleted: "Платёж удалён",
    openingPaid: "Начальный платёж", amountRequired: "Введите сумму",
    dateCol: "Дата", amountCol: "Сумма", methodCol: "Примечание", noPayments: "Нет записей о платежах", addedBy: "Внёс", createdAtCol: "Время",
    paymentAdded: "Запись добавлена", paymentUpdated: "Запись обновлена", paymentDeleted: "Запись удалена",
    deletePaymentTitle: "Удалить финансовую запись",
    paymentFormNew: "Новая финансовая запись", paymentFormEdit: "Редактировать финансы",
    paymentViewTitle: "Финансовая запись",
    income: "Приход", expense: "Расход", netFlow: "Чистый поток", records: "Записи",
    direction: "Направление", category: "Категория", subject: "Субъект",
    currency: "Валюта", sortOrder: "Порядок", note: "Примечание", newRecord: "Новая запись",
    paymentsDesc: "Ежедневные доходы-расходы и финансовый контроль",
    debtorsDescUnit: "записей должников", availableDistricts: "Доступные районы",
    availableMahallas: "Доступные махалли", paymentType: "Тип оплаты",
    tabAll: "Все", tabOpen: "Есть остаток", tabOverdue: "Просрочено", tabClosed: "Закрыто",
    remainingLabel: "Остаток:", overdueLabel: "Просрочено:",
    debtorsSearch: "Клиент, ID, район или махалля...", paymentsSearch: "Категория, клиент, ID...",
    solar: "Бизнес солнечных панелей", oldBiz: "Мото бизнес",
    filterDebtorType: "Тип", colStatus: "Статус",
    notePlaceholder: "Договор об оплате или примечание...", currencyPh: "UZS или USD",
    phoneRequired: "Введите номер телефона", phoneLabel: "Телефон", debtorLabel: "Клиент",
    debtorFormNew: "Новый должник", debtorFormEdit: "Редактировать запись должника",
    by: "Внёс", countSuffix: "шт", view: "Просмотр",
    deleteMsg: "Удалить запись?", debtorDeleteMsg: "запись удалить?",
    detailsPhone: "Телефон:", detailsDebt: "Остаток долга:", detailsRegion: "Регион:",
    detailsCat: "Категория:", detailsAmount: "Сумма:",
    startDate: "Дата начала", endDate: "Дата окончания",
    noDateData: "Данные за выбранный период не найдены", emptyPayments: "Записи не найдены",
    districtPh: "Напр., Богот", mahallaPh: "Напр., Янгиобод",
    catalogCrumb: "Каталог и финансы", actions: "Действия", edit: "Редактировать", delete: "Удалить", view: "Просмотр", cancel: "Отмена", save: "Сохранить", create: "Создать", close: "Закрыть", clear: "Очистить",
    incomeUzs: "Приход (сум)", incomeUsd: "Приход ($)", expenseUzs: "Расход (сум)", expenseUsd: "Расход ($)", netUzs: "Чистый поток (сум)", netUsd: "Чистый поток ($)",
    cardIncome: "Кarta приход", cardExpense: "Karta расход", cardNet: "Karta нетто",
    attachmentsPanel: "Файлы и фото", addAttachment: "Загрузить файл", noAttachments: "Файлов нет",
    attachmentUploaded: "Файл загружен", attachmentUploadFail: "Ошибка загрузки",
    visitProof: "Подтверждение визита", fileTypeImage: "Фото", fileTypeVideo: "Видео", fileTypeFile: "Файл",
    attachNotes: "Примечание", uploadingFile: "Загрузка...", attachUploadBtn: "Загрузить",
    fileTypePh: "Тип файла", attUploadedBy: "Загрузил", attUploadedAt: "Время",
    dropOrClick: "Выберите файл или перетащите",
    recallAt: "Время перезвона", tabRecall: "Перезвонить", recallOverdue: "Просрочено", recallToday: "Сегодня", recallSet: "Перезвон назначен", clearRecall: "Снять перезвон",
  },
  en: {
    overdue: "Overdue", withDebt: "Has balance", closed: "Closed",
    credit: "Credit", cash: "Cash",
    totalDebtKpi: "Total debt", creditCustomers: "Credit customers", districts: "Districts",
    newDebtor: "New debtor", emptyDebtors: "No debtors found",
    colCustomer: "Customer", colDistrict: "District", colMahalla: "Mahalla", colDebt: "Balance",
    excelOk: "Debtors Excel file downloaded", excelFail: "Excel export failed",
    debtorCreated: "Debtor record created", debtorUpdated: "Debtor record updated",
    debtorDeleted: "Debtor record deleted", deleteDebtorTitle: "Delete debtor record",
    debtorNotFound: "Debtor not found", backToDebtors: "Back to debtors",
    debtPanel: "Debt composition", businessLine: "Business line", address: "Address",
    totalAmount: "Total amount", paid: "Paid", remaining: "Balance",
    overdueAmount: "Overdue", deadline: "Due date", nextReminder: "Next reminder",
    projectPanel: "Project items", productCol: "Product", countCol: "Qty", priceCol: "Price",
    customerPanel: "Customer", lastPaymentsPanel: "Payment history",
    addPayment: "Add payment", editPaymentEntry: "Edit payment", deleteDebtorPayment: "Delete payment",
    debtorPaymentAdded: "Payment added", debtorPaymentUpdated: "Payment updated", debtorPaymentDeleted: "Payment deleted",
    openingPaid: "Opening payment", amountRequired: "Enter amount",
    dateCol: "Date", amountCol: "Amount", methodCol: "Notes", noPayments: "No payment records", addedBy: "Added by", createdAtCol: "Time",
    paymentAdded: "Record added", paymentUpdated: "Record updated", paymentDeleted: "Record deleted",
    deletePaymentTitle: "Delete financial record",
    paymentFormNew: "New accounting entry", paymentFormEdit: "Edit accounting entry",
    paymentViewTitle: "Accounting entry",
    income: "Income", expense: "Expense", netFlow: "Net flow", records: "Records",
    direction: "Direction", category: "Category", subject: "Subject",
    currency: "Currency", sortOrder: "Order", note: "Note", newRecord: "New entry",
    paymentsDesc: "Daily income/expenses and financial control",
    debtorsDescUnit: "debtor records", availableDistricts: "Available districts",
    availableMahallas: "Available mahallas", paymentType: "Payment type",
    tabAll: "All", tabOpen: "Has balance", tabOverdue: "Overdue", tabClosed: "Closed",
    remainingLabel: "Balance:", overdueLabel: "Overdue:",
    debtorsSearch: "Customer, ID, district or mahalla...", paymentsSearch: "Category, customer, ID...",
    solar: "Solar panel business", oldBiz: "Moto biznes",
    filterDebtorType: "Type", colStatus: "Status",
    notePlaceholder: "Payment agreement or note...", currencyPh: "UZS or USD",
    phoneRequired: "Enter phone number", phoneLabel: "Phone", debtorLabel: "Customer",
    debtorFormNew: "New debtor", debtorFormEdit: "Edit debtor record",
    by: "By", countSuffix: "pcs", view: "View",
    deleteMsg: "Delete this record?", debtorDeleteMsg: "record delete?",
    detailsPhone: "Phone:", detailsDebt: "Balance:", detailsRegion: "Region:",
    detailsCat: "Category:", detailsAmount: "Amount:",
    startDate: "Start date", endDate: "End date",
    noDateData: "No data found for the selected date range", emptyPayments: "No records found",
    districtPh: "e.g. Bogot", mahallaPh: "e.g. Yangiobod",
    catalogCrumb: "Catalog & Finance", actions: "Actions", edit: "Edit", delete: "Delete", view: "View", cancel: "Cancel", save: "Save", create: "Create", close: "Close", clear: "Clear",
    incomeUzs: "Income (UZS)", incomeUsd: "Dollar income", expenseUzs: "Expense (UZS)", expenseUsd: "Dollar expense", netUzs: "Net flow (UZS)", netUsd: "Net flow ($)",
    cardIncome: "Card income", cardExpense: "Card expense", cardNet: "Card net",
    attachmentsPanel: "Files & Photos", addAttachment: "Upload file", noAttachments: "No files yet",
    attachmentUploaded: "File uploaded", attachmentUploadFail: "Upload failed",
    visitProof: "Visit proof", fileTypeImage: "Photo", fileTypeVideo: "Video", fileTypeFile: "File",
    attachNotes: "Notes", uploadingFile: "Uploading...", attachUploadBtn: "Upload",
    fileTypePh: "File type", attUploadedBy: "Uploaded by", attUploadedAt: "Time",
    dropOrClick: "Click to select or drag & drop",
    recallAt: "Callback time", tabRecall: "Recall", recallOverdue: "Overdue", recallToday: "Today", recallSet: "Recall scheduled", clearRecall: "Clear recall",
  },
};
function comLang() { return window.__TG_LANG || "uz"; }
function comTx(key) { return COMMERCE_UI[comLang()]?.[key] || COMMERCE_UI.uz[key] || key; }
const debtNum = (value) => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};
const rawDebt = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const s = String(value).trim();
  if (!s || Number(s) === 0) return null;
  return s;
};
const orderTakenDate = (order) => String(order?.createdAt || "").slice(0, 10);
const orderDateMatchesRange = (dateValue, from, to) => {
  const value = String(dateValue || "").slice(0, 10);
  if (!from && !to) return true;
  if (!value) return false;
  if (from && value < from) return false;
  if (to && value > to) return false;
  return true;
};
const orderLocations = (locations) => locations || {};
const orderDistrictOptions = (locations) => Object.keys(orderLocations(locations));
const orderTuman = (order) => order?.district || "";
const orderMahalla = (order) => order?.mahalla || "";
const orderLocationLabel = (order) => [orderTuman(order), orderMahalla(order)].filter(Boolean).join(" / ");
const hasOrderLocation = (order) => !!orderLocationLabel(order);
const debtorMahallasFor = (district, locations) => orderLocations(locations)[district] || [];
const isDollarPayment = (p) => {
  const m = String(p.method || p.currency || "").toLowerCase();
  return m.includes("dollar") || p.rawCategory === "dollar_income" || p.rawCategory === "dollar_expense";
};
const isCardPayment = (p) => p.rawCategory === "card_income" || p.rawCategory === "card_expense";
const isSomPayment = (p) => !isDollarPayment(p) && !isCardPayment(p);
const fmtPaymentAmount = (p) => {
  if (isDollarPayment(p)) return `$${Number(p.amountUzs || 0).toLocaleString("en-US")}`;
  return fmtUZS(p.amountUzs);
};
const ACCOUNTING_CATEGORY_OPTIONS = [
  { value: "cash_income", label: "Naqd kirim" },
  { value: "card_income", label: "Karta kirimi" },
  { value: "dollar_income", label: "Dollar kirimi" },
  { value: "daily_expense", label: "Kunlik xarajat" },
  { value: "credit_expense", label: "Kredit xarajati" },
  { value: "card_expense", label: "Karta chiqimi" },
  { value: "dollar_expense", label: "Dollar chiqimi" },
];
const currencyForAccountingCategory = (category) => String(category || "").startsWith("dollar_") ? "USD" : "UZS";

function OrderRow({ o, onClick }) {
  const overdueAmount = debtNum(o.overdueAmountUzs);
  const remainingDebt = debtNum(o.remainingDebtUzs);
  const locationText = orderLocationLabel(o);
  const metaParts = [o.businessLine, o.paymentType === "credit" ? comTx("credit") : comTx("cash"), fmtDate(o.createdAt)].filter(Boolean);
  const subMetaParts = [locationText, o.deliveryAddress].filter(Boolean);
  return (
    <Card hover onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span className="tg-card-icon" style={{ color: "var(--amber)", background: "var(--amber-bg)" }}><I.wallet size={17} /></span>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div className="tg-cell-strong">{o.customerName}</div>
          <div className="tg-cell-sub">{o.businessLine} • {o.paymentType === "credit" ? comTx("credit") : comTx("cash")} • {fmtDate(o.createdAt)}</div>
          <div className="tg-cell-sub">{orderLocationLabel(o)} • {o.deliveryAddress}</div>
        </div>
        {hasOrderLocation(o) && <Badge color="slate" size="sm">{orderMahalla(o) || orderTuman(o)}</Badge>}
        <Badge color={overdueAmount > 0 ? "red" : remainingDebt > 0 ? "amber" : "green"} size="sm">
          {overdueAmount > 0 ? comTx("overdue") : remainingDebt > 0 ? comTx("withDebt") : comTx("closed")}
        </Badge>
        <div style={{ fontWeight: 700, fontSize: 15, minWidth: 130, textAlign: "right" }}>{rawDebt(o.remainingDebtUzs) ?? "—"}</div>
      </div>
    </Card>
  );
}
window.OrderRow = OrderRow;

OrderRow = function OrderRowPatched({ o, onClick, onEdit, onDelete, onAddPayment }) {
  const overdueAmount = debtNum(o.overdueAmountUzs);
  const remainingDebt = debtNum(o.remainingDebtUzs);
  const locationText = orderLocationLabel(o);
  const metaParts = [o.businessLine, o.paymentType === "credit" ? comTx("credit") : comTx("cash"), fmtDate(o.createdAt)].filter(Boolean);
  const subMetaParts = [locationText, o.deliveryAddress].filter(Boolean);
  const recallBadge = (() => {
    if (!o.recallAt) return null;
    const now = new Date();
    const recall = new Date(o.recallAt);
    const diffMs = recall - now;
    const isToday = recall.toDateString() === now.toDateString();
    const isPast = diffMs < 0;
    return { color: isPast ? "red" : isToday ? "amber" : "blue", label: isPast ? comTx("recallOverdue") : isToday ? comTx("recallToday") : comTx("recallSet"), time: recall.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
  })();
  return (
    <Card hover onClick={onClick}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <span className="tg-card-icon" style={{ color: "var(--amber)", background: "var(--amber-bg)" }}><I.wallet size={17} /></span>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div className="tg-cell-strong">{o.customerName}</div>
          <div className="tg-cell-sub">{metaParts.join(" • ")}</div>
          {!!subMetaParts.length && <div className="tg-cell-sub">{subMetaParts.join(" • ")}</div>}
        </div>
        {hasOrderLocation(o) && <Badge color="slate" size="sm">{orderMahalla(o) || orderTuman(o)}</Badge>}
        {recallBadge && <Badge color={recallBadge.color} size="sm" title={o.recallAt}>📞 {recallBadge.label} {recallBadge.time}</Badge>}
        <Badge color={overdueAmount > 0 ? "red" : remainingDebt > 0 ? "amber" : "green"} size="sm">
          {overdueAmount > 0 ? comTx("overdue") : remainingDebt > 0 ? comTx("withDebt") : comTx("closed")}
        </Badge>
        {(onAddPayment || onEdit || onDelete) && (
          <div onClick={(event) => event.stopPropagation()}>
            <Dropdown
              align="right"
              trigger={<IconButton icon={<I.dots size={16} />} label={comTx("actions")} />}
              items={[
                { label: comTx("addPayment"), icon: <I.plus size={16} />, onClick: onAddPayment },
                { label: comTx("edit"), icon: <I.edit size={16} />, onClick: onEdit },
                { divider: true },
                { label: comTx("delete"), icon: <I.trash size={16} />, danger: true, onClick: onDelete },
              ].filter((item) => item.divider || item.onClick)}
            />
          </div>
        )}
        <div style={{ fontWeight: 700, fontSize: 15, minWidth: 130, textAlign: "right" }}>{rawDebt(o.remainingDebtUzs) ?? "—"}</div>
      </div>
    </Card>
  );
};
window.OrderRow = OrderRow;

function OrdersPage() {
  const { data, t, nav, upsert, remove, toast } = useApp();
  const canManage = canDo("accounting.manage", data);
  const [q, setQ] = coS("");
  const [statusTab, setStatusTab] = coS("all");
  const [districtFilter, setDistrictFilter] = coS("all");
  const [mahallaFilter, setMahallaFilter] = coS("all");
  const [exporting, setExporting] = coS(false);
  const [dateFrom, setDateFrom] = coS("");
  const [dateTo, setDateTo] = coS("");
  const [debtorTypeFilter, setDebtorTypeFilter] = coS("all");
  const [createOpen, setCreateOpen] = coS(false);
  const [editOrder, setEditOrder] = coS(null);
  const [deleteOrder, setDeleteOrder] = coS(null);
  const [addPaymentOrder, setAddPaymentOrder] = coS(null);
  const [ordPage, setOrdPage] = coS(1);
  const [ordTotal, setOrdTotal] = coS(0);
  const [ordRows, setOrdRows] = coS([]);
  const [ordLoading, setOrdLoading] = coS(false);
  const [listRefreshTick, setListRefreshTick] = coS(0);

  coE(() => { setOrdPage(1); }, [q, debtorTypeFilter]);

  coE(() => {
    let cancelled = false;
    setOrdLoading(true);
    apiGetDebtorsPage({
      page: ordPage,
      page_size: 50,
      search: q || undefined,
      debtor_type: debtorTypeFilter !== "all" ? debtorTypeFilter : undefined,
    }).then(({ results, count }) => {
      if (cancelled) return;
      setOrdRows(results);
      setOrdTotal(count);
      setOrdLoading(false);
    }).catch(() => { if (!cancelled) setOrdLoading(false); });
    return () => { cancelled = true; };
  }, [ordPage, q, debtorTypeFilter, listRefreshTick]);

  const allOrders = data.orders || [];
  const districts = coM(() => [...new Set(allOrders.map((order) => orderTuman(order)).filter(Boolean))].sort((a, b) => a.localeCompare(b, "uz")), [allOrders]);
  const districtOptions = coM(() => districts.map((district) => ({ value: district, label: district })), [districts]);
  const mahallaOptions = coM(() => {
    const source = districtFilter === "all"
      ? allOrders
      : allOrders.filter((order) => orderTuman(order) === districtFilter);
    return [...new Set(source.map((order) => orderMahalla(order)).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, "uz"))
      .map((mahalla) => ({ value: mahalla, label: mahalla }));
  }, [allOrders, districtFilter]);
  const showLocationFilters = statusTab === "all";
  const showFullGrouped = showLocationFilters && districtFilter === "all" && mahallaFilter === "all";
  const showDistrictGrouped = showLocationFilters && districtFilter !== "all" && mahallaFilter === "all";
  const showFlatList = !showLocationFilters || mahallaFilter !== "all";

  coE(() => {
    if (mahallaFilter !== "all" && !mahallaOptions.some((option) => option.value === mahallaFilter)) {
      setMahallaFilter("all");
    }
  }, [districtFilter, mahallaFilter, mahallaOptions]);

  const exportDebtorsExcel = async () => {
    try {
      setExporting(true);
      await apiDownloadDebtorsExcel({
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
        district: districtFilter !== "all" ? districtFilter : undefined,
        neighborhood: mahallaFilter !== "all" ? mahallaFilter : undefined,
      });
      toast(comTx("excelOk"));
    } catch (error) {
      toast(error.message || comTx("excelFail"), "error");
    } finally {
      setExporting(false);
    }
  };

  // allFiltered: client-side filter of all debtors — used for grouped views and tab counts
  const allFiltered = coM(() => allOrders.filter(o => {
    if (q) {
      const term = q.toLowerCase();
      if (!(o.customerName || "").toLowerCase().includes(term) &&
          !String(o.id).includes(q) &&
          !(o.phone || "").toLowerCase().includes(term) &&
          !(o.district || "").toLowerCase().includes(term) &&
          !(o.mahalla || "").toLowerCase().includes(term)) return false;
    }
    if (statusTab === "overdue" && debtNum(o.overdueAmountUzs) <= 0) return false;
    if (statusTab === "open" && debtNum(o.remainingDebtUzs) <= 0) return false;
    if (statusTab === "closed" && debtNum(o.remainingDebtUzs) > 0) return false;
    if (statusTab === "recall" && !o.recallAt) return false;
    if (showLocationFilters && districtFilter !== "all" && orderTuman(o) !== districtFilter) return false;
    if (showLocationFilters && mahallaFilter !== "all" && orderMahalla(o) !== mahallaFilter) return false;
    if (!orderDateMatchesRange(orderTakenDate(o), dateFrom, dateTo)) return false;
    return true;
  }), [allOrders, q, statusTab, showLocationFilters, districtFilter, mahallaFilter, dateFrom, dateTo]);

  // filtered: server-paginated ordRows — used only for flat table view (statusTab === "all")
  const filtered = coM(() => ordRows.filter(o => {
    if (!orderDateMatchesRange(orderTakenDate(o), dateFrom, dateTo)) return false;
    return true;
  }), [ordRows, dateFrom, dateTo]);

  // when a status tab is active, allFiltered (full dataset) is more accurate than ordRows (current server page)
  const listRows = statusTab !== "all" ? allFiltered : filtered;

  const grouped = coM(() => {
    const map = new Map();
    const ungrouped = [];
    allFiltered
      .slice()
      .sort((a, b) =>
        orderTuman(a).localeCompare(orderTuman(b), "uz") ||
        orderMahalla(a).localeCompare(orderMahalla(b), "uz") ||
        a.customerName.localeCompare(b.customerName, "uz")
      )
      .forEach((o) => {
        const tuman = orderTuman(o);
        const mahalla = orderMahalla(o);
        if (!tuman) {
          ungrouped.push(o);
          return;
        }
        if (!map.has(tuman)) map.set(tuman, new Map());
        const mahallaMap = map.get(tuman);
        if (!mahallaMap.has(mahalla || "")) mahallaMap.set(mahalla || "", []);
        mahallaMap.get(mahalla || "").push(o);
      });
    return {
      located: Array.from(map.entries()).map(([district, mahallaMap]) => {
        const mahallas = Array.from(mahallaMap.entries()).map(([mahalla, orders]) => ({
          mahalla,
          orders,
          totalDebt: orders.reduce((sum, row) => sum + debtNum(row.remainingDebtUzs), 0),
          overdueDebt: orders.reduce((sum, row) => sum + debtNum(row.overdueAmountUzs), 0),
        }));
        return {
          district,
          mahallas,
          orders: mahallas.flatMap(group => group.orders).sort((a, b) =>
            orderMahalla(a).localeCompare(orderMahalla(b), "uz") ||
            a.customerName.localeCompare(b.customerName, "uz")
          ),
          totalDebt: mahallas.reduce((sum, group) => sum + group.totalDebt, 0),
          overdueDebt: mahallas.reduce((sum, group) => sum + group.overdueDebt, 0),
        };
      }),
      ungrouped,
    };
  }, [allFiltered]);

  const totalDebt = allOrders.reduce((sum, o) => sum + debtNum(o.remainingDebtUzs), 0);
  const overdue = allOrders.reduce((sum, o) => sum + debtNum(o.overdueAmountUzs), 0);
  const tabs = [
    { value: "all", label: comTx("tabAll"), count: ordTotal },
    { value: "open", label: comTx("tabOpen"), count: allOrders.filter(o => debtNum(o.remainingDebtUzs) > 0).length },
    { value: "overdue", label: comTx("tabOverdue"), count: allOrders.filter(o => debtNum(o.overdueAmountUzs) > 0).length },
    { value: "closed", label: comTx("tabClosed"), count: allOrders.filter(o => debtNum(o.remainingDebtUzs) === 0).length },
    { value: "recall", label: comTx("tabRecall"), count: allOrders.filter(o => !!o.recallAt).length },
  ];

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.orders")} desc={`${ordTotal} ${comTx("debtorsDescUnit")}`} crumbs={[{ label: comTx("catalogCrumb") }, { label: t("page.orders") }]}
        actions={<>
          <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setCreateOpen(true)}>{comTx("newDebtor")}</Button>
        </>} />
      <div className="grid-kpi" style={{ marginBottom: 18 }}>
        <StatTile label={comTx("totalDebtKpi")} value={fmtShort(totalDebt)} sub="so'm" color="red" />
        <StatTile label={comTx("tabOverdue")} value={fmtShort(overdue)} sub="so'm" color="amber" />
        <StatTile label={comTx("creditCustomers")} value={allOrders.filter(o => o.paymentType === "credit").length} color="blue" />
        <StatTile label={comTx("districts")} value={new Set(allOrders.map(o => orderTuman(o)).filter(Boolean)).size} color="violet" />
      </div>
      <div className="toolbar">
        <SearchInput value={q} onChange={setQ} placeholder={comTx("debtorsSearch")} width={260} />
        <FilterSelect label={comTx("filterDebtorType")} icon="layers" value={debtorTypeFilter} onChange={setDebtorTypeFilter} options={[{ value: "moto_business", label: comTx("oldBiz") }, { value: "solar_business", label: comTx("solar") }]} />
        {showLocationFilters && <FilterSelect label={comTx("colDistrict")} icon="mapPin" value={districtFilter} onChange={setDistrictFilter} options={districtOptions} />}
        {showLocationFilters && <FilterSelect label={comTx("colMahalla")} icon="home" value={mahallaFilter} onChange={setMahallaFilter} options={mahallaOptions} />}
        <div style={{ width: 170 }}><DatePickerInput value={dateFrom} onChange={setDateFrom} placeholder={comTx("startDate")} /></div>
        <div style={{ width: 170 }}><DatePickerInput value={dateTo} onChange={setDateTo} placeholder={comTx("endDate")} /></div>
        {(dateFrom || dateTo) ? <Button variant="ghost" size="sm" onClick={() => { setDateFrom(""); setDateTo(""); }}>{comTx("clear")}</Button> : null}
        <div className="toolbar-spacer" />
        <Button variant="default" size="sm" icon={<I.download size={15} />} onClick={exportDebtorsExcel} disabled={exporting}>Excel</Button>
      </div>
      <div style={{ marginBottom: 16 }}><Tabs tabs={tabs} active={statusTab} onChange={setStatusTab} /></div>
      {ordLoading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton" style={{ height: 76, borderRadius: 14 }} />)}
        </div>
      ) : (showFlatList ? listRows : allFiltered).length === 0 ? (
        <Card><EmptyState icon={<I.wallet size={26} />} title={(dateFrom || dateTo) ? comTx("noDateData") : comTx("emptyDebtors")} /></Card>
      ) : showFlatList ? (
        <Card pad={false}>
          <DataTable
            columns={[
              { key: "name", label: comTx("colCustomer"), sortVal: (row) => row.customerName, render: (row) => <div><div className="tg-cell-strong">{row.customerName}</div><div className="tg-cell-sub">{row.phone || row.id}</div></div> },
              { key: "district", label: comTx("colDistrict"), sortVal: (row) => orderTuman(row), render: (row) => orderTuman(row) || <span className="tg-cell-sub">—</span> },
              { key: "mahalla", label: comTx("colMahalla"), sortVal: (row) => orderMahalla(row), render: (row) => orderMahalla(row) || <span className="tg-cell-sub">—</span> },
              { key: "type", label: comTx("filterDebtorType"), sortVal: (row) => row.debtorType || "", render: (row) => (row.debtorType === "solar_business" || row.debtorType === "solar_panel") ? <Badge color="blue" size="sm">{comTx("solar")}</Badge> : row.debtorType === "moto_business" ? <Badge color="amber" size="sm">{comTx("oldBiz")}</Badge> : <span className="tg-cell-sub">—</span> },
              { key: "status", label: comTx("colStatus"), sortVal: (row) => debtNum(row.overdueAmountUzs) > 0 ? 2 : debtNum(row.remainingDebtUzs) > 0 ? 1 : 0, render: (row) => { const ov = debtNum(row.overdueAmountUzs); const rem = debtNum(row.remainingDebtUzs); return <Badge color={ov > 0 ? "red" : rem > 0 ? "amber" : "green"} size="sm">{ov > 0 ? comTx("overdue") : rem > 0 ? comTx("withDebt") : comTx("closed")}</Badge>; } },
              { key: "debt", label: comTx("colDebt"), sortVal: (row) => debtNum(row.remainingDebtUzs), render: (row) => <span style={{ fontWeight: 700 }}>{rawDebt(row.remainingDebtUzs) ?? "—"}</span> },
            ]}
            rows={listRows}
            onRowClick={(row) => nav("/debtors/" + row.id)}
            defaultSort={{ key: "debt", dir: "desc" }}
          />
          {statusTab === "all" && <PaginationBar page={ordPage} total={ordTotal} pageSize={50} onChange={setOrdPage} />}
        </Card>
      ) : showDistrictGrouped ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {grouped.located.map(group => (
            <Card key={group.district} style={{ padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 12 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="tg-card-icon" style={{ color: "var(--blue)", background: "var(--blue-bg)" }}><I.mapPin size={15} /></span>
                    <div style={{ fontSize: 16, fontWeight: 760 }}>{group.district}</div>
                    <Badge color="slate" size="sm">{group.orders.length} ta</Badge>
                  </div>
                  <div className="tg-cell-sub" style={{ marginTop: 4 }}>
                    {comTx("remainingLabel")} {fmtUZS(group.totalDebt)}{group.overdueDebt > 0 ? ` • ${comTx("overdueLabel")} ${fmtUZS(group.overdueDebt)}` : ""}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {group.orders.map(o => <OrderRow key={o.id} o={o} onClick={() => nav("/debtors/" + o.id)} onEdit={canManage ? () => setEditOrder(o) : undefined} onDelete={canManage ? () => setDeleteOrder(o) : undefined} onAddPayment={canManage ? () => setAddPaymentOrder(o) : undefined} />)}
              </div>
            </Card>
          ))}
          {!!grouped.ungrouped.length && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {grouped.ungrouped.map(o => <OrderRow key={o.id} o={o} onClick={() => nav("/debtors/" + o.id)} onEdit={canManage ? () => setEditOrder(o) : undefined} onDelete={canManage ? () => setDeleteOrder(o) : undefined} onAddPayment={canManage ? () => setAddPaymentOrder(o) : undefined} />)}
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {grouped.located.map(group => (
            <div key={group.district}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 14, flexWrap: "wrap", marginBottom: 10 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span className="tg-card-icon" style={{ color: "var(--blue)", background: "var(--blue-bg)" }}><I.mapPin size={15} /></span>
                    <div style={{ fontSize: 16, fontWeight: 760 }}>{group.district}</div>
                    <Badge color="slate" size="sm">{group.orders.length} ta</Badge>
                  </div>
                  <div className="tg-cell-sub" style={{ marginTop: 4 }}>
                    {comTx("remainingLabel")} {fmtUZS(group.totalDebt)}{group.overdueDebt > 0 ? ` • ${comTx("overdueLabel")} ${fmtUZS(group.overdueDebt)}` : ""}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {group.mahallas.map((mahallaGroup) => (
                  <Card key={`${group.district}_${mahallaGroup.mahalla || "no_mahalla"}`} style={{ padding: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap", marginBottom: 10 }}>
                      {mahallaGroup.mahalla ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <span className="tg-card-icon" style={{ color: "var(--violet)", background: "var(--violet-bg)" }}><I.home size={14} /></span>
                          <div style={{ fontSize: 14, fontWeight: 720 }}>{mahallaGroup.mahalla}</div>
                          <Badge color="slate" size="sm">{mahallaGroup.orders.length} ta</Badge>
                        </div>
                      ) : <div />}
                      <div className="tg-cell-sub">
                        {comTx("remainingLabel")} {fmtUZS(mahallaGroup.totalDebt)}{mahallaGroup.overdueDebt > 0 ? ` • ${comTx("overdueLabel")} ${fmtUZS(mahallaGroup.overdueDebt)}` : ""}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {mahallaGroup.orders.map(o => <OrderRow key={o.id} o={o} onClick={() => nav("/debtors/" + o.id)} onEdit={canManage ? () => setEditOrder(o) : undefined} onDelete={canManage ? () => setDeleteOrder(o) : undefined} onAddPayment={canManage ? () => setAddPaymentOrder(o) : undefined} />)}
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
          {!!grouped.ungrouped.length && (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {grouped.ungrouped.map(o => <OrderRow key={o.id} o={o} onClick={() => nav("/debtors/" + o.id)} onEdit={canManage ? () => setEditOrder(o) : undefined} onDelete={canManage ? () => setDeleteOrder(o) : undefined} onAddPayment={canManage ? () => setAddPaymentOrder(o) : undefined} />)}
            </div>
          )}
        </div>
      )}
      <OrderFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        locations={data.locations}
        onSave={async (order) => {
          await upsert("orders", order);
          toast(comTx("debtorCreated"));
          setCreateOpen(false);
          setListRefreshTick(t => t + 1);
        }}
      />
      <OrderFormModal
        open={!!editOrder}
        onClose={() => setEditOrder(null)}
        initial={editOrder}
        locations={data.locations}
        onSave={async (order) => {
          await upsert("orders", order);
          toast(comTx("debtorUpdated"));
          setEditOrder(null);
          setListRefreshTick(t => t + 1);
        }}
      />
      <DebtorPaymentModal
        open={!!addPaymentOrder}
        onClose={() => setAddPaymentOrder(null)}
        onSave={async (pay) => {
          await apiSaveDebtorPayment({ ...pay, debtorId: addPaymentOrder.id });
          toast(comTx("debtorPaymentAdded"));
          setAddPaymentOrder(null);
          setListRefreshTick(t => t + 1);
        }}
      />
      <ConfirmDialog
        open={!!deleteOrder}
        onClose={() => setDeleteOrder(null)}
        onConfirm={async () => {
          await remove("orders", deleteOrder.id);
          toast(comTx("debtorDeleted"));
          setDeleteOrder(null);
        }}
        title={comTx("deleteDebtorTitle")}
        message={`"${deleteOrder?.customerName || ""}" yozuvini o'chirmoqchimisiz?`}
        details={deleteOrder ? [`${comTx("detailsPhone")} ${deleteOrder.phone || "-"}`, rawDebt(deleteOrder.remainingDebtUzs) ? `${comTx("detailsDebt")} ${rawDebt(deleteOrder.remainingDebtUzs)}` : "", hasOrderLocation(deleteOrder) ? `${comTx("detailsRegion")} ${orderLocationLabel(deleteOrder)}` : ""].filter(Boolean).join("\n") : ""}
        confirmLabel={comTx("delete")}
        danger
      />
    </div>
  );
}
window.OrdersPage = OrdersPage;

function OrderFormModal({ open, onClose, onSave, initial, locations }) {
  const { data, toast } = useApp();
  const apiDistricts = data.districts || [];
  const apiNeighborhoods = data.neighborhoods || [];
  const districts = apiDistricts.length ? apiDistricts.map(d => d.name) : orderDistrictOptions(locations);
  const blank = {
    customerName: "",
    phone: "",
    district: "",
    mahalla: "",
    businessLine: "Quyosh panel biznesi",
    deliveryAddress: "",
    paymentType: "credit",
    totalUzs: 0,
    paidUzs: 0,
    overdueAmountUzs: 0,
    dueDate: new Date().toISOString().slice(0, 10),
    nextReminderAt: new Date().toISOString().slice(0, 10),
    note: "",
    recallAt: null,
  };
  const normalizeLocation = (item) => {
    const district = item?.district || "";
    const mahalla = item?.mahalla || "";
    return { ...blank, ...item, district, mahalla };
  };
  const [form, setForm] = coS(normalizeLocation(initial || blank));

  React.useEffect(() => {
    setForm(normalizeLocation(initial || blank));
  }, [initial, open]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Modal open={open} onClose={onClose} title={initial ? comTx("debtorFormEdit") : comTx("debtorFormNew")} icon={initial ? <I.edit size={18} /> : <I.plus size={18} />} width={620}
      footer={<>
        <Button variant="ghost" onClick={onClose}>{comTx("cancel")}</Button>
        <Button variant="primary" onClick={async () => {
          const phone = (form.phone || "").trim();
          if (!phone) {
            toast(comTx("phoneRequired"), "error");
            return;
          }
          const totalUzs = +form.totalUzs || 0;
          const paidUzs = +form.paidUzs || 0;
          const overdueAmountUzs = +form.overdueAmountUzs || 0;
          const remainingDebtUzs = Math.max(0, totalUzs - paidUzs);
          const linkedCustomer = data.customers.find(c => c.fullName.toLowerCase() === (form.customerName || "").trim().toLowerCase());
          const linkedLead = data.leads.find(l => l.fullName.toLowerCase() === (form.customerName || "").trim().toLowerCase());
          await onSave({
            ...form,
            id: form.id || `DBT${Date.now()}`,
            customerId: linkedCustomer?.id || null,
            leadId: linkedLead?.id || null,
            customerName: (form.customerName || "").trim(),
            phone: phone || linkedCustomer?.phone || "",
            district: (form.district || "").trim(),
            mahalla: form.mahalla || linkedCustomer?.mahalla || "",
            businessLine: form.businessLine,
            deliveryAddress: (form.deliveryAddress || linkedCustomer?.address || "").trim(),
            paymentType: form.paymentType,
            totalUzs,
            principalUzs: totalUzs,
            paidUzs,
            remainingDebtUzs,
            overdueAmountUzs,
            paymentStatus: remainingDebtUzs === 0 ? "paid" : paidUzs > 0 ? "partial" : "unpaid",
            status: overdueAmountUzs > 0 ? "processing" : "confirmed",
            dueDate: form.dueDate,
            nextReminderAt: form.nextReminderAt,
            lastPaymentAt: paidUzs > 0 ? new Date().toISOString() : null,
            discountUzs: form.discountUzs || 0,
            productItems: form.productItems || [],
            note: form.note || "",
            createdAt: form.createdAt || new Date().toISOString(),
            recallAt: form.recallAt || null,
          });
        }}>{initial ? comTx("save") : comTx("create")}</Button>
      </>}>
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <Field label={comTx("debtorLabel")}><Input value={form.customerName} onChange={e => set("customerName", e.target.value)} /></Field>
          <Field label={comTx("phoneLabel")} required><Input value={form.phone || ""} onChange={e => set("phone", e.target.value)} placeholder="+998 90 123 45 67" /></Field>
          <Field label={comTx("colDistrict")}>{apiDistricts.length ? <Select value={form.district} onChange={v => { set("district", v); set("mahalla", ""); }} options={[{ value: "", label: "— tanlang —" }, ...apiDistricts.map(d => ({ value: d.name, label: d.name }))]} /> : <Input value={form.district} onChange={e => set("district", e.target.value)} placeholder={comTx("districtPh")} />}</Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <Field label={comTx("colMahalla")}>{apiDistricts.length ? <Select value={form.mahalla} onChange={v => set("mahalla", v)} options={[{ value: "", label: "— tanlang —" }, ...apiNeighborhoods.filter(n => { const d = apiDistricts.find(d => d.name === form.district); return d && n.district === d.id; }).map(n => ({ value: n.name, label: n.name }))]} /> : <Input value={form.mahalla} onChange={e => set("mahalla", e.target.value)} placeholder={comTx("mahallaPh")} />}</Field>
          <Field label={comTx("direction")}><Select value={form.businessLine} onChange={v => set("businessLine", v)} options={[{ value: "Quyosh panel biznesi", label: comTx("solar") }, { value: "Moto biznes", label: comTx("oldBiz") }]} /></Field>
          <Field label={comTx("paymentType")}><Select value={form.paymentType} onChange={v => set("paymentType", v)} options={[{ value: "credit", label: comTx("credit") }, { value: "cash", label: comTx("cash") }]} /></Field>
        </div>
        {!!districts.length && (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>{comTx("availableDistricts")}</div>
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
        {!!form.district && !!debtorMahallasFor(form.district, locations).length && (
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>{comTx("availableMahallas")}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {debtorMahallasFor(form.district, locations).slice(0, 12).map((mahalla) => (
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
        <div style={{ display: "grid", gridTemplateColumns: initial ? "1fr 1fr" : "1fr 1fr 1fr", gap: 14 }}>
          <Field label={comTx("totalAmount")}><Input type="number" value={form.totalUzs} onChange={e => set("totalUzs", e.target.value)} /></Field>
          {!initial && <Field label={comTx("openingPaid")}><Input type="number" value={form.paidUzs} onChange={e => set("paidUzs", e.target.value)} placeholder="0" /></Field>}
          <Field label={comTx("deadline")}><DatePickerInput value={(form.dueDate || "").slice(0, 10)} onChange={(value) => set("dueDate", value)} /></Field>
        </div>
        <Field label={comTx("note")}><Textarea rows={4} value={form.note || ""} onChange={e => set("note", e.target.value)} placeholder={comTx("notePlaceholder")} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
          <Field label={comTx("recallAt")}>
            <DatePickerInput value={form.recallAt || ""} onChange={v => set("recallAt", v || null)} mode="datetime" placeholder="— belgilanmagan —" />
          </Field>
          {form.recallAt && <Button variant="ghost" size="sm" onClick={() => set("recallAt", null)} style={{ marginBottom: 2 }}>{comTx("clearRecall")}</Button>}
        </div>
      </div>
    </Modal>
  );
}

function DebtorPaymentModal({ open, onClose, onSave, initial }) {
  const { toast } = useApp();
  const blank = { amount: "", paid_on: new Date().toISOString().slice(0, 10), notes: "" };
  const [form, setForm] = coS(initial || blank);
  const [saving, setSaving] = coS(false);
  coE(() => { setForm(initial || blank); }, [initial, open]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal open={open} onClose={onClose}
      title={initial?.id ? comTx("editPaymentEntry") : comTx("addPayment")}
      icon={initial?.id ? <I.edit size={18} /> : <I.plus size={18} />}
      width={420}
      footer={<>
        <Button variant="ghost" onClick={onClose}>{comTx("cancel")}</Button>
        <Button variant="primary" disabled={saving} onClick={async () => {
          const amt = apiParseNumber(form.amount);
          if (!amt) { toast(comTx("amountRequired"), "error"); return; }
          setSaving(true);
          try { await onSave({ ...form, amount: amt }); }
          finally { setSaving(false); }
        }}>{initial?.id ? comTx("save") : comTx("create")}</Button>
      </>}>
      <div style={{ display: "grid", gap: 14 }}>
        <Field label={comTx("amountCol")} required><Input type="number" value={form.amount} onChange={e => set("amount", e.target.value)} placeholder="Masalan: 200000" /></Field>
        <Field label={comTx("dateCol")} required><DatePickerInput value={(form.paid_on || "").slice(0, 10)} onChange={v => set("paid_on", v)} /></Field>
        <Field label={comTx("methodCol")}><Textarea rows={2} value={form.notes || ""} onChange={e => set("notes", e.target.value)} placeholder={comTx("notePlaceholder")} /></Field>
      </div>
    </Modal>
  );
}

function DebtorAttachmentsPanel({ debtorId, toast }) {
  const [attachments, setAttachments] = coS([]);
  const [uploading, setUploading] = coS(false);
  const [showUpload, setShowUpload] = coS(false);
  const [selFile, setSelFile] = coS(null);
  const [fileType, setFileType] = coS("image");
  const [notes, setNotes] = coS("");
  const [isVisitProof, setIsVisitProof] = coS(false);
  const [dragOver, setDragOver] = coS(false);
  const fileRef = React.useRef(null);

  const loadAttachments = () => {
    apiGetDebtorAttachments(debtorId).then(rows => setAttachments(rows)).catch(() => {});
  };

  coE(() => { loadAttachments(); }, [debtorId]);

  const handleUpload = async () => {
    if (!selFile) return;
    setUploading(true);
    try {
      await apiUploadDebtorAttachment(debtorId, selFile, { file_type: fileType, notes, is_visit_proof: isVisitProof });
      toast(comTx("attachmentUploaded"), "success");
      setSelFile(null); setNotes(""); setIsVisitProof(false); setShowUpload(false);
      if (fileRef.current) fileRef.current.value = "";
      loadAttachments();
    } catch (e) {
      toast(comTx("attachmentUploadFail"), "error");
    } finally {
      setUploading(false);
    }
  };

  const acceptFor = (ft) => ft === "image" ? "image/*" : ft === "video" ? "video/*" : "*";
  const fileIcon = (ft) => ft === "image" ? <I.image size={16} /> : ft === "video" ? <I.play size={16} /> : <I.doc size={16} />;
  const fileLabel = (ft) => ft === "image" ? comTx("fileTypeImage") : ft === "video" ? comTx("fileTypeVideo") : comTx("fileTypeFile");

  const fileTypeOptions = [
    { value: "image", label: comTx("fileTypeImage") },
    { value: "video", label: comTx("fileTypeVideo") },
    { value: "file",  label: comTx("fileTypeFile") },
  ];

  const onDrop = (e) => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) { setSelFile(f); if (fileRef.current) fileRef.current.value = ""; }
  };

  const previewUrl = selFile && fileType === "image" ? URL.createObjectURL(selFile) : null;

  return (
    <Panel title={comTx("attachmentsPanel")} icon="link" color="green"
      action={
        <Button variant={showUpload ? "primary" : "ghost"} size="sm"
          icon={showUpload ? <I.x size={14} /> : <I.plus size={14} />}
          onClick={() => { setShowUpload(v => !v); setSelFile(null); setNotes(""); setIsVisitProof(false); }}>
          {showUpload ? comTx("close") : comTx("addAttachment")}
        </Button>
      }>
      {showUpload && (
        <div style={{ padding: "16px 18px", borderBottom: "1px solid var(--border)", background: "color-mix(in srgb, var(--bg-2) 60%, var(--bg))", display: "flex", flexDirection: "column", gap: 14 }}>
          {/* row 1: type + notes */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 12 }}>
            <Field label={comTx("fileTypePh")}>
              <Select value={fileType} onChange={setFileType} options={fileTypeOptions} />
            </Field>
            <Field label={comTx("attachNotes")}>
              <Input value={notes} onChange={e => setNotes(e.target.value)} placeholder="…" />
            </Field>
          </div>

          {/* row 2: file drop zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => !selFile && fileRef.current?.click()}
            style={{
              border: `2px dashed ${dragOver ? "var(--accent)" : selFile ? "var(--green)" : "var(--border)"}`,
              borderRadius: 10,
              padding: "14px 16px",
              display: "flex", alignItems: "center", gap: 12,
              cursor: selFile ? "default" : "pointer",
              background: dragOver ? "rgba(var(--accent-rgb),.06)" : selFile ? "var(--green-bg)" : "var(--bg)",
              transition: "border-color .15s, background .15s",
            }}>
            <input ref={fileRef} type="file" accept={acceptFor(fileType)}
              style={{ display: "none" }}
              onChange={e => setSelFile(e.target.files?.[0] || null)} />

            {selFile ? (
              <>
                {previewUrl
                  ? <img src={previewUrl} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 6, flexShrink: 0 }} />
                  : <div style={{ width: 48, height: 48, display: "grid", placeItems: "center", borderRadius: 6, background: "var(--bg-2)", flexShrink: 0, color: "var(--green)" }}>{fileIcon(fileType)}</div>
                }
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selFile.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{(selFile.size / 1024).toFixed(0)} KB</div>
                </div>
                <IconButton icon={<I.x size={14} />} label="clear" onClick={e => { e.stopPropagation(); setSelFile(null); if (fileRef.current) fileRef.current.value = ""; }} />
              </>
            ) : (
              <>
                <div style={{ width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: 8, background: "var(--bg-2)", flexShrink: 0, color: "var(--text-3)" }}>
                  {fileIcon(fileType)}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text)" }}>{comTx("dropOrClick")}</div>
                  <div style={{ fontSize: 11, color: "var(--text-3)", marginTop: 2 }}>{fileTypeOptions.find(o => o.value === fileType)?.label}</div>
                </div>
              </>
            )}
          </div>

          {/* row 3: visit proof toggle + upload button */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Toggle checked={isVisitProof} onChange={setIsVisitProof} />
              <span style={{ fontSize: 13, color: isVisitProof ? "var(--text)" : "var(--text-3)", fontWeight: isVisitProof ? 600 : 400 }}>{comTx("visitProof")}</span>
            </div>
            <Button variant="primary" size="sm" disabled={!selFile || uploading} onClick={handleUpload}
              icon={uploading ? null : <I.plus size={14} />}>
              {uploading ? comTx("uploadingFile") : comTx("attachUploadBtn")}
            </Button>
          </div>
        </div>
      )}

      {attachments.length === 0 ? (
        <div style={{ padding: "28px 16px", textAlign: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--bg-2)", display: "grid", placeItems: "center", margin: "0 auto 10px", color: "var(--text-3)" }}><I.image size={20} /></div>
          <div style={{ fontSize: 13, color: "var(--text-3)" }}>{comTx("noAttachments")}</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10, padding: 16 }}>
          {attachments.map(att => (
            <a key={att.id} href={att.file_url || att.file} target="_blank" rel="noopener noreferrer"
              style={{ display: "block", borderRadius: 10, overflow: "hidden", border: "1px solid var(--border)", textDecoration: "none", background: "var(--bg-2)", transition: "box-shadow .15s, border-color .15s" }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,.15)"; e.currentTarget.style.borderColor = "var(--accent)"; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ""; e.currentTarget.style.borderColor = "var(--border)"; }}>
              {att.file_type === "image" ? (
                <img src={att.file_url || att.file} alt={att.notes || ""} style={{ width: "100%", height: 90, objectFit: "cover", display: "block" }} onError={e => { e.target.style.display = "none"; }} />
              ) : (
                <div style={{ height: 90, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, color: "var(--text-3)", background: "var(--bg)" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--bg-2)", display: "grid", placeItems: "center" }}>{fileIcon(att.file_type)}</div>
                  <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--text-3)" }}>{fileLabel(att.file_type)}</span>
                </div>
              )}
              <div style={{ padding: "8px 10px", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <span style={{ fontSize: 10, color: "var(--text-3)" }}>{fileLabel(att.file_type)}</span>
                  {att.is_visit_proof && (
                    <span style={{ marginLeft: "auto", background: "var(--green-bg)", color: "var(--green)", borderRadius: 4, padding: "1px 5px", fontSize: 10, fontWeight: 700 }}>✓</span>
                  )}
                </div>
                {att.notes && <div style={{ fontSize: 11, color: "var(--text)", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 500 }}>{att.notes}</div>}
                <div style={{ fontSize: 10, color: "var(--text-3)", marginTop: 2 }}>{att.uploaded_by_name || att.uploaded_by_username || ""}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </Panel>
  );
}

function OrderDetailPage({ id }) {
  const { data, nav, t, upsert, toast } = useApp();
  const [editOpen, setEditOpen] = coS(false);
  const [addPayOpen, setAddPayOpen] = coS(false);
  const [editPayment, setEditPayment] = coS(null);
  const [deletePayment, setDeletePayment] = coS(null);
  const [detailOrder, setDetailOrder] = coS(null);
  const [detailCust, setDetailCust] = coS(null);
  const [detailPayments, setDetailPayments] = coS([]);
  const [refreshTick, setRefreshTick] = coS(0);

  coE(() => {
    apiGetDebtorById(id).then(o => { if (o) setDetailOrder(o); }).catch(() => {});
  }, [id, refreshTick]);

  coE(() => {
    if (!id) return;
    apiGetDebtorPayments(id).then(rows => setDetailPayments(rows)).catch(() => {});
  }, [id, refreshTick]);

  const o = detailOrder || (data.orders || []).find(x => x.id === id);
  coE(() => { if (o?.customerId) apiGetClientById(o.customerId).then(c => c && setDetailCust(c)).catch(() => {}); }, [o?.customerId]);

  const refresh = () => setRefreshTick(t => t + 1);

  const cust = detailCust;
  if (!o) return <div className="page"><Card><EmptyState title={comTx("debtorNotFound")} action={<Button onClick={() => nav("/debtors")}>{comTx("backToDebtors")}</Button>} /></Card></div>;
  const payments = detailPayments;

  return (
    <div className="page fade-in">
      <PageHeader crumbs={[{ label: comTx("catalogCrumb") }, { label: t("page.orders"), to: "/debtors" }, { label: o.customerName }]} title={o.customerName}
        actions={<Button variant="primary" size="sm" icon={<I.edit size={15} />} onClick={() => setEditOpen(true)}>{comTx("edit")}</Button>} />
      <div className="grid-dash">
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Panel title={comTx("debtPanel")} icon="wallet" color="amber">
            <div className="tg-meta">
              <div className="tg-meta-row"><span className="tg-meta-k">{comTx("businessLine")}</span><span className="tg-meta-v">{o.businessLine}</span></div>
              {!!o.phone && <div className="tg-meta-row"><span className="tg-meta-k">{comTx("phoneLabel")}</span><span className="tg-meta-v">{o.phone}</span></div>}
              {!!orderTuman(o) && <div className="tg-meta-row"><span className="tg-meta-k">{comTx("colDistrict")}</span><span className="tg-meta-v">{orderTuman(o)}</span></div>}
              {!!orderMahalla(o) && <div className="tg-meta-row"><span className="tg-meta-k">{comTx("colMahalla")}</span><span className="tg-meta-v">{orderMahalla(o)}</span></div>}
              <div className="tg-meta-row"><span className="tg-meta-k">{comTx("totalAmount")}</span><span className="tg-meta-v" style={{ fontWeight: 700 }}>{fmtUZS(debtNum(o.totalUzs))}</span></div>
              {!!debtNum(o.openingPaidUzs) && <div className="tg-meta-row"><span className="tg-meta-k">{comTx("openingPaid")}</span><span className="tg-meta-v">{fmtUZS(debtNum(o.openingPaidUzs))}</span></div>}
              <div className="tg-meta-row"><span className="tg-meta-k">{comTx("paid")}</span><span className="tg-meta-v" style={{ color: "var(--green)" }}>{fmtUZS(debtNum(o.paidUzs))}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">{comTx("remaining")}</span><span className="tg-meta-v" style={{ color: debtNum(o.remainingDebtUzs) > 0 ? "var(--red)" : "var(--green)", fontWeight: 700 }}>{fmtUZS(debtNum(o.remainingDebtUzs))}</span></div>
              {!!debtNum(o.overdueAmountUzs) && <div className="tg-meta-row"><span className="tg-meta-k">{comTx("overdueAmount")}</span><span className="tg-meta-v" style={{ color: "var(--red)" }}>{fmtUZS(debtNum(o.overdueAmountUzs))}</span></div>}
              <div className="tg-meta-row"><span className="tg-meta-k">{comTx("deadline")}</span><span className="tg-meta-v">{fmtDate(o.dueDate)}</span></div>
              {!!o.recallAt && (() => { const rc = new Date(o.recallAt); const now = new Date(); const isPast = rc < now; const isToday = rc.toDateString() === now.toDateString(); return <div className="tg-meta-row"><span className="tg-meta-k">{comTx("recallAt")}</span><span className="tg-meta-v" style={{ color: isPast ? "var(--red)" : isToday ? "var(--amber)" : "var(--blue)", fontWeight: 600 }}>📞 {rc.toLocaleString()}</span></div>; })()}
              {!!o.note && <div className="tg-meta-row"><span className="tg-meta-k">{comTx("note")}</span><span className="tg-meta-v">{o.note}</span></div>}
            </div>
          </Panel>
          <Panel title={comTx("customerPanel")} icon="user" color="violet">
            {cust ? <div style={{ display: "flex", alignItems: "center", gap: 11, cursor: "pointer" }} onClick={() => nav("/customers/" + cust.id)}><Avatar name={cust.fullName} size={40} /><div><div className="tg-cell-strong">{cust.fullName}</div><div className="tg-cell-sub">{cust.phone}</div></div></div> : <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={o.customerName} size={36} /><div><div className="tg-cell-strong">{o.customerName}</div><div className="tg-cell-sub">{o.phone}</div></div></div>}
          </Panel>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <DebtorAttachmentsPanel debtorId={id} toast={toast} />
          <Panel title={comTx("lastPaymentsPanel")} icon="chart" color="blue" pad={false}
            action={<Button variant="primary" size="sm" icon={<I.plus size={14} />} onClick={() => setAddPayOpen(true)}>{comTx("addPayment")}</Button>}>
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead><tr><th>{comTx("dateCol")}</th><th>{comTx("amountCol")}</th><th>{comTx("methodCol")}</th><th>{comTx("addedBy")}</th><th>{comTx("createdAtCol")}</th><th style={{ width: 72 }}></th></tr></thead>
                <tbody>
                  {payments.length ? payments.map(p => (
                    <tr key={p.id}>
                      <td>{fmtDate(p.paid_on)}</td>
                      <td style={{ fontWeight: 700, color: "var(--green)" }}>{fmtUZS(apiParseNumber(p.amount))}</td>
                      <td>{p.notes || "—"}</td>
                      <td><span className="tg-cell-sub">{p.created_by_name || p.created_by_username || "—"}</span></td>
                      <td><span className="tg-cell-sub">{p.created_at ? fmtDate(p.created_at, true) : "—"}</span></td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <IconButton icon={<I.edit size={13} />} label={comTx("edit")} onClick={() => setEditPayment(p)} />
                          <IconButton icon={<I.trash size={13} />} label={comTx("delete")} onClick={() => setDeletePayment(p)} />
                        </div>
                      </td>
                    </tr>
                  )) : <tr><td colSpan="6" style={{ textAlign: "center", color: "var(--text-3)", padding: 16 }}>{comTx("noPayments")}</td></tr>}
                </tbody>
              </table>
            </div>
          </Panel>
        </div>
      </div>

      <OrderFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={o}
        locations={data.locations}
        onSave={async (order) => {
          await upsert("orders", order);
          refresh();
          toast(comTx("debtorUpdated"));
          setEditOpen(false);
        }}
      />
      <DebtorPaymentModal
        open={addPayOpen}
        onClose={() => setAddPayOpen(false)}
        onSave={async (pay) => {
          await apiSaveDebtorPayment({ ...pay, debtorId: id });
          refresh();
          toast(comTx("debtorPaymentAdded"));
          setAddPayOpen(false);
        }}
      />
      <DebtorPaymentModal
        open={!!editPayment}
        initial={editPayment}
        onClose={() => setEditPayment(null)}
        onSave={async (pay) => {
          await apiSaveDebtorPayment({ ...editPayment, ...pay, debtorId: id });
          refresh();
          toast(comTx("debtorPaymentUpdated"));
          setEditPayment(null);
        }}
      />
      <ConfirmDialog
        open={!!deletePayment}
        onClose={() => setDeletePayment(null)}
        title={comTx("deleteDebtorPayment")}
        message={`${fmtUZS(apiParseNumber(deletePayment?.amount))} — ${comTx("deleteMsg")}`}
        onConfirm={async () => {
          await apiDeleteDebtorPayment(deletePayment.id);
          refresh();
          toast(comTx("debtorPaymentDeleted"));
          setDeletePayment(null);
        }}
      />
    </div>
  );
}
window.OrderDetailPage = OrderDetailPage;

function PaymentsPage() {
  const { data, t, upsert, remove, toast } = useApp();
  const canManagePayments = canDo("accounting.manage", data);
  const [q, setQ] = coS("");
  const [direction, setDirection] = coS("all");
  const [categoryFilter, setCategoryFilter] = coS("all");
  const [currencyFilter, setCurrencyFilter] = coS("all");
  const [dateRange, setDateRange] = coS("all");
  const { dateFrom, dateTo } = coM(() => {
    if (!dateRange || dateRange === "all") return { dateFrom: "", dateTo: "" };
    const today = new Date();
    const toStr = d => { const y = d.getFullYear(); const m = String(d.getMonth() + 1).padStart(2, "0"); const day = String(d.getDate()).padStart(2, "0"); return `${y}-${m}-${day}`; };
    const todayStr = toStr(today);
    if (dateRange === "today") return { dateFrom: todayStr, dateTo: todayStr };
    const days = { "7d": 6, "30d": 29, "90d": 89 }[dateRange];
    if (days !== undefined) {
      const from = new Date(today); from.setDate(from.getDate() - days);
      return { dateFrom: toStr(from), dateTo: todayStr };
    }
    if (dateRange && typeof dateRange === "object" && dateRange.from) {
      return { dateFrom: toStr(dateRange.from), dateTo: dateRange.to ? toStr(dateRange.to) : todayStr };
    }
    return { dateFrom: "", dateTo: "" };
  }, [dateRange]);
  const [createOpen, setCreateOpen] = coS(false);
  const [exporting, setExporting] = coS(false);
  const [tablePage, setTablePage] = coS(1);

  coE(() => { setTablePage(1); }, [q, direction, categoryFilter, currencyFilter, dateFrom, dateTo]);

  const exportAccountingExcel = async () => {
    try {
      setExporting(true);
      await apiDownloadAccountingExcel({
        ...(dateFrom ? { date_from: dateFrom } : {}),
        ...(dateTo ? { date_to: dateTo } : {}),
        ...(categoryFilter !== "all" ? { category: categoryFilter } : {}),
        ...(currencyFilter !== "all" ? { currency: currencyFilter } : {}),
      });
      toast(comTx("excelOk"));
    } catch (e) {
      toast(e.message || "Excel bajarilmadi", "error");
    } finally {
      setExporting(false);
    }
  };
  const [viewPayment, setViewPayment] = coS(null);
  const [editPayment, setEditPayment] = coS(null);
  const [deletePayment, setDeletePayment] = coS(null);
  const tableRows = coM(() => {
    let rows = data.payments || [];
    if (dateFrom || dateTo) {
      const validIds = new Set(
        (data.accountingDays || [])
          .filter(d => (!dateFrom || d.report_date >= dateFrom) && (!dateTo || d.report_date <= dateTo))
          .map(d => d.id)
      );
      rows = rows.filter(p => validIds.has(p.accountingDayId));
    }
    if (categoryFilter !== "all") rows = rows.filter(p => p.rawCategory === categoryFilter);
    if (currencyFilter !== "all") rows = rows.filter(p => currencyFilter === "USD" ? isDollarPayment(p) : !isDollarPayment(p));
    if (direction !== "all") rows = rows.filter(p => p.direction === direction);
    if (q) {
      const term = q.toLowerCase();
      rows = rows.filter(p =>
        (p.category || "").toLowerCase().includes(term) ||
        (p.customerName || "").toLowerCase().includes(term) ||
        String(p.id || "").includes(q)
      );
    }
    return rows;
  }, [data.payments, data.accountingDays, dateFrom, dateTo, categoryFilter, currencyFilter, direction, q]);

  const PAY_PAGE_SIZE = 50;
  const tablePageRows = tableRows.slice((tablePage - 1) * PAY_PAGE_SIZE, tablePage * PAY_PAGE_SIZE);

  const chipRows = coM(() => {
    let rows = data.payments || [];
    if (dateFrom || dateTo) {
      const validIds = new Set(
        (data.accountingDays || [])
          .filter(d => (!dateFrom || d.report_date >= dateFrom) && (!dateTo || d.report_date <= dateTo))
          .map(d => d.id)
      );
      rows = rows.filter(p => validIds.has(p.accountingDayId));
    }
    if (categoryFilter !== "all") rows = rows.filter(p => p.rawCategory === categoryFilter);
    if (currencyFilter !== "all") rows = rows.filter(p => p.method === currencyFilter);
    return rows;
  }, [data.payments, data.accountingDays, dateFrom, dateTo, categoryFilter, currencyFilter]);
  const uzsIncome = chipRows.filter(p => p.direction === "income" && isSomPayment(p)).reduce((s, p) => s + p.amountUzs, 0);
  const usdIncome = chipRows.filter(p => p.direction === "income" && isDollarPayment(p)).reduce((s, p) => s + p.amountUzs, 0);
  const uzsExpense = chipRows.filter(p => p.direction === "expense" && isSomPayment(p)).reduce((s, p) => s + p.amountUzs, 0);
  const usdExpense = chipRows.filter(p => p.direction === "expense" && isDollarPayment(p)).reduce((s, p) => s + p.amountUzs, 0);
  const cardIncome = chipRows.filter(p => p.rawCategory === "card_income").reduce((s, p) => s + p.amountUzs, 0);
  const cardExpense = chipRows.filter(p => p.rawCategory === "card_expense").reduce((s, p) => s + p.amountUzs, 0);
  const columns = [
    { key: "date", label: comTx("dateCol"), sortVal: r => r.date, render: r => <span className="tg-cell-sub">{fmtDate(r.date)}</span> },
    { key: "direction", label: comTx("direction"), render: r => <Badge color={r.direction === "income" ? "green" : "red"} size="sm">{r.direction === "income" ? comTx("income") : comTx("expense")}</Badge> },
    { key: "category", label: comTx("category"), sortVal: r => r.category, render: r => r.category },
    { key: "customer", label: comTx("subject"), sortVal: r => r.customerName, render: r => r.customerName },
    { key: "amount", label: comTx("amountCol"), sortVal: r => r.amountUzs, render: r => <span style={{ fontWeight: 650 }}>{fmtPaymentAmount(r)}</span> },
    { key: "method", label: comTx("methodCol"), render: r => <Badge color="slate" size="sm">{r.method}</Badge> },
    { key: "by", label: comTx("by"), render: r => <span style={{ fontSize: 12.5 }}>{r.processedBy.split(" ")[0]}</span> },
    { key: "actions", label: "", width: 44, render: r => (
      <div onClick={e => e.stopPropagation()}>
        <Dropdown align="right" trigger={<IconButton icon={<I.dots size={16} />} label={comTx("actions")} />} items={[
          { label: comTx("view"), icon: <I.eye size={16} />, onClick: () => setViewPayment(r) },
          ...(canManagePayments ? [
            { label: comTx("edit"), icon: <I.edit size={16} />, onClick: () => setEditPayment(r) },
            { divider: true },
            { label: comTx("delete"), icon: <I.trash size={16} />, danger: true, onClick: () => setDeletePayment(r) },
          ] : []),
        ]} />
      </div>
    ) },
  ];
  return (
    <div className="page fade-in">
      <PageHeader title={t("page.payments")} desc={comTx("paymentsDesc")} crumbs={[{ label: comTx("catalogCrumb") }, { label: t("page.payments") }]}
        actions={<>
          <Button variant="default" size="sm" icon={<I.download size={15} />} onClick={exportAccountingExcel} disabled={exporting}>Excel</Button>
          <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setCreateOpen(true)}>{comTx("newRecord")}</Button>
        </>} />
      <div className="toolbar" style={{ marginBottom: 10 }}>
        <DateRange value={dateRange} onChange={setDateRange} />
        {dateRange !== "all" && <Button variant="ghost" size="sm" onClick={() => setDateRange("all")}>{comTx("clear")}</Button>}
        <div className="toolbar-spacer" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 6 }}>
        <StatTile label={comTx("incomeUzs")} value={fmtShort(uzsIncome)} sub="so'm" color="green" />
        <StatTile label={comTx("incomeUsd")} value={Number(usdIncome).toLocaleString("en-US")} sub="$" color="teal" />
        <StatTile label={comTx("cardIncome")} value={fmtShort(cardIncome)} sub="so'm" color="blue" />
        <StatTile label={comTx("expenseUzs")} value={fmtShort(uzsExpense)} sub="so'm" color="red" />
        <StatTile label={comTx("expenseUsd")} value={Number(usdExpense).toLocaleString("en-US")} sub="$" color="amber" />
        <StatTile label={comTx("cardExpense")} value={fmtShort(cardExpense)} sub="so'm" color="violet" />
        <StatTile label={comTx("netUzs")} value={fmtShort(uzsIncome - uzsExpense)} sub="so'm" color={(uzsIncome - uzsExpense) >= 0 ? "green" : "red"} />
        <StatTile label={comTx("netUsd")} value={Number(usdIncome - usdExpense).toLocaleString("en-US")} sub="$" color={(usdIncome - usdExpense) >= 0 ? "teal" : "red"} />
        <StatTile label={comTx("cardNet")} value={fmtShort(cardIncome - cardExpense)} sub="so'm" color={(cardIncome - cardExpense) >= 0 ? "blue" : "red"} />
      </div>
      <div style={{ fontSize: 12, color: "var(--text-3)", marginBottom: 18, paddingLeft: 2 }}>
        {comTx("records")}: <strong style={{ color: "var(--text-2)" }}>{tableRows.length}</strong>
      </div>
      <div className="toolbar">
        <SearchInput value={q} onChange={setQ} placeholder={comTx("paymentsSearch")} width={240} />
        <FilterSelect label={comTx("direction")} icon="chart" value={direction} onChange={setDirection} options={[{ value: "income", label: comTx("income") }, { value: "expense", label: comTx("expense") }]} />
        <FilterSelect label={comTx("category")} icon="layers" value={categoryFilter} onChange={setCategoryFilter} options={ACCOUNTING_CATEGORY_OPTIONS} />
        <FilterSelect label={comTx("currency")} icon="wallet" value={currencyFilter} onChange={setCurrencyFilter} options={[{ value: "UZS", label: "UZS" }, { value: "USD", label: "USD" }]} />
        {(categoryFilter !== "all" || currencyFilter !== "all") && <Button variant="ghost" size="sm" onClick={() => { setCategoryFilter("all"); setCurrencyFilter("all"); }}>{comTx("clear")}</Button>}
        <div className="toolbar-spacer" />
      </div>
      <Card pad={false}>
        {tableRows.length === 0 ? (
          <EmptyState icon={<I.doc size={26} />} title={(dateFrom || dateTo) ? comTx("noDateData") : comTx("emptyPayments")} />
        ) : <DataTable columns={columns} rows={tablePageRows} onRowClick={r => setViewPayment(r)} defaultSort={{ key: "date", dir: "desc" }} />}
        {tableRows.length > PAY_PAGE_SIZE && <PaginationBar page={tablePage} total={tableRows.length} pageSize={PAY_PAGE_SIZE} onChange={setTablePage} />}
      </Card>
      <PaymentViewModal
        open={!!viewPayment}
        onClose={() => setViewPayment(null)}
        onEdit={canManagePayments ? () => { setEditPayment(viewPayment); setViewPayment(null); } : undefined}
        onDelete={canManagePayments ? () => { setDeletePayment(viewPayment); setViewPayment(null); } : undefined}
        payment={viewPayment}
      />
      <PaymentFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={async (payment) => {
          await upsert("payments", payment);
          toast(comTx("paymentAdded"));
          setCreateOpen(false);
        }}
      />
      <PaymentFormModal
        open={!!editPayment}
        onClose={() => setEditPayment(null)}
        initial={editPayment}
        onSave={async (payment) => {
          await upsert("payments", payment);
          toast(comTx("paymentUpdated"));
          setEditPayment(null);
        }}
      />
      <ConfirmDialog
        open={!!deletePayment}
        onClose={() => setDeletePayment(null)}
        onConfirm={async () => {
          await remove("payments", deletePayment.id);
          toast(comTx("paymentDeleted"));
          setDeletePayment(null);
        }}
        title={comTx("deletePaymentTitle")}
        message={`"${deletePayment?.customerName || ""}" bo'yicha yozuvni o'chirmoqchimisiz?`}
        details={deletePayment ? `${comTx("detailsCat")} ${deletePayment.category}\n${comTx("detailsAmount")} ${fmtUZS(deletePayment.amountUzs)}` : ""}
        confirmLabel={comTx("delete")}
        danger
      />
    </div>
  );
}
window.PaymentsPage = PaymentsPage;

function PaymentViewModal({ open, onClose, onEdit, onDelete, payment }) {
  if (!payment) return null;
  return (
    <Modal open={open} onClose={onClose} title={comTx("paymentViewTitle")} icon={<I.chart size={18} />} width={480}
      footer={<>
        {onEdit && <Button variant="ghost" icon={<I.edit size={15} />} onClick={onEdit}>{comTx("edit")}</Button>}
        {onDelete && <Button variant="danger" icon={<I.trash size={15} />} onClick={onDelete}>{comTx("delete")}</Button>}
        <Button variant="primary" onClick={onClose}>{comTx("close")}</Button>
      </>}>
      <div className="tg-meta">
        <div className="tg-meta-row"><span className="tg-meta-k">{comTx("dateCol")}</span><span className="tg-meta-v">{fmtDate(payment.date)}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{comTx("direction")}</span><span className="tg-meta-v">{payment.direction === "income" ? comTx("income") : comTx("expense")}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{comTx("category")}</span><span className="tg-meta-v">{payment.category}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{comTx("subject")}</span><span className="tg-meta-v">{payment.customerName}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{comTx("amountCol")}</span><span className="tg-meta-v">{fmtPaymentAmount(payment)}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{comTx("currency")}</span><span className="tg-meta-v">{payment.currency || payment.method || "UZS"}</span></div>
        <div className="tg-meta-row"><span className="tg-meta-k">{comTx("sortOrder")}</span><span className="tg-meta-v">{payment.sortOrder || 0}</span></div>
      </div>
    </Modal>
  );
}

function PaymentFormModal({ open, onClose, onSave, initial }) {
  const blank = { date: new Date().toISOString().slice(0, 10), rawCategory: "cash_income", category: "Naqd kirim", customerName: "", amountUzs: 0, currency: "UZS", note: "", sortOrder: 0 };
  const [form, setForm] = coS(initial || blank);
  React.useEffect(() => { setForm(initial || blank); }, [initial, open]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <Modal open={open} onClose={onClose} title={initial ? comTx("paymentFormEdit") : comTx("paymentFormNew")} icon={initial ? <I.edit size={18} /> : <I.plus size={18} />} width={520}
      footer={<><Button variant="ghost" onClick={onClose}>{comTx("cancel")}</Button><Button variant="primary" onClick={async () => {
        const selectedCategory = ACCOUNTING_CATEGORY_OPTIONS.find((option) => option.value === form.rawCategory);
        await onSave({
          ...form,
          amountUzs: +form.amountUzs,
          category: selectedCategory?.label || form.category,
          rawCategory: form.rawCategory,
        });
      }}>{comTx("save")}</Button></>}>
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label={comTx("dateCol")}><DatePickerInput value={(form.date || "").slice(0, 10)} onChange={(value) => set("date", value)} /></Field>
          <Field label={comTx("category")}><Select value={form.rawCategory} onChange={v => {
            const selected = ACCOUNTING_CATEGORY_OPTIONS.find((option) => option.value === v);
            setForm(current => ({
              ...current,
              rawCategory: v,
              category: selected?.label || "",
              currency: currencyForAccountingCategory(v),
            }));
          }} options={ACCOUNTING_CATEGORY_OPTIONS} /></Field>
        </div>
        <Field label={comTx("subject")}><Input value={form.customerName} onChange={e => set("customerName", e.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label={comTx("amountCol")}><Input type="number" value={form.amountUzs} onChange={e => set("amountUzs", e.target.value)} /></Field>
          <Field label={comTx("currency")}><Input value={form.currency || form.method || ""} onChange={e => set("currency", e.target.value)} placeholder={comTx("currencyPh")} /></Field>
        </div>
        <Field label={comTx("sortOrder")}><Input type="number" value={form.sortOrder || 0} onChange={e => set("sortOrder", +e.target.value || 0)} /></Field>
        <Field label={comTx("note")}><Textarea rows={3} value={form.note || ""} onChange={e => set("note", e.target.value)} /></Field>
      </div>
    </Modal>
  );
}
