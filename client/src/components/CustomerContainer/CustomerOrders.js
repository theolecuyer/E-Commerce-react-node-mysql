import React, { useEffect, useState } from "react";
import axios from "axios";
import { getBaseURL } from "../apiConfig";
import "./CustomerOrders.scss";

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const CustomerOrders = () => {
  const [pastOrders, setPastOrders] = useState([]);
  const customerId = sessionStorage.getItem("customerId");

  useEffect(() => {
    axios
      .get(`${getBaseURL()}api/orders/myPastOrders/${customerId}`)
      .then((res) => {
        setPastOrders(res.data);
      })
      .catch((err) => {
        console.log("error");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="orders-container">
      <h2 className="orders-title">My Orders</h2>

      {pastOrders.length === 0 ? (
        <div className="orders-empty">
          <div className="orders-empty-icon">📦</div>
          <p>You haven&apos;t placed any orders yet.</p>
          <p className="orders-empty-hint">
            Head over to the Shop tab to find something you love!
          </p>
        </div>
      ) : (
        <div className="orders-table-wrap">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order #</th>
                <th>Product</th>
                <th>Date</th>
                <th>Qty</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {pastOrders.map((order) => (
                <tr key={`${order.orderId}-${order.name}`}>
                  <td className="order-id">#{order.orderId}</td>
                  <td>{order.name}</td>
                  <td>{formatDate(order.createdDate)}</td>
                  <td>{order.quantity}</td>
                  <td>${parseFloat(order.totalPrice).toFixed(2)}</td>
                  <td>
                    <span className="status-badge delivered">Delivered</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
