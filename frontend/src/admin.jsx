import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import "./Home.css"

function Admin() {

  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/pitches');
  };

  return (
    <>
      <div id="main">
        <div className="navbar">
          <div className="icon">
            <h2 className="logo">PresentSpotter</h2>
          </div>
          <div className="menu">
            <ul>
              <li>
                <Link to="/pitches">Pitches</Link>
              </li>
             
            </ul>
          </div>
        </div>

        <div className="content">
          <div className="pitch-container">
            <h1 className="welcome">Welcome  Admin!</h1>
            <p className="parh">Where we find your best football pitch to play in “Score your perfect play: Where every kick finds its pitch!"</p>
            <button className="get-started-btn" onClick={handleGetStartedClick}>Edit Posts</button>
          </div>
          
         
        </div>

        <footer>
          <p>PresentSpotter</p>
          <p>
            For more information, contact us at info@presentspotter.co.ke or follow us
            on our social media platforms at pitch.ke
          </p>
          <div className="social">
            <a href="#">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="#">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
          <div className="copy">
            <p>&copy; 2024 PresentSpotter. All Rights Reserved</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Admin;