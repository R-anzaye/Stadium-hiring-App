// UserProvider Component
import React, { useState, useEffect, createContext } from "react";
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
  const [isAdmin, setIsAdmin] = useState(false);

  const fetchUser = async () => {
    if (authToken) {
      try {
        const res = await fetch('http://127.0.0.1:5555/current_user', {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            // Token might be expired
            logout();
          }
          throw new Error(res.statusText);
        }

        const user = await res.json();
        setCurrentUser(user);
        setIsAdmin(user.is_admin); // Adjust according to your user data structure
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to fetch user. Please try again later.");
        setCurrentUser(null);
        setIsAdmin(false);
      }
    } else {
      setCurrentUser(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [authToken]);

  const register = async (username, email, password) => {
    try {
      const res = await fetch('http://127.0.0.1:5555/users', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.success);
        nav("/");
        return data;
      } else if (data.error) {
        toast.error(data.error);
        return null;
      } else {
        toast.error("Something went wrong");
        return null;
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Registration failed. Please try again later.");
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('http://127.0.0.1:5555/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.access_token) {
        setAuthToken(data.access_token);
        localStorage.setItem("token", data.access_token);
        await fetchUser();

        if (data.user.is_admin) {
          nav("/admin");
        } else {
          nav("/");
        }

        toast.success("Login success");
        return data;
      } else if (data.error) {
        toast.error(data.error);
        return null;
      } else {
        toast.error("Something went wrong");
        return null;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again later.");
      return null;
    }
  };

  const logout = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5555/logout', {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const data = await res.json();

      if (data.success) {
        setAuthToken(null);
        setCurrentUser(null);
        setIsAdmin(false);
        localStorage.removeItem("token");
        toast.success("Logout success");
        nav("/");
      } else {
        toast.error("Logout failed: Server response was not successful.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Something went wrong during logout.");
    }
  };

  const contextData = {
    authToken,
    currentUser,
    isAdmin,
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
