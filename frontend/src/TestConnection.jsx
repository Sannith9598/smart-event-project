import { useEffect, useState } from "react";
import api from "./api/axiosConfig";

export default function TestConnection() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.get("/hello")
      .then((res) => setMessage(res.data.message))
      .catch(() => setMessage("Error connecting to backend")); // removed unused param
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Backend Test</h1>
      <p>{message}</p>
    </div>
  );
}
