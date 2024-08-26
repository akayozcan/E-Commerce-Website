import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/Auth/Register';
import Login from './components/Auth/Login';
import Home from './components/Home/Home';
import Activate from './components/Auth/Activate';
import UserInfo from './components/User/UserInfo';
import AddProduct from './components/Admin/AddProduct';
import ProductList from './components/Product/ProductList';
import Favorite from './components/Favorite/Favorite';
import UpdateProduct from './components/Admin/UpdateProduct';
import ProductInfo from './components/Product/ProductInfo';
import Cart from './components/Cart/Cart';
import ListOrders from './components/Order/ListOrders';
import CheckOut from './components/Order/CheckOut';
import Header from './components/Home/Header';
import Admin from './components/Admin/Admin';
import Sidebar from './components/Admin/Sidebar';
import Navbar from './components/Admin/Navbar';
import AdminOrderList from './components/Admin/AdminOrderList';
import ForgetPassword from './components/Password/ForgetPassword';
import ResetPassword from './components/Password/ResetPassword';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/sidebar" element={<Sidebar />} />
      <Route path="/navbar" element={<Navbar />} />
      <Route path="/add-product" element={<AddProduct />} />
      <Route path="/update-product" element={<UpdateProduct />} />
      <Route path="/list-orders" element={<ListOrders />} />
      <Route path="/admin-order-list" element={<AdminOrderList />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/activate" element={<Activate />} />
      <Route path="/user-info" element={<UserInfo />} />
      <Route path="/product-list/:category_id" element={<ProductList />} />
      <Route path="/favorite" element={<Favorite />} />
      <Route path="/product-info/:productId" element={<ProductInfo />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/list-orders" element={<ListOrders />} />
      <Route path="/checkout" element={<CheckOut />} />
      <Route path="/header" element={<Header />} />
      <Route path="/forget-password" element={<ForgetPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
};

export default App;
