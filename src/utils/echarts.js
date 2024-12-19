/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2023-06-14 09:44:38
 * @LastEditors: chenhua
 * @LastEditTime: 2023-06-27 10:55:13
 */
import * as echarts from "echarts";
import _ from "lodash";
export function LineOptionModel(options) {
  //折线图
  const option = {
    tooltip: {
      trigger: "axis",
    },
    legend: {
      bottom: "0%",
      textStyle: {
        // 图例文字大小颜色
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.35)",
      },
      itemWidth: 23,
      itemHeight: 8,
      data: ["本年", "去年"],
    },
    grid: {
      top: "10%",
      left: "10%",
      right: "4%",
      bottom: window.innerWidth < 1440 ? "24%" : "20%",
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#979797",
          width: 0,
          type: "solid",
        },
      },
      axisLabel: {
        show: true,
        // textStyle: {
        color: "rgba(255,255,255,0.4)",
        // },
      },
      data: options.mounth, //["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
      splitLine: {
        // 分割线配置
        show: true,
        lineStyle: {
          color: "rgba(255,255,255,0.1)",
        },
      },
      axisLabel: {
        show: true,
        // textStyle: {
        color: "rgba(255,255,255,0.6)",
        // },
      },
    },
    series: [
      {
        name: "本年",
        type: "line",
        stack: "Total",
        data: options.currentYearData, //[120, 132, 101, 134, 90, 230, 210],
      },
      {
        name: "去年",
        type: "line",
        stack: "Total",
        data: options.lastYearData, //[220, 182, 191, 234, 290, 330, 310],
      },
    ],
  };
  return option;
}

export function LineOptionGradientModel(options) {
  const option = {
    tooltip: {
      trigger: "item",
    },
    grid: {
      // show: true,
      bottom: 40,
      top: 30,
      left: 60,
      right: 30,
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#979797",
          width: 0,
          type: "solid",
        },
      },
      axisLabel: {
        show: true,
        // textStyle: {
        color: "rgba(255,255,255,0.6)",
        // },
      },
      data: _.map(options, (item) => item.key),
    },
    yAxis: {
      type: "value",
      splitLine: {
        // 分割线配置
        show: true,
        lineStyle: {
          color: "rgba(255,255,255,0.1)",
        },
      },
      axisLabel: {
        show: true,
        // textStyle: {
        color: "rgba(255,255,255,0.6)",
        // },
      },
    },
    series: [
      {
        data: _.map(options, (item) => item.value),
        type: "line",
        lineStyle: {
          width: 1,
          color: "#66E2FF",
        },
        symbol: "circle",
        itemStyle: {
          color: "#66E2FF", // 小圆点和线的颜色
        },
        areaStyle: {
          // 区域填充样式
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: "rgba(102,226,255,0)",
            },
            {
              offset: 1,
              color: "#66E2FF",
            },
          ]),
        },
      },
    ],
  };
  return option;
}

export function pieOptionModel(options) {
  const option = {
    tooltip: {
      trigger: "item",
    },
    title: {
      x: "center",
      top: "33%",
      textStyle: {
        fontFamily: "PingFang-SC-Bold, PingFang-SC",
        fontSize: 14,
        fontWeight: "bold",
        color: "#FFFFFF",
      },
      subtextStyle: {
        fontFamily: "PingFang-SC-Bold, PingFang-SC",
        fontSize: 14,
        fontWeight: "bold",
        color: "#FFFFFF",
      },
      label: {
        // 在文本中，可以对部分文本采用 rich 中定义样式。
        // 这里需要在文本中使用标记符号：
        // `{styleName|text content text content}` 标记样式名。
        // 注意，换行仍是使用 '\n'。
        formatter: ["{a|这段文本采用样式a}", "{b|这段文本采用样式b}这段用默认样式{x|这段用样式x}"].join("\n"),
      },
    },
    legend: {
      show: true,
      width: "60%",
      icon: "circle",
      itemGap: 20,
      itemWidth: 8,
      itemHeight: 8,
      orient: "horizontal",
      bottom: "0%",
      textStyle: {
        color: "#fff",
      },
    },
    color: ["#087BFE", "#A5E36D"],
    series: [
      {
        name: "",
        type: "pie",
        radius: window.innerWidth < 1440 ? ["20%", "40%"] : ["40%", "65%"],
        center: ["50%", "45%"],
        avoidLabelOverlap: false,
        // label: {
        //   normal: {
        //     textStyle: {
        //       color: "#595959", // 提示文字颜色
        //       fontSize: 9, // 提示文字大小
        //     },
        //   },
        // },
        data: options,
        emphasis: {
          label: false,
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
          },
        },
        label: {
          // formatter: "{d}% {b} \n\n",
          padding: [0, -20], //取消hr线跟延长线之间的间隙
          // color: "#333",
          itemStyle: {
            color: "#66E2FF", // 小圆点和线的颜色
          },

          show: true,
          formatter: "{name|{d}%} {time|{b}} \n\n", //饼图图例 name和rich中的name是同一个东西，用来设置百分比的颜色，time和name同理
          rich: {
            hr: {
              backgroundColor: "#999",
              height: 1,
              width: "80%",
              borderWidth: 0,
              borderColor: "#999",
              borderRadius: 0,
            },
            name: {
              color: "#66E2FF",
              fontSize: 12,
              padding: [0, 0, 0, 5],
            },
            time: {
              color: "#FFFFFF", // 百分比颜色
              fontSize: 12,
            },
          },
        },
        // showEmptyCircle: [200, 100],
      },
    ],
  };
  return option;
}

