import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ onLoginSuccess }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                email: email,
                password: password
            });

            localStorage.setItem('accessToken', response.data.accessToken);
            localStorage.setItem('userEmail', email); 

            if (onLoginSuccess) onLoginSuccess(response.data);
            navigate('/dashboard');
            
        } catch (err) {
            
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else if (!err.response) {
                setError("Serveri nuk po përgjigjet. Kontrollo nëse backend-i është ndezur!");
            } else {
                setError("Kyqja dështoi! Provoni përsëri.");
            }
            console.error("Gabim në Login:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex justify-content-center align-items-center min-vh-100" style={{ backgroundColor: '#FAF8F5', padding: '20px' }}>
            <div className="bg-white p-4 p-md-5" style={{ width: '100%', maxWidth: '440px', border: '1px solid #E6E0D8', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
                
                <div className="text-center mb-4">
                    <div style={{ fontSize: '28px', marginBottom: '8px' }}>🌹</div>
                    <h2 style={{ fontFamily: 'Georgia, serif', color: '#2B1A4A', margin: 0 }}>Welcome Back</h2>
                    <p style={{ fontSize: '13px', color: 'rgba(31,31,31,0.6)', marginTop: '6px' }}>Sign in to your Eternal Rose account</p>
                </div>

                {error && (
                    <div className="alert py-2 mb-4" style={{ backgroundColor: '#FFEAEA', color: '#FF8E8E', border: '1px solid #FFD1D1', fontSize: '13px' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', display: 'block', color: 'rgba(31,31,31,0.7)' }}>Email Address</label>
                        <input type="email" className="form-control form-control-lg" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ borderRadius: '0px', fontSize: '14px', border: '1px solid #C4B9AF' }} />
                    </div>

                    <div className="mb-4">
                        <label style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', marginBottom: '8px', display: 'block', color: 'rgba(31,31,31,0.7)' }}>Password</label>
                        <input type="password" className="form-control form-control-lg" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ borderRadius: '0px', fontSize: '14px', border: '1px solid #C4B9AF' }} />
                    </div>

                    <button type="submit" className="btn btn-lg w-100 text-white" disabled={loading} style={{ backgroundColor: '#2B1A4A', borderRadius: '0px', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', padding: '14px 0' }}>
                        {loading ? 'Verifying...' : 'Sign In'}
                    </button>
                </form>

                <div className="text-center mt-3" style={{ fontSize: '13px' }}>
                    <span style={{ color: 'rgba(31,31,31,0.6)' }}>Don't have an account? </span>
                    <Link to="/register" style={{ color: '#0E5A5B', fontWeight: '600', textDecoration: 'underline' }}>Register</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;