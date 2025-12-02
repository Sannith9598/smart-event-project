import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [err, setErr] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      await api.post("/auth/register", { name, email, password, role });
      nav("/login");
    } catch (error) {
      setErr(error?.response?.data?.error || "Registration failed");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 420 }}>
        <div><label>Name</label><br /><input value={name} onChange={e=>setName(e.target.value)} required /></div>
        <div style={{ marginTop: 8 }}><label>Email</label><br /><input value={email} onChange={e=>setEmail(e.target.value)} required /></div>
        <div style={{ marginTop: 8 }}><label>Password</label><br /><input type="password" value={password} onChange={e=>setPassword(e.target.value)} required /></div>
        <div style={{ marginTop: 8 }}>
          <label>Role</label><br />
          <select value={role} onChange={e=>setRole(e.target.value)}>
            <option value="CUSTOMER">Customer</option>
            <option value="MANAGER">Event Manager</option>
          </select>
        </div>
        <div style={{ marginTop: 12 }}>
          <button type="submit">Register</button>
        </div>
        {err && <div style={{ color: "red", marginTop: 8 }}>{err}</div>}
      </form>
    </div>
  );
}
