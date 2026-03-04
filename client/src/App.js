import "./App.scss";
import { useState } from "react";
import LoginRegisterForm from "./components/LoginRegisterContainer/LoginRegisterContainer";
import AdminCustomerContainer from "./components/AdminCustomerContainer/AdminCustomerContainer";

function App() {
  let [isUserAuthenticated, setUserAuthorization] = useState(
    sessionStorage.getItem("isUserAuthenticated") === "true" || false
  );
  let [isAdmin, setAdmin] = useState(
    sessionStorage.getItem("isAdmin") === "true" || false
  );
  let [customerId, setCustomerId] = useState(
    sessionStorage.getItem("customerId") || undefined
  );

  const setUserAuthenticatedStatus = (isAdmin, customerId) => {
    setUserAuthorization(true);
    setAdmin(isAdmin);
    setCustomerId(customerId);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("isUserAuthenticated");
    sessionStorage.removeItem("isAdmin");
    sessionStorage.removeItem("customerId");
    sessionStorage.removeItem("jwt_token");
    sessionStorage.removeItem("jwt_refresh_token");
    setUserAuthorization(false);
    setAdmin(false);
    setCustomerId(undefined);
  };

  return (
    <div className="app">
      {!isUserAuthenticated ? (
        <LoginRegisterForm setUserAuthenticatedStatus={setUserAuthenticatedStatus} />
      ) : (
        <>
          <header className="app-header">
            <div className="header-logo">
              <span className="logo-icon">🛒</span>
              <span className="logo-text">
                E<span className="logo-accent">-</span>Cart
              </span>
            </div>

            <div className="header-search">
              <input
                type="text"
                placeholder="Search products, brands and more..."
                readOnly
              />
              <button className="search-btn">🔍</button>
            </div>

            <div className="header-right">
              <div className="header-account">
                <span className="account-greeting">
                  Hello, {isAdmin ? "Admin" : "Customer"}
                </span>
                <span className="account-label">Account &amp; Lists</span>
              </div>
              <button className="header-logout-btn" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          </header>

          <AdminCustomerContainer isAdmin={isAdmin} customerId={customerId} />
        </>
      )}
    </div>
  );
}

export default App;
