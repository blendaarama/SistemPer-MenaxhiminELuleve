import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/customers";

const initialFormState = {
    id: null,
    emri: "",
    mbiemri: "",
    email: "",
    telefoni: "",
    adresa: "",
    aEshteVip: false
};

const CustomerCRUD = () => {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState(initialFormState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(API_URL);
            setCustomers(response.data);
        } catch (err) {
            setError("Failed to load customer records from the registry.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (formData.id === null) {
                await axios.post(API_URL, formData);
            } else {
                await axios.put(`${API_URL}/${formData.id}`, formData);
            }
            setFormData(initialFormState);
            fetchCustomers();
        } catch (err) {
            setError("Failed to commit customer profile changes.");
            console.error(err);
        }
    };

    const handleEdit = (customer) => {
        setFormData({
            id: customer.id,
            emri: customer.emri || "",
            mbiemri: customer.mbiemri || "",
            email: customer.email || "",
            telefoni: customer.telefoni || "",
            adresa: customer.adresa || "",
            aEshteVip: customer.aEshteVip || false
        });
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to remove this customer account?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchCustomers();
        } catch (err) {
            setError("Failed to execute deletion command on target customer.");
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
    };

    const vipCount = customers.filter(c => c.aEshteVip).length;

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
                                CRM Accounts
                            </span>
                            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>
                                Customer Management
                            </h2>
                        </div>
                        <span style={{ background: "#0E5A5B", color: "#FFFFFF", padding: "6px 14px", fontSize: "12px", fontWeight: "600", letterSpacing: "1px" }}>
                            VIP PRIVILEGES SIGNED: {vipCount}
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
                        {formData.id ? "Modify Customer Account Data" : "Enroll New Customer Profile"}
                    </h4>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Emri (First Name)</label>
                                <input type="text" name="emri" placeholder="e.g. Elena" className="form-control" value={formData.emri} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Mbiemri (Last Name)</label>
                                <input type="text" name="mbiemri" placeholder="e.g. Krasniqi" className="form-control" value={formData.mbiemri} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Email Address</label>
                                <input type="email" name="email" placeholder="client@domain.com" className="form-control" value={formData.email} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Telefoni</label>
                                <input type="text" name="telefoni" placeholder="Contact number" className="form-control" value={formData.telefoni} onChange={handleChange}
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Adresa (Billing/Shipping Location)</label>
                            <input type="text" name="adresa" placeholder="Street name, Apartment, City" className="form-control" value={formData.adresa} onChange={handleChange}
                                style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                        </div>

                        <div className="mb-4 mt-3">
                            <div className="form-check" style={{ display: "flex", alignItems: "center" }}>
                                <input type="checkbox" name="aEshteVip" id="aEshteVipCheckbox" checked={formData.aEshteVip} onChange={handleChange} className="form-check-input"
                                    style={{ width: "18px", height: "18px", borderRadius: "0px", border: "1px solid #C4B9AF", backgroundColor: "#FAF8F5", cursor: "pointer", boxShadow: "none", marginTop: "0px" }} />
                                <label htmlFor="aEshteVipCheckbox" className="form-check-label" style={{ fontSize: "13px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginLeft: "10px", color: "#2B1A4A", cursor: "pointer", userSelect: "none" }}>
                                    Assign Premium VIP Tier Classification
                                </label>
                            </div>
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <button type="submit" disabled={loading}
                                style={{ background: "#0E5A5B", color: "#FFFFFF", border: "none", padding: "12px 30px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer", marginRight: "12px", transition: "background 0.15s" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#2B1A4A"} onMouseLeave={(e) => e.currentTarget.style.background = "#0E5A5B"}>
                                {formData.id ? "Update Account" : "Register Profile"}
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
                    <div style={{ textAlign: "center", padding: "40px", color: "rgba(31,31,31,0.5)", fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>Querying active user accounts...</div>
                ) : (
                    <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
                        <table className="table m-0" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "8%" }}>ID</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "22%" }}>Full Name</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "20%" }}>Email Address</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "15%" }}>Telefoni</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "15%" }}>Adresa</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "10%" }}>Tier</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", textAlign: "center", width: "10%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {customers.length === 0 ? (
                                    <tr>
                                        <td colSpan="8" style={{ padding: "30px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                                            No registered customers found in the core database.
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((customer) => (
                                        <tr key={customer.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                                            <td style={{ padding: "16px 20px", fontWeight: "600", color: "#0E5A5B" }}>#{customer.id}</td>
                                            <td style={{ padding: "16px 20px", fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: "600", color: "#2B1A4A" }}>
                                                {customer.emri} {customer.mbiemri}
                                            </td>
                                            <td style={{ padding: "16px 20px", fontWeight: "500" }}>{customer.email}</td>
                                            <td style={{ padding: "16px 20px", color: "#555555" }}>{customer.telefoni || "-"}</td>
                                            <td style={{ padding: "16px 20px", color: "#666666", fontSize: "13px" }}>{customer.adresa || "-"}</td>
                                            <td style={{ padding: "16px 20px" }}>
                                                {customer.aEshteVip ? (
                                                    <span style={{ background: "#E8F5F5", color: "#0E5A5B", padding: "4px 10px", fontSize: "10px", fontWeight: "700", letterSpacing: "1px" }}>
                                                        VIP
                                                    </span>
                                                ) : (
                                                    <span style={{ background: "#FAF8F5", color: "rgba(31,31,31,0.4)", padding: "4px 10px", fontSize: "10px", fontWeight: "600", letterSpacing: "1px", border: "1px solid #E6E0D8" }}>
                                                        REGULAR
                                                    </span>
                                                )}
                                            </td>
                                            <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                                <div style={{ display: "flex", justifyContent: "center" }}>
                                                    <button onClick={() => handleEdit(customer)}
                                                        style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", borderRadius: "0px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 12px", marginRight: "6px", fontWeight: "600", cursor: "pointer" }}>
                                                        Edit
                                                    </button>
                                                    <button onClick={() => handleDelete(customer.id)}
                                                        style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", borderRadius: "0px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 12px", fontWeight: "600", cursor: "pointer" }}>
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

export default CustomerCRUD;