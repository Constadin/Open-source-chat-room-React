import { Routes, Route } from 'react-router-dom';
import './App.css'
import WelcomePage from '../Views/WelcomePage.jsx';
import SingleUser from '../Views/SingleUser';
import Login from '../Views/Login.jsx';
import ErrorPage from '../Views/ErrorPage.jsx';
import ActiveUser from '../Views/ActiveUser.jsx';
import CustomContextProvider from './CustomContext.jsx';
import { AuthProvider } from './AuthContext.jsx';
import PrivateRoute from './PrivateRoute.jsx';

export default function App() {


    return (
        <>  
            {/*authorization for the pages/ εξουσιοδότηση για τις σελίδες  [implementation in AuthContext.jsx]*/}
            <AuthProvider>
                {/*hook context [implementation in CustomContext.jsx*/}
                <CustomContextProvider>
                    <Routes>    
                        <Route path='/welcome-page' element={<WelcomePage />} />                         
                        {/*Private Routes - Διαδρομές ιδιωτικές [implementation in PrivateRoute.jsx*/}
                        <Route path='/login' element={<Login />} />
                        <Route path='/chatRoom/active-user' element={<PrivateRoute element={<ActiveUser />} />} />
                        <Route path='/chatRoom/active-user/:id' element={<PrivateRoute element={<SingleUser />} />} />
                        <Route path='*' element={<ErrorPage />} /> 
                    </Routes>
                </CustomContextProvider>
            </AuthProvider>
        </>
    );
}

