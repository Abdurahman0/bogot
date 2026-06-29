/* pages/system.jsx вЂ” Users, Roles, Settings, Notifications, Audit, Integrations, Help */
const { useState: sysS, useMemo: sysM } = React;

const PERMISSION_LABELS = {
  uz: {
    "dashboard.view": "Dashboardni ko'rish",
    "audit_logs.view": "Audit jurnalini ko'rish",
    "users.view": "Foydalanuvchilarni ko'rish",
    "users.manage": "Foydalanuvchilarni boshqarish",
    "clients.view": "Mijozlarni ko'rish",
    "clients.manage": "Mijozlarni boshqarish",
    "accounting.view": "Hisob-kitobni ko'rish",
    "accounting.manage": "Hisob-kitobni boshqarish",
    "products.view": "Mahsulotlarni ko'rish",
    "products.manage": "Mahsulotlarni boshqarish",
    "tasks.view": "Vazifalarni ko'rish",
    "tasks.manage": "Vazifalarni boshqarish",
    "notifications.view": "Bildirishnomalarni ko'rish",
    "notifications.manage": "Bildirishnomalarni boshqarish",
    "chats.view": "Chatlarni ko'rish",
    "chats.manage": "Chatlarni boshqarish",
    "integrations.view": "Integratsiyalarni ko'rish",
    "integrations.manage": "Integratsiyalarni boshqarish",
    "ai.view": "AI sozlamalarini ko'rish",
    "ai.manage": "AI sozlamalarini boshqarish",
  },
  ru: {
    "dashboard.view": "Просмотр дашборда",
    "audit_logs.view": "Просмотр журнала аудита",
    "users.view": "Просмотр пользователей",
    "users.manage": "Управление пользователями",
    "clients.view": "Просмотр клиентов",
    "clients.manage": "Управление клиентами",
    "accounting.view": "Просмотр учета",
    "accounting.manage": "Управление учетом",
    "products.view": "Просмотр продуктов",
    "products.manage": "Управление продуктами",
    "tasks.view": "Просмотр задач",
    "tasks.manage": "Управление задачами",
    "notifications.view": "Просмотр уведомлений",
    "notifications.manage": "Управление уведомлениями",
    "chats.view": "Просмотр чатов",
    "chats.manage": "Управление чатами",
    "integrations.view": "Просмотр интеграций",
    "integrations.manage": "Управление интеграциями",
    "ai.view": "Просмотр настроек AI",
    "ai.manage": "Управление настройками AI",
  },
  en: {
    "dashboard.view": "View dashboard",
    "audit_logs.view": "View audit log",
    "users.view": "View users",
    "users.manage": "Manage users",
    "clients.view": "View clients",
    "clients.manage": "Manage clients",
    "accounting.view": "View accounting",
    "accounting.manage": "Manage accounting",
    "products.view": "View products",
    "products.manage": "Manage products",
    "tasks.view": "View tasks",
    "tasks.manage": "Manage tasks",
    "notifications.view": "View notifications",
    "notifications.manage": "Manage notifications",
    "chats.view": "View chats",
    "chats.manage": "Manage chats",
    "integrations.view": "View integrations",
    "integrations.manage": "Manage integrations",
    "ai.view": "View AI settings",
    "ai.manage": "Manage AI settings",
  },
};

function currentSystemLang() {
  return window.__TG_LANG || "uz";
}

function permissionLabel(permissionKey) {
  const lang = currentSystemLang();
  return PERMISSION_LABELS[lang]?.[permissionKey] || PERMISSION_LABELS.uz[permissionKey] || permissionKey;
}

const USER_ROLE_OPTIONS = ["developer", "admin", "operator"];
const USER_ROLE_META = {
  developer: { color: "violet" },
  admin: { color: "red" },
  operator: { color: "blue" },
};
const USER_MODULE_LABELS = {
  uz: {
    dashboard: "Dashboard",
    audit_logs: "Audit",
    users: "Foydalanuvchilar",
    clients: "Mijozlar",
    accounting: "Hisob-kitob",
    products: "Mahsulotlar",
    tasks: "Vazifalar",
    notifications: "Bildirishnomalar",
    chats: "Chat",
    integrations: "Integratsiyalar",
    ai: "AI",
    other: "Boshqa",
  },
  ru: {
    dashboard: "Дашборд",
    audit_logs: "Аудит",
    users: "Пользователи",
    clients: "Клиенты",
    accounting: "Учет",
    products: "Продукты",
    tasks: "Задачи",
    notifications: "Уведомления",
    chats: "Чаты",
    integrations: "Интеграции",
    ai: "AI",
    other: "Другое",
  },
  en: {
    dashboard: "Dashboard",
    audit_logs: "Audit",
    users: "Users",
    clients: "Clients",
    accounting: "Accounting",
    products: "Products",
    tasks: "Tasks",
    notifications: "Notifications",
    chats: "Chats",
    integrations: "Integrations",
    ai: "AI",
    other: "Other",
  },
};

function userModuleLabel(moduleKey) {
  const lang = currentSystemLang();
  return USER_MODULE_LABELS[lang]?.[moduleKey] || USER_MODULE_LABELS.uz[moduleKey] || moduleKey;
}

function roleUiLabel(key) {
  const lang = currentSystemLang();
  return window.TRANSLATIONS?.[lang]?.[`role.${key}`] || window.TRANSLATIONS?.uz?.[`role.${key}`] || key;
}

