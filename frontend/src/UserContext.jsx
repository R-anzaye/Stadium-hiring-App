import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const nav = useNavigate();

  const [authToken, setAuthToken] = useState(() =>
    localStorage.getItem("token") ? localStorage.getItem("token") : null
  );

  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);  // Add isAdmin state- added line 

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
          nav("/");
          return res;
        } else if (res.error) {
          alert(res.error);
          return null;
        } else {
          alert("Something went wrong");
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
          nav("/");
          
          return res;
        } else if (res.error) {
          alert(res.error);
          return null;
        } else {
          alert("Something went wrong");
          return null;
        }
      });
  };

  // Logout User
  const logout = () => {
    fetch("http://127.0.0.1:5555/logout", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`, 
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setAuthToken(null);
          localStorage.removeItem("token");
          nav("/");
        } else {
          alert("Something went wrong");
        }
      });
  };

  useEffect(() => {
    if (authToken) {
      fetch("http://127.0.0.1:5555/current_user", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`, 
        },
      })
        .then((res) => res.json())
        .then((res) => {
          setCurrentUser(res);
        });
    } else {
      setCurrentUser(null);
      setIsAdmin(false);
    }
  }, [authToken]);

  const contextData = {
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