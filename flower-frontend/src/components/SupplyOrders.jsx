import React, { useEffect, useState } from "react";
import axios from "react";

const API_URL = "http://localhost:8080/api/supply-orders";

const initialState = {
    id: null,
    supplierId: "",
    flowerId: "",
    quantity: "",
    status: "PENDING"
};

const SupplyOrdersCRUD = () => {
    const [data, setData] = useState([]);
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(API_URL);
            setData(res.data);
        } catch (err) {
            setError("Failed to load supply orders from logistics database.");
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

        // Konstruktimi i saktë i payload-it për të parandaluar gabimet 400 Bad Request në Spring Boot
        const payload = {
            id: form.id,
            supplierId: parseInt(form.supplierId, 10),
            flowerId: parseInt(form.flowerId, 10),
            quantity: parseInt(form.quantity, 10),
            status: form.status
        };

        try {
            if (form.id) {
                await axios.put(`${API_URL}/${form.id}`, payload);
            } else {
                await axios.post(API_URL, payload);
            }
            setForm(initialState);
            fetchData();
        } catch (err) {
            setError("Failed to commit supply order data properties. Check if IDs exist in Database.");
            console.error(err);
        }
    };

    const handleEdit = (item) => {
        // Nxirret ID-ja e saktë qoftë nëse vjen si numër, qoftë si objekt i plotë nga Hibernate
        setForm({
            id: item.id,
            supplierId: item.supplierId || (item.supplier && item.supplier.id) || "",
            flowerId: item.flowerId || (item.flower && item.flower.id) || "",
            quantity: item.quantity || "",
            status: item.status || "PENDING"
        });
    };

    const handleDelete = async (id) => {
        const ok = window.confirm("Are you sure you want to delete this supply order record?");
        if (!ok) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchData();
        } catch (err) {
            setError("Failed to execute database deletion on target supply order.");
            console.error(err);
        }
    };

    return (
        <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1F1F1F" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                
                {/* HEADER */}
                <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
                    <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>Procurement Logistics</span>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>Supply Orders Management</h2>
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
                        {form.id ? "Modify Supply Request Properties" : "Initiate New Supply Order Request"}
                    </h4>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Supplier Reference ID</label>
                                <input name="supplierId" type="number" placeholder="e.g. 12" className="form-control" value={form.supplierId} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Target Flower ID</label>
                                <input name="flowerId" type="number" placeholder="e.g. 104" className="form-control" value={form.flowerId} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Requested Quantity</label>
                                <input name="quantity" type="number" min="1" placeholder="Units required" className="form-control" value={form.quantity} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Order Document Status</label>
                                <select name="status" className="form-control" value={form.status} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }}>
                                    <option value="PENDING">PENDING</option>
                                    <option value="APPROVED">APPROVED</option>
                                    <option value="REJECTED">REJECTED</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <button type="submit" 
                                style={{ background: "#0E5A5B", color: "#FFFFFF", border: "none", padding: "12px 30px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer", marginRight: "12px" }}>
                                {form.id ? "Update Request" : "Commit Supply Request"}
                            </button>

                            {form.id && (
                                <button type="button" onClick={() => setForm(initialState)}
                                    style={{ background: "transparent", color: "#1F1F1F", border: "1px solid #C4B9AF", padding: "11px 24px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer" }}>
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* GRID MATRIX DATA TABLE */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "rgba(31,31,31,0.5)", fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>Loading logistics ledger...</div>
                ) : (
                    <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
                        <table className="table m-0" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Manifest ID</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Supplier Identity</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Flower Description</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Quantity</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Status</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", textAlign: "center" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>No registered supply orders documented.</td>
                                    </tr>
                                ) : (
                                    data.map((x) => {
                                        let statusColor = "#666666";
                                        let statusBg = "#FAF8F5";
                                        if (x.status === "APPROVED") { statusColor = "#0E5A5B"; statusBg = "#E8F5F5"; }
                                        else if (x.status === "REJECTED") { statusColor = "#FF8E8E"; statusBg = "#FFEAEA"; }

                                        return (
                                            <tr key={x.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                                                <td style={{ padding: "16px 20px", fontWeight: "600", color: "#0E5A5B" }}>#{x.id}</td>
                                                <td style={{ padding: "16px 20px", fontWeight: "500" }}>
                                                    {x.supplier?.emertimi || x.supplierName || `Supplier ID: #${x.supplierId || (x.supplier && x.supplier.id)}`}
                                                </td>
                                                <td style={{ padding: "16px 20px", fontFamily: "Georgia, serif", fontSize: "15px" }}>
                                                    {x.flower?.emertimi || x.flowerName || `Flower ID: #${x.flowerId || (x.flower && x.flower.id)}`}
                                                </td>
                                                <td style={{ padding: "16px 20px", fontWeight: "600" }}>{x.quantity} units</td>
                                                <td style={{ padding: "16px 20px" }}>
                                                    <span style={{ background: statusBg, color: statusColor, padding: "4px 10px", fontSize: "11px", fontWeight: "700", letterSpacing: "1px" }}>{x.status}</span>
                                                </td>
                                                <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                                    <button onClick={() => handleEdit(x)} style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", marginRight: "8px", fontWeight: "600", cursor: "pointer" }}>Edit</button>
                                                    <button onClick={() => handleDelete(x.id)} style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", fontWeight: "600", cursor: "pointer" }}>Delete</button>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SupplyOrdersCRUD;