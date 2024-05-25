import React, { useState, useEffect } from "react";
import { Input, Popover, Radio, Modal, message } from "antd";
import {
  ArrowDownOutlined,
  DownOutlined,
  SettingOutlined,
} from "@ant-design/icons";

import TokenList from "../tokenList.json";
import axios from "axios";

function Swap() {
  const [slippage, setSlippage] = useState(2.5);

  const [tokenOneAmount, setTokenOneAmount] = useState(null);
  const [tokenTwoAmount, setTokenTwoAmount] = useState(null);

  const [tokenOne, setTokenOne] = useState(TokenList[0]);
  const [tokenTwo, setTokenTwo] = useState(TokenList[1]);

  const [isOpen, setIsOpen] = useState(false);

  const [changeToken, setChangeToken] = useState(1);
  // Storing The Coin Prices Via Sending Get Request From BackEnd
  const [prices, setPrices] = useState(null);

  const handleSlippageChange = (e) => {
    setSlippage(e.target.value);
  };

  const changeAmount = (e) => {
    setTokenOneAmount(e.target.value);
    if (e.target.value && prices) {
      setTokenTwoAmount((e.target.value * prices.ratio).toFixed(2));
    } else {
      setTokenTwoAmount(null);
    }
  };

  // Swapping Tokens By Arrow clicking
  const switchTokens = () => {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    const one = tokenOne;
    const two = tokenTwo;
    setTokenOne(two);
    setTokenTwo(one);
    fetchPrices(two.address, one.address);
  };

  const openModal = (asset) => {
    setChangeToken(asset);
    setIsOpen(true);
  };

  // For Changing The Coins In the DropDown Menu
  const modifyToken = (i) => {
    setPrices(null);
    setTokenOneAmount(null);
    setTokenTwoAmount(null);
    if (changeToken === 1) {
      setTokenOne(TokenList[i]);
      fetchPrices(TokenList[i].address, tokenTwo.address);
    } else {
      setTokenTwo(TokenList[i]);
      fetchPrices(tokenOne.address, TokenList[i].address);
    }
    setIsOpen(false);
  };

  const fetchDexSwap = () => {
    console.log("Clicked");
  };

  const fetchPrices = async (one, two) => {
    const res = await axios.get(`http://localhost:3001/tokenPrice`, {
      params: {
        addressOne: one,
        addressTwo: two,
      },
    });

    setPrices(res.data);
  };

  useEffect(() => {
    fetchPrices(TokenList[0].address, TokenList[1].address);
  }, []);

  const settings = (
    <>
      <div>Slippage Tolerance</div>
      <div>
        <Radio.Group value={slippage} onChange={handleSlippageChange}>
          <Radio.Button value={0.5}>0.5%</Radio.Button>
          <Radio.Button value={2.5}>2.5%</Radio.Button>
          <Radio.Button value={5}>5.0%</Radio.Button>
        </Radio.Group>
      </div>
    </>
  );

  return (
    <>
      <Modal
        open={isOpen}
        footer={null}
        onCancel={() => setIsOpen(false)}
        title="Select A Token"
      >
        <div className="modalContent">
          {TokenList.map((token, i) => (
            <div key={i} onClick={() => modifyToken(i)} className="tokenChoice">
              <img src={token.img} alt={token.ticker} className="tokenLogo" />

              <div className="tokenChoiceNames">
                <div className="tokenName">{token.name}</div>
                <div className="tokenTicker">{token.ticker}</div>
              </div>
            </div>
          ))}
        </div>
      </Modal>

      <div className="tradeBox">
        <div className="tradeBoxHeader">
          <h4>Swap</h4>
          <Popover
            content={settings}
            title="Settings"
            trigger="click"
            placement="bottomRight"
          >
            <SettingOutlined className="cog" />
          </Popover>
        </div>

        <div className="inputs">
          <Input
            placeholder="0"
            value={tokenOneAmount}
            onChange={changeAmount}
            disabled={!prices}
          />
          <Input placeholder="0" value={tokenTwoAmount} disabled={true} />
          <div className="switchButton" onClick={switchTokens}>
            <ArrowDownOutlined className="switchArrow" />
          </div>

          <div className="assetOne" onClick={() => openModal(1)}>
            <img src={tokenOne.img} alt="assetOneLogo" className="assetLogo" />
            {tokenOne.ticker}
            <DownOutlined />
          </div>
          <div className="assetTwo" onClick={() => openModal(2)}>
            <img src={tokenTwo.img} alt="assetOneLogo" className="assetLogo" />
            {tokenTwo.ticker}
            <DownOutlined />
          </div>
        </div>

        <div
          className="swapButton"
          onClick={fetchDexSwap}
          disabled={!tokenOneAmount}
        >
          Swap
        </div>
      </div>
    </>
  );
}

export default Swap;
