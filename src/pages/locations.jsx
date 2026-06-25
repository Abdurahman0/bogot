/* pages/locations.jsx - Districts and Neighborhoods management */
const { useState: locS, useMemo: locM } = React;

const LOC_UI = {
  uz: {
    districts: "Tumanlar", neighborhoods: "Mahallalar",
    newDistrict: "Yangi tuman", newNeighborhood: "Yangi mahalla",
    editDistrict: "Tumanni tahrirlash", editNeighborhood: "Mahallani tahrirlash",
    districtName: "Tuman nomi", neighborhoodName: "Mahalla nomi",
    selectDistrict: "Tuman tanlang", allDistricts: "Barcha tumanlar",
    districtAdded: "Tuman qo'shildi", districtUpdated: "Tuman yangilandi", districtDeleted: "Tuman o'chirildi",
    neighborhoodAdded: "Mahalla qo'shildi", neighborhoodUpdated: "Mahalla yangilandi", neighborhoodDeleted: "Mahalla o'chirildi",
    deleteDistrict: "Tumanni o'chirish", deleteNeighborhood: "Mahallani o'chirish",
    deleteDistrictMsg: "tuman va unga bog'liq mahallalar o'chiriladi. Davom etasizmi?",
    deleteNeighborhoodMsg: "mahalla o'chiriladi. Davom etasizmi?",
    save: "Saqlash", cancel: "Bekor qilish", delete: "O'chirish",
    edit: "Tahrirlash", actions: "Amallar", name: "Nomi",
    district: "Tuman", neighborhoodsCount: "Mahallalar",
    searchDistrict: "Tuman qidirish...", searchNeighborhood: "Mahalla qidirish...",
    emptyDistricts: "Tumanlar topilmadi", emptyNeighborhoods: "Mahallalar topilmadi",
    totalDistricts: "Jami tumanlar", totalNeighborhoods: "Jami mahallalar",
    pageDesc: "Tuman va mahallalarni boshqaring",
  },
  ru: {
    districts: "Районы", neighborhoods: "Махалли",
    newDistrict: "Новый район", newNeighborhood: "Новая махалля",
    editDistrict: "Редактировать район", editNeighborhood: "Редактировать махаллю",
    districtName: "Название района", neighborhoodName: "Название махалли",
    selectDistrict: "Выберите район", allDistricts: "Все районы",
    districtAdded: "Район добавлен", districtUpdated: "Район обновлён", districtDeleted: "Район удалён",
    neighborhoodAdded: "Махалля добавлена", neighborhoodUpdated: "Махалля обновлена", neighborhoodDeleted: "Махалля удалена",
    deleteDistrict: "Удалить район", deleteNeighborhood: "Удалить махаллю",
    deleteDistrictMsg: "район и его махалли будут удалены. Продолжить?",
    deleteNeighborhoodMsg: "махалля будет удалена. Продолжить?",
    save: "Сохранить", cancel: "Отмена", delete: "Удалить",
    edit: "Изменить", actions: "Действия", name: "Название",
    district: "Район", neighborhoodsCount: "Махалли",
    searchDistrict: "Поиск района...", searchNeighborhood: "Поиск махалли...",
    emptyDistricts: "Районы не найдены", emptyNeighborhoods: "Махалли не найдены",
    totalDistricts: "Всего районов", totalNeighborhoods: "Всего махаллей",
    pageDesc: "Управление районами и махаллями",
  },
  en: {
    districts: "Districts", neighborhoods: "Neighborhoods",
    newDistrict: "New district", newNeighborhood: "New neighborhood",
    editDistrict: "Edit district", editNeighborhood: "Edit neighborhood",
    districtName: "District name", neighborhoodName: "Neighborhood name",
    selectDistrict: "Select district", allDistricts: "All districts",
    districtAdded: "District added", districtUpdated: "District updated", districtDeleted: "District deleted",
    neighborhoodAdded: "Neighborhood added", neighborhoodUpdated: "Neighborhood updated", neighborhoodDeleted: "Neighborhood deleted",
    deleteDistrict: "Delete district", deleteNeighborhood: "Delete neighborhood",
    deleteDistrictMsg: "district and its neighborhoods will be deleted. Continue?",
    deleteNeighborhoodMsg: "neighborhood will be deleted. Continue?",
    save: "Save", cancel: "Cancel", delete: "Delete",
    edit: "Edit", actions: "Actions", name: "Name",
    district: "District", neighborhoodsCount: "Neighborhoods",
    searchDistrict: "Search districts...", searchNeighborhood: "Search neighborhoods...",
    emptyDistricts: "No districts found", emptyNeighborhoods: "No neighborhoods found",
    totalDistricts: "Total districts", totalNeighborhoods: "Total neighborhoods",
    pageDesc: "Manage districts and neighborhoods",
  },
};

