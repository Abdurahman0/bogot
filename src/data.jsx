/* data.jsx - Bogot Armada NRG solar CRM mock data */

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

let _r = mulberry32(20260611);
const rnd = () => _r();
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
const chance = (p) => rnd() < p;
const sample = (arr, n) => {
  const copy = [...arr];
  const out = [];
  for (let i = 0; i < n && copy.length; i++) {
    out.push(copy.splice(Math.floor(rnd() * copy.length), 1)[0]);
  }
  return out;
};

const fmtUZS = (n) => n == null ? "—" : Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
const fmtNum = (n) => n == null ? "—" : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const fmtShort = (n) => n >= 1e9 ? (n / 1e9).toFixed(1) + " mlrd" : n >= 1e6 ? (n / 1e6).toFixed(1) + " mln" : n >= 1e3 ? (n / 1e3).toFixed(0) + "k" : String(n);
window.fmtUZS = fmtUZS;
window.fmtNum = fmtNum;
window.fmtShort = fmtShort;

const UZ_FIRST_M = ["Aziz", "Jasur", "Sardor", "Bekzod", "Otabek", "Sherzod", "Dilshod", "Akmal", "Davron", "Farrux", "Ulug'bek", "Bobur", "Shoxrux", "Javohir", "Islom", "Rustam", "Kamol", "Anvar", "Sanjar", "Nodir", "Temur", "Murod"];
const UZ_FIRST_F = ["Nilufar", "Gulnora", "Dilnoza", "Madina", "Sevara", "Kamola", "Zarina", "Malika", "Nigora", "Feruza", "Shahnoza", "Oydin", "Munisa", "Laylo", "Gavhar", "Dilfuza", "Charos", "Saodat"];
const UZ_LAST = ["Karimov", "Rahimov", "Yusupov", "Abdullayev", "Tursunov", "Ergashev", "Nazarov", "Saidov", "Qodirov", "Ismoilov", "Mirzayev", "Xolmatov", "Aliyev", "Usmonov", "Rasulov", "Sobirov", "Toshpo'latov", "Yo'ldoshev", "Hamidov", "Jo'rayev", "Boltayev", "Sharipov"];
const DISTRICTS = ["Yunusobod", "Chilonzor", "Mirzo Ulug'bek", "Yashnobod", "Sergeli", "Shayxontohur", "Olmazor", "Uchtepa", "Yakkasaroy", "Bektemir", "Mirobod", "Yangihayot"];
const TUMAN_MAHALLA = {
  "Yunusobod": ["Bog'ishamol", "Minor", "Qashqar", "Nova", "Sobirobod"],
  "Chilonzor": ["Bunyodkor", "Cho'ponota", "Gavhar", "Naqqoshlik", "Do'mbirobod"],
  "Mirzo Ulug'bek": ["Buyuk Ipak Yo'li", "Geofizika", "Ulug'bek", "TTZ", "Oltintepa"],
  "Yashnobod": ["Maxtumquli", "Parkent", "Ashxobod", "Aviasozlar", "Tuzel"],
  "Sergeli": ["Sergeli-1", "Sergeli-5", "Qumariq", "Nomdanak", "Qo'rg'ontepa"],
  "Shayxontohur": ["Chorsu", "Labzak", "Sebzor", "Gulbozor", "Eski Jo'va"],
  "Olmazor": ["Qorasaroy", "Beruniy", "Hazrati Imom", "Achabod", "Chimboy"],
  "Uchtepa": ["Ko'ksaroy", "Farhod", "Nuroniy", "Zargarlik", "Chamanzor"],
  "Yakkasaroy": ["Muqimiy", "Rakat", "Bobur", "Kichik Beshyog'och", "Shota Rustaveli"],
  "Bektemir": ["Bektemir", "Iykota", "Rohat", "Majnuntol", "Suvsoz"],
  "Mirobod": ["Oybek", "Ming O'rik", "Farg'ona yo'li", "Afrosiyob", "Furqat"],
  "Yangihayot": ["Sputnik", "Yangi Choshtepa", "Do'stlik", "Binokor", "Oriyat"],
};
const BRANDS = ["Jinko", "Trina Solar", "JA Solar", "Longi", "Huawei", "Growatt", "Deye", "Canadian Solar"];
const BRAND_COLORS = {
  "Jinko": "#2563eb",
  "Trina Solar": "#0f766e",
  "JA Solar": "#9333ea",
  "Longi": "#ea580c",
  "Huawei": "#dc2626",
  "Growatt": "#16a34a",
  "Deye": "#0891b2",
  "Canadian Solar": "#d97706",
};
window.DISTRICTS = DISTRICTS;
window.TUMAN_MAHALLA = TUMAN_MAHALLA;
window.BRANDS = BRANDS;
window.BRAND_COLORS = BRAND_COLORS;

