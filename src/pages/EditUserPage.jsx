import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function EditUserPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8080/api/users/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data) setUser(data);
      });

    fetch("http://localhost:8080/api/roles")
      .then(res => res.json())
      .then(setRoles);

    fetch("http://localhost:8080/api/departments")
      .then(res => res.json())
      .then(setDepartments);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:8080/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        ...user,
        roleId: user.roleId || null,
        hierarchyId: user.hierarchyId || null
      })
    }).then(() => navigate("/dashboard/users"));
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Edit User</h2>
      <form 
        onSubmit={handleSubmit} 
        style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}
      >
        <input 
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input 
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <select 
          name="roleId"
          value={user.roleId || ""}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Role --</option>
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </select>

        <select 
          name="hierarchyId"
          value={user.hierarchyId || ""}
          onChange={handleChange}
        >
          <option value="">-- Select Department --</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}
