import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderApiService from '../../services/OrderApiService';
import './ListOrders.css';
import Header from '../Home/Header';
import package_icon from '../Assets/package.png';
import ProductApiService from '../../services/ProductApiService';

const ListOrders = () => {
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({}); // State to hold product details for each order
  const [visibleOrders, setVisibleOrders] = useState([]); // State to track visible orders
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const user_id = localStorage.getItem('user_id');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await OrderApiService.getUserOrders(user_id,{
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('Orders:', response.data);
        setOrders(response.data);
  
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, [navigate]);

  const findProduct = async (product_id) => {
      console.log('Product ID:', product_id);
    try {
        const token = localStorage.getItem('authToken');
        const response = await ProductApiService.getProduct(product_id, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }
    catch(error){
        console.error('Error fetching product:', error);
    }   
  };

  const viewOrderDetails = async (orderItems) => {
    const orderId = orderItems[0].orderId;
    console.log('Order IDx:', orderId);
    console.log('Order Items:', orderItems);

    if (visibleOrders.includes(orderId)) {
      // If the order is already visible, hide it
      setVisibleOrders(visibleOrders.filter((id) => id !== orderId));
      return;
    }

    // Fetch product details if not already fetched
    if (!productsMap[orderId]) {
      const products = await Promise.all(orderItems.map((item) => findProduct(item.productId)));
      setProductsMap((prevProductsMap) => ({
        ...prevProductsMap,
        [orderId]: products,
      }));
    }

    // Show order details
    setVisibleOrders([...visibleOrders, orderId]);
  };

  const findQuantity = (order,productId) => {
    var quantity = 0;
    order.orderItems.map((orderItem) => (orderItem.productId === productId)? quantity = orderItem.quantity : quantity);
    console.log('Quantity:', quantity);
    return quantity;
  };


  return (
    <div className="main-orderlist-container2">
      <Header />
      <div className="list2">
        <p className="order-p2">My Orders</p>
        <div className="list-table2">
          <div className="list-table-format-orders title">
            <b></b>
            <b>Order Number</b>
            <b>Order Date</b>
            <b>Payment Method</b>
            <b>Order Summary</b>
            <b>Order Total</b>
            <b>Order Status</b>
            <b>Order Details</b>
          </div>
          {orders.map((item, index) => (
            <React.Fragment key={index}>
              <div key={index} className="list-table-format-orders">
                <img src={package_icon} alt="" />
                <p>{item.orderNumber}</p>
                <p>{new Date(item.orderDate).toLocaleDateString()}</p>
                <p>{item.paymentMethod}</p>
                <p>{item.orderItems.length} items</p>
                <p>${item.orderTotal}</p>
                <p>{String(item.status)}</p>
                <button onClick={() => viewOrderDetails(item.orderItems)} className="order-list-button">
                  {visibleOrders.includes(item.orderItems[0].orderId) ? "Hide" : "View"}
                </button>
              </div>
              {visibleOrders.includes(item.orderItems[0].orderId) && productsMap[item.orderItems[0].orderId] && (
                <div className="product-details-table">
                  <div className="product-details-header">
                    <b>Image</b>
                    <b>Product Title</b>
                    <b>Price</b>
                    <b>Order Quantity</b>
                  </div>
                  {productsMap[item.orderItems[0].orderId].map((product, productIndex) => (
                    <div key={productIndex} className="product-detail-row">
                      <img src={product.imageUrl} alt={product.title} />
                      <p>{product.title}</p>
                      <p>${product.price}</p>
                      <p>{findQuantity(item,product.id)}</p>
                  
                    </div>
                  ))}
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListOrders;