function cloneLocationMap(source = TUMAN_MAHALLA) {
  return Object.fromEntries(
    Object.entries(source || {}).map(([district, mahallas]) => [district, [...mahallas]])
  );
}
window.cloneLocationMap = cloneLocationMap;

const PIPELINE_STAGES = ["greeted", "need_identified", "info_collected", "ready_to_order", "completed", "cancelled"];
const PIPELINE_STAGE_UZ = {
  greeted: "Yangi murojaat",
  need_identified: "Ehtiyoj aniqlandi",
  info_collected: "Texnik ma'lumot yig'ildi",
  ready_to_order: "Taklif / shartnoma",
  completed: "Sotuv yopildi",
  cancelled: "Yo'qotildi",
};
const OP_STATUSES = ["contacted", "sold", "rejected"];
const OP_STATUS_UZ = { contacted: "Aloqada", sold: "Sotildi", rejected: "Yo'qotildi" };
const SOURCES = ["instagram", "telegram", "phone", "manual"];
const SOURCE_UZ = { instagram: "Instagram", telegram: "Telegram Web App", phone: "Telefon", manual: "Qo'lda" };
const PAYMENT_TYPES = ["cash", "credit"];
const PAYMENT_TYPE_UZ = { cash: "Naqd", credit: "Kredit" };
window.PIPELINE_STAGES = PIPELINE_STAGES;
window.PIPELINE_STAGE_UZ = PIPELINE_STAGE_UZ;
window.OP_STATUSES = OP_STATUSES;
window.OP_STATUS_UZ = OP_STATUS_UZ;
window.SOURCES = SOURCES;
window.SOURCE_UZ = SOURCE_UZ;
window.PAYMENT_TYPES = PAYMENT_TYPES;
window.PAYMENT_TYPE_UZ = PAYMENT_TYPE_UZ;

function fullName() {
  const first = chance(0.62) ? pick(UZ_FIRST_M) : pick(UZ_FIRST_F);
  return `${first} ${pick(UZ_LAST)}`;
}
function phone() {
  return `+998 ${pick(["90", "91", "93", "94", "95", "97", "98", "99"])} ${ri(100, 999)} ${ri(10, 99)} ${ri(10, 99)}`;
}
function username() {
  return "@" + pick(["solar", "panel", "mijoz", "nrg", "client", "bogot", "armada", "power"]) + ri(10, 999);
}
function daysAgo(d) {
  return new Date(Date.now() - d * 86400000 - ri(0, 86400000));
}
function daysFromNow(d) {
  return new Date(Date.now() + d * 86400000 + ri(0, 86400000));
}
function iso(d) {
  return d.toISOString();
}

function buildUsers() {
  const seed = [
    { name: "Administrator Aliyev", role: "admin", label: "Administrator", dept: "Boshqaruv", email: "admin@bogotarmadanrg.uz" },
    { name: "Jasur Karimov", role: "manager", label: "Savdo menejeri", dept: "Savdo", email: "sales@bogotarmadanrg.uz" },
    { name: "Dilnoza Rahimova", role: "operator", label: "Lid operatori", dept: "Lead markaz", email: "operator@bogotarmadanrg.uz" },
    { name: "Sevara Yusupova", role: "content", label: "Moliya menejeri", dept: "Moliya", email: "finance@bogotarmadanrg.uz" },
  ];
  const users = seed.map((s, i) => ({
    id: `U${100 + i}`,
    fullName: s.name,
    role: s.role,
    label: s.label,
    dept: s.dept,
    phone: phone(),
    email: s.email,
    status: "active",
    lastActive: iso(daysAgo(ri(0, 7))),
    assignedLeads: ri(6, 24),
    completedSales: ri(2, 18),
    avatarHue: ri(0, 360),
  }));
  for (let i = 4; i < 20; i++) {
    const role = i < 10 ? "operator" : i < 15 ? "manager" : "content";
    users.push({
      id: `U${100 + i}`,
      fullName: fullName(),
      role,
      label: role === "operator" ? "Lid operatori" : role === "manager" ? "Savdo menejeri" : "Moliya menejeri",
      dept: role === "content" ? "Moliya" : role === "operator" ? "Lead markaz" : "Savdo",
      phone: phone(),
      email: `user${i}@bogotarmadanrg.uz`,
      status: chance(0.9) ? "active" : "suspended",
      lastActive: iso(daysAgo(ri(0, 14))),
      assignedLeads: ri(4, 22),
      completedSales: ri(1, 14),
      avatarHue: ri(0, 360),
    });
  }
  return users;
}

