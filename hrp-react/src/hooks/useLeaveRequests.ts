import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { LeaveRequest, LeaveStatus } from '../types/leave';
import { demoLeaveStore } from '../data/mockLeaveData';

export type CreateLeaveInput = Omit<
  LeaveRequest,
  'id' | 'appliedDate' | 'status' | 'reviewedBy' | 'reviewedDate' | 'reviewNote'
>;

// Prepend a new/updated request into every relevant cache key so pages see
// the change instantly — no wait for background refetch.
function injectRequest(
  queryClient: ReturnType<typeof useQueryClient>,
  newReq: LeaveRequest
) {
  // ['leaveRequests'] — used by Approvals + Calendar
  queryClient.setQueryData<LeaveRequest[]>(['leaveRequests'], prev => {
    if (!prev) return [newReq];
    return [newReq, ...prev.filter(r => r.id !== newReq.id)];
  });
  // ['leaveRequests', 'my', employeeId] — used by Apply Leave "My Requests"
  queryClient.setQueryData<LeaveRequest[]>(
    ['leaveRequests', 'my', newReq.employeeId],
    prev => {
      if (!prev) return [newReq];
      return [newReq, ...prev.filter(r => r.id !== newReq.id)];
    }
  );
  // Background refetch confirms the data from the real source
  queryClient.invalidateQueries({ queryKey: ['leaveRequests'] });
}

// ── All requests — shared by Approvals + Calendar ───────────────────────────
export function useLeaveRequests() {
  return useQuery({
    queryKey: ['leaveRequests'],
    staleTime: 0,
    queryFn: async () => {
      const res = await api.get<{ requests: LeaveRequest[] }>('/leave/requests');
      if (!res.error) return res.data?.requests ?? [];
      return [...demoLeaveStore.requests];
    },
  });
}

// ── One employee's requests — Apply Leave "My Requests" panel ───────────────
export function useMyLeaveRequests(employeeId: string) {
  return useQuery({
    queryKey: ['leaveRequests', 'my', employeeId],
    staleTime: 0,
    enabled: !!employeeId,
    queryFn: async () => {
      const res = await api.get<{ requests: LeaveRequest[] }>(
        `/leave/requests/my?employeeId=${employeeId}`
      );
      if (!res.error) return res.data?.requests ?? [];
      return demoLeaveStore.requests.filter(r => r.employeeId === employeeId);
    },
  });
}

// ── Submit ──────────────────────────────────────────────────────────────────
export function useCreateLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateLeaveInput) => {
      const res = await api.post<LeaveRequest>(
        '/leave/requests',
        data as Record<string, unknown>
      );
      if (!res.error && res.data) return res.data;
      // Demo fallback
      const newRequest: LeaveRequest = {
        ...data,
        id: `lr-${Date.now()}`,
        status: 'pending',
        appliedDate: new Date().toISOString().split('T')[0],
      };
      demoLeaveStore.requests.unshift(newRequest);
      return newRequest;
    },
    onSuccess: (newRequest) => {
      if (newRequest) injectRequest(queryClient, newRequest);
    },
  });
}

// ── Approve / Reject ────────────────────────────────────────────────────────
export function useUpdateLeaveStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      reviewNote,
      reviewedBy,
    }: {
      id: string;
      status: LeaveStatus;
      reviewNote?: string;
      reviewedBy?: string;
    }) => {
      const res = await api.put<LeaveRequest>(`/leave/requests/${id}/status`, {
        status, reviewNote, reviewedBy,
      } as Record<string, unknown>);
      if (!res.error && res.data) return res.data;
      // Demo fallback
      const idx = demoLeaveStore.requests.findIndex(r => r.id === id);
      if (idx !== -1) {
        demoLeaveStore.requests[idx] = {
          ...demoLeaveStore.requests[idx],
          status, reviewNote, reviewedBy,
          reviewedDate: new Date().toISOString().split('T')[0],
        };
        return demoLeaveStore.requests[idx];
      }
      return null;
    },
    onSuccess: (updated) => {
      if (updated) injectRequest(queryClient, updated);
    },
  });
}

// ── Cancel ──────────────────────────────────────────────────────────────────
export function useCancelLeaveRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.put<LeaveRequest>(`/leave/requests/${id}/cancel`, {});
      if (!res.error && res.data) return res.data;
      // Demo fallback
      const idx = demoLeaveStore.requests.findIndex(r => r.id === id);
      if (idx !== -1) {
        demoLeaveStore.requests[idx].status = 'cancelled';
        return demoLeaveStore.requests[idx];
      }
      return null;
    },
    onSuccess: (cancelled) => {
      if (cancelled) injectRequest(queryClient, cancelled);
    },
  });
}
