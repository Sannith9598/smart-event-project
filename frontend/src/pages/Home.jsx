import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Smart Event Manager Connect</h1>
      <p>Find trusted event managers near you. Use the navigation to explore events or sign in.</p>
      <p><Link to="/events">View Events</Link></p>
    </div>
  );
}
