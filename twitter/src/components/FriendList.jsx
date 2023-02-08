import React from 'react';
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { GlobalContext } from '../context/context';
import moment from 'moment'
import './FriendList.css';
import { ToastContainer, toast } from 'react-toastify';
import Loader from "../assets/PostLoader.gif"
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import {
  AppBar, Avatar,  Badge,
  ImageListItem, Input, InputBase,  Search, UserBox,  styled, StyledToolbar, Toolbar,
  Menu, MenuItem, Typography
} from '@mui/material'
import HomeIcon from '@mui/icons-material/Home';
import {
   Notifications,Chat , Inbox, Home   } from '@mui/icons-material'
   import {
    MDBBtn, MDBContainer,MDBRow,MDBCol, MDBIcon,MDBInput
  } from 'mdb-react-ui-kit';

 
  import { Box } from '@mui/system'
function FriendList() {

    let { state, dispatch } = useContext(GlobalContext);
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [users, setUsers] = useState(null);
    const [notifications, setNotifications] = useState([]);
 
    useEffect(() => {


        getUsers();
    
    
      }, [])
      useEffect(() => {

        const socket = io(state.baseUrlSocketIo, {
            withCredentials: true
        });

        socket.on('connect', function () {
            console.log("connected")
        });
        socket.on('disconnect', function (message) {
            console.log("Socket disconnected from server: ", message);
        });
        socket.on("connect_error", (err) => {
            console.log(`connect_error due to ${err.message}`);
        });

        console.log("subscribed: ", `personal-channel-${state.user._id}`);

        socket.on(`personal-channel-${state.user._id}`, function (data) {
            console.log("socket push data: ", data);
            setNotifications(prev => [...prev, data])
        });

        return () => {
            socket.close();
        }

    }, [])

    const logoutHandler = async () => {

      try {
        let response = await axios.post(`${state.baseUrl}/api/v1/logout`, {
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
  
    const getUsers = async (e) =>{
        if (e) e.preventDefault();  
        try{
            const response = await axios.get(`${state.baseUrl}/users?q=${searchTerm}`)
            console.log("response : ", response.data);
            setUsers(response.data)
           
            
              
        }
            
            
            catch (error) {
              console.log("error in getting users", error);
             
          }
    
    
      }
      const StyledToolbar = styled(Toolbar)({
        display: "flex",
        justifyContent: "space-between"
      })
      const Icons = styled(Box)(({ theme }) => ({
        display: "none",
        gap: "20px",
        alignItems: "center",
        [theme.breakpoints.up("sm")]: { display: "flex" }
      }))   
      const Search = styled("div")(({ theme }) => ({
        backgroundColor: "white",
        padding: "0 10px",
        borderRadius: theme.shape.borderRadius,
        width: "40%"
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
        <div className='d-flex flex-row ps-4 pt-3'>
            <MDBIcon fas icon="crow fa-2x me-3" style={{ color: '#709085' }}/>
            <span className="h4 fw-bold mb-0">Tweets</span>
          </div>
          <HomeIcon sx={{ display: { xs: "block ", sm: "none" } }} className="logo" />
          <Search><InputBase placeholder='Search' sx={{ width: "100%" }} /></Search>
          <Icons>

            <Badge badgeContent={4} color="secondary" className="icon">
            <Link to={`/friend-list`} className="userMessage"> <Chat /></Link>  
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
      <form onSubmit={getUsers}>
         <h1>Search User</h1>
     <input type="search" 
      onChange={(e) => { setSearchTerm(e.target.value) }} />
        <button type='sunmit'>Search</button>
         </form>

  
    



      
        {(users?.length) ?
                users?.map((eachUser, index) => {
                    return <div className='friend-list' key={index}>
                     <button>  <Link to={`/chat/${eachUser._id}`}> Chat </Link></button> 


                            <h2>{eachUser.firstName} {eachUser.lastName}</h2>
                            <span>{eachUser.email}</span>

                            {(eachUser?.me) ? <span><br />this is me</span> : null}
                      
                    </div>
                })
                : null
            }
            {(users?.length === 0 ? "No users found" : null)}
            {(users === null ? "Loading..." : null)}
            <ToastContainer />
        </>
        );
      }
export default FriendList;
