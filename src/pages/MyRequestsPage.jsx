import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function MyRequestsPage() {
  const { user } = useContext(AuthContext);
  const [deptRequests, setDeptRequests] = useState([]);
  const [permRequests, setPermRequests] = useState([]);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    // Fetch department change requests for the logged-in user
    fetch(`http://localhost:8080/api/change-requests/user/${user.id}?type=department`)
      .then(res => res.json())
      .then(setDeptRequests);

    // Fetch permission requests for the logged-in user
    fetch(`http://localhost:8080/api/change-requests/user/${user.id}?type=permission`)
      .then(res => res.json())
      .then(setPermRequests);

    // Fetch all departments for name lookup
    fetch("http://localhost:8080/api/departments")
      .then(res => res.json())
      .then(setDepartments);
  }, [user]);

  const getDeptName = (id) =>
    departments.find(d => d.id.toString() === id.toString())?.name || "Unknown";

  return (
    <div style={{ padding: "20px" }}>
      <h2>My Requests</h2>

      <h3>Department Change Requests</h3>
      {deptRequests.length === 0 && <p>No department change requests</p>}
      {deptRequests.map(req => (
        <div key={req.id} style={{ marginBottom: "10px" }}>
          Requested move to <strong>{getDeptName(req.requestedDeptId)}</strong> — Status: <strong>{req.status}</strong>
        </div>
      ))}

      <hr />

      <h3>Permission Requests</h3>
      {permRequests.length === 0 && <p>No permission requests</p>}
      {permRequests.map(req => (
        <div key={req.id} style={{ marginBottom: "10px" }}>
          Requested permission: <strong>{req.requestedPermission}</strong> — Status: <strong>{req.status}</strong>
        </div>
      ))}
    </div>
  );
}
