import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderCRUD = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    // Statuset standarde të porosive për menaxhim
    const statusOptions = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

    const API_URL = "http://localhost:8080/api/orders";

    useEffect(() => {
        fetchOrders();
    }, []);

    // 1. Leximi i të gjitha porosive (Backend me kalim automatik në LocalStorage)
    const fetchOrders = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(API_URL);
            setOrders(res.data);
        } catch (err) {
            console.log("Spring Boot jo aktiv. Po ngarkohen porositë nga LocalStorage...");
            
            // Lexojmë të dhënat që ruajti shporta te localStorage
            const localOrders = JSON.parse(localStorage.getItem("orders")) || [];
            setOrders(localOrders);
            
            // Nëse nuk ka as në localStorage as në server, mund të shfaqim një njoftim informues shtesë
            if (localOrders.length === 0) {
                setError("Nuk u gjet asnjë porosi në server apo në memorien lokale.");
            }
        } finally {
            setLoading(false);
        }
    };

    // 2. Përditësimi i statusit të porosisë
    const handleStatusChange = async (orderId, newStatus) => {
        try {
            // Tentojmë përditësimin në backend
            await axios.put(`${API_URL}/${orderId}/status`, { status: newStatus });
            
            setOrders(orders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            ));
        } catch (err) {
            console.log("Përditësimi në backend dështoi, po ndryshohet në LocalStorage...");
            
            // Ndryshojmë gjendjen në memorien lokale
            const updatedOrders = orders.map(order => 
                order.id === orderId ? { ...order, status: newStatus } : order
            );
            setOrders(updatedOrders);
            localStorage.setItem("orders", JSON.stringify(updatedOrders));
        }
    };

    // 3. Anulimi ose fshirja e një porosie
    const handleDeleteOrder = async (id) => {
        if (!window.confirm("A jeni të sigurt që dëshironi të fshini këtë porosi përgjithmonë?")) return;
        try {
            // Tentojmë fshirjen në backend
            await axios.delete(`${API_URL}/${id}`);
            setOrders(orders.filter(order => order.id !== id));
        } catch (err) {
            console.log("Fshirja në backend dështoi, po fshihet nga LocalStorage...");
            
            // Fshijmë nga memoria lokale
            const filteredOrders = orders.filter(order => order.id !== id);
            setOrders(filteredOrders);
            localStorage.setItem("orders", JSON.stringify(filteredOrders));
        }
    };

    // Funksion ndihmës për ngjyrat e statuseve sipas stilit Old Money
    const getStatusStyle = (status) => {
        const cleanStatus = status ? status.toUpperCase() : "";
        if (cleanStatus.includes("DELIVERED")) return { background: "#E8F5E9", color: "#2E7D32" };
        if (cleanStatus.includes("PENDING") || cleanStatus.includes("PRITJE")) return { background: "#FFF3E0", color: "#EF6C00" };
        if (cleanStatus.includes("SHIPPED")) return { background: "#E1F5FE", color: "#0288D1" };
        if (cleanStatus.includes("CANCELLED")) return { background: "#FFEBEE", color: "#C62828" };
        return { background: "#F5F5F5", color: "#616161" };
    };

    return (
        <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1F1F1F" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                
                {/* HEADER */}
                <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
                    <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>
                        Sales & Fulfillment
                    </span>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>
                        Client Orders Registry
                    </h2>
                </div>

                {error && (
                    <div style={{ backgroundColor: '#FFEAEA', color: '#FF8E8E', border: '1px solid #FFD1D1', padding: "12px", fontSize: '13px', marginBottom: "20px" }}>
                        {error}
                    </div>
                )}

                {/* MAIN ORDERS TABLE */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "rgba(31,31,31,0.5)", textTransform: "uppercase", fontSize: "12px", letterSpacing: "1px" }}>
                        Duke sinkronizuar porositë e klientëve...
                    </div>
                ) : (
                    <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Order ID</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Klienti</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Adresa e Dërgesës</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Vlera Totale</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px" }}>Statusi</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", fontSize: "11px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center" }}>Veprimet</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                                            Nuk ka ende asnjë porosi të kryer nga përdoruesit.
                                        </td>
                                    </tr>
                                ) : (
                                    orders.map((order) => (
                                        <tr key={order.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                                            {/* ID */}
                                            <td style={{ padding: "16px 20px", fontWeight: "600", color: "#0E5A5B" }}>#{order.id}</td>
                                            
                                            {/* USER INFO */}
                                            <td style={{ padding: "16px 20px" }}>
                                                <div style={{ fontWeight: "600" }}>{order.customer || order.customerName || order.user?.emri || "Guest Buyer"}</div>
                                                <div style={{ fontSize: "12px", color: "rgba(31,31,31,0.5)" }}>{order.date || "Sot"}</div>
                                            </td>

                                            {/* DELIVERY ADDRESS */}
                                            <td style={{ padding: "16px 20px", fontFamily: "Georgia, serif", fontSize: "13.5px" }}>
                                                {order.deliveryAddress || "Adresë Dyqani"}
                                            </td>

                                            {/* TOTAL PRICE */}
                                            <td style={{ padding: "16px 20px", fontWeight: "700" }}>
                                                €{parseFloat(order.totalRevenue || order.totalPrice || order.price || 0).toFixed(2)}
                                            </td>

                                            {/* STATUS CONTROLLER */}
                                            <td style={{ padding: "16px 20px" }}>
                                                <select
                                                    value={order.status ? (order.status.includes("PRITJE") ? "PENDING" : order.status) : "PENDING"}
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    style={{
                                                        ...getStatusStyle(order.status),
                                                        border: "1px solid #C4B9AF",
                                                        padding: "6px 10px",
                                                        fontSize: "12px",
                                                        fontWeight: "600",
                                                        borderRadius: "0px",
                                                        cursor: "pointer"
                                                    }}
                                                >
                                                    {statusOptions.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </td>

                                            {/* ACTIONS */}
                                            <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                                <button
                                                    onClick={() => handleDeleteOrder(order.id)}
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
                                                    Fshij
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

export default OrderCRUD;