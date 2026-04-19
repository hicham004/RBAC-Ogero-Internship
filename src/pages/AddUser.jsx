import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AddUserPage() {
  const navigate = useNavigate();
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    roleId: "",
    hierarchyId: ""
  });

  useEffect(() => {
    fetch("http://localhost:8080/api/roles")
      .then(res => res.json())
      .then(data => {
        setRoles(data);
        if (data.length > 0) {
          setFormData(fd => ({ ...fd, roleId: data[0].id }));
        }
      });

    fetch("http://localhost:8080/api/departments")
      .then(res => res.json())
      .then(data => {
        setDepartments(data);
        if (data.length > 0) {
          setFormData(fd => ({ ...fd, hierarchyId: data[0].id }));
        }
      });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    fetch("http://localhost:8080/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    }).then(() => {
      navigate("/dashboard/users");
    });
  };

  return (
    <div>
      <h2>Add New User</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
        <input name="name" placeholder="Name" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} required />

        <select name="roleId" value={formData.roleId} onChange={handleChange}>
          {roles.map(r => (
            <option value={r.id} key={r.id}>{r.name}</option>
          ))}
        </select>

        <select name="hierarchyId" value={formData.hierarchyId} onChange={handleChange}>
          {departments.map(d => (
            <option value={d.id} key={d.id}>{d.name}</option>
          ))}
        </select>

        <button type="submit">Save</button>
      </form>
    </div>
  );
}

export default AddUserPage;
