import { useDispatch } from "react-redux";
import { openModal, type Task } from "../store/uiSlice";
import { Clock, ChevronDown } from "lucide-react";
import { FaRegEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useUpdateTaskMutation, useDeleteTaskMutation } from "../store/api";
import { useState } from "react";

interface TaskCardProps {
  task: Task & { createdAt?: string };
}

const TaskCard = ({ task }: TaskCardProps) => {
  const dispatch = useDispatch();
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const handleStatusChange = async (
    newStatus: "TODO" | "IN_PROGRESS" | "DONE",
  ) => {
    try {
      await updateTask({
        id: task.id,
        status: newStatus,
      }).unwrap();
      setShowStatusDropdown(false);
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTask({ id: task.id }).unwrap();
      } catch (err) {
        console.error("Failed to delete task", err);
      }
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    dispatch(openModal(task));
  };

  return (
    <div
      className="task-card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData(
          "application/json",
          JSON.stringify({ taskId: task.id, currentStatus: task.status }),
        );
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: "16px",
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ marginBottom: "0.5rem" }}>{task.title}</h3>
          {task.description && (
            <p
              style={{ margin: 0, color: "var(--text-muted)", lineHeight: 1.6 }}
            >
              {task.description}
            </p>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <button
            type="button"
            onDragStart={(e) => e.preventDefault()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={handleEdit}
            style={{
              backgroundColor: "var(--primary-color)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
            }}
            title="Edit task"
            draggable={false}
          >
            <FaRegEdit size={14} /> Edit
          </button>
          <button
            type="button"
            onDragStart={(e) => e.preventDefault()}
            onPointerDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              handleDelete();
            }}
            disabled={isDeleting}
            style={{
              backgroundColor: "var(--danger-color)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              padding: "8px 12px",
              cursor: isDeleting ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.85rem",
            }}
            title="Delete task"
            draggable={false}
          >
            <MdDelete size={14} /> Delete
          </button>
        </div>
      </div>

      <div
        className="task-footer"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "1.25rem",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ position: "relative" }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setShowStatusDropdown(!showStatusDropdown);
            }}
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid var(--border-color)",
              backgroundColor: "var(--panel-bg)",
              color: "inherit",
              fontSize: "0.85rem",
            }}
            draggable={false}
          >
            {task.status.replace("_", " ")}
            <ChevronDown size={14} />
          </button>
          {showStatusDropdown && (
            <div
              style={{
                position: "absolute",
                top: "calc(100% + 8px)",
                left: 0,
                backgroundColor: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                borderRadius: "8px",
                zIndex: 10,
                minWidth: "150px",
                boxShadow: "0 16px 40px rgba(0,0,0,0.18)",
              }}
            >
              {["TODO", "IN_PROGRESS", "DONE"].map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStatusChange(
                      status as "TODO" | "IN_PROGRESS" | "DONE",
                    );
                  }}
                  disabled={isUpdating}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    textAlign: "left",
                    backgroundColor:
                      task.status === status
                        ? "var(--primary-color)"
                        : "transparent",
                    color: "inherit",
                    border: "none",
                    cursor: isUpdating ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                  }}
                >
                  {status.replace("_", " ")}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Clock size={14} />
          <span>
            {task.createdAt
              ? new Date(task.createdAt).toLocaleDateString()
              : "New"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
