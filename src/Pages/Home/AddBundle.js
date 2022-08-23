import storage from "../../Firebase/config";
import React, { useState } from "react";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import ReactLoading from "react-loading";
import { useHistory } from "react-router";
import axios from "axios";
import { serverUrl } from "../../Utils/server";

export const AddBundle = () => {
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);

  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const uploadImage = (image) => {
    setUploadingImage(true);

    const fileName = `${
      image.name + "_" + title + "_" + Date.now().toString()
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
            setImageUrl(url);
            setUploadingImage(false);
          });
      }
    );
  };

  const upload = () => {
    if (title === "") {
      return toast("Bundle Title is required", darkToast);
    } else if (subtitle === "") {
      return toast("Subtitle is required", darkToast);
    } else if (description === "") {
      return toast("Description is required", darkToast);
    } else if (price === "") {
      return toast("Price is required", darkToast);
    } else if (stock === "") {
      return toast("Stock is required", darkToast);
    } else if (imageUrl === "") {
      return toast("Upload Image", darkToast);
    }

    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/bundles/add`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        title: title,
        subtitle: subtitle,
        description: description,
        price: parseInt(price),
        stock: parseInt(stock),
        image: imageUrl,
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          toast("Bundle added!", darkToast);

          setTimeout(() => {
            history.push("/bundles");
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
        <p>Add New Bundle</p>
      </div>
      <div className="form">
        <p>Bundle Title</p>
        <input
          type="text"
          placeholder="Bundle Title"
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <p>Subtitle</p>
        <input
          type="text"
          placeholder="Subtitle"
          onChange={(e) => {
            setSubtitle(e.target.value);
          }}
        />
        <p>Description</p>
        <input
          type="text"
          placeholder="Description"
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <p>Price</p>
        <input
          type="number"
          placeholder="Price"
          onChange={(e) => {
            setPrice(e.target.value);
          }}
        />
        <p>Stock</p>
        <input
          type="number"
          placeholder="Stock"
          onChange={(e) => {
            setStock(e.target.value);
          }}
        />
        <p>Image</p>
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
        <button className={loading || uploadingImage ? "disabled" : ""} onClick={()=>{
          upload();
          // toast("Can't add Bundle in Demo", darkToast);
        }}>
          {loading ? (
            <ReactLoading
              type={"spinningBubbles"}
              color={"white"}
              width={"1.2rem"}
              height={"1.2rem"}
            />
          ) : (
            "Add Bundle"
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};
