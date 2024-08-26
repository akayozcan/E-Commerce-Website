import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/user';

const updateUserInfo = (firstname,lastname,phone,password,dateOfBirth,headers) => {
  return axios.put(API_URL + '/update', {
    firstname,
    lastname,
    phone,
    password,
    dateOfBirth
  },
  {
    headers: headers
  }
);
};


const updateUserPassword = (currentPassword, newPassword, headers) => {
  const url = `${API_URL}/updatePassword?currentPassword=${encodeURIComponent(currentPassword)}&newPassword=${encodeURIComponent(newPassword)}`;
  return axios.put(url, {}, {
    headers: headers
  });
};


export default {
  updateUserInfo,
  updateUserPassword
};