const SYSTEM_TEXT = {
  uz: {
    system: "Tizim",
    total: "Jami",
    active: "Faol",
    inactive: "Nofaol",
    usersManageDesc: "Tizim foydalanuvchilarini boshqarish",
    usersList: "Foydalanuvchilar",
    addUser: "Foydalanuvchi qo'shish",
    allRoles: "Barcha rollar",
    allStatuses: "Barcha holatlar",
    user: "Foydalanuvchi",
    role: "Rol",
    permissions: "Ruxsatlar",
    region: "Hudud",
    added: "Qo'shilgan",
    fullAccess: "To'liq kirish",
    view: "Ko'rish",
    edit: "Tahrir",
    delete: "O'chirish",
    editUser: "Foydalanuvchini tahrirlash",
    newUser: "Yangi foydalanuvchi",
    fullName: "To'liq ism",
    newPassword: "Yangi parol",
    leaveBlank: "O'zgartirmasangiz bo'sh qoldiring",
    minEight: "Kamida 8 belgi",
    roleDefaults: "Rol defaultlari",
    clear: "Tozalash",
    developerAccessHint: "Dasturchi barcha modullarga to'liq kira oladi.",
    permissionManualHint: "Rol defaultlarini qo'llab keyin kerakli ruxsatlarni qo'lda o'zgartiring.",
    developerNoPermissionPick: "Dasturchi foydalanuvchisi uchun alohida permission tanlash kerak emas.",
    adminNoDeveloperRole: "Administrator dasturchi rolini bera olmaydi yoki olib tashlay olmaydi.",
    userDetails: "Foydalanuvchi ma'lumotlari",
    noExtraPermissions: "Qo'shimcha ruxsat topilmadi",
    developerFullAccessHint: "Dasturchi barcha bo'limlarga kirish va boshqarish huquqiga ega.",
    userDeleted: "Foydalanuvchi o'chirildi",
    deleteUser: "Foydalanuvchini o'chirish",
    deleteUserMessage: "foydalanuvchisini o'chirmoqchimisiz?",
    settingsDesc: "Live backend sozlamalari va CRM ko'rinishi",
    aiSettingsTab: "AI sozlamalari",
    appearanceTab: "Ko'rinish",
    aiConfigurations: "AI konfiguratsiyalari",
    newConfiguration: "Yangi konfiguratsiya",
    activeAi: "Faol AI",
    noActiveAi: "Faol AI topilmadi",
    noActiveAiMessage: "Backend active AI qaytarmadi.",
    themeAppearance: "Mavzu va ko'rinish",
    theme: "Mavzu",
    language: "Til",
    collapsedSidebar: "Yig'ilgan yon panel",
    editAiSetting: "AI sozlamasini tahrirlash",
    newAiSetting: "Yangi AI sozlama",
    functionCalling: "Function calling",
    systemPrompt: "System prompt",
    enabled: "Yoqilgan",
    disabled: "O'chirilgan",
    aiDeleted: "AI sozlamasi o'chirildi",
    deleteAiSetting: "AI sozlamasini o'chirish",
    deleteConfigMessage: "konfiguratsiyasini o'chirmoqchimisiz?",
    notificationsDesc: "Tizim bildirishnomalari",
    markAllReadDone: "Barchasi o'qildi deb belgilandi",
    markAllRead: "Barchasini o'qildi belgilash",
    markFailed: "Belgilanmadi",
    clearDone: "Bildirishnomalar tozalandi",
    clearFailed: "Tozalanmadi",
    unread: "O'qilmagan",
    noNotifications: "Bildirishnomalar yo'q",
    noNotificationsMessage: "Hozircha yangi bildirishnomalar yo'q",
    userAdded: "Foydalanuvchi qo'shildi",
    userUpdated: "Foydalanuvchi yangilandi",
    aiAdded: "AI sozlamasi qo'shildi",
    aiUpdated: "AI sozlamasi yangilandi",
    phoneField: "Telefon",
    nameField: "Nomi",
    countUnit: "ta",
    auditDesc: "Barcha tizim harakatlari jurnali",
    auditPanel: "Audit jurnali",
    allUsers: "Barcha foydalanuvchilar",
    colUser: "Foydalanuvchi",
    colAction: "Harakat",
    colEntity: "Ob'ekt",
    colDate: "Sana",
    recordsUnit: "ta yozuv",
    integrationsDesc: "Tashqi tizimlar va API integratsiyalari",
    apiDocs: "API hujjatlar",
    newIntegration: "Yangi konfiguratsiya",
    connectedTab: "Ulangan",
    availableTab: "Mavjud",
    backendTab: "Backend",
    connectedLabel: "Ulangan",
    noConnected: "Faol integratsiya yo'q",
    noConnectedMsg: "Backendda hali faol integratsiya sozlanmagan.",
    noAvailable: "Faol bo'lmagan integratsiya yo'q",
    noAvailableMsg: "Barcha backend konfiguratsiyalari faol yoki ro'yxat bo'sh.",
    aiSettingsPanel: "AI sozlamalari",
    intEventsPanel: "Integratsiya eventlari",
    noAiSettings: "AI sozlamalari topilmadi",
    noAiSettingsMsg: "Backend hali AI konfiguratsiya qaytarmadi.",
    noEvents: "Eventlar topilmadi",
    noEventsMsg: "Backendda integratsiya eventlari yo'q.",
    editIntegration: "Integratsiyani tahrirlash",
    newIntegrationModal: "Yangi integratsiya",
    keyLabel: "Kalit",
    valueLabel: "Qiymat",
    descLabel: "Tavsif",
    activeLabel: "Faol",
    cancelShort: "Bekor",
    intUpdated: "Integratsiya yangilandi",
    intAdded: "Integratsiya qo'shildi",
    deleteIntegration: "Integratsiyani o'chirish",
    intDeleted: "Integratsiya o'chirildi",
    editBtn: "Tahrir",
    helpDesc: "Qo'llanma va yordam markazi",
    helpSearchPlaceholder: "Savol yozing...",
    helpTitle: "Qanday yordam kerak?",
    faqTitle: "Ko'p so'raladigan savollar",
    shortcutsTitle: "Klaviatura yorliqlari",
    helpCenterTitle: "Yordam markazi",
    versionTitle: "Versiya",
    fullGuide: "To'liq qo'llanma",
    videoCourses: "Video darslar",
    support: "Qo'llab-quvvatlash",
    guideOpened: "Qo'llanma ochildi",
    videoOpened: "Video darslar ochildi",
    supportOpened: "Qo'llab-quvvatlash ochildi",
    versionLabel: "Versiya",
    releasedLabel: "Chiqarilgan",
    changesLabel: "O'zgarishlar",
    changesDesc: "AI kanallar, qarzdorlar va hisob-kitob moduli",
    systemCrumb: "Tizim",
    apiDocsOpened: "API hujjatlar ochildi",
    faq: [
      { q: "Yangi lid qanday qo'shiladi?", a: "Lidlar sahifasida 'Yangi lid' tugmasini bosing yoki QuickCreate (+) dan foydalaning. Lead'ni import (CSV) orqali ham qo'shish mumkin." },
      { q: "Kanban pipeline qanday ishlaydi?", a: "Pipeline sahifasida kartalarni drag & drop orqali ustunlar orasida siljiting. Har bir ustun lid bosqichini bildiradi." },
      { q: "AI lead saralashi qanday ishlaydi?", a: "Instagram AI va Telegram Web App foydalanuvchidan ism, telefon, kerakli quvvat va to'lov turini yig'adi. Ma'lumotlar tayyor bo'lgach lead CRM ga tushadi va operatorga biriktiriladi." },
      { q: "Qarzdorlar sahifasi nimaga xizmat qiladi?", a: "Qarzdorlar sahifasida mijozning umumiy summa, to'langan qismi, qolgan qarzi va undirish holati ko'rinadi. Excel dagi qarzdorlik daftarlari shu modulga mos keladi." },
      { q: "Ruxsatlar qanday belgilanadi?", a: "Ruxsatlar foydalanuvchilar sahifasida belgilanadi. Dasturchi barcha ruxsatlarni boshqaradi, administrator esa o'zi boshqara oladigan foydalanuvchilarga ruxsat beradi yoki olib tashlaydi." },
      { q: "Excel eksport qanday amalga oshiriladi?", a: "Mijozlar va qarzdorlar sahifasida 'Excel' tugmasi mavjud. U backend tayyorlagan haqiqiy .xlsx faylni yuklab beradi." },
      { q: "Instagram/Telegram AI qanday ulanadi?", a: "Integratsiyalar sahifasida Instagram yoki Telegram'ni tanlang va 'Ulash' tugmasini bosing. Webhook URL va API kalitlarni mos bo'limga kiriting." },
      { q: "Hisob-kitob sahifasi nimani ko'rsatadi?", a: "Hisob-kitob sahifasida kundalik kirim-chiqim, to'lov turi, kategoriya va yakuniy balans ko'rinadi. Bu modul kunlik moliyaviy nazorat uchun ishlatiladi." },
    ],
    shortcuts: [["Alt + N", "Yangi lid"], ["Alt + T", "Yangi vazifa"], ["/", "Qidiruv (Command palette)"], ["Alt + D", "Dashboard"], ["Alt + P", "Jarayon"], ["Alt + I", "Chat"]],
  },
  ru: {
    system: "Система",
    total: "Всего",
    active: "Активные",
    inactive: "Неактивные",
    usersManageDesc: "Управление пользователями системы",
    usersList: "Пользователи",
    addUser: "Добавить пользователя",
    allRoles: "Все роли",
    allStatuses: "Все статусы",
    user: "Пользователь",
    role: "Роль",
    permissions: "Права",
    region: "Регион",
    added: "Добавлен",
    fullAccess: "Полный доступ",
    view: "Просмотр",
    edit: "Изменить",
    delete: "Удалить",
    editUser: "Редактировать пользователя",
    newUser: "Новый пользователь",
    fullName: "Полное имя",
    newPassword: "Новый пароль",
    leaveBlank: "Оставьте пустым, если не меняете",
    minEight: "Минимум 8 символов",
    roleDefaults: "Права по роли",
    clear: "Очистить",
    developerAccessHint: "Разработчик имеет полный доступ ко всем модулям.",
    permissionManualHint: "Сначала примените права роли, затем при необходимости настройте их вручную.",
    developerNoPermissionPick: "Для разработчика не нужно отдельно выбирать права.",
    adminNoDeveloperRole: "Администратор не может выдать или снять роль разработчика.",
    userDetails: "Данные пользователя",
    noExtraPermissions: "Дополнительные права не найдены",
    developerFullAccessHint: "Разработчик имеет право входа и управления всеми разделами.",
    userDeleted: "Пользователь удален",
    deleteUser: "Удалить пользователя",
    deleteUserMessage: "Удалить этого пользователя?",
    settingsDesc: "Настройки live backend и внешний вид CRM",
    aiSettingsTab: "Настройки AI",
    appearanceTab: "Внешний вид",
    aiConfigurations: "Конфигурации AI",
    newConfiguration: "Новая конфигурация",
    activeAi: "Активный AI",
    noActiveAi: "Активный AI не найден",
    noActiveAiMessage: "Backend не вернул active AI.",
    themeAppearance: "Тема и внешний вид",
    theme: "Тема",
    language: "Язык",
    collapsedSidebar: "Свернутая боковая панель",
    editAiSetting: "Редактировать настройки AI",
    newAiSetting: "Новая настройка AI",
    functionCalling: "Function calling",
    systemPrompt: "System prompt",
    enabled: "Включено",
    disabled: "Отключено",
    aiDeleted: "Настройка AI удалена",
    deleteAiSetting: "Удалить настройку AI",
    deleteConfigMessage: "Удалить эту конфигурацию?",
    notificationsDesc: "Системные уведомления",
    markAllReadDone: "Все уведомления отмечены как прочитанные",
    markAllRead: "Отметить все как прочитанные",
    markFailed: "Не удалось отметить",
    clearDone: "Уведомления очищены",
    clearFailed: "Не удалось очистить",
    unread: "Непрочитанные",
    noNotifications: "Уведомлений нет",
    noNotificationsMessage: "Новых уведомлений пока нет",
    userAdded: "Пользователь добавлен",
    userUpdated: "Пользователь обновлён",
    aiAdded: "Настройка AI добавлена",
    aiUpdated: "Настройка AI обновлена",
    phoneField: "Телефон",
    nameField: "Название",
    countUnit: "шт",
    auditDesc: "Журнал всех действий системы",
    auditPanel: "Журнал аудита",
    allUsers: "Все пользователи",
    colUser: "Пользователь",
    colAction: "Действие",
    colEntity: "Объект",
    colDate: "Дата",
    recordsUnit: "записей",
    integrationsDesc: "Внешние системы и API интеграции",
    apiDocs: "API документация",
    newIntegration: "Новая конфигурация",
    connectedTab: "Подключено",
    availableTab: "Доступные",
    backendTab: "Backend",
    connectedLabel: "Подключено",
    noConnected: "Нет активных интеграций",
    noConnectedMsg: "В backend ещё нет активных интеграций.",
    noAvailable: "Нет неактивных интеграций",
    noAvailableMsg: "Все конфигурации backend активны или список пуст.",
    aiSettingsPanel: "Настройки AI",
    intEventsPanel: "События интеграции",
    noAiSettings: "Настройки AI не найдены",
    noAiSettingsMsg: "Backend не вернул конфигурацию AI.",
    noEvents: "События не найдены",
    noEventsMsg: "В backend нет событий интеграции.",
    editIntegration: "Редактировать интеграцию",
    newIntegrationModal: "Новая интеграция",
    keyLabel: "Ключ",
    valueLabel: "Значение",
    descLabel: "Описание",
    activeLabel: "Активный",
    cancelShort: "Отмена",
    intUpdated: "Интеграция обновлена",
    intAdded: "Интеграция добавлена",
    deleteIntegration: "Удалить интеграцию",
    intDeleted: "Интеграция удалена",
    editBtn: "Изменить",
    helpDesc: "Руководство и центр помощи",
    helpSearchPlaceholder: "Введите вопрос...",
    helpTitle: "Какая помощь нужна?",
    faqTitle: "Часто задаваемые вопросы",
    shortcutsTitle: "Горячие клавиши",
    helpCenterTitle: "Центр помощи",
    versionTitle: "Версия",
    fullGuide: "Полное руководство",
    videoCourses: "Видеоуроки",
    support: "Поддержка",
    guideOpened: "Руководство открыто",
    videoOpened: "Видеоуроки открыты",
    supportOpened: "Поддержка открыта",
    versionLabel: "Версия",
    releasedLabel: "Выпущено",
    changesLabel: "Изменения",
    changesDesc: "Каналы AI, должники и модуль расчётов",
    systemCrumb: "Система",
    apiDocsOpened: "API документация открыта",
    faq: [
      { q: "Как добавить нового лида?", a: "На странице лидов нажмите кнопку 'Новый лид' или используйте QuickCreate (+). Лидов также можно импортировать через CSV." },
      { q: "Как работает Kanban pipeline?", a: "На странице Pipeline перетаскивайте карточки между столбцами. Каждый столбец представляет этап лида." },
      { q: "Как работает AI-сортировка лидов?", a: "Instagram AI и Telegram Web App собирают от пользователя имя, телефон, нужную мощность и тип оплаты. Когда данные готовы, лид попадает в CRM и назначается оператору." },
      { q: "Для чего нужна страница должников?", a: "На странице должников видны общая сумма клиента, оплаченная часть, остаток долга и статус взыскания. Книги долгов из Excel соответствуют этому модулю." },
      { q: "Как назначаются права доступа?", a: "Права назначаются на странице пользователей. Разработчик управляет всеми правами, администратор — только теми пользователями, которыми он управляет." },
      { q: "Как работает экспорт в Excel?", a: "На страницах клиентов и должников есть кнопка 'Excel'. Она скачивает настоящий .xlsx файл, подготовленный backend." },
      { q: "Как подключить Instagram/Telegram AI?", a: "На странице интеграций выберите Instagram или Telegram и нажмите 'Подключить'. Введите Webhook URL и API ключи в соответствующем разделе." },
      { q: "Что показывает страница расчётов?", a: "На странице расчётов видны ежедневные приходы и расходы, тип оплаты, категория и итоговый баланс. Этот модуль используется для ежедневного финансового контроля." },
    ],
    shortcuts: [["Alt + N", "Новый лид"], ["Alt + T", "Новая задача"], ["/", "Поиск (Command palette)"], ["Alt + D", "Дашборд"], ["Alt + P", "Воронка"], ["Alt + I", "Чат"]],
  },
  en: {
    system: "System",
    total: "Total",
    active: "Active",
    inactive: "Inactive",
    usersManageDesc: "Manage system users",
    usersList: "Users",
    addUser: "Add user",
    allRoles: "All roles",
    allStatuses: "All statuses",
    user: "User",
    role: "Role",
    permissions: "Permissions",
    region: "Region",
    added: "Added",
    fullAccess: "Full access",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    editUser: "Edit user",
    newUser: "New user",
    fullName: "Full name",
    newPassword: "New password",
    leaveBlank: "Leave blank if unchanged",
    minEight: "At least 8 characters",
    roleDefaults: "Role defaults",
    clear: "Clear",
    developerAccessHint: "Developers have full access to all modules.",
    permissionManualHint: "Apply role defaults first, then adjust permissions manually if needed.",
    developerNoPermissionPick: "No separate permission selection is needed for developer users.",
    adminNoDeveloperRole: "Admins cannot grant or remove the developer role.",
    userDetails: "User details",
    noExtraPermissions: "No extra permissions found",
    developerFullAccessHint: "Developers can access and manage every section.",
    userDeleted: "User deleted",
    deleteUser: "Delete user",
    deleteUserMessage: "Delete this user?",
    settingsDesc: "Live backend settings and CRM appearance",
    aiSettingsTab: "AI settings",
    appearanceTab: "Appearance",
    aiConfigurations: "AI configurations",
    newConfiguration: "New configuration",
    activeAi: "Active AI",
    noActiveAi: "No active AI found",
    noActiveAiMessage: "The backend did not return an active AI.",
    themeAppearance: "Theme and appearance",
    theme: "Theme",
    language: "Language",
    collapsedSidebar: "Collapsed sidebar",
    editAiSetting: "Edit AI setting",
    newAiSetting: "New AI setting",
    functionCalling: "Function calling",
    systemPrompt: "System prompt",
    enabled: "Enabled",
    disabled: "Disabled",
    aiDeleted: "AI setting deleted",
    deleteAiSetting: "Delete AI setting",
    deleteConfigMessage: "Delete this configuration?",
    notificationsDesc: "System notifications",
    markAllReadDone: "All notifications marked as read",
    markAllRead: "Mark all as read",
    markFailed: "Marking failed",
    clearDone: "Notifications cleared",
    clearFailed: "Clearing failed",
    unread: "Unread",
    noNotifications: "No notifications",
    noNotificationsMessage: "There are no new notifications yet",
    userAdded: "User added",
    userUpdated: "User updated",
    aiAdded: "AI setting added",
    aiUpdated: "AI setting updated",
    phoneField: "Phone",
    nameField: "Name",
    countUnit: "pcs",
    auditDesc: "All system actions log",
    auditPanel: "Audit log",
    allUsers: "All users",
    colUser: "User",
    colAction: "Action",
    colEntity: "Entity",
    colDate: "Date",
    recordsUnit: "records",
    integrationsDesc: "External systems and API integrations",
    apiDocs: "API docs",
    newIntegration: "New configuration",
    connectedTab: "Connected",
    availableTab: "Available",
    backendTab: "Backend",
    connectedLabel: "Connected",
    noConnected: "No active integrations",
    noConnectedMsg: "No active integrations configured in backend yet.",
    noAvailable: "No inactive integrations",
    noAvailableMsg: "All backend configurations are active or the list is empty.",
    aiSettingsPanel: "AI settings",
    intEventsPanel: "Integration events",
    noAiSettings: "No AI settings found",
    noAiSettingsMsg: "The backend hasn't returned AI configuration yet.",
    noEvents: "No events found",
    noEventsMsg: "No integration events in backend.",
    editIntegration: "Edit integration",
    newIntegrationModal: "New integration",
    keyLabel: "Key",
    valueLabel: "Value",
    descLabel: "Description",
    activeLabel: "Active",
    cancelShort: "Cancel",
    intUpdated: "Integration updated",
    intAdded: "Integration added",
    deleteIntegration: "Delete integration",
    intDeleted: "Integration deleted",
    editBtn: "Edit",
    helpDesc: "Guide and help center",
    helpSearchPlaceholder: "Type a question...",
    helpTitle: "How can we help?",
    faqTitle: "Frequently asked questions",
    shortcutsTitle: "Keyboard shortcuts",
    helpCenterTitle: "Help center",
    versionTitle: "Version",
    fullGuide: "Full guide",
    videoCourses: "Video tutorials",
    support: "Support",
    guideOpened: "Guide opened",
    videoOpened: "Video tutorials opened",
    supportOpened: "Support opened",
    versionLabel: "Version",
    releasedLabel: "Released",
    changesLabel: "Changes",
    changesDesc: "AI channels, debtors and accounting module",
    systemCrumb: "System",
    apiDocsOpened: "API docs opened",
    faq: [
      { q: "How do I add a new lead?", a: "On the Leads page, click the 'New lead' button or use QuickCreate (+). You can also import leads via CSV." },
      { q: "How does the Kanban pipeline work?", a: "On the Pipeline page, drag and drop cards between columns. Each column represents a lead stage." },
      { q: "How does AI lead sorting work?", a: "Instagram AI and Telegram Web App collect the user's name, phone, required power, and payment type. Once data is ready, the lead appears in the CRM and is assigned to an operator." },
      { q: "What is the Debtors page for?", a: "The Debtors page shows the client's total amount, paid portion, remaining debt, and collection status. Debt ledgers from Excel correspond to this module." },
      { q: "How are permissions assigned?", a: "Permissions are set on the Users page. Developers manage all permissions; administrators manage permissions for users they oversee." },
      { q: "How does Excel export work?", a: "The Customers and Debtors pages have an 'Excel' button. It downloads a real .xlsx file prepared by the backend." },
      { q: "How do I connect Instagram/Telegram AI?", a: "On the Integrations page, select Instagram or Telegram and click 'Connect'. Enter the Webhook URL and API keys in the appropriate section." },
      { q: "What does the Accounting page show?", a: "The Accounting page shows daily income and expenses, payment type, category, and final balance. This module is used for daily financial control." },
    ],
    shortcuts: [["Alt + N", "New lead"], ["Alt + T", "New task"], ["/", "Search (Command palette)"], ["Alt + D", "Dashboard"], ["Alt + P", "Pipeline"], ["Alt + I", "Chat"]],
  },
};

