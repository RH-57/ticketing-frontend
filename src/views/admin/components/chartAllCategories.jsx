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

  const [year, setYear] = useState(currentYear)
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
          const categories = res.data.data.map(cat => ({
            id: cat.id,
            name: cat.name
          }))
          setCategoryList(categories)

          const defaultCat = categories.find(cat => cat.name.toLowerCase() === 'hardware')
          if (defaultCat) {
            setSelectedCategory(defaultCat.id)
          }
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
          const subs = res.data.data.map(sub => ({
            id: sub.id,
            name: sub.name
          }))
          setSubCategoryList(subs)
        }
      } catch (err) {
        console.error('Error fetching subcategories', err)
      }
    }
  }

  const fetchChartByCategory = async (selectedYear, categoryId) => {
    if (token && categoryId) {
      try {
        const res = await api.get(`/api/admin/tickets/trend-sub-categories/${selectedYear}?category_id=${categoryId}`)
        if (res.data.success) {
          setChartData(res.data.data)
        }
      } catch (err) {
        console.error('Error fetching category chart', err)
      }
    }
  }

  const fetchChartBySubCategory = async (selectedYear, subCategoryId) => {
    if (token && subCategoryId) {
      try {
        const res = await api.get(`/api/admin/tickets/trend-sub-sub-categories/${selectedYear}?subCategory_Id=${subCategoryId}`)
        if (res.data.success) {
          setChartData(res.data.data)
        }
      } catch (err) {
        console.error('Error fetching subcategory chart', err)
      }
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory)
      setSelectedSubCategory('') // Reset subcategory
      fetchChartByCategory(year, selectedCategory)
    }
  }, [selectedCategory])

  useEffect(() => {
    if (selectedSubCategory) {
      fetchChartBySubCategory(year, selectedSubCategory)
    } else if (selectedCategory) {
      fetchChartByCategory(year, selectedCategory)
    }
  }, [year, selectedSubCategory])

  return (
    <div className="container">
      <div className="d-flex justify-content-between gap-2 my-2">
        <h4>Total Tiket</h4>
        <div className="d-flex">
          <select
            className="form-select text-center w-auto mx-1 bg-dark text-white border-0"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value, 10))}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <select
            className="form-select text-center w-auto mx-1 bg-dark text-white border-0"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">-- Pilih Kategori --</option>
            {categoryList.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <select
            className="form-select text-center w-auto mx-1 bg-dark text-white border-0"
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            disabled={!selectedCategory}
          >
            <option value="">-- Semua Sub Kategori --</option>
            {subCategoryList.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="2 2" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="ticket" fill="#3751fa" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}