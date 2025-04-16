import { toast, ToastContainer } from "react-toastify"
import Sidebar from "../../components/Sidebar"
import Navbar from "../../components/Navbar"
import Footer from "../../components/Footer"
import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import Cookies from 'js-cookie'
import api from "../../services/api"

export default function User() {
    const [users, setUsers] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [id, setId] = useState(null)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [message, setMessage] = useState("")
    const token = Cookies.get('token')

    const roles = ["superadmin", "admin", "technician", "viewer"];

    const getCsrfToken = async () => {
        try {
            const res = await api.get('/api/csrf-token')
            return res.data.csrfToken
        } catch (error) {
            console.error('Failed to get CSRF token', error)
            return null
        }
    }

    const fetchDataUsers = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/users')
                setUsers(response.data.data)
            } catch (error) {
                console.error("there was ab error fetching the users", error)
            }
        } else {
            console.error("Token is not available")
        }
    }

    useEffect(() => {
        fetchDataUsers()
    }, [])

    const searchUser = async () => {
        if(!searchQuery) {
            fetchDataUsers()
            return
        }

        try {
            api.defaults.headers.common['Authorization'] = token
            const response = await api.get(`/api/admin/users/search?query=${searchQuery}`)
            setUsers(response.data.data)
        } catch (error) {
            console.error(error)
            toast.error("error fetching data")
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")

        if(!name || !email || !role ) {
            toast.error("Please fill all required fields")
            return
        }

        if (password !== confirmPassword) {
            toast.error("Password do not match")
            return
        }

        if(!token) {
            console.error('Token not found')
            return
        }

        try {
            const csrfToken = await getCsrfToken()

            if(!csrfToken) {
                console.error('Failed to get csrf token')
                return
            }

            api.defaults.headers.common['Authorization'] = token
            api.defaults.headers.common['csrf-token'] = csrfToken

            let userData = {
                name,
                email,
                role,
            }

            if(password) {
                userData.password = password
            }

            if (id) {
                await api.put(`/api/admin/users/${id}`, userData)
                toast.success('Users has been updated')
            } else {
                await api.post('/api/admin/users', {
                    ...userData,
                    password
                })
                toast.success('Users has been added')
            }
            setId(null)
            setName("")
            setEmail("")
            setRole("")
            setPassword("")
            setConfirmPassword("")

            fetchDataUsers()
        } catch (error) {
            console.error(error)
            toast.error("Failed to create user")
        }
    }

    const editUser = (user) => {
        setId(user.id)
        setName(user.name)
        setEmail(user.email)
        setRole(user.role)
    }

    const deleteUser = async (id) => {
        const csrfToken = await getCsrfToken()
        if(!window.confirm("Are you sure?")) {
            return
        }

        try {
            api.defaults.headers.common['Authorization'] = token
            api.defaults.headers.common['csrf-token'] = csrfToken
            await api.delete(`/api/admin/users/${id}`)
            toast.success("User has been deleted")
        } catch (error) {
            console.error(error)
            toast.error("Failed to delete user")
        }
    }
    return (
        <div className="container-scroller">
            <ToastContainer />
            <Sidebar />
            <div className="container-fluid body-page-wrapper">
                <Navbar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-header">
                            <h3 className="page-title">Manage Users</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Master User</li> 
                                </ol>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-md-5 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{id ? "Edit User" : "Add User"}</h4>
                                        {
                                            message && (
                                                <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"} mt-2`}>
                                                    {message}
                                                </div>
                                            )
                                        }
                                        <form onSubmit={handleSubmit} className="form-sample">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name"></input>
                                            </div>
                                            <div className="form-group">
                                                <label>Email</label>
                                                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"></input>
                                            </div>
                                            <div className="form-group">
                                                <label>Role</label>
                                                <select className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                                                    <option value="">Select Role</option>
                                                    {
                                                        roles.map((role) => (
                                                            <option key={role} value={role}>
                                                                {role}
                                                            </option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Password</label>
                                                        <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"/>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Confirm Password</label>
                                                        <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm Password" />
                                                    </div>
                                                </div>
                                            </div>
                                            <button type="submit" className="btn btn-primary mr-2">{id ? "Update" : "Save"}</button>
                                            <button type="button" className="btn btn-dark">Cancel</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-7 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="card-title mb-0">User List</h4>
                                            <input
                                                type="text"
                                                className="form-control w-50 ml-auto"
                                                placeholder="Search.."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                onKeyUp={(e) => e.key === 'Enter' && searchUser()}
                                            />
                                        </div>
                                        <div className="table-responsive" style={{maxHeight: '400', overflow: 'auto'}}>
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Email</th>
                                                        <th>Role</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        users.length > 0
                                                            ? users.slice(0,6).map((user) => (
                                                                <tr key={user.id}>
                                                                    <td>{user.name}</td>
                                                                    <td>{user.email}</td>
                                                                    <td>
                                                                        <span className={`badge ${user.role === "superadmin" ? "badge-outline-danger" : user.role === "admin" ? "badge-outline-primary" : user.role === "viewer" ? "badge-outline-success" : "badge-outline-warning"}`}>
                                                                            {user.role}
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <button className="btn btn-sm btn-warning" onClick={() => editUser(user)}><i className="mdi mdi-pen" /></button>
                                                                        <button className="btn btn-sm btn-danger" onClick={() => deleteUser(user.id)}><i className="mdi mdi-trash-can" /></button>
                                                                    </td>
                                                                </tr>
                                                            )) :
                                                            <tr>
                                                                <td colSpan="5" className="text-center">
                                                                    <div className="alert alert-danger mb-0">
                                                                        Data Belum Tersedia!
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                    }
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <footer className="footer fixed">
                        <Footer />
                    </footer>
                </div>
            </div>
        </div>
    )
}