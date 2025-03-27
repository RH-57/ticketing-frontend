import { useState } from 'react';
import Cookies from 'js-cookie';
import api from '../../../services/api';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../../components/Sidebar';
import Footer from '../../../components/Footer';
import Navbar from '../../../components/Navbar';

export default function ChangePassword() {
    const token = Cookies.get('token');
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!token) {
            console.error("Token not found");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("New password and confirm password do not match");
            return;
        }

        try {
            api.defaults.headers.common['Authorization'] = token;
            await api.put('/api/admin/users/change-password', { oldPassword, newPassword });
            
            toast.success("Password has been changed successfully");
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error("Error updating password: ", error);
            toast.error(error.response?.data?.message || "Failed to update password");
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
                            <h3 className="page-title"> Change Password </h3>
                        </div>
                        <div className="row">
                            <div className="col-md-6 grid-margin stretch-card">
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Update Password</h4>
                                        <form onSubmit={handleChangePassword}>
                                            <div className="form-group">
                                                <label>Old Password</label>
                                                <input type="password" className="form-control" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label>New Password</label>
                                                <input type="password" className="form-control" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                                            </div>
                                            <div className="form-group">
                                                <label>Confirm New Password</label>
                                                <input type="password" className="form-control" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                                            </div>
                                            <button type="submit" className="btn btn-primary">Change Password</button>
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
