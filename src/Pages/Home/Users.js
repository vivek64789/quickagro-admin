import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Route } from "react-router-dom";
import { ToastContainer, toast, darkToast } from "../../Components/Toast";
import ReactLoading from "react-loading";
import { serverUrl } from "../../Utils/server";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";
import EditUser from "./EditUser";
import { AddUser } from "./AddUser";

function Users() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);

  const [deleteUser, setDeleteUser] = useState("");
  const [searchUserEmail, setSearchUserEmail] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = () => {
    setLoading(true);

    const config = {
      method: "get",
      url: `${serverUrl}/users/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getUsersByType = (type) => {
    if (type === "all") return getUsers();
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/users/get-users-by-type`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        type: type,
      },
    };

    axios(config)
      .then((response) => {
        setUsers(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const removeUser = () => {
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/users/remove`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        userId: deleteUser._id,
      },
    };

    axios(config)
      .then((response) => {
        toast("User deleted successfully!", darkToast);
        setLoading(false);
        setDeleteUser("");
        window.location.reload();
      })
      .catch((err) => {
        toast("Something went wrong", darkToast);
        setLoading(false);
      });
  };

  return (
    <>
      <Route exact path="/users">
        <Modal
          isOpen={deleteUser !== ""}
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
            <p className="modalTitle">Delete User?</p>
            <p className="modalBody">
              Are you sure, want to delete{" "}
              <b>
                {`${deleteUser.name}`} ({deleteUser.email})
              </b>{" "}
              ?
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
                <button onClick={() => setDeleteUser("")}>Cancel</button>
                <button
                  onClick={() => {
                    setLoading(true);
                    removeUser();
                    // toast("Can't delete User in Demo", darkToast);
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
            <p>Users</p>
            <button
              onClick={() => {
                history.push("/users/new");
              }}
            >
              + Add New User
            </button>
          </div>
          <div className="filter-select">
            <p>User Type:</p>
            <select onChange={(e) => getUsersByType(e.target.value)}>
              <option value="all">All</option>
              <option value="admin">Admin</option>
              <option value="client">Client</option>
              <option value="courier">Courier</option>
            </select>
            <input
              type="text"
              placeholder="Search users or email"
              onChange={(e) => setSearchUserEmail(e.target.value)}
            />
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
            ) : (
              <table>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Type</th>
                  <th>Joined On</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
                {users.map((user, index) => {
                  return !user.name
                    .toLowerCase()
                    .includes(searchUserEmail.toLowerCase()) &&
                    !user.email
                      .toLowerCase()
                      .includes(searchUserEmail.toLowerCase()) ? (
                    ""
                  ) : (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>
                        <div className="user-list-tile" onClick={() => {}}>
                          <div className="profile-circle">
                            <img src={user.profilePic} alt="" />
                          </div>
                          <p>{user.name}</p>
                        </div>
                      </td>
                      <td>
                        <a href={"mailto:" + user.email}>{user.email}</a>
                      </td>
                      <td>
                        {user.type[0].toUpperCase() +
                          user.type.toString().substring(1, user.type.length)}
                      </td>
                      <td>{user.joinedOn.split("T")[0]}</td>
                      <td>
                        <button
                          onClick={() => {
                            history.push(`/users/edit/${user._id}`);
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
                        <button onClick={() => setDeleteUser(user)}>
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
      <Route path="/users/new" component={AddUser} />
      <Route path="/users/edit/:userId" component={EditUser} />
    </>
  );
}

export default Users;
