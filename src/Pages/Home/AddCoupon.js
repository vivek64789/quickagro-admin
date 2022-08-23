import React, { useState } from "react";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import ReactLoading from "react-loading";
import { useHistory } from "react-router";
import axios from "axios";
import { serverUrl } from "../../Utils/server";

export const AddCoupon = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [subSubTitle, setSubSubTitle] = useState("");
  const [code, setCode] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [offerValue, setOfferValue] = useState(0);
  const [offerType, setOfferType] = useState("amount");

  const [loading, setLoading] = useState(false);

  const addCoupon = () => {
    if (title === "") {
      return toast("Title is required", darkToast);
    } else if (subTitle === "") {
      return toast("Subtitle is required", darkToast);
    } else if (subSubTitle === "") {
      return toast("Sub Subtitle is required", darkToast);
    } else if (code === "") {
      return toast("Coupon Code is required", darkToast);
    } else if (expiryDate === "") {
      return toast("Expiry Date is required", darkToast);
    }

    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/coupons/add`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        title: title,
        subtitle: subTitle,
        subsubtitle: subSubTitle,
        code: code,
        expiryDate: expiryDate,
        offerValue: offerValue,
        offerType: offerType,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          toast("Coupon added!", darkToast);
          setTimeout(() => {
            history.push("/coupons");
            window.location.reload();
          }, 1000);
          setLoading(false);
        }
      })
      .catch(() => {
        toast("Something went wrong!", darkToast);
        setLoading(false);
      });
  };

  return (
    <div className="content-body">
      <div className="content-title">
        <p>Add New Coupon</p>
      </div>
      <div className="form">
        <p>Title</p>
        <input
          type="text"
          value={title}
          placeholder="Title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <p>Subtitle</p>
        <input
          type="text"
          value={subTitle}
          placeholder="Subtitle"
          onChange={(e) => {
            setSubTitle(e.target.value);
          }}
        />
        <p>Sub Subtitle</p>
        <input
          type="text"
          value={subSubTitle}
          placeholder="Sub Subtitle"
          onChange={(e) => {
            setSubSubTitle(e.target.value);
          }}
        />
        <p>Coupon Code</p>
        <input
          type="text"
          value={code}
          placeholder="Coupon Code"
          onChange={(e) => {
            setCode(e.target.value);
          }}
        />
        <p>Offer Type</p>
        <select value={offerType} onChange={(e)=>{setOfferType(e.target.value)}}>
          <option value="amount">Amount</option>
          <option value="percentage">Percentage</option>
        </select>
        <p>Offer Value (Amount / Percentage)</p>
        <input
          type="number"
          min="0"
          value={offerValue}
          placeholder="Offer Percentage"
          onChange={(e) => {
            setOfferValue(e.target.value);
          }}
        />
        <p>Expiry Date</p>
        <input
          type="date"
          placeholder="dd-mm-yyyy"
          min="2021-01-01"
          max="2099-12-31"
          onChange={(e) => {
            const date = e.target.value;
            let expDate = new Date(
              `${date.split("-")[0]}-${date.split("-")[1]}-${
                date.split("-")[2]
              }T00:00:00Z`
            ).toISOString();
            setExpiryDate(expDate);
          }}
        />
        <button onClick={()=>{
          addCoupon();
          // toast("Can't add Coupon in Demo", darkToast);
        }}>
          {loading ? (
            <ReactLoading
              type={"spinningBubbles"}
              color={"white"}
              width={"1.2rem"}
              height={"1.2rem"}
            />
          ) : (
            "Add Coupon"
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};
