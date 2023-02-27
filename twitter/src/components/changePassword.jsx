import React from 'react';
import {
  MDBBtn,
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBCheckbox
}

from 'mdb-react-ui-kit';
import './changePassword.css';

import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Mail, Notifications} from '@mui/icons-material'

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";

import { Box } from '@mui/system'
import HomeIcon from '@mui/icons-material/Home';
import {
  AppBar, Avatar, Badge, Menu, MenuItem, styled,InputBase, 
  Toolbar, Typography
} from '@mui/material'
import { GlobalContext } from '../context/context';



function Changepassword() {
  const [open, setOpen] = useState(false);

 let { state, dispatch } = useContext(GlobalContext);

 const [currentPassword, setCurrentPassword] = useState("");
    const [password, setPassword] = useState("");

  const logoutHandler = async () => {

    try {
      let response = await axios.post(`${state.baseUrl}/logout`, {
        withCredentials: true
      })
      console.log("response: ", response);
      toast('Logout Succuesful ', {
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
        type: 'USER_LOGOUT'
      })
    } catch (error) {
      console.log("axios error: ", error);
      toast.error('Logout Error', {
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

  const changePasswordHandler = async (e) => {
    e.preventDefault();

    try {
        let response = await axios.post(`${state.baseUrl}/change-password`, {
          currentPassword: currentPassword,
            password: password
        }, {
            withCredentials: true
        })
 
        toast.success('Chnaged Passsword Sucessfully', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        console.log("change successful");
     

       

    } catch (e) {
       
      console.log("e: ", e);
      toast.error('Password error', {
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



  const StyledToolbar = styled(Toolbar)({
    display: "flex",
    justifyContent: "space-between"
  })


  const Search = styled("div")(({ theme }) => ({
    backgroundColor: "white",
    padding: "0 10px",
    borderRadius: theme.shape.borderRadius,
    width: "40%"
  }))
  const Icons = styled(Box)(({ theme }) => ({
    display: "none",
    gap: "20px",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: { display: "flex" }
  }))
  const UserBox = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: "20px",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: { display: "none" }
  }))
  const UserBox1 = styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "20px"
  })


  return (
    <>
    <AppBar position="sticky">
    <StyledToolbar>
      <Typography variant="h6" sx={{ display: { xs: "none ", sm: "block" } }} className="logo">
        Tweets
      </Typography>
      <HomeIcon sx={{ display: { xs: "block ", sm: "none" } }} className="logo" />
      <Search><InputBase placeholder='Search' sx={{ width: "100%" }} /></Search>
      <Icons>

        <Badge badgeContent={4} color="secondary" className="icon">
          <Mail />
        </Badge>
        <Badge badgeContent={4} color="secondary" className="icon">
          <Notifications />
        </Badge>
        <Avatar sx={{ width: 30, height: 30 }}
          src="https://avatars.githubusercontent.com/u/102538169?v=4"

          onClick={e => setOpen(true)}
          className="profile"
        />
      </Icons>
      <UserBox onClick={e => setOpen(true)}  >
        <Avatar sx={{ width: 30, height: 30 }}
          src="https://avatars.githubusercontent.com/u/102538169?v=4" />
        <Typography variant='span' className="profile">Awais</Typography>
      </UserBox>
    </StyledToolbar>
    <Menu
      id="demo-positioned-menu"
      aria-labelledby="demo-positioned-button"
      open={open}
      onClose={e => setOpen(false)}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    > <MenuItem>{state?.user?.email}</MenuItem>
      <MenuItem > <Link to={`/profile`}>Profile</Link></MenuItem>
      <MenuItem ><Link to={`/change-password`}>Change Password</Link></MenuItem>
      <MenuItem onClick={logoutHandler}>Logout</MenuItem>
    </Menu>
  </AppBar>
    <MDBContainer fluid className='d-flex align-items-center justify-content-center bg-image' style={{backgroundImage: 'url(https://mdbcdn.b-cdn.net/img/Photos/new-templates/search-box/img4.webp)'}}>
      <div className='mask gradient-custom-3'></div>
      <MDBCard className='m-5' style={{maxWidth: '600px'}}>
        <MDBCardBody className='px-5'>
          <h2 className="text-uppercase text-center mb-5">Change your Password</h2>
          <form  onSubmit={changePasswordHandler} >
          <MDBInput wrapperClass='mb-4' label='Current Password' 
          size='lg' id='form1' 
          onChange={(e) => { setCurrentPassword(e.target.value) }}
          type='password'/>
          <MDBInput wrapperClass='mb-4' label='New Password'
           size='lg' id='form3' type='password'
           onChange={(e) => { setPassword(e.target.value) }}/>
        
          <MDBInput wrapperClass='mb-4' label='Repeat New password'
           size='lg' id='form4' type='password'
           onChange={(e) => { setPassword(e.target.value) }}/>
          
          <MDBBtn className='mb-4 w-100 gradient-custom-4' size='lg' typeof='submit'>Confirm</MDBBtn>
          </form>
        </MDBCardBody>
      </MDBCard>
      
      <ToastContainer />
    </MDBContainer>
    </>
  );
}

export default Changepassword;