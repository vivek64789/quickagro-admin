import React from "react";
import { useHistory } from "react-router-dom";
import FontAwesome from "react-fontawesome";

function NavButton({ title, path, icon }) {
  let history = useHistory();
  return (
    <li
      style={{
        color: title === "Logout" ? "red" : "",
        marginBottom: title === "Logout" ? "2rem" : "",
      }}
      className={
        path === "/"
          ? history.location.pathname === path
            ? "selected"
            : null
          : history.location.pathname.includes(path)
          ? "selected"
          : ""
      }
      onClick={() => {
        if (title === "Logout") {
          localStorage.clear();
        }
        history.push(path);
      }}
    >
      <FontAwesome
        name={icon}
        style={{ fontSize: "1rem", marginRight: "1rem" }}
      />
      {title}
    </li>
  );
}

export default NavButton;
