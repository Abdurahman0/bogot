/* pages/products.jsx */
const { useState: prS, useMemo: prM } = React;

const REVIEW_UZ = { verified: "Tasdiqlangan", "needs-review": "Tekshirish kerak", incomplete: "To'liqsiz" };
const makeProductImage = (image = {}, index = 0) => ({
  id: image.id || `img_${Date.now()}_${index}`,
  url: image.url || "",
  alt: image.alt || "",
  isPrimary: !!image.isPrimary,
});
const normalizeProductImages = (images = []) => {
  const base = (images || []).map((image, index) => makeProductImage(image, index));
  const ensured = base.length ? base : [makeProductImage({ isPrimary: true }, 0)];
  const primaryIndex = ensured.findIndex(image => image.isPrimary);
  return ensured.map((image, index) => ({ ...image, isPrimary: primaryIndex === -1 ? index === 0 : index === primaryIndex }));
};
window.REVIEW_UZ = REVIEW_UZ;

function ProductCard({ product: p, compact, onClick }) {
  const { nav } = useApp();
  const discount = p.previousPriceUzs ? Math.round((1 - p.priceUzs / p.previousPriceUzs) * 100) : 0;
  return (
    <Card hover pad={false} onClick={onClick || (() => nav("/products/" + p.id))}>
      <div style={{ position: "relative" }}>
        <ACUnit product={p} />
        {p.featured && <span style={{ position: "absolute", top: 10, left: 10 }}><Badge color="amber" size="sm"><I.star size={11} /> Tavsiya</Badge></span>}
        {discount > 0 && <span style={{ position: "absolute", top: 10, right: 10 }}><Badge color="red" size="sm">-{discount}%</Badge></span>}
      </div>
      <div style={{ padding: 14 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: BRAND_COLORS[p.brand] }}>{p.brand}</span>
          <Badge color={STATUS_COLORS[p.dataReviewStatus]} size="sm">{REVIEW_UZ[p.dataReviewStatus]}</Badge>
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>{p.model}</div>
        <div style={{ fontSize: 12, color: "var(--text-3)", margin: "6px 0 10px" }}>{p.category} • {p.powerKw} kW • {p.phaseCount} faza</div>
        {!compact && <div style={{ marginBottom: 12 }}><FeatureChips product={p} max={3} /></div>}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 8 }}>
          <div>
            <div style={{ fontWeight: 720, fontSize: 15 }}>{fmtUZS(p.priceUzs)}</div>
            {p.previousPriceUzs && <div style={{ fontSize: 11.5, color: "var(--text-3)", textDecoration: "line-through" }}>{fmtUZS(p.previousPriceUzs)}</div>}
          </div>
          <Badge color={p.stockQuantity === 0 ? "red" : p.stockQuantity < 5 ? "amber" : "green"} size="sm">{p.stockQuantity} dona</Badge>
        </div>
      </div>
    </Card>
  );
}
window.ProductCard = ProductCard;

