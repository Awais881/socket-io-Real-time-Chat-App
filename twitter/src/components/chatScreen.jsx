
import axios from "axios";
import { useEffect, useState, useContext } from 'react';
import { GlobalContext } from '../context/context';
import moment from 'moment';
import { useParams } from "react-router-dom";
import Head from "./head";
import Loader from "../assets/PostLoader.gif"
import { io } from "socket.io-client";


import "./chatScreen.css"

function ChatScreen() {

    let { state, dispatch } = useContext(GlobalContext);
    const { id } = useParams();


    const [writeMessage, setWriteMessage] = useState("");
    const [conversation, setConversation] = useState(null);
    const [recipientProfile, setRecipientProfile] = useState({});

    const getMessages = async () => {
        try {
            const response = await axios.get(`${state.baseUrl}/messages/${id}`)
            console.log("response: ", response.data);
            setConversation(response.data)

        } catch (error) {
            console.log("error in getting all tweets", error);
        }
    }
    const getRecipientProfile = async () => {
        try {
            let response = await axios.get(
                `${state.baseUrl}/profile/${id}`,
                {
                    withCredentials: true
                });

            console.log("RecipientProfile: ", response);
            setRecipientProfile(response.data)
        } catch (error) {
            console.log("axios error: ", error);
        }
    }


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

        console.log("subscribed: ", `${state.user._id}-${id}`);
        socket.on(`${state.user._id}-${id}`, function (data) {

            console.log(data);
            setConversation(prev => [data, ...prev])
           
        });


        return () => {
            socket.close();
        }

    }, [])
   

    useEffect(() => {

        getRecipientProfile();
        getMessages();

    }, [])






    const sendMessage = async (e) => {
        if (e) e.preventDefault();

        try {
            const response = await axios.post(`${state.baseUrl}/message`, {
                to: id,
                text: writeMessage,
            })
            console.log("response: ", response.data);
            getMessages();
        } catch (error) {
            console.log("error in getting all Messages", error);
        }
    }


    return (
        <>
        
            <div className="chat-Head">
            <h1>Chat with {recipientProfile?.firstName} {recipientProfile?.lastName}</h1>
            {/* <span>{recipientProfile?.email}</span> */}

            <form onSubmit={sendMessage} className=" form">
                <input type="text" placeholder='type your message' onChange={(e) => [
                    setWriteMessage(e.target.value)
                ]} />
                <button type="submit">Send</button>
            </form>
            </div>
            <div className='messageView'>

                {(conversation?.length) ?
                    conversation?.map((eachMessage, index) => {
                        const className = (eachMessage.from._id === id) ? "recipientMessage" : "myMessage"

                        return <div
                            key={index}
                            className={`message ${className}`}>
                            <div className='head'>
                                <div className='name' >{eachMessage.from.firstName} {eachMessage.from.lastName}</div>
                                <div className='time' >{moment(eachMessage.createdOn).fromNow()}</div>
                            </div>
                            <div className='text' >{eachMessage.text}</div>
                        </div>

                    })
                    : null
                }
            </div>

            {(conversation?.length === 0 ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", 
            position: "absolute", top: "100px" , left: "200px", minHeight: '100vh' }}>
          <img width={800} src={Loader} alt="loading" />
        </div>: null)}
            {(conversation === null ? <div style={{ display: "flex", justifyContent: "center", alignItems: "center", 
            position: "absolute", top: "100px" , left: "200px", minHeight: '100vh' }}>
          <img width={800} src={Loader} alt="loading" />
        </div>: null)}


      
      
        </>
    );
}

export default ChatScreen;
