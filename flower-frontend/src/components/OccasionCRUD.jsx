import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/occasions";

const initialFormState = {
    id: null,
    emertimi: "",
    pershkrimi: "",
    dataNgjarjes: "",
    zbritjaPerqindje: ""
};

const OccasionCRUD = () => {
    const [occasions, setOccasions] = useState([]);
    const [form, setForm] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        loadOccasions();
    }, []);

    const loadOccasions = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(API_URL);
            setOccasions(res.data);
        } catch (err) {
            setError("Failed to load active seasonal campaigns from repository.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.dataNgjarjes < today) {
            setError("Validation conflict: Target campaign execution date cannot reside in the past.");
            return;
        }

        const payload = {
            id: form.id,
            emertimi: form.emertimi,
            pershkrimi: form.pershkrimi,
            dataNgjarjes: form.dataNgjarjes,
            zbritjaPerqindje: form.zbritjaPerqindje ? Number(form.zbritjaPerqindje) : 0
        };

        try {
            if (form.id) {
                await axios.put(`${API_URL}/${form.id}`, payload);
            } else {
                await axios.post(API_URL, payload);
            }
            resetForm();
            loadOccasions();
        } catch (err) {
            setError("Failed to commit and log campaign pricing configuration change.");
            console.error(err);
        }
    };

    const handleEdit = (occ) => {
        const formattedDate = occ.dataNgjarjes ? occ.dataNgjarjes.split("T")[0] : "";
        setForm({
            id: occ.id,
            emertimi: occ.emertimi || "",
            pershkrimi: occ.pershkrimi || "",
            dataNgjarjes: formattedDate,
            zbritjaPerqindje: occ.zbritjaPerqindje !== undefined ? occ.zbritjaPerqindje : ""
        });
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to terminate this active campaign ledger?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            loadOccasions();
        } catch (err) {
            setError("Failed to execute data purge on target occasion entity.");
            console.error(err);
        }
    };

    const resetForm = () => {
        setForm(initialFormState);
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
                        Marketing & Strategy
                    </span>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>
                        Campaigns & Occasions
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
                        {form.id ? "Modify Event Matrix Rules" : "Deploy Seasonal Incentive Event"}
                    </h4>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Emri i Eventit (Campaign Name)</label>
                                <input type="text" name="emertimi" placeholder="e.g. Valentine's Day Special" className="form-control" value={form.emertimi} onChange={handleInput} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Data e Ngjarjes (Target Date)</label>
                                <input type="date" name="dataNgjarjes" min={today} className="form-control" value={form.dataNgjarjes} onChange={handleInput} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none", cursor: "pointer" }} />
                            </div>

                            <div className="col-md-3 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Zbritja (Markdown %)</label>
                                <input type="number" name="zbritjaPerqindje" placeholder="e.g. 20" min="0" max="100" className="form-control" value={form.zbritjaPerqindje} onChange={handleInput}
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Përshkrimi (Strategic Campaign Overview)</label>
                            <textarea name="pershkrimi" rows="2" placeholder="Write operational details or target pricing definitions..." className="form-control" value={form.pershkrimi} onChange={handleInput}
                                style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none", resize: "none" }}></textarea>
                        </div>

                        <div style={{ marginTop: "25px" }}>
                            <button type="submit" 
                                style={{ background: "#0E5A5B", color: "#FFFFFF", border: "none", padding: "12px 30px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer", marginRight: "12px", transition: "background 0.15s" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#2B1A4A"} onMouseLeave={(e) => e.currentTarget.style.background = "#0E5A5B"}>
                                {form.id ? "Update Campaign" : "Authorize Campaign"}
                            </button>

                            <button type="button" onClick={resetForm}
                                style={{ background: "transparent", color: "#1F1F1F", border: "1px solid #C4B9AF", padding: "11px 24px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer", transition: "all 0.15s" }}
                                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#1F1F1F"; e.currentTarget.style.background = "rgba(0,0,0,0.02)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#C4B9AF"; e.currentTarget.style.background = "transparent"; }}>
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* GRID MATRIX DATA TABLE */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "rgba(31,31,31,0.5)", fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>Analyzing active operational windows...</div>
                ) : (
                    <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
                        <table className="table m-0" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "25%" }}>Event Name</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "15%" }}>Target Date</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "15%" }}>Markdown Allowance</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "30%" }}>Operational Context</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", textAlign: "center", width: "15%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {occasions.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" style={{ padding: "30px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                                            No seasonal marketing windows currently mapped.
                                        </td>
                                    </tr>
                                ) : (
                                    occasions.map(o => (
                                        <tr key={o.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                                            <td style={{ padding: "16px 20px" }}>
                                                <div style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: "600", color: "#2B1A4A" }}>{o.emertimi}</div>
                                                <div style={{ fontSize: "11px", color: "#0E5A5B", fontWeight: "600", marginTop: "2px" }}>REF ID: #{o.id}</div>
                                            </td>
                                            <td style={{ padding: "16px 20px", color: "#555555" }}>
                                                {o.dataNgjarjes ? new Date(o.dataNgjarjes).toLocaleDateString("sq-AL") : "-"}
                                            </td>
                                            <td style={{ padding: "16px 20px" }}>
                                                <span style={{ background: "#FFEAEA", color: "#FF8E8E", padding: "4px 10px", fontSize: "11px", fontWeight: "700", letterSpacing: "0.5px" }}>
                                                    -{o.zbritjaPerqindje}%
                                                </span>
                                            </td>
                                            <td style={{ padding: "16px 20px", color: "#666666", fontSize: "13px", lineHeight: "1.4" }}>
                                                {o.pershkrimi || <span style={{ color: "rgba(31,31,31,0.3)", fontStyle: "italic" }}>No details appended.</span>}
                                            </td>
                                            <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <button onClick={() => handleEdit(o)}
                                                        style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", borderRadius: "0px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", marginRight: "6px", fontWeight: "600", cursor: "pointer" }}>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(o.id)}
                                                        style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", borderRadius: "0px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", fontWeight: "600", cursor: "pointer" }}>
                                                        Delete
                                                    </button>
                                                </div>
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

export default OccasionCRUD;