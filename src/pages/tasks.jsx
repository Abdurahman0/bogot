/* pages/tasks.jsx */
const { useState: tkS, useMemo: tkM, useEffect: tkE, useRef: tkR } = React;

const TASK_COLUMN_META = {
  todo: { label: "Navbat", color: "#2563eb", bg: "#eff6ff", icon: "clock" },
  in_progress: { label: "Jarayonda", color: "#7c3aed", bg: "#f5f3ff", icon: "play" },
  done: { label: "Bajarilgan", color: "#059669", bg: "#ecfdf5", icon: "checkCircle" },
  canceled: { label: "Bekor qilingan", color: "#dc2626", bg: "#fef2f2", icon: "x" },
};

function getTaskColumns(data) {
  const rows = data.taskColumns || [];
  return rows
    .slice()
    .sort((a, b) => Number(a.position || 0) - Number(b.position || 0))
    .map((column, index) => ({
      ...column,
      name: column.name || TASK_COLUMN_META[column.slug]?.label || `Ustun ${index + 1}`,
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

function createTaskDraft(data, initial = null) {
  const columns = getTaskColumns(data);
  const assignees = taskAssignees(data);
  const defaultColumn = columns.find((column) => isApiUuid(column.id)) || columns[0] || { id: "", slug: "todo", name: "Navbat" };
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

function TaskBoardCard({ task, user, meta, interactive = true }) {
  const overdue = isTaskOverdue(task);
  return (
    <>
      <div className="pk-card-tags">
        <span className="pk-tag-pill" style={{ background: overdue ? "#fef2f2" : meta.bg, color: overdue ? "#dc2626" : meta.color }}>
          {overdue ? "Muddati o'tgan" : meta.name}
        </span>
      </div>
      <div className="pk-card-title">{task.title}</div>
      <div className="pk-card-desc">{task.description || "Tavsif kiritilmagan"}</div>
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

function TaskFormModal({ open, onClose, initial }) {
  const { data, upsert, toast } = useApp();
  const columns = getTaskColumns(data);
  const assignees = taskAssignees(data);
  const [form, setForm] = tkS(() => createTaskDraft(data, initial));
  const set = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  tkE(() => {
    if (!open) return;
    setForm(createTaskDraft(data, initial));
  }, [open, initial, data.tasks, data.taskColumns, data.taskAssignees]);

  const save = async () => {
    if (!form.title.trim()) return;
    if (!isApiUuid(form.columnId)) {
      toast("Vazifa uchun haqiqiy ustun tanlang", "error");
      return;
    }
    if (form.assignedUserId && !isApiUuid(form.assignedUserId)) {
      toast("Mas'ul foydalanuvchi UUID bilan kelmadi", "error");
      return;
    }
    const columnTasks = (data.tasks || []).filter((task) => task.columnId === form.columnId && task.id !== initial?.id);
    const payload = {
      ...initial,
      ...form,
      id: initial?.id,
      dueDate: new Date(form.dueDate).toISOString(),
      position: initial?.position ?? columnTasks.length,
      createdAt: initial?.createdAt || new Date().toISOString(),
    };
    await upsert("tasks", payload);
    toast(initial ? "Vazifa yangilandi" : "Vazifa yaratildi");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? "Vazifani tahrirlash" : "Yangi vazifa"}
      icon={<I.checkCircle size={18} />}
      width={520}
      footer={<><Button variant="ghost" onClick={onClose}>Bekor qilish</Button><Button variant="primary" onClick={save}>Saqlash</Button></>}
    >
      <div style={{ display: "grid", gap: 14 }}>
        <Field label="Sarlavha" required><Input value={form.title} onChange={(event) => set("title", event.target.value)} placeholder="Masalan, mijoz bilan bog'lanish" /></Field>
        <Field label="Tavsif"><Textarea value={form.description || ""} onChange={(event) => set("description", event.target.value)} placeholder="Vazifa tafsilotlari..." rows={4} /></Field>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <Field label="Ustun"><Select value={form.columnId} onChange={(value) => set("columnId", value)} options={columns.map((column) => ({ value: column.id, label: column.name }))} /></Field>
          <Field label="Mas'ul"><Select value={form.assignedUserId} onChange={(value) => set("assignedUserId", value)} options={assignees.map((user) => ({ value: user.id, label: user.fullName }))} /></Field>
        </div>
        <Field label="Muddat"><Input type="datetime-local" value={form.dueDate} onChange={(event) => set("dueDate", event.target.value)} /></Field>
      </div>
    </Modal>
  );
}
window.TaskFormModal = TaskFormModal;

function TaskViewModal({ task, user, column, open, onClose, onEdit, onDelete }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Vazifa ma'lumotlari"
      icon={<I.checkCircle size={18} />}
      width={520}
      footer={
        <>
          <Button variant="default" onClick={onEdit} icon={<I.edit size={15} />}>Tahrirlash</Button>
          <Button variant="danger" onClick={onDelete} icon={<I.trash size={15} />}>O'chirish</Button>
        </>
      }
    >
      {task && (
        <div style={{ display: "grid", gap: 16 }}>
          <div className="tg-meta">
            <div className="tg-meta-row"><span className="tg-meta-k">Sarlavha</span><span className="tg-meta-v">{task.title}</span></div>
            <div className="tg-meta-row"><span className="tg-meta-k">Ustun</span><span className="tg-meta-v">{column?.name || "Belgilanmagan"}</span></div>
            <div className="tg-meta-row"><span className="tg-meta-k">Mas'ul</span><span className="tg-meta-v">{user?.fullName || "Tayinlanmagan"}</span></div>
            <div className="tg-meta-row"><span className="tg-meta-k">Muddat</span><span className="tg-meta-v">{fmtDate(task.dueDate, true)}</span></div>
            <div className="tg-meta-row"><span className="tg-meta-k">Holat</span><span className="tg-meta-v">{isTaskOverdue(task) ? "Muddati o'tgan" : column?.name || "Belgilanmagan"}</span></div>
          </div>
          <div>
            <div className="tg-section-title">Tavsif</div>
            <div style={{ padding: 14, borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)", fontSize: 13.5, lineHeight: 1.6 }}>
              {task.description || "Tavsif kiritilmagan"}
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}

function TasksPage() {
  const { data, t, toast, moveTask, remove } = useApp();
  const [q, setQ] = tkS("");
  const [addOpen, setAddOpen] = tkS(false);
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
  const userOf = (id) => assignees.find((user) => user.id === id) || data.users.find((user) => user.id === id);

  tkE(() => {
    if (!moving) setOptimisticTasks(null);
  }, [data.tasks, moving]);

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
      const nextColumnId = dragState.overColumnId || dragState.fromColumnId;
      const nextIndex = dragState.overIndex == null ? 0 : dragState.overIndex;
      const optimistic = moveTaskInList(sourceTasks, dragState.id, columns, nextColumnId, nextIndex);
      if (optimistic) setOptimisticTasks(optimistic);
      setDragState(null);
      setMoving(true);
      try {
        await moveTask(dragState.id, nextColumnId, nextIndex);
        toast("Vazifa joyi yangilandi");
      } catch (error) {
        setOptimisticTasks(null);
        toast(error.message || "Vazifa ko'chirilmadi", "error");
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

  return (
    <div className="pk-page fade-in">
      <div className="pk-page-head">
        <PageHeader
          title={t("page.tasks")}
          desc={`${counts.total} ta vazifa • backend ustunlari bilan`}
          crumbs={[{ label: "CRM" }, { label: t("page.tasks") }]}
          actions={<>
            <SearchInput value={q} onChange={setQ} placeholder="Vazifa qidirish..." width={220} />
            <Button variant="primary" size="sm" icon={<I.plus size={15} />} onClick={() => setAddOpen(true)}>Yangi vazifa</Button>
          </>}
        />

        <div className="pk-stats-row">
          <div className="pk-stat-pill"><span>Jami vazifalar</span><strong>{counts.total}</strong></div>
          <div className="pk-stat-pill pk-stat-pill-accent"><span>Faol</span><strong>{counts.open}</strong></div>
          <div className="pk-stat-pill"><span>Muddati o'tgan</span><strong>{counts.overdue}</strong></div>
          <div className="pk-stat-pill"><span>Bajarilgan</span><strong>{counts.done}</strong></div>
        </div>
      </div>

      <div className={`pk-board${dragState || moving || optimisticTasks ? " pk-board-dragging" : ""}`}>
        {!columns.length && (
          <Card style={{ padding: 24 }}>
            <EmptyState icon={<I.layers size={24} />} title="Ustunlar topilmadi" message="Backenddan task ustunlari kelmadi." />
          </Card>
        )}
        {columns.map((column) => {
          const baseMeta = TASK_COLUMN_META[column.slug] || TASK_COLUMN_META.todo;
          const meta = { ...baseMeta, name: column.name };
          const rawItems = tasks.filter((task) => task.columnId === column.id);
          const items = dragState ? rawItems.filter((task) => task.id !== dragState.id) : rawItems;
          const hasDropTarget = dragState && dragState.overColumnId === column.id;
          const insertIndex = hasDropTarget ? Math.max(0, Math.min(dragState.overIndex ?? items.length, items.length)) : -1;

          return (
            <div key={column.id} className={`pk-col${hasDropTarget ? " pk-col-over" : ""}`} style={{ "--col-color": meta.color }} data-task-column-id={column.id}>
              <div className="pk-col-header">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span className="pk-col-name">{column.name}</span>
                  <span className="pk-col-cnt">{rawItems.length}</span>
                </div>
                <span className="pk-col-total">{rawItems.length} ta</span>
              </div>

              <div className={`pk-cards${hasDropTarget ? " pk-cards-over" : ""}`}>
                {!items.length && !hasDropTarget && (
                  <div className="pk-empty-col">
                    <div className="pk-empty-icon" style={{ background: meta.bg, color: meta.color }}>{React.createElement(I[meta.icon], { size: 18 })}</div>
                    <span>Vazifa yo'q</span>
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
                      style={{ "--idx": index }}
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
            </div>
          );
        })}
      </div>

      {dragTask && dragState && (
        <div className="pk-drag-layer" style={{ width: dragState.width || 296, transform: `translate3d(${dragState.pointerX - dragState.offsetX}px, ${dragState.pointerY - dragState.offsetY}px, 0)` }}>
          <div className="pk-card pk-card-floating">
            <TaskBoardCard task={dragTask} user={userOf(dragTask.assignedUserId)} meta={{ ...(TASK_COLUMN_META[dragTask.columnSlug] || TASK_COLUMN_META.todo), name: columnsById[dragTask.columnId]?.name || "Vazifa" }} interactive={false} />
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
      <TaskFormModal open={addOpen} onClose={() => setAddOpen(false)} />
      <TaskFormModal open={!!editTask} onClose={() => setEditTask(null)} initial={editTask} />
      <ConfirmDialog
        open={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        onConfirm={async () => {
          await remove("tasks", deleteTask.id);
          toast("Vazifa o'chirildi");
          setDeleteTask(null);
        }}
        title="Vazifani o'chirish"
        message={`"${deleteTask?.title || ""}" vazifasini o'chirmoqchimisiz?`}
        details={deleteTask ? `Muddat: ${fmtDate(deleteTask.dueDate, true)}\nUstun: ${columnsById[deleteTask.columnId]?.name || "Belgilanmagan"}` : ""}
        confirmLabel="O'chirish"
        danger
      />

      {moving && (
        <div style={{ position: "fixed", right: 20, bottom: 20, zIndex: 70 }}>
          <Card style={{ padding: "10px 14px" }}>Vazifa yangilanmoqda...</Card>
        </div>
      )}
    </div>
  );
}

window.TasksPage = TasksPage;
window.CalendarPage = function CalendarPage() { return null; };
