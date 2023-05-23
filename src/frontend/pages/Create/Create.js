import React from "react";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "react-bootstrap";
import { ImFolderUpload } from "react-icons/im";
import { AiFillFileImage } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
//We are importing ipfsHttpClient this will allow us to upload the metadata about newly created nft to ipfs
import { create } from "ipfs-http-client";
import { Buffer } from "buffer";
import Swal from 'sweetalert2'
import {getUsername,nftMint} from '../../services/api'
import axios from "axios";
const projectId = "2MonXpsWqbTqkm3SQpTOVNbHiek";
const projectSecret = "f0d0dd7d62afa89cceb0981ab28461f3";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: {
    authorization: auth,
  },
});

function Create({ marketplace, nft, account }) {
  
  const [errorMessage,setErrorMessage] = useState('')
  const [imagePic, setImagePic] = useState(null);
  const [imageFileName, setImageFileName] = useState("No selected File");
  const [image, setImage] = useState();
  const [imageMessage, setImageMessage] = useState("");
  const [price, setPrice] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [priceMessage, setPriceMessage] = useState("");
  const [nameMessage, setNameMessage] = useState("");
  const [descriptionMessage, setDescriptionMessage] = useState("");
  const [category, setCategory] = useState("Art");
  const [categoryMessage, setCategoryMessage] = useState("");
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [username,setUsername] = useState('')
  const [resellCount,setResellCount] = useState(0)
  const uploadToIPFS = async (event) => {
    event.preventDefault();

    const file = event.target.files[0];
    setImageFileName(event.target.files[0].name);
    setImagePic(URL.createObjectURL(event.target.files[0]));
    if (typeof file !== "undefined") {
      try {
        const result = await client.add(file);
        setImage(`https://oc-nft-marketplace.infura-ipfs.io/ipfs/${result.path}`);
      } catch (error) {
      }
    }
  };
    useEffect(()=>{
      window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
      getUsername(account).
      then((response)=>{
        setUsername(response.data.user.username)
      })
      .catch((error)=>{
      })
    },[])
  useEffect(() => {
    if (isSubmitClicked === true) {
      if (!image) {
        setImageMessage("Image is required");
      } else { 

        setImageMessage("");
      }
    }
  }, [image]);
  useEffect(() => {
    if (!price && isSubmitClicked) {
      setPriceMessage("Price is required");
    } else if (price<0 && isSubmitClicked) {
      setPriceMessage("Price should be more than zero");
    } else {
      setPriceMessage("");
    }
  }, [price]);
  useEffect(() => {
    if (!name && isSubmitClicked) {
      setNameMessage("Name is required");
    } else {
      setNameMessage("");
    }
  }, [name]);
  useEffect(() => {
    if (!description && isSubmitClicked) {
      setDescriptionMessage("Description is required");
    } else {
      setDescriptionMessage("");
    }
  }, [description]);
  useEffect(() => {
    if (!category && isSubmitClicked) {
      setCategoryMessage("Category is required");
    } else {
      setCategoryMessage("");
    }
  }, [category]);
  //It will run when user click submit on the form this will add all metadata of nft to ipfs
  //After it's done interacting with ipfs this function will interact with block chain to mint and then list the nft for sale on the marketplace
  const createNFT = async () => {
    setIsSubmitClicked(true);
    if (!image) {
      setImageMessage("Image is required");
    }
    if (!price) {
      setPriceMessage("Price is required");
    }
    if (price<0) {
      setPriceMessage("Price should be more than zero");
    }
    if (!name) {
      setNameMessage("Name is required");
    }
    if (!description) {
      setDescriptionMessage("Description is required");
    }
    if (!category) {
      setCategoryMessage("Category is required");
    }
    
    if (!image || !price || !name || !description || !category||price<0) {
      return;
    }

    try {
      const result = await client.add(
        JSON.stringify({ image, name, description, account, category,username})
      );
      const uri = `https://oc-nft-marketplace.infura-ipfs.io/ipfs/${result.path}`;
        nftMint(name,description,parseFloat(price),image,account,category,0,uri)
        .then((response) => {
          if(response.data.statusCode==='23505'){
            Swal.fire({
                icon: 'error',
                title: 'NFT already exists',
                text: 'This NFT already exist submit another' 
            })
          }
          if(response.data.statusCode===201){
            mintThenList(result);
            setErrorMessage('')
            Swal.fire(
              'Good job your NFT is getting processed!',
              'Confirm all three steps to mint your NFT',
              'success'
            )
          }
          
          
          
        })
        .catch((error) => {
          if (error.response) {
          } else {
          }
        });
    
      
    } catch (error) {
    }
  }
  const mintThenList = async (result) => {
    const uri = `https://oc-nft-marketplace.infura-ipfs.io/ipfs/${result.path}`;
 
    //mint the nft
    await (await nft.mint(uri)).wait();
    // get tokenId of new nft
    const id = await nft.tokenCount();
 
    // approve marketplace to spend nft
    await (await nft.setApprovalForAll(marketplace.address, true)).wait();
    // add nft to marketplace

    // const price = ethers.utils.parseUnits(formParams.price, 'ether')

    let listingPrice = await marketplace.getListPrice()
    listingPrice = listingPrice.toString()

    const NFTPrice = ethers.utils.parseEther(price.toString());

    await (await marketplace.makeItem(nft.address, id, NFTPrice,{value: listingPrice})).wait();
    
    let contractBalance = await marketplace.getBalance();
    let contractPrice = contractBalance.toString();
    let etherBalance = ethers.utils.formatEther(contractPrice);
    // console.log(etherBalance);
    axios.patch('http://192.168.1.134:3000/nft/update_balance',{
          "nft_json_link": uri,
          "total_balance": etherBalance
      })
      .then((response)=>{
        if(response.data.statusCode===201){
          console.log("Total price udpated...")
        }
      }).catch((error)=>{
        console.log("error:",error);
      })

  };
  function handleChangeCategory(e) {
    setCategory(e.target.value);
  }

  return (
    <>
      <div className="create_nft_form_outer">
        
        <div className="create_nft_form_inner_div">
          {errorMessage&&(<div className="message_alert">
              {errorMessage}
            </div>)}
          {imageMessage && (
            <div className="message_alert">
              {imageMessage}
            </div>
          )}
          <div
            className="create_form_image_div"
            onClick={() => document.querySelector(".image_input_field").click()}
          >
            <input
              className="image_input_field"
              type="file"
              required
              name="file"
              onChange={uploadToIPFS}
              accept="image/*"

              hidden
            />
            {imagePic ? (
              <img
                src={imagePic}
                width={400}
                height={200}
                alt={imageFileName}
              ></img>
            ) : (
              <>
                <ImFolderUpload className="imgFolderUpload"
                  
                />
                <p className="create_form_image_div_file_upload_text">
                  Drop your files here. PNG, GIF, JPG, WEBP, MP3 Max 100mb.
                  Browse{" "}
                </p>
              </>
            )}
            <section style={{ color: "black" }}>
              <AiFillFileImage color="black" />
              <span >
                {imageFileName}
                <MdDelete
                  onClick={() => {
                    setImageFileName("No selected file ");
                    setImagePic(null);
                    setImage("");
                  }}
                />
              </span>
            </section>
          </div>
          <ul className="create_form_ul">
            <li className="create_form_ul_li">
              {categoryMessage && (
                <div className="message_alert">{categoryMessage}</div>
              )}
              <p className="create_form_ul_li_text">Item Category</p>
              <select
                className="create_form_ul_li_select"
                value={category}
                onChange={handleChangeCategory}
              >
                <option value="Art">Art</option>
                <option value="Gaming">Gaming</option>
                <option value="Memes">Memes</option>
              </select>
            </li>
            <br></br>
          </ul>
          <ul className="create_form_ul">
            <li className="create_form_ul_li">
              {nameMessage && (
                <div className="message_alert">{nameMessage}</div>
              )}
              <p className="create_form_ul_li_text">Item Name</p>
              <input
                className="create_form_ul_li_input"
                onChange={(e) => setName(e.target.value)}
                size="lg"
                required
                type="text"
                placeholder="Name"
              ></input>
            </li>
            <li className="create_form_ul_li">
              {priceMessage && (
                <div className="message_alert">{priceMessage}</div>
              )}
              <p className="create_form_ul_li_text">Item Price</p>
              <input
                className="create_form_ul_li_input"
                onChange={(e) => setPrice(e.target.value)}
                required
                type="number"
                placeholder="Price in ETH"
              />
            </li>
          </ul>
          <div className="create_form_description_div">
            {descriptionMessage && (
              <div className="message_alert">{descriptionMessage}</div>
            )}
            <p className="create_form_description_text">Description</p>
            <textarea
              className="create_form_description_input"
              onChange={(e) => setDescription(e.target.value)}
              required
              type="textarea"
              placeholder="Description"
            ></textarea>
          </div>
          <Button
          className="create_form_description_button"
            
            onClick={() => {
              setIsSubmitClicked(true);
              createNFT();
            }}
            size="lg"
            type="submit"
          >
            Create & List NFT!
          </Button>
        </div>
      </div>
    </>
  );
}

export default Create;
