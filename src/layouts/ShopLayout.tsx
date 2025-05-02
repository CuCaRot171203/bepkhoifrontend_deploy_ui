import React, { createContext, useEffect, useState } from "react";
import HeaderShop from "../components/Shop/HeaderShop";
import FooterShop from "../components/Shop/FooterShop";
import { Outlet } from "react-router-dom";
import { ModelModeContext } from "../context/ModelModeContext";

interface ShopLayoutProps {
  modelMode: string;
}

const ShopLayout: React.FC<ShopLayoutProps> = ({ modelMode }) => {
  const [activeTab, setActiveTab] = useState("home");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (!isMobile) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#faedd7] text-center text-gray-800 text-[0.9vw] p-[2vw]">
        Phiên bản máy tính bàn hiện không hỗ trợ đặt món. Vui lòng sử dụng thiết
        bị di động hoặc máy tính bảng!
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <div className="sticky top-0 z-50 w-full">
        <HeaderShop setActiveTab={setActiveTab} />
      </div>

      <ModelModeContext.Provider value={modelMode}>
        <div className="min-h-screen w-full bg-gray-100 flex flex-col">
          <Outlet />
        </div>
      </ModelModeContext.Provider>

      <div className="sticky bottom-0 z-50 w-full">
        <FooterShop />
      </div>
    </div>
  );
};

export default ShopLayout;
