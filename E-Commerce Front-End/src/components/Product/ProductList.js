// src/pages/ProductList/ProductList.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pagination,message} from 'antd';
import ProductApiService from '../../services/ProductApiService';
import ProductContainer from '../../components/Product/ProductContainer';
import './ProductList.css';
import Header from '../Home/Header';

const ProductList = () => {
    const { category_id } = useParams();
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const token = localStorage.getItem('authToken');
                const response = await ProductApiService.getProductsPageByCategoryId(page - 1, 10, category_id, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, [category_id, page]);

    const handlePageChange = (page) => {
        setPage(page);
    };

    const handleFavoriteClick = (id) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id ? { ...product, favorite: !product.favorite } : product
            )
        );
        message.success('Product added to favorites');
    };

    const handleAddToCartClick = (id) => {
        message.success('Product added to cart');
    };

    return (
        <div className="product-list-container">
            <Header />
            <h1>Products</h1>
            <div className="products-container">
                {products.map((product) => (
                    <ProductContainer
                        key={product.id}
                        product={product}
                        onFavoriteClick={handleFavoriteClick}
                        onAddToCartClick={handleAddToCartClick}
                    />
                ))}
            </div>
            <Pagination
                current={page}
                total={totalPages * 10}
                onChange={handlePageChange}
                className="pagination"
            />
        </div>
    );
};

export default ProductList;
