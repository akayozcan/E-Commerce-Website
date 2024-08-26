import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProductApiService from "../../services/ProductApiService";
import './UpdateProduct.css';

const UpdateProduct = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found. Please log in.');
                return;
            }
            try {
                const response = await ProductApiService.getProducts({
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching product data:', error);
            }
        };
    
        fetchData();
    }, [navigate]);

    const handleInputChange = (e, productId) => {
        const { name, value } = e.target;
        setProducts(prevProducts =>
            prevProducts.map(product =>
                product.id === productId
                    ? { ...product, [name]: value }
                    : product
            )
        );
    }

    const handleUpdateProductInfo = async (e, product) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('authToken');
            const response = await ProductApiService.updateProduct(
                product.title,
                product.description,
                product.price,
                product.stock,
                product.sku,
                {
                    'Authorization': `Bearer ${token}`
                }
            );
            console.log('Product updated:', response);
            alert('Product information updated successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Update error:', error.response ? error.response.data : error.message);
            alert('Update failed. Please try again.');
        }
    }

    const handleUpdatePhoto = async (e, productId) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;

        try {
            const token = localStorage.getItem('authToken');
            const formData = new FormData();
            formData.append('file', file);

            const response = await ProductApiService.updatePhoto(
                formData,
                productId,
                {
                    'Authorization': `Bearer ${token}`
                }
            );
            console.log('Photo updated:', response);
            alert('Product photo updated successfully!');
            window.location.reload();
        } catch (error) {
            console.error('Update error:', error.response ? error.response.data : error.message);
            alert('Photo update failed. Please try again.');
        }
    }

    const handleRemoveProduct = async (productId) => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                console.error('No auth token found. Please log in.');
                return;
            }

            const response = await ProductApiService.deleteProduct(productId, {
                "Authorization": `Bearer ${token}`
            });
            window.location.reload();
            console.log('Product deleted:', response);
        } catch (error) {
            console.error('Delete error:', error.response ? error.response.data : error.message);
            alert('Delete failed. Please try again.');
        }
    }

    return (
        <div className="main-update-product-container">
            <div className="update-product-container">
            {products.map(product => (
                <div key={product.id} className="product-row">
                    <div className="left-container">
                        <img src={product.imageUrl} alt={product.title} className="product-image" />
                        <input
                            type="file"
                            onChange={(e) => handleUpdatePhoto(e, product.id)}
                            className="update-photo-input"
                        />
                    </div>
                    <div className="right-container">
                        <input
                            type="text"
                            name="title"
                            value={product.title}
                            onChange={(e) => handleInputChange(e, product.id)}
                            className="update-product-input"
                            placeholder="Product Title"
                        />
                        <input
                            type="text"
                            name="description"
                            value={product.description}
                            onChange={(e) => handleInputChange(e, product.id)}
                            className="update-product-input"
                            placeholder="Product Description"
                        />
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={(e) => handleInputChange(e, product.id)}
                            className="update-product-input"
                            placeholder="Product Price"
                        />
                        <input
                            type="number"
                            name="stock"
                            value={product.stock}
                            onChange={(e) => handleInputChange(e, product.id)}
                            className="update-product-input"
                            placeholder="Stock"
                        />
                        <input
                            type="text"
                            name="title"
                            value={product.sku}
                            className="update-product-input"
                            placeholder={product.sku}
                        />
                        <button
                            onClick={(e) => handleUpdateProductInfo(e, product)}
                            className="update-button"
                        >
                            Update Info
                        </button>
                    </div>
                    <button
                        onClick={() => handleRemoveProduct(product.id)}
                        className="remove-button"
                    >
                        &#10005;
                    </button>
                </div>
            ))}
        </div>
        </div>
    );
};

export default UpdateProduct;
