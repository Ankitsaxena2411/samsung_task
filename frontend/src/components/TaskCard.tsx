import { useDispatch } from 'react-redux';
import { Task, openModal } from '../store/uiSlice';
import { Clock } from 'lucide-react';

interface TaskCardProps {
  task: Task & { createdAt?: string };
}

const TaskCard = ({ task }: TaskCardProps) => {
  const dispatch = useDispatch();

  return (
    <div className="task-card" onClick={() => dispatch(openModal(task))}>
      <h3>{task.title}</h3>
      {task.description && (
        <p>{task.description.length > 80 ? `${task.description.substring(0, 80)}...` : task.description}</p>
      )}
      <div className="task-footer">
        <span className={`status-badge ${task.status}`}>{task.status.replace('_', ' ')}</span>
        <div className="task-date" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
           <Clock size={12} />
           <span>{task.createdAt ? new Date(parseInt(task.createdAt, 10) || task.createdAt).toLocaleDateString() : 'New'}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
