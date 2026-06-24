/* pages/products.jsx */
const { useState: prS, useMemo: prM, useEffect: prE } = React;

const PRODUCT_UI = {
  uz: {
    noDescription: "Tavsif kiritilmagan",
    product: "Mahsulot",
    category: "Kategoriya",
    uncategorized: "Kategoriyasiz",
    price: "Narx",
    stock: "Qoldiq",
    updated: "Yangilangan",
    updatedShort: "Yangilangan:",
    quantityUnit: "dona",
    actions: "Amallar",
    view: "Ko'rish",
    edit: "Tahrirlash",
    delete: "O'chirish",
    catalogFinance: "Katalog va moliya",
    productsDesc: "ta backend mahsuloti",
    categoriesDesc: "ta kategoriya",
    newProduct: "Yangi mahsulot",
    newCategory: "Yangi kategoriya",
    table: "Jadval",
    cards: "Kartalar",
    productSearch: "Mahsulot nomi, kategoriya, tavsif...",
    categorySearch: "Kategoriya nomi yoki code...",
    all: "Barchasi",
    available: "Mavjud",
    lowStock: "Kam qolgan",
    outOfStock: "Tugagan",
    results: "natija",
    productCreated: "Mahsulot yaratildi",
    productUpdated: "Mahsulot yangilandi",
    productDeleted: "Mahsulot o'chirildi",
    deleteProduct: "Mahsulotni o'chirish",
    deleteProductMessage: "mahsulotini o'chirmoqchimisiz?",
    categoryRequired: "Kategoriya nomini kiriting",
    categoryCreated: "Kategoriya yaratildi",
    categoryUpdated: "Kategoriya yangilandi",
    categoryDeleted: "Kategoriya o'chirildi",
    deleteCategory: "Kategoriyani o'chirish",
    deleteCategoryMessage: "kategoriyasini o'chirmoqchimisiz?",
    productDetails: "Mahsulot ma'lumotlari",
    created: "Yaratilgan",
    description: "Tavsif",
    editProduct: "Mahsulotni tahrirlash",
    save: "Saqlash",
    create: "Yaratish",
    productName: "Mahsulot nomi",
    unselected: "Tanlanmagan",
    chooseCategory: "Kategoriyani tanlang",
    manage: "Boshqarish",
    images: "Rasmlar",
    imageFiles: "Rasm fayllari",
    newImagesSelected: "ta yangi rasm tanlandi",
    imageUrl: "Rasm URL",
    imageName: "Rasm nomi",
    productImage: "Mahsulot rasmi",
    primaryImage: "Asosiy rasm",
    extraImage: "Qo'shimcha rasm",
    primary: "Asosiy",
    addAnotherImage: "Yana rasm qo'shish",
    productDescription: "Mahsulot tavsifi...",
    enterProductName: "Mahsulot nomini kiriting",
    editCategoryTitle: "Kategoriyani tahrirlash",
    categoryName: "Nomi",
    codeHint: "Bo'sh joylar avtomatik `_` ga o'zgaradi.",
    sortOrder: "Tartib",
    productCategories: "Mahsulot kategoriyalari",
    close: "Yopish",
    categoryActions: "Kategoriya amallari",
    categoriesNotFound: "Kategoriyalar topilmadi",
    createCategoryFirst: "Mahsulotlar uchun avval kategoriya yarating.",
    products: "Mahsulotlar",
  },
  ru: {
    noDescription: "Описание не указано",
    product: "Продукт",
    category: "Категория",
    uncategorized: "Без категории",
    price: "Цена",
    stock: "Остаток",
    updated: "Обновлено",
    updatedShort: "Обновлено:",
    quantityUnit: "шт",
    actions: "Действия",
    view: "Просмотр",
    edit: "Изменить",
    delete: "Удалить",
    catalogFinance: "Каталог и финансы",
    productsDesc: "товаров из backend",
    categoriesDesc: "категорий",
    newProduct: "Новый продукт",
    newCategory: "Новая категория",
    table: "Таблица",
    cards: "Карточки",
    productSearch: "Название продукта, категория, описание...",
    categorySearch: "Название категории или code...",
    all: "Все",
    available: "В наличии",
    lowStock: "Заканчивается",
    outOfStock: "Нет в наличии",
    results: "результат",
    productCreated: "Продукт создан",
    productUpdated: "Продукт обновлен",
    productDeleted: "Продукт удален",
    deleteProduct: "Удалить продукт",
    deleteProductMessage: "Удалить этот продукт?",
    categoryRequired: "Введите название категории",
    categoryCreated: "Категория создана",
    categoryUpdated: "Категория обновлена",
    categoryDeleted: "Категория удалена",
    deleteCategory: "Удалить категорию",
    deleteCategoryMessage: "Удалить эту категорию?",
    productDetails: "Данные продукта",
    created: "Создано",
    description: "Описание",
    editProduct: "Редактировать продукт",
    save: "Сохранить",
    create: "Создать",
    productName: "Название продукта",
    unselected: "Не выбрано",
    chooseCategory: "Выберите категорию",
    manage: "Управлять",
    images: "Изображения",
    imageFiles: "Файлы изображений",
    newImagesSelected: "новых изображений выбрано",
    imageUrl: "URL изображения",
    imageName: "Название изображения",
    productImage: "Изображение продукта",
    primaryImage: "Основное изображение",
    extraImage: "Дополнительное изображение",
    primary: "Основное",
    addAnotherImage: "Добавить еще изображение",
    productDescription: "Описание продукта...",
    enterProductName: "Введите название продукта",
    editCategoryTitle: "Редактировать категорию",
    categoryName: "Название",
    codeHint: "Пробелы автоматически заменяются на `_`.",
    sortOrder: "Порядок",
    productCategories: "Категории продуктов",
    close: "Закрыть",
    categoryActions: "Действия категории",
    categoriesNotFound: "Категории не найдены",
    createCategoryFirst: "Сначала создайте категорию для продуктов.",
    products: "Продукты",
  },
  en: {
    noDescription: "No description provided",
    product: "Product",
    category: "Category",
    uncategorized: "Uncategorized",
    price: "Price",
    stock: "Stock",
    updated: "Updated",
    updatedShort: "Updated:",
    quantityUnit: "pcs",
    actions: "Actions",
    view: "View",
    edit: "Edit",
    delete: "Delete",
    catalogFinance: "Catalog & Finance",
    productsDesc: "backend products",
    categoriesDesc: "categories",
    newProduct: "New product",
    newCategory: "New category",
    table: "Table",
    cards: "Cards",
    productSearch: "Product name, category, description...",
    categorySearch: "Category name or code...",
    all: "All",
    available: "Available",
    lowStock: "Low stock",
    outOfStock: "Out of stock",
    results: "results",
    productCreated: "Product created",
    productUpdated: "Product updated",
    productDeleted: "Product deleted",
    deleteProduct: "Delete product",
    deleteProductMessage: "Delete this product?",
    categoryRequired: "Enter a category name",
    categoryCreated: "Category created",
    categoryUpdated: "Category updated",
    categoryDeleted: "Category deleted",
    deleteCategory: "Delete category",
    deleteCategoryMessage: "Delete this category?",
    productDetails: "Product details",
    created: "Created",
    description: "Description",
    editProduct: "Edit product",
    save: "Save",
    create: "Create",
    productName: "Product name",
    unselected: "Not selected",
    chooseCategory: "Choose category",
    manage: "Manage",
    images: "Images",
    imageFiles: "Image files",
    newImagesSelected: "new images selected",
    imageUrl: "Image URL",
    imageName: "Image name",
    productImage: "Product image",
    primaryImage: "Primary image",
    extraImage: "Additional image",
    primary: "Primary",
    addAnotherImage: "Add another image",
    productDescription: "Product description...",
    enterProductName: "Enter product name",
    editCategoryTitle: "Edit category",
    categoryName: "Name",
    codeHint: "Spaces are automatically converted to `_`.",
    sortOrder: "Sort order",
    productCategories: "Product categories",
    close: "Close",
    categoryActions: "Category actions",
    categoriesNotFound: "No categories found",
    createCategoryFirst: "Create a category for products first.",
    products: "Products",
  },
};

