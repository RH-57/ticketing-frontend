import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import api from '../../../services/api'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from 'recharts'

export default function SubSubCategoryChart() {
  const currentYear = new Date().getFullYear()
  const startYear = 2023
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i)
  const months = [
    { value: '', name: 'All Month' },
    { value: '1', name: 'Januari' },
    { value: '2', name: 'Februari' },
    { value: '3', name: 'Maret' },
    { value: '4', name: 'April' },
    { value: '5', name: 'Mei' },
    { value: '6', name: 'Juni' },
    { value: '7', name: 'Juli' },
    { value: '8', name: 'Agustus' },
    { value: '9', name: 'September' },
    { value: '10', name: 'Oktober' },
    { value: '11', name: 'November' },
    { value: '12', name: 'Desember' },
  ]

  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState('')
  const [categoryList, setCategoryList] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [subCategoryList, setSubCategoryList] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState('')
  const [chartData, setChartData] = useState([])

  const token = Cookies.get('token')

  const fetchCategories = async () => {
    if (token) {
      api.defaults.headers.common['Authorization'] = token
      try {
        const res = await api.get('/api/admin/categories')
        if (res.data.status) {
          const categories = res.data.data.map(cat => ({ id: cat.id, name: cat.name }))
          setCategoryList(categories)
        }
      } catch (err) {
        console.error('Error fetching categories', err)
      }
    }
  }

  const fetchSubCategories = async (categoryId) => {
    if (token && categoryId) {
      try {
        const res = await api.get(`/api/admin/categories/${categoryId}/sub-categories`)
        if (res.data.status) {
          const subs = res.data.data.map(sub => ({ id: sub.id, name: sub.name }))
          setSubCategoryList(subs)
        }
      } catch (err) {
        console.error('Error fetching subcategories', err)
      }
    }
  }

  const fetchChartData = async () => {
    if (!token) return
  
    let url = ''
    const params = new URLSearchParams()
  
    if (month) params.append('month', month)
    if (selectedCategory) params.append('category_id', selectedCategory)
    if (selectedSubCategory) params.append('subCategory_Id', selectedSubCategory)
  
    if (selectedSubCategory) {
      url = `/api/admin/tickets/trend-sub-sub-categories/${year}`
    } else {
      url = `/api/admin/tickets/trend-sub-categories/${year}`
    }
  
    if (params.toString()) {
      url += `?${params.toString()}`
    }
  
    try {
      const res = await api.get(url, {
        headers: { Authorization: token }
      })
      if (res.data.success) {
        setChartData(res.data.data)
      }
    } catch (err) {
      console.error('Error fetching chart data', err)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory)
      setSelectedSubCategory('')
    }
  }, [selectedCategory])

  useEffect(() => {
    fetchChartData()
  }, [year, month, selectedCategory, selectedSubCategory])

  return (
    <div>
      <div className="d-flex justify-content-between gap-2 my-2">
        <h4 className="mb-0">Total Tiket</h4>
        <div className="d-flex align-items-center  gap-2">
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
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {months.map(m => (
              <option key={m.value} value={m.value}>{m.name}</option>
            ))}
          </select>

          <select
            className="form-select text-center w-auto mx-1 border-0"
            style={{ backgroundColor: '#212529', color: '#fff' }}
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Category</option>
            {categoryList.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            className="form-select text-center w-auto mx-1 border-0"
            style={{ backgroundColor: '#212529', color: '#fff' }}
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            disabled={!selectedCategory}
          >
            <option value="">All Sub-Category</option>
            {subCategoryList.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="2 2" stroke="#575757" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="ticket" fill="#3751fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}