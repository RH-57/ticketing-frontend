import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import api from '../../../services/api'
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts'

export default function SubCategoryChart() {
    const [year, setYear] = useState(new Date().getFullYear())
    const [categoryList, setCategoryList] = useState([])
    const [selectedCategory, setSelectedCategory] = useState('')
    const [subCategories, setSubCategories] = useState([])
    const token = Cookies.get('token')

    // Ambil daftar kategori
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
    
                    setCategoryList(formattedCategories)
    
                    // Cari kategori "Hardware"
                    const defaultCategory = formattedCategories.find(cat => cat.name.toLowerCase() === "hardware")
                    if (defaultCategory) {
                        setSelectedCategory(defaultCategory.id)
                    }
                }
            } catch (error) {
                console.error("Error fetching categories", error)
            }
        }
    }

    // Ambil data sub kategori berdasarkan tahun dan kategori
    const fetchDataSubCategories = async (selectedYear, selectedCategoryId) => {
        if (token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                let url = `/api/admin/tickets/trend-sub-categories/${selectedYear}`
                if (selectedCategoryId) {
                    url += `?category_id=${selectedCategoryId}`
                }
                const response = await api.get(url)
                if (response.data.success) {
                    setSubCategories(response.data.data)
                }
            } catch (error) {
                console.error("Error fetching sub category chart data", error)
            }
        }
    }

    // Load kategori saat pertama kali render
    useEffect(() => {
        fetchCategories()
    }, [])

    // Update chart saat tahun atau kategori berubah
    useEffect(() => {
        fetchDataSubCategories(year, selectedCategory)
    }, [year, selectedCategory])

    return (
        <div className="container">
            <div className="d-flex justify-content-between gap-2 my-2">
                <h4>Total Tiket Sub-Kategori</h4>
                <div className="d-flex">
                    <select
                        className="form-select text-center w-auto mx-1 bg-dark text-white border-0"
                        value={year}
                        onChange={(e) => setYear(parseInt(e.target.value, 10))}
                    >
                        {[2023, 2024, 2025].map(y => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </select>

                    <select
                        className="form-select text-center w-auto mx-1 bg-dark text-white border-0"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categoryList.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={subCategories}>
                        <CartesianGrid strokeDasharray="2 2" />
                        <XAxis dataKey="name"/>
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="ticket" fill="#3751fa" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
    )
}