function ProductsPage() {
  const { data, t, nav, toast, role, upsert, remove } = useApp();
  const loading = useLoading(320);
  const [view, setView] = prS("table");
  const [q, setQ] = prS("");
  const [fBrand, setFBrand] = prS([]);
  const [fCategory, setFCategory] = prS([]);
  const [fReview, setFReview] = prS([]);
  const [fStock, setFStock] = prS("all");
  const [reviewOpen, setReviewOpen] = prS(false);
  const [createOpen, setCreateOpen] = prS(false);
  const [viewProduct, setViewProduct] = prS(null);
  const [editProduct, setEditProduct] = prS(null);
  const [deleteProduct, setDeleteProduct] = prS(null);

  const categories = [...new Set(data.products.map(p => p.category))];
  const filtered = prM(() => data.products.filter(p => {
    const s = q.toLowerCase();
    if (q && !p.model.toLowerCase().includes(s) && !p.brand.toLowerCase().includes(s) && !p.sku.toLowerCase().includes(s)) return false;
    if (fBrand.length && !fBrand.includes(p.brand)) return false;
    if (fCategory.length && !fCategory.includes(p.category)) return false;
    if (fReview.length && !fReview.includes(p.dataReviewStatus)) return false;
    if (fStock === "in" && p.stockQuantity === 0) return false;
    if (fStock === "low" && p.stockQuantity > 4) return false;
    if (fStock === "out" && p.stockQuantity > 0) return false;
    return true;
  }), [data.products, q, fBrand, fCategory, fReview, fStock]);

  const needReview = data.products.filter(p => p.dataReviewStatus !== "verified");
  const columns = [
    { key: "name", label: "Mahsulot", sortVal: r => r.brand + r.model, render: r => (
      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
        <div style={{ width: 46, height: 38, flexShrink: 0 }}><ACUnit product={r} size="sm" /></div>
        <div><div className="tg-cell-strong">{r.model}</div><div className="tg-cell-sub">{r.sku}</div></div>
      </div>
    ) },
    { key: "brand", label: "Brend", sortVal: r => r.brand, render: r => <span style={{ fontWeight: 600, color: BRAND_COLORS[r.brand] }}>{r.brand}</span> },
    { key: "category", label: "Kategoriya", render: r => <Badge color="slate" size="sm">{r.category}</Badge> },
    { key: "power", label: "Quvvat", sortVal: r => r.powerKw, render: r => <span>{r.powerKw} kW</span> },
    { key: "yield", label: "Ishlab chiqarish", sortVal: r => r.monthlyYieldKwh, render: r => <span className="tg-cell-sub">{r.monthlyYieldKwh ? `${r.monthlyYieldKwh} kWh/oy` : "—"}</span> },
    { key: "price", label: "Narx", sortVal: r => r.priceUzs, render: r => <div><div style={{ fontWeight: 650 }}>{fmtUZS(r.priceUzs)}</div>{r.previousPriceUzs && <div style={{ fontSize: 11, textDecoration: "line-through", color: "var(--text-3)" }}>{fmtUZS(r.previousPriceUzs)}</div>}</div> },
    { key: "stock", label: "Qoldiq", sortVal: r => r.stockQuantity, render: r => <Badge color={r.stockQuantity === 0 ? "red" : r.stockQuantity < 5 ? "amber" : "green"} size="sm">{r.stockQuantity}</Badge> },
    { key: "review", label: "Tekshirish", render: r => <Badge color={STATUS_COLORS[r.dataReviewStatus]} size="sm" dot>{REVIEW_UZ[r.dataReviewStatus]}</Badge> },
    { key: "actions", label: "", width: 44, render: r => (
      <div onClick={e => e.stopPropagation()}>
        <Dropdown align="right" trigger={<IconButton icon={<I.dots size={16} />} label="Amallar" />} items={[
          { label: "Ko'rish", icon: <I.eye size={16} />, onClick: () => setViewProduct(r) },
          { label: "Tahrirlash", icon: <I.edit size={16} />, onClick: () => setEditProduct(r) },
          { divider: true },
          { label: "O'chirish", icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteProduct(r) },
        ]} />
      </div>
    ) },
  ];

  return (
    <div className="page fade-in">
      <PageHeader title={t("page.products")} desc={`${data.products.length} ta CRM mahsulotlari • ${needReview.length} ta tekshiruv kutmoqda`} crumbs={[{ label: "Katalog va moliya" }, { label: t("page.products") }]}
        actions={<>
          <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setCreateOpen(true)}>Yangi mahsulot</Button>
          {role === "admin" && <Button variant="default" size="sm" icon={<I.alert size={15} />} onClick={() => setReviewOpen(true)}>Tekshiruv navbati</Button>}
          <Button variant="default" size="sm" icon={<I.upload size={15} />} onClick={() => toast("Import oynasi tayyor emas, demo ma'lumot ishlatilmoqda")}>Import</Button>
          <Segmented value={view} onChange={setView} options={[{ value: "table", label: "Jadval", icon: <I.list size={14} /> }, { value: "grid", label: "Kartalar", icon: <I.grid size={14} /> }]} />
        </>} />

      <div className="toolbar">
        <SearchInput value={q} onChange={setQ} placeholder="Model, SKU, brend..." width={260} />
        <FilterSelect label="Brend" icon="tag" multi value={fBrand} onChange={setFBrand} options={BRANDS.map(b => ({ value: b, label: b }))} />
        <FilterSelect label="Kategoriya" icon="layers" multi value={fCategory} onChange={setFCategory} options={categories.map(c => ({ value: c, label: c }))} />
        <FilterSelect label="Tekshiruv" icon="alert" multi value={fReview} onChange={setFReview} options={Object.keys(REVIEW_UZ).map(k => ({ value: k, label: REVIEW_UZ[k] }))} />
        <FilterSelect label="Qoldiq" icon="box" value={fStock} onChange={setFStock} options={[{ value: "all", label: "Barchasi" }, { value: "in", label: "Mavjud" }, { value: "low", label: "Kam qolgan" }, { value: "out", label: "Tugagan" }]} />
        <div className="toolbar-spacer" />
        <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{filtered.length} natija</span>
      </div>

      {loading ? <SkeletonRows rows={10} cols={7} /> : (
        view === "table"
          ? <Card pad={false}><DataTable columns={columns} rows={filtered} onRowClick={r => setViewProduct(r)} pageSize={12} defaultSort={{ key: "power", dir: "asc" }} /></Card>
          : <div className="grid-3">{filtered.map(p => <ProductCard key={p.id} product={p} />)}</div>
      )}

      <ReviewQueueModal open={reviewOpen} onClose={() => setReviewOpen(false)} products={needReview} />
      <ProductFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
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
        message={`"${deleteProduct?.model || ""}" mahsulotini o'chirmoqchimisiz?`}
        details={deleteProduct ? `SKU: ${deleteProduct.sku}\nBrend: ${deleteProduct.brand}\nQuvvat: ${deleteProduct.powerKw} kW` : ""}
        confirmLabel="O'chirish"
        danger
      />
    </div>
  );
}
window.ProductsPage = ProductsPage;

