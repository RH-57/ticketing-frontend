import {useState} from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api'

export default function Register() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirmation, setPasswordConfrimation] = useState("")
    const [validation, setValidation] = useState([])

    const register = async (e) => {
        e.preventDefault()

        if(password !== passwordConfirmation) {
            setValidation([{path: 'password_confirmation', msg: 'Password do not match'}])
            return
        }
        try {
            await api.post('/api/register', {
                name: name,
                email: email,
                password: password
            })
            navigate("/login")
        } catch (error) {
            setValidation(error.response.data.errors || [])
        }
    
    }
    return (
        <div className="row justify-content-center">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card border-0 rounded shadow-sm">
                        <div className="card-body bg-dark text-white">
                            <h4 className="text-center">Register</h4>
                            <hr />
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
                            <form onSubmit={register}>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <div className="form-group">
                                            <label className="mb-1 fw-bold">Full Name</label>
                                            <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full-Name"></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <div className="form-group">
                                            <label className="mb-1 fw-bold">Email</label>
                                            <input className="form-control" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <div className="form-group">
                                            <label className="mb-1 fw-bold">Password</label>
                                            <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="***"></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12 mb-3">
                                        <div className="form-group">
                                            <label className="mb-1 fw-bold">Confirm Password</label>
                                            <input className="form-control" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfrimation(e.target.value)} placeholder="***"></input>
                                        </div>
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-secondary w-100">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}