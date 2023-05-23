import React, { useEffect, useState } from "react";
import folder from "../Assets/Vector(2).png";
import folder_hover from "../Assets/Vector_hover.png";

function HowItWorkCardList() {
  const [isHovered_1, setIsHovered_1] = useState(false);
  const [isHovered_2, setIsHovered_2] = useState(false);
  const [isHovered_3, setIsHovered_3] = useState(false);

  function handleHover1() {
    setIsHovered_1(!isHovered_1);
  }

  function handleHover2() {
    setIsHovered_2(!isHovered_2);
  }
  function handleHover3() {
    setIsHovered_3(!isHovered_3);
  }
  const data = {
    data: [
      {
        id: 1,
        step_text_heading: "Step 1",
        step_heading: "Set up your wallet",
        step_text:
          "Set up your wallet of choice Connect it to the OC marketplace by clicking the wallet icon in the left corner.",
        mouseFuntion: handleHover1,
        item_hover:isHovered_1,
      },
      {
        id: 2,
        step_text_heading: "Step 2 ",
        step_heading: "Upload & Create Collection",
        step_text:
          "Upload your work and setup your collection. Add a description, social link and price.",
        mouseFuntion: handleHover2,
        item_hover:isHovered_2,
      },
      {
        id: 3,
        step_text_heading: "Step 3",
        step_heading: "Start Earning",
        step_text:
          "Choose between auction and fixed price listing. Start earning by selling your NFTs or trading others.",
        mouseFunction: handleHover3,
        item_hover:isHovered_3,
      },
    ],
  };
  return (
    <div className="nft_item_box">
      <div className="nft_item_heading">
        <h1 className="nft_item_h1">How it works</h1>
        <p className="nft_item_p">Find out how to get started</p>
        <div className="how_it_work_card_list">
        {data.data.map((item,idx) => (
          
            <div
              className="outer_how_it_work_card_item"
              onMouseEnter={item.mouseFuntion}
              onMouseLeave={item.mouseFuntion}
              key={idx}
            >
              <div className="how_it_work_card_item">
                <img
                  src={item.item_hover ? folder_hover : folder}
                  className="how_it_work_img"
                ></img>
                <div className="how_it_work_card_step_heading">
                  {" "}
                  {item.step_text_heading}
                </div>
                <div className="how_it_work_card_heading">
                  {item.step_heading}
                </div>
                <div className="how_it_work_card_text">{item.step_text}</div>
              </div>
            </div>
         
        ))}
 </div>
          </div>
        </div>
  );
}

export default HowItWorkCardList;
