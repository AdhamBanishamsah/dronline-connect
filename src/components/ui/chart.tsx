
"use client"

import { useEffect, useRef, useState } from "react"
import { BarChart as BarChartIcon, LineChart as LineChartIcon, PieChart as PieChartIcon } from "lucide-react"
import { Bar, Line, Pie } from "recharts"

interface ChartProps {
  data: any
  className?: string
  options?: any
}

export function BarChart({ data, className, options }: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [chartInstance, setChartInstance] = useState(null)

  useEffect(() => {
    if (!chartRef.current) return

    try {
      const Chart = require("chart.js/auto")
      
      // Destroy previous chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy()
      }
      
      // Create new chart
      const newChartInstance = new Chart(chartRef.current, {
        type: "bar",
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options
        }
      })
      
      setChartInstance(newChartInstance)
      
      // Cleanup
      return () => {
        if (newChartInstance) {
          newChartInstance.destroy()
        }
      }
    } catch (error) {
      console.error("Error creating bar chart:", error)
    }
  }, [data, options])

  return (
    <div className={className}>
      <canvas ref={chartRef} />
    </div>
  )
}

export function LineChart({ data, className, options }: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [chartInstance, setChartInstance] = useState(null)

  useEffect(() => {
    if (!chartRef.current) return

    try {
      const Chart = require("chart.js/auto")
      
      // Destroy previous chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy()
      }
      
      // Create new chart
      const newChartInstance = new Chart(chartRef.current, {
        type: "line",
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options
        }
      })
      
      setChartInstance(newChartInstance)
      
      // Cleanup
      return () => {
        if (newChartInstance) {
          newChartInstance.destroy()
        }
      }
    } catch (error) {
      console.error("Error creating line chart:", error)
    }
  }, [data, options])

  return (
    <div className={className}>
      <canvas ref={chartRef} />
    </div>
  )
}

export function PieChart({ data, className, options }: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const [chartInstance, setChartInstance] = useState(null)

  useEffect(() => {
    if (!chartRef.current) return

    try {
      const Chart = require("chart.js/auto")
      
      // Destroy previous chart instance if it exists
      if (chartInstance) {
        chartInstance.destroy()
      }
      
      // Create new chart
      const newChartInstance = new Chart(chartRef.current, {
        type: "pie",
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          ...options
        }
      })
      
      setChartInstance(newChartInstance)
      
      // Cleanup
      return () => {
        if (newChartInstance) {
          newChartInstance.destroy()
        }
      }
    } catch (error) {
      console.error("Error creating pie chart:", error)
    }
  }, [data, options])

  return (
    <div className={className}>
      <canvas ref={chartRef} />
    </div>
  )
}
