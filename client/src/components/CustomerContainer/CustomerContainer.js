import React, { useState } from "react";
import CustomerProductList from "../ProductList/CustomerProductList";
import CustomerOrders from "./CustomerOrders";
import "./CustomerContainer.scss";

const CustomerContainer = (props) => {
  const [isProductsActive, setIsProductsActive] = useState(true);

  return (
    <div className="customer-wrapper">
      <nav className="customer-nav">
        <div className="customer-nav-inner">
          <button
            className={`nav-tab ${isProductsActive ? "active" : ""}`}
            onClick={() => setIsProductsActive(true)}
          >
            🛍️ Shop
          </button>
          <button
            className={`nav-tab ${!isProductsActive ? "active" : ""}`}
            onClick={() => setIsProductsActive(false)}
          >
            📦 My Orders
          </button>
        </div>
      </nav>

      <main className="customer-main">
        {isProductsActive ? <CustomerProductList /> : <CustomerOrders />}
      </main>
    </div>
  );
};

export default CustomerContainer;
