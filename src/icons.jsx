/* icons.jsx — Texno Grand custom icon set (built from scratch) */
const Icon = ({ d, paths, size = 18, stroke = 1.9, fill = "none", viewBox = "0 0 24 24", className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox={viewBox}
    fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style} aria-hidden="true">
    {paths || <path d={d} />}
  </svg>
);

const I = {

  /* ── Navigation & Pages ─────────────────────────────── */

  // Clean house silhouette
  home: (p) => <Icon {...p} paths={<>
    <path d="M4 10.5L12 4l8 6.5"/>
    <path d="M6 9.5V20h12V9.5"/>
    <path d="M10 20v-5.5h4V20"/>
  </>}/>,

  // Rounded bar chart
  chart: (p) => <Icon {...p} paths={<>
    <path d="M4 20V13"/>
    <path d="M10 20V9"/>
    <path d="M16 20V5"/>
    <path d="M3 20h18"/>
    <rect x="3" y="12" width="2" height="8" rx="1"/>
    <rect x="9" y="8" width="2" height="12" rx="1"/>
    <rect x="15" y="4" width="2" height="16" rx="1"/>
  </>}/>,

  // Cleaner overlapping people
  users: (p) => <Icon {...p} paths={<>
    <circle cx="9" cy="8" r="3"/>
    <path d="M3.5 19c0-3.2 2.8-5 5.5-5s5.5 1.8 5.5 5"/>
    <path d="M16.5 11.5a2.7 2.7 0 1 0 0-5.4"/>
    <path d="M17.2 14.5c2 0 3.8 1.1 4.8 3"/>
  </>}/>,

  // Person profile
  user: (p) => <Icon {...p} paths={<>
    <circle cx="12" cy="8" r="3.25"/>
    <path d="M5 19.5c0-3.6 3-5.5 7-5.5s7 1.9 7 5.5"/>
  </>}/>,

  // Stacked narrowing bars (pipeline stages)
  funnel: (p) => <Icon {...p} paths={<>
    <rect x="2" y="3" width="20" height="4" rx="2"/>
    <rect x="5" y="9.5" width="14" height="4" rx="2"/>
    <rect x="8.5" y="16" width="7" height="4" rx="2"/>
    <path d="M12 20v1.5"/>
  </>}/>,

  // Portfolio case with center clasp
  briefcase: (p) => <Icon {...p} paths={<>
    <rect x="2" y="8" width="20" height="13" rx="2.5"/>
    <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    <line x1="2" y1="13" x2="22" y2="13"/>
    <line x1="12" y1="13" x2="12" y2="16"/>
  </>}/>,

  /* ── Status & Actions ───────────────────────────────── */

  check: (p) => <Icon {...p} d="M4 13L9.5 18.5L20 6"/>,

  // Badge check
  checkCircle: (p) => <Icon {...p} paths={<>
    <circle cx="12" cy="12" r="9"/>
    <path d="M8 12.5l2.6 2.6L16.5 9"/>
  </>}/>,

  // Calendar with simple header
  calendar: (p) => <Icon {...p} paths={<>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/>
    <path d="M3.5 9.5h17"/>
    <path d="M8 3.5v3"/>
    <path d="M16 3.5v3"/>
    <path d="M8 13h3"/>
    <path d="M13 13h3"/>
    <path d="M8 17h3"/>
  </>}/>,

  // Inbox tray
  inbox: (p) => <Icon {...p} paths={<>
    <path d="M3 12.5L5.5 5h13L21 12.5"/>
    <path d="M3 12.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5.5"/>
    <path d="M8 12.5a4 4 0 0 0 8 0"/>
  </>}/>,

  /* ── Communication ──────────────────────────────────── */

  // Instagram — brand, keep recognizable
  instagram: (p) => <Icon {...p} paths={<>
    <rect x="3" y="3" width="18" height="18" rx="5.5"/>
    <circle cx="12" cy="12" r="4"/>
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
  </>}/>,

  // Filled arrow plane
  send: (p) => <Icon {...p} paths={<>
    <path d="M22 2L11.5 12.5"/>
    <path d="M22 2L15 22L11.5 12.5L2 9Z" fill="currentColor" stroke="none"/>
  </>}/>,

  // Rounded handset
  phone: (p) => <Icon {...p} d="M6 3h3.5l2 4.5L9 9a10 10 0 0 0 6 6l1.5-2.5 4.5 2V18a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2z"/>,

  // Phone + incoming arrow
  phoneIn: (p) => <Icon {...p} paths={<>
    <path d="M6 3h3.5l2 4.5L9 9a10 10 0 0 0 6 6l1.5-2.5 4.5 2V18a2 2 0 0 1-2 2A17 17 0 0 1 4 5a2 2 0 0 1 2-2z"/>
    <path d="M16 4.5l4-4M20 4.5h-4v4"/>
  </>}/>,

  // Chat bubble
  message: (p) => <Icon {...p} paths={<>
    <path d="M5 5.5h14a2 2 0 0 1 2 2V14a2 2 0 0 1-2 2H11l-5 4v-4H5a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2z"/>
  </>}/>,

  /* ── Security ───────────────────────────────────────── */

  // Shield
  shield: (p) => <Icon {...p} paths={<>
    <path d="M12 3.5l7 2.8v5.5c0 4.5-2.9 7.6-7 8.7-4.1-1.1-7-4.2-7-8.7V6.3l7-2.8z"/>
    <path d="M9.4 12.2l1.8 1.9 3.5-4"/>
  </>}/>,

  // Modern gear
  settings: (p) => <Icon {...p} paths={<>
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1.9 1.9 0 0 1-2.7-2.7l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1.9 1.9 0 1 1 2.7-2.7l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1.9 1.9 0 1 1 2.7 2.7l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6h.1a2 2 0 1 1 0 4h-.1a1 1 0 0 0-.9.6z"/>
  </>}/>,

  // Padlock with keyhole
  lock: (p) => <Icon {...p} paths={<>
    <rect x="4" y="10.5" width="16" height="11" rx="2.5"/>
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>
    <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/>
    <line x1="12" y1="16" x2="12" y2="18.5"/>
  </>}/>,

  /* ── Commerce ───────────────────────────────────────── */

  // Open cube
  box: (p) => <Icon {...p} paths={<>
    <path d="M12 3.5l7.5 4.2L12 12 4.5 7.7 12 3.5z"/>
    <path d="M4.5 7.7V16.5L12 20.5l7.5-4V7.7"/>
    <path d="M12 12v8.5"/>
  </>}/>,

  // Price tag with punched hole
  tag: (p) => <Icon {...p} paths={<>
    <path d="M3 8V4h4L20 17l-4 4L3 8Z"/>
    <circle cx="7.5" cy="7.5" r="1.4" fill="currentColor" stroke="none"/>
  </>}/>,

  // Shopping bag (different from wheeled cart)
  cart: (p) => <Icon {...p} paths={<>
    <path d="M6 2.5L4 7v13.5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V7l-2-4.5z"/>
    <line x1="4" y1="7" x2="20" y2="7"/>
    <path d="M9.5 11a2.5 2.5 0 0 0 5 0"/>
  </>}/>,

  // Cleaner wallet
  wallet: (p) => <Icon {...p} paths={<>
    <path d="M4 7.5a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 7.5v9A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5v-9z"/>
    <path d="M4 9h16"/>
    <path d="M14.5 13.5H20"/>
    <circle cx="15.5" cy="13.5" r="1" fill="currentColor" stroke="none"/>
  </>}/>,

  // Ribbon gift box
  gift: (p) => <Icon {...p} paths={<>
    <rect x="3" y="10" width="18" height="11" rx="2"/>
    <line x1="3" y1="14" x2="21" y2="14"/>
    <line x1="12" y1="10" x2="12" y2="21"/>
    <path d="M12 10C10 10 7.5 7 9.5 5a2.5 2.5 0 0 1 2.5 5z"/>
    <path d="M12 10C14 10 16.5 7 14.5 5A2.5 2.5 0 0 0 12 10z"/>
  </>}/>,

  // Storefront with awning + door
  store: (p) => <Icon {...p} paths={<>
    <path d="M2 7.5L4 3h16l2 4.5"/>
    <path d="M3 7.5v2a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0v-2"/>
    <path d="M5 9.5V21h14V9.5"/>
    <rect x="9.5" y="15.5" width="5" height="5.5" rx="1"/>
  </>}/>,

  // Photo frame with mountain silhouette
  image: (p) => <Icon {...p} paths={<>
    <rect x="3" y="3.5" width="18" height="17" rx="2.5"/>
    <circle cx="8.5" cy="9" r="1.8" fill="currentColor" stroke="none"/>
    <path d="M3 17.5L8 12.5L13 17.5L17 14.5L21 18"/>
  </>}/>,

  /* ── Data & Content ─────────────────────────────────── */

  // Two-panel layout
  layout: (p) => <Icon {...p} paths={<>
    <rect x="3" y="3" width="18" height="18" rx="2.5"/>
    <line x1="3" y1="9" x2="21" y2="9"/>
    <line x1="9" y1="9" x2="9" y2="21"/>
  </>}/>,

  // Document with page fold
  doc: (p) => <Icon {...p} paths={<>
    <path d="M5.5 3h9L19 7.5V21H5.5V3Z"/>
    <path d="M14.5 3v4.5H19"/>
    <line x1="8.5" y1="12" x2="15.5" y2="12"/>
    <line x1="8.5" y1="16" x2="15.5" y2="16"/>
    <line x1="8.5" y1="8.5" x2="12" y2="8.5"/>
  </>}/>,

  // Folded sticky note
  note: (p) => <Icon {...p} paths={<>
    <path d="M5 3h10l4 4v14H5V3Z"/>
    <path d="M15 3v4h4"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="8" y1="16" x2="13" y2="16"/>
  </>}/>,

  // Three stacked sheets (spacious/layers icon)
  layers: (p) => <Icon {...p} paths={<>
    <path d="M2 9L12 4L22 9L12 14L2 9Z"/>
    <path d="M2 14l10 5 10-5"/>
    <path d="M2 19l10 5 10-5"/>
  </>}/>,

  /* ── UI Elements ────────────────────────────────────── */

  // Square bullet list
  list: (p) => <Icon {...p} paths={<>
    <rect x="3" y="4.5" width="3.5" height="3.5" rx="1" fill="currentColor" stroke="none"/>
    <rect x="3" y="10.5" width="3.5" height="3.5" rx="1" fill="currentColor" stroke="none"/>
    <rect x="3" y="16.5" width="3.5" height="3.5" rx="1" fill="currentColor" stroke="none"/>
    <line x1="9.5" y1="6.5" x2="21" y2="6.5"/>
    <line x1="9.5" y1="12.5" x2="21" y2="12.5"/>
    <line x1="9.5" y1="18.5" x2="21" y2="18.5"/>
  </>}/>,

  // Chain links
  link: (p) => <Icon {...p} paths={<>
    <path d="M10 13a4.5 4.5 0 0 0 6.5 0l3-3a4.5 4.5 0 0 0-6.5-6.5l-1.5 1.5"/>
    <path d="M14 11a4.5 4.5 0 0 0-6.5 0l-3 3a4.5 4.5 0 0 0 6.5 6.5l1.5-1.5"/>
  </>}/>,

  // Circle with question mark
  help: (p) => <Icon {...p} paths={<>
    <circle cx="12" cy="12" r="9.5"/>
    <path d="M9.5 9.5a2.7 2.7 0 0 1 4.5 2c0 1.5-1.5 2-2 3"/>
    <circle cx="12" cy="17.5" r="0.8" fill="currentColor" stroke="none"/>
  </>}/>,

  // Search
  search: (p) => <Icon {...p} paths={<>
    <circle cx="11" cy="11" r="6.5"/>
    <path d="M20 20l-4.2-4.2"/>
  </>}/>,

  // Plus
  plus: (p) => <Icon {...p} d="M12 4.5v15M4.5 12h15"/>,

  // Three lines, bottom two slightly inset (stagger)
  menu: (p) => <Icon {...p} paths={<>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="5" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </>}/>,

  // Sidebar layout
  panelLeft: (p) => <Icon {...p} paths={<>
    <rect x="3.5" y="4" width="17" height="16" rx="2.5"/>
    <path d="M9 4v16"/>
    <path d="M5.5 8h1"/>
    <path d="M5.5 12h1"/>
    <path d="M5.5 16h1"/>
  </>}/>,

  /* ── Theme ──────────────────────────────────────────── */

  // Soft sun
  sun: (p) => <Icon {...p} paths={<>
    <circle cx="12" cy="12" r="4"/>
    <path d="M12 2.5v2.5"/>
    <path d="M12 19v2.5"/>
    <path d="M2.5 12H5"/>
    <path d="M19 12h2.5"/>
    <path d="M5.7 5.7l1.8 1.8"/>
    <path d="M16.5 16.5l1.8 1.8"/>
    <path d="M18.3 5.7l-1.8 1.8"/>
    <path d="M7.5 16.5l-1.8 1.8"/>
  </>}/>,

  // Moon
  moon: (p) => <Icon {...p} d="M20 14.5A8.5 8.5 0 1 1 9.5 4 7 7 0 0 0 20 14.5z"/>,

  // Monitor with screen highlight dot
  monitor: (p) => <Icon {...p} paths={<>
    <rect x="2" y="3.5" width="20" height="14" rx="2.5"/>
    <line x1="8" y1="21.5" x2="16" y2="21.5"/>
    <line x1="12" y1="17.5" x2="12" y2="21.5"/>
  </>}/>,

  // Globe with lat/lon grid
  globe: (p) => <Icon {...p} paths={<>
    <circle cx="12" cy="12" r="9.5"/>
    <ellipse cx="12" cy="12" rx="4" ry="9.5"/>
    <line x1="2.5" y1="12" x2="21.5" y2="12"/>
    <path d="M4.5 7.5h15"/>
    <path d="M4.5 16.5h15"/>
  </>}/>,

  /* ── Chevrons & Arrows ──────────────────────────────── */

  chevDown:  (p) => <Icon {...p} d="M5.5 9.5l6.5 6 6.5-6"/>,
  chevRight: (p) => <Icon {...p} d="M9.5 5.5l6 6.5-6 6.5"/>,
  chevLeft:  (p) => <Icon {...p} d="M14.5 5.5l-6 6.5 6 6.5"/>,

  x: (p) => <Icon {...p} d="M5.5 5.5l13 13M18.5 5.5l-13 13"/>,

  // Arrow with tail
  arrowRight: (p) => <Icon {...p} d="M4 12h16M14 6.5l6 5.5-6 5.5"/>,
  arrowLeft: (p) => <Icon {...p} d="M20 12H4M10 17.5l-6-5.5 6-5.5"/>,

  // Diagonal arrow (external link indicator)
  arrowUpRight: (p) => <Icon {...p} d="M7 17L17 7M8.5 7H17v8.5"/>,

  // Open box with arrow escaping
  external: (p) => <Icon {...p} paths={<>
    <path d="M14 4.5H20V10.5"/>
    <path d="M20 4.5L11 13.5"/>
    <path d="M19.5 14.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1H10.5"/>
  </>}/>,

  /* ── Contextual ─────────────────────────────────────── */

  // Three dots
  dots: (p) => <Icon {...p} paths={<>
    <circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none"/>
  </>}/>,

  // 2×3 grip dots for drag handles
  grip: (p) => <Icon {...p} paths={<>
    <circle cx="9" cy="5" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="5" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="9" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="12" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="9" cy="19" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="19" r="1.5" fill="currentColor" stroke="none"/>
  </>}/>,

  // Descending triangle filter
  filter: (p) => <Icon {...p} d="M3 5.5h18L14 13.5v6l-4-2V13.5L3 5.5Z"/>,

  // Download: arrow into tray
  download: (p) => <Icon {...p} paths={<>
    <line x1="12" y1="3" x2="12" y2="15.5"/>
    <path d="M7 11l5 5.5 5-5.5"/>
    <line x1="3.5" y1="20.5" x2="20.5" y2="20.5"/>
  </>}/>,

  // Upload: arrow out of tray
  upload: (p) => <Icon {...p} paths={<>
    <line x1="12" y1="21" x2="12" y2="8.5"/>
    <path d="M7 13l5-5.5 5 5.5"/>
    <line x1="3.5" y1="3.5" x2="20.5" y2="3.5"/>
  </>}/>,

  // Exact react-icons/fa6 FaPenToSquare
  edit: (p) => <Icon {...p} viewBox="0 0 512 512" fill="currentColor" stroke="none" paths={<>
    <path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160L0 416c0 53 43 96 96 96l256 0c53 0 96-43 96-96l0-96c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 96c0 17.7-14.3 32-32 32L96 448c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l96 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 64z"/>
  </>}/>,

  // Exact react-icons/fa6 FaTrashCan
  trash: (p) => <Icon {...p} viewBox="0 0 448 512" fill="currentColor" stroke="none" paths={<>
    <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0L284.2 0c12.1 0 23.2 6.8 28.6 17.7L320 32l96 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 96C14.3 96 0 81.7 0 64S14.3 32 32 32l96 0 7.2-14.3zM32 128l384 0 0 320c0 35.3-28.7 64-64 64L96 512c-35.3 0-64-28.7-64-64l0-320zm96 64c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16l0 224c0 8.8 7.2 16 16 16s16-7.2 16-16l0-224c0-8.8-7.2-16-16-16z"/>
  </>}/>,

  // Copy: two offset rects
  copy: (p) => <Icon {...p} paths={<>
    <rect x="9" y="9" width="12" height="12" rx="2.5"/>
    <path d="M5 15V5a2 2 0 0 1 2-2h10"/>
  </>}/>,

  /* ── Status Icons ───────────────────────────────────── */

  // Triangle warning with dot
  alert: (p) => <Icon {...p} paths={<>
    <path d="M12 2.5L2.5 20.5h19L12 2.5Z"/>
    <line x1="12" y1="9.5" x2="12" y2="14.5"/>
    <circle cx="12" cy="17.5" r="0.9" fill="currentColor" stroke="none"/>
  </>}/>,

  // Circle with info dot + line
  info: (p) => <Icon {...p} paths={<>
    <circle cx="12" cy="12" r="9.5"/>
    <line x1="12" y1="11" x2="12" y2="17"/>
    <circle cx="12" cy="7.5" r="0.9" fill="currentColor" stroke="none"/>
  </>}/>,

  // 4-point starburst (AI/magic)
  sparkle: (p) => <Icon {...p} paths={<>
    <path d="M12 3L13.8 8.5L19.5 10L13.8 11.5L12 17L10.2 11.5L4.5 10L10.2 8.5L12 3Z" fill="currentColor" stroke="none"/>
    <circle cx="19" cy="5" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="5.5" cy="18" r="1" fill="currentColor" stroke="none"/>
  </>}/>,

  // Bell
  bell: (p) => <Icon {...p} paths={<>
    <path d="M6.5 10a5.5 5.5 0 1 1 11 0c0 2.4.7 4.1 2 5.5H4.5c1.3-1.4 2-3.1 2-5.5z"/>
    <path d="M10 19a2 2 0 0 0 4 0"/>
  </>}/>,

  // Flag
  flag: (p) => <Icon {...p} paths={<>
    <path d="M5 21V4"/>
    <path d="M5 5h12l-2.5 4 2.5 4H5"/>
  </>}/>,

  /* ── Data Visualization ─────────────────────────────── */

  // Trend upward — diagonal arrow with tail
  trendUp: (p) => <Icon {...p} paths={<>
    <path d="M3 17.5l6.5-6 4 4 7.5-8"/>
    <path d="M16 7.5h5.5V13"/>
  </>}/>,

  // Trend downward
  trendDown: (p) => <Icon {...p} paths={<>
    <path d="M3 6.5l6.5 6 4-4 7.5 8"/>
    <path d="M16 16.5h5.5V11"/>
  </>}/>,

  // Star (favorite/rating)
  star: (p) => <Icon {...p} d="M12 2.5l2.5 5.7L21 9.2l-4.6 4.2 1.2 6.4L12 16.8l-5.6 3L7.6 13.4 3 9.2l6.5-.9z"/>,

  // Flame
  fire: (p) => <Icon {...p} d="M12 3c.5 2.5-1.5 3.5-1.5 5.5a3.5 3.5 0 0 0 6 2.5c0 2-.5 3-.5 4.5a5.5 5.5 0 0 1-11 0c0-3 2.5-4.5 2.5-7C9.5 8 10.5 7.5 12 3z"/>,

  // Clock with hour and minute hand
  clock: (p) => <Icon {...p} paths={<>
    <circle cx="12" cy="12" r="9.5"/>
    <path d="M12 7v5l3.5 2.5"/>
  </>}/>,

  // Exact react-icons/fa6 FaHourglassHalf
  hourglass: (p) => <Icon {...p} viewBox="0 0 384 512" fill="currentColor" stroke="none" paths={<>
    <path d="M32 0C14.3 0 0 14.3 0 32S14.3 64 32 64l0 11c0 42.4 16.9 83.1 46.9 113.1L146.7 256 78.9 323.9C48.9 353.9 32 394.6 32 437l0 11c-17.7 0-32 14.3-32 32s14.3 32 32 32l32 0 256 0 32 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l0-11c0-42.4-16.9-83.1-46.9-113.1L237.3 256l67.9-67.9c30-30 46.9-70.7 46.9-113.1l0-11c17.7 0 32-14.3 32-32s-14.3-32-32-32L320 0 64 0 32 0zM96 75l0-11 192 0 0 11c0 19-5.6 37.4-16 53L112 128c-10.3-15.6-16-34-16-53zm16 309c3.5-5.3 7.6-10.3 12.1-14.9L192 301.3l67.9 67.9c4.6 4.6 8.6 9.6 12.1 14.9L112 384z"/>
  </>}/>,

  // Target crosshair (leads/goals)
  target: (p) => <Icon {...p} paths={<>
    <circle cx="12" cy="12" r="9.5"/>
    <circle cx="12" cy="12" r="4.5"/>
    <line x1="12" y1="2.5" x2="12" y2="7.5"/>
    <line x1="12" y1="16.5" x2="12" y2="21.5"/>
    <line x1="2.5" y1="12" x2="7.5" y2="12"/>
    <line x1="16.5" y1="12" x2="21.5" y2="12"/>
  </>}/>,

  /* ── System ─────────────────────────────────────────── */

  // Three sliders (EQ mixer — different from settings)
  sliders: (p) => <Icon {...p} paths={<>
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="4" y1="12" x2="20" y2="12"/>
    <line x1="4" y1="18" x2="20" y2="18"/>
    <circle cx="9" cy="6" r="2.5"/>
    <circle cx="15" cy="12" r="2.5"/>
    <circle cx="9" cy="18" r="2.5"/>
  </>}/>,

  // 2×2 rounded squares
  grid: (p) => <Icon {...p} paths={<>
    <rect x="3" y="3" width="7.5" height="7.5" rx="2"/>
    <rect x="13.5" y="3" width="7.5" height="7.5" rx="2"/>
    <rect x="3" y="13.5" width="7.5" height="7.5" rx="2"/>
    <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2"/>
  </>}/>,

  // Table with row/column lines
  table: (p) => <Icon {...p} paths={<>
    <rect x="3" y="3.5" width="18" height="17" rx="2.5"/>
    <line x1="3" y1="9.5" x2="21" y2="9.5"/>
    <line x1="3" y1="15" x2="21" y2="15"/>
    <line x1="9" y1="9.5" x2="9" y2="20.5"/>
  </>}/>,

  // Map pin
  mapPin: (p) => <Icon {...p} paths={<>
    <path d="M12 21s-6.5-5.8-6.5-11.5a6.5 6.5 0 1 1 13 0C18.5 15.2 12 21 12 21z"/>
    <circle cx="12" cy="9.5" r="2.2"/>
  </>}/>,

  // Circular arrows (refresh/sync)
  refresh: (p) => <Icon {...p} paths={<>
    <path d="M3 12A9 9 0 0 1 17.5 5.5L21 8.5"/>
    <path d="M21 5v4h-4"/>
    <path d="M21 12A9 9 0 0 1 6.5 18.5L3 15.5"/>
    <path d="M3 19v-4h4"/>
  </>}/>,

  // Clock with reverse arrow (history/audit)
  history: (p) => <Icon {...p} paths={<>
    <path d="M3 12A9 9 0 1 0 6 5.7L3 8.5"/>
    <path d="M3 4.5v4h4"/>
    <path d="M12 7.5v5l3.5 2"/>
  </>}/>,

  // Office building
  building: (p) => <Icon {...p} paths={<>
    <path d="M5 20V5.5A1.5 1.5 0 0 1 6.5 4h11A1.5 1.5 0 0 1 19 5.5V20"/>
    <path d="M9 8h.01"/>
    <path d="M15 8h.01"/>
    <path d="M9 12h.01"/>
    <path d="M15 12h.01"/>
    <path d="M9 16h.01"/>
    <path d="M15 16h.01"/>
    <path d="M10 20v-3h4v3"/>
  </>}/>,

  // Palette with color dots
  palette: (p) => <Icon {...p} paths={<>
    <path d="M12 3a9 9 0 1 0 0 18c1.7 0 2.5-1 2.5-2.5s-.7-1.5-.7-2.5 1-2 2.5-2H19a3 3 0 0 0 3-3 9 9 0 0 0-10-6z"/>
    <circle cx="8" cy="11" r="1" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="7.5" r="1" fill="currentColor" stroke="none"/>
    <circle cx="16" cy="9.5" r="1" fill="currentColor" stroke="none"/>
  </>}/>,

  /* ── Media ──────────────────────────────────────────── */

  // Solid triangle play
  play: (p) => <Icon {...p} d="M7 4.5L20.5 12L7 19.5Z" fill="currentColor" stroke="none"/>,

  // Two solid bars pause
  pause: (p) => <Icon {...p} paths={<>
    <rect x="5" y="4.5" width="4.5" height="15" rx="1.5" fill="currentColor" stroke="none"/>
    <rect x="14.5" y="4.5" width="4.5" height="15" rx="1.5" fill="currentColor" stroke="none"/>
  </>}/>,

  // Logout
  logout: (p) => <Icon {...p} paths={<>
    <path d="M10 4H6.5A1.5 1.5 0 0 0 5 5.5v13A1.5 1.5 0 0 0 6.5 20H10"/>
    <path d="M13 8l4 4-4 4"/>
    <path d="M8.5 12H17"/>
  </>}/>,

  // Eye
  eye: (p) => <Icon {...p} paths={<>
    <path d="M2.5 12s3.8-6.5 9.5-6.5 9.5 6.5 9.5 6.5-3.8 6.5-9.5 6.5S2.5 12 2.5 12z"/>
    <circle cx="12" cy="12" r="2.7"/>
  </>}/>,
  eyeOff: (p) => <Icon {...p} paths={<>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C5 20 1 12 1 12a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </>}/>,

  /* ── Special / Brand ────────────────────────────────── */

  // ⌘ command key
  command: (p) => <Icon {...p} d="M9 3a3 3 0 1 0 0 6h6a3 3 0 1 0 0-6 3 3 0 0 0 0 6v6a3 3 0 1 0 0 6 3 3 0 0 0 0-6H9a3 3 0 1 0 0 6 3 3 0 0 0 0-6V9a3 3 0 0 0-3-3z"/>,

  // Filled lightning bolt
  zap: (p) => <Icon {...p} d="M14 2.5L4.5 14h7L9.5 21.5l10-12H13z" fill="currentColor" stroke="none"/>,

  // Outlined lightning bolt
  zapline: (p) => <Icon {...p} d="M14 2.5L4.5 14h7L9.5 21.5l10-12H13z"/>,

  // Snowflake logo (brand)
  snow: (p) => <Icon {...p} paths={<>
    <line x1="12" y1="2" x2="12" y2="22"/>
    <line x1="2" y1="12" x2="22" y2="12"/>
    <line x1="5" y1="5" x2="19" y2="19"/>
    <line x1="19" y1="5" x2="5" y2="19"/>
    <path d="M12 5L10 7M12 5L14 7M12 19L10 17M12 19L14 17"/>
    <path d="M5 12L7 10M5 12L7 14M19 12L17 10M19 12L17 14"/>
  </>}/>,

  // Magic wand + sparkle
  wand: (p) => <Icon {...p} paths={<>
    <line x1="3" y1="21" x2="13.5" y2="10.5"/>
    <path d="M13.5 10.5L15.5 12.5L3 21"/>
    <path d="M17 2v3M17 8v2"/>
    <path d="M14 5h2M20 5h-2"/>
    <path d="M17 5l2-2M17 5l2 2M17 5l-2-2M17 5l-2 2"/>
  </>}/>,

  // Robot
  robot: (p) => <Icon {...p} paths={<>
    <rect x="4" y="8" width="16" height="11" rx="3"/>
    <path d="M9 4h6"/>
    <path d="M12 4v4"/>
    <circle cx="9.5" cy="13" r="1.1" fill="currentColor" stroke="none"/>
    <circle cx="14.5" cy="13" r="1.1" fill="currentColor" stroke="none"/>
    <path d="M9.5 16h5"/>
    <path d="M2.5 11.5V15"/>
    <path d="M21.5 11.5V15"/>
  </>}/>,

  // Circle with plus (brand)
  brand: (p) => <Icon {...p} paths={<>
    <circle cx="12" cy="12" r="9.5"/>
    <line x1="12" y1="7.5" x2="12" y2="16.5"/>
    <line x1="7.5" y1="12" x2="16.5" y2="12"/>
  </>}/>,

  /* ── AC / Domain-specific ───────────────────────────── */

  // Wind / air flow
  wind: (p) => <Icon {...p} paths={<>
    <path d="M3 8h11a2.5 2.5 0 1 0-2.5-2.5"/>
    <path d="M3 12h16a2.5 2.5 0 1 1-2.5 2.5"/>
    <path d="M3 16h8a2 2 0 1 1-2 2"/>
  </>}/>,

  // WiFi signal arcs
  wifi: (p) => <Icon {...p} paths={<>
    <path d="M2 8.5a16 16 0 0 1 20 0"/>
    <path d="M5 12.5a11 11 0 0 1 14 0"/>
    <path d="M8.5 16.5a6 6 0 0 1 7 0"/>
    <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none"/>
  </>}/>,

  // Water drop
  drop: (p) => <Icon {...p} d="M12 3.5S6 9.5 6 14a6 6 0 0 0 12 0C18 9.5 12 3.5 12 3.5z"/>,

  // Thermometer with bulb
  thermo: (p) => <Icon {...p} paths={<>
    <path d="M10 13V5a2 2 0 1 1 4 0v8a4 4 0 1 1-4 0z"/>
    <line x1="14" y1="7" x2="16" y2="7"/>
    <line x1="14" y1="10" x2="16" y2="10"/>
  </>}/>,

};

window.I = I;
window.Icon = Icon;
