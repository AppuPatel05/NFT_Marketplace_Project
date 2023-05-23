import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";
import left_image from "../../Assets/Image_Placeholder.png";
import Loading from "react-loading";
import Swal from 'sweetalert2'
import {userSignUp} from '../../services/api'
function Signup() {
  const navigate = useNavigate();
  const [u_name, setU_name] = useState("");
  const [u_message, setU_message] = useState("");
  const [e_mail, setE_mail] = useState("");
  const [e_message, setE_message] = useState("");
  const [password, setPassword] = useState("");
  const [password_message, setPassword_message] = useState("");
  const [temppassword, setTempPassword] = useState("");
  const [temp_password_message, setTemp_Password_message] = useState("");
  const [click, setClick] = useState(false);
  const [errMessage, setErrMessage] = useState([]);
  const [message, setMessage] = useState("");
  const [typing, setTyping] = useState(false);
  const [nowsubmit, setNowSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitClicked,setSubmitClicked] = useState(false);
  useEffect(()=>{
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  },[])
  const handleSubmit = (e) => {
    e.preventDefault();
    if (nowsubmit) {
      if (temppassword === password && password !== "") {
        setIsLoading(true);
          userSignUp(e_mail,u_name,password,temppassword)
          .then((resp) => {
            if (resp.status === 201) {
              setErrMessage([]);
              Swal.fire(
                'Good job!',
                'You have signed up verify your email id',
                'success'
              )
              navigate("/login");
            } else {
              setErrMessage(resp);
            }
          })
          .catch((error) => {
            if (error.response) {
              setErrMessage([error.response.data.message]);
            } else {
            }
          });
      }
    }
  };
  useEffect(() => {
    const stopLogin = setTimeout(() => {
      if (setIsLoading) {
        setIsLoading(false);
      }
    }, 3000);
    return () => clearTimeout(stopLogin);
  }, [isLoading]);
  useEffect(()=>{
    if(submitClicked===true){
    handleClick()
    }
  },[password])
  useEffect(()=>{
    if(submitClicked===true){
      handleClick()
    }
    
  },[u_name])
  useEffect(()=>{
    if(submitClicked===true){
      handleClick()
    }
    
  },[e_mail])
  useEffect(()=>{
    if(submitClicked===true){
      handleClick()
    }
    
  },[temppassword])
  const handleClick = () => {
    setSubmitClicked(true)
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const passwordRegex =
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    setMessage("");

    if (u_name === "" || password === "" || e_mail === "" || temppassword === "")
   if (u_name === "") {
      setU_message("Username is required");
    }  
    else if (u_name.length < 5) {
      setU_message("Username must be longer than 4 characters");
    }
    if (e_mail === "") {
      setE_message("Email is required");
    } 
    else if (emailRegex.test(u_name)) {
      setE_message("Username cannot be a mail");
    }  else if (!emailRegex.test(e_mail)) {
      setE_message("Enter valid email");
    } else{
      setE_message('')
    }
    if(password === ""){
      setPassword_message("Password is required");
    }
    else if (password.length < 8) {
      setPassword_message("Password must be longer than 7 characters");
    }else if (!passwordRegex.test(password)) {
      setPassword_message("Must have 1 upper 1 lower 1 special 1 numeric ");
    }
    if(temppassword === ""){
      setTemp_Password_message("Temporary Password is required");
    }
    else if (password !== temppassword) {
      setTemp_Password_message("Password does not match");
    } 
     else {
      setErrMessage([]);
      setNowSubmit(true);
    }
  };
  const handleClickLogin = () => {
    navigate("/login");
  };
  if (isLoading) {
    return (
      <div className="login_loading_div">
        <Loading />
      </div>
    );
  } else {
    return (
      
      <div className="signup_form">
        <div className="form_tag">
          <div className="form_left">
            <img className="img_form" src={left_image}></img>
          </div>
          <div className="form_right">
            <h1 className="form_heading">Create your account</h1>
            <h3 className="form_text">
              Enter your details and start creating<br></br>collecting and
              selling nft
            </h3>
            {errMessage.length > 0 && !typing
              ? errMessage.map((item) => <p className="form_text" style={{color:'red'}}>{item}</p>)
              : ""}
            {typing ? "" : <p className="form_text" style={{color:'red'}}>{message}</p>}
            <form onSubmit={handleSubmit} className="form_element">
              <div className="icon_input_container">
                <span className="form_icon_svg_span_signup">
                  <i
                    className="bi bi-person"
                    style={
                      u_message
                        ? { position: "relative", right: "5px" }
                        : {}
                    }
                  ></i>
                </span>
                <input
                  className="form_input_tag"
                  type="text"
                  placeholder="Username"
                  onChange={(e) => {
                    setTyping(true);
                    setU_message("");
                    setU_name(e.target.value);
                  }}
                  required
                ></input>
                {u_message && (
                  <div
                    className="validation_message01"
                  >
                    {u_message}
                  </div>
                )}
                <br></br>
              </div>
              <div className="icon_input_container">
                <span className="form_icon_svg_span_signup">
                  <i
                    className="bi bi-envelope"
                    style={
                      e_message
                        ? { position: "relative",  right: "5px" }
                        : {}
                    }
                  ></i>
                </span>
                <input
                  className="form_input_tag"
                  type="text"
                  placeholder="Email Address"
                  onChange={(e) => {
                    setTyping(true);
                    setE_message("");
                    setE_mail(e.target.value);
                  }}
                  required
                ></input>
                {e_message && (
                  <div
                    className="validation_message01"
                  >
                    {e_message}
                  </div>
                )}
                <br></br>
              </div>
              <div className="icon_input_container">
                <span className="form_icon_svg_span_signup">
                  <i
                    className="bi bi-file-lock"
                    style={
                      password_message
                        ? { position: "relative",  right: "5px" }
                        : {}
                    }
                  ></i>
                </span>
                <input
                  className="form_input_tag"
                  type="password"
                  placeholder="Password"
                  onChange={(e) => {
                    setTyping(true);
                    setPassword_message("");
                    setPassword(e.target.value);
                  }}
                  required
                ></input>
                <br></br>
                {password_message && (
                  <div
                    className="validation_message01"
                  >
                    {password_message}
                  </div>
                )}
              </div>
              <div className="icon_input_container">
                <span className="form_icon_svg_span_signup">
                  <i
                    className="bi bi-file-lock"
                    style={
                      temp_password_message
                        ? { position: "relative",  right: "5px" }
                        : {}
                    }
                  ></i>
                </span>
                <input
                  className="form_input_tag"
                  type="password"
                  placeholder="Confirm-password"
                  onChange={(e) => {
                    setTyping(true);
                    setTemp_Password_message("");
                    setTempPassword(e.target.value);
                    if (password === setTempPassword) {
                      setClick(true);
                    }
                  }}
                ></input>
                <br></br>
                {temp_password_message && (
                  <div
                    className="validation_message01"
                  >
                    {temp_password_message}
                  </div>
                )}
              </div>

              <button
                onClick={handleClick}
                className="form_submit_button"
                type="submit"
                placeholder="create account"
              >
                Create Account
              </button>
              <br></br>
              <p
                onClick={handleClickLogin}
                className="form_text_link"
                type="submit"
                placeholder=""
              >
                Have an account? Log in
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Signup;
