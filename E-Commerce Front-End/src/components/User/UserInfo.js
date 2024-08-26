import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UserApiService from '../../services/UserApiService';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import './UserInfo.css';

const UserInfo = () => {
  const navigate = useNavigate();
  const [message1, setMessage1] = useState('');
  const [message2, setMessage2] = useState('');
  const [userInfo, setUserInfo] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    currentPassword: '',
    password: '',
    newPassword: '',
    newPasswordAgain: '',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [newPasswordAgainVisible, setNewPasswordAgainVisible] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found. Please log in.');
      navigate('/login');
      return;
    }

    fetch('http://localhost:8080/api/v1/user/getUser', {
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setUserInfo(prevState => ({
          ...prevState,
          firstname: data.firstname,
          lastname: data.lastname,
          email: data.email,
          password: data.password,
          phone: data.phone,
          dateOfBirth: data.dateOfBirth,
        }));
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
      });
  }, [navigate]);

  console.log('userInfo:', userInfo);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleUpdate = async (e) => {

    if(userInfo.firstname === '' || userInfo.lastname === '') {
      setMessage1('First name and last name cannot be empty');
      return;
    }

    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const response = await UserApiService.updateUserInfo(
        userInfo.firstname,
        userInfo.lastname,
        userInfo.phone,
        userInfo.password,
        userInfo.dateOfBirth,
        {
          'Authorization': `Bearer ${token}`
        }
      );
      console.log('Update successful:', response.data);
      alert('User information updated successfully!');
      navigate('/'); // Redirect to the activate page if needed
    } catch (error) {
      console.error('Update error:', error.response ? error.response.data : error.message);
      const errorMessage = error.response && error.response.data
        ? error.response.data.businessErrorDescription || error.response.data.error || 'Update failed'
        : 'Update failed';
      alert(errorMessage);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (userInfo.newPassword !== userInfo.newPasswordAgain) {
      setMessage2('New passwords do not match');
      return;
    }

    try {

      console.log("userInfo.newPassword", userInfo.newPassword);

      const token = localStorage.getItem('authToken');
      const response = await UserApiService.updateUserPassword(
        userInfo.currentPassword,
        userInfo.newPassword,
        {
          'Authorization': `Bearer ${token}`
        }
      );
      console.log('Password change successful:', response.data);
      alert('Password changed successfully!');
    } catch (error) {
    
      // Extract error message with detailed checks
      let errorMessage = 'Password change failed';
      if (error.response && error.response.data) {
        errorMessage = error.response.data.businessErrorDescription || error.response.data.error || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
    
      // Display the error message to the user
      // alert(error.response);
      setMessage2(error.response.data);
      console.log('Password change error:', error.response.data);
    }
  };

  return (
    <div className="user-info-container">
      <h2>User Information</h2>
      <div className="user-info-content">
        <div className="membership-info">
          <h3>Membership Info</h3>
          <div className="info-item">
            <label>First Name:</label>
            <input
              type="text"
              name="firstname"
              value={userInfo.firstname}
              placeholder={userInfo.firstname}
              onChange={handleInputChange}
            />
          </div>
          <div className="info-item">
            <label>Last Name:</label>
            <input
              type="text"
              name="lastname"
              value={userInfo.lastname}
              placeholder={userInfo.lastname}
              onChange={handleInputChange}
            />
          </div>
          <div className="info-item">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={userInfo.email}
              placeholder={userInfo.email}
              readOnly
            />
          </div>
          <div className="info-item">
            <label>Phone:</label>
            <input
              type="text"
              name="phone"
              value={userInfo.phone}
              placeholder={userInfo.phone}
              onChange={handleInputChange}
            />
          </div>
          <div className="info-item">
            <label>Date of Birth:</label>
            <input
              type="date"
              name="dateOfBirth"
              value={userInfo.dateOfBirth}
              placeholder={userInfo.dateOfBirth}
              onChange={handleInputChange}
            />
          </div>
          <button onClick={handleUpdate}>Update Info</button>
          {message1 && <div className="message-container"><p>{message1}</p></div>}

        </div>
        <div className="password-change">
          <h3>Change Password</h3>
          <div className="info-item">
            <label>Current Password:</label>
            <div className="password-container">
              <input
                type={passwordVisible ? 'text' : 'password'}
                name="currentPassword"
                value={userInfo.currentPassword}
                placeholder="Enter your current password"
                onChange={handleInputChange}
              />
              <AiOutlineEye
                onMouseDown={() => setPasswordVisible(true)}
                onMouseUp={() => setPasswordVisible(false)}
                onMouseLeave={() => setPasswordVisible(false)}
              />
            </div>
          </div>
          <div className="info-item">
            <label>New Password:</label>
            <div className="password-container">
              <input
                type={newPasswordVisible ? 'text' : 'password'}
                name="newPassword"
                value={userInfo.newPassword}
                placeholder="Enter your new password"
                onChange={handleInputChange}
              />
              <AiOutlineEye
                onMouseDown={() => setNewPasswordVisible(true)}
                onMouseUp={() => setNewPasswordVisible(false)}
                onMouseLeave={() => setNewPasswordVisible(false)}
              />
            </div>
          </div>
          <div className="info-item">
            <label>New Password (Again):</label>
            <div className="password-container">
              <input
                type={newPasswordAgainVisible ? 'text' : 'password'}
                name="newPasswordAgain"
                value={userInfo.newPasswordAgain}
                placeholder="Enter your new password again"
                onChange={handleInputChange}
              />
              <AiOutlineEye
                onMouseDown={() => setNewPasswordAgainVisible(true)}
                onMouseUp={() => setNewPasswordAgainVisible(false)}
                onMouseLeave={() => setNewPasswordAgainVisible(false)}
              />
            </div>
          </div>
          <button onClick={handleChangePassword}>Change Password</button>
          {message2 && <div className="message-container"><p>{message2}</p></div>}
        </div>
       
      </div>
      <button className="back-button" onClick={() => navigate('/')}>
        Back to Home
      </button>
    </div>
  );
};

export default UserInfo;
