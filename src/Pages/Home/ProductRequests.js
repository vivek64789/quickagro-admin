import React, { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { serverUrl } from "../../Utils/server";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";
import { toast, ToastContainer, darkToast } from "../../Components/Toast";

function ProductRequests() {
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  const [deleteRequest, setDeleteRequest] = useState("");

  useEffect(() => {
    getRequests();
  }, []);

  const getRequests = () => {
    setLoading(true);

    const config = {
      method: "get",
      url: `${serverUrl}/products/request`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config)
      .then((response) => {
        setRequests(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const removeRequest = () => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/products/request/remove`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        requestId: deleteRequest,
      },
    };

    axios(config)
      .then((response) => {
        toast("Product request deleted successfully!", darkToast);
      })
      .catch((err) => {
        toast("Something went wrong", darkToast);
      });

    setDeleteRequest("");
    getRequests();
    setLoading(false);
  };

  return (
    <>
      <Modal
        isOpen={deleteRequest !== ""}
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
          <p className="modalTitle">Delete Product?</p>
          <p className="modalBody">
            Are you sure, want to delete this product request ?
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
              <button onClick={() => setDeleteRequest("")}>Cancel</button>
              <button
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    removeRequest();
                  }, 2000);
                  // toast("Can't delete Product Request in Demo", darkToast);
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
          <p>Product Requests</p>
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
          ) : requests.length === 0 ? (<p>No Product Requests</p>) : (
            <table>
              <tr>
                <th>No.</th>
                <th>Items</th>
                <th>Image</th>
                <th>Requested By</th>
                <th>Requested On</th>
                <th>Delete</th>
              </tr>
              {requests.map((request, index) => {
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <ul style={{textAlign: "left", paddingLeft: "1rem", margin: "1rem" }}>
                        {request.items.map((item) => {
                          return <li style={{padding: "0.5rem"}}>{item}</li>;
                        })}
                      </ul>
                    </td>
                    <td>{!request.image ? "N/A" : <img src={request.image} alt='product-img'/>}</td>
                    <td>
                      {request.user.name}
                      <br />
                      <a href={`mailto:${request.user.email}`}>
                        {request.user.email}
                      </a>
                    </td>
                    <td>{request.date.split("T")[0]}</td>
                    <td>
                      <button onClick={() => setDeleteRequest(request._id)}>
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
    </>
  );
}

export default ProductRequests;
