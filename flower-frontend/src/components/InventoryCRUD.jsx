import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/inventory";

const initialState = {
    id: null,
    flowerId: "",
    currentStock: "",
    reservedStock: "",
    minStockLevel: "",
    lastUpdated: ""
};

const InventoryCRUD = () => {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(initialState);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const res = await axios.get(API_URL);
            setItems(res.data);
        } catch (err) {
            console.error("Error fetching inventory logs:", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const save = async (e) => {
        e.preventDefault();

        // Konstruktimi i saktë i payload-it me tipe të duhura të dhënash
        const payload = {
            id: form.id,
            flowerId: parseInt(form.flowerId),
            currentStock: parseInt(form.currentStock),
            reservedStock: parseInt(form.reservedStock),
            minStockLevel: parseInt(form.minStockLevel),
            lastUpdated: form.lastUpdated
        };

        try {
            if (form.id) {
                await axios.put(`${API_URL}/${form.id}`, payload);
            } else {
                await axios.post(API_URL, payload);
            }
            setForm(initialState);
            load();
        } catch (err) {
            console.error("Error updating inventory metrics:", err);
        }
    };

    const edit = (i) => {
        setForm({
            id: i.id,
            flowerId: i.flowerId || i.flower?.id || "",
            currentStock: i.currentStock,
            reservedStock: i.reservedStock,
            minStockLevel: i.minStockLevel,
            lastUpdated: i.lastUpdated ? i.lastUpdated.substring(0, 10) : "" // formatting e dates nese vjen si ISO string
        });
    };

    const remove = async (id) => {
        const ok = window.confirm("Are you sure you want to delete this inventory record?");
        if (!ok) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            load();
        } catch (err) {
            console.error("Error executing database delete operation:", err);
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
                        Core Logistics
                    </span>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>
                        Inventory Stock Levels
                    </h2>
                </div>

                {/* FORM CONTROLLER */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px", marginBottom: "40px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", color: "#1F1F1F" }}>
                        {form.id ? "Modify Inventory Record" : "Log New Inventory Stock"}
                    </h4>
                    
                    <form onSubmit={save}>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Flower Reference ID</label>
                                <input name="flowerId" type="number" placeholder="e.g. 104" className="form-control" value={form.flowerId} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Current Physical Stock</label>
                                <input name="currentStock" type="number" placeholder="Units in warehouse" className="form-control" value={form.currentStock} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Reserved for Orders</label>
                                <input name="reservedStock" type="number" placeholder="Allocated units" className="form-control" value={form.reservedStock} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Minimum Safety Level</label>
                                <input name="minStockLevel" type="number" placeholder="Threshold for alerts" className="form-control" value={form.minStockLevel} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Last Audit Date</label>
                                <input type="date" name="lastUpdated" className="form-control" value={form.lastUpdated} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none", cursor: "pointer" }} />
                            </div>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <button type="submit" 
                                style={{ background: "#0E5A5B", color: "#FFFFFF", border: "none", padding: "12px 30px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer", marginRight: "12px", transition: "background 0.15s" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#2B1A4A"} onMouseLeave={(e) => e.currentTarget.style.background = "#0E5A5B"}>
                                {form.id ? "Update Log" : "Commit Stock"}
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

                {/* MATRIX GRID TABLE */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
                    <table className="table m-0" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                        <thead>
                            <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>ID</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Flower Description</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>On Hand</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Reserved</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Safety Min</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Audit Date</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="7" style={{ padding: "30px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                                        No inventory tracking entities documented.
                                    </td>
                                </tr>
                            ) : (
                                items.map(i => {
                                    const isCritical = i.currentStock <= i.minStockLevel;
                                    return (
                                        <tr key={i.id} style={{ borderBottom: "1px solid #E6E0D8", backgroundColor: isCritical ? "#FFFDF9" : "transparent" }}>
                                            <td style={{ padding: "16px 20px", fontWeight: "600", color: "#0E5A5B" }}>#{i.id}</td>
                                            <td style={{ padding: "16px 20px", fontFamily: "Georgia, serif", fontSize: "15px" }}>
                                                {i.flowerName || i.flower?.emertimi || i.flower?.name || `Flower ID: ${i.flowerId}`}
                                            </td>
                                            <td style={{ padding: "16px 20px", fontWeight: "600", color: isCritical ? "#FF8E8E" : "#1F1F1F" }}>
                                                {i.currentStock} units {isCritical && "(Low Stock)"}
                                            </td>
                                            <td style={{ padding: "16px 20px", color: "#666666" }}>{i.reservedStock} units</td>
                                            <td style={{ padding: "16px 20px", color: "#888888" }}>{i.minStockLevel} units</td>
                                            <td style={{ padding: "16px 20px", fontSize: "13px" }}>{i.lastUpdated ? i.lastUpdated.substring(0, 10) : "N/A"}</td>
                                            <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                                <button onClick={() => edit(i)}
                                                    style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", borderRadius: "0px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", marginRight: "8px", fontWeight: "600", cursor: "pointer" }}>
                                                    Edit
                                                </button>
                                                <button onClick={() => remove(i.id)}
                                                    style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", borderRadius: "0px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", fontWeight: "600", cursor: "pointer" }}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default InventoryCRUD;