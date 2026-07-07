/* api.jsx - live backend integration */
const API_BASE = (window.TG_ENV?.API_BASE || window.TG_API_BASE || localStorage.getItem("tg_api_base") || "http://localhost:8000").replace(/\/$/, "");
const SESSION_KEY = "tg_crm_session_v1";

const API_ROLE_MAP = {
  developer: "developer",
  admin: "admin",
  operator: "operator",
}

const CATEGORY_LABELS = {
  credit_expense: "Kredit xarajati",
  daily_expense: "Kunlik xarajat",
  cash_income: "Naqd kirim",
  card_income: "Karta kirimi",
  card_expense: "Karta chiqimi",
  dollar_income: "Dollar kirimi",
  dollar_expense: "Dollar chiqimi",
}

function isApiUuid(value) {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function apiUiRole(role) {
  return API_ROLE_MAP[role] || "operator";
}

function apiRoleLabel(role) {
  return role === "developer" ? "Dasturchi" : role === "admin" ? "Administrator" : "Operator";
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
    ordersTotal: 0,
    payments: [],
    notifications: [],
    audit: [],
    conversations: [],
    banners: [],
    referrals: [],
    locations: window.cloneLocationMap ? window.cloneLocationMap() : {},
    districts: [],
    neighborhoods: [],
    clientStatuses: [],
    accountingDays: [],
    productCategories: [],
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

function apiMediaUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    const apiUrl = new URL(API_BASE, window.location.origin);
    const mediaUrl = raw.startsWith("//")
      ? new URL(`${apiUrl.protocol}${raw}`)
      : new URL(raw, apiUrl);

    if (mediaUrl.protocol === "http:" && apiUrl.protocol === "https:" && mediaUrl.host === apiUrl.host) {
      mediaUrl.protocol = "https:";
    }

    return mediaUrl.href;
  } catch (e) {
    return raw;
  }
}

function apiNormalizeUrl(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    const apiUrl = new URL(API_BASE, window.location.origin);
    const resolved = raw.startsWith("//")
      ? new URL(`${apiUrl.protocol}${raw}`)
      : new URL(raw, apiUrl);

    if (resolved.host === apiUrl.host && apiUrl.protocol === "https:" && resolved.protocol === "http:") {
      resolved.protocol = "https:";
    }

    return resolved.href;
  } catch (e) {
    return raw;
  }
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

function apiTaskColumnSlugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "task_column";
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

function apiAuthError(message = "Sessiya tugagan", status = 401) {
  const error = new Error(message);
  error.isAuthError = true;
  error.status = status;
  return error;
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
  if (!response.ok) throw apiAuthError(apiErrorMessage(payload, "Sessiyani yangilab bo'lmadi"), response.status);
  const nextAccess = payload?.data?.access || payload?.access;
  if (!nextAccess) throw apiAuthError("Yangi access token qaytmadi", response.status || 401);
  const next = { ...apiLoadSession(), access: nextAccess };
  apiSaveSession(next);
  return next;
}


function apiBuildUrl(path, params) {
  const target = path.startsWith("http") ? path : `${API_BASE}${path}`;
  const url = new URL(apiNormalizeUrl(target));
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

function apiFilenameFromResponse(response, fallback = "download.xlsx") {
  const header = response.headers.get("content-disposition") || "";
  const utf8Match = header.match(/filename\*=UTF-8''([^;]+)/i);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch (e) {
      return utf8Match[1];
    }
  }
  const plainMatch = header.match(/filename="?([^"]+)"?/i);
  return plainMatch?.[1] || fallback;
}

