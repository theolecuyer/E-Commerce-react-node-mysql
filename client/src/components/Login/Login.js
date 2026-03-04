import React, { useState } from "react";
import axios from "axios";
import "./Login.scss";
import { getBaseURL } from "../apiConfig";
import TokenRefresher from "../Utils/token";

function Login(props) {
  let [uname, setUname] = useState("");
  let [password, setPass] = useState("");
  let [error, setError] = useState("");

  function handleClick() {
    if (validateInputs()) {
      const user = { email: uname, password: password };
      let url = `${getBaseURL()}api/users/login`;
      axios
        .post(url, { ...user })
        .then((res) => {
          console.log(res);
          if (res.data.length > 0) {
            console.log("Logged in successfully");
            sessionStorage.setItem("isUserAuthenticated", true);
            const user = res.data[0].isAdmin;
            sessionStorage.setItem("customerId", res.data[0].userId);
            sessionStorage.setItem("isAdmin", user ? true : false);
            sessionStorage.setItem("jwt_token", res.data[0].token);
            sessionStorage.setItem("jwt_refresh_token", res.data[0].refreshToken);
            TokenRefresher(res.data[0].refreshToken);
            props.setUserAuthenticatedStatus(user ? true : false, res.data[0].userId);
          } else {
            setError("Invalid email or password. Please try again.");
          }
        })
        .catch((err) => {
          console.log(err);
          setError("Invalid email or password. Please try again.");
        });
    }
  }

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  function validatePassword(password) {
    return password.length >= 6;
  }

  function validateInputs() {
    if (!validateEmail(uname)) {
      setError("Please provide a valid email address.");
      return false;
    } else if (!validatePassword(password)) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleClick();
  };

  return (
    <div className="login-container">
      <div className="auth-field">
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          type="text"
          value={uname}
          onChange={(e) => setUname(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          value={password}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="At least 6 characters"
          autoComplete="current-password"
        />
      </div>

      {error && <div className="auth-error">{error}</div>}

      <button className="auth-btn" onClick={handleClick}>
        Sign In
      </button>

      <p className="auth-switch-text">
        New to E-Cart?{" "}
        <span
          className="auth-switch-link"
          onClick={() => props.navigateToRegisterPage()}
        >
          Create your account
        </span>
      </p>
    </div>
  );
}

export default Login;
