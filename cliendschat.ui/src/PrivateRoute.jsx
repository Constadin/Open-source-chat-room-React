
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';

export default function PrivateRoute({ element, ...rest }) {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? element : <Navigate to="/login" />;
}
