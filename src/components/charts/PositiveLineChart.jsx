import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import lb_icon_wjl from "@statics/images/lb_icon_wjl.svg";
import dayjs from "dayjs";
const elementWidth = import.meta.env.VITE_ELEMENT_WIDTH;
// let xLabelsArr = [];
let xAxisData = [];
let seriesData = [];
const PositiveLineChart = ({ data, selectedTab }) => {console.log('---------------------selectedTab', selectedTab);
  const chartRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= elementWidth);
  const [xLabelsArr, setXLabelsArr] = useState([]);
  const handleResize = () => {
    setIsMobile(window.innerWidth <= elementWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const fillData = (data, day, entriesPerDay) => {
    // 根据需要生成的天数计算所需的时间戳数量
    let days = day === '7D' ? 8 : day === '30D' ? 31 : 91;
    let totalRequired = 0;
  
    // 计算前days-1天的条数
    totalRequired += (days - 1) * entriesPerDay;
    
    // 计算当天的条数
    const now = dayjs();
    const currentHour = now.hour();
    totalRequired += (currentHour + 1); // 当前时间点的条数（包括0点到当前小时）

    console.log(totalRequired, 'currentHour--------------', currentHour)
  
    const currentLength = data.length;
    const missingDataCount = totalRequired - currentLength;
    const zeros = Array(missingDataCount > 0 ? missingDataCount : 0).fill(0);
  
    return [...zeros, ...data];
  };

  const generateDateArray = (day, entriesPerDay) => {
    const now = dayjs(); // 获取当前时间
    const result = [];
    let days = day === '7D' ? 8 : day === '30D' ? 31 : 91;
    // 生成前days-1天的数据
    for (let d = days - 1; d >= 1; d--) {
      const dayStart = now.subtract(d, 'day').startOf('day');
      
      for (let h = 0; h < entriesPerDay; h++) {
        const entry = dayStart.hour(h);
        result.push(entry.format('YYYY-MM-DD HH:mm:ss')); // 格式化为字符串
      }
    }
  
    // 生成当天的数据，从0点到当前时间
    const todayStart = now.startOf('day');
    const currentHour = now.hour();
    
    for (let h = 0; h <= currentHour; h++) {
      const entry = todayStart.hour(h);
      result.push(entry.format('YYYY-MM-DD HH:mm:ss')); // 格式化为字符串
    }
  
    return result;
  };

  const generateXLabels = (Times, type) => {
    let xLabels = [];
    let interval;
    let totalLabels;
  
    // 根据不同的类型设定间隔和总标签数
    if (type === '7D') {
      interval = 1;  // 每天显示一个标签
      totalLabels = 8;
    } else if (type === '30D') {
      interval = 3  // 每隔2天显示一个标签
      totalLabels = 11;
    } else if (type === '90D') {
      interval = 9;  // 每隔8天显示一个标签
      totalLabels = 11;
    }
  
    // 获取今天的日期作为起始时间
    const startTime = new Date(Times[Times.length - 1]);
  
    // 根据设定的标签数和间隔生成标签
    for (let i = 0; i < totalLabels; i++) {
      const date = new Date(startTime);
      date.setDate(startTime.getDate() - (interval * i)); // 计算日期
  
      const label = date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      });
  
      xLabels.unshift(label); // 将生成的标签添加到数组前面
    }
  
    return xLabels;
  };

  useEffect(() => {
    // 生成 x 轴数据的值
    xAxisData = generateDateArray(selectedTab, 24);//data.map((item) => item[0]);
    seriesData = fillData(data, selectedTab, 24);//data.map((item) => item[1]);
    setXLabelsArr(generateXLabels(xAxisData, selectedTab));
    console.log(seriesData, generateXLabels(xAxisData, selectedTab), 'generateXLabels(xAxisData, selectedTab)----------------generateXLabels(xAxisData, selectedTab)')
  }, [selectedTab]);

  useEffect(() => {
    const chart = echarts.init(chartRef.current);

    console.log(xLabelsArr, 'seriesDataseriesDataseriesDataseriesDataseriesData')
    
    const option = {
      grid: {
        left: isMobile ? '38px' : "58px",
        right: 0,
        top: "40px",
        bottom: "15%",
      },
      tooltip: {
        axisPointer: {
          type: 'cross',
        },
      },
      xAxis: {
        data: xAxisData,
        interval:24,
        min: 0,
        axisLabel: {
          margin: 18,
          color: "#C9FDD9",
          show: false,
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
          lineStyle: {
            type: "dashed",
            color: "rgba(104,218,164,0.2)",
            width: 2,
          },
        },
      },
      yAxis: {
        splitLine: {
          show: true,
          lineStyle: {
            type: "dashed",
            color: "rgba(104,218,164,0.2)",
            width: 2,
          },
        },
        axisLabel: {
          color: "#C9FDD9",
          formatter: (value) => `${(value * 100).toFixed(0)}%`,
        },
      },
      visualMap: {
        show: false,
        top: 10,
        right: 10,
        pieces: [
          {
            gt: 0,
            lte: 10000000000000,
            color: "#19D076",
          },
        ],
        outOfRange: {
          color: "#FF4D00",
        },
      },
      series: [
        {
          type: "line",
          symbol: "none",
          data: seriesData,
        },
      ],
    };
    chart.setOption(option);

    // 添加 resize 事件监听器
    const resizeHandler = () => {
      if (chart != null) {
        chart.resize();
      }
    };

    window.addEventListener("resize", resizeHandler);

    // 在组件卸载时销毁图表对象和 resize 事件监听器，防止内存泄漏
    return () => {
      if (chart != null) {
        chart.dispose();
      }
      window.removeEventListener("resize", resizeHandler);
    };
  }, [data]);

  return (
    <div style={{ width: "100%", height: "460px", position: "relative" }} className="chartDiv">
      <div ref={chartRef} style={{ width: "100%", height: isMobile ? "240px" : "460px", fontFamily: "Work Sans, Work Sans" }} />
      {((data || [])?.length !== 0 && !isMobile) && (
        <div
          className="chartBorder"
          style={{
            position: "absolute",
            border: "1px solid rgba(104,218,164,0.2)",
            left: "2%",
            bottom: "25px",
            right: 0,
            width: "98%",
          }}
        ></div>
      )}
      <div style={{
          width: "100%",
          position: "absolute",
          bottom: isMobile ? "-7px" : "2px",
          }}>
        <div className="xLabel" style={{paddingLeft: isMobile ? "32px" : "58px"}}>
          {
            xLabelsArr?.map(item => (
              <div className="xLabelItem" key={item}>{item}</div>
            ))
          }
        </div>
      </div>
      { data.length === 0 && (
        <div
        className="chartInfo"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "rgba(187, 255, 214, 0.6)",
            fontSize: "16px",
          }}
        >
          <img src={lb_icon_wjl} alt="lb_icon_wjl"/>
        </div>
      )} 
    </div>
  );
};

export default PositiveLineChart;
