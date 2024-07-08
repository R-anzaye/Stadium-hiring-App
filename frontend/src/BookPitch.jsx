import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function BookPitch() {
 
  return (
    <div id="main">
      <div className="navbar">
        <div className="icon">
          <h2 className="logo">PresentSpotter</h2>
        </div>
        <div className="menu">
          <ul>
            <li><Link to="/bookpitch">Book Pitch</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
          </ul>
        </div>
      </div>
      <div className="tent">
        <h1>Want a stadium?</h1>
        <p className="par">Book with us now to enjoy world-class equipment and the best football environment to nurture talent.</p>
      </div>
      <div className="search">
        <input
          className="srch"
          type="search"
          placeholder="Search"
          
          
        />
      </div>
      <div className="container">
        
      </div>
      <footer>
        <p>PresentSpotter</p>
        <p>
          For more information, contact us at info@presentspotter.co.ke or follow us on our social media platforms at pitch.ke
        </p>
        <div className="social">
          <a href="#"><i className="fab fa-instagram"></i></a>
          <a href="#"><i className="fab fa-linkedin"></i></a>
          <a href="#"><i className="fab fa-whatsapp"></i></a>
        </div>
        <div className="copy">
          <p>&copy; 2024 PresentSpotter. All Rights Reserved</p>
        </div>
      </footer>
      <ToastContainer />
    </div>
  );
}

export default BookPitch;
