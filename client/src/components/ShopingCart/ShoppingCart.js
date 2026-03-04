import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import "./ShoppingCart.scss";

const ShoppingCart = (props) => {
  const [cartProducts, setCartProducts] = useState(props.cartProducts);
  const customerId = sessionStorage.getItem("customerId");

  useEffect(() => {
    axios
      .get(`${getBaseURL()}api/cart/${customerId}`)
      .then((res) => {
        setCartProducts(res.data);
      })
      .catch((err) => console.log("Error occurred"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.cartProducts]);

  const totalPrice =
    cartProducts?.reduce(
      (sum, p) => sum + parseFloat(p.price) * p.quantity,
      0
    ) || 0;

  const itemCount =
    cartProducts?.reduce((sum, p) => sum + p.quantity, 0) || 0;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>
          🛒 Cart
          {itemCount > 0 && (
            <span className="cart-badge">{itemCount}</span>
          )}
        </h2>
      </div>

      {cartProducts?.length > 0 ? (
        <div className="cart-body">
          <div className="cart-items">
            {cartProducts.map((product) => (
              <div key={product.productId} className="cart-item">
                <div className="cart-item-info">
                  <span className="cart-item-name">{product.name}</span>
                  <span className="cart-item-qty">Qty: {product.quantity}</span>
                </div>
                <div className="cart-item-right">
                  <span className="cart-item-price">
                    ${(parseFloat(product.price) * product.quantity).toFixed(2)}
                  </span>
                  <button
                    className="cart-remove-btn"
                    title="Remove from cart"
                    onClick={() => props.removeProduct(product.productId)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-divider" />

          <div className="cart-total">
            <span>
              Subtotal ({itemCount} item{itemCount !== 1 ? "s" : ""})
            </span>
            <span className="total-price">${totalPrice.toFixed(2)}</span>
          </div>

          <div className="cart-checkout">
            <input
              type="text"
              className="address-input"
              placeholder="Delivery address..."
              value={props.address}
              onChange={(e) => props.updateAddress(e.target.value)}
            />
            <button className="checkout-btn" onClick={props.buyProducts}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <p>Your cart is empty.</p>
          <p className="cart-empty-hint">
            Add items from the products list.
          </p>
        </div>
      )}
    </div>
  );
};

export default ShoppingCart;
