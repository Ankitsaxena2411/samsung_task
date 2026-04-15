import { useGetTasksQuery } from "../store/api";
import TaskCard from "./TaskCard";
import type { Task } from "../store/uiSlice";
import { useUpdateTaskMutation } from "../store/api";
import { useState } from "react";

const TaskBoard = () => {
  const { data, isLoading, error } = useGetTasksQuery({});
  const [updateTask] = useUpdateTaskMutation();
  const [draggedOver, setDraggedOver] = useState<string | null>(null);

  if (isLoading) return <div className="loader">Loading tasks...</div>;
  if (error)
    return (
      <div className="loader" style={{ color: "var(--danger-color)" }}>
        Error loading tasks! Is backend running?
      </div>
    );

  const tasks: Task[] = data?.tasks || [];

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  const columns = [
    { id: "TODO", title: "To Do", tasks: todoTasks, class: "todo" },
    {
      id: "IN_PROGRESS",
      title: "In Progress",
      tasks: inProgressTasks,
      class: "in-progress",
    },
    { id: "DONE", title: "Completed", tasks: doneTasks, class: "done" },
  ];

  return (
    <div className="kanban-board">
      {columns.map((col) => (
        <div
          key={col.id}
          className={`kanban-column ${draggedOver === col.id ? "drag-over" : ""}`}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "move";
            setDraggedOver(col.id);
          }}
          onDragLeave={() => setDraggedOver(null)}
          onDrop={async (e) => {
            e.preventDefault();
            setDraggedOver(null);
            try {
              const data = JSON.parse(
                e.dataTransfer.getData("application/json"),
              );
              const { taskId, currentStatus } = data;
              if (currentStatus !== col.id) {
                await updateTask({
                  id: taskId,
                  status: col.id as "TODO" | "IN_PROGRESS" | "DONE",
                }).unwrap();
              }
            } catch (err) {
              console.error("Failed to move task", err);
            }
          }}
        >
          <div className={`kanban-column-header ${col.class}`}>
            <span>{col.title}</span>
            <span className="task-count">{col.tasks.length}</span>
          </div>
          {col.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {col.tasks.length === 0 && (
            <p
              style={{
                color: "var(--text-muted)",
                fontSize: "0.85rem",
                textAlign: "center",
                marginTop: "2rem",
              }}
            >
              No tasks here yet.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
