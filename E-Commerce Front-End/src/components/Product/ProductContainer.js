import React, { useState, useEffect } from 'react';
import { HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons';
import { message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './ProductContainer.css';
import FavoriteApiService from '../../services/FavoriteApiService';
import CartApiService from '../../services/CartApiService';

const ProductContainer = ({ product }) => {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(product.favorite);

    useEffect(() => {
        const fetchFavoriteStatus = async () => {
            try {
                const user_id = parseInt(localStorage.getItem('user_id'), 10);
                const token = localStorage.getItem('authToken');

                console.log('User ID:', user_id);
                if (!token) {
                    setIsFavorite(false);
                    return;
                }

                const response = await FavoriteApiService.isFavoriteRequest(user_id, product.id, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                console.log('Favorite status:', response.data);
                setIsFavorite(response.data);
            } catch (error) {
                console.error('Error fetching favorite status:', error);
                setIsFavorite(false);
            }
        };

        fetchFavoriteStatus();
    }, [product.id]);

    const onFavoriteClick = async (productId) => {
        try {
            const user_id = parseInt(localStorage.getItem('user_id'), 10);
            const token = localStorage.getItem('authToken');
            if (!token) {
                message.error('You must be logged in to favorite a product');
                return;
            }

            const response = await FavoriteApiService.addProductToFavorite(user_id, productId, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("Response:", response);
            message.success('Product added to favorites');
            setIsFavorite(true);
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to favorite the product');
        }
    };

    const onRemoveFavoriteClick = async (productId) => {
        try {
            const user_id = parseInt(localStorage.getItem('user_id'), 10);
            const token = localStorage.getItem('authToken');
            if (!token) {
                message.error('You must be logged in to favorite a product');
                return;
            }

            const response = await FavoriteApiService.removeProductFromFavorite(user_id, productId, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            console.log("Response:", response);
            message.success('Product removed from favorites');
            setIsFavorite(false);
        } catch (error) {
            console.error('Error:', error);
            message.error('Failed to remove favorite the product');
        }
    };

    const toggleFavorite = (e) => {
        e.stopPropagation();
        if (isFavorite) {
            onRemoveFavoriteClick(product.id);
        } else {
            onFavoriteClick(product.id);
        }
    };

    const onAddToCartClick = async () => {
        const token = localStorage.getItem('authToken');
        const user_id = parseInt(localStorage.getItem('user_id'), 10);
        const cart_id = parseInt(localStorage.getItem('cart_id'), 10);

        console.log("user id :",user_id);
        console.log("cart id :",cart_id);


        try {
            if (!token) {
                message.error('You must be logged in to add a product to cart');
                return;
            }

            const response = await CartApiService.addProductToCart(user_id,cart_id,product.id, 1, product.price, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            message.success(`${product.title} added to cart`);
        } catch (error) {
            console.error('Failed to add product to cart', error);
            message.error('Failed to add product to cart');
        }
    };

    const handleContainerClick = () => {
        console.log('Product clicked:', product.id);
        navigate(`/product-info/${product.id}`);
    };

    return (
        <div className="product-item" key={product.id} onClick={handleContainerClick}>
            <img src={product.imageUrl} className="product-image-c" alt={product.title} />
            <div className="product-info">
                <h3 className="product-title">{product.title}</h3>
                <p className="product-price">${product.price}</p>
            </div>
            <div className="product-actions">
                {isFavorite ? (
                    <HeartFilled
                        className="favorite-icon"
                        onClick={toggleFavorite}
                    />
                ) : (
                    <HeartOutlined
                        className="favorite-icon"
                        onClick={toggleFavorite}
                    />
                )}
                <ShoppingCartOutlined
                    className="add-cart-icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onAddToCartClick(product.id);
                    }}
                />
            </div>
        </div>
    );
};

export default ProductContainer;