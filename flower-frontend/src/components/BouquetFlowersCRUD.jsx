import React, { useEffect, useState } from "react";
import axios from "axios";

const BouquetFlowersCRUD = () => {
    const [items, setItems] = useState([]);
    const [bouquets, setBouquets] = useState([]);
    const [flowers, setFlowers] = useState([]);

    const [formData, setFormData] = useState({
        id: null,
        bouquetId: "",
        flowerId: "",
        quantity: 1
    });

    const API_URL = "http://localhost:8080/api/bouquet-flowers";
    const BOUQUET_API = "http://localhost:8080/api/bouquets";
    const FLOWER_API = "http://localhost:8080/api/flowers";

    useEffect(() => {
        fetchAll();
        fetchBouquets();
        fetchFlowers();
    }, []);

    const fetchAll = async () => {
        try {
            const res = await axios.get(API_URL);
            setItems(res.data);
        } catch (err) {
            console.error("Error loading bouquet-flowers data:", err);
        }
    };

    const fetchBouquets = async () => {
        try {
            const res = await axios.get(BOUQUET_API);
            setBouquets(res.data);
        } catch (err) {
            console.error("Error loading bouquets list:", err);
        }
    };

    const fetchFlowers = async () => {
        try {
            const res = await axios.get(FLOWER_API);
            setFlowers(res.data);
        } catch (err) {
            console.error("Error loading flowers list:", err);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Konstruktimi i payload-it që të përputhet me strukturën e Spring Boot (DTO ose Entity mapping)
        const payload = {
            bouquetId: parseInt(formData.bouquetId),
            flowerId: parseInt(formData.flowerId),
            quantity: parseInt(formData.quantity)
        };

        try {
            if (formData.id === null) {
                await axios.post(API_URL, payload);
            } else {
                await axios.put(`${API_URL}/${formData.id}`, payload);
            }
            resetForm();
            fetchAll();
        } catch (err) {
            console.error("Database persistence error:", err);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            bouquetId: item.bouquetId || item.bouquet?.id || "",
            flowerId: item.flowerId || item.flower?.id || "",
            quantity: item.quantity
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Confirm deletion of this data entity link?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchAll();
        } catch (err) {
            console.error("Database deletion error:", err);
        }
    };

    const resetForm = () => {
        setFormData({
            id: null,
            bouquetId: "",
            flowerId: "",
            quantity: 1
        });
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
                
                {/* HEADER CONTROL */}
                <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
                    <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>
                        Inventory & Management
                    </span>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>
                        Bouquet Flowers Construction
                    </h2>
                </div>

                {/* INTERACTIVE FORM DESK */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px", marginBottom: "40px", borderRadius: "0px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", color: "#1F1F1F" }}>
                        {formData.id === null ? "Link New Flower to Bouquet" : "Modify Link Settings"}
                    </h4>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            {/* BOUQUET INLINE CONTROLLER */}
                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>
                                    Target Bouquet
                                </label>
                                <select
                                    name="bouquetId"
                                    value={formData.bouquetId}
                                    onChange={handleChange}
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Select Bouquet</option>
                                    {bouquets.map(b => (
                                        <option key={b.id} value={b.id}>
                                            {b.emertimi || b.name} (ID: {b.id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* FLOWER INLINE CONTROLLER */}
                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>
                                    Component Flower
                                </label>
                                <select
                                    name="flowerId"
                                    value={formData.flowerId}
                                    onChange={handleChange}
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }}
                                    className="form-control"
                                    required
                                >
                                    <option value="">Select Flower</option>
                                    {flowers.map(f => (
                                        <option key={f.id} value={f.id}>
                                            {f.emertimi || f.name} (ID: {f.id})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* QUANTITY CONTROL */}
                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>
                                    Stem Quantity
                                </label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={formData.quantity}
                                    onChange={handleChange}
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }}
                                    className="form-control"
                                    min="1"
                                    required
                                />
                            </div>
                        </div>

                        {/* DATA SYSTEM TRIGGER SUBMITTERS */}
                        <div style={{ marginTop: "15px" }}>
                            <button 
                                type="submit" 
                                style={{
                                    background: "#0E5A5B",
                                    color: "#FFFFFF",
                                    border: "none",
                                    padding: "12px 30px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    letterSpacing: "2px",
                                    textTransform: "uppercase",
                                    borderRadius: "0px",
                                    cursor: "pointer",
                                    marginRight: "12px",
                                    transition: "background 0.15s"
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#2B1A4A"}
                                onMouseLeave={(e) => e.currentTarget.style.background = "#0E5A5B"}
                            >
                                {formData.id === null ? "Add Component" : "Update Component"}
                            </button>

                            <button 
                                type="button" 
                                onClick={resetForm}
                                style={{
                                    background: "transparent",
                                    color: "#1F1F1F",
                                    border: "1px solid #C4B9AF",
                                    padding: "11px 24px",
                                    fontSize: "12px",
                                    fontWeight: "600",
                                    letterSpacing: "2px",
                                    textTransform: "uppercase",
                                    borderRadius: "0px",
                                    cursor: "pointer",
                                    transition: "all 0.15s"
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = "#1F1F1F";
                                    e.currentTarget.style.background = "rgba(0,0,0,0.02)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = "#C4B9AF";
                                    e.currentTarget.style.background = "transparent";
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>

                {/* DATA TABLE MATRIX */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
                    <table 
                        className="table m-0" 
                        style={{ 
                            width: "100%", 
                            borderCollapse: "collapse", 
                            fontSize: "14px"
                        }}
                    >
                        <thead>
                            <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>ID</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Bouquet Name</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Flower Type</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase" }}>Quantity</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", textAlign: "center" }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={{ padding: "30px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                                        No linked data available in database.
                                    </td>
                                </tr>
                            ) : (
                                items.map(item => (
                                    <tr key={item.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                                        <td style={{ padding: "16px 20px", fontWeight: "600", color: "#0E5A5B" }}>#{item.id}</td>
                                        <td style={{ padding: "16px 20px", fontFamily: "Georgia, serif", fontSize: "15px" }}>
                                            {item.bouquetName || item.bouquet?.emertimi || item.bouquet?.name || "Unknown Bouquet"}
                                        </td>
                                        <td style={{ padding: "16px 20px", color: "#4A4A4A" }}>
                                            {item.flowerName || item.flower?.emertimi || item.flower?.name || "Unknown Flower"}
                                        </td>
                                        <td style={{ padding: "16px 20px", fontWeight: "700" }}>{item.quantity} Stems</td>

                                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                            <button
                                                className="btn btn-sm"
                                                onClick={() => handleEdit(item)}
                                                style={{
                                                    background: "transparent",
                                                    color: "#0E5A5B",
                                                    border: "1px solid #0E5A5B",
                                                    borderRadius: "0px",
                                                    fontSize: "11px",
                                                    letterSpacing: "1px",
                                                    textTransform: "uppercase",
                                                    padding: "6px 14px",
                                                    marginRight: "8px",
                                                    fontWeight: "600",
                                                    cursor: "pointer"
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-sm"
                                                onClick={() => handleDelete(item.id)}
                                                style={{
                                                    background: "transparent",
                                                    color: "#FF8E8E",
                                                    border: "1px solid #FF8E8E",
                                                    borderRadius: "0px",
                                                    fontSize: "11px",
                                                    letterSpacing: "1px",
                                                    textTransform: "uppercase",
                                                    padding: "6px 14px",
                                                    fontWeight: "600",
                                                    cursor: "pointer"
                                                }}
                                            >
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

export default BouquetFlowersCRUD;