import "./LoginRegisterContainer.scss";
import Login from "../Login/Login";
import Register from "../Register/Register";
import { useState } from "react";

function LoginRegisterContainer(props) {
  const [isRegisterUser, setRegisteredUser] = useState(true);

  const navigateToLoginPage = () => setRegisteredUser(true);
  const navigateToRegisterPage = () => setRegisteredUser(false);

  return (
    <div className="auth-page">
      <div className="auth-logo">
        <span className="auth-logo-icon">🛒</span>
        <span className="auth-logo-text">
          E<span className="auth-logo-accent">-</span>Cart
        </span>
      </div>

      <div className="auth-card">
        <div className="auth-tabs">
          <button
            className={`auth-tab ${isRegisterUser ? "active" : ""}`}
            onClick={navigateToLoginPage}
          >
            Sign In
          </button>
          <button
            className={`auth-tab ${!isRegisterUser ? "active" : ""}`}
            onClick={navigateToRegisterPage}
          >
            Create Account
          </button>
        </div>

        <div className="auth-form-wrap">
          {isRegisterUser ? (
            <Login
              navigateToRegisterPage={navigateToRegisterPage}
              setUserAuthenticatedStatus={props.setUserAuthenticatedStatus}
            />
          ) : (
            <Register navigateToLoginPage={navigateToLoginPage} />
          )}
        </div>
      </div>

      <p className="auth-footer">
        &copy; {new Date().getFullYear()} E-Cart. All rights reserved.
      </p>
    </div>
  );
}

export default LoginRegisterContainer;
