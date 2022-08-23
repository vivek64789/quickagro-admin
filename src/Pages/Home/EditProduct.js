import storage from "../../Firebase/config";
import React, { useState, useEffect } from "react";
import { darkToast, toast, ToastContainer } from "../../Components/Toast";
import ReactLoading from "react-loading";
import { useHistory, useParams } from "react-router";
import axios from "axios";
import { serverUrl } from "../../Utils/server";
import FontAwesome from "react-fontawesome";

const EditProduct = () => {
  const { productId } = useParams();
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [weight, setWeight] = useState("");
  const [imageUrls, setImageUrls] = useState([]);
  const [categoryIndex, setCategoryIndex] = useState(-1); //categoryIndex in categories
  const [categoryId, setCategoryId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [tags, setTags] = useState("");

  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories();
    getProductDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        toast("Couldn't load categories. Please refresh.", darkToast);
        setLoading(false);
      });
  };

  const getProductDetails = () => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/products/get-product-by-id`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        productId: productId,
      },
    };

    axios(config)
      .then(async (response) => {
        const data = response.data;
        setTitle(data.title);
        setDescription(data.description);
        setPrice(data.price);
        setStock(data.stock);
        setWeight(data.weight);
        setImageUrls(data.images);
        setTags(
          data.tags.map((tag) => {
            let tagsString = "";
            tagsString += tag;
            return tagsString;
          })
        );
        setCategoryId(data.category.id);
        setCategoryName(data.category.name);
        setCategoryIndex(-1);
        setLoading(false);
      })
      .catch((err) => {
        toast("Failed to fetch product info", darkToast);
      });
  };

  const uploadImages = (image) => {
    setUploadingImages(true);
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
            setImageUrls((prevState) => [...prevState, url]);
            setUploadingImages(false);
          });
      }
    );
    return 0;
  };

  const updateProduct = () => {
    if(imageUrls.length === 0){
      return toast("Upload atleast 1 image", darkToast);
    }

    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/products/update`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
      data: {
        productId: productId,
        query: {
          title: title,
          description: description,
          price: parseInt(price),
          stock: parseInt(stock),
          weight: weight,
          images: imageUrls,
          category: {
            id:
              categoryIndex === -1 ? categoryId : categories[categoryIndex]._id,
            name:
              categoryIndex === -1
                ? categoryName
                : categories[categoryIndex].name,
          },
          tags: tags.toString().split(","),
        },
      },
    };

    axios(config)
      .then((response) => {
        if (response.status === 200) {
          toast("Product updated!", darkToast);

          setTimeout(() => {
            history.push("/products");
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
        <p>Edit Product</p>
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
        <div style={{ display: "flex" }}>
          {imageUrls.map((image, index) => {
            return (
              <div
                className="dismissible"
                onClick={() => {
                  var urls = imageUrls;
                  urls.splice(index, 1);
                  setImageUrls(
                    urls.length === 0
                      ? []
                      : urls.map((item) => {
                          return item;
                        })
                  );
                }}
              >
                <img
                  style={{
                    margin: "1rem",
                    objectFit: "contain",
                  }}
                  src={image}
                  alt=""
                />
                <FontAwesome
                            name="trash"
                            className="icon"
                            style={{
                              fontSize: "3rem",
                              color: "var(--primaryColor)",
                            }}
                          />
              </div>
            );
          })}
        </div>
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
            <p>Add Image</p>
            <input
              type="file"
              onChange={(e) => {
                uploadImages(e.target.files[0]);
                e.target.value = null;
              }}
            />
          </>
        )}
        <p>Category</p>
        <select
          value={
            categoryIndex === -1
              ? categories.findIndex((item) => item._id === categoryId)
              : categoryIndex
          }
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
        <button className={loading || uploadingImages ? "disabled" : ""} onClick={()=>{
          updateProduct();
          // toast("Can't edit Product in Demo", darkToast);
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

export default EditProduct;
