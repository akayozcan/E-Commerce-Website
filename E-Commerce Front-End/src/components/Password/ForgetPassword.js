import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordApiService from '../../services/PasswordApiService';
import './ForgetPassword.css';
import { GrSystem } from 'react-icons/gr';

const ForgetPassword = () => {
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleForgetPassword = async (e) => {
        e.preventDefault();
        console.log('Forget Password button clicked'); // Log when the activate button is clicked
        console.log("email:",email);
        try {
            const response = await PasswordApiService.verifyEmail(email);

            setMessage('Reset email send successful. Redirecting to login...');
            setTimeout(() => {
                navigate('/login'); // Redirect to the login page after a short delay
            }, 1000);
        } catch (error) {
            console.error('Forget Password error:', error.response ? error.response.data : error.message);
            const errorMessage = error.response && error.response.data
                ? error.response.data.businessErrorDescription || error.response.data.error || 'Forget Password failed'
                : 'Forget Password failed';
            console.log(error.response.data);
            setMessage(error.response.data);
        }
    };


    return (
        <div className="forget-container">
            <form className="forget-form" onSubmit={handleForgetPassword}>
                <h2>Forget Password</h2>
                <input
                    type="text"
                    placeholder="Please enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Password Reset Link</button>
                <button type="submit" onClick={()=>navigate("/login")}>Return Login</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default ForgetPassword;
