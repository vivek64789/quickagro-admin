import React, { useState } from "react";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import ReactLoading from "react-loading";
import { useHistory } from "react-router";
import axios from "axios";
import { serverUrl } from "../../Utils/server";

export const AddUser = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(false);

  const addUser = () => {
    if (name === "") {
      return toast("Name is required", darkToast);
    } else if (email === "") {
      return toast("Email is required", darkToast);
    } else if (password.length < 6 || password.length > 20) {
      return toast(
        "Password should have minimum 6 and maximum 20 characters",
        darkToast
      );
    } else if (type === "") {
      return toast("Select User Type", darkToast);
    } else if (phone === "") {
      return toast("Phone is required", darkToast);
    }

    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/register`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        name: name,
        email: email,
        password: password,
        phone: phone,
        type: type,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          toast("User added!", darkToast);

          setTimeout(() => {
            history.push("/users");
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
        <p>Add New User</p>
      </div>
      <div className="form">
        <p>Name</p>
        <input
          type="text"
          placeholder="Name"
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <p>Email</p>
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <p>Password</p>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <p>Phone</p>
        <input
          type="phone"
          placeholder="Phone"
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        />
        <p>Type</p>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="client">Client</option>
          <option value="courier">Courier</option>
        </select>
        <button onClick={()=>{
          addUser();
          // toast("Can't add User in Demo", darkToast);
        }}>
          {loading ? (
            <ReactLoading
              type={"spinningBubbles"}
              color={"white"}
              width={"1.2rem"}
              height={"1.2rem"}
            />
          ) : (
            "Add User"
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};
