// eslint-disable react-hooks/exhaustive-deps
// @ EXTERNALS
import { useState } from "react";
import axios from "axios";
// import cheerio from "cheerio";
// @ INTERNALS
// import { BSC_RPC, WBNB, factory, router, recipient } from "../constants";
import "../index.css";
import bonk from "../bonk.mp3";

axios.defaults.headers.post["Access-Control-Allow-Origin"] = "*";

// TODO filter for title/content && tg
//! TODO sort by creation date
const BizScraper = () => {
  const [addresses, setAddresses] = useState([]);

  const [isRunning, setIsRunning] = useState(false);
  const audio = new Audio(bonk);
  console.log(addresses.length, isRunning);

  const parse = (state, data) => {
    const regex = /(0x[a-zA-Z0-9]{40})/gm;
    const filter = [...data.matchAll(regex)];
    const array = JSON.parse(JSON.stringify(state));
    for (let address of filter) {
      const normalized = address[0].toLowerCase();
      if (!array.includes(normalized)) {
        array.push(normalized);
        if (state.length > 0) {
          audio.play();
          console.log("playing sound for:", normalized, new Date());
        }
      }
    }
    return array;
  };
  const fetchData = async () => {
    const response = await axios.get("https://boards.4channel.org/biz/catalog");
    return response.data;
  };

  //   useEffect(async () => {
  //     try {
  //       const res = await fetchData();
  //       console.log(res, "!!");
  //       setAddresses(res);
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   }, []);

  if (!isRunning) {
    try {
      setIsRunning(true);
      setInterval(async () => {
        const res = await fetchData();
        setAddresses((state) => parse(state, res));
      }, 1000 * 15);
    } catch (err) {
      console.log(err);
    }
  }

  const handleClick = (address) => {
    window.open(`https://poocoin.app/tokens/${address}`, "w1");
    setTimeout(() => {
      window.open(`https://moonarch.app/token/${address}`, "w2");
    }, 500);
    setTimeout(() => {
      window.open(`https://tools.staysafu.org/scan?a=${address}`, "w3");
    }, 1000);
  };

  const generateDisplay = () => {
    return addresses.reverse()?.map((address) => {
      return (
        <p
          key={address}
          style={{ cursor: "pointer" }}
          onClick={() => handleClick(address)}
        >
          {address}
        </p>
      );
    });
  };

  return <div>{generateDisplay()}</div>;
};

export default BizScraper;
