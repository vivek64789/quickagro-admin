import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import { Route } from "react-router-dom";
import { ToastContainer, toast, darkToast } from "../../Components/Toast";
import ReactLoading from "react-loading";
import { AddBundle } from "./AddBundle";
import { serverUrl } from "../../Utils/server";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";
import EditBundle from "./EditBundle";
import { currencySymbol } from "../../Utils/currency";

function Bundles() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [bundles, setBundles] = useState([]);

  const [deleteBundle, setDeleteBundle] = useState("");

  useEffect(() => {
    getBundles();
  }, []);

  const getBundles = () => {
    setLoading(true);

    const config = {
      method: "get",
      url: `${serverUrl}/bundles/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config).then((response) => {
      setBundles(response.data);
    });

    setLoading(false);
  };

  const removeBundle = () => {
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/bundles/remove`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        bundleId: deleteBundle._id,
      },
    };

    axios(config)
      .then((response) => {
        toast("Bundle deleted successfully!", darkToast);
      })
      .catch((err) => {
        toast("Something went wrong", darkToast);
      });

    setDeleteBundle("");
    getBundles();
    setLoading(false);
  };

  return (
    <>
      <Route exact path="/bundles">
        <Modal
          isOpen={deleteBundle !== ""}
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
            <p className="modalTitle">Delete Bundle?</p>
            <p className="modalBody">
              Are you sure, want to delete <b>{`${deleteBundle.title}`}</b> ?
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
                <button onClick={() => setDeleteBundle("")}>Cancel</button>
                <button
                  onClick={() => {
                    setLoading(true);
                    removeBundle();
                    // toast("Can't delete Bundle in Demo", darkToast);
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
            <p>Bundles</p>
            <button
              onClick={() => {
                history.push("/bundles/new");
              }}
            >
              + Add New Bundle
            </button>
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
            ) : bundles.length === 0 ? (
              <p>No Bundles</p>
            ) : (
              <table>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Stock</th>
                  <th>Price</th>
                  <th>Created On</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
                {bundles.map((bundle, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{bundle.title}</td>
                      <td>
                        <img src={bundle.image} alt="" />
                      </td>
                      <td>{bundle.stock}</td>
                      <td>
                        {currencySymbol}
                        {bundle.price}
                      </td>
                      <td>{bundle.createdOn.split("T")[0]}</td>
                      <td>
                        <button
                          onClick={() => {
                            history.push(`/bundles/edit/${bundle._id}`);
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
                        <button onClick={() => setDeleteBundle(bundle)}>
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
      <Route path="/bundles/new" component={AddBundle} />
      <Route path="/bundles/edit/:bundleId" component={EditBundle} />
    </>
  );
}

export default Bundles;
