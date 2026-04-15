# 📝 Task Manager App — Full Stack

A full-stack **Task Management Application** built with **NestJS + GraphQL (Backend)** and **React + Redux Toolkit (Frontend)**.

This app enables users to **create, update, delete, and manage tasks** in a modern Kanban-style workflow with drag-and-drop functionality.

---

## 📁 Project Structure

```
samsung_task/
├── backend/
│   ├── src/
│   │   ├── task/
│   │   │   ├── dto/
│   │   │   │   ├── create-task.input.ts
│   │   │   │   └── update-task.input.ts
│   │   │   ├── entities/
│   │   │   │   └── task.entity.ts
│   │   │   ├── task.module.ts
│   │   │   ├── task.resolver.ts
│   │   │   └── task.service.ts
│   │   ├── app.controller.ts
│   │   ├── app.module.ts
│   │   ├── app.service.ts
│   │   ├── main.ts
│   │   └── schema.gql
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskBoard.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskFormModal.tsx
│   │   ├── store/
│   │   │   ├── api.ts
│   │   │   ├── store.ts
│   │   │   └── uiSlice.ts
│   │   ├── assets/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.tsx
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── package.json
└── README.md
```

---

## 🚀 Tech Stack

### Frontend
- **React 19** + **TypeScript**
- **Vite** - Fast build tool
- **Redux Toolkit** - State management
- **RTK Query** - API caching & data fetching
- **Lucide React** - Icons
- **Custom CSS** - Dark mode UI

### Backend
- **NestJS 11** - Progressive Node.js framework
- **GraphQL** - Query language with Apollo Server
- **TypeORM** - ORM for database management
- **SQLite** - Lightweight embedded database
- **TypeScript** - Type safety

---

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm 9+
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd samsung_task
```

2. **Install dependencies**
```bash
npm install
```

This installs dependencies for both `backend` and `frontend` workspaces.

---

## ▶️ Running the Project

### Option 1: Run Both (Recommended)
```bash
npm run dev
```
Runs backend and frontend concurrently using `concurrently`.

### Option 2: Run Separately

**Backend (NestJS + GraphQL)**
```bash
npm run dev:backend
```
🔗 http://localhost:4000/graphql

**Frontend (React + Vite)**
```bash
npm run dev:frontend
```
🔗 http://localhost:5173 (or http://localhost:5174 if port in use)

---

## 📡 GraphQL API

### Queries

```graphql
query GetTasks($status: TaskStatus) {
  tasks(status: $status) {
    id
    title
    description
    status
    createdAt
  }
}

query GetTask($id: ID!) {
  task(id: $id) {
    id
    title
    description
    status
    createdAt
  }
}
```

### Mutations

```graphql
mutation CreateTask($createTaskInput: CreateTaskInput!) {
  createTask(createTaskInput: $createTaskInput) {
    id
    title
    description
    status
  }
}

mutation UpdateTask($updateTaskInput: UpdateTaskInput!) {
  updateTask(updateTaskInput: $updateTaskInput) {
    id
    title
    description
    status
  }
}

mutation DeleteTask($id: ID!) {
  deleteTask(id: $id)
}
```

### Task Entity

```typescript
type Task {
  id: ID!
  title: String!
  description: String
  status: TaskStatus!
  createdAt: DateTime!
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  DONE
}
```

---

## ✨ Features

- ✅ **Create Tasks** - Add new tasks through modal form
- ✅ **Update Tasks** - Edit task title, description, and status
- ✅ **Delete Tasks** - Remove tasks with confirmation
- ✅ **Task Status Management** - Move tasks between TODO → IN_PROGRESS → DONE
- ✅ **Kanban Board** - Visual workflow with three columns
- ✅ **Drag & Drop** - Drag tasks between columns to change status
- ✅ **Real-time Updates** - UI syncs with GraphQL backend
- ✅ **Modal Forms** - Clean modal interface for task creation/editing
- ✅ **Responsive Design** - Works on desktop and tablet
- ✅ **Dark Mode UI** - Modern dark-themed interface

---

## 🏗️ Architecture

### Backend
Task Entity → Task Service → Task Resolver → GraphQL API

- Services handle business logic
- Resolvers bridge GraphQL queries to services
- TypeORM manages database operations
- SQLite stores tasks persistently

### Frontend
API (RTK Query) → Redux Store → Components → UI

- RTK Query caches responses and handles data fetching
- Redux Slice manages UI state (modals, selections)
- React components consume Redux state
- Custom CSS provides dark-themed styling

---

## 🔄 Data Flow

### Creating a Task
1. User fills form in Modal
2. Form submission triggers RTK Query `createTaskMutation`
3. API request sent to `/graphql`
4. NestJS resolver calls Task Service
5. Service creates task in database
6. Response returns to frontend
7. RTK Query invalidates tasks list
8. UI updates with new task

### Dragging a Task
1. User drags TaskCard from column
2. `onDragStart` sets transfer data (taskId, currentStatus)
3. User drops on target column
4. `onDrop` triggers `updateTaskMutation`
5. API updates task status in database
6. RTK Query refetches tasks
7. UI renders task in new column

---

## 📦 Build

### Build Backend
```bash
npm run build --workspace=backend
npm run start:prod --workspace=backend
```

### Build Frontend
```bash
npm run build --workspace=frontend
npm run preview --workspace=frontend
```

### Build Both
```bash
npm run build
```

---

## 🔧 Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Run backend + frontend concurrently |
| `npm run dev:backend` | Run NestJS in watch mode |
| `npm run dev:frontend` | Run Vite dev server |
| `npm run build` | Build both projects |
| `npm run lint --workspace=backend` | Lint backend code |

---

## 📚 Key Components

**TaskBoard.tsx** - Main Kanban board, handles drag-over logic, manages column states

**TaskCard.tsx** - Individual task card, draggable element, status dropdown, edit/delete buttons

**TaskFormModal.tsx** - Modal form for creating/editing tasks, Redux integration

---

## 🗄️ Database

Uses **SQLite** for zero-setup persistent storage:
- Auto-creates tables on startup
- Stores tasks in `tasks.db`
- Schema generated via TypeORM entities

---

## 🚀 Future Enhancements

- Search and filtering
- Task priorities and labels
- Task due dates and reminders
- User authentication
- Task comments and collaboration
- Analytics dashboard

---

## 📝 Notes

- Data persists in SQLite database
- Backend: port **4000**
- Frontend: port **5173** (or next available)
- GraphQL playground at `http://localhost:4000/graphql`
- No external configuration needed

---

## 👨‍💻 Author

**Ankit Saxena** - Full-stack Task Management Solution

---

## 📄 License

MIT License
