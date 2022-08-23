import React, { useState } from "react";
import "./Login.css";
import "react-toastify/dist/ReactToastify.css";
import ReactLoading from "react-loading";
import axios from "axios";
import { logo, serverUrl } from "../../Utils/server";
import { useHistory } from "react-router-dom";
import { toast, ToastContainer, lightToast } from "../../Components/Toast";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  function resetForm() {
    setUsername("");
    setPassword("");
    setLoading(false);
  }

  async function login() {
    setLoading(true);
    if (!username || !password) {
      setLoading(false);
      return toast("Email and password cannot be empty", lightToast);
    }

    const config = {
      method: "post",
      url: `${serverUrl}/login`,
      data: {
        email: username,
        password: password,
      },
    };

    axios(config)
      .then((response) => {
        if (response.data.type !== "admin") {
          setLoading(false);
          return toast("Unauthorized", lightToast);
        }

        if (response.status === 200) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("name", response.data.name);
          localStorage.setItem("email", response.data.email);
          setLoading(false);
          return history.push("/");
        }
      })
      .catch((err) => {
        resetForm();
        history.push("/login");
        if (err.message === "Request failed with status code 403") {
          toast("Incorrect email or password", lightToast);
        } else {
          toast(err.message, lightToast);
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
        <p className="title">Login</p>
        <br />
        <p>Welcome back, please login to your account.</p>
        <br />
        <div className="input-containers">
          <input
            placeholder="Email"
            type="email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            placeholder="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <a href="./forgot-password">Forgot Password</a>
        </div>
        <button onClick={login}>
          {!loading ? (
            `Login`
          ) : (
            <ReactLoading
              type={"spinningBubbles"}
              color={"white"}
              width={"1rem"}
              height={"1rem"}
            />
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Login;
