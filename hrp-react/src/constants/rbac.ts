import type { Role } from '../types/auth';

export const ROLES: Record<string, Role> = {
  owner: {
    id: 'owner',
    name: 'Owner',
    permissions: [
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'roles', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'employees', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'recruitment', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'settings', actions: ['read', 'update'] },
    ],
  },
  admin: {
    id: 'admin',
    name: 'Administrator',
    permissions: [
      { resource: 'users', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'roles', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'reports', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'employees', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'recruitment', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'settings', actions: ['read', 'update'] },
    ],
  },
  hr: {
    id: 'hr',
    name: 'HR',
    permissions: [
      { resource: 'employees', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'recruitment', actions: ['create', 'read', 'update', 'delete'] },
      { resource: 'reports', actions: ['create', 'read'] },
    ],
  },
  employee: {
    id: 'employee',
    name: 'Employee',
    permissions: [
      { resource: 'profile', actions: ['read', 'update'] },
      { resource: 'tasks', actions: ['read', 'update'] },
      { resource: 'reports', actions: ['read'] },
      { resource: 'leave', actions: ['read', 'create'] },
    ],
  },
};

export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  '/dashboard': ['admin', 'hr', 'owner', 'employee'],
  '/employees': ['admin', 'hr', 'owner'],
  '/employees/create': ['admin', 'hr', 'owner'],
  '/reports': ['admin', 'hr', 'owner', 'employee'],
  '/reports/create': ['admin', 'hr', 'owner'],
  '/settings': ['admin', 'owner'],
  '/profile': ['admin', 'hr', 'owner', 'employee'],
  '/tasks': ['admin', 'hr', 'owner', 'employee'],
  '/recruitment': ['hr', 'owner', 'admin'],
  '/recruitment/jobs': ['hr', 'owner', 'admin'],
  '/recruitment/applicants': ['hr', 'owner', 'admin'],
  '/recruitment/interviews': ['hr', 'owner', 'admin'],
  '/recruitment/offers': ['hr', 'owner', 'admin'],
};
