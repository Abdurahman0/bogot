/* pages/tasks.jsx */
const { useState: tkS, useMemo: tkM, useEffect: tkE, useRef: tkR } = React;
const TASKS_UI = {
  uz: {
    todo: "Navbat", inProgress: "Jarayonda", done: "Bajarilgan", canceled: "Bekor qilingan",
    overdue: "Muddati o'tgan", noDesc: "Tavsif kiritilmagan", noTasks: "Vazifa yo'q",
    noColumns: "Ustunlar topilmadi", noColumnsMsg: "Backenddan task ustunlari kelmadi.",
    totalTasks: "Jami vazifalar", activeTasks: "Faol", overdueCount: "Muddati o'tgan", doneCount: "Bajarilgan",
    newTask: "Yangi vazifa", newColumn: "Yangi ustun", addTask: "Vazifa qo'shish",
    taskCreated: "Vazifa yaratildi", taskUpdated: "Vazifa yangilandi", taskDeleted: "Vazifa o'chirildi",
    columnCreated: "Yangi ustun yaratildi", columnUpdated: "Ustun yangilandi", columnDeleted: "Ustun o'chirildi",
    taskMoveError: "Vazifa ko'chirilmadi",
    deleteTaskTitle: "Vazifani o'chirish", deleteTaskConfirm: "O'chirish",
    deleteColTitle: "Ustunni o'chirish", deleteColConfirm: "O'chirish",
    editColumn: "Ustunni tahrirlash", deleteColumn: "Ustunni o'chirish",
    taskFormNew: "Yangi vazifa", taskFormEdit: "Vazifani tahrirlash",
    colFormNew: "Yangi ustun", colFormEdit: "Ustunni tahrirlash",
    viewTitle: "Vazifa ma'lumotlari",
    fieldTitle: "Sarlavha", fieldDesc: "Tavsif", fieldColumn: "Ustun", fieldAssigned: "Mas'ul", fieldDeadline: "Muddat",
    fieldColumnName: "Ustun nomi", fieldSlug: "Slug", fieldOrder: "Tartib", fieldColor: "Rang",
    metaTitle: "Sarlavha", metaColumn: "Ustun", metaAssigned: "Mas'ul", metaDeadline: "Muddat", metaStatus: "Holat",
    cancel: "Bekor qilish", save: "Saqlash", edit: "Tahrirlash", delete: "O'chirish",
    taskPh: "Masalan, mijoz bilan bog'lanish", descPh: "Vazifa tafsilotlari...", columnPh: "Masalan, Tekshiruv", slugPh: "tekshiruv_bosqichi",
    validColumn: "Vazifa uchun haqiqiy ustun tanlang", validUser: "Mas'ul foydalanuvchi UUID bilan kelmadi",
    detailsDeadline: "Muddat:", detailsColumn: "Ustun:", detailsSlug: "Slug:", detailsOrder: "Tartib:",
    unassigned: "Belgilanmagan",
    crmCrumb: "CRM",
    searchTasks: "Vazifa qidirish...", tasksBoardDesc: "ta vazifa • backend ustunlari bilan",
    deleteTaskMsg: '"{0}" vazifasini o\'chirmoqchimisiz?', deleteColMsg: '"{0}" ustunini o\'chirmoqchimisiz?',
    taskFallback: "Vazifa", unassignedUser: "Tayinlanmagan",
  },
  ru: {
    todo: "В очереди", inProgress: "В процессе", done: "Выполнено", canceled: "Отменено",
    overdue: "Просрочено", noDesc: "Описание не указано", noTasks: "Нет задач",
    noColumns: "Колонки не найдены", noColumnsMsg: "Колонки задач не получены с бэкенда.",
    totalTasks: "Всего задач", activeTasks: "Активных", overdueCount: "Просроченных", doneCount: "Выполнено",
    newTask: "Новая задача", newColumn: "Новая колонка", addTask: "Добавить задачу",
    taskCreated: "Задача создана", taskUpdated: "Задача обновлена", taskDeleted: "Задача удалена",
    columnCreated: "Новая колонка создана", columnUpdated: "Колонка обновлена", columnDeleted: "Колонка удалена",
    taskMoveError: "Задача не перемещена",
    deleteTaskTitle: "Удалить задачу", deleteTaskConfirm: "Удалить",
    deleteColTitle: "Удалить колонку", deleteColConfirm: "Удалить",
    editColumn: "Редактировать колонку", deleteColumn: "Удалить колонку",
    taskFormNew: "Новая задача", taskFormEdit: "Редактировать задачу",
    colFormNew: "Новая колонка", colFormEdit: "Редактировать колонку",
    viewTitle: "Информация о задаче",
    fieldTitle: "Заголовок", fieldDesc: "Описание", fieldColumn: "Колонка", fieldAssigned: "Ответственный", fieldDeadline: "Срок",
    fieldColumnName: "Название колонки", fieldSlug: "Slug", fieldOrder: "Порядок", fieldColor: "Цвет",
    metaTitle: "Заголовок", metaColumn: "Колонка", metaAssigned: "Ответственный", metaDeadline: "Срок", metaStatus: "Статус",
    cancel: "Отмена", save: "Сохранить", edit: "Редактировать", delete: "Удалить",
    taskPh: "Напр., связаться с клиентом", descPh: "Детали задачи...", columnPh: "Напр., Проверка", slugPh: "etap_proverki",
    validColumn: "Выберите действительную колонку для задачи", validUser: "Ответственный пользователь не имеет UUID",
    detailsDeadline: "Срок:", detailsColumn: "Колонка:", detailsSlug: "Slug:", detailsOrder: "Порядок:",
    unassigned: "Не указано",
    crmCrumb: "CRM",
    searchTasks: "Поиск задач...", tasksBoardDesc: "задач • с колонками бэкенда",
    deleteTaskMsg: 'Удалить задачу "{0}"?', deleteColMsg: 'Удалить колонку "{0}"?',
    taskFallback: "Задача", unassignedUser: "Не назначено",
  },
  en: {
    todo: "Queue", inProgress: "In progress", done: "Done", canceled: "Canceled",
    overdue: "Overdue", noDesc: "No description", noTasks: "No tasks",
    noColumns: "No columns found", noColumnsMsg: "No task columns received from backend.",
    totalTasks: "Total tasks", activeTasks: "Active", overdueCount: "Overdue", doneCount: "Done",
    newTask: "New task", newColumn: "New column", addTask: "Add task",
    taskCreated: "Task created", taskUpdated: "Task updated", taskDeleted: "Task deleted",
    columnCreated: "New column created", columnUpdated: "Column updated", columnDeleted: "Column deleted",
    taskMoveError: "Task not moved",
    deleteTaskTitle: "Delete task", deleteTaskConfirm: "Delete",
    deleteColTitle: "Delete column", deleteColConfirm: "Delete",
    editColumn: "Edit column", deleteColumn: "Delete column",
    taskFormNew: "New task", taskFormEdit: "Edit task",
    colFormNew: "New column", colFormEdit: "Edit column",
    viewTitle: "Task details",
    fieldTitle: "Title", fieldDesc: "Description", fieldColumn: "Column", fieldAssigned: "Assigned", fieldDeadline: "Due date",
    fieldColumnName: "Column name", fieldSlug: "Slug", fieldOrder: "Order", fieldColor: "Color",
    metaTitle: "Title", metaColumn: "Column", metaAssigned: "Assigned", metaDeadline: "Due date", metaStatus: "Status",
    cancel: "Cancel", save: "Save", edit: "Edit", delete: "Delete",
    taskPh: "e.g. Contact customer", descPh: "Task details...", columnPh: "e.g. Review", slugPh: "review_stage",
    validColumn: "Select a valid column for the task", validUser: "Responsible user has no UUID",
    detailsDeadline: "Due:", detailsColumn: "Column:", detailsSlug: "Slug:", detailsOrder: "Order:",
    unassigned: "Unassigned",
    crmCrumb: "CRM",
    searchTasks: "Search tasks...", tasksBoardDesc: "tasks • with backend columns",
    deleteTaskMsg: 'Delete task "{0}"?', deleteColMsg: 'Delete column "{0}"?',
    taskFallback: "Task", unassignedUser: "Unassigned",
  },
};
function tskLang() { return window.__TG_LANG || "uz"; }
function tskTx(key) { return TASKS_UI[tskLang()]?.[key] || TASKS_UI.uz[key] || key; }
const SLUG_KEYS = { todo: "todo", in_progress: "inProgress", done: "done", canceled: "canceled" };

