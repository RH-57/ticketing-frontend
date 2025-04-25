import { Link } from "react-router-dom";
import Footer from "../../components/Footer";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import DetailTrendTicket from "./components/detailChartTicket";
import CategoryPieChart from "./components/trendCategory";
import SubSubCategoryChart from "./components/chartAllCategories";
import ChartMostProductiveUser from "./components/chartMostProductiveUser";
import SubCategoryComparisonChart from "./components/chartCompareByType";
import ListTotalReportBySubCategory from "./components/listTotalReportBySubCategory";
import ListTotalReportBySubSubCategory from "./components/listTotalReportBySubSubCategory";

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
                            <div className="col-md-6 col-sm-4 grid-margin stretch-card px-1 mb-2">
                                <div className="card">
                                    <div className="card-body">
                                        <DetailTrendTicket/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-4 grid-margin stretch-card px-1 mb-2">
                                <div className="card">
                                    <div className="card-body">
                                        <CategoryPieChart />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3 col-sm-4 grid-margin stretch-card px-1 mb-2">
                                <div className="card">
                                    <div className="card-body">
                                        <ChartMostProductiveUser />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-8 col-sm-4 grid-margin stretch-card px-1 mb-2">
                                <div className="card">
                                    <div className="card-body">
                                        <SubSubCategoryChart />
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4 col-sm-4 grid-margin stretch-card px-1 mb-2">
                                <div className="card">
                                    <div className="card-body">
                                        <ListTotalReportBySubCategory />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-8 grid-margin stretch-card px-1 mb-2">
                                <div className="card">
                                    <div className="card-body">
                                        <SubCategoryComparisonChart />
                                    </div>
                                </div>
                            </div>
                            <div className="col-4 grid-margin stretch-card px-1 mb-2">
                                <div className="card">
                                    <div className="card-body">
                                        <ListTotalReportBySubSubCategory />
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