function buildProducts() {
  const templates = [
    { category: "Panel to'plami", mount: "Tom", sizes: [5, 8, 10, 12, 15, 20] },
    { category: "Gibrid stansiya", mount: "Tom", sizes: [10, 15, 20, 30, 50, 100] },
    { category: "Inverter", mount: "Texnik xona", sizes: [5, 10, 15, 20, 30, 50] },
    { category: "Batareya bloki", mount: "Ichki", sizes: [5, 10, 15, 20] },
  ];
  const items = [];
  let idx = 0;
  templates.forEach((tpl) => {
    tpl.sizes.forEach((powerKw) => {
      const brand = pick(BRANDS);
      const panelPowerW = pick([550, 580, 610, 650]);
      const batteryCapacityKwh = tpl.category === "Batareya bloki" ? powerKw : tpl.category === "Gibrid stansiya" ? Math.max(10, powerKw / 2 * 5) : 0;
      const phaseCount = powerKw >= 20 ? 3 : 1;
      const panelCount = tpl.category === "Inverter" || tpl.category === "Batareya bloki" ? 0 : Math.max(8, Math.round(powerKw * 1000 / panelPowerW));
      const basePrice = tpl.category === "Inverter"
        ? powerKw * 2.8e6
        : tpl.category === "Batareya bloki"
          ? powerKw * 3.6e6
          : powerKw * 9.2e6 + batteryCapacityKwh * 1.1e6;
      const review = chance(0.72) ? "verified" : chance(0.6) ? "needs-review" : "incomplete";
      const issues = [];
      if (review === "needs-review") issues.push(pick(["Kafolat muddati manbaga moslashtirilishi kerak", "Montaj tarkibi batafsil yozilmagan", "Kredit narxi alohida kiritilmagan"]));
      if (review === "incomplete") issues.push("Texnik spetsifikatsiyaning bir qismi to'liq kiritilmagan");
      const model = `${powerKw} kW ${tpl.category}`;
      items.push({
        id: `P${1000 + idx}`,
        sku: `${brand.slice(0, 3).toUpperCase()}-${powerKw}KW-${1000 + idx}`,
        brand,
        name: model,
        model,
        series: pick(["Eco", "Prime", "Business", "Hybrid Max"]),
        category: tpl.category,
        mountType: tpl.mount,
        status: chance(0.88) ? "active" : chance(0.5) ? "draft" : "archived",
        dataReviewStatus: review,
        powerKw,
        inverterPowerKw: tpl.category === "Batareya bloki" ? 0 : powerKw,
        batteryCapacityKwh,
        panelCount,
        panelPowerW,
        monthlyYieldKwh: tpl.category === "Batareya bloki" ? 0 : ri(powerKw * 110, powerKw * 145),
        phaseCount,
        warrantyYears: pick([5, 10, 12]),
        installationDays: powerKw >= 30 ? ri(4, 8) : ri(2, 5),
        paybackYears: ri(3, 6),
        stockQuantity: tpl.category === "Gibrid stansiya" ? ri(1, 8) : ri(3, 22),
        reservedQuantity: ri(0, 4),
        featured: chance(0.22),
        priceUzs: Math.round(basePrice / 10000) * 10000,
        previousPriceUzs: chance(0.35) ? Math.round(basePrice * 1.08 / 10000) * 10000 : null,
        installationFeeUzs: Math.round(powerKw * 350000 / 10000) * 10000,
        images: Array.from({ length: ri(1, 3) }, (_, i) => ({
          id: `img_${idx}_${i}`,
          hue: i,
          alt: `${brand} ${model} - rasm ${i + 1}`,
          isPrimary: i === 0,
        })),
        rawDescription: `${brand} ${model}. ${panelCount ? panelCount + " ta panel, " : ""}${phaseCount} faza. Oylik ishlab chiqarish ${tpl.category === "Batareya bloki" ? "saqlash" : ri(powerKw * 110, powerKw * 145) + " kWh"} darajasida.`,
        reviewIssues: issues,
        notes: chance(0.2) ? "Kredit jadvali alohida kelishiladi" : "",
        createdAt: iso(daysAgo(ri(40, 280))),
        updatedAt: iso(daysAgo(ri(0, 18))),
      });
      idx++;
    });
  });
  return items;
}

