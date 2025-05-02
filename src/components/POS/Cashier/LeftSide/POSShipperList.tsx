import React, { useState, useEffect } from "react";
import { message } from "antd";
import {
  CarOutlined,
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../../context/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_APP_ENDPOINT;

interface Props {
  selectedShipper: number | null;
  setSelectedShipper: (shipperId: number | null) => void;
  selectedTable: number | null;
  setSelectedTable: (tableId: number | null) => void;
  orderType: number | null;
  setOrderType: (shipperId: number | null) => void;
}

const ITEMS_PER_PAGE = 8;

interface Shipper {
  shipperId: number;
  shipperName: string;
  phone: string;
  email?: string;
  isActive: boolean;
}

export interface ShipperDTO {
  userId: number;
  userName: string;
  phone: string;
  status: boolean;
}

async function fetchShipperList(
  token: string,
  clearAuthInfo: () => void
): Promise<ShipperDTO[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/Shipper`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.status === 401) {
      clearAuthInfo();
      message.error(
        "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại."
      );
      return [];
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Lỗi khi lấy danh sách shipper: ${errorText}`);
    }

    const data: ShipperDTO[] = await response.json();
    const activeShippers = data.filter((shipper) => shipper.status === true);
    return activeShippers;
  } catch (error) {
    console.error("Lỗi khi gọi API shipper:", error);
    throw error;
  }
}

const POSShipperList: React.FC<Props> = ({
  selectedShipper,
  setSelectedShipper,
  selectedTable,
  setSelectedTable,
  orderType,
  setOrderType,
}) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [shippers, setShippers] = useState<Shipper[]>([]);
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentItems = shippers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    const loadShippers = async () => {
      try {
        const data = await fetchShipperList(
          authInfo?.token || "",
          clearAuthInfo
        );
        const mapped: Shipper[] = data.map((item) => ({
          shipperId: item.userId,
          shipperName: item.userName,
          phone: item.phone,
          isActive: item.status,
        }));
        setShippers(mapped);
      } catch (err) {
        message.error("Không thể tải danh sách shipper.");
      }
    };

    loadShippers();
  }, []);

  const handleSelectItem = (item: Shipper) => {
    setSelectedShipper(item.shipperId);
    setSelectedTable(null);
    setOrderType(2);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-4 grid grid-cols-4 gap-4 grid-rows-2 overflow-y-auto">
        <div
          key="takeaway"
          className={`rounded-lg overflow-hidden pt-1 flex flex-col w-full h-[11vw] items-center transition-colors duration-200 shadow-md
            ${
              selectedShipper === null && selectedTable === null
                ? "bg-blue-300"
                : hoveredId === 0
                ? "bg-[#FAEDD7]"
                : "bg-[#fffbf5]"
            }`}
          onMouseEnter={() => setHoveredId(0)}
          onMouseLeave={() => setHoveredId(null)}
          onClick={() => {
            setSelectedShipper(null);
            setSelectedTable(null);
            setOrderType(1);
          }}
        >
          <div className="relative flex flex-col items-center w-full gap-1">
            <div className="absolute justify-center rounded-lg p-2 flex flex-col items-center">
              <div className="w-[5vw] rounded-full bg-yellow-300 flex items-center justify-center h-[5vw]">
                <ShoppingCartOutlined />
              </div>
              <div className="absolute w-[90%] text-[0.9vw] text-center translate-y-[6vw] bg-white text-black font-semibold z-10 rounded-lg p-1">
                Mang về
              </div>
            </div>
          </div>
        </div>

        {currentItems.map((item) => (
          <div
            key={item.shipperId}
            className={`rounded-lg overflow-hidden pt-1 flex flex-col w-full h-[11vw] items-center transition-colors duration-200 shadow-md
              ${
                item.shipperId === selectedShipper
                  ? "bg-blue-300"
                  : item.shipperId === hoveredId
                  ? "bg-[#FAEDD7]"
                  : "bg-[#fffbf5]"
              }`}
            onMouseEnter={() => setHoveredId(item.shipperId)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => handleSelectItem(item)}
          >
            <div className="relative flex flex-col items-center w-full gap-1">
              <div className="absolute justify-center rounded-lg p-2 flex flex-col items-center">
                <div className="w-[5vw] rounded-full bg-gray-300 flex items-center justify-center h-[5vw]">
                  <CarOutlined />
                </div>
                <div className="absolute w-[90%] text-[0.9vw] text-center translate-y-[6vw] bg-white text-black font-semibold z-10 rounded-lg p-1">
                  {item.shipperName}
                </div>
              </div>
            </div>
            <div className="relative translate-y-[7.5vw] text-[0.8vw] flex justify-center overflow-hidden text-center text-black font-semibold w-[80%] h-[3vw] whitespace-nowrap">
              <div className="absolute w-[90%] flex justify-center">
                {item.phone}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 flex justify-end gap-2 flex-shrink-0 bg-white sticky bottom-0 shadow-md">
        <LeftOutlined
          className={`cursor-pointer ${
            currentPage === 1 ? "opacity-50 pointer-events-none" : ""
          }`}
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
        />
        <span>
          {currentPage} /{" "}
          {Math.max(1, Math.ceil(shippers.length / ITEMS_PER_PAGE))}
        </span>
        <RightOutlined
          className={`cursor-pointer ${
            startIndex + ITEMS_PER_PAGE >= shippers.length
              ? "opacity-50 pointer-events-none"
              : ""
          }`}
          onClick={() =>
            startIndex + ITEMS_PER_PAGE < shippers.length &&
            setCurrentPage(currentPage + 1)
          }
        />
      </div>
    </div>
  );
};

export default POSShipperList;
