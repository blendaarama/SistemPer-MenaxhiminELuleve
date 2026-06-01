import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/reviews";

const initialForm = {
  id: null,
  customerId: "",
  customerName: "",
  productId: "",
  productType: "BOUQUET",
  score: 5,
  comment: ""
};

const ReviewsCRUD = () => {
  const [reviews, setReviews]   = useState([]);
  const [form, setForm]         = useState(initialForm);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  useEffect(() => { fetchReviews(); }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(API_URL);
      setReviews(Array.isArray(res.data) ? res.data : res.data?.content ?? []);
    } catch {
      const local = JSON.parse(localStorage.getItem("reviews") || "[]");
      setReviews(local.length ? local : [
        { id: 1, customerId: "C-001", customerName: "Elena Krasniqi", productId: 3, productType: "BOUQUET", score: 5, comment: "Buqeta ishte mahnitëse, shumë elegante!" },
        { id: 2, customerId: "C-002", customerName: "Arben Hoxha", productId: 1, productType: "FLOWER", score: 4, comment: "Lule të freskëta, dorëzim i shpejtë." },
        { id: 3, customerId: "C-003", customerName: "Mirlinda Gashi", productId: 5, productType: "BOUQUET", score: 3, comment: "E mirë, por çmimi pak i lartë." }
      ]);
      setError("⚠️ Backend jo aktiv — po shfaqen të dhëna lokale.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.customerId || !form.comment) {
      setError("ID e klientit dhe komenti janë të detyrueshme.");
      return;
    }
    if (form.score < 1 || form.score > 5) {
      setError("Vlerësimi duhet të jetë mes 1 dhe 5.");
      return;
    }
    setError("");

    const payload = {
      ...form,
      id: form.id || Date.now(),
      score: Number(form.score),
      productId: Number(form.productId) || null
    };

    try {
      if (form.id) {
        await axios.put(`${API_URL}/${form.id}`, payload);
      } else {
        await axios.post(API_URL, payload);
      }
      fetchReviews();
    } catch {
      const local = JSON.parse(localStorage.getItem("reviews") || "[]");
      const updated = form.id
        ? local.map(r => r.id === form.id ? payload : r)
        : [...local, payload];
      localStorage.setItem("reviews", JSON.stringify(updated));
      setReviews(updated);
    }
    setForm(initialForm);
  };

  const handleEdit = (r) => {
    setForm({ ...r });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("A jeni të sigurt që dëshironi ta fshini këtë vlerësim?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch {
      const updated = reviews.filter(r => r.id !== id);
      localStorage.setItem("reviews", JSON.stringify(updated));
    }
    setReviews(prev => prev.filter(r => r.id !== id));
  };

  const StarDisplay = ({ score }) => (
    <span style={{ color: "#F9A825", fontSize: "14px", letterSpacing: "2px" }}>
      {"★".repeat(score)}{"☆".repeat(5 - score)}
    </span>
  );

  const avgScore = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.score, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1F1F1F" }}>
      <div style={{ maxWidth: "1300px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div>
            <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>Menaxhimi i Cilësisë</span>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A", margin: 0 }}>Moderimi i Vlerësimeve</h2>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "11px", color: "rgba(31,31,31,0.5)", textTransform: "uppercase", letterSpacing: "1px" }}>Mesatarja e Vlerësimeve</div>
            <div style={{ fontSize: "28px", fontFamily: "Georgia, serif", color: "#2B1A4A", fontWeight: "400" }}>
              ★ {avgScore} <span style={{ fontSize: "14px", color: "rgba(31,31,31,0.4)" }}>/ 5.0</span>
            </div>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: "#FFEAEA", color: "#C0392B", border: "1px solid #FFD1D1", padding: "12px", fontSize: "13px", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 2.2fr", gap: "40px", alignItems: "start" }}>

          {/* FORM */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px" }}>
            <h3 style={{ fontSize: "13px", fontWeight: "700", letterSpacing: "1px", textTransform: "uppercase", marginBottom: "25px", borderBottom: "2px solid #2B1A4A", paddingBottom: "8px", color: "#2B1A4A" }}>
              {form.id ? "Ndrysho Vlerësimin" : "Shto Vlerësim të Ri"}
            </h3>
            <form onSubmit={handleSubmit}>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>ID e Klientit</label>
                  <input type="text" value={form.customerId} onChange={e => setForm({ ...form, customerId: e.target.value })} placeholder="p.sh. C-001" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Emri i Klientit</label>
                  <input type="text" value={form.customerName} onChange={e => setForm({ ...form, customerName: e.target.value })} placeholder="p.sh. Elena K." style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", boxSizing: "border-box" }} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "15px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Lloji Produktit</label>
                  <select value={form.productType} onChange={e => setForm({ ...form, productType: e.target.value })} style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5" }}>
                    <option value="BOUQUET">Buqetë</option>
                    <option value="FLOWER">Lule</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>ID e Produktit</label>
                  <input type="number" value={form.productId} onChange={e => setForm({ ...form, productId: e.target.value })} placeholder="p.sh. 3" style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", boxSizing: "border-box" }} />
                </div>
              </div>

              {/* Star Rating */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "8px", color: "rgba(31,31,31,0.6)" }}>Vlerësimi (1–5 Yje)</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, score: star })}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        fontSize: "28px", color: star <= form.score ? "#F9A825" : "#D0C8C0",
                        padding: "0", lineHeight: "1"
                      }}
                    >★</button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: "25px" }}>
                <label style={{ display: "block", fontSize: "11px", fontWeight: "600", textTransform: "uppercase", marginBottom: "6px", color: "rgba(31,31,31,0.6)" }}>Komenti</label>
                <textarea
                  rows="4"
                  value={form.comment}
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                  placeholder="Shkruaj vlerësimin e klientit..."
                  style={{ width: "100%", padding: "10px", border: "1px solid #C4B9AF", background: "#FAF8F5", fontFamily: "inherit", resize: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" style={{ flex: 1, background: "#2B1A4A", color: "#FFF", padding: "12px", border: "none", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase", cursor: "pointer" }}>
                  {form.id ? "Përditëso" : "Publiko Vlerësimin"}
                </button>
                {form.id && (
                  <button type="button" onClick={() => setForm(initialForm)} style={{ background: "transparent", color: "#1F1F1F", border: "1px solid #C4B9AF", padding: "12px 16px", cursor: "pointer" }}>✕</button>
                )}
              </div>
            </form>
          </div>

          {/* TABLE */}
          <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
            {loading ? (
              <div style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)" }}>Duke ngarkuar vlerësimet...</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13.5px" }}>
                <thead>
                  <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                    {["ID", "Klienti", "Produkti", "Vlerësimi", "Komenti", "Veprime"].map((h, i) => (
                      <th key={h} style={{ padding: "16px 15px", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", textAlign: i === 3 || i === 5 ? "center" : "left" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {reviews.length === 0 ? (
                    <tr><td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>Nuk ka vlerësime për momentin.</td></tr>
                  ) : reviews.map((r, i) => (
                    <tr key={r.id} style={{ borderBottom: "1px solid #E6E0D8", background: i % 2 === 0 ? "#FFF" : "#FDFAF7" }}>
                      <td style={{ padding: "16px 15px", fontWeight: "600", color: "#0E5A5B" }}>#{String(r.id).slice(-4)}</td>
                      <td style={{ padding: "16px 15px" }}>
                        <div style={{ fontWeight: "600", color: "#2B1A4A" }}>{r.customerName || r.customerId}</div>
                        <div style={{ fontSize: "11px", color: "rgba(31,31,31,0.5)" }}>{r.customerId}</div>
                      </td>
                      <td style={{ padding: "16px 15px" }}>
                        <span style={{ fontSize: "10px", fontWeight: "700", padding: "3px 8px", textTransform: "uppercase", background: r.productType === "BOUQUET" ? "#EDE7F6" : "#E8F5E9", color: r.productType === "BOUQUET" ? "#4527A0" : "#2E7D32" }}>
                          {r.productType === "BOUQUET" ? "Buqetë" : "Lule"}
                        </span>
                        {r.productId && <span style={{ display: "block", fontSize: "11px", color: "rgba(31,31,31,0.4)", marginTop: "2px" }}>ID: #{r.productId}</span>}
                      </td>
                      <td style={{ padding: "16px 15px", textAlign: "center" }}>
                        <StarDisplay score={r.score} />
                        <div style={{ fontSize: "11px", color: "rgba(31,31,31,0.5)", marginTop: "2px" }}>{r.score}/5</div>
                      </td>
                      <td style={{ padding: "16px 15px", fontFamily: "Georgia, serif", fontSize: "13px", color: "rgba(31,31,31,0.7)", maxWidth: "220px" }}>{r.comment}</td>
                      <td style={{ padding: "16px 15px", textAlign: "center" }}>
                        <button onClick={() => handleEdit(r)} style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", padding: "4px 8px", fontSize: "11px", textTransform: "uppercase", cursor: "pointer", marginRight: "5px" }}>Edit</button>
                        <button onClick={() => handleDelete(r.id)} style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", padding: "4px 8px", fontSize: "11px", textTransform: "uppercase", cursor: "pointer" }}>Fshij</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsCRUD;