import { useState } from 'react';

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    const newUser = {
      ...formData,
      roleId: "user-role"
    };

    fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    })
      .then(res => res.json())
      .then(() => {
        console.log("User created successfully");
        window.location.href = "/login";
      })
      .catch(err => console.error("Signup failed:", err));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Sign Up</h2>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}
      >
        <input 
          name="name" 
          placeholder="Name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
        />
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
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
}

export default Signup;
