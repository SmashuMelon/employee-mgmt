/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { queryClient } from '../main';

export const useGetAllTasksQuery = () =>
  useQuery({
    queryKey: ['all-Tasks'],
    queryFn: async () => (await axios.get('/api/tasks/')).data,
  });

export const useCreateTaskMutation = () =>
  useMutation({
    mutationFn: async (taskData: {
      title: string;
      description: string;
      assigned_to: number;
    }) => (await axios.post('/api/tasks/', taskData)).data,
    onSuccess: () => queryClient.invalidateQueries(['all-Tasks']),
  });

export const useEditTaskMutation = () =>
  useMutation({
    mutationFn: async ({ id, title,assigned_to, description , is_completed}: { id: number; title: string, assigned_to:number, description:string, is_completed:boolean }) =>
      (await axios.patch(`/api/tasks/${id}/`, { title , description, assigned_to, is_completed})).data,
    onSuccess: () => queryClient.invalidateQueries(['all-Tasks']),
  });

export const useDeleteTaskMutation = () =>
  useMutation({
    mutationFn: async ({ id }: { id: number }) =>
      (await axios.delete(`/api/tasks/${id}/`)).data,
    onSuccess: () => queryClient.invalidateQueries(['all-Tasks']),
  });
