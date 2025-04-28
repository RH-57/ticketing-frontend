import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import api from "../../../services/api"

export default function MostFreqTroubleComponents() {
    const [troubleComponents, setTroubleComponents] = useState('')
    const token = Cookies.get('token')

    const fetchMostFreqTroubleComponents = async () => {
        if(token) {
            api.defaults.headers.common['Authorization'] = token
            try {
                const response = await api.get('/api/admin/dashboards/most-frequently-trouble-components')
                setTroubleComponents(response.data.data.slice(0, 5))
            } catch (error) {
                console.error('Cannot fetch the Data', error)
            }
        }
    }

    useEffect(() => {
        fetchMostFreqTroubleComponents()
    }, [])

    return (
        <div className="table-responsive">
            <table className="table table-hover text-white table-bordered" style={{ minWidth: '100%', borderCollapse: 'collapse' }}>
                <thead className="bg-dark" style={{ position: 'sticky', top: 0, zIndex: 1 }}>
                    <tr>
                        <th style={{ backgroundColor: '#212529' }}>No.</th>
                        <th style={{ backgroundColor: '#212529' }}>Nama Komponen</th>
                        <th style={{ backgroundColor: '#212529' }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {troubleComponents.length > 0 ? (
                        troubleComponents.map((trouble, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{trouble.subSubCategories}</td> 
                                <td>{trouble.totalReport}</td> 
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