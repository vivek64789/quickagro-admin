import React, { useState, useEffect } from "react";
import { AddCategory } from "./AddCategory";
import { Route, useHistory } from "react-router-dom";
import { serverUrl } from "../../Utils/server";
import axios from "axios";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import ReactLoading from "react-loading";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";
import EditCategory from "./EditCategory";

function Categories() {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const [deleteCategory, setDeleteCategory] = useState("");

  useEffect(() => {
    getCategories();
  }, []);

  const getCategories = () => {
    setLoading(true);

    const config = {
      method: "get",
      url: `${serverUrl}/categories/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config).then((response) => {
      setCategories(response.data);
      setLoading(false);
    });
  };

  const removeCategory = () => {
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/categories/remove`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        categoryId: deleteCategory._id,
      },
    };

    axios(config)
      .then((response) => {
        toast("Category deleted successfully!", darkToast);
        setLoading(false);
      })
      .catch((err) => {
        toast("Something went wrong", darkToast);
        setLoading(false);
      });

    setDeleteCategory("");
    getCategories();
  };

  return (
    <>
      <Route exact path="/categories">
        <Modal
          isOpen={deleteCategory !== ""}
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
            <p className="modalTitle">Delete Category?</p>
            <p className="modalBody">
              Are you sure, want to delete <b>{`${deleteCategory.name}`}</b> ?
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
                <button onClick={() => setDeleteCategory("")}>Cancel</button>
                <button
                  onClick={() => {
                    setLoading(true);
                    removeCategory();
                    // toast("Can't delete Category in Demo", darkToast);
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
            <p>Categories</p>
            <button
              onClick={() => {
                history.push("/categories/new");
              }}
            >
              + Add New Category
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
            ) : categories.length === 0 ? (
              <p>No Categories</p>
            ) : (
              <table>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Created On</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
                {categories.map((category, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{category.name}</td>
                      <td>
                        <img src={category.image} alt="" />
                      </td>
                      <td>{category.createdOn.toString().split("T")[0]}</td>
                      <td>
                        <button
                          onClick={() => {
                            history.push(`/categories/edit/${category._id}`);
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
                        <button onClick={() => setDeleteCategory(category)}>
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
      <Route path="/categories/new" component={AddCategory} />
      <Route path="/categories/edit/:categoryId" component={EditCategory} />
    </>
  );
}

export default Categories;
