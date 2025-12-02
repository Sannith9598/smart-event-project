import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import EventForm from "../components/EventForm";
import api from "../api/axiosConfig";

/**
 * ManagerDashboard
 * - Shows welcome, EventForm, and a simple list of events created by this manager.
 */
export default function ManagerDashboard() {
  const { user } = useAuth();
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  async function loadMyEvents() {
    if (!user) return;
    setLoading(true);
    try {
      // backend /api/events has optional filters; we will fetch all and filter managerId locally
      const res = await api.get("/events");
      const all = res.data.events || [];
      const mine = all.filter(e => e.managerId === user.id);
      setMyEvents(mine);
    } catch (err) {
      console.error("Load my events error", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMyEvents();
  }, [user]);

  return (
    <div style={{ padding: 20 }}>
      <h2>Manager Dashboard</h2>
      <p>Welcome, <strong>{user?.name}</strong></p>

      <EventForm onCreated={(ev) => {
        // when a new event is created, refresh the list quickly
        setMyEvents(prev => [ev, ...prev]);
      }} />

      <div style={{ marginTop: 20 }}>
        <h3>Your Events</h3>
        {loading && <p>Loading...</p>}
        {!loading && myEvents.length === 0 && <p>No events yet.</p>}
        {myEvents.map(ev => (
          <div key={ev.id} style={{ border: "1px solid #eee", padding: 10, marginBottom: 8 }}>
            <strong>{ev.title}</strong> — {ev.category} — ₹{ev.price}
            <div style={{ marginTop: 6 }}>
              {ev.gallery && ev.gallery.length>0 && <img src={ev.gallery[0]} alt="ev" style={{ width:120, height:80, objectFit:"cover", borderRadius:6 }} />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
