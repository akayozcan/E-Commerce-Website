import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CartApiService from '../../services/CartApiService';
import ProductApiService from '../../services/ProductApiService';
import { Button, InputNumber, Card, Row, Col } from 'antd';
import './Cart.css';
import Header from '../Home/Header';

const Cart = () => {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [subTotalAmount, setSubTotalAmount] = useState(0);
    const [deliveryFee, setDeliveryFee] = useState(39.99);
    const [totalAmount, setTotalAmount] = useState(0);
    const [showEmptyCartMessage, setShowEmptyCartMessage] = useState(false);

    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const user_id = parseInt(localStorage.getItem('user_id'), 10);
                if (!token) {
                    navigate('/login');
                    return;
                }
                const response = await CartApiService.getCartItems(user_id, {
                    headers: { 'Authorization': `Bearer ${token}` },
                });
                const itemsWithProductDetails = await Promise.all(response.data.map(async (item) => {
                    const productResponse = await ProductApiService.getProduct(item.productId, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });
                    return { ...item, product: productResponse.data };
                }));
                setCartItems(itemsWithProductDetails);
                calculateTotalAmount(itemsWithProductDetails);
                setShowEmptyCartMessage(true); // Show the empty cart message when the user enters the cart
            } catch (error) {
                console.error('Error fetching cart items:', error);
            }
        };

        fetchCartItems();
    }, [navigate]);

    const calculateTotalAmount = (items) => {
        const total = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
        console.log('total:', total);
        setSubTotalAmount(total);
        if (total > 0) {
            setTotalAmount(total + deliveryFee);
        } else {
            setTotalAmount(0);
        }
    };

    const addToCart = async (difference, productId, productPrice) => {
        try {
            const user_id = parseInt(localStorage.getItem('user_id'), 10);
            const cart_id = parseInt(localStorage.getItem('cart_id'), 10);
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.log('You must be logged in to add a product to cart');
                return;
            }

            console.log("productId:", productId);
            console.log("productPrice:", productPrice)
            console.log("difference:", difference)

            const response = await CartApiService.addProductToCart(user_id, cart_id, productId, difference, productPrice, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

        } catch (error) {
            console.error('Failed to add product to cart', error);
        }
    };

    const handleQuantityChange = async (productId, productPrice, value) => {
        console.log("Value:", value);
        var difference = 0;

        const updatedItems = cartItems.map(item => {
            if (item.productId === productId) {
                difference = value - item.quantity;
                console.log("Difference:", difference);
                return { ...item, quantity: value };
            }
            return item;
        });
        setCartItems(updatedItems);
        calculateTotalAmount(updatedItems);
        addToCart(difference, productId, productPrice);
        setShowEmptyCartMessage(false); // Hide the empty cart message when the user interacts with the cart
    };

    const handleRemoveProduct = async (productId) => {
        const updatedItems = cartItems.filter(item => item.productId !== productId);
        setCartItems(updatedItems);
        calculateTotalAmount(updatedItems);

        const token = localStorage.getItem('authToken');
        const user_id = parseInt(localStorage.getItem('user_id'), 10);
        try {
            await CartApiService.deleteItem(user_id, productId, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
        } catch (error) {
            console.error('Error deleting item:', error);
        }
        setShowEmptyCartMessage(false); // Hide the empty cart message when the user interacts with the cart
    };

    const handleCheckout = () => {
        navigate('/checkout');
    };

    return (
        <div className="cart-container">
            <Header />
            <div className="cart">
                <div className="cart-items">
                    <div className="cart-items-title">
                        <p>Items</p>
                        <p>Title</p>
                        <p>Price</p>
                        <p>Quantity</p>
                        <p>Total</p>
                        <p>Remove</p>
                    </div>
                    <br />
                    <hr />
                    {cartItems.map((item, index) => {
                        if (cartItems.length > 0) {
                            return (
                                <div key={index}>
                                    <div className='cart-items-title cart-items-item'>
                                        <img src={item.product.imageUrl} alt="" />
                                        <p>{item.product.title}</p>
                                        <p>${item.product.price}</p>
                                        <InputNumber min={1} max={item.product.stock} value={item.quantity} onChange={(value) => handleQuantityChange(item.productId, item.product.price, value)} />
                                        <p>${item.product.price * item.quantity}</p>
                                        <p onClick={() => handleRemoveProduct(item.productId)} className='cross'>x</p>
                                    </div>
                                    <hr />
                                </div>
                            )
                        }
                    })}
                </div>
                <div className='cart-bottom'>
                    <div className='cart-total'>
                        <h2>Cart Totals</h2>
                        <div>
                            <div className='cart-total-details'>
                                <p>Subtotal</p>
                                <p>${subTotalAmount}</p>
                            </div>
                            <hr />
                            <div className='cart-total-details'>
                                <p>Delivery Fee</p>
                                <p>${deliveryFee}</p>
                            </div>
                            <hr />
                            <div className='cart-total-details'>
                                <b>Total</b>
                                <b>${totalAmount}</b>
                            </div>
                        </div>
                        <button onClick={handleCheckout} disabled={cartItems.length === 0}>PROCEED TO CHECKOUT</button>
                    </div>

                    <div className='cart-promocode'>
                        <p>If you have a promo code, Enter it here</p>
                        <div className='cart-promocode-input'>
                            <input type="text" placeholder='promocode' />
                            <button>Apply</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;