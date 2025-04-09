import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend
} from 'chart.js'
import { Bar, Line, Pie } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Tooltip,
  Legend
)

type ChartType = 'bar' | 'line' | 'pie'

interface ChartWrapperProps {
  type: ChartType
  data: any
  options?: any
  className?: string
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({
  type,
  data,
  options = {},
  className = ''
}) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return <Bar data={data} options={options} />
      case 'line':
        return <Line data={data} options={options} />
      case 'pie':
        return <Pie data={data} options={options} />
      default:
        return <div className="text-red-500">Tipo de gráfico no soportado</div>
    }
  }

  return <div className={`w-full h-full ${className}`}>{renderChart()}</div>
}

export default ChartWrapper
