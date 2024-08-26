import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthApiService from '../../services/AuthApiService';
import './Login.css';

import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';


const Login = () => {
    const [action , setAction] = useState('Login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        //console.log('Login button clicked'); // Log when the login button is clicked
        if(!email || !password) {
            setMessage('Email and password are required');
            return;
        }

        try {
            // Send login request to backend
            const response = await AuthApiService.authenticate(email, password);
            console.log('Login successful:', response.data);
        
            // Check if the response is successful
            if (response.status === 200) {
                const data = response.data;
                //console.log('Token stored:', data.token);
                localStorage.setItem('authToken', data.token);
                localStorage.setItem('user_id', data.userId);
                localStorage.setItem('cart_id',data.cartId);
                //console.log('Token stored:', data.token);
                setMessage('Login successful');

                //console.log("= User Role =\n",data.userRole);

                if(data.userRole == 'ADMIN') {
                    navigate('/Admin');
                }
                else {
                    navigate('/');
                }
                
                message = '';
            } else {
                throw new Error('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            const errorMessage = error.response && error.response.data
                ? error.response.data.businessErrorDescription || error.response.data.error || 'Login failed'
                : 'Login failed';
            setMessage(errorMessage);
        }
    };

    return (
        <div className="main-container-login"> 
            <div className="container-login">
                <div className="header-login">
                    <div className="text-login"> Login </div>
                    <div className="underline-login"></div>
                </div>

                <div className = "inputs-login"> 
                    <div className="input-login">
                        <img src = {email_icon} alt = "" />
                        <input
                            type="text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                      
                    </div>
                    <div className="input-login">
                        <img src = {password_icon} alt = "" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                       
                    </div>
                </div>
                <div onClick={()=> navigate("/forget-password")} className="forgot-password-login"> Forgot Password? <span> Click Here!</span> </div>
                <div className="submit-container-login">
                    <div className={action === "Sign Up"?"submit-login gray-login":"submit-login" } onClick={handleLogin}> Login </div>
                    <div className={action === "Login"?"submit-login gray-login":"submit-login" } onClick={() => navigate("/register")}> Sign Up </div>
                    {message && <div className="message-container-login"><p>{message}</p></div>}
                </div>
            </div>
        </div>
    );
};

export default Login;















