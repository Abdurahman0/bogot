/* data.jsx - shared UI formatters and static option maps */

const fmtUZS = (n) => n == null ? "—" : Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " so'm";
const fmtNum = (n) => n == null ? "—" : n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
const fmtShort = (n) => n >= 1e9 ? (n / 1e9).toFixed(1) + " mlrd" : n >= 1e6 ? (n / 1e6).toFixed(1) + " mln" : n >= 1e3 ? (n / 1e3).toFixed(0) + "k" : String(n);

window.fmtUZS = fmtUZS;
window.fmtNum = fmtNum;
window.fmtShort = fmtShort;

const TUMAN_MAHALLA = {};

const DISTRICTS = Object.keys(TUMAN_MAHALLA);
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

function cloneLocationMap(source = TUMAN_MAHALLA) {
  return Object.fromEntries(
    Object.entries(source || {}).map(([district, mahallas]) => [district, [...mahallas]])
  );
}

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

function username() {
  return "@user" + Math.floor(Math.random() * 100000);
}

window.DISTRICTS = DISTRICTS;
window.TUMAN_MAHALLA = TUMAN_MAHALLA;
window.BRANDS = BRANDS;
window.BRAND_COLORS = BRAND_COLORS;
window.cloneLocationMap = cloneLocationMap;
window.PIPELINE_STAGES = PIPELINE_STAGES;
window.PIPELINE_STAGE_UZ = PIPELINE_STAGE_UZ;
window.OP_STATUSES = OP_STATUSES;
window.OP_STATUS_UZ = OP_STATUS_UZ;
window.SOURCES = SOURCES;
window.SOURCE_UZ = SOURCE_UZ;
window.PAYMENT_TYPES = PAYMENT_TYPES;
window.PAYMENT_TYPE_UZ = PAYMENT_TYPE_UZ;
window.username = username;
