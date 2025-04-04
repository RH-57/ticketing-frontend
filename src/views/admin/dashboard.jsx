import Sidebar from '../../components/Sidebar'
import Footer from '../../components/Footer'
import Navbar from '../../components/Navbar'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import api from '../../services/api'
import { DateTime } from 'luxon'
import { Link } from 'react-router-dom'
import ChartTicket from './components/chartTicket'
import ReportByType from './components/reportByType'
import MostActiveDepartment from './components/mostActiveDepartment'
import MostFreqTroubleComponents from './components/mostFreqTroubleComponents'


export default function Dashboard() {
    const token = Cookies.get('token')
    const [totalTickets, setTotalTickets] = useState('')
    const [totalTicketClosed, setTotalTicketClosed] = useState('')
    const [openTickets, setOpenTicket] = useState([])
    const [totalDivisions, setTotalDivisions] = useState('')
    const [totalBranches, setTotalBranches] = useState('')
    const [totalDepartments, setTotalDepartments] = useState('')
    const [percentage, setPercentage] = useState('')

    const formatLocalTime = (date) => {
        if (!date) return "Invalid"

        const dateTime = DateTime.fromISO(date, { zone: 'Asia/Jakarta' })

        if (!dateTime.isValid) {
            console.error("Invalid Date:", date)
            return "Invalid Date"
        }

        return dateTime.toFormat('dd MMM yyyy HH:mm')
    };

    const fetchTotalTicket = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/dashboards/total-tickets')
                setTotalTickets(response.data.data)
            } catch (error) {
                console.error(error)
            }
        }
    }

    const fetchTotalTicketClosed = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/dashboards/total-ticket-closed')
                setTotalTicketClosed(response.data.data)
            } catch(error) {
                console.error(error)
            }
        }
    }

    const fetchPercentage = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/dashboards/percentage-tickets')
                setPercentage(response.data.data)
            } catch (error) {
                console.error(error)
            }
        }
    }

    const fetchTotalBranches = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/dashboards/total-branches')
                setTotalBranches(response.data.data)
            } catch (error) {
                console.error(error)
            }
        }
    }

    const fetchTotalDivision = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/dashboards/total-divisions')
                setTotalDivisions(response.data.data)
            } catch (error) {
                console.error(error)
            }
        }
    }

    const fetchTotalDepartment = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/dashboards/total-departments')
                setTotalDepartments(response.data.data)
            } catch (error) {
                console.error(error)
            }
        }
    }

    const fetchOpenTicket = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/tickets/open-tickets')
                setOpenTicket(response.data.data)
            } catch (error) {
                console.error('Cannot fetch Open tickets', error)
            }
        }
    }

    

    useEffect(() => {
        fetchTotalTicket()
        fetchTotalTicketClosed()
        fetchOpenTicket()
        fetchTotalDivision()
        fetchTotalBranches()
        fetchTotalDepartment()
        fetchPercentage()

        const interval = setInterval(fetchOpenTicket, 10000)

        return () => clearInterval(interval)
    }, [])
    return (
        <div className="container-scroller">
        {/* partial:partials/_sidebar.html */}
        <Sidebar />
        {/* partial */}
            <div className="container-fluid page-body-wrapper">
                {/* partial:partials/_navbar.html */}
                <Navbar />
                {/* partial */}
                <div className="main-panel">
                    <div className="content-wrapper px-3 py-2">
                        <div className="row">
                            <div className="col-md-6 grid-margin stretch-card px-1 pt-0">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex flex-row justify-content-between">
                                            <h4 className="card-title mb-1">Tiket Terbaru</h4>
                                            <p className="text-muted mb-1">Daftar Tiket Yang Harus Diselesaikan</p>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="preview-list" style={{ maxHeight: "194px", overflowY: "auto", paddingRight: "10px"}}>
                                                {
                                                    openTickets.length > 0
                                                        ? openTickets.map((open) => (
                                                            <div className="preview-item border-bottom" key={open.id || open.ticketNumber}>
                                                                <div className="preview-thumbnail">
                                                                    <div className={`preview-icon ${open.priority === "Critical" ? "badge-outline-danger" : open.priority === "High" ? "badge-outline-warning" : open.priority === "Medium" ? "badge-outline-success" : "badge-outline-primary"}`}>
                                                                        {open.ticketNumber}
                                                                    </div>
                                                                </div>
                                                                <div className="preview-item-content d-sm-flex flex-grow">
                                                                    <div className="flex-grow">
                                                                        <h6 className="preview-subject">
                                                                            {open.title}
                                                                            <span className={`badge badge-pill font-weight-bold mx-1 p-1 text-xs ${open.status === "Open" ? "badge-outline-primary" : open.status === "In_Progress" ? "badge-outline-warning" : open.status === "Resolved" ? "badge-outline-success" : "badge-outline-dark"}`}>
                                                                                {open.status}
                                                                            </span>
                                                                        </h6>
                                                                        <p className="text-muted mb-0">
                                                                            {formatLocalTime(open.createdAt)} | {open.employee?.name}
                                                                        </p>
                                                                    </div>
                                                                    <div className="mr-auto text-sm-right pt-2 pt-sm-0">
                                                                        <Link to={`/admin/tickets/${open.ticketNumber}`}>Detail</Link>
                                                                        
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )) : 
                                                            <div className="alert alert-success mb-0 mt-3">
                                                                Belum ada tiket baru !
                                                            </div>
                                                }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> 
                            <div className="col-md-6">
                                <div className="wrapper">
                                    <div className="row">
                                        <div className="col-md-4 col-sm-6 grid-margin stretch-card px-1">
                                            <div className="card">
                                                <div className="card-body" 
                                                    style={{
                                                        background: "linear-gradient(to right, #007bff, #6610f2)",
                                                        color: "white",
                                                    }}>
                                                    <div className="row">
                                                        <div className="col-8">
                                                            <div className="d-flex align-items-center align-self-start">
                                                                <h1 className="mb-0">{totalBranches}</h1>
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="icon icon-box-secondary">
                                                                <span className="mdi mdi-source-branch icon-item" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h6 className="text-white font-weight-bold">
                                                        Cabang
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-6 grid-margin stretch-card px-1 pt-0">
                                            <div className="card">
                                                <div 
                                                    className="card-body"
                                                    style={{
                                                        background: "linear-gradient(to right, #FC2821, #FC4E40)",
                                                        color: "white",
                                                    }}>
                                                    <div className="row">
                                                        <div className="col-8">
                                                            <div className="d-flex align-items-center align-self-start">
                                                            <h1 className="mb-0">{totalDivisions}</h1>
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="icon icon-box-secondary">
                                                            <span className="mdi mdi-store icon-item" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h6 className="text-white font-weight-bold">
                                                        Divisi
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-6 grid-margin stretch-card px-1 pt-0">
                                            <div className="card">
                                                <div 
                                                    className="card-body"
                                                    style={{
                                                        background: "linear-gradient(to right, #C64CAF, #CF66B1)",
                                                        color: "white",
                                                    }}>
                                                    <div className="row">
                                                        <div className="col-8">
                                                            <div className="d-flex align-items-center align-self-start">
                                                            <h1 className="mb-0">{totalDepartments}</h1>
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="icon icon-box-secondary ">
                                                            <span className="mdi mdi-account-group icon-item" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h6 className="text-white font-weight-bold">
                                                        Departemen
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="wrapper">
                                    <div className="row">
                                        <div className="col-md-4 col-sm-6 grid-margin stretch-card px-1">
                                            <div className="card">
                                                <div 
                                                    className="card-body"
                                                    style={{
                                                        background: "linear-gradient(to right, #1A4C5B, #64807B)",
                                                        color: "white",
                                                    }}>
                                                    <div className="row">
                                                        <div className="col-8">
                                                            <div className="d-flex align-items-center align-self-start">
                                                            <h1 className="mb-0"><strong>{percentage}</strong></h1>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h6 className="text-white font-weight-bold">
                                                        Terselesaikan
                                                    </h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4 col-sm-6 grid-margin stretch-card px-1 pt-0">
                                            <div className="card">
                                                <div 
                                                    className="card-body"
                                                    style={{
                                                        background: "linear-gradient(to right,rgb(36, 155, 7),rgb(80, 184, 46))",
                                                        color: "white",
                                                    }}>
                                                    <div className="row">
                                                        <div className="col-8">
                                                            <div className="d-flex align-items-center align-self-start">
                                                            <h1 className="mb-0">{totalTickets}</h1>
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="icon icon-box-secondary ">
                                                                <span className="mdi mdi-ticket-confirmation icon-item" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h6 className="text-white font-weight-bold">
                                                        Total Tiket
                                                    </h6>
                                                </div>
                                            </div>                                                                                
                                        </div>
                                        <div className="col-md-4 col-sm-6 grid-margin stretch-card px-1 pt-0">
                                            <div className="card">
                                                <div 
                                                    className="card-body"
                                                    style={{
                                                        background: "linear-gradient(to right,rgb(43, 43, 43),rgb(110, 110, 110))",
                                                        color: "white",
                                                    }}>
                                                    <div className="row">
                                                        <div className="col-8">
                                                            <div className="d-flex align-items-center align-self-start">
                                                            <h1 className="mb-0">{totalTicketClosed}</h1>
                                                            </div>
                                                        </div>
                                                        <div className="col-3">
                                                            <div className="icon icon-box-secondary ">
                                                                <span className="mdi mdi-thumb-up-outline icon-item" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <h6 className="text-white font-weight-bold">
                                                        Tiket Ditutup
                                                    </h6>
                                                </div>
                                            </div>                                                                                
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="wrapper">
                            <div className="row">
                                <div className="col-md-4 grid-margin stretch-card px-1 py-0">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex flex-row justify-content-between">
                                                <h4 className="card-title mb-1">Trend</h4>
                                                <Link to="/admin/detail-trend">Detail</Link>
                                            </div>
                                            <div className="row d-flex justify-content-center ">
                                                <div className="col-12">
                                                    <ChartTicket />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 grid-margin stretch-card px-1 py-0">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex flex-row justify-content-between">
                                                <h4 className="card-title mb-1">Klasifikasi Masalah</h4>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <ReportByType />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 grid-margin stretch-card px-1 pt-0">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex flex-row justify-content-between">
                                                <h4 className="card-title mb-1">Departemen Paling Aktif</h4>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <MostActiveDepartment />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4 grid-margin stretch-card px-1 pt-0">
                                    <div className="card">
                                        <div className="card-body">
                                            <div className="d-flex flex-row justify-content-between">
                                                <h4 className="card-title mb-1">Komponen Sering Rusak</h4>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <MostFreqTroubleComponents />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/* content-wrapper ends */}
                    </div>
                    {/* partial:partials/_footer.html */}
                    <footer className="footer">
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