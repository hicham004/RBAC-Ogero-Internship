import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function ProtectedRoute({ children, requiredPerm }) {
  const { user } = useContext(AuthContext);

  const hasPermission = requiredPerm
    ? user?.role?.permissions?.includes(requiredPerm)
    : !!user;

  if (!user || (requiredPerm && !hasPermission)) {
    return null; 
  }

  return children;
}

export default ProtectedRoute;
