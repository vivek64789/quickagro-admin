import React, { useState } from "react";
import "../Login/Login.css";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";
import axios from "axios";
import { logo, serverUrl } from "../../Utils/server";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer, lightToast } from "../../Components/Toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [codeValidate, setCodeValidated] = useState(false);

  const [emailSent, setEmailSent] = useState(false);

  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const changePassword = () => {
    setLoading(true);
    if (!code) {
      setLoading(false);
      return toast("Enter verification code", lightToast);
    }

    const config = {
      method: "post",
      url: `${serverUrl}/users/forgot-password/change-pass`,
      data: {
        email: email,
        code: parseInt(code),
        password: newPassword,
      },
    };

    axios(config)
      .then((response) => {
        toast("Password Changed!", lightToast);
        setTimeout(() => {
          history.push("/login");
        }, 2000);
        setLoading(true);
      })
      .catch((err) => {
        toast("Something went wrong", lightToast);
        setLoading(false);
      });
  };

  const verifyCode = () => {
    setLoading(true);
    if (!code) {
      setLoading(false);
      return toast("Enter verification code", lightToast);
    }

    const config = {
      method: "post",
      url: `${serverUrl}/users/verify-code`,
      data: {
        email: email,
        code: parseInt(code),
      },
    };

    axios(config)
      .then((response) => {
        setCodeValidated(true);
        setLoading(false);
      })
      .catch((err) => {
        toast("Invalid Code", lightToast);
        setCodeValidated(false);
        setLoading(false);
      });
  };

  function resetForm() {
    setEmail("");
    setLoading(false);
  }

  async function forgotPassword() {
    setLoading(true);
    if (!email) {
      setLoading(false);
      return toast("Please enter your email", lightToast);
    }

    const config = {
      method: "post",
      url: `${serverUrl}/users/forgot-password`,
      data: {
        email: email,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          toast("Email sent!", lightToast);
          setEmailSent(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        resetForm();
        if (err.message === "Request failed with status code 404") {
          toast("User not found", lightToast);
        } else {
          toast("Something went wrong", lightToast);
        }
        setLoading(false);
      });
  }

  return (
    <div className="login-container">
      <div className="form-container">
        <div className="logo-container">
          <img src={logo} alt="Logo" />
          <p>Quick Agro Admin</p>
        </div>
        <p className="title">
          {codeValidate
            ? "Change Password"
            : emailSent
            ? "Verify Email"
            : "Forgot Password"}
        </p>
        <br />
        <p>
          {codeValidate
            ? "Enter new password."
            : emailSent
            ? `Enter the verification code sent to your email ${email}.`
            : "Enter your email to get a verification code."}
        </p>
        <br />
        {codeValidate ? (
          <>
            <div className="input-containers">
              <input
                placeholder="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <button onClick={changePassword}>
              {!loading ? (
                `Change Password`
              ) : (
                <ReactLoading
                  type={"spinningBubbles"}
                  color={"white"}
                  width={"1rem"}
                  height={"1rem"}
                />
              )}
            </button>
          </>
        ) : emailSent ? (
          <>
            <div className="input-containers">
              <input
                placeholder="Verification Code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </div>
            <button onClick={verifyCode}>
              {!loading ? (
                `Verify`
              ) : (
                <ReactLoading
                  type={"spinningBubbles"}
                  color={"white"}
                  width={"1rem"}
                  height={"1rem"}
                />
              )}
            </button>
          </>
        ) : (
          <>
            <div className="input-containers">
              <input
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button onClick={forgotPassword}>
              {!loading ? (
                `Send`
              ) : (
                <ReactLoading
                  type={"spinningBubbles"}
                  color={"white"}
                  width={"1rem"}
                  height={"1rem"}
                />
              )}
            </button>
          </>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default ForgotPassword;
