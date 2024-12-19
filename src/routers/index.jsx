/*
 * @description: 描述信息
 * @author: chenhua
 * @Date: 2023-02-07 19:35:39
 * @LastEditors: chenhua
 * @LastEditTime: 2024-07-22 09:48:39
 */
import RanKing from "@views/ranKing";
import MyPortfoLio from "@views/myPortfoLio";
import MyFollowing from "@views/myFollowing";
import Notification from "@views/notification";
import MyInfo from "@views/myInfo";
import Purchase from "@views/purchase";

const iconStyle = {
  fontSize: "18px",
  // marginLeft: '7px',
  color: '#152121',
  width: '17px',
  height: '17px'
};

const iconView = (props) => {
  return <i className={[`iconfont muneIcon`]} style={iconStyle} dangerouslySetInnerHTML={{ __html: props }} />;
};

const routers = [
  {
    label: "Ranking",
    path: "/",
    isTrue: true,
    icon: iconView("&#xe693;"),
    // icon: <HomeOutlined />,
    element: <RanKing />,
  },
  {
    label: "Purchase",
    path: "/Purchase",
    isTrue: false,
    // icon: <HomeOutlined />,
    // icon: iconView("&#xe691;"),
    element: <Purchase />,
  },
  {
    label: "My Portfolio",
    path: "/myPortfoLio",
    isTrue: true,
    // icon: <FundOutlined />,
    icon: iconView("&#xe691;"),
    element: <MyPortfoLio />,
  },
  {
    label: "My Following",
    path: "/myFollowing",
    isTrue: true,
    // icon: <ProfileOutlined />,
    icon: iconView("&#xe692;"),
    element: <MyFollowing />,
  },
  {
    label: "Notification",
    path: "/notification",
    isTrue: true,
    // icon: <BellOutlined />,
    icon: iconView("&#xe690;"),
    element: <Notification />,
  },
  // {
  //   label: "MyWatchimg",
  //   path: "/myWatchimg",
  //   isTrue: true,
  //   icon: <TrademarkCircleOutlined />,
  //   element: <MyWatchimg />,
  // },
  {
    label: "MyInfo",
    path: "/myInfo",
    isTrue: false,
    icon: iconView("icon-duihuandadingdan"),
    element: <MyInfo />,
  },
];
export default routers;
