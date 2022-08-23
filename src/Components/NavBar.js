import axios from "axios";
import React, { useEffect, useState } from "react";
import FontAwesome from "react-fontawesome";
import { logo, serverUrl } from "../Utils/server";
import "./NavBar.css";
import ReactLoading from "react-loading";
// import { Icons } from "../Utils/icons";
import { Link } from "react-router-dom";


function NavBar() {
  const [loading, setLoading] = useState(false);
  const [showNotices, setShowNotices] = useState(false);
  const [notices, setNotices] = useState([]);
  const [seen, setSeen] = useState(true);
  const ClickOutHandler = require("react-onclickout");

  const getNotices = () => {
    setLoading(true);
    const config = {
      method: "get",
      url: `${serverUrl}/notices`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config).then((response) => {
      setSeen(response.data.seen);
      setNotices(response.data);
      setLoading(false);
    });
  };

  const updateSeen = () => {
    setLoading(true);
    const config = {
      method: "post",
      url: `${serverUrl}/notices/seen`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    };

    axios(config).then((response) => {
      setSeen(true);
      setLoading(false);
    });
  };

  useEffect(() => {
    getNotices();
  }, []);

  return (
    <div className="navbar">
      <Link className="logo-container" to="/">
        <img src={logo} alt="Logo" />

        <p>Quick Agro Admin</p>
      </Link>
      <div className="right">
        <div
          className="icon-button"
          onClick={() => {
            updateSeen();
            setShowNotices(!showNotices);
          }}
        >
          <FontAwesome name="bell" id="notice-icon">
            <div className="badge" style={{ opacity: seen ? "0" : "1" }}></div>
          </FontAwesome>
        </div>
        <div className="circle-avatar"></div>
        <div className="column">
          <p>{localStorage.getItem("name")}</p>
          <p>{localStorage.getItem("email")}</p>
        </div>
      </div>
      {!showNotices ? (
        ""
      ) : (
        <ClickOutHandler
          onClickOut={() => {
            if (showNotices) {
              setShowNotices(false);
            }
          }}
        >
          <div
            className="notice-panel"
            style={
              loading || notices.notices?.length === 0
                ? {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                  }
                : {}
            }
          >
            {loading ? (
              <center>
                <ReactLoading
                  type={"spinningBubbles"}
                  color={"var(--primaryColor)"}
                  width={"2rem"}
                  height={"2rem"}
                />
              </center>
            ) : notices.notices?.length === 0 ? (
              <center>No notices</center>
            ) : (
              notices.notices?.map((notice) => (
                <div className="notice">
                  <p>
                    <FontAwesome
                      name="bell"
                      style={{ fontSize: "1rem", marginRight: "0.5rem" }}
                    />
                    {notice.title}
                  </p>
                  <p>{notice.body}</p>
                  <div className="row">
                    <p>
                      {
                        notice.createdOn
                          .split("T")[1]
                          .split(".")[0]
                          .split(":")[0]
                      }
                      :
                      {
                        notice.createdOn
                          .split("T")[1]
                          .split(".")[0]
                          .split(":")[1]
                      }
                    </p>
                    <p>{notice.createdOn.split("T")[0]}</p>
                  </div>
                  <hr />
                </div>
              ))
            )}
          </div>
        </ClickOutHandler>
      )}
    </div>
  );
}

export default NavBar;
