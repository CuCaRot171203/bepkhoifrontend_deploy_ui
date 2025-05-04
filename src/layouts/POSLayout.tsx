import React, { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import ModelLeftSide from "../components/POS/Cashier/LeftSide/ModelLeftSide";
import ModelRightSide from "../components/POS/Cashier/RightSide/ModelRightSide";
import useSignalR from "../CustomHook/useSignalR";
import { message } from "antd";
import HeaderManage from "../components/POS/PosHeader";

const POSLayout: React.FC = () => {
  const location = useLocation();
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedShipper, setSelectedShipper] = useState<number | null>(null);
  const [orderType, setOrderType] = useState<number | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [customerJoinList, setCustomerJoinList] = useState<string[]>([]);

  const handleSelectTable = (tableId: number | null) => {
    setSelectedTable(tableId);
  };
  interface CustomerJoinEvent {
    roomId: number;
    customerId: number;
    customerName: string;
    phone: string;
  }
  const debounceCustomerJoin = useCallback(() => {
    return (data: CustomerJoinEvent) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        message.info(
          `Khách hàng ${data.customerName} (ID: ${data.customerId}, SĐT: ${data.phone}) đã vào bàn ${data.roomId}`
        );
        setCustomerJoinList((prevList) => [
          ...prevList,
          `Khách hàng ${data.customerName} - SĐT: ${data.phone} đã vào bàn ${data.roomId}`,
        ]);
      }, 500);
    };
  }, []);
  useSignalR(
    {
      eventName: "CustomerJoin",
      groupName: "common",
      callback: debounceCustomerJoin(),
    },
    [debounceCustomerJoin]
  );
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
      <div className="min-h-screen w-full flex items-center justify-center bg-[#faedd7] text-center text-gray-800 text-[3.5vw] p-[2vw]">
        Màn hình này không thể hoạt động trên thiết bị di động
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#faedd7] flex flex-col">
      {/* Header nằm trên cùng */}
      {/*<HeaderManage />*/}

      {location.pathname === "/pos/cashier" ? (
        <div className="flex flex-1 gap-2.5 p-4">
          <div className="w-1/2">
            <ModelLeftSide
              selectedTable={selectedTable}
              setSelectedTable={handleSelectTable}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
              selectedShipper={selectedShipper}
              setSelectedShipper={setSelectedShipper}
              orderType={orderType}
              setOrderType={setOrderType}
              customerJoinList={customerJoinList}
            />
          </div>
          <div className="w-1/2">
            <ModelRightSide
              selectedTable={selectedTable}
              selectedShipper={selectedShipper}
              orderType={orderType}
              selectedOrder={selectedOrder}
              setSelectedOrder={setSelectedOrder}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto p-4">
          <Outlet />
        </div>
      )}
    </div>
  );
};

export default POSLayout;
