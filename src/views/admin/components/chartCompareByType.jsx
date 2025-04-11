import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import api from '../../../services/api'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer
} from 'recharts'

export default function SubCategoryComparisonChart() {
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2023 + 1 }, (_, i) => 2023 + i)

  const months = [
    { value: '', name: 'Semua Bulan' },
    { value: '1', name: 'Januari' }, { value: '2', name: 'Februari' },
    { value: '3', name: 'Maret' }, { value: '4', name: 'April' },
    { value: '5', name: 'Mei' }, { value: '6', name: 'Juni' },
    { value: '7', name: 'Juli' }, { value: '8', name: 'Agustus' },
    { value: '9', name: 'September' }, { value: '10', name: 'Oktober' },
    { value: '11', name: 'November' }, { value: '12', name: 'Desember' },
  ]

  const [year, setYear] = useState(currentYear)
  const [month, setMonth] = useState('')
  const [chartData, setChartData] = useState([])

  const token = Cookies.get('token')

  const fetchData = async () => {
    try {
      const params = new URLSearchParams()
      if (month) params.append('month', month)
      if (year) params.append('year', year)

      const res = await api.get(`/api/admin/comments/compare?${params.toString()}`, {
        headers: { Authorization: token }
      })

      if (res.data.success) {
        setChartData(res.data.data)
      }
    } catch (error) {
      console.error('Error fetching chart data:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [year, month])

  return (
    <div>
      <div className="d-flex justify-content-between gap-2 my-2">
        <h4>Perbandingan Berdasarkan Tipe Error</h4>
        <div className="d-flex gap-2">
          <select
            className="form-select form-select-sm text-center w-auto mx-1 bg-dark text-white border-0"
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <select
            className="form-select form-select-sm text-center w-auto bg-dark text-white border-0"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
          </select>
        </div>
      </div>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: `${chartData.length * 100}px` }}>
            <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="" />
                    <XAxis dataKey="subcategory" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="malfunction" fill="#fa4141" />
                    <Bar dataKey="human_error" fill="#0ce004" />
                    <Bar dataKey="other" fill="#3535fc" />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}