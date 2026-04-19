import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ display: "flex" }}>
      {sidebarOpen && <Sidebar />}
      <div style={{ flexGrow: 1, padding: "1rem" }}>
        {/* Hamburger Button */}
        <button onClick={() => setSidebarOpen(prev => !prev)} style={{ marginBottom: "1rem" }}>
          ☰
        </button>

        <Outlet />
      </div>
    </div>
  );
}