function locLang() { return window.__TG_LANG || "uz"; }
function lx(key) { return LOC_UI[locLang()]?.[key] || LOC_UI.uz[key] || key; }

function LocationsPage() {
  const { data, t, upsert, remove, toast } = useApp();
  const loading = useLoading(300);
  const [tab, setTab] = locS("districts");
  const [districtQ, setDistrictQ] = locS("");
  const [neighborhoodQ, setNeighborhoodQ] = locS("");
  const [districtFilter, setDistrictFilter] = locS("all");

  const [districtModal, setDistrictModal] = locS(false);
  const [editDistrict, setEditDistrict] = locS(null);
  const [districtForm, setDistrictForm] = locS({ name: "" });
  const [deleteDistrict, setDeleteDistrict] = locS(null);

  const [neighborhoodModal, setNeighborhoodModal] = locS(false);
  const [editNeighborhood, setEditNeighborhood] = locS(null);
  const [neighborhoodForm, setNeighborhoodForm] = locS({ name: "", districtId: "" });
  const [deleteNeighborhood, setDeleteNeighborhood] = locS(null);

  const districts = data.districts || [];
  const neighborhoods = data.neighborhoods || [];

  const filteredDistricts = locM(() => {
    const q = districtQ.toLowerCase().trim();
    return districts.filter(d => !q || d.name.toLowerCase().includes(q));
  }, [districts, districtQ]);

  const filteredNeighborhoods = locM(() => {
    const q = neighborhoodQ.toLowerCase().trim();
    return neighborhoods.filter(n => {
      if (districtFilter !== "all" && n.district !== districtFilter) return false;
      if (q && !n.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [neighborhoods, neighborhoodQ, districtFilter]);

  const neighborhoodCountFor = (districtId) => neighborhoods.filter(n => n.district === districtId).length;
  const districtNameFor = (districtId) => districts.find(d => d.id === districtId)?.name || "—";

  const openCreateDistrict = () => {
    setEditDistrict(null);
    setDistrictForm({ name: "" });
    setDistrictModal(true);
  };

  const openEditDistrict = (d) => {
    setEditDistrict(d);
    setDistrictForm({ name: d.name });
    setDistrictModal(true);
  };

  const saveDistrict = async () => {
    if (!districtForm.name.trim()) return;
    await upsert("districts", { ...editDistrict, name: districtForm.name.trim() });
    toast(editDistrict ? lx("districtUpdated") : lx("districtAdded"));
    setDistrictModal(false);
    setEditDistrict(null);
  };

  const openCreateNeighborhood = () => {
    setEditNeighborhood(null);
    setNeighborhoodForm({ name: "", districtId: districtFilter !== "all" ? districtFilter : (districts[0]?.id || "") });
    setNeighborhoodModal(true);
  };

  const openEditNeighborhood = (n) => {
    setEditNeighborhood(n);
    setNeighborhoodForm({ name: n.name, districtId: n.district });
    setNeighborhoodModal(true);
  };

  const saveNeighborhood = async () => {
    if (!neighborhoodForm.name.trim() || !neighborhoodForm.districtId) return;
    await upsert("neighborhoods", {
      ...editNeighborhood,
      name: neighborhoodForm.name.trim(),
      districtId: neighborhoodForm.districtId,
      district: neighborhoodForm.districtId,
    });
    toast(editNeighborhood ? lx("neighborhoodUpdated") : lx("neighborhoodAdded"));
    setNeighborhoodModal(false);
    setEditNeighborhood(null);
  };

  const districtColumns = [
    { key: "name", label: lx("name"), sortVal: r => r.name, render: r => <span className="tg-cell-strong">{r.name}</span> },
    { key: "count", label: lx("neighborhoodsCount"), sortVal: r => neighborhoodCountFor(r.id), render: r => <Badge color="slate" size="sm">{neighborhoodCountFor(r.id)} ta</Badge> },
    { key: "actions", label: "", width: 44, render: r => (
      <div onClick={e => e.stopPropagation()}>
        <Dropdown align="right" trigger={<IconButton icon={<I.dots size={16} />} label={lx("actions")} />} items={[
          { label: lx("edit"), icon: <I.edit size={16} />, onClick: () => openEditDistrict(r) },
          { divider: true },
          { label: lx("delete"), icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteDistrict(r) },
        ]} />
      </div>
    ) },
  ];

  const neighborhoodColumns = [
    { key: "name", label: lx("name"), sortVal: r => r.name, render: r => <span className="tg-cell-strong">{r.name}</span> },
    { key: "district", label: lx("district"), sortVal: r => districtNameFor(r.district), render: r => <Badge color="blue" size="sm">{districtNameFor(r.district)}</Badge> },
    { key: "actions", label: "", width: 44, render: r => (
      <div onClick={e => e.stopPropagation()}>
        <Dropdown align="right" trigger={<IconButton icon={<I.dots size={16} />} label={lx("actions")} />} items={[
          { label: lx("edit"), icon: <I.edit size={16} />, onClick: () => openEditNeighborhood(r) },
          { divider: true },
          { label: lx("delete"), icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteNeighborhood(r) },
        ]} />
      </div>
    ) },
  ];

  const districtOptions = [{ value: "all", label: lx("allDistricts") }, ...districts.map(d => ({ value: d.id, label: d.name }))];

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.locations")} desc={lx("pageDesc")} crumbs={[{ label: "Katalog" }, { label: t("page.locations") }]}
        actions={tab === "districts"
          ? <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={openCreateDistrict}>{lx("newDistrict")}</Button>
          : <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={openCreateNeighborhood}>{lx("newNeighborhood")}</Button>
        } />

      <div className="grid-kpi" style={{ marginBottom: 18 }}>
        <StatTile label={lx("totalDistricts")} value={districts.length} color="blue" />
        <StatTile label={lx("totalNeighborhoods")} value={neighborhoods.length} color="violet" />
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        {[{ value: "districts", label: lx("districts"), count: districts.length, icon: <I.mapPin size={14} /> },
          { value: "neighborhoods", label: lx("neighborhoods"), count: neighborhoods.length, icon: <I.home size={14} /> }].map(chip => {
          const active = tab === chip.value;
          return (
            <button key={chip.value} type="button" onClick={() => setTab(chip.value)} style={{
              display: "inline-flex", alignItems: "center", gap: 8, borderRadius: 999,
              border: active ? "1px solid rgba(var(--accent-rgb), .35)" : "1px solid var(--border)",
              background: active ? "var(--accent-soft)" : "var(--surface)",
              color: active ? "var(--accent)" : "var(--text-2)",
              padding: "9px 14px", fontSize: 12.5, fontWeight: 700, cursor: "pointer", transition: "all .18s",
            }}>
              {chip.icon}<span>{chip.label}</span>
              <span style={{ minWidth: 22, height: 22, padding: "0 7px", borderRadius: 999, display: "inline-flex", alignItems: "center", justifyContent: "center",
                background: active ? "rgba(var(--accent-rgb), .14)" : "var(--surface-3)", color: active ? "var(--accent)" : "var(--text-3)", fontSize: 11.5, fontWeight: 700 }}>
                {chip.count}
              </span>
            </button>
          );
        })}
      </div>

      {tab === "districts" && (
        <>
          <div className="toolbar">
            <SearchInput value={districtQ} onChange={setDistrictQ} placeholder={lx("searchDistrict")} width={260} />
            <div className="toolbar-spacer" />
            <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{filteredDistricts.length} ta</span>
          </div>
          <Card pad={false}>
            {loading ? <SkeletonRows rows={8} cols={3} /> : filteredDistricts.length === 0
              ? <EmptyState icon={<I.mapPin size={26} />} title={lx("emptyDistricts")} />
              : <DataTable columns={districtColumns} rows={filteredDistricts} onRowClick={openEditDistrict} defaultSort={{ key: "name", dir: "asc" }} />}
          </Card>
        </>
      )}

      {tab === "neighborhoods" && (
        <>
          <div className="toolbar">
            <SearchInput value={neighborhoodQ} onChange={setNeighborhoodQ} placeholder={lx("searchNeighborhood")} width={260} />
            <FilterSelect label={lx("district")} icon="mapPin" value={districtFilter} onChange={setDistrictFilter} options={districtOptions} />
            <div className="toolbar-spacer" />
            <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{filteredNeighborhoods.length} ta</span>
          </div>
          <Card pad={false}>
            {loading ? <SkeletonRows rows={8} cols={3} /> : filteredNeighborhoods.length === 0
              ? <EmptyState icon={<I.home size={26} />} title={lx("emptyNeighborhoods")} />
              : <DataTable columns={neighborhoodColumns} rows={filteredNeighborhoods} onRowClick={openEditNeighborhood} defaultSort={{ key: "district", dir: "asc" }} />}
          </Card>
        </>
      )}

      {/* District modal */}
      <Modal open={districtModal} onClose={() => { setDistrictModal(false); setEditDistrict(null); }}
        title={editDistrict ? lx("editDistrict") : lx("newDistrict")} icon={<I.mapPin size={18} />} width={420}
        footer={<>
          <Button variant="ghost" onClick={() => { setDistrictModal(false); setEditDistrict(null); }}>{lx("cancel")}</Button>
          <Button variant="primary" onClick={saveDistrict}>{lx("save")}</Button>
        </>}>
        <Field label={lx("districtName")} required>
          <Input value={districtForm.name} onChange={e => setDistrictForm(f => ({ ...f, name: e.target.value }))} autoFocus />
        </Field>
      </Modal>

      {/* Neighborhood modal */}
      <Modal open={neighborhoodModal} onClose={() => { setNeighborhoodModal(false); setEditNeighborhood(null); }}
        title={editNeighborhood ? lx("editNeighborhood") : lx("newNeighborhood")} icon={<I.home size={18} />} width={420}
        footer={<>
          <Button variant="ghost" onClick={() => { setNeighborhoodModal(false); setEditNeighborhood(null); }}>{lx("cancel")}</Button>
          <Button variant="primary" onClick={saveNeighborhood}>{lx("save")}</Button>
        </>}>
        <div style={{ display: "grid", gap: 14 }}>
          <Field label={lx("district")} required>
            <Select value={neighborhoodForm.districtId} onChange={v => setNeighborhoodForm(f => ({ ...f, districtId: v }))}
              options={districts.map(d => ({ value: d.id, label: d.name }))} />
          </Field>
          <Field label={lx("neighborhoodName")} required>
            <Input value={neighborhoodForm.name} onChange={e => setNeighborhoodForm(f => ({ ...f, name: e.target.value }))} autoFocus />
          </Field>
        </div>
      </Modal>

      {/* Delete district */}
      <ConfirmDialog
        open={!!deleteDistrict}
        onClose={() => setDeleteDistrict(null)}
        onConfirm={async () => {
          await remove("districts", deleteDistrict.id);
          toast(lx("districtDeleted"));
          setDeleteDistrict(null);
        }}
        title={lx("deleteDistrict")}
        message={`"${deleteDistrict?.name || ""}" ${lx("deleteDistrictMsg")}`}
        confirmLabel={lx("delete")}
        danger
      />

      {/* Delete neighborhood */}
      <ConfirmDialog
        open={!!deleteNeighborhood}
        onClose={() => setDeleteNeighborhood(null)}
        onConfirm={async () => {
          await remove("neighborhoods", deleteNeighborhood.id);
          toast(lx("neighborhoodDeleted"));
          setDeleteNeighborhood(null);
        }}
        title={lx("deleteNeighborhood")}
        message={`"${deleteNeighborhood?.name || ""}" ${lx("deleteNeighborhoodMsg")}`}
        confirmLabel={lx("delete")}
        danger
      />
    </div>
  );
}
window.LocationsPage = LocationsPage;
