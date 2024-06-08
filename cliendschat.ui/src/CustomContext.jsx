
import { useState, useEffect, useContext, createContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../src/AuthContext.jsx';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import * as signalR from '@microsoft/signalr';
import axios from 'axios';

export const CustomContext = createContext();

export default function CustomContextProvider({ children }) {
    const navigate = useNavigate();

    const { joinChatRoom, login, isAuthenticated, username, password, userInfoAcount} = useContext(AuthContext);
    
    

    const handleSubmit = async (e) => {
        e.preventDefault();

        //const user = await login(username, password); 
        

        const admiUser = await login(username, password); // Get the user information   implementation in AuthContext.jsx

        if (admiUser) { //if user  Authenticated go to  /chatRoom/active-user ActiveUser.jsx
            
            await joinChatRoom(admiUser.username, admiUser.id, admiUser.photo_url); //implementation in AuthContext.jsx

            navigate('/chatRoom/active-user');//ActiveUser.jsx

        } else {
            alert("Invalid credentials\nPlease Login Again");
        }
    };

    const handleClickGoBack = () => {
        navigate('/chatRoom/active-user');
    };


    return (
        <CustomContext.Provider value={{ handleSubmit, handleClickGoBack}}>
            {children}
        </CustomContext.Provider>
    );
}

