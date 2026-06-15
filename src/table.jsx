/* table.jsx — reusable data table with sort, select, pagination */
const { useState: tS, useMemo: tM } = React;

function Checkbox({ checked, onChange, indeterminate }) {
  return (
    <span className="tg-check" data-on={checked ? "1" : undefined} onClick={(e) => { e.stopPropagation(); onChange(!checked); }} role="checkbox" aria-checked={checked}>
      {checked ? <I.check size={13} stroke={3} /> : indeterminate ? <span style={{ width: 9, height: 2, background: "var(--accent)", borderRadius: 2 }} /> : null}
    </span>
  );
}

function DataTable({ columns, rows, rowKey = (r) => r.id, onRowClick, selectable, selected, onSelect, pageSize = 12, emptyState, defaultSort }) {
  const [sort, setSort] = tS(defaultSort || null);
  const [page, setPage] = tS(0);

  const sorted = tM(() => {
    if (!sort) return rows;
    const col = columns.find(c => c.key === sort.key);
    if (!col || !col.sortVal) return rows;
    const arr = [...rows].sort((a, b) => {
      const va = col.sortVal(a), vb = col.sortVal(b);
      if (va < vb) return -1; if (va > vb) return 1; return 0;
    });
    return sort.dir === "desc" ? arr.reverse() : arr;
  }, [rows, sort, columns]);

  const pageCount = Math.ceil(sorted.length / pageSize) || 1;
  const curPage = Math.min(page, pageCount - 1);
  const pageRows = sorted.slice(curPage * pageSize, curPage * pageSize + pageSize);

  const toggleSort = (key) => {
    setSort(s => s && s.key === key ? (s.dir === "asc" ? { key, dir: "desc" } : null) : { key, dir: "asc" });
  };

  const allSelected = selectable && pageRows.length > 0 && pageRows.every(r => selected.includes(rowKey(r)));
  const someSelected = selectable && pageRows.some(r => selected.includes(rowKey(r)));

  if (rows.length === 0 && emptyState) return emptyState;

  return (
    <div>
      <div className="tg-table-wrap">
        <table className="tg-table">
          <thead>
            <tr>
              {selectable && (
                <th style={{ width: 40 }}>
                  <Checkbox checked={allSelected} indeterminate={someSelected && !allSelected}
                    onChange={(v) => onSelect(v ? [...new Set([...selected, ...pageRows.map(rowKey)])] : selected.filter(id => !pageRows.map(rowKey).includes(id)))} />
                </th>
              )}
              {columns.map(col => (
                <th key={col.key} className={col.sortVal ? "sortable" : ""} onClick={() => col.sortVal && toggleSort(col.key)} style={col.width ? { width: col.width } : {}}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                    {col.label}
                    {sort && sort.key === col.key && (sort.dir === "asc" ? <I.chevDown size={13} style={{ transform: "rotate(180deg)" }} /> : <I.chevDown size={13} />)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map(row => {
              const key = rowKey(row);
              const isSel = selectable && selected.includes(key);
              return (
                <tr key={key} data-clickable={onRowClick ? "1" : undefined} onClick={() => onRowClick && onRowClick(row)} style={isSel ? { background: "var(--accent-soft)" } : {}}>
                  {selectable && (
                    <td onClick={e => e.stopPropagation()}>
                      <Checkbox checked={isSel} onChange={(v) => onSelect(v ? [...selected, key] : selected.filter(id => id !== key))} />
                    </td>
                  )}
                  {columns.map(col => <td key={col.key} style={col.cellStyle}>{col.render(row)}</td>)}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {sorted.length > pageSize && (
        <div className="tg-pager">
          <span style={{ fontSize: 12.5, color: "var(--text-3)" }}>{curPage * pageSize + 1}–{Math.min((curPage + 1) * pageSize, sorted.length)} / {sorted.length}</span>
          <div className="tg-pager-btns">
            <button className="tg-pager-num" disabled={curPage === 0} onClick={() => setPage(curPage - 1)}><I.chevLeft size={15} /></button>
            {Array.from({ length: pageCount }).slice(Math.max(0, curPage - 2), Math.max(0, curPage - 2) + 5).map((_, i) => {
              const p = Math.max(0, curPage - 2) + i;
              return <button key={p} className="tg-pager-num" data-active={p === curPage ? "1" : undefined} onClick={() => setPage(p)}>{p + 1}</button>;
            })}
            <button className="tg-pager-num" disabled={curPage >= pageCount - 1} onClick={() => setPage(curPage + 1)}><I.chevRight size={15} /></button>
          </div>
        </div>
      )}
    </div>
  );
}

// CSV export helper
function exportCSV(filename, rows, mapper) {
  const data = rows.map(mapper);
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const csv = [headers.join(","), ...data.map(r => headers.map(h => {
    const v = r[h] == null ? "" : String(r[h]).replace(/"/g, '""');
    return /[",\n]/.test(v) ? `"${v}"` : v;
  }).join(","))].join("\n");
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// Excel export (tab-separated, opens natively in Excel/LibreOffice)
function exportXLS(filename, rows, mapper) {
  const data = rows.map(mapper);
  if (!data.length) return;
  const headers = Object.keys(data[0]);
  const tsv = [headers.join("\t"), ...data.map(r => headers.map(h => r[h] ?? "").join("\t"))].join("\n");
  const blob = new Blob(["\ufeff" + tsv], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// JSON export
function exportJSON(filename, rows, mapper) {
  const data = rows.map(mapper);
  if (!data.length) return;
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

Object.assign(window, { DataTable, Checkbox, exportCSV, exportXLS, exportJSON });
