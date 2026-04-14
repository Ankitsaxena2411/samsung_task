import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { closeModal } from '../store/uiSlice';
import { useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } from '../store/api';
import { X, Save, Trash2 } from 'lucide-react';

const TaskFormModal = () => {
  const dispatch = useDispatch();
  const selectedTask = useSelector((state: RootState) => state.ui.selectedTask);
  
  const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();
  const [deleteTask, { isLoading: isDeleting }] = useDeleteTaskMutation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<'TODO' | 'IN_PROGRESS' | 'DONE'>('TODO');

  useEffect(() => {
    if (selectedTask) {
      setTitle(selectedTask.title);
      setDescription(selectedTask.description || '');
      setStatus(selectedTask.status);
    }
  }, [selectedTask]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (selectedTask) {
        await updateTask({ id: selectedTask.id, title, description, status }).unwrap();
      } else {
        await createTask({ title, description }).unwrap();
      }
      dispatch(closeModal());
    } catch (err) {
      console.error('Failed to save task', err);
    }
  };

  const handleDelete = async () => {
    if (!selectedTask) return;
    if (confirm('Are you sure you want to delete this task?')) {
        try {
            await deleteTask({ id: selectedTask.id }).unwrap();
            dispatch(closeModal());
        } catch (err) {
            console.error('Failed to delete task', err);
        }
    }
  };

  return (
    <div className="modal-overlay" onClick={() => dispatch(closeModal())}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{selectedTask ? 'Edit Task' : 'Create New Task'}</h2>
          <button className="close-btn" onClick={() => dispatch(closeModal())}><X /></button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div className="form-group">
            <label>Title</label>
            <input 
              type="text" 
              className="form-control" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              placeholder="e.g. Design Landing Page"
              required 
              autoFocus
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              className="form-control" 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task details..."
            />
          </div>

          {selectedTask && (
            <div className="form-group">
              <label>Status</label>
              <select className="form-control" value={status} onChange={(e: any) => setStatus(e.target.value)}>
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Completed</option>
              </select>
            </div>
          )}

          <div className="form-actions">
            {selectedTask && (
                <button type="button" className="btn-danger" onClick={handleDelete} disabled={isDeleting} style={{ marginRight: 'auto' }}>
                    <Trash2 size={16} /> Delete
                </button>
            )}
            <button type="button" className="btn-danger" style={{ border: 'none' }} onClick={() => dispatch(closeModal())}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isCreating || isUpdating}>
              <Save size={18} /> {selectedTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
