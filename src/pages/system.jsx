/* pages/system.jsx вЂ” Users, Roles, Settings, Notifications, Audit, Integrations, Help */
const { useState: sysS, useMemo: sysM } = React;

const PERMISSION_LABELS_UZ = {
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
};

function permissionLabelUz(permissionKey) {
  return PERMISSION_LABELS_UZ[permissionKey] || permissionKey;
}

const USER_ROLE_OPTIONS = ["developer", "admin", "operator"];
const USER_ROLE_META = {
  developer: { label: "Dasturchi", color: "violet" },
  admin: { label: "Administrator", color: "red" },
  operator: { label: "Operator", color: "blue" },
};
const USER_MODULE_LABELS = {
  dashboard: "Dashboard",
  audit_logs: "Audit",
  users: "Foydalanuvchilar",
  clients: "Mijozlar",
  accounting: "Hisob-kitob",
  products: "Mahsulotlar",
  tasks: "Vazifalar",
  notifications: "Bildirishnomalar",
  chats: "Inbox",
  integrations: "Integratsiyalar",
  ai: "AI",
  other: "Boshqa",
};

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
  if (permission && typeof permission === "object") {
    const directLabel = permission.label || permission.title || permission.description;
    if (directLabel) return directLabel;
    if (permission.name && permission.name !== code) return permission.name;
    return permissionLabelUz(code);
  }
  return permissionLabelUz(code);
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
  return Object.keys(PERMISSION_LABELS_UZ).map((code) => ({
    code,
    module: permissionModule(code),
    label: permissionLabelUz(code),
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
    .sort((a, b) => (USER_MODULE_LABELS[a[0]] || a[0]).localeCompare(USER_MODULE_LABELS[b[0]] || b[0], "uz"))
    .map(([moduleKey, permissions]) => [moduleKey, permissions.sort((a, b) => a.label.localeCompare(b.label, "uz"))]);
}

function roleKey(role) {
  if (typeof role === "string") return role;
  if (!role || typeof role !== "object") return "";
  return role.key || role.code || role.name || "";
}

function roleLabel(role) {
  const key = roleKey(role);
  return role?.label || USER_ROLE_META[key]?.label || key;
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
  const permissionGroups = sysM(() => groupedPermissionCatalog(permissionCatalog), [permissionCatalog]);
  const roleCatalog = sysM(() => {
    const backendRoles = (data.roles || []).map((role) => ({ ...role, key: roleKey(role), label: roleLabel(role) })).filter((role) => role.key);
    if (backendRoles.length) return backendRoles;
    return USER_ROLE_OPTIONS.map((role) => ({ key: role, label: USER_ROLE_META[role].label, default_permissions: [] }));
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
    toast(editUser ? "Foydalanuvchi yangilandi" : "Foydalanuvchi qo'shildi");
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
      <PageHeader title={t("page.users")} desc="Tizim foydalanuvchilarini boshqarish" crumbs={[{ label: "Tizim" }, { label: t("page.users") }]}
        actions={canManageUsers ? <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={openCreate}>Foydalanuvchi qo'shish</Button> : null} />

      <div className="grid-kpi" style={{ marginBottom: 22 }}>
        <StatTile label="Jami" value={stats.total} />
        <StatTile label="Faol" value={stats.active} color="green" />
        {USER_ROLE_OPTIONS.map(r => <StatTile key={r} label={USER_ROLE_META[r].label} value={stats.byRole[r]} color={USER_ROLE_META[r].color} />)}
      </div>

      <Panel title="Foydalanuvchilar" icon="users" color="accent" pad={false}
        action={<div style={{ display: "flex", gap: 10 }}>
          <SearchInput value={q} onChange={setQ} placeholder="Qidirish..." width={200} />
          <FilterSelect value={roleFilter} onChange={setRoleFilter} options={[{ value: "all", label: "Barcha rollar" }, ...USER_ROLE_OPTIONS.map(r => ({ value: r, label: USER_ROLE_META[r].label }))]} />
          <FilterSelect value={statusFilter} onChange={setStatusFilter} options={[{ value: "all", label: "Barcha holatlar" }, { value: "active", label: "Faol" }, { value: "inactive", label: "Nofaol" }]} />
        </div>}>
        {loading ? <SkeletonRows rows={10} cols={7} /> : (
          <div className="tg-table-wrap">
            <table className="tg-table">
              <thead><tr><th>Foydalanuvchi</th><th>Rol</th><th>Ruxsatlar</th>{hasRegionField && <th>Hudud</th>}<th>Holat</th><th>Qo'shilgan</th><th></th></tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={u.fullName} hue={u.avatarHue} size={32} /><div><div className="tg-cell-strong">{u.fullName}</div><div className="tg-cell-sub">{u.email}</div></div></div></td>
                    <td><Badge color={USER_ROLE_META[u.role]?.color || "slate"}>{USER_ROLE_META[u.role]?.label || u.role}</Badge></td>
                    <td>
                      {u.role === "developer"
                        ? <Badge color="violet" size="sm">To'liq kirish</Badge>
                        : <Badge color="blue" size="sm">{normalizePermissionCodes(u.permissions || []).length} ta</Badge>}
                    </td>
                    {hasRegionField && <td>{u.region || "-"}</td>}
                    <td><StatusBadge status={u.status === "active" ? "active" : "inactive"} label={u.status === "active" ? "Faol" : "Nofaol"} /></td>
                    <td className="tg-cell-sub">{fmtDate(u.createdAt)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <IconButton icon={<I.eye size={15} />} label="Ko'rish" onClick={() => setViewUser(u)} />
                        {canManageUsers && canManageTargetUser(currentUser, u) ? <IconButton icon={<I.edit size={15} />} label="Tahrir" onClick={() => openEdit(u)} /> : null}
                        {canManageUsers && canManageTargetUser(currentUser, u) && u.id !== currentUser?.id ? <IconButton icon={<I.trash size={15} />} label="O'chirish" onClick={() => setDeleteUser(u)} /> : null}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Modal open={addOpen} onClose={() => { setAddOpen(false); setEditUser(null); }} title={editUser ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi"} icon={<I.user size={18} />} width={920}
        footer={<><Button variant="ghost" onClick={() => { setAddOpen(false); setEditUser(null); }}>Bekor</Button><Button variant="primary" onClick={saveUser}>{editUser ? "Saqlash" : "Qo'shish"}</Button></>}>
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(320px, .9fr)", gap: 18 }}>
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 18, background: "var(--surface-2)" }}>
              <div style={{ display: "grid", gap: 14 }}>
                <Field label="To'liq ism" required><Input value={form.fullName} onChange={e => setF("fullName", e.target.value)} placeholder="Aziz Karimov" /></Field>
                <Field label="Email" required><Input value={form.email} onChange={e => setF("email", e.target.value)} placeholder="aziz@bogotarmadanrg.uz" type="email" /></Field>
                <Field label="Telefon"><Input value={form.phone} onChange={e => setF("phone", e.target.value)} placeholder="+998 90 123 45 67" /></Field>
                <Field label={editUser ? "Yangi parol" : "Parol"} hint={editUser ? "O'zgartirmasangiz bo'sh qoldiring" : undefined}><Input value={form.password} onChange={e => setF("password", e.target.value)} type="password" placeholder={editUser ? "Yangi parol" : "Kamida 8 belgi"} /></Field>
              </div>
            </div>

            <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 18, background: "var(--surface-2)" }}>
              <div style={{ display: "grid", gridTemplateColumns: hasRegionField ? "1fr 1fr" : "1fr", gap: 14 }}>
                <Field label="Rol">
                  <Select
                    value={form.role}
                    onChange={(value) => setForm((current) => ({ ...current, role: value, permissions: value === "developer" ? [] : current.permissions }))}
                    options={availableRoleOptions.map((role) => ({ value: role.key, label: role.label }))}
                  />
                </Field>
                {hasRegionField ? <Field label="Hudud"><Select value={form.region} onChange={v => setF("region", v)} options={["Toshkent", "Samarqand", "Namangan", "Andijon", "Farg'ona"].map(r => ({ value: r, label: r }))} /></Field> : null}
              </div>
              <div style={{ marginTop: 14 }}>
                <Field label="Holat"><Select value={form.status} onChange={v => setF("status", v)} options={[{ value: "active", label: "Faol" }, { value: "inactive", label: "Nofaol" }]} /></Field>
              </div>
            </div>
          </div>

          <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 18, background: "var(--surface-2)", minHeight: 420 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
              <div>
                <div className="tg-section-title" style={{ marginBottom: 4 }}>Ruxsatlar</div>
                <div className="tg-cell-sub">{form.role === "developer" ? "Dasturchi barcha modullarga to'liq kira oladi." : "Rol defaultlarini qo'llab keyin kerakli ruxsatlarni qo'lda o'zgartiring."}</div>
              </div>
              {form.role !== "developer" ? <div style={{ display: "flex", gap: 8 }}>
                <Button variant="soft" size="sm" onClick={applyRoleDefaults}>Rol defaultlari</Button>
                <Button variant="ghost" size="sm" onClick={() => setF("permissions", [])}>Tozalash</Button>
              </div> : null}
            </div>

            {form.role === "developer" ? (
              <div style={{ display: "grid", placeItems: "center", minHeight: 300, borderRadius: 16, border: "1px dashed var(--border)", background: "color-mix(in srgb, var(--violet) 10%, var(--surface-2))", textAlign: "center", padding: 20 }}>
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ display: "flex", justifyContent: "center" }}><Badge color="violet">To'liq kirish</Badge></div>
                  <div style={{ fontWeight: 700 }}>Dasturchi foydalanuvchisi uchun alohida permission tanlash kerak emas.</div>
                  <div className="tg-cell-sub">Administrator dasturchi rolini bera olmaydi yoki olib tashlay olmaydi.</div>
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 12, maxHeight: 520, overflowY: "auto", paddingRight: 4 }}>
                {permissionGroups.map(([moduleKey, permissions]) => (
                  <div key={moduleKey} style={{ border: "1px solid var(--border)", borderRadius: 16, background: "var(--surface)", padding: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 12 }}>
                      <div style={{ fontWeight: 700 }}>{USER_MODULE_LABELS[moduleKey] || moduleKey}</div>
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
      <Modal open={!!viewUser} onClose={() => setViewUser(null)} title="Foydalanuvchi ma'lumotlari" icon={<I.user size={18} />} width={720}
        footer={<>
          <Button variant="ghost" onClick={() => setViewUser(null)}>Bekor</Button>
          {canManageUsers && viewUser && canManageTargetUser(currentUser, viewUser) ? <Button variant="soft" icon={<I.edit size={14} />} onClick={() => {
            const current = viewUser;
            setViewUser(null);
            openEdit(current);
          }}>Tahrir</Button> : null}
        </>}>
        {viewUser && (
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0, .95fr) minmax(280px, 1.05fr)", gap: 16 }}>
            <div className="tg-meta" style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 18, background: "var(--surface-2)" }}>
              <div className="tg-meta-row"><span className="tg-meta-k">Foydalanuvchi</span><span className="tg-meta-v">{viewUser.fullName}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Email</span><span className="tg-meta-v">{viewUser.email}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Telefon</span><span className="tg-meta-v">{viewUser.phone}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Rol</span><span className="tg-meta-v"><Badge color={USER_ROLE_META[viewUser.role]?.color || "slate"}>{USER_ROLE_META[viewUser.role]?.label || viewUser.role}</Badge></span></div>
              {hasRegionField && viewUser.region ? <div className="tg-meta-row"><span className="tg-meta-k">Hudud</span><span className="tg-meta-v">{viewUser.region}</span></div> : null}
              <div className="tg-meta-row"><span className="tg-meta-k">Holat</span><span className="tg-meta-v"><StatusBadge status={viewUser.status === "active" ? "active" : "inactive"} label={viewUser.status === "active" ? "Faol" : "Nofaol"} /></span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Qo'shilgan</span><span className="tg-meta-v">{fmtDate(viewUser.createdAt)}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Username</span><span className="tg-meta-v">{viewUser.username || "-"}</span></div>
            </div>

            <div style={{ padding: 16, border: "1px solid var(--border)", borderRadius: 18, background: "var(--surface-2)" }}>
              <div className="tg-section-title" style={{ marginBottom: 10 }}>Ruxsatlar</div>
              {viewUser.role === "developer" ? (
                <div style={{ display: "grid", gap: 10 }}>
                  <Badge color="violet" size="sm">To'liq kirish</Badge>
                  <div className="tg-cell-sub">Dasturchi barcha bo'limlarga kirish va boshqarish huquqiga ega.</div>
                </div>
              ) : (viewPermissions || []).length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {viewPermissions.map((permission) => <Badge key={permission} color="blue" size="sm">{permissionLabelMap[permission] || permissionLabelUz(permission)}</Badge>)}
                </div>
              ) : (
                <div className="tg-cell-sub">Qo'shimcha ruxsat topilmadi</div>
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
          toast("Foydalanuvchi o'chirildi");
          setDeleteUser(null);
        }}
        title="Foydalanuvchini o'chirish"
        message={`"${deleteUser?.fullName || ""}" foydalanuvchisini o'chirmoqchimisiz?`}
        details={deleteUser ? `Email: ${deleteUser.email}\nRol: ${USER_ROLE_META[deleteUser.role]?.label || deleteUser.role}` : ""}
        confirmLabel="O'chirish"
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
    toast(editAi ? "AI sozlamasi yangilandi" : "AI sozlamasi qo'shildi");
    setAiModalOpen(false);
    setEditAi(null);
    resetAiForm();
  };

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.settings")} desc="Live backend sozlamalari va CRM ko'rinishi" crumbs={[{ label: "Tizim" }, { label: t("page.settings") }]} />

      <div style={{ marginBottom: 18 }}>
        <Tabs tabs={[{ value: "ai", label: "AI sozlamalari" }, { value: "appearance", label: "Ko'rinish" }]} active={tab} onChange={setTab} />
      </div>

      {tab === "ai" && (
        <div className="grid-dash">
          <Panel title="AI konfiguratsiyalari" icon="robot" color="amber" pad={false}
            action={<Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={openAiCreate}>Yangi konfiguratsiya</Button>}>
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead><tr><th>Nomi</th><th>Model</th><th>Temperature</th><th>Active</th><th>Function calling</th><th></th></tr></thead>
                <tbody>
                  {(data.aiSettings || []).map((setting) => (
                    <tr key={setting.id}>
                      <td className="tg-cell-strong">{setting.name}</td>
                      <td>{setting.model}</td>
                      <td>{setting.temperature}</td>
                      <td>{setting.is_active || activeAiMap[setting.id || setting.name] ? <Badge color="green" size="sm">Faol</Badge> : <Badge color="slate" size="sm">Nofaol</Badge>}</td>
                      <td>{setting.function_calling_enabled || setting.functionCallingEnabled ? <Badge color="blue" size="sm">Yoqilgan</Badge> : <Badge color="slate" size="sm">O'chirilgan</Badge>}</td>
                      <td>
                        <div style={{ display: "flex", gap: 4 }}>
                          <IconButton icon={<I.edit size={15} />} label="Tahrir" onClick={() => openAiEdit(setting)} />
                          <IconButton icon={<I.trash size={15} />} label="O'chirish" onClick={() => setDeleteAi(setting)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
          <Panel title="Faol AI" icon="sparkle" color="violet">
            {(data.activeAiSettings || []).length ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {(data.activeAiSettings || []).map((setting) => <Badge key={setting.id || setting.name} color="violet" size="sm">{setting.name || setting.model || setting.id}</Badge>)}
              </div>
            ) : (
              <EmptyState icon={<I.robot size={22} />} title="Faol AI topilmadi" message="Backend active AI qaytarmadi." />
            )}
          </Panel>
        </div>
      )}

      {tab === "appearance" && (
        <div className="grid-dash">
          <Panel title="Mavzu va ko'rinish" icon="palette" color="violet">
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <Field label="Mavzu">
                <div style={{ display: "flex", gap: 10 }}>
                  {[["light", "Yorug'"], ["dark", "Qorong'u"], ["system", "Tizim"]].map(([value, label]) => (
                    <button key={value} style={{ padding: "8px 16px", borderRadius: 9, border: `2px solid ${theme === value ? "var(--accent)" : "var(--border)"}`, background: theme === value ? "var(--accent-soft)" : "var(--surface-2)", color: theme === value ? "var(--accent)" : "var(--text-2)", cursor: "pointer", fontWeight: theme === value ? 650 : 540 }} onClick={() => setTheme(value)}>
                      {label}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Til">
                <div style={{ display: "flex", gap: 10 }}>
                  {[["uz", "O'zbekcha"], ["ru", "Русский"], ["en", "English"]].map(([value, label]) => (
                    <button key={value} style={{ padding: "8px 16px", borderRadius: 9, border: `2px solid ${lang === value ? "var(--accent)" : "var(--border)"}`, background: lang === value ? "var(--accent-soft)" : "var(--surface-2)", color: lang === value ? "var(--accent)" : "var(--text-2)", cursor: "pointer", fontWeight: lang === value ? 650 : 540 }} onClick={() => setLang(value)}>
                      {label}
                    </button>
                  ))}
                </div>
              </Field>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}><span style={{ fontSize: 14 }}>Yig'ilgan yon panel</span><Toggle checked={sidebarCollapsed} onChange={setSidebarCollapsed} /></div>
            </div>
          </Panel>
        </div>
      )}

      <Modal open={aiModalOpen} onClose={() => setAiModalOpen(false)} title={editAi ? "AI sozlamasini tahrirlash" : "Yangi AI sozlama"} icon={<I.robot size={18} />} width={560}
        footer={<><Button variant="ghost" onClick={() => setAiModalOpen(false)}>Bekor</Button><Button variant="primary" onClick={saveAiSetting}>Saqlash</Button></>}>
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Nomi"><Input value={aiForm.name} onChange={(e) => setAiField("name", e.target.value)} /></Field>
            <Field label="Model"><Input value={aiForm.model} onChange={(e) => setAiField("model", e.target.value)} /></Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Temperature"><Input type="number" step="0.1" value={aiForm.temperature} onChange={(e) => setAiField("temperature", e.target.value)} /></Field>
            <Field label="Faol"><Toggle checked={!!aiForm.is_active} onChange={(value) => setAiField("is_active", value)} /></Field>
          </div>
          <Field label="Function calling"><Toggle checked={!!aiForm.function_calling_enabled} onChange={(value) => setAiField("function_calling_enabled", value)} /></Field>
          <Field label="System prompt"><Textarea rows={6} value={aiForm.system_prompt} onChange={(e) => setAiField("system_prompt", e.target.value)} /></Field>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteAi}
        onClose={() => setDeleteAi(null)}
        onConfirm={async () => { await remove("aiSettings", deleteAi.id); toast("AI sozlamasi o'chirildi"); setDeleteAi(null); }}
        title="AI sozlamasini o'chirish"
        message={`"${deleteAi?.name || ""}" konfiguratsiyasini o'chirmoqchimisiz?`}
        confirmLabel="O'chirish"
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
    toast("Barchasi o'qildi deb belgilandi");
  };

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.notifications")} desc="Tizim bildirishnomalari" crumbs={[{ label: "Tizim" }, { label: t("page.notifications") }]}
        actions={<div style={{ display: "flex", gap: 8 }}>
          <Button variant="ghost" size="sm" icon={<I.checkCircle size={15} />} onClick={() => markAll().catch((error) => toast(error.message || "Belgilanmadi", "error"))}>Barchasini o'qildi belgilash</Button>
          <Button variant="ghost" size="sm" icon={<I.trash size={15} />} onClick={() => clearNotifications().then(() => toast("Bildirishnomalar tozalandi")).catch((error) => toast(error.message || "Tozalanmadi", "error"))}>Tozalash</Button>
        </div>} />

      <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
        {[["all", "Barchasi"], ["unread", "O'qilmagan"]].map(([v, l]) => (
          <button key={v} style={{ padding: "7px 16px", borderRadius: 9, border: `1px solid ${filter === v ? "var(--accent)" : "var(--border)"}`, background: filter === v ? "var(--accent-soft)" : "var(--surface-2)", color: filter === v ? "var(--accent)" : "var(--text-2)", fontWeight: filter === v ? 650 : 540, cursor: "pointer" }} onClick={() => setFilter(v)}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.length === 0 && <EmptyState icon={<I.bell size={26} />} title="Bildirishnomalar yo'q" message="Hozircha yangi bildirishnomalar yo'q" />}
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
      <PageHeader title={t("page.audit")} desc="Barcha tizim harakatlari jurnali" crumbs={[{ label: "Tizim" }, { label: t("page.audit") }]} />

      <Panel title="Audit jurnali" icon="clock" color="accent" pad={false}
        action={<div style={{ display: "flex", gap: 10 }}>
          <SearchInput value={q} onChange={setQ} placeholder="Qidirish..." width={200} />
          <FilterSelect value={userFilter} onChange={v => { setUserFilter(v); setPage(1); }} options={[{ value: "all", label: "Barcha foydalanuvchilar" }, ...users.map(u => ({ value: u, label: u }))]} />
        </div>}>
        {loading ? <SkeletonRows rows={12} cols={5} /> : (
          <>
            <div className="tg-table-wrap">
              <table className="tg-table">
                <thead><tr><th>Foydalanuvchi</th><th>Harakat</th><th>Ob'ekt</th><th>ID</th><th>Sana</th><th>IP</th></tr></thead>
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
                <span style={{ fontSize: 12.5, color: "var(--text-3)", marginLeft: "auto" }}>{filtered.length} ta yozuv</span>
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
            {int.connected && <StatusBadge status="active" label="Ulangan" />}
          </div>
          <div style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.5 }}>{int.desc}</div>
        </div>
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <Button variant="soft" size="sm" icon={<I.edit size={14} />} onClick={() => openEdit(int.raw)}>Tahrir</Button>
          <Button variant="soft" size="sm" icon={<I.doc size={14} />} onClick={() => toast(JSON.stringify(int.raw, null, 2), "info")}>JSON</Button>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.integrations")} desc="Tashqi tizimlar va API integratsiyalari" crumbs={[{ label: "Tizim" }, { label: t("page.integrations") }]}
        actions={<div style={{ display: "flex", gap: 8 }}><Button variant="default" size="sm" icon={<I.doc size={15} />} onClick={() => toast("API hujjatlar ochildi")}>API hujjatlar</Button><Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={openCreate}>Yangi konfiguratsiya</Button></div>} />

      <div style={{ marginBottom: 18 }}>
        <Tabs tabs={[{ value: "connected", label: "Ulangan", count: connected.length }, { value: "available", label: "Mavjud", count: available.length }, { value: "api", label: "Backend" }]} active={tab} onChange={setTab} />
      </div>

      {tab === "connected" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {connected.length ? connected.map(int => <IntCard key={int.id} int={int} />) : <EmptyState icon={<I.link size={22} />} title="Faol integratsiya yo'q" message="Backendda hali faol integratsiya sozlanmagan." />}
        </div>
      )}

      {tab === "available" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {available.length ? available.map(int => <IntCard key={int.id} int={int} />) : <EmptyState icon={<I.link size={22} />} title="Faol bo'lmagan integratsiya yo'q" message="Barcha backend konfiguratsiyalari faol yoki ro'yxat bo'sh." />}
        </div>
      )}

      {tab === "api" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Panel title="AI sozlamalari" icon="robot" color="amber">
            {aiSettings.length ? (
              <div className="tg-meta">
                {aiSettings.map((setting) => (
                  <div key={setting.id || setting.name} className="tg-meta-row">
                    <span className="tg-meta-k">{setting.name || setting.provider || setting.id}</span>
                    <span className="tg-meta-v">{setting.model || setting.status || (setting.is_active ? "Faol" : "Nofaol")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={<I.robot size={22} />} title="AI sozlamalari topilmadi" message="Backend hali AI konfiguratsiya qaytarmadi." />
            )}
          </Panel>
          <Panel title="Integratsiya eventlari" icon="link" color="blue">
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
              <EmptyState icon={<I.clock size={22} />} title="Eventlar topilmadi" message="Backendda integratsiya eventlari yo'q." />
            )}
          </Panel>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editConfig ? "Integratsiyani tahrirlash" : "Yangi integratsiya"} icon={<I.link size={18} />} width={520}
        footer={<><Button variant="ghost" onClick={() => setModalOpen(false)}>Bekor</Button><Button variant="primary" onClick={async () => {
          await upsert("integrationConfigs", { ...editConfig, ...form });
          toast(editConfig ? "Integratsiya yangilandi" : "Integratsiya qo'shildi");
          setModalOpen(false);
          setEditConfig(null);
        }}>Saqlash</Button></>}>
        <div style={{ display: "grid", gap: 14 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Provider"><Input value={form.provider} onChange={(e) => setFormField("provider", e.target.value)} /></Field>
            <Field label="Kalit"><Input value={form.key} onChange={(e) => setFormField("key", e.target.value)} /></Field>
          </div>
          <Field label="Qiymat"><Textarea rows={5} value={form.value} onChange={(e) => setFormField("value", e.target.value)} /></Field>
          <Field label="Tavsif"><Textarea rows={3} value={form.description} onChange={(e) => setFormField("description", e.target.value)} /></Field>
          <Field label="Faol"><Toggle checked={!!form.is_active} onChange={(value) => setFormField("is_active", value)} /></Field>
          {editConfig?.id && <Button variant="ghost" size="sm" icon={<I.trash size={15} />} onClick={() => { setModalOpen(false); setDeleteConfig(editConfig); }}>O'chirish</Button>}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteConfig}
        onClose={() => setDeleteConfig(null)}
        onConfirm={async () => {
          await remove("integrationConfigs", deleteConfig.id);
          toast("Integratsiya o'chirildi");
          setDeleteConfig(null);
        }}
        title="Integratsiyani o'chirish"
        message={`"${deleteConfig?.provider || deleteConfig?.key || ""}" konfiguratsiyasini o'chirmoqchimisiz?`}
        confirmLabel="O'chirish"
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

  const FAQ = [
    { q: "Yangi lid qanday qo'shiladi?", a: "Lidlar sahifasida 'Yangi lid' tugmasini bosing yoki QuickCreate (+) dan foydalaning. Lead'ni import (CSV) orqali ham qo'shish mumkin." },
    { q: "Kanban pipeline qanday ishlaydi?", a: "Pipeline sahifasida kartalarni drag & drop orqali ustunlar orasida siljiting. Har bir ustun lid bosqichini bildiradi." },
    { q: "AI lead saralashi qanday ishlaydi?", a: "Instagram AI va Telegram Web App foydalanuvchidan ism, telefon, kerakli quvvat va to'lov turini yig'adi. Ma'lumotlar tayyor bo'lgach lead CRM ga tushadi va operatorga biriktiriladi." },
    { q: "Qarzdorlar sahifasi nimaga xizmat qiladi?", a: "Qarzdorlar sahifasida mijozning umumiy summa, to'langan qismi, qolgan qarzi va undirish holati ko'rinadi. Excel dagi qarzdorlik daftarlari shu modulga mos keladi." },
    { q: "Ruxsatlar qanday belgilanadi?", a: "Ruxsatlar foydalanuvchilar sahifasida belgilanadi. Dasturchi barcha ruxsatlarni boshqaradi, administrator esa o'zi boshqara oladigan foydalanuvchilarga ruxsat beradi yoki olib tashlaydi." },
    { q: "Excel eksport qanday amalga oshiriladi?", a: "Mijozlar va qarzdorlar sahifasida 'Excel' tugmasi mavjud. U backend tayyorlagan haqiqiy .xlsx faylni yuklab beradi." },
    { q: "Instagram/Telegram AI qanday ulanadi?", a: "Integratsiyalar sahifasida Instagram yoki Telegram'ni tanlang va 'Ulash' tugmasini bosing. Webhook URL va API kalitlarni mos bo'limga kiriting." },
    { q: "Hisob-kitob sahifasi nimani ko'rsatadi?", a: "Hisob-kitob sahifasida kundalik kirim-chiqim, to'lov turi, kategoriya va yakuniy balans ko'rinadi. Bu modul kunlik moliyaviy nazorat uchun ishlatiladi." },
  ];

  const filtered = sysM(() => FAQ.filter(f => !q || f.q.toLowerCase().includes(q.toLowerCase()) || f.a.toLowerCase().includes(q.toLowerCase())), [q]);

  const SHORTCUTS = [["Alt + N", "Yangi lid"], ["Alt + T", "Yangi vazifa"], ["/", "Qidiruv (Command palette)"], ["Alt + D", "Dashboard"], ["Alt + P", "Jarayon"], ["Alt + I", "Chat"]];

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.help")} desc="Qo'llanma va yordam markazi" crumbs={[{ label: "Tizim" }, { label: t("page.help") }]} />

      <div style={{ maxWidth: 700, margin: "0 auto 28px", textAlign: "center" }}>
        <h2 style={{ fontSize: 22, fontWeight: 720, marginBottom: 12 }}>Qanday yordam kerak?</h2>
        <SearchInput value={q} onChange={setQ} placeholder="Savol yozing..." width="100%" />
      </div>

      <div className="grid-dash">
        <div>
          <div style={{ fontWeight: 650, fontSize: 15, marginBottom: 12 }}>Ko'p so'raladigan savollar</div>
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
          <Panel title="Klaviatura yorliqlari" icon="zap" color="amber">
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {SHORTCUTS.map(([key, desc]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 13, color: "var(--text-2)" }}>{desc}</span>
                  <code style={{ padding: "3px 8px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12, fontFamily: "monospace" }}>{key}</code>
                </div>
              ))}
            </div>
          </Panel>
          <Panel title="Yordam markazi" icon="help" color="blue">
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <Button variant="soft" icon={<I.doc size={15} />} onClick={() => toast("Qo'llanma ochildi")}>To'liq qo'llanma</Button>
              <Button variant="soft" icon={<I.play size={15} />} onClick={() => toast("Video darslar ochildi")}>Video darslar</Button>
              <Button variant="soft" icon={<I.message size={15} />} onClick={() => toast("Qo'llab-quvvatlash ochildi")}>Qo'llab-quvvatlash</Button>
            </div>
          </Panel>
          <Panel title="Versiya" icon="info" color="teal">
            <div className="tg-meta">
              <div className="tg-meta-row"><span className="tg-meta-k">Versiya</span><span className="tg-meta-v"><Badge color="teal" size="sm">v2.4.1</Badge></span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Chiqarilgan</span><span className="tg-meta-v">2026-06-01</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">O'zgarishlar</span><span className="tg-meta-v">AI kanallar, qarzdorlar va hisob-kitob moduli</span></div>
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
