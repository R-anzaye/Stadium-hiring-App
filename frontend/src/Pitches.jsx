import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminContext } from './AdminContext'; // Adjust the path if needed
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Home.css'; // Import your CSS file

function Pitches() {
  const { pitches, addPitch, deletePitch, updatePitch } = useAdminContext();
  const [newPitch, setNewPitch] = useState({ name: '', description: '', location: '', price_per_hour: '' });
  const [editingPitch, setEditingPitch] = useState(null);

  const handleAddPitch = () => {
    addPitch(newPitch)
      .then(() => {
        toast.success('Pitch added successfully');
        setNewPitch({ name: '', description: '', location: '', price_per_hour: '' });
      })
      .catch((error) => {
        console.error('Error adding pitch:', error);
        toast.error('Failed to add pitch. Please try again later.');
      });
  };

  const handleUpdatePitch = () => {
    updatePitch(editingPitch.id, editingPitch)
      .then(() => {
        toast.success('Pitch updated successfully');
        setEditingPitch(null);
      })
      .catch((error) => {
        console.error('Error updating pitch:', error);
        toast.error('Failed to update pitch. Please try again later.');
      });
  };

  const handleDeletePitch = (pitchId) => {
    deletePitch(pitchId)
      .then(() => {
        toast.success('Pitch deleted successfully');
      })
      .catch((error) => {
        console.error('Error deleting pitch:', error);
        toast.error('Failed to delete pitch. Please try again later.');
      });
  };

  return (
    <div id="main">
      <div className="navbar">
        <div className="icon">
          <h2 className="logo">PresentSpotter</h2>
        </div>
        <div className="menu">
          <ul>
            <li>
              <Link to="/admin">Main</Link>
            </li>
            <li>
              <Link to="/pitches">Pitches</Link>
            </li>
            <li>
              <Link to="/bookings">Bookings</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="add-review">
        <h2>{editingPitch ? 'Edit Pitch' : 'Add Pitch'}</h2>
        <input
          type="text"
          value={editingPitch ? editingPitch.name : newPitch.name}
          onChange={(e) => {
            const value = e.target.value;
            if (editingPitch) {
              setEditingPitch({ ...editingPitch, name: value });
            } else {
              setNewPitch({ ...newPitch, name: value });
            }
          }}
          placeholder="Pitch Name"
        />
        <input
          type="text"
          value={editingPitch ? editingPitch.description : newPitch.description}
          onChange={(e) => {
            const value = e.target.value;
            if (editingPitch) {
              setEditingPitch({ ...editingPitch, description: value });
            } else {
              setNewPitch({ ...newPitch, description: value });
            }
          }}
          placeholder="Pitch Description"
        />
        <input
          type="text"
          value={editingPitch ? editingPitch.location : newPitch.location}
          onChange={(e) => {
            const value = e.target.value;
            if (editingPitch) {
              setEditingPitch({ ...editingPitch, location: value });
            } else {
              setNewPitch({ ...newPitch, location: value });
            }
          }}
          placeholder="Pitch Location"
        />
        <input
          type="number"
          value={editingPitch ? editingPitch.price_per_hour : newPitch.price_per_hour}
          onChange={(e) => {
            const value = e.target.value;
            if (editingPitch) {
              setEditingPitch({ ...editingPitch, price_per_hour: value });
            } else {
              setNewPitch({ ...newPitch, price_per_hour: value });
            }
          }}
          placeholder="Price per Hour"
        />

        {editingPitch ? (
          <button onClick={handleUpdatePitch}>Update Pitch</button>
        ) : (
          <button onClick={handleAddPitch}>Add Pitch</button>
        )}
      </div>
      
      <ul >
      <div className="container"></div>
        {pitches.map((pitch) => (
          <li key={pitch.id} className="review-item">
            <h3>{pitch.name}</h3>
            <p>
              <strong>Location:</strong> {pitch.location}
            </p>
            <p>
              <strong>Price per Hour:</strong> ${pitch.price_per_hour}/hour
            </p>
            <p>
              <strong>Description:</strong> {pitch.description}
            </p>

            <button className="btn-edit" onClick={() => setEditingPitch(pitch)}>
              Edit &#9998;
            </button>
            <button className="btn-delete" onClick={() => handleDeletePitch(pitch.id)}>
              Delete &#10005;
            </button>
          </li>
        ))}
      </ul>

      <footer>
        <p>PresentSpotter</p>
        <p>
          For more information, contact us at info@presentspotter.co.ke or follow us on our social media platforms at
          pitch.ke
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
  );
}

export default Pitches;
