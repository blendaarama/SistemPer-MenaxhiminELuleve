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
        <div 
            className="d-flex justify-content-center align-items-center min-vh-100" 
            style={{ 
                backgroundColor: '#FAF8F5',
                fontFamily: "system-ui, -apple-system, sans-serif",
                padding: '20px'
            }}
        >
            <div 
                className="bg-white p-4 p-md-5" 
                style={{ 
                    width: '100%', 
                    maxWidth: '440px', 
                    borderRadius: '0px', // Këndet e mprehta
                    border: '1px solid #E6E0D8',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                }}
            >
                
                {/* LOGO & LOGO ICON VIBE */}
                <div className="text-center mb-4">
                    <div style={{ fontSize: '28px', color: '#0E5A5B', marginBottom: '8px' }}>🌹</div>
                    <h2 
                        style={{ 
                            fontFamily: 'Georgia, serif', 
                            fontSize: '28px', 
                            fontWeight: '400', 
                            color: '#2B1A4A',
                            margin: 0 
                        }}
                    >
                        Welcome Back
                    </h2>
                    <p style={{ fontSize: '13px', color: 'rgba(31,31,31,0.6)', marginTop: '6px' }}>
                        Sign in to your Eternal Rose account
                    </p>
                </div>

                {/* ERROR PANEL */}
                {error && (
                    <div 
                        className="alert d-flex align-items-center small py-2.5 mb-4" 
                        style={{ 
                            borderRadius: '0px', 
                            backgroundColor: '#FFEAEA', 
                            color: '#FF8E8E',
                            border: '1px solid #FFD1D1'
                        }} 
                        role="alert"
                    >
                        <div style={{ fontWeight: '500' }}>{error}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* INPUT USERNAME */}
                    <div className="mb-3">
                        <label 
                            style={{ 
                                fontSize: '11px', 
                                fontWeight: '600', 
                                textTransform: 'uppercase', 
                                letterSpacing: '1px', 
                                marginBottom: '8px', 
                                display: 'block',
                                color: 'rgba(31,31,31,0.7)' 
                            }}
                        >
                            Email Address
                        </label>
                        <input 
                            type="text" 
                            className="form-control form-control-lg text-dark px-3 py-2.5" 
                            placeholder="name@example.com"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                            style={{ 
                                borderRadius: '0px', 
                                fontSize: '14px',
                                border: '1px solid #C4B9AF',
                                backgroundColor: '#FFFFFF',
                                boxShadow: 'none'
                            }}
                        />
                    </div>

                    {/* INPUT PASSWORD */}
                    <div className="mb-4">
                        <label 
                            style={{ 
                                fontSize: '11px', 
                                fontWeight: '600', 
                                textTransform: 'uppercase', 
                                letterSpacing: '1px', 
                                marginBottom: '8px', 
                                display: 'block',
                                color: 'rgba(31,31,31,0.7)' 
                            }}
                        >
                            Password
                        </label>
                        <input 
                            type="password" 
                            className="form-control form-control-lg text-dark px-3 py-2.5" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                            style={{ 
                                borderRadius: '0px', 
                                fontSize: '14px',
                                border: '1px solid #C4B9AF',
                                backgroundColor: '#FFFFFF',
                                boxShadow: 'none'
                            }}
                        />
                    </div>

                    {/* SUBMIT BUTTON */}
                    <button 
                        type="submit" 
                        className="btn btn-lg w-100 text-white mb-3" 
                        disabled={loading}
                        style={{ 
                            borderRadius: '0px', 
                            fontSize: '12px', 
                            fontWeight: '600',
                            letterSpacing: '2px',
                            textTransform: 'uppercase',
                            backgroundColor: '#2B1A4A',
                            border: 'none',
                            padding: '14px 0',
                            transition: 'background 0.2s ease',
                            cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#0E5A5B'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2B1A4A'}
                    >
                        {loading ? (
                            <div className="d-flex align-items-center justify-content-center">
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" style={{ width: '14px', height: '14px' }}></span>
                                <span>Verifying...</span>
                            </div>
                        ) : 'Sign In'}
                    </button>

                    {/* FOOTER LINK */}
                    <div className="text-center mt-3" style={{ fontSize: '13px' }}>
                        <span style={{ color: 'rgba(31,31,31,0.6)' }}>Don't have an account? </span>
                        <a 
                            href="#register" 
                            style={{ 
                                color: '#0E5A5B', 
                                fontWeight: '600', 
                                textDecoration: 'underline',
                                textUnderlineOffset: '3px' 
                            }}
                        >
                            Register
                        </a>
                    </div>
                </form>

                {/* BOTTOM FOOTER NOTICE */}
                <div className="text-center mt-5" style={{ borderTop: '1px solid #E6E0D8', paddingTop: '20px' }}>
                    <p style={{ fontSize: '11px', color: 'rgba(31,31,31,0.4)', margin: 0, letterSpacing: '0.5px' }}>
                        Eternal Rose Store Operations &copy; 2026
                    </p>
                </div>
                
            </div>
        </div>
    );
};

export default Login;