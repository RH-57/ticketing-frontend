import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import api from '../../../services/api'
import { useEffect, useState } from "react";
import Footer from "../../../components/Footer";


export default function Ticket() {
    const token = Cookies.get('token')
    const [tickets, setTickets] = useState([])
    const [searchQuery, setSearchQuery] = useState('')

    const formatLocalTime = (date) => {
        if (!date) return "Invalid";

        console.log("Raw Date:", date); // Debugging

        const dateTime = DateTime.fromISO(date, { zone: 'Asia/Jakarta' });

        if (!dateTime.isValid) {
            console.error("Invalid Date:", date);
            return "Invalid Date";
        }

        return dateTime.toFormat('dd MMM yyyy HH:mm');
    };

    const getCsrfToken = async() => {
        try {
            const response = await api.get('/api/csrf-token')
            return response.data.csrfToken
        } catch (error) {
            console.error('Error fetching CSRF Token: ', error)
            return null
        }
    }
    
    const fetchDataTicket = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/tickets')
                setTickets(response.data.data)
            } catch (error) {
                console.error('There was an error fetching data', error)
            }
        } else {
            console.error('Token is not available')
        }
    }

    useEffect(() => {
        fetchDataTicket()
    }, [])

    const searchTicket = async () => {
        if(!searchQuery) {
            fetchDataTicket()
            return
        }

        const csrfToken = await getCsrfToken()
        if(!csrfToken) {
            console.error('Failed to get CSRF Token')
            return
        }

        try {
            api.defaults.headers.common['Authorization'] = token
            api.defaults.headers.common['csrf-token'] = csrfToken
            const response = await api.get(`/api/admin/tickets/search?query=${searchQuery}`)
            setTickets(response.data.data)
        } catch (error) {
            console.error(error)
            toast.error('error fetching data')
        }
    }

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            searchTicket();
        }, 500); // Tunggu 500ms setelah user berhenti mengetik

        return () => clearTimeout(delayDebounce); // Bersihkan timeout jika user masih mengetik
    }, [searchQuery]);

    const deleteTicket = async (id) => {
        const csrfToken = await getCsrfToken()

        if(!window.confirm('Are you sure?!')) {
            return
        }

        try {
            api.defaults.headers.common['Authorization'] = token
            api.defaults.headers.common['csrf-token'] = csrfToken
            await api.delete(`/api/admin/tickets/${id}`)
            toast.success('Ticket has been deleted')
            fetchDataTicket()
        } catch (error) {
            console.error('Error deleting ticket:',error)
            toast.error('Error')
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
                            <h3 className="page-title">Manage Tickets</h3>
                            <nav className="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Tickets</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-12 grid-margin">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h4 className="card-title mb-0">List Tiket</h4>
                                            <Link className="btn btn-primary ml-3" to="/admin/tickets/create">Buat Tiket</Link>
                                            <input 
                                                type="text" 
                                                className="form-control w-50 ml-auto" 
                                                placeholder="Search Ticket"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                
                                             />
                                        </div>
                                        <div className="table-responsive" style={{maxHeight: '300px', overflow: 'auto'}} >
                                            <table className="table table-hover text-white">
                                                <thead>
                                                    <th>No. Tiket</th>
                                                    <th>Tgl.</th>
                                                    <th>Judul</th>
                                                    <th>Pelapor</th>
                                                    <th>Status</th>
                                                    <th>Aksi</th>
                                                </thead>
                                                <tbody>
                                                    {
                                                        tickets.length > 0
                                                            ? tickets.slice(0,10).map((ticket, index) => (
                                                                <tr key={index}>
                                                                    <td>
                                                                        <span className={`badge badge-pill font-weight-bold ${ticket.priority === "Critical" ? "badge-outline-danger" : ticket.priority === "High" ? "badge-outline-warning" : ticket.priority === "Medium" ? "badge-outline-success" : "badge-outline-primary"}`}>
                                                                            {ticket.ticketNumber}
                                                                        </span>
                                                                    </td>
                                                                    <td>{formatLocalTime(ticket.createdAt)}</td>
                                                                    <td>{ticket.title}</td>
                                                                    <td>{ticket.employee?.name}</td>
                                                                    <td>
                                                                        <span className={`badge badge-pill font-weight-bold ${ticket.status === "Open" ? "badge-outline-primary" : ticket.status === "In_Progress" ? "badge-outline-warning" : ticket.status === "Resolved" ? "badge-outline-success" : "badge-outline-dark"}`}>
                                                                            {ticket.status}
                                                                        </span>
                                                                    </td>
                                                                    <td>
                                                                        <Link to={`/admin/tickets/${ticket.ticketNumber}`} className="btn btn-sm btn-primary rounded-sm shadow border-0 mx-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Detail Ticket"><i className="mdi mdi-eye" /></Link>
                                                                        <button className="btn btn-sm btn-danger rounded-sm shadow border-0 me-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Delete Ticket" onClick={() => deleteTicket(ticket.id)}><i className="mdi mdi-trash-can" /></button>
                                                                    </td>
                                                                </tr>
                                                            )) : 
                                                            <tr>
                                                                <td colSpan="7" className="text-center">
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