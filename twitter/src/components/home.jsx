import './home.css';
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import {
  EmojiEmotions, Home, Image, Share, Mail, Notifications,
  PersonAdd, YouTube, Favorite, MoreVert,
  StarBorder, ExpandLess, LiveTv, SportsEsports, VideoCameraBack, PlayCircle, Inbox,Chat,
  FavoriteBorder, ModeNight, PeopleAlt, Logout
} from '@mui/icons-material'
// import ChatIcon from '@mui/icons-material/Chat';
import moment from 'moment'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import { Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { Box } from '@mui/system'
import HomeIcon from '@mui/icons-material/Home';
import {
  AppBar, Avatar, AvatarGroup, Badge, Button, ButtonGroup, Card, CardActions, CardContent,
  CardHeader, CardMedia, Checkbox, Collapse, Divider, FormControl, Icon, IconButton, ImageList,
  ImageListItem, Input, InputBase, InputLabel, List, ListItem, ListItemAvatar, ListItemButton,
  ListItemIcon, ListItemText, ListSubheader, Menu, MenuItem, Select, Stack, styled, Switch, TextField,
  Toolbar, Typography
} from '@mui/material'
import { GlobalContext } from '../context/context';
import {
  MDBBtn, MDBContainer,MDBRow,MDBCol, MDBIcon,MDBInput
} from 'mdb-react-ui-kit';
import InfiniteScroll from 'react-infinite-scroller';
import Loader from "../assets/PostLoader.gif"


function Tweets() {
  let { state, dispatch } = useContext(GlobalContext);

  const [tweets, setTweets] = useState([]);
  const [tweetsText, setTweetsText] = useState([]);
  
  const [preview, setPreview] = useState(null)
 
  const [toggleReload, setToggleReload] = useState(false);
  const [editingTweet, setEditingTweet] = useState({
    editingId: null,
    editingText: "",
  });
  const [open, setOpen] = useState(false);
       const [eof, setEof] = useState(false)



  // Get All Products

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


  const getAllTweets  = () => {
    if (eof)
    return
    try{
    axios.get(`${state.baseUrl}/api/v1/tweetFeed?page=${tweets.length}`)



      .then(response => {
        console.log("All Tweets", response.data.data);
        if( response.data.data ===0) setEof(true)
        setTweets((prev) => {

          
          return [...prev, ...response.data.data]
      })
      })
    }
    catch (error) {
      console.log("error in getting all tweets", error);
  }
}


  useEffect(() => {


    getAllTweets();


  }, [toggleReload])






  const saveTweet = async (e) => {
    e.preventDefault();
    let fileInput = document.getElementById("picture");
    console.log("fileInput: ", fileInput.files[0]);
    let formData = new FormData();
  formData.append("myFile", fileInput.files[0])
  formData.append("text", tweetsText)
  console.log(formData.get("text"));
  axios({
    method: 'post',
    url: `${state.baseUrl}/tweet`,
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' }
})
    .then(res => {
      setToggleReload(!toggleReload);
        console.log(`upload Success` + res.data);
        toast.success('Added Sucessfully', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
    })
    .catch(err => {
        console.log("error: ", err);
        toast.error("Can't Tweet", {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
    })
}

  
 

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${state.baseUrl}/api/v1/tweet/${editingTweet.editingId}`,
         {
          text: editingTweet.editingText

        });
     
      setToggleReload(!toggleReload);

      setEditingTweet({
        editingId: null,
        editingText: "",
       
      });
      toast.success('Update Sucessfully', {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      console.log("err", err);
      toast.error('Update Error', {
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
  };

  const deleted = (postId) => {
    // console.log(postId);
    setToggleReload(!toggleReload);
    axios.delete(`${state.baseUrl}/api/v1/tweet/${postId}`)
      .then((response) => {
        console.log(response.data);
        toast.success('Deleted Sucessfully', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        getAllTweets();
      })

      .catch((err) => {
        console.log("err", err);
        toast.error('Delete Error', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
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

      {/* leftBAr */}

      <Stack direction="row" spacing={2}>
        <Box flex={1.5} p={2} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>

          <Box position={"fixed"}>
            <List
              // sx={{bgcolor:"none"}}
              component="nav"
              aria-labelledby="nested-list-subheader"
              subheader={<ListSubheader component="div" id="nested-list-subheader">
                Nested List Items
              </ListSubheader>}
            >
              <ListItemButton>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary="Home" />
              </ListItemButton>



              <ListItemButton>
                <ListItemIcon>
                  <PeopleAlt />
                </ListItemIcon>
                <ListItemText primary="Friends" />
              </ListItemButton>

              <ListItemButton>
                <ListItemIcon>
                  <Inbox />
                </ListItemIcon>
                <ListItemText primary="Inbox" />
              </ListItemButton>



              <ListItemButton>
                <ListItemIcon>
                  <PlayCircle />
                </ListItemIcon>
                <ListItemText primary="Watch" />
              </ListItemButton>

              <ListItemButton>
                <ListItemIcon>
                  <SportsEsports />
                </ListItemIcon>
                <ListItemText primary="Fun" />
              </ListItemButton>

              <ListItemButton>
                <ListItemIcon>
                  <LiveTv />
                </ListItemIcon>
                <ListItemText primary="Streaming" />
              </ListItemButton>

              <ListItemButton>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Sigout" />
              </ListItemButton>

              {/* Switch */}
              <ListItem disablePadding>
                <ListItemButton component="a" href='#switch'>
                  <ListItemIcon>
                    <ModeNight />
                  </ListItemIcon>
                  <Switch />
                </ListItemButton>
              </ListItem>
            </List>

          </Box>
        </Box>



        <Box bgcolor={'whitesmoke'} flex={4} p={2}>
          <Box>
            <Box sx={{
              display: "flex",
              justifyContent: "center",
              mt: "10px"
            }}>
              <Box flex={1} height={280} bgcolor={"background.default"} color={"text.primary"}
                p={3} border="1px solid black"
                pb={5}
                // sx={{ border: { xs: "none", sm: "block", md: "block" } }}
                borderRadius={5}>
                <Typography variant='h6' color='gray' textAlign='center'>Tweet</Typography>
                <UserBox1>
                  <Avatar sx={{ width: 40, height: 40 }}
                    src="https://avatars.githubusercontent.com/u/102538169?v=4" />
                  <Typography fontWeight={500} variant="span">Awais Ahmed</Typography>
                </UserBox1>
                <div className='form'>
                  <form onSubmit={saveTweet} sx={{ width: "100%" }} >
                    <TextField
                      sx={{ width: "100%" }}
                      id="standard-multiline-static"
                      onChange={(e) => { setTweetsText(e.target.value) }}
                      multiline
                      rows={1}
              
                      label="whats in your mind"
                      variant="filled" />
                
                    <Stack direction='row' gap={1} mt={2} mb={3}>
                     <input 
                         id='picture'
                         type="file"
                         accept='image/*'
                         onChange={(e) => {
                           
                           var url = URL.createObjectURL(e.currentTarget.files[0])
                           
                           console.log("url: ", url);
                           
                           setPreview(url)
                           
                          }} />
                  
                    <Image color='secondary' type="file" />
                      <VideoCameraBack color='success' />
                      <PersonAdd color='error' />
                    </Stack>
                    <ButtonGroup fullWidth
                      variant='contained'
                      aria-label='outlined primary button group'>
                      <Button type='submit' >Tweet</Button>


                    </ButtonGroup>
                  </form>
                </div>
              </Box>
            </Box>
                          <br />  <img width={400} src={preview} alt="" />
          </Box>



          <InfiniteScroll
                pageStart={0}
                loadMore={getAllTweets}
                hasMore={!eof}
                loader={<div style={{ display: "flex", justifyContent: "center", alignItems: "baseline", minHeight: '100vh' }}>
                <img width={780} src={Loader} alt=""  />
              </div>}
            >

          <Box flex={2} mt="20px">
            {tweets?.map((eachTweet, i) => (

              <Card key={i} sx={{ margin: 5 }}>
                <CardHeader
                  avatar={
                    <Avatar sx={{ bgcolor: "red" }} aria-label="recipe">
                     

                    </Avatar>
                  }
                  action={
                    <IconButton aria-label="settings">
                      <MoreVert />
                    </IconButton>
                  }
                  title= {state?.user?.firstName}
                  subheader={moment(eachTweet.createdOn).fromNow()}
                />
                <CardMedia
                  component="img"
                  height="20%"
                 
                  // image = src={eachTweet.imageUrl}
                />
                <img src={eachTweet.imageUrl} alt=""  width= "100%"style={{ border: "1px solid white",
                borderRadius: "25px"}}/>
                <CardContent>
                  <Typography variant="body2" color="text.secondary">
                  {eachTweet?.text}
                  </Typography> <br />
                 
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <Checkbox
                      icon={<FavoriteBorder />}
                      checkedIcon={<Favorite sx={{ color: "red" }} />}
                    />
                  </IconButton>
                  <IconButton aria-label="share">
                    <Share />
                  </IconButton>
                </CardActions>
                <div className="editbtn">
                  <Button className="edit"
                    variant="outlined" color="success" onClick={() => {
                        setEditingTweet({
                        editingId: eachTweet?._id,
                        editingText: eachTweet?.tweetsText,
                       
                      })
                    }}>
                    Edit</Button> &nbsp; &nbsp;

                
                  <Button variant="outlined" startIcon={<DeleteIcon />} onClick={() => {
                    deleted(eachTweet?._id)
                  }}>
                    Delete
                  </Button>
                </div>


                 {
                  (eachTweet._id === editingTweet.editingId) ?
                    (<div>

                      <h1>update form</h1>
                      <div className='UpdateForm'>
                        <form onSubmit={updateHandler}>

                          <TextField
                            sx={{ width: "100%" }}
                            id="standard-multiline-static"
                            onChange={(e) => { setEditingTweet({ ...editingTweet, editingText: e.target.value }) }}
                            value={editingTweet.editingText}
                            multiline
                            rows={1}
                            label="Update Text"
                            variant="filled" />

                         


                          <br />

                          <Button variant="contained" color="success" type='submit'>
                            Proced Update
                          </Button>
                        </form>
                      </div>
                    </div>) : null
                } 
              </Card>
            ))}
          </Box>
        </InfiniteScroll>
        </Box>




     



        <ToastContainer />
      </Stack>
    </>
  );
}

export default Tweets;