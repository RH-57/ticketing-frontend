import { Link, useNavigate } from 'react-router-dom'
import {useState, useEffect, useContext} from 'react'
import Cookies from 'js-cookie'
import { AuthContext } from '../context/AuthContext'

export default function Navbar() {
    const [user, setUser] = useState([])
    useEffect(() => {
        const userData = Cookies.get('user')
        if(userData) {
            setUser(JSON.parse(userData))
        }
    }, [])

    const navigate = useNavigate()
    const {setIsAuthenticated} = useContext(AuthContext)
    const logout = () => {
      Cookies.remove('token')
      Cookies.remove('user')

      setIsAuthenticated(false)

      navigate("/login", {replace: true})
    }

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(interval); // Bersihkan interval saat komponen unmount
    }, []);

    const formattedTime = currentTime.toLocaleTimeString("id-ID", {
      timeStyle: "medium"
    });

    const formattedDate = currentTime.toLocaleDateString("id-ID", {
      weekday: "long",  // Nama hari (Senin, Selasa, dst.)
      day: "2-digit",   // Tanggal (01, 02, dst.)
      month: "short",    // Nama bulan (Januari, Februari, dst.)
      year: "numeric"   // Tahun (2025, dst.)
    });
  return (
    <nav className="navbar p-0 fixed-top d-flex flex-row">
      <div className="navbar-brand-wrapper d-flex d-lg-none align-items-center justify-content-center">
        <Link to="/admin/dashboard" className="navbar-brand brand-logo-mini">
          <img src="/assets/images/logo-mini.svg" alt="logo" />
        </Link>
      </div>
      <div className="navbar-menu-wrapper flex-grow d-flex align-items-stretch">
        <button
          className="navbar-toggler navbar-toggler align-self-center"
          type="button"
          data-bs-toggle="minimize"
        >
          <span className="mdi mdi-menu" />
        </button>
        <ul className="navbar-nav w-100 d-flex justify-content-left">
         <li className="nav-item">{formattedDate} - {formattedTime}</li>
        </ul>
        <ul className="navbar-nav navbar-nav-right">
          <li className="nav-item">
              
          </li>
          <li className="nav-item dropdown d-none d-lg-block">
            <Link
              className="nav-link btn btn-success create-new-button"
              to="/admin/tickets/create"
            >
              Tiket Baru
            </Link>
          </li>
          <li className="nav-item dropdown">
            <a
              className="nav-link"
              id="profileDropdown"
              href="#"
              data-bs-toggle="dropdown"
            >
              <div className="navbar-profile">
                <p className="mb-0 d-none d-sm-block navbar-profile-name">
                  {user?.name}
                </p>
                <i className="mdi mdi-menu-down d-none d-sm-block" />
              </div>
            </a>
            <div
              className="dropdown-menu dropdown-menu-right navbar-dropdown preview-list"
              aria-labelledby="profileDropdown"
            >
              <h6 className="p-3 mb-0">Settings</h6>
              <div className="dropdown-divider" />
              <Link to="/admin/change-password" className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-dark rounded-circle">
                    <i className="mdi mdi-settings text-success" />
                  </div>
                </div>
                <div className="preview-item-content">
                  <p className="preview-subject mb-1">Change Password</p>
                </div>
              </Link>
              <div className="dropdown-divider" />
              <a className="dropdown-item preview-item">
                <div className="preview-thumbnail">
                  <div className="preview-icon bg-dark rounded-circle">
                    <i className="mdi mdi-logout text-danger" />
                  </div>
                </div>
                <div className="preview-item-content">
                  <a onClick={logout} className="preview-subject mb-1">Log out</a>
                </div>
              </a>
              <div className="dropdown-divider" />
            </div>
          </li>
        </ul>
        <button
          className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
          type="button"
          data-bs-toggle="offcanvas"
        >
          <span className="mdi mdi-format-line-spacing" />
        </button>
      </div>
    </nav>

  )
}