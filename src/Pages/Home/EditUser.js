import React, { useState, useEffect } from "react";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import ReactLoading from "react-loading";
import { useHistory, useParams } from "react-router";
import axios from "axios";
import { serverUrl } from "../../Utils/server";

const EditUser = () => {
  const { userId } = useParams();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [changePassword, setChangePassword] = useState(false);

  useEffect(() => {
    getUserDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserDetails = () => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/users/get-user-by-id`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        userId: userId,
      },
    };

    axios(config)
      .then((response) => {
        setName(response.data.name);
        setEmail(response.data.email);
        setType(response.data.type);
        setPassword("");
        setPhone(response.data.phone);
      })
      .catch((err) => {
        toast("Failed to fetch user info", darkToast);
      });

    setLoading(false);
  };

  const updateUser = () => {
    if(changePassword && (password.length < 6 || password.length > 20)){
      return toast("Password should have minimum 6 and maximum 20 characters", darkToast);
    }

    if (name === "") {
      return toast("Name is required", darkToast);
    } else if (email === "") {
      return toast("Email is required", darkToast);
    }else if (type === "") {
      return toast("Select User Type", darkToast);
    } else if (phone === "") {
      return toast("Phone is required", darkToast);
    }

    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/users/update`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        userId: userId,
        query: {
          name: name,
          email: email,
          type: type,
          password: changePassword ? password : null,
          phone: phone
        },
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          toast("User updated!", darkToast);

          setTimeout(() => {
            history.push("/users");
            window.location.reload();
          }, 1000);
        }
      })
      .catch(() => {
        toast("Something went wrong!", darkToast);
      });
    setLoading(false);
  };

  return (
    <div className="content-body">
      <div className="content-title">
        <p>Edit User</p>
      </div>
      <div className="form">
        <p>Name</p>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <p>Email</p>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
        />
        <p>Password</p>
        {changePassword ? (
          <>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          <button style={{marginBottom: "1rem"}} onClick={()=> setChangePassword(false)}>Cancel</button></>
        ) : (
          <button style={{marginBottom: "1rem"}} onClick={() => setChangePassword(true)}>Change Password</button>
        )}
        <p>Type</p>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="admin">Admin</option>
          <option value="client">Client</option>
          <option value="courier">Courier</option>
        </select>
        <p>Phone</p>
        <input
          type="phone"
          placeholder="Phone"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
          }}
        />
        <button onClick={()=>{
          updateUser();
          // toast("Can't edit User in Demo", darkToast);
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

export default EditUser;
