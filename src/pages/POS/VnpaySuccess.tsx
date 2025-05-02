import React from "react";
import success from "../../styles/POS/images/DONEVNPAY.png";
import { LeftOutlined } from "@ant-design/icons";

const VnpaySuccess: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-100 flex">
      <div className="m-auto text-start bg-white p-10 rounded-lg shadow-lg flex flex-row">
        <div className="">
          <img src={success} alt="" className="w-[6vw]" />
        </div>
        <div className="flex flex-col justify-center items-start ml-4">
          <h1 className="text-2xl font-bold mb-4 text-green-600">
            Giao dịch thành công
          </h1>
          <p className="text-lg">
            Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
          </p>
          <button
            className="mt-4 px-4 py-2 bg-[#ffc875] text-black font-semibold rounded-[0.5vw] hover:bg-[#e7b05d] transition duration-300"
            onClick={() => (window.location.href = "/")}
          >
            <LeftOutlined className="mr-[0.5vw]" />
            Quay lại trang chủ
          </button>
        </div>
      </div>
    </div>
  );
};

export default VnpaySuccess;
