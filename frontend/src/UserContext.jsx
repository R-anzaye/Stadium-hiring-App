import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const UserContext = createContext();
export const UserProvider = ({ children }) => {
  const nav = useNavigate();

  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );

  const [currentUser, setCurrentUser] = useState(null);

  const fetchUser = () => {
    if (authToken) {
      return fetch("http://127.0.0.1:5555/current_user", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })
        .then((res) => res.json())
        .then((user) => {
          setCurrentUser(user);
        });
    }
  };

  useEffect(() => {
    fetchUser();
  }, [authToken]);

  // Register User
  const register = (username, email, password) => {
    return fetch("http://127.0.0.1:5555/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          toast.success(res.success);
          nav("/");
          return res;
        } else if (res.error) {
          toast.error(res.error);
          return null;
        } else {
          toast.error("Something went wrong");
          return null;
        }
      });
  };

  // Login User
  const login = (email, password) => {
    return fetch("http://127.0.0.1:5555/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.access_token) {
          setAuthToken(res.access_token);
          localStorage.setItem("token", res.access_token);
          fetchUser();
          toast.success("Login success");
          nav("/");
          return res;
        } else if (res.error) {
          toast.error(res.error);
          return null;
        } else {
          toast.error("Something went wrong");
          return null;
        }
      });
  };

  const logout = () => {
    fetch("http://127.0.0.1:5555/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((res) => {
        if (res.success) {
          setAuthToken(null);
          setCurrentUser(null);
          localStorage.removeItem("token");
          toast.success("Logout success");
          nav("/");
        } else {
          toast.error("Logout failed: Server response was not successful.");
        }
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Something went wrong during logout.");
      });
  };

  const contextData = {
    authToken,
    currentUser,
    register,
    login,
    logout,
  };

  return (
    <UserContext.Provider value={contextData}>
      {children}
    </UserContext.Provider>
  );
};
