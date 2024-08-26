import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import PasswordApiService from '../../services/PasswordApiService';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import './ResetPassword.css';

const ResetPassword = () => {
    const [message, setMessage] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordAgain, setNewPasswordAgain] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token'); // Extract token from query parameters

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [newPasswordVisible, setNewPasswordVisible] = useState(false);
    const [newPasswordAgainVisible, setNewPasswordAgainVisible] = useState(false);

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            console.log('token:', token); // Debugging line to check token value
            const response = await PasswordApiService.resetPassword(token, newPassword, newPasswordAgain);
            setTimeout(() => {
                setMessage('Password reset successful. Redirecting to login...');
                navigate('/login');
            }, 1000);
        } catch (error) {
            console.error('Reset Password error:', error.response ? error.response.data : error.message);
            const errorMessage = error.response.data;
            if(errorMessage === "Passwords aren't same!") {
                setMessage(errorMessage);
            }
            else {      
                setMessage('Reset Password failed');
            }
            const errors = error.response?.data?.validationErrors || {};
            setValidationErrors(errors);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'newPassword') {
            setNewPassword(value);
        } else {
            setNewPasswordAgain(value);
        }
    }

    return (
        <div className="reset-container">
            <form className="reset-form" onSubmit={handleResetPassword}>
                <h2>Password Renewal</h2>
                <div className="reset-password-container">
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        name="newPassword"
                        value={newPassword}
                        placeholder="Enter your new password"
                        onChange={handleInputChange}
                    />
                    <AiOutlineEye
                        onMouseDown={() => setPasswordVisible(true)}
                        onMouseUp={() => setPasswordVisible(false)}
                        onMouseLeave={() => setPasswordVisible(false)}
                    />
                </div>
                {validationErrors.newPassword && (
                        <div className="reset-error-message">{validationErrors.newPassword}</div>
                    )}
                <div className="reset-password-container">
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        name="newPasswordAgain"
                        value={newPasswordAgain}
                        placeholder="Enter your new password again"
                        onChange={handleInputChange}
                    />
                    <AiOutlineEye
                        onMouseDown={() => setPasswordVisible(true)}
                        onMouseUp={() => setPasswordVisible(false)}
                        onMouseLeave={() => setPasswordVisible(false)}
                    />
                </div>
                {validationErrors.newPasswordAgain && (
                        <div className="reset-error-message">{validationErrors.newPasswordAgain}</div>
                    )}
                <button type="submit">Reset Password</button>
                {message && <p>{message}</p>}
            </form>
        </div>
    );
};

export default ResetPassword;