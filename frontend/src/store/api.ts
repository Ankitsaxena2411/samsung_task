import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: graphqlRequestBaseQuery({
    url: 'http://localhost:4000/graphql',
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<any, { status?: string }>({
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
              ...result.tasks.map(({ id }: { id: string }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    createTask: builder.mutation<any, { title: string; description?: string }>({
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
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
    updateTask: builder.mutation<any, { id: string; status?: string; title?: string; description?: string }>({
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
      invalidatesTags: (result, error, { id }) => [{ type: 'Task', id }],
    }),
    deleteTask: builder.mutation<any, { id: string }>({
      query: (variables) => ({
        document: `
          mutation DeleteTask($id: String!) {
            deleteTask(id: $id)
          }
        `,
        variables,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
