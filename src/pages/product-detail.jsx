/* pages/product-detail.jsx */
const { useState: pdS } = React;

function ProductDetailPage({ id }) {
  const { data, t, nav, toast, update, upsert, remove } = useApp();
  const p = data.products.find((item) => item.id === id);
  const [activeImg, setActiveImg] = pdS(0);
  const [tab, setTab] = pdS("specs");
  const [editOpen, setEditOpen] = pdS(false);
  const [deleteOpen, setDeleteOpen] = pdS(false);

  if (!p) return <div className="page"><Card><EmptyState title="Mahsulot topilmadi" action={<Button onClick={() => nav("/products")}>Katalogga</Button>} /></Card></div>;

  const similar = data.products.filter((item) => item.category === p.category && item.id !== p.id).slice(0, 4);
  const discount = p.previousPriceUzs ? Math.round((1 - p.priceUzs / p.previousPriceUzs) * 100) : 0;
  const productImages = p.images || [];

  React.useEffect(() => {
    if (!productImages.length) {
      setActiveImg(0);
      return;
    }
    if (activeImg > productImages.length - 1) setActiveImg(0);
  }, [activeImg, productImages.length]);

  const setPrimary = (idx) => {
    if (!productImages.length) return;
    update("products", (rows) => rows.map((item) => item.id === id ? { ...item, images: item.images.map((image, index) => ({ ...image, isPrimary: index === idx })) } : item));
    toast("Asosiy rasm yangilandi");
  };

  return (
    <div className="page fade-in">
      <PageHeader crumbs={[{ label: "Katalog va moliya" }, { label: t("page.products"), to: "/products" }, { label: p.model }]}
        title={p.model}
        actions={<>
          <Button variant="default" size="sm" icon={<I.copy size={15} />} onClick={() => toast("Mahsulot nusxasi yaratildi")}>Nusxalash</Button>
          <Button variant="default" size="sm" icon={<I.trash size={15} />} onClick={() => setDeleteOpen(true)}>O'chirish</Button>
          <Button variant="primary" size="sm" icon={<I.edit size={15} />} onClick={() => setEditOpen(true)}>Tahrirlash</Button>
        </>} />

      <div className="grid-dash" style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card pad={false}>
            <div style={{ padding: 18 }}>
              <div style={{ position: "relative" }}>
                <ACUnit product={{ ...p, images: productImages.length ? [productImages[activeImg] || productImages[0]] : [] }} size="lg" />
                {discount > 0 && <span style={{ position: "absolute", top: 12, right: 12 }}><Badge color="red">-{discount}%</Badge></span>}
              </div>
              <div className="tg-thumbs">
                {productImages.map((image, index) => (
                  <button key={image.id} className="tg-thumb" data-active={index === activeImg ? "1" : undefined} onClick={() => setActiveImg(index)}>
                    <ACUnit product={{ ...p, images: [image] }} size="sm" />
                    {image.isPrimary && <span className="tg-thumb-primary"><I.star size={9} /></span>}
                  </button>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                <Button variant="default" size="sm" icon={<I.star size={14} />} onClick={() => setPrimary(activeImg)}>Asosiy qilish</Button>
                <Button variant="default" size="sm" icon={<I.upload size={14} />} onClick={() => setEditOpen(true)}>Rasm qo'shish</Button>
              </div>
            </div>
          </Card>

          {p.dataReviewStatus !== "verified" && (
            <Card style={{ borderColor: "var(--amber)" }}>
              <CardHead title="Tekshiruv eslatmasi" icon={<I.alert size={17} />} color="amber" action={<Badge color={STATUS_COLORS[p.dataReviewStatus]} dot>{REVIEW_UZ[p.dataReviewStatus]}</Badge>} />
              {p.reviewIssues.map((issue, index) => <div key={index} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--text-2)", marginBottom: 8 }}><I.info size={15} style={{ color: "var(--amber)", flexShrink: 0, marginTop: 1 }} />{issue}</div>)}
            </Card>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Card>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <span style={{ fontWeight: 700, color: BRAND_COLORS[p.brand] }}>{p.brand}</span>
              {p.featured && <Badge color="amber" size="sm"><I.star size={11} /> Tavsiya</Badge>}
              <StatusBadge status={p.status} label={p.status} />
            </div>
            <h2 style={{ margin: "0 0 4px", fontSize: 19, fontWeight: 700 }}>{p.category}</h2>
            <div style={{ color: "var(--text-3)", fontSize: 13 }}>{p.powerKw} kW • {p.phaseCount} faza • {p.mountType}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 10, margin: "16px 0" }}>
              <span style={{ fontSize: 26, fontWeight: 760 }}>{fmtUZS(p.priceUzs)}</span>
              {p.previousPriceUzs && <span style={{ fontSize: 15, color: "var(--text-3)", textDecoration: "line-through" }}>{fmtUZS(p.previousPriceUzs)}</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <StatTile label="Qoldiq" value={p.stockQuantity} color={p.stockQuantity < 5 ? "amber" : "green"} sub="dona" />
              <StatTile label="Panel soni" value={p.panelCount || "—"} sub="ta" />
              <StatTile label="Montaj" value={p.installationDays} sub="kun" />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <Button variant="primary" full icon={<I.users size={16} />} onClick={() => nav("/customers")}>Mijozlarga o'tish</Button>
              <Button variant="default" icon={<I.wallet size={16} />} onClick={() => nav("/debtors")}>Qarzdorlikka o'tkazish</Button>
            </div>
          </Card>

          <Card pad={false}>
            <div style={{ padding: "4px 12px", borderBottom: "1px solid var(--border)" }}>
              <Tabs size="sm" tabs={[{ value: "specs", label: "Spetsifikatsiya" }, { value: "raw", label: "Import tavsifi" }, { value: "review", label: "Tekshiruv" }]} active={tab} onChange={setTab} />
            </div>
            <div style={{ padding: 18 }}>
              {tab === "specs" && (
                <div className="tg-meta">
                  <div className="tg-meta-row"><span className="tg-meta-k">Quvvat</span><span className="tg-meta-v">{p.powerKw} kW</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">Oylik ishlab chiqarish</span><span className="tg-meta-v">{p.monthlyYieldKwh ? `${p.monthlyYieldKwh} kWh/oy` : "—"}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">Inverter</span><span className="tg-meta-v">{p.inverterPowerKw ? `${p.inverterPowerKw} kW` : "—"}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">Batareya</span><span className="tg-meta-v">{p.batteryCapacityKwh ? `${p.batteryCapacityKwh} kWh` : "—"}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">Faza</span><span className="tg-meta-v">{p.phaseCount}</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">Kafolat</span><span className="tg-meta-v">{p.warrantyYears} yil</span></div>
                  <div className="tg-meta-row"><span className="tg-meta-k">Payback</span><span className="tg-meta-v">{p.paybackYears} yil</span></div>
                </div>
              )}
              {tab === "raw" && <div style={{ padding: 14, background: "var(--surface-2)", borderRadius: 10, fontSize: 13, lineHeight: 1.7, fontFamily: "var(--mono)", color: "var(--text-2)", border: "1px solid var(--border)" }}>{p.rawDescription || p.description || "Tavsif kiritilmagan"}</div>}
              {tab === "review" && <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <Badge color={STATUS_COLORS[p.dataReviewStatus]} size="sm">{REVIEW_UZ[p.dataReviewStatus]}</Badge>
                {(p.reviewIssues.length ? p.reviewIssues : ["Mahsulot ma'lumotlari to'liq tasdiqlangan"]).map((issue, index) => <div key={index} style={{ fontSize: 13.5, color: "var(--text-2)" }}>{issue}</div>)}
              </div>}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid-2">
        <Panel title="Mahsulot tavsifi" icon="doc" color="blue">
          <div style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--text-2)" }}>
            {p.description || p.rawDescription || "Mahsulot uchun tavsif kiritilmagan."}
          </div>
        </Panel>
        <Panel title="O'xshash paketlar" subtitle={p.category} icon="layers" color="violet">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {similar.map((product) => <div key={product.id} style={{ cursor: "pointer", display: "flex", gap: 10, alignItems: "center" }} onClick={() => nav("/products/" + product.id)}>
              <div style={{ width: 44, height: 36, flexShrink: 0 }}><ACUnit product={product} size="sm" /></div>
              <div style={{ minWidth: 0 }}><div style={{ fontSize: 12.5, fontWeight: 600 }}>{product.powerKw} kW</div><div className="tg-cell-sub">{fmtUZS(product.priceUzs)}</div></div>
            </div>)}
          </div>
        </Panel>
      </div>
      <ProductFormModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={p}
        onSave={async (product) => {
          await upsert("products", product);
          toast("Mahsulot yangilandi");
          setEditOpen(false);
        }}
      />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={async () => {
          await remove("products", p.id);
          toast("Mahsulot o'chirildi");
          setDeleteOpen(false);
          nav("/products");
        }}
        title="Mahsulotni o'chirish"
        message={`"${p.model}" mahsulotini o'chirmoqchimisiz?`}
        details={`SKU: ${p.sku}\nBrend: ${p.brand}\nQuvvat: ${p.powerKw} kW`}
        confirmLabel="O'chirish"
        danger
      />
    </div>
  );
}

window.ProductDetailPage = ProductDetailPage;
