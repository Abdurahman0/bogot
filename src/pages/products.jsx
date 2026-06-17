/* pages/products.jsx */
const { useState: prS, useMemo: prM } = React;

const makeProductImage = (image = {}, index = 0) => ({
  id: image.id || `img_${Date.now()}_${index}`,
  url: image.url || "",
  alt: image.alt || "",
  isPrimary: !!image.isPrimary,
});

const normalizeProductImages = (images = []) => {
  const base = (images || []).map((image, index) => makeProductImage(image, index));
  const ensured = base.length ? base : [makeProductImage({ isPrimary: true }, 0)];
  const primaryIndex = ensured.findIndex((image) => image.isPrimary);
  return ensured.map((image, index) => ({ ...image, isPrimary: primaryIndex === -1 ? index === 0 : index === primaryIndex }));
};

function productCategoryCodeify(value) {
  return String(value || "")
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-zA-Z0-9_-]+/g, "")
    .replace(/^_+|_+$/g, "") || "product_category";
}

function productDescriptionPreview(value) {
  const text = String(value || "").trim();
  if (!text) return "Tavsif kiritilmagan";
  return text.length > 108 ? `${text.slice(0, 105)}...` : text;
}

function productDateLabel(value) {
  if (!value) return "—";
  return fmtDate(value, true);
}

function ProductCard({ product, onClick }) {
  const name = window.productDisplayName ? window.productDisplayName(product) : (product.name || product.model || "Mahsulot");
  const category = window.productDisplayCategory ? window.productDisplayCategory(product) : (product.category || "Kategoriyasiz");
  const stockColor = product.stockQuantity === 0 ? "red" : product.stockQuantity < 5 ? "amber" : "green";

  return (
    <Card hover pad={false} onClick={onClick}>
      <div style={{ position: "relative" }}>
        <ACUnit product={product} />
        <span style={{ position: "absolute", top: 10, left: 10 }}>
          <Badge color="slate" size="sm">{category}</Badge>
        </span>
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ fontWeight: 700, lineHeight: 1.35 }}>{name}</div>
        <div style={{ marginTop: 7, fontSize: 12.5, color: "var(--text-3)", lineHeight: 1.55 }}>
          {productDescriptionPreview(product.description)}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8, marginTop: 14 }}>
          <div>
            <div style={{ fontWeight: 760, fontSize: 15 }}>{fmtUZS(product.priceUzs)}</div>
            <div className="tg-cell-sub">Yangilangan: {productDateLabel(product.updatedAt)}</div>
          </div>
          <Badge color={stockColor} size="sm">{product.stockQuantity} dona</Badge>
        </div>
      </div>
    </Card>
  );
}
window.ProductCard = ProductCard;

