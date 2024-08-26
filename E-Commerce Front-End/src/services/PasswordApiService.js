import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/forgetPassword';

const verifyEmail = (email) => {
    return axios.post(`${API_URL}/verifyEmail?email=${encodeURIComponent(email)}`);
};

const resetPassword = (token, new_password, new_password_again) => {
    return axios.put(`${API_URL}/resetPassword`, {
        newPassword: new_password,
        newPasswordAgain: new_password_again
    }, {
        params: { token }
    });
};

export default {
    verifyEmail,
    resetPassword

};