function buildLeads(users, products) {
  const salesUsers = users.filter(u => u.role === "operator" || u.role === "manager");
  const propertyTypes = ["Hovli", "Ofis", "Do'kon", "Ferma", "Ombor", "Ishlab chiqarish"];
  const leads = [];
  for (let i = 0; i < 46; i++) {
    const requiredPowerKw = pick([3, 5, 8, 10, 12, 15, 20, 30, 50, 80, 100]);
    const source = pick(SOURCES);
    const pipelineStage = pick(PIPELINE_STAGES);
    const paymentType = pick(PAYMENT_TYPES);
    const matching = products.filter(p => p.powerKw === requiredPowerKw || Math.abs(p.powerKw - requiredPowerKw) <= 2).slice(0, 4);
    const rec = sample(matching.length ? matching : products, ri(1, 3)).map(p => p.id);
    const budgetMin = requiredPowerKw * 8e6;
    const budgetMax = Math.round(budgetMin * pick([1.15, 1.25, 1.35]));
    leads.push({
      id: `L${2000 + i}`,
      fullName: fullName(),
      phone: phone(),
      username: source === "instagram" || source === "telegram" ? username() : null,
      source,
      pipelineStage,
      status: pipelineStage === "completed" ? "sold" : pipelineStage === "cancelled" ? "rejected" : "contacted",
      priority: pick(["low", "medium", "medium", "high", "urgent"]),
      assignedUserId: chance(0.18) ? null : pick(salesUsers).id,
      requiredPowerKw,
      roomAreaM2: ri(requiredPowerKw * 6, requiredPowerKw * 16),
      roofAreaM2: ri(requiredPowerKw * 7, requiredPowerKw * 18),
      propertyType: pick(propertyTypes),
      paymentType,
      paymentTypeLabel: PAYMENT_TYPE_UZ[paymentType],
      monthlyBillUzs: ri(900000, 12000000),
      budgetMinUzs: budgetMin,
      budgetMaxUzs: budgetMax,
      preferredBrands: sample(BRANDS, ri(0, 2)),
      requestedFeatures: sample(["hybrid", "battery", "monitoring", "threePhase", "fastInstall"], ri(1, 3)),
      selectedProductIds: chance(0.35) ? sample(rec, 1) : [],
      recommendedProductIds: rec,
      leadScore: ri(38, 96),
      sentiment: pick(["positive", "positive", "neutral", "neutral", "negative"]),
      nextFollowUpAt: chance(0.65) ? iso(daysFromNow(ri(-2, 6))) : null,
      lastContactAt: iso(daysAgo(ri(0, 8))),
      createdAt: iso(daysAgo(ri(0, 60))),
      estimatedValue: budgetMax,
      hasUnread: chance(0.32),
      hasOverdueTask: chance(0.22),
      hasRecording: chance(0.4),
      notes: chance(0.55) ? [pick(["Tom maydoni rasmlarini yuboradi", "Kredit shartlarini kutmoqda", "Inverter markasini solishtirmoqda", "Eski biznes bo'yicha qarzi mavjud"]) ] : [],
      tags: sample(["issiq", "kredit", "tezkor", "takroriy", "yuqori qiymat"], ri(0, 2)),
      btu: requiredPowerKw * 1000,
    });
  }
  return leads;
}

