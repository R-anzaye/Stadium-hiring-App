import React, { createContext, useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext";
import { toast } from "react-toastify";

export const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const { authToken } = useContext(UserContext); // Assuming authToken is available from UserContext

  useEffect(() => {
    fetchRatings();
  }, []); // Fetch ratings on component mount

  // Fetch all ratings
  const fetchRatings = () => {
    fetch("http://127.0.0.1:5555/ratings_list", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            const error = data.message || "Unknown error";
            throw new Error(error);
          });
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Failed to fetch ratings:", data.message || "Unknown error");
        }
      })
      .catch((error) => {
        console.error("Error fetching ratings:", error.message || error);
        
      });
  };
  

  // Add a review
  const addReview = (review) => {
    fetch("http://127.0.0.1:5555/ratings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(review),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews([...reviews, data.review]); // Assuming data.review contains the newly added review object
          toast.success("Review added successfully");
        } else {
          toast.error(data.error || "Something went wrong");
        }
      })
      .catch((error) => {
        console.error("Error adding review:", error);
        toast.error("Failed to add review. Please try again later.");
      });
  };

  // Update a review
  const updateReview = (review) => {
    fetch(`http://127.0.0.1:5555/ratings/${review.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(review),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews(reviews.map(r => r.id === review.id ? data.review : r)); // Assuming data.review contains the updated review object
          toast.success("Review updated successfully");
        } else {
          toast.success("Review updated successfully");
        }
      })
      .catch((error) => {
        console.error("Error updating review:", error);
        toast.error("Failed to update review. Please try again later.");
      });
  };

  // Delete a review
  const deleteReview = (reviewId) => {
    fetch(`http://127.0.0.1:5555/ratings/${reviewId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete review");
        }
        setReviews(reviews.filter(review => review.id !== reviewId));
        toast.success("Review deleted successfully");
      })
      .catch((error) => {
        console.error("Error deleting review:", error);
        toast.error("Failed to delete review. Please try again later.");
      });
  };

  return (
    <ReviewsContext.Provider
      value={{ reviews, addReview, updateReview, deleteReview, fetchRatings }}
    >
      {children}
    </ReviewsContext.Provider>
  );
};

export default ReviewsContext;
