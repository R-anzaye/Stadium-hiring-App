import React, { createContext, useState, useContext, useEffect } from "react";
import { UserContext } from "./UserContext"; // Adjust the import path as needed

const ReviewsContext = createContext();

export const ReviewsProvider = ({ children }) => {
  const [reviews, setReviews] = useState([]);
  const { authToken } = useContext(UserContext);

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
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setReviews(data);
        } else {
          console.error("Failed to fetch ratings:", data.message || "Unknown error");
        }
      })
      .catch((error) => {
        console.error("Error fetching ratings:", error);
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
          setReviews([...reviews, review]);
          alert(data.success);
        } else {
          alert(data.error || "Something went wrong");
        }
      });
  };

  // Update a review
  const updateReview = (updatedReview) => {
    fetch(`http://127.0.0.1:5555/ratings/${updatedReview.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(updatedReview),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setReviews(
            reviews.map((review) =>
              review.id === updatedReview.id ? updatedReview : review
            )
          );
          alert(data.message);
        } else {
          alert("Something went wrong");
        }
      });
  };

  // Delete a review
  const deleteReview = (id) => {
    fetch(`http://127.0.0.1:5555/ratings/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setReviews(reviews.filter((review) => review.id !== id));
          alert(data.message);
        } else {
          alert("Something went wrong");
        }
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