export function barOptionModel(options) {
  const option = {
    tooltip: {
      trigger: "item",
    },
    legend: {
      bottom: "0%",
      textStyle: {
        // 图例文字大小颜色
        fontSize: 12,
        color: "rgba(255, 255, 255, 0.35)",
      },
      itemWidth: 12,
      itemHeight: 12,
      data: ["总计", "本年"],
    },
    grid: {
      top: "10%",
      left: "10%",
      right: "4%",
      bottom: window.innerWidth < 1440 ? "24%" : "20%",
    },
    xAxis: {
      type: "category",
      axisLine: {
        show: true,
        lineStyle: {
          color: "#979797",
          width: 0,
          type: "solid",
        },
      },
      axisLabel: {
        show: true,
        interval: 0,
        fontSize: window.innerWidth < 1440 && 10,
        // textStyle: {
        color: "rgba(255,255,255,0.4)",
        // },
      },
      data: _.map(options?.thisYearStatistics?.eachCount, (item) => item.key),
    },
    yAxis: {
      type: "value",
      splitLine: {
        // 分割线配置
        show: true,
        lineStyle: {
          color: "rgba(255,255,255,0.1)",
        },
      },
      axisLabel: {
        show: true,
        // textStyle: {
        color: "rgba(255,255,255,0.6)",
        // },
      },
    },
    series: [
      {
        name: "总计",
        data: _.map(options?.totalStatistics?.eachCount, (item) => item.value),
        type: "bar",
        itemStyle: {
          color: "#087BFE",
          // normal: { color: "#087BFE" },
        },
        barWidth: 24,
      },
      {
        name: "本年",
        data: _.map(options?.thisYearStatistics?.eachCount, (item) => item.value),
        type: "bar",
        barGap: "-100%", //移动第二个柱子的位置实现重叠
        // z: "-1", //改变这根柱子的层级使这根柱子在下面
        itemStyle: {
          color: "#A5E36D",
          // normal: { color: "#A5E36D" },
        },
        barWidth: 24,
      },
    ],
  };
  return option;
}

export function barOptionPlaceModel(options) {
  const option = {
    grid: {
      top: "8%",
      left: window.innerWidth < 1440 ? "26%" : "22%",
      right: "4%",
      bottom: "0%",
    },
    xAxis: [
      //x轴数据设置
      {
        show: false,
        type: "value",
        name: "人数",
        min: 0,
        // max: 150,
        //interval: 30, //间隔数
        // splitNumber: 5,
        axisLabel: {
          formatter: "{value} ",
        },
        splitLine: {
          show: false,
        },
        axisLine: {
          //这是y轴文字颜色
          show: false,
          lineStyle: {
            color: "#65C6E7",
          },
        },
      },
    ],
    yAxis: [
      {
        // show: false,
        type: "category",
        offset: 0,
        // axisLine: {
        //   //这是x轴文字颜色
        //   lineStyle: {
        //     color: "transparent",
        //   },
        // },
        data: _.reverse(_.map(options.businessScaleList, (item) => item.name)), //["111", "222", "333"],
        axisPointer: {
          type: "shadow",
        },
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false, // 不显示坐标轴线
          lineStyle: {
            color: "#ffffff",
            fontSize: 14,
          },
        },
      },
    ],
    series: [
      {
        data: _.reverse(_.map(options.businessScaleList, (item) => item.number)),
        type: "bar",
        barWidth: 14,
        label: {
          normal: {
            show: true,
            position: "right",
            color: "rgba(255,255,255,0.7)",
          },
        },
        itemStyle: {
          //通常情况下：
          normal: {
            //每个柱子的颜色即为colorList数组里的每一项，如果柱子数目多于colorList的长度，则柱子颜色循环使用该数组
            color: new echarts.graphic.LinearGradient(1, 1, 0, 0, [
              {
                offset: 0,
                color: "#097CFF",
              },
              {
                offset: 1,
                color: "rgba(9,124,255,0)",
              },
            ]),
          },
        },
      },
    ],
  };
  return option;
}
