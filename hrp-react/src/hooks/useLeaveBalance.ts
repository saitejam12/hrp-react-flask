import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { LeaveBalance } from '../types/leave';
import { demoLeaveStore } from '../data/mockLeaveData';

export function useLeaveBalance(employeeId: string) {
  return useQuery({
    queryKey: ['leaveBalance', employeeId],
    staleTime: 0,
    enabled: !!employeeId,
    queryFn: async () => {
      const res = await api.get<{ balance: LeaveBalance }>(`/leave/balance/${employeeId}`);
      if (!res.error) return res.data?.balance ?? null;
      // Demo fallback: find by id or return the first balance record
      return (
        demoLeaveStore.balances.find(b => b.employeeId === employeeId) ??
        demoLeaveStore.balances[0]
      );
    },
  });
}
