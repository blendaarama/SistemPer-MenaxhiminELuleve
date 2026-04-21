import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BouquetCRUD = () => {
    const [bouquets, setBouquets] = useState([]);
    const [allFlowers, setAllFlowers] = useState([]); 
    const [selectedBouquet, setSelectedBouquet] = useState(null);
    const [selectedFlowerIds, setSelectedFlowerIds] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const [bouquetForm, setBouquetForm] = useState({
        id: null,
        emertimi: '',
        pershkrimi: '',
        cmimi: '',
        madhesia: '',
        foto: '',
        eshteAktiv: true
    });

    useEffect(() => {
        loadBouquets();
        loadAllFlowers();
    }, []);

    const loadBouquets = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/bouquets');
            setBouquets(res.data);
        } catch (err) { console.error("Nuk u ngarkuan buqetat!", err); }
    };

    const loadAllFlowers = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/flowers');
            setAllFlowers(res.data);
        } catch (err) { console.error("Nuk u ngarkuan lulet!", err); }
    };

    const handleInput = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setBouquetForm({ ...bouquetForm, [e.target.name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (bouquetForm.id) {
                await axios.put(`http://localhost:8080/api/bouquets/${bouquetForm.id}`, bouquetForm);
            } else {
                await axios.post('http://localhost:8080/api/bouquets', bouquetForm);
            }
            alert(bouquetForm.id ? "Buqeta u përditësua!" : "Buqeta u shtua!");
            resetForm();
            loadBouquets();
        } catch (err) { alert("Gabim gjatë ruajtjes!"); }
    };

    const openAddFlowersModal = async (bouquet) => {
        setSelectedBouquet(bouquet);
        try {
            const res = await axios.get(`http://localhost:8080/api/bouquet-flowers/bouquet/${bouquet.id}`);
         
            const existingIds = res.data.map(bf => bf.flowerId);
            setSelectedFlowerIds(existingIds);
            setShowModal(true);
        } catch (err) {
            console.error("Gabim gjatë marrjes së lidhjeve!", err);
            setSelectedFlowerIds([]);
            setShowModal(true);
        }
    };

    const toggleFlowerSelection = (flowerId) => {
        if (selectedFlowerIds.includes(flowerId)) {
            setSelectedFlowerIds(selectedFlowerIds.filter(id => id !== flowerId));
        } else {
            setSelectedFlowerIds([...selectedFlowerIds, flowerId]);
        }
    };

    const handleSaveFlowers = async () => {
        try {
            const currentLinks = await axios.get(`http://localhost:8080/api/bouquet-flowers/bouquet/${selectedBouquet.id}`);
            
            for (const link of currentLinks.data) {
                await axios.delete(`http://localhost:8080/api/bouquet-flowers/${link.id}`);
            }

            for (const fId of selectedFlowerIds) {
                await axios.post(`http://localhost:8080/api/bouquet-flowers`, {
                    bouquetId: selectedBouquet.id,
                    flowerId: fId
                });
            }

            alert("Lulet u lidhën me sukses!");
            setShowModal(false);
            loadBouquets();
        } catch (err) {
            alert("Gabim gjatë sinkronizimit të luleve!");
            console.error(err);
        }
    };

    const handleEdit = (bouquet) => {
        setBouquetForm(bouquet);
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm("A jeni i sigurt?")) {
            try {
                await axios.delete(`http://localhost:8080/api/bouquets/${id}`);
                loadBouquets();
            } catch (err) { alert("Gabim gjatë fshirjes!"); }
        }
    };

    const resetForm = () => {
        setBouquetForm({ id: null, emertimi: '', pershkrimi: '', cmimi: '', madhesia: '', foto: '', eshteAktiv: true });
    };

    return (
        <div className="container mt-5">
            <div className="card shadow p-4 mb-5 bg-white rounded border-0">
                <h2 className="text-center mb-4" style={{fontFamily: 'serif'}}>~ Menaxhimi i Buqetave ~</h2>
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Emri i Buqetës</label>
                        <input className="form-control" name="emertimi" value={bouquetForm.emertimi} onChange={handleInput} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Madhësia</label>
                        <select className="form-select" name="madhesia" value={bouquetForm.madhesia} onChange={handleInput}>
                            <option value="">Zgjidh madhësinë...</option>
                            <option value="S">Small (S)</option>
                            <option value="M">Medium (M)</option>
                            <option value="L">Large (L)</option>
                        </select>
                    </div>
                    <div className="col-md-12">
                        <label className="form-label fw-bold">Përshkrimi</label>
                        <textarea className="form-control" name="pershkrimi" rows="2" value={bouquetForm.pershkrimi} onChange={handleInput}></textarea>
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">Çmimi (€)</label>
                        <input className="form-control" type="number" step="0.01" name="cmimi" value={bouquetForm.cmimi} onChange={handleInput} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label fw-bold">URL e Fotos</label>
                        <input className="form-control" name="foto" value={bouquetForm.foto} onChange={handleInput} />
                    </div>
                    <div className="col-md-4 d-flex align-items-center mt-4">
                        <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" name="eshteAktiv" checked={bouquetForm.eshteAktiv} onChange={handleInput} id="switchAktiv" />
                            <label className="form-check-label fw-bold" htmlFor="switchAktiv">Aktiv</label>
                        </div>
                    </div>
                    <div className="col-md-12 d-grid">
                        <button className={`btn ${bouquetForm.id ? 'btn-warning' : 'btn-success'} fw-bold text-white`} type="submit">
                            {bouquetForm.id ? "PËRDITËSO" : "SHTO BUQETËN"}
                        </button>
                    </div>
                </form>
            </div>

            <div className="card shadow p-4 border-0">
                <h4 className="mb-3" style={{fontFamily: 'serif'}}>Lista e Buqetave</h4>
                <table className="table table-hover align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>Foto</th>
                            <th>Emri</th>
                            <th>Çmimi</th>
                            <th>Statusi</th>
                            <th className="text-center">Veprime</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bouquets.map(b => (
                            <tr key={b.id}>
                                <td><img src={b.foto || "https://via.placeholder.com/50"} className="rounded" style={{width: '50px', height: '50px', objectFit: 'cover'}} alt="" /></td>
                                <td className="fw-bold">{b.emertimi} <br/><small className="text-muted">{b.madhesia}</small></td>
                                <td>{b.cmimi}€</td>
                                <td><span className={`badge ${b.eshteAktiv ? 'bg-success' : 'bg-secondary'}`}>{b.eshteAktiv ? 'Aktiv' : 'Jo Aktiv'}</span></td>
                                <td className="text-center">
                                    <button className="btn btn-sm btn-info text-white me-2" onClick={() => openAddFlowersModal(b)}>+ Lule</button>
                                    <button className="btn btn-sm btn-outline-warning me-2" onClick={() => handleEdit(b)}>Edit</button>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b.id)}>Fshi</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal show d-block" style={{backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050}}>
                    <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-primary text-white">
                                <h5 className="modal-title">Lidhja e luleve me: {selectedBouquet?.emertimi}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body" style={{maxHeight: '400px', overflowY: 'auto'}}>
                                <div className="row g-3">
                                    {allFlowers.map(f => (
                                        <div className="col-md-4" key={f.id}>
                                            <div className={`card p-2 h-100 border-2 ${selectedFlowerIds.includes(f.id) ? 'border-primary bg-light' : 'border-light'}`} 
                                                 onClick={() => toggleFlowerSelection(f.id)} style={{cursor: 'pointer'}}>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="checkbox" checked={selectedFlowerIds.includes(f.id)} readOnly />
                                                    <label className="form-check-label fw-bold">{f.emertimi}</label>
                                                    <div className="small text-muted">{f.cmimi}€ - {f.lloji}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Mbyll</button>
                                <button className="btn btn-primary px-4" onClick={handleSaveFlowers}>Ruaj Lidhjet</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BouquetCRUD;