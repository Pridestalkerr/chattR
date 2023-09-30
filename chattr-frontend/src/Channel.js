import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    Redirect
} from 'react-router-dom';
import axios from 'axios';
import { InputTextarea } from 'primereact/inputtextarea';
import socketIoClient from 'socket.io-client';
import { act } from 'react-dom/cjs/react-dom-test-utils.production.min';
const socket = socketIoClient(process.env.REACT_APP_BACKEND_URL, { autoConnect: false, withCredentials: true });


const Message = ({ msg, activeChannel }) => {
    return (
        <div className="d-flex flex-column p-3">
            <div className="d-flex justify-content-between">
                <span className="d-inline mr-2 user"> { activeChannel.friend.username } </span>
                <span className="d-inline"> { new Date(msg.date).toISOString().slice(0, 19).replace(/-/g, "/").replace("T", " ") } </span>
            </div>
            <div>
                <img className="d-inline" style={{height: '20px', width: 'auto'}} src="https://octagram.ro/wp-content/themes/octagram/img/author_dummy.jpg" alt="Paris" width="300" height="300" />
                <span className="tmsg mt-2 d-inline" style={{color: '#101010'}}> { msg.content } </span>
            </div>
        </div>
    );
};


export default ({ activeChannel, setActiveChannel }) => {
    
    const [ messages, setMessages ] = useState(new Map());
    const [ messageContent, setMessageContent ] = useState('');

    useEffect(()=> {

        socket.on("get_messages", (data) => {
            console.log(data)
            addMessages(data);
        });
        socket.on("connect", () => {
            console.log("connect");
        });
        socket.on("message", (msg) => {
            console.log(msg)
            addMessage(msg);
        });

        socket.connect();

        // return () => {
        //     socket.disconnect();
        // }

    }, []);

    useEffect(() => {
        if (activeChannel._id) {
            socket.emit("join", { channel: activeChannel._id });
            socket.emit("get_messages", { channel: activeChannel._id }, { count: 5 } );
        }

        return () => {
            if (activeChannel._id) {
                socket.emit("leave", { channel: activeChannel._id });
            }
        }
    }, [activeChannel])

    const addMessages = (data) => {
        setMessages(oldMessages => {
            let newMessages = new Map(oldMessages);
            for (let elm of data) {
                newMessages.set(elm._id, elm);
            }
            return newMessages;
        })
        // setMessages(oldMessages => [...oldMessages, ...(Array.isArray(msg) ? msg : [msg])]);
    };

    const addMessage = (msg) => {
        setMessages(oldMessages => {
            let newMessages = new Map(oldMessages);
            newMessages.set(msg._id, msg);
            console.log(oldMessages)
            return newMessages;
        })
        // setMessages(oldMessages => [...oldMessages, ...(Array.isArray(msg) ? msg : [msg])]);
    };

    const load_more_messages = () => {
        let oldest = [...messages.values()].sort((x, y) => x._id > y._id)[0];
        socket.emit("get_messages", { channel: activeChannel._id }, { start_id: oldest._id, count: 5 } );
    }

    const sendMessage = (e) => {
        e.preventDefault();
        if (!messageContent) return

        socket.emit("message", { channel: activeChannel._id, content: messageContent });
        setMessageContent('');
    }

    return (
        <div style={{width: '500px'}}> { activeChannel?._id ?
            <div className='d-flex flex-column title p-2' style={{backgroundColor: '#ffffff', color: '#512DA8', borderRadius: '5px'}}>
                <div className='w-100 p-2' style={{borderBottom: '2px solid #eef2f3'}}>
                    {activeChannel.friend.username}
                </div>
                <div className='d-flex flex-column-reverse p-2' style={{overflow: "auto", height: "500px"}}>
                    { [...messages.values()].sort((x, y) => x._id < y._id).map((msg, index) => <Message msg={msg} activeChannel={activeChannel} />) }
                    <div className="w-100 text-center" style={{border: "1px solid #512DA8"}} onClick={e => load_more_messages()}>load previous messages</div>
                    <div style={{flex: 1}}>{/* spacer */}</div>
                </div>
                <div style={{height: '100px'}} className="whiteGradient">
                    <InputTextarea value={messageContent} onChange={(e) => setMessageContent(e.target.value)} style={{resize: 'none', height: '100%', width: '100%'}}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                sendMessage(e);
                            }
                        }} autoFocus/>
                </div>
            </div>
            :
            <div className='h-100 d-flex flex-column justify-content-center align-items-center title' >
                <h2 style={{fontSize: '60px'}}>start a chat</h2>
                <h5 style={{fontSize: '30px'}}>click on a friend</h5>
            </div>
        } </div>
    )
}