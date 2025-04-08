import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import DetailTrendTicket from "./components/detailChartTicket";
import CategoryPieChart from "./components/trendCategory";
import SubCategoryChart from "./components/chartSubCategories";

export default function DetailTrend() {
    return (
        <div className="container-scroller">
            <Sidebar />
            <div className="container-fluid page-body-wrapper">
                <Navbar />
                <div className="main-panel">
                    <div className="content-wrapper px-3 py-3">
                        <div className="page-header">
                            <h3 className="page-title">Detail Trend</h3>
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb">
                                    <li className="breadcrumb-item"><Link to="/admin/dashboard">Dasboard</Link></li>
                                    <li className="breadcrumb-item active" aria-current="page">Detail Chart</li>
                                </ol>
                            </nav>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-sm-4 grid-margin stretch-card px-1">
                                <div className="card">
                                    <div className="card-body">
                                                <DetailTrendTicket />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 grid-margin stretch-card px-1">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="d-flex flex-row justify-content-between">
                                            <h4 className="card-title mb-1">Kategori</h4>
                                        </div>
                                        <div className="row d-flex justify-content-center ">
                                            <div className="col-12">
                                               <CategoryPieChart />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12 grid-margin stretch-card px-1">
                                <div className="card">
                                    <div className="card-body">
                                        <SubCategoryChart />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Footer />
                    </div>
                </div>
            </div>
        </div>
    )
}