async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    formData,
    auth = true,
    headers = {},
    params,
    responseType = "json",
    retry = true,
  } = options;
  const session = apiLoadSession();
  const requestHeaders = { ...headers };
  if (auth && session?.access) requestHeaders.Authorization = `Bearer ${session.access}`;
  if (!formData && body !== undefined) requestHeaders["Content-Type"] = "application/json";

  const response = await fetch(apiBuildUrl(path, params), {
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

  if (response.status === 401 && auth) {
    const payload = await apiSafeJson(response);
    throw apiAuthError(apiErrorMessage(payload, "Sessiya tugagan"), response.status);
  }

  if (response.status === 204) return null;
  if (responseType === "blob") {
    if (!response.ok) {
      const payload = await apiSafeJson(response);
      throw new Error(apiErrorMessage(payload));
    }
    return {
      blob: await response.blob(),
      filename: apiFilenameFromResponse(response),
    };
  }
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
  let next = apiNormalizeUrl(`${API_BASE}${path.includes("?") ? `${path}&page_size=100` : `${path}?page_size=100`}`);
  while (next) {
    const page = apiUnwrap(await apiRequest(next, { auth: true }));
    const rows = Array.isArray(page?.results) ? page.results : Array.isArray(page) ? page : [];
    all.push(...rows);
    next = page?.next ? apiNormalizeUrl(page.next) : null;
  }
  return all;
}

async function apiDownloadFile(path, options = {}) {
  const { params, filename = "download.xlsx" } = options;
  const result = await apiRequest(path, { params, responseType: "blob" });
  const blob = result?.blob instanceof Blob ? result.blob : new Blob([result?.blob || ""], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const href = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.download = result?.filename || filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(href);
}

async function apiDownloadClientsExcel(filters = {}) {
  return apiDownloadFile("/api/clients/export/excel/", {
    params: filters,
    filename: "clients_export.xlsx",
  });
}

async function apiDownloadDebtorsExcel(filters = {}) {
  return apiDownloadFile("/api/clients/debtors/export/excel/", {
    params: filters,
    filename: "debtors_export.xlsx",
  });
}

async function apiDownloadAccountingExcel(filters = {}) {
  return apiDownloadFile("/api/clients/accounting/export/excel/", {
    params: filters,
    filename: "accounting_export.xlsx",
  });
}

async function apiGetClientsPage(params = {}) {
  const { page = 1, page_size = 50, search, ordering, created_at_after, created_at_before } = params;
  const url = apiBuildUrl("/api/clients/", { page, page_size, search, ordering, created_at_after, created_at_before });
  const res = apiUnwrap(await apiRequest(url, { auth: true }));
  return { results: (res?.results || []).map(mapApiClient), count: res?.count || 0 };
}

async function apiGetDebtorsPage(params = {}) {
  const { page = 1, page_size = 50, search, debtor_type, district, neighborhood, ordering } = params;
  const url = apiBuildUrl("/api/clients/debtors/", { page, page_size, search, debtor_type, district, neighborhood, ordering });
  const res = apiUnwrap(await apiRequest(url, { auth: true }));
  return { results: (res?.results || []).map(mapApiDebtor), count: res?.count || 0 };
}

async function apiGetPaymentsPage(params = {}) {
  const { page = 1, page_size = 50, search, category, currency, ordering, date_from, date_to } = params;
  const url = apiBuildUrl("/api/clients/accounting/entries/", { page, page_size, search, category, currency, ordering, date_from, date_to });
  const res = apiUnwrap(await apiRequest(url, { auth: true }));
  return { results: (res?.results || []), count: res?.count || 0 };
}

async function apiGetClientById(id) {
  try {
    const res = apiUnwrap(await apiRequest(`/api/clients/${id}/`, { auth: true }));
    return res ? mapApiClient(res) : null;
  } catch { return null; }
}

async function apiGetAccountingStats(params = {}) {
  try {
    const url = apiBuildUrl("/api/clients/accounting/stats/", params);
    return apiUnwrap(await apiRequest(url, { auth: true })) || {};
  } catch { return {}; }
}

async function apiGetDebtorById(id) {
  try {
    const res = apiUnwrap(await apiRequest(`/api/clients/debtors/${id}/`, { auth: true }));
    return res ? mapApiDebtor(res) : null;
  } catch { return null; }
}

async function apiGetDebtorPayments(debtorId, params = {}) {
  try {
    const url = apiBuildUrl("/api/clients/debtor-payments/", { debtor: debtorId, page_size: 20, ordering: "-paid_on", ...params });
    const res = apiUnwrap(await apiRequest(url, { auth: true }));
    return res?.results || res || [];
  } catch { return []; }
}

async function apiSaveDebtorPayment(payment) {
  const payload = {
    debtor: payment.debtorId || payment.debtor,
    amount: String(apiParseNumber(payment.amount || 0)),
    paid_on: apiDateOnly(payment.paid_on || new Date().toISOString()),
    notes: payment.notes || "",
  };
  return isApiUuid(payment.id)
    ? apiRequest(`/api/clients/debtor-payments/${payment.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/clients/debtor-payments/", { method: "POST", body: payload });
}

async function apiDeleteDebtorPayment(id) {
  return apiRequest(`/api/clients/debtor-payments/${id}/`, { method: "DELETE" });
}

async function apiGetDebtorAttachments(debtorId) {
  try {
    const url = apiBuildUrl("/api/clients/debtor-attachments/", { debtor: debtorId, page_size: 100 });
    const res = apiUnwrap(await apiRequest(url, { auth: true }));
    return res?.results || res || [];
  } catch { return []; }
}

async function apiUploadDebtorAttachment(debtorId, file, extras = {}) {
  const fd = new FormData();
  fd.append("debtor", debtorId);
  fd.append("file", file);
  fd.append("file_type", extras.file_type || "image");
  if (extras.notes) fd.append("notes", extras.notes);
  fd.append("is_visit_proof", extras.is_visit_proof ? "true" : "false");
  if (extras.latitude) fd.append("latitude", String(extras.latitude));
  if (extras.longitude) fd.append("longitude", String(extras.longitude));
  return apiRequest("/api/clients/debtor-attachments/", { method: "POST", formData: fd, auth: true });
}

async function apiGetWarehouseSummary() {
  try {
    const res = apiUnwrap(await apiRequest("/api/products/warehouse/summary/", { auth: true }));
    return res || {};
  } catch { return {}; }
}

async function apiGetStockEntries(params = {}) {
  try {
    const url = apiBuildUrl("/api/products/stock-entries/", { page_size: 100, ordering: "-created_at", ...params });
    const res = apiUnwrap(await apiRequest(url, { auth: true }));
    return { results: res?.results || res || [], count: res?.count || 0 };
  } catch { return { results: [], count: 0 }; }
}

async function apiCreateStockEntry(entry) {
  const payload = {
    product: entry.product,
    quantity: Number(entry.quantity),
  };
  if (entry.unit_cost) payload.unit_cost = String(entry.unit_cost);
  if (entry.supplier_name) payload.supplier_name = entry.supplier_name;
  if (entry.received_at) payload.received_at = entry.received_at;
  if (entry.notes) payload.notes = entry.notes;
  return apiUnwrap(await apiRequest("/api/products/stock-entries/", { method: "POST", body: payload, auth: true }));
}

async function apiGetWarehouseSales(params = {}) {
  try {
    const url = apiBuildUrl("/api/products/sales/", { page_size: 100, ordering: "-created_at", ...params });
    const res = apiUnwrap(await apiRequest(url, { auth: true }));
    return { results: res?.results || res || [], count: res?.count || 0 };
  } catch { return { results: [], count: 0 }; }
}

async function apiCreateWarehouseSale(sale) {
  const payload = {
    product: sale.product,
    quantity: Number(sale.quantity),
    unit_price: String(sale.unit_price),
    paid_amount: String(sale.paid_amount || 0),
    payment_type: sale.payment_type || "cash",
  };
  if (sale.client) payload.client = sale.client;
  if (sale.client_name) payload.client_name = sale.client_name;
  if (sale.client_phone) payload.client_phone = sale.client_phone;
  if (sale.sold_at) payload.sold_at = sale.sold_at;
  if (sale.notes) payload.notes = sale.notes;
  return apiUnwrap(await apiRequest("/api/products/sales/", { method: "POST", body: payload, auth: true }));
}

async function apiSaveDistrict(district) {
  const payload = { name: (district.name || "").trim() };
  return isApiUuid(district.id)
    ? apiRequest(`/api/clients/districts/${district.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/clients/districts/", { method: "POST", body: payload });
}

async function apiSaveNeighborhood(neighborhood) {
  const payload = {
    name: (neighborhood.name || "").trim(),
    district: neighborhood.districtId || neighborhood.district || null,
  };
  return isApiUuid(neighborhood.id)
    ? apiRequest(`/api/clients/neighborhoods/${neighborhood.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/clients/neighborhoods/", { method: "POST", body: payload });
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
    color: status.color || "",
    isDefault: !!status.is_default,
    sortOrder: status.sort_order || 0,
  };
}

function apiClientVisualStatus(statusName, fallback) {
  const raw = String(statusName || fallback || "").trim().toLowerCase();
  if (!raw) return "active";
  if (raw.includes("inactive") || raw.includes("nofaol") || raw.includes("неактив")) return "inactive";
  if (raw.includes("lost") || raw.includes("yo'qotil") || raw.includes("потер")) return "cancelled";
  if (raw.includes("closed") || raw.includes("yopil") || raw.includes("закрыт")) return "closed";
  if (raw.includes("confirmed") || raw.includes("tasdiql") || raw.includes("подтверж")) return "verified";
  if (raw.includes("contacted") || raw.includes("bog'lan") || raw.includes("bog`lan") || raw.includes("связал")) return "contacted";
  if (raw.includes("qualified") || raw.includes("saralanl") || raw.includes("квалиф")) return "qualified";
  if (raw.includes("pending") || raw.includes("new") || raw.includes("yangi") || raw.includes("kutilmoqd") || raw.includes("новый") || raw.includes("ожидан")) return "pending";
  return "active";
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
    source: client.source || "manual",
    status: apiClientVisualStatus(statusName, client.status),
    statusId: client.status || null,
    statusName,
    statusColor: client.status_color || "",
    productId: apiRelationId(client.product) || client.product || "",
    district: client.district || "",
    mahalla: client.neighborhood || "",
    address: client.address || "",
    currentSystemKw: requestedKw,
    annualConsumptionKwh: client.annual_consumption_kwh == null ? "" : String(client.annual_consumption_kwh),
    estimatedSubsidyKw: client.estimated_subsidy_kw == null ? "" : String(client.estimated_subsidy_kw),
    paymentType,
    paymentTypeLabel: PAYMENT_TYPE_UZ[paymentType] || paymentType,
    ordersCount: 0,
    ordersTotal: 0,
    totalSpent: deposit,
    subsidyAmount: subsidy,
    debtBalanceUzs: 0,
    overdueDebtUzs: 0,
    lastPurchase: client.updated_at || client.created_at || null,
    assignedManagerId: null,
    referralCode: "",
    lastActivity: client.updated_at || client.created_at || null,
    preferredChannel: "manual",
    lifetimeValue: deposit + subsidy,
    satisfaction: 0,
    productInterests: [],
    aiXulosa: client.ai_xulosa || "",
    notes: client.notes || "",
    tags: [],
    createdAt: client.created_at,
    updatedAt: client.updated_at || client.created_at || null,
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
  const paid = apiParseNumber(debtor.total_paid_amount ?? debtor.paid_amount);
  const remaining = apiParseNumber(debtor.remaining_debt_amount ?? (debt - paid));
  const dueDate = debtor.repayment_due_date || apiDateOnly(new Date().toISOString());
  const overdue = dueDate < apiDateOnly(new Date().toISOString()) ? remaining : 0;
  return {
    id: debtor.id,
    customerId: null,
    leadId: null,
    customerName: debtor.full_name || "",
    businessLine: (debtor.debtor_type === "solar_business" || debtor.debtor_type === "solar_panel") ? "Quyosh panel biznesi" : "Moto biznes",
    paymentType: "credit",
    productItems: [],
    status: overdue > 0 ? "processing" : "confirmed",
    paymentStatus: remaining <= 0 ? "paid" : "unpaid",
    deliveryAddress: apiToSentence([debtor.city, debtor.district, debtor.neighborhood]),
    district: debtor.district || "",
    mahalla: debtor.neighborhood || "",
    principalUzs: debt,
    openingPaidUzs: apiParseNumber(debtor.opening_paid_amount),
    paidUzs: paid,
    remainingDebtUzs: remaining,
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
  const sortOrder = apiParseNumber(column.sort_order ?? column.position ?? index);
  return {
    id: column.id,
    name: column.name || column.slug || `Ustun ${index + 1}`,
    slug: column.slug || `column_${index + 1}`,
    color: column.color || "",
    sortOrder,
    position: sortOrder,
  };
}

function apiRelationId(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object") return value.id || value.uuid || null;
  return null;
}

function mapApiTask(task, columnsById = {}) {
  const columnId = apiRelationId(task.column_id) || apiRelationId(task.column);
  const assignedUserId = apiRelationId(task.assigned_to_id) || apiRelationId(task.assigned_to);
  const column = columnsById[columnId] || null;
  return {
    id: task.id,
    title: task.title || "",
    description: task.description || "",
    notes: task.description || "",
    assignedUserId,
    dueDate: task.due_at || task.due_date || new Date().toISOString(),
    createdAt: task.created_at || new Date().toISOString(),
    updatedAt: task.updated_at || task.created_at || new Date().toISOString(),
    columnId: columnId || column?.id || null,
    columnSlug: column?.slug || apiRelationId(task.column?.slug) || "todo",
    columnName: column?.name || (typeof task.column === "object" ? task.column.name : "") || "Vazifa",
    position: apiParseNumber(task.position || 0),
  };
}

function mapApiProductCategory(category) {
  return {
    id: category.id,
    name: category.name || "",
    code: category.code || "",
    sortOrder: apiParseNumber(category.sort_order || 0),
    createdAt: category.created_at || null,
    updatedAt: category.updated_at || null,
  };
}

function mapApiProduct(product) {
  const rawPictures = [
    ...(product.pictures || []),
    ...(product.images || []),
    ...(product.product_pictures || []),
  ];
  ["image_url", "image", "picture", "photo", "thumbnail"].forEach((key) => {
    if (product[key]) rawPictures.push({ id: `${product.id}_${key}`, [key]: product[key] });
  });

  const pictures = rawPictures
    .slice()
    .sort((a, b) => apiParseNumber(a.sort_order || 0) - apiParseNumber(b.sort_order || 0))
    .map((picture, index) => ({
      id: picture.id || `pic_${product.id}_${index}`,
      alt: product.name || `Rasm ${index + 1}`,
      url: apiMediaUrl(picture.url || picture.image_url || picture.image || picture.picture || picture.photo || picture.thumbnail),
      isPrimary: index === 0,
    }))
    .filter((picture) => picture.url);
  const categoryId = apiRelationId(product.category);
  const categoryName = product.category_name || "";
  return {
    id: product.id,
    name: product.name || "",
    model: product.name || "",
    categoryId,
    category: categoryName,
    categoryName,
    categoryCode: "",
    status: "active",
    stockQuantity: apiParseNumber(product.amount),
    priceUzs: apiParseNumber(product.price),
    images: pictures,
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
  const senderType = String(message.sender_type || message.actor_type || message.author_type || message.role || message.from || "").trim().toLowerCase();
  const direction = String(message.direction || "").trim().toLowerCase();
  const outgoing = new Set(["outgoing", "out", "operator", "admin", "manager", "human", "agent", "staff", "system"]);
  const customer = new Set(["incoming", "in", "customer", "client", "lead", "visitor"]);
  const ai = new Set(["ai", "assistant", "bot"]);
  let from = "customer";
  if (message.is_ai || ai.has(senderType) || ai.has(direction)) from = "ai";
  else if (outgoing.has(senderType) || outgoing.has(direction) || message.is_outgoing || message.is_from_me) from = "operator";
  else if (customer.has(senderType) || customer.has(direction)) from = "customer";
  return {
    id: message.id || `msg_${message.created_at || Date.now()}`,
    from,
    text: message.content || message.text || message.message || fallbackTitle || "",
    at: message.created_at || message.sent_at || message.at || new Date().toISOString(),
  };
}

function mapApiConversation(session) {
  const latest = mapApiMessage(session.latest_message, session.title || "Yangi suhbat");
  const preferredName = session.display_name || session.client_name || session.client?.full_name || session.title || session.platform_user_id || "Suhbat";
  return {
    id: session.id,
    leadId: null,
    name: preferredName,
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

async function apiLoadCollections(keys = [], currentData = {}) {
  const wanted = new Set(keys);
  const data = {};
  const jobs = [];

  if (wanted.has("authUser")) jobs.push(
    apiRequest("/api/auth/me/").catch((error) => {
      if (error?.isAuthError) throw error;
      return null;
    }).then((me) => {
      data.authUser = me ? mapApiUser(apiUnwrap(me)) : null;
    })
  );
  if (wanted.has("permissions")) jobs.push(
    apiRequest("/api/auth/permissions/").catch(() => []).then((permissions) => {
      data.permissions = Array.isArray(apiUnwrap(permissions)) ? apiUnwrap(permissions) : apiUnwrap(permissions)?.permissions || [];
    })
  );
  if (wanted.has("permissionsAll")) jobs.push(
    apiRequest("/api/auth/permissions/all/").catch(() => []).then((permissionsAll) => {
      data.permissionsAll = Array.isArray(apiUnwrap(permissionsAll)) ? apiUnwrap(permissionsAll) : apiUnwrap(permissionsAll)?.permissions || [];
    })
  );
  if (wanted.has("roles")) jobs.push(
    apiRequest("/api/auth/roles/").catch(() => []).then((roles) => {
      data.roles = Array.isArray(apiUnwrap(roles)) ? apiUnwrap(roles) : apiUnwrap(roles)?.roles || [];
    })
  );
  if (wanted.has("users")) jobs.push(
    apiPaginateAll("/api/users/").catch(() => []).then((users) => {
      data.users = users.map(mapApiUser);
    })
  );
  if (wanted.has("districts")) jobs.push(
    apiPaginateAll("/api/clients/districts/").catch(() => []).then((districts) => {
      data.districts = districts;
    })
  );
  if (wanted.has("neighborhoods")) jobs.push(
    apiPaginateAll("/api/clients/neighborhoods/").catch(() => []).then((neighborhoods) => {
      data.neighborhoods = neighborhoods;
    })
  );
  if (wanted.has("clientStatuses")) jobs.push(
    apiPaginateAll("/api/clients/statuses/").catch(() => []).then((clientStatuses) => {
      data.clientStatuses = clientStatuses.map(mapApiClientStatus);
    })
  );
  if (wanted.has("customers")) jobs.push(
    apiPaginateAll("/api/clients/").catch(() => []).then((clients) => {
      data.customers = clients.map(mapApiClient);
    })
  );
  if (wanted.has("orders")) jobs.push(
    Promise.all([
      apiPaginateAll("/api/clients/debtors/?ordering=id").catch(() => []),
      apiGetDebtorsPage({ page: 1, page_size: 50 }).catch(() => ({ results: [], count: 0 })),
    ]).then(([debtors, countRes]) => {
      data.orders = debtors.map(mapApiDebtor);
      data.ordersTotal = countRes.count || debtors.length;
    })
  );
  if (wanted.has("taskColumns")) jobs.push(
    apiPaginateAll("/api/tasks/columns/").catch(() => []).then((taskColumns) => {
      data.taskColumns = taskColumns.map(mapApiTaskColumn).sort((a, b) => a.position - b.position);
    })
  );
  if (wanted.has("taskAssignees")) jobs.push(
    apiPaginateAll("/api/tasks/assignees/").catch(() => []).then((taskAssignees) => {
      data.taskAssignees = taskAssignees.map(mapApiUser);
    })
  );
  if (wanted.has("notifications")) jobs.push(
    apiPaginateAll("/api/notifications/?ordering=-created_at").catch(() => []).then((notifications) => {
      data.notifications = notifications.map(mapApiNotification);
    })
  );
  if (wanted.has("accountingDays")) jobs.push(
    apiPaginateAll("/api/clients/accounting/days/").catch(() => []).then((accountingDays) => {
      data.accountingDays = accountingDays;
    })
  );
  if (wanted.has("products")) jobs.push(
    apiPaginateAll("/api/products/").catch(() => []).then((products) => {
      data.products = products.map(mapApiProduct);
    })
  );
  if (wanted.has("productCategories")) jobs.push(
    apiPaginateAll("/api/products/categories/").catch(() => []).then((productCategories) => {
      data.productCategories = productCategories.map(mapApiProductCategory);
    })
  );
  if (wanted.has("conversations")) jobs.push(
    apiPaginateAll("/api/chats/sessions/").catch(() => []).then((chatSessions) => {
      data.conversations = chatSessions.map(mapApiConversation);
    })
  );
  if (wanted.has("audit")) jobs.push(
    apiPaginateAll("/api/audit-logs/").catch(() => []).then((audit) => {
      data.audit = audit.map(mapApiAuditLog);
    })
  );
  if (wanted.has("integrationConfigs")) jobs.push(
    apiPaginateAll("/api/settings/integrations/").catch(() => []).then((integrationConfigs) => {
      data.integrationConfigs = integrationConfigs;
    })
  );
  if (wanted.has("integrationEvents")) jobs.push(
    apiPaginateAll("/api/settings/integrations/events/").catch(() => []).then((integrationEvents) => {
      data.integrationEvents = integrationEvents;
    })
  );
  if (wanted.has("aiSettings")) jobs.push(
    apiPaginateAll("/api/settings/ai/").catch(() => []).then((aiSettings) => {
      data.aiSettings = aiSettings;
    })
  );
  if (wanted.has("activeAiSettings")) jobs.push(
    apiRequest("/api/settings/ai/active/").catch(() => []).then((activeAiSettings) => {
      data.activeAiSettings = Array.isArray(apiUnwrap(activeAiSettings)) ? apiUnwrap(activeAiSettings) : apiListItems(activeAiSettings);
    })
  );
  if (wanted.has("dashboardOverview")) jobs.push(
    apiRequest("/api/dashboard/overview/").catch(() => null).then((dashboardOverview) => {
      data.dashboardOverview = apiUnwrap(dashboardOverview);
    })
  );

  await Promise.all(jobs);

  if (wanted.has("users") && wanted.has("authUser") && data.authUser && !data.users.find((user) => user.id === data.authUser.id)) {
    data.users.unshift(data.authUser);
  }

  if (wanted.has("tasks")) {
    const taskColumns = wanted.has("taskColumns") ? data.taskColumns : (currentData.taskColumns || []);
    const columnsById = Object.fromEntries(taskColumns.map((column) => [column.id, column]));
    const tasks = await apiPaginateAll("/api/tasks/").catch(() => []);
    data.tasks = tasks.map((task) => mapApiTask(task, columnsById));
  }

  if (wanted.has("payments")) {
    const accountingDays = wanted.has("accountingDays") ? data.accountingDays : (currentData.accountingDays || []);
    const dayMap = Object.fromEntries(accountingDays.map((day) => [day.id, day]));
    const accountingEntries = await apiPaginateAll("/api/clients/accounting/entries/").catch(() => []);
    data.payments = accountingEntries.map((entry) => mapApiAccountingEntry(entry, dayMap));
  }

  if (wanted.has("customers") || wanted.has("orders")) {
    const customers = wanted.has("customers") ? data.customers : (currentData.customers || []);
    const orders = wanted.has("orders") ? data.orders : (currentData.orders || []);
    data.locations = mergeLocations(customers, orders);
  }

  return data;
}

const API_BOOTSTRAP_KEYS = [
  "authUser",
  "permissions",
  "permissionsAll",
  "roles",
  "users",
  "districts",
  "neighborhoods",
  "clientStatuses",
  "taskColumns",
  "tasks",
  "taskAssignees",
  "notifications",
  "accountingDays",
  "products",
  "productCategories",
  "conversations",
  "audit",
  "integrationConfigs",
  "integrationEvents",
  "aiSettings",
  "activeAiSettings",
  "dashboardOverview",
];

async function apiBootstrap() {
  return apiLoadCollections(API_BOOTSTRAP_KEYS);
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
    source: customer.source || "manual",
    product: customer.productId || null,
    requested_kw: String(apiParseNumber(customer.currentSystemKw || 0)),
    annual_consumption_kwh: customer.annualConsumptionKwh === "" ? null : String(apiParseNumber(customer.annualConsumptionKwh || 0)),
    estimated_subsidy_kw: customer.estimatedSubsidyKw === "" ? null : String(apiParseNumber(customer.estimatedSubsidyKw || 0)),
    payment_type: customer.paymentType === "credit" ? "credit" : "cash",
    notes: customer.notes || "",
    status: clientStatusIdForSave(customer, data),
    subsidy_amount: String(apiParseNumber(customer.subsidyAmount || 0)),
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
  const isUpdate = isApiUuid(order.id);
  const payload = {
    debtor_type: order.businessLine === "Moto biznes" ? "moto_business" : "solar_business",
    full_name: (order.customerName || "").trim(),
    phone: (order.phone || "").trim(),
    city: order.city || "Toshkent",
    district: (order.district || "").trim(),
    neighborhood: (order.mahalla || "").trim(),
    address: (order.deliveryAddress || "").trim(),
    debt_amount: String(apiParseNumber(order.principalUzs || order.totalUzs || 0)),
    debt_taken_on: apiDateOnly(order.createdAt || new Date().toISOString()),
    repayment_due_date: dueDate,
    notes: order.note || "",
  };
  if (!isUpdate) {
    const openingPaid = apiParseNumber(order.paidUzs || 0);
    if (openingPaid > 0) payload.paid_amount = String(openingPaid);
  }
  return isUpdate
    ? apiRequest(`/api/clients/debtors/${order.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/clients/debtors/", { method: "POST", body: payload });
}

async function apiSaveTask(task) {
  if (!isApiUuid(task.columnId)) {
    throw new Error("Vazifa ustuni uchun UUID topilmadi");
  }
  if (task.assignedUserId && !isApiUuid(task.assignedUserId)) {
    throw new Error("Mas'ul foydalanuvchi uchun UUID topilmadi");
  }
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

async function apiSaveTaskColumn(column) {
  const payload = {
    name: (column.name || "").trim(),
    slug: apiTaskColumnSlugify(column.slug || column.name || ""),
    color: (column.color || "").trim() || null,
    sort_order: apiParseNumber((column.sortOrder ?? column.position) || 0),
  };
  return isApiUuid(column.id)
    ? apiRequest(`/api/tasks/columns/${column.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/tasks/columns/", { method: "POST", body: payload });
}

async function apiMoveTask(taskId, columnId, position) {
  if (!isApiUuid(taskId)) {
    throw new Error("Vazifa UUID topilmadi");
  }
  if (!isApiUuid(columnId)) {
    throw new Error("Ustun UUID topilmadi");
  }
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
    formData.append("category", product.categoryId || "");
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
    category: product.categoryId || null,
    description: product.description || "",
    price: String(apiParseNumber(product.priceUzs || 0)),
    amount: apiParseNumber(product.stockQuantity || 0),
  };
  return isApiUuid(product.id)
    ? apiRequest(`/api/products/${product.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/products/", { method: "POST", body: payload });
}

function apiProductCategoryCode(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]+/g, "")
    .replace(/^_+|_+$/g, "") || "product_category";
}

async function apiSaveProductCategory(category) {
  const payload = {
    name: (category.name || "").trim(),
    code: apiProductCategoryCode(category.code || category.name),
    sort_order: apiParseNumber(category.sortOrder || 0),
  };
  return isApiUuid(category.id)
    ? apiRequest(`/api/products/categories/${category.id}/`, { method: "PATCH", body: payload })
    : apiRequest("/api/products/categories/", { method: "POST", body: payload });
}

async function apiSaveClientStatus(status) {
  const payload = {
    name: (status.name || "").trim(),
    slug: apiSlugify(status.slug || status.name),
    color: (status.color || "").trim() || null,
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

async function apiDeleteChatSession(sessionId) {
  await apiDelete(`/api/chats/sessions/${sessionId}/`);
}

async function apiSetChatMode(sessionId, mode, options = {}) {
  if (mode === "ai") {
    await apiRequest(`/api/chats/sessions/${sessionId}/resume-ai/`, { method: "POST", body: {} });
    return;
  }
  if (mode === "handoff") {
    await apiRequest(`/api/chats/sessions/${sessionId}/request-operator/`, { method: "POST", body: {} });
    return;
  }
  const pausedUntil = options.pausedUntil || new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString();
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

async function apiGetAllUsers() {
  try {
    const users = await apiPaginateAll("/api/users/");
    return (users || []).map(mapApiUser);
  } catch { return []; }
}

async function apiGetAuditLogs(params = {}) {
  const { page = 1, page_size = 25, search, action, actor, date_from, date_to } = params;
  const url = apiBuildUrl("/api/audit-logs/", { page, page_size, search, action, actor, date_from, date_to });
  const res = apiUnwrap(await apiRequest(url, { auth: true }));
  return { results: res?.results || [], count: res?.count || 0, next: res?.next || null };
}

Object.assign(window, {
  API_BASE,
  SESSION_KEY,
  isApiUuid,
  apiMediaUrl,
  apiGetClientsPage,
  apiGetDebtorsPage,
  apiGetPaymentsPage,
  apiGetClientById,
  apiGetDebtorById,
  apiGetDebtorPayments,
  apiSaveDebtorPayment,
  apiDeleteDebtorPayment,
  apiGetDebtorAttachments,
  apiUploadDebtorAttachment,
  apiGetWarehouseSummary,
  apiGetStockEntries,
  apiCreateStockEntry,
  apiGetWarehouseSales,
  apiCreateWarehouseSale,
  apiGetAccountingStats,
  apiUiRole,
  apiLoadSession,
  apiSaveSession,
  apiClearSession,
  apiCreateEmptyData,
  apiRequest,
  apiLoadCollections,
  apiBootstrap,
  apiLogin,
  apiDelete,
  apiDownloadFile,
  apiDownloadClientsExcel,
  apiDownloadDebtorsExcel,
  apiDownloadAccountingExcel,
  apiSaveDistrict,
  apiSaveNeighborhood,
  apiSaveUser,
  apiSaveClient,
  apiSaveDebtor,
  apiSaveTask,
  apiSaveTaskColumn,
  apiMoveTask,
  apiSaveAccountingEntry,
  apiSaveProduct,
  apiSaveProductCategory,
  apiSaveClientStatus,
  apiSaveAiSetting,
  apiSaveIntegrationConfig,
  apiLoadUserPermissions,
  apiLoadChatMessages,
  apiLoadChatSession,
  apiSendChatMessage,
  apiDeleteChatSession,
  apiSetChatMode,
  apiMarkChatRead,
  apiMarkNotificationRead,
  apiMarkAllNotificationsRead,
  apiClearAllNotifications,
  mapApiConversation,
  mapApiMessage,
  mapApiNotification,
  mapApiAccountingEntry,
  apiWebSocketBase,
  apiGetAuditLogs,
  apiGetAllUsers,
});
