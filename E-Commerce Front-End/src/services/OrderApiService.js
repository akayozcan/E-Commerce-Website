import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/order';

const getAllOrders = () => {
  return axios.get(API_URL + '/getAllOrders');
};

const getUserOrders = (user_id,headers ) => {
    return axios.get(API_URL + '/getUserOrders',   
    {
      params:{userId:user_id},
      headers: headers
    });
  };

const addOrder = (orderDto,headers ) => {
    return axios.post(API_URL + '/addOrder', orderDto, {
        headers: headers
    });
};

const addAddress = (address, headers) => {
    return axios.post(API_URL + '/saveAddress', address, {
        headers: headers
    });
};

const getAddress = (addressId, headers) => {
  return axios.get(API_URL + '/getAddress', {
      params: {
          shippingAddressId: addressId
      },
      headers: headers
  });
};


export default {
    getAllOrders,
    getUserOrders,
    addOrder,
    addAddress,
    getAddress
};
