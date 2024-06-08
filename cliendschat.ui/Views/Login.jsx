import "./login.css";
import { useContext } from 'react';
import { CustomContext } from '../src/CustomContext.jsx';
import { AuthContext } from '../src/AuthContext.jsx';

export default function Login() {

    const { handleSubmit} = useContext(CustomContext);
    const { logout, username, setUsername, password, setPassword } = useContext(AuthContext);

    return (
        <>  
            
            <p style={{ marginTop: '30px', fontSize: '1.5rem', borderBottom: '2px solid' }}>User login</p>
            <div className='login-content'>
            <span style={{  fontSize: '1.2rem', borderBottom: '2px solid' }}>Welcome to Chat around The World</span>
                <button onClick={() => logout(username) } className='go-to-chat' >log Out</button>
            </div>
            <form onSubmit={handleSubmit}> {/*implementation function to CustomContext.jsx*/}
                <div className='form-content'>
                    <div>
                        <label>Username: </label>
                        <input className='username'
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div>
                        <label>Password:</label>
                        <input className='username'
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="submit-btn" type='submit'>Login</button>
                </div>
            </form>
            <div className='footer'>
                &copy; 2024 Nikolas Konstantinidis.
            </div>

        </>
    );
}
