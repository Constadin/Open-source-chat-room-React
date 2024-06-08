import "./activeUser.css";
import { useContext, useState, useEffect } from 'react';
import { CustomContext } from '../src/CustomContext.jsx';
import { AuthContext } from '../src/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import inboxLogo from '../src/assets/circle-notifications.svg'; 

export default function ActiveUser() {

    const navigate = useNavigate();

    const { isAuthenticated, userInfoAcount, activeUsers, handleClickGoChat, logout, isLogin, handleClick, notifyMessages, chooseUserIds/*signalIdUser, removefromGroup,setRemoveFromGroup */ } = useContext(AuthContext);

    /*const [notifyTo, setNotifyTo] = useState([]); //inbox messges*/
    const [newActiveUsers, setNewActiveUsers] = useState([]);//update active users
    const [visibleMessage, setVisibleMessage] = useState(null);
   

    useEffect(() => {
        if (activeUsers)         
            setNewActiveUsers(activeUsers.filter(user => user.id !== userInfoAcount.id));
        //setRemoveFromGroup(activeUsers.filter(user => user.id === chooseUserIds))
        //activeUsers.forEach((e) => console.log(e));
    }, [activeUsers]);

    const navigateToWelcomePage = () => {
        navigate('/welcome-page');
    };

    useEffect(() => {
        if (isLogin) {
            setVisibleMessage(notifyMessages);
            const timer = setTimeout(() => {
                setVisibleMessage(null);
            }, 6000); // 3 seconds

            return () => clearTimeout(timer); // Clear the timeout if the component unmounts or receiveMessages changes
        }
        else if (!isLogin) {
            setVisibleMessage(notifyMessages);

            const timer = setTimeout(() => {
                setVisibleMessage(null);
                navigateToWelcomePage();
            }, 6000);


            return () => clearTimeout(timer); // Clear the timeout if the component unmounts or receiveMessages changes

        }
    }, [notifyMessages, isLogin]);


    

    const count = 0;
    
    
    return (

        <>  {isAuthenticated ? (
            <>
                <p style={{ marginTop: '30px', fontSize: '1.5rem', borderBottom: '2px solid' }}>Active Users</p>
                <div className='go-to-chat-content'>

                    <span style={{ margin: '0', fontSize: '1.2rem', borderBottom: '2px solid' }}>Choose up to 8 friends to chat with</span>
                    <button onClick={() => logout(userInfoAcount.username, signalIdUser)} className='go-to-chat' >log Out</button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}>
                    <span>Welcome {userInfoAcount.username}</span>
                    <img src={userInfoAcount.photo_url} alt={userInfoAcount.username} style={{ marginLeft: '10px', width: '30px', height: '30px', borderRadius: '50%', border: "2px solid" }} />
                    <button onClick={() => handleClickGoChat()} className='go-to-chat' disabled={newActiveUsers.length < 1}>chat</button>&nbsp;&nbsp;&nbsp;
                    <p>unread msg: &nbsp;<img style={{ background: "white", borderRadius: "50%" }} src={inboxLogo} alt={inboxLogo} />{count}</p>
                </div>

                {visibleMessage && (
                    <div className="is-login" style={{ backgroundColor: 'rgb(125,100,822)', color: 'white', padding: '0 0 0 10px', borderRadius: '5px', margin: '5px 0', maxWidth: '215px' }}>
                        {visibleMessage}
                    </div>
                )}

                {!isLogin ? (<div className="is-login"></div>) : (
                    <>
                        <div className="is-login"></div>
                        <div className="select-friends-contect">

                            <div className="active-users">
                                {newActiveUsers.length > 0 ? (
                                    newActiveUsers.map(user => (
                                        <button key={user.id} className={`user-photo ${chooseUserIds.includes(user.id) ? 'active' : ''}`}
                                            onClick={() => handleClick(user.id)} >
                                            <img src={user.photo_url} alt={user.username} />
                                            <span className='username-span'>{user.username}</span>
                                        </button>
                                    ))
                                ) : (<p>No Active Users</p>)}
                            </div>
                        </div>

                    </>)}

                <div className='footer'>
                    &copy; 2024 Nikolas Konstantinidis.
                </div>

            </>) : (
            <>
                <h1>User is not authenticated</h1>
                <span style={{ margin: '0', fontSize: '1.2rem', borderBottom: '2px solid' }}>Please login</span>
            </>
        )}

        </>
    );
}
