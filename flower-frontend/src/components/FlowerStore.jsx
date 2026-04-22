import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FlowerStore = () => {
    const [flowers, setFlowers] = useState([]);
    const [bouquets, setBouquets] = useState([]);
    const [occasions, setOccasions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [flowersRes, bouquetsRes, occasionsRes] = await Promise.all([
                    axios.get('http://localhost:8080/api/flowers'),
                    axios.get('http://localhost:8080/api/bouquets'),
                    axios.get('http://localhost:8080/api/occasions')
                ]);
                setFlowers(flowersRes.data);
                setBouquets(bouquetsRes.data);
                setOccasions(occasionsRes.data);
            } catch (err) {
                console.error("Gabim gjatë ngarkimit të dyqanit:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;

    return (
        <div className="container mt-5">
            {}
            <div className="text-center mb-5 animate__animated animate__fadeIn">
                <h1 style={{ fontFamily: 'serif', letterSpacing: '5px', fontWeight: 'bold' }}> <i>Eternal Rose</i></h1>
                <div className="d-flex justify-content-center gap-4 text-uppercase small mt-3 fw-semibold" style={{ letterSpacing: '1px' }}>
                    <span style={{cursor: 'pointer'}}>Shop</span>
                    <span style={{cursor: 'pointer'}}>Occasions</span>
                    <span style={{cursor: 'pointer'}}>Color</span>
                    <span style={{cursor: 'pointer'}}>Weddings</span>
                </div>
            </div>

            {}
            {occasions.length > 0 && (
                <div className="alert alert-danger text-center border-0 rounded-0 mb-5 shadow-sm">
                    <h5 className="mb-0 fw-bold">
                        🔥 {occasions[0].emertimi}: -{occasions[0].zbritjaPerqindje}% Zbritje në produkte të caktuara!
                    </h5>
                </div>
            )}

            {}
            <h3 className="mb-4" style={{ fontFamily: 'serif', fontStyle: 'italic' }}>Signature Bouquets</h3>
            <div className="row g-4 mb-5">
                {bouquets.filter(b => b.eshteAktiv).map(b => (
                    <div className="col-6 col-md-4 col-lg-3" key={`bouquet-${b.id}`}>
                        <div className="card border-0 text-center h-100 bg-transparent product-card">
                            <div className="position-relative bg-light rounded-2 overflow-hidden mb-2 shadow-sm" style={{ aspectRatio: '1/1' }}>
                                <img 
                                    src={b.foto || "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400"} 
                                    className="img-fluid h-100 w-100 transition-scale" 
                                    style={{ objectFit: 'cover' }} 
                                    alt={b.emertimi} 
                                />
                                <span className="position-absolute top-0 end-0 bg-dark text-white p-2 small text-uppercase" style={{fontSize: '0.6rem'}}>Best Seller</span>
                            </div>
                            <div className="card-body p-1">
                                <h6 className="text-uppercase mb-1 fw-bold" style={{ fontSize: '0.85rem' }}>{b.emertimi}</h6>
                                <p className="text-muted small">Nga <span className="fw-bold text-dark">{b.cmimi}€</span></p>
                                <button className="btn btn-outline-dark btn-sm rounded-0 w-100 py-1" style={{fontSize: '0.7rem'}}>SHTO NË SHPORTË</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {}
            <hr />
            <h3 className="mb-4 mt-5" style={{ fontFamily: 'serif', fontStyle: 'italic' }}>Fresh Stems</h3>
            <div className="row g-4">
                {flowers.map(f => (
                    <div className="col-6 col-md-3" key={`flower-${f.id}`}>
                        <div className="card border-0 text-center h-100 bg-transparent">
                            <div className="bg-light rounded-2 overflow-hidden mb-2 shadow-sm" style={{ aspectRatio: '1/1' }}>
                                <img 
                                    src={f.foto || "https://images.unsplash.com/photo-1561181286-d39736abc71e?q=80&w=400"} 
                                    className="img-fluid h-100 w-100" 
                                    style={{ objectFit: 'cover' }} 
                                    alt={f.emertimi} 
                                />
                            </div>
                            <div className="card-body p-1">
                                <h6 className="text-uppercase mb-1 fw-bold" style={{ fontSize: '0.8rem' }}>{f.emertimi}</h6>
                                <p className="text-muted small">
                                    {f.cmimi}€ <small className="text-muted">/ copë</small>
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {}
            <style>{`
                .transition-scale { transition: transform 0.5s ease; }
                .product-card:hover .transition-scale { transform: scale(1.1); }
                .product-card { cursor: pointer; }
            `}</style>
        </div>
    );
};

export default FlowerStore;