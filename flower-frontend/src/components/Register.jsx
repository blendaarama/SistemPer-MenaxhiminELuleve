import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = ({ onRegisterSuccess }) => {
    const navigate = useNavigate();
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        const cleanName = name.trim();
        const cleanEmail = email.trim();
        const cleanPassword = password.trim();
        const cleanConfirmPassword = confirmPassword.trim();

        if (cleanName.length < 2) {
            setError('Emri duhet te kete te pakten 2 karaktere!');
            return;
        }

        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
        if (!emailRegex.test(cleanEmail)) {
            setError('Ju lutem shkruani nje email te vlefshem! (p.sh. emri@domain.com)');
            return;
        }

        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passwordRegex.test(cleanPassword)) {
            setError('Fjalekalimi duhet te kete te pakten 8 karaktere, nje shkronje te madhe dhe nje numer!');
            return;
        }

        if (cleanPassword !== cleanConfirmPassword) {
            setError('Fjalekalimet nuk perputhen!');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/auth/register', {
                name: cleanName,
                email: cleanEmail,
                password: cleanPassword
            });
        
            if (response.status === 200 || response.data) {
                setSuccess('Regjistrimi u krye me sukses!');
                
                // Pastrimi i fushave te formularit
                setName('');
                setEmail('');
                setPassword('');
                setConfirmPassword('');

                if (onRegisterSuccess) {
                    onRegisterSuccess();
                }

                // Redirect automatik te faqja login pas 2 sekondave
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Regjistrimi deshtoi! Provoni perseri.');
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
                    borderRadius: '0px',
                    border: '1px solid #E6E0D8',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
                }}
            >
                
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
                        Create Account
                    </h2>
                    <p style={{ fontSize: '13px', color: 'rgba(31,31,31,0.6)', marginTop: '6px' }}>
                        Sign up for your Eternal Rose account
                    </p>
                </div>

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

                {success && (
                    <div 
                        className="alert d-flex align-items-center small py-2.5 mb-4" 
                        style={{ 
                            borderRadius: '0px', 
                            backgroundColor: '#E8F5E9', 
                            color: '#4CAF50',
                            border: '1px solid #C8E6C9'
                        }} 
                        role="alert"
                    >
                        <div style={{ fontWeight: '500' }}>{success}</div>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
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
                            Full Name
                        </label>
                        <input 
                            type="text" 
                            className="form-control form-control-lg text-dark px-3 py-2.5" 
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
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
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
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
                            Confirm Password
                        </label>
                        <input 
                            type="password" 
                            className="form-control form-control-lg text-dark px-3 py-2.5" 
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                                <span>Registering...</span>
                            </div>
                        ) : 'Register'}
                    </button>

                    <div className="text-center mt-3" style={{ fontSize: '13px' }}>
                        <span style={{ color: 'rgba(31,31,31,0.6)' }}>Already have an account? </span>
                        <Link 
                            to="/login" 
                            style={{ 
                                color: '#0E5A5B', 
                                fontWeight: '600', 
                                textDecoration: 'underline',
                                textUnderlineOffset: '3px' 
                            }}
                        >
                            Sign In
                        </Link>
                    </div>
                </form>

                <div className="text-center mt-5" style={{ borderTop: '1px solid #E6E0D8', paddingTop: '20px' }}>
                    <p style={{ fontSize: '11px', color: 'rgba(31,31,31,0.4)', margin: 0, letterSpacing: '0.5px' }}>
                        Eternal Rose Store Operations &copy; 2026
                    </p>
                </div>
                
            </div>
        </div>
    );
};

export default Register;