import React, { useState, useEffect } from "react";
import UserList from "../../components/Manage/Shipper/UserList";
import Sidebar from "../../components/Manage/Cashier/Sidebar";
import { Button, message } from "antd";
import { PlusOutlined, FileExcelOutlined } from "@ant-design/icons";
import AddShipperModal from "../../components/Manage/Shipper/AddShipperModal";
import ShipperDetailModal from "../../components/Manage/Shipper/ShipperDetailModal";
import UserUpdateModal from "../../components/Manage/Cashier/UserUpdateModal";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

interface UserProps {
  userId: number;
  userName: string;
  phone: string;
  status: string;
  email: string;
  date_of_Birth: string;
  address: string;
  ward_Commune: string;
  district: string;
  province_City: string;
  roleName: string;
}

const ShipperManagePage: React.FC = () => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [items, setItems] = useState<UserProps[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  const [detailData, setDetailData] = useState<UserProps | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState(false);
  const [updateData, setUpdateData] = useState<UserProps | null>(null);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);

  const fetchProvinces = async () => {
    try {
      const res = await axios.get(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/province",
        { headers: { Token: process.env.REACT_APP_GHN_TOKEN || "" } }
      );
      setProvinces(res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy tỉnh/thành:", err);
    }
  };

  const fetchDistricts = async (provinceId: number) => {
    try {
      const res = await axios.post(
        "https://online-gateway.ghn.vn/shiip/public-api/master-data/district",
        { province_id: provinceId },
        { headers: { Token: process.env.REACT_APP_GHN_TOKEN || "" } }
      );
      setDistricts(res.data.data);
      setWards([]);
      setSelectedDistrict(null);
    } catch (err) {
      console.error("Lỗi khi lấy quận/huyện:", err);
    }
  };

  const fetchWards = async (districtId: number) => {
    try {
      const res = await axios.get(
        `https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${districtId}`,
        { headers: { Token: process.env.REACT_APP_GHN_TOKEN || "" } }
      );
      setWards(res.data.data);
    } catch (err) {
      console.error("Lỗi khi lấy phường/xã:", err);
    }
  };

  const fetchShippers = async () => {
    setLoading(true);
    try {
      let apiUrl = `${
        process.env.REACT_APP_API_APP_ENDPOINT
      }/api/Shipper/search?searchTerm=${encodeURIComponent(search.trim())}`;
      if (status === "1" || status === "0") {
        const statusValue = status === "1" ? "true" : "false";
        apiUrl += `&status=${statusValue}`;
      }

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${authInfo?.token}`,
          "Content-Type": "application/json; charset=utf-8",
        },
      });

      if (response.status === 401) {
        clearAuthInfo();
        message.error(
          "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại."
        );
        return;
      }

      const data = await response.json();
      setItems(data ?? []);
      setTotal(data.length || 0);
    } catch (error) {
      console.error("Error fetching: ", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchShipperDetail = async (userId: number) => {
    setLoadingDetail(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}/api/Shipper/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${authInfo?.token}`,
            "Content-Type": "application/json; charset=utf-8",
          },
          credentials: "include",
        }
      );

      if (response.status === 401) {
        clearAuthInfo();
        message.error(
          "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại."
        );
        return;
      }

      const data = await response.json();
      setDetailData(data);
    } catch (error) {
      message.error("Lỗi khi tải chi tiết shipper");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleAddShipper = async (formData: any) => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return false;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}/api/Shipper`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authInfo?.token}`,
          },
          credentials: "include",
          body: JSON.stringify(formData),
        }
      );

      if (response.status === 401) {
        clearAuthInfo();
        message.error(
          "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại."
        );
        return false;
      }

      if (!response.ok) {
        const errorData = await response.json();
        message.error(errorData.message || "Lỗi khi thêm shipper");
        return false;
      }

      const successMessage = await response.text();
      message.success(successMessage || "Shipper đã được thêm thành công!");
      fetchShippers();
      return true;
    } catch (error) {
      message.error("Lỗi khi thêm shipper");
      return false;
    }
  };

  const handleUpdateShipper = async (userId: number, data: any) => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return false;
    }

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_APP_ENDPOINT}/api/Shipper/${userId}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authInfo?.token}`,
          },
          withCredentials: true,
        }
      );

      message.success("Cập nhật thành công!");
      fetchShippers();
      return true;
    } catch (error: any) {
      if (error.response?.status === 401) {
        clearAuthInfo();
        message.error(
          "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại."
        );
        return false;
      }
      message.error(
        `Cập nhật thất bại! Lỗi: ${
          error.response?.data?.message || error.message
        }`
      );
      return false;
    }
  };

  const handleDeleteShipper = async (userId: number, userName: string) => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return false;
    }

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_APP_ENDPOINT}/${userId}`,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            Authorization: `Bearer ${authInfo?.token}`,
          },
          withCredentials: true,
        }
      );

      message.success(`Xóa shipper "${userName}" thành công!`);
      fetchShippers();
      return true;
    } catch (error: any) {
      if (error.response?.status === 401) {
        clearAuthInfo();
        message.error(
          "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại."
        );
        return false;
      }
      message.error("Xóa shipper thất bại!");
      return false;
    }
  };

  const handleExportExcel = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}/api/Shipper/export`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authInfo?.token}`,
          },
          credentials: "include",
        }
      );

      if (response.status === 401) {
        clearAuthInfo();
        message.error(
          "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại."
        );
        return;
      }

      if (!response.ok) {
        message.error("Tải xuống thất bại");
        return;
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Shippers.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      message.error("Lỗi khi tải file Excel");
    }
  };

  const handleUpdateStatus = async (userId: number, currentStatus: boolean) => {
    if (!authInfo?.token) {
      message.error("Vui lòng đăng nhập để tiếp tục.");
      return;
    }

    try {
      const newStatus = !currentStatus;
      const response = await axios.put(
        `${process.env.REACT_APP_API_APP_ENDPOINT}/status/${userId}?status=${newStatus}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authInfo?.token}`,
          },
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        message.success("Cập nhật trạng thái thành công!");
        fetchShippers();
      }
    } catch (error: any) {
      if (error.response?.status === 401) {
        clearAuthInfo();
        message.error(
          "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại."
        );
      } else {
        message.error("Cập nhật trạng thái thất bại!");
      }
    }
  };

  const handleRowClick = (record: UserProps) => {
    setOpenDetail(true);
    fetchShipperDetail(record.userId);
  };

  const handleOpenUpdate = (record: UserProps) => {
    setOpenDetail(false);
    setUpdateData(record);
    setOpenUpdate(true);
  };

  useEffect(() => {
    fetchShippers();
    fetchProvinces();
  }, [search, status, page]);

  return (
    <div className="flex w-full h-full px-[8.33%] font-sans screen-menu-page">
      <div className="flex flex-1 p-4 gap-[7px]">
        <Sidebar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />
        <main className="flex-1 overflow-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Nhân viên giao hàng</h1>
            <div className="flex gap-2">
              <div className="flex items-center font-semibold button-up-of-list">
                <Button type="default" onClick={() => setIsAddModalOpen(true)}>
                  <PlusOutlined className="icon-of-menu-list-button" />
                  Thêm mới
                </Button>
              </div>
              <div className="flex items-center font-semibold button-up-of-list">
                <Button type="default" onClick={handleExportExcel}>
                  <FileExcelOutlined className="icon-of-menu-list-button" />
                  Xuất Excel
                </Button>
              </div>
            </div>
          </div>
          <UserList
            items={items}
            loading={loading}
            page={page}
            total={total}
            onPageChange={setPage}
            onRowClick={handleRowClick}
            onUpdateStatus={handleUpdateStatus}
          />
        </main>
      </div>

      <AddShipperModal
        visible={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddShipper}
      />

      <ShipperDetailModal
        open={openDetail}
        loading={loadingDetail}
        data={detailData}
        onClose={() => setOpenDetail(false)}
        onUpdate={() => {
          if (detailData) {
            handleOpenUpdate(detailData);
          }
        }}
        onDelete={handleDeleteShipper}
      />

      {openUpdate && updateData && (
        <UserUpdateModal
          open={openUpdate}
          data={updateData}
          onClose={() => setOpenUpdate(false)}
          onSubmit={handleUpdateShipper}
          addressData={{
            provinces,
            districts,
            wards,
            fetchDistricts,
            fetchWards,
          }}
        />
      )}
    </div>
  );
};

export default ShipperManagePage;
