import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import image1 from "../../styles/LoginPage/images/login_image.png";
import logoBepKhoi from "../../styles/LoginPage/images/logoBepKhoi.png";
import { KeyOutlined, LeftOutlined, MailOutlined } from "@ant-design/icons";
import { message } from "antd";
const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    if (!email) {
      alert("Vui lòng nhập email.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/Passwords/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(email),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Gửi yêu cầu thất bại.");
      }

      message.success(
        "Đã gửi yêu cầu khôi phục mật khẩu. Vui lòng kiểm tra email!"
      );
    } catch (error: any) {
      message.error("Lỗi: " + error.message);
    }
  };

  return (
    <div className="w-full h-[100vh] bg-[#FFFAF3] flex items-center justify-between">
      <div className="w-[50vw]">
        <img
          src={image1}
          alt=""
          className="w-[50vw] h-[100vh] object-cover z-10"
        />
      </div>

      <div className="w-[50vw] h-[100vh] flex items-center justify-center">
        <div className="w-[30vw] h-[30vw] bg-[#FFF1D6] rounded-[2vw] shadow-[0_0_2vw_0_rgba(0,0,0,0.2)] flex flex-col items-center justify-center">
          <div className="flex flex-col justify-evenly items-center w-full mb-[2vw]">
            <div className="w-[80%] flex flex-row items-center mb-[2vw]">
              <img
                src={logoBepKhoi}
                alt=""
                className="w-[5vw] h-auto hover:cursor-pointer"
                onClick={() => navigate("/")}
              />
              <div className="text-[2vw] font-bold text-gray-800 ml-[1vw]">
                <h1 className="uppercase text-[1.7vw]">Nhà Hàng Bếp Khói</h1>
                <p className="text-[1.2vw] italic text-gray-500">
                  Nâng niu văn hóa ẩm thực Việt
                </p>
              </div>
            </div>
            <h1 className="text-[2vw] font-bold text-[#FF8C00] mb-[1vw]">
              <KeyOutlined /> ĐẶT LẠI MẬT KHẨU
            </h1>
          </div>
          <input
            type="email"
            placeholder="Nhập email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[80%] h-[3vw] px-[2vw] rounded-[1vw] border border-[#FF8C00] mb-[2vw] focus:outline-none focus:border-[#FF8C00]"
          />
          <div className="flex flex-row justify-evenly items-center w-full mx-auto">
            <button
              onClick={() => navigate("/login")}
              className="w-[38%] h-[3vw] bg-[#3f3f3f] text-white font-semibold rounded-[1vw] hover:bg-[#242424] transition duration-300"
            >
              <LeftOutlined className="mr-[0.2vw]" />
              Login
            </button>
            <button
              onClick={handleResetPassword}
              className="w-[38%] h-[3vw] bg-[#FF8C00] text-white font-semibold rounded-[1vw] hover:bg-[#FF6F00] transition duration-300"
            >
              <MailOutlined className="mr-[0.5vw]" />
              Gửi yêu cầu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
