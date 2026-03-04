import React, { useState } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import "./Register.scss";

function Register(props) {
  let [email, setEmail] = useState("");
  let [fname, setFname] = useState("");
  let [lname, setLname] = useState("");
  let [pass, setPass] = useState("");
  const [isAdmin, setAdmin] = useState("0");
  const [error, setError] = useState("");

  const handleUserRegistration = () => {
    if (validateInputs()) {
      const newUser = {
        email: email,
        password: pass,
        isAdmin: isAdmin,
        fname: fname,
        lname: lname,
      };

      let url = `${getBaseURL()}api/users/register`;
      axios
        .post(url, { ...newUser })
        .then((res) => {
          if (res.data != null) {
            console.log("User registered successfully");
            props.navigateToLoginPage();
          }
        })
        .catch((err) => console.log("Sorry unable to add new user"));
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateInputs = () => {
    if (!validateEmail(email)) {
      setError("Please provide a valid email address.");
      return false;
    } else if (fname.trim() === "") {
      setError("Please provide your first name.");
      return false;
    } else if (lname.trim() === "") {
      setError("Please provide your last name.");
      return false;
    } else if (!validatePassword(pass)) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    setError("");
    return true;
  };

  return (
    <div className="register-container">
      <div className="auth-field">
        <label htmlFor="reg-email">Email address</label>
        <input
          id="reg-email"
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />
      </div>

      <div className="auth-field name-row">
        <div>
          <label htmlFor="reg-fname">First name</label>
          <input
            id="reg-fname"
            type="text"
            value={fname}
            onChange={(e) => setFname(e.target.value)}
            placeholder="Jane"
            autoComplete="given-name"
          />
        </div>
        <div>
          <label htmlFor="reg-lname">Last name</label>
          <input
            id="reg-lname"
            type="text"
            value={lname}
            onChange={(e) => setLname(e.target.value)}
            placeholder="Doe"
            autoComplete="family-name"
          />
        </div>
      </div>

      <div className="auth-field">
        <label htmlFor="reg-password">Password</label>
        <input
          id="reg-password"
          type="password"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          placeholder="At least 6 characters"
          autoComplete="new-password"
        />
      </div>

      {error && <div className="auth-error">{error}</div>}

      <div className="role-group">
        <span className="role-label">Account type</span>
        <div className="role-options">
          <label className={`role-option ${isAdmin === "0" ? "selected" : ""}`}>
            <input
              type="radio"
              name="role"
              value="0"
              checked={isAdmin === "0"}
              onChange={() => setAdmin("0")}
            />
            <span>Customer</span>
          </label>
          <label className={`role-option ${isAdmin === "1" ? "selected" : ""}`}>
            <input
              type="radio"
              name="role"
              value="1"
              checked={isAdmin === "1"}
              onChange={() => setAdmin("1")}
            />
            <span>Admin</span>
          </label>
        </div>
      </div>

      <button className="auth-btn" onClick={handleUserRegistration}>
        Create Account
      </button>

      <p className="auth-switch-text">
        Already have an account?{" "}
        <span
          className="auth-switch-link"
          onClick={() => props.navigateToLoginPage()}
        >
          Sign in
        </span>
      </p>
    </div>
  );
}

export default Register;
