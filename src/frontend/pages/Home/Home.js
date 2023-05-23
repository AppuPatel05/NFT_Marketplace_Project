import React,{ useState, useEffect } from "react";

import NFTCardList from '../../components/NFTCardList'
import { useNavigate } from "react-router-dom";
import monkey from "../../Assets/monkey.png";
import "../App.css";
import btc from "../../Assets/bitcoin .png";
import btcash from "../../Assets/bitcoin_cash.png";
import dfinity from "../../Assets/dfinity.png";
import ethereum from "../../Assets/ethereum.png";
import eth_gif from "../../Assets/giphy_eth_2.gif";
import Swal from 'sweetalert2'
import './Home.css'
import {totalCount,nftTransaction} from '../../services/api'
import HowItWorkCardList from "../../components/HowItWorkCardList";
const HowItWorkCardListMemo = React.memo(HowItWorkCardList)
const Home = ({ setTokID, marketplace, nft, buttonLoad, account }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectCategory,setSelectCategory] = useState('All')
  const [nftCount, setNftCount] = useState();
  const [userCount, setUserCount] = useState();
  const [transactionCount, setTransactionCount] = useState();
  const [items, setItems] = useState([]);
  const loadData = () => {
    totalCount()
      .then((response) => {
        setNftCount(response.data.nftCount);
        setUserCount(response.data.userCount);
        setTransactionCount(response.data.transactionCount);
      })
      .catch((error) => {
      });
  };
  const loadMarketplaceItems = async () => {
    const itemCount = await marketplace.itemCount();

    let items = [];
    for (let i = 1; i <= itemCount; i++) {
      const item = await marketplace.items(i);
      if (!item.sold) {
        // get uri url from nft contract
        const uri = await nft.tokenURI(item.tokenId);
        setTokID(uri);
        // use uri to fetch the nft metadata stored on ipfs
        const response = await fetch(uri);
        const metadata = await response.json();
        // get total price of item (item price + fee)
        const totalPrice = await marketplace.getTotalPrice(item.itemId);
        // Add item to items array
        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: metadata.name,
          description: metadata.description,
          image: metadata.image,
          category: metadata.category,
          username:metadata.username
        });
      }
    }
    setLoading(!loading);
    setItems(items);

  };
  const buyMarketItem = async (item) => {
    if(buttonLoad){
      Swal.fire({
        icon: 'error',
        title: 'Login Required',
        text: 'Metamask wallet is required' 
      })
    }else{
    await (
      await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })
    ).wait();
    const nft_uri = await nft.tokenURI(item.itemId);
      nftTransaction(account.toLowerCase(),item.seller.toLowerCase(),nft_uri)
      .then((response) => {
        if(response.status===201){
          Swal.fire(
            'NFT Bought!',
            'You have successfully bought an NFT',
            'success'
          )
          setLoading(true)
        }
      })
      .catch((error) => {
      });
    await loadMarketplaceItems();
    loadData();
  }
  };
  useEffect(() => {
    loadMarketplaceItems();
    loadData();
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  }, []);


  const Loaded = () => {
    return (
      <>
        <div className="main_page ">
          <div className="home_left">
            <p className="home_body_text_medium">THE LARGEST NFT MARKETPLACE</p>
            <h1 className="home_body_text_title">
              Discover, Collect & Sell Popular{" "}
              <p className="border_nft">NFTs</p>
            </h1>
            <p className="home_body_text_small">
              The world’s largest marketplace for NFTs <br></br>character
              collections non fungible token NFTs
            </p>
            {buttonLoad?(
              <button
              className="home_body_button"
              onClick={() => {
                navigate("/login");
              }}
            >
              <i className="bi bi-rocket-takeoff"></i> Connect Wallet
            </button>
            ):('')
            }
            <ul className="ul_list">
              <li className="li_home_list">
                <p className="home_body_number">{nftCount}+</p>
                <p className="li_body_text">Total NFTs</p>
              </li>
              <li className="li_home_list">
                <p className="home_body_number">{userCount}+</p>
                <p className="li_body_text">Total Users</p>
              </li>
              <li className="li_home_list">
                <p className="home_body_number">{transactionCount}+</p>
                <p className="li_body_text">Total Transactions</p>
              </li>
            </ul>
          </div>
          <div className="home_right">
            <img className="home_img" src={monkey}></img>
          </div>
        </div>
        <div className="module_border_wrap">
          <div className="seperation">
            <ul className="seperation_ul">
              <li className="seperation_li">
                <img className="seperation_li_img" src={btc}></img>
                <p className="seperation_li_p">Bitcoin</p>
              </li>
              <li className="seperation_li">
                <img className="seperation_li_img" src={ethereum}></img>
                <p className="seperation_li_p">Ethereum</p>
              </li>
              <li className="seperation_li">
                <img className="seperation_li_img" src={dfinity}></img>
                <p className="seperation_li_p">Dfinity</p>
              </li>
              <li className="seperation_li">
                <img className="seperation_li_img_last" src={btcash}></img>
                <p className="seperation_li_p_last">Bitcoin Cash</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="nft_item_box">
          <div className="nft_item_heading">
            <h1 className="nft_item_h1">All Collection</h1>
            <p className="nft_item_p">
              Checkout our all collection updated Trading Collection
            </p>
            <div className='nft_item_select_category'>
              <ul className='nft_item_select_category_ul'>
                <li className='nft_item_select_category_li'><button  id='All' className='nft_item_select_category_button'  onClick={()=>setSelectCategory('All')}>All</button></li>
                <li className='nft_item_select_category_li'><button  id='Art' className='nft_item_select_category_button'  onClick={()=>setSelectCategory('Art')}>Art</button></li>
                <li className='nft_item_select_category_li'><button  id='Gaming' className='nft_item_select_category_button'  onClick={()=>setSelectCategory('Gaming')}>Gaming</button></li>
                <li className='nft_item_select_category_li'><button  id='Gaming' className='nft_item_select_category_button'  onClick={()=>setSelectCategory('Memes')}>Memes</button></li>
              </ul>
            </div>
            <div className='nft_item_select_category_mobile'>
              <select onChange={(e)=>setSelectCategory(e.target.value)}>
                <option value='Art' defaultValue>All</option>
                <option value='Art'>Art</option>
                <option value='Art'>Gaming</option>
                <option value='Art'>Memes</option>
              </select>
            </div>
            <div className="flex justify-center">
              {items.length > 0 ? (
                
                <NFTCardList items={items} buyMarketItem={buyMarketItem} selectCategory={selectCategory}></NFTCardList>
                
              ) : (
                <main style={{ padding: "1rem 0", color: "white" }}>
                  <h2>No listed assets</h2>
                </main>
              )}
            </div>
          </div>
        </div>

        <div className="module_border_wrap">
          <div className="seperation" style={{ height: "22vh" }}>
            <div className="what_is_eth_">
              <div className="what_is_eth_gif">
                <img src={eth_gif}></img>
              </div>
              <div className="what_is_eth_text">
                <p className="what_is_eth_text_header">What is Ethereum?</p>
                <p className="what_is_eth_text_body">
                  Ethereum is a decentralized blockchain platform that
                  establishes a peer-to-peer network that securely executes and
                  verify smart contracts. The ethereum platform builds of block-
                  chain technology.
                </p>
              </div>
            </div>
          </div>
        </div>
        <HowItWorkCardListMemo />
      </> 
    );
  };
  return Loaded();
};

export default Home;
