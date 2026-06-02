import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/users";

const initialForm = {
  id: null,
  emri: "",
  mbiemri: "",
  email: "",
  password: "",
  role: "ROLE_USER"
};

const UsersCRUD = () => {
  const [users, setUsers]     = useState([]);
  const [form, setForm]       = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const cfg = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}` } });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true); setError("");
    try {
      const res = await axios.get(API_URL, cfg());
      setUsers(Array.isArray(res.data) ? res.data : res.data?.content ?? []);
    } catch (err) {
      const status = err.response?.status;
      if (status === 401) setError("401 — Token ka skaduar. Kyçuni sërish.");
      else if (status === 403) setError("403 — Nuk keni të drejta ADMIN.");
      else {
        const local = JSON.parse(localStorage.getItem("users") || "[]");
        setUsers(local);
        if (!local.length) setError("Serveri nuk u arrit dhe nuk ka të dhëna lokale.");
      }
    } finally { setLoading(false); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError("");
   if (!form.emri || !form.email) { setError("Username dhe Email janë të detyrueshme."); return; }
    if (!form.id && !form.password) { setError("Fjalëkalimi është i detyrueshëm për përdorues të ri."); return; }

    const payload = { ...form };
    if (form.id && !form.password) delete payload.password;

    try {
      if (form.id) await axios.put(`${API_URL}/${form.id}`, payload, cfg());
      else await axios.post(API_URL, payload, cfg());
      fetchUsers(); setForm(initialForm);
    } catch { setError("Gabim gjatë ruajtjes. Verifiko lidhjen me serverin."); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi të fshini këtë përdorues?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`, cfg());
      setUsers(prev => prev.filter(u => u.id !== id));
    } catch { setError("Fshirja dështoi."); }
  };

const ROLE_STYLE = {
  ROLE_ADMIN: {
    background: "#EDE7F6",
    color: "#4527A0",
    border: "1px solid #D1C4E9"
  },

  ROLE_USER: {
    background: "#E8F5E9",
    color: "#2E7D32",
    border: "1px solid #C8E6C9"
  },

  ROLE_MODERATOR: {
    background: "#FFF3E0",
    color: "#E65100",
    border: "1px solid #FFCC80"
  },

  ROLE_STAFF: {
    background: "#E3F2FD",
    color: "#1565C0",
    border: "1px solid #90CAF9"
  }
};

  const S = {
    page:  { background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, sans-serif", color: "#1F1F1F" },
    label: { display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" },
    input: { width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", boxSizing: "border-box", fontSize: "14px" },
    th:    { padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" },
    td:    { padding: "16px 15px", borderBottom: "1px solid #E6E0D8" },
  };

  return (
    <div style={S.page}><div style={{ maxWidth: "1300px", margin: "0 auto" }}>

      <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
        <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>System Administration</span>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>Menaxhimi i Përdoruesve</h2>
      </div>

      {error && <div style={{ background: "#FFEAEA", color: "#C0392B", border: "1px solid #FFD1D1", padding: "12px", fontSize: "13px", marginBottom: "20px" }}>{error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "40px", alignItems: "start" }}>

        <div style={{ background: "#FFF", border: "1px solid #E6E0D8", padding: "30px" }}>
          <h3 style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "25px", borderBottom: "2px solid #2B1A4A", paddingBottom: "8px", color: "#2B1A4A" }}>
            {form.id ? "Modifiko Përdoruesin" : "Regjistro Përdorues të Ri"}
          </h3>
          <form onSubmit={handleSubmit}>
            {[
  { label: "Emri", field: "emri", type: "text", placeholder: "Blenda" },

  { label: "Mbiemri", field: "mbiemri", type: "text", placeholder: "Rama" },

  { label: "Email", field: "email", type: "email", placeholder: "user@domain.com" },

  {
    label: form.id
      ? "Fjalëkalim i Ri (lër bosh pa ndryshim)"
      : "Fjalëkalimi",

    field: "password",
    type: "password",
    placeholder: "••••••••"
  },
].map(({ label, field, type, placeholder }) => (
              <div key={field} style={{ marginBottom: "15px" }}>
                <label style={S.label}>{label}</label>
                <input
  type={type}
  value={form[field] || ""}
  onChange={e => setForm({ ...form, [field]: e.target.value })}
  placeholder={placeholder}
  style={S.input}
/>
              </div>
            ))}

            <div style={{ marginBottom: "25px" }}>
              <label style={S.label}>Roli i Sistemit</label>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={S.input}>
               <option value="ROLE_USER">User</option>
<option value="ROLE_STAFF">Staff</option>
<option value="ROLE_MODERATOR">Moderator</option>
<option value="ROLE_ADMIN">Admin</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={{ flex: 1, background: "#2B1A4A", color: "#FFF", padding: "12px", border: "none", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                {form.id ? "Përditëso" : "Krijo Llogarinë"}
              </button>
              {form.id && (
                <button type="button" onClick={() => setForm(initialForm)} style={{ background: "transparent", border: "1px solid #C4B9AF", padding: "12px 16px", cursor: "pointer" }}>✕</button>
              )}
            </div>
          </form>
        </div>

        <div style={{ background: "#FFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
          {loading ? (
            <div style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)" }}>Duke ngarkuar përdoruesit...</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
              <thead>
                <tr style={{ background: "#2B1A4A", color: "#FFF", textAlign: "left" }}>
                  {["ID", "Emri", "Mbiemri", "Email", "Roli", "Veprime"].map((h, i) => (
                    <th key={h} style={{ ...S.th, textAlign: i === 4 ? "center" : "left" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>Nuk ka përdorues të regjistruar.</td></tr>
                ) : users.map((u, i) => (
                  <tr key={u.id} style={{ background: i % 2 === 0 ? "#FFF" : "#FDFAF7" }}>
                    <td style={S.td}><span style={{ fontWeight: "600", color: "#0E5A5B" }}>#{String(u.id).slice(-4)}</span></td>
                    <td style={{ ...S.td, fontWeight: "600", color: "#2B1A4A" }}>
  {u.emri}
</td>

<td style={S.td}>
  {u.mbiemri}
</td>

<td style={S.td}>
  {u.email}
</td>
                    <td style={S.td}>
                      <span style={{ fontSize: "10px", fontWeight: "700", padding: "4px 8px", textTransform: "uppercase", ...(ROLE_STYLE[u.role] || ROLE_STYLE.ROLE_USER) }}>
                        {
  u.role === "ROLE_ADMIN"
    ? "Admin"
    : u.role === "ROLE_MODERATOR"
    ? "Moderator"
    : u.role === "ROLE_STAFF"
    ? "Staff"
    : "User"
}
                      </span>
                    </td>
                    <td style={{ ...S.td, textAlign: "center" }}>
                      <button onClick={() => { setForm({ ...u, password: "" }); window.scrollTo(0, 0); }} style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", padding: "4px 8px", fontSize: "11px", cursor: "pointer", marginRight: "6px" }}>Edit</button>
                      <button onClick={() => handleDelete(u.id)} style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", padding: "4px 8px", fontSize: "11px", cursor: "pointer" }}>Fshij</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div></div>
  );
};

export default UsersCRUD;