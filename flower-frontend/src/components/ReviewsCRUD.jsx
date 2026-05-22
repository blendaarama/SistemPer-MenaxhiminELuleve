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
            setError("Failed to load reviews.");
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

        try {
            if (formData.id === null) {
                await axios.post(API_URL, formData);
            } else {
                await axios.put(`${API_URL}/${formData.id}`, formData);
            }

            setFormData(initialState);
            fetchReviews();

        } catch (err) {
            setError("Failed to save review.");
        }
    };

    const handleEdit = (review) => {
        setFormData(review);
    };

    const handleDelete = async (id) => {

        const confirm = window.confirm("Delete this review?");
        if (!confirm) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchReviews();
        } catch (err) {
            setError("Failed to delete review.");
        }
    };

    const resetForm = () => {
        setFormData(initialState);
    };

    return (
        <div className="container mt-4">

            <h2 className="mb-3">Reviews Management</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* FORM */}
            <div className="card p-3 mb-4">

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <div className="col-md-4 mb-2">
                            <input
                                type="text"
                                name="customerId"
                                placeholder="Customer ID"
                                className="form-control"
                                value={formData.customerId}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4 mb-2">
                            <input
                                type="text"
                                name="flowerId"
                                placeholder="Flower ID (optional)"
                                className="form-control"
                                value={formData.flowerId}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4 mb-2">
                            <select
                                name="rating"
                                className="form-control"
                                value={formData.rating}
                                onChange={handleChange}
                            >
                                <option value="5">5 ⭐</option>
                                <option value="4">4 ⭐</option>
                                <option value="3">3 ⭐</option>
                                <option value="2">2 ⭐</option>
                                <option value="1">1 ⭐</option>
                            </select>
                        </div>

                        <div className="col-md-12 mb-2">
                            <textarea
                                name="comment"
                                placeholder="Comment"
                                className="form-control"
                                value={formData.comment}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    <button className="btn btn-primary me-2">
                        {formData.id ? "Update Review" : "Add Review"}
                    </button>

                    <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={resetForm}
                    >
                        Reset
                    </button>

                </form>

            </div>

            {/* TABLE */}
            {loading ? (
                <p>Loading reviews...</p>
            ) : (
                <div className="card p-3">

                    <table className="table table-hover">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Customer</th>
                                <th>Rating</th>
                                <th>Comment</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {reviews.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center">
                                        No reviews found
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((r) => (
                                    <tr key={r.id}>
                                        <td>{r.id}</td>
                                        <td>{r.customerId}</td>
                                        <td>{r.rating} ⭐</td>
                                        <td>{r.comment}</td>

                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => handleEdit(r)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(r.id)}
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
            )}

        </div>
    );
};

export default ReviewsCRUD;