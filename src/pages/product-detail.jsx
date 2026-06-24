/* pages/product-detail.jsx */
const { useState: pdS } = React;
const PRODUCT_DETAIL_UI = {
  uz: {
    notFound: "Mahsulot topilmadi", backToCatalog: "Katalogga",
    categoriesBtn: "Kategoriyalar", deleteBtn: "O'chirish", editBtn: "Tahrirlash",
    activeLabel: "Faol", backendCard: "Backend mahsulot kartasi",
    statStock: "Qoldiq", statCreated: "Yaratilgan", statUpdated: "Yangilangan", statUnit: "dona",
    goToProducts: "Mahsulotlarga o'tish",
    tabDetails: "Tafsilotlar", tabDescription: "Tavsif", tabImages: "Rasmlar",
    metaName: "Nomi", metaCategory: "Kategoriya", metaPrice: "Narx",
    metaStock: "Qoldiq", metaCreated: "Yaratilgan", metaUpdated: "Yangilangan",
    noDescription: "Tavsif kiritilmagan", imageAltFallback: "Mahsulot rasmi",
    noImages: "Rasmlar yo'q",
    panelDescription: "Mahsulot tavsifi", noDescLong: "Mahsulot uchun tavsif kiritilmagan.",
    panelSimilar: "O'xshash mahsulotlar", noSimilar: "O'xshash mahsulot topilmadi",
    productUpdated: "Mahsulot yangilandi", productDeleted: "Mahsulot o'chirildi",
    deleteTitle: "Mahsulotni o'chirish", deleteMsg: '"{0}" mahsulotini o\'chirmoqchimisiz?',
    detailCategory: "Kategoriya:", detailPrice: "Narx:", detailStock: "Qoldiq:",
    nameFallback: "Mahsulot", categoryFallback: "Kategoriyasiz",
    catalogCrumb: "Katalog va moliya", deleteConfirm: "O'chirish",
  },
  ru: {
    notFound: "Товар не найден", backToCatalog: "В каталог",
    categoriesBtn: "Категории", deleteBtn: "Удалить", editBtn: "Редактировать",
    activeLabel: "Активный", backendCard: "Карточка товара из бэкенда",
    statStock: "Остаток", statCreated: "Создан", statUpdated: "Обновлён", statUnit: "шт",
    goToProducts: "Перейти к товарам",
    tabDetails: "Детали", tabDescription: "Описание", tabImages: "Изображения",
    metaName: "Название", metaCategory: "Категория", metaPrice: "Цена",
    metaStock: "Остаток", metaCreated: "Создан", metaUpdated: "Обновлён",
    noDescription: "Описание не указано", imageAltFallback: "Фото товара",
    noImages: "Нет изображений",
    panelDescription: "Описание товара", noDescLong: "Описание для товара не указано.",
    panelSimilar: "Похожие товары", noSimilar: "Похожих товаров не найдено",
    productUpdated: "Товар обновлён", productDeleted: "Товар удалён",
    deleteTitle: "Удалить товар", deleteMsg: 'Удалить товар "{0}"?',
    detailCategory: "Категория:", detailPrice: "Цена:", detailStock: "Остаток:",
    nameFallback: "Товар", categoryFallback: "Без категории",
    catalogCrumb: "Каталог и финансы", deleteConfirm: "Удалить",
  },
  en: {
    notFound: "Product not found", backToCatalog: "To catalog",
    categoriesBtn: "Categories", deleteBtn: "Delete", editBtn: "Edit",
    activeLabel: "Active", backendCard: "Backend product card",
    statStock: "Stock", statCreated: "Created", statUpdated: "Updated", statUnit: "pcs",
    goToProducts: "Go to products",
    tabDetails: "Details", tabDescription: "Description", tabImages: "Images",
    metaName: "Name", metaCategory: "Category", metaPrice: "Price",
    metaStock: "Stock", metaCreated: "Created", metaUpdated: "Updated",
    noDescription: "No description", imageAltFallback: "Product image",
    noImages: "No images",
    panelDescription: "Product description", noDescLong: "No description for this product.",
    panelSimilar: "Similar products", noSimilar: "No similar products found",
    productUpdated: "Product updated", productDeleted: "Product deleted",
    deleteTitle: "Delete product", deleteMsg: 'Delete product "{0}"?',
    detailCategory: "Category:", detailPrice: "Price:", detailStock: "Stock:",
    nameFallback: "Product", categoryFallback: "No category",
    catalogCrumb: "Catalog & finance", deleteConfirm: "Delete",
  },
};
function pdLang() { return window.__TG_LANG || "uz"; }
function pdTx(key) { return PRODUCT_DETAIL_UI[pdLang()]?.[key] || PRODUCT_DETAIL_UI.uz[key] || key; }

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
    return <div className="page"><Card><EmptyState title={pdTx("notFound")} action={<Button onClick={() => nav("/products")}>{pdTx("backToCatalog")}</Button>} /></Card></div>;
  }

  const name = window.productDisplayName ? window.productDisplayName(product) : (product.name || product.model || pdTx("nameFallback"));
  const category = window.productDisplayCategory ? window.productDisplayCategory(product) : (product.category || pdTx("categoryFallback"));
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
        crumbs={[{ label: pdTx("catalogCrumb") }, { label: t("page.products"), to: "/products" }, { label: name }]}
        title={name}
        actions={<>
          <Button variant="default" size="sm" icon={<I.layers size={15} />} onClick={() => setCategoryManagerOpen(true)}>{pdTx("categoriesBtn")}</Button>
          <Button variant="default" size="sm" icon={<I.trash size={15} />} onClick={() => setDeleteOpen(true)}>{pdTx("deleteBtn")}</Button>
          <Button variant="primary" size="sm" icon={<I.edit size={15} />} onClick={() => setEditOpen(true)}>{pdTx("editBtn")}</Button>
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
              <StatusBadge status="active" label={pdTx("activeLabel")} />
            </div>
            <h2 style={{ margin: "0 0 6px", fontSize: 19, fontWeight: 700 }}>{name}</h2>
            <div style={{ color: "var(--text-3)", fontSize: 13 }}>{pdTx("backendCard")}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "16px 0" }}>
              <span style={{ fontSize: 26, fontWeight: 760 }}>{fmtUZS(product.priceUzs)}</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <StatTile label={pdTx("statStock")} value={product.stockQuantity} color={product.stockQuantity < 5 ? "amber" : "green"} sub={pdTx("statUnit")} />
              <StatTile label={pdTx("statCreated")} value={product.createdAt ? fmtDate(product.createdAt, false) : "—"} />
              <StatTile label={pdTx("statUpdated")} value={product.updatedAt ? fmtDate(product.updatedAt, false) : "—"} />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Button variant="primary" full icon={<I.box size={16} />} onClick={() => nav("/products")}>{pdTx("goToProducts")}</Button>
            </div>
          </Card>

          <Card pad={false}>
            <div style={{ padding: "4px 12px", borderBottom: "1px solid var(--border)" }}>
              <Tabs size="sm" tabs={[{ value: "details", label: pdTx("tabDetails") }, { value: "description", label: pdTx("tabDescription") }, { value: "images", label: pdTx("tabImages") }]} active={tab} onChange={setTab} />
            </div>
            <div style={{ padding: 18 }}>
              {tab === "details" && (
                <div className="tg-meta">
                  <div className="tg-meta-row"><span className="tg-meta-k">{pdTx("metaName")}</span><span className="tg-meta-v">{name}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">{pdTx("metaCategory")}</span><span className="tg-meta-v">{category}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">{pdTx("metaPrice")}</span><span className="tg-meta-v">{fmtUZS(product.priceUzs)}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">{pdTx("metaStock")}</span><span className="tg-meta-v">{product.stockQuantity} {pdTx("statUnit")}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">{pdTx("metaCreated")}</span><span className="tg-meta-v">{product.createdAt ? fmtDate(product.createdAt, true) : "—"}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">{pdTx("metaUpdated")}</span><span className="tg-meta-v">{product.updatedAt ? fmtDate(product.updatedAt, true) : "—"}</span></div>
                </div>
              )}
              {tab === "description" && <div style={{ padding: 14, background: "var(--surface-2)", borderRadius: 10, fontSize: 13, lineHeight: 1.7, color: "var(--text-2)", border: "1px solid var(--border)" }}>{product.description || pdTx("noDescription")}</div>}
              {tab === "images" && (
                galleryImages.length ? (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {galleryImages.map((image) => (
                      <Card key={image.id} style={{ padding: 10 }}>
                        <ProductPhoto product={product} image={image} size="gallery" fit="contain" onClick={() => setPreviewImage(image)} />
                        <div className="tg-cell-sub" style={{ marginTop: 8 }}>{image.alt || pdTx("imageAltFallback")}</div>
                      </Card>
                    ))}
                  </div>
                ) : <EmptyState title={pdTx("noImages")} />
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid-2">
        <Panel title={pdTx("panelDescription")} icon="doc" color="blue">
          <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--text-2)" }}>
            {product.description || pdTx("noDescLong")}
          </div>
        </Panel>
        <Panel title={pdTx("panelSimilar")} subtitle={category} icon="layers" color="violet">
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
            {!similar.length && <EmptyState title={pdTx("noSimilar")} />}
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
          toast(pdTx("productUpdated"));
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
          toast(pdTx("productDeleted"));
          setDeleteOpen(false);
          nav("/products");
        }}
        title={pdTx("deleteTitle")}
        message={pdTx("deleteMsg").replace("{0}", name)}
        details={`${pdTx("detailCategory")} ${category}\n${pdTx("detailPrice")} ${fmtUZS(product.priceUzs)}\n${pdTx("detailStock")} ${product.stockQuantity} ${pdTx("statUnit")}`}
        confirmLabel={pdTx("deleteConfirm")}
        danger
      />
    </div>
  );
}

window.ProductDetailPage = ProductDetailPage;
