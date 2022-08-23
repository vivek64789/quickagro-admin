import React, { useEffect, useState } from "react";
import { serverUrl } from "../../Utils/server";
import axios from "axios";
import { currencySymbol } from "../../Utils/currency";
import ReactLoading from "react-loading";
import FontAwesome from "react-fontawesome";
import { useHistory } from "react-router";

function Dashboard() {
  const history = useHistory();
  const [usersCount, setUsersCount] = useState(0);
  const [productsCount, setProductsCount] = useState(0);
  const [bundlesCount, setBundlesCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getDashboardData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDashboardData = () => {
    setLoading(true);

    const config = {
      method: "get",
      url: `${serverUrl}/admin-dashboard`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config)
      .then((response) => {
        setUsersCount(response.data.totalUsers);
        setProductsCount(response.data.totalProducts);
        setBundlesCount(response.data.totalBundles);
        setCategoriesCount(response.data.totalCategories);
        setOrdersCount(response.data.totalOrders);
        setTotalEarnings(response.data.totalEarnings);
        setLoading(false);
      })
      .catch((err) => {
        localStorage.clear();
        history.push("/login");
        setLoading(false);
      });
  };

  return (
    <div className="content-body">
      <div className="content-title">
        <p>Dashboard</p>
      </div>
      <div>
        {loading ? (
          <ReactLoading
            type={"spinningBubbles"}
            color={"var(--primaryColor)"}
            width={"4rem"}
            height={"4rem"}
          />
        ) : (
          <>
            <div
              className="row"
              style={{ flexWrap: "wrap", marginTop: "2rem" }}
            >
              <div className="card yellow-card">
                <div className="column">
                  <span>
                    {currencySymbol}
                    {totalEarnings}
                  </span>
                  Total Earnings
                </div>
                <FontAwesome
                  name="money"
                  style={{ fontSize: "4rem", marginRight: "1rem" }}
                />
              </div>
              <div
                className="card green-card"
                onClick={() => history.push("/orders")}
              >
                <div className="column">
                  <span>{ordersCount}</span>
                  Orders
                </div>
                <FontAwesome
                  name="shopping-bag"
                  style={{ fontSize: "4rem", marginRight: "1rem" }}
                />
              </div>
              <div
                className="card pink-card"
                onClick={() => history.push("/users")}
              >
                <div className="column">
                  <span>{usersCount}</span>
                  Users
                </div>
                <FontAwesome
                  name="user"
                  style={{ fontSize: "4rem", marginRight: "1rem" }}
                />
              </div>
              <div
                className="card blue-card"
                onClick={() => history.push("/products")}
              >
                <div className="column">
                  <span>{productsCount}</span>
                  Products
                </div>
                <FontAwesome
                  name="cube"
                  style={{ fontSize: "4rem", marginRight: "1rem" }}
                />
              </div>
              <div
                className="card red-card"
                onClick={() => history.push("/bundles")}
              >
                <div className="column">
                  <span>{bundlesCount}</span>
                  Bundles
                </div>
                <FontAwesome
                  name="cubes"
                  style={{ fontSize: "4rem", marginRight: "1rem" }}
                />
              </div>
              <div
                className="card orange-card"
                onClick={() => history.push("/categories")}
              >
                <div className="column">
                  <span>{categoriesCount}</span>
                  Categories
                </div>
                <FontAwesome
                  name="list"
                  style={{ fontSize: "4rem", marginRight: "1rem" }}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
