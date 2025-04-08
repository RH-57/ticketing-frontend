import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import Cookies from "js-cookie";
import api from "../../../services/api";

const COLORS = ["#3440eb", "#34eb59", "#FFBB28"];

export default function CategoryPieChart() {
    const [year, setYear] = useState(new Date().getFullYear());
    const [data, setData] = useState([]);

    const token = Cookies.get("token");

    // Fetch data dari API berdasarkan tahun yang dipilih
    const fetchData = async (selectedYear) => {
        try {
            api.defaults.headers.common["Authorization"] = token;
            const response = await api.get(`/api/admin/tickets/trend-categories/${selectedYear}`);

            if (response.data.success) {
                setData(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching category ticket data:", error);
        }
    };

    useEffect(() => {
        fetchData(year);
    }, [year]);

    return (
        <div className="container">
            <div className="d-flex justify-content-between gap-3">
                <h4>Kategori</h4>
                <select
                    className="form-select text-center w-auto bg-dark text-white border-0"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value, 10))}
                >
                    {[2023, 2024, 2025].map((y) => (
                        <option key={y} value={y}>
                            {y}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="ticketCount"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}