function ProductsPage() {
  const { data, t, toast, upsert, remove } = useApp();
  const loading = useLoading(320);
  const [view, setView] = prS("table");
  const [q, setQ] = prS("");
  const [fCategory, setFCategory] = prS([]);
  const [fStock, setFStock] = prS("all");
  const [createOpen, setCreateOpen] = prS(false);
  const [categoryManagerOpen, setCategoryManagerOpen] = prS(false);
  const [viewProduct, setViewProduct] = prS(null);
  const [editProduct, setEditProduct] = prS(null);
  const [deleteProduct, setDeleteProduct] = prS(null);

  const categoryOptions = prM(() => (data.productCategories || [])
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name, "uz"))
    .map((category) => ({ value: category.id, label: category.name })), [data.productCategories]);

  const filtered = prM(() => data.products.filter((product) => {
    const name = (window.productDisplayName ? window.productDisplayName(product) : (product.name || product.model || "")).toLowerCase();
    const category = (window.productDisplayCategory ? window.productDisplayCategory(product) : (product.category || "")).toLowerCase();
    const description = String(product.description || "").toLowerCase();
    const search = q.toLowerCase().trim();
    if (search && !name.includes(search) && !category.includes(search) && !description.includes(search)) return false;
    if (fCategory.length && !fCategory.includes(product.categoryId)) return false;
    if (fStock === "in" && product.stockQuantity === 0) return false;
    if (fStock === "low" && (product.stockQuantity === 0 || product.stockQuantity > 4)) return false;
    if (fStock === "out" && product.stockQuantity > 0) return false;
    return true;
  }), [data.products, q, fCategory, fStock]);

  const columns = [
    {
      key: "name",
      label: "Mahsulot",
      sortVal: (row) => window.productDisplayName ? window.productDisplayName(row) : (row.name || row.model || ""),
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <div style={{ width: 46, height: 38, flexShrink: 0 }}><ACUnit product={row} size="sm" /></div>
          <div>
            <div className="tg-cell-strong">{window.productDisplayName ? window.productDisplayName(row) : (row.name || row.model)}</div>
            <div className="tg-cell-sub">{productDescriptionPreview(row.description)}</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: "Kategoriya",
      sortVal: (row) => window.productDisplayCategory ? window.productDisplayCategory(row) : (row.category || ""),
      render: (row) => <Badge color="slate" size="sm">{window.productDisplayCategory ? window.productDisplayCategory(row) : (row.category || "Kategoriyasiz")}</Badge>,
    },
    {
      key: "price",
      label: "Narx",
      sortVal: (row) => row.priceUzs,
      render: (row) => <span style={{ fontWeight: 700 }}>{fmtUZS(row.priceUzs)}</span>,
    },
    {
      key: "stock",
      label: "Qoldiq",
      sortVal: (row) => row.stockQuantity,
      render: (row) => <Badge color={row.stockQuantity === 0 ? "red" : row.stockQuantity < 5 ? "amber" : "green"} size="sm">{row.stockQuantity}</Badge>,
    },
    {
      key: "updatedAt",
      label: "Yangilangan",
      sortVal: (row) => row.updatedAt || row.createdAt || "",
      render: (row) => <span className="tg-cell-sub">{productDateLabel(row.updatedAt || row.createdAt)}</span>,
    },
    {
      key: "actions",
      label: "",
      width: 44,
      render: (row) => (
        <div onClick={(event) => event.stopPropagation()}>
          <Dropdown
            align="right"
            trigger={<IconButton icon={<I.dots size={16} />} label="Amallar" />}
            items={[
              { label: "Ko'rish", icon: <I.eye size={16} />, onClick: () => setViewProduct(row) },
              { label: "Tahrirlash", icon: <I.edit size={16} />, onClick: () => setEditProduct(row) },
              { divider: true },
              { label: "O'chirish", icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteProduct(row) },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="page fade-in">
      <PageHeader
        title={t("page.products")}
        desc={`${data.products.length} ta backend mahsuloti • ${(data.productCategories || []).length} ta kategoriya`}
        crumbs={[{ label: "Katalog va moliya" }, { label: t("page.products") }]}
        actions={<>
          <Button variant="default" size="sm" icon={<I.layers size={15} />} onClick={() => setCategoryManagerOpen(true)}>Kategoriyalar</Button>
          <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setCreateOpen(true)}>Yangi mahsulot</Button>
          <Segmented value={view} onChange={setView} options={[{ value: "table", label: "Jadval", icon: <I.list size={14} /> }, { value: "grid", label: "Kartalar", icon: <I.grid size={14} /> }]} />
        </>}
      />

      <div className="toolbar">
        <SearchInput value={q} onChange={setQ} placeholder="Mahsulot nomi, kategoriya, tavsif..." width={280} />
        <FilterSelect label="Kategoriya" icon="layers" multi value={fCategory} onChange={setFCategory} options={categoryOptions} />
        <FilterSelect label="Qoldiq" icon="box" value={fStock} onChange={setFStock} options={[{ value: "all", label: "Barchasi" }, { value: "in", label: "Mavjud" }, { value: "low", label: "Kam qolgan" }, { value: "out", label: "Tugagan" }]} />
        <div className="toolbar-spacer" />
        <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{filtered.length} natija</span>
      </div>

      {loading ? <SkeletonRows rows={10} cols={5} /> : (
        view === "table"
          ? <Card pad={false}><DataTable columns={columns} rows={filtered} onRowClick={(row) => setViewProduct(row)} pageSize={12} defaultSort={{ key: "updatedAt", dir: "desc" }} /></Card>
          : <div className="grid-3">{filtered.map((product) => <ProductCard key={product.id} product={product} onClick={() => setViewProduct(product)} />)}</div>
      )}

      <ProductFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onManageCategories={() => setCategoryManagerOpen(true)}
        onSave={async (product) => {
          await upsert("products", product);
          toast("Mahsulot yaratildi");
          setCreateOpen(false);
        }}
      />
      <ProductViewModal
        open={!!viewProduct}
        onClose={() => setViewProduct(null)}
        onEdit={() => { setEditProduct(viewProduct); setViewProduct(null); }}
        onDelete={() => { setDeleteProduct(viewProduct); setViewProduct(null); }}
        product={viewProduct}
      />
      <ProductFormModal
        open={!!editProduct}
        onClose={() => setEditProduct(null)}
        initial={editProduct}
        onManageCategories={() => setCategoryManagerOpen(true)}
        onSave={async (product) => {
          await upsert("products", product);
          toast("Mahsulot yangilandi");
          setEditProduct(null);
        }}
      />
      <ConfirmDialog
        open={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={async () => {
          await remove("products", deleteProduct.id);
          toast("Mahsulot o'chirildi");
          setDeleteProduct(null);
        }}
        title="Mahsulotni o'chirish"
        message={`"${window.productDisplayName ? window.productDisplayName(deleteProduct || {}) : (deleteProduct?.name || deleteProduct?.model || "")}" mahsulotini o'chirmoqchimisiz?`}
        details={deleteProduct ? `Kategoriya: ${window.productDisplayCategory ? window.productDisplayCategory(deleteProduct) : (deleteProduct.category || "Kategoriyasiz")}\nNarx: ${fmtUZS(deleteProduct.priceUzs)}\nQoldiq: ${deleteProduct.stockQuantity} dona` : ""}
        confirmLabel="O'chirish"
        danger
      />
      <ProductCategoriesModal open={categoryManagerOpen} onClose={() => setCategoryManagerOpen(false)} />
    </div>
  );
}
window.ProductsPage = ProductsPage;

function ProductViewModal({ open, onClose, onEdit, onDelete, product }) {
  if (!product) return null;
  const name = window.productDisplayName ? window.productDisplayName(product) : (product.name || product.model || "Mahsulot");
  const category = window.productDisplayCategory ? window.productDisplayCategory(product) : (product.category || "Kategoriyasiz");
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Mahsulot ma'lumotlari"
      icon={<I.box size={18} />}
      width={620}
      footer={<>
        <Button variant="ghost" icon={<I.edit size={15} />} onClick={onEdit}>Tahrirlash</Button>
        <Button variant="danger" icon={<I.trash size={15} />} onClick={onDelete}>O'chirish</Button>
        <Button variant="primary" onClick={onClose}>Yopish</Button>
      </>}
    >
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 18 }}>
        <div style={{ width: 160, height: 130 }}><ACUnit product={product} /></div>
        <div className="tg-meta">
          <div className="tg-meta-row"><span className="tg-meta-k">Nomi</span><span className="tg-meta-v">{name}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Kategoriya</span><span className="tg-meta-v">{category}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Narx</span><span className="tg-meta-v">{fmtUZS(product.priceUzs)}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Qoldiq</span><span className="tg-meta-v">{product.stockQuantity} dona</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Yaratilgan</span><span className="tg-meta-v">{productDateLabel(product.createdAt)}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Yangilangan</span><span className="tg-meta-v">{productDateLabel(product.updatedAt)}</span></div>
        </div>
      </div>
      <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-soft)" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>Tavsif</div>
        <div style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{product.description || "Tavsif kiritilmagan"}</div>
      </div>
    </Modal>
  );
}

