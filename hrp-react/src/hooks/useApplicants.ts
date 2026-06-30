import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Applicant, ApplicationStatus } from '../types/recruitment';
import { demoStore } from '../data/mockRecruitmentData';

export type CreateApplicantInput = Omit<Applicant, 'id' | 'appliedDate' | 'jobTitle'>;
export type UpdateApplicantInput = Partial<Omit<Applicant, 'id' | 'appliedDate'>>;

export function useApplicants(jobId?: string, status?: ApplicationStatus) {
  return useQuery({
    queryKey: ['applicants', jobId, status],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (jobId) params.set('jobId', jobId);
      if (status) params.set('status', status);
      const query = params.toString();
      const response = await api.get<{ applicants: Applicant[] }>(
        `/recruitment/applicants${query ? `?${query}` : ''}`
      );
      if (!response.error) return response.data?.applicants ?? [];
      // Backend unreachable — filter demo store
      return demoStore.applicants.filter((a) => {
        const matchesJob = !jobId || a.jobId === jobId;
        const matchesStatus = !status || a.status === status;
        return matchesJob && matchesStatus;
      });
    },
  });
}

export function useCreateApplicant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateApplicantInput) => {
      const response = await api.post<Applicant>(
        '/recruitment/applicants',
        data as Record<string, unknown>
      );
      if (!response.error) return response.data!;
      // Demo fallback
      const job = demoStore.jobs.find((j) => j.id === data.jobId);
      const newApplicant: Applicant = {
        ...data,
        id: `ap-${Date.now()}`,
        jobTitle: job?.title ?? '',
        appliedDate: new Date().toISOString(),
      };
      demoStore.applicants.unshift(newApplicant);
      if (job) job.applicantCount += 1;
      return newApplicant;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicants'] });
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
    },
  });
}

export function useUpdateApplicant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateApplicantInput }) => {
      const response = await api.put<Applicant>(
        `/recruitment/applicants/${id}`,
        data as Record<string, unknown>
      );
      if (!response.error) return response.data!;
      // Demo fallback
      const idx = demoStore.applicants.findIndex((a) => a.id === id);
      if (idx !== -1) demoStore.applicants[idx] = { ...demoStore.applicants[idx], ...data };
      return demoStore.applicants[idx];
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['applicants'] }),
  });
}

export function useDeleteApplicant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/recruitment/applicants/${id}`);
      if (!response.error) return id;
      // Demo fallback
      const applicant = demoStore.applicants.find((a) => a.id === id);
      if (applicant) {
        const job = demoStore.jobs.find((j) => j.id === applicant.jobId);
        if (job && job.applicantCount > 0) job.applicantCount -= 1;
      }
      demoStore.applicants = demoStore.applicants.filter((a) => a.id !== id);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applicants'] });
      queryClient.invalidateQueries({ queryKey: ['jobPostings'] });
    },
  });
}
