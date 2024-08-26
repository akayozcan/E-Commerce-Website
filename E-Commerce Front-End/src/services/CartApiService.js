import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/cart';

const addProductToCart = (user_id, cartId, productId, quantity, price, headers) => {
    return axios.post(
      `${API_URL}/add`, 
      {
        cartId,
        productId,
        quantity,
        price
      },
      {
        params: { userId: user_id },
        headers: headers
      }
    );
  };

const getCartItems = (user_id, headers) => {
    return axios.get(API_URL, {
        params: {
            userId: user_id
        },
        headers: headers
    });
};

const deleteItem = (user_id,productId, headers) => {
    return axios.delete(API_URL, {
        params: {
            userId:user_id,
            productId: productId
        },
        headers: headers
    });
};

const updateItem = (user_id,productId,quantity ,headers) => {
    return axios.put(API_URL +'/update', {
        params: {
            userId:user_id,
            productId: productId,
            quantity: quantity
        },
        headers: headers
    });
};


export default {
  addProductToCart,
  getCartItems,
  deleteItem,
  updateItem
};
