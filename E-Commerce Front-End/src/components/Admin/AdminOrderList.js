import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderApiService from '../../services/OrderApiService';
import ProductApiService from '../../services/ProductApiService';
import './AdminOrderList.css';
import package_icon from '../Assets/package.png';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [productsMap, setProductsMap] = useState({}); // State to hold product details for each order
  const [visibleOrders, setVisibleOrders] = useState([]); // State to track visible orders
  const [addresses, setAddresses] = useState({}); // State to hold addresses for each order
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/login');
          return;
        }
        const response = await OrderApiService.getAllOrders();
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
    catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const viewOrderDetails = async (orderItems,shippingAddressId) => {
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

    // Fetch address if not already fetched
    if (!addresses[orderId]) {
      console.log('Fetching address id:', shippingAddressId);
      const address = await getAddress(shippingAddressId);
      setAddresses((prevAddresses) => ({
        ...prevAddresses,
        [orderId]: address,
      }));
    }

    // Show order details
    setVisibleOrders([...visibleOrders, orderId]);
  };

  const findQuantity = (order, productId) => {
    var quantity = 0;
    order.orderItems.map((orderItem) => (orderItem.productId === productId) ? quantity = orderItem.quantity : quantity);
    console.log('Quantity:', quantity);
    return quantity;
  };

  const getAddress = async (address_id) => {
    console.log('Address ID:', address_id);
    try {
      const token = localStorage.getItem('authToken');
      const response = await OrderApiService.getAddress(address_id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Address:', response.data);
      return response.data;
    }
    catch (error) {
      console.error('Error fetching address:', error);
    }
  };

  return (
    <div className="main-orderlist-container-admin">
      <div className="list-admin">
        <div className="list-table-admin">
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
                <button onClick={() => viewOrderDetails(item.orderItems,item.shippingAddressId)} className="order-list-button">
                  {visibleOrders.includes(item.orderItems[0].orderId) ? "Hide" : "View"}
                </button>
              </div>
              {visibleOrders.includes(item.orderItems[0].orderId) && productsMap[item.orderItems[0].orderId] && (
                <div className="details-container-left">
                  <div className="product-details-table-admin">
                    <div className="product-details-header-admin">
                      <b>Image</b>
                      <b>Product Title</b>
                      <b>Price</b>
                      <b>Order Quantity</b>
                    </div>
                    {productsMap[item.orderItems[0].orderId].map((product, productIndex) => (
                      <div key={productIndex} className="product-detail-row-admin">
                        <img src={product.imageUrl} alt={product.title} />
                        <p>{product.title}</p>
                        <p>${product.price}</p>
                        <p>{findQuantity(item, product.id)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="details-container-right">
                    <div className="product-details-table-admin-right">
                      <div className="product-details-header-admin-right">
                        <b>Address</b>
                      </div>
                      <p>{addresses[item.orderItems[0].orderId]?.street}</p>
                      <p>{addresses[item.orderItems[0].orderId]?.state+" / "+addresses[item.orderItems[0].orderId]?.city +"    " +addresses[item.orderItems[0].orderId]?.postalCode}</p>
                      <p>{"Phone: " + addresses[item.orderItems[0].orderId]?.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminOrderList;