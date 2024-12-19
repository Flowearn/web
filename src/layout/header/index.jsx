import { Layout, Input, Divider } from "antd";
import "./index.scss";
import login_icon_Google from "@/statics/images/login_icon_Google.png";
import login_icon_id from "@/statics/images/login_icon_id.png";
import login_icon_fb from "@/statics/images/login_icon_fb.png";
import login_icon_weixin from "@/statics/images/login_icon_weixin.png";
import ThModal from "@comp/modal";
import LoginWallet from "@comp/loginWallet";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { getAvatarReducer, getNickNameReducer } from "@redux/reselectors";
import utils from "@utils/utils";
import { getAccountInfo } from "@/services/index";
import aptHeader from "@statics/images/apt_logo.svg";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import logo from "@/statics/images/logo1.svg";

const { Header } = Layout;
const fileUrl = import.meta.env.VITE_FILE_ACCESS_API;
const placeholderImg = "path_to_placeholder_image"; // Provide a path to a placeholder image

function HeaderBar() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  // const [userInfo, setUserInfo] = useState(JSON.parse(localStorage.getItem("userInfo")) || {});
  const userInfo = JSON.parse(localStorage.getItem("userInfo")) || {};
  const avatarUrl = useSelector(getAvatarReducer);
  const nickName = useSelector(getNickNameReducer);
  const [info, setInfo] = useState({});

  const { connected } = useWallet();

  useEffect(() => {
    if (!connected) {
      setIsShow(false);
    } else {
      if (userInfo?.address) {
        setIsShow(true);
        queryAccountInfo();
      }
    }
  }, [connected, userInfo?.address]);

  const handleMyInfo = () => {
    navigate("/myInfo");
  };

  const queryAccountInfo = async () => {
    try {
      const res = await getAccountInfo();
      console.log("Account Info:", res);
      setImgUrl(res.image);
      setInfo(res);
    } catch (error) {
      console.error("Error fetching account info:", error);
    }
  };

  const handleEth = async () => {
    window.open("https://tally.so/r/3E15Zr", "_blank");
  };

  // const handleLogin = async (info) => {console.log(info, '999999999999988888888888888888888888')
  //   if (info.address) {
  //     setIsShow(true);
  //     queryAccountInfo();
  //     // const updatedUserInfo = { ...userInfo, address: info.address };
  //     // localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));
  //     // setUserInfo(info);
  //   }
  // };

  const handleRanling = (item) => {
    navigate(`/`);
  };

  return (
    <Header className="header">
      <div className="header-left">
        <p onClick={handleRanling} style={{ cursor: "pointer", margin: "50px 0 30px", textAlign: "center" }}>
          <img src={logo} style={{ width: "215px", height: "24px" }} />
        </p>
      </div>
      <div className="header-right">
        {console.log(!isShow, "dispatchdispatchdispatch", userInfo, "!isShow && userInfo?.address-------------")}
        {connected && userInfo.address ? (
          <div className="loginBtn">
            <div className="login testBth" style={{ padding: "0", width: "50px", height: "50px", textAlign: "center" }}>
              <img
                className="eth ethImg"
                src={aptHeader}
                alt="SVG_Image"
                style={{ marginRight: "0", margin: "auto" }}
              />
              {/*  onClick={handleEth} <span>Click for test ATP</span> */}
            </div>
            <div className="login accountBox" onClick={handleMyInfo}>
              {
                console.log(avatarUrl)
              }
              <img
                className="eth avabox"
                src={avatarUrl ? `${fileUrl}${avatarUrl}` : (imgUrl ? `${fileUrl}${imgUrl}` : `${fileUrl}${userInfo.image}`)}
                alt="avatar"
              />
              <div className="login-font">
                <h6>{nickName ? nickName : info.nickname ? info.nickname : utils.shortAccount(userInfo.address, 2)}</h6>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              className="login testBth"
              style={{ padding: "0", width: "50px", height: "50px", textAlign: "center", marginLeft: "auto" }}
            >
              <img
                className="eth ethImg"
                src={aptHeader}
                alt="SVG_Image"
                style={{ marginRight: "0", margin: "auto" }}
              />
              {/*  onClick={handleEth} <span>Click for test ATP</span> */}
            </div>
            <LoginWallet type={true} />
          </>
        )}
      </div>
      <ThModal
        width={423}
        styles={{ minHeight: 618, maxHeight: 618, overflowY: "auto" }}
        className="modal"
        centered
        title=""
        footer={null}
        open={showModal}
        onCancel={() => setShowModal(false)}
      >
        <h1 className="title">traders.tech</h1>
        <div className="google">
          <img src={login_icon_Google} alt="google" />
          <span>Connect Wallet</span>
        </div>
        <div className="list">
          <div className="list-item">
            <img src={login_icon_id} alt="" />
          </div>
          <div className="list-item">
            <img src={login_icon_fb} alt="" />
          </div>
          <div className="list-item">
            <img src={login_icon_weixin} alt="" />
          </div>
        </div>
        <div className="email">
          <h6>Email / Phone Number</h6>
          <Input />
        </div>
        <Divider plain>Or</Divider>
        <h5 className="connect">Connect with Existing wallet</h5>
        <div className="google">
          <span>Connect Wallet</span>
        </div>
      </ThModal>
    </Header>
  );
}

export default HeaderBar;
