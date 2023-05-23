import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import "../App.css";
import oc_nft from "../../Assets/OC_NFT.png";
import './navbar.css'
import {getSearchData} from '../../services/api'
const Navigation = ({ web3HandlerRemove, web3Handler, account }) => {
  const navigate = useNavigate();

  const [searchData, setSearchData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [isClickedHome, setIsClickedHome] = useState(true);
  const [isClickedSignup, setIsClickedSignup] = useState(false);
  const [isClickedCreate, setIsClickedCreate] = useState(false);
  const [isClickedSignin, setIsClickedSignin] = useState(false);
  const [isClickedMyPurchase, setIsClickedMyPurchase] = useState(false);
  const [clickSearch, setClickSearch] = useState(false);
  useEffect(() => {
    if (searchInput.length > 0) {
      const search = setTimeout(() => {
        getSearchData(searchInput)
          .then((response) => {
            if(response.data.message!=='No data found...!'){
              setSearchData(response.data.arr);
            }
            else{
              setSearchData([])
            }
          })
          .catch((error)=>{
          })
      }, 1000);
      return () => clearTimeout(search);
    } else {
      setSearchData([]);
    }
  }, [searchInput]);
  const handleSignupButton = () => {
    setIsClickedHome(false);
    setIsClickedCreate(false);
    setIsClickedSignup(true);
    setIsClickedSignin(false);
    setIsClickedMyPurchase(false);
    navigate("/signup");
  };
  const handleSigninButton = () => {
    setIsClickedHome(false);
    setIsClickedCreate(false);
    setIsClickedSignup(false);
    setIsClickedSignin(true);
    setIsClickedMyPurchase(false);
    navigate("/login");
  };
  const handleHomeButton = () => {
    setIsClickedHome(true);
    setIsClickedCreate(false);
    setIsClickedSignup(false);
    setIsClickedSignin(false);
    setIsClickedMyPurchase(false);
    navigate("/");
  };
  const handleCreateButton = () => {
    setIsClickedHome(false);
    setIsClickedCreate(true);
    setIsClickedSignup(false);
    setIsClickedSignin(false);
    setIsClickedMyPurchase(false);
    navigate("/create");
  };
  const handleMyPurchasededButton = () => {
    setIsClickedHome(false);
    setIsClickedCreate(false);
    setIsClickedSignup(false);
    setIsClickedSignin(false);
    setIsClickedMyPurchase(true);
    navigate(`/userprofile/${account}`);
  };
  const closedSearch = () => {
    return (
      <div
        className="nav_search_data"
        onClick={() => {
          setClickSearch(true);
        }}
      >
        <button className="nav_search_button">
          <span className="nav_search_icon_i_span">
            <i className="bi bi-search"></i>
          </span>
        </button>
      </div>
    );
  };
  const openSearch = () => {
    return (
      <div className="nav_search_element">
        <div className="nav_search_input">
          <input
            type="text"
            placeholder="Search..."
            className="nav_search_input_tag"
            onChange={(e) => setSearchInput(e.target.value)}
          ></input>

          <i
            className="bi bi-x-lg"
            onClick={() => {
              setClickSearch(false);
              setSearchData([]);
              setSearchInput("");
            }}
          ></i>
        </div>
        <>
          {searchData.length > 0 ? (
            <>
              <table
              
                style={{
                  width: "200px",
                  position: "absolute",
                  marginRight: "70px",
                }}
              >
                {searchData.map((item) => (
                  <>
                    <tr>
                      <td className="auto-complete">{item.nft_name}</td>
                    </tr>
                  </>
                ))}
              </table>
            </>
          ) : (
            <>
              <table style={{ width: "200px" }}>
                <>
                  <tr>No data found</tr>
                </>
              </table>
            </>
          )}
        </>
      </div>
    );
  };
  return (
    <Navbar  expand="lg" variant="dark">
      <Container >
        <Navbar.Brand className="nav_title" style={{ cursor: "pointer" }}>
          <img src={oc_nft}></img>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <div
              onClick={handleHomeButton}
              className={
                isClickedHome ? "nav-link-items-clicked" : "nav-link-items"
              }
            >
              Home
            </div>
            <div
              onClick={handleCreateButton}
              className={
                isClickedCreate ? "nav-link-items-clicked" : "nav-link-items"
              }
            >
              Create
            </div>
            <div
              onClick={handleMyPurchasededButton}
              className={
                isClickedMyPurchase ? "nav-link-items-clicked" : "nav-link-items"
              }
            >
              User profile
            </div>
            <div
              onClick={handleSignupButton}
              className={
                isClickedSignup ? "nav-link-items-clicked" : "nav-link-items"
              }
              id="left_signup"
            >
              Sign Up
            </div>
            <div
              onClick={handleSigninButton}
              className={
                isClickedSignin ? "nav-link-items-clicked" : "nav-link-items"
              }
              id="left_signin"
            >
              Sign In
            </div>
          </Nav>

          <Nav className="left_nav">
            {clickSearch ? openSearch() : closedSearch()}

            {account ? (
              <Button variant="outline-light" onClick={web3HandlerRemove}>
                Logout {account.slice(0, 5) + "..." + account.slice(38, 42)}
                
              </Button>
            ) : (
              <>
                <button
                  onClick={handleSignupButton}
                  id="sgup"
                  className={
                    isClickedSignup
                      ? "nav-button-item-clicked"
                      : "nav-button-item"
                  }
                >
                  Sign up
                </button>
                <button
                  id="lgin"
                  className={
                    isClickedSignin
                      ? "nav-button-item-clicked"
                      : "nav-button-item"
                  }
                  onClick={handleSigninButton}
                >
                  Login
                </button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
