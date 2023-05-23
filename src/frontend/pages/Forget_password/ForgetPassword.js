import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import {forgetPasswordGetMail} from '../../services/api'
function ForgetPassword() {
    const [u_name, setU_name] = useState('')
    const [errMessage, setErrMessage] = useState([])
    const [message, setMessage] = useState('')
    const [typing,setTyping] = useState(false)
    const [hasSubmit,setHasSubmit] = useState(false)
    const sendOtp = (e) => {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        setTyping(false)
        e.preventDefault()
        if (emailRegex.test(u_name)) {
            forgetPasswordGetMail(u_name)
                .then(
                    (response) => {

                        if (response.status === 201) {
                            Swal.fire(
                                'Email Sent!',
                                'Password change link sent to registered email id',
                                'success'
                              )
                            setMessage("Message Sent to registered email id")
                        }
                        if (response.status === 401) {
                            setErrMessage("")
                        }

                    }
                )
                .catch((error) => {
                    if (error.response) {

                        setErrMessage([error.response.data.message])

                    } else {

                    }
                })
        }

    }
    useEffect(()=>{
        const goTo = setTimeout(()=>{
            if(message==="Message Sent to registered email id"){
                
            }
        },1000)
        return ()=>clearTimeout(goTo)
    },[message])
    useEffect(()=>{
        if(hasSubmit){
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (u_name === '') {
            setMessage('This field is required')

        }
        else if(!emailRegex.test(u_name)){
            setMessage('Enter a valid email')
        }
    }
    },[u_name])
    const handleClick = () => {
        setHasSubmit(true)
        setTyping(false)
        setMessage('')
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (u_name === '') {
            setMessage('This field is required')

        }
        else if(!emailRegex.test(u_name)){
            setMessage('Enter a valid email')
        }
      }
    return (
        <div className='forget_password_form'>
    <div className='form_tag'>
            {typing ? '' : <p className='form_text' >{errMessage[0]}</p>}
            {typing ? '' : <p className='form_text' >{message}</p>}
                <form onSubmit={sendOtp} className='form_element'>
                <div className='icon_input_container'>
                <i
                    className="bi bi-envelope"
                    style={
                      message
                        ? { position: "relative"     }
                        : {}
                    }
                  ></i>
                    <input type="text" className="form_input_tag" placeholder='Enter registered email' onChange={e => { setU_name(e.target.value)}} ></input><br></br>
                    </div>
                    <button onClick={()=>{handleClick()}} className="form_submit_button"  >Send Link</button>
                </form>

        </div>
        </div>
    )
}

export default ForgetPassword