function buildCustomers(users, leads) {
  const managers = users.filter(u => u.role === "manager" || u.role === "operator");
  return leads.slice(0, 34).map((lead, i) => {
    const projectValue = Math.round((lead.estimatedValue || 0) * pick([0.9, 1, 1.08]));
    const paid = Math.round(projectValue * pick([0.25, 0.4, 0.6, 0.8, 1]));
    const debt = Math.max(0, projectValue - paid);
    const district = pick(DISTRICTS);
    const mahalla = pick(TUMAN_MAHALLA[district] || ["Markaz"]);
    return {
      id: `C${3000 + i}`,
      fullName: lead.fullName,
      phone: lead.phone,
      source: lead.source,
      status: debt > 0 ? "active" : pick(["active", "active", "inactive"]),
      district,
      mahalla,
      address: `${district} tumani, ${mahalla} mahallasi, ${ri(1, 52)}-uy`,
      currentSystemKw: lead.requiredPowerKw,
      paymentType: lead.paymentType,
      paymentTypeLabel: lead.paymentTypeLabel,
      ordersCount: ri(1, 3),
      totalSpent: paid,
      debtBalanceUzs: debt,
      overdueDebtUzs: debt > 0 && chance(0.45) ? Math.round(debt * pick([0.25, 0.4, 0.6])) : 0,
      lastPurchase: iso(daysAgo(ri(5, 180))),
      assignedManagerId: pick(managers).id,
      referralCode: "NRG" + ri(1000, 9999),
      lastActivity: iso(daysAgo(ri(0, 20))),
      preferredChannel: lead.source,
      lifetimeValue: projectValue,
      satisfaction: pick([3.5, 4, 4.5, 5]),
      productInterests: lead.preferredBrands.length ? lead.preferredBrands : sample(BRANDS, ri(1, 2)),
      notes: chance(0.4) ? "Hisob-kitob bo'yicha alohida eslatma mavjud" : "",
      tags: sample(["yangi", "qarzdor", "vip", "takroriy"], ri(0, 2)),
      createdAt: lead.createdAt,
    };
  });
}

function buildDebtors(customers, products, leads) {
  return customers.filter(c => c.debtBalanceUzs > 0).slice(0, 26).map((c, i) => {
    const powerKw = c.currentSystemKw;
    const items = sample(products.filter(p => Math.abs(p.powerKw - powerKw) <= 5), ri(1, 2)).map(p => ({
      productId: p.id,
      name: `${p.brand} ${p.model}`,
      quantity: 1,
      unitPriceUzs: p.priceUzs,
    }));
    const subtotal = items.reduce((s, it) => s + it.unitPriceUzs * it.quantity, 0);
    const principal = Math.max(subtotal, c.lifetimeValue);
    const paid = principal - c.debtBalanceUzs;
    const paymentStatus = c.debtBalanceUzs === 0 ? "paid" : paid > 0 ? "partial" : "unpaid";
    return {
      id: `DBT${6000 + i}`,
      customerId: c.id,
      customerName: c.fullName,
      leadId: leads.find(l => l.fullName === c.fullName)?.id || null,
      productItems: items,
      status: c.overdueDebtUzs > 0 ? "processing" : "confirmed",
      paymentStatus,
      businessLine: chance(0.35) ? "Eski biznes" : "Quyosh panel biznesi",
      paymentType: c.paymentType,
      deliveryAddress: c.address,
      district: c.district,
      mahalla: c.mahalla || pick(TUMAN_MAHALLA[c.district] || ["Mahalla kiritilmagan"]),
      principalUzs: principal,
      paidUzs: Math.max(0, paid),
      remainingDebtUzs: c.debtBalanceUzs,
      overdueAmountUzs: c.overdueDebtUzs,
      nextReminderAt: iso(daysFromNow(ri(-3, 9))),
      dueDate: iso(daysFromNow(ri(-18, 30))),
      lastPaymentAt: chance(0.7) ? iso(daysAgo(ri(1, 40))) : null,
      discountUzs: 0,
      totalUzs: principal,
      createdAt: iso(daysAgo(ri(10, 120))),
      note: chance(0.45) ? "To'lov grafigi bo'yicha qo'ng'iroq kerak" : "",
    };
  });
}