function sx(key) {
  const lang = currentSystemLang();
  return SYSTEM_TEXT[lang]?.[key] || SYSTEM_TEXT.uz[key] || key;
}

function permissionCode(permission) {
  if (typeof permission === "string") return permission;
  if (!permission || typeof permission !== "object") return "";
  return permission.key || permission.code || permission.permission_code || permission.codename || permission.name || "";
}

function permissionModule(permission) {
  if (permission && typeof permission === "object" && permission.module) return permission.module;
  const code = permissionCode(permission);
  return code.includes(".") ? code.split(".")[0] : "other";
}

function permissionName(permission) {
  const code = permissionCode(permission);
  const mapped = permissionLabel(code);
  if (mapped) return mapped;
  if (permission && typeof permission === "object") {
    const directLabel = permission.label || permission.title || permission.description;
    if (directLabel) return directLabel;
    if (permission.name && permission.name !== code) return permission.name;
    return code;
  }
  return permissionLabel(code);
}

function normalizePermissionCodes(items) {
  return [...new Set((items || []).map(permissionCode).filter(Boolean))];
}

function buildPermissionCatalog(data) {
  const fromBackend = data.permissionsAll?.length ? data.permissionsAll : data.permissions || [];
  if (fromBackend.length) {
    return fromBackend
      .map((permission) => {
        const code = permissionCode(permission);
        if (!code) return null;
        return {
          code,
          module: permissionModule(permission),
          label: permissionName(permission),
        };
      })
      .filter(Boolean);
  }
  return Object.keys(PERMISSION_LABELS.uz).map((code) => ({
    code,
    module: permissionModule(code),
    label: permissionLabel(code),
  }));
}

