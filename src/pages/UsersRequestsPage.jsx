import { useEffect, useState } from "react";

export default function UserRequestsPage() {
  const [changeRequests, setChangeRequests] = useState([]);
  const [permissionRequests, setPermissionRequests] = useState([]);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/users").then(res => res.json()).then(setUsers);
    fetch("http://localhost:8080/api/hierarchy").then(res => res.json()).then(setDepartments);
    fetch("http://localhost:8080/api/roles").then(res => res.json()).then(setRoles);
    fetch("http://localhost:8080/api/change-requests").then(res => res.json()).then(setChangeRequests);
    fetch("http://localhost:8080/api/permission-requests").then(res => res.json()).then(setPermissionRequests);
  }, []);

  const getUser = (id) => users.find(u => u.id.toString() === id.toString());
  const getDept = (id) => departments.find(d => d.id.toString() === id.toString());
  const getRole = (roleId) => roles.find(r => r.id === roleId);

  const handleApproveDept = (req) => {
    fetch(`http://localhost:8080/api/users/${req.userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hierarchyId: req.requestedDeptId })
    }).then(() => {
      fetch(`http://localhost:8080/api/change-requests/${req.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" })
      }).then(() => {
        setChangeRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "approved" } : r));
      });
    });
  };

  const handleRejectDept = (reqId) => {
    fetch(`http://localhost:8080/api/change-requests/${reqId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" })
    }).then(() => {
      setChangeRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "rejected" } : r));
    });
  };

  const handleApprovePermission = (req) => {
    const user = getUser(req.userId);
    const role = getRole(user.roleId);
    if (!role || role.permissions.some(p => p.name === req.requestedPermission)) return;

    const updatedPerms = [...role.permissions, { name: req.requestedPermission }];

    fetch(`http://localhost:8080/api/roles/${role.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...role, permissions: updatedPerms })
    }).then(() => {
      fetch(`http://localhost:8080/api/permission-requests/${req.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "approved" })
      }).then(() => {
        setPermissionRequests(prev => prev.map(r => r.id === req.id ? { ...r, status: "approved" } : r));
      });
    });
  };

  const handleRejectPermission = (reqId) => {
    fetch(`http://localhost:8080/api/permission-requests/${reqId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" })
    }).then(() => {
      setPermissionRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: "rejected" } : r));
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>User Requests</h2>

      <h3>Department Change Requests</h3>
      {changeRequests.length === 0 && <p>No department requests</p>}
      {changeRequests.map(req => {
        const u = getUser(req.userId);
        const dept = getDept(req.requestedDeptId);
        return (
          <div key={req.id} style={{ marginBottom: "10px" }}>
            <strong>{u?.name}</strong> wants to move to <strong>{dept?.name}</strong> — Status: {req.status}
            {req.status === "pending" && (
              <>
                <button onClick={() => handleApproveDept(req)} style={{ marginLeft: "10px" }}>Approve</button>
                <button onClick={() => handleRejectDept(req.id)} style={{ marginLeft: "5px" }}>Reject</button>
              </>
            )}
          </div>
        );
      })}

      <hr />

      <h3>Permission Requests</h3>
      {permissionRequests.length === 0 && <p>No permission requests</p>}
      {permissionRequests.map(req => {
        const u = getUser(req.userId);
        return (
          <div key={req.id} style={{ marginBottom: "10px" }}>
            <strong>{u?.name}</strong> wants permission: <strong>{req.requestedPermission}</strong> — Status: {req.status}
            {req.status === "pending" && (
              <>
                <button onClick={() => handleApprovePermission(req)} style={{ marginLeft: "10px" }}>Approve</button>
                <button onClick={() => handleRejectPermission(req.id)} style={{ marginLeft: "5px" }}>Reject</button>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
