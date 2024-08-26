import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel, Grid, Typography, Avatar, Box } from '@mui/material';
import { Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import CategoryApiService from '../../services/CategoryApiService';
import ProductApiService from '../../services/ProductApiService';
import './AddProduct.css';

const AddProduct = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [file, setFile] = useState(null);
    const [imageUrl,setImageUrl] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/login');
            return;
        }

        const fetchCategories = async () => {
            try {
                const response = await CategoryApiService.getCategories({
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (Array.isArray(response.data)) {
                    setCategories(response.data);
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [navigate]);

    const handleAddProduct = async () => {
        if (!file) {
            message.error('Please upload a product image');
            return;
        }
    
        try {
            const formData = new FormData();
            formData.append('file', file);
    
            const productDto = {
                title,
                description,
                price,
                stock,
                imageUrl: "", // If you have a URL, add it here
                categoryId: selectedCategory,
                vendorId: 1
            };
    
            // Append productDto as a JSON string
            formData.append('productDto', JSON.stringify(productDto));
    
            const token = localStorage.getItem('authToken');
    
            const response = await ProductApiService.addProduct(formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                },
            });
    
            console.log('Product added successfully:', response.data);
            message.success('Product added successfully');
            window.location.reload();

        } catch (error) {
            console.error('Error adding product:', error);
            message.error('Error adding product');
        }
    };

    const handleUpload = ({ file }) => {
        setFile(file);
        const url = URL.createObjectURL(file);
        setImageUrl(url);
        message.success(`${file.name} file uploaded successfully`);
    };

    return (
        
        
            <Box className="container-add-product1">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined" className="styled-form-control1">
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            label="Category"
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.title}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Title"
                        fullWidth
                        variant="outlined"
                        className="styled-text-field1"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="Description"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        className="styled-text-field1"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Price"
                        fullWidth
                        variant="outlined"
                        type="number"
                        className="styled-text-field1"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        label="Stock"
                        fullWidth
                        variant="outlined"
                        type="number"
                        className="styled-text-field1"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Box className="upload-container1">
                        <Upload
                            name="image"
                            listType="picture-card"
                            showUploadList={false}
                            beforeUpload={() => false} // Prevent automatic upload
                            onChange={handleUpload}
                        >
                            {imageUrl ? (
                                <Avatar src={imageUrl} alt="product-image" className="uploaded-image1" />
                            ) : (
                                <Box>
                                    <UploadOutlined style={{ fontSize: 24 }} />
                                    <Typography variant="body2" color="textSecondary">Upload Image</Typography>
                                </Box>
                            )}
                        </Upload>
                    </Box>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" fullWidth className="styled-button1" onClick={handleAddProduct}>
                        Add Product
                    </Button>
                </Grid>
            </Grid>
        </Box>
            
    );
};

export default AddProduct;

