import {useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'
import Cookies from 'js-cookie'
import { AuthContext } from '../../context/AuthContext'

export default function Login() {
    const navigate = useNavigate()
    const {setIsAuthenticated} = useContext(AuthContext)

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const [validation, setValidation] = useState([])
    const [loginFailed, setLoginFailed] = useState([])

    const login = async (e) => {
        e.preventDefault()

        try {
            const response = await api.post('/api/login', {
                email: email,
                password: password
            });
    
            const { token, user } = response.data.data;
    
            Cookies.set('token', token, { expires: 1 });
            Cookies.set('user', JSON.stringify({id: user.id, name: user.name, role: user.role }), { expires: 1 });
    
            // **Ambil CSRF token setelah login**
            const csrfResponse = await api.get('/api/csrf-token', { withCredentials: true });
            Cookies.set('csrfToken', csrfResponse.data.csrfToken, { expires: 1 });
    
            setIsAuthenticated(true);
            navigate("/admin/dashboard", { replace: true });
        } catch (error) {
            setValidation(error.response?.data || []);
            setLoginFailed(error.response?.data || []);
        }
    }
    return (
        <div className="container-scroller">
            <div className="container-fluid page-body-wrapper full-page-wrapper">
                <div className="row w-100 m-0">
                    <div className="content-wrapper full-page-wrapper d-flex align-items-center auth login-bg">
                        <div className="card col-lg-4 mx-auto">
                            <div className="card-body px-5 py-5">
                                <h3 className="card-title text-left mb-3">Login</h3>
                                {
                                        validation.errors && (
                                            <div className="alert alert-danger mt-2 pb-0">
                                                {
                                                    validation.errors.map((error, index) => (
                                                        <p key={index}>{error.path} : {error.msg}</p>
                                                    ))
                                                }
                                            </div>
                                        )
                                    }
                                    {
                                        loginFailed.message && (
                                            <div className="alert alert-danger mt-2">
                                                {loginFailed.message}
                                            </div>
                                        )
                                    }
                                <form onSubmit={login}>
                                <div className="form-group">
                                    <label>Username or email *</label>
                                    <input type="text" className="form-control p_input" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                <div className="form-group">
                                    <label>Password *</label>
                                    <input type="password" className="form-control p_input" value={password} onChange={(e) => setPassword(e.target.value)} />
                                </div>
                                <div className="text-center">
                                    <button type="submit" className="btn btn-primary btn-block enter-btn">Login</button>
                                </div>
                                <p className="sign-up">Dont have an Account? Contact Administrator</p>
                                </form>
                            </div>
                        </div>
                    </div>                                  
                </div>
            </div>
        </div>
    )
}