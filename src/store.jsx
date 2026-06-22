/* store.jsx - global state and API-backed context */
const { createContext, useContext, useState, useEffect, useCallback, useRef } = React;

const PREF_KEY = "tg_crm_prefs_v2";
const REMOTE_COLLECTIONS = new Set(["users", "customers", "orders", "tasks", "taskColumns", "payments", "products", "productCategories", "clientStatuses", "aiSettings", "integrationConfigs"]);

function loadPrefs() {
  try {
    const raw = localStorage.getItem(PREF_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function createLocalSeed() {
  return apiCreateEmptyData();
}

function mergeLocationMaps(primary = {}, secondary = {}) {
  const merged = {};
  [secondary, primary].forEach((source) => {
    Object.entries(source || {}).forEach(([district, mahallas]) => {
      if (!merged[district]) merged[district] = [];
      (mahallas || []).forEach((mahalla) => {
        if (mahalla && !merged[district].includes(mahalla)) merged[district].push(mahalla);
      });
    });
  });
  return Object.fromEntries(
    Object.entries(merged)
      .sort((a, b) => a[0].localeCompare(b[0], "uz"))
      .map(([district, mahallas]) => [district, [...mahallas].sort((a, b) => a.localeCompare(b, "uz"))])
  );
}

function buildLocationMap(customers = [], orders = []) {
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

function mergeRemoteData(remote, previous) {
  const seed = createLocalSeed();
  const prev = previous || seed;
  const next = {
    ...seed,
    ...prev,
    ...remote,
  };
  if ("customers" in remote || "orders" in remote) {
    next.locations = buildLocationMap(next.customers || [], next.orders || []);
  } else if ("locations" in remote) {
    next.locations = mergeLocationMaps(remote.locations || {}, prev.locations || seed.locations);
  } else {
    next.locations = prev.locations || seed.locations;
  }
  return next;
}

const BASE_COLLECTIONS = ["authUser", "users", "notifications"];

function routeCollectionKeys(route) {
  const normalized = normalizeRoute(route);
  const main = normalized.split("/").filter(Boolean)[0] || "dashboard";

  switch (main) {
    case "dashboard":
      return [...BASE_COLLECTIONS, "customers", "orders", "tasks", "taskColumns", "payments", "accountingDays", "products", "dashboardOverview"];
    case "customers":
    case "leads":
      return [...BASE_COLLECTIONS, "customers", "clientStatuses", "orders", "payments", "accountingDays"];
    case "tasks":
    case "pipeline":
      return [...BASE_COLLECTIONS, "tasks", "taskColumns", "taskAssignees"];
    case "inbox":
      return [...BASE_COLLECTIONS, "conversations", "customers"];
    case "products":
      return [...BASE_COLLECTIONS, "products", "productCategories"];
    case "debtors":
    case "orders":
      return [...BASE_COLLECTIONS, "orders", "customers"];
    case "accounting":
    case "payments":
      return [...BASE_COLLECTIONS, "payments", "accountingDays", "orders", "customers"];
    case "users":
      return [...BASE_COLLECTIONS];
    case "roles":
      return [...BASE_COLLECTIONS, "roles", "permissions", "permissionsAll"];
    case "notifications":
      return [...BASE_COLLECTIONS];
    case "integrations":
      return [...BASE_COLLECTIONS, "integrationConfigs", "integrationEvents", "aiSettings"];
    case "settings":
      return [...BASE_COLLECTIONS, "clientStatuses", "customers", "aiSettings", "activeAiSettings"];
    default:
      return [...BASE_COLLECTIONS];
  }
}

const AppCtx = createContext(null);
const useApp = () => useContext(AppCtx);
window.useApp = () => useContext(AppCtx);

window.resolveLight = (theme) =>
  theme === "light" || (theme === "system" && !window.matchMedia("(prefers-color-scheme: dark)").matches);

function AppProvider({ children }) {
  const savedPrefs = loadPrefs();
  const savedSession = apiLoadSession();

  const [theme, setTheme] = useState(savedPrefs.theme || "dark");
  const [accent, setAccent] = useState(savedPrefs.accent || "#6366f1");
  const [lang, setLang] = useState(savedPrefs.lang || "uz");
  const [density, setDensity] = useState(savedPrefs.density || "comfortable");
  const [layout, setLayout] = useState(savedPrefs.layout || "sidebar");
  const [container, setContainer] = useState(savedPrefs.container || "fluid");
  const [direction, setDirection] = useState(savedPrefs.direction || "ltr");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(savedPrefs.sidebarCollapsed || false);
  const [role, setRole] = useState(savedPrefs.role || apiUiRole(savedSession?.user?.role || "operator"));
  const [authed, setAuthed] = useState(!!savedSession?.access);
  const [dataLoading, setDataLoading] = useState(!!savedSession?.access);
  const [data, setData] = useState(() => createLocalSeed());
  const dataRef = useRef(data);
  const chatWsRef = useRef(null);
  const loadedCollectionsRef = useRef(new Set());
  const loginRouteLoadHandledRef = useRef(false);

  useEffect(() => {
    dataRef.current = data;
    window.TUMAN_MAHALLA = data.locations;
  }, [data]);

  useEffect(() => {
    localStorage.setItem(PREF_KEY, JSON.stringify({
      theme,
      accent,
      lang,
      density,
      layout,
      container,
      direction,
      sidebarCollapsed,
      role,
    }));
  }, [theme, accent, lang, density, layout, container, direction, sidebarCollapsed, role]);

  useEffect(() => {
    const resolve = (value) => value === "system"
      ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : value;
    const apply = () => document.documentElement.setAttribute("data-theme", resolve(theme));
    apply();
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    if (theme === "system") {
      mq.addEventListener("change", apply);
      return () => mq.removeEventListener("change", apply);
    }
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", accent);
    const r = parseInt(accent.slice(1, 3), 16);
    const g = parseInt(accent.slice(3, 5), 16);
    const b = parseInt(accent.slice(5, 7), 16);
    root.style.setProperty("--accent-rgb", `${r}, ${g}, ${b}`);
    root.style.setProperty("--accent-soft", `rgba(${r}, ${g}, ${b}, 0.12)`);
  }, [accent]);

  useEffect(() => { document.documentElement.setAttribute("data-density", density); }, [density]);
  useEffect(() => { document.documentElement.setAttribute("data-layout", layout); }, [layout]);
  useEffect(() => { document.documentElement.setAttribute("data-container", container); }, [container]);
  useEffect(() => { document.documentElement.setAttribute("dir", direction); }, [direction]);

  const t = useCallback((key) => (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) || (TRANSLATIONS.uz[key]) || key, [lang]);

  const [toasts, setToasts] = useState([]);
  const toast = useCallback((msg, kind = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((items) => [...items, { id, msg, kind }]);
    setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3400);
  }, []);
  const dismissToast = useCallback((id) => setToasts((items) => items.filter((item) => item.id !== id)), []);

  const loadCollections = useCallback(async (keys, { silent = false, force = false } = {}) => {
    if (!apiLoadSession()?.access) return null;
    const requested = [...new Set((keys || []).filter(Boolean))];
    const targetKeys = force ? requested : requested.filter((key) => !loadedCollectionsRef.current.has(key));
    if (!targetKeys.length) return null;
    setDataLoading(true);
    try {
      const remote = await apiLoadCollections(targetKeys, dataRef.current);
      setData((previous) => mergeRemoteData(remote, previous));
      targetKeys.forEach((key) => loadedCollectionsRef.current.add(key));
      if (remote.authUser?.role) setRole(remote.authUser.role);
      return remote;
    } catch (error) {
      if (!silent) toast(error.message || "Ma'lumotlarni yuklab bo'lmadi", "error");
      throw error;
    } finally {
      setDataLoading(false);
    }
  }, [toast]);

  const refreshCollections = useCallback(async (requiredKeys, optionalKeys = []) => {
    const keys = [
      ...requiredKeys,
      ...optionalKeys.filter((key) => loadedCollectionsRef.current.has(key)),
    ];
    return loadCollections(keys, { silent: true, force: true });
  }, [loadCollections]);

  const logout = useCallback(() => {
    apiClearSession();
    loadedCollectionsRef.current = new Set();
    setAuthed(false);
    setDataLoading(false);
    setData(createLocalSeed());
  }, []);

  useEffect(() => {
    if (!authed) return undefined;
    if (loginRouteLoadHandledRef.current) {
      loginRouteLoadHandledRef.current = false;
      return undefined;
    }
    const syncRouteCollections = () => {
      loadCollections(routeCollectionKeys(readRoute()), { silent: true, force: true }).catch((error) => {
        if ((error.message || "").toLowerCase().includes("token")) logout();
      });
    };
    syncRouteCollections();
    window.addEventListener("app:navigate", syncRouteCollections);
    window.addEventListener("popstate", syncRouteCollections);
    return () => {
      window.removeEventListener("app:navigate", syncRouteCollections);
      window.removeEventListener("popstate", syncRouteCollections);
    };
  }, [authed, loadCollections, logout]);

  const login = useCallback(async (username, password) => {
    setDataLoading(true);
    try {
      const result = await apiLogin(username, password);
      const access = result?.access || result?.tokens?.access || result?.token?.access;
      const refresh = result?.refresh || result?.tokens?.refresh || result?.token?.refresh;
      if (!access) throw new Error("Access token qaytmadi");
      apiSaveSession({ access, refresh, user: result?.user || null });
      loadedCollectionsRef.current = new Set();
      loginRouteLoadHandledRef.current = true;
      setAuthed(true);
      const remote = await loadCollections(routeCollectionKeys(readRoute()), { silent: true, force: true });
      setRole(remote.authUser?.role || apiUiRole(result?.user?.role || "operator"));
      toast("Tizimga kirildi");
      return remote;
    } catch (error) {
      apiClearSession();
      setAuthed(false);
      toast(error.message || "Kirish amalga oshmadi", "error");
      throw error;
    } finally {
      setDataLoading(false);
    }
  }, [loadCollections, toast]);

  const update = useCallback((key, updater) => {
    setData((current) => ({
      ...current,
      [key]: typeof updater === "function" ? updater(current[key]) : updater,
    }));
  }, []);

  const upsert = useCallback(async (key, item) => {
    if (!REMOTE_COLLECTIONS.has(key)) {
      setData((current) => {
        const rows = current[key] || [];
        const index = rows.findIndex((row) => row.id === item.id);
        const next = index >= 0
          ? rows.map((row) => (row.id === item.id ? { ...row, ...item } : row))
          : [item, ...rows];
        return { ...current, [key]: next };
      });
      return item;
    }

    if (key === "users") {
      await apiSaveUser(item);
      await refreshCollections(["users"]);
    }
    if (key === "customers") {
      await apiSaveClient(item, dataRef.current);
      await refreshCollections(["customers"], ["dashboardOverview", "notifications"]);
    }
    if (key === "orders") {
      await apiSaveDebtor(item);
      await refreshCollections(["orders"], ["dashboardOverview", "notifications"]);
    }
    if (key === "tasks") {
      await apiSaveTask(item);
      await refreshCollections(["tasks"], ["dashboardOverview", "notifications"]);
    }
    if (key === "taskColumns") {
      await apiSaveTaskColumn(item);
      await refreshCollections(["taskColumns"], ["tasks"]);
    }
    if (key === "payments") {
      await apiSaveAccountingEntry(item, dataRef.current);
      await refreshCollections(["payments", "accountingDays"], ["dashboardOverview"]);
    }
    if (key === "products") {
      await apiSaveProduct(item);
      await refreshCollections(["products"], ["dashboardOverview"]);
    }
    if (key === "productCategories") {
      await apiSaveProductCategory(item);
      await refreshCollections(["productCategories"], ["products"]);
    }
    if (key === "clientStatuses") {
      await apiSaveClientStatus(item);
      await refreshCollections(["clientStatuses"]);
    }
    if (key === "aiSettings") {
      await apiSaveAiSetting(item);
      await refreshCollections(["aiSettings"], ["activeAiSettings"]);
    }
    if (key === "integrationConfigs") {
      await apiSaveIntegrationConfig(item);
      await refreshCollections(["integrationConfigs"], ["integrationEvents"]);
    }
    return item;
  }, [refreshCollections]);

  const remove = useCallback(async (key, id) => {
    if (!REMOTE_COLLECTIONS.has(key)) {
      setData((current) => ({ ...current, [key]: (current[key] || []).filter((row) => row.id !== id) }));
      return;
    }

    if (key === "users") {
      await apiDelete(`/api/users/${id}/`);
      await refreshCollections(["users"]);
    }
    if (key === "customers") {
      await apiDelete(`/api/clients/${id}/`);
      await refreshCollections(["customers"], ["dashboardOverview", "notifications"]);
    }
    if (key === "orders") {
      await apiDelete(`/api/clients/debtors/${id}/`);
      await refreshCollections(["orders"], ["dashboardOverview", "notifications"]);
    }
    if (key === "tasks") {
      await apiDelete(`/api/tasks/${id}/`);
      await refreshCollections(["tasks"], ["dashboardOverview", "notifications"]);
    }
    if (key === "taskColumns") {
      await apiDelete(`/api/tasks/columns/${id}/`);
      await refreshCollections(["taskColumns", "tasks"]);
    }
    if (key === "payments") {
      await apiDelete(`/api/clients/accounting/entries/${id}/`);
      await refreshCollections(["payments", "accountingDays"], ["dashboardOverview"]);
    }
    if (key === "products") {
      await apiDelete(`/api/products/${id}/`);
      await refreshCollections(["products"], ["dashboardOverview"]);
    }
    if (key === "productCategories") {
      await apiDelete(`/api/products/categories/${id}/`);
      await refreshCollections(["productCategories"], ["products"]);
    }
    if (key === "clientStatuses") {
      await apiDelete(`/api/clients/statuses/${id}/`);
      await refreshCollections(["clientStatuses"]);
    }
    if (key === "aiSettings") {
      await apiDelete(`/api/settings/ai/${id}/`);
      await refreshCollections(["aiSettings"], ["activeAiSettings"]);
    }
    if (key === "integrationConfigs") {
      await apiDelete(`/api/settings/integrations/${id}/`);
      await refreshCollections(["integrationConfigs"], ["integrationEvents"]);
    }
  }, [refreshCollections]);

  const refreshConversation = useCallback(async (sessionId, nextMessages = null) => {
    const rawSession = await apiLoadChatSession(sessionId);
    const mapped = mapApiConversation(rawSession);
    setData((current) => ({
      ...current,
      conversations: current.conversations.map((row) => row.id === sessionId ? {
        ...row,
        ...mapped,
        messages: nextMessages || row.messages || mapped.messages || [],
        messagesLoaded: !!nextMessages || row.messagesLoaded,
      } : row),
    }));
    return mapped;
  }, []);

  const markConversationRead = useCallback(async (sessionId) => {
    try {
      await apiMarkChatRead(sessionId);
      setData((current) => ({
        ...current,
        conversations: current.conversations.map((row) => row.id === sessionId ? { ...row, unread: 0 } : row),
      }));
    } catch (error) {
      console.error(error);
    }
  }, []);

  const ensureConversationMessages = useCallback(async (sessionId, options = {}) => {
    const { force = false, markRead = true } = options;
    const existing = dataRef.current.conversations.find((row) => row.id === sessionId);
    if (existing?.messagesLoaded && !force) {
      if (markRead && existing.unread > 0) markConversationRead(sessionId);
      return existing.messages || [];
    }

    const messages = await apiLoadChatMessages(sessionId);
    const lastAt = messages[messages.length - 1]?.at || existing?.lastAt || new Date().toISOString();
    setData((current) => ({
      ...current,
      conversations: current.conversations.map((row) => row.id === sessionId ? {
        ...row,
        messages,
        messagesLoaded: true,
        unread: markRead ? 0 : row.unread,
        lastAt,
      } : row),
    }));

    refreshConversation(sessionId, messages).catch(() => null);
    if (markRead && (existing?.unread || 0) > 0) markConversationRead(sessionId);
    return messages;
  }, [markConversationRead, refreshConversation]);

  const sendConversationMessage = useCallback(async (sessionId, content) => {
    await apiSendChatMessage(sessionId, content);
    await ensureConversationMessages(sessionId, { force: true, markRead: false });
    await markConversationRead(sessionId);
  }, [ensureConversationMessages, markConversationRead]);

  const deleteConversation = useCallback(async (sessionId) => {
    await apiDeleteChatSession(sessionId);
    setData((current) => ({
      ...current,
      conversations: (current.conversations || []).filter((row) => row.id !== sessionId),
    }));
  }, []);

  const setConversationMode = useCallback(async (sessionId, mode, options = {}) => {
    await apiSetChatMode(sessionId, mode, options);
    await refreshConversation(sessionId);
  }, [refreshConversation]);

  const moveTask = useCallback(async (taskId, columnId, position) => {
    await apiMoveTask(taskId, columnId, position);
    await refreshCollections(["tasks"], ["dashboardOverview", "notifications"]);
  }, [refreshCollections]);

  const markNotificationRead = useCallback(async (notificationId) => {
    await apiMarkNotificationRead(notificationId);
    setData((current) => ({
      ...current,
      notifications: (current.notifications || []).map((notification) => (
        notification.id === notificationId ? { ...notification, read: true, readAt: new Date().toISOString() } : notification
      )),
    }));
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    await apiMarkAllNotificationsRead();
    setData((current) => ({
      ...current,
      notifications: (current.notifications || []).map((notification) => ({ ...notification, read: true, readAt: notification.readAt || new Date().toISOString() })),
    }));
  }, []);

  const clearNotifications = useCallback(async () => {
    await apiClearAllNotifications();
    setData((current) => ({ ...current, notifications: [] }));
  }, []);

  useEffect(() => {
    const session = apiLoadSession();
    if (!authed || !session?.access) return undefined;

    const ws = new WebSocket(`${apiWebSocketBase()}/ws/chats/?token=${encodeURIComponent(session.access)}`);
    chatWsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (payload.type === "chat.session_updated" && payload.session) {
          const mapped = mapApiConversation(payload.session);
          setData((current) => {
            const existing = (current.conversations || []).find((row) => row.id === mapped.id);
            const conversations = existing
              ? current.conversations.map((row) => row.id === mapped.id ? { ...row, ...mapped, messages: row.messages || mapped.messages || [] } : row)
              : [mapped, ...(current.conversations || [])];
            return { ...current, conversations };
          });
        }
        if (payload.type === "chat.message_created" && payload.session_id && payload.message) {
          const mappedMessage = mapApiMessage(payload.message);
          if (!mappedMessage) return;
          setData((current) => ({
            ...current,
            conversations: (current.conversations || []).map((row) => row.id === payload.session_id ? {
              ...row,
              messagesLoaded: true,
              messages: [...(row.messages || []).filter((message) => message.id !== mappedMessage.id), mappedMessage],
              lastAt: mappedMessage.at,
              unread: mappedMessage.from === "customer" ? (row.unread || 0) + 1 : row.unread || 0,
            } : row),
          }));
          refreshConversation(payload.session_id).catch(() => null);
        }
      } catch (error) {
        console.error(error);
      }
    };

    return () => {
      if (chatWsRef.current === ws) chatWsRef.current = null;
      try { ws.close(); } catch (error) { console.error(error); }
    };
  }, [authed, refreshConversation]);

  const resetData = useCallback(async () => {
    if (authed) {
      await loadCollections(routeCollectionKeys(readRoute()), { force: true });
      toast("Ma'lumotlar yangilandi");
      return;
    }
    setData(createLocalSeed());
    toast("Ma'lumotlar tiklandi");
  }, [authed, loadCollections, toast]);

  const nav = useCallback((to, opts) => window.navTo(to, opts), []);

  const value = {
    theme, setTheme, accent, setAccent, lang, setLang, density, setDensity,
    layout, setLayout, container, setContainer, direction, setDirection,
    sidebarCollapsed, setSidebarCollapsed, role, setRole, authed, setAuthed,
    dataLoading, data, setData, update, upsert, remove, resetData, reloadData: () => loadCollections(routeCollectionKeys(readRoute()), { force: true }),
    login, logout, ensureConversationMessages, sendConversationMessage, deleteConversation, setConversationMode, markConversationRead,
    moveTask, markNotificationRead, markAllNotificationsRead, clearNotifications,
    t, toast, toasts, dismissToast, nav,
  };

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}
window.AppProvider = AppProvider;

const normalizeRoute = (to) => {
  if (!to) return "/dashboard";
  const path = String(to).trim();
  if (path.startsWith("#/")) return path.slice(1);
  if (path === "#" || path === "/") return "/dashboard";
  if (path.startsWith("/")) return path;
  return `/${path}`;
};

const readRoute = () => {
  const hash = window.location.hash || "";
  if (hash.startsWith("#/")) return normalizeRoute(hash.slice(1));

  const pathname = window.location.pathname || "/";
  if (pathname === "/" || pathname === "/index.html") return "/dashboard";
  return normalizeRoute(pathname.replace(/\/index\.html$/, "") || "/dashboard");
};

const writeRoute = (to, { replace = false } = {}) => {
  const path = normalizeRoute(to);
  const method = replace ? "replaceState" : "pushState";
  window.history[method](null, "", path);
  window.dispatchEvent(new Event("app:navigate"));
  return path;
};

function useRoute() {
  const [route, setRoute] = useState(() => readRoute());
  useEffect(() => {
    const sync = () => setRoute(readRoute());

    if (window.location.hash.startsWith("#/")) {
      writeRoute(window.location.hash.slice(1), { replace: true });
      sync();
    } else if (window.location.pathname === "/" || window.location.pathname === "/index.html") {
      writeRoute("/dashboard", { replace: true });
      sync();
    }

    window.addEventListener("popstate", sync);
    window.addEventListener("app:navigate", sync);
    return () => {
      window.removeEventListener("popstate", sync);
      window.removeEventListener("app:navigate", sync);
    };
  }, []);
  const nav = useCallback((to, opts) => setRoute(writeRoute(to, opts)), []);
  return [route, nav];
}
window.useRoute = useRoute;
window.navTo = (to, opts) => writeRoute(to, opts);
