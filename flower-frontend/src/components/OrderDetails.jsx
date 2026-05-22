import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/order-details";

const initialState = {
    id: null,
    orderId: "",
    itemType: "",
    itemId: "",
    quantity: ""
};

const OrderDetailsCRUD = () => {

    const [data, setData] = useState([]);
    const [form, setForm] = useState(initialState);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const res = await axios.get(API_URL);
        setData(res.data);
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

    return (
        <div className="container mt-4">

            <h2>Order Details</h2>

            <form onSubmit={save} className="card p-3 mb-3">

                <input name="orderId" placeholder="Order ID"
                    className="form-control mb-2"
                    value={form.orderId}
                    onChange={handleChange}
                />

                <input name="itemType" placeholder="Item Type (flower/bouquet)"
                    className="form-control mb-2"
                    value={form.itemType}
                    onChange={handleChange}
                />

                <input name="itemId" placeholder="Item ID"
                    className="form-control mb-2"
                    value={form.itemId}
                    onChange={handleChange}
                />

                <input name="quantity" placeholder="Quantity"
                    className="form-control mb-2"
                    value={form.quantity}
                    onChange={handleChange}
                />

                <button className="btn btn-primary">
                    {form.id ? "Update" : "Add"}
                </button>

            </form>

            <table className="table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Order</th>
                        <th>Type</th>
                        <th>Item</th>
                        <th>Qty</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map(x => (
                        <tr key={x.id}>
                            <td>{x.id}</td>
                            <td>{x.orderId}</td>
                            <td>{x.itemType}</td>
                            <td>{x.itemId}</td>
                            <td>{x.quantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default OrderDetailsCRUD;