const TASK_COLUMN_META = {
  todo: { label: "Navbat", color: "#2563eb", bg: "#eff6ff", icon: "clock" },
  in_progress: { label: "Jarayonda", color: "#7c3aed", bg: "#f5f3ff", icon: "hourglass" },
  done: { label: "Bajarilgan", color: "#059669", bg: "#ecfdf5", icon: "checkCircle" },
  canceled: { label: "Bekor qilingan", color: "#dc2626", bg: "#fef2f2", icon: "x" },
};

const TASK_COLUMN_COLOR_OPTIONS = [
  "#2563eb",
  "#7c3aed",
  "#059669",
  "#dc2626",
  "#ea580c",
  "#0891b2",
  "#4f46e5",
  "#ca8a04",
];

function hexToSoftBg(hex, alpha = 0.12) {
  const clean = String(hex || "").replace("#", "");
  if (!/^[0-9a-f]{6}$/i.test(clean)) return "var(--surface-2)";
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function getTaskColumns(data) {
  const rows = data.taskColumns || [];
  return rows
    .slice()
    .sort((a, b) => Number(a.position || 0) - Number(b.position || 0))
    .map((column, index) => ({
      ...column,
      name: column.name || (SLUG_KEYS[column.slug] ? tskTx(SLUG_KEYS[column.slug]) : null) || TASK_COLUMN_META[column.slug]?.label || `Ustun ${index + 1}`,
      color: column.color || TASK_COLUMN_META[column.slug]?.color || TASK_COLUMN_COLOR_OPTIONS[index % TASK_COLUMN_COLOR_OPTIONS.length],
      sortOrder: Number((column.sortOrder ?? column.position) || index + 1),
      position: Number((column.position ?? column.sortOrder) || index + 1),
    }));
}

function taskAssignees(data) {
  return (data.taskAssignees || []).length ? data.taskAssignees : (data.users || []).filter((user) => user.status !== "inactive");
}

function isTaskDone(task) {
  return task.columnSlug === "done";
}

function isTaskOverdue(task) {
  return !isTaskDone(task) && task.dueDate && new Date(task.dueDate).getTime() < Date.now();
}

function taskColumnSlugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "") || "task_column";
}

