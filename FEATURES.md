# HRP React + Flask - Feature Overview

## ✨ Features Implemented

### 🔐 Authentication & RBAC
- **Login System**: Email/password authentication with mock accounts
- **Role-Based Access Control**:
  - ✅ Admin: Full system access
  - ✅ Manager: Employee and team management
  - ✅ Employee: Personal task management
- **Protected Routes**: Automatic route protection based on roles
- **Permission System**: Granular permission checking per resource/action
- **Session Management**: localStorage-based authentication

### 📊 Dashboard
- **Interactive 3D Statistics**: Rotating cube with key metrics
- **Role-Specific Views**: Different dashboard for each role
- **Real-Time Stats**: Employee count, active projects, pending approvals
- **Task Overview**: Recent tasks with status and priority
- **Quick Access Cards**: Summary statistics with trend indicators

### 👥 Employee Management
- **Employee Directory**: Complete employee listing with search
- **3D Department Distribution**: Animated 3D bar chart
- **Employee Statistics**: Active, on-leave, inactive counts
- **TanStack Table Integration**:
  - Sorting by any column
  - Global search across all fields
  - Pagination with 10 rows per page
  - Status badges and role indicators

### ✅ Task Management
- **Task Tracking**: View all tasks with detailed information
- **Status Filtering**: Filter by pending, in-progress, completed
- **Priority Indicators**: High, medium, low priority visualization
- **TanStack Table Integration**:
  - Sortable columns
  - Search functionality
  - Detailed task descriptions
  - Assignee information

### 🧭 Navigation
- **Responsive Navbar**:
  - Brand/logo display
  - User profile menu
  - Notification center (UI ready)
  - Logout functionality
- **Smart Sidebar**:
  - Role-based menu items
  - Collapsible on mobile
  - Active route highlighting
  - Role badge display

### 📈 Data Management
- **TanStack Query Integration**:
  - Automatic caching (5-minute stale time)
  - Automatic cache invalidation
  - Background refetching
  - Error handling and retry logic
  - Optimistic updates

- **TanStack Table Features**:
  - Sorting (ascending/descending)
  - Filtering and search
  - Pagination with navigation
  - Responsive mobile layout
  - Custom cell rendering

### 📊 Data Visualizations
- **Department Distribution**:
  - Horizontal bar chart showing employees per department
  - Real-time calculation from employee data
  - Smooth progress bar animations
  - Employee count indicators

### 🔧 API Integration
- **Typed API Client**:
  - GET, POST, PUT, DELETE methods
  - Full TypeScript support
  - Error handling
  - Loading states

- **Mock Backend Endpoints**:
  - `/auth/login` - Authentication
  - `/employees` - Employee CRUD
  - `/tasks` - Task CRUD
  - `/health` - Server health

### 📱 Responsive Design
- **Mobile-Friendly Layout**:
  - Collapsible sidebar on small screens
  - Touch-friendly buttons
  - Responsive tables and cards
  - Optimized font sizes

### 🎯 Developer Features
- **TypeScript Support**: Full type safety
- **Component Organization**: Clear folder structure
- **Context API**: Auth context for global state
- **Custom Hooks**: Reusable data fetching logic
- **Environment Configuration**: Dev/prod configurations

## 📊 Technology Stack

### Frontend
- **React 19.2.7** - UI library
- **TypeScript 6.0** - Type safety
- **Vite 8.1** - Build tool with HMR
- **React Router 7.0** - Client-side routing
- **TanStack Query 5.28** - Data fetching & caching
- **TanStack Table 8.17** - Data table component

### Backend
- **Flask 3.0.0** - Web framework
- **Flask-CORS 4.0.0** - CORS support
- **Python 3.8+** - Runtime

## 🚀 Getting Started

### Installation
```bash
# One-time setup
npm run setup

# Or manual setup
npm install
cd hrp-react && npm install
cd ../hrp-server && python -m venv venv && pip install -r requirements.txt
```

