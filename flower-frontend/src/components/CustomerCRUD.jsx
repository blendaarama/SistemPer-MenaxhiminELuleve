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
        } catch (error) {
            setError("Failed to load customers.");
            console.error(error);
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

        } catch (error) {
            setError("Failed to save customer.");
            console.error(error);
        }
    };

    const handleEdit = (customer) => {
        setFormData({
            id: customer.id,
            emri: customer.emri,
            mbiemri: customer.mbiemri,
            email: customer.email,
            telefoni: customer.telefoni,
            adresa: customer.adresa,
            aEshteVip: customer.aEshteVip
        });
    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm("Are you sure you want to delete this customer?");
        if (!confirmDelete) return;

        try {
            await axios.delete(`${API_URL}/${id}`);
            fetchCustomers();
        } catch (error) {
            setError("Failed to delete customer.");
            console.error(error);
        }
    };

    const resetForm = () => {
        setFormData(initialFormState);
    };

    const vipCount = customers.filter(c => c.aEshteVip).length;

    return (
        <div className="container mt-4">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>Customer Management</h2>
                <span className="badge bg-success">
                    VIP Customers: {vipCount}
                </span>
            </div>

            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            <div className="card p-3 mb-4">
                <form onSubmit={handleSubmit}>

                    <div className="row">

                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                name="emri"
                                placeholder="Emri"
                                value={formData.emri}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                name="mbiemri"
                                placeholder="Mbiemri"
                                value={formData.mbiemri}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                className="form-control"
                                required
                            />
                        </div>

                        <div className="col-md-6 mb-3">
                            <input
                                type="text"
                                name="telefoni"
                                placeholder="Telefoni"
                                value={formData.telefoni}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <input
                                type="text"
                                name="adresa"
                                placeholder="Adresa"
                                value={formData.adresa}
                                onChange={handleChange}
                                className="form-control"
                            />
                        </div>

                        <div className="col-md-12 mb-3">
                            <div className="form-check">
                                <input
                                    type="checkbox"
                                    name="aEshteVip"
                                    checked={formData.aEshteVip}
                                    onChange={handleChange}
                                    className="form-check-input"
                                />
                                <label className="form-check-label">
                                    VIP Customer
                                </label>
                            </div>
                        </div>

                    </div>

                    <button
                        type="submit"
                        className={`btn ${formData.id ? "btn-warning" : "btn-primary"} me-2`}
                        disabled={loading}
                    >
                        {formData.id ? "Update Customer" : "Add Customer"}
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

            {loading ? (
                <p>Loading customers...</p>
            ) : (
                <div className="card p-3">

                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Emri</th>
                                <th>Mbiemri</th>
                                <th>Email</th>
                                <th>Telefoni</th>
                                <th>Adresa</th>
                                <th>VIP</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {customers.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center">
                                        No customers found
                                    </td>
                                </tr>
                            ) : (
                                customers.map((customer) => (
                                    <tr key={customer.id}>
                                        <td>{customer.id}</td>
                                        <td>{customer.emri}</td>
                                        <td>{customer.mbiemri}</td>
                                        <td>{customer.email}</td>
                                        <td>{customer.telefoni}</td>
                                        <td>{customer.adresa}</td>
                                        <td>
                                            {customer.aEshteVip ? (
                                                <span className="badge bg-success">VIP</span>
                                            ) : (
                                                <span className="badge bg-secondary">No</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => handleEdit(customer)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(customer.id)}
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

export default CustomerCRUD;