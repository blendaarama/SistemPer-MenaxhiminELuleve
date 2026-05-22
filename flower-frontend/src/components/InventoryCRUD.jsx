import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/inventory";

const initialState = {
    id: null,
    flowerId: "",
    currentStock: "",
    reservedStock: "",
    minStockLevel: "",
    lastUpdated: ""
};

const InventoryCRUD = () => {

    const [items, setItems] = useState([]);
    const [form, setForm] = useState(initialState);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const res = await axios.get(API_URL);
        setItems(res.data);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const save = async (e) => {
        e.preventDefault();

        if (form.id) {
            await axios.put(`${API_URL}/${form.id}`, form);
        } else {
            await axios.post(API_URL, form);
        }

        setForm(initialState);
        load();
    };

    const edit = (i) => setForm(i);

    const remove = async (id) => {
        const ok = window.confirm("Delete this inventory item?");
        if (!ok) return;

        await axios.delete(`${API_URL}/${id}`);
        load();
    };

    return (
        <div className="container mt-4">

            <h2>Inventory</h2>

            <form className="card p-3 mb-3" onSubmit={save}>

                <input name="flowerId" placeholder="Flower ID"
                    className="form-control mb-2"
                    value={form.flowerId}
                    onChange={handleChange}
                />

                <input name="currentStock" placeholder="Current Stock"
                    className="form-control mb-2"
                    value={form.currentStock}
                    onChange={handleChange}
                />

                <input name="reservedStock" placeholder="Reserved Stock"
                    className="form-control mb-2"
                    value={form.reservedStock}
                    onChange={handleChange}
                />

                <input name="minStockLevel" placeholder="Min Stock Level"
                    className="form-control mb-2"
                    value={form.minStockLevel}
                    onChange={handleChange}
                />

                <input type="date" name="lastUpdated"
                    className="form-control mb-2"
                    value={form.lastUpdated}
                    onChange={handleChange}
                />

                <button className="btn btn-primary">
                    {form.id ? "Update" : "Add"}
                </button>

            </form>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Flower</th>
                        <th>Stock</th>
                        <th>Reserved</th>
                        <th>Min</th>
                        <th>Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map(i => (
                        <tr key={i.id}>
                            <td>{i.id}</td>
                            <td>{i.flowerId}</td>
                            <td>{i.currentStock}</td>
                            <td>{i.reservedStock}</td>
                            <td>{i.minStockLevel}</td>
                            <td>{i.lastUpdated}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => edit(i)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => remove(i.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
};

export default InventoryCRUD;