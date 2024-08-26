import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import FavoriteApiService from '../../services/FavoriteApiService';
import CartApiService from '../../services/CartApiService';
import { Button, Card,message } from 'antd';
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import './Favorite.css';
import Header from '../Home/Header';

const { Meta } = Card;

const Favorite = () => {
    const { favoriteId } = useParams();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [token, setToken] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const user_id =  localStorage.getItem('user_id');
        
        if (token) {
            setToken(token);
        }

        if (!token) {
            navigate('/login');
            return;
        }

        jwtDecode(token);

        const fetchFavoriteProducts = async () => {
            try {
                const response = await FavoriteApiService.getFavoriteProducts(user_id, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data)) {
                    setProducts(response.data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }
            }
        };

        fetchFavoriteProducts();
    }, [favoriteId, navigate, token]);

    const handleDeleteProductFromFavorite = async (productId) => {
        try {
            const user_id =  localStorage.getItem('user_id');


            const response = await FavoriteApiService.removeProductFromFavorite(user_id, productId, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log('Product deleted from favorite:', response.data);
            setProducts(products.filter(product => product.id !== productId));
        } catch (error) {
            console.error('Error deleting product from favorite:', error);
        }
    };

    const handleAddToCart = async (product) => {
        
        
        try {
            const user_id = parseInt(localStorage.getItem('user_id'), 10);
            const cart_id = parseInt(localStorage.getItem('cart_id'), 10);
            const token = localStorage.getItem('authToken');

            console.log("user id :",user_id);
            console.log("cart id :",cart_id);
            if(!token) {
                message.error('You must be logged in to add a product to cart');
                return;
            }

            const response = await CartApiService.addProductToCart(user_id, cart_id,product.id, 1, product.price, {
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

    const handleContainerClick = (id) => {
        navigate(`/product-info/${id}`);
    };

    return (
        <div className="favorite-container">
            <Header/>
            <h1>Your Favorites</h1>
            <div className="product-grid">
                {products.map(product => (
                    <Card
                        key={product.id}
                        hoverable
                        cover={<img alt={product.imageUrl} src={product.imageUrl} onClick={() => handleContainerClick(product.id)} />}
                        actions={[
                            <Button
                                type="danger"
                                icon={<DeleteOutlined />}
                                onClick={() => handleDeleteProductFromFavorite(product.id)}
                                style={
                                    { 
                                        backgroundColor: '#fff',
                                    }
                                }>
                                Remove
                            </Button>,
                            <Button
                                type="primary"
                                icon={<ShoppingCartOutlined />}
                                onClick={() => handleAddToCart(product)}
                                style={
                                    { 
                                        marginLeft: '10px', 
                                        backgroundColor: '#29398e'
                                    }
                                }>
                                
                                Add to Cart
                            </Button>
                        ]}
                    >
                        <Meta
                            title={`${product.title}  -  $${product.price.toFixed(2)}`}
                        />
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Favorite;
