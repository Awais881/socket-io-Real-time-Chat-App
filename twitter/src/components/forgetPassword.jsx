
import { useState, useContext } from "react";
import { GlobalContext } from '../context/context';
import {
    MDBBtn, MDBContainer,MDBRow,MDBCol, MDBIcon,MDBInput
  }
  from 'mdb-react-ui-kit';

import { Routes, Route, Link, Navigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import './changePassword.css'
import axios from "axios";


function ForgetPassword() {
    let { state, dispatch } = useContext(GlobalContext);



    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [isOtpSent, setIsOtpSent] = useState(false);


    const sendOtp = async (e) => {
      e.preventDefault();

      try {
          let response = await axios.post(`${state.baseUrl}/forget-password`, {
              email: email,
          }, {
              withCredentials: true
          })
          toast.success('sent otp Sucessfully', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
          console.log(response.data.message);
         setIsOtpSent(true)

      } catch (e) {
          console.log("e: ", e); 
          toast.error('Send Otp  error', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
        }


      // e.reset();
  }
    const ForgetPass = async (e) => {
      e.preventDefault();

      try {
          let response = await axios.post(`${state.baseUrl}/check-otp`, {
              email: email,
              otp: otp,
              newPassword: newPassword

          }, {
              withCredentials: true
          })
          toast.success('Changed Sucessfully', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
          console.log(response.data.message);
         setIsOtpSent(true)

      } catch (e) {
          console.log("e: ", e); 
          toast.error('Changed error', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          })
        }


      // e.reset();
  }


    return (
        <>
     
      
     <MDBContainer fluid>
      <MDBRow>

        <MDBCol sm='6'>

          <div className='d-flex flex-row ps-5 pt-5'>
            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }}/>
            <span className="h1 fw-bold mb-0">Tweets</span>
          </div>

          <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>

            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{letterSpacing: '1px'}}>Forget Password</h3>
            <form onSubmit={sendOtp} >
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Email address' 
            id='formControlLg' type='email' size="lg"
            onChange={(e) => { setEmail(e.target.value) }}
            />
          

            <MDBBtn className="mb-4 px-5 mx-5 w-100" color='info' size='lg'  type="submit">Send Otp</MDBBtn>
            </form>
            {(isOtpSent) ? <>
          
        <form onSubmit={ForgetPass}>
          < br />
        <MDBInput wrapperClass='mb-4 mx-5 w-100' label='enter otp'
     id='formControlLg' type='text' size="lg"
            onChange={(e) => { setOtp(e.target.value) }}
        /> 

            <br />
        <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Password'
        id='formControlLg' type='password' size="lg"
    onChange={(e) => { setNewPassword(e.target.value) }}
    /> 
        <MDBBtn className="mb-4 px-5 mx-5 w-100" color='info' size='lg'  type="submit">Submit</MDBBtn>
       </form> 
    </>
    : null}
            <p className='ms-5'>Don't have an account? <Link to={`/signup`}>Register here</Link></p>
            <p className='ms-5'>already have an account? <Link to={`/login`}>Login here</Link></p>
          </div>
        
        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
            alt="Login image" className="w-100" style={{objectFit: 'cover', objectPosition: 'left'}} />
        </MDBCol>

      </MDBRow>

      <ToastContainer />
    </MDBContainer>
    </>
    )
}

export default ForgetPassword;
