import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import AddProduct from "../Admin/AddProduct";
import UpdateProduct from "../Admin/UpdateProduct";
import AdminOrderList from "../Admin/AdminOrderList";
import './Admin.css';

const Admin = () => {
    const [selectedPage, setSelectedPage] = useState('add-product');

    const renderContent = () => {
        switch (selectedPage) {
            case 'add-product':
                return <AddProduct />;
            case 'update-product':
                return <UpdateProduct />;
            case 'admin-order-list':
                return <AdminOrderList />;
            default:
                return <AddProduct />;
        }
    };

    return (
        <div className="admin-container">
            <Navbar />
            <hr className="separator"/>
            <div className="main-content">
                <Sidebar setSelectedPage={setSelectedPage} />
                <div className="content-area">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default Admin;

