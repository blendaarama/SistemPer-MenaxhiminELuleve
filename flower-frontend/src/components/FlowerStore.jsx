import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FlowerStore = () => {
    const [flowers, setFlowers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/api/flowers')
            .then(res => setFlowers(res.data))
            .catch(err => console.error("Gabim te dyqani:", err));
    }, []);

    return (
        <div className="container mt-5">
            {/* Titulli i Dyqanit - Stili ODE */}
            <div className="text-center mb-5">
                <h1 style={{ fontFamily: 'serif', letterSpacing: '5px', fontWeight: 'bold' }}>ODE À LA ROSE</h1>
                <div className="d-flex justify-content-center gap-4 text-uppercase small mt-3 fw-semibold" style={{ letterSpacing: '1px' }}>
                    <span>Shop</span>
                    <span>Occasions</span>
                    <span>Color</span>
                    <span>Weddings</span>
                </div>
            </div>

            <h3 className="mb-4" style={{ fontFamily: 'serif', fontStyle: 'italic' }}>Most Popular</h3>

            {/* Grid-i i Luleve */}
            <div className="row g-4">
                {flowers.map(f => (
                    <div className="col-6 col-md-3" key={f.id}>
                        <div className="card border-0 text-center h-100 bg-transparent">
                            {/* Kutia e Fotos */}
                            <div className="bg-light rounded-2 overflow-hidden mb-2 shadow-sm" style={{ aspectRatio: '1/1' }}>
                                <img 
                                    src={f.foto || "https://images.unsplash.com/photo-1561181286-d39736abc71e?q=80&w=400&h=400&fit=crop"} 
                                    className="img-fluid h-100 w-100" 
                                    style={{ objectFit: 'cover' }} 
                                    alt={f.emertimi} 
                                />
                            </div>
                            {/* Detajet */}
                            <div className="card-body p-1">
                                <h6 className="text-uppercase mb-1 fw-bold" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                                    {f.emertimi}
                                </h6>
                                <p className="text-muted small">Nga <span className="fw-bold text-dark">{f.cmimi}€</span></p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FlowerStore;