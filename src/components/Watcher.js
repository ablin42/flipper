// eslint-disable react-hooks/exhaustive-deps
// @ EXTERNALS
import { useEffect } from "react";
// import { parseEther } from "@ethersproject/units";
import { ethers } from "ethers";
// @ INTERNALS
import { BSC_RPC, WBNB, factory, router, recipient } from "../constants";
import "../index.css";

const addresses = {
  WBNB,
  factory,
  router,
  recipient,
};

function Watcher() {
  // * Set provider to bsc & sign with wallet *
  const provider = new ethers.providers.JsonRpcProvider(BSC_RPC);
  const wallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY, provider);
  const account = wallet.connect(provider);
  const router = new ethers.Contract(
    addresses.router,
    [
      "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
      "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
      "function swapExactTokensForTokensSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns ()",
    ],
    account
  );

  useEffect(() => {
    async function callPlaceholder() {
      await placeholder();
    }
    callPlaceholder();
  }, []);

  // !
  async function placeholder() {
    let token1 = addresses.WBNB;
    let token0 = "0xe9e7cea3dedca5984780bafc599bd69add087d56"; //!

    //The quote currency needs to be WBNB (we will pay with WBNB)
    let tokenIn, tokenOut;
    if (token0 === addresses.WBNB) {
      tokenIn = token0;
      tokenOut = token1;
    }

    if (token1 === addresses.WBNB) {
      tokenIn = token1;
      tokenOut = token0;
    }

    //The quote currency is not WBNB
    if (typeof tokenIn === "undefined") {
      return;
    }

    //We buy for 0.1 BNB of the new token
    //ethers was originally created for Ethereum, both also work for BSC
    //'ether' === 'bnb' on BSC
    const amountIn = ethers.utils.parseEther("0.00001", "ether");
    const amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
    //Our execution price will be a bit different, we need some flexbility
    const amountOutMin = amounts[1].sub(amounts[1].div(100));
    console.log(`
    Buying new token
    =================
    tokenIn: ${amountIn.toString()} ${tokenIn} (WBNB)
    tokenOut: ${amountOutMin.toString()} ${tokenOut}
  `);
    console.log(
      amountIn,
      amountOutMin,
      [tokenIn, tokenOut],
      addresses.recipient
    );

    const tx =
      await router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
        amountIn,
        amountOutMin,
        [tokenIn, tokenOut],
        addresses.recipient,
        Date.now() + 1000 * 60 * 10, // 10sec deadline / 10 minutes
        {
          gasPrice: await provider.getGasPrice(),
          gasLimit: 500000,
        }
      );
    console.log(tx);
    const receipt = await tx.wait();
    console.log("Transaction receipt", receipt);
  }

  return "watcher";
}

export default Watcher;
