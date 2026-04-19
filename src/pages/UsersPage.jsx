import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PermissionGuard from '../components/PermissionGuard';

function UsersPage() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    fetch("http://localhost:8080/api/users")
      .then(res => res.json())
      .then(async users => {
        const rolesRes = await fetch("http://localhost:8080/api/roles");
        const roles = await rolesRes.json();
        const usersWithRoles = users.map(u => ({
          ...u,
          role: roles.find(r => r.id === u.role?.id || r.id === u.roleId)
        }));
        setUsers(usersWithRoles);
      });
  }, []);

  const filteredUsers = users.filter(u => {
    const term = filter.toLowerCase();
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let fieldA = a[sortField], fieldB = b[sortField];
    if (sortField === "role") {
      fieldA = a.role?.name || "";
      fieldB = b.role?.name || "";
    }
    if (typeof fieldA === "string") {
      fieldA = fieldA.toLowerCase();
      fieldB = fieldB.toLowerCase();
    }
    if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedUsers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = sortedUsers.slice(startIndex, startIndex + pageSize);

  const changeSort = field => {
    const order = (field === sortField && sortOrder === "asc") ? "desc" : "asc";
    setSortField(field);
    setSortOrder(order);
  };

  const deleteUser = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    fetch(`http://localhost:8080/api/users/${id}`, { method: "DELETE" })
      .then(() => {
        setUsers(prev => prev.filter(u => u.id !== id));
      });
  };

  return (
    <div>
      <h2>User Management</h2>

      <input
        placeholder="Search users..."
        value={filter}
        onChange={e => { setFilter(e.target.value); setCurrentPage(1); }}
      />

      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th onClick={() => changeSort("name")}>
              Name {sortField === "name" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => changeSort("email")}>
              Email {sortField === "email" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th onClick={() => changeSort("role")}>
              Role {sortField === "role" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map(u => (
            <tr key={u.id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td style={{ color: u.role ? "inherit" : "gray" }}>
                {u.role?.name || "(no role assigned)"}
              </td>
              <td>
                <button onClick={() => window.location.href = `/dashboard/users/edit/${u.id}`}>
                  Edit
                </button>
                <button onClick={() => deleteUser(u.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {paginatedUsers.length === 0 && (
            <tr><td colSpan="4">No users found.</td></tr>
          )}
        </tbody>
      </table>

      <div>
        Page: {currentPage} of {totalPages}{" "}
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Prev</button>
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(p => p + 1)}>Next</button>
      </div>

      <PermissionGuard perm="manage_users">
        <button onClick={() => window.location.href = "/dashboard/users/new"}>
          Add User
        </button>
      </PermissionGuard>
    </div>
  );
}

export default UsersPage;
