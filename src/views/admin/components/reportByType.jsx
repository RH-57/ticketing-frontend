import { useEffect, useState } from "react"
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts"
import api from "../../../services/api"

// Warna unik untuk setiap kategori
const COLORS = ["#6331FA", "#FAD532", "#39C21F", "#ff8042", "#ff4d4d", "#4da6ff"]

export default function ReportByType() {
    const [reportData, setReportData] = useState([])

    const fetchReportData = async () => {
        try {
            const response = await api.get('/api/admin/comments/show-total-report-by-type')
            setReportData(response.data.data)
        } catch (error) {
            console.error('Error fetching report data:', error);
        }
    };

    useEffect(() => {
        fetchReportData();
    }, []);

    return (
        <>
                {reportData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie 
                                data={reportData} 
                                dataKey="total" 
                                nameKey="type" 
                                cx="50%" 
                                cy="50%" 
                                outerRadius={100} 
                                fill="#8884d8"
                                
                            >
                                {reportData.map((_, index) => (
                                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <p className="text-muted">No data available</p>
                )}
            </>
    );
}