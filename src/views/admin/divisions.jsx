import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Division() {

    const token = Cookies.get('token')
    const [divisions, setDivisions] = useState([])
    const [branches, setBranches] = useState([])
    const [message, setMessage] = useState('')
    const [id, setId] = useState(null)
    const [name, setName] = useState('')
    const [branchId, setBranchId] = useState('')
    const [searchQuery, setSearchQuery] = useState('')

    const getCsrfToken = async () => {
        try {
            const res = await api.get('/api/csrf-token');
            return res.data.csrfToken;
        } catch (error) {
            console.error('Failed to get CSRF token', error);
            return null;
        }
    }

    const fetchDataDivision = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/divisions')
                setDivisions(response.data.data)
            } catch (error) {
                console.error(error)
            }
        }
    }

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
        fetchDataDivision()
        fetchDataBranch()
    }, [])

    const searchDivision = async () => {
        if(!searchQuery) {
            fetchDataDivision()
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
            const response = await api.get(`/api/admin/divisions/search?query=${searchQuery}`)
            setDivisions(response.data.data)
        } catch (error) {
            console.error(error)
            alert('error feacthing data')
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            searchDivision();
        }, 500); // Tunggu 500ms setelah user berhenti mengetik

        return () => clearTimeout(delayDebounce); // Bersihkan timeout jika user masih mengetik
    }, [searchQuery]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')

        if(!name || !branchId) {
            setMessage("Nama Divisi dan Cabang Harus Diisi")
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
                await api.put(`/api/admin/divisions/${id}`, {name, branchId})
                toast.success('Divisi berhasil diperbarui')
            } else {
                await api.post('/api/admin/divisions', {name, branchId})
                toast.success('Divisi berhasil dibuat')
            }
            setId(null)
            setName('')
            setBranchId('')
            fetchDataDivision()
        } catch (error) {
            console.error(error)
            toast.error('Gagal membuat divisi baru')
        }
    }

    const editDivision = (division) => {
        setId(division.id)
        setName(division.name)
        setBranchId(division.branchId || "")
    }

    const deleteDivision = async (id) => {
            const csrfToken = await getCsrfToken()
            if(!window.confirm("Are you sure?!")) {
                return
            }
    
            try {
                api.defaults.headers.common['Authorization'] = token
                api.defaults.headers.common['csrf-token'] = csrfToken
                await api.delete(`/api/admin/divisions/${id}`)
                toast.success('Divisi berhasil dihapus')
                fetchDataDivision()
            } catch (error) {
                console.error(error)
                toast.error('Gagal menghapus divisi')
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
                            <h1 className="page-title">Manage Divisi</h1>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dasboard</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Division</li>
                                </ol>
                            </nav>                            
                        </div>
                        <div className="row">
                            <div className="col-lg-6 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{id ? "Edit Divisi" : "Tambah Divisi"}</h4>
                                        {message && (
                                            <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"} mt-2`}>
                                                {message}
                                            </div>
                                        )}
                                        <form onSubmit={handleSubmit} className="form-sample">
                                            <div className="form-group">
                                                <label>Nama Cabang</label>
                                                <select className="form-control" value={branchId} onChange={(e) => setBranchId(e.target.value)}>
                                                    <option value="">Pilih Cabang</option>
                                                    {
                                                        branches.map(branch => (
                                                            <option key={branch.id} value={branch.id}>{branch.code}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Nama Divisi</label>
                                                <input className="form-control" placeholder="Nama Divisi" required value={name} onChange={(e) => setName(e.target.value)}></input>
                                            </div>
                                            <button type="submit" className="btn btn-primary mr-2">{id ? "Edit" : "Simpan"}</button>
                                            <button type="button" className="btn btn-dark" onClick={() => {
                                                setId(null)
                                                setName('')
                                                setBranchId('')
                                            }}>Cancel</button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="card-title mb-0">List Divisi</h4>
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
                                                        <th>Cabang</th>
                                                        <th>Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        divisions.length > 0
                                                            ? divisions.map((division) => (
                                                                <tr key={division.id}>
                                                                    <td>{division.name}</td>
                                                                    <td>{division.branch?.code}</td>
                                                                    <td>
                                                                        <button className="btn btn-sm btn-warning" onClick={() => editDivision(division)} ><i className="mdi mdi-pen" /></button>
                                                                        <button className="btn btn-sm btn-danger" onClick={() => deleteDivision(division.id)}><i className="mdi mdi-trash-can" /></button>
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