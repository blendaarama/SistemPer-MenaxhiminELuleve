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
        } catch (error) {
            setError("Failed to load deliveries.");
            console.error(error);
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

        try {
            if (formData.id === null) {
                await axios.post(API_URL, formData);
            } else {
                await axios.put(`${API_URL}/${formData.id}`, formData);
            }

            resetForm();
            fetchDeliveries();

        } catch (error) {
            setError("Failed to save delivery.");
            console.error(error);
        }
    };

    const handleEdit = (delivery) => {
        setFormData({
            id: delivery.id,
            orderId: delivery.orderId || "",
            status: delivery.status || "IN_TRANSIT",
            courierName: delivery.courierName || "",
            deliveryDate: delivery.deliveryDate || ""
        });
    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm("Are you sure you want to delete this delivery?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchDeliveries();
        } catch (error) {
            setError("Failed to delete delivery.");
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case "DELIVERED":
                return <span className="badge bg-success">Delivered</span>;
            case "IN_TRANSIT":
                return <span className="badge bg-warning">In Transit</span>;
            case "PENDING":
                return <span className="badge bg-secondary">Pending</span>;
            default:
                return <span className="badge bg-dark">{status}</span>;
        }
    };

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Deliveries Management</h2>
                <span className="badge bg-primary">
                    Total: {deliveries.length}
                </span>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* FORM */}
            <div className="card p-3 mb-4">

                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                name="orderId"
                                placeholder="Order ID"
                                value={formData.orderId}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                name="courierName"
                                placeholder="Courier Name"
                                value={formData.courierName}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="form-control"
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="IN_TRANSIT">IN_TRANSIT</option>
                                <option value="DELIVERED">DELIVERED</option>
                            </select>
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="date"
                                name="deliveryDate"
                                value={formData.deliveryDate}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                    </div>

                    <button
                        type="submit"
                        className={`btn ${formData.id ? "btn-warning" : "btn-primary"} me-2`}
                    >
                        {formData.id ? "Update Delivery" : "Add Delivery"}
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
                <p>Loading deliveries...</p>
            ) : (
                <div className="card p-3">

                    <table className="table table-hover">

                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Order ID</th>
                                <th>Courier</th>
                                <th>Status</th>
                                <th>Delivery Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {deliveries.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center">
                                        No deliveries found
                                    </td>
                                </tr>
                            ) : (
                                deliveries.map((delivery) => (
                                    <tr key={delivery.id}>
                                        <td>{delivery.id}</td>
                                        <td>{delivery.orderId}</td>
                                        <td>{delivery.courierName || "-"}</td>
                                        <td>{getStatusBadge(delivery.status)}</td>
                                        <td>{delivery.deliveryDate || "-"}</td>

                                        <td>
                                            <button
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => handleEdit(delivery)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(delivery.id)}
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

export default DeliveriesCRUD;