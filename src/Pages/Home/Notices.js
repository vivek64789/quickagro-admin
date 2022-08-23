import React, { useState, useEffect } from "react";
import { Route, useHistory } from "react-router-dom";
import { serverUrl } from "../../Utils/server";
import axios from "axios";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import ReactLoading from "react-loading";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";
import AddNotice from "./AddNotice";

function Notices() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState([]);

  const [deleteNotice, setDeleteNotice] = useState("");
  const [deleteNotices, setDeleteNotices] = useState(false);

  useEffect(() => {
    getNotices();
  }, []);

  const getNotices = () => {
    setLoading(true);

    const config = {
      method: "get",
      url: `${serverUrl}/notices/all`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config).then((response) => {
      setNotices(response.data);
      setLoading(false);
    });
  };

  const removeNotice = () => {
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/notices/remove`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        noticeId: deleteNotice._id,
      },
    };

    axios(config)
      .then((response) => {
        toast("Notice deleted successfully!", darkToast);
        setLoading(false);
        window.location.reload();
      })
      .catch((err) => {
        toast("Something went wrong", darkToast);
        setLoading(false);
      });
  };

  const deleteAllNotices = () => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/notices/delete-all`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config)
      .then((response) => {
        toast("All Notices deleted!", darkToast);
        setLoading(false);
        window.location.reload();
      })
      .catch((err) => {
        toast("Something went wrong", darkToast);
        setLoading(false);
      });
  };

  return (
    <>
      <Route exact path="/notices">
        <Modal
          isOpen={deleteNotices}
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
            <p className="modalTitle">Delete All Notices?</p>
            <p className="modalBody">
              Are you sure, want to delete all notices ? This can't be undone.
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
                <button onClick={() => setDeleteNotices(false)}>Cancel</button>
                <button
                  onClick={() => {
                    setDeleteNotices(false);
                    deleteAllNotices();
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </Modal>
        <Modal
          isOpen={deleteNotice !== ""}
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
            <p className="modalTitle">Delete Notice?</p>
            <p className="modalBody">
              Are you sure, want to delete this notice ?
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
                <button onClick={() => setDeleteNotice("")}>Cancel</button>
                <button
                  onClick={() => {
                    setLoading(true);
                    removeNotice();
                    // toast("Can't delete Notice in Demo", darkToast);
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
            <p>Notices</p>
            <div style={{ display: "flex" }}>
              <button
                onClick={() => {
                  setDeleteNotices(true);
                }}
                style={{ marginRight: "1rem" }}
              >
                Delete All Notices
              </button>
              <button
                onClick={() => {
                  history.push("/notices/new");
                }}
              >
                + Create New Notice
              </button>
            </div>
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
            ) : notices.length === 0 ? (
              <p>No Notices</p>
            ) : (
              <table>
                <tr>
                  <th>No.</th>
                  <th>Title</th>
                  <th>Body</th>
                  <th>To</th>
                  <th>Created On</th>
                  <th>Delete</th>
                </tr>
                {notices.map((notice, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{notice.title}</td>
                      <td>{notice.body}</td>
                      <td>
                        {notice.type[0].toUpperCase()}
                        {notice.type.substring(1, notice.type.length)}s
                      </td>
                      <td>{notice.createdOn.toString().split("T")[0]}</td>
                      <td>
                        <button onClick={() => setDeleteNotice(notice)}>
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
      <Route path="/notices/new" component={AddNotice} />
    </>
  );
}

export default Notices;
