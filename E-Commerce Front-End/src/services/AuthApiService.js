import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/auth';

const register = (firstname,lastname,email, password) => {
  return axios.post(API_URL + '/register', {
    firstname,
    lastname,
    email,
    password,
  });
};

const authenticate = (email, password) => {
  return axios.post(API_URL + '/authenticate', {
    email,
    password,
  });
};

const activate = (token) => {
  return axios.get(API_URL + '/activate-account', {
    params: {
      token: token,
    },
  });
};

const resendActivation = (email) => {
  const url = `${API_URL}/resend-activation-email?email=${encodeURIComponent(email)}`;
  return axios.post(url, {}, {});
};

const sendResetPasswordMail = (email) => {
  return axios.post(API_URL + '/forget-password', {
    params:{email:email}
  });
}

const logout = () => {
  return axios.post(API_URL + '/logout');
};
 

export default {
  register,
  authenticate,
  activate,
  resendActivation,
  sendResetPasswordMail,
  logout
};
