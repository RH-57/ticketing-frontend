import { useEffect, useState } from "react"
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from "recharts"
import Cookies from 'js-cookie'

import api from "../../../services/api"

export default function DetailTrendTicket() {
    const currentYear = new Date().getFullYear()
    const startYear = 2023
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)

    const [year, setYear] = useState(currentYear)
    const [type, setType] = useState("")
    const [data, setData] = useState([])
    const token = Cookies.get('token')


    const fetchData = async (selectedYear, selectedType) => {
        try {
            const response = await api.get(`/api/admin/tickets/detail-trend/${selectedYear}`, {
                params: { 
                    type: selectedType || undefined 
                }
            })
            if (response.data.success) {
                setData(response.data.data)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        fetchData(year, type)
    }, [year, type])

    return (
        <div>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="mb-0">Grafik Trend</h4>
                <div className="d-flex align-items-center gap-2">
                    <select
                        className="form-select text-center w-auto mx-1 border-0"
                        style={{ backgroundColor: '#212529', color: '#fff' }}
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>
                
                    <select
                        className="form-select text-center w-auto mx-1 border-0"
                        style={{ backgroundColor: '#212529', color: '#fff' }}
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">All Type</option>
                        <option value="Malfunction">Malfunction</option>
                        <option value="Human_Error">Human Error</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={data} margin={{ left: 0, right: 10, bottom: 5 }}>
                    <CartesianGrid stroke="#575757" strokeDasharray="2 2" />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {data.length > 0 &&
                        Object.keys(data[0])
                            .filter(key => key !== 'month')
                            .map((key, index) => {
                                const colors = ['#f01111', '#ecf011', '#8884d8', '#82ca9d']
                                const color = colors[index % colors.length]
                                return (
                                    <Area
                                        key={key}
                                        type="monotone"
                                        dataKey={key}
                                        stroke={color}
                                        fill={color}
                                        fillOpacity={0.1}
                                    />
                                )
                            })}
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}