import React, { useEffect, useState } from "react";
import HeaderManage from "../components/Manage/HeaderManage";
import { Outlet } from "react-router-dom";

const ManageLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  if (isMobile) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-[#faedd7] text-center text-gray-800 text-[2.1vw] p-[2vw]">
        Màn hình này không thể hoạt động trên thiết bị di động
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex flex-col">
      <HeaderManage />
      <div className="flex-1 overflow-auto p-4">
        <Outlet />
      </div>
    </div>
  );
};

export default ManageLayout;