function ProductViewModal({ open, onClose, onEdit, onDelete, product }) {
  if (!product) return null;
  return (
    <Modal open={open} onClose={onClose} title="Mahsulot ma'lumotlari" icon={<I.box size={18} />} width={620}
      footer={<>
        <Button variant="ghost" icon={<I.edit size={15} />} onClick={onEdit}>Tahrirlash</Button>
        <Button variant="danger" icon={<I.trash size={15} />} onClick={onDelete}>O'chirish</Button>
        <Button variant="primary" onClick={onClose}>Yopish</Button>
      </>}>
        <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: 18 }}>
          <div style={{ width: 160, height: 130 }}><ACUnit product={product} /></div>
        <div className="tg-meta">
          <div className="tg-meta-row"><span className="tg-meta-k">Model</span><span className="tg-meta-v">{product.model}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">SKU</span><span className="tg-meta-v">{product.sku}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Brend</span><span className="tg-meta-v">{product.brand}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Kategoriya</span><span className="tg-meta-v">{product.category}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Quvvat</span><span className="tg-meta-v">{product.powerKw} kW</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Narx</span><span className="tg-meta-v">{fmtUZS(product.priceUzs)}</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Qoldiq</span><span className="tg-meta-v">{product.stockQuantity} dona</span></div>
          <div className="tg-meta-row"><span className="tg-meta-k">Tekshiruv</span><span className="tg-meta-v">{REVIEW_UZ[product.dataReviewStatus]}</span></div>
        </div>
      </div>
      {(product.description || product.rawDescription) && (
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-soft)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>Tavsif</div>
          <div style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{product.description || product.rawDescription}</div>
        </div>
      )}
    </Modal>
  );
}

