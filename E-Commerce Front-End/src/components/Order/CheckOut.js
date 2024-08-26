import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderApiService from '../../services/OrderApiService';
import CartApiService from '../../services/CartApiService';
import './CheckOut.css';
import Header from '../Home/Header';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
    phone: '',
  });
  const [deliveryFee, setDeliveryFee] = useState(39.99);
  const [subTotalAmount, setSubTotalAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const user_id = parseInt(localStorage.getItem('user_id'), 10);
        if (!token) {
          alert('Please login to view cart items');
          return;
        }

        const response = await CartApiService.getCartItems(user_id, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setCartItems(response.data);
        const subTotal = response.data.reduce(
          (acc, item) => acc + item.price * item.quantity,
          0
        );
        setSubTotalAmount(subTotal);

        if (subTotal > 0) {
          setTotalAmount(subTotal + deliveryFee);
        } else {
          setTotalAmount(0);
        }
      } catch (error) {
        console.error('Error fetching cart items:', error);
      }
    };

    fetchCartItems();
  }, []);

  const validateFields = () => {
    const newErrors = {};

    if (!shippingAddress.street) newErrors.street = true;
    if (!shippingAddress.city) newErrors.city = true;
    if (!shippingAddress.state) newErrors.state = true;
    if (!shippingAddress.postalCode) newErrors.postalCode = true;
    if (!shippingAddress.country) newErrors.country = true;
    if (!shippingAddress.phone) newErrors.phone = true;
    if (!paymentMethod) newErrors.paymentMethod = true;

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!validateFields()) {
      alert('Please fill out all required fields.');
      return;
    }

    let shippingId;

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        alert('Please login to place order');
        return;
      }

      const responseShipping = await OrderApiService.addAddress(
        shippingAddress,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      shippingId = responseShipping.data.id;

      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Failed to add address');
      return;
    }

    const user_id = localStorage.getItem('user_id');
    console.log('User Id in CheckOut:', user_id);

    const orderItems = cartItems.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      price: item.price,
    }));

    const orderDto = {
      paymentMethod,
      orderDate: new Date(),
      orderTotal: totalAmount,
      shippingAddressId: shippingId,
      userId: user_id,
      orderItems,
    };

    try {
      const token = localStorage.getItem('authToken');
      const user_id = parseInt(localStorage.getItem('user_id'), 10);

      if (!token) {
        alert('Please login to place order');
        return;
      }

      await OrderApiService.addOrder(orderDto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      for (const item of cartItems) {
        await CartApiService.deleteItem(user_id, item.productId, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      alert('Order placed successfully');
      navigate('/');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order');
    }
  };

  return (
    <div className="checkout-container">
      <Header />
      <form className="place-order">
        <div className="place-order-left">
          <p className="title-place">Delivery Information</p>
          <div className="multi-fields">
            <input type="text" placeholder="First Name" className="same-size-input" />
            <input type="text" placeholder="Last Name" className="same-size-input" />
          </div>
          <input type="email" placeholder="Email Address" className="same-size-input" />
          <input
            type="text"
            placeholder="Street"
            value={shippingAddress.street}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, street: e.target.value })
            }
            className={errors.street ? 'error-input-c' : ''}
            required
          />
          <div className="multi-fields">
            <input
              type="text"
              placeholder="City"
              value={shippingAddress.city}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, city: e.target.value })
              }
              className={errors.city ? 'error-input-c' : ''}
              required
            />
            <input
              type="text"
              placeholder="State"
              value={shippingAddress.state}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, state: e.target.value })
              }
              className={errors.state ? 'error-input-c' : ''}
              required
            />
          </div>
          <div className="multi-fields">
            <input
              type="text"
              placeholder="Zip Code"
              value={shippingAddress.postalCode}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  postalCode: e.target.value,
                })
              }
              className={errors.postalCode ? 'error-input-c' : ''}
              required
            />
            <input
              type="text"
              placeholder="Country"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({
                  ...shippingAddress,
                  country: e.target.value,
                })
              }
              className={errors.country ? 'error-input-c' : ''}
              required
            />
          </div>
          <input
            type="text"
            placeholder="Phone Number"
            value={shippingAddress.phone}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, phone: e.target.value })
            }
            className={errors.phone ? 'error-input-c' : ''}
            required
          />
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            className={`payment-method ${errors.paymentMethod ? 'error-input-c' : ''}`}
          >
            <option value="" disabled>
              Select Payment Method
            </option>
            <option value="Credit-Card">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="Cash on Delivery">Cash on Delivery</option>
          </select>
        </div>
        <div className="place-order-right">
          <div className="cart-total-c">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details-c">
                <p>Subtotal</p>
                <p>${subTotalAmount}</p>
              </div>
              <hr />
              <div className="cart-total-details-c">
                <p>Delivery Fee</p>
                <p>${deliveryFee}</p>
              </div>
              <hr />
              <div className="cart-total-details-c">
                <b>Total</b>
                <b>${totalAmount}</b>
              </div>
            </div>
            <button type="button" onClick={handlePlaceOrder}>
              PROCEED TO PAYMENT
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
