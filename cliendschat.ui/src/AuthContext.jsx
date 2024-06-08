import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';




export const AuthContext = createContext();

export function AuthProvider({ children }) {

    const navigate = useNavigate(); //nav-routing

    const [username, setUsername] = useState('');//to authenticate user
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false); //check authentication  
    const [userInfoAcount, setUserInfoAcount] = useState({}) //user in format json from db
    const [activeUsers, setActiveUsers] = useState([]); //active users in app
    const [isLogin, setIsLogin] = useState(false); //check login


    const [isActive, setIsActive] = useState(false)//check user is active or not
    const [connection, setConnection] = useState(null); //connection on signalR
    const [signalrIdUser, setSignalrIdUser] = useState([]);//user to connection with signalr
    const [notifyMessages, setNotifyMessages] = useState('');//notify messages from hub
    
    const [chooseUserIds, setchooseUserIds] = useState([]);//choose who I am connected with
    const [groupName, setuserGRoupName] = useState(''); //my name groupfor chat
    const [receiveMessages, setReceiveMessages] = useState([]); //message from ....to....
    
    const [chooseIdBuff, setChooseIdBuff] = useState(null);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    
    


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60000); // Update every second

        return () => clearInterval(interval);
    }, []); // Runs only once when the component mounts

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 60000); // Update every second

        return () => clearInterval(interval);
    }, []);

   // show all Active clients in app

    useEffect(() => {
        const fetchActiveUsers = async () => {
            try {
                const response = await axios.get("https://localhost:7264/api/userauth/active"); //end point to  Controller UserAuthController.cs
                setActiveUsers(response.data);
            } catch (error) {
                console.error("Error fetching active users:", error);
            }
        };

        // Initial fetch
        fetchActiveUsers();

        // Set up an interval to fetch the data every 3 seconds
        const intervalId = setInterval(fetchActiveUsers, 3000);

        // Clean up the interval on component unmount
        return () => clearInterval(intervalId);
    }, []); // Run once on component mount


    const login = async (username, password) => {
        
        try {
            const response = await axios.post("https://localhost:7264/api/userauth/login", {  //endpoint implementation in UserAuthController.cs
                username,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const user = response.data; //response from db

            if (response.status === 200) {

                setUserInfoAcount(user);
                setIsAuthenticated(true);
                setIsActive(true);
                setIsLogin(true);
                return user;  // Return the user data  from controller

            } else {
                console.error('Login failed');
                return false;
            }
        } catch (error) {
            console.error('Error during login:', error);
            return false;
        }
    };


    const joinChatRoom = async (username, userId, photo_url) => { //The function call is CustomContext.jsx
                       
        try {
            const conn = new HubConnectionBuilder()
                .withUrl("https://localhost:7264/inChat") //conection SignalR hub
                .withAutomaticReconnect()
                .configureLogging(LogLevel.Information)
                .build();

            conn.on("ReceiveNotify", (username, msg) => {                
                setIsLogin(true); 
                setNotifyMessages(msg);
            });

            // Add handler for closeconnection event
            conn.on("closeconnection", () => {
                console.log("Received closeconnection event. Disconnecting...");
                
            });
            
           

            // Handler for specific client being added to a group
            conn.on("addedToGroup", (username, groupName) => {
                console.log(`${username}, you were added to group: ${groupName}`);
            });

            // Handler for user added to group notification
            conn.on("useraddedtogroupnotification", (username, groupName) => {
                console.log(`${username} was added to group: ${groupName}`);
            });
            // Handler for user removed from group notification
            conn.on("removedFromGroup", (username, groupName) => {
                console.log(`${username} was removed from group: ${groupName}`);
                setNotifyMessages(groupName);
            });

            // Listening to the 'ReceiveMessageFrom' event
            conn.on("ReceiveMessageFrom", (senderUsername, receivedMessage, date, time) => {
                setReceiveMessages(prevMessages => [
                    ...prevMessages,
                    { sender: senderUsername, message: receivedMessage, date: date, time: time }
                ]);
            });

            conn.on("ReceiveGroupMessage", (message) => {
                console.log("Group message received: ", message,);

            });



            await conn.start();   
            
            //a buffer obj  to pass in hub to take signalr connectionId & info
            const signalRUserInfoAcount = {
                Id: userId,
                username: username,
                isActive: true,
                signalConnId: "",
                photo_url: photo_url

            };
            //method in hub to notify clients
            const signalAcount = await conn.invoke("NotifyActiveUsers", signalRUserInfoAcount);
            
            if (signalAcount) {
                setIsLogin(true);
                setSignalrIdUser(signalAcount);
                setNotifyMessages(signalAcount.message);
                setuserGRoupName(`${username}-${signalAcount.signalRId}`);
                /*setSignalConnID(signalAcount.signalRId);*/
                setConnection(conn);


                console.log("%c signalAcount ", "color: #FFA500;", signalAcount);
            } else {
                console.error("Failed to add user");
            }

            

        } catch (e) {
            setIsLogin(false);           
            console.log(e);
        }
    };

    const removeUserFromGroup = async (id) => {
        /*const groupName = `${username}-${signalrIdUser.signalRId}`;*/
        console.log("groupName", groupName);

        await connection.invoke("RemoveUserFromGroup", id, groupName);

        console.log("Remove User:");
        console.log("id choose", id);
        // Add your logic here
    };

    const addUserToGroup = async (id) => {
        /*const groupName = `${username}-${signalrIdUser.signalRId}`;*/
        console.log("groupName", groupName);

        await connection.invoke("AddUserToGroup", id, groupName);

        console.log("Add User:");
        console.log("id choose", id,);
        // Add your  logic here


    };

    const handleClick = async (id) => {
        
        setchooseUserIds(prevState => {

            if (prevState.includes(id)) {

                setChooseIdBuff(id)             
                removeUserFromGroup(id);

                return prevState.filter(userId => userId !== id);

            } else if (prevState.length < 8) {

                setChooseIdBuff(id);              
                addUserToGroup(id);

                return [...prevState, id];

            } else {
                setChooseIdBuff(id)
                removeUserFromGroup(id);

                return prevState;
            }
        });
    };

    
    //const logout = async (username, signalId) => {
    //    if (connection) {
    //        // Call the DisconnectUser method on the server to disconnect a user
    //        await connection.invoke("DisconnectUser", username, signalId);
    //        console.log(username, signalId);
    //    }

    //    setIsAuthenticated(false);   
    //    setConnection(null);
    //    navigate('/welcome-page');
    //};

    

    const handleClickGoChat = async () => {
        navigate(`/chatRoom/active-user/${groupName}-group`);

    };
    
    useEffect(() => {
        
    }, [chooseUserIds]);

    return (
        <AuthContext.Provider value={{
            joinChatRoom,login,
            username, setUsername,
            password, setPassword,
            isAuthenticated, userInfoAcount, connection,
            activeUsers, isLogin, notifyMessages,
            chooseUserIds, handleClick, handleClickGoChat , currentDateTime,
            receiveMessages, setReceiveMessages, signalrIdUser, groupName
            //isActive, signalIdUser,
            // , logout,
            //personalUserId, selectedUserPhotoUrl, handleClick,
            //handleClickGoChat, connection, 
            //chooseUserIds, notifyMessages, receiveMessages,
            //setReceiveMessages, currentDateTime, removefromGroup, setRemoveFromGroup
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
