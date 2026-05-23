import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/reviews";

const initialState = {
    id: null,
    customerId: "",
    flowerId: "",
    rating: 5,
    comment: ""
};

const ReviewsCRUD = () => {
    const [reviews, setReviews] = useState([]);
    const [formData, setFormData] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(API_URL);
            setReviews(res.data);
        } catch (err) {
            setError("Failed to load reviews from the server registry.");
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

        // Përgatitja e payload-it me tipet e duhura të të dhënash
        const payload = {
            id: formData.id,
            customerId: parseInt(formData.customerId),
            flowerId: formData.flowerId ? parseInt(formData.flowerId) : null,
            rating: parseInt(formData.rating),
            comment: formData.comment
        };

        try {
            if (formData.id === null) {
                await axios.post(API_URL, payload);
            } else {
                await axios.put(`${API_URL}/${formData.id}`, payload);
            }
            setFormData(initialState);
            fetchReviews();
        } catch (err) {
            setError("Failed to commit review entry settings.");
            console.error(err);
        }
    };

    const handleEdit = (review) => {
        setFormData({
            id: review.id,
            customerId: review.customerId || "",
            flowerId: review.flowerId || "",
            rating: review.rating || 5,
            comment: review.comment || ""
        });
    };

    const handleDelete = async (id) => {
        const confirm = window.confirm("Are you sure you want to delete this customer review?");
        if (!confirm) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchReviews();
        } catch (err) {
            setError("Failed to execute deletion command on target review.");
            console.error(err);
        }
    };

    const resetForm = () => {
        setFormData(initialState);
    };

    // Funksion ndihmës për të gjeneruar yjet si string pa përdorur emoji fëmijërorë
    const renderStars = (rating) => {
        return "★".repeat(rating) + "☆".repeat(5 - rating);
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
                        Customer Feedback
                    </span>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>
                        Reviews & Ratings Directory
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
                        {formData.id ? "Modify Testimonial Record" : "Log New Client Review"}
                    </h4>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Customer ID</label>
                                <input type="number" name="customerId" placeholder="e.g. 204" className="form-control" value={formData.customerId} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Flower ID Reference</label>
                                <input type="number" name="flowerId" placeholder="Leave empty for generic store review" className="form-control" value={formData.flowerId} onChange={handleChange}
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>

                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Rating Grade</label>
                                <select name="rating" className="form-control" value={formData.rating} onChange={handleChange} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }}>
                                    <option value="5">5 Stars (Excellent)</option>
                                    <option value="4">4 Stars (Good)</option>
                                    <option value="3">3 Stars (Average)</option>
                                    <option value="2">2 Stars (Poor)</option>
                                    <option value="1">1 Star (Unsatisfactory)</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-3">
                            <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Customer Feedback Comment</label>
                            <textarea name="comment" placeholder="Write the complete review testimonial text here..." className="form-control" rows="3" value={formData.comment} onChange={handleChange} required
                                style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <button type="submit" 
                                style={{ background: "#0E5A5B", color: "#FFFFFF", border: "none", padding: "12px 30px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer", marginRight: "12px", transition: "background 0.15s" }}
                                onMouseEnter={(e) => e.currentTarget.style.background = "#2B1A4A"} onMouseLeave={(e) => e.currentTarget.style.background = "#0E5A5B"}>
                                {formData.id ? "Update Evaluation" : "Post Review"}
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
                    <div style={{ textAlign: "center", padding: "40px", color: "rgba(31,31,31,0.5)", fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>Loading reviews database...</div>
                ) : (
                    <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
                        <table className="table m-0" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "10%" }}>Record ID</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "15%" }}>Client Code</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "15%" }}>Target Item</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "15%" }}>Score</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "25%" }}>Testimonial</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", textAlign: "center", width: "20%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reviews.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>
                                            No published evaluation entries found.
                                        </td>
                                    </tr>
                                ) : (
                                    reviews.map((r) => (
                                        <tr key={r.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                                            <td style={{ padding: "16px 20px", fontWeight: "600", color: "#0E5A5B" }}>#{r.id}</td>
                                            <td style={{ padding: "16px 20px", fontWeight: "500" }}>Customer #{r.customerId}</td>
                                            <td style={{ padding: "16px 20px", fontStyle: r.flowerId ? "normal" : "italic", color: r.flowerId ? "#1F1F1F" : "#888888" }}>
                                                {r.flowerId ? `Flower #${r.flowerId}` : "Store-wide"}
                                            </td>
                                            <td style={{ padding: "16px 20px", color: "#0E5A5B", letterSpacing: "2px", fontWeight: "700", fontSize: "13px" }}>
                                                {renderStars(r.rating)}
                                            </td>
                                            <td style={{ padding: "16px 20px", color: "#555555", fontFamily: "Georgia, serif", fontSize: "14px", lineHeight: "1.5" }}>
                                                "{r.comment}"
                                            </td>
                                            <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                                <button onClick={() => handleEdit(r)}
                                                    style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", borderRadius: "0px", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", marginRight: "8px", fontWeight: "600", cursor: "pointer" }}>
                                                    Edit
                                                </button>
                                                <button onClick={() => handleDelete(r.id)}
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

export default ReviewsCRUD;