function productLang() {
  return window.__TG_LANG || "uz";
}

function ptx(key) {
  const lang = productLang();
  return PRODUCT_UI[lang]?.[key] || PRODUCT_UI.uz[key] || key;
}

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
  if (!text) return ptx("noDescription");
  return text.length > 108 ? `${text.slice(0, 105)}...` : text;
}

function productDateLabel(value) {
  if (!value) return "—";
  return fmtDate(value, true);
}

function ProductCard({ product, onClick }) {
  const name = window.productDisplayName ? window.productDisplayName(product) : (product.name || product.model || ptx("product"));
  const category = window.productDisplayCategory ? window.productDisplayCategory(product) : (product.category || ptx("uncategorized"));
  const stockColor = product.stockQuantity === 0 ? "red" : product.stockQuantity < 5 ? "amber" : "green";

  return (
    <Card hover pad={false} onClick={onClick}>
      <div style={{ position: "relative" }}>
        <ProductPhoto product={product} size="card" />
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
            <div className="tg-cell-sub">{ptx("updatedShort")} {productDateLabel(product.updatedAt)}</div>
          </div>
          <Badge color={stockColor} size="sm">{product.stockQuantity} {ptx("quantityUnit")}</Badge>
        </div>
      </div>
    </Card>
  );
}
window.ProductCard = ProductCard;

