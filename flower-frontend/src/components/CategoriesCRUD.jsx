import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/categories";

const initialState = {
    id: null,
    name: "",
    description: ""
};

const CategoriesCRUD = () => {
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
            console.error("Error fetching categories:", err);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const save = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await axios.put(`${API_URL}/${form.id}`, form);
            } else {
                await axios.post(API_URL, form);
            }
            setForm(initialState);
            load();
        } catch (err) {
            console.error("Error saving category:", err);
        }
    };

    const edit = (c) => setForm(c);

    const remove = async (id) => {
        const ok = window.confirm("Are you sure you want to delete this category?");
        if (!ok) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            load();
        } catch (err) {
            console.error("Error deleting category:", err);
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
                        Store Structure
                    </span>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>
                        Categories Directory
                    </h2>
                </div>

                {/* FORM CONTAINER */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px", marginBottom: "40px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", color: "#1F1F1F" }}>
                        {form.id ? "Modify Category Metadata" : "Create New Category Entry"}
                    </h4>
                    
                    <form onSubmit={save}>
                        <div className="mb-3">
                            <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>
                                Category Name
                            </label>
                            <input
                                name="name"
                                placeholder="Enter category name"
                                className="form-control"
                                value={form.name}
                                onChange={handleChange}
                                required
                                style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }}
                            />
                        </div>

                        <div className="mb-3">
                            <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>
                                Description / Scope
                            </label>
                            <textarea
                                name="description"
                                placeholder="Describe the purpose or items under this category"
                                className="form-control"
                                rows="3"
                                value={form.description}
                                onChange={handleChange}
                                required
                                style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }}
                            />
                        </div>

                        {/* BUTTONS SYSTEM */}
                        <div style={{ marginTop: "20px" }}>
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
                                {form.id ? "Update Category" : "Save Category"}
                            </button>

                            {form.id && (
                                <button 
                                    type="button" 
                                    onClick={() => setForm(initialState)}
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
                            )}
                        </div>
                    </form>
                </div>

                {/* TABLE CONTAINER */}
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
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "10%" }}>ID</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "25%" }}>Name</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "45%" }}>Description</th>
                                <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", textAlign: "center", width: "20%" }}>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td colSpan="4" style={{ padding: "30px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                                        No categories found in the system database.
                                    </td>
                                </tr>
                            ) : (
                                data.map(c => (
                                    <tr key={c.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                                        <td style={{ padding: "16px 20px", fontWeight: "600", color: "#0E5A5B" }}>#{c.id}</td>
                                        <td style={{ padding: "16px 20px", fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: "600" }}>{c.name}</td>
                                        <td style={{ padding: "16px 20px", color: "#555555", lineHeight: "1.5" }}>{c.description}</td>
                                        <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                            <button
                                                onClick={() => edit(c)}
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
                                                onClick={() => remove(c.id)}
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

export default CategoriesCRUD;