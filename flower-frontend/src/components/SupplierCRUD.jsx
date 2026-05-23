import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/suppliers";

const initialState = {
    id: null,
    emertimi: "",
    kontakti: "",
    email: "",
    telefoni: "",
    adresa: ""
};

const SupplierCRUD = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(API_URL);
            setSuppliers(res.data);
        } catch (err) {
            setError("Failed to load suppliers database registry.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (form.id) {
                await axios.put(`${API_URL}/${form.id}`, form);
            } else {
                await axios.post(API_URL, form);
            }
            setForm(initialState);
            loadSuppliers();
        } catch (err) {
            setError("Failed to commit supplier entity modifications.");
            console.error("Error details:", err.response?.data);
        }
    };

    const handleEdit = (s) => {
        setForm({
            id: s.id,
            emertimi: s.emertimi || "",
            kontakti: s.kontakti || "",
            email: s.email || "",
            telefoni: s.telefoni || "",
            adresa: s.adresa || ""
        });
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Are you sure you want to delete this supplier record?");
        if (!ok) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            loadSuppliers();
        } catch (err) {
            setError("Failed to execute database deletion on target supplier.");
            console.error(err);
        }
    };

    return (
        <div 
            style={{ 
                background: "#FAF8F5", 
                minHeight: "100vh", 
                padding: "40px 6%", 
                fontFamily: "system-ui, -apple-system, sans-serif",
                color: "#1F1F1F"
            }}
        >
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                
                {/* HEADER */}
                <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
                    <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>
                        Supply Chain
                    </span>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>
                        Supplier Directory
                    </h2>
                </div>

                {/* ERROR ALERT BOX */}
                {error && (
                    <div className="alert py-2 mb-4" style={{ backgroundColor: '#FFEAEA', color: '#FF8E8E', border: '1px solid #FFD1D1', fontSize: '13px', borderRadius: "0px" }}>
                        {error}
                    </div>
                )}

                {/* FORM CONTAINER */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px", marginBottom: "40px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", color: "#1F1F1F" }}>
                        {form.id ? "Modify Supplier Metadata" : "Register New B2B Supplier"}
                    </h4>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Corporate Name / Entity</label>
                                <input name="emertimi" placeholder="e.g. Flower Power LLC" className="form-control" value={form.emertimi} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Email Address</label>
                                <input name="email" type="email" placeholder="info@supplier.com" className="form-control" value={form.email} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Point of Contact</label>
                                <input name="kontakti" placeholder="Representative name" className="form-control" value={form.kontakti} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Telephone Contact</label>
                                <input name="telefoni" placeholder="+383..." className="form-control" value={form.telefoni} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Physical HQ Address</label>
                                <input name="adresa" placeholder="Street name, City" className="form-control" value={form.adresa} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <button type="submit" 
                                style={{ background: "#0E5A5B", color: "#FFFFFF", border: "none", padding: "12px 30px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer", marginRight: "12px", transition: "background 0.15s" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#2B1A4A"} onMouseLeave={(e) => e.currentTarget.style.background = "#0E5A5B"}>
                                {form.id ? "Update Profile" : "Save Supplier"}
                            </button>

                            {form.id && (
                                <button type="button" onClick={() => setForm(initialState)}
                                    style={{ background: "transparent", color: "#1F1F1F", border: "1px solid #C4B9AF", padding: "11px 24px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer", transition: "all 0.15s" }}
                                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1F1F1F"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#C4B9AF"; e.currentTarget.style.background = "transparent"; }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* MATRIX REGISTRY LISTING */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "rgba(31,31,31,0.5)", fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>Querying active logistics profiles...</div>
                ) : (
                    <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
                        <table className="table m-0" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "30%" }}>Business Identity</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "25%" }}>Communications</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "25%" }}>Representative & Address</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", textAlign: "center", width: "20%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {suppliers.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" style={{ padding: "30px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                                            No certified B2B supplier units documented.
                                        </td>
                                    </tr>
                                ) : (
                                    suppliers.map(s => (
                                        <tr key={s.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                                            <td style={{ padding: "16px 20px" }}>
                                                <div style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: "600", color: "#2B1A4A" }}>{s.emertimi}</div>
                                                <div style={{ fontSize: "11px", color: "#0E5A5B", fontWeight: "600", marginTop: "2px" }}>ID REFERENCE: #{s.id}</div>
                                            </td>
                                            <td style={{ padding: "16px 20px" }}>
                                                <div style={{ fontWeight: "500" }}>{s.email}</div>
                                                <div style={{ fontSize: "13px", color: "#666666", marginTop: "2px" }}>{s.telefoni}</div>
                                            </td>
                                            <td style={{ padding: "16px 20px" }}>
                                                <div style={{ fontWeight: "600", color: "#555555" }}>{s.kontakti}</div>
                                                <div style={{ fontSize: "12px", color: "#888888", marginTop: "2px" }}>{s.adresa}</div>
                                            </td>
                                            <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                                <button onClick={() => handleEdit(s)}
                                                    style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", borderRadius: "0px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", marginRight: "8px", fontWeight: "600", cursor: "pointer" }}>
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(s.id)}
                                                    style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", borderRadius: "0px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", fontWeight: "600", cursor: "pointer" }}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

            </div>
        </div>
    );
};

export default SupplierCRUD;