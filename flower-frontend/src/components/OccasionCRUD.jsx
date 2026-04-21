import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OccasionCRUD = () => {
    const [occasions, setOccasions] = useState([]);
    const [form, setForm] = useState({
        id: null,
        emertimi: '',
        pershkrimi: '',
        dataNgjarjes: '',
        zbritjaPerqindje: ''
    });

    useEffect(() => {
        loadOccasions();
    }, []);

    const loadOccasions = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/occasions');
            setOccasions(res.data);
        } catch (err) {
            console.error("Gabim gjatë ngarkimit të eventeve!", err);
        }
    };

    const handleInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (form.id) {
                await axios.put(`http://localhost:8080/api/occasions/${form.id}`, form);
                alert("Eventi u përditësua!");
            } else {
                await axios.post('http://localhost:8080/api/occasions', form);
                alert("Eventi u shtua me sukses!");
            }
            resetForm();
            loadOccasions();
        } catch (err) {
            alert("Gabim gjatë ruajtjes!");
            console.error(err);
        }
    };

    const handleEdit = (occ) => {
        setForm(occ);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm("A jeni i sigurt që dëshironi ta fshini këtë event?")) {
            try {
                await axios.delete(`http://localhost:8080/api/occasions/${id}`);
                loadOccasions();
            } catch (err) {
                alert("Gabim gjatë fshirjes!");
            }
        }
    };

    const resetForm = () => {
        setForm({ id: null, emertimi: '', pershkrimi: '', dataNgjarjes: '', zbritjaPerqindje: '' });
    };

    return (
        <div className="container mt-5">
            {}
            <div className="card shadow p-4 mb-5 bg-white rounded border-0">
                <h2 className="text-center mb-4" style={{ fontFamily: 'serif' }}>~ Menaxhimi i Eventeve & Zbritjeve ~</h2>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Emri i Eventit</label>
                        <input className="form-control" name="emertimi" value={form.emertimi} onChange={handleInput} placeholder="p.sh. Shën Valentini" required />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Data e Ngjarjes</label>
                        <input type="date" className="form-control" name="dataNgjarjes" value={form.dataNgjarjes} onChange={handleInput} required />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Zbritja (%)</label>
                        <input type="number" className="form-control" name="zbritjaPerqindje" value={form.zbritjaPerqindje} onChange={handleInput} placeholder="p.sh. 20" />
                    </div>
                    <div className="col-md-12">
                        <label className="form-label fw-bold">Përshkrimi</label>
                        <textarea className="form-control" name="pershkrimi" rows="2" value={form.pershkrimi} onChange={handleInput} placeholder="Shkruani detajet e ofertës..."></textarea>
                    </div>
                    <div className="col-md-12 d-grid gap-2">
                        <button className={`btn ${form.id ? 'btn-warning' : 'btn-primary'} fw-bold text-white`} type="submit">
                            {form.id ? "PËRDITËSO EVENTIN" : "SHTO EVENTIN E RI"}
                        </button>
                        {form.id && <button className="btn btn-outline-secondary btn-sm" onClick={resetForm}>Anulo Editimin</button>}
                    </div>
                </form>
            </div>

            {}
            <div className="card shadow p-4 border-0">
                <h4 className="mb-3" style={{ fontFamily: 'serif' }}>Lista e Eventeve Aktive</h4>
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>Eventi</th>
                                <th>Data</th>
                                <th>Zbritja</th>
                                <th>Përshkrimi</th>
                                <th className="text-center">Veprime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {occasions.length > 0 ? occasions.map(o => (
                                <tr key={o.id}>
                                    <td className="fw-bold text-primary">{o.emertimi}</td>
                                    <td>{new Date(o.dataNgjarjes).toLocaleDateString('sq-AL')}</td>
                                    <td>
                                        <span className="badge bg-danger">-{o.zbritjaPerqindje}%</span>
                                    </td>
                                    <td className="small text-muted" style={{ maxWidth: '200px' }}>{o.pershkrimi}</td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(o)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(o.id)}>Fshi</button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="5" className="text-center text-muted">Nuk ka evente të regjistruara.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OccasionCRUD;