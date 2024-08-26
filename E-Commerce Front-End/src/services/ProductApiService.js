import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/product';

const addProduct = (formData, productDto,headers ) => {
  return axios.post(API_URL + '/add', formData,productDto, {
    headers: headers
  });
};

const updateProduct = (title,description,price,stock,sku,headers) => {
  return axios.put(API_URL + '/updateProduct', {
    title,
    description,
    price,
    stock,
    sku
  }, {
    headers: headers
  });
}


const updatePhoto = (formData,productId,headers) => {
  return axios.post(`${API_URL}/uploadPhoto`,formData, {
    headers: headers,
    params: {productId: productId}, 
  });
};

const getProducts = (headers) => {
  return axios.get(`${API_URL}`, {
    headers: headers
  });
};

const getProduct = (productId,headers) => {
  return axios.get(`${API_URL + '/getProduct'}?productId=${productId}`, {
    headers: headers
  });
};

const getProductsPage = (page,size,headers) => {
  return axios.get(`${API_URL + '/getPage'}?page=${page}&size=${size}`, {
    headers: headers
  });
};

const getProductsPageByCategoryId = (page, size,category_id, headers) => {
  return axios.get(`${API_URL}/getProductsByCategoryId?page=${page}&size=${size}&categoryId=${category_id}`, {
    headers: headers
  });
};

const deleteProduct = (productId, headers) => {
  return axios.delete(`${API_URL}`, {
    headers: headers,
    params: {productId: productId}
  });
}




export default {
    addProduct,
    updateProduct,
    updatePhoto,
    getProducts,
    getProduct,
    getProductsPage,
    getProductsPageByCategoryId,
    deleteProduct
};