function buildLedger(debtors, users) {
  const financeUsers = users.filter(u => u.role === "content" || u.role === "admin");
  const entries = [];
  debtors.forEach((d, i) => {
    if (d.paidUzs > 0) {
      entries.push({
        id: `PAY${7000 + i}`,
        orderId: d.id,
        customerName: d.customerName,
        amountUzs: Math.round(d.paidUzs / pick([1, 2, 3])),
        method: pick(["Naqd", "Bank o'tkazmasi", "Click", "Payme"]),
        status: "To'langan",
        date: iso(daysAgo(ri(0, 45))),
        note: "Qisman to'lov",
        processedBy: pick(financeUsers).fullName,
        direction: "income",
        category: "Savdo tushumi",
        businessLine: d.businessLine,
      });
    }
  });
  const expenseCats = ["Logistika", "Montaj", "Marketing", "Ish haqi", "Ofis xarajati"];
  for (let i = 0; i < 18; i++) {
    entries.push({
      id: `PAY${7600 + i}`,
      orderId: null,
      customerName: "Ichki xarajat",
      amountUzs: ri(400000, 9500000),
      method: pick(["Naqd", "Bank o'tkazmasi"]),
      status: "To'langan",
      date: iso(daysAgo(ri(0, 45))),
      note: pick(["Ustalar avansi", "Transport to'lovi", "Kontent uchun xarajat", "Qurilma yetkazib berish"]),
      processedBy: pick(financeUsers).fullName,
      direction: "expense",
      category: pick(expenseCats),
      businessLine: pick(["Eski biznes", "Quyosh panel biznesi"]),
    });
  }
  return entries.sort((a, b) => new Date(b.date) - new Date(a.date));
}

function buildTasks(users, leads) {
  const owners = users.filter(u => u.role === "operator" || u.role === "manager" || u.role === "content");
  const taskTypes = ["Qayta aloqa", "Tom suratini tekshirish", "Kredit hujjatini tayyorlash", "To'lov eslatmasi", "Texnik vizit", "Shartnoma yuborish", "Debitor bilan gaplashish"];
  return Array.from({ length: 62 }, (_, i) => {
    const lead = pick(leads);
    const due = daysFromNow(ri(-4, 10));
    const done = chance(0.34);
    return {
      id: `T${4000 + i}`,
      title: pick(taskTypes),
      type: pick(taskTypes),
      leadId: chance(0.8) ? lead.id : null,
      assignedUserId: pick(owners).id,
      priority: pick(["low", "medium", "high", "urgent"]),
      dueDate: iso(due),
      status: done ? "done" : due < new Date() ? "overdue" : "pending",
      channel: lead.source,
      notes: chance(0.35) ? "Mijoz bilan kelishilgan vaqtni tasdiqlash kerak" : "",
      createdAt: iso(daysAgo(ri(0, 20))),
    };
  });
}

function buildCalls(users, leads) {
  const ops = users.filter(u => u.role === "operator");
  const outcomes = ["Loyiha tushuntirildi", "Kredit bo'yicha savol", "Texnik uchrashuv belgilandi", "Qayta aloqa", "To'lov eslatildi", "Rad etdi"];
  return Array.from({ length: 36 }, (_, i) => {
    const lead = pick(leads);
    return {
      id: `CALL${5000 + i}`,
      datetime: iso(daysAgo(ri(0, 20))),
      customerName: lead.fullName,
      phone: lead.phone,
      operatorId: pick(ops).id,
      direction: chance(0.58) ? "inbound" : "outbound",
      durationSec: ri(50, 680),
      hasRecording: chance(0.86),
      hasTranscript: chance(0.72),
      leadId: lead.id,
      leadStatus: lead.status,
      outcome: pick(outcomes),
      aiScore: ri(48, 96),
      sentiment: pick(["positive", "positive", "neutral", "negative"]),
      objections: sample(["Kredit foizi", "Narx yuqori", "Tom tayyor emas", "Kafolat muddati", "Eski qarz mavjud"], ri(0, 2)),
    };
  });
}

const CONV_TEMPLATES = [
  ["Salom, 10 kW quyosh paneli kerak edi", "Assalomu alaykum. 10 kW tizim uchun obyekt turi qanday?", "Hovli uy uchun", "Tushunarli, naqdmi yoki kredit asosidami ishlamoqchisiz?"],
  ["Oylik svetim 4 million chiqyapti", "Bunday yuklama uchun 12-15 kW tizim ko'rib chiqiladi.", "Kredit bo'ladimi?", "Ha, kredit shartlari bilan ham taklif tayyorlaymiz."],
  ["Telegramda ko'rib qoldim, batareya bilan variant bormi?", "Albatta, gibrid inverter va akkumulyator bilan variantlar bor.", "Narxini yuboring", "Tom maydoni va manzilni yuborsangiz aniq taklif jo'nataman."],
];

