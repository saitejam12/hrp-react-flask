# React App Setup - Complete Guide

## Overview

The React app is fully configured with:
- **RBAC Integration**: Role-based access control with Admin, Manager, and Employee roles
- **TanStack Query**: Advanced data fetching, caching, and mutation management
- **TanStack Table**: Powerful data table component with sorting, filtering, and pagination
- **React Router**: Client-side routing with protected routes
- **TypeScript**: Full type safety across the application

## Project Structure

```
src/
├── components/
│   ├── Navigation/
│   │   ├── Navbar.tsx       # Top navigation bar
│   │   ├── Navbar.css
│   │   ├── Sidebar.tsx      # Side navigation with role-based menu
│   │   └── Sidebar.css
│   ├── Tables/
│   │   ├── EmployeesTable.tsx    # TanStack Table for employees
│   │   ├── TasksTable.tsx        # TanStack Table for tasks
│   │   └── Table.css
│   ├── ProtectedRoute.tsx        # Route protection component
│   └── Layout.tsx                # Main layout wrapper
├── contexts/
│   └── AuthContext.tsx           # Authentication context with RBAC
├── hooks/
│   ├── useAuth.ts                # Authentication hook
│   ├── useEmployees.ts           # TanStack Query hooks for employees
│   └── useTasks.ts               # TanStack Query hooks for tasks
├── lib/
│   └── queryClient.ts            # TanStack Query configuration
├── services/
│   └── api.ts                    # Typed API client
├── pages/
│   ├── LoginPage.tsx             # Login with demo accounts
│   ├── DashboardPage.tsx         # Main dashboard with 3D visualizations
│   ├── ProfilePage.tsx           # User profile and permissions
│   ├── EmployeesPage.tsx         # Employee management with 3D charts
│   ├── TasksPage.tsx             # Task management with filtering
│   └── UnauthorizedPage.tsx      # 403 access denied page
├── types/
│   ├── auth.ts                   # Authentication types
│   └── dashboard.ts              # Dashboard types
├── constants/
│   └── rbac.ts                   # RBAC configuration
└── App.tsx                       # Main app with routing
```

## Authentication & RBAC

### Login

Demo accounts available:

```
Admin:    admin@example.com / password123
Manager:  manager@example.com / password123
Employee: employee@example.com / password123
```

### Role-Based Access Control

Three predefined roles with specific permissions:

#### Admin
- Full access to all resources
- User management (create, read, update, delete)
- Role management
- Report generation
- System settings

#### Manager
- Employee management (read, update)
- Task creation and assignment
- Team management
- Report reading

#### Employee
- Profile management
- Task tracking
- Leave management
- Report reading

### Protected Routes

Routes are automatically protected based on user roles:

```typescript
// In ROUTE_PERMISSIONS constant
'/dashboard': ['admin', 'manager', 'employee']
'/employees': ['admin', 'manager']
'/settings': ['admin']
```

Attempting to access restricted routes redirects to `/unauthorized`.

## Data Fetching with TanStack Query

### Hooks Usage

```typescript
// Get all employees
const { data: employees, isLoading, error } = useEmployees();

// Get a specific employee
const { data: employee } = useEmployee(employeeId);

// Create an employee
const createMutation = useCreateEmployee();
await createMutation.mutateAsync({
  name: 'John Doe',
  email: 'john@example.com',
  role: 'employee',
  department: 'Engineering',
  status: 'active',
  joinDate: new Date().toISOString(),
});

// Update an employee
const updateMutation = useUpdateEmployee();
await updateMutation.mutateAsync({
  id: employeeId,
  data: { status: 'inactive' },
});

// Delete an employee
const deleteMutation = useDeleteEmployee();
await deleteMutation.mutateAsync(employeeId);
```

### Features

- **Automatic caching**: Data is cached for 5 minutes by default
- **Automatic invalidation**: Related queries are invalidated after mutations
- **Optimistic updates**: UI updates before server confirmation
- **Error handling**: Built-in error states and retry logic
- **Loading states**: `isLoading`, `isPending`, `isFetching` states

## Data Tables with TanStack Table

### Features

- **Sorting**: Click headers to sort by any column
- **Filtering**: Built-in search across all columns
- **Pagination**: Navigate through data pages
- **Responsive**: Mobile-friendly table layout
- **Custom rendering**: Flexible cell rendering with badges and status indicators

