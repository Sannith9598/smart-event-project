import { useState } from "react";
import api from "../api/axiosConfig";

/**
 * EventForm
 * - Allows a manager to create a new event with images.
 * - Uploads images to /api/uploads/image (Cloudinary) then posts event to /api/events.
 */
export default function EventForm({ onCreated }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [files, setFiles] = useState([]); // File objects selected
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [previewUrls, setPreviewUrls] = useState([]); // local previews

  // file input change handler: store File objects and create preview URLs
  function handleFilesChange(e) {
    const f = Array.from(e.target.files || []);
    setFiles(f);
    const previews = f.map(file => URL.createObjectURL(file));
    setPreviewUrls(previews);
  }

  // Upload a single file to /api/uploads/image using FormData
  async function uploadFile(file) {
    const formData = new FormData();
    formData.append("file", file); // backend expects key "file"
    const resp = await api.post("/uploads/image", formData, {
      headers: { "Content-Type": "multipart/form-data" } // axios will add boundary automatically
    });
    // resp.data should contain { success:true, url: "...", public_id: "..." }
    return resp.data.url;
  }

  // Submit handler: upload files first, then create event with gallery URLs
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title) return setError("Title is required");
    setUploading(true);
    try {
      // 1) upload files sequentially (simpler) - could be parallelized later
      const galleryUrls = [];
      for (const f of files) {
        const url = await uploadFile(f);
        galleryUrls.push(url);
      }

      // 2) create event
      const body = {
        title,
        description,
        category,
        location,
        price: price ? Number(price) : 0,
        gallery: galleryUrls
      };

      const createResp = await api.post("/events", body);
      // success: call onCreated callback for parent to refresh list or show message
      if (onCreated) onCreated(createResp.data.event);
      // reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setPrice("");
      setFiles([]);
      setPreviewUrls([]);
    } catch (err) {
      console.error("Event create error:", err);
      setError(err?.response?.data?.error || "Failed to create event");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div style={{ border: "1px solid #ddd", padding: 12, borderRadius: 8, marginTop: 12 }}>
      <h3>Create New Event</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 8 }}>
          <label>Title</label><br />
          <input value={title} onChange={e=>setTitle(e.target.value)} required style={{ width: "100%" }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Description</label><br />
          <textarea value={description} onChange={e=>setDescription(e.target.value)} rows={3} style={{ width: "100%" }} />
        </div>

        <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
          <div style={{ flex: 1 }}>
            <label>Category</label><br />
            <input value={category} onChange={e=>setCategory(e.target.value)} placeholder="e.g., Wedding, Birthday" style={{ width: "100%" }} />
          </div>
          <div style={{ width: 160 }}>
            <label>Price (₹)</label><br />
            <input type="number" value={price} onChange={e=>setPrice(e.target.value)} style={{ width: "100%" }} />
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Location</label><br />
          <input value={location} onChange={e=>setLocation(e.target.value)} style={{ width: "100%" }} />
        </div>

        <div style={{ marginBottom: 8 }}>
          <label>Upload images (multiple allowed)</label><br />
          <input type="file" accept="image/*" multiple onChange={handleFilesChange} />
        </div>

        {/* previews */}
        {previewUrls.length > 0 && (
          <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
            {previewUrls.map((u, idx) => (
              <img key={idx} src={u} alt="preview" style={{ width: 100, height: 70, objectFit: "cover", borderRadius: 6 }} />
            ))}
          </div>
        )}

        <div>
          <button type="submit" disabled={uploading}>{uploading ? "Uploading..." : "Create Event"}</button>
        </div>

        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
      </form>
    </div>
  );
}
