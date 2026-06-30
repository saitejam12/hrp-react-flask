import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { LeaveEncashment } from '../types/leave';
import { demoLeaveStore } from '../data/mockLeaveData';

export type CreateEncashmentInput = Omit<LeaveEncashment, 'id' | 'requestedDate' | 'processedDate' | 'status'>;

export function useLeaveEncashments() {
  return useQuery({
    queryKey: ['leaveEncashments'],
    staleTime: 0,
    queryFn: async () => {
      const response = await api.get<{ encashments: LeaveEncashment[] }>('/leave/encashments');
      if (!response.error) return response.data?.encashments ?? [];
      return [...demoLeaveStore.encashments];
    },
  });
}

export function useCreateLeaveEncashment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateEncashmentInput) => {
      const response = await api.post<LeaveEncashment>('/leave/encashments', data as Record<string, unknown>);
      if (!response.error) return response.data!;
      const newEncashment: LeaveEncashment = {
        ...data,
        id: `enc-${Date.now()}`,
        status: 'pending',
        requestedDate: new Date().toISOString().split('T')[0],
      };
      demoLeaveStore.encashments.unshift(newEncashment);
      return newEncashment;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leaveEncashments'] }),
  });
}

export function useUpdateEncashmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LeaveEncashment['status'] }) => {
      const response = await api.put<LeaveEncashment>(`/leave/encashments/${id}/status`, { status });
      if (!response.error) return response.data!;
      const idx = demoLeaveStore.encashments.findIndex((e) => e.id === id);
      if (idx !== -1) {
        demoLeaveStore.encashments[idx] = {
          ...demoLeaveStore.encashments[idx],
          status,
          processedDate: new Date().toISOString().split('T')[0],
        };
      }
      return demoLeaveStore.encashments[idx];
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leaveEncashments'] }),
  });
}
