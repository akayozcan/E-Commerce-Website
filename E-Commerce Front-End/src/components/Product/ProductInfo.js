import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { InputNumber, Button, message } from 'antd';
import ProductApiService from '../../services/ProductApiService';
import './ProductInfo.css';
import CartApiService from '../../services/CartApiService';
import Header from '../Home/Header';

import star_icon from "../Assets/star_icon.png"
import star_dull_icon from "../Assets/star_dull_icon.png"

const ProductInfo = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [cartId, setCartId] = useState(null); // Assuming you get cart ID from somewhere

    useEffect(() => {
        const fetchProduct = async () => {
            const token = localStorage.getItem('authToken');

            try {
                const response = await ProductApiService.getProduct(productId, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setProduct(response.data);
                setLoading(false);
                // Assume you have a way to get the cart ID, maybe another API call or from localStorage
                const fetchedCartId = localStorage.getItem('cartId'); // Example: fetching cartId from localStorage
                setCartId(1);
            } catch (error) {
                console.error('Failed to fetch product data', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [productId]);

    const handleQuantityChange = (value) => {
        setQuantity(value);
    };

    const addToCart = async () => {

        try {
            const user_id = parseInt(localStorage.getItem('user_id'), 10);
            const cart_id = parseInt(localStorage.getItem('cart_id'), 10);
            const token = localStorage.getItem('authToken');
            if (!token) {
                message.error('You must be logged in to add a product to cart');
                return;
            }

            const response = await CartApiService.addProductToCart(user_id,cart_id, product.id, quantity, product.price, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
            );
            message.success(`${product.title} added to cart`);
        } catch (error) {
            console.error('Failed to add product to cart', error);
            message.error('Failed to add product to cart');
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    if (!product) return <div className="product-not-found">Product not found</div>;

    return (
        <div className='product-main-container1'>
            <Header />
            <div className='productdisplay'>
                <div className='productdisplay-left'>
                    <div className='productdisplay-img-list'>
                        <img src={product.imageUrl} alt='' />
                        {/* if you want add more image  */}
                    </div>
                    <div className='productdisplay-image'>
                        <img className='productdisplay-main-img' src={product.imageUrl} alt='' />
                    </div>
                </div>
                <div className='productdisplay-right'>
                    <h1>{product.title}</h1>
                    <div className='productdisplay-right-star'>
                        <img src={star_icon} alt='' />
                        <img src={star_icon} alt='' />
                        <img src={star_icon} alt='' />
                        <img src={star_icon} alt='' />
                        <img src={star_dull_icon} alt='' />
                        <p> (122) </p>
                    </div>
                    <div className='productdisplay-right-prices'>
                        <div className='productdisplay-right-price-old'>${product.price * 110 / 100}</div>
                        <div className='productdisplay-right-price-new'>${product.price}</div>
                    </div>
                    <div className='productdisplay-right-description'>
                        {product.description}
                    </div>

                    <div className="quantity-selector">
                        <span>Quantity:</span>
                        <InputNumber
                            min={1}
                            max={product.stock}
                            defaultValue={1}
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="quantity-input"
                        />
                    </div>

                    <button
                        type="primary"
                        size="large"
                        onClick={addToCart}
                        className="add-to-cart-btn"
                        disabled={!cartId} // Disable if cart ID is not available
                    >ADD TO CART</button>
                </div>
            </div>
        </div>
    );
};

export default ProductInfo;
