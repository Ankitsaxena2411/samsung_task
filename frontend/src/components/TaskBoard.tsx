import { useGetTasksQuery } from '../store/api';
import TaskCard from './TaskCard';
import { Task } from '../store/uiSlice';

const TaskBoard = () => {
  const { data, isLoading, error } = useGetTasksQuery({});

  if (isLoading) return <div className="loader">Loading tasks...</div>;
  if (error) return <div className="loader" style={{color: 'var(--danger-color)'}}>Error loading tasks! Is backend running?</div>;

  const tasks: Task[] = data?.tasks || [];

  const todoTasks = tasks.filter((t) => t.status === 'TODO');
  const inProgressTasks = tasks.filter((t) => t.status === 'IN_PROGRESS');
  const doneTasks = tasks.filter((t) => t.status === 'DONE');

  const columns = [
    { id: 'TODO', title: 'To Do', tasks: todoTasks, class: 'todo' },
    { id: 'IN_PROGRESS', title: 'In Progress', tasks: inProgressTasks, class: 'in-progress' },
    { id: 'DONE', title: 'Completed', tasks: doneTasks, class: 'done' },
  ];

  return (
    <div className="kanban-board">
      {columns.map((col) => (
        <div key={col.id} className="kanban-column">
          <div className={`kanban-column-header ${col.class}`}>
            <span>{col.title}</span>
            <span className="task-count">{col.tasks.length}</span>
          </div>
          {col.tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
          {col.tasks.length === 0 && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', marginTop: '2rem' }}>
              No tasks here yet.
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskBoard;
