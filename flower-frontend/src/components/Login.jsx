import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ onLoginSuccess }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const cleanUsername = username.trim();
        const cleanPassword = password.trim();

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
        if (!emailRegex.test(cleanUsername)) {
            setError('Ju lutem shkruani një email të vlefshëm! (p.sh. emri@domain.com)');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(cleanPassword)) {
            setError('Fjalëkalimi duhet të ketë të paktën 8 karaktere, një shkronjë të madhe dhe një numër!');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/auth/login', {
                username: cleanUsername,
                password: cleanPassword
            });
        
            if (response.data && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.role); 
    
                onLoginSuccess();
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Email ose Password i gabuar!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="card border-0 shadow-lg p-4 p-md-5" style={{ width: '100%', maxWidth: '420px', borderRadius: '16px' }}>
                
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark m-0" style={{ letterSpacing: '-0.5px' }}>Kyçuni</h2>
                    <p className="text-muted small mt-2">Mirësevini përsëri në Eternal Rose</p>
                </div>

                {error && (
                    <div className="alert alert-danger d-flex align-items-center border-0 small py-2 mb-3" style={{ borderRadius: '8px' }} role="alert">
                        <div>{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label text-secondary small fw-semibold">Përdoruesi (Username)</label>
                        <input 
                            type="text" 
                            className="form-control form-control-lg bg-light border-0" 
                            placeholder="Shkruani username tuaj..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                            style={{ borderRadius: '8px', fontSize: '15px' }}
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label text-secondary small fw-semibold">Fjalëkalimi (Password)</label>
                        <input 
                            type="password" 
                            className="form-control form-control-lg bg-light border-0" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            style={{ borderRadius: '8px', fontSize: '15px' }}
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-dark btn-lg w-100 fw-bold border-0 text-white shadow-sm mb-3" 
                        disabled={loading}
                        style={{ 
                            borderRadius: '8px', 
                            fontSize: '16px', 
                            backgroundColor: '#111',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        {loading ? (
                            <div className="d-flex align-items-center justify-content-center">
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                <span>Duke u procesuar...</span>
                            </div>
                        ) : 'Vazhdo'}
                    </button>

                    <div className="text-center">
                        <span className="text-muted small">Nuk keni llogari? </span>
                        <a href="#register" className="text-primary small fw-semibold text-decoration-none">Regjistrohu</a>
                    </div>
                </form>

                <div className="text-center mt-5">
                    <p className="text-muted m-0" style={{ fontSize: '12px' }}>
                        Menaxhimi i Dyqanit të Luleve &copy; 2026
                    </p>
                </div>
                
            </div>
        </div>
    );
};

export default Login;