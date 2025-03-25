import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    YAxis,
    XAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import api from "../../../services/api";

export default function ChartInternet() {
    const [chartInternets, setChartInternets] = useState([])

    const fetchInternet = async () => {
        try {
            const response = await api.get('/api/admin/dashboards/chart-internet')
            setChartInternets(response.data.data)
        } catch (error) {
            console.error('Error fetching trend Internet', error)
        }
    }

    useEffect(() => {
        fetchInternet()
    }, [])

    return (
        <>
           
        </>
    )
}