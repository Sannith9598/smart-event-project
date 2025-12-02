import { useEffect, useState } from "react";
import axios from "../api/axiosConfig";

function EventList() {
  // 1. State to store events
  const [events, setEvents] = useState([]);

  // 2. Load events when component starts
  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await axios.get("/events");
        setEvents(response.data.events);   // update UI
      } catch (err) {
        console.error("Error fetching events:", err);
      }
    }

    fetchEvents();
  }, []); // empty array = run only once

  return (
    <div style={{ padding: "20px" }}>
      <h2>All Events</h2>

      {events.length === 0 && <p>No events found.</p>}

      {/* 3. Loop through events and show each one */}
      {events.map(event => (
        <div key={event.id} style={{
          border: "1px solid #ccc",
          padding: "15px",
          marginBottom: "10px",
          borderRadius: "8px"
        }}>
          <h3>{event.title}</h3>
          <p><strong>Category:</strong> {event.category}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Price:</strong> ₹{event.price}</p>

          {/* Gallery preview */}
          {event.gallery && event.gallery.length > 0 && (
            <img 
              src={event.gallery[0]} 
              alt="Event" 
              style={{ width: "150px", borderRadius: "6px" }} 
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default EventList;
