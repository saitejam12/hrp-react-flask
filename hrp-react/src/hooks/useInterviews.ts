import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Interview } from '../types/recruitment';
import { demoStore } from '../data/mockRecruitmentData';

export type CreateInterviewInput = Omit<Interview, 'id'>;
export type UpdateInterviewInput = Partial<CreateInterviewInput>;

export function useInterviews(applicantId?: string) {
  return useQuery({
    queryKey: ['interviews', applicantId],
    queryFn: async () => {
      const endpoint = applicantId
        ? `/recruitment/interviews?applicantId=${applicantId}`
        : '/recruitment/interviews';
      const response = await api.get<{ interviews: Interview[] }>(endpoint);
      if (!response.error) return response.data?.interviews ?? [];
      return applicantId
        ? demoStore.interviews.filter((i) => i.applicantId === applicantId)
        : [...demoStore.interviews];
    },
  });
}

export function useCreateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateInterviewInput) => {
      const response = await api.post<Interview>(
        '/recruitment/interviews',
        data as Record<string, unknown>
      );
      if (!response.error) return response.data!;
      const newInterview: Interview = { ...data, id: `iv-${Date.now()}` };
      demoStore.interviews.unshift(newInterview);
      return newInterview;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interviews'] }),
  });
}

export function useUpdateInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateInterviewInput }) => {
      const response = await api.put<Interview>(
        `/recruitment/interviews/${id}`,
        data as Record<string, unknown>
      );
      if (!response.error) return response.data!;
      const idx = demoStore.interviews.findIndex((i) => i.id === id);
      if (idx !== -1) demoStore.interviews[idx] = { ...demoStore.interviews[idx], ...data };
      return demoStore.interviews[idx];
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interviews'] }),
  });
}

export function useDeleteInterview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/recruitment/interviews/${id}`);
      if (!response.error) return id;
      demoStore.interviews = demoStore.interviews.filter((i) => i.id !== id);
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['interviews'] }),
  });
}