function createTaskDraft(data, initial = null) {
  const columns = getTaskColumns(data);
  const assignees = taskAssignees(data);
  const defaultColumn = columns.find((column) => isApiUuid(column.id)) || columns[0] || { id: "", slug: "todo", name: tskTx("todo") };
  const defaultAssignee = assignees.find((user) => isApiUuid(user.id))?.id || "";
  if (initial) {
    return {
      ...initial,
      title: initial.title || "",
      description: initial.description || initial.notes || "",
      assignedUserId: initial.assignedUserId || defaultAssignee,
      columnId: initial.columnId || defaultColumn.id,
      dueDate: String(initial.dueDate || new Date().toISOString()).slice(0, 16),
    };
  }
  return {
    title: "",
    description: "",
    assignedUserId: defaultAssignee,
    columnId: defaultColumn.id,
    dueDate: new Date(Date.now() + 86400000).toISOString().slice(0, 16),
  };
}

function getTaskDropTarget(clientX, clientY, dragId) {
  const el = document.elementFromPoint(clientX, clientY);
  const col = el && el.closest ? el.closest("[data-task-column-id]") : null;
  if (!col) return null;

  const columnId = col.dataset.taskColumnId;
  const cards = Array.from(col.querySelectorAll(".pk-card[data-task-id]"))
    .filter((card) => card.dataset.taskId !== dragId);

  let index = cards.length;
  for (let i = 0; i < cards.length; i += 1) {
    const rect = cards[i].getBoundingClientRect();
    if (clientY < rect.top + rect.height / 2) {
      index = i;
      break;
    }
  }

  return { columnId, index };
}

function moveTaskInList(tasks, taskId, columns, targetColumnId, targetIndex) {
  const list = (tasks || []).slice().sort((a, b) => {
    const columnA = columns.find((column) => column.id === a.columnId)?.position ?? 0;
    const columnB = columns.find((column) => column.id === b.columnId)?.position ?? 0;
    if (columnA !== columnB) return columnA - columnB;
    return Number(a.position || 0) - Number(b.position || 0);
  });
  const dragged = list.find((task) => task.id === taskId);
  if (!dragged) return null;

  const nextColumns = columns.slice().sort((a, b) => Number(a.position || 0) - Number(b.position || 0));
  const remaining = list.filter((task) => task.id !== taskId);
  const buckets = Object.fromEntries(nextColumns.map((column) => [column.id, []]));

  remaining.forEach((task) => {
    if (!buckets[task.columnId]) buckets[task.columnId] = [];
    buckets[task.columnId].push(task);
  });

  Object.keys(buckets).forEach((columnId) => {
    buckets[columnId] = buckets[columnId].slice().sort((a, b) => Number(a.position || 0) - Number(b.position || 0));
  });

  if (!buckets[targetColumnId]) buckets[targetColumnId] = [];
  const insertAt = Math.max(0, Math.min(targetIndex, buckets[targetColumnId].length));
  buckets[targetColumnId].splice(insertAt, 0, {
    ...dragged,
    columnId: targetColumnId,
    columnSlug: nextColumns.find((column) => column.id === targetColumnId)?.slug || dragged.columnSlug,
    columnName: nextColumns.find((column) => column.id === targetColumnId)?.name || dragged.columnName,
  });

  return Object.entries(buckets)
    .sort((a, b) => {
      const columnA = nextColumns.find((column) => column.id === a[0])?.position ?? Number.MAX_SAFE_INTEGER;
      const columnB = nextColumns.find((column) => column.id === b[0])?.position ?? Number.MAX_SAFE_INTEGER;
      return columnA - columnB;
    })
    .flatMap(([, rows]) => rows.map((task, index) => ({ ...task, position: index })));
}

function taskBoardSignature(tasks, columns) {
  const order = (tasks || []).slice().sort((a, b) => {
    const columnA = columns.find((column) => column.id === a.columnId)?.position ?? 0;
    const columnB = columns.find((column) => column.id === b.columnId)?.position ?? 0;
    if (columnA !== columnB) return columnA - columnB;
    return Number(a.position || 0) - Number(b.position || 0);
  });
  return order.map((task) => `${task.id}:${task.columnId}:${Number(task.position || 0)}`).join("|");
}

