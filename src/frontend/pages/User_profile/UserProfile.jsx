import React, { useEffect, useState } from "react";
import imagePlaceholder from "../../Assets/Image PlaceHolder.svg";
import "../App.css";
import "./userprofile.css";
import MyListedItems from "../MyListedItems";
import MyPurchases from "../MyPurchases";
import axios from "axios";
import {CirclesWithBar} from 'react-loader-spinner'
import { getUsername } from "../../services/api";
function UserProfile({ marketplace, nft, account }) {
  const [loading,setLoading] = useState(true)
  const [imagePic, setImagePic] = useState();
  const [imagePicData, setImagePicData] = useState();
  const [username, setUsername] = useState();
  const [metamaskID, setMetamaskID] = useState();
  useEffect(()=>{
    let formData = new FormData();    //formdata object
    if(imagePicData){
    formData.append('metamask_address', account)
    formData.append('profile', imagePicData);
    
    const config = {     
        headers: { 'content-type': 'multipart/form-data' }
    }
    axios.patch("http://192.168.1.134:3000/auth/user/profile_image_setup", formData, config)
        .then(response => {
        })
        .catch(error => {
        });
      }
  },[imagePicData])
  useEffect(() => {
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      getUsername(account)
      .then((response) => {
        setUsername(response.data.user.username);
        setImagePic(
          `http://192.168.1.134:3000/auth/user/get_image?image_link=${response.data.user.profile_pic}`
        );
        setMetamaskID(account);
      })
      .catch((error) => {
      });
  }, []);

  function handleSubmitClick(e) {
    e.preventDefault();
    
  
  }
  return (
    <>
        <div className="userProfile_outer">
      <div className="userProfile_back_profile">
        {loading&&<div className="loading_div">
        <CirclesWithBar
        height="100"
        width="100"
        color="white"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
        outerCircleColor="white"
        innerCircleColor="purple"
        barColor="white"
        ariaLabel='circles-with-bar-loading'
      />
      </div>}
        <img
          className="userprofile_back_profile_image"
          src={imagePlaceholder}
          onLoad={()=>setLoading(false)}
          style={{display:loading?'none':'block'}}
        ></img>
      </div>
      {imagePic ? (
        <div
        className="userProfile_photo"
      >
          <img className="userProfile_photo_img" src={imagePic}/>
          </div>
        ) : (
          <div></div>
        )}
      <div
        className="userProfile_button"
        onClick={() => document.querySelector(".image_input_field").click()}
      >
        <form onSubmit={(e) => handleSubmitClick(e)}>
        <input
            type="file"
            className="image_input_field"
            onChange={(e) =>{setImagePicData(e.target.files[0]);setImagePic(URL.createObjectURL(e.target.files[0]))}}
            alt="No image selected"
            hidden
          />
        <button
          id="lgin"
          className="nav-button-item"
          type="submit"
          
        >
          Upload Profile Photo
        </button>
        </form>
      </div>
      <div className="userProfile_data_main_div">
        <div className="userProfile_data_left_div">
          <div className="userProfile_data_left_inner">
            <p className="userprofile_data_username_p">{username}</p>
            <ul className="userProfile_data_ul">
              <li className="userProfile_data_ul_li">
                <p className="userProfile_data_ul_p">5+</p>
                <p className="userProfile_data_ul_p_text">Volume</p>
              </li>
              <li className="userProfile_data_ul_li">
                <p className="userProfile_data_ul_p">5+</p>
                <p className="userProfile_data_ul_p_text">NFTs Sold</p>
              </li>
              <li className="userProfile_data_ul_li">
                <p className="userProfile_data_ul_p">30+</p>
                <p className="userProfile_data_ul_p_text">Followers</p>
              </li>
            </ul>
            <p className="userProfile_data_p_heading">Bio</p>
            <p className="userProfile_data_p">
              The internet's friendliest designer kid.
            </p>
            <p className="userProfile_data_p_heading">Links</p>
            <div className="icon_list_outer">
              <div className="icon_list">
                <i className="bi bi-twitter"></i>
              </div>
              <div className="icon_list">
                <i className="bi bi-facebook"></i>
              </div>
              <div className="icon_list">
                <i className="bi bi-youtube"></i>
              </div>
              <div className="icon_list">
                <i className="bi bi-linkedin"></i>
              </div>
            </div>
          </div>
        </div>
        <div className="userProfile_data_right_div">
          <div className="userProfile_data_right_inner">
            <button
              className="userProfile_data_right_button"
              onClick={() => {
                navigator.clipboard.writeText(account);
              }}
            >
              <i className="bi bi-file-code"></i>{" "}
              {account.slice(0, 5) + "..." + account.slice(38, 42)}
            </button>
          </div>
        </div>
      </div>
      {account ? '' : <p>''</p>}
      <div className="module_border_wrap">
        <div className="seperation"></div>
      </div>
      <MyPurchases marketplace={marketplace} nft={nft} account={account} />
      <div className="module_border_wrap">
        <div className="seperation"></div>
      </div>
      <MyListedItems marketplace={marketplace} nft={nft} account={account} />
    </div>
    
    </>
  );
}

export default UserProfile;
