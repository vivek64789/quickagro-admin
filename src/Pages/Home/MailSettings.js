import React, { useEffect, useState } from "react";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import ReactLoading from "react-loading";
import axios from "axios";
import { serverUrl } from "../../Utils/server";

function MailSettings() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    getMailSettings();
  }, [])

  const getMailSettings = () => {
    setLoading(true);
    const config = {
      method: "get",
      url: `${serverUrl}/users/get-mail-settings`,
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config)
      .then((response) => {
        setEmail(response.data.email);
        setLoading(false);
      })
      .catch((err) => {
        toast("Something went wrong", darkToast);
        setLoading(false);
      });
  };

  const changeMailSettings = () => {
    if (email === "") return toast("Email can't be empty", darkToast);
    if (password === "") return toast("Password can't be empty", darkToast);

    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/users/change-mail-settings`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        email: email,
        password: password,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          toast("Mail Settings changed!", darkToast);

          setTimeout(() => {
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
        <p>Change Mail Settings</p>
      </div>
      <div className="form">
        <p>Email</p>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <p>Password</p>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <button
          className={loading ? "disabled" : ""}
          onClick={() => {
              changeMailSettings();
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
            "Change Mail Settings"
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default MailSettings;
