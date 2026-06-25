export interface DashboardCard {
  id: string;
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  color?: string;
}

export interface EmployeeStats {
  totalEmployees: number;
  activeEmployees: number;
  onLeave: number;
  recentHires: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  assignee?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  timestamp: string;
  read: boolean;
}
