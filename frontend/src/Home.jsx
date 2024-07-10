import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('login'); // 'login' or 'register'
  const { login, register, currentUser, logout } = useContext(UserContext);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    login(email, password).then((user) => {
      if (user) {
        toast.success('Logged in successfully!');
        setShowForm(false);
      } else {
        toast.error('Login failed. Please check your credentials.');
      }
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      toast.error("Passwords don't match");
      return;
    }

    register(username, email, password).then((user) => {
      if (user) {
        toast.success('Registration successful! Please log in.');
        setShowForm(true);
        setFormType('login');
      } else {
        toast.error('Registration failed. Please try again.');
      }
    });
  };

  const handleGetStartedClick = () => {
    setShowForm(true);
    setFormType('login');
  };

  const handleRegisterClick = () => {
    setFormType('register');
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
  };

  return (
    <>
      <div id="main">
        <div className="navbar">
          <div className="icon">
            <h2 className="logo">{currentUser ? `${currentUser.username}` : 'PresentSpotter'}</h2>
          </div>
          <div className="menu">
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/bookpitch">BookPitch</Link></li>
              <li><Link to="/reviews">Reviews</Link></li>
            </ul>
          </div>
        </div>

        <div className="content">
          {currentUser ? (
            <div className="profile-container">
              <div>
                <img
                  src="../icon.jpg"
                  alt="Profile"
                />
              </div>
              <h1>{currentUser.username}</h1>
              {currentUser && <button className="get-started-btn" onClick={handleLogout}>Logout</button>}
              <div className="pitch-container">
                <h1 className="welcome">PresentSpotter</h1>
                <p className="parh">Where we find your best football pitch to play in “Score your perfect play: Where every kick finds its pitch!"</p>
              </div>
            </div>
          ) : (
            <div className="pitch-container">
              <h1 className="welcome">Welcome to PresentSpotter</h1>
              <p className="parh">Where we find your best football pitch to play in “Score your perfect play: Where every kick finds its pitch!"</p>
              <button className="get-started-btn" onClick={handleGetStartedClick}>Get Started</button>
            </div>
          )}

          {showForm && (
            <div className="form-container">
              {error && <p className="error-message">{error}</p>}
              {formType === 'login' ? (
                <form id="register-form" onSubmit={handleLogin}>
                  <h2>Log in</h2>
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit">Log In</button>
                  <h1>Don't have an account?</h1>
                  <button type="button" className="get-started-btn" onClick={handleRegisterClick}>Register</button>
                </form>
              ) : (
                <form id="register-form" onSubmit={handleRegister}>
                  <h2>Register</h2>
                  <div>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      placeholder="Username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="Password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  <button type="submit">Register</button>
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
            <a href="#"><i className="fab fa-instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin"></i></a>
            <a href="#"><i className="fab fa-whatsapp"></i></a>
          </div>
          <div className="copy">
            <p>&copy; 2024 PresentSpotter. All Rights Reserved</p>
          </div>
        </footer>
      </div>
      <ToastContainer />
    </>
  );
}

export default Home;
