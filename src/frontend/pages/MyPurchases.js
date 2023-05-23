import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Row, Col, Card } from "react-bootstrap";
import { create } from "ipfs-http-client";
import axios from "axios";
import {getUsername,nftMint} from '../services/api'
import { Buffer } from "buffer";
import Swal from 'sweetalert2'
const projectId = "2MonXpsWqbTqkm3SQpTOVNbHiek";
const projectSecret = "f0d0dd7d62afa89cceb0981ab28461f3";
const auth =  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/api/v0",
  headers: {
    authorization: auth,
  },
});

export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState([]);
  const [resellModalShow, setResellModalShow] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [resellPrice, setResellPrice] = useState(0.0009);
  const [data, setData] = useState();
  const [image, setImage] = useState();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Art");
  const [username, setUsername] = useState("");
  const [forResell,setForResell] = useState(false);
 
 
  useEffect(()=>{
    getUsername(account).
    then((response)=>{
      setUsername(response.data.user.username)
    })
    .catch((error)=>{
    })
  },[])


  const loadPurchasedItems = async () => {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter = marketplace.filters.Bought(
      null,
      null,
      null,
      null,
      null,
      account
    );
    const results = await marketplace.queryFilter(filter);
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(
      results.map(async (i) => {
        // fetch arguments from each result
        i = i.args;
        // get uri url from nft contract
        const uri = await nft.tokenURI(i.tokenId);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(i.itemId);
        // define listed item object
        let purchasedItem = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          
        };
        return purchasedItem;
      })
    );
    setLoading(false);
    setPurchases(purchases);
  };

  useEffect(() => {
    loadPurchasedItems();
  }, []);
useEffect(()=>{
  if(forResell===true){

  }
},[forResell])
  if (loading)
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Loading...</h2>
      </main>
    );

const mintThenList = async(result,nft_uri,uri)=>{
      await (await nft.mint(uri)).wait();
      // get tokenId of new nft
      const id = await nft.tokenCount();
      // approve marketplace to spend nft
      await (await nft.setApprovalForAll(marketplace.address, true)).wait();
      // add nft to marketplace
      const listingPrice = ethers.utils.parseEther(resellPrice.toString());
  
      await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
      axios.patch('http://192.168.1.134:3000/nft/update_resell_count',{
          "nft_json_link": nft_uri,
          "updatedValue": 1
      })
      .then((response)=>{
        if(response.data.statusCode===201){
          loadPurchasedItems();
        }
      }).catch((error)=>{
      })
      
}
  const handleResellModalSubmit = async (data,idx) => {
   setForResell(false)
    const nft_uri = await nft.tokenURI(data.itemId);
   
    axios.get(nft_uri).then(
      async (response) => {
      setName(response.data.name)
      setImage(response.data.image)
      setDescription(response.data.description)
      const result = await client.add(
        JSON.stringify({
          image: response.data.image,
          name: response.data.name,
          description: response.data.description,
          account,
          category: response.data.category,
          username,
        })  
      );
      axios.get(`http://192.168.1.134:3000/nft/resell_count/`,{params:{
        nft_json_link:nft_uri
      }}).then((response)=>{
        if(response.data.statusCode===200){
          if(response.data.resell_count===0){
            
            const uri = `https://oc-nft-marketplace.infura-ipfs.io/ipfs/${result.path}`;
            nftMint(name,description,parseFloat(resellPrice),image,account,category,0,uri)
            .then((response) => {
              if(response.data.statusCode===23505){
                Swal.fire({
                  icon: 'error',
                  title: 'NFT already exists',
                  text: 'This NFT already exist submit another' 
                })
              }
              if(response.data.statusCode===201){
                mintThenList(result,nft_uri,uri);
                Swal.fire(
                  'Good job your NFT is getting processed!',
                  'Confirm all three steps to resell your NFT',
                  'success'
                )}  
            })
            .catch((error) => {
              })
          }else{
            Swal.fire({
              icon: 'error',
              title: 'NFT already kept for resell',
              text: 'NFT listed for sell'
            });
          }
        }})
        
    
    }).catch((error)=>{
  })
  }
  return (
    <div className="flex justify-center" style={{ color: "white" }}>
      <h2 className="data_h2">Purchased Items</h2>
      {purchases.length > 0 ? (
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card
                  style={{
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    height: "fit-content",
                    width: "19vw",
                    minHeight:"5vh"
                  }}
                >
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>Name:{item.name} </Card.Footer>
                  <Card.Footer>
                    Price:{ethers.utils.formatEther(item.totalPrice)} ETH
                  </Card.Footer>
                  <button
                    variant="primary"
                    onClick={() => {
                      handleResellModalSubmit(item,idx);
                    }}
                  >
                    Resell
                  </button>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      ) : (
        <main style={{ padding: "1rem 0" }}>
          <h2>No purchases</h2>
        </main>
      )}
    </div>
  );
      }