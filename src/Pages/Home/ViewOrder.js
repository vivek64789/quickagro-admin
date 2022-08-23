import React, { useState, useEffect } from "react";
import { serverUrl } from "../../Utils/server";
import axios from "axios";
import { useParams } from "react-router";
import ReactLoading from "react-loading";
import { currencySymbol } from "../../Utils/currency";
import { toast, ToastContainer, darkToast } from "../../Components/Toast";
import FontAwesome from "react-fontawesome";

function ViewOrder() {
  const { orderId } = useParams();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState([]);
  const [couriers, setCouriers] = useState([]);

  useEffect(() => {
    getOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getOrderDetails = () => {
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/orders/get-order-by-id`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        orderObjId: orderId,
      },
    };

    axios(config)
      .then((response) => {
        setOrder(response.data);
        getCouriers();
      })
      .catch((err) => {
        toast("Failed to fetch order info", darkToast);
        setLoading(false);
      });
  };

  const getCouriers = () => {
    const config = {
      method: "get",
      url: `${serverUrl}/users/couriers`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config)
      .then((response) => {
        setCouriers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        toast("Failed to fetch courier info", darkToast);
        setLoading(false);
      });
  };

  const updateOrderStatus = (status) => {
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/orders/update-status`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        orderObjId: orderId,
        status: status,
      },
    };

    axios(config)
      .then((response) => {
        toast("Order status updated!", darkToast);
        setLoading(false);
        window.location.reload();
      })
      .catch((err) => {
        toast("Failed to update order status", darkToast);
        setLoading(false);
      });
  };

  const assignCourier = (courierIndex) => {
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/orders/assign-courier`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        orderId: order._id,
        courier: couriers[courierIndex],
      },
    };

    axios(config)
      .then((response) => {
        toast("Courier assigned!", darkToast);
        setLoading(false);
        window.location.reload();
      })
      .catch((err) => {
        toast("Failed to assign courier", darkToast);
        setLoading(false);
      });
  };

  const unassignCourier = () => {
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/orders/unassign-courier`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        orderId: order._id,
      },
    };

    axios(config)
      .then((response) => {
        toast("Courier unassigned", darkToast);
        setLoading(false);
        window.location.reload();
      })
      .catch((err) => {
        toast("Failed to unassign courier", darkToast);
        setLoading(false);
      });
  };

  return (
    <div className="content-body">
      <div className="content-title">
        <p>Order Details</p>
      </div>
      {loading ? (
        <ReactLoading
          type={"spinningBubbles"}
          color={"var(--primaryColor)"}
          width={"4rem"}
          height={"4rem"}
        />
      ) : (
        <div>
          <table className="order-details-table">
            {order?.status?.includes("Order Cancelled") ||
            order?.status?.includes("Delivered") ? (
              ""
            ) : (
              <>
                <tr>
                  <td>
                    <b>Update Status</b>
                  </td>
                  <td>
                    <select
                      onChange={(e) => {
                        updateOrderStatus(e.target.value);
                        // toast("Can't update Order Status in Demo", darkToast);
                      }}
                    >
                      <option value="" defaultValue></option>
                      <option value="Processing">Processing</option>
                      <option value="Out for delivery">Out for delivery</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>
                    <b>Courier</b>
                  </td>
                  <td>
                    {!order.courier ? (
                      ""
                    ) : (
                      <>
                        <text
                          style={{
                            marginRight: "1rem",
                          }}
                        >
                          {order.courier.name}
                        </text>
                        <button
                          onClick={() => {
                            unassignCourier();
                            // toast("Can't unasign Courier in Demo", darkToast);
                          }}
                          style={{
                            marginRight: "1rem",
                          }}
                        >
                          <FontAwesome name="trash" />
                        </button>
                      </>
                    )}
                    <select
                      onChange={(e) => {
                        assignCourier(e.target.value);
                        // toast("Can't assign Courier in Demo", darkToast);
                      }}
                    >
                      <option value="" defaultValue></option>
                      {couriers.map((courier, index) => {
                        return <option value={index}>{courier.name}</option>;
                      })}
                    </select>
                  </td>
                </tr>
              </>
            )}
            <tr>
              <td>
                <b>Order Id</b>
              </td>
              <td>{order.orderId}</td>
            </tr>
            <tr>
              <td>
                <b>Ordered On</b>
              </td>
              <td>{order.date.split("T")[0]}</td>
            </tr>
            <tr>
              <td>
                <b>Client Name</b>
              </td>
              <td>{order.clientName}</td>
            </tr>
            <tr>
              <td>
                <b>Items</b>
              </td>
              <td>{order.items.length}</td>
            </tr>
            <tr>
              <td>
                <b>Amount</b>
              </td>
              <td>
                {currencySymbol}
                {order.totalPrice}
              </td>
            </tr>
            <tr>
              <td>
                <b>Payment Method</b>
              </td>
              <td>{order.paymentMethod}</td>
            </tr>
            <tr>
              <td>
                <b>Status</b>
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
            </tr>
            {order.status.includes("Delivered") ? (
              <tr>
                <td>
                  <b>Courier</b>
                </td>
                <td>{order.courier.name}</td>
              </tr>
            ) : (
              ""
            )}
            <tr>
              <td>
                <b>Delivery Address</b>
              </td>
              <td>{order.address}</td>
            </tr>
            <tr>
              <td>
                <b>Preferred Delivery Time</b>
              </td>
              <td>{order.preferredDeliveryDate} {order.preferredDeliveryTime}</td>
            </tr>
            <tr>
              <td>
                <b>Phone Number</b>
              </td>
              <td>{order.phone}</td>
            </tr>
          </table>

          <hr />
          <br />
          <div className="content-title">
            <p>Ordered Items</p>
          </div>
          <table>
            <tr>
              <th>No.</th>
              <th>Name</th>
              <th>Image</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
            {order.items.map((item, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.title}</td>
                  <td>
                    <img src={item.images[0]} alt="" />
                  </td>
                  <td>{item.isBundle ? "Bundle" : "Product"}</td>
                  <td>{item.quantity}</td>
                  <td>
                    {currencySymbol}
                    {item.price}
                  </td>
                  <td>
                    {currencySymbol}
                    {item.price * item.quantity}
                  </td>
                </tr>
              );
            })}
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <b>Total Amount</b>
              </td>
              <td>
                <b>
                  {currencySymbol}
                  {order.totalPrice + order.discountAmount}
                </b>
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <b>Discount Applied</b>
              </td>
              <td>
                <b>
                  -{currencySymbol}
                  {order.discountAmount}
                </b>
              </td>
            </tr>
            <tr>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td></td>
              <td>
                <b>Grand Total</b>
              </td>
              <td>
                <b>
                  {currencySymbol}
                  {order.totalPrice}
                </b>
              </td>
            </tr>
          </table>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default ViewOrder;