function buildConversations(leads, users) {
  const ops = users.filter(u => u.role === "operator");
  return leads.slice(0, 28).map((lead, i) => {
    const tpl = pick(CONV_TEMPLATES);
    const messages = tpl.map((text, k) => ({
      id: `m${i}_${k}`,
      from: k % 2 === 0 ? "customer" : chance(0.45) ? "ai" : "operator",
      text,
      at: iso(daysAgo(ri(0, 4) + (tpl.length - k) * 0.02)),
    }));
    return {
      id: `CV${i}`,
      leadId: lead.id,
      name: lead.fullName,
      channel: lead.source,
      messages,
      unread: chance(0.38) ? ri(1, 4) : 0,
      aiMode: pick(["ai", "operator", "handoff"]),
      assignedUserId: pick(ops).id,
      lastAt: messages[messages.length - 1].at,
      tags: sample(["kredit", "hisob", "tom", "tezkor", "battery"], ri(0, 2)),
      status: pick(["open", "open", "handoff", "closed", "missed"]),
    };
  }).sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt));
}

function buildNotifications(leads, debtors, ledger) {
  const rows = [
    { type: "lead", icon: "instagram", color: "pink", text: "Instagram orqali yangi lead kelib tushdi" },
    { type: "lead", icon: "send", color: "blue", text: "Telegram Web App buyurtmasi CRM ga tushdi" },
    { type: "alert", icon: "clock", color: "red", text: "Muddati o'tgan qarzdor bo'yicha eslatma bor" },
    { type: "system", icon: "wallet", color: "green", text: "Bugungi kirim hisob-kitobga yozildi" },
    { type: "ai", icon: "robot", color: "violet", text: "AI agent qo'shimcha ma'lumot so'rash uchun operatorga o'tkazdi" },
  ];
  return Array.from({ length: 42 }, (_, i) => {
    const row = pick(rows);
    const at = iso(daysAgo(ri(0, 8)));
    return {
      id: `N${8000 + i}`,
      ...row,
      read: chance(0.45),
      at,
      createdAt: at,
      message: row.text,
      leadId: chance(0.4) ? pick(leads).id : null,
      orderId: chance(0.35) && debtors.length ? pick(debtors).id : null,
    };
  }).sort((a, b) => new Date(b.at) - new Date(a.at));
}

function buildAudit(users, debtors, products) {
  const actions = ["Lead tayinlandi", "Mahsulot yangilandi", "Qarzdor holati o'zgartirildi", "Kirim qo'shildi", "Chiqim tasdiqlandi", "Instagram webhook sinovdan o'tdi"];
  const entities = ["Lead", "Product", "Debtor", "Ledger", "Integration"];
  return Array.from({ length: 56 }, (_, i) => {
    const at = iso(daysAgo(ri(0, 30)));
    const user = pick(users).fullName;
    return {
      id: `A${9000 + i}`,
      at,
      createdAt: at,
      user,
      userName: user,
      action: pick(actions),
      entity: pick(entities),
      entityId: pick(["#" + ri(1000, 9999), pick(debtors)?.id || "#6001", pick(products)?.id || "#1001"]),
      summary: pick(["Operator qayta tayinlandi", "Narx kredit varianti bilan yangilandi", "Muddati o'tgan summa qayd qilindi", "Integratsiya tokeni yangilandi"]),
      ip: `213.230.${ri(0, 255)}.${ri(0, 255)}`,
      device: pick(["Chrome / Windows", "Safari / macOS", "Chrome / Android"]),
    };
  }).sort((a, b) => new Date(b.at) - new Date(a.at));
}

function generateData() {
  _r = mulberry32(20260611);
  const users = buildUsers();
  const products = buildProducts();
  const leads = buildLeads(users, products);
  const customers = buildCustomers(users, leads);
  const orders = buildDebtors(customers, products, leads);
  const payments = buildLedger(orders, users);
  const tasks = buildTasks(users, leads);
  const calls = buildCalls(users, leads);
  const conversations = buildConversations(leads, users);
  const notifications = buildNotifications(leads, orders, payments);
  const audit = buildAudit(users, orders, products);
  const brandCounts = Object.fromEntries(BRANDS.map(b => [b, products.filter(p => p.brand === b).length]));
  window.BRAND_COUNTS = brandCounts;
  window.BTU_DIST = {};
  window.BTU_AREA = {};
  return {
    products,
    users,
    leads,
    customers,
    tasks,
    calls,
    orders,
    payments,
    notifications,
    audit,
    conversations,
    locations: cloneLocationMap(),
    banners: [],
    referrals: [],
  };
}

window.generateData = generateData;
window.username = username;
window._mockHelpers = { rnd, ri, pick, sample, chance, fullName, phone, username, daysAgo, iso };
