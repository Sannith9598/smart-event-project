import EventList from "../components/EventList";

export default function CustomerDashboard() {
  return (
    <div style={{ padding: 20 }}>
      <h2>Customer Dashboard</h2>
      <p>Here you will see your bookings, invoices and recommended managers (future).</p>
      <EventList />
    </div>
  );
}
