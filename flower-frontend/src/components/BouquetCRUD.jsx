import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:8080/api/bouquets";
const FLOWERS_API = "http://localhost:8080/api/flowers";

const initialState = {
    id: null,
    emertimi: "",
    pershkrimi: "",
    cmimi: "",
    madhesia: "",
    foto: "",
    eshteAktiv: true,
    flowerIds: []
};

const BouquetCRUD = () => {
    const [bouquets, setBouquets] = useState([]);
    const [flowers, setFlowers] = useState([]);
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const config = { headers: { "Authorization": `Bearer ${localStorage.getItem("accessToken")}` } };

    useEffect(() => {
        loadBouquets();
        loadFlowers();
    }, []);

    const loadBouquets = async () => {
        setLoading(true);
        try {
            const res = await axios.get(API_URL);
            setBouquets(res.data);
        } catch (err) { setError("Gabim gjatë ngarkimit."); }
        finally { setLoading(false); }
    };

    const loadFlowers = async () => {
        try { const res = await axios.get(FLOWERS_API); setFlowers(res.data); } 
        catch (err) { console.error(err); }
    };

    const handleInput = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        const payload = { ...form, cmimi: Number(form.cmimi) };

        try {
            if (form.id) await axios.put(`${API_URL}/${form.id}`, payload, config);
            else await axios.post(API_URL, payload, config);
            setForm(initialState);
            loadBouquets();
        } catch (err) { setError("Gabim gjatë ruajtjes. Verifiko lidhjen."); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Fshi buqetën?")) return;
        try { await axios.delete(`${API_URL}/${id}`, config); loadBouquets(); }
        catch (err) { setError("Gabim gjatë fshirjes."); }
    };

    return (
        <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, sans-serif", color: "#1F1F1F" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                
                <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
                    <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>Katalogu</span>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#2B1A4A", marginTop: "6px" }}>Menaxhimi i Buqetave</h2>
                </div>

                {error && <div className="alert py-2 mb-4" style={{ backgroundColor: '#FFEAEA', color: '#FF8E8E', border: '1px solid #FFD1D1' }}>{error}</div>}

                <div style={{ background: "#FFF", border: "1px solid #E6E0D8", padding: "30px", marginBottom: "40px" }}>
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(31,31,31,0.6)" }}>EMËRTIMI</label>
                                <input className="form-control" name="emertimi" value={form.emertimi} onChange={handleInput} required style={{ borderRadius: "0px", background: "#FAF8F5" }} />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(31,31,31,0.6)" }}>ÇMIMI (€)</label>
                                <input type="number" className="form-control" name="cmimi" value={form.cmimi} onChange={handleInput} required style={{ borderRadius: "0px", background: "#FAF8F5" }} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(31,31,31,0.6)" }}>PËRSHKRIMI</label>
                            <textarea className="form-control" name="pershkrimi" value={form.pershkrimi} onChange={handleInput} style={{ borderRadius: "0px", background: "#FAF8F5" }} />
                        </div>

                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(31,31,31,0.6)" }}>MADHËSIA</label>
                                <select className="form-control" name="madhesia" value={form.madhesia} onChange={handleInput} style={{ borderRadius: "0px", background: "#FAF8F5" }}>
                                    <option value="">Zgjidh...</option>
                                    <option value="E Vogel">E Vogël</option>
                                    <option value="Mesatare">Mesatare</option>
                                    <option value="E Madhe">E Madhe</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(31,31,31,0.6)" }}>STATUSI</label>
                                <select className="form-control" value={form.eshteAktiv} onChange={(e) => setForm({...form, eshteAktiv: e.target.value === "true"})} style={{ borderRadius: "0px", background: "#FAF8F5" }}>
                                    <option value="true">Aktiv</option>
                                    <option value="false">Jo aktiv</option>
                                </select>
                            </div>
                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(31,31,31,0.6)" }}>URL E FOTOS</label>
                                <input className="form-control" name="foto" value={form.foto} onChange={handleInput} placeholder="https://..." style={{ borderRadius: "0px", background: "#FAF8F5" }} />
                            </div>
                        </div>

                        {/* Modifikimi për selektimin e luleve */}
                        <div className="mb-4">
                            <label style={{ fontSize: "12px", fontWeight: "600", color: "rgba(31,31,31,0.6)" }}>LULET (Shtyp Ctrl/Cmd për të zgjedhur shumë)</label>
                            <select multiple className="form-control" size={5} value={form.flowerIds || []} onChange={(e) => setForm({...form, flowerIds: Array.from(e.target.selectedOptions).map(o => Number(o.value))})} style={{ borderRadius: "0px", background: "#FAF8F5" }}>
                                {flowers.map(f => <option key={f.id} value={f.id}>{f.emertimi}</option>)}
                            </select>
                        </div>

                        <button type="submit" style={{ background: "#0E5A5B", color: "#FFF", border: "none", padding: "12px 30px", marginTop: "10px" }}>
                            {form.id ? "Përditëso Buqetën" : "Ruaj Buqetën"}
                        </button>
                    </form>
                </div>

                <div style={{ background: "#FFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
                    <table className="table m-0">
                        <thead>
                            <tr style={{ background: "#2B1A4A", color: "#FFF" }}>
                                <th>Emërtimi</th><th>Përshkrimi</th><th>Çmimi</th><th>Madhësia</th><th>Statusi</th><th>Foto</th><th>Veprime</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bouquets.map(b => (
                                <tr key={b.id}>
                                    <td>{b.emertimi}</td>
                                    <td>{b.pershkrimi}</td>
                                    <td>{b.cmimi} €</td>
                                    <td>{b.madhesia}</td>
                                    <td>{b.eshteAktiv ? "Aktiv" : "Jo Aktiv"}</td>
                                    <td>{b.foto ? <img src={b.foto} alt="buqeta" style={{width: "50px"}}/> : "N/A"}</td>
                                    <td>
                                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => setForm(b)}>Edit</button>
                                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(b.id)}>Fshi</button>
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