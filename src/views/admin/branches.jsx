import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import api from '../../services/api'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/ReactToastify.css'

import Sidebar from '../../components/Sidebar'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'

export default function Branch() {
    const token = Cookies.get('token')
    const [branches, setBranches] = useState([])
    const [searchQuery, setSearchQuery] = useState('')


    const fetchDataBranches = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/branches')
                setBranches(response.data.data)
            } catch (error) {
                console.error("There was an error fetching the bracnhes!", error)
            }
        } else {
            console.error("Token is not available")
        }
    }

    useEffect(() => {
        fetchDataBranches()
    }, [])

    const searchBranch = async() => {
        if(!searchQuery) {
            fetchDataBranches()
            return
        }
        const csrfToken = await getCsrfToken(); 
        if (!csrfToken) {
            console.error("Failed to get CSRF token");
            return;
        }

        try {
            api.defaults.headers.common['Authorization'] = token
            api.defaults.headers.common['csrf-token'] = csrfToken
            const response = await api.get(`/api/admin/branches/search?query=${searchQuery}`)
            setBranches(response.data.data)
        } catch (error) {
            console.error(error)
            alert('error feacthing data')
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            searchBranch();
        }, 500); // Tunggu 500ms setelah user berhenti mengetik

        return () => clearTimeout(delayDebounce); // Bersihkan timeout jika user masih mengetik
    }, [searchQuery]);

    const [id, setId] = useState()
    const [code, setCode] = useState('')
    const [name, setName] = useState('')
    const [validation, setValidation] = useState([])

    const getCsrfToken = async() => {
        try {
            const response = await api.get('/api/csrf-token')
            return response.data.csrfToken
        } catch (error) {
            console.error('Error fetching CSRF Token: ', error)
            return null
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token) {
            console.error("Token Not Found");
            return;
        }

        try {
            const csrfToken = await getCsrfToken(); // Ambil CSRF token dari backend
            if (!csrfToken) {
                console.error("Failed to get CSRF token");
                return;
            }

            api.defaults.headers.common['Authorization'] = token;
            api.defaults.headers.common['csrf-token'] = csrfToken; // Tambahkan CSRF token di header

            if (id) {
                // Update existing branch
                await api.put(`/api/admin/branches/${id}`, { code, name });
                toast.success('Branch has been updated');
            } else {
                // Create new branch
                await api.post('/api/admin/branches', { code, name });
                toast.success('Branch has been added');
            }

            setCode('');
            setName('');
            setId(null)
            setValidation({});
            fetchDataBranches();
        } catch (error) {
            if (error.response) {
                console.error('Error Response:', error.response.data);
                setValidation(error.response.data);
            } else {
                console.error('Unknown Error:', error);
            }
        }
    }

    const editBranch = (branch) => {
        setId(branch.id);
        setCode(branch.code);
        setName(branch.name);
    };

    const deleteBranch = async (id) => {
        const csrfToken = await getCsrfToken(); 
        if(!window.confirm("Are you sure?")) {
            return
        }

        try {
            api.defaults.headers.common["Authorization"] = token
            api.defaults.headers.common['csrf-token'] = csrfToken; 
            await api.delete(`/api/admin/branches/${id}`)

            toast.success('Branch has been deleted')
            fetchDataBranches()
        } catch(error) {
            console.error("Error deleting branch: ", error)
            alert("Error")
        }
    }
    return (
        <div className="container-scroller">
         <ToastContainer />
        {/* partial:partials/_sidebar.html */}
        <Sidebar />
        {/* partial */}
            <div className="container-fluid page-body-wrapper">
                {/* partial:partials/_navbar.html */}
                <Navbar />
                {/* partial */}
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-header">
                            <h3 className="page-title"> Manage Branch </h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item active" aria-current="page">Master Branch</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-md-8 grid-margin stretch-card mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{id ? "Edit Branch" : "Add Branch"}</h4>
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
                                            <div className="form-group row">
                                                <label htmlFor="exampleInputUsername1"  className="col-md-2 col-form-label">Code</label>
                                                <div className="col-md-10">
                                                    <input type="text" id="code" value={code} className="form-control text-white" onChange={(e) => setCode(e.target.value)} placeholder="Code" />
                                                </div>                                                
                                            </div>
                                            <div className="form-group row">
                                                <label htmlFor="exampleInputEmail1" className="col-sm-2 col-form-label">Branch Name</label>
                                                <div className="col-sm-10">
                                                    <input type="text" value={name} className="form-control text-white" onChange={(e) => setName(e.target.value)} placeholder="Branch Name" />
                                                </div>
                                            </div>
                                            <div className="form-group row">
                                                <div className="col-sm-10">
                                                    <button type="submit" className="btn btn-primary mr-2">{id ? "Update" : "Save"}</button>
                                                    <button type="button" className="btn btn-dark"
                                                        onClick={() => {
                                                            setId(null)
                                                            setCode('')
                                                            setName('')
                                                        }}
                                                    >Cancel    
                                                    </button>
                                                </div>
                                            </div>                
                                        </form>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="card-title mb-0">Branches List</h4>
                                            <input
                                                type="text"
                                                className="form-control w-50 ml-auto"
                                                placeholder="Search Branch..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="table-responsive" style={{ maxHeight: '220px', overflowY: 'auto' }}>
                                            <table className="table table-hover text-white">
                                                <thead>
                                                    <tr>
                                                        <th>Code</th>
                                                        <th>Branch Name</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    branches.length > 0
                                                        ? branches.slice(0,5).map((branch, index) => (
                                                            <tr key={index}>
                                                                <td>{branch.code}</td>
                                                                <td>{branch.name}</td>
                                                                <td>
                                                                    <button className="btn btn-sm btn-warning rounded-sm shadow border-0" onClick={() => editBranch(branch)}><i className="mdi mdi-pen" /></button>
                                                                    <button className="btn btn-sm btn-danger rounded-sm shadow border-0" onClick={() => deleteBranch(branch.id)}><i className="mdi mdi-trash-can" /></button>
                                                                </td>
                                                            </tr>
                                                        )) : 
                                                        <tr>
                                                            <td colSpan="4" className="text-center">
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
                {/* content-wrapper ends */}
                {/* partial:partials/_footer.html */}
                <footer className="footer fixed">
                    <Footer />
                </footer>
                {/* partial */}
                </div>
                {/* main-panel ends */}
            </div>
        {/* page-body-wrapper ends */}
        </div>
    )
}