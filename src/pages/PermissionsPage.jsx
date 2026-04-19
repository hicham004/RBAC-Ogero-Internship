import { useState, useEffect } from 'react';

export default function PermissionsPage() {
  const [perms, setPerms] = useState([]);
  const [newPerm, setNewPerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/permissions')
      .then(r => r.json())
      .then(setPerms);
  }, []);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this permission?")) {
      fetch(`http://localhost:8080/api/permissions/${id}`, { method: 'DELETE' })
        .then(() => setPerms(prev => prev.filter(p => p.id !== id)));
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const payload = {
      name: newPerm.trim()
    };
    fetch('http://localhost:8080/api/permissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(added => {
        setPerms(prev => [...prev, added]);
        setNewPerm('');
      });
  };

  return (
    <div>
      <h2>Permissions</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '20px' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {perms.map(p => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>
                <button onClick={() => handleDelete(p.id)} style={{ color: 'red' }}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <form onSubmit={handleAdd}>
        <h3>Add New Permission</h3>
        <input
          type="text"
          placeholder="Permission name"
          value={newPerm}
          onChange={e => setNewPerm(e.target.value)}
          required
        />
        <br />
        <button type="submit" style={{ marginTop: '10px' }}>Add Permission</button>
      </form>
    </div>
  );
}