### Usage

```typescript
<EmployeesTable data={employees} isLoading={isLoading} />
<TasksTable data={tasks} isLoading={isLoading} />
```

## Data Visualizations

### Department Distribution
- Horizontal bar charts showing employees per department
- Real-time calculations from employee data
- Smooth animations
- Employee count indicators

## API Integration

### Base Configuration

```typescript
// Vite proxy setup (development)
/api/* -> http://localhost:5000/api/*

// API base URL (production)
// Uses /api for same-origin requests
```

### Available Endpoints

```
Authentication:
  POST /api/auth/login                   # Login with email/password

Employees:
  GET    /api/employees                  # List all employees
  GET    /api/employees/:id              # Get specific employee
  POST   /api/employees                  # Create employee
  PUT    /api/employees/:id              # Update employee
  DELETE /api/employees/:id              # Delete employee

Tasks:
  GET    /api/tasks                      # List tasks (with filters)
  GET    /api/tasks/:id                  # Get specific task
  POST   /api/tasks                      # Create task
  PUT    /api/tasks/:id                  # Update task
  DELETE /api/tasks/:id                  # Delete task

Health:
  GET    /api/health                     # Server health check
```

## Styling

### Design System

- **Colors**:
  - Primary: `#667eea` (Purple)
  - Secondary: `#764ba2` (Dark Purple)
  - Success: `#27ae60` (Green)
  - Warning: `#f39c12` (Orange)
  - Error: `#c0392b` (Red)

- **Typography**:
  - Headers: 600-700 font weight
  - Body: 400 font weight
  - Small: 0.9rem

- **Spacing**: Consistent 1rem base unit

## Performance Optimization

### Query Caching

```typescript
// Stale time: 5 minutes
// Cache time: 10 minutes
// Auto-refetch on window focus
// Retry failed queries once
```

### Component Splitting

- Lazy load pages with React.lazy
- Code split by route
- Optimize 3D renders with request animation frame

## Development Workflow

### Adding a New Page

1. Create page component in `src/pages/`
2. Add route to `App.tsx`
3. Add to `ROUTE_PERMISSIONS` if restricted
4. Add menu item in `Sidebar.tsx`

### Adding New Endpoints

1. Update Flask backend in `hrp-server/app/projects/api.py`
2. Create hook in `src/hooks/` (e.g., `useNewResource.ts`)
3. Create table component if needed
4. Use hook in page component

### Adding 3D Visualizations

1. Create component in `src/components/3D/`
2. Use Three.js for rendering
3. Handle cleanup in useEffect
4. Add to relevant pages

## Common Patterns

### Error Handling

```typescript
const { data, error } = useEmployees();

if (error) {
  return <div>Error: {error.message}</div>;
}
```

### Loading States

```typescript
const { data, isLoading } = useEmployees();

if (isLoading) {
  return <div>Loading...</div>;
}
```

### Role-Based Rendering

```typescript
const { hasRole } = useAuth();

if (hasRole(['admin', 'manager'])) {
  return <AdminPanel />;
}
```

### Permission Checking

```typescript
const { hasPermission } = useAuth();

if (hasPermission('users', 'create')) {
  return <CreateUserButton />;
}
```

## Troubleshooting

### Blank Page After Login
- Check browser console for errors
- Verify JWT token is stored in localStorage
- Check that API endpoints return expected data

### Queries Not Caching
- Check TanStack Query DevTools for cache state
- Verify staleTime and gcTime settings
- Check queryKey consistency

### TypeScript Errors
- Run `npm run build` to see all errors
- Check type definitions in `src/types/`
- Ensure proper imports with `type` keyword

## Next Steps

1. **Authentication**: Implement real JWT tokens
2. **Database**: Replace mock data with database
3. **Permissions**: Add field-level permissions
4. **Notifications**: Real-time updates with WebSockets
5. **Analytics**: More 3D charts and visualizations
6. **Testing**: Add unit and integration tests

## Resources

- [TanStack Query Docs](https://tanstack.com/query/latest)
- [TanStack Table Docs](https://tanstack.com/table/latest)
- [Three.js Docs](https://threejs.org/docs/)
- [React Router Docs](https://reactrouter.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
