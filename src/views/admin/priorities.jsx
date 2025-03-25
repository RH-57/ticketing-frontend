import {useState, useEffect} from "react"
import Cookies from "js-cookie"
import api from '../../services/api'
import { toast, ToastContainer } from "react-toastify"
import Sidebar from "../../components/Sidebar"
import Navbar from "../../components/Navbar"
import { Link } from "react-router-dom"
import Footer from "../../components/Footer"
export default function Priority() {
    const token = Cookies.get('token')
    const [priorities, setPriorities] = useState([])
    const [id, setId] = useState('')
    const [name, setName] = useState('')
    const [validation, setValidation] = useState([])

    const fetchDataPriorities = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/priorities')
                setPriorities(response.data.data)
            } catch (error) {
                console.error(error)
            }
        } else {
            console.error("Token is not available")
        }
    }
    
    useEffect(() => {
        fetchDataPriorities()
    }, [])

    const getCsrfToken = async () => {
        try {
            const response = await api.get('/api/csrf-token')
            return response.data.csrfToken
        } catch (error) {
            console.error(error)
            return null
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!token) {
            console.error("Token not found")
            return
        }

        try {
            const csrfToken = await getCsrfToken()
            if(!csrfToken) {
                console.error("Failed to get csrf token")
                return
            }

            api.defaults.headers.common['Authorization'] = token
            api.defaults.headers.common['csrf-token'] = csrfToken

            if(id) {
                await api.put(`/api/admin/priorities/${id}`, {name})
                toast.success('Priority has been updated')
            } else {
                await api.post('/api/admin/priorities', {name})
                toast.success('Priority has been created')
            }

            setId(null)
            setName('')
            setValidation({})
            fetchDataPriorities()
        } catch (error) {
            if (error.response) {
                console.error('Error response: ', error.response.data)
                setValidation(error.response.data)
            } else (
                console.error('Unknown error: ', error)
            )
        }
    }

    const editPriority = (priority) => {
        setId(priority.id)
        setName(priority.name)
    }

    const deletePriority = async (id) => {
        const csrfToken = await getCsrfToken(); 
        if(!window.confirm("Are you sure?")) {
            return
        }

        try {
            api.defaults.headers.common["Authorization"] = token
            api.defaults.headers.common['csrf-token'] = csrfToken; 
            await api.delete(`/api/admin/priorities/${id}`)

            toast.success('Priority has been deleted')
            fetchDataPriorities()
        } catch(error) {
            console.error("Error deleting priority: ", error)
            alert("Error")
        }
    }
    return(
        <div className="container-scroller">
        <ToastContainer />
            <Sidebar />
            <div className="container-fluid page-body-wrapper">
                <Navbar/>
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-header">
                            <h3 className="paget-title">Manage Priority</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Master Priority</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-md-6 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{id ? "Edit Priority" : "Add Priority"}</h4>
                                        {
                                            validation.errors && (
                                                <div className="alert alert-danger mt-2 pb-0">
                                                    {validation.errors.map((error, index) => (
                                                        <p key={index}>{error.path}:{error.msg}</p>
                                                    ))}
                                                </div>
                                            )
                                        }
                                        <form onSubmit={handleSubmit} className="form-sample">
                                            <div className="form-group">
                                                <label>Name</label>
                                                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} placeholder="Priority Name"></input>
                                            </div>
                                            <button type="submit" className="btn btn-primary mr-2">{id ? "Update" : "Save"}</button>
                                            <button type="button" className="btn btn-dark"
                                                onClick={() => {
                                                    setId(null)
                                                    setName('')
                                                }}
                                            >cancel</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title mb-0">Priority List</h4>
                                        <div className="table-responsive" style={{maxHeight:'220px', overflow: 'auto'}}>
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Priority Name</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        priorities.length > 0
                                                            ? priorities.map((priority, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{priority.name}</td>
                                                                    <td>
                                                                        <button className="btn btn-sm btn-warning rounded-sm shadow border-0" onClick={() => editPriority(priority)}><i className="mdi mdi-pen" /></button>
                                                                        <button className="btn btn-sm btn-danger rounded-sm shadow border-0" onClick={() => deletePriority(priority.id)}><i className="mdi mdi-trash-can" /></button>
                                                                    </td>
                                                                </tr>
                                                            )) :
                                                                <tr>
                                                                    <td colSpan="4" className="text-center">
                                                                        <div className="aler aler-danger mb-0">
                                                                            Data belum tersedia
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