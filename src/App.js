import "./index.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Watcher from "./components/Watcher";
import BizScraper from "./components/BizScraper";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/list/" element={<div>list</div>}></Route>

        <Route path="/link/" element={<a href="/">HERE</a>}></Route>

        <Route
          exact
          path="/"
          element={
            <div style={{ width: "1000px" }}>
              <BizScraper />
            </div>
          }
        ></Route>

        <Route exact path="/Watcher" element={<Watcher />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
