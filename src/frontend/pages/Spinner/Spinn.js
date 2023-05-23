import React from 'react'
import { Spinner } from 'react-bootstrap';
import '../App.css';
function Spinn() {
  return (
    <div className="spinner_upper">
                <Spinner className="spinner"animation="border" style={{ display: 'flex' }} />
                <p className='mx-3 my-0 spinner'>Awaiting Metamask Connection...</p>
                
              </div>
  )
}

export default Spinn