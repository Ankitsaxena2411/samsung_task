import { createApi } from "@reduxjs/toolkit/query/react";
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query";
import type { Task } from "./uiSlice";

interface GetTasksResponse {
  tasks: Task[];
}

interface CreateTaskResponse {
  createTask: Omit<Task, "createdAt">;
}

interface UpdateTaskResponse {
  updateTask: Task;
}

interface DeleteTaskResponse {
  deleteTask: boolean;
}

export const taskApi = createApi({
  reducerPath: "taskApi",
  baseQuery: graphqlRequestBaseQuery({
    url: "http://localhost:4000/graphql",
  }),
  tagTypes: ["Task"],
  endpoints: (builder) => ({
    getTasks: builder.query<GetTasksResponse, { status?: string }>({
      query: (variables) => ({
        document: `
          query GetTasks($status: TaskStatus) {
            tasks(status: $status) {
              id
              title
              description
              status
              createdAt
            }
          }
        `,
        variables,
      }),
      providesTags: (result) =>
        result && result.tasks
          ? [
              ...result.tasks.map(({ id }) => ({ type: "Task" as const, id })),
              { type: "Task", id: "LIST" },
            ]
          : [{ type: "Task", id: "LIST" }],
    }),
    createTask: builder.mutation<
      CreateTaskResponse,
      {
        title: string;
        description?: string;
        status?: "TODO" | "IN_PROGRESS" | "DONE";
      }
    >({
      query: (variables) => ({
        document: `
          mutation CreateTask($createTaskInput: CreateTaskInput!) {
            createTask(createTaskInput: $createTaskInput) {
              id
              title
              description
              status
            }
          }
        `,
        variables: { createTaskInput: variables },
      }),
      invalidatesTags: [{ type: "Task", id: "LIST" }],
    }),
    updateTask: builder.mutation<
      UpdateTaskResponse,
      { id: string; status?: string; title?: string; description?: string }
    >({
      query: (variables) => ({
        document: `
          mutation UpdateTask($updateTaskInput: UpdateTaskInput!) {
            updateTask(updateTaskInput: $updateTaskInput) {
              id
              status
              title
              description
            }
          }
        `,
        variables: { updateTaskInput: variables },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Task", id }],
    }),
    deleteTask: builder.mutation<DeleteTaskResponse, { id: string }>({
      query: (variables) => ({
        document: `
          mutation DeleteTask($id: ID!) {
            deleteTask(id: $id)
          }
        `,
        variables,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Task", id },
        { type: "Task", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
