import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import api from "../../../services/api"

export default function MostActiveDepartment() {
    const [departments, setDepartments] = useState([])
    const token = Cookies.get('token')
    
    const fetchDataDepartment = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/dashboards/most-active-departments')
                setDepartments(response.data.data.slice(0, 4))
            } catch (error) {
                console.error(error)
            }
        } else {
            console.error('Token is not available')
        }
    }

    useEffect(() => {
        fetchDataDepartment()
    }, [])

    return (
        <div className="table-responsive">
            <table className="table table-hover text-white table-bordered" style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
                <thead className="bg-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                        <th style={{ backgroundColor: '#212529' }}>No.</th>
                        <th style={{ backgroundColor: '#212529' }}>Nama Departemen</th>
                        <th style={{ backgroundColor: '#212529' }}>Total Tiket</th>
                    </tr>
                </thead>
                <tbody>
                    {departments.length > 0 ? (
                        departments.map((dept, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{dept.department}</td> 
                                <td>{dept.totalTickets}</td> 
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3" className="text-center">Data tidak tersedia</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}