function groupedPermissionCatalog(catalog) {
  return Object.entries(
    (catalog || []).reduce((acc, permission) => {
      const moduleKey = permission.module || "other";
      if (!acc[moduleKey]) acc[moduleKey] = [];
      acc[moduleKey].push(permission);
      return acc;
    }, {})
  )
    .sort((a, b) => userModuleLabel(a[0]).localeCompare(userModuleLabel(b[0]), "uz"))
    .map(([moduleKey, permissions]) => [moduleKey, permissions.sort((a, b) => a.label.localeCompare(b.label, "uz"))]);
}

function roleKey(role) {
  if (typeof role === "string") return role;
  if (!role || typeof role !== "object") return "";
  return role.key || role.code || role.name || "";
}

function roleLabel(role) {
  const key = roleKey(role);
  return roleUiLabel(key) || role?.label || key;
}

function roleDefaultPermissions(roleValue, roles) {
  const target = (roles || []).find((role) => roleKey(role) === roleValue);
  return normalizePermissionCodes(target?.default_permissions || []);
}

function canManageDeveloper(currentRole) {
  return currentRole === "developer";
}

function canManageTargetUser(currentUser, targetUser) {
  const currentRole = currentUser?.rawRole || currentUser?.role || "operator";
  const targetRole = targetUser?.rawRole || targetUser?.role || "operator";
  if (currentRole === "developer") return true;
  if (currentRole === "admin") return targetRole !== "developer";
  return false;
}

