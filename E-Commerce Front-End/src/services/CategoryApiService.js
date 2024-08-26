import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/category';

const getCategories = () => {
  return axios.get(API_URL);
};

const uploadPhoto = (formData,categoryId, headers) => {
  return axios.post(`${API_URL}/uploadPhoto`, formData, {
      headers: headers,
      params: { categoryId: categoryId },
  });
};

const getLogo = () => {
  return axios.get(API_URL + '/getLogo');
};

const getTemplate = (headers) => {
  return axios.get(API_URL + '/getTemplate',
  {
    headers: headers
  }
);
};

export default {
  getCategories,
  uploadPhoto,
  getLogo,
  getTemplate
};
