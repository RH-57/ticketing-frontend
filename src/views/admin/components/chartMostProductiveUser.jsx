import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import api from '../../../services/api'

export default function ChartMostProductiveUser() {
  const [data, setData] = useState([])
  const [year, setYear] = useState(new Date().getFullYear())
  const [years, setYears] = useState([])

  const fetchData = async (selectedYear) => {
    try {
      const response = await api.get(`/api/admin/comments/most-productive-users?year=${selectedYear}`)
      if (response.data.success) {
        setData(response.data.data)
      }
    } catch (error) {
      console.error('Failed to fetch most productive users:', error)
    }
  }

  const generateYears = () => {
    const currentYear = new Date().getFullYear()
    const yearList = []
    for (let y = currentYear; y >= currentYear - 2; y--) {
      yearList.push(y)
    }
    setYears(yearList)
  }

  useEffect(() => {
    generateYears()
    fetchData(year)
  }, [year])

  return (
    <div style={{ width: '100%', height: '250px' }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h4 className="mb-0">Selesaikan Tiket</h4>
        <select
          className="form-select form-select-sm text-center w-auto mx-1 bg-dark text-white border-0"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        >
          {years.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 10, left: 30, bottom: 5 }}
        >
          <XAxis type="number" tick={{ fontSize: 12 }} />
          <YAxis dataKey="name" type="category" tick={{ fontSize: 14 }} />
          <Tooltip />
          <Bar dataKey="total" fill="#ff4040" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}