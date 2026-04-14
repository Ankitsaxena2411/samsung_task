# Mini Task Manager App

This is a fullstack Task Management application built to demonstrate core capability with NestJS, GraphQL, React, and Redux Toolkit.

## Tech Stack
-   **Backend**: NestJS, GraphQL (Apollo), In-Memory Data Store.
-   **Frontend**: React (Vite), Redux Toolkit (RTK Query for GraphQL, slice for UI), Vanilla CSS with customized dark mode.

## Project Structure
-   `/backend`: The NestJS API offering GraphQL endpoints (`/graphql`).
-   `/frontend`: The React Vite application managing the Kanban board.
-   `/`: Contains the workspace config to run both concurrently.

## Setup & Run Instructions

```bash
# 1. Install all dependencies across both frontend and backend
npm install

# 2. Run both the backend and frontend concurrently
npm run dev
```

-   **Frontend Application**: [http://localhost:5173](http://localhost:5173) (or whichever port Vite opens)
-   **Backend GraphQL API / Playground**: [http://localhost:3000/graphql](http://localhost:3000/graphql)

## Design Decisions
-   **State Management**: Used RTK Query wrapped with `graphql-request` for a modern, normalized cache approach to network state, while Redux slices seamlessly handle local ephemeral UI states like open/close modals.
-   **Persistence**: Per requirements, an in-memory database array is provided by the NestJS `TaskService`. (Note: changes won't survive a backend server restart).
-   **Styling**: Used custom Vanilla CSS configured via `index.css` prioritizing Rich Aesthetics with a deeply integrated dark mode, gradients, subtle glow shadows (`box-shadow`), and clean layout separation.
-   **Git Strategy**: The codebase is unified under a single root `.git` workspace demonstrating mono-repo potential.