function ProductsPage() {
  const { data, t, toast, upsert, remove } = useApp();
  const loading = useLoading(320);
  const [section, setSection] = prS("products");
  const [view, setView] = prS("table");
  const [q, setQ] = prS("");
  const [fCategory, setFCategory] = prS([]);
  const [fStock, setFStock] = prS("all");
  const [createOpen, setCreateOpen] = prS(false);
  const [createCategoryOpen, setCreateCategoryOpen] = prS(false);
  const [viewProduct, setViewProduct] = prS(null);
  const [editProduct, setEditProduct] = prS(null);
  const [deleteProduct, setDeleteProduct] = prS(null);
  const [editCategory, setEditCategory] = prS(null);
  const [deleteCategory, setDeleteCategory] = prS(null);

  const categoryOptions = prM(() => (data.productCategories || [])
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name, "uz"))
    .map((category) => ({ value: category.id, label: category.name })), [data.productCategories]);
  const categories = prM(() => (data.productCategories || [])
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name, "uz")), [data.productCategories]);

  prE(() => {
    setQ("");
    setFCategory([]);
    setFStock("all");
  }, [section]);

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
  const filteredCategories = prM(() => categories.filter((category) => {
    const search = q.toLowerCase().trim();
    if (!search) return true;
    return [category.name, category.code, String(category.sortOrder || "")]
      .some((value) => String(value || "").toLowerCase().includes(search));
  }), [categories, q]);

  const columns = [
    {
      key: "name",
      label: ptx("product"),
      sortVal: (row) => window.productDisplayName ? window.productDisplayName(row) : (row.name || row.model || ""),
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
          <ProductPhoto product={row} size="table" />
          <div>
            <div className="tg-cell-strong">{window.productDisplayName ? window.productDisplayName(row) : (row.name || row.model)}</div>
            <div className="tg-cell-sub">{productDescriptionPreview(row.description)}</div>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      label: ptx("category"),
      sortVal: (row) => window.productDisplayCategory ? window.productDisplayCategory(row) : (row.category || ""),
      render: (row) => <Badge color="slate" size="sm">{window.productDisplayCategory ? window.productDisplayCategory(row) : (row.category || ptx("uncategorized"))}</Badge>,
    },
    {
      key: "price",
      label: ptx("price"),
      sortVal: (row) => row.priceUzs,
      render: (row) => <span style={{ fontWeight: 700 }}>{fmtUZS(row.priceUzs)}</span>,
    },
    {
      key: "stock",
      label: ptx("stock"),
      sortVal: (row) => row.stockQuantity,
      render: (row) => <Badge color={row.stockQuantity === 0 ? "red" : row.stockQuantity < 5 ? "amber" : "green"} size="sm">{row.stockQuantity}</Badge>,
    },
    {
      key: "updatedAt",
      label: ptx("updated"),
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
            trigger={<IconButton icon={<I.dots size={16} />} label={ptx("actions")} />}
            items={[
              { label: ptx("view"), icon: <I.eye size={16} />, onClick: () => setViewProduct(row) },
              { label: ptx("edit"), icon: <I.edit size={16} />, onClick: () => setEditProduct(row) },
              { divider: true },
              { label: ptx("delete"), icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteProduct(row) },
            ]}
          />
        </div>
      ),
    },
  ];
  const categoryColumns = [
    {
      key: "name",
      label: ptx("category"),
      sortVal: (row) => row.name,
      render: (row) => (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ width: 12, height: 12, borderRadius: 999, background: window.accentColorFromText ? window.accentColorFromText(row.name) : "var(--accent)", flexShrink: 0 }} />
          <div>
            <div className="tg-cell-strong">{row.name}</div>
            <div className="tg-cell-sub">Code: {row.code || "—"}</div>
          </div>
        </div>
      ),
    },
    {
      key: "sortOrder",
      label: ptx("sortOrder"),
      sortVal: (row) => Number(row.sortOrder || 0),
      render: (row) => <span>{row.sortOrder || 0}</span>,
    },
    {
      key: "products",
      label: ptx("products"),
      sortVal: (row) => data.products.filter((product) => product.categoryId === row.id).length,
      render: (row) => <Badge color="slate" size="sm">{data.products.filter((product) => product.categoryId === row.id).length} {ptx("quantityUnit")}</Badge>,
    },
    {
      key: "actions",
      label: "",
      width: 44,
      render: (row) => (
        <div onClick={(event) => event.stopPropagation()}>
          <Dropdown
            align="right"
            trigger={<IconButton icon={<I.dots size={16} />} label={ptx("actions")} />}
            items={[
              { label: ptx("edit"), icon: <I.edit size={16} />, onClick: () => setEditCategory(row) },
              { divider: true },
              { label: ptx("delete"), icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteCategory(row) },
            ]}
          />
        </div>
      ),
    },
  ];

  const saveCategory = async (category) => {
    if (!category.name) {
      toast(ptx("categoryRequired"), "error");
      return;
    }
    await upsert("productCategories", category);
    toast(editCategory ? ptx("categoryUpdated") : ptx("categoryCreated"));
    setCreateCategoryOpen(false);
    setEditCategory(null);
  };

  return (
    <div className="page fade-in">
      <PageHeader
        title={t("page.products")}
        desc={`${data.products.length} ${ptx("productsDesc")} • ${(data.productCategories || []).length} ${ptx("categoriesDesc")}`}
        crumbs={[{ label: t("nav.catalog") }, { label: t("page.products") }]}
        actions={<>
          <div className="tg-chips">
            <Button variant={section === "products" ? "primary" : "ghost"} size="sm" icon={<I.box size={15} />} onClick={() => setSection("products")}>{ptx("products")}</Button>
            <Button variant={section === "categories" ? "primary" : "ghost"} size="sm" icon={<I.layers size={15} />} onClick={() => setSection("categories")}>{ptx("productCategories")}</Button>
          </div>
          {section === "products" ? (
            <>
              <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setCreateOpen(true)}>{ptx("newProduct")}</Button>
              <Segmented value={view} onChange={setView} options={[{ value: "table", label: ptx("table"), icon: <I.list size={14} /> }, { value: "grid", label: ptx("cards"), icon: <I.grid size={14} /> }]} />
            </>
          ) : (
            <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setCreateCategoryOpen(true)}>{ptx("newCategory")}</Button>
          )}
        </>}
      />

      <div className="toolbar">
        <SearchInput value={q} onChange={setQ} placeholder={section === "products" ? ptx("productSearch") : ptx("categorySearch")} width={280} />
        {section === "products" && <FilterSelect label={ptx("category")} icon="layers" multi value={fCategory} onChange={setFCategory} options={categoryOptions} />}
        {section === "products" && <FilterSelect label={ptx("stock")} icon="box" value={fStock} onChange={setFStock} options={[{ value: "all", label: ptx("all") }, { value: "in", label: ptx("available") }, { value: "low", label: ptx("lowStock") }, { value: "out", label: ptx("outOfStock") }]} />}
        <div className="toolbar-spacer" />
        <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{section === "products" ? filtered.length : filteredCategories.length} {ptx("results")}</span>
      </div>

      {loading ? <SkeletonRows rows={10} cols={5} /> : section === "products" ? (
        view === "table"
          ? <Card pad={false}><DataTable columns={columns} rows={filtered} onRowClick={(row) => setViewProduct(row)} pageSize={12} defaultSort={{ key: "updatedAt", dir: "desc" }} /></Card>
          : <div className="grid-3">{filtered.map((product) => <ProductCard key={product.id} product={product} onClick={() => setViewProduct(product)} />)}</div>
      ) : (
        <Card pad={false}><DataTable columns={categoryColumns} rows={filteredCategories} onRowClick={(row) => setEditCategory(row)} pageSize={12} defaultSort={{ key: "sortOrder", dir: "asc" }} /></Card>
      )}

      <ProductFormModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onManageCategories={() => { setSection("categories"); setCreateCategoryOpen(true); }}
        onSave={async (product) => {
          await upsert("products", product);
          toast(ptx("productCreated"));
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
        onManageCategories={() => { setSection("categories"); setCreateCategoryOpen(true); }}
        onSave={async (product) => {
          await upsert("products", product);
          toast(ptx("productUpdated"));
          setEditProduct(null);
        }}
      />
      <ConfirmDialog
        open={!!deleteProduct}
        onClose={() => setDeleteProduct(null)}
        onConfirm={async () => {
          await remove("products", deleteProduct.id);
          toast(ptx("productDeleted"));
          setDeleteProduct(null);
        }}
        title={ptx("deleteProduct")}
        message={productLang() === "uz" ? `"${window.productDisplayName ? window.productDisplayName(deleteProduct || {}) : (deleteProduct?.name || deleteProduct?.model || "")}" ${ptx("deleteProductMessage")}` : ptx("deleteProductMessage")}
        details={deleteProduct ? `${ptx("category")}: ${window.productDisplayCategory ? window.productDisplayCategory(deleteProduct) : (deleteProduct.category || ptx("uncategorized"))}\n${ptx("price")}: ${fmtUZS(deleteProduct.priceUzs)}\n${ptx("stock")}: ${deleteProduct.stockQuantity} ${ptx("quantityUnit")}` : ""}
        confirmLabel={ptx("delete")}
        danger
      />
      <ProductCategoryFormModal
        open={createCategoryOpen}
        onClose={() => setCreateCategoryOpen(false)}
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
          toast(ptx("categoryDeleted"));
          setDeleteCategory(null);
        }}
        title={ptx("deleteCategory")}
        message={productLang() === "uz" ? `"${deleteCategory?.name || ""}" ${ptx("deleteCategoryMessage")}` : ptx("deleteCategoryMessage")}
        details={deleteCategory ? `Code: ${deleteCategory.code || "—"}\n${ptx("sortOrder")}: ${deleteCategory.sortOrder || 0}` : ""}
        confirmLabel={ptx("delete")}
        danger
      />
    </div>
  );
}
window.ProductsPage = ProductsPage;

