import { useEffect, useState } from 'react'
import {Link} from 'react-router-dom'
import Cookies from 'js-cookie'
import api from '../../services/api'
import {toast, ToastContainer} from 'react-toastify'
import 'react-toastify/ReactToastify.css'

import Sidebar from '../../components/Sidebar'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'

export default function Employee() {

    const [employees, setEmployees] = useState([])
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const [allDepartments, setAllDepartments] = useState([]) 
    const [departments, setDepartments] = useState([])
    const [divisions, setDivisions] = useState([])
    const [searchQuery, setSearchQuery] = useState("")
    const [id, setId] = useState(null); 
    const [name, setName] = useState("")
    const [branchId, setBranchId] = useState("")
    const [divisionId, setDivisionId] = useState("")
    const [departmentId, setDepartmentId] = useState("")
    const [branches, setBranches] = useState([])
    const [message, setMessage] = useState("")
    const token = Cookies.get('token')

    const getCsrfToken = async () => {
        try {
            const res = await api.get('/api/csrf-token');
            return res.data.csrfToken;
        } catch (error) {
            console.error('Failed to get CSRF token', error);
            return null;
        }
    };

    
    const fetchDataEmployees = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/employees')
                setEmployees(response.data.data)
                setSelectedDepartment("all") // Pastikan state selectedDepartment direset ke "all"
            } catch(error) {
                console.error("there was an error fetching the employees", error)
            }
        } else {
            console.error("Token in not available")
        }
    }

    const fetchBranches = async () => {
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

    const fetchAllDepartments = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/departments')
                setAllDepartments(response.data.data)
            } catch (error) {
                console.error('Error fetching departments', error)
            }
        }
    }

    const filterByDepartment = (deptId) => {
        console.log("Filtering by department:", deptId)
        setSelectedDepartment(deptId);

        if (deptId === "all") {
            fetchDataEmployees();
        } else {
            api.defaults.headers.common['Authorization'] = token;
            api.get(`/api/admin/employees/department?department_id=${deptId}`)
                .then(response => {
                    setEmployees(response.data.data);
                })
                .catch(error => {
                    console.error('Error fetching employees by department', error);
                });
        }
    };

    useEffect(() => {
        fetchDataEmployees()
        fetchBranches()
        fetchAllDepartments()
    }, [])

    const searchEmployee = async() => {
        if(!searchQuery) {
            fetchDataEmployees()
            return
        }
        
        try {
            api.defaults.headers.common['Authorization'] = token
            const response = await api.get(`/api/admin/employees/search?query=${searchQuery}`)
            setEmployees(response.data.data)
        } catch (error) {
            console.error(error)
            alert("error fetching data")
        }
    }

    const handleBranchChange = async (e) => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const branchId = e.target.value
                setBranchId(branchId)

                const response = await api.get(`/api/admin/divisions/branch?branch=${branchId}`)
                setDivisions(response.data.data)
            } catch (error) {
                console.error('There was an error fetching division', error)
            }
        } else {
            console.error('Token is invalid')
        }
    }

    const handleDivisionChange = async (e) => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const divisionId = e.target.value
                setDivisionId(divisionId)

                const response = await api.get(`/api/admin/departments/division?division=${divisionId}`)
                setDepartments(response.data.data)
            } catch (error) {
                console.error('There was an error fetching department', error)
            }
        } else {
            console.error('Token is invalid')
        }
    }

    const resetForm = () => {
        setId(null)
        setName("")
        setBranchId("")
        setDivisionId([])
        setDepartmentId([])
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setMessage('')

        if(!name || !branchId) {
            setMessage("Name and Branch are required")
            return
        }

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

            api.defaults.headers.common['csrf-token'] = csrfToken
            api.defaults.headers.common['Authorization'] = token
            
            if (id) {
                await api.put(`/api/admin/employees/${id}`, { name, branchId, divisionId, departmentId });
                toast.success('Employee berhasil diperbarui!');
            } else {
                await api.post('/api/admin/employees', { name, branchId, divisionId, departmentId });
                toast.success('Employee berhasil ditambahkan!');
            }
            setId(null)
            setName("")
            setBranchId([])
            setDivisionId([])
            setDepartments([])
            fetchDataEmployees()
        } catch (error) {
            console.error(error)
            toast.error("Faild to create employee")
        }
    }

    const editEmployee = (employee) => {
        setId(employee.id)
        setName(employee.name)
        setBranchId(employee.branchId)
        setDivisionId(employee.divisionId)
        setDepartmentId(employee.departmentId);
    }

    const deleteEmployee = async (id) => {
        const csrfToken = await getCsrfToken()
        if(!window.confirm("Are you sure?")) {
            return
        }

        try {
            api.defaults.headers.common['Authorization'] = token
            api.defaults.headers.common['csrf-token'] = csrfToken
            await api.delete(`/api/admin/employees/${id}`)

            toast.success('Employee has been deleted')
            fetchDataEmployees()
        } catch (error) {
            console.error(error)
            toast.error("Faild to create employee")
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
                            <h3 className="page-title">Manage Employee</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dasboard</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Master Employee</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-md-8 grid-margin stretch-card px-1">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">{id ? "Edit Employee" : "Add Employee"}</h4>
                                        {message && (
                                            <div className={`alert ${message.includes("success") ? "alert-success" : "alert-danger"} mt-2`}>
                                                {message}
                                            </div>
                                        )}
                                        <form onSubmit={handleSubmit} className="form-sample mb-4">
                                            <div className="row">
                                                <div className="col-4">
                                                    <div className="form-group">
                                                        <label>Branch</label>
                                                        <select 
                                                            className="form-control form-control-sm text-white"
                                                            value={branchId}
                                                            onChange={handleBranchChange}
                                                        >
                                                        <option value="">Pilih Cabang</option>
                                                        {
                                                            branches.map(branch => (
                                                                <option key={branch.id} value={branch.id}>{branch.code}</option>
                                                            ))
                                                        } 
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-4">
                                                    <div className="form-group">
                                                        <label>Division</label>
                                                        <select 
                                                            className="form-control form-control-sm text-white"
                                                            value={divisionId}
                                                            onChange={handleDivisionChange}
                                                        >
                                                        <option value="">Pilih Divisi</option>
                                                        {
                                                            divisions.map(division => (
                                                                <option key={division.id} value={division.id}>{division.name}</option>
                                                            ))
                                                        } 
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="col-4">
                                                    <div className="form-group">
                                                        <label>Department</label>
                                                        <select 
                                                            className="form-control form-control-sm text-white"
                                                            value={departmentId}
                                                            onChange={(e) => setDepartmentId(e.target.value)}
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
                                            </div>
                                            
                                            <div className="form-group">
                                                <label>Employee Name</label>
                                                <input type="text" className="form-control text-white" placeholder="Nama Karyawan" value={name} onChange={(e) => setName(e.target.value)}></input>
                                            </div>
                                            <button type="submit" className="btn btn-primary mr-2">{id ? "Update" : "Save"}</button>
                                            <button type="button" className="btn btn-dark" onClick={resetForm}>Cancel</button>
                                        </form>
                                        <hr/>
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="card-title mb-0">List Karyawan</h4>
                                            <div className="d-flex">
                                               <select 
                                                    className="form-control mr-2 text-white" 
                                                    style={{ width: '150px' }}
                                                    value={selectedDepartment}
                                                    onChange={(e) => filterByDepartment(e.target.value)}
                                                    >
                                                    <option value="all">All Departments</option>
                                                    {allDepartments.map(dept => (
                                                        <option key={dept.id} value={dept.id}>
                                                        {dept.division?.name ? `${dept.name} - ${dept.division.name}` : dept.name}
                                                        </option>
                                                    ))}
                                                </select>

                                                <input 
                                                    type="text" 
                                                    className="form-control text-white" 
                                                    style={{width: '200px'}}
                                                    placeholder="Search.." 
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onKeyUp={(e) => e.key === 'Enter' && searchEmployee()}
                                                />
                                            </div>
                                        </div>
                                        <div className="table-responsive" style={{maxHeight: '220px', overflow: 'auto'}}>
                                            <table className="table table-hover text-white">
                                                <thead>
                                                    <tr>
                                                        <th>Nama</th>
                                                        <th>Dept.</th>
                                                        <th>Divisi</th>
                                                        <th>Cabang</th>
                                                        <th>Aksi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        employees.length > 0
                                                            ? employees.map((employee) => (
                                                                <tr key={employee.id}>
                                                                    <td>{employee.name}</td>
                                                                    <td>{employee.department?.name}</td>
                                                                    <td>{employee.division?.name}</td>
                                                                    <td>{employee.branch?.code || 'N/A'}</td>
                                                                    <td>
                                                                        <button className="btn btn-sm btn-warning" onClick={() => editEmployee(employee)}><i className="mdi mdi-pen" /></button>
                                                                        <button className="btn btn-sm btn-danger" onClick={() => deleteEmployee(employee.id)}><i className="mdi mdi-trash-can" /></button>
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