/* ======= USERS ======= */
function UsersPage() {
  const { data, t, upsert, remove, toast } = useApp();
  const loading = useLoading(420);
  const [q, setQ] = sysS("");
  const [roleFilter, setRoleFilter] = sysS("all");
  const [statusFilter, setStatusFilter] = sysS("all");
  const [addOpen, setAddOpen] = sysS(false);
  const [editUser, setEditUser] = sysS(null);
  const [viewUser, setViewUser] = sysS(null);
  const [deleteUser, setDeleteUser] = sysS(null);
  const [viewPermissions, setViewPermissions] = sysS([]);
  const [form, setForm] = sysS({ fullName: "", email: "", phone: "", role: "operator", region: "", status: "active", password: "", permissions: [] });
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const currentUser = data.authUser || null;
  const currentRole = currentUser?.rawRole || currentUser?.role || "operator";
  const myPermissionCodes = normalizePermissionCodes(currentUser?.permissions || []);
  const canManageUsers = currentRole === "developer" || myPermissionCodes.includes("users.manage");
  const permissionCatalog = sysM(() => buildPermissionCatalog(data), [data.permissionsAll, data.permissions]);
  const ADMIN_BLOCKED_MODULES = new Set(["audit_logs", "integrations"]);
  const permissionGroups = sysM(() => {
    const groups = groupedPermissionCatalog(permissionCatalog);
    return currentRole === "admin" ? groups.filter(([moduleKey]) => !ADMIN_BLOCKED_MODULES.has(moduleKey)) : groups;
  }, [permissionCatalog, currentRole]);
  const roleCatalog = sysM(() => {
    const backendRoles = (data.roles || []).map((role) => ({ ...role, key: roleKey(role), label: roleLabel(role) })).filter((role) => role.key);
    if (backendRoles.length) return backendRoles;
    return USER_ROLE_OPTIONS.map((role) => ({ key: role, label: roleUiLabel(role), default_permissions: [] }));
  }, [data.roles]);
  const availableRoleOptions = sysM(
    () => roleCatalog.filter((role) => canManageDeveloper(currentRole) || role.key !== "developer"),
    [roleCatalog, currentRole]
  );
  const permissionLabelMap = sysM(
    () => Object.fromEntries(permissionCatalog.map((permission) => [permission.code, permission.label])),
    [permissionCatalog]
  );

  React.useEffect(() => {
    if (!viewUser?.id) return;
    apiLoadUserPermissions(viewUser.id)
      .then((permissions) => setViewPermissions(normalizePermissionCodes(permissions)))
      .catch(() => setViewPermissions(normalizePermissionCodes(viewUser.permissions || [])));
  }, [viewUser?.id]);

  const hasRegionField = sysM(
    () => data.users.some((u) => Object.prototype.hasOwnProperty.call(u || {}, "region")),
    [data.users]
  );

  const filtered = sysM(() => data.users.filter(u =>
    (roleFilter === "all" || u.role === roleFilter) &&
    (statusFilter === "all" || u.status === statusFilter) &&
    (!q || u.fullName.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))
  ), [data.users, roleFilter, statusFilter, q]);

  const resetForm = React.useCallback(() => {
    const defaultRole = availableRoleOptions[0]?.key || "operator";
    setForm({ fullName: "", email: "", phone: "", role: defaultRole, region: "", status: "active", password: "", permissions: roleDefaultPermissions(defaultRole, roleCatalog) });
  }, [availableRoleOptions, roleCatalog]);

  const openEdit = (u) => {
    setEditUser(u);
    setForm({
      fullName: u.fullName,
      email: u.email,
      phone: u.phone,
      role: u.rawRole || u.role,
      region: u.region || "",
      status: u.status,
      password: "",
      permissions: normalizePermissionCodes(u.permissions || []),
    });
    setAddOpen(true);
  };

  const openCreate = () => {
    setEditUser(null);
    resetForm();
    setAddOpen(true);
  };

  const togglePermission = (code) => {
    setForm((current) => {
      const existing = new Set(normalizePermissionCodes(current.permissions));
      if (existing.has(code)) existing.delete(code);
      else existing.add(code);
      return { ...current, permissions: [...existing] };
    });
  };

  const applyRoleDefaults = () => {
    if (form.role === "developer") return;
    setF("permissions", roleDefaultPermissions(form.role, roleCatalog));
  };

  const saveUser = async () => {
    const nextRegion = String(form.region || "").trim();
    const nextPermissions = form.role === "developer" ? [] : normalizePermissionCodes(form.permissions);
    const payload = editUser
      ? { ...editUser, ...form, permissions: nextPermissions, rawRole: form.role, ...(hasRegionField ? { region: nextRegion } : {}) }
      : { id: "U" + Date.now(), ...form, permissions: nextPermissions, rawRole: form.role, ...(hasRegionField ? { region: nextRegion } : {}), avatarHue: Math.random() * 360, createdAt: new Date().toISOString(), completedSales: 0, activeLeads: 0 };
    await upsert("users", payload);
    toast(editUser ? sx("userUpdated") : sx("userAdded"));
    setAddOpen(false);
    setEditUser(null);
    resetForm();
  };

  const stats = sysM(() => ({
    total: data.users.length,
    active: data.users.filter(u => u.status === "active").length,
    byRole: Object.fromEntries(USER_ROLE_OPTIONS.map(r => [r, data.users.filter(u => u.role === r).length])),
  }), [data.users]);

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.users")} desc={sx("usersManageDesc")} crumbs={[{ label: sx("system") }, { label: t("page.users") }]}
        actions={canManageUsers ? <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={openCreate}>{sx("addUser")}</Button> : null} />

      <div className="grid-kpi" style={{ marginBottom: 22 }}>
        <StatTile label={sx("total")} value={stats.total} />
        <StatTile label={sx("active")} value={stats.active} color="green" />
        {USER_ROLE_OPTIONS.map(r => <StatTile key={r} label={roleUiLabel(r)} value={stats.byRole[r]} color={USER_ROLE_META[r].color} />)}
      </div>

      <Panel title={sx("usersList")} icon="users" color="accent" pad={false}
        action={<div style={{ display: "flex", gap: 10 }}>
          <SearchInput value={q} onChange={setQ} placeholder={t("common.search")} width={200} />
          <FilterSelect value={roleFilter} onChange={setRoleFilter} options={[{ value: "all", label: sx("allRoles") }, ...USER_ROLE_OPTIONS.map(r => ({ value: r, label: roleUiLabel(r) }))]} />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={[{ value: "all", label: sx("allStatuses") }, { value: "active", label: sx("active") }, { value: "inactive", label: sx("inactive") }]} />
        </div>}>
        {loading ? <SkeletonRows rows={10} cols={7} /> : (
          <div className="tg-table-wrap">
            <table className="tg-table">
              <thead><tr><th>{sx("user")}</th><th>{sx("role")}</th><th>{sx("permissions")}</th>{hasRegionField && <th>{sx("region")}</th>}<th>{t("common.status")}</th><th>{sx("added")}</th><th></th></tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={u.fullName} hue={u.avatarHue} size={32} /><div><div className="tg-cell-strong">{u.fullName}</div><div className="tg-cell-sub">{u.email}</div></div></div></td>
                    <td><Badge color={USER_ROLE_META[u.role]?.color || "slate"}>{roleUiLabel(u.role)}</Badge></td>
                    <td>
                      {u.role === "developer"
                        ? <Badge color="violet" size="sm">{sx("fullAccess")}</Badge>
                        : <Badge color="blue" size="sm">{normalizePermissionCodes(u.permissions || []).length} {sx("countUnit")}</Badge>}
                    </td>
                    {hasRegionField && <td>{u.region || "-"}</td>}
                    <td><StatusBadge status={u.status === "active" ? "active" : "inactive"} label={u.status === "active" ? sx("active") : sx("inactive")} /></td>
                    <td className="tg-cell-sub">{fmtDate(u.createdAt)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <IconButton icon={<I.eye size={15} />} label={sx("view")} onClick={() => setViewUser(u)} />
                        {canManageUsers && canManageTargetUser(currentUser, u) ? <IconButton icon={<I.edit size={15} />} label={sx("edit")} onClick={() => openEdit(u)} /> : null}
                        {canManageUsers && canManageTargetUser(currentUser, u) && u.id !== currentUser?.id ? <IconButton icon={<I.trash size={15} />} label={sx("delete")} onClick={() => setDeleteUser(u)} /> : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Modal open={addOpen} onClose={() => { setAddOpen(false); setEditUser(null); }} title={editUser ? sx("editUser") : sx("newUser")} icon={<I.user size={18} />} width={920}
        footer={<><Button variant="ghost" onClick={() => { setAddOpen(false); setEditUser(null); }}>{t("common.cancel")}</Button><Button variant="primary" onClick={saveUser}>{editUser ? t("common.save") : t("common.add")}</Button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(320px, .9fr)", gap: 18 }}>
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 18, background: "var(--surface-2)" }}>
              <div style={{ display: "grid", gap: 14 }}>
                <Field label={sx("fullName")} required><Input value={form.fullName} onChange={e => setF("fullName", e.target.value)} placeholder="Aziz Karimov" /></Field>
                <Field label="Email" required><Input value={form.email} onChange={e => setF("email", e.target.value)} placeholder="aziz@bogotarmadanrg.uz" type="email" /></Field>
                <Field label="Telefon"><Input value={form.phone} onChange={e => setF("phone", e.target.value)} placeholder="+998 90 123 45 67" /></Field>
                <Field label={editUser ? sx("newPassword") : t("common.password")} hint={editUser ? sx("leaveBlank") : undefined}><Input value={form.password} onChange={e => setF("password", e.target.value)} type="password" placeholder={editUser ? sx("newPassword") : sx("minEight")} /></Field>
              </div>
            </div>

            <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 18, background: "var(--surface-2)" }}>
              <div style={{ display: "grid", gridTemplateColumns: hasRegionField ? "1fr 1fr" : "1fr", gap: 14 }}>
                <Field label={sx("role")}>
                  <Select
                    value={form.role}
                    onChange={(value) => setForm((current) => ({ ...current, role: value, permissions: value === "developer" ? [] : current.permissions }))}
                    options={availableRoleOptions.map((role) => ({ value: role.key, label: role.label }))}
                  />
                </Field>
                {hasRegionField ? <Field label={sx("region")}><Select value={form.region} onChange={v => setF("region", v)} options={["Toshkent", "Samarqand", "Namangan", "Andijon", "Farg'ona"].map(r => ({ value: r, label: r }))} /></Field> : null}
              </div>
              <div style={{ marginTop: 14 }}>
                <Field label={t("common.status")}><Select value={form.status} onChange={v => setF("status", v)} options={[{ value: "active", label: sx("active") }, { value: "inactive", label: sx("inactive") }]} /></Field>
              </div>
            </div>
          </div>

          <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 18, background: "var(--surface-2)", minHeight: 420 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
              <div>
                <div className="tg-section-title" style={{ marginBottom: 4 }}>{sx("permissions")}</div>
                <div className="tg-cell-sub">{form.role === "developer" ? sx("developerAccessHint") : sx("permissionManualHint")}</div>
              </div>
              {form.role !== "developer" ? <div style={{ display: "flex", gap: 8 }}>
                <Button variant="soft" size="sm" onClick={applyRoleDefaults}>{sx("roleDefaults")}</Button>
                <Button variant="ghost" size="sm" onClick={() => setF("permissions", [])}>{sx("clear")}</Button>
              </div> : null}
            </div>

            {form.role === "developer" ? (
              <div style={{ display: "grid", placeItems: "center", minHeight: 300, borderRadius: 16, border: "1px dashed var(--border)", background: "color-mix(in srgb, var(--violet) 10%, var(--surface-2))", textAlign: "center", padding: 20 }}>
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "center" }}><Badge color="violet">{sx("fullAccess")}</Badge></div>
                  <div style={{ fontWeight: 700 }}>{sx("developerNoPermissionPick")}</div>
                  <div className="tg-cell-sub">{sx("adminNoDeveloperRole")}</div>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12, maxHeight: 520, overflowY: "auto", paddingRight: 4 }}>
                {permissionGroups.map(([moduleKey, permissions]) => (
                  <div key={moduleKey} style={{ border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)", padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
                      <div style={{ fontWeight: 700 }}>{userModuleLabel(moduleKey)}</div>
                      <Badge color="slate" size="sm">{permissions.filter((permission) => form.permissions.includes(permission.code)).length}/{permissions.length}</Badge>
                    </div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {permissions.map((permission) => {
                        const active = form.permissions.includes(permission.code);
                        return (
                          <button
                            key={permission.code}
                            type="button"
                            onClick={() => togglePermission(permission.code)}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              gap: 12,
                              padding: "11px 12px",
                              borderRadius: 12,
                              border: `1px solid ${active ? "var(--accent)" : "var(--border)"}`,
                              background: active ? "var(--accent-soft)" : "var(--surface-2)",
                              color: active ? "var(--accent)" : "var(--text)",
                              cursor: "pointer",
                              textAlign: "left",
                              fontWeight: active ? 650 : 560,
                            }}
                          >
                            <span>{permission.label}</span>
                            {active ? <I.checkCircle size={16} /> : <I.plus size={15} style={{ color: "var(--text-3)" }} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Modal>
      <Modal open={!!viewUser} onClose={() => setViewUser(null)} title={sx("userDetails")} icon={<I.user size={18} />} width={720}
        footer={<>
          <Button variant="ghost" onClick={() => setViewUser(null)}>{t("common.cancel")}</Button>
          {canManageUsers && viewUser && canManageTargetUser(currentUser, viewUser) ? <Button variant="soft" icon={<I.edit size={14} />} onClick={() => {
            const current = viewUser;
            setViewUser(null);
            openEdit(current);
          }}>{sx("edit")}</Button> : null}
        </>}>
        {viewUser && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, .95fr) minmax(280px, 1.05fr)", gap: 16 }}>
            <div className="tg-meta" style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 18, background: "var(--surface-2)" }}>
              <div className="tg-meta-row"><span className="tg-meta-k">{sx("user")}</span><span className="tg-meta-v">{viewUser.fullName}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Email</span><span className="tg-meta-v">{viewUser.email}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">{sx("phoneField")}</span><span className="tg-meta-v">{viewUser.phone}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">{sx("role")}</span><span className="tg-meta-v"><Badge color={USER_ROLE_META[viewUser.role]?.color || "slate"}>{roleUiLabel(viewUser.role)}</Badge></span></div>
              {hasRegionField && viewUser.region ? <div className="tg-meta-row"><span className="tg-meta-k">{sx("region")}</span><span className="tg-meta-v">{viewUser.region}</span></div> : null}
              <div className="tg-meta-row"><span className="tg-meta-k">{t("common.status")}</span><span className="tg-meta-v"><StatusBadge status={viewUser.status === "active" ? "active" : "inactive"} label={viewUser.status === "active" ? sx("active") : sx("inactive")} /></span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">{sx("added")}</span><span className="tg-meta-v">{fmtDate(viewUser.createdAt)}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Username</span><span className="tg-meta-v">{viewUser.username || "-"}</span></div>
            </div>

            <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 18, background: "var(--surface-2)" }}>
              <div className="tg-section-title" style={{ marginBottom: 10 }}>{sx("permissions")}</div>
              {viewUser.role === "developer" ? (
                <div style={{ display: "grid", gap: 10 }}>
                  <Badge color="violet" size="sm">{sx("fullAccess")}</Badge>
                  <div className="tg-cell-sub">{sx("developerFullAccessHint")}</div>
                </div>
              ) : (viewPermissions || []).length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {viewPermissions.map((permission) => <Badge key={permission} color="blue" size="sm">{permissionLabelMap[permission] || permissionLabel(permission)}</Badge>)}
                </div>
              ) : (
                <div className="tg-cell-sub">{sx("noExtraPermissions")}</div>
              )}
            </div>
          </div>
        )}
      </Modal>
      <ConfirmDialog
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={async () => {
          await remove("users", deleteUser.id);
          toast(sx("userDeleted"));
          setDeleteUser(null);
        }}
        title={sx("deleteUser")}
        message={currentSystemLang() === "uz" ? `"${deleteUser?.fullName || ""}" ${sx("deleteUserMessage")}` : sx("deleteUserMessage")}
        details={deleteUser ? `Email: ${deleteUser.email}\n${sx("role")}: ${roleUiLabel(deleteUser.role)}` : ""}
        confirmLabel={sx("delete")}
        danger
      />
    </div>
  );
}

