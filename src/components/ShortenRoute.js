import React, { useState, useEffect } from "react";
import { Switch, Route, useRouteMatch, useParams } from "react-router-dom";
import "../index.css";
import axios from "axios";

import HomeBtn from "./HomeBtn";
import NotFound from "./NotFound";
import { createAlertNode, addAlert } from "../utils/alert";

function Shortened({ id, longUrl, shortUrl }) {
  function handleClipboard(e) {
    e.preventDefault();
    let toCopy = document.querySelector("#clipper");
    let value = toCopy.value;
    let tooltip = document.querySelector(".tooltiptext");

    if (tooltip && !tooltip.classList.contains("tooltip-visible")) {
      tooltip.classList.add("tooltipAnim");
      tooltip.classList.add("tooltip-visible");
      setTimeout(() => {
        if (tooltip) {
          tooltip.classList.remove("tooltip-visible");
          tooltip.classList.remove("tooltipAnim");
        }
      }, 1000);
    }

    copyClipboard(value);
  }

  function copyClipboard(value) {
    let tempInput = document.createElement("input");
    tempInput.value = value;

    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
  }

  return (
    <div className="url-container">
      <div className="clipboard-wrapper">
        <div className="tooltip">
          <h2 data-clipboard="" onClick={handleClipboard}>
            Copy to clipboard
          </h2>
          <a data-clipboard="" onClick={handleClipboard} href="./#">
            <i className="fas fa-copy"></i>
          </a>

          <span className="tooltiptext">Copied!</span>
        </div>
      </div>
      <a
        target="_blank"
        href={longUrl}
        rel="noopener noreferrer"
        className="shortened-link heroAnim"
      >
        {shortUrl}
      </a>
      <input type="hidden" value={"http://" + shortUrl} id="clipper" />

      <HomeBtn></HomeBtn>
    </div>
  );
}

function FetchShortened() {
  const [state, setState] =
    useState <
    UrlObject >
    {
      _id: "",
      longUrl: "",
      shortUrl: "",
      urlCode: "",
      date: "",
      createdAt: "",
      updatedAt: "",
      __v: 0,
    };

  const [loadState, setLoad] = useState({
    message: "Loading...",
  });
  let { id } = useParams();

  useEffect(() => {
    (async function () {
      try {
        let url = "/api/url/" + id;
        const response = await axios.get(url);

        if (!response.data.error) setState(response.data);
        else {
          let alert = createAlertNode(response.data.message, "error");
          addAlert(alert, "#alert-wrapper");

          setLoad({ message: "This URL does not exist" });
        }
      } catch (err) {
        let alert = createAlertNode(
          "An error occured while fetching this URL",
          "error"
        );
        addAlert(alert, "#alert-wrapper");

        setLoad({ message: "This URL does not exist" });
      }
    })();
  }, [id]);

  return state._id.length ? (
    <Shortened
      id={state._id}
      longUrl={state.longUrl}
      shortUrl={state.shortUrl}
    />
  ) : (
    <div className="hero-text">
      <h1>{loadState.message}</h1>
      <h2>Press this button to go home</h2>
      <HomeBtn></HomeBtn>
    </div>
  );
}

function ShortenRoute() {
  let match = useRouteMatch();

  return (
    <Switch>
      <Route exact path={`${match.url}/:id`}>
        <FetchShortened></FetchShortened>
      </Route>
      <Route path={match.path}>
        <NotFound></NotFound>
      </Route>
    </Switch>
  );
}

export default ShortenRoute;
