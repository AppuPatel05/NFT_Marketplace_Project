import React from 'react'
import './Footer.css'
import {useNavigate} from 'react-router-dom'
function FooterAft({account}) {
    const navigate = useNavigate()
    return (
        <>
        <div className='Footer' >

            <div className='footer-left-div'>
                <h5 className='footer-heading'>NFT Marketplace</h5>
                <p className='footer-text'>NFT marketplace ui created with reactjs</p>
                <h5 className='footer-heading'>Join our community</h5>
                <div className='icon_list'>
                <i className="bi bi-twitter"></i>
                </div>
                <div className='icon_list'>
                <i className="bi bi-facebook"></i>
                </div>
                <div className='icon_list'>
                <i className="bi bi-youtube"></i>
                </div>
                <div className='icon_list'>
                <i className="bi bi-linkedin"></i>
                
                </div>

            </div>
            <div className='footer-center-div'>
                <h5 className='footer-heading' >Explore</h5>

                <p className='footer-text' id='footer-home' onClick={()=>{navigate('/')}}>Home</p>

                <p className='footer-text' id='footer-create' onClick={()=>{navigate('/create')}}>Create</p>
                
                <p className='footer-text' id='footer-create' onClick={()=>{navigate('/userprofile/${account}')}}>User profile</p>


            </div>


            <div className='footer-right-div'>
                <h5 className='footer-heading'>Join Our Weekly Digest</h5>

                <p className='footer-text'>Get Executive promotions  & updates
                straight to your inbox</p>
                <div className='footer_input'>
                    <input className='footer_input_tag' type='email' value='Enter your email here' readOnly></input>
                    <button className='footer_button_tag'>Subscribe</button>
                </div>
                
            </div>
            
        </div>
        <div  className="copyright_text_mobile">copyright @2023 NFT. All right reserved</div>
                

        </>
    )
}

export default FooterAft