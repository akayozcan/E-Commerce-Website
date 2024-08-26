import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthApiService from '../../services/AuthApiService';
import './Register.css'; // Ensure this path is correct

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';

const Register = () => {
    const [action, setAction] = useState('Sign Up');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await AuthApiService.register(
                firstname,
                lastname,
                email,
                password
            );
            navigate('/activate');
        } catch (error) {
            console.error('Register error:', error.response ? error.response.data : error.message);
            const errorMessage = error.response && error.response.data
                ? error.response.data.businessErrorDescription || error.response.data.error || 'Register failed'
                : 'Register failed';
            setMessage(errorMessage);

            const errors = error.response?.data?.validationErrors || {};
            setValidationErrors(errors);
        }
    };

    return (
        <div className="main-container-register"> 
            <div className="container-register">
                <div className="header-register">
                    <div className="text-register">Sign Up</div>
                    <div className="underline-register"></div>
                </div>
                <div className="inputs-register"> 
                    <div className="input-register"> 
                        <img src={user_icon} alt="User Icon" />
                        <input
                            type="text"
                            placeholder="First Name"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                            required
                        />
                    </div>
                    {validationErrors.firstname && (
                        <div className="error-message-register">{validationErrors.firstname}</div>
                    )}
                    
                    <div className="input-register">
                        <img src={user_icon} alt="User Icon" />
                        <input 
                            type="text" 
                            placeholder="Last Name"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                            required
                        />
                    </div>
                    {validationErrors.lastname && (
                        <div className="error-message-register">{validationErrors.lastname}</div>
                    )}
                    
                    <div className="input-register">
                        <img src={email_icon} alt="Email Icon" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {validationErrors.email && (
                        <div className="error-message-register">{validationErrors.email}</div>
                    )}
                    
                    <div className="input-register">
                        <img src={password_icon} alt="Password Icon" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {validationErrors.password && (
                        <div className="error-message-register">{validationErrors.password}</div>
                    )}
                </div>
                <div className="submit-container-register">
                    <div className={action === "Login" ? "submit-register gray-register" : "submit-register"} onClick={handleRegister}> Sign Up </div>
                    <div className={action === "Sign Up" ? "submit-register gray-register" : "submit-register"} onClick={() => navigate("/login")}> Login </div>
                    {message && <div className="message-container-singup"><p>{message}</p></div>}
                </div>
            </div>
        </div>
    );
};

export default Register;