function TaskBoardCard({ task, user, meta, interactive = true }) {
  const overdue = isTaskOverdue(task);
  return (
    <>
      <div className="pk-card-tags">
        <span className="pk-tag-pill" style={{ background: overdue ? "#fef2f2" : meta.bg, color: overdue ? "#dc2626" : meta.color }}>
          {overdue ? tskTx("overdue") : meta.name}
        </span>
      </div>
      <div className="pk-card-title">{task.title}</div>
      <div className="pk-card-desc">{task.description || tskTx("noDesc")}</div>
      <div className="pk-card-footer">
        <span className="pk-card-date"><I.calendar size={11} />{fmtDate(task.dueDate, true)}</span>
        <div className="pk-footer-spacer" />
        {user && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--text-3)" }}>
            <Avatar name={user.fullName} hue={user.avatarHue} size={20} />
            <span>{user.fullName.split(" ")[0]}</span>
          </span>
        )}
      </div>
    </>
  );
}

function TaskFormModal({ open, onClose, initial, initialColumnId = "" }) {
  const { data, upsert, toast } = useApp();
  const columns = getTaskColumns(data);
  const assignees = taskAssignees(data);
  const [form, setForm] = tkS(() => {
    const draft = createTaskDraft(data, initial);
    return initialColumnId && !initial ? { ...draft, columnId: initialColumnId } : draft;
  });
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  tkE(() => {
    if (!open) return;
    const draft = createTaskDraft(data, initial);
    setForm(initialColumnId && !initial ? { ...draft, columnId: initialColumnId } : draft);
  }, [open, initial, initialColumnId, data.tasks, data.taskColumns, data.taskAssignees]);

  const save = async () => {
    if (!form.title.trim()) return;
    if (!isApiUuid(form.columnId)) {
      toast(tskTx("validColumn"), "error");
      return;
    }
    if (form.assignedUserId && !isApiUuid(form.assignedUserId)) {
      toast(tskTx("validUser"), "error");
      return;
    }
    const columnTasks = (data.tasks || []).filter((task) => task.columnId === form.columnId && task.id !== initial?.id);
    const payload = {
      ...initial,
      ...form,
      id: initial?.id,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      position: initial?.position ?? columnTasks.length,
      createdAt: initial?.createdAt || new Date().toISOString(),
    };
    await upsert("tasks", payload);
    toast(initial ? tskTx("taskUpdated") : tskTx("taskCreated"));
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? tskTx("taskFormEdit") : tskTx("taskFormNew")}
      icon={<I.checkCircle size={18} />}
      width={520}
      footer={<><Button variant="ghost" onClick={onClose}>{tskTx("cancel")}</Button><Button variant="primary" onClick={save}>{tskTx("save")}</Button></>}
    >
      <div style={{ display: "grid", gap: 14 }}>
        <Field label={tskTx("fieldTitle")} required><Input value={form.title} onChange={(event) => set("title", event.target.value)} placeholder={tskTx("taskPh")} /></Field>
        <Field label={tskTx("fieldDesc")}><Textarea value={form.description || ""} onChange={(event) => set("description", event.target.value)} placeholder={tskTx("descPh")} rows={4} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label={tskTx("fieldColumn")}><Select value={form.columnId} onChange={(value) => set("columnId", value)} options={columns.map((column) => ({ value: column.id, label: column.name }))} /></Field>
          <Field label={tskTx("fieldAssigned")}><Select value={form.assignedUserId} onChange={(value) => set("assignedUserId", value)} options={assignees.map((user) => ({ value: user.id, label: user.fullName }))} /></Field>
        </div>
        <Field label={tskTx("fieldDeadline")}><DatePickerInput mode="datetime" value={form.dueDate} onChange={(value) => set("dueDate", value)} /></Field>
      </div>
    </Modal>
  );
}
window.TaskFormModal = TaskFormModal;

