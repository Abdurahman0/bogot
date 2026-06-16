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

/* ======= USERS ======= */
function UsersPage() {
  const { data, t, upsert, remove, toast } = useApp();
  const loading = useLoading(420);
  const [q, setQ] = sysS("");
  const [roleFilter, setRoleFilter] = sysS("all");
  const [addOpen, setAddOpen] = sysS(false);
  const [editUser, setEditUser] = sysS(null);
  const [viewUser, setViewUser] = sysS(null);
  const [deleteUser, setDeleteUser] = sysS(null);
  const [viewPermissions, setViewPermissions] = sysS([]);
  const [viewRole, setViewRole] = sysS("operator");
  const [form, setForm] = sysS({ fullName: "", email: "", phone: "", role: "operator", region: "", status: "active", password: "" });
  const setF = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const ROLES_UZ = { developer: "Developer", admin: "Administrator", operator: "Operator" };
  const ROLE_COLORS = { developer: "violet", admin: "red", operator: "blue" };
  const ROLE_OPTIONS = ["developer", "admin", "operator"];

  React.useEffect(() => {
    if (!viewUser?.id) return;
    apiLoadUserPermissions(viewUser.id)
      .then(setViewPermissions)
      .catch(() => setViewPermissions(viewUser.permissions || []));
  }, [viewUser?.id]);

  React.useEffect(() => {
    setViewRole(viewUser?.rawRole || viewUser?.role || "operator");
  }, [viewUser]);

  const hasRegionField = sysM(
    () => data.users.some((u) => Object.prototype.hasOwnProperty.call(u || {}, "region")),
    [data.users]
  );

  const filtered = sysM(() => data.users.filter(u =>
    (roleFilter === "all" || u.role === roleFilter) &&
    (!q || u.fullName.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()))
  ), [data.users, roleFilter, q]);

  const openEdit = (u) => {
    setEditUser(u);
    setForm({ fullName: u.fullName, email: u.email, phone: u.phone, role: u.rawRole || u.role, region: u.region || "", status: u.status, password: "" });
    setAddOpen(true);
  };
  const saveUser = async () => {
    const nextRegion = String(form.region || "").trim();
    const payload = editUser
      ? { ...editUser, ...form, rawRole: form.role, ...(hasRegionField ? { region: nextRegion } : {}) }
      : { id: "U" + Date.now(), ...form, rawRole: form.role, ...(hasRegionField ? { region: nextRegion } : {}), avatarHue: Math.random() * 360, createdAt: new Date().toISOString(), completedSales: 0, activeLeads: 0 };
    await upsert("users", payload);
    toast(editUser ? "Foydalanuvchi yangilandi" : "Foydalanuvchi qo'shildi");
    setAddOpen(false);
    setEditUser(null);
    setForm({ fullName: "", email: "", phone: "", role: "operator", region: "", status: "active", password: "" });
  };
  const saveViewRole = async () => {
    if (!viewUser) return;
    const nextUser = { ...viewUser, role: viewRole, rawRole: viewRole };
    await upsert("users", nextUser);
    setViewUser(nextUser);
    toast("Foydalanuvchi roli yangilandi");
  };

  const stats = sysM(() => ({
    total: data.users.length,
    active: data.users.filter(u => u.status === "active").length,
    byRole: Object.fromEntries(ROLE_OPTIONS.map(r => [r, data.users.filter(u => u.role === r).length])),
  }), [data.users]);

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.users")} desc="Tizim foydalanuvchilarini boshqarish" crumbs={[{ label: "Tizim" }, { label: t("page.users") }]}
        actions={<Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => { setEditUser(null); setForm({ fullName: "", email: "", phone: "", role: "operator", region: "", status: "active", password: "" }); setAddOpen(true); }}>Foydalanuvchi qo'shish</Button>} />

      <div className="grid-kpi" style={{ marginBottom: 22 }}>
        <StatTile label="Jami" value={stats.total} />
        <StatTile label="Faol" value={stats.active} color="green" />
        {ROLE_OPTIONS.map(r => <StatTile key={r} label={ROLES_UZ[r]} value={stats.byRole[r]} color={ROLE_COLORS[r]} />)}
      </div>

      <Panel title="Foydalanuvchilar" icon="users" color="accent" pad={false}
        action={<div style={{ display: "flex", gap: 10 }}>
          <SearchInput value={q} onChange={setQ} placeholder="Qidirish..." width={200} />
          <FilterSelect value={roleFilter} onChange={setRoleFilter} options={[{ value: "all", label: "Barcha rollar" }, ...ROLE_OPTIONS.map(r => ({ value: r, label: ROLES_UZ[r] }))]} />
        </div>}>
        {loading ? <SkeletonRows rows={10} cols={6} /> : (
          <div className="tg-table-wrap">
            <table className="tg-table">
              <thead><tr><th>Foydalanuvchi</th><th>Rol</th>{hasRegionField && <th>Hudud</th>}<th>Holat</th><th>Savdolar</th><th>Qo'shilgan</th><th></th></tr></thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td><div style={{ display: "flex", alignItems: "center", gap: 10 }}><Avatar name={u.fullName} hue={u.avatarHue} size={32} /><div><div className="tg-cell-strong">{u.fullName}</div><div className="tg-cell-sub">{u.email}</div></div></div></td>
                    <td><Badge color={ROLE_COLORS[u.role]}>{ROLES_UZ[u.role]}</Badge></td>
                    {hasRegionField && <td>{u.region || "-"}</td>}
                    <td><StatusBadge status={u.status === "active" ? "active" : "inactive"} label={u.status === "active" ? "Faol" : "Nofaol"} /></td>
                    <td><Badge color="blue" size="sm">{u.completedSales}</Badge></td>
                    <td className="tg-cell-sub">{fmtDate(u.createdAt)}</td>
                    <td>
                      <div style={{ display: "flex", gap: 4 }}>
                        <IconButton icon={<I.eye size={15} />} label="Ko'rish" onClick={() => setViewUser(u)} />
                        <IconButton icon={<I.edit size={15} />} label="Tahrir" onClick={() => openEdit(u)} />
                        <IconButton icon={<I.trash size={15} />} label="O'chirish" onClick={() => { if (u.role !== "admin") setDeleteUser(u); else toast("Admin o'chirib bo'lmaydi"); }} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Panel>

      <Modal open={addOpen} onClose={() => { setAddOpen(false); setEditUser(null); }} title={editUser ? "Foydalanuvchini tahrirlash" : "Yangi foydalanuvchi"} icon={<I.user size={18} />} width={500}
        footer={<><Button variant="ghost" onClick={() => { setAddOpen(false); setEditUser(null); }}>Bekor</Button><Button variant="primary" onClick={saveUser}>{editUser ? "Saqlash" : "Qo'shish"}</Button></>}>
        <div style={{ display: "grid", gap: 14 }}>
          <Field label="To'liq ism" required><Input value={form.fullName} onChange={e => setF("fullName", e.target.value)} placeholder="Aziz Karimov" /></Field>
          <Field label="Email" required><Input value={form.email} onChange={e => setF("email", e.target.value)} placeholder="aziz@bogotarmadanrg.uz" type="email" /></Field>
          <Field label="Telefon"><Input value={form.phone} onChange={e => setF("phone", e.target.value)} placeholder="+998 90 123 45 67" /></Field>
          <Field label={editUser ? "Yangi parol" : "Parol"}><Input value={form.password} onChange={e => setF("password", e.target.value)} type="password" placeholder={editUser ? "O'zgartirmasangiz bo'sh qoldiring" : "Kamida 8 belgi"} /></Field>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Rol"><Select value={form.role} onChange={v => setF("role", v)} options={ROLE_OPTIONS.map(r => ({ value: r, label: ROLES_UZ[r] }))} /></Field>
            {hasRegionField && <Field label="Hudud"><Select value={form.region} onChange={v => setF("region", v)} options={["Toshkent", "Samarqand", "Namangan", "Andijon", "Farg'ona"].map(r => ({ value: r, label: r }))} /></Field>}
          </div>
          <Field label="Holat"><Select value={form.status} onChange={v => setF("status", v)} options={[{ value: "active", label: "Faol" }, { value: "inactive", label: "Nofaol" }]} /></Field>
        </div>
      </Modal>
      <Modal open={!!viewUser} onClose={() => setViewUser(null)} title="Foydalanuvchi ma'lumotlari" icon={<I.user size={18} />} width={460}
        footer={<>
          <Button variant="ghost" onClick={() => setViewUser(null)}>Bekor</Button>
          <Button variant="soft" icon={<I.edit size={14} />} onClick={() => {
            const current = viewUser;
            setViewUser(null);
            openEdit(current);
          }}>To'liq tahrir</Button>
          <Button variant="primary" onClick={saveViewRole}>Rolni saqlash</Button>
        </>}>
        {viewUser && (
          <div style={{ display: "grid", gap: 16 }}>
            <div className="tg-meta">
              <div className="tg-meta-row"><span className="tg-meta-k">Foydalanuvchi</span><span className="tg-meta-v">{viewUser.fullName}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Email</span><span className="tg-meta-v">{viewUser.email}</span></div>
              <div className="tg-meta-row"><span className="tg-meta-k">Telefon</span><span className="tg-meta-v">{viewUser.phone}</span></div>
              <div className="tg-meta-row" style={{ alignItems: "center" }}>
                <span className="tg-meta-k">Rol</span>
                <span className="tg-meta-v" style={{ minWidth: 180 }}>
                  <Select value={viewRole} onChange={setViewRole} options={ROLE_OPTIONS.map(r => ({ value: r, label: ROLES_UZ[r] }))} />
                </span>
              </div>
              {hasRegionField && viewUser.region ? <div className="tg-meta-row"><span className="tg-meta-k">Hudud</span><span className="tg-meta-v">{viewUser.region}</span></div> : null}
              <div className="tg-meta-row"><span className="tg-meta-k">Savdolar</span><span className="tg-meta-v">{viewUser.completedSales}</span></div>
            </div>
            <div>
              <div className="tg-section-title">Ruxsatlar</div>
              {(viewPermissions || []).length ? (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {viewPermissions.map((permission) => <Badge key={permission} color="blue" size="sm">{permissionLabelUz(permission)}</Badge>)}
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
        details={deleteUser ? `Email: ${deleteUser.email}\nRol: ${ROLES_UZ[deleteUser.role]}` : ""}
        confirmLabel="O'chirish"
        danger
      />
    </div>
  );
}

/* ======= ROLES ======= */
function RolesPage() {
  const { data, t } = useApp();
  const roles = data.roles || [];
  const permissions = data.permissionsAll?.length ? data.permissionsAll : data.permissions || [];
  const [selected, setSelected] = sysS(roles[0]?.key || "developer");

  React.useEffect(() => {
    if (!roles.length) return;
    if (!roles.find((role) => role.key === selected)) setSelected(roles[0].key);
  }, [roles, selected]);

  const moduleLabels = {
    dashboard: "Dashboard",
    audit_logs: "Audit",
    users: "Foydalanuvchilar",
    clients: "Mijozlar",
    accounting: "Hisob-kitob",
    products: "Mahsulotlar",
    chats: "Chat",
    integrations: "Integratsiyalar",
    ai: "AI",
  };
  const moduleIcons = {
    dashboard: "home",
    audit_logs: "clock",
    users: "users",
    clients: "users",
    accounting: "chart",
    products: "box",
    chats: "message",
    integrations: "link",
    ai: "robot",
  };
  const roleColors = { developer: "violet", admin: "red", operator: "blue" };
  const roleMap = Object.fromEntries(roles.map((role) => [role.key, role]));
  const selectedRole = roleMap[selected] || roles[0] || null;
  const permissionModules = Object.entries(
    permissions.reduce((acc, permission) => {
      const moduleKey = permission.module || "other";
      if (!acc[moduleKey]) acc[moduleKey] = [];
      acc[moduleKey].push(permission);
      return acc;
    }, {})
  );

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.roles")} desc="Backend rollari va default ruxsatlar" crumbs={[{ label: "Tizim" }, { label: t("page.roles") }]} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, marginBottom: 22 }}>
        {roles.map((role) => (
          <Card key={role.key} hover data-selected={selected === role.key ? "1" : undefined} onClick={() => setSelected(role.key)} style={{ cursor: "pointer", border: selected === role.key ? `2px solid var(--${roleColors[role.key] || "accent"})` : undefined }}>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <Badge color={roleColors[role.key] || "slate"}>{role.label || role.key}</Badge>
              <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{data.users.filter(u => u.rawRole === role.key || u.role === role.key).length} ta</span>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.5 }}>{(role.default_permissions || []).length} ta default ruxsat</div>
          </Card>
        ))}
      </div>

      <div className="grid-dash">
        <Panel title="Default ruxsatlar" icon="shield" color="violet">
          {selectedRole ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {(selectedRole.default_permissions || []).map((permission) => <Badge key={permission} color="blue" size="sm">{permissionLabelUz(permission)}</Badge>)}
            </div>
          ) : (
            <EmptyState icon={<I.lock size={22} />} title="Rollar topilmadi" message="Backend role ma'lumoti kelmadi." />
          )}
        </Panel>
        <Panel title="Modullar bo'yicha matritsa" icon="layers" color="green" pad={false}>
          <div className="tg-table-wrap">
            <table className="tg-table tg-matrix">
              <thead>
                <tr>
                  <th style={{ minWidth: 160 }}>Modul</th>
                  {roles.map((role) => <th key={role.key}><Badge color={roleColors[role.key] || "slate"} size="sm">{role.label || role.key}</Badge></th>)}
                </tr>
              </thead>
              <tbody>
                {permissionModules.map(([moduleKey, modulePermissions]) => {
                  const Ico = I[moduleIcons[moduleKey] || "box"];
                  return (
                    <tr key={moduleKey} data-highlighted={modulePermissions.some((permission) => (selectedRole?.default_permissions || []).includes(permission.key)) ? "1" : undefined}>
                      <td>
                        <div style={{ display: "flex", gap: 9, alignItems: "center" }}>
                          <span style={{ color: "var(--text-3)", display: "flex" }}><Ico size={14} /></span>
                          <span style={{ fontSize: 13 }}>{moduleLabels[moduleKey] || moduleKey}</span>
                        </div>
                      </td>
                      {roles.map((role) => {
                        const hasModule = modulePermissions.some((permission) => (role.default_permissions || []).includes(permission.key));
                        return (
                          <td key={role.key}>
                            <div style={{ display: "grid", placeItems: "center" }}>
                              {hasModule ? <I.checkCircle size={17} style={{ color: "var(--green)" }} /> : <I.x size={16} style={{ color: "var(--border)" }} />}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
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
      <PageHeader title={t("page.audit")} desc="Barcha tizim harakatlari jurnali" crumbs={[{ label: "Tizim" }, { label: t("page.audit") }]}
        actions={<ExportDropdown label="Hisobot" size="sm" filename="audit" rows={filtered} mapper={a => ({ Foydalanuvchi: a.userName, Harakat: a.action, Ob_yekt: a.entity, ID: a.entityId, Sana: fmtDate(a.createdAt) })} />} />

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
    { q: "Ruxsatlar qanday belgilanadi?", a: "Rollar sahifasida har bir rol uchun modul ruxsatlarini ko'rishingiz mumkin. Hozir 4 ta rol: Admin, Savdo, Operator va Moliya." },
    { q: "CSV eksport qanday amalga oshiriladi?", a: "Har bir jadval sahifasida 'Eksport' tugmasi mavjud. U joriy filtrga mos ma'lumotlarni CSV formatda yuklab beradi." },
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
window.RolesPage = RolesPage;
window.SettingsPage = SettingsPage;
window.NotificationsPage = NotificationsPage;
window.AuditPage = AuditPage;
window.IntegrationsPage = IntegrationsPage;
window.HelpPage = HelpPage;
