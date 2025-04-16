import { toast, ToastContainer } from "react-toastify";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Link, useParams } from "react-router-dom";
import Cookies from "js-cookie";
import api from '../../../services/api'
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import Footer from "../../../components/Footer";

export default function DetailTicket() {
    const {ticketNumber} = useParams()
    const token = Cookies.get('token')
    const [ticket, setTicket] = useState(null)
    const [loading, setLoading] = useState(false)
    const [showCommentForm, setShowCommentForm] = useState(false)
    const [comment, setComment] = useState({type: 'Malfunction', description: ''})
    const [commentSubmited, setCommentSubmited] = useState(false)
    const [user, setUser] = useState([])
    const [categories, setCategories] = useState([])
    const [subCategories, setSubCategories] = useState([])
    const [subSubCategories, setSubSubCategories] = useState([])

    const formatLocalTime = (date) => {
        if (!date) return "Invalid";

        console.log("Raw Date:", date); // Debugging

        const dateTime = DateTime.fromISO(date, { zone: 'Asia/Jakarta' });

        if (!dateTime.isValid) {
            console.error("Invalid Date:", date);
            return "Invalid Date";
        }

        return dateTime.toFormat('dd MMMM yyyy HH:mm');
    };

    const getCsrfToken = async () => {
        try {
            const res = await api.get('/api/csrf-token');
            api.defaults.headers.common["csrf-token"] = res.data.csrfToken;
            return res.data.csrfToken;
        } catch (error) {
            console.error("Failed to get CSRF token", error);
            return null;
        }
    }

    const fetchCategories = async () => {
            if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/categories')
                setCategories(response.data.data)
            } catch (error) {
                console.error("There was an error fetching the categories!", error)
            }
        }
    }
    const handleCategoryChange = async (e) => {
        if (token) {
            api.defaults.headers.common["Authorization"] = token;
            try {
                const categoryId = e.target.value;
                setComment((prev) => ({
                    ...prev,
                    categoryId,
                    subCategoryId: "",
                    subSubCategoryId: "",
                }));
                const response = await api.get(`/api/admin/categories/${categoryId}/sub-categories`);
                setSubCategories(response.data.data);
                setSubSubCategories([]);
            } catch (error) {
                console.error("There was an error fetching the sub-categories!", error);
            }
        } else {
            console.error("Token is not available");
        }
    };
    
    const handleSubCategoryChange = async (e) => {
        if (token) {
            api.defaults.headers.common["Authorization"] = token;
            try {
                const subCategoryId = e.target.value;
                setComment((prev) => ({
                    ...prev,
                    subCategoryId,
                    subSubCategoryId: "",
                }));
                const response = await api.get(`/api/admin/sub-categories/${subCategoryId}/sub-sub-categories`);
                setSubSubCategories(response.data.data);
            } catch (error) {
                console.error("There was an error fetching Sub-Sub-Categories", error);
            }
        } else {
            console.error("Token is not available");
        }
    };

    const fetchUser = async () => {
        const csrfToken = await getCsrfToken()

        if(token) {
            api.defaults.headers.common['Authorization'] = token
            api.defaults.headers.common['csrf-token'] = csrfToken
            try {
                const response = await api.get('/api/admin/users')
                console.log('List User: ', response.data)
                setUser(response.data.data)
            } catch (error) {
                console.error('There was an error fetching User', error)
            }
        }
    }

    const fetchDetailTicket = async () => {
        
        const csrfToken = await getCsrfToken()

        if(token) {
            api.defaults.headers.common['Authorization'] = token
            api.defaults.headers.common['csrf-token'] = csrfToken
            try {
                
                const response = await api.get(`/api/admin/tickets/${ticketNumber}`)
                console.log("Detail Ticket Response:", response.data)
                setTicket(response.data.data)
            } catch (error) {
                console.error('There was an error fetching Ticket', error)
            }
        }
    }

    const updateTicketStatus = async (newStatus) => {
        if (!ticket) return

        setLoading(true)
        try {
            const csrfToken = await getCsrfToken();
            api.defaults.headers.common["csrf-token"] = csrfToken;
            api.defaults.headers.common['Authorization'] = token
            const response = await api.patch(`/api/admin/tickets/${ticketNumber}/status`, {
                status: newStatus
            })

            setTicket((prev) => (
                {
                    ...prev,
                    status: newStatus
                }
            ))
            console.log("Status Updated:", response.data)
            toast.success(`${newStatus}`)

        } catch (error) {
            console.error('Error', error)
            toast.error('Error mengubah status')
        }

        if(newStatus === "Resolved") {
            setShowCommentForm(true)
            localStorage.setItem(`showCommentForm_${ticketNumber}`, "true")
        }

        setLoading(false)
    }

    const submitComment = async () => {
        setLoading(true);
    
        if (!comment.type || !comment.description || !comment.userId || !comment.categoryId || !comment.subCategoryId || !comment.subSubCategoryId) {
            toast.error("Semua field harus diisi!");
            setLoading(false);
            return;
        }
    
        const csrfToken = await getCsrfToken();
    
        try {
            api.defaults.headers.common["csrf-token"] = csrfToken;
            api.defaults.headers.common["Authorization"] = token;
            await api.post("/api/admin/comments", {
                ticketId: ticket.id,
                userId: comment.userId,
                type: comment.type,
                description: comment.description,
                categoryId: comment.categoryId,
                subCategoryId: comment.subCategoryId,
                subSubCategoryId: comment.subSubCategoryId,
            });
    
            toast.success("Komentar berhasil ditambahkan");
            setCommentSubmited(true);
            setShowCommentForm(false);
            fetchComment();
        } catch (error) {
            console.error("Error submit komentar", error.response?.data);
            toast.error(error.response?.data?.message || "Error");
        }
        setLoading(false);
    };

    const fetchComment = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get(`/api/admin/comments/${ticket.id}`)
                console.log(response.data.data)
                setComment(response.data.data)

                if(response.data.data.length > 0) {
                    setCommentSubmited(true)
                    setShowCommentForm(false)
                }
            } catch (error) {
                console.error('Error fetching comment: ', error)
            }
        }
    }

    useEffect(() => {
        fetchDetailTicket();
        fetchUser()
        fetchCategories()
    }, [ticketNumber]);

    useEffect(() => {
        if (ticket?.status === "Resolved") {
            setShowCommentForm(true);
        }
        fetchComment();
    }, [ticket?.status]);
    
    if (!ticket) return <p>Loading...</p>;

    const getButton = () => {
        switch (ticket.status) {
            case "Open":
                return <button className="btn btn-success font-weight-bold text-white" onClick={() => updateTicketStatus("In_Progress")} disabled={loading}>Kerjakan</button>
            case "In_Progress":
                return <button className="btn btn-primary font-weight-bold text-white" onClick={() => updateTicketStatus("Resolved")} disabled={loading}>Selesai</button>
            case "Resolved":
                return <button className="btn btn-danger font-weight-bold text-white" onClick={() => updateTicketStatus("Closed")} disabled={!commentSubmited || loading}>Tutup Tiket</button>
            default:
                return null
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
                        {/* Header & Breadcrumb */}
                        <div className="page-header">
                            <h3 className="page-title">Detail Ticket</h3>
                            <nav className="breadcrumb">
                                <ol className="breadcrumb">
                                <li className="breadcrumb-item"><Link to="/admin/dashboard">Dashboard</Link></li>
                                <li className="breadcrumb-item"><Link to="/admin/tickets">Tickets</Link></li>
                                <li className="breadcrumb-item active">Detail Ticket</li>
                                </ol>
                            </nav>
                        </div>

                        {/* Ticket Info */}
                        <div className="row">
                            <div className="col-12">
                                <div className="card">
                                    <div className="card-body">
                                        {/* Header Ticket */}
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <div>
                                                <h3 className="card-title">
                                                Nomor Tiket:{" "}
                                                <mark className={`font-weight-bold ${ticket.priority === "Critical" ? "bg-danger" : ticket.priority === "High" ? "bg-warning" : ticket.priority === "Medium" ? "bg-success" : "bg-primary"}`}>
                                                    #{ticket.ticketNumber || "Loading..."}
                                                </mark>
                                                </h3>
                                                <small className="text-muted">
                                                Issued: {ticket.user?.name} - {formatLocalTime(ticket.createdAt)}
                                                </small>
                                            </div>
                                            {getButton()}
                                        </div>

                                        <hr />

                                        {/* Detail Ticket */}
                                        <div className="mb-4">
                                            <h4>{ticket.title}</h4>
                                            <small className="text-muted d-block mb-2">
                                                {ticket.employee?.name} - {ticket.department?.name} - {ticket.division?.name} - {ticket.branch?.code}
                                            </small>
                                            <p>{ticket.description}</p>
                                        </div>

                                        <hr />

                                        {/* Pemecahan Masalah */}
                                        <div className="mb-4">
                                            <h4 className="mb-3">Pemecahan Masalah</h4>
                                            {comment.length > 0 ? (
                                                <div className="list-group">
                                                {comment.map((cmt, index) => (
                                                    <div key={index} className="mb-3 p-3 border rounded">
                                                    <p className="mb-1 text-muted">Solusi:</p>
                                                    <p className="fw-bold">{cmt.description}</p>
                                                    <p className="mb-1">
                                                        <span className="badge bg-primary rounded-pill text-white">{cmt.type}</span>
                                                    </p>
                                                    <p className="text-muted mb-1">
                                                        <strong>Category:</strong> {cmt.subSubCategory?.name} / {cmt.subCategory?.name} / {cmt.category?.name}
                                                    </p>
                                                    <p className="text-muted mb-1">
                                                        <strong>Selesai Pada:</strong> {formatLocalTime(cmt.createdAt)}
                                                    </p>
                                                    <p className="text-muted mb-1">
                                                        <strong>By:</strong> {cmt.user?.name}
                                                    </p>
                                                    </div>
                                                ))}
                                                </div>
                                            ) : (
                                                <p className="text-muted text-center">Belum ada solusi yang ditambahkan.</p>
                                            )}
                                        </div>

                                        {/* Form Komentar (Solusi) */}
                                        {ticket.status === "Resolved" && showCommentForm && (
                                        <>
                                            <h4 className="mb-3">Tambah Solusi</h4>
                                            <div className="row mb-3">
                                                <div className="col-md-6 mb-2">
                                                    <select
                                                    className="form-control text-white"
                                                    value={comment.type || ""}
                                                    onChange={(e) => setComment((prev) => ({ ...prev, type: e.target.value }))}
                                                    >
                                                    <option value="">Pilih Tipe</option>
                                                    <option value="Malfunction">Malfunction</option>
                                                    <option value="Human_Error">Human Error</option>
                                                    <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                                <div className="col-md-6">
                                                    <select
                                                    className="form-control text-white"
                                                    required
                                                    value={comment.userId || ""}
                                                    onChange={(e) => setComment({ ...comment, userId: e.target.value })}
                                                    >
                                                    <option value="">Pilih User</option>
                                                    {user.map((users) => (
                                                        <option key={users.id} value={users.id}>{users.name}</option>
                                                    ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="row mb-3">
                                                <div className="col-md-4 mb-2">
                                                    <select className="form-control text-white" value={comment.categoryId || ""} onChange={handleCategoryChange}>
                                                    <option value="">Pilih Kategori</option>
                                                    {categories.map((cat) => (
                                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                                    ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-4 mb-2">
                                                    <select className="form-control text-white" value={comment.subCategoryId || ""} onChange={handleSubCategoryChange}>
                                                    <option value="">Pilih Sub-Kategori</option>
                                                    {subCategories.map((sub) => (
                                                        <option key={sub.id} value={sub.id}>{sub.name}</option>
                                                    ))}
                                                    </select>
                                                </div>
                                                <div className="col-md-4">
                                                    <select className="form-control text-white" value={comment.subSubCategoryId || ""} onChange={(e) => setComment((prev) => ({ ...prev, subSubCategoryId: e.target.value }))}>
                                                    <option value="">Pilih Sub-Sub-Kategori</option>
                                                    {subSubCategories.map((subSub) => (
                                                        <option key={subSub.id} value={subSub.id}>{subSub.name}</option>
                                                    ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <textarea
                                                    className="form-control mb-2"
                                                    placeholder="Deskripsi pekerjaan..."
                                                    value={comment.description || ""}
                                                    onChange={(e) => setComment((prev) => ({ ...prev, description: e.target.value }))}
                                                />
                                                <button className="btn btn-warning" onClick={submitComment} disabled={loading}>
                                                    {loading ? "Menyimpan..." : "Simpan Komentar"}
                                                </button>
                                            </div>
                                        </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="footer fixed">
                        <Footer />
                    </footer>
                </div>
            </div>
        </div>

    )
}