function TaskColumnModal({ open, onClose, initialPosition = 0, initial = null, onSave }) {
  const [form, setForm] = tkS({ name: "", slug: "", position: initialPosition, color: TASK_COLUMN_COLOR_OPTIONS[0] });
  const [slugTouched, setSlugTouched] = tkS(false);
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  tkE(() => {
    if (!open) return;
    setForm({
      name: initial?.name || "",
      slug: initial?.slug || "",
      position: initial?.position || initialPosition,
      color: initial?.color || TASK_COLUMN_META[initial?.slug]?.color || TASK_COLUMN_COLOR_OPTIONS[0],
    });
    setSlugTouched(!!initial?.slug);
  }, [open, initial, initialPosition]);

  const setName = (value) => {
    setForm((current) => ({
      ...current,
      name: value,
      slug: slugTouched ? current.slug : taskColumnSlugify(value),
    }));
  };

  const setSlug = (value) => {
    setSlugTouched(true);
    set("slug", taskColumnSlugify(value));
  };

  const save = async () => {
    if (!form.name.trim()) return;
    await onSave({
      ...initial,
      name: form.name.trim(),
      slug: taskColumnSlugify(form.slug || form.name),
      color: form.color || TASK_COLUMN_COLOR_OPTIONS[0],
      sortOrder: Math.max(1, Number(form.position || initialPosition || 1)),
      position: Math.max(1, Number(form.position || initialPosition || 1)),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? tskTx("colFormEdit") : tskTx("colFormNew")}
      icon={<I.layers size={18} />}
      width={460}
      footer={<><Button variant="ghost" onClick={onClose}>{tskTx("cancel")}</Button><Button variant="primary" onClick={save}>{tskTx("save")}</Button></>}
    >
      <div style={{ display: "grid", gap: 14 }}>
        <Field label={tskTx("fieldColumnName")} required><Input value={form.name} onChange={(event) => setName(event.target.value)} placeholder={tskTx("columnPh")} /></Field>
        <Field label={tskTx("fieldSlug")}><Input value={form.slug} onChange={(event) => setSlug(event.target.value)} placeholder={tskTx("slugPh")} /></Field>
        <Field label={tskTx("fieldOrder")}><Input type="number" min="1" value={form.position} onChange={(event) => set("position", event.target.value)} /></Field>
        <Field label={tskTx("fieldColor")}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {TASK_COLUMN_COLOR_OPTIONS.map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => set("color", color)}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  border: form.color === color ? `2px solid ${color}` : "1px solid var(--border)",
                  background: color,
                  boxShadow: form.color === color ? `0 0 0 3px ${hexToSoftBg(color)}` : "none",
                }}
              />
            ))}
          </div>
        </Field>
      </div>
    </Modal>
  );
}

