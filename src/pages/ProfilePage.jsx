import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const { user, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(user);
  const [roleDetails, setRoleDetails] = useState(null);
  const [department, setDepartment] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [requestedDeptId, setRequestedDeptId] = useState("");

  const [allPermissions, setAllPermissions] = useState([]);
  const [requestedPermission, setRequestedPermission] = useState("");

  const [admins, setAdmins] = useState([]);
  const [showAdmins, setShowAdmins] = useState(false);

  useEffect(() => {
    if (user?.role?.id) {
      fetch(`http://localhost:8080/api/roles/${user.role.id}`)
        .then(res => res.json())
        .then(setRoleDetails);
    }

    fetch(`http://localhost:8080/api/departments`)
      .then(res => res.json())
      .then(depts => {
        setDepartments(depts);
        const found = depts.find(h => h.id === user.hierarchyId);
        setDepartment(found);
      });

    fetch(`http://localhost:8080/api/permissions`)
      .then(res => res.json())
      .then(setAllPermissions);

    fetch(`http://localhost:8080/api/users`)
      .then(res => res.json())
      .then(users => {
        const adminUsers = users.filter(u => u.role?.name === "admin");
        setAdmins(adminUsers);
      });
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    fetch(`http://localhost:8080/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(updated => {
        updateUser(updated);
        navigate("/dashboard/profile");
      });
  };

  const submitDepartmentRequest = () => {
    if (!requestedDeptId) return alert("Please select a department");

    fetch(`http://localhost:8080/api/change-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        requestedDeptId,
        status: "pending",
        type: "department"
      })
    }).then(() => {
      alert("Request to change department submitted.");
      setRequestedDeptId("");
    });
  };

  const submitPermissionRequest = () => {
    if (!requestedPermission) return alert("Please select a permission");

    fetch(`http://localhost:8080/api/change-requests`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        requestedPermission,
        status: "pending",
        type: "permission"
      })
    }).then(() => {
      alert("Permission request sent to admin.");
      setRequestedPermission("");
    });
  };

  return (
    <div>
      <h2>My Profile</h2>

      {editing ? (
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px" }}>
          <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
          <input name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
          <input name="password" value={formData.password} onChange={handleChange} placeholder="Password" />
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {roleDetails?.name || "(not assigned)"}</p>
          <p><strong>Permissions:</strong> 
            {roleDetails?.permissions?.map(p => p.name).join(", ") || "None"}
          </p>
          <p><strong>Department:</strong> {department?.name || "(none)"}</p>
          <button onClick={() => setEditing(true)}>Edit Profile</button>
        </>
      )}

      <hr style={{ margin: "20px 0" }} />

      <h3>Request</h3>

      {/* Department Change Request */}
      <div style={{ marginBottom: "10px" }}>
        <label>Change/Assign Department:</label>
        <select
          value={requestedDeptId}
          onChange={(e) => setRequestedDeptId(e.target.value)}
        >
          <option value="">-- Select Department --</option>
          {departments.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
        <button onClick={submitDepartmentRequest} style={{ marginLeft: "10px" }}>
          Request Change
        </button>
      </div>

      {/* Permission Request */}
      <div style={{ marginBottom: "10px" }}>
        <label>Request Permission:</label>
        <select
          value={requestedPermission}
          onChange={(e) => setRequestedPermission(e.target.value)}
        >
          <option value="">-- Select Permission --</option>
          {allPermissions
            .filter(p => !roleDetails?.permissions?.some(rp => rp.name === p.name))
            .map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
        </select>
        <button onClick={submitPermissionRequest} style={{ marginLeft: "10px" }}>
          Request
        </button>
      </div>

      {/* Contact Admin */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={() => setShowAdmins(prev => !prev)}>
          {showAdmins ? "Hide Admins" : "Contact Admin"}
        </button>
        {showAdmins && (
          <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
            {admins.map(a => (
              <li key={a.id}>
                {a.name} - <a href={`mailto:${a.email}`}>{a.email}</a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
