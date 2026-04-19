import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();             
    navigate('/login');   
  };

  const role = user?.role?.name || 'user';

  const tabs = role === 'admin'
    ? ['users', 'permissions', 'roles', 'hierarchy']
    : ['profile', 'myrequests'];

  return (
    <div style={{ width: "200px", background: "#f0f0f0", height: "100vh", padding: "1rem" }}>
      <h4 style={{ marginBottom: "2rem", color: "black" }}>{role.toUpperCase()}</h4>

      {tabs.map(tab => (
        <Link
          key={tab}
          to={`/dashboard/${tab}`}
          style={{
            display: "block",
            marginBottom: "10px",
            fontWeight: location.pathname.includes(tab) ? "bold" : "normal",
            color: "black",
            textDecoration: "none"
          }}
        >
          {tab === 'profile' ? 'MyProfile' : tab === 'myrequests' ? 'MyRequests' : tab.charAt(0).toUpperCase() + tab.slice(1)}
        </Link>
      ))}

      {role === 'admin' && (
        <Link
          to="/dashboard/requests"
          style={{
            display: "block",
            marginBottom: "10px",
            fontWeight: location.pathname.includes("requests") ? "bold" : "normal",
            color: "black",
            textDecoration: "none"
          }}
        >
          User Requests
        </Link>
      )}

      <button
        onClick={handleLogout}
        style={{
          marginTop: "3rem",
          background: "red",
          color: "white",
          padding: "0.5rem",
          border: "none",
          width: "100%"
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default Sidebar;
