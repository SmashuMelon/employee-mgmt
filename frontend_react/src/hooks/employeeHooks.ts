/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { queryClient } from '../main';

export const useGetAllEmployeesQuery = () =>
  useQuery({
    queryKey: ['all-employees'],
    queryFn: async () => (await api.get('/api/employees/')).data,
  });

export const useCreateEmployeeMutation = () =>
  useMutation({
    mutationFn: async (empData: {
      name: string;
      email: string;
      location: string;
      department: number;
      salary: number;
    }) => (await api.post('/api/employees/', empData)).data,
    onSuccess: () => queryClient.invalidateQueries(['all-employees']),
  });

export const useEditEmployeeMutation = () =>
  useMutation({
    mutationFn: async ({ id, name, email, department, salary }: { id: number; name: string, email:string , department:number, salary:number }) =>
      (await api.patch(`/api/employees/${id}/`, { name, email, department, salary })).data,
    onSuccess: () => queryClient.invalidateQueries(['all-employees']),
  });

export const useDeleteEmployeeMutation = () =>
  useMutation({
    mutationFn: async ({ id }: { id: number }) =>
      (await api.delete(`/api/employees/${id}/`)).data,
    onSuccess: () => queryClient.invalidateQueries(['all-employees', 'all-Tasks']),
  });
