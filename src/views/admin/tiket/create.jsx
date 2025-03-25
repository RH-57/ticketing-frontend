import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import api from '../../../services/api'
import { useEffect, useState } from "react";
import Footer from "../../../components/Footer";



export default function CreateTicket() {
    const token = Cookies.get('token')
    const [user, setUser] = useState([])
    const [branches, setBranches] = useState([])
    const [divisions, setDivisions] = useState([])
    const [departments, setDepartments] = useState([])
    const [employees, setEmployees] = useState([])
    const [formData, setFormData] = useState({
        title: "",
        branchId: "",
        divisionId: "",
        departmentId: "",
        employeeId: "",
        description: "",
        priority: "Medium",
        status: "Open",
    })
    const [validation, setValidation] = useState([])
    const [message, setMessage] = useState("")

    useEffect(() => {
        fetchBranch()
        const userData = Cookies.get('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setFormData(prevFormData => ({
                ...prevFormData,
                reportedById: parsedUser.id // Set user.id to formData
            }));
        }
    }, [])

    const fetchBranch = async () => {
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

    const handleBranchChange = async (e) => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const branchId = e.target.value
                setFormData({
                    ...formData,
                    branchId,
                    divisionId: "",                    
                    departmentId: "",
                    employeeId: "",
                })
                setDivisions([]); // Reset Divisions
                setDepartments([]); // Reset Departments
                setEmployees([]);

                const response = await api.get(`/api/admin/divisions/branch?branch=${branchId}`)
                setDivisions(response.data.data)
            } catch(error) {
                console.error("There was an error fetching Division", error)
            }
        } else {
            console.error("Token is invalid")
        }
    }

    const handleDivisionChange = async (e) => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const divisionId = e.target.value
                setFormData({
                    ...formData,
                    divisionId,
                    departmentId: "",
                    employeeId: "",
                })
                setDepartments([]); // Reset Departments
                setEmployees([]);

                const response = await api.get(`/api/admin/departments/division?division=${divisionId}`)
                setDepartments(response.data.data)
            } catch(error) {
                console.error("There was an error fetching Department", error)
            }
        } else {
            console.error("Token is invalid")
        }
    }

    const handleDepartmentChange = async (e) => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const departmentId = e.target.value
                setFormData({
                    ...formData,
                    departmentId,
                    employeeId: "",
                })

                const response = await api.get(`/api/admin/employees/department?department=${departmentId}`)
                setEmployees(response.data.data)
            } catch(error) {
                console.error("There was an error fetching Employee", error)
            }
        } else {
            console.error("Token is invalid")
        }
    }

    const getCsrfToken = async () => {
        try {
            const res = await api.get('/api/csrf-token');
            return res.data.csrfToken;
        } catch (error) {
            console.error('Failed to get CSRF token', error);
            return null;
        }
    };

    const resetForm = () => {
        setFormData({
            title: "",
            branchId: "",
            divisionId: "",
            departmentId: "",
            employeeId: "",
            description: "",
            priority: "Medium",
            status: "Open",
        });
        setDivisions([]); // Reset divisions
        setDepartments([]); // Reset departments
        setEmployees([]);
        setValidation({})
    };

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage("")

        if(!formData) {
            setMessage("Please fill required fields")
            return
        }

        if(!token) {
            console.error("Token not found")
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

            await api.post('/api/admin/tickets', formData)
            toast.success('New Ticket has been created')
            resetForm()
        } catch (error) {
            console.error(error)
            toast.error('Failed to create ticket')
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
                            <h3 className="page-title">Kelola Tiket</h3>
                            <nav className="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><Link to="/admin/tickets">Tickets</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Create Ticket</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-12 grid-margin">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="card-title mb-0">Buat Tiket Baru</h4>
                                            {
                                                validation.errors && (
                                                    <div className="alert alert-danger mt-2 pb-0">
                                                        {validation.errors.map((error, index) => (
                                                            <p key={index}>{error.path}:{error.msg}</p>
                                                        ))}
                                                    </div>
                                                )
                                            }
                                        </div>
                                        <form onSubmit={handleSubmit} className="form-sample">
                                            <div className="row">
                                                <div className="col-6">
                                                    <div className="form-group">
                                                        <label>Judul</label>
                                                        <input type="text" className="form-control text-white" required placeholder="Judul Laporan"
                                                        value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}></input>
                                                    </div>
                                                </div>
                                                <div className="col-3">
                                                    <div className="form-group">
                                                        <label>Prioritas</label>
                                                        <select 
                                                            className="form-control text-white" 
                                                            required
                                                            value={formData.priority}
                                                            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                                        >
                                                            <option value="">Pilih Prioritas</option>
                                                            <option value="Low">Low</option>
                                                            <option value="Medium">Medium</option>
                                                            <option value="High">High</option>
                                                            <option value="Critical">Critical</option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-3">
                                                    <div className="form-group">
                                                        <label>Cabang</label>
                                                        <select className="form-control text-white" required onChange={handleBranchChange} value={formData.branchId}>
                                                            <option value="">Pilih Cabang</option>
                                                            {branches.map((branch) => (
                                                                <option key={branch.id} value={branch.id}>{branch.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-3">
                                                    <div className="form-group">
                                                        <label>Divisi</label>
                                                        <select className="form-control text-white" required onChange={handleDivisionChange} value={formData.divisionId}>
                                                            <option value="">Pilih Divisi</option>
                                                            {divisions.map((division) => (
                                                                <option key={division.id} value={division.id}>{division.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-3">
                                                    <div className="form-group">
                                                        <label>Departemen</label>
                                                        <select 
                                                            className="form-control text-white"
                                                            value={formData.departmentId}
                                                            onChange={handleDepartmentChange}
                                                        >
                                                        <option value="">Pilih Departemen</option>
                                                        {
                                                            departments.map(department => (
                                                                <option key={department.id} value={department.id}>{department.name}</option>
                                                            ))
                                                        } 
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-3">
                                                    <div className="form-group">
                                                        <label>User</label>
                                                        <select className="form-control text-white" required value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}> 
                                                            <option value="">Pilih User</option>
                                                            {employees.map((employee) => (
                                                                <option key={employee.id} value={employee.id}>{employee.name}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Deskripsi</label>
                                                <textarea type="text" className="form-control text-white" required placeholder="Deskripsi Laporan" style={{ minHeight: "100px"}}
                                                 value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}></textarea>
                                            </div>
                                            <button type="submit" className="btn btn-primary mx-2">Create</button>
                                            <button type="button" className="btn btn-dark" onClick={resetForm}>Cancel</button>
                                        </form>
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