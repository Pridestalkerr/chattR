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
import { useHistory } from "react-router-dom";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';


export default ({ activeChannel, setActiveChannel }) => {
    const history = useHistory();

    const [ friends, setFriends ] = useState([]);
    const [ sentRequests, setSentRequests ] = useState([]);
    const [ incomingRequests, setIncomingRequests ] = useState([]);
    const [ search, setSearch ] = useState('');

    const sendRequest = () => {
        axios.post(process.env.REACT_APP_BACKEND_URL + '/friendship/request/new', {
            email: search,
        }, {withCredentials: true}).then(response => {
            getSentRequests();
            console.log(response.data)
        }).catch(error => alert(error));
        setSearch('')
    }

    const getFriends = () => {
        axios.get(process.env.REACT_APP_BACKEND_URL + '/friendship/all', {withCredentials: true}).then(response => {
            setFriends(response.data);
            console.log(response.data)
        }).catch(error => alert(error));
    }

    const getIncomingRequests = () => {
        axios.get(process.env.REACT_APP_BACKEND_URL + '/friendship/request/incoming/all', {withCredentials: true}).then(response => {
            setIncomingRequests(response.data);
            // console.log(response.data)
        }).catch(error => alert(error));
    }

    const getSentRequests = () => {
        axios.get(process.env.REACT_APP_BACKEND_URL + '/friendship/request/sent/all', {withCredentials: true}).then(response => {
            setSentRequests(response.data);
            // console.log(response.data)
        }).catch(error => alert(error));
    }

    useEffect(() => {
        getFriends();
        getIncomingRequests();
        getSentRequests();
    }, []);

    const accept_request = (req) => {
        axios.post(process.env.REACT_APP_BACKEND_URL + '/friendship/request/accept', {
            _id: req._id,
        }, {withCredentials: true}).then(response => {
            getFriends();
            getIncomingRequests();
            console.log(response.data)
        }).catch(error => alert(error));
    }

    const cancel_request = (req) => {
        axios.post(process.env.REACT_APP_BACKEND_URL + '/friendship/request/cancel', {
            _id: req._id,
        }, {withCredentials: true}).then(response => {
            getSentRequests();
            console.log(response.data)
        }).catch(error => alert(error));
    }

    const deny_request = (req) => {
        axios.post(process.env.REACT_APP_BACKEND_URL + '/friendship/request/deny', {
            _id: req._id,
        }, {withCredentials: true}).then(response => {
            getIncomingRequests();
            console.log(response.data)
        }).catch(error => alert(error));
    }

    const remove_friend = (req) => {
        axios.post(process.env.REACT_APP_BACKEND_URL + '/friendship/revoke', {
            user2: req.user2._id,
        }, {withCredentials: true}).then(response => {
            getFriends();
            console.log(response.data)
        }).catch(error => alert(error));
    }

    const get_channel = (req) => {
        axios.get(process.env.REACT_APP_BACKEND_URL + '/channel/', {
            withCredentials: true,
            params: {
                friend: req.user2._id,
            }
        }).then(response => {
            setActiveChannel({ ...response.data, friend: req.user2});
            console.log(response.data)
        }).catch(error => alert(error));
    }

    return (
        <div className='h-100 d-flex flex-column title'>
            <div className='d-flex flex-column'>
                <div style={{ borderBottom: '2px solid #eef2f3' }} >
                    <h4>friends</h4>
                    { friends.map((elm, index) => {
                        return (
                            <span key={index}>
                                <span className='d-flex flex-row'>
                                    <i className="pi pi-user mr-2"></i>
                                    <h6 className='mr-2' onClick={e => get_channel(elm)} style={{cursor: 'pointer'}} >{ elm.user2?.username }</h6>
                                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-outlined"
                                        style={{ width: 'auto', height: '15px' }} onClick={e => remove_friend(elm)}/>
                                </span>
                            </span>
                        )
                    }) }
                </div>
                <div style={{ borderBottom: '2px solid #eef2f3' }} >
                    <h4>incoming requests</h4>
                    { incomingRequests.map((elm, index) => {
                        return (
                            <span>
                                <span className='d-flex flex-row'>
                                    <i className="pi pi-user mr-2"></i>
                                    <h6 className='mr-2'>{ elm.from?.username }</h6>
                                    <Button icon="pi pi-check" className="p-button-rounded p-button-success p-button-outlined mr-2"
                                        style={{ width: 'auto', height: '15px' }} onClick={e => accept_request(elm)}/>
                                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-outlined"
                                        style={{ width: 'auto', height: '15px' }} onClick={e => deny_request(elm)}/>
                                </span>
                            </span>
                        )
                    }) }
                </div>
                <div >
                    <h4>sent requests</h4>
                    { sentRequests.map((elm, index) => {
                        return (
                            <span>
                                <span className='d-flex flex-row'>
                                    <i className="pi pi-user mr-2"></i>
                                    <h6 className='mr-2'>{ elm.to?.username }</h6>
                                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-button-outlined"
                                        style={{ width: 'auto', height: '15px' }} onClick={e => cancel_request(elm)} />
                                </span>
                            </span>
                        )
                    }) }
                </div>
                <div className='d-flex flex-row'>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Send request"
                            style={{ width: '150px', maxWidth: '300px' }} onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    sendRequest();
                                }
                            }}/>
                    </span>
                </div>
            </div>
        </div>
    )
}