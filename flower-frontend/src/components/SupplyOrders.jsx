import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/supply-orders";

const initialState = {
    id: null,
    supplierId: "",
    flowerId: "",
    quantity: "",
    status: "PENDING"
};

const SupplyOrdersCRUD = () => {

    const [data, setData] = useState([]);
    const [form, setForm] = useState(initialState);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const res = await axios.get(API_URL);
        setData(res.data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.id) {
            await axios.put(`${API_URL}/${form.id}`, form);
        } else {
            await axios.post(API_URL, form);
        }

        setForm(initialState);
        fetchData();
    };

    const handleEdit = (item) => setForm(item);

    const handleDelete = async (id) => {
        await axios.delete(`${API_URL}/${id}`);
        fetchData();
    };

    return (
        <div className="container mt-4">

            <h2>Supply Orders</h2>

            <form onSubmit={handleSubmit} className="card p-3 mb-3">

                <input
                    name="supplierId"
                    placeholder="Supplier ID"
                    className="form-control mb-2"
                    value={form.supplierId}
                    onChange={handleChange}
                />

                <input
                    name="flowerId"
                    placeholder="Flower ID"
                    className="form-control mb-2"
                    value={form.flowerId}
                    onChange={handleChange}
                />

                <input
                    name="quantity"
                    placeholder="Quantity"
                    className="form-control mb-2"
                    value={form.quantity}
                    onChange={handleChange}
                />

                <select
                    name="status"
                    className="form-control mb-2"
                    value={form.status}
                    onChange={handleChange}
                >
                    <option value="PENDING">PENDING</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                </select>

                <button className="btn btn-primary">
                    {form.id ? "Update" : "Add"}
                </button>

            </form>

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Supplier</th>
                        <th>Flower</th>
                        <th>Qty</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map((x) => (
                        <tr key={x.id}>
                            <td>{x.id}</td>
                            <td>{x.supplierId}</td>
                            <td>{x.flowerId}</td>
                            <td>{x.quantity}</td>
                            <td>{x.status}</td>
                            <td>
                                <button onClick={() => handleEdit(x)} className="btn btn-warning btn-sm me-2">Edit</button>
                                <button onClick={() => handleDelete(x.id)} className="btn btn-danger btn-sm">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
};

export default SupplyOrdersCRUD;