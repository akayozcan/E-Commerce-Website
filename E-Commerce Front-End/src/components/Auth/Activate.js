import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/AuthApiService';
import './Activate.css';
import { GrSystem } from 'react-icons/gr';

const Activate = () => {
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleActivation = async (e) => {
        e.preventDefault();
        console.log('Activate button clicked'); // Log when the activate button is clicked

        try {
            console.log('Sending activation request to backend');
            const response = await ApiService.activate(token);
            console.log('Activation successful:', response.data);
            setMessage('Activation successful. Redirecting to login...');
            setTimeout(() => {
                navigate('/login'); // Redirect to the login page after a short delay
            }, 1000);
        } catch (error) {
            console.error('Activation error:', error.response ? error.response.data : error.message);
            const errorMessage = error.response && error.response.data
            ? error.response.data.businessErrorDescription || error.response.data.error || 'Activation failed'
            : 'Activation failed';
            setMessage(error.response.data.error);
        }
    };

    const handleResendActivation = async (e) => {
        e.preventDefault();
        console.log('Resend Activate button clicked'); // Log when the activate button is clicked

        const email = prompt('Please enter your email:');
        if (!email) {
            setMessage('Email is required to resend activation.');
            return;
        }

        console.log(' ------- Email:', email);

        try {
            console.log('Resend Sending activation request to backend');
            const response = await ApiService.resendActivation(email); // Pass email to the backend
            console.log('Activation successful:', response.data);
            setMessage('Activation email resent successfully.');
        } catch (error) {
            console.error('Activation error:', error.response ? error.response.data : error.message);
            const errorMessage = error.response && error.response.data
            ? error.response.data.businessErrorDescription || error.response.data.error || 'Resend activation failed'
            : 'Resend activation failed';
            setMessage(errorMessage);
        }
    };

    return (
        <div className="activation-container">
            <form className="activation-form" onSubmit={handleActivation}>
                <h2>Account Activation</h2>
                <input
                    type="text"
                    placeholder="Activation Code"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                />
                <button type="submit">Activate</button>
                <button type="submit" onClick={handleResendActivation}>Resend Activation</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default Activate;
