import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const AdminRoutes = () => {
    //get user information
    const user = JSON.parse(localStorage.getItem('user'))

    // check isAdmin
    // check isAdmin = true
    // if true : access the route of Admin (Outlet)
    // if false : navigate to login

    return user != null && user.isAdmin ? <Outlet />
        : <Navigate to={'/login'} />


}

export default AdminRoutes