function TaskViewModal({ task, user, column, open, onClose, onEdit, onDelete }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={tskTx("viewTitle")}
      icon={<I.checkCircle size={18} />}
      width={520}
      footer={
        <>
          <Button variant="default" onClick={onEdit} icon={<I.edit size={15} />}>{tskTx("edit")}</Button>
          <Button variant="danger" onClick={onDelete} icon={<I.trash size={15} />}>{tskTx("delete")}</Button>
        </>
      }
    >
      {task && (
        <div style={{ display: "grid", gap: 16 }}>
          <div className="tg-meta">
            <div className="tg-meta-row"><span className="tg-meta-k">{tskTx("metaTitle")}</span><span className="tg-meta-v">{task.title}</span></div>
            <div className="tg-meta-row"><span className="tg-meta-k">{tskTx("metaColumn")}</span><span className="tg-meta-v">{column?.name || tskTx("unassigned")}</span></div>
            <div className="tg-meta-row"><span className="tg-meta-k">{tskTx("metaAssigned")}</span><span className="tg-meta-v">{user?.fullName || tskTx("unassignedUser")}</span></div>
            <div className="tg-meta-row"><span className="tg-meta-k">{tskTx("metaDeadline")}</span><span className="tg-meta-v">{fmtDate(task.dueDate, true)}</span></div>
            <div className="tg-meta-row"><span className="tg-meta-k">{tskTx("metaStatus")}</span><span className="tg-meta-v">{isTaskOverdue(task) ? tskTx("overdue") : column?.name || tskTx("unassigned")}</span></div>
          </div>
          <div>
            <div className="tg-section-title">{tskTx("fieldDesc")}</div>
            <div style={{ padding: 14, borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 13.5, lineHeight: 1.6 }}>
              {task.description || tskTx("noDesc")}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function TasksPage() {
  const { data, t, toast, moveTask, remove, reloadData } = useApp();
  const [q, setQ] = tkS("");
  const [createTaskColumnId, setCreateTaskColumnId] = tkS("");
  const [columnModalOpen, setColumnModalOpen] = tkS(false);
  const [editColumn, setEditColumn] = tkS(null);
  const [deleteColumn, setDeleteColumn] = tkS(null);
  const [editTask, setEditTask] = tkS(null);
  const [viewTask, setViewTask] = tkS(null);
  const [deleteTask, setDeleteTask] = tkS(null);
  const [dragState, setDragState] = tkS(null);
  const [moving, setMoving] = tkS(false);
  const [optimisticTasks, setOptimisticTasks] = tkS(null);
  const pendingRef = tkR(null);
  const suppressClickRef = tkR(false);

  const columns = tkM(() => getTaskColumns(data), [data.taskColumns, data.tasks]);
  const columnsById = tkM(() => Object.fromEntries(columns.map((column) => [column.id, column])), [columns]);
  const assignees = tkM(() => taskAssignees(data), [data.taskAssignees, data.users]);
  const sourceTasks = optimisticTasks || data.tasks || [];
  const tasks = tkM(() => sourceTasks
    .filter((task) => !q || task.title.toLowerCase().includes(q.toLowerCase()) || (task.description || "").toLowerCase().includes(q.toLowerCase()))
    .slice()
    .sort((a, b) => {
      const columnA = columnsById[a.columnId]?.position ?? 0;
      const columnB = columnsById[b.columnId]?.position ?? 0;
      if (columnA !== columnB) return columnA - columnB;
      return Number(a.position || 0) - Number(b.position || 0);
    }), [sourceTasks, q, columnsById]);

  const counts = tkM(() => ({
    total: sourceTasks.length,
    overdue: sourceTasks.filter((task) => isTaskOverdue(task)).length,
    done: sourceTasks.filter((task) => task.columnSlug === "done").length,
    open: sourceTasks.filter((task) => task.columnSlug !== "done" && task.columnSlug !== "canceled").length,
  }), [sourceTasks]);

  const dragTask = tkM(() => dragState ? sourceTasks.find((task) => task.id === dragState.id) || null : null, [sourceTasks, dragState]);
  const remoteTaskSignature = tkM(() => taskBoardSignature(data.tasks || [], columns), [data.tasks, columns]);
  const optimisticSignature = tkM(() => optimisticTasks ? taskBoardSignature(optimisticTasks, columns) : "", [optimisticTasks, columns]);
  const userOf = (id) => assignees.find((user) => user.id === id) || data.users.find((user) => user.id === id);

  tkE(() => {
    if (!optimisticTasks || moving) return;
    if (remoteTaskSignature && remoteTaskSignature === optimisticSignature) {
      setOptimisticTasks(null);
    }
  }, [moving, optimisticTasks, optimisticSignature, remoteTaskSignature]);

  tkE(() => {
    if (!dragState) return undefined;
    const prevUserSelect = document.body.style.userSelect;
    const prevCursor = document.body.style.cursor;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "grabbing";
    return () => {
      document.body.style.userSelect = prevUserSelect;
      document.body.style.cursor = prevCursor;
    };
  }, [dragState]);

  tkE(() => {
    const onPointerMove = (event) => {
      const pending = pendingRef.current;
      if (!pending) return;

      const dx = event.clientX - pending.startX;
      const dy = event.clientY - pending.startY;
      const distance = Math.hypot(dx, dy);

      if (!dragState) {
        if (distance < 6) return;
        suppressClickRef.current = true;
        const target = getTaskDropTarget(event.clientX, event.clientY, pending.id) || { columnId: pending.fromColumnId, index: pending.fromIndex };
        setDragState({
          id: pending.id,
          fromColumnId: pending.fromColumnId,
          overColumnId: target.columnId,
          overIndex: target.index,
          pointerX: event.clientX,
          pointerY: event.clientY,
          offsetX: pending.offsetX,
          offsetY: pending.offsetY,
          width: pending.width,
          height: pending.height,
        });
        return;
      }

      const target = getTaskDropTarget(event.clientX, event.clientY, pending.id);
      setDragState((current) => current ? {
        ...current,
        pointerX: event.clientX,
        pointerY: event.clientY,
        overColumnId: target ? target.columnId : current.overColumnId,
        overIndex: target ? target.index : current.overIndex,
      } : current);
    };

    const onPointerUp = async () => {
      pendingRef.current = null;
      if (!dragState) return;
      const activeDrag = dragState;
      const nextColumnId = activeDrag.overColumnId || activeDrag.fromColumnId;
      const nextIndex = activeDrag.overIndex == null ? 0 : activeDrag.overIndex;
      const optimistic = moveTaskInList(sourceTasks, activeDrag.id, columns, nextColumnId, nextIndex);
      const currentSignature = taskBoardSignature(sourceTasks, columns);
      const nextSignature = optimistic ? taskBoardSignature(optimistic, columns) : currentSignature;
      if (!optimistic || currentSignature === nextSignature) {
        setDragState(null);
        window.setTimeout(() => { suppressClickRef.current = false; }, 0);
        return;
      }
      setMoving(true);
      setOptimisticTasks(optimistic);
      setDragState(null);
      try {
        await moveTask(activeDrag.id, nextColumnId, nextIndex);
      } catch (error) {
        setOptimisticTasks(null);
        toast(error.message || tskTx("taskMoveError"), "error");
      } finally {
        setMoving(false);
        window.setTimeout(() => { suppressClickRef.current = false; }, 0);
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
  }, [columns, dragState, moveTask, sourceTasks, toast]);

  const handlePointerDown = (event, task, columnId, index) => {
    if (event.button !== 0) return;
    if (event.target.closest("button")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    pendingRef.current = {
      id: task.id,
      fromColumnId: columnId,
      fromIndex: index,
      startX: event.clientX,
      startY: event.clientY,
      offsetX: event.clientX - rect.left,
      offsetY: event.clientY - rect.top,
      width: rect.width,
      height: rect.height,
    };
  };

  const handleCardClick = (task) => {
    if (suppressClickRef.current) return;
    setViewTask(task);
  };

  const saveColumnWithReorder = async (draft) => {
    const ordered = columns
      .slice()
      .sort((a, b) => Number(a.position || 0) - Number(b.position || 0));
    const existingIndex = ordered.findIndex((column) => column.id === draft.id);
    const base = existingIndex >= 0
      ? ordered.filter((column) => column.id !== draft.id)
      : ordered.slice();
    const targetPosition = Math.max(1, Math.min(Number(draft.position || 1), base.length + 1));
    base.splice(targetPosition - 1, 0, { ...(existingIndex >= 0 ? ordered[existingIndex] : {}), ...draft });

    const nextColumns = base.map((column, index) => ({
      ...column,
      name: (column.name || "").trim(),
      slug: taskColumnSlugify(column.slug || column.name || ""),
      color: column.color || TASK_COLUMN_META[column.slug]?.color || TASK_COLUMN_COLOR_OPTIONS[index % TASK_COLUMN_COLOR_OPTIONS.length],
      sortOrder: index + 1,
      position: index + 1,
    }));

    const created = nextColumns.find((column) => !column.id);
    if (created) {
      const createdResponse = await apiSaveTaskColumn(created);
      const createdId = createdResponse?.id || createdResponse?.data?.id || created.id;
      if (createdId) created.id = createdId;
    }

    for (const column of nextColumns) {
      if (!column.id) continue;
      await apiSaveTaskColumn(column);
    }

    await reloadData();
    toast(draft.id ? tskTx("columnUpdated") : tskTx("columnCreated"));
    if (editColumn?.id === draft.id) setEditColumn(null);
  };

  return (
    <div className="pk-page fade-in">
      <div className="pk-page-head">
        <PageHeader
          title={t("page.tasks")}
          desc={`${counts.total} ${tskTx("tasksBoardDesc")}`}
          crumbs={[{ label: tskTx("crmCrumb") }, { label: t("page.tasks") }]}
          actions={<>
            <SearchInput value={q} onChange={setQ} placeholder={tskTx("searchTasks")} width={220} />
            <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setColumnModalOpen(true)}>{tskTx("newColumn")}</Button>
          </>}
        />

        <div className="pk-stats-row">
          <div className="pk-stat-pill"><span>{tskTx("totalTasks")}</span><strong>{counts.total}</strong></div>
          <div className="pk-stat-pill pk-stat-pill-accent"><span>{tskTx("activeTasks")}</span><strong>{counts.open}</strong></div>
          <div className="pk-stat-pill"><span>{tskTx("overdueCount")}</span><strong>{counts.overdue}</strong></div>
          <div className="pk-stat-pill"><span>{tskTx("doneCount")}</span><strong>{counts.done}</strong></div>
        </div>
      </div>

      <div className={`pk-board${dragState || moving || optimisticTasks ? " pk-board-dragging" : ""}`}>
        {!columns.length && (
          <Card style={{ padding: 24 }}>
            <EmptyState icon={<I.layers size={24} />} title={tskTx("noColumns")} message={tskTx("noColumnsMsg")} />
          </Card>
        )}
        {columns.map((column) => {
          const baseMeta = TASK_COLUMN_META[column.slug] || TASK_COLUMN_META.todo;
          const meta = { ...baseMeta, name: column.name, color: column.color || baseMeta.color, bg: hexToSoftBg(column.color || baseMeta.color) };
          const rawItems = tasks.filter((task) => task.columnId === column.id);
          const items = dragState ? rawItems.filter((task) => task.id !== dragState.id) : rawItems;
          const hasDropTarget = dragState && dragState.overColumnId === column.id;
          const insertIndex = hasDropTarget ? Math.max(0, Math.min(dragState.overIndex ?? items.length, items.length)) : -1;

          return (
            <div
              key={column.id}
              className={`pk-col${hasDropTarget ? " pk-col-over" : ""}`}
              style={{
                "--col-color": meta.color,
                "--col-soft": hexToSoftBg(meta.color, 0.12),
                "--col-soft-strong": hexToSoftBg(meta.color, 0.22),
                "--col-soft-glow": hexToSoftBg(meta.color, 0.3),
              }}
              data-task-column-id={column.id}
            >
              <div className="pk-col-header">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="pk-col-name">{column.name}</span>
                  <span className="pk-col-cnt">{rawItems.length}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="pk-col-total">{rawItems.length} ta</span>
                  <IconButton icon={<I.edit size={14} />} label={tskTx("editColumn")} onClick={() => setEditColumn(column)} />
                  <IconButton icon={<I.trash size={14} />} label={tskTx("deleteColumn")} onClick={() => setDeleteColumn(column)} />
                </div>
              </div>

              <div className={`pk-cards${hasDropTarget ? " pk-cards-over" : ""}`}>
                {!items.length && !hasDropTarget && (
                  <div className="pk-empty-col">
                    <div className="pk-empty-icon" style={{ background: meta.bg, color: meta.color }}>{React.createElement(I[meta.icon], { size: 18 })}</div>
                    <span>{tskTx("noTasks")}</span>
                  </div>
                )}

                {items.map((task, index) => (
                  <React.Fragment key={task.id}>
                    {insertIndex === index && <div className="pk-ghost" style={{ height: dragState?.height || 120 }} />}
                    <div
                      className="pk-card"
                      data-task-id={task.id}
                      onPointerDown={(event) => handlePointerDown(event, task, column.id, index)}
                      onClick={() => handleCardClick(task)}
                      style={{
                        "--idx": index,
                        "--task-color": meta.color,
                        "--task-soft": hexToSoftBg(meta.color, 0.12),
                        "--task-soft-strong": hexToSoftBg(meta.color, 0.2),
                      }}
                    >
                      <TaskBoardCard
                        task={task}
                        user={userOf(task.assignedUserId)}
                        meta={meta}
                      />
                    </div>
                  </React.Fragment>
                ))}

                {insertIndex === items.length && dragState && dragState.overColumnId === column.id && (
                  <div className="pk-ghost" style={{ height: dragState.height || 120 }} />
                )}
              </div>
              <button type="button" className="pk-col-add" onClick={() => setCreateTaskColumnId(column.id)}>
                <I.plus size={14} />
                <span>{tskTx("addTask")}</span>
              </button>
            </div>
          );
        })}
      </div>

      {dragTask && dragState && (
        <div className="pk-drag-layer" style={{ width: dragState.width || 296, transform: `translate3d(${dragState.pointerX - dragState.offsetX}px, ${dragState.pointerY - dragState.offsetY}px, 0)` }}>
          <div
            className="pk-card pk-card-floating"
            style={{
              "--task-color": columnsById[dragTask.columnId]?.color || (TASK_COLUMN_META[dragTask.columnSlug] || TASK_COLUMN_META.todo).color,
              "--task-soft": hexToSoftBg(columnsById[dragTask.columnId]?.color || (TASK_COLUMN_META[dragTask.columnSlug] || TASK_COLUMN_META.todo).color, 0.12),
              "--task-soft-strong": hexToSoftBg(columnsById[dragTask.columnId]?.color || (TASK_COLUMN_META[dragTask.columnSlug] || TASK_COLUMN_META.todo).color, 0.2),
            }}
          >
            <TaskBoardCard task={dragTask} user={userOf(dragTask.assignedUserId)} meta={{ ...(TASK_COLUMN_META[dragTask.columnSlug] || TASK_COLUMN_META.todo), name: columnsById[dragTask.columnId]?.name || tskTx("taskFallback"), color: columnsById[dragTask.columnId]?.color || (TASK_COLUMN_META[dragTask.columnSlug] || TASK_COLUMN_META.todo).color, bg: hexToSoftBg(columnsById[dragTask.columnId]?.color || (TASK_COLUMN_META[dragTask.columnSlug] || TASK_COLUMN_META.todo).color, 0.12) }} interactive={false} />
          </div>
        </div>
      )}

      <TaskViewModal
        task={viewTask}
        user={viewTask ? userOf(viewTask.assignedUserId) : null}
        column={viewTask ? columnsById[viewTask.columnId] : null}
        open={!!viewTask}
        onClose={() => setViewTask(null)}
        onEdit={() => { setEditTask(viewTask); setViewTask(null); }}
        onDelete={() => { setDeleteTask(viewTask); setViewTask(null); }}
      />
      <TaskFormModal open={!!createTaskColumnId} onClose={() => setCreateTaskColumnId("")} initialColumnId={createTaskColumnId} />
      <TaskFormModal open={!!editTask} onClose={() => setEditTask(null)} initial={editTask} />
      <TaskColumnModal open={columnModalOpen} onClose={() => setColumnModalOpen(false)} initialPosition={columns.length + 1} onSave={saveColumnWithReorder} />
      <TaskColumnModal open={!!editColumn} onClose={() => setEditColumn(null)} initialPosition={editColumn?.position || 1} initial={editColumn} onSave={saveColumnWithReorder} />
      <ConfirmDialog
        open={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        onConfirm={async () => {
          await remove("tasks", deleteTask.id);
          toast(tskTx("taskDeleted"));
          setDeleteTask(null);
        }}
        title={tskTx("deleteTaskTitle")}
        message={tskTx("deleteTaskMsg").replace("{0}", deleteTask?.title || "")}
        details={deleteTask ? `${tskTx("detailsDeadline")} ${fmtDate(deleteTask.dueDate, true)}\n${tskTx("detailsColumn")} ${columnsById[deleteTask.columnId]?.name || tskTx("unassigned")}` : ""}
        confirmLabel={tskTx("deleteTaskConfirm")}
        danger
      />
      <ConfirmDialog
        open={!!deleteColumn}
        onClose={() => setDeleteColumn(null)}
        onConfirm={async () => {
          await remove("taskColumns", deleteColumn.id);
          toast(tskTx("columnDeleted"));
          setDeleteColumn(null);
        }}
        title={tskTx("deleteColTitle")}
        message={tskTx("deleteColMsg").replace("{0}", deleteColumn?.name || "")}
        details={deleteColumn ? `${tskTx("detailsSlug")} ${deleteColumn.slug || "-"}\n${tskTx("detailsOrder")} ${deleteColumn.position || 1}` : ""}
        confirmLabel={tskTx("deleteColConfirm")}
        danger
      />

    </div>
  );
}

window.TasksPage = TasksPage;
window.CalendarPage = function CalendarPage() { return null; };
