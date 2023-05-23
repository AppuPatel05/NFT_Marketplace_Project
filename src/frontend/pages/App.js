import React,{ useEffect, useState, useRef }from 'react'
import './App.css';
import {  Route, Routes } from 'react-router-dom'
import { detectEthereumProvider } from '@metamask/detect-provider';

//Ethers.js library it will allow us to talk to ethereum nodes we have used it in test and deploy scripts
//to connect to local dev blockchain and we will use it for the same thing for our app
//Except ethers is going to connect to metamask and metamask is already connected to block-chain 
//So ethers will use metamask as ethereum providers , there are many types of providers the provider 
//Provided by metamask is called the web3 provider
import { ethers } from 'ethers';
import MyPurchases from './MyPurchases'
import Spinn from '../pages/Spinner/Spinn';



// import MarketplaceAbi from '../contractsData/Marketplace.json'
// import MarketplaceAddress from '../contractsData/Marketplace-address.json'
// import NFTAbi from '../contractsData/NFT.json'
// import NFTAddress from '../contractsData/NFT-address.json'


import Marketplace from '../../Marketplace.json';
import Nft from '../../NFT.json';




import Navigation from '../pages/Navbar/Navbar'
import Create from '../pages/Create/Create';
import Home from '../pages/Home/Home';
import Detail from './Detail';
import Login from '../pages/Login/Login';
import Signup from '../pages/Signup/Signup';
import ForgetPassword from '../pages/Forget_password/ForgetPassword';
import MyListedItems from './MyListedItems'
import Footer from '../pages/Footer/Footer';
import FooterAft from '../pages/Footer/FooterAft'

import Loader from '../pages/Loading/Loading'
import UserProfile from './User_profile/UserProfile';
const MemoFooter = React.memo(Footer)
const MemoFooterAfter = React.memo(FooterAft)
const useStateWithCallback = (initialState) => {
  const [state, setState] = useState(initialState);
  const callbackRef = useRef(() => undefined);
 

  const setStateCB = (newState, callback) => {
    callbackRef.current = callback;
    setState(newState);
  };

  useEffect(() => {
    if (callbackRef.current) {
      callbackRef.current();
    }
  }, [state]);

  return [state, setStateCB];
};

function App() {
  const [loading, setLoading] = useState(true)
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState({})
  const [isDataLoad, setIsDataLoad] = useState();
  const [marketplace, setMarketplace] = useStateWithCallback()
  const [tokID, setTOKID] = useState()
  const [provider,setProvider] = useState(null)
  const detectProvider = async () => {
    const provider = await detectEthereumProvider();
    if (provider) {
      setProvider(provider);
      const signer = provider.getSigner();
      loadContracts(signer);
    } else {
  
      // Display a prompt for the user to manually connect to MetaMask
      const connectButton = document.createElement('button');
      connectButton.innerText = 'Connect to MetaMask';
      connectButton.onclick = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        loadContracts(signer);
      };
      document.body.appendChild(connectButton);
    }
  };
  useEffect(() => {
    if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
      // MetaMask is installed
      const provider = new ethers.providers.Web3Provider(window.ethereum)
    //Then we get the signer of the connected account from the provider
    const signer = provider.getSigner()
    loadContracts(signer)
    } else {
      detectProvider()
    }

    
  }, [])

  //Lets create a function which handles this connection with the metamask
  //Setup connection with blockchain
  const web3Handler = async () => {
    //Fetching the accounts listed in our metamask wallet
    //It will return array of accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    //from array of accounts the first account listed represent the account that is connected to the app
    //We are going to display address of that account on nav
    // if(acToken===null){<Login setacToken/>}else{
      setLoading(false)
    setAccount(accounts[0])
    //Got new provider from metamask by writing
    //after.providers specifying type of the provider web3provider
    //passing the window.ethereum object injected into the browser by the metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    // //Then we get the signer of the connected account from the provider
    const signer = provider.getSigner()

    return accounts[0]
  }
  const web3HandlerRemove = () => {
    setAccount(null)
    setLoading(true)

  }
  //Next step load the contract from the blockchain for that we will create loadContracts function
  const loadContracts = async (signer) => {
    //We will fetch/get deployed copies of the contract
    const mk = new ethers.Contract(Marketplace.address, Marketplace.abi, signer)

    // setMarketplace(mk)
    setMarketplace(mk, () => {
      setIsDataLoad(true)
    })
    const nft = new ethers.Contract(Nft.address, Nft.abi, signer)
    setNFT(nft)
    
    

  }
  return (
  
    
      <div className='App'>
        
          <Navigation web3HandlerRemove={web3HandlerRemove} web3Handler={web3Handler} account={account} />
      

          <div className="home_section">
         <Routes>
              <Route path="/" element={isDataLoad && <Home  setTokID={setTOKID} marketplace={marketplace} nft={nft} buttonLoad={loading} account={account}/>}></Route>
              <Route path="/signup" element={<Signup/>}></Route>
              <Route path="/login" element={<Login account={account} web3Handler={web3Handler} web3HandlerRemove={web3HandlerRemove}/>}></Route>
              <Route path='/create'
                element={loading ? <Spinn /> : <Create marketplace={marketplace} nft={nft} account={account}/>}
              ></Route>
              <Route path='/forgot-password' element={<ForgetPassword/>} />
              <Route path="/my-listed-items" element={loading ? <Spinn /> : <MyListedItems marketplace={marketplace} nft={nft} account={account} />}></Route>
              <Route path="/my-purchases" element={loading ? <Spinn /> : <MyPurchases marketplace={marketplace} nft={nft} account={account} />}></Route>
              <Route path='/detail' element={<Detail forURI={tokID} marketplace={marketplace} nft={nft} />}></Route>
              <Route path='/userprofile/:id'  element={loading ? <Spinn /> : <UserProfile marketplace={marketplace} nft={nft} account={account}/>}
              ></Route>
              <Route path='/loading' element={<Loader/>}></Route>
            </Routes>
             

          </div>
       
        {loading?<MemoFooter />:<MemoFooterAfter  account={account}/>}
       
      </div>
  );
}

export default App;
