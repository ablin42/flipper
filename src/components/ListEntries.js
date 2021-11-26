import React, { useState } from "react";
import "../index.css";
import axios from "axios";
import { createAlertNode, addAlert } from "../utils/alert";

let PW = "";

function Entries(list) {
  function handleClick(e, urlCode) {
    e.preventDefault();
    const URL = "/api/url/delete/" + urlCode + "/" + PW;

    axios
      .post(URL)
      .then(function (response) {
        if (!response.data.error) {
          let alert = createAlertNode("Deleted", "success");
          e.target.parentNode.parentNode.remove();
          addAlert(alert, "#alert-wrapper");
        } else {
          let alert = createAlertNode(response.data.message, "error");
          addAlert(alert, "#alert-wrapper");
        }
      })
      .catch(function (error) {
        let alert = createAlertNode(
          "An error occured while processing your request",
          "error"
        );
        addAlert(alert, "#alert-wrapper");
      });
  }

  if (list.length <= 0) return <div>Pffffrt</div>;

  const toInsert = list.list.map((item, index) => {
    return (
      <div key={item._id} className="entryList">
        <span>#{index}</span>
        <span className="spanUrl">
          <a href={item.longUrl}>{item.longUrl}</a>
        </span>
        <span className="spanCode">{item.urlCode}</span>
        <span className="spanDate">{item.createdAt}</span>
        <a
          onClick={(e) => handleClick(e, item.urlCode)}
          href={"/delete/" + item.urlCode}
        >
          <span className="spanDelete">X</span>
        </a>
      </div>
    );
  });
  return <div style={{ overflowY: "scroll" }}>{toInsert}</div>;
}

function ListEntries() {
  const [password, setPassword] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [list, setList] = useState([]);

  async function handleInput(e) {
    let value = e.target.value.trim();
    let btn = document.querySelector(".search-btn");

    if (value.length > 0 && btn) {
      btn.style.opacity = "1";
      btn.style.transform = "rotate(0deg)";
    } else {
      btn.style.opacity = "0";
      btn.style.transform = "rotate(45deg)";
    }
    setPassword(value);
  }

  function postForm(password) {
    axios
      .post("/api/url/auth", {
        password: password,
      })
      .then(function (response) {
        if (!response.data.error) {
          PW = password;
          setIsAuth(true);
          axios.get("/api/url/list/" + password).then(function (datalist) {
            if (!datalist.data.error) setList(datalist.data);
            else console.log("issue");
          });
        } else {
          let alert = createAlertNode(response.data.message, "error");
          addAlert(alert, "#alert-wrapper");
        }
      })
      .catch(function (error) {
        let alert = createAlertNode(
          "An error occured while processing your request",
          "error"
        );
        addAlert(alert, "#alert-wrapper");
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    postForm(password);
  }

  return !isAuth ? (
    <form
      method="POST"
      action="/"
      onSubmit={handleSubmit}
      className="shorten-form"
    >
      <input
        onChange={handleInput}
        name="longUrl"
        type="password"
        className="search-txt"
        value={password}
        required
      />
      <button type="submit" className="search-btn">
        <i className="fas fa-arrow fa-arrow-right"></i>
      </button>
    </form>
  ) : (
    <Entries list={list} />
  );
}

export default ListEntries;
