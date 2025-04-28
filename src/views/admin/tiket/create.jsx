import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import api from '../../../services/api';
import { useEffect, useState } from "react";
import Footer from "../../../components/Footer";

export default function CreateTicket() {
    const token = Cookies.get('token');
    const [user, setUser] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        employeeId: "",
        description: "",
        priority: "Medium",
        status: "Open",
    });

    useEffect(() => {
        fetchEmployees();
        const userData = Cookies.get('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            setUser(parsedUser);
            setFormData(prev => ({
                ...prev,
                reportedById: parsedUser.id
            }));
        }
    }, []);

    const fetchEmployees = async () => {
        try {
            if (token) {
                api.defaults.headers.common['Authorization'] = token;
                const res = await api.get('/api/admin/employees');
                setEmployees(res.data.data); // data harus sudah include division & department
            }
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim() === "") {
            setFilteredEmployees([]);
            return;
        }

        const filtered = employees.filter(emp =>
            `${emp.name} ${emp.division} ${emp.department}`
                .toLowerCase()
                .includes(value.toLowerCase())
        );
        setFilteredEmployees(filtered);
    };

    const handleSelectEmployee = (employee) => {
        // Pastikan hanya nama yang disimpan dalam searchTerm
        setSearchTerm(`${employee.name} - ${employee.division.name} - ${employee.department.name}`);
        setFormData(prev => ({
            ...prev,
            employeeId: employee.id
        }));
        setFilteredEmployees([]);
    };

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
        setFormData(prev => ({
            title: "",
            employeeId: "",
            description: "",
            priority: "Medium",
            status: "Open",
            reportedById: prev.reportedById,
        }));
        setSearchTerm("");
        setFilteredEmployees([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!token || !formData.employeeId) {
            toast.error("Pilih user terlebih dahulu!");
            return;
        }

        try {
            const csrfToken = await getCsrfToken();
            if (!csrfToken) return;

            api.defaults.headers.common['csrf-token'] = csrfToken;
            api.defaults.headers.common['Authorization'] = token;

            await api.post('/api/admin/tickets', formData);
            toast.success('Tiket berhasil dibuat');
            resetForm();
        } catch (error) {
            console.error("Error creating ticket:", error);
            toast.error('Gagal membuat tiket');
        }
    };

    return (
        <div className="container-scroller">
            <ToastContainer />
            <Sidebar />
            <div className="container-fluid page-body-wrapper">
                <Navbar />
                <div className="main-panel">
                    <div className="content-wrapper px-3 py-1">
                        <div className="page-header">
                            <h3 className="page-title">Create Tickets</h3>
                            <nav className="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item"><Link to="/admin/tickets">Tickets</Link></li>
                                    <li className="breadcrumb-item active">Create Ticket</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-9 grid-margin">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Create New Ticket</h4>
                                        <form onSubmit={handleSubmit} className="form-sample">
                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label>Title</label>
                                                        <input
                                                            type="text"
                                                            className="form-control text-white"
                                                            required
                                                            placeholder="Judul Laporan"
                                                            value={formData.title}
                                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label>Priority</label>
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
                                                <div className="col">
                                                    <div className="form-group ">
                                                        <label>User</label>
                                                        <input
                                                            type="text"
                                                            className="form-control text-white"
                                                            placeholder="Ketik nama user"
                                                            value={searchTerm}
                                                            onChange={handleSearchChange}
                                                            autoComplete="off"
                                                        />
                                                        {filteredEmployees.length > 0 && (
                                                            <ul
                                                                className="list-group position-absolute w-100 zindex-dropdown"
                                                                style={{
                                                                    zIndex: 9999,
                                                                    maxHeight: "200px",
                                                                    overflowY: "auto",
                                                                    backgroundColor: "#2c2c2c",
                                                                    border: "1px solid #444"
                                                                }}
                                                            >
                                                                {filteredEmployees.map(emp => (
                                                                    <li
                                                                        key={emp.id}
                                                                        className="list-group-item list-group-item-action text-white"
                                                                        style={{
                                                                            backgroundColor: "#2c2c2c",
                                                                            borderBottom: "1px solid #444",
                                                                            cursor: "pointer"
                                                                        }}
                                                                        onClick={() => handleSelectEmployee(emp)}
                                                                    >
                                                                        {emp.name} - {emp.division.name} - {emp.department.name} {/* Pastikan mengakses name dari division dan department */}
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        )}

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col">
                                                    <div className="form-group">
                                                        <label>Description</label>
                                                        <textarea
                                                            className="form-control text-white"
                                                            required
                                                            style={{ minHeight: "100px" }}
                                                            placeholder="Deskripsi Laporan"
                                                            value={formData.description}
                                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                        ></textarea>
                                                    </div>
                                                </div>
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
    );
}
