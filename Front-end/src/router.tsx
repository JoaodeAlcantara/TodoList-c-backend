import { createBrowserRouter, redirect } from "react-router-dom";
import Login from './Views/Login';
import Home from "./Views/Home";

const checkAuth = () => {
    const token = localStorage.getItem('token');
    return !!token;
};

export const router = createBrowserRouter([
    {
        children: [
            {
                path: '/',
                element: <Login />,
                loader: () => {
                    if (checkAuth()) {
                        return redirect('/home');
                    }
                    return null;
                }
            },
            {
                path: '/home',
                element: <Home />,
                loader: () => {
                    if (!checkAuth()) {
                        return redirect('/');
                    }
                    return null;
                }
            },
        ]
    }
]);