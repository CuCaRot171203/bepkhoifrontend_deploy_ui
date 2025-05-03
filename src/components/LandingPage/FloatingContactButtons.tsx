import React from "react";
import {
  PhoneOutlined,
  MessageOutlined,
  RobotOutlined,
} from "@ant-design/icons";

const FloatingContactButtons = () => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-4 items-end">
      {/* <button
        title="Chatbot AI"
        className="w-[3.5vw] h-[3.5vw] bg-orange-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition"
        onClick={() => console.log("Open chatbot")}
      >
        <RobotOutlined />
      </button> */}

      {/* Messenger */}
      <a
        href="https://m.me/yourpage"
        target="_blank"
        rel="noopener noreferrer"
        className="w-[3.5vw] h-[3.5vw] bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition"
      >
        <MessageOutlined />
      </a>

      {/* Zalo */}
      <a
        href="https://zalo.me/0975307087"
        target="_blank"
        rel="noopener noreferrer"
        className="w-[3.5vw] h-[3.5vw] bg-[#0068FF] text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition font-bold text-[1.3vw]"
      >
        Z
      </a>

      {/* Calling */}
      <a
        href="tel:0912345678"
        className="w-[3.5vw] h-[3.5vw] bg-green-500 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition"
      >
        <PhoneOutlined />
      </a>
    </div>
  );
};

export default FloatingContactButtons;
