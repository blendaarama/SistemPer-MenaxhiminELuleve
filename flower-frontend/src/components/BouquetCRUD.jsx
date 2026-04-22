import React, { useState, useEffect } from 'react';
import axios from 'axios';

const BouquetCRUD = () => {
    const [bouquets, setBouquets] = useState([]);
    const [allFlowers, setAllFlowers] = useState([]);
    const [loading, setLoading] = useState(false);

    const [bouquetForm, setBouquetForm] = useState({
        id: null,
        emertimi: '',
        pershkrimi: '',
        cmimi: '',
        madhesia: '',
        foto: '',
        eshteAktiv: true,
        flowerIds: []
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [resBouquets, resFlowers] = await Promise.all([
                axios.get('http://localhost:8080/api/bouquets'),
                axios.get('http://localhost:8080/api/flowers')
            ]);
            setBouquets(resBouquets.data);
            setAllFlowers(resFlowers.data);
        } catch (err) {
            console.error("Gabim gjatë ngarkimit të të dhënave!", err);
        } finally {
            setLoading(false);
        }
    };

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setBouquetForm({
            ...bouquetForm,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleFlowerSelection = (flowerId) => {
        const alreadySelected = bouquetForm.flowerIds.includes(flowerId);
        if (alreadySelected) {
            setBouquetForm({
                ...bouquetForm,
                flowerIds: bouquetForm.flowerIds.filter(id => id !== flowerId)
            });
        } else {
            setBouquetForm({
                ...bouquetForm,
                flowerIds: [...bouquetForm.flowerIds, flowerId]
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...bouquetForm,
            cmimi: Number(bouquetForm.cmimi),
            flowerIds: bouquetForm.flowerIds
        };

        try {
            if (bouquetForm.id) {
                await axios.put(`http://localhost:8080/api/bouquets/${bouquetForm.id}`, payload);
                alert("Buqeta u përditësua bashkë me lulet!");
            } else {
                await axios.post('http://localhost:8080/api/bouquets', payload);
                alert("Buqeta e re u krijua me sukses!");
            }
            resetForm();
            loadData();
        } catch (err) {
            console.error(err);
            alert("Gabim gjatë ruajtjes! Sigurohuni që Backend-i është aktiv.");
        }
    };

    const handleEdit = (bouquet) => {
        setBouquetForm({
            ...bouquet,
            flowerIds: bouquet.flowerIds || [] 
        });
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id) => {
        if (window.confirm("A jeni i sigurt që dëshironi ta fshini këtë buqetë?")) {
            try {
                await axios.delete(`http://localhost:8080/api/bouquets/${id}`);
                loadData();
            } catch (err) {
                alert("Gabim gjatë fshirjes!");
            }
        }
    };

    const resetForm = () => {
        setBouquetForm({
            id: null, emertimi: '', pershkrimi: '', cmimi: '', 
            madhesia: '', foto: '', eshteAktiv: true, flowerIds: []
        });
    };

    return (
        <div className="container mt-5 pb-5">
            <div className="card shadow-sm p-4 mb-5 border-0 bg-light">
                <h2 className="text-center mb-4" style={{ fontFamily: 'serif', color: '#4a4a4a' }}>
                    {bouquetForm.id ? "Editim Buqete" : "Krijim i një Buqete të Re"}
                </h2>
                
                <form onSubmit={handleSubmit} className="row g-3">
                    <div className="col-md-6">
                        <label className="form-label fw-bold">Emri i Buqetës</label>
                        <input className="form-control shadow-sm" name="emertimi" value={bouquetForm.emertimi} onChange={handleInput} required />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Çmimi (€)</label>
                        <input className="form-control shadow-sm" type="number" step="0.01" name="cmimi" value={bouquetForm.cmimi} onChange={handleInput} required />
                    </div>
                    <div className="col-md-3">
                        <label className="form-label fw-bold">Madhësia</label>
                        <select className="form-select shadow-sm" name="madhesia" value={bouquetForm.madhesia} onChange={handleInput} required>
                            <option value="">Zgjidh...</option>
                            <option value="S">Small</option>
                            <option value="M">Medium</option>
                            <option value="L">Large</option>
                        </select>
                    </div>

                    <div className="col-md-12">
                        <label className="form-label fw-bold">Zgjidh Lulet që përmban kjo buqetë:</label>
                        <div className="d-flex flex-wrap gap-2 p-3 bg-white border rounded shadow-sm" style={{maxHeight: '150px', overflowY: 'auto'}}>
                            {allFlowers.map(flower => (
                                <button 
                                    key={flower.id}
                                    type="button"
                                    onClick={() => handleFlowerSelection(flower.id)}
                                    className={`btn btn-sm ${bouquetForm.flowerIds.includes(flower.id) ? 'btn-primary' : 'btn-outline-secondary'}`}
                                >
                                    {bouquetForm.flowerIds.includes(flower.id) ? '✓ ' : '+ '}
                                    {flower.emertimi}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="col-md-12">
                        <label className="form-label fw-bold">URL e Fotos</label>
                        <input className="form-control shadow-sm" name="foto" value={bouquetForm.foto} onChange={handleInput} />
                    </div>

                    <div className="col-md-12 d-grid gap-2 mt-4">
                        <button className={`btn ${bouquetForm.id ? 'btn-warning' : 'btn-success'} text-white fw-bold py-2`} type="submit">
                            {bouquetForm.id ? "PËRDITËSO BUQETËN" : "RUAJ BUQETËN"}
                        </button>
                        {bouquetForm.id && <button className="btn btn-link text-decoration-none text-muted" onClick={resetForm}>Anulo ndryshimet</button>}
                    </div>
                </form>
            </div>

            <div className="card shadow border-0">
                <div className="card-header bg-dark text-white p-3">
                    <h5 className="mb-0">Lista e Inventarit të Buqetave</h5>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Foto</th>
                                <th>Detajet e Buqetës</th>
                                <th>Përbërja (Lulja)</th>
                                <th>Çmimi</th>
                                <th className="text-center">Veprime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bouquets.map(b => (
                                <tr key={b.id}>
                                    <td><img src={b.foto || "https://via.placeholder.com/60"} className="rounded" style={{width: '60px', height: '60px', objectFit: 'cover'}} alt="" /></td>
                                    <td>
                                        <div className="fw-bold text-primary">{b.emertimi}</div>
                                        <small className="badge bg-light text-dark border">{b.madhesia}</small>
                                    </td>
                                    <td>
                                        <div className="small text-muted" style={{maxWidth: '250px'}}>
                                            {b.emratELuleve && b.emratELuleve.length > 0 
                                                ? b.emratELuleve.join(', ') 
                                                : <span className="text-danger italic">Asnjë lule e lidhur</span>}
                                        </div>
                                    </td>
                                    <td className="fw-bold">{b.cmimi}€</td>
                                    <td className="text-center">
                                        <button className="btn btn-outline-info btn-sm me-2" onClick={() => handleEdit(b)}>Edit</button>
                                        <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(b.id)}>Fshi</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BouquetCRUD;