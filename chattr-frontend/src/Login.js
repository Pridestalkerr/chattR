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


export default () => {
    const history = useHistory();

    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        axios.get(process.env.REACT_APP_BACKEND_URL + '/auth/access', {withCredentials: true}).then(response => {
            history.push('/');
        }).catch(error => alert(error));
    }, [loggedIn]);

    const login = () => {
        axios.post(process.env.REACT_APP_BACKEND_URL + '/auth/login', {
            email: email,
            password: password
        }, { withCredentials: true }).then(response => {
            setLoggedIn(true);
        }).catch(error => alert(error));
    };

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div className='d-flex justify-content-center align-items-center h-100 w-100'>
            <div className='p-fluid p-formgrid p-grid' style={{width: "450px"}}>
                <h2 className="title">Login</h2>
                <br/>
                <div className="p-field p-col-12">
                <span className="p-float-label">
                    <InputText id='email' value={email} autoComplete='off'
                        onChange={(e) => setEmail(e.target.value)} required autoFocus
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                login();
                            }
                        }}/>
                    <label htmlFor="email" style={{color: "#939393"}}>Email</label>
                </span>
                </div>
                <br/>
                <div className="p-field p-col-12">
                <span className="p-float-label">
                    <Password id='password' value={password} onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                login();
                            }
                        }} toggleMask/>
                    <label htmlFor="password" style={{color: "#939393"}}>Password</label>
                </span>
                </div>
                <br/>
                <i className="pi pi-sign-in title" style={{fontSize: "30px", cursor:'pointer'}} onClick={(e) => login()} />
            </div>
        </div>
    );
}