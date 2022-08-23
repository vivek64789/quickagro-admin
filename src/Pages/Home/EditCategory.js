import storage from "../../Firebase/config";
import React, { useState, useEffect } from "react";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import ReactLoading from "react-loading";
import { useHistory, useParams } from "react-router";
import axios from "axios";
import { serverUrl } from "../../Utils/server";

const EditCategory = () => {
  const { categoryId } = useParams();
  const history = useHistory();
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    getCategoryDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getCategoryDetails = () => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/categories/get-category-by-id`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        categoryId: categoryId,
      },
    };

    axios(config)
      .then((response) => {
        setCategoryName(response.data.name);
        setCategoryImage(response.data.image);
        setLoading(false);
      })
      .catch((err) => {
        toast("Failed to fetch category info", darkToast);
        setLoading(false);
      });
  };

  const updateCategory = () => {
    if (categoryName === "")
      return toast("Category name is required", darkToast);
    if (categoryImage === "") return toast("Upload Image", darkToast);

    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/categories/update`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        categoryId: categoryId,
        query: {
          name: categoryName,
          image: categoryImage,
        },
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          toast("Category updated!", darkToast);

          setTimeout(() => {
            history.push("/categories");
            window.location.reload();
          }, 1000);
        }
        setLoading(false);
      })
      .catch(() => {
        toast("Something went wrong!", darkToast);
        setLoading(false);
      });
  };

  const uploadImage = (image) => {
    setUploadingImage(true);

    const fileName = `${
      image.name + "_" + categoryName + "_" + Date.now().toString()
    }`;

    const upload = storage.ref(`images/${fileName}`).put(image);
    upload.on(
      "state_changed",
      (snapshot) => () => {},
      (error) => {
      },
      () => {
        storage
          .ref("images")
          .child(`${fileName}`)
          .getDownloadURL()
          .then((url) => {
            setCategoryImage(url);
            setUploadingImage(false);
          });
      }
    );
  };

  return (
    <div className="content-body">
      <div className="content-title">
        <p>Edit Category</p>
      </div>
      <div className="form">
        <p>Category Name</p>
        <input
          type="text"
          placeholder="Category Name"
          value={categoryName}
          onChange={(e) => {
            setCategoryName(e.target.value);
          }}
        />
        <p>Category Image</p>
        {categoryImage !== "" ? (
          <img
            style={{ width: "20%", marginTop: "1rem" }}
            src={categoryImage}
            alt="CategoryImage"
          />
        ) : (
          ""
        )}
        {uploadingImage ? (
          <div style={{ margin: "1rem" }}>
            <ReactLoading
              type={"spinningBubbles"}
              color={"var(--primaryColor)"}
              width={"2rem"}
              height={"2rem"}
            />
          </div>
        ) : (
          <input
            type="file"
            onChange={(e) => {
              uploadImage(e.target.files[0]);
            }}
          />
        )}
        <button
          className={loading || uploadingImage ? "disabled" : ""}
          onClick={()=>{
            updateCategory();
          // toast("Can't edit Category in Demo", darkToast);
          }}
        >
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

export default EditCategory;