function ProductFormModal({ open, onClose, onSave, initial, onManageCategories }) {
  const { data, toast } = useApp();
  const categoryOptions = prM(() => (data.productCategories || [])
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name, "uz"))
    .map((category) => ({ value: category.id, label: category.name })), [data.productCategories]);

  const blank = {
    name: "",
    categoryId: "",
    priceUzs: 0,
    stockQuantity: 0,
    description: "",
    images: normalizeProductImages(),
    pictureFiles: [],
  };

  const [form, setForm] = prS(blank);

  React.useEffect(() => {
    if (!open) return;
    setForm(initial ? {
      ...blank,
      ...initial,
      name: initial.name || initial.model || "",
      description: initial.description || "",
      categoryId: initial.categoryId || "",
      images: normalizeProductImages(initial.images),
      pictureFiles: [],
    } : blank);
  }, [initial, open]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));
  const setImage = (index, patch) => setForm((current) => ({
    ...current,
    images: normalizeProductImages((current.images || []).map((image, imageIndex) => imageIndex === index ? { ...image, ...patch } : image)),
  }));
  const setPrimaryImage = (index) => setForm((current) => ({
    ...current,
    images: normalizeProductImages((current.images || []).map((image, imageIndex) => ({ ...image, isPrimary: imageIndex === index }))),
  }));
  const addImage = () => setForm((current) => ({
    ...current,
    images: normalizeProductImages([...(current.images || []), makeProductImage({}, (current.images || []).length)]),
  }));
  const removeImage = (index) => setForm((current) => ({
    ...current,
    images: normalizeProductImages((current.images || []).filter((_, imageIndex) => imageIndex !== index)),
  }));

  const selectedCategory = (data.productCategories || []).find((category) => category.id === form.categoryId) || null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Mahsulotni tahrirlash" : "Yangi mahsulot"}
      icon={initial ? <I.edit size={18} /> : <I.plus size={18} />}
      width={580}
      footer={<>
        <Button variant="ghost" onClick={onClose}>Bekor qilish</Button>
        <Button
          variant="primary"
          onClick={async () => {
            const name = String(form.name || "").trim();
            if (!name) {
              toast("Mahsulot nomini kiriting", "error");
              return;
            }
            const payload = {
              ...form,
              id: form.id || `P${Date.now()}`,
              name,
              model: name,
              categoryId: selectedCategory?.id || form.categoryId || null,
              category: selectedCategory?.name || "",
              categoryName: selectedCategory?.name || "",
              categoryCode: selectedCategory?.code || "",
              priceUzs: apiParseNumber(form.priceUzs || 0),
              stockQuantity: apiParseNumber(form.stockQuantity || 0),
              description: String(form.description || "").trim(),
              images: normalizeProductImages(form.images),
              pictureFiles: form.pictureFiles || [],
              updatedAt: new Date().toISOString(),
              createdAt: form.createdAt || new Date().toISOString(),
            };
            await onSave(payload);
          }}
        >
          {initial ? "Saqlash" : "Yaratish"}
        </Button>
      </>}
    >
      <div style={{ display: "grid", gap: 14 }}>
        <Field label="Mahsulot nomi" required><Input value={form.name} onChange={(event) => set("name", event.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
          <Field label="Kategoriya">
            <Select
              value={form.categoryId}
              onChange={(value) => set("categoryId", value)}
              options={[{ value: "", label: "Tanlanmagan" }, ...categoryOptions]}
              placeholder="Kategoriyani tanlang"
            />
          </Field>
          <Button variant="default" size="sm" icon={<I.layers size={15} />} onClick={onManageCategories}>Boshqarish</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Narx"><Input type="number" value={form.priceUzs} onChange={(event) => set("priceUzs", event.target.value)} /></Field>
          <Field label="Qoldiq"><Input type="number" value={form.stockQuantity} onChange={(event) => set("stockQuantity", event.target.value)} /></Field>
        </div>
        <Field label="Rasmlar">
          <div style={{ display: "grid", gap: 10 }}>
            <Card style={{ padding: 12 }}>
              <Field label="Rasm fayllari">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="tg-input"
                  onChange={(event) => set("pictureFiles", Array.from(event.target.files || []))}
                />
              </Field>
              {(form.pictureFiles || []).length > 0 && (
                <div className="tg-cell-sub" style={{ marginTop: 8 }}>{form.pictureFiles.length} ta yangi rasm tanlandi</div>
              )}
            </Card>
            {(form.images || []).map((image, index) => (
              <Card key={image.id || index} style={{ padding: 12 }}>
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <Field label="Rasm URL"><Input value={image.url || ""} onChange={(event) => setImage(index, { url: event.target.value })} placeholder="https://..." /></Field>
                    <Field label="Rasm nomi"><Input value={image.alt || ""} onChange={(event) => setImage(index, { alt: event.target.value })} placeholder="Mahsulot rasmi" /></Field>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 64, height: 52 }}><ACUnit product={{ ...form, images: [image] }} size="sm" /></div>
                      <span className="tg-cell-sub">{image.isPrimary ? "Asosiy rasm" : "Qo'shimcha rasm"}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button variant={image.isPrimary ? "primary" : "default"} size="sm" icon={<I.star size={14} />} onClick={() => setPrimaryImage(index)}>Asosiy</Button>
                      <Button variant="danger" size="sm" icon={<I.trash size={14} />} onClick={() => removeImage(index)} disabled={(form.images || []).length <= 1}>O'chirish</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="default" size="sm" icon={<I.plus size={14} />} onClick={addImage}>Yana rasm qo'shish</Button>
          </div>
        </Field>
        <Field label="Tavsif"><Textarea rows={5} value={form.description || ""} onChange={(event) => set("description", event.target.value)} placeholder="Mahsulot tavsifi..." /></Field>
      </div>
    </Modal>
  );
}
window.ProductFormModal = ProductFormModal;

function ProductCategoryFormModal({ open, onClose, initial, onSave, count }) {
  const blank = { name: "", code: "", sortOrder: count + 1 };
  const [form, setForm] = prS(blank);
  const [codeTouched, setCodeTouched] = prS(false);

  React.useEffect(() => {
    if (!open) return;
    if (initial) {
      setForm({
        id: initial.id,
        name: initial.name || "",
        code: initial.code || "",
        sortOrder: initial.sortOrder || count + 1,
      });
      setCodeTouched(true);
      return;
    }
    setForm({ ...blank, sortOrder: count + 1 });
    setCodeTouched(false);
  }, [open, initial, count]);

  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Kategoriyani tahrirlash" : "Yangi kategoriya"}
      icon={initial ? <I.edit size={18} /> : <I.plus size={18} />}
      width={460}
      footer={<>
        <Button variant="ghost" onClick={onClose}>Bekor qilish</Button>
        <Button
          variant="primary"
          onClick={() => onSave({
            ...form,
            name: String(form.name || "").trim(),
            code: productCategoryCodeify(form.code || form.name),
            sortOrder: apiParseNumber(form.sortOrder || 0),
          })}
        >
          {initial ? "Saqlash" : "Yaratish"}
        </Button>
      </>}
    >
      <div style={{ display: "grid", gap: 14 }}>
        <Field label="Nomi" required>
          <Input
            value={form.name}
            onChange={(event) => {
              const nextName = event.target.value;
              set("name", nextName);
              if (!codeTouched) set("code", productCategoryCodeify(nextName));
            }}
          />
        </Field>
        <Field label="Code" hint="Bo'sh joylar avtomatik `_` ga o'zgaradi.">
          <Input
            value={form.code}
            onChange={(event) => {
              setCodeTouched(true);
              set("code", productCategoryCodeify(event.target.value));
            }}
          />
        </Field>
        <Field label="Tartib">
          <Input type="number" value={form.sortOrder} onChange={(event) => set("sortOrder", event.target.value)} />
        </Field>
      </div>
    </Modal>
  );
}

