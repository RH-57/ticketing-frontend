import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";

import Cookies from "js-cookie";
import api from "../../services/api";
import { useEffect, useState } from "react";

export default function Category() {
    const token = Cookies.get('token')
    const [categories, setCategories] = useState([])
    const [id, setId] = useState("")
    const [name, setName] = useState("")
    const [validation, setValidation] = useState([])

    const getCsrfToken = async () => {
        try {
            const res = await api.get('/api/csrf-token')
            return res.data.csrfToken
        } catch (error) {
            console.error('Failed to get CSRF token', error)
            return null
        }
    }

    const fetchDataCategories = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/categories')
                setCategories(response.data.data)
            } catch (error) {
                console.error("there was an error fetching categories", error)
            }
        } else {
            console.error("Token is not available")
        }
    }

    useEffect(() => {
        fetchDataCategories()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!token) {
            console.error('Token Not Found')
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

            if(id) {
                await api.put(`/api/admin/categories/${id}`, {name})
                toast.success('Category has been updated')
            } else {
                await api.post('/api/admin/categories', {name})
                toast.success('Category has been created')
            }

            setId(null)
            setName('')
            setValidation({})
            fetchDataCategories()
        } catch (error) {
            if(error.response) {
                console.error('error response: ', error.response.data)
                setValidation(error.response.data)
            } else {
                console.error('Unknown error:', error)
            }
        }
    }

    const editCategory = (category) => {
        setId(category.id)
        setName(category.name)
    }

    const deleteCategory = async (id) => {
        const csrfToken = await getCsrfToken()
        if(!window.confirm("Are you sure?!")) {
            return
        }

        try {
            api.defaults.headers.common['Authorization'] = token
            api.defaults.headers.common['csrf-token'] = csrfToken
            await api.delete(`/api/admin/categories/${id}`)
            toast.success('Category has been deleted')
            fetchDataCategories()
        } catch (error) {
            console.error('Error deleting category: ', error)
            toast.error('Error')
        }
    }
    return(
        <div className="container-scroller">
            <ToastContainer />
            <Sidebar />
            <div className="container-fluid page-body-wrapper">
                <Navbar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-header">
                            <h3 className="page-title">Manage Categories</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Master Category</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-md-6 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{id ? "Edit Category" : "Add Cartegory"}</h4>
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
                                                <label>Category Name</label>
                                                <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Category Name"></input>
                                            </div>
                                            <button type="submot" className="btn btn-primary mr-2">{id ? "Update" : "Save"}</button>
                                            <button type="button" className="btn btn-dark"
                                                onClick={() => {
                                                    setId(null)
                                                    setName('')
                                                }}
                                            >Cancel</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Category List</h4>
                                        <div className="table-responsive" style={{maxHeight: '250px', overflow: 'auto'}}>
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Category Name</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    categories.length > 0
                                                        ? categories.map((category, index) => (
                                                            <tr key={category.id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                <Link to={`/admin/sub-categories/${category.id}`}>
                                                                    {category.name}
                                                                </Link>
                                                                </td>
                                                                <td>
                                                                    <button className="btn btn-sm btn-warning" onClick={() => editCategory(category)}><i className="mdi mdi-pen" /></button>
                                                                    <button className="btn btn-sm btn-danger" onClick={() => deleteCategory(category.id)}><i className="mdi mdi-trash-can" /></button>
                                                                </td>
                                                            </tr>
                                                        )) :
                                                        <tr>
                                                            <td className="text-center" colSpan="4">
                                                                <div className="alert alert-danger mb-0">
                                                                    Data Belum Tersedia
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