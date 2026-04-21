import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FlowerCRUD = () => {
    const [flowers, setFlowers] = useState([]);
    const [form, setForm] = useState({
        id: null, emertimi: '', lloji: '', ngjyra: '', cmimi: '', 
        sasiaStokut: '', sezoni: '', jetegjatesiaDitesh: '', foto: ''
    });

    useEffect(() => { loadFlowers(); }, []);

    const loadFlowers = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/flowers');
            setFlowers(res.data);
        } catch (err) { console.error("Gabim gjatë ngarkimit!", err); }
    };

    const handleInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await axios.put(`http://localhost:8080/api/flowers/${form.id}`, form);
                alert("Lulja u përditësua!");
            } else {
                await axios.post('http://localhost:8080/api/flowers', form);
                alert("Lulja u shtua me sukses!");
            }
            setForm({ id: null, emertimi: '', lloji: '', ngjyra: '', cmimi: '', sasiaStokut: '', sezoni: '', jetegjatesiaDitesh: '', foto: '' });
            loadFlowers();
        } catch (err) { alert("Gabim gjatë ruajtjes!"); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("A dëshironi ta fshini këtë lule?")) {
            await axios.delete(`http://localhost:8080/api/flowers/${id}`);
            loadFlowers();
        }
    };

    return (
        <div className="container mt-4">
            <div className="card shadow p-4 mb-5 border-0">
                <h3 className="mb-4 text-center" style={{fontFamily: 'serif'}}>🌷 Regjistrimi i Luleve</h3>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Emërtimi</label>
                        <input className="form-control" name="emertimi" value={form.emertimi} onChange={handleInput} required placeholder="p.sh. Trëndafil" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Lloji</label>
                        <input className="form-control" name="lloji" value={form.lloji} onChange={handleInput} placeholder="p.sh. Dekorativ" />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Sezoni</label>
                        <select className="form-select" name="sezoni" value={form.sezoni} onChange={handleInput}>
                            <option value="">Zgjidh sezonin...</option>
                            <option value="Pranverë">Pranverë</option>
                            <option value="Verë">Verë</option>
                            <option value="Vjeshtë">Vjeshtë</option>
                            <option value="Dimër">Dimër</option>
                            <option value="Gjithëvjetore">Gjithëvjetore</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Ngjyra</label>
                        <input className="form-control" name="ngjyra" value={form.ngjyra} onChange={handleInput} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Çmimi (€)</label>
                        <input type="number" step="0.01" className="form-control" name="cmimi" value={form.cmimi} onChange={handleInput} required />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Stoku</label>
                        <input type="number" className="form-control" name="sasiaStokut" value={form.sasiaStokut} onChange={handleInput} />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Jetëgjatësia (Ditë)</label>
                        <input type="number" className="form-control" name="jetegjatesiaDitesh" value={form.jetegjatesiaDitesh} onChange={handleInput} />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label fw-bold">URL e Fotos</label>
                        <input className="form-control" name="foto" value={form.foto} onChange={handleInput} placeholder="https://linku-i-fotos.jpg" />
                    </div>
                    <div className="col-md-12 d-grid">
                        <button className={`btn ${form.id ? 'btn-warning' : 'btn-success'} fw-bold text-white`}>
                            {form.id ? "PËRDITËSO" : "RUAJ LULEN"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="table-responsive bg-white p-3 shadow-sm rounded">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Foto</th>
                            <th>Emri</th>
                            <th>Sezoni</th>
                            <th>Stoku</th>
                            <th>Çmimi</th>
                            <th className="text-center">Veprime</th>
                        </tr>
                    </thead>
                    <tbody>
                        {flowers.map(f => (
                            <tr key={f.id}>
                                <td><img src={f.foto || "https://via.placeholder.com/40"} alt="" className="rounded shadow-sm" style={{width: '40px', height: '40px', objectFit: 'cover'}} /></td>
                                <td className="fw-bold">{f.emertimi} <br/><small className="text-muted">{f.lloji}</small></td>
                                <td><span className="badge bg-info text-dark">{f.sezoni}</span></td>
                                <td>{f.sasiaStokut} koka</td>
                                <td className="text-success fw-bold">{f.cmimi}€</td>
                                <td className="text-center">
                                    <button className="btn btn-sm btn-outline-warning me-2" onClick={() => { setForm(f); window.scrollTo(0,0); }}>Edit</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(f.id)}>Fshi</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default FlowerCRUD;