function ProductCategoriesModal({ open, onClose }) {
  const { data, upsert, remove, toast } = useApp();
  const [createOpen, setCreateOpen] = prS(false);
  const [editCategory, setEditCategory] = prS(null);
  const [deleteCategory, setDeleteCategory] = prS(null);

  const categories = prM(() => (data.productCategories || [])
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name, "uz")), [data.productCategories]);

  const saveCategory = async (category) => {
    if (!category.name) {
      toast("Kategoriya nomini kiriting", "error");
      return;
    }
    await upsert("productCategories", category);
    toast(editCategory ? "Kategoriya yangilandi" : "Kategoriya yaratildi");
    setCreateOpen(false);
    setEditCategory(null);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Mahsulot kategoriyalari"
      icon={<I.layers size={18} />}
      width={640}
      footer={<>
        <Button variant="default" icon={<I.plus size={15} />} onClick={() => setCreateOpen(true)}>Yangi kategoriya</Button>
        <Button variant="primary" onClick={onClose}>Yopish</Button>
      </>}
    >
      {categories.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {categories.map((category) => (
            <Card key={category.id} style={{ padding: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px" }}>
                <span style={{ width: 12, height: 12, borderRadius: 999, background: window.accentColorFromText ? window.accentColorFromText(category.name) : "var(--accent)", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="tg-cell-strong">{category.name}</div>
                  <div className="tg-cell-sub">Code: {category.code || "—"} • Tartib: {category.sortOrder || 0}</div>
                </div>
                <Dropdown
                  align="right"
                  trigger={<IconButton icon={<I.dots size={16} />} label="Kategoriya amallari" />}
                  items={[
                    { label: "Tahrirlash", icon: <I.edit size={16} />, onClick: () => setEditCategory(category) },
                    { divider: true },
                    { label: "O'chirish", icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteCategory(category) },
                  ]}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title="Kategoriyalar topilmadi" message="Mahsulotlar uchun avval kategoriya yarating." action={<Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setCreateOpen(true)}>Yangi kategoriya</Button>} />
      )}

      <ProductCategoryFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={saveCategory}
        count={categories.length}
      />
      <ProductCategoryFormModal
        open={!!editCategory}
        onClose={() => setEditCategory(null)}
        initial={editCategory}
        onSave={saveCategory}
        count={categories.length}
      />
      <ConfirmDialog
        open={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        onConfirm={async () => {
          await remove("productCategories", deleteCategory.id);
          toast("Kategoriya o'chirildi");
          setDeleteCategory(null);
        }}
        title="Kategoriyani o'chirish"
        message={`"${deleteCategory?.name || ""}" kategoriyasini o'chirmoqchimisiz?`}
        details={deleteCategory ? `Code: ${deleteCategory.code || "—"}\nTartib: ${deleteCategory.sortOrder || 0}` : ""}
        confirmLabel="O'chirish"
        danger
      />
    </Modal>
  );
}
