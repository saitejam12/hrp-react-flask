import type { Role } from '../types/auth';

export const ROLES: Record<string, Role> = {
  admin: {
    id: 'admin',
    name: 'Administrator',
    permissions: [
      {
        resource: 'users',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        resource: 'roles',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        resource: 'reports',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        resource: 'employees',
        actions: ['create', 'read', 'update', 'delete'],
      },
      {
        resource: 'settings',
        actions: ['read', 'update'],
      },
    ],
  },
  manager: {
    id: 'manager',
    name: 'Manager',
    permissions: [
      {
        resource: 'employees',
        actions: ['read', 'update'],
      },
      {
        resource: 'reports',
        actions: ['read', 'create'],
      },
      {
        resource: 'tasks',
        actions: ['create', 'read', 'update'],
      },
      {
        resource: 'team',
        actions: ['read', 'update'],
      },
    ],
  },
  employee: {
    id: 'employee',
    name: 'Employee',
    permissions: [
      {
        resource: 'profile',
        actions: ['read', 'update'],
      },
      {
        resource: 'tasks',
        actions: ['read', 'update'],
      },
      {
        resource: 'reports',
        actions: ['read'],
      },
      {
        resource: 'leave',
        actions: ['read', 'create'],
      },
    ],
  },
  guest: {
    id: 'guest',
    name: 'Guest',
    permissions: [
      {
        resource: 'public',
        actions: ['read'],
      },
    ],
  },
};

export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/dashboard': ['admin', 'manager', 'employee'],
  '/employees': ['admin', 'manager'],
  '/employees/create': ['admin', 'manager'],
  '/reports': ['admin', 'manager', 'employee'],
  '/reports/create': ['admin', 'manager'],
  '/settings': ['admin'],
  '/profile': ['admin', 'manager', 'employee'],
  '/tasks': ['admin', 'manager', 'employee'],
  '/team': ['manager', 'admin'],
};