/* ======= SETTINGS ======= */
function SettingsPage() {
  const { data, t, theme, setTheme, lang, setLang, sidebarCollapsed, setSidebarCollapsed, upsert, remove, toast } = useApp();
  const [tab, setTab] = sysS("ai");
  const [aiModalOpen, setAiModalOpen] = sysS(false);
  const [editAi, setEditAi] = sysS(null);
  const [deleteAi, setDeleteAi] = sysS(null);
  const [aiForm, setAiForm] = sysS({ name: "", model: "", temperature: 0.7, system_prompt: "", function_calling_enabled: true, is_active: false });
  const setAiField = (k, v) => setAiForm(f => ({ ...f, [k]: v }));
  const resetAiForm = () => setAiForm({ name: "", model: "", temperature: 0.7, system_prompt: "", function_calling_enabled: true, is_active: false });
  const activeAiMap = Object.fromEntries((data.activeAiSettings || []).map((row) => [row.id || row.name, true]));

  const openAiCreate = () => { setEditAi(null); resetAiForm(); setAiModalOpen(true); };
  const openAiEdit = (setting) => {
    setEditAi(setting);
    setAiForm({
      name: setting.name || "",
      model: setting.model || "",
      temperature: setting.temperature ?? 0.7,
      system_prompt: setting.system_prompt || setting.systemPrompt || "",
      function_calling_enabled: !!(setting.function_calling_enabled ?? setting.functionCallingEnabled),
      is_active: !!setting.is_active,
    });
    setAiModalOpen(true);
  };
  const saveAiSetting = async () => {
    await upsert("aiSettings", { ...editAi, ...aiForm, temperature: Number(aiForm.temperature || 0) });
    toast(editAi ? sx("aiUpdated") : sx("aiAdded"));
    setAiModalOpen(false);
    setEditAi(null);
    resetAiForm();
  };

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.settings")} desc={sx("settingsDesc")} crumbs={[{ label: sx("system") }, { label: t("page.settings") }]} />

      <div style={{ marginBottom: 18 }}>
        <Tabs tabs={[{ value: "ai", label: sx("aiSettingsTab") }, { value: "appearance", label: sx("appearanceTab") }]} active={tab} onChange={setTab} />
      </div>

      {tab === "ai" && (
        <div className="grid-dash">
          <Panel title={sx("aiConfigurations")} icon="robot" color="amber" pad={false}
            action={<Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={openAiCreate}>{sx("newConfiguration")}</Button>}>
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead><tr><th>{sx("nameField")}</th><th>Model</th><th>Temperature</th><th>{sx("active")}</th><th>{sx("functionCalling")}</th><th></th></tr></thead>
                <tbody>
                  {(data.aiSettings || []).map((setting) => (
                    <tr key={setting.id}>
                      <td className="tg-cell-strong">{setting.name}</td>
                      <td>{setting.model}</td>
                      <td>{setting.temperature}</td>
                      <td>{setting.is_active || activeAiMap[setting.id || setting.name] ? <Badge color="green" size="sm">{sx("active")}</Badge> : <Badge color="slate" size="sm">{sx("inactive")}</Badge>}</td>
                      <td>{setting.function_calling_enabled || setting.functionCallingEnabled ? <Badge color="blue" size="sm">{sx("enabled")}</Badge> : <Badge color="slate" size="sm">{sx("disabled")}</Badge>}</td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <IconButton icon={<I.edit size={15} />} label={sx("edit")} onClick={() => openAiEdit(setting)} />
                          <IconButton icon={<I.trash size={15} />} label={sx("delete")} onClick={() => setDeleteAi(setting)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
          <Panel title={sx("activeAi")} icon="sparkle" color="violet">
            {(data.activeAiSettings || []).length ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(data.activeAiSettings || []).map((setting) => <Badge key={setting.id || setting.name} color="violet" size="sm">{setting.name || setting.model || setting.id}</Badge>)}
              </div>
            ) : (
              <EmptyState icon={<I.robot size={22} />} title={sx("noActiveAi")} message={sx("noActiveAiMessage")} />
            )}
          </Panel>
        </div>
      )}

      {tab === "appearance" && (
        <div className="grid-dash">
          <Panel title={sx("themeAppearance")} icon="palette" color="violet">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field label={sx("theme")}>
                <div style={{ display: "flex", gap: 10 }}>
                  {[["light", t("theme.light")], ["dark", t("theme.dark")], ["system", t("theme.system")]].map(([value, label]) => (
                    <button key={value} style={{ padding: "8px 16px", borderRadius: 9, border: `2px solid ${theme === value ? "var(--accent)" : "var(--border)"}`, background: theme === value ? "var(--accent-soft)" : "var(--surface-2)", color: theme === value ? "var(--accent)" : "var(--text-2)", cursor: "pointer", fontWeight: theme === value ? 650 : 540 }} onClick={() => setTheme(value)}>
                      {label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label={sx("language")}>
                <div style={{ display: "flex", gap: 10 }}>
                  {[["uz", "O'zbekcha"], ["ru", "Русский"], ["en", "English"]].map(([value, label]) => (
                    <button key={value} style={{ padding: "8px 16px", borderRadius: 9, border: `2px solid ${lang === value ? "var(--accent)" : "var(--border)"}`, background: lang === value ? "var(--accent-soft)" : "var(--surface-2)", color: lang === value ? "var(--accent)" : "var(--text-2)", cursor: "pointer", fontWeight: lang === value ? 650 : 540 }} onClick={() => setLang(value)}>
                      {label}
                    </button>
                  ))}
                </div>
              </Field>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ fontSize: 14 }}>{sx("collapsedSidebar")}</span><Toggle checked={sidebarCollapsed} onChange={setSidebarCollapsed} /></div>
            </div>
          </Panel>
        </div>
      )}

      <Modal open={aiModalOpen} onClose={() => setAiModalOpen(false)} title={editAi ? sx("editAiSetting") : sx("newAiSetting")} icon={<I.robot size={18} />} width={560}
        footer={<><Button variant="ghost" onClick={() => setAiModalOpen(false)}>{t("common.cancel")}</Button><Button variant="primary" onClick={saveAiSetting}>{t("common.save")}</Button></>}>
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label={t("common.name")}><Input value={aiForm.name} onChange={(e) => setAiField("name", e.target.value)} /></Field>
            <Field label="Model"><Input value={aiForm.model} onChange={(e) => setAiField("model", e.target.value)} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Temperature"><Input type="number" step="0.1" value={aiForm.temperature} onChange={(e) => setAiField("temperature", e.target.value)} /></Field>
            <Field label={sx("active")}><Toggle checked={!!aiForm.is_active} onChange={(value) => setAiField("is_active", value)} /></Field>
          </div>
          <Field label={sx("functionCalling")}><Toggle checked={!!aiForm.function_calling_enabled} onChange={(value) => setAiField("function_calling_enabled", value)} /></Field>
          <Field label={sx("systemPrompt")}><Textarea rows={6} value={aiForm.system_prompt} onChange={(e) => setAiField("system_prompt", e.target.value)} /></Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteAi}
        onClose={() => setDeleteAi(null)}
        onConfirm={async () => { await remove("aiSettings", deleteAi.id); toast(sx("aiDeleted")); setDeleteAi(null); }}
        title={sx("deleteAiSetting")}
        message={currentSystemLang() === "uz" ? `"${deleteAi?.name || ""}" ${sx("deleteConfigMessage")}` : sx("deleteConfigMessage")}
        confirmLabel={sx("delete")}
        danger
      />
    </div>
  );
}

/* ======= NOTIFICATIONS ======= */
function NotificationsPage() {
  const { data, t, toast, markNotificationRead, markAllNotificationsRead, clearNotifications } = useApp();
  const [filter, setFilter] = sysS("all");

  const filtered = sysM(() => data.notifications.filter(n => filter === "all" || (filter === "unread" && !n.read)), [data.notifications, filter]);

  const TYPE_ICON = { client_created: "users", task_assigned: "checkCircle", task_done: "checkCircle", system: "settings" };
  const TYPE_COLOR = { client_created: "blue", task_assigned: "violet", task_done: "green", system: "slate" };

  const markAll = async () => {
    await markAllNotificationsRead();
    toast(sx("markAllReadDone"));
  };

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.notifications")} desc={sx("notificationsDesc")} crumbs={[{ label: sx("system") }, { label: t("page.notifications") }]}
        actions={<div style={{ display: "flex", gap: 8 }}>
          <Button variant="ghost" size="sm" icon={<I.checkCircle size={15} />} onClick={() => markAll().catch((error) => toast(error.message || sx("markFailed"), "error"))}>{sx("markAllRead")}</Button>
          <Button variant="ghost" size="sm" icon={<I.trash size={15} />} onClick={() => clearNotifications().then(() => toast(sx("clearDone"))).catch((error) => toast(error.message || sx("clearFailed"), "error"))}>{sx("clear")}</Button>
        </div>} />

      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        {[["all", t("common.all")], ["unread", sx("unread")]].map(([v, l]) => (
          <button key={v} style={{ padding: "7px 16px", borderRadius: 9, border: `1px solid ${filter === v ? "var(--accent)" : "var(--border)"}`, background: filter === v ? "var(--accent-soft)" : "var(--surface-2)", color: filter === v ? "var(--accent)" : "var(--text-2)", fontWeight: filter === v ? 650 : 540, cursor: "pointer" }} onClick={() => setFilter(v)}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 && <EmptyState icon={<I.bell size={26} />} title={sx("noNotifications")} message={sx("noNotificationsMessage")} />}
        {filtered.map(n => {
          const Ico = I[TYPE_ICON[n.type] || "bell"];
          return (
            <Card key={n.id} hover style={{ borderLeft: n.read ? undefined : `3px solid var(--accent)`, opacity: n.read ? 0.75 : 1 }}>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `var(--${TYPE_COLOR[n.type] || "slate"}-bg, var(--surface-2))`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                  <Ico size={17} style={{ color: `var(--${TYPE_COLOR[n.type] || "text-3"})` }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: n.read ? 540 : 650, fontSize: 13.5 }}>{n.title}</div>
                  <div style={{ fontSize: 12.5, color: "var(--text-2)", marginTop: 2 }}>{n.message}</div>
                  <div style={{ fontSize: 12, color: "var(--text-3)", marginTop: 3 }}>{timeAgo(n.createdAt)}</div>
                </div>
                {!n.read && (
                  <button style={{ border: "none", background: "none", cursor: "pointer", color: "var(--text-3)", padding: 4 }} onClick={() => { markNotificationRead(n.id).catch(() => null); }}>
                    <I.checkCircle size={16} />
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ======= AUDIT ======= */
function AuditPage() {
  const { data, t } = useApp();
  const loading = useLoading(420);
  const [q, setQ] = sysS("");
  const [userFilter, setUserFilter] = sysS("all");
  const [page, setPage] = sysS(1);
  const PER_PAGE = 15;

  const users = sysM(() => [...new Set(data.audit.map(a => a.userName))], [data.audit]);
  const filtered = sysM(() => data.audit.filter(a =>
    (userFilter === "all" || a.userName === userFilter) &&
    (!q || a.action.toLowerCase().includes(q.toLowerCase()) || a.entity.toLowerCase().includes(q.toLowerCase()) || a.userName.toLowerCase().includes(q.toLowerCase()))
  ), [data.audit, userFilter, q]);

  const paginated = sysM(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const ACT_COLOR = { create: "green", update: "blue", delete: "red", login: "teal", export: "amber" };

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.audit")} desc={sx("auditDesc")} crumbs={[{ label: sx("systemCrumb") }, { label: t("page.audit") }]} />

      <Panel title={sx("auditPanel")} icon="clock" color="accent" pad={false}
        action={<div style={{ display: "flex", gap: 10 }}>
          <SearchInput value={q} onChange={setQ} placeholder={t("common.search")} width={200} />
          <FilterSelect value={userFilter} onChange={v => { setUserFilter(v); setPage(1); }} options={[{ value: "all", label: sx("allUsers") }, ...users.map(u => ({ value: u, label: u }))]} />
        </div>}>
        {loading ? <SkeletonRows rows={12} cols={5} /> : (
          <>
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead><tr><th>{sx("colUser")}</th><th>{sx("colAction")}</th><th>{sx("colEntity")}</th><th>ID</th><th>{sx("colDate")}</th><th>IP</th></tr></thead>
                <tbody>
                  {paginated.map((a, i) => (
                    <tr key={i}>
                      <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><Avatar name={a.userName} size={26} /><span style={{ fontSize: 13 }}>{a.userName}</span></div></td>
                      <td><Badge color={ACT_COLOR[a.action] || "slate"} size="sm">{a.action}</Badge></td>
                      <td className="tg-cell-strong">{a.entity}</td>
                      <td className="tg-cell-sub" style={{ fontFamily: "monospace", fontSize: 11.5 }}>{a.entityId}</td>
                      <td className="tg-cell-sub">{fmtDate(a.createdAt, true)}</td>
                      <td className="tg-cell-sub" style={{ fontFamily: "monospace", fontSize: 11 }}>{a.ip || "127.0.0.1"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
                <button className="tg-page-btn" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><I.chevLeft size={16} /></button>
                <span style={{ fontSize: 13, color: "var(--text-3)" }}>{page} / {totalPages}</span>
                <button className="tg-page-btn" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><I.chevRight size={16} /></button>
                <span style={{ fontSize: 12.5, color: "var(--text-3)", marginLeft: "auto" }}>{filtered.length} {sx("recordsUnit")}</span>
              </div>
            )}
          </>
        )}
      </Panel>
    </div>
  );
}

/* ======= INTEGRATIONS ======= */
function IntegrationsPage() {
  const { data, t, toast, upsert, remove } = useApp();
  const [tab, setTab] = sysS("connected");
  const [modalOpen, setModalOpen] = sysS(false);
  const [editConfig, setEditConfig] = sysS(null);
  const [deleteConfig, setDeleteConfig] = sysS(null);
  const [form, setForm] = sysS({ provider: "", key: "", value: "", is_active: true, description: "" });
  const setFormField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const openCreate = () => {
    setEditConfig(null);
    setForm({ provider: "", key: "", value: "", is_active: true, description: "" });
    setModalOpen(true);
  };
  const openEdit = (config) => {
    setEditConfig(config);
    setForm({ provider: config.provider || "", key: config.key || "", value: config.value || "", is_active: config.is_active !== false, description: config.description || "" });
    setModalOpen(true);
  };

  const mapIntegration = (item) => {
    const provider = String(item.provider || item.platform || item.slug || item.service || item.name || "").toLowerCase();
    const rawName = item.name || item.title || item.provider || item.platform || item.slug || item.service || item.id;
    const desc = item.description || item.summary || item.base_url || item.webhook_url || "Backend konfiguratsiyasi";
    return {
      id: item.id,
      name: rawName,
      desc,
      connected: item.is_active !== false && item.enabled !== false,
      status: item.status || (item.is_active === false ? "inactive" : "active"),
      icon: provider.includes("instagram") ? "instagram" : provider.includes("telegram") ? "send" : provider.includes("google") ? "chart" : provider.includes("meta") ? "target" : "link",
      color: provider.includes("instagram") ? "#e1306c" : provider.includes("telegram") ? "#2AABEE" : provider.includes("google") ? "#4285F4" : provider.includes("meta") ? "#1877F2" : "#64748b",
      updatedAt: item.updated_at || item.created_at || null,
      raw: item,
    };
  };

  const integrations = (data.integrationConfigs || []).map(mapIntegration);
  const connected = integrations.filter(i => i.connected);
  const available = integrations.filter(i => !i.connected);
  const aiSettings = data.aiSettings || [];
  const events = data.integrationEvents || [];

  const IntCard = ({ int }) => (
    <Card hover>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: int.color + "22", border: `1.5px solid ${int.color}44`, display: "grid", placeItems: "center", flexShrink: 0 }}>
          {React.createElement(I[int.icon] || I.zap, { size: 20, style: { color: int.color } })}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 3 }}>
            <span style={{ fontWeight: 660, fontSize: 14 }}>{int.name}</span>
            {int.connected && <StatusBadge status="active" label={sx("connectedLabel")} />}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.5 }}>{int.desc}</div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <Button variant="soft" size="sm" icon={<I.edit size={14} />} onClick={() => openEdit(int.raw)}>{sx("editBtn")}</Button>
          <Button variant="soft" size="sm" icon={<I.doc size={14} />} onClick={() => toast(JSON.stringify(int.raw, null, 2), "info")}>JSON</Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.integrations")} desc={sx("integrationsDesc")} crumbs={[{ label: sx("systemCrumb") }, { label: t("page.integrations") }]}
        actions={<div style={{ display: "flex", gap: 8 }}><Button variant="default" size="sm" icon={<I.doc size={15} />} onClick={() => toast(sx("apiDocsOpened"))}>{sx("apiDocs")}</Button><Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={openCreate}>{sx("newIntegration")}</Button></div>} />

      <div style={{ marginBottom: 18 }}>
        <Tabs tabs={[{ value: "connected", label: sx("connectedTab"), count: connected.length }, { value: "available", label: sx("availableTab"), count: available.length }, { value: "api", label: sx("backendTab") }]} active={tab} onChange={setTab} />
      </div>

      {tab === "connected" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {connected.length ? connected.map(int => <IntCard key={int.id} int={int} />) : <EmptyState icon={<I.link size={22} />} title={sx("noConnected")} message={sx("noConnectedMsg")} />}
        </div>
      )}

      {tab === "available" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {available.length ? available.map(int => <IntCard key={int.id} int={int} />) : <EmptyState icon={<I.link size={22} />} title={sx("noAvailable")} message={sx("noAvailableMsg")} />}
        </div>
      )}

      {tab === "api" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Panel title={sx("aiSettingsPanel")} icon="robot" color="amber">
            {aiSettings.length ? (
              <div className="tg-meta">
                {aiSettings.map((setting) => (
                  <div key={setting.id || setting.name} className="tg-meta-row">
                    <span className="tg-meta-k">{setting.name || setting.provider || setting.id}</span>
                    <span className="tg-meta-v">{setting.model || setting.status || (setting.is_active ? sx("active") : sx("inactive"))}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={<I.robot size={22} />} title={sx("noAiSettings")} message={sx("noAiSettingsMsg")} />
            )}
          </Panel>
          <Panel title={sx("intEventsPanel")} icon="link" color="blue">
            {events.length ? (
              <div className="tg-meta">
                {events.slice(0, 8).map((event) => (
                  <div key={event.id || event.name} className="tg-meta-row">
                    <span className="tg-meta-k">{event.name || event.event_type || event.id}</span>
                    <span className="tg-meta-v">{event.status || event.target || event.provider || "Event"}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={<I.clock size={22} />} title={sx("noEvents")} message={sx("noEventsMsg")} />
            )}
          </Panel>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editConfig ? sx("editIntegration") : sx("newIntegrationModal")} icon={<I.link size={18} />} width={520}
        footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>{sx("cancelShort")}</Button><Button variant="primary" onClick={async () => {
          await upsert("integrationConfigs", { ...editConfig, ...form });
          toast(editConfig ? sx("intUpdated") : sx("intAdded"));
          setModalOpen(false);
          setEditConfig(null);
        }}>{t("common.save")}</Button></>}>
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Provider"><Input value={form.provider} onChange={(e) => setFormField("provider", e.target.value)} /></Field>
            <Field label={sx("keyLabel")}><Input value={form.key} onChange={(e) => setFormField("key", e.target.value)} /></Field>
          </div>
          <Field label={sx("valueLabel")}><Textarea rows={5} value={form.value} onChange={(e) => setFormField("value", e.target.value)} /></Field>
          <Field label={sx("descLabel")}><Textarea rows={3} value={form.description} onChange={(e) => setFormField("description", e.target.value)} /></Field>
          <Field label={sx("activeLabel")}><Toggle checked={!!form.is_active} onChange={(value) => setFormField("is_active", value)} /></Field>
          {editConfig?.id && <Button variant="ghost" size="sm" icon={<I.trash size={15} />} onClick={() => { setModalOpen(false); setDeleteConfig(editConfig); }}>{sx("delete")}</Button>}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteConfig}
        onClose={() => setDeleteConfig(null)}
        onConfirm={async () => {
          await remove("integrationConfigs", deleteConfig.id);
          toast(sx("intDeleted"));
          setDeleteConfig(null);
        }}
        title={sx("deleteIntegration")}
        message={currentSystemLang() === "uz" ? `"${deleteConfig?.provider || deleteConfig?.key || ""}" ${sx("deleteConfigMessage")}` : sx("deleteConfigMessage")}
        confirmLabel={sx("delete")}
        danger
      />
    </div>
  );
}

/* ======= HELP ======= */
function HelpPage() {
  const { t, toast } = useApp();
  const [q, setQ] = sysS("");
  const [open, setOpen] = sysS(null);

  const FAQ = sx("faq");
  const filtered = sysM(() => FAQ.filter(f => !q || f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase())), [q, FAQ]);
  const SHORTCUTS = sx("shortcuts");

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.help")} desc={sx("helpDesc")} crumbs={[{ label: sx("systemCrumb") }, { label: t("page.help") }]} />

      <div style={{ maxWidth: 700, margin: "0 auto 28px", textAlign: "center" }}>
        <h2 style={{ fontSize: 22, fontWeight: 720, marginBottom: 12 }}>{sx("helpTitle")}</h2>
        <SearchInput value={q} onChange={setQ} placeholder={sx("helpSearchPlaceholder")} width="100%" />
      </div>

      <div className="grid-dash">
        <div>
          <div style={{ fontWeight: 650, fontSize: 15, marginBottom: 12 }}>{sx("faqTitle")}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((f, i) => (
              <Card key={i} hover onClick={() => setOpen(open === i ? null : i)}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                  <span style={{ fontWeight: open === i ? 650 : 560, fontSize: 13.5 }}>{f.q}</span>
                  <I.chevDown size={16} style={{ flexShrink: 0, color: "var(--text-3)", transform: open === i ? "rotate(180deg)" : "none", transition: "transform .2s" }} />
                </div>
                {open === i && <div style={{ marginTop: 10, fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.65, paddingTop: 10, borderTop: "1px solid var(--border-soft)" }}>{f.a}</div>}
              </Card>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Panel title={sx("shortcutsTitle")} icon="zap" color="amber">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SHORTCUTS.map(([key, desc]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--text-2)" }}>{desc}</span>
                  <code style={{ padding: "3px 8px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12, fontFamily: "monospace" }}>{key}</code>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title={sx("helpCenterTitle")} icon="help" color="blue">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Button variant="soft" icon={<I.doc size={15} />} onClick={() => toast(sx("guideOpened"))}>{sx("fullGuide")}</Button>
              <Button variant="soft" icon={<I.play size={15} />} onClick={() => toast(sx("videoOpened"))}>{sx("videoCourses")}</Button>
              <Button variant="soft" icon={<I.message size={15} />} onClick={() => toast(sx("supportOpened"))}>{sx("support")}</Button>
            </div>
          </Panel>
          <Panel title={sx("versionTitle")} icon="info" color="teal">
            <div className="tg-meta">
              <div className="tg-meta-row"><span className="tg-meta-k">{sx("versionLabel")}</span><span className="tg-meta-v"><Badge color="teal" size="sm">v2.4.1</Badge></span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">{sx("releasedLabel")}</span><span className="tg-meta-v">2026-06-01</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">{sx("changesLabel")}</span><span className="tg-meta-v">{sx("changesDesc")}</span></div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

window.UsersPage = UsersPage;
window.SettingsPage = SettingsPage;
window.NotificationsPage = NotificationsPage;
window.AuditPage = AuditPage;
window.IntegrationsPage = IntegrationsPage;
window.HelpPage = HelpPage;
