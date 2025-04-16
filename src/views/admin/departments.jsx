import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Cookies from "js-cookie";
import api from "../../services/api";
import { useEffect, useState } from "react";

export default function Department() {

    const token = Cookies.get('token')
    const [departments, setDepartments] = useState([])
    const [branches, setBranches] = useState([])
    const [divisions, setDivisions] = useState([])
    const [message, setMessage] = useState("")
    const [id, setId] = useState(null); 
    const [name, setName] = useState("")
    const [branchId, setBranchId] = useState("")
    const [divisionId, setDivisionId] = useState("")
    const [searchQuery, setSearchQuery] = useState('')
    const [formData, setFormData] = useState({
            name: "",
            branchId: "",
            divisionId: "",
    })
    
    const getCsrfToken = async () => {
        try {
            const res = await api.get('/api/csrf-token');
            return res.data.csrfToken;
        } catch (error) {
            console.error('Failed to get CSRF token', error);
            return null;
        }
    };

    const fetchDataDepartment = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/departments')
                setDepartments(response.data.data)
            } catch (error) {
                console.error(error)
            }
        }
    }

    const handleBranchChange = async (e) => {
        const branchId = e.target.value;
        setBranchId(branchId); 
        setDivisionId(""); // Reset divisionId saat cabang berubah
        setFormData((prev) => ({ ...prev, branchId, divisionId: "" }));
    
        if (token) {
            api.defaults.headers.common["Authorization"] = token;
            try {
                const response = await api.get(`/api/admin/divisions/branch?branch=${branchId}`);
                setDivisions(response.data.data);
            } catch (error) {
                console.error("There was an error fetching Division", error);
            }
        } else {
            console.error("Token is invalid");
        }
    };

    const fetchDataBranch = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/branches')
                setBranches(response.data.data)
            } catch (error) {
                console.error(error)
            }
        }
    }

    useEffect(() => {
        fetchDataDepartment()
        fetchDataBranch()
    }, [])

    const searchDepartment = async() => {
        if(!searchQuery) {
            fetchDataDepartment()
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
            const response = await api.get(`/api/admin/departments/search?query=${searchQuery}`)
            setDepartments(response.data.data)
        } catch (error) {
            console.error(error)
            alert('error feacthing data')
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            searchDepartment();
        }, 500); // Tunggu 500ms setelah user berhenti mengetik

        return () => clearTimeout(delayDebounce); // Bersihkan timeout jika user masih mengetik
    }, [searchQuery]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')

        if(!name || !branchId || !divisionId) {
            setMessage("Nama Departemen ,Divisi dan Cabang Harus Diisi")
            return
        }

        if(!token) {
            console.error('TOken not found')
            return
        }

        try {
            const csrfToken = await getCsrfToken()

            if(!csrfToken) {
                console.error('Failed to get csrf token')
                return
            }

            api.defaults.headers.common['csrf-token'] = csrfToken
            api.defaults.headers.common['Authorization'] = token

            if(id) {
                await api.put(`/api/admin/departments/${id}`, {name, branchId, divisionId})
                toast.success('Department berhasil diperbarui')
            } else {
                await api.post('/api/admin/departments', {name, branchId, divisionId})
                toast.success('Department berhasil dibuat')
            }
            setId(null)
            setName('')
            setBranchId('')
            setDivisionId('')
            fetchDataDepartment()
        } catch (error) {
            console.error(error)
            toast.error('Gagal membuat departemen baru')
        }
    }

    const editDepartment = (department) => {
        setId(department.id)
        setName(department.name)
        setBranchId(department.branchId || "")
        setDivisionId(department.divisionId || "")
    }

    const deleteDepartment = async (id) => {
        const csrfToken = await getCsrfToken()
        if(!window.confirm("Are you sure?!")) {
            return
        }

        try {
            api.defaults.headers.common['Authorization'] = token
            api.defaults.headers.common['csrf-token'] = csrfToken
            await api.delete(`/api/admin/departments/${id}`)
            toast.success('Departemen berhasil dihapus')
            fetchDataDepartment()
        } catch (error) {
            console.error(error)
            toast.error('Gagal menghapus departemen')
        }
    }
    return (
        <div className="container-scroller">
            <ToastContainer />
            <Sidebar />
            <div className="container-fluid page-body-wrapper">
                <Navbar />
                <div className="main-panel">
                    <div className="content-wrapper">
                        <div className="page-header">
                            <h3 className="page-title">Manage Department</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dasboard</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Master Department</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-md-8 grid-margin stretch-card px-1">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{id ? "Edit Departement" : "Add Department"}</h4>
                                        {message && (
                                            <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"} mt-2`}>
                                                {message}
                                            </div>
                                        )}
                                        <form onSubmit={handleSubmit} className="form-sample">                                            
                                            <div className="form-group row">
                                                <label className="col-md-3 col-form-label">Branch</label>
                                                <div className="col-md-8">
                                                    <select className="form-control" value={branchId} onChange={handleBranchChange}>
                                                        <option value="">Pilih Cabang</option>
                                                        {
                                                            branches.map(branch => (
                                                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>                                                                                
                                            <div className="form-group row">
                                                <label className="col-md-3 col-form-label">Division</label>
                                                <div className="col-md-8">
                                                    <select className="form-control" 
                                                        value={divisionId} 
                                                        onChange={(e) => {
                                                            setDivisionId(e.target.value);
                                                            setFormData({ ...formData, divisionId: e.target.value });
                                                        }}>
                                                        <option value="">Pilih Divisi</option>
                                                        {
                                                            divisions.map(division => (
                                                                <option key={division.id} value={division.id}>{division.name}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>                                            
                                            <div className="form-group row">
                                                <label className="col-md-3 col-form-label">Department</label>
                                                <div className="col-md-8">
                                                    <input className="form-control" placeholder="Nama Departemen" required value={name} onChange={(e) => setName(e.target.value)}></input>
                                                </div>                        
                                            </div>        
                                            <button type="submit" className="btn btn-primary mr-2">{id ? "Edit" : "Save"}</button>
                                            <button type="button" className="btn btn-dark" onClick={() => {
                                                setId(null)
                                                setName('')
                                                setBranchId('')
                                                setDivisionId('')
                                            }}>Cancel</button>
                                        </form>
                                        <hr/>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="card-title mb-0">List Departemen</h4>
                                            <input
                                                type="text" 
                                                className="form-control w-50 ml-auto" 
                                                placeholder="Search.." 
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                            />
                                        </div>
                                        <div className="table-responsive" style={{maxHeight: '220px', overflow: 'auto'}}>
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>Nama</th>
                                                        <th>Divisi</th>
                                                        <th>Cabang</th>
                                                        <th>Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        departments.length > 0
                                                            ? departments.map((department) => (
                                                                <tr key={department.id}>
                                                                    <td>{department.name}</td>
                                                                    <td>{department.division?.name}</td>
                                                                    <td>{department.branch?.code}</td>
                                                                    <td>
                                                                        <button className="btn btn-sm btn-warning" onClick={() => editDepartment(department)} ><i className="mdi mdi-pen" /></button>
                                                                        <button className="btn btn-sm btn-danger" onClick={() => deleteDepartment(department.id)}><i className="mdi mdi-trash-can" /></button>
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
                    <footer className="footer fixed">
                        <Footer />
                    </footer>
                </div>
            </div>
        </div>
    )
}