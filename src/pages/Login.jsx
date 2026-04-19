import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router-dom';

function Login() {
  const { login, user } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");
    const success = await login(formData.email, formData.password);
    if (success) {
      navigate('/');
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh'
    }}>
      <div style={{ width: '300px' }}>
        <h2>Login</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
          />
          <button type="submit">Login</button>
        </form>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

        <p style={{ marginTop: '1rem' }}>
          Don’t have an account?{" "}
          <Link to="/signup" style={{ color: "blue" }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
