import { toast, ToastContainer } from "react-toastify"
import Sidebar from "../../components/Sidebar"
import Navbar from "../../components/Navbar"
import { Link, useParams } from "react-router-dom"
import Footer from "../../components/Footer"
import { useState, useEffect } from "react"
import api from "../../services/api"
import Cookies from "js-cookie"

export default function SubSubCategory() {
    const token = Cookies.get('token')
    const [subCategoryName, setSubCategoryName] = useState('')
    const [validation, setValidation] = useState([])
    const [subSubCategories, setSubSubCategories] = useState([])
    const {categoryId, subCategoryId} = useParams()
    const [name, setName] = useState("")
    const [id, setId] = useState(null)
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
            const response = await api.get(`/api/admin/categories/${categoryId}/sub-categories/${subCategoryId}`)
            setSubCategoryName(response.data.data.name)  
        } catch (error) {
            console.error('Error fetching category name: ', error)
        }
    }

    const fetchDataSubSubCategory = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get(`/api/admin/sub-categories/${subCategoryId}/sub-sub-categories`)
                setSubSubCategories(response.data.data)
            } catch (error) {
                console.error('error fetching sub-sub-category', error)
            }
        } else {
            console.error('Token is not available')
        }
    } 

    useEffect(() => {
        fetchCategoryName()
        fetchDataSubSubCategory()
    }, [categoryId, subCategoryId])

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            console.error("Token not found");
            return;
        }

        try {
            const csrfToken = await getCsrfToken();
            if (!csrfToken) {
                console.error("Failed to get CSRF Token");
                return;
            }

            api.defaults.headers.common["Authorization"] = token;
            api.defaults.headers.common["csrf-token"] = csrfToken;

            if (id) {
                await api.put(`/api/admin/sub-categories/${subCategoryId}/sub-sub-categories/${id}`, { name });
                toast.success("Sub-Sub-Category has been updated");
            } else {
                await api.post(`/api/admin/sub-categories/${subCategoryId}/sub-sub-categories`, { name });
                toast.success("Sub-Sub-Category has been created");
            }

            fetchDataSubSubCategory();
            setName('');
            setValidation({})
        } catch (error) {
            console.error("Error submitting form", error);
            toast.error("Failed to save Sub-Sub-Category");
        }
    }

    const editSubSubCategory = (subSubCategory) => {
        setId(subSubCategory.id)
        setName(subSubCategory.name)
    }

    const deleteSubSubCategory = async (subSubCategoryId) => {
        if (!window.confirm("Are you sure you want to delete this sub-sub-category?")) {
            return;
        }
    
        if (!token) {
            console.error("Token not found");
            return;
        }
    
        try {
            const csrfToken = await getCsrfToken();
            if (!csrfToken) {
                console.error("Failed to get CSRF Token");
                return;
            }
    
            api.defaults.headers.common["Authorization"] = token;
            api.defaults.headers.common["csrf-token"] = csrfToken;
    
            await api.delete(`/api/admin/sub-categories/${subCategoryId}/sub-sub-categories/${subSubCategoryId}`);
            toast.success("Sub-Sub-Category has been deleted");
    
            fetchDataSubSubCategory(); // Refresh data setelah delete
        } catch (error) {
            console.error("Error deleting sub-sub-category", error);
            toast.error("Failed to delete Sub-Sub-Category");
        }
    };

    return (
        <div className="container-scroller">
            <ToastContainer />
            <Sidebar />
            <div className="container-fluid page-body-wrapper">
                <Navbar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-header">
                            <h3 className="page-title">Manage {subCategoryName} Category</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><Link to="/admin/categories">Categories</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Sub-Sub-Category</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-md-6 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{id ? "Update Category":"Add Category"}</h4>
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
                                                <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} type="text"  placeholder="Sub-Category Name"></input>
                                            </div>
                                            <button type="submit" className="btn btn-primary mr-2">{id ? "Update":"Save"}</button>
                                            <button type="button" className="btn btn-dark"
                                                onClick={() => {
                                                    setName("")
                                                    setId(null)
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
                                                        <th>Name</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    subSubCategories.length > 0
                                                        ? subSubCategories.map((subSubCategory, index) => (
                                                            <tr key={subSubCategory.id}>
                                                                <td>{index + 1}</td>
                                                                <td>
                                                                        {subSubCategory.name}
                                                                </td>
                                                                <td>
                                                                    <button className="btn btn-sm btn-warning" onClick={() => editSubSubCategory(subSubCategory)}><i className="mdi mdi-pen" /></button>
                                                                    <button className="btn btn-sm btn-danger" onClick={() => deleteSubSubCategory(subSubCategory.id)}><i className="mdi mdi-trash-can" /></button>
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