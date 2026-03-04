import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import ShoppingCart from "../ShopingCart/ShoppingCart";
import "./CustomerProductList.scss";

/* ── Helpers ── */
const RATINGS = [4.1, 4.3, 4.5, 3.9, 4.7, 4.2, 4.6, 3.8, 4.4, 4.0];

const getProductRating = (id) => RATINGS[(id - 1) % RATINGS.length];

const getReviewCount = (id) => 50 + (id * 137) % 950;

const StarRating = ({ productId }) => {
  const rating = getProductRating(productId);
  const fullStars = Math.floor(rating);
  const count = getReviewCount(productId);
  return (
    <div className="star-rating">
      <span className="stars">
        {"★".repeat(fullStars)}{"☆".repeat(5 - fullStars)}
      </span>
      <span className="review-count">({count})</span>
    </div>
  );
};

/* ── Product Card ── */
const ProductCard = ({ product, onAddToCart, onUpdateQuantity }) => {
  const imageUrl = `https://picsum.photos/seed/${product.productId + 42}/400/300`;

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img
          src={imageUrl}
          alt={product.name}
          className="product-image"
          loading="lazy"
        />
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <StarRating productId={product.productId} />
        <div className="product-price">${parseFloat(product.price).toFixed(2)}</div>
        {product.description && (
          <p className="product-description">{product.description}</p>
        )}
        <div className="product-actions">
          <div className="quantity-control">
            <label htmlFor={`qty-${product.productId}`}>Qty:</label>
            <input
              id={`qty-${product.productId}`}
              type="number"
              value={product.quantity}
              min="0"
              className="qty-input"
              onChange={(e) => onUpdateQuantity(e, product.productId)}
            />
          </div>
          <button
            className="add-to-cart-btn"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ── */
const ProductListCustomer = () => {
  const [productList, setProductList] = useState([]);
  const [cartProducts, setCartProducts] = useState([]);
  const customerId = sessionStorage.getItem("customerId");
  const [address, setAddress] = useState("");

  useEffect(() => {
    axios
      .get(`${getBaseURL()}api/products`)
      .then((res) => {
        res.data.forEach((product) => {
          product.quantity = 0;
        });
        axios
          .get(`${getBaseURL()}api/cart/${customerId}`)
          .then((responseCart) => {
            setCartProducts(responseCart.data);
            setProductList(res.data);
          })
          .catch((err) => console.log("Error occurred"));
      })
      .catch((err) => console.log("Error"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addToCart = (product) => {
    if (product.quantity > 0) {
      let updatedCartList = [...cartProducts];
      let existingIdx = updatedCartList.findIndex(
        (p) => p.productId === product.productId
      );

      if (existingIdx !== -1) {
        updatedCartList[existingIdx].quantity += product.quantity;
      } else {
        updatedCartList.push({ ...product });
      }

      axios
        .post(`${getBaseURL()}api/cart/add`, {
          customerId,
          productId: product.productId,
          quantity: product.quantity,
          isPresent: existingIdx !== -1,
        })
        .then(() => {
          setCartProducts(updatedCartList);
          setProductList(productList.map((p) => ({ ...p, quantity: 0 })));
        })
        .catch((error) => console.log("Error adding to cart:", error));
    }
  };

  const removeProduct = (productId) => {
    axios
      .delete(`${getBaseURL()}api/cart/remove/${productId}/${customerId}`)
      .then(() => {
        setCartProducts(cartProducts.filter((p) => p.productId !== productId));
      })
      .catch((err) => console.log("Error occurred"));
  };

  const updateProductQuantity = (e, productId) => {
    setProductList(
      productList.map((p) =>
        p.productId === productId
          ? { ...p, quantity: parseInt(e.target.value) || 0 }
          : p
      )
    );
  };

  const buyProducts = () => {
    const token = sessionStorage.getItem("jwt_token");
    if (!token) {
      alert("Authorization token is missing");
      return;
    }
    if (address === "") {
      alert("Please enter your delivery address");
      return;
    }
    axios
      .post(
        `${getBaseURL()}api/cart/buy/${customerId}`,
        { address },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setCartProducts([]);
        setAddress("");
        alert("Order placed successfully!");
      })
      .catch((error) => {
        if (error.response?.status === 401) {
          alert("Authorization failed. Please log in again.");
        } else {
          console.error("Error:", error);
        }
      });
  };

  return (
    <div className="shop-layout">
      <div className="products-area">
        <div className="products-header">
          <h2>
            Results{" "}
            <span className="results-count">
              ({productList.length} item{productList.length !== 1 ? "s" : ""})
            </span>
          </h2>
        </div>
        <div className="products-grid">
          {productList.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              onAddToCart={addToCart}
              onUpdateQuantity={updateProductQuantity}
            />
          ))}
        </div>
      </div>

      <aside className="cart-sidebar">
        <ShoppingCart
          cartProducts={cartProducts}
          removeProduct={removeProduct}
          buyProducts={buyProducts}
          address={address}
          updateAddress={setAddress}
        />
      </aside>
    </div>
  );
};

export default ProductListCustomer;
