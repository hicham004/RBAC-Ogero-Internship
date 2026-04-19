// src/components/PermissionGuard.js
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function PermissionGuard({ perm, children }) {
  const { user } = useContext(AuthContext);
  if (!user || !user.role.permissions.includes(perm)) {
    return null;  
  }
  return children;
}

export default PermissionGuard;
