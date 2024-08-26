import React, { useState } from "react";
import './Sidebar.css';

import add_icon from '../Assets/add_icon.png';
import order_icon from '../Assets/order_icon.png';

const Sidebar = ({ setSelectedPage }) => {
    const [activeOption, setActiveOption] = useState('');

    const handleOptionClick = (page) => {
        setSelectedPage(page);
        setActiveOption(page);
    };

    return (
        <div className="sidebar">
            <div className="sidebar-options">
                <div 
                    className={`sidebar-option ${activeOption === 'add-product' ? 'active' : ''}`}
                    onClick={() => handleOptionClick('add-product')}
                >
                    <img src={add_icon} alt="Add Products" />
                    <p>Add Products</p>
                </div>

                <div 
                    className={`sidebar-option ${activeOption === 'update-product' ? 'active' : ''}`}
                    onClick={() => handleOptionClick('update-product')}
                >
                    <img src={order_icon} alt="Update Products" />
                    <p>List Products</p>
                </div>

                <div 
                    className={`sidebar-option ${activeOption === 'admin-order-list' ? 'active' : ''}`}
                    onClick={() => handleOptionClick('admin-order-list')}
                >
                    <img src={order_icon} alt="List Orders" />
                    <p>All Orders</p>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;