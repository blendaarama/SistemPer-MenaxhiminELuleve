import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerCRUD = () => {

    const [customers, setCustomers] = useState([]);

    const [formData, setFormData] = useState({
        id: null,
        emri: "",
        mbiemri: "",
        email: "",
        telefoni: "",
        adresa: "",
        aEshteVip: false
    });

    const API_URL = "http://localhost:8080/api/customers";

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await axios.get(API_URL);
            setCustomers(response.data);
        } catch (error) {
            console.error("Gabim gjate marrjes se klienteve:", error);
        }
    };

    const handleChange = (e) => {

        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            if (formData.id === null) {

                await axios.post(API_URL, formData);

            } else {

                await axios.put(`${API_URL}/${formData.id}`, formData);
            }

            resetForm();
            fetchCustomers();

        } catch (error) {
            console.error("Gabim gjate ruajtjes:", error);
        }
    };

    const handleEdit = (customer) => {
        setFormData(customer);
    };

    const handleDelete = async (id) => {

        try {

            await axios.delete(`${API_URL}/${id}`);
            fetchCustomers();

        } catch (error) {
            console.error("Gabim gjate fshirjes:", error);
        }
    };

    const resetForm = () => {

        setFormData({
            id: null,
            emri: "",
            mbiemri: "",
            email: "",
            telefoni: "",
            adresa: "",
            aEshteVip: false
        });
    };

    return (
        <div className="container mt-4">

            <h2 className="mb-4">Customer CRUD</h2>

            <form onSubmit={handleSubmit} className="mb-4">

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

                <button type="submit" className="btn btn-primary me-2">

                    {formData.id === null ? "Add Customer" : "Update Customer"}

                </button>

                <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={resetForm}
                >
                    Reset
                </button>

            </form>

            <table className="table table-bordered table-striped">

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

                    {customers.map((customer) => (

                        <tr key={customer.id}>

                            <td>{customer.id}</td>
                            <td>{customer.emri}</td>
                            <td>{customer.mbiemri}</td>
                            <td>{customer.email}</td>
                            <td>{customer.telefoni}</td>
                            <td>{customer.adresa}</td>

                            <td>
                                {customer.aEshteVip ? "Yes" : "No"}
                            </td>

                            <td>

                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => handleEdit(customer)}
                                >
                                    Edit
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(customer.id)}
                                >
                                    Delete
                                </button>

                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
};

export default CustomerCRUD;