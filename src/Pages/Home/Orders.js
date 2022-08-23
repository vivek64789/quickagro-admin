import React, { useState, useEffect } from "react";
import { serverUrl } from "../../Utils/server";
import axios from "axios";
import { Route, useHistory } from "react-router";
import ReactLoading from "react-loading";
import { currencySymbol } from "../../Utils/currency";
import FontAwesome from "react-fontawesome";
import ViewOrder from "./ViewOrder";

function Orders() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders();
  }, []);

  const getOrders = () => {
    setLoading(true);

    const config = {
      method: "get",
      url: `${serverUrl}/orders/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config).then((response) => {
      setOrders(response.data);
      setLoading(false);
    });
  };

  const getOrdersByQuery = (status) => {
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/orders/get-orders-by-query`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        query:
          status === "all"
            ? {}
            : {
                status: status,
              },
      },
    };

    axios(config)
      .then((response) => {
        setOrders(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  return (
    <>
      <Route exact path="/orders">
        <div className="content-body">
          <div className="content-title">
            <p>Orders</p>
          </div>
          <div className="filter-select">
            <p>Order Status:</p>
            <select
              onChange={(e) => {
                getOrdersByQuery(e.target.value);
              }}
            >
              <option value="all">All</option>
              <option value="Ordered">Ordered</option>
              <option value="Processing">Processing</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Order Cancelled">Cancelled by Client</option>
              <option value="Order Cancelled by Admin">
                Cancelled by Admin
              </option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
          <div
            style={{
              height: loading ? "70vh" : "",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <ReactLoading
                type={"spinningBubbles"}
                color={"var(--primaryColor)"}
                width={"4rem"}
                height={"4rem"}
              />
            ) : orders.length === 0 ? (
              <p>No Orders</p>
            ) : (
              <table>
                <tr>
                  <th>Order Id</th>
                  <th>Ordered On</th>
                  <th>Client</th>
                  <th>Payment Method</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Courier</th>
                  <th>Status</th>
                  <th>Order Details</th>
                </tr>
                {orders.map((order, index) => {
                  return (
                    <tr key={index}>
                      <td>{order.orderId}</td>
                      <td>{order.date.split("T")[0]}</td>
                      <td>{order.clientName}</td>
                      <td>{order.paymentMethod}</td>
                      <td>{order.items.length}</td>
                      <td>
                        {currencySymbol}
                        {order.totalPrice}
                      </td>
                      <td>
                        {order.courier && order.courier.name ? (
                          order.courier.name
                        ) : (
                          <i style={{ color: "grey" }}>Not assigned</i>
                        )}
                      </td>
                      <td>
                        <span
                          className={`orderstatus ${
                            order.status.includes("Cancelled")
                              ? "cancelled "
                              : order.status.includes("Ordered")
                              ? "ordered "
                              : order.status.includes("Processing")
                              ? "processing "
                              : order.status.includes("Out for delivery")
                              ? "out-for-delivery "
                              : order.status.includes("Delivered")
                              ? "delivered "
                              : ""
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            history.push(`/orders/view/${order._id}`);
                          }}
                          style={{
                            background: "white",
                            border: "1px solid var(--primaryColor)",
                          }}
                        >
                          <FontAwesome
                            name="arrow-right"
                            style={{
                              fontSize: "1rem",
                              color: "var(--primaryColor)",
                            }}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </table>
            )}
          </div>
        </div>
      </Route>
      <Route path="/orders/view/:orderId" component={ViewOrder} />
    </>
  );
}

export default Orders;
