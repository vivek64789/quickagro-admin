import React, { useState, useEffect } from "react";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import ReactLoading from "react-loading";
import { useHistory, useParams } from "react-router";
import axios from "axios";
import { serverUrl } from "../../Utils/server";

const EditCoupon = () => {
  const { couponId } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [subSubTitle, setSubSubTitle] = useState("");
  const [code, setCode] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [offerValue, setOfferValue] = useState(0);
  const [offerType, setOfferType] = useState("amount");

  useEffect(() => {
    getCouponDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCouponDetails = () => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/coupons/get-coupon-by-id`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        couponId: couponId,
      },
    };

    axios(config)
      .then((response) => {
        setTitle(response.data.title);
        setSubTitle(response.data.subtitle);
        setSubSubTitle(response.data.subsubtitle);
        setCode(response.data.code);
        setOfferType(response.data.offerType);
        setOfferValue(response.data.offerValue);
        setExpiryDate(response.data.expiryDate);
        setLoading(false);
      })
      .catch((err) => {
        toast("Failed to fetch category info", darkToast);
        setLoading(false);
      });
  };

  const updateCoupon = () => {
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
      url: `${serverUrl}/coupons/update`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        couponId: couponId,
        query: {
          title: title,
          subtitle: subTitle,
          subsubtitle: subSubTitle,
          code: code,
          expiryDate: expiryDate,
          offerType: offerType,
          offerValue: offerValue,
        },
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          toast("Coupon updated!", darkToast);

          setTimeout(() => {
            history.push("/coupons");
            window.location.reload();
          }, 1000);
        }
        setLoading(false);
      })
      .catch(() => {
        toast("Something went wrong!", darkToast);
        setLoading(false);
      });
  };

  return (
    <div className="content-body">
      <div className="content-title">
        <p>Edit Category</p>
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
        <select
          value={offerType}
          onChange={(e) => {
            setOfferType(e.target.value);
          }}
        >
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
          value={`${expiryDate.split("T")[0].split("-")[0]}-${
            expiryDate.split("T")[0].split("-")[1]
          }-${expiryDate.split("T")[0].split("-")[2]}`}
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
          updateCoupon();
          // toast("Can't edit Coupon in Demo", darkToast);
        }}>
          {loading ? (
            <ReactLoading
              type={"spinningBubbles"}
              color={"white"}
              width={"1.2rem"}
              height={"1.2rem"}
            />
          ) : (
            "Save"
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default EditCoupon;
