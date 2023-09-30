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
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { useHistory } from "react-router-dom";
import { Button } from 'primereact/button';
import Channel from './Channel';
import Friends from './Friends';


export default () => {
    const history = useHistory();

    const [userData, setUserData] = useState({});

    const [activeChannel, setActiveChannel] = useState({});

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + '/auth/access', {withCredentials: true}).then(response => {
            setUserData(response.data);
            console.log(response.data)
        }).catch(error => history.push('/login'));
    }, []);

    const logout = () => {
        axios.get(process.env.REACT_APP_BACKEND_URL + '/auth/logout', { withCredentials: true }).then(response => {
            history.push('/login');
        }).catch(error => alert(error));
    };

    return (
        <div className='h-100 w-100 d-flex flex-column p-3'>
            <div className='d-flex justify-content-between'>
                <div>
                    <h1 className='title'>{ userData.username }</h1>
                    <h4 className='title'>{ userData.email }</h4>
                </div>
                <div>
                    <Button label="Logout" icon="pi pi-sign-out" className='p-button-plain p-button-text'
                        style={{color: "#939393"}} onClick={ (e) => logout() }/>
                </div>
            </div>
            <div className='d-flex justify-content-between h-100'>
                <Channel activeChannel={activeChannel} setActiveChannel={setActiveChannel}></Channel>
                <Friends activeChannel={activeChannel} setActiveChannel={setActiveChannel}></Friends>
            </div>
        </div>

    );
}