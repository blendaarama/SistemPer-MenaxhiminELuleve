import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/flowers';

const initialState = {
    id: null, 
    emertimi: '', 
    lloji: '', 
    ngjyra: '', 
    cmimi: '', 
    sasiaStokut: '', 
    sezoni: '', 
    jetegjatesiaDitesh: '', 
    foto: ''
};

const FlowerCRUD = () => {
    const [flowers, setFlowers] = useState([]);
    const [form, setForm] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => { loadFlowers(); }, []);

    const loadFlowers = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await axios.get(API_URL);
            setFlowers(res.data);
        } catch (err) { 
            setError("Gabim gjatë ngarkimit të regjistrit të luleve.");
            console.error(err); 
        } finally {
            setLoading(false);
        }
    };

    const handleInput = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        const payload = {
            ...form,
            cmimi: form.cmimi ? Number(form.cmimi) : 0,
            sasiaStokut: form.sasiaStokut ? Number(form.sasiaStokut) : 0,
            jetegjatesiaDitesh: form.jetegjatesiaDitesh ? Number(form.jetegjatesiaDitesh) : 0
        };

        try {
            if (form.id) {
                await axios.put(`${API_URL}/${form.id}`, payload);
            } else {
                await axios.post(API_URL, payload);
            }
            setForm(initialState);
            loadFlowers();
        } catch (err) { 
            setError("Gabim gjatë ruajtjes së entitetit të lules. Verifiko lidhjen me Backend.");
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("A dëshironi ta fshini këtë lule nga databaza?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`);
            loadFlowers();
        } catch (err) {
            setError("Nuk mund të fshihet! Kjo lule mund të jetë e lidhur me një buqetë ose porosi aktuale.");
        }
    };

    return (
        <div style={{ background: "#FAF8F5", minHeight: "100vh", padding: "40px 6%", fontFamily: "system-ui, -apple-system, sans-serif", color: "#1F1F1F" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
                
                {/* HEADER */}
                <div style={{ borderBottom: "1px solid #E6E0D8", paddingBottom: "20px", marginBottom: "40px" }}>
                    <span style={{ fontSize: "11px", letterSpacing: "3px", color: "#0E5A5B", textTransform: "uppercase", fontWeight: "600" }}>Katalogu i Produkteve</span>
                    <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", fontWeight: "400", marginTop: "6px", color: "#2B1A4A" }}>Menaxhimi i Luleve</h2>
                </div>

                {/* ERROR ALERT */}
                {error && (
                    <div className="alert py-2 mb-4" style={{ backgroundColor: '#FFEAEA', color: '#FF8E8E', border: '1px solid #FFD1D1', fontSize: '13px', borderRadius: "0px" }}>
                        {error}
                    </div>
                )}

                {/* FORM CONTAINER */}
                <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", padding: "30px", marginBottom: "40px" }}>
                    <h4 style={{ fontSize: "16px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "20px", color: "#1F1F1F" }}>
                        {form.id ? "Përditëso Atributet e Lules" : "Regjistro Lule të Re në Katalog"}
                    </h4>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="row">
                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Emërtimi</label>
                                <input className="form-control" name="emertimi" value={form.emertimi} onChange={handleInput} required placeholder="p.sh. Trëndafil"
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Lloji</label>
                                <input className="form-control" name="lloji" value={form.lloji} onChange={handleInput} placeholder="p.sh. Dekorativ"
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                            <div className="col-md-4 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Sezoni</label>
                                <select className="form-control" name="sezoni" value={form.sezoni} onChange={handleInput}
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }}>
                                    <option value="">Zgjidh sezonin...</option>
                                    <option value="Pranverë">Pranverë</option>
                                    <option value="Verë">Verë</option>
                                    <option value="Vjeshtë">Vjeshtë</option>
                                    <option value="Dimër">Dimër</option>
                                    <option value="Gjithëvjetore">Gjithëvjetore</option>
                                </select>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-3 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Ngjyra</label>
                                <input className="form-control" name="ngjyra" value={form.ngjyra} onChange={handleInput} placeholder="e.g. E Kuqe"
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Çmimi (€)</label>
                                <input type="number" step="0.01" className="form-control" name="cmimi" value={form.cmimi} onChange={handleInput} required
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Stoku fillestar</label>
                                <input type="number" className="form-control" name="sasiaStokut" value={form.sasiaStokut} onChange={handleInput}
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                            <div className="col-md-3 mb-3">
                                <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>Jetëgjatësia (Ditë)</label>
                                <input type="number" className="form-control" name="jetegjatesiaDitesh" value={form.jetegjatesiaDitesh} onChange={handleInput}
                                    style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label style={{ fontSize: "12px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px", display: "block", color: "rgba(31,31,31,0.6)" }}>URL e Fotos</label>
                            <input className="form-control" name="foto" value={form.foto} onChange={handleInput} placeholder="https://linku-i-fotos.jpg"
                                style={{ borderRadius: "0px", border: "1px solid #C4B9AF", padding: "12px", fontSize: "14px", backgroundColor: "#FAF8F5", boxShadow: "none" }} />
                        </div>

                        <div style={{ marginTop: "20px" }}>
                            <button type="submit" style={{ background: "#0E5A5B", color: "#FFFFFF", border: "none", padding: "12px 30px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer", marginRight: "12px" }}>
                                {form.id ? "Përditëso produktin" : "Ruaj lulen"}
                            </button>
                            {form.id && (
                                <button type="button" onClick={() => setForm(initialState)} style={{ background: "transparent", color: "#1F1F1F", border: "1px solid #C4B9AF", padding: "11px 24px", fontSize: "12px", fontWeight: "600", letterSpacing: "2px", textTransform: "uppercase", borderRadius: "0px", cursor: "pointer" }}>Anulo</button>
                            )}
                        </div>
                    </form>
                </div>

                {/* DATA TABLE MATRIX */}
                {loading ? (
                    <div style={{ textAlign: "center", padding: "40px", color: "rgba(31,31,31,0.5)", fontSize: "14px", letterSpacing: "1px", textTransform: "uppercase" }}>Duke ngarkuar katalogun botanik...</div>
                ) : (
                    <div style={{ background: "#FFFFFF", border: "1px solid #E6E0D8", overflowX: "auto" }}>
                        <table className="table m-0" style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ background: "#2B1A4A", color: "#FFFFFF", textAlign: "left" }}>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "10%" }}>Koleksioni</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "30%" }}>Emërtimi Botanik</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "15%" }}>Sezoni</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "15%" }}>Stoku Aktual</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", width: "15%" }}>Çmimi</th>
                                    <th style={{ padding: "16px 20px", fontWeight: "500", letterSpacing: "1px", fontSize: "11px", textTransform: "uppercase", textAlign: "center", width: "15%" }}>Veprime</th>
                                </tr>
                            </thead>
                            <tbody>
                                {flowers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" style={{ padding: "30px", textAlign: "center", color: "rgba(31,31,31,0.5)", fontStyle: "italic" }}>Nuk ka lule të regjistruara në katalog.</td>
                                    </tr>
                                ) : (
                                    flowers.map(f => (
                                        <tr key={f.id} style={{ borderBottom: "1px solid #E6E0D8" }}>
                                            <td style={{ padding: "16px 20px" }}>
                                                <img src={f.foto || "https://via.placeholder.com/45"} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: "0px", border: "1px solid #E6E0D8" }} />
                                            </td>
                                            <td style={{ padding: "16px 20px" }}>
                                                <div style={{ fontFamily: "Georgia, serif", fontSize: "16px", fontWeight: "500", color: "#2B1A4A" }}>{f.emertimi}</div>
                                                <div style={{ fontSize: "11px", color: "#0E5A5B", fontWeight: "600", marginTop: "2px", textTransform: "uppercase" }}>{f.lloji || "Dekorativ"} • #{f.id}</div>
                                            </td>
                                            <td style={{ padding: "16px 20px" }}>
                                                <span style={{ background: "#FAF8F5", color: "#1F1F1F", border: "1px solid #C4B9AF", padding: "4px 10px", fontSize: "11px", fontWeight: "600", letterSpacing: "1px" }}>{f.sezoni || "Gjithëvjetore"}</span>
                                            </td>
                                            <td style={{ padding: "16px 20px", fontWeight: "600" }}>{f.sasiaStokut} koka</td>
                                            <td style={{ padding: "16px 20px", fontWeight: "700", color: "#0E5A5B" }}>{f.cmimi} €</td>
                                            <td style={{ padding: "16px 20px", textAlign: "center" }}>
                                                <button onClick={() => { setForm(f); window.scrollTo(0,0); }} style={{ background: "transparent", color: "#0E5A5B", border: "1px solid #0E5A5B", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", marginRight: "8px", fontWeight: "600", cursor: "pointer" }}>Edit</button>
                                                <button onClick={() => handleDelete(f.id)} style={{ background: "transparent", color: "#FF8E8E", border: "1px solid #FF8E8E", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", padding: "6px 14px", fontWeight: "600", cursor: "pointer" }}>Fshi</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FlowerCRUD;