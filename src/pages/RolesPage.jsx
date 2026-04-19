import { useState, useEffect } from 'react';

export default function RolesPage() {
  const [roles, setRoles] = useState([]);
  const [newRole, setNewRole] = useState({ name: '', permissions: '' });
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [editData, setEditData] = useState({ name: '', permissions: '' });

  useEffect(() => {
    fetch('http://localhost:8080/api/roles')
      .then(r => r.json())
      .then(setRoles);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      fetch(`http://localhost:8080/api/roles/${id}`, { method: 'DELETE' })
        .then(() => setRoles(prev => prev.filter(role => role.id !== id)));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const payload = {
      name: newRole.name,
      permissions: newRole.permissions.split(',').map(p => ({ name: p.trim() }))
    };
    fetch('http://localhost:8080/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(added => {
        setRoles(prev => [...prev, added]);
        setNewRole({ name: '', permissions: '' });
      });
  };

  const handleEdit = (role) => {
    setEditingRoleId(role.id);
    setEditData({ 
      name: role.name, 
      permissions: role.permissions.map(p => p.name).join(', ') 
    });
  };

  const handleEditSave = (id) => {
    const payload = {
      name: editData.name,
      permissions: editData.permissions.split(',').map(p => ({ name: p.trim() }))
    };
    fetch(`http://localhost:8080/api/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(updated => {
        setRoles(prev => prev.map(r => r.id === id ? updated : r));
        setEditingRoleId(null);
      });
  };

  return (
    <div>
      <h2>Role Management</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map(role => (
            <tr key={role.id}>
              <td>
                {editingRoleId === role.id ? (
                  <input
                    value={editData.name}
                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                  />
                ) : role.name}
              </td>
              <td>
                {editingRoleId === role.id ? (
                  <input
                    value={editData.permissions}
                    onChange={e => setEditData({ ...editData, permissions: e.target.value })}
                  />
                ) : role.permissions.map(p => p.name).join(', ')}
              </td>
              <td>
                {editingRoleId === role.id ? (
                  <button onClick={() => handleEditSave(role.id)}>Save</button>
                ) : (
                  <>
                    <button onClick={() => handleEdit(role)}>Edit</button>
                    <button onClick={() => handleDelete(role.id)} style={{ color: 'red', marginLeft: '10px' }}>
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleAdd}>
        <h3>Add New Role</h3>
        <input
          type="text"
          placeholder="Role name"
          value={newRole.name}
          onChange={e => setNewRole({ ...newRole, name: e.target.value })}
          required
        />
        <br />
        <input
          type="text"
          placeholder="Permissions (comma separated)"
          value={newRole.permissions}
          onChange={e => setNewRole({ ...newRole, permissions: e.target.value })}
          required
        />
        <br />
        <button type="submit" style={{ marginTop: '10px' }}>Add Role</button>
      </form>
    </div>
  );
}
