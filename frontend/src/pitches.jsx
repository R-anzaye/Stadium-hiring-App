import React from 'react'; // Import React if you haven't already
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; // Ensure you've imported ToastContainer correctly

function Pitches() {

    const handleAddPitchClick = () => {
        console.log('Add Pitch clicked'); // Placeholder for action
        // Implement the actual action here, e.g., navigate to add pitch page
    };

    return (
      <div id="main">
        <div className="navbar">
          <div className="icon">
            <h2 className="logo">PresentSpotter</h2>
          </div>
          <div className="menu">
            <ul>
              <li><Link to="/admin">Admin Page</Link></li>
            </ul>
          </div>
        </div>
        <div className="tent">
          <h1>Edit Pitches</h1>
          <button onClick={handleAddPitchClick}>Add Pitch</button>
          <div className="search">
            <input
              className="srch"
              type="search"
              placeholder="Search"
            />
          </div>
          <div className="container">
            {/* Content goes here */}
          </div>
        </div>
        <footer>
          <p>PresentSpotter</p>
          <p>
            For more information, contact us at info@presentspotter.co.ke or follow us on our social media platforms at pitch.ke
          </p>
          <div className="social">
            <a href="#"><i className="fab fa-instagram" aria-label="Instagram"></i></a>
            <a href="#"><i className="fab fa-linkedin" aria-label="LinkedIn"></i></a>
            <a href="#"><i className="fab fa-whatsapp" aria-label="WhatsApp"></i></a>
          </div>
          <div className="copy">
            <p>&copy; 2024 PresentSpotter. All Rights Reserved</p>
          </div>
        </footer>
        <ToastContainer />
      </div>
    );
}
  
export default Pitches;
