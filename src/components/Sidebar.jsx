import { Link, useNavigate } from 'react-router-dom'
import { useState, useEffect, useContext } from 'react'
import Cookies from 'js-cookie'
import { AuthContext } from '../context/AuthContext'

export default function Sidebar() {
    const [user, setUser] = useState({})
    const { setIsAuthenticated } = useContext(AuthContext)
    const navigate = useNavigate()

    useEffect(() => {
        const userData = Cookies.get('user')
        if (userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    const handleLogout = () => {
        Cookies.remove('token')
        Cookies.remove('user')
        setIsAuthenticated(false)
        navigate("/login", { replace: true })
    }

    const allowedRoles = ['superadmin', 'admin', 'technician']
    const showMenu = allowedRoles.includes(user?.role)

    return (
        <nav className="sidebar sidebar-offcanvas" id="sidebar">
            <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
                <Link to="/admin/dashboard" className="sidebar-brand brand-logo">
                    <img src="/assets/images/logo.svg" alt="logo" style={{ width: '300px', height: 'auto' }} />
                </Link>
                <Link to="/admin/dashboard" className="sidebar-brand brand-logo-mini">
                    <img src="/assets/images/logo-mini.svg" alt="logo" />
                </Link>
            </div>
            <ul className="nav">
                <li className="nav-item profile">
                    <div className="profile-desc">
                        <div className="profile-pic">
                            <div className="profile-name">
                                <h4 className="mb-0 font-weight-normal">{user?.name}</h4>
                            </div>
                        </div>
                    </div>
                </li>
                <li className="nav-item nav-category">
                    <span className="nav-link">Navigation</span>
                </li>

                <li className="nav-item menu-items">
                    <a className="nav-link" href="/admin/dashboard">
                        <span className="menu-icon">
                            <i className="mdi mdi-speedometer" />
                        </span>
                        <span className="menu-title">Dashboard</span>
                    </a>
                </li>

                {showMenu && (
                    <li className="nav-item menu-items">
                        <a className="nav-link" data-bs-toggle="collapse" href="#ui-basic" aria-expanded="false" aria-controls="ui-basic">
                            <span className="menu-icon">
                                <i className="mdi mdi-laptop" />
                            </span>
                            <span className="menu-title">Master</span>
                            <i className="menu-arrow" />
                        </a>
                        <div className="collapse" id="ui-basic">
                            <ul className="nav flex-column sub-menu">
                                <li className="nav-item">
                                    <Link to="/admin/branches" className="nav-link">Branch</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin/categories" className="nav-link">Category</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin/divisions" className="nav-link">Division</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin/departments" className="nav-link">Department</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin/employees" className="nav-link">Employee</Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/admin/priorities" className="nav-link">Priority</Link>
                                </li>
                                {user?.role === 'superadmin' && (
                                    <li className="nav-item">
                                        <Link to="/admin/users" className="nav-link">User</Link>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </li>
                )}
                {showMenu && (
                <li className="nav-item">
                    <a className="nav-link" href="/admin/tickets">
                        <span className="menu-icon">
                            <i className="mdi mdi-ticket-account" />
                        </span>
                        <span className="menu-title">Tickets</span>
                    </a>
                </li>
                )}
                <li className="nav-item menu-items mt-auto">
                    <button
                        className="nav-link text-danger"
                        onClick={handleLogout}
                        style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}
                    >
                        <span className="menu-icon">
                            <i className="mdi mdi-logout" />
                        </span>
                        <span className="menu-title">Logout</span>
                    </button>
                </li>
            </ul>
        </nav>
    )
}
