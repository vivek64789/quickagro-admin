import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Route } from "react-router-dom";
import { ToastContainer, toast, darkToast } from "../../Components/Toast";
import ReactLoading from "react-loading";
import { AddCoupon } from "./AddCoupon";
import { serverUrl } from "../../Utils/server";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";
import EditCoupon from "./EditCoupon";
import { currencySymbol } from "../../Utils/currency";

function Coupons() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [coupons, setCoupons] = useState([]);

  const [deleteCoupon, setDeleteCoupon] = useState("");

  useEffect(() => {
    getCoupons();
  }, []);

  const getCoupons = () => {
    setLoading(true);

    const config = {
      method: "get",
      url: `${serverUrl}/coupons/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config).then((response) => {
      setCoupons(response.data);
      setLoading(false);
    });
  };

  const getCouponsByType = (type) => {
    if (type === "all") return getCoupons();
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/coupons/get-coupons-by-type`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        offerType: type,
      },
    };

    axios(config)
      .then((response) => {
        setCoupons(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const removeCoupon = () => {
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/coupons/remove`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        couponId: deleteCoupon._id,
      },
    };

    axios(config)
      .then((response) => {
        toast("Coupon deleted successfully!", darkToast);
        setLoading(false);
      })
      .catch((err) => {
        toast("Something went wrong", darkToast);
        setLoading(false);
      });

    setDeleteCoupon("");
    getCoupons();
  };

  return (
    <>
      <Route exact path="/coupons">
        <Modal
          isOpen={deleteCoupon !== ""}
          style={{
            content: {
              borderRadius: "1rem",
              top: "50%",
              left: "50%",
              right: "auto",
              bottom: "auto",
              marginRight: "-50%",
              transform: "translate(-50%, -50%)",
            },
            overlay: {
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          }}
        >
          <div className="modalContent">
            <p className="modalTitle">Delete Coupon?</p>
            <p className="modalBody">
              Are you sure, want to delete <b>{`${deleteCoupon.title}`}</b> ?
            </p>
            {loading ? (
              <>
                <br />
                <ReactLoading
                  type={"spinningBubbles"}
                  color={"var(--primaryColor)"}
                  width={"2rem"}
                  height={"2rem"}
                />
              </>
            ) : (
              <div className="modalButtonsRow">
                <button onClick={() => setDeleteCoupon("")}>Cancel</button>
                <button
                  onClick={() => {
                    setLoading(true);
                    removeCoupon();
                    // toast("Can't delete Coupon in Demo", darkToast);
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </Modal>
        <div className="content-body">
          <div className="content-title">
            <p>Coupons</p>
            <button
              onClick={() => {
                history.push("/coupons/new");
              }}
            >
              + Add New Coupon
            </button>
          </div>
          <div className="filter-select">
            <p>Offer Type:</p>
            <select onChange={(e) => getCouponsByType(e.target.value)}>
              <option value="all">All</option>
              <option value="amount">Amount</option>
              <option value="percentage">Percentage</option>
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
            ) : coupons.length === 0 ? (
              <p>No Coupons</p>
            ) : (
              <table>
                <tr>
                  <th>No.</th>
                  <th>Title</th>
                  <th>Offer Type</th>
                  <th>
                    Amount
                    <br />/ Percentage
                  </th>
                  <th>Coupon Code</th>
                  <th>Created On</th>
                  <th>Expire On</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
                {coupons.map((coupon, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{coupon.title}</td>
                      <td>
                        {coupon.offerType[0].toUpperCase() +
                          coupon.offerType
                            .toString()
                            .substring(1, coupon.offerType.length)}
                      </td>
                      <td>
                        {coupon.offerType === "amount" ? currencySymbol : ""}
                        {coupon.offerValue}
                      </td>
                      <td>{coupon.code}</td>
                      <td>{coupon.createdOn.split("T")[0]}</td>
                      <td>{coupon.expiryDate.split("T")[0]}</td>
                      <td>
                        <button
                          onClick={() => {
                            history.push(`/coupons/edit/${coupon._id}`);
                          }}
                          style={{
                            background: "white",
                            border: "1px solid var(--primaryColor)",
                          }}
                        >
                          <FontAwesome
                            name="pencil"
                            style={{
                              fontSize: "1rem",
                              color: "var(--primaryColor)",
                            }}
                          />
                        </button>
                      </td>
                      <td>
                        <button onClick={() => setDeleteCoupon(coupon)}>
                          <FontAwesome
                            name="trash"
                            style={{ fontSize: "1rem", color: "white" }}
                          />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </table>
            )}
          </div>
          <ToastContainer />
        </div>
      </Route>
      <Route path="/coupons/new" component={AddCoupon} />
      <Route path="/coupons/edit/:couponId" component={EditCoupon} />
    </>
  );
}

export default Coupons;
