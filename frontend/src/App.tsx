import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import { openModal } from './store/uiSlice';
import TaskBoard from './components/TaskBoard';
import TaskFormModal from './components/TaskFormModal';
import { PlusCircle } from 'lucide-react';

function App() {
  const dispatch = useDispatch();
  const isModalOpen = useSelector((state: RootState) => state.ui.isModalOpen);

  return (
    <div className="app-container">
      <header className="header">
        <h1>SyncFlow Workspace</h1>
        <button className="btn-primary" onClick={() => dispatch(openModal(null))}>
          <PlusCircle size={18} />
          New Task
        </button>
      </header>
      
      <main>
        <TaskBoard />
      </main>

      {isModalOpen && <TaskFormModal />}
    </div>
  );
}

export default App;
