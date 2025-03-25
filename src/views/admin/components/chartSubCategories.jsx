import {useEffect, useState} from 'react'
import Cookies from 'js-cookie'
import api from '../../../services/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function SubCategoryChart() {
    const [year, setYear] = useState(new Date().getFullYear())
    const [subCategories, setSubCategories] = useState([])
    const token = Cookies.get('token')

    const fetchDataSubCategories = async (selectedYear) => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get(`/api/admin/tickets/trend-sub-categories/${selectedYear}`)
                if (response.data.success) {
                    setSubCategories(response.data.data)
                }
            } catch (error) {
                console.error(error)
            }
        }
    }

    useEffect(() => {
        fetchDataSubCategories(year)
    },[year])
    return (
        <div className="container">
            <div className="d-flex justify-content-between gap-3 my-2">
                <h2>Total Tiket Sub-Kategori</h2>
                <select className="form-select text-center w-auto mx-1 bg-dark text-white border-0" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10))}>
                    {[2023, 2024, 2025].map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>
            <div className="border p-3 overflow-x-auto">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={subCategories}>
                            <CartesianGrid strokeDasharray="2 2" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="ticket" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
            </div>
        </div>
    )
}