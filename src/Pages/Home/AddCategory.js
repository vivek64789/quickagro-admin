import storage from "../../Firebase/config";
import React, { useState } from "react";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import ReactLoading from "react-loading";
import { useHistory } from "react-router";
import axios from "axios";
import { serverUrl } from "../../Utils/server";

export const AddCategory = () => {
  const history = useHistory();
  const [categoryName, setCategoryName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const uploadImage = (image) => {
    setUploadingImage(true);

    const fileName = `${
      image.name + "_" + categoryName + "_" + Date.now().toString()
    }`;

    const upload = storage.ref(`images/${fileName}`).put(image);
    upload.on(
      "state_changed",
      (snapshot) => () => {},
      (error) => {},
      () => {
        storage
          .ref("images")
          .child(`${fileName}`)
          .getDownloadURL()
          .then((url) => {
            setImageUrl(url);
            setUploadingImage(false);
          });
      }
    );
  };

  const upload = () => {
    if (categoryName === "")
      return toast("Category name is required", darkToast);
    if (imageUrl === "") return toast("Upload Image", darkToast);

    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/categories/add`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        name: categoryName,
        image: imageUrl,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          toast("Category added!", darkToast);

          setTimeout(() => {
            history.push("/categories");
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
        <p>Add New Category</p>
      </div>
      <div className="form">
        <p>Category Name</p>
        <input
          type="text"
          placeholder="Category Name"
          onChange={(e) => {
            setCategoryName(e.target.value);
          }}
        />
        <p>Category Image</p>
        {uploadingImage ? (
          <div style={{ margin: "1rem" }}>
            <ReactLoading
              type={"spinningBubbles"}
              color={"var(--primaryColor)"}
              width={"2rem"}
              height={"2rem"}
            />
          </div>
        ) : imageUrl !== "" ? (
          <img
            style={{
              width: "20%",
              margin: "1rem",
              objectFit: "contain",
            }}
            src={imageUrl}
            alt=""
          />
        ) : null}
        <input
          type="file"
          onChange={(e) => {
            uploadImage(e.target.files[0]);
          }}
        />
        <button
          className={loading || uploadingImage ? "disabled" : ""}
          onClick={() => {
            upload();
            // toast("Can't add Category in Demo", darkToast);
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
            "Add Category"
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};
