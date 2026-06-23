/* pages/product-detail.jsx */
const { useState: pdS } = React;

function ProductDetailPage({ id }) {
  const { data, t, nav, toast, upsert, remove } = useApp();
  const product = data.products.find((item) => item.id === id);
  const [activeImg, setActiveImg] = pdS(0);
  const [tab, setTab] = pdS("details");
  const [editOpen, setEditOpen] = pdS(false);
  const [deleteOpen, setDeleteOpen] = pdS(false);
  const [categoryManagerOpen, setCategoryManagerOpen] = pdS(false);
  const [previewImage, setPreviewImage] = pdS(null);

  if (!product) {
    return <div className="page"><Card><EmptyState title="Mahsulot topilmadi" action={<Button onClick={() => nav("/products")}>Katalogga</Button>} /></Card></div>;
  }

  const name = window.productDisplayName ? window.productDisplayName(product) : (product.name || product.model || "Mahsulot");
  const category = window.productDisplayCategory ? window.productDisplayCategory(product) : (product.category || "Kategoriyasiz");
  const galleryImages = productImages(product);
  const similar = data.products
    .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
    .slice(0, 4);

  React.useEffect(() => {
    if (!galleryImages.length) {
      setActiveImg(0);
      return;
    }
    if (activeImg > galleryImages.length - 1) setActiveImg(0);
  }, [activeImg, galleryImages.length]);

  return (
    <div className="page fade-in">
      <PageHeader
        crumbs={[{ label: "Katalog va moliya" }, { label: t("page.products"), to: "/products" }, { label: name }]}
        title={name}
        actions={<>
          <Button variant="default" size="sm" icon={<I.layers size={15} />} onClick={() => setCategoryManagerOpen(true)}>Kategoriyalar</Button>
          <Button variant="default" size="sm" icon={<I.trash size={15} />} onClick={() => setDeleteOpen(true)}>O'chirish</Button>
          <Button variant="primary" size="sm" icon={<I.edit size={15} />} onClick={() => setEditOpen(true)}>Tahrirlash</Button>
        </>}
      />

      <div className="grid-dash" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card pad={false}>
            <div style={{ padding: 18 }}>
              <div style={{ position: "relative" }}>
                <ProductPhoto product={product} image={galleryImages[activeImg] || galleryImages[0]} size="hero" fit="contain" onClick={() => galleryImages[activeImg] && setPreviewImage(galleryImages[activeImg])} />
                <span style={{ position: "absolute", top: 12, left: 12 }}><Badge color="slate">{category}</Badge></span>
              </div>
              <div className="tg-thumbs">
                {galleryImages.map((image, index) => (
                  <button key={image.id} className="tg-thumb" data-active={index === activeImg ? "1" : undefined} onClick={() => setActiveImg(index)}>
                    <ProductPhoto product={product} image={image} size="thumb" />
                    {image.isPrimary && <span className="tg-thumb-primary"><I.star size={9} /></span>}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Badge color="slate" size="sm">{category}</Badge>
              <StatusBadge status="active" label="Faol" />
            </div>
            <h2 style={{ margin: "0 0 6px", fontSize: 19, fontWeight: 700 }}>{name}</h2>
            <div style={{ color: "var(--text-3)", fontSize: 13 }}>Backend mahsulot kartasi</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "16px 0" }}>
              <span style={{ fontSize: 26, fontWeight: 760 }}>{fmtUZS(product.priceUzs)}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <StatTile label="Qoldiq" value={product.stockQuantity} color={product.stockQuantity < 5 ? "amber" : "green"} sub="dona" />
              <StatTile label="Yaratilgan" value={product.createdAt ? fmtDate(product.createdAt, false) : "—"} />
              <StatTile label="Yangilangan" value={product.updatedAt ? fmtDate(product.updatedAt, false) : "—"} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Button variant="primary" full icon={<I.box size={16} />} onClick={() => nav("/products")}>Mahsulotlarga o'tish</Button>
            </div>
          </Card>

          <Card pad={false}>
            <div style={{ padding: "4px 12px", borderBottom: "1px solid var(--border)" }}>
              <Tabs size="sm" tabs={[{ value: "details", label: "Tafsilotlar" }, { value: "description", label: "Tavsif" }, { value: "images", label: "Rasmlar" }]} active={tab} onChange={setTab} />
            </div>
            <div style={{ padding: 18 }}>
              {tab === "details" && (
                <div className="tg-meta">
                  <div className="tg-meta-row"><span className="tg-meta-k">Nomi</span><span className="tg-meta-v">{name}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">Kategoriya</span><span className="tg-meta-v">{category}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">Narx</span><span className="tg-meta-v">{fmtUZS(product.priceUzs)}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">Qoldiq</span><span className="tg-meta-v">{product.stockQuantity} dona</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">Yaratilgan</span><span className="tg-meta-v">{product.createdAt ? fmtDate(product.createdAt, true) : "—"}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">Yangilangan</span><span className="tg-meta-v">{product.updatedAt ? fmtDate(product.updatedAt, true) : "—"}</span></div>
                </div>
              )}
              {tab === "description" && <div style={{ padding: 14, background: "var(--surface-2)", borderRadius: 10, fontSize: 13, lineHeight: 1.7, color: "var(--text-2)", border: "1px solid var(--border)" }}>{product.description || "Tavsif kiritilmagan"}</div>}
              {tab === "images" && (
                galleryImages.length ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {galleryImages.map((image) => (
                      <Card key={image.id} style={{ padding: 10 }}>
                        <ProductPhoto product={product} image={image} size="gallery" fit="contain" onClick={() => setPreviewImage(image)} />
                        <div className="tg-cell-sub" style={{ marginTop: 8 }}>{image.alt || "Mahsulot rasmi"}</div>
                      </Card>
                    ))}
                  </div>
                ) : <EmptyState title="Rasmlar yo'q" />
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid-2">
        <Panel title="Mahsulot tavsifi" icon="doc" color="blue">
          <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--text-2)" }}>
            {product.description || "Mahsulot uchun tavsif kiritilmagan."}
          </div>
        </Panel>
        <Panel title="O'xshash mahsulotlar" subtitle={category} icon="layers" color="violet">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {similar.map((row) => (
              <div key={row.id} style={{ cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }} onClick={() => nav("/products/" + row.id)}>
                <ProductPhoto product={row} size="table" />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600 }}>{window.productDisplayName ? window.productDisplayName(row) : (row.name || row.model)}</div>
                  <div className="tg-cell-sub">{fmtUZS(row.priceUzs)}</div>
                </div>
              </div>
            ))}
            {!similar.length && <EmptyState title="O'xshash mahsulot topilmadi" />}
          </div>
        </Panel>
      </div>

      <ProductFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={product}
        onManageCategories={() => setCategoryManagerOpen(true)}
        onSave={async (nextProduct) => {
          await upsert("products", nextProduct);
          toast("Mahsulot yangilandi");
          setEditOpen(false);
        }}
      />
      <ProductCategoriesModal open={categoryManagerOpen} onClose={() => setCategoryManagerOpen(false)} />
      <ProductImageModal open={!!previewImage} onClose={() => setPreviewImage(null)} product={product} image={previewImage} />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await remove("products", product.id);
          toast("Mahsulot o'chirildi");
          setDeleteOpen(false);
          nav("/products");
        }}
        title="Mahsulotni o'chirish"
        message={`"${name}" mahsulotini o'chirmoqchimisiz?`}
        details={`Kategoriya: ${category}\nNarx: ${fmtUZS(product.priceUzs)}\nQoldiq: ${product.stockQuantity} dona`}
        confirmLabel="O'chirish"
        danger
      />
    </div>
  );
}

window.ProductDetailPage = ProductDetailPage;