function ProductViewModal({ open, onClose, onEdit, onDelete, product }) {
  const [previewImage, setPreviewImage] = prS(null);
  if (!product) return null;
  const name = window.productDisplayName ? window.productDisplayName(product) : (product.name || product.model || ptx("product"));
  const category = window.productDisplayCategory ? window.productDisplayCategory(product) : (product.category || ptx("uncategorized"));
  const images = productImages(product);
  return (
    <>
      <Modal
        open={open}
        onClose={onClose}
        title={ptx("productDetails")}
        icon={<I.box size={18} />}
        width={760}
        footer={<>
          <Button variant="ghost" icon={<I.edit size={15} />} onClick={onEdit}>{ptx("edit")}</Button>
          <Button variant="danger" icon={<I.trash size={15} />} onClick={onDelete}>{ptx("delete")}</Button>
          <Button variant="primary" onClick={onClose}>{ptx("close")}</Button>
        </>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 18 }}>
          <ProductPhoto product={product} size="view" fit="contain" onClick={() => images[0] && setPreviewImage(images[0])} />
          <div className="tg-meta">
            <div className="tg-meta-row"><span className="tg-meta-k">{ptx("productName")}</span><span className="tg-meta-v">{name}</span></div>
            <div className="tg-meta-row"><span className="tg-meta-k">{ptx("category")}</span><span className="tg-meta-v">{category}</span></div>
            <div className="tg-meta-row"><span className="tg-meta-k">{ptx("price")}</span><span className="tg-meta-v">{fmtUZS(product.priceUzs)}</span></div>
            <div className="tg-meta-row"><span className="tg-meta-k">{ptx("stock")}</span><span className="tg-meta-v">{product.stockQuantity} {ptx("quantityUnit")}</span></div>
            <div className="tg-meta-row"><span className="tg-meta-k">{ptx("created")}</span><span className="tg-meta-v">{productDateLabel(product.createdAt)}</span></div>
            <div className="tg-meta-row"><span className="tg-meta-k">{ptx("updated")}</span><span className="tg-meta-v">{productDateLabel(product.updatedAt)}</span></div>
          </div>
        </div>
        {images.length > 1 && (
          <div className="product-preview-grid">
            {images.map((image) => (
              <ProductPhoto key={image.id} product={product} image={image} size="thumb" fit="cover" onClick={() => setPreviewImage(image)} />
            ))}
          </div>
        )}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border-soft)" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--text-3)", textTransform: "uppercase", letterSpacing: 0.4, marginBottom: 8 }}>{ptx("description")}</div>
          <div style={{ fontSize: 13.5, color: "var(--text-2)", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{product.description || ptx("noDescription")}</div>
        </div>
      </Modal>
      <ProductImageModal open={!!previewImage} onClose={() => setPreviewImage(null)} product={product} image={previewImage} />
    </>
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
      title={initial ? ptx("editProduct") : ptx("newProduct")}
      icon={initial ? <I.edit size={18} /> : <I.plus size={18} />}
      width={580}
      footer={<>
        <Button variant="ghost" onClick={onClose}>{window.TRANSLATIONS?.[productLang()]?.["common.cancel"] || "Bekor qilish"}</Button>
        <Button
          variant="primary"
          onClick={async () => {
            const name = String(form.name || "").trim();
            if (!name) {
              toast(ptx("enterProductName"), "error");
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
          {initial ? ptx("save") : ptx("create")}
        </Button>
      </>}
    >
      <div style={{ display: "grid", gap: 14 }}>
        <Field label={ptx("productName")} required><Input value={form.name} onChange={(event) => set("name", event.target.value)} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10, alignItems: "end" }}>
          <Field label={ptx("category")}>
            <Select
              value={form.categoryId}
              onChange={(value) => set("categoryId", value)}
              options={[{ value: "", label: ptx("unselected") }, ...categoryOptions]}
              placeholder={ptx("chooseCategory")}
            />
          </Field>
          <Button variant="default" size="sm" icon={<I.layers size={15} />} onClick={onManageCategories}>{ptx("manage")}</Button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label={ptx("price")}><Input type="number" value={form.priceUzs} onChange={(event) => set("priceUzs", event.target.value)} /></Field>
          <Field label={ptx("stock")}><Input type="number" value={form.stockQuantity} onChange={(event) => set("stockQuantity", event.target.value)} /></Field>
        </div>
        <Field label={ptx("images")}>
          <div style={{ display: "grid", gap: 10 }}>
            <Card style={{ padding: 12 }}>
              <Field label={ptx("imageFiles")}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="tg-input"
                  onChange={(event) => set("pictureFiles", Array.from(event.target.files || []))}
                />
              </Field>
              {(form.pictureFiles || []).length > 0 && (
                <div className="tg-cell-sub" style={{ marginTop: 8 }}>{form.pictureFiles.length} {ptx("newImagesSelected")}</div>
              )}
            </Card>
            {(form.images || []).map((image, index) => (
              <Card key={image.id || index} style={{ padding: 12 }}>
                <div style={{ display: "grid", gap: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <Field label={ptx("imageUrl")}><Input value={image.url || ""} onChange={(event) => setImage(index, { url: event.target.value })} placeholder="https://..." /></Field>
                    <Field label={ptx("imageName")}><Input value={image.alt || ""} onChange={(event) => setImage(index, { alt: event.target.value })} placeholder={ptx("productImage")} /></Field>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 64, height: 52 }}><ProductPhoto product={form} image={image} size="thumb" /></div>
                      <span className="tg-cell-sub">{image.isPrimary ? ptx("primaryImage") : ptx("extraImage")}</span>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Button variant={image.isPrimary ? "primary" : "default"} size="sm" icon={<I.star size={14} />} onClick={() => setPrimaryImage(index)}>{ptx("primary")}</Button>
                      <Button variant="danger" size="sm" icon={<I.trash size={14} />} onClick={() => removeImage(index)} disabled={(form.images || []).length <= 1}>{ptx("delete")}</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            <Button variant="default" size="sm" icon={<I.plus size={14} />} onClick={addImage}>{ptx("addAnotherImage")}</Button>
          </div>
        </Field>
        <Field label={ptx("description")}><Textarea rows={5} value={form.description || ""} onChange={(event) => set("description", event.target.value)} placeholder={ptx("productDescription")} /></Field>
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
      title={initial ? ptx("editCategoryTitle") : ptx("newCategory")}
      icon={initial ? <I.edit size={18} /> : <I.plus size={18} />}
      width={460}
      footer={<>
        <Button variant="ghost" onClick={onClose}>{window.TRANSLATIONS?.[productLang()]?.["common.cancel"] || "Bekor qilish"}</Button>
        <Button
          variant="primary"
          onClick={() => onSave({
            ...form,
            name: String(form.name || "").trim(),
            code: productCategoryCodeify(form.code || form.name),
            sortOrder: apiParseNumber(form.sortOrder || 0),
          })}
        >
          {initial ? ptx("save") : ptx("create")}
        </Button>
      </>}
    >
      <div style={{ display: "grid", gap: 14 }}>
        <Field label={ptx("categoryName")} required>
          <Input
            value={form.name}
            onChange={(event) => {
              const nextName = event.target.value;
              set("name", nextName);
              if (!codeTouched) set("code", productCategoryCodeify(nextName));
            }}
          />
        </Field>
        <Field label="Code" hint={ptx("codeHint")}>
          <Input
            value={form.code}
            onChange={(event) => {
              setCodeTouched(true);
              set("code", productCategoryCodeify(event.target.value));
            }}
          />
        </Field>
        <Field label={ptx("sortOrder")}>
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
      toast(ptx("categoryRequired"), "error");
      return;
    }
    await upsert("productCategories", category);
    toast(editCategory ? ptx("categoryUpdated") : ptx("categoryCreated"));
    setCreateOpen(false);
    setEditCategory(null);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={ptx("productCategories")}
      icon={<I.layers size={18} />}
      width={640}
      footer={<>
        <Button variant="default" icon={<I.plus size={15} />} onClick={() => setCreateOpen(true)}>{ptx("newCategory")}</Button>
        <Button variant="primary" onClick={onClose}>{ptx("close")}</Button>
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
                  <div className="tg-cell-sub">Code: {category.code || "—"} • {ptx("sortOrder")}: {category.sortOrder || 0}</div>
                </div>
                <Dropdown
                  align="right"
                  trigger={<IconButton icon={<I.dots size={16} />} label={ptx("categoryActions")} />}
                  items={[
                    { label: ptx("edit"), icon: <I.edit size={16} />, onClick: () => setEditCategory(category) },
                    { divider: true },
                    { label: ptx("delete"), icon: <I.trash size={16} />, danger: true, onClick: () => setDeleteCategory(category) },
                  ]}
                />
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState title={ptx("categoriesNotFound")} message={ptx("createCategoryFirst")} action={<Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setCreateOpen(true)}>{ptx("newCategory")}</Button>} />
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
          toast(ptx("categoryDeleted"));
          setDeleteCategory(null);
        }}
        title={ptx("deleteCategory")}
        message={productLang() === "uz" ? `"${deleteCategory?.name || ""}" ${ptx("deleteCategoryMessage")}` : ptx("deleteCategoryMessage")}
        details={deleteCategory ? `Code: ${deleteCategory.code || "—"}\n${ptx("sortOrder")}: ${deleteCategory.sortOrder || 0}` : ""}
        confirmLabel={ptx("delete")}
        danger
      />
    </Modal>
  );
}
