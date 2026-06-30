import type { LeaveRequest, LeaveBalance, LeaveEncashment } from '../types/leave';

// ── Seed data ───────────────────────────────────────────────────────────────

const SEED_REQUESTS: LeaveRequest[] = [
  {
    id: 'lr-001', employeeId: 'demo-4', employeeName: 'Priya Sharma',
    department: 'Engineering', leaveType: 'annual',
    startDate: '2026-07-10', endDate: '2026-07-14', days: 5,
    reason: 'Family vacation', status: 'approved', appliedDate: '2026-07-01',
    reviewedBy: 'Sunita Rao', reviewedDate: '2026-07-02', reviewNote: 'Approved',
  },
  {
    id: 'lr-002', employeeId: 'demo-4', employeeName: 'Priya Sharma',
    department: 'Engineering', leaveType: 'sick',
    startDate: '2026-07-03', endDate: '2026-07-04', days: 2,
    reason: 'Fever and cold', status: 'pending', appliedDate: '2026-07-02',
  },
  {
    id: 'lr-003', employeeId: 'demo-2', employeeName: 'Sunita Rao',
    department: 'Human Resources', leaveType: 'casual',
    startDate: '2026-07-08', endDate: '2026-07-08', days: 1,
    reason: 'Personal work', status: 'pending', appliedDate: '2026-07-01',
  },
  {
    id: 'lr-004', employeeId: 'demo-1', employeeName: 'Rajesh Mehta',
    department: 'Management', leaveType: 'annual',
    startDate: '2026-07-20', endDate: '2026-07-25', days: 6,
    reason: 'Annual vacation', status: 'rejected', appliedDate: '2026-06-28',
    reviewedBy: 'Sunita Rao', reviewedDate: '2026-06-30',
    reviewNote: 'Insufficient leave balance',
  },
  {
    id: 'lr-005', employeeId: 'demo-3', employeeName: 'Vikram Kapoor',
    department: 'Executive', leaveType: 'casual',
    startDate: '2026-08-01', endDate: '2026-08-02', days: 2,
    reason: 'Personal appointment', status: 'approved', appliedDate: '2026-07-01',
    reviewedBy: 'Sunita Rao', reviewedDate: '2026-07-02',
  },
];

const SEED_BALANCES: LeaveBalance[] = [
  {
    employeeId: 'current',
    annual:    { total: 21,  used: 5, remaining: 16  },
    sick:      { total: 10,  used: 2, remaining: 8   },
    casual:    { total: 12,  used: 1, remaining: 11  },
    maternity: { total: 182, used: 0, remaining: 182 },
    paternity: { total: 15,  used: 0, remaining: 15  },
    unpaid:    { total: 30,  used: 0, remaining: 30  },
  },
];

const SEED_ENCASHMENTS: LeaveEncashment[] = [
  {
    id: 'enc-001', employeeId: 'demo-4', employeeName: 'Priya Sharma',
    department: 'Engineering', leaveType: 'annual', days: 5,
    ratePerDay: 5769, totalAmount: 28845, status: 'approved',
    requestedDate: '2026-06-15', processedDate: '2026-06-20',
  },
  {
    id: 'enc-002', employeeId: 'demo-1', employeeName: 'Rajesh Mehta',
    department: 'Management', leaveType: 'annual', days: 3,
    ratePerDay: 7692, totalAmount: 23076, status: 'pending',
    requestedDate: '2026-07-01',
  },
  {
    id: 'enc-003', employeeId: 'demo-2', employeeName: 'Sunita Rao',
    department: 'Human Resources', leaveType: 'casual', days: 2,
    ratePerDay: 4808, totalAmount: 9616, status: 'paid',
    requestedDate: '2026-05-10', processedDate: '2026-05-18',
  },
];

// ── Single shared in-memory store ───────────────────────────────────────────
// All leave pages read from and write to this one object.
// Mutations update it in-place; React Query re-reads it on every invalidation.
export const demoLeaveStore = {
  requests:   SEED_REQUESTS.map(r => ({ ...r })),
  balances:   SEED_BALANCES.map(b => ({ ...b })),
  encashments: SEED_ENCASHMENTS.map(e => ({ ...e })),
};
