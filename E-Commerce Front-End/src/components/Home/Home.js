import React, { useState, useEffect } from 'react';
import {useNavigate } from 'react-router-dom';
import './Home.css';
import {Pagination, Upload } from 'antd';
import CategoryApiService from '../../services/CategoryApiService';
import ProductApiService from '../../services/ProductApiService';
import ProductContainer from '../Product/ProductContainer';
import Header from './Header';

const Home = () => {
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [templateImage, setTemplateImage] = useState(false);
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const responseTemplate = await CategoryApiService.getTemplate();
                setTemplateImage(responseTemplate.data);

                const response = await CategoryApiService.getCategories();
                setCategories(response.data);

            } catch (error) {
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                }
            }
        };

        fetchCategories();
    }, [navigate]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await ProductApiService.getProductsPage(page - 1, 10);
                setProducts(response.data.content);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error getting products:', error);
            }
        };

        fetchProducts();
    }, [page]);

    const handleUploadPhotoClicked = async (categoryId, file) => {
        try {
            const token = localStorage.getItem('authToken');
            const formData = new FormData();
            formData.append('file', file);

            const response = await CategoryApiService.uploadPhoto(formData, categoryId, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
            console.log('Category Photo Updated:', response.data);

            // Refresh categories after upload
            const updatedCategories = await CategoryApiService.getCategories({
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            setCategories(updatedCategories.data);

            setEditingCategoryId(null); // Close the upload UI
        } catch (error) {
            console.error('Error uploading category photo:', error);
        }
    };

    const handleCategoryClick = (categoryId) => {
        setEditingCategoryId(categoryId);
    };

    const handleCategoryTitleClick = (categoryId) => {
        navigate(`/product-list/${categoryId}`);
    };


    const handlePageChange = (page) => {
        setPage(page);
    };


    const uploadProps = (categoryId) => ({
        beforeUpload: (file) => {
            handleUploadPhotoClicked(categoryId, file);
            return false; // Prevent default upload behavior
        },
        showUploadList: false,
    });

    return (
        <div className="home-container">
            <Header/>
            <header className="home-header2">
                <div className="categories-container">
                    {categories && categories.map((category) => (
                        <div
                            className="category-item"
                            key={category.id}
                        >
               
                                <img
                                    src={category.imageURL}
                                    className="category-image"
                                    alt={category.title}
                                    onClick={() => handleCategoryClick(category.id)}
                                />
             
                            <span
                                className="category-title"
                                onClick={() => handleCategoryTitleClick(category.id)}
                            >
                                {category.title}
                            </span>
                        </div>
                    ))}
                </div>
            </header>

            <div className="advertisement-container">
                <img
                    src={templateImage}
                    alt="Advertisement"
                    className="advertisement-image"
                />
            </div>

            <div className="products-container">
                {products.map((product, index) => (
                    <ProductContainer
                        key={product.id}
                        product={product}
                    />
                ))}
            </div>

            <Pagination
                current={page}
                total={totalPages * 10}
                onChange={handlePageChange}
                className="pagination"
            />

            <div className="home-content">
                <h2>Welcome to Our Platform</h2>
            </div>
        </div>
    );
};

export default Home;
