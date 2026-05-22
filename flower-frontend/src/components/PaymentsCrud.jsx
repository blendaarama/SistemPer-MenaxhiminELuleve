import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/payments";

const initialState = {
    id: null,
    orderId: "",
    amount: "",
    method: "CASH",
    status: "PENDING",
    paymentDate: ""
};

const PaymentsCRUD = () => {

    const [payments, setPayments] = useState([]);
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setPayments(res.data);
        } catch (err) {
            setError("Failed to load payments");
        } finally {
            setLoading(false);
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
            setError("Failed to save payment");
        }
    };

    const edit = (p) => {
        setForm(p);
    };

    const remove = async (id) => {
        const ok = window.confirm("Delete this payment?");
        if (!ok) return;

        await axios.delete(`${API_URL}/${id}`);
        load();
    };

    return (
        <div className="container mt-4">

            <h2>Payments</h2>

            {error && <div className="alert alert-danger">{error}</div>}

            {/* FORM */}
            <form className="card p-3 mb-3" onSubmit={save}>

                <input
                    name="orderId"
                    placeholder="Order ID"
                    className="form-control mb-2"
                    value={form.orderId}
                    onChange={handleChange}
                />

                <input
                    name="amount"
                    placeholder="Amount"
                    type="number"
                    className="form-control mb-2"
                    value={form.amount}
                    onChange={handleChange}
                />

                <select
                    name="method"
                    className="form-control mb-2"
                    value={form.method}
                    onChange={handleChange}
                >
                    <option value="CASH">CASH</option>
                    <option value="CARD">CARD</option>
                </select>

                <select
                    name="status"
                    className="form-control mb-2"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option value="PENDING">PENDING</option>
                    <option value="PAID">PAID</option>
                    <option value="FAILED">FAILED</option>
                </select>

                <input
                    type="date"
                    name="paymentDate"
                    className="form-control mb-2"
                    value={form.paymentDate}
                    onChange={handleChange}
                />

                <button className="btn btn-primary">
                    {form.id ? "Update Payment" : "Add Payment"}
                </button>

            </form>

            {/* TABLE */}
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="card p-3">

                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Order</th>
                                <th>Amount</th>
                                <th>Method</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {payments.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center">
                                        No payments found
                                    </td>
                                </tr>
                            ) : (
                                payments.map((p) => (
                                    <tr key={p.id}>
                                        <td>{p.id}</td>
                                        <td>{p.orderId}</td>
                                        <td>{p.amount}</td>
                                        <td>{p.method}</td>
                                        <td>{p.status}</td>
                                        <td>{p.paymentDate || "-"}</td>
                                        <td>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => edit(p)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => remove(p.id)}
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

export default PaymentsCRUD;