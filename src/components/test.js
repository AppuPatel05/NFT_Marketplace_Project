import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
async function asb() {
  const ethers = require("ethers");
  // //After adding your Hardhat network to your metamask, this code will get providers and signers
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer =  provider.getSigner();

  console.log(signer);
  const addr = await signer.getAddress();
  console.log("add:"+addr);
  // console.log("fff");

  // const ethers = require("ethers");
  // After adding your Hardhat network to your metamask, this code will get providers and signers
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner();
  // //Pull the deployed contract instance
  // let contract = new ethers.Contract(
  //   MarketplaceJSON.address,
  //   MarketplaceJSON.abi,
  //   signer
  // );

  // let transaction = await contract.getAllNFTs();

  // const items = await Promise.all(
  //   transaction.map(async (i) => {
  //     console.log(i.tokenId);
  //     const tokenURI = await contract.tokenURI(i.tokenId);
  //     console.log(tokenURI);
  //     let meta = await axios.get(tokenURI);
  //     meta = meta.data;

  //     let price = ethers.utils.formatUnits(i.price.toString(), "ether");
  //     let item = {
  //       price,
  //       tokenId: i.tokenId.toNumber(),
  //       seller: i.seller,
  //       owner: i.owner,
  //       image: meta.image,
  //       name: meta.name,
  //       description: meta.description,
  //     };
  //     return item;
  //   })
  // );
}

asb();
export default function Test(props) {
  return <div style={{ minHeight: "100vh" }}></div>;
}
