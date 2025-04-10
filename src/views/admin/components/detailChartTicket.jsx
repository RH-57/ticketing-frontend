import { useEffect, useState } from "react"
import {
    LineChart,
    Line,
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
    const [category, setCategory] = useState("")
    const [type, setType] = useState("")
    const [data, setData] = useState([])
    const [categories, setCategories] = useState([])
    const token = Cookies.get('token')

    const fetchCategories = async () => {
        if (token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/categories')
                if (response.data.status) {
                    const formattedCategories = response.data.data.map(cat => ({
                        id: cat.id,
                        name: cat.name
                    }))
                    setCategories(formattedCategories)
                }
            } catch (error) {
                console.error("Error fetching categories", error)
            }
        }
    }

    const fetchData = async (selectedYear, selectedCategory, selectedType) => {
        try {
            const response = await api.get(`/api/admin/tickets/detail-trend/${selectedYear}`, {
                params: { 
                    categoryId: selectedCategory || undefined,
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
        fetchCategories()
        fetchData(year, category, type)
    }, [year, category, type])

    return (
        <div className="container">
            <div className="d-flex justify-content-between gap-3">
                <h4>Trend</h4>
                <div>
                    <select
                        className="form-select form-select-sm text-center w-auto mx-1 bg-dark text-white border-0"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    >
                        {years.map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>

                    <select
                        className="form-select text-center w-auto mx-1 bg-dark text-white border-0"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Semua Kategori</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        className="form-select text-center w-auto mx-1 bg-dark text-white border-0"
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                    >
                        <option value="">Semua Tipe</option>
                        <option value="Malfunction">Malfunction</option>
                        <option value="Human_Error">Human Error</option>
                        <option value="Other">Other</option>
                    </select>
                </div>
            </div>

            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={data} margin={{ left: 0, right: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" angle={-45} textAnchor="end" interval={0} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="ticket" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}