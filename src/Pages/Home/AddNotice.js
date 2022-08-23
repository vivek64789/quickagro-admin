import axios from "axios";
import React, { useState } from "react";
import { serverUrl } from "../../Utils/server";
import ReactLoading from "react-loading";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import { useHistory } from "react-router";

function AddNotice() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState("admin");
  const [loading, setLoading] = useState(false);

  const history = useHistory();

  const sendNotice = () => {
    if (title === "" || body === "") {
      return toast("Title and Body can't be empty", darkToast);
    }
    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/notices`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        title: title,
        body: body,
        type: type,
      },
    };

    axios(config)
      .then((response) => {
        toast("Notice sent!", darkToast);
        setLoading(false);
        setTimeout(() => {
          history.push("/notices");
          window.location.reload();
        }, 1000);
      })
      .catch((err) => {
        toast("Something went wrong", darkToast);
        setLoading(false);
      });
  };

  return (
    <>
      <div className="content-body">
        <div className="content-title">
          <p>Notices</p>
        </div>
        <div className="form">
          <p>Send To</p>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="admin">Admins</option>
            <option value="client">Clients</option>
            <option value="courier">Couriers</option>
          </select>
          <p>Title</p>
          <input
            type="text"
            placeholder="Notice title"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
          <p>Body</p>
          <input
            type="text"
            placeholder="Notice body"
            onChange={(e) => {
              setBody(e.target.value);
            }}
          />
          <button
            className={loading ? "disabled" : ""}
            onClick={() => {
              sendNotice();
              // toast("Can't send Notice in Demo", darkToast);
            }}
          >
            {loading ? (
              <ReactLoading
                type={"spinningBubbles"}
                color={"white"}
                width={"1.2rem"}
                height={"1.2rem"}
              />
            ) : (
              "Send Notice"
            )}
          </button>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default AddNotice;
