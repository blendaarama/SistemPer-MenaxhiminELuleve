import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SupplierCRUD = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [form, setForm] = useState({ 
        id: null, 
        emertimi: '',
        kontakti: '', 
        email: '', 
        telefoni: '',
        adresa: '' 
    });

    useEffect(() => { loadSuppliers(); }, []);

    const loadSuppliers = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/suppliers');
            setSuppliers(res.data);
        } catch (err) {
            console.error("Gabim gjatë ngarkimit:", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await axios.put(`http://localhost:8080/api/suppliers/${form.id}`, form);
                alert("Furnitori u përditësua!");
            } else {
                await axios.post('http://localhost:8080/api/suppliers', form);
                alert("Furnitori u shtua me sukses!");
            }
            setForm({ id: null, emertimi: '', kontakti: '', email: '', telefoni: '', adresa: '' });
            loadSuppliers();
        } catch (err) {
            console.error("Detajet e gabimit:", err.response?.data);
            alert("Gabim gjatë ruajtjes! Shiko console-n për detaje.");
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow-sm p-4 mb-4 border-0 bg-white">
                <h3 className="mb-4 text-dark" style={{fontFamily: 'serif'}}>Menaxhimi i Furnitorëve</h3>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Emërtimi i Biznesit</label>
                        <input className="form-control" placeholder="P.sh. Flower Power LLC" 
                               value={form.emertimi} 
                               onChange={e => setForm({...form, emertimi: e.target.value})} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Email</label>
                        <input className="form-control" type="email" placeholder="info@supplier.com"
                               value={form.email} 
                               onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Personi i Kontaktit</label>
                        <input className="form-control" placeholder="Emri Mbiemri"
                               value={form.kontakti} 
                               onChange={e => setForm({...form, kontakti: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Telefoni</label>
                        <input className="form-control" placeholder="+383..."
                               value={form.telefoni} 
                               onChange={e => setForm({...form, telefoni: e.target.value})} />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Adresa</label>
                        <input className="form-control" placeholder="Rruga, Qyteti"
                               value={form.adresa} 
                               onChange={e => setForm({...form, adresa: e.target.value})} />
                    </div>
                    <div className="col-12 mt-4">
                        <button className={`btn ${form.id ? 'btn-warning' : 'btn-dark'} w-100 fw-bold`}>
                            {form.id ? "PËRDITËSO FURNITORIN" : "SHTO FURNITORIN"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="table-responsive bg-white p-3 shadow-sm rounded">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Emërtimi</th>
                            <th>Email / Tel</th>
                            <th>Kontakti</th>
                            <th>Veprime</th>
                        </tr>
                    </thead>
                    <tbody>
                        {suppliers.map(s => (
                            <tr key={s.id}>
                                <td className="fw-bold">{s.emertimi}</td>
                                <td>
                                    <div className="small">{s.email}</div>
                                    <div className="small text-muted">{s.telefoni}</div>
                                </td>
                                <td>{s.kontakti}</td>
                                <td>
                                    <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setForm(s)}>Edit</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => {
                                        if(window.confirm("A jeni i sigurt?")) {
                                            axios.delete(`http://localhost:8080/api/suppliers/${s.id}`).then(() => loadSuppliers());
                                        }
                                    }}>Fshi</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SupplierCRUD;