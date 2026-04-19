import { useState, useEffect } from 'react';

export default function HierarchyPage() {
  const [nodes, setNodes] = useState([]);
  const [newNode, setNewNode] = useState({ name: '', parentId: '' });

  useEffect(() => {
    fetch('http://localhost:8080/api/departments')
      .then(r => r.json())
      .then(setNodes);
  }, []);

  const handleAdd = (e) => {
    e.preventDefault();
    const payload = {
      name: newNode.name,
      parentId: newNode.parentId || null
    };
    fetch('http://localhost:8080/api/departments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(added => {
        setNodes(prev => [...prev, added]);
        setNewNode({ name: '', parentId: '' });
      });
  };

  const buildTree = (parentId = null) => {
    return nodes
      .filter(n => n.parentId === parentId)
      .map(n => ({
        ...n,
        children: buildTree(n.id)
      }));
  };

  const renderTree = (tree) => {
    return (
      <ul>
        {tree.map(node => (
          <li key={node.id}>
            {node.name}
            <button
              style={{
                marginLeft: '10px',
                color: 'white',
                backgroundColor: 'red',
                border: 'none',
                padding: '1px 2px',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this node?")) {
                  fetch(`http://localhost:8080/api/departments/${node.id}`, { method: 'DELETE' })
                    .then(() => setNodes(prev => prev.filter(x => x.id !== node.id)));
                }
              }}
            >
              Delete
            </button>
            {node.children.length > 0 && renderTree(node.children)}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div>
      <h2>Hierarchy</h2>

      {renderTree(buildTree())}

      <form onSubmit={handleAdd} style={{ marginTop: '2rem' }}>
        <h3>Add Node</h3>
        <input
          type="text"
          placeholder="Name"
          value={newNode.name}
          onChange={e => setNewNode({ ...newNode, name: e.target.value })}
          required
        />
        <br />
        <select
          value={newNode.parentId}
          onChange={e => setNewNode({ ...newNode, parentId: e.target.value })}
        >
          <option value="">-- No Parent (Root) --</option>
          {nodes.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
        <br />
        <button type="submit" style={{ marginTop: '10px' }}>Add Node</button>
      </form>
    </div>
  );
}
