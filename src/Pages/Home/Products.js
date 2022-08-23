import React, { useEffect, useState } from "react";
import { Route, useHistory } from "react-router";
import AddProduct from "./AddProduct";
import ReactLoading from "react-loading";
import { serverUrl } from "../../Utils/server";
import axios from "axios";
import FontAwesome from "react-fontawesome";
import Modal from "react-modal";
import { toast, ToastContainer, darkToast } from "../../Components/Toast";
import EditProduct from "./EditProduct";
import { currencySymbol } from "../../Utils/currency";

function Products() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [deleteProduct, setDeleteProduct] = useState("");

  useEffect(() => {
    getProducts();
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

    axios(config)
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getProductsByCategory = (index) => {
    if (index === "-1") return getProducts();
    setLoading(true);

    const config = {
      method: "post",
      url: `${serverUrl}/products/get-products-by-category`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        categoryId: categories[index]._id,
      },
    };

    axios(config)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const getProducts = () => {
    setLoading(true);

    const config = {
      method: "get",
      url: `${serverUrl}/products/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config)
      .then((response) => {
        setProducts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const removeProduct = () => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/products/remove`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        productId: deleteProduct._id,
      },
    };

    axios(config)
      .then((response) => {
        toast("Product deleted successfully!", darkToast);
      })
      .catch((err) => {
        toast("Something went wrong", darkToast);
      });

    setDeleteProduct("");
    getProducts();
    setLoading(false);
  };

  return (
    <>
      <Route exact path="/products">
        <Modal
          isOpen={deleteProduct !== ""}
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
              Are you sure, want to delete <b>{`${deleteProduct.title}`}</b> ?
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
                <button onClick={() => setDeleteProduct("")}>Cancel</button>
                <button
                  onClick={() => {
                    setLoading(true);
                    removeProduct();
                    // toast("Can't delete Product in Demo", darkToast);
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
            <p>Products</p>
            <button
              onClick={() => {
                history.push("/products/new");
              }}
            >
              + Add New Product
            </button>
          </div>
          <div className="filter-select">
            <p>Product Category:</p>
            <select onChange={(e) => getProductsByCategory(e.target.value)}>
              <option value="-1">All</option>
              {categories.map((category, index) => {
                return <option value={index}>{category.name}</option>;
              })}
            </select>
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
            ) : products.length === 0 ? (
              <p>No Products</p>
            ) : (
              <table>
                <tr>
                  <th>No.</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Sold</th>
                  <th>Price</th>
                  <th>Created On</th>
                  <th>Edit</th>
                  <th>Delete</th>
                </tr>
                {products.map((product, index) => {
                  return (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{product.title}</td>
                      <td>
                        <img src={product.images[0]} alt="" />
                      </td>
                      <td>{product.category.name}</td>
                      <td>{product.stock}</td>
                      <td>{product.sold}</td>
                      <td>
                        {currencySymbol}
                        {product.price}
                      </td>
                      <td>{product.createdOn.split("T")[0]}</td>
                      <td>
                        <button
                          onClick={() => {
                            history.push(`/products/edit/${product._id}`);
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
                        <button onClick={() => setDeleteProduct(product)}>
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
      <Route path="/products/new" component={AddProduct} />
      <Route path="/products/edit/:productId" component={EditProduct} />
    </>
  );
}

export default Products;
