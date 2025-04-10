import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    YAxis,
    XAxis,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import api from '../../../services/api'

export default function ChartTicket() {
        const [chartTickets, setChartTickets] = useState([])
    
        const fetchTrendTicket = async () => {
            try {
                const response = await api.get('/api/admin/tickets/trend')
                setChartTickets(response.data.data)
            } catch (error) {
                console.error('Error fetching trend ticket', error)
            }
        }
    
        useEffect(() => {
            fetchTrendTicket()
        }, [])
        return(
            <>
                <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={chartTickets}>
                            <XAxis dataKey="year" />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Legend />
                            {chartTickets.length > 0 &&
                                Object.keys(chartTickets[0])
                                    .filter(key => key !== "year") 
                                    .map((category, index) => (
                                        <Line
                                            key={category}
                                            type="monotone"
                                            dataKey={category}
                                            stroke={["#8884d8", "#82ca9d", "#ffc658", "#ff7300"][index % 4]} 
                                            strokeWidth={2}
                                            activeDot={{ r: 2 }}
                                        />
                                    ))}
                        </LineChart>
                    </ResponsiveContainer>
            </>
        )
}
    
