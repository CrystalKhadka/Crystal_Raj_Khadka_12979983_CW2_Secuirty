import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'


const UserRoutes = () => {
  //get user information
  const user = JSON.parse(localStorage.getItem('user'))

  // check isAdmin
  // check isAdmin = true
  // if true : access the route of Admin (Outlet)
  // if false : navigate to login

  return user != null ? <Outlet />
      : <Navigate to={'/login'} />
  
}

export default UserRoutes