### Development
```bash
# Start both apps
npm run dev

# Or start individually
npm run dev:react    # React dev server (http://localhost:5173)
npm run dev:server   # Flask server (http://localhost:5000)
```

### Login
Use demo accounts to explore features:
- **Admin**: admin@example.com / password123
- **Manager**: manager@example.com / password123
- **Employee**: employee@example.com / password123

## 📁 Key Files

```
src/
├── contexts/AuthContext.tsx      # Auth & RBAC logic
├── hooks/useEmployees.ts         # TanStack Query hooks
├── hooks/useTasks.ts             # Task hooks
├── lib/queryClient.ts            # Query configuration
├── components/
│   ├── Tables/EmployeesTable.tsx # TanStack Table
│   ├── Tables/TasksTable.tsx     # Task table
│   └── Navigation/               # Nav components
├── pages/
│   ├── DashboardPage.tsx         # Main dashboard
│   ├── EmployeesPage.tsx         # Employee management
│   ├── TasksPage.tsx             # Task management
│   ├── ProfilePage.tsx           # User profile
│   └── LoginPage.tsx             # Login
├── constants/rbac.ts             # RBAC config
├── types/auth.ts                 # Type definitions
└── App.tsx                       # Routing
```

## 🔄 Data Flow

```
User Login
    ↓
AuthContext stores user & token
    ↓
ProtectedRoute checks role
    ↓
Components use useAuth() hook
    ↓
Access permitted or redirect
    ↓
Page uses TanStack Query hooks
    ↓
Fetch data with TanStack Query
    ↓
Cache data for 5 minutes
    ↓
Display in TanStack Table
    ↓
User can sort, filter, paginate
```

## 🎨 UI Components

### Navigation
- Navbar with user menu
- Sidebar with role-based items
- Responsive mobile menu

### Forms
- Login form with validation
- Employee creation form (ready)
- Task creation form (ready)

### Tables
- Employee table with full TanStack Table features
- Task table with filters
- Sortable, searchable, paginated

### Cards
- Stat cards with icons and values
- Role badges
- Status indicators

### 3D
- Interactive 3D cube
- 3D bar chart
- WebGL rendering

## 🔐 Security Features

- **Protected Routes**: Only authenticated users can access protected pages
- **Role-Based Access**: Different features per role
- **Type Safety**: TypeScript prevents common errors
- **Input Validation**: Form validation before submission
- **CORS Enabled**: Flask configured for secure cross-origin requests

## 📈 Performance Features

- **Code Splitting**: Routes loaded on-demand
- **Query Caching**: 5-minute cache with auto-invalidation
- **Lazy Loading**: Components split by route
- **3D Optimization**: RequestAnimationFrame for smooth rendering
- **Build Optimization**: Vite minification and tree-shaking

## 🧪 Testing Ready

All components are structured for easy testing:
- Isolated hooks for data fetching
- Pure components without side effects
- Mocked API responses
- Clear prop interfaces

## 📚 Documentation

- `REACT_SETUP.md` - Detailed React setup guide
- `COMMANDS.md` - All available commands
- `DEVELOPMENT.md` - Development workflow
- Code comments and TypeScript types

## 🎯 Next Steps

### High Priority
- [ ] Add real authentication (JWT)
- [ ] Connect to real database
- [ ] Add form validation
- [ ] Implement notifications

### Medium Priority
- [ ] Add more 3D visualizations
- [ ] User profile editing
- [ ] Advanced filtering
- [ ] Export functionality

### Low Priority
- [ ] Dark mode
- [ ] Internationalization
- [ ] Performance metrics
- [ ] Analytics integration

## 🤝 Contributing

The codebase follows:
- ESLint configuration for code quality
- TypeScript strict mode for type safety
- Consistent folder structure
- Descriptive naming conventions

## 📞 Support

Check documentation files for detailed guides:
- **Setup Issues**: See `REACT_SETUP.md`
- **Command Reference**: See `COMMANDS.md`
- **Development Guide**: See `DEVELOPMENT.md`
- **API Reference**: See Flask documentation in `hrp-server/README.md`
