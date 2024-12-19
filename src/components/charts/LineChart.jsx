import { Line } from 'react-chartjs-2';
import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { listMinChart } from "@/services/index";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LineChart = ({ address }) => {
  const [dataPoints, setDataPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await listMinChart([address]); // Assume queryListMinChart returns a promise
        setDataPoints(res[address]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [address]);


  const lastDataPoint = dataPoints[dataPoints.length - 1];
  const lineColor = lastDataPoint >= 0 ? '#1D944F' : '#FF4D00';
  const backgroundColor = lastDataPoint >= 0 ? 'rgba(75, 192, 192, 0.2)' : 'rgba(255, 77, 0, 0.5)';

  const data = {
    labels: dataPoints.map((_, index) => index.toString()), // 使用索引作为标签
    datasets: [
      {
        label: 'Dataset',
        data: dataPoints,
        borderColor: lineColor,
        backgroundColor: backgroundColor,
        fill: true, // 填充背景颜色
        pointRadius: 0, // 隐藏数据点
        borderWidth: 1, // 设置折线粗细
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // 隐藏图例
      },
      title: {
        display: false,
        text: 'Dynamic Line Color Chart',
      },
      tooltip: {
        enabled: false, // 禁用鼠标提示
      },
    },
    scales: {
      x: {
        display: false, // 隐藏X轴
        grid: {
          display: false, // 隐藏X轴网格线
        },
      },
      y: {
        ticks: {
          display: true, // 显示Y轴刻度值
          color: '#ffffff', // Y轴刻度值的颜色
          callback: (value) => `${(value*100).toFixed(0)}%`,
        },
        grid: {
          display: false, // 隐藏Y轴网格线
          drawBorder: false, // 不绘制Y轴的线条
        },
        border: {
          color: '#111e1e' // Y轴的颜色
        }
      },
    },
    elements: {
      point: {
        radius: 0, // 隐藏数据点
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default LineChart;
