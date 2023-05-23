import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Loading from "react-loading";
import left_image from "../../Assets/Image_Placeholder.png";
import Swal from "sweetalert2";
import { userSignIn, updateMetamask,usernameSignIn } from "../../services/api";
function Login({ account, web3Handler, web3HandlerRemove }) {
  const navigate = useNavigate();
  const [u_name, setU_name] = useState("");
  const [u_message, setU_message] = useState("");
  const [password, setPassword] = useState("");
  const [password_message, setPassword_message] = useState("");
  const [errMessage, setErrMessage] = useState([]);
  const [typing, setTyping] = useState(false);
  const [message, setMessage] = useState("");
  const [dataShow, setDataShow] = useState("");
  const [metaAdd, setMetaAdd] = useState("");
  const [patchData, setPatchData] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitClicked, setSubmitClicked] = useState(false);
  let myProp = "Password updated";

  async function getAcc() {
    const data = await web3Handler();
    return data;
  }
  useEffect(()=>{
    window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
  },[])
  useEffect(() => {
    const stopLogin = setTimeout(() => {
      if (setIsLoading) {
        setIsLoading(false);
      }
    }, 2000);
    return () => clearTimeout(stopLogin);
  }, [isLoading]);

  const handleSubmit = (e) => {
    setTyping(false);
    const emailRegex =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    e.preventDefault();
    if (canSubmit) {
      if (emailRegex.test(u_name)) {
        setIsLoading(true);

        userSignIn(u_name, password)
          .then((response) => {
            if (response.status === 201) {
              let datax = getAcc();
              let jsonData;
              datax.then((data) => {
                jsonData = JSON.stringify(data);
                const myArr = jsonData.split('"');
                updateMetamask(u_name, myArr[1])
                  .then((res) => {
                    if (res.status === 200) {
                      Swal.fire(
                        "Good job!",
                        "You have successfully logged-in",
                        "success"
                      );
                      navigate("/");
                    }
                  })
                  .catch((error) => {
                    web3HandlerRemove();
                    if (error.response) {
                      setErrMessage([error.response.data.message]);
                    } else {
                    }
                  });
              });
            }
            if (response.status === 401) {
              setErrMessage("");
            }
          })
          .catch((error) => {
            if (error.response) {
              setErrMessage([error.response.data.message]);
            } else {
            }
          });
      } else {
        setIsLoading(true);

        usernameSignIn(u_name, password)
          .then((response) => {
            if (response.status === 201) {
              let datax = getAcc();
              let jsonData;
              datax.then((data) => {
                jsonData = JSON.stringify(data);
                const myArr = jsonData.split('"');
                updateMetamask(u_name, myArr[1])
                  .then((res) => {
                    if (res.status === 200) {
                      Swal.fire(
                        "Good job!",
                        "You clicked the button!",
                        "success"
                      );
                      navigate("/");
                    }
                  })
                  .catch((error) => {
                    web3HandlerRemove();
                    if (error.response) {
                      setErrMessage([error.response.data.message]);
                    } else {
                    }
                  });
              });
            }
            if (response.status === 401) {
              setErrMessage("");
            }
            //return response.json()
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
    myProp = u_name;
  }, [u_name]);
  function handleClick() {
    navigate("/forgot-password", { state: { myProp } });
  }
  function handleClickSignup() {
    navigate("/signup");
  }

  useEffect(() => {
    if (submitClicked === true) {
      handlePasswordValidation();
    }
  }, [password]);
  useEffect(() => {
    if (submitClicked === true) {
      handleUsernameValidation();
    }
  }, [u_name]);
  const handlePasswordValidation = () => {
    const passwordRegex =
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    if (password === "") {
      setPassword_message("Password is required");
    } else if (password.length < 8 && password !== "") {
      setPassword_message("Password must be longer than 7 characters");
    } else if (!passwordRegex.test(password)) {
      setPassword_message("Must have 1 upper 1 lower 1 special 1 numeric ");
    }
  };

  const handleUsernameValidation = () => {
    if (u_name === "") {
      setU_message("Username is required");
    }
  };
  const handleClickLogin = () => {
    setSubmitClicked(true);
    setTyping(false);
    setMessage("");
    const passwordRegex =
      /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    if (u_name === "") {
      setU_message("Username is required");
    }
    if (password === "") {
      setPassword_message("Password is required");
    } else if (password.length < 8 && password !== "") {
      setPassword_message("Password must be longer than 7 characters");
    } else if (!passwordRegex.test(password)) {
      setPassword_message("Must have 1 upper 1 lower 1 special 1 numeric ");
    } else {
      setCanSubmit(true);
    }
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
            <h1 className="form_heading">Log in to your account</h1>
            <h3 className="form_text">
              Enter your details and start creating<br></br>collecting and
              selling nft
            </h3>
            {typing ? (
              ""
            ) : (
              <p className="form_text" style={{ color: "red" }}>
                {errMessage[0]}
              </p>
            )}
            {typing ? (
              ""
            ) : (
              <p className="form_text" style={{ color: "red" }}>
                {message}
              </p>
            )}
            <form className="form_element" onSubmit={handleSubmit}>
              <div className="icon_input_container">
                <span className="form_icon_svg_span_login">
                  <i
                    className="bi bi-envelope"
                    style={
                      u_message ? { position: "relative", right: "5px" } : {}
                    }
                  ></i>
                </span>
                <input
                  className="form_input_tag"
                  type="text"
                  placeholder="Enter email or username"
                  onChange={(e) => {
                    setTyping(true);
                    setU_message("");
                    setU_name(e.target.value);
                  }}
                  required
                ></input>
                <br></br>
                {u_message && (
                  <div className="validation_message01">{u_message}</div>
                )}
              </div>
              <div className="icon_input_container">
                <span className="form_icon_svg_span_login">
                  <i
                    className="bi bi-file-lock"
                    style={
                      password_message
                        ? { position: "relative", right: "5px" }
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
                  <div className="validation_message01">{password_message}</div>
                )}
              </div>
              <button
                onClick={handleClickLogin}
                className="form_submit_button"
                type="submit"
                placeholder="create account"
              >
                Log in your account
              </button>
              <p className="form_text_link" onClick={handleClick}>
                Forgot Password?
              </p>
              <p className="form_text_link" onClick={handleClickSignup}>
                Not a user? Signup
              </p>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
