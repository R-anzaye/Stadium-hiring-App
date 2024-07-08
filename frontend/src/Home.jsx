import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function Home() {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('login'); // 'login' or 'register'
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    navigate('/bookpitch');
  };

  const handleGetStartedClick = () => {
    setShowForm(true);
    setFormType('login');
  };

  const handleRegisterClick = () => {
    setShowForm(true);
    setFormType('register');
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
                <Link to="/">Home</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="content">
          <div className="pitch-container">
            <h1 className="welcome">Welcome to PresentSpotter</h1>
            <p className="parh">Where we find your best football pitch to play in “Score your perfect play: Where every kick finds its pitch!"</p>
            <button className="get-started-btn" onClick={handleGetStartedClick}>Get Started</button>
          </div>

          {showForm && (
            <div className="form-container">
              {formType === 'login' ? (
                <>
                  <form id="register-form">
                    <h2>Log in</h2>
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" name="email" placeholder="Email" />

                    <label htmlFor="phone">Phone Number</label>
                    <input type="number" id="phone" name="phone" placeholder="Phone Number" />

                    <label htmlFor="password">Password</label>
                    <input type="password" id="password" name="password" placeholder="Password" />

                    <button type="submit" onClick={handleClick}>Log In</button>
                  </form>
                  <h2>Don't have an account? </h2>
                  <button className="register-btn" onClick={handleRegisterClick}>
                    Register now
                  </button>
                </>
              ) : (
                <form id="register-form">
                  <h2>Register</h2>
                  <label htmlFor="reg-name">Name</label>
                  <input type="text" id="reg-name" name="name" placeholder="Name" />

                  <label htmlFor="reg-email">Email</label>
                  <input type="text" id="reg-email" name="email" placeholder="Email" />

                  <label htmlFor="reg-phone">Phone Number</label>
                  <input type="number" id="reg-phone" name="phone" placeholder="Phone Number" />

                  <label htmlFor="reg-password">Password</label>
                  <input type="password" id="reg-password" name="password" placeholder="Password" />

                  <label htmlFor="confirm-password">Confirm Password</label>
                  <input type="password" id="confirm-password" name="confirm-password" placeholder="Confirm Password" />


                  <button type="submit" onClick={handleClick}>Register</button>
                </form>
              )}
            </div>
          )}
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

export default Home;
