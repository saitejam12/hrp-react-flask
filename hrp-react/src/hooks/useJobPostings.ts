import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { JobPosting, JobStatus } from '../types/recruitment';
import { demoStore } from '../data/mockRecruitmentData';

export type CreateJobPostingInput = Omit<JobPosting, 'id' | 'postedDate' | 'applicantCount'>;
export type UpdateJobPostingInput = Partial<CreateJobPostingInput>;

export function useJobPostings(status?: JobStatus) {
  return useQuery({
    queryKey: ['jobPostings', status],
    queryFn: async () => {
      const endpoint = status ? `/recruitment/jobs?status=${status}` : '/recruitment/jobs';
      const response = await api.get<{ jobs: JobPosting[] }>(endpoint);
      if (!response.error) {
        return response.data?.jobs ?? [];
      }
      // Backend unreachable — use demo store
      return status
        ? demoStore.jobs.filter((j) => j.status === status)
        : [...demoStore.jobs];
    },
  });
}

export function useJobPosting(id: string) {
  return useQuery({
    queryKey: ['jobPosting', id],
    queryFn: async () => {
      const response = await api.get<JobPosting>(`/recruitment/jobs/${id}`);
      if (!response.error) return response.data;
      return demoStore.jobs.find((j) => j.id === id) ?? null;
    },
    enabled: !!id,
  });
}

export function useCreateJobPosting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateJobPostingInput) => {
      const response = await api.post<JobPosting>(
        '/recruitment/jobs',
        data as Record<string, unknown>
      );
      if (!response.error) return response.data!;
      // Demo fallback
      const newJob: JobPosting = {
        ...data,
        id: `jb-${Date.now()}`,
        postedDate: new Date().toISOString(),
        applicantCount: 0,
      };
      demoStore.jobs.unshift(newJob);
      return newJob;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobPostings'] }),
  });
}

export function useUpdateJobPosting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateJobPostingInput }) => {
      const response = await api.put<JobPosting>(
        `/recruitment/jobs/${id}`,
        data as Record<string, unknown>
      );
      if (!response.error) return response.data!;
      // Demo fallback
      const idx = demoStore.jobs.findIndex((j) => j.id === id);
      if (idx !== -1) demoStore.jobs[idx] = { ...demoStore.jobs[idx], ...data };
      return demoStore.jobs[idx];
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
      queryClient.invalidateQueries({ queryKey: ['jobPosting', id] });
    },
  });
}

export function useDeleteJobPosting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/recruitment/jobs/${id}`);
      if (!response.error) return id;
      // Demo fallback
      demoStore.jobs = demoStore.jobs.filter((j) => j.id !== id);
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobPostings'] }),
  });
}
