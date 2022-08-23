import storage from "../../Firebase/config";
import React, { useState, useEffect } from "react";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import ReactLoading from "react-loading";
import { useHistory } from "react-router";
import axios from "axios";
import { serverUrl } from "../../Utils/server";

const AddProduct = () => {
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [weight, setWeight] = useState("");
  const [images, setImages] = useState([]);
  const [imageUrls, setImageUrls] = useState([]);
  const [categoryIndex, setCategoryIndex] = useState(-1);
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [categories, setCategories] = useState([]);

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

    axios(config)
      .then((response) => {
        setCategories(response.data);
        setLoading(false);
        setCategoryIndex(0);
      })
      .catch((err) => {
        toast("Couldn't load categories. Please refresh.", darkToast);
        setLoading(false);
      });
  };

  const uploadImages = (e) => {
    for (var i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      const imageList = images;
      imageList.push(newImage);
      setImages(imageList);
    }

    setUploadingImages(true);

    images.map((image) => {
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
            .child(fileName)
            .getDownloadURL()
            .then((url) => {
              const imageUrlList = imageUrls;
              imageUrlList.push(url);
              setImageUrls(imageUrlList);
              if (imageUrls.length === images.length) {
                setUploadingImages(false);
              }
            });
        }
      );
      return 0;
    });
  };

  const upload = () => {
    if (title === "") {
      return toast("Title is required", darkToast);
    } else if (description === "") {
      return toast("Description is required", darkToast);
    } else if (weight === "") {
      return toast("Weight is required", darkToast);
    } else if (price === "") {
      return toast("Price is required", darkToast);
    } else if (stock === "") {
      return toast("Stock is required", darkToast);
    } else if (imageUrls.length === 0) {
      return toast("Upload atleast 1 image", darkToast);
    } else if (categoryIndex === -1) {
      return toast("Select a category", darkToast);
    }

    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/products/add`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        title: title,
        description: description,
        price: parseInt(price),
        stock: parseInt(stock),
        weight: weight,
        images: imageUrls,
        category: {
          id: categories[categoryIndex]._id,
          name: categories[categoryIndex].name,
        },
        tags: tags.split(","),
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          toast("Product added!", darkToast);

          setTimeout(() => {
            history.push("/products");
            window.location.reload();
          }, 1000);
          setLoading(false);
        }
      })
      .catch((err) => {
        toast("Something went wrong!", darkToast);
        setLoading(false);
      });
  };

  return (
    <div className="content-body">
      <div className="content-title">
        <p>Add New Product</p>
      </div>
      <div className="form">
        <p>Product Title</p>
        <input
          type="text"
          placeholder="Product Title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <p>Description</p>
        <input
          type="text"
          value={description}
          placeholder="Description"
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
        <p>Weight</p>
        <input
          type="text"
          placeholder="Weight"
          value={weight}
          onChange={(e) => {
            setWeight(e.target.value);
          }}
        />
        <p>Images</p>
        {uploadingImages ? (
          <div style={{ margin: "1rem" }}>
            <ReactLoading
              type={"spinningBubbles"}
              color={"var(--primaryColor)"}
              width={"2rem"}
              height={"2rem"}
            />
          </div>
        ) : (
          <>
            {imageUrls.length === 0 ? (
              <input
              type="file"
              multiple
              onChange={(e) => {
                uploadImages(e);
              }}
            />
            ) : (
              ""
            )}
            <div style={{ display: "flex" }}>
              {imageUrls.map((url) => {
                return (
                  <img
                    style={{
                      width: "20%",
                      margin: "1rem",
                      objectFit: "contain",
                    }}
                    src={url}
                    alt=""
                  />
                );
              })}
            </div>
          </>
        )}

        <p>Category</p>
        <select
          defaultValue={0}
          value={categoryIndex}
          onChange={(e) => {
            setCategoryIndex(e.target.value);
          }}
        >
          {categories.map((categoryItem, index) => {
            return <option value={index}>{categoryItem.name}</option>;
          })}
        </select>
        <p>Tags</p>
        <input
          type="text"
          value={tags}
          placeholder="Tags seperated by comma"
          onChange={(e) => {
            setTags(e.target.value);
          }}
        />
        <button
          className={loading || uploadingImages ? "disabled" : ""}
          onClick={()=>{
            upload();
          // toast("Can't add Product in Demo", darkToast);
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
            "Add Product"
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default AddProduct;
