import storage from "../../Firebase/config";
import React, { useState, useEffect } from "react";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import ReactLoading from "react-loading";
import { useHistory, useParams } from "react-router";
import axios from "axios";
import { serverUrl } from "../../Utils/server";

const EditBundle = () => {
  const { bundleId } = useParams();
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [bundleImage, setBundleImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    getBundleDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBundleDetails = () => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/bundles/get-bundle-by-id`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        bundleId: bundleId,
      },
    };

    axios(config)
      .then((response) => {
        setTitle(response.data.title);
        setSubtitle(response.data.subtitle);
        setDescription(response.data.description);
        setPrice(response.data.price);
        setStock(response.data.stock);
        setBundleImage(response.data.image);
      })
      .catch((err) => {
        toast("Failed to fetch bundle info", darkToast);
      });

    setLoading(false);
  };

  const updateBundle = () => {
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
    } else if (bundleImage === "") {
      return toast("Upload Image", darkToast);
    }

    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/bundles/update`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        bundleId: bundleId,
        query: {
          title: title,
          subtitle: subtitle,
          description: description,
          price: parseInt(price),
          stock: parseInt(stock),
          image: bundleImage,
        },
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          toast("Bundle updated!", darkToast);

          setTimeout(() => {
            history.push("/bundles");
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
            setBundleImage(url);
            setUploadingImage(false);
          });
      }
    );
  };

  return (
    <div className="content-body">
      <div className="content-title">
        <p>Edit Bundle</p>
      </div>
      <div className="form">
        <p>Bundle Title</p>
        <input
          type="text"
          placeholder="Bundle Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <p>Subtitle</p>
        <input
          type="text"
          placeholder="Subtitle"
          value={subtitle}
          onChange={(e) => {
            setSubtitle(e.target.value);
          }}
        />
        <p>Description</p>
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
        />
        <p>Price</p>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);
          }}
        />
        <p>Stock</p>
        <input
          type="number"
          placeholder="Stock"
          value={stock}
          onChange={(e) => {
            setStock(e.target.value);
          }}
        />
        <p>Image</p>
        {bundleImage !== "" ? (
          <img
            style={{ width: "20%", marginTop: "1rem" }}
            src={bundleImage}
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

        <button className={loading || uploadingImage ? "disabled" : ""} onClick={()=>{
          updateBundle();
          // toast("Can't edit Bundle in Demo", darkToast);
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

export default EditBundle;
