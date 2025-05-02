import React from "react";
import failure from "../../styles/POS/images/FAILVNPAY.png";
import { LeftOutlined } from "@ant-design/icons";

const VnpayFailure: React.FC = () => {
  return (
    <div className="w-full h-screen bg-gray-100 flex">
      <div className="m-auto text-start bg-white p-10 rounded-lg shadow-lg flex flex-row">
        <div className="">
          <img src={failure} alt="" className="w-[6vw]" />
        </div>
        <div className="flex flex-col justify-center items-start ml-4">
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            Giao dịch thất bại
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

export default VnpayFailure;
