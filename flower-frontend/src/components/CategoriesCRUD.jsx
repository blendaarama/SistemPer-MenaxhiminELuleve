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

    const edit = (c) => setForm(c);

    const remove = async (id) => {
        const ok = window.confirm("Delete this category?");
        if (!ok) return;

        await axios.delete(`${API_URL}/${id}`);
        load();
    };

    return (
        <div className="container mt-4">

            <h2>Categories</h2>

            <form className="card p-3 mb-3" onSubmit={save}>

                <input
                    name="name"
                    placeholder="Category Name"
                    className="form-control mb-2"
                    value={form.name}
                    onChange={handleChange}
                />

                <textarea
                    name="description"
                    placeholder="Description"
                    className="form-control mb-2"
                    value={form.description}
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
                        <th>Name</th>
                        <th>Description</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {data.map(c => (
                        <tr key={c.id}>
                            <td>{c.id}</td>
                            <td>{c.name}</td>
                            <td>{c.description}</td>
                            <td>
                                <button className="btn btn-warning btn-sm me-2" onClick={() => edit(c)}>Edit</button>
                                <button className="btn btn-danger btn-sm" onClick={() => remove(c.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>

            </table>

        </div>
    );
};

export default CategoriesCRUD;