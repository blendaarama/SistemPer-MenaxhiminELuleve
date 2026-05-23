import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/order-details";

const initialState = {
    id: null,
    orderId: "",
    itemType: "",
    itemId: "",
    quantity: ""
};

const OrderDetailsCRUD = () => {
    const [data, setData] = useState([]);
    const [form, setForm] = useState(initialState);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        try {
            const res = await axios.get(API_URL);
            setData(res.data);
        } catch (err) {
            console.error("Error fetching order details:", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const save = async (e) => {
        e.preventDefault();

        // Konstruktimi i saktë i payload-it me parsers numerikë
        const payload = {
            id: form.id,
            orderId: parseInt(form.orderId),
            itemType: form.itemType,
            itemId: parseInt(form.itemId),
            quantity: parseInt(form.quantity)
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
            console.error("Error saving order detail item:", err);
        }
    };

    const edit = (x) => {
        setForm({
            id: x.id,
            orderId: x.orderId || x.order?.id || "",
            itemType: x.itemType || "",
            itemId: x.itemId || "",
            quantity: x.quantity || ""
        });
    };

    const remove = async (id) => {
        const ok = window.confirm("Are you sure you want to delete this order detail item?");
        if (!ok) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            load();
        } catch (err) {
            console.error("Error deleting order detail record:", err);
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
                        Transaction Management
                    </span>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>
                        Order Details Manifest
                    </h2>
                </div>

                {/* FORM CONTROLLER */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px", marginBottom: "40px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", color: "#1F1F1F" }}>
                        {form.id ? "Modify Line Item Properties" : "Attach Item to Existing Order"}
                    </h4>
                    
                    <form onSubmit={save}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Parent Order ID</label>
                                <input name="orderId" type="number" placeholder="e.g. 5001" className="form-control" value={form.orderId} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Item Classification</label>
                                <select name="itemType" className="form-control" value={form.itemType} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }}>
                                    <option value="">Select Item Type</option>
                                    <option value="flower">Flower</option>
                                    <option value="bouquet">Bouquet</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Target Item ID</label>
                                <input name="itemId" type="number" placeholder="Referenced flower or bouquet ID" className="form-control" value={form.itemId} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Purchase Quantity</label>
                                <input name="quantity" type="number" min="1" placeholder="Units to purchase" className="form-control" value={form.quantity} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <button type="submit" 
                                style={{ background: "#0E5A5B", color: "#FFFFFF", border: "none", padding: "12px 30px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer", marginRight: "12px", transition: "background 0.15s" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#2B1A4A"} onMouseLeave={(e) => e.currentTarget.style.background = "#0E5A5B"}>
                                {form.id ? "Update Line" : "Commit Item"}
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

                {/* GRID MATRIX DATA TABLE */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
                    <table className="table m-0" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                        <thead>
                            <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Manifest ID</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Order Code</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Classification</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Item ID Reference</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Qty Ordered</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                                        No registered line items documented in active orders.
                                    </td>
                                </tr>
                            ) : (
                                data.map(x => (
                                    <tr key={x.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                                        <td style={{ padding: "16px 20px", fontWeight: "600", color: "#0E5A5B" }}>#{x.id}</td>
                                        <td style={{ padding: "16px 20px", fontWeight: "500" }}>Order ID: {x.orderId || x.order?.id}</td>
                                        <td style={{ padding: "16px 20px", textTransform: "uppercase", fontSize: "11px", letterSpacing: "1px", fontWeight: "600", color: "#666666" }}>
                                            <span style={{ background: "#FAF8F5", padding: "4px 8px", border: "1px solid #E6E0D8" }}>{x.itemType}</span>
                                        </td>
                                        <td style={{ padding: "16px 20px", fontFamily: "Georgia, serif" }}>
                                            {x.itemName || `Entity Reference ID: #${x.itemId}`}
                                        </td>
                                        <td style={{ padding: "16px 20px", fontWeight: "700" }}>{x.quantity} Units</td>
                                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                            <button onClick={() => edit(x)}
                                                style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", borderRadius: "0px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", marginRight: "8px", fontWeight: "600", cursor: "pointer" }}>
                                                Edit
                                            </button>
                                            <button onClick={() => remove(x.id)}
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

            </div>
        </div>
    );
};

export default OrderDetailsCRUD;