import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import api from '../../../services/api'

export default function ListTotalReportBySubCategory() {
    const token = Cookies.get('token')
    const [data, setData] = useState([])
    const [year, setYear] = useState(new Date().getFullYear())
    const [years, setYears] = useState([])

    const generateYears = () => {
        const currentyear = new Date().getFullYear()
        const yearList = []
        for (
            let y = currentyear; y >= currentyear - 2; y--
        ) {
            yearList.push(y)
        }

        setYears(yearList)
    }

    const fetchData = async (selectedYear) => {
        if (token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get(`/api/admin/comments/total-by-subcategories?year=${selectedYear}`)
                if (response.data.success) {
                    setData(response.data.data)
                }
            } catch (error) {
                console.error('Failed to fetch data', error)
            }
        }
    }

    useEffect(() => {
        generateYears()
        fetchData(year)
    }, [year])
    return (
        <div>
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h4 className="mb-0">Total Sub-Categories</h4>
          <div className="d-flex align-items-center gap-2">
            <select
              className="form-select text-center w-auto mx-1 border-0"
              style={{ backgroundColor: '#212529', color: '#fff' }}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              {years.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      
        <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <table className="table table-hover text-white table-bordered" style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
            <thead className="bg-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
              <tr>
                <th style={{ backgroundColor: '#212529' }}>No.</th>
                <th style={{ backgroundColor: '#212529' }}>Nama Komponen</th>
                <th style={{ backgroundColor: '#212529' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td>{item.name}</td>
                    <td className="text-center">{item.total}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center">Data Kosong</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    )
}