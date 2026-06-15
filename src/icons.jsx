/* icons.jsx — Texno Grand custom icon set (built from scratch) */
const Icon = ({ d, paths, size = 18, stroke = 1.8, fill = "none", className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24"
    fill={fill} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
    className={className} style={style} aria-hidden="true">
    {paths || <path d={d} />}
  </svg>
);

const I = {

  /* ── Navigation & Pages ─────────────────────────────── */

  // House with dot window
  home: (p) => <Icon {...p} paths={<>
    <path d="M3 11.5L12 3.5L21 11.5V21H15V15H9V21H3V11.5Z"/>
    <circle cx="12" cy="9.5" r="1.3" fill="currentColor" stroke="none"/>
  </>}/>,

  // Three ascending bars (bar chart, not line)
  chart: (p) => <Icon {...p} paths={<>
    <rect x="3" y="14" width="4.5" height="7" rx="1.5"/>
    <rect x="9.75" y="9" width="4.5" height="12" rx="1.5"/>
    <rect x="16.5" y="4" width="4.5" height="17" rx="1.5"/>
  </>}/>,

  // Two overlapping people
  users: (p) => <Icon {...p} paths={<>
    <circle cx="8.5" cy="7.5" r="3"/>
    <path d="M2 20.5c0-3.5 2.9-5.5 6.5-5.5s6.5 2 6.5 5.5"/>
    <path d="M15.5 4.5a3 3 0 0 1 0 6"/>
    <path d="M21 20.5c0-2.5-1.7-4.2-4-5"/>
  </>}/>,

  // Single person — larger head ratio
  user: (p) => <Icon {...p} paths={<>
    <circle cx="12" cy="7.5" r="3.5"/>
    <path d="M4 21c0-4.5 3.6-7 8-7s8 2.5 8 7"/>
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

  // Rounded square container with check (not circle like Lucide)
  checkCircle: (p) => <Icon {...p} paths={<>
    <rect x="3" y="3" width="18" height="18" rx="5"/>
    <path d="M8.5 12.5L11.5 15L16 9.5"/>
  </>}/>,

  // Grid of day dots under header strip
  calendar: (p) => <Icon {...p} paths={<>
    <rect x="3" y="4" width="18" height="17" rx="2.5"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <line x1="8" y1="2.5" x2="8" y2="5.5"/>
    <line x1="16" y1="2.5" x2="16" y2="5.5"/>
    <circle cx="8" cy="15" r="1" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none"/>
    <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none"/>
    <circle cx="8" cy="19" r="1" fill="currentColor" stroke="none"/>
    <circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/>
  </>}/>,

  // Tray with document inside
  inbox: (p) => <Icon {...p} paths={<>
    <path d="M22 13.5L18.5 5H5.5L2 13.5"/>
    <rect x="2" y="13.5" width="20" height="7" rx="2"/>
    <path d="M7 17h10"/>
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

  // Rounded chat bubble with pointer
  message: (p) => <Icon {...p} d="M4.5 4h15a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9L4 21.5V5a1 1 0 0 1 .5-1z"/>,

  /* ── Security ───────────────────────────────────────── */

  // Pentagon badge with inner check
  shield: (p) => <Icon {...p} paths={<>
    <path d="M12 2.5L3.5 6.5V12c0 5 3.7 8.5 8.5 9.5 4.8-1 8.5-4.5 8.5-9.5V6.5L12 2.5Z"/>
    <path d="M9 12.5l2.5 2.5 4-5"/>
  </>}/>,

  // Hexagonal bolt (settings/configuration)
  settings: (p) => <Icon {...p} paths={<>
    <path d="M8.5 3h7L19 7v10l-3.5 4h-7L5 17V7L8.5 3Z"/>
    <circle cx="12" cy="12" r="3"/>
  </>}/>,

  // Padlock with keyhole
  lock: (p) => <Icon {...p} paths={<>
    <rect x="4" y="10.5" width="16" height="11" rx="2.5"/>
    <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>
    <circle cx="12" cy="16" r="1.5" fill="currentColor" stroke="none"/>
    <line x1="12" y1="16" x2="12" y2="18.5"/>
  </>}/>,

  /* ── Commerce ───────────────────────────────────────── */

  // 3D cube with visible edges
  box: (p) => <Icon {...p} paths={<>
    <path d="M12 3L2 8.5L12 14L22 8.5L12 3Z"/>
    <path d="M2 8.5V16L12 21.5L22 16V8.5"/>
    <line x1="12" y1="14" x2="12" y2="21.5"/>
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

  // Bi-fold wallet with card pocket
  wallet: (p) => <Icon {...p} paths={<>
    <rect x="2" y="7" width="20" height="13.5" rx="2.5"/>
    <path d="M7 4.5h10a2 2 0 0 1 2 2V7H5V6.5a2 2 0 0 1 2-2z"/>
    <rect x="15" y="12.5" width="5.5" height="4" rx="1.5"/>
    <circle cx="17.75" cy="14.5" r="1" fill="currentColor" stroke="none"/>
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

  // Magnifier — rounder lens, thicker handle
  search: (p) => <Icon {...p} paths={<>
    <circle cx="11" cy="11" r="7.5"/>
    <path d="M20.5 20.5L16.5 16.5"/>
  </>}/>,

  // Plus
  plus: (p) => <Icon {...p} d="M12 4.5v15M4.5 12h15"/>,

  // Three lines, bottom two slightly inset (stagger)
  menu: (p) => <Icon {...p} paths={<>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="5" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </>}/>,

  // Sidebar panel with nav indicators
  panelLeft: (p) => <Icon {...p} paths={<>
    <rect x="3" y="3" width="18" height="18" rx="2.5"/>
    <line x1="9" y1="3" x2="9" y2="21"/>
    <line x1="4.5" y1="7.5" x2="7.5" y2="7.5"/>
    <line x1="4.5" y1="12" x2="7.5" y2="12"/>
    <line x1="4.5" y1="16.5" x2="7.5" y2="16.5"/>
  </>}/>,

  /* ── Theme ──────────────────────────────────────────── */

  // Sun with 8 tick rays
  sun: (p) => <Icon {...p} paths={<>
    <circle cx="12" cy="12" r="4.5"/>
    <line x1="12" y1="2.5" x2="12" y2="5"/>
    <line x1="12" y1="19" x2="12" y2="21.5"/>
    <line x1="2.5" y1="12" x2="5" y2="12"/>
    <line x1="19" y1="12" x2="21.5" y2="12"/>
    <line x1="5.6" y1="5.6" x2="7.4" y2="7.4"/>
    <line x1="16.6" y1="16.6" x2="18.4" y2="18.4"/>
    <line x1="18.4" y1="5.6" x2="16.6" y2="7.4"/>
    <line x1="7.4" y1="16.6" x2="5.6" y2="18.4"/>
  </>}/>,

  // Crescent moon
  moon: (p) => <Icon {...p} d="M20.5 13.5A9 9 0 1 1 10.5 3.5a7 7 0 0 0 10 10z"/>,

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

  // Diagonal arrow (external link indicator)
  arrowUpRight: (p) => <Icon {...p} d="M7 17L17 7M8.5 7H17v8.5"/>,

  // Open box with arrow escaping
  external: (p) => <Icon {...p} paths={<>
    <path d="M14 4.5H20V10.5"/>
    <path d="M20 4.5L11 13.5"/>
    <path d="M19.5 14.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6.5a1 1 0 0 1 1-1H10.5"/>
  </>}/>,

  /* ── Contextual ─────────────────────────────────────── */

  // Three filled vertical dots
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

  // Pencil with sharp tip
  edit: (p) => <Icon {...p} paths={<>
    <path d="M4 20.5h4L20 9l-4.5-4.5L4 16.5z"/>
    <line x1="15.5" y1="4.5" x2="20" y2="9"/>
    <line x1="4" y1="20.5" x2="8" y2="20.5"/>
  </>}/>,

  // Bin with lid
  trash: (p) => <Icon {...p} paths={<>
    <line x1="3.5" y1="7" x2="20.5" y2="7"/>
    <path d="M9 7V4.5h6V7"/>
    <path d="M5.5 7l1 13.5h11l1-13.5"/>
    <line x1="9.5" y1="11" x2="9.5" y2="17.5"/>
    <line x1="14.5" y1="11" x2="14.5" y2="17.5"/>
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

  // Bell with badge dot
  bell: (p) => <Icon {...p} paths={<>
    <path d="M6 10a6 6 0 0 1 12 0c0 4 2 6 2 6H4s2-2 2-6z"/>
    <path d="M9.5 19a2.5 2.5 0 0 0 5 0"/>
  </>}/>,

  // Triangle warning for alert (duplicate alias)
  flag: (p) => <Icon {...p} paths={<>
    <line x1="5" y1="3" x2="5" y2="21"/>
    <path d="M5 4.5h13l-3 5 3 5H5"/>
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

  // Teardrop location pin
  mapPin: (p) => <Icon {...p} paths={<>
    <path d="M12 22S4.5 14.5 4.5 9a7.5 7.5 0 0 1 15 0C19.5 14.5 12 22 12 22z"/>
    <circle cx="12" cy="9" r="2.5"/>
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

  // Office building with windows
  building: (p) => <Icon {...p} paths={<>
    <rect x="4" y="3" width="16" height="18" rx="1.5"/>
    <line x1="4" y1="8.5" x2="20" y2="8.5"/>
    <line x1="4" y1="14" x2="20" y2="14"/>
    <line x1="12" y1="3" x2="12" y2="21"/>
    <rect x="9" y="17.5" width="6" height="3.5" rx="1"/>
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

  // Door with exit arrow
  logout: (p) => <Icon {...p} paths={<>
    <path d="M14 3h5.5a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H14"/>
    <line x1="3" y1="12" x2="14.5" y2="12"/>
    <path d="M10 8l4.5 4-4.5 4"/>
  </>}/>,

  // Eye with pupil
  eye: (p) => <Icon {...p} paths={<>
    <path d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8-10-8-10-8z"/>
    <circle cx="12" cy="12" r="3"/>
    <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>
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

  // AI robot face
  robot: (p) => <Icon {...p} paths={<>
    <rect x="4" y="7.5" width="16" height="12" rx="3.5"/>
    <path d="M8.5 3.5h7M12 3.5v4"/>
    <circle cx="9" cy="13.5" r="1.5" fill="currentColor" stroke="none"/>
    <circle cx="15" cy="13.5" r="1.5" fill="currentColor" stroke="none"/>
    <path d="M9.5 17.5h5"/>
    <line x1="2" y1="12.5" x2="2" y2="16"/>
    <line x1="22" y1="12.5" x2="22" y2="16"/>
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
