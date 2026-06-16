/* api.jsx - live backend integration */
const API_BASE = (window.TG_ENV?.API_BASE || window.TG_API_BASE || localStorage.getItem("tg_api_base") || "http://localhost:8000").replace(/\/$/, "");
const SESSION_KEY = "tg_crm_session_v1";

const API_ROLE_MAP = {
  developer: "developer",
  admin: "admin",
  operator: "operator",
};

const CATEGORY_LABELS = {
  credit_expense: "Kredit xarajati",
  daily_expense: "Kunlik xarajat",
  cash_income: "Naqd kirim",
  card_income: "Karta kirimi",
  card_expense: "Karta chiqimi",
  dollar_income: "Dollar kirimi",
  dollar_expense: "Dollar chiqimi",
};

function isApiUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function apiUiRole(role) {
  return API_ROLE_MAP[role] || "operator";
}

function apiRoleLabel(role) {
  return role === "developer" ? "Developer" : role === "admin" ? "Administrator" : "Operator";
}

function apiLoadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function apiSaveSession(session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

function apiClearSession() {
  localStorage.removeItem(SESSION_KEY);
}

function apiCreateEmptyData() {
  return {
    products: [],
    users: [],
    leads: [],
    customers: [],
    tasks: [],
    taskColumns: [],
    taskAssignees: [],
    calls: [],
    orders: [],
    payments: [],
    notifications: [],
    audit: [],
    conversations: [],
    banners: [],
    referrals: [],
    locations: window.cloneLocationMap ? window.cloneLocationMap() : {},
    clientStatuses: [],
    accountingDays: [],
    integrationConfigs: [],
    integrationEvents: [],
    aiSettings: [],
    dashboardOverview: null,
    authUser: null,
    permissions: [],
    permissionsAll: [],
    roles: [],
    activeAiSettings: [],
  };
}

function apiWebSocketBase() {
  if (window.TG_ENV?.WS_BASE) return String(window.TG_ENV.WS_BASE).replace(/\/$/, "");
  if (API_BASE.startsWith("https://")) return API_BASE.replace(/^https:\/\//, "wss://");
  if (API_BASE.startsWith("http://")) return API_BASE.replace(/^http:\/\//, "ws://");
  return API_BASE;
}

function apiParseNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function apiDateOnly(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return String(value).slice(0, 10);
}

function apiToSentence(parts) {
  return parts.filter(Boolean).join(", ");
}

function apiUserFullName(user) {
  const full = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
  return full || user?.username || "Foydalanuvchi";
}

function apiUsernameFromUi(user) {
  if (user?.username) return user.username.trim();
  if (user?.email) return user.email.split("@")[0].trim();
  return (user?.fullName || "user")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ".")
    .replace(/^\.|\.$/g, "") || "user";
}

function apiSplitName(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  return {
    first_name: parts[0] || "",
    last_name: parts.slice(1).join(" "),
  };
}

function apiSlugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "status";
}

function apiErrorMessage(payload, fallback = "So'rov bajarilmadi") {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (payload.detail) return payload.detail;
  if (payload.message) return payload.message;
  if (payload.data && typeof payload.data === "string") return payload.data;
  const firstKey = Object.keys(payload)[0];
  if (!firstKey) return fallback;
  const firstVal = payload[firstKey];
  if (Array.isArray(firstVal)) return firstVal[0];
  if (typeof firstVal === "string") return firstVal;
  return fallback;
}

async function apiSafeJson(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (e) {
    return text;
  }
}

async function apiRefreshToken(refresh) {
  const response = await fetch(`${API_BASE}/api/auth/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh }),
  });
  const payload = await apiSafeJson(response);
  if (!response.ok) throw new Error(apiErrorMessage(payload, "Sessiyani yangilab bo'lmadi"));
  const nextAccess = payload?.data?.access || payload?.access;
  if (!nextAccess) throw new Error("Yangi access token qaytmadi");
  const next = { ...apiLoadSession(), access: nextAccess };
  apiSaveSession(next);
  return next;
}

async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    formData,
    auth = true,
    headers = {},
    retry = true,
  } = options;
  const session = apiLoadSession();
  const requestHeaders = { ...headers };
  if (auth && session?.access) requestHeaders.Authorization = `Bearer ${session.access}`;
  if (!formData && body !== undefined) requestHeaders["Content-Type"] = "application/json";

  const response = await fetch(path.startsWith("http") ? path : `${API_BASE}${path}`, {
    method,
    headers: requestHeaders,
    body: formData || (body !== undefined ? JSON.stringify(body) : undefined),
  });

  if (response.status === 401 && auth && retry && session?.refresh) {
    try {
      await apiRefreshToken(session.refresh);
      return apiRequest(path, { ...options, retry: false });
    } catch (e) {
      apiClearSession();
      throw e;
    }
  }

  if (response.status === 204) return null;
  const payload = await apiSafeJson(response);
  if (!response.ok) throw new Error(apiErrorMessage(payload));
  return payload;
}

function apiUnwrap(payload) {
  return payload && typeof payload === "object" && "data" in payload && Object.keys(payload).length <= 2 ? payload.data : payload;
}

function apiListItems(payload) {
  const plain = apiUnwrap(payload);
  if (Array.isArray(plain)) return plain;
  if (Array.isArray(plain?.results)) return plain.results;
  return [];
}

async function apiPaginateAll(path) {
  const all = [];
  let next = `${API_BASE}${path.includes("?") ? `${path}&page_size=100` : `${path}?page_size=100`}`;
  while (next) {
    const page = apiUnwrap(await apiRequest(next, { auth: true }));
    const rows = Array.isArray(page?.results) ? page.results : Array.isArray(page) ? page : [];
    all.push(...rows);
    next = page?.next || null;
  }
  return all;
}

function mapApiUser(user) {
  return {
    id: user.id,
    username: user.username,
    fullName: apiUserFullName(user),
    email: user.email || "",
    phone: user.phone || "",
    role: apiUiRole(user.role),
    rawRole: user.role,
    label: apiRoleLabel(user.role),
    dept: user.role === "operator" ? "Lead markaz" : "Boshqaruv",
    status: user.is_active ? "active" : "inactive",
    lastActive: user.updated_at || user.created_at || new Date().toISOString(),
    assignedLeads: user.assigned_leads || 0,
    completedSales: user.completed_sales || 0,
    avatarHue: (String(user.id || user.username || "0").charCodeAt(0) * 37) % 360,
    permissions: user.permissions || [],
    createdAt: user.created_at || new Date().toISOString(),
  };
}

function mapApiClientStatus(status) {
  return {
    id: status.id,
    name: status.name,
    slug: status.slug,
    isDefault: !!status.is_default,
    sortOrder: status.sort_order || 0,
  };
}

function mapApiClient(client) {
  const deposit = apiParseNumber(client.deposit_amount);
  const subsidy = apiParseNumber(client.subsidy_amount);
  const requestedKw = apiParseNumber(client.requested_kw);
  const paymentType = client.payment_type === "credit" ? "credit" : "cash";
  const statusName = client.status_name || "";
  return {
    id: client.id,
    fullName: client.full_name || "",
    phone: client.phone || "",
    source: "manual",
    status: statusName.toLowerCase().includes("inactive") ? "inactive" : "active",
    statusId: client.status || null,
    statusName,
    district: client.district || "",
    mahalla: client.neighborhood || "",
    address: client.address || "",
    currentSystemKw: requestedKw,
    paymentType,
    paymentTypeLabel: PAYMENT_TYPE_UZ[paymentType] || paymentType,
    ordersCount: 0,
    totalSpent: deposit,
    debtBalanceUzs: subsidy,
    overdueDebtUzs: 0,
    lastPurchase: client.updated_at || client.created_at || null,
    assignedManagerId: null,
    referralCode: "",
    lastActivity: client.updated_at || client.created_at || null,
    preferredChannel: "manual",
    lifetimeValue: deposit + subsidy,
    satisfaction: 0,
    productInterests: [],
    notes: client.notes || "",
    tags: [],
    createdAt: client.created_at,
    contractId: client.contract_id || "",
    pnfl: client.pnfl || "",
    password: client.password || "",
    cadastre: client.cadastre || "",
    auditorCompanyName: client.auditor_company_name || "",
    auditorCompanyPhone: client.auditor_company_phone || "",
    hokimHelperName: client.hokim_helper_name || "",
    hokimHelperPhone: client.hokim_helper_phone || "",
    cardNumber: client.card_number || "",
    bankBranchCode: client.bank_branch_code || "",
    bankAccountNumber: client.bank_account_number || "",
  };
}

function mapApiDebtor(debtor) {
  const debt = apiParseNumber(debtor.debt_amount);
  const dueDate = debtor.repayment_due_date || apiDateOnly(new Date().toISOString());
  const overdue = dueDate < apiDateOnly(new Date().toISOString()) ? debt : 0;
  return {
    id: debtor.id,
    customerId: null,
    leadId: null,
    customerName: debtor.full_name || "",
    businessLine: debtor.debtor_type === "solar_panel" ? "Quyosh panel biznesi" : "Eski biznes",
    paymentType: "credit",
    productItems: [],
    status: overdue > 0 ? "processing" : "confirmed",
    paymentStatus: debt > 0 ? "unpaid" : "paid",
    deliveryAddress: apiToSentence([debtor.city, debtor.district, debtor.neighborhood]),
    district: debtor.district || "",
    mahalla: debtor.neighborhood || "",
    principalUzs: debt,
    paidUzs: 0,
    remainingDebtUzs: debt,
    overdueAmountUzs: overdue,
    nextReminderAt: dueDate,
    dueDate,
    lastPaymentAt: null,
    discountUzs: 0,
    totalUzs: debt,
    createdAt: debtor.debt_taken_on || debtor.created_at || new Date().toISOString(),
    note: debtor.notes || "",
    phone: debtor.phone || "",
    city: debtor.city || "",
    debtorType: debtor.debtor_type,
  };
}

function mapApiTaskColumn(column, index = 0) {
  return {
    id: column.id,
    name: column.name || column.slug || `Ustun ${index + 1}`,
    slug: column.slug || `column_${index + 1}`,
    position: apiParseNumber(column.position ?? column.sort_order ?? index),
  };
}

function mapApiTask(task, columnsById = {}) {
  const column = columnsById[task.column] || columnsById[task.column_id] || null;
  return {
    id: task.id,
    title: task.title || "",
    description: task.description || "",
    notes: task.description || "",
    assignedUserId: task.assigned_to_id || task.assigned_to || null,
    dueDate: task.due_at || task.due_date || new Date().toISOString(),
    createdAt: task.created_at || new Date().toISOString(),
    updatedAt: task.updated_at || task.created_at || new Date().toISOString(),
    columnId: task.column_id || task.column || column?.id || null,
    columnSlug: column?.slug || "todo",
    columnName: column?.name || "Vazifa",
    position: apiParseNumber(task.position || 0),
  };
}

function mapApiProduct(product) {
  const pictures = (product.pictures || []).map((picture, index) => ({
    id: picture.id || `pic_${product.id}_${index}`,
    alt: product.name || `Rasm ${index + 1}`,
    url: picture.image_url || picture.image || "",
    isPrimary: index === 0,
  }));
  return {
    id: product.id,
    sku: product.sku || String(product.id || "").slice(0, 8).toUpperCase(),
    brand: product.brand || "SolarArmada",
    name: product.name || "",
    model: product.name || "",
    series: "",
    category: product.category || "Mahsulot",
    mountType: "",
    status: "active",
    dataReviewStatus: "verified",
    powerKw: 0,
    inverterPowerKw: 0,
    batteryCapacityKwh: 0,
    panelCount: 0,
    panelPowerW: 0,
    monthlyYieldKwh: 0,
    phaseCount: 1,
    warrantyYears: 0,
    installationDays: 0,
    paybackYears: 0,
    stockQuantity: apiParseNumber(product.amount),
    reservedQuantity: 0,
    featured: false,
    priceUzs: apiParseNumber(product.price),
    previousPriceUzs: null,
    installationFeeUzs: 0,
    images: pictures,
    rawDescription: product.description || "",
    reviewIssues: [],
    notes: "",
    description: product.description || "",
    createdAt: product.created_at,
    updatedAt: product.updated_at,
  };
}

function paymentDirectionFromCategory(category) {
  return category && category.includes("income") ? "income" : "expense";
}

function mapApiAccountingEntry(entry, daysById = {}) {
  const reportDate = daysById[entry.accounting_day]?.report_date || entry.created_at || new Date().toISOString();
  return {
    id: entry.id,
    orderId: null,
    customerName: entry.counterparty_name || "",
    amountUzs: apiParseNumber(entry.amount),
    method: entry.currency || "UZS",
    status: "To'langan",
    date: reportDate,
    note: entry.notes || "",
    processedBy: "",
    direction: paymentDirectionFromCategory(entry.category),
    category: CATEGORY_LABELS[entry.category] || entry.category,
    rawCategory: entry.category,
    businessLine: "",
    accountingDayId: entry.accounting_day,
    sortOrder: entry.sort_order || 0,
  };
}

function mapApiMessage(message, fallbackTitle = "") {
  if (!message) return null;
  const direction = message.direction || message.sender_type || message.role || message.from;
  let from = "customer";
  if (direction === "outgoing" || direction === "operator") from = "operator";
  if (direction === "ai" || direction === "assistant" || message.is_ai) from = "ai";
  return {
    id: message.id || `msg_${message.created_at || Date.now()}`,
    from,
    text: message.content || message.text || message.message || fallbackTitle || "",
    at: message.created_at || message.sent_at || message.at || new Date().toISOString(),
  };
}

function mapApiConversation(session) {
  const latest = mapApiMessage(session.latest_message, session.title || "Yangi suhbat");
  return {
    id: session.id,
    leadId: null,
    name: session.title || session.client?.full_name || session.client_name || session.platform_user_id || "Suhbat",
    channel: session.platform || "manual",
    messages: latest ? [latest] : [],
    unread: session.unread_count || 0,
    aiMode: session.operator_needed ? "handoff" : session.ai_paused_until ? "operator" : "ai",
    assignedUserId: session.assigned_user || null,
    lastAt: latest?.at || session.updated_at || session.created_at || new Date().toISOString(),
    tags: [],
    status: session.state === "closed" ? "closed" : session.operator_needed ? "handoff" : "open",
    clientId: typeof session.client === "string" ? session.client : session.client?.id || null,
    platformUserId: session.platform_user_id || "",
    rawSession: session,
  };
}

function mapApiNotification(notification) {
  return {
    id: notification.id,
    type: notification.type || "system",
    title: notification.title || "Bildirishnoma",
    message: notification.body || notification.title || "",
    body: notification.body || "",
    data: notification.data || {},
    read: !!notification.is_read,
    readAt: notification.read_at || null,
    createdAt: notification.created_at || new Date().toISOString(),
    at: notification.created_at || new Date().toISOString(),
  };
}

function mapApiAuditLog(row) {
  return {
    id: row.id,
    at: row.created_at || row.at || new Date().toISOString(),
    createdAt: row.created_at || row.at || new Date().toISOString(),
    user: row.actor_name || row.user_name || row.user || "System",
    userName: row.actor_name || row.user_name || row.user || "System",
    action: row.action || "",
    entity: row.target_type || row.entity || "",
    entityId: row.target_id || row.entity_id || "",
    summary: row.summary || row.description || "",
    ip: row.ip_address || "",
    device: row.user_agent || "",
  };
}

function mergeLocations(customers, orders) {
  const base = window.cloneLocationMap ? window.cloneLocationMap() : {};
  [...customers, ...orders].forEach((row) => {
    const district = row.district || "";
    const mahalla = row.mahalla || "";
    if (!district) return;
    if (!base[district]) base[district] = [];
    if (mahalla && !base[district].includes(mahalla)) base[district].push(mahalla);
  });
  return Object.fromEntries(
    Object.entries(base)
      .sort((a, b) => a[0].localeCompare(b[0], "uz"))
      .map(([district, mahallas]) => [district, [...mahallas].sort((a, b) => a.localeCompare(b, "uz"))])
  );
}

async function apiBootstrap() {
  const [
    me,
    permissions,
    permissionsAll,
    roles,
    users,
    clientStatuses,
    clients,
    debtors,
    taskColumns,
    tasks,
    taskAssignees,
    notifications,
    accountingDays,
    accountingEntries,
    products,
    chatSessions,
    audit,
    integrationConfigs,
    integrationEvents,
    aiSettings,
    activeAiSettings,
    dashboardOverview,
  ] = await Promise.all([
    apiRequest("/api/auth/me/").catch(() => null),
    apiRequest("/api/auth/permissions/").catch(() => []),
    apiRequest("/api/auth/permissions/all/").catch(() => []),
    apiRequest("/api/auth/roles/").catch(() => []),
    apiPaginateAll("/api/users/").catch(() => []),
    apiPaginateAll("/api/clients/statuses/").catch(() => []),
    apiPaginateAll("/api/clients/").catch(() => []),
    apiPaginateAll("/api/clients/debtors/").catch(() => []),
    apiPaginateAll("/api/tasks/columns/").catch(() => []),
    apiPaginateAll("/api/tasks/").catch(() => []),
    apiPaginateAll("/api/tasks/assignees/").catch(() => []),
    apiPaginateAll("/api/notifications/?ordering=-created_at").catch(() => []),
    apiPaginateAll("/api/clients/accounting/days/").catch(() => []),
    apiPaginateAll("/api/clients/accounting/entries/").catch(() => []),
    apiPaginateAll("/api/products/").catch(() => []),
    apiPaginateAll("/api/chats/sessions/").catch(() => []),
    apiPaginateAll("/api/audit-logs/").catch(() => []),
    apiPaginateAll("/api/settings/integrations/").catch(() => []),
    apiPaginateAll("/api/settings/integrations/events/").catch(() => []),
    apiPaginateAll("/api/settings/ai/").catch(() => []),
    apiRequest("/api/settings/ai/active/").catch(() => []),
    apiRequest("/api/dashboard/overview/").catch(() => null),
  ]);

  const data = apiCreateEmptyData();
  data.authUser = me ? mapApiUser(apiUnwrap(me)) : null;
  data.permissions = Array.isArray(apiUnwrap(permissions)) ? apiUnwrap(permissions) : apiUnwrap(permissions)?.permissions || [];
  data.permissionsAll = Array.isArray(apiUnwrap(permissionsAll)) ? apiUnwrap(permissionsAll) : apiUnwrap(permissionsAll)?.permissions || [];
  data.roles = Array.isArray(apiUnwrap(roles)) ? apiUnwrap(roles) : apiUnwrap(roles)?.roles || [];
  data.users = users.map(mapApiUser);
  if (data.authUser && !data.users.find((user) => user.id === data.authUser.id)) data.users.unshift(data.authUser);
  data.clientStatuses = clientStatuses.map(mapApiClientStatus);
  data.customers = clients.map(mapApiClient);
  data.orders = debtors.map(mapApiDebtor);
  data.taskColumns = taskColumns.map(mapApiTaskColumn).sort((a, b) => a.position - b.position);
  const columnsById = Object.fromEntries(data.taskColumns.map((column) => [column.id, column]));
  data.tasks = tasks.map((task) => mapApiTask(task, columnsById));
  data.taskAssignees = taskAssignees.map(mapApiUser);
  data.notifications = notifications.map(mapApiNotification);
  data.locations = mergeLocations(data.customers, data.orders);
  data.accountingDays = accountingDays;
  const dayMap = Object.fromEntries(accountingDays.map((day) => [day.id, day]));
  data.payments = accountingEntries.map((entry) => mapApiAccountingEntry(entry, dayMap));
  data.products = products.map(mapApiProduct);
  data.conversations = chatSessions.map(mapApiConversation);
  data.audit = audit.map(mapApiAuditLog);
  data.integrationConfigs = integrationConfigs;
  data.integrationEvents = integrationEvents;
  data.aiSettings = aiSettings;
  data.activeAiSettings = Array.isArray(apiUnwrap(activeAiSettings)) ? apiUnwrap(activeAiSettings) : apiListItems(activeAiSettings);
  data.dashboardOverview = apiUnwrap(dashboardOverview);
  return data;
}

async function apiLogin(username, password) {
  const payload = await apiRequest("/api/auth/login/", {
    method: "POST",
    auth: false,
    body: { username, password },
  });
  return apiUnwrap(payload);
}

async function apiDelete(path) {
  return apiRequest(path, { method: "DELETE" });
}

async function apiSaveUser(user) {
  const name = apiSplitName(user.fullName);
  const rawRole = user.rawRole || user.role || "operator";
  const payload = {
    username: apiUsernameFromUi(user),
    email: user.email || "",
    first_name: name.first_name,
    last_name: name.last_name,
    role: rawRole === "developer" || rawRole === "admin" || rawRole === "operator" ? rawRole : "operator",
    is_active: user.status !== "inactive",
    is_staff: rawRole === "developer" || rawRole === "admin",
    permissions: user.permissions || [],
  };
  if (user.password) payload.password = user.password;
  return isApiUuid(user.id)
    ? apiRequest(`/api/users/${user.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/users/", { method: "POST", body: payload });
}

function clientStatusIdForSave(customer, data) {
  if (customer.statusId) return customer.statusId;
  const rows = data.clientStatuses || [];
  const preferred = rows.find((status) => status.isDefault) || rows[0];
  return preferred?.id || null;
}

async function apiSaveClient(customer, data) {
  const payload = {
    full_name: (customer.fullName || "").trim(),
    phone: (customer.phone || "").trim(),
    address: (customer.address || "").trim(),
    district: (customer.district || "").trim(),
    neighborhood: (customer.mahalla || "").trim(),
    requested_kw: String(apiParseNumber(customer.currentSystemKw || 0)),
    payment_type: customer.paymentType === "credit" ? "credit" : "cash",
    notes: customer.notes || "",
    status: clientStatusIdForSave(customer, data),
    subsidy_amount: String(apiParseNumber(customer.debtBalanceUzs || 0)),
    deposit_amount: String(apiParseNumber(customer.totalSpent || 0)),
    contract_id: customer.contractId || "",
    pnfl: customer.pnfl || "",
    password: customer.password || "",
    cadastre: customer.cadastre || "",
    auditor_company_name: customer.auditorCompanyName || "",
    auditor_company_phone: customer.auditorCompanyPhone || "",
    hokim_helper_name: customer.hokimHelperName || "",
    hokim_helper_phone: customer.hokimHelperPhone || "",
    card_number: customer.cardNumber || "",
    bank_branch_code: customer.bankBranchCode || "",
    bank_account_number: customer.bankAccountNumber || "",
  };
  return isApiUuid(customer.id)
    ? apiRequest(`/api/clients/${customer.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/clients/", { method: "POST", body: payload });
}

async function apiSaveDebtor(order) {
  const dueDate = apiDateOnly(order.dueDate || order.nextReminderAt);
  const payload = {
    debtor_type: order.businessLine === "Eski biznes" ? "moto_business" : "solar_panel",
    full_name: (order.customerName || "").trim(),
    phone: (order.phone || "").trim(),
    city: order.city || "Toshkent",
    district: (order.district || "").trim(),
    neighborhood: (order.mahalla || "").trim(),
    debt_amount: String(apiParseNumber(order.remainingDebtUzs || order.totalUzs || 0)),
    debt_taken_on: apiDateOnly(order.createdAt || new Date().toISOString()),
    repayment_due_date: dueDate,
    notes: order.note || "",
  };
  return isApiUuid(order.id)
    ? apiRequest(`/api/clients/debtors/${order.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/clients/debtors/", { method: "POST", body: payload });
}

async function apiSaveTask(task) {
  const payload = {
    title: (task.title || "").trim(),
    description: task.description || task.notes || "",
    column_id: task.columnId,
    assigned_to_id: task.assignedUserId || null,
    position: apiParseNumber(task.position || 0),
    due_at: task.dueDate ? new Date(task.dueDate).toISOString() : null,
  };
  return isApiUuid(task.id)
    ? apiRequest(`/api/tasks/${task.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/tasks/", { method: "POST", body: payload });
}

async function apiMoveTask(taskId, columnId, position) {
  return apiRequest(`/api/tasks/${taskId}/move/`, {
    method: "POST",
    body: {
      column_id: columnId,
      position: apiParseNumber(position),
    },
  });
}

async function apiEnsureAccountingDayId(reportDate, currentDays) {
  const isoDate = apiDateOnly(reportDate);
  const existing = (currentDays || []).find((day) => day.report_date === isoDate);
  if (existing) return existing.id;
  const created = apiUnwrap(await apiRequest("/api/clients/accounting/days/", {
    method: "POST",
    body: { report_date: isoDate, notes: "" },
  }));
  return created.id;
}

function apiPaymentCategory(payment) {
  const method = String(payment.method || "").toLowerCase();
  if (payment.direction === "income") {
    if (method.includes("usd") || method.includes("dollar")) return "dollar_income";
    if (method.includes("bank") || method.includes("karta") || method.includes("click") || method.includes("payme")) return "card_income";
    return "cash_income";
  }
  if (method.includes("usd") || method.includes("dollar")) return "dollar_expense";
  if (method.includes("bank") || method.includes("karta")) return "card_expense";
  return "daily_expense";
}

async function apiSaveAccountingEntry(payment, data) {
  const accountingDay = await apiEnsureAccountingDayId(payment.date || new Date().toISOString(), data.accountingDays || []);
  const payload = {
    accounting_day: accountingDay,
    category: payment.rawCategory || payment.categoryKey || apiPaymentCategory(payment),
    counterparty_name: (payment.customerName || "").trim(),
    amount: String(apiParseNumber(payment.amountUzs || 0)),
    currency: payment.currency || payment.method || "UZS",
    notes: payment.note || "",
    sort_order: payment.sortOrder || 0,
  };
  return isApiUuid(payment.id)
    ? apiRequest(`/api/clients/accounting/entries/${payment.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/clients/accounting/entries/", { method: "POST", body: payload });
}

async function apiSaveProduct(product) {
  const hasFiles = Array.isArray(product.pictureFiles) && product.pictureFiles.length > 0;
  if (hasFiles) {
    const formData = new FormData();
    formData.append("name", (product.model || product.name || "").trim());
    formData.append("description", product.description || "");
    formData.append("price", String(apiParseNumber(product.priceUzs || 0)));
    formData.append("amount", String(apiParseNumber(product.stockQuantity || 0)));
    product.pictureFiles.slice(0, 3).forEach((file) => formData.append("picture_files", file));
    return isApiUuid(product.id)
      ? apiRequest(`/api/products/${product.id}/`, { method: "PATCH", formData })
      : apiRequest("/api/products/", { method: "POST", formData });
  }
  const payload = {
    name: (product.model || product.name || "").trim(),
    description: product.description || "",
    price: String(apiParseNumber(product.priceUzs || 0)),
    amount: apiParseNumber(product.stockQuantity || 0),
  };
  return isApiUuid(product.id)
    ? apiRequest(`/api/products/${product.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/products/", { method: "POST", body: payload });
}

async function apiSaveClientStatus(status) {
  const payload = {
    name: (status.name || "").trim(),
    slug: apiSlugify(status.slug || status.name),
    is_default: !!status.isDefault,
    sort_order: apiParseNumber(status.sortOrder || 0),
  };
  return isApiUuid(status.id)
    ? apiRequest(`/api/clients/statuses/${status.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/clients/statuses/", { method: "POST", body: payload });
}

async function apiSaveAiSetting(setting) {
  const payload = {
    name: (setting.name || "").trim(),
    model: (setting.model || "").trim(),
    temperature: Number(setting.temperature || 0),
    system_prompt: setting.system_prompt || setting.systemPrompt || "",
    function_calling_enabled: !!(setting.function_calling_enabled ?? setting.functionCallingEnabled),
    is_active: !!setting.is_active,
  };
  return isApiUuid(setting.id)
    ? apiRequest(`/api/settings/ai/${setting.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/settings/ai/", { method: "POST", body: payload });
}

async function apiSaveIntegrationConfig(config) {
  const payload = {
    provider: (config.provider || "").trim(),
    key: (config.key || "").trim(),
    value: config.value || "",
    is_active: config.is_active !== false,
    description: config.description || "",
  };
  return isApiUuid(config.id)
    ? apiRequest(`/api/settings/integrations/${config.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/settings/integrations/", { method: "POST", body: payload });
}

async function apiLoadUserPermissions(userId) {
  const payload = await apiRequest(`/api/users/${userId}/permissions/`);
  const plain = apiUnwrap(payload);
  return Array.isArray(plain) ? plain : [];
}

async function apiLoadChatMessages(sessionId) {
  const payload = apiUnwrap(await apiRequest(`/api/chats/sessions/${sessionId}/messages/`));
  if (Array.isArray(payload)) return payload.map((message) => mapApiMessage(message)).filter(Boolean);
  if (Array.isArray(payload?.results)) return payload.results.map((message) => mapApiMessage(message)).filter(Boolean);
  if (Array.isArray(payload?.messages)) return payload.messages.map((message) => mapApiMessage(message)).filter(Boolean);
  return [];
}

async function apiLoadChatSession(sessionId) {
  return apiUnwrap(await apiRequest(`/api/chats/sessions/${sessionId}/`));
}

async function apiSendChatMessage(sessionId, content) {
  await apiRequest(`/api/chats/sessions/${sessionId}/send-message/`, {
    method: "POST",
    body: { content },
  });
}

async function apiSetChatMode(sessionId, mode) {
  if (mode === "ai") {
    await apiRequest(`/api/chats/sessions/${sessionId}/resume-ai/`, { method: "POST", body: {} });
    return;
  }
  if (mode === "handoff") {
    await apiRequest(`/api/chats/sessions/${sessionId}/request-operator/`, { method: "POST", body: {} });
    return;
  }
  const pausedUntil = new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
  await apiRequest(`/api/chats/sessions/${sessionId}/pause-ai/`, {
    method: "POST",
    body: { paused_until: pausedUntil, reason: "manual_pause" },
  });
}

async function apiMarkChatRead(sessionId) {
  return apiRequest(`/api/chats/sessions/${sessionId}/mark-read/`, { method: "POST", body: {} });
}

async function apiMarkNotificationRead(notificationId) {
  return apiRequest(`/api/notifications/${notificationId}/read/`, { method: "POST", body: {} });
}

async function apiMarkAllNotificationsRead() {
  return apiRequest("/api/notifications/read-all/", { method: "POST", body: {} });
}

async function apiClearAllNotifications() {
  return apiRequest("/api/notifications/clear-all/", { method: "DELETE" });
}

Object.assign(window, {
  API_BASE,
  SESSION_KEY,
  isApiUuid,
  apiUiRole,
  apiLoadSession,
  apiSaveSession,
  apiClearSession,
  apiCreateEmptyData,
  apiRequest,
  apiBootstrap,
  apiLogin,
  apiDelete,
  apiSaveUser,
  apiSaveClient,
  apiSaveDebtor,
  apiSaveTask,
  apiMoveTask,
  apiSaveAccountingEntry,
  apiSaveProduct,
  apiSaveClientStatus,
  apiSaveAiSetting,
  apiSaveIntegrationConfig,
  apiLoadUserPermissions,
  apiLoadChatMessages,
  apiLoadChatSession,
  apiSendChatMessage,
  apiSetChatMode,
  apiMarkChatRead,
  apiMarkNotificationRead,
  apiMarkAllNotificationsRead,
  apiClearAllNotifications,
  mapApiConversation,
  mapApiMessage,
  mapApiNotification,
  apiWebSocketBase,
});
