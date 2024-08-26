import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/favorite';

const addProductToFavorite = (user_id,productId,headers) => {
  return axios.post(`${API_URL + '/add'}?userId=${user_id}&productId=${productId}`, {
    headers: headers
  });
};

const removeProductFromFavorite = (user_id,productId,headers) => {
  return axios.delete(`${API_URL + '/remove'}?userId=${user_id}&productId=${productId}`, {
    headers: headers
  });
};

const getFavoriteProducts = (user_id,headers) => {
  return axios.get(`${API_URL + '/get'}?userId=${user_id}`, {
    headers: headers
  });
};

const isFavoriteRequest = (user_id,productId,headers) => {
  return axios.get(`${API_URL + '/isFavorite'}?userId=${user_id}&productId=${productId}`, {
    headers: headers
  });
};




export default {
    addProductToFavorite,
    removeProductFromFavorite,
    getFavoriteProducts,
    isFavoriteRequest
};