function ProductFormModal({ open, onClose, onSave, initial }) {
  const blank = {
    model: "",
    sku: "",
    brand: BRANDS[0],
    category: "",
    powerKw: 0,
    monthlyYieldKwh: 0,
    priceUzs: 0,
    stockQuantity: 0,
    dataReviewStatus: "verified",
    description: "",
    images: normalizeProductImages(),
    pictureFiles: [],
  };
  const [form, setForm] = prS(initial || blank);
  React.useEffect(() => {
    setForm(initial ? { ...initial, description: initial.description || initial.rawDescription || "", images: normalizeProductImages(initial.images), pictureFiles: [] } : blank);
  }, [initial, open]);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const setImage = (index, patch) => setForm(f => ({
    ...f,
    images: normalizeProductImages((f.images || []).map((image, imageIndex) => imageIndex === index ? { ...image, ...patch } : image)),
  }));
  const setPrimaryImage = (index) => setForm(f => ({
    ...f,
    images: normalizeProductImages((f.images || []).map((image, imageIndex) => ({ ...image, isPrimary: imageIndex === index }))),
  }));
  const addImage = () => setForm(f => ({
    ...f,
    images: normalizeProductImages([...(f.images || []), makeProductImage({}, (f.images || []).length)]),
  }));
  const removeImage = (index) => setForm(f => ({
    ...f,
    images: normalizeProductImages((f.images || []).filter((_, imageIndex) => imageIndex !== index)),
  }));
  return (
    <Modal open={open} onClose={onClose} title={initial ? "Mahsulotni tahrirlash" : "Yangi mahsulot"} icon={initial ? <I.edit size={18} /> : <I.plus size={18} />} width={560}
      footer={<><Button variant="ghost" onClick={onClose}>Bekor qilish</Button><Button variant="primary" onClick={async () => {
        const powerKw = +form.powerKw || 0;
        const monthlyYieldKwh = +form.monthlyYieldKwh || 0;
        const priceUzs = +form.priceUzs || 0;
        const stockQuantity = +form.stockQuantity || 0;
        const description = (form.description || "").trim();
        const images = normalizeProductImages(form.images);
        const payload = {
          ...form,
          id: form.id || `P${Date.now()}`,
          name: form.model,
          powerKw,
          monthlyYieldKwh,
          priceUzs,
          stockQuantity,
          phaseCount: form.phaseCount || (powerKw >= 20 ? 3 : 1),
          inverterPowerKw: form.inverterPowerKw ?? powerKw,
          batteryCapacityKwh: form.batteryCapacityKwh ?? 0,
          panelCount: form.panelCount ?? 0,
          panelPowerW: form.panelPowerW ?? 0,
          warrantyYears: form.warrantyYears ?? 10,
          installationDays: form.installationDays ?? 3,
          paybackYears: form.paybackYears ?? 4,
          previousPriceUzs: form.previousPriceUzs ?? null,
          installationFeeUzs: form.installationFeeUzs ?? 0,
          reservedQuantity: form.reservedQuantity ?? 0,
          featured: form.featured ?? false,
          mountType: form.mountType || "",
          series: form.series || "",
          status: form.status || "active",
          images,
          reviewIssues: form.reviewIssues || [],
          notes: form.notes || "",
          description,
          rawDescription: description,
          pictureFiles: form.pictureFiles || [],
          updatedAt: new Date().toISOString(),
          createdAt: form.createdAt || new Date().toISOString(),
        };
        await onSave(payload);
      }}>{initial ? "Saqlash" : "Yaratish"}</Button></>}>
      <div style={{ display: "grid", gap: 14 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Model"><Input value={form.model} onChange={e => set("model", e.target.value)} /></Field>
          <Field label="SKU"><Input value={form.sku} onChange={e => set("sku", e.target.value)} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Brend"><Select value={form.brand} onChange={v => set("brand", v)} options={BRANDS.map(v => ({ value: v, label: v }))} /></Field>
          <Field label="Kategoriya"><Input value={form.category} onChange={e => set("category", e.target.value)} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Quvvat (kW)"><Input type="number" value={form.powerKw} onChange={e => set("powerKw", e.target.value)} /></Field>
          <Field label="Ishlab chiqarish (kWh/oy)"><Input type="number" value={form.monthlyYieldKwh || 0} onChange={e => set("monthlyYieldKwh", e.target.value)} /></Field>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Narx"><Input type="number" value={form.priceUzs} onChange={e => set("priceUzs", e.target.value)} /></Field>
          <Field label="Qoldiq"><Input type="number" value={form.stockQuantity} onChange={e => set("stockQuantity", e.target.value)} /></Field>
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
                  onChange={(e) => set("pictureFiles", Array.from(e.target.files || []))}
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
                    <Field label="Rasm URL"><Input value={image.url || ""} onChange={e => setImage(index, { url: e.target.value })} placeholder="https://..." /></Field>
                    <Field label="Rasm nomi"><Input value={image.alt || ""} onChange={e => setImage(index, { alt: e.target.value })} placeholder="Mahsulot rasmi" /></Field>
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
        <Field label="Tavsif"><Textarea rows={5} value={form.description || ""} onChange={e => set("description", e.target.value)} placeholder="Mahsulot tavsifi, komplektatsiya va foydali izohlar..." /></Field>
        <Field label="Tekshiruv holati"><Select value={form.dataReviewStatus} onChange={v => set("dataReviewStatus", v)} options={Object.keys(REVIEW_UZ).map(v => ({ value: v, label: REVIEW_UZ[v] }))} /></Field>
      </div>
    </Modal>
  );
}
window.ProductFormModal = ProductFormModal;

function ReviewQueueModal({ open, onClose, products }) {
  const { update, toast } = useApp();
  return (
    <Modal open={open} onClose={onClose} title="Mahsulot tekshiruv navbati" icon={<I.alert size={18} />} width={640}>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {products.slice(0, 14).map(p => (
          <div key={p.id} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border-soft)" }}>
            <div style={{ width: 42, height: 42 }}><ACUnit product={p} size="sm" /></div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{p.model}</div>
              <div className="tg-cell-sub">{p.reviewIssues.join(", ") || "Yengil tekshiruv talab qilinadi"}</div>
            </div>
            <Button variant="soft" size="sm" onClick={() => { update("products", ps => ps.map(x => x.id === p.id ? { ...x, dataReviewStatus: "verified", reviewIssues: [] } : x)); toast("Tasdiqlandi: " + p.model); }}>Tasdiqlash</Button>
          </div>
        ))}
      </div>
    </Modal>
  );
}
