/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2024-07-03 20:52:35
 * @LastEditors: chenhua
 * @LastEditTime: 2024-07-03 20:53:02
 */
import { Line } from "react-chartjs-2";

const LineChart = () => {
  // 示例数据
  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Sales",
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  // 配置选项
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Line Chart Example</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default LineChart;
