import React from "react";
import './Navbar.css';

import logo_img from '../Assets/logo5.png';
import profile_img from '../Assets/profile_image.jpg';
import logout_img from '../Assets/logout.png'; 
import { useNavigate } from "react-router-dom";

const Navbar = () => {
    const navigate = useNavigate();

    return (
        <div className="navbar">
            <img className="logo" src={logo_img} alt="" />
            <img className="profile" src={profile_img} alt="" />
            <img className="logout-img" src={logout_img} alt="" onClick={() => navigate("/login")} />
           
        </div>
    )
}

export default Navbar;