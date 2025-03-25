import { toast, ToastContainer } from "react-toastify"
import Sidebar from "../../components/Sidebar"
import Navbar from "../../components/Navbar"
import { Link, useParams } from "react-router-dom"
import Footer from "../../components/Footer"

import Cookies from "js-cookie";
import api from "../../services/api";
import { useEffect, useState } from "react";

export default function SubCategory() {
    const token = Cookies.get('token')
    const [subCategories, setSubCategories] = useState([])
    const [name, setName] = useState("")
    const [subCategoryId, setSubCategoryId] = useState(null);
    const {id} = useParams()
    const [validation, setValidation] = useState([])
    const [categoryName, setCategoryName] = useState('')

    const getCsrfToken = async () => {
        try {
            const res = await api.get('/api/csrf-token')
            return res.data.csrfToken
        } catch (error) {
            console.error('Failed to get CSRF token', error)
            return null
        }
    }

    const fetchCategoryName = async () => {
        try {
            const response = await api.get(`/api/admin/categories/${id}`)
            setCategoryName(response.data.data.name)  
        } catch (error) {
            console.error('Error fetching category name: ', error)
        }
    }

    const fetchDataSubCategory = async () => {
        if (token) {
            api.defaults.headers.common["Authorization"] = token;
            try {
                const response = await api.get(`/api/admin/categories/${id}/sub-categories`);
                setSubCategories(response.data.data); // Pastikan API mengembalikan nama kategori
            } catch (error) {
                console.error("Error fetching sub-category", error);
            }
        } else {
            console.error("Token is not available");
        }
    }

    useEffect(() => {
        fetchDataSubCategory()
        fetchCategoryName()
    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault()

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

            if(subCategoryId) {
                await api.put(`/api/admin/categories/${id}/sub-categories/${subCategoryId}`, {name})
                toast.success('Sub-Category has been updated')
            } else {
                await api.post(`/api/admin/categories/${id}/sub-categories`, {name})
                toast.success('Sub-Category has been created')
            }
            setSubCategoryId(null)
            setName('')
            setValidation({})
            fetchDataSubCategory()
        } catch (error) {
            if(error.response) {
                console.error('error response: ', error.response.data)
                setValidation(error.response.data)
            } else {
                console.error('Unknown error:', error)
            }
        }
    }

    const editSubCategory = (subCategory) => {
        setSubCategoryId(subCategory.id)
        setName(subCategory.name)
    }

    const deleteSubCategory = async (subCategoryId) => {
        const csrfToken = await getCsrfToken()
        if(!window.confirm("Are you sure?!")) {
            return
        }

        try {
            api.defaults.headers.common['Authorization'] = token
            api.defaults.headers.common['csrf-token'] = csrfToken

            await api.delete(`/api/admin/categories/${id}/sub-categories/${subCategoryId}`)
            toast.success('Sub-Category has been deleted')
            fetchDataSubCategory()
        } catch (error) {
            console.error('Error deleting sub-category:', error)
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
                            <h3 className="page-title">Manage {categoryName} Category </h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><Link to="/admin/categories">Categories</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Sub-Category</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-md-6 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{subCategoryId ? "Update Category" : "Add Category"}</h4>
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
                                                <input className="form-control" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Sub-Category Name"></input>
                                            </div>
                                            <button type="submit" className="btn btn-primary mr-2">{subCategoryId ? "Update" : "Save"}</button>
                                            <button type="button" className="btn btn-dark"
                                                onClick={() => {
                                                    setSubCategoryId(null)
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
                                        <h4 className="card-title">Sub-Category List</h4>
                                        <div className="table-responsive" style={{maxHeight: '250px', overflow: 'auto'}}>
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>No.</th>
                                                        <th>Name</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    subCategories.length > 0
                                                        ? subCategories.map((subCategory, index) => (
                                                            <tr key={subCategory.id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                    <Link to={`/admin/sub-sub-categories/${subCategory.id}`}>
                                                                        {subCategory.name}
                                                                    </Link>
                                                                </td>
                                                                <td>
                                                                    <button className="btn btn-sm btn-warning" onClick={() => editSubCategory(subCategory)}><i className="mdi mdi-pen" /></button>
                                                                    <button className="btn btn-sm btn-danger" onClick={() => deleteSubCategory(subCategory.id)}><i className="mdi mdi-trash-can" /></button>
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