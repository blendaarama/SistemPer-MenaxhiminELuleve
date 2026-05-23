import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/deliveries";

const initialFormState = {
    id: null,
    orderId: "",
    status: "IN_TRANSIT",
    courierName: "",
    deliveryDate: ""
};

const DeliveriesCRUD = () => {
    const [deliveries, setDeliveries] = useState([]);
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDeliveries();
    }, []);

    const fetchDeliveries = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(API_URL);
            setDeliveries(response.data);
        } catch (err) {
            setError("Failed to load deliveries from logistics database registry.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const payload = {
            id: formData.id,
            orderId: parseInt(formData.orderId),
            status: formData.status,
            courierName: formData.courierName,
            deliveryDate: formData.deliveryDate
        };

        try {
            if (formData.id === null) {
                await axios.post(API_URL, payload);
            } else {
                await axios.put(`${API_URL}/${formData.id}`, payload);
            }
            resetForm();
            fetchDeliveries();
        } catch (err) {
            setError("Failed to process and commit delivery transaction settings.");
            console.error(err);
        }
    };

    const handleEdit = (delivery) => {
        setFormData({
            id: delivery.id,
            orderId: delivery.orderId || delivery.order?.id || "",
            status: delivery.status || "IN_TRANSIT",
            courierName: delivery.courierName || "",
            deliveryDate: delivery.deliveryDate ? delivery.deliveryDate.substring(0, 10) : ""
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this delivery record?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchDeliveries();
        } catch (err) {
            setError("Failed to execute database deletion on target delivery.");
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
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
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                            <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>
                                Dispatch & Fulfillment
                            </span>
                            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>
                                Deliveries Management
                            </h2>
                        </div>
                        <span style={{ background: "#2B1A4A", color: "#FFFFFF", padding: "6px 14px", fontSize: "12px", fontWeight: "600", letterSpacing: "1px" }}>
                            TOTAL MANIFESTS: {deliveries.length}
                        </span>
                    </div>
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
                        {formData.id ? "Modify Dispatch Record Properties" : "Schedule New Delivery Routing"}
                    </h4>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Associated Order ID</label>
                                <input type="number" name="orderId" placeholder="e.g. 8021" className="form-control" value={formData.orderId} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Courier / Carrier Name</label>
                                <input type="text" name="courierName" placeholder="e.g. FedEx / Express Courier" className="form-control" value={formData.courierName} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Transit Status</label>
                                <select name="status" className="form-control" value={formData.status} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }}>
                                    <option value="PENDING">PENDING</option>
                                    <option value="IN_TRANSIT">IN TRANSIT</option>
                                    <option value="DELIVERED">DELIVERED</option>
                                </select>
                            </div>

                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Expected / Fulfillment Date</label>
                                <input type="date" name="deliveryDate" className="form-control" value={formData.deliveryDate} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none", cursor: "pointer" }} />
                            </div>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <button type="submit" 
                                style={{ background: "#0E5A5B", color: "#FFFFFF", border: "none", padding: "12px 30px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer", marginRight: "12px", transition: "background 0.15s" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#2B1A4A"} onMouseLeave={(e) => e.currentTarget.style.background = "#0E5A5B"}>
                                {formData.id ? "Update Dispatch" : "Schedule Transit"}
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
                    <div style={{ textAlign: "center", padding: "40px", color: "rgba(31,31,31,0.5)", fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>Querying active dispatch pipelines...</div>
                ) : (
                    <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
                        <table className="table m-0" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Manifest ID</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Order Code</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Logistics Carrier</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Fulfillment Status</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Delivery Date</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", textAlign: "center" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {deliveries.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                                            No tracking manifests registered.
                                        </td>
                                    </tr>
                                ) : (
                                    deliveries.map((delivery) => {
                                        let statusColor = "#666666";
                                        let statusBg = "#FAF8F5";
                                        if (delivery.status === "DELIVERED") { statusColor = "#0E5A5B"; statusBg = "#E8F5F5"; }
                                        else if (delivery.status === "IN_TRANSIT") { statusColor = "#C4B9AF"; statusBg = "#FAF8F5"; }

                                        return (
                                            <tr key={delivery.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                                                <td style={{ padding: "16px 20px", fontWeight: "600", color: "#0E5A5B" }}>#{delivery.id}</td>
                                                <td style={{ padding: "16px 20px" }}>Order ID: {delivery.orderId || delivery.order?.id}</td>
                                                <td style={{ padding: "16px 20px", fontFamily: "Georgia, serif" }}>{delivery.courierName || "-"}</td>
                                                <td style={{ padding: "16px 20px" }}>
                                                    <span style={{ background: statusBg, color: statusColor, padding: "4px 10px", fontSize: "11px", fontWeight: "700", letterSpacing: "1px" }}>
                                                        {delivery.status}
                                                    </span>
                                                </td>
                                                <td style={{ padding: "16px 20px", fontSize: "13px" }}>{delivery.deliveryDate ? delivery.deliveryDate.substring(0, 10) : "-"}</td>
                                                <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                                    <button onClick={() => handleEdit(delivery)}
                                                        style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", borderRadius: "0px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", marginRight: "8px", fontWeight: "600", cursor: "pointer" }}>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(delivery.id)}
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
                )}

            </div>
        </div>
    );
};

export default DeliveriesCRUD;