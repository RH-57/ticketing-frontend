import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import {Routes, Route, Navigate} from 'react-router-dom'

import Login from '../views/auth/login'
import Register from '../views/auth/register'
import Dashboard from '../views/admin/dashboard'
import Branch from '../views/admin/branches'
import Employee from '../views/admin/employees'
import User from '../views/admin/users'
import Priority from '../views/admin/priorities'
import Category from '../views/admin/categories'
import SubCategory from '../views/admin/subCategories'
import SubSubCategory from '../views/admin/subSubCategories'
import Ticket from '../views/admin/tiket/tickets'
import CreateTicket from '../views/admin/tiket/create'
import DetailTicket from '../views/admin/tiket/show'
import Department from '../views/admin/departments'
import DetailTrend from '../views/admin/detailTrend'
import Division from '../views/admin/divisions'
import NotFound from '../views/admin/notFound'
import ChangePassword from '../views/admin/components/changePassword'


export default function AppRoutes() {
    const {isAuthenticated} = useContext(AuthContext)

    return (
        <Routes>
            <Route path='/' element={
                isAuthenticated ? <Navigate to ="/admin/dashboard" replace /> : <Navigate to="/login" replace />
            }/>
            <Route path="/register" element={
                isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Register />
            } />
            <Route path='/login' element={
                isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <Login />
            } />
            <Route path="/admin/dashboard" element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />
            } />
            
            <Route path="/admin/branches" element={
                isAuthenticated ? <Branch /> : <Navigate to="/login" replace />
            } />

            <Route path="/admin/divisions" element={
                isAuthenticated ? <Division /> : <Navigate to="/login" replace />
            } />

            <Route path="/admin/employees" element={
                isAuthenticated ? <Employee /> : <Navigate to="/login" replace />
            } />

            <Route path="/admin/priorities" element={
                isAuthenticated ? <Priority /> : <Navigate to="/login" replace />
            } />

            <Route path="/admin/users" element={
                isAuthenticated ? <User /> : <Navigate to="/login" replace />
            } />

            <Route path="/admin/categories" element={
                isAuthenticated ? <Category /> : <Navigate to="/login" replace />
            } />

            <Route path="/admin/sub-categories/:id" element={
                isAuthenticated ? <SubCategory /> : <Navigate to="/login" replace />
            } />

            <Route path="/admin/sub-sub-categories/:subCategoryId" element={
                isAuthenticated ? <SubSubCategory /> : <Navigate to="/login" replace />
            } />

            <Route path="/admin/tickets" element={
                isAuthenticated ? <Ticket /> : <Navigate to="/login" replace />
            } />

            <Route path="/admin/tickets/create" element={
                isAuthenticated ? <CreateTicket /> : <Navigate to="/login" replace />
            } />

            <Route path="/admin/tickets/:ticketNumber" element={
                isAuthenticated ? <DetailTicket /> : <Navigate to="/login" replace />
            } />
            <Route path="/admin/departments" element={
                isAuthenticated ? <Department /> : <Navigate to="/login" replace />
            } />

            <Route path="/admin/detail-trend" element={
                isAuthenticated ? <DetailTrend /> : <Navigate to="/login" replace />
            } />

            <Route path="/admin/change-password" element={
                isAuthenticated ? <ChangePassword /> : <Navigate to="/login" replace />
            } />

            <Route path="*" element={
                <NotFound />
            } />
            
        </Routes>
    )
}