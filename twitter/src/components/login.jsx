import React from 'react';
import {
  MDBBtn, MDBContainer,MDBRow,MDBCol, MDBIcon,MDBInput
}
from 'mdb-react-ui-kit';
import { Link } from "react-router-dom";
import { useState, useContext } from "react";
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { GlobalContext } from '../context/context';
import './login.css';
function Login() {

  let { state, dispatch } = useContext(GlobalContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginHandler =async (e) =>{
      
    e.preventDefault();

    try {
        let response = await axios.post(`${state.baseUrl}/api/v1/login`, {
            email: email,
            password: password
        }, {
            withCredentials: true
        })
        toast('Login Succuesful ', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
        dispatch({
            type: 'USER_LOGIN',
            payload: response.data.profile,
        })
       
        console.log("Login  successful");
       

    }
    catch (err) {
        console.log("err: ", err);
        toast.error('Error', {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            });
    }



 }


  return (
    <MDBContainer fluid>
      <MDBRow>

        <MDBCol sm='6'>

          <div className='d-flex flex-row ps-5 pt-5'>
            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: '#709085' }}/>
            <span className="h1 fw-bold mb-0">Logo</span>
          </div>

          <div className='d-flex flex-column justify-content-center h-custom-2 w-75 pt-4'>

            <h3 className="fw-normal mb-3 ps-5 pb-3" style={{letterSpacing: '1px'}}>Login</h3>
            <form onSubmit={loginHandler} >
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Email address' 
            id='formControlLg' type='email' size="lg"
            onChange={(e) => { setEmail(e.target.value) }}
            />
            <MDBInput wrapperClass='mb-4 mx-5 w-100' label='Password'
             id='formControlLg' type='password' size="lg"
             onChange={(e) => { setPassword(e.target.value) }}
             />

            <MDBBtn className="mb-4 px-5 mx-5 w-100" color='info' size='lg'  type="submit">Login</MDBBtn>
            </form>
            <p className="small mb-5 pb-lg-3 ms-5"> <Link to={`/forget-password`}>Forget Password</Link>
            </p>
            <p className='ms-5'>Don't have an account? <Link to={`/signup`}>Register here</Link></p>

          </div>
          {/* class="text-muted" */}
        </MDBCol>

        <MDBCol sm='6' className='d-none d-sm-block px-0'>
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
            alt="Login image" className="w-100" style={{objectFit: 'cover', objectPosition: 'left'}} />
        </MDBCol>

      </MDBRow>

      <ToastContainer />
    </MDBContainer>
  );
}
export default Login;
