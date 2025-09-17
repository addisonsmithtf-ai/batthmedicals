import { useState } from "react";
import Login from "./Login";
import StaffDashboard from "./StaffDashboard";
import AdminDashboard from "./AdminDashboard";

const Index = () => {
  const [user, setUser] = useState<{ username: string; role: 'staff' | 'admin' } | null>(null);

  const handleLogin = (username: string, role: 'staff' | 'admin') => {
    setUser({ username, role });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  if (user.role === 'admin') {
    return <AdminDashboard username={user.username} onLogout={handleLogout} />;
  }

  return <StaffDashboard username={user.username} onLogout={handleLogout} />;
};

export default Index;
