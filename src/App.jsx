// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import UsersPage from './pages/UsersPage';
import RolesPage from './pages/RolesPage';
import PermissionsPage from './pages/PermissionsPage';
import HierarchyPage from './pages/HierarchyPage';
import ProfilePage from './pages/ProfilePage';
import EditUserPage from './pages/EditUserPage';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import DashboardLayout from './pages/DashboardLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AddUserPage from './pages/AddUser';
import UserRequestsPage from './pages/UsersRequestsPage'; 
import MyRequestsPage from './pages/MyRequestsPage'; 
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredPerm={null}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route
              path="users"
              element={
                <ProtectedRoute requiredPerm="manage_users">
                  <UsersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/edit/:id"
              element={
                <ProtectedRoute requiredPerm="manage_users">
                  <EditUserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="users/new"
              element={
                <ProtectedRoute requiredPerm="manage_users">
                  <AddUserPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="roles"
              element={
                <ProtectedRoute requiredPerm="manage_roles">
                  <RolesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="permissions"
              element={
                <ProtectedRoute requiredPerm="manage_permissions">
                  <PermissionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="hierarchy"
              element={
                <ProtectedRoute requiredPerm="manage_hierarchy">
                  <HierarchyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute requiredPerm={null}>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="requests"
              element={
                <ProtectedRoute requiredPerm="manage_users">
                  <UserRequestsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="myrequests"
              element={
                <ProtectedRoute requiredPerm={null}>
                  <MyRequestsPage />
                </ProtectedRoute>
              }
            />

          </Route>

          {/* Auto-redirect */}
          <Route
            path="/"
            element={
              <AuthContext.Consumer>
                {({ user }) => {
                  if (!user) return <Navigate to="/login" replace />;
                  return user.role?.name === 'admin'
                    ? <Navigate to="/dashboard/users" replace />
                    : <Navigate to="/dashboard/profile" replace />;
                }}
              </AuthContext.Consumer>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<h2>404 - Page Not Found</h2>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
