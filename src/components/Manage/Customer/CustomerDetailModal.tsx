import React, { useState } from "react";
import { message, Modal, Skeleton, Tag } from "antd";
import {
  UserOutlined,
  PhoneOutlined,
  IdcardOutlined,
  DollarOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../../context/AuthContext";

interface CustomerItem {
  customerId: number;
  customerName: string;
  phone: string;
  totalAmountSpent: string;
}

interface CustomerDetailModalProps {
  open: boolean;
  loading: boolean;
  data: CustomerItem | null;
  onClose: () => void;
}

const CustomerDetailModal: React.FC<CustomerDetailModalProps> = ({
  open,
  loading,
  data,
  onClose,
}) => {
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));
  };

  const getCustomerStatus = (amount: string) => {
    const amountNumber = Number(amount);
    if (amountNumber > 0) {
      return { text: "Đã sử dụng dịch vụ", color: "green" };
    }
    return { text: "Khách hàng đăng ký", color: "blue" };
  };

  const status = data ? getCustomerStatus(data.totalAmountSpent) : null;
  const { authInfo, clearAuthInfo } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedName, setEditedName] = useState(data?.customerName || "");
  const [editedPhone, setEditedPhone] = useState(data?.phone || "");

  const handleDelete = () => {
    if (!data) return;

    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa người dùng "${data.customerName}" không?`,
      okText: "Xóa",
      cancelText: "Hủy",
      okButtonProps: {
        style: {
          backgroundColor: "#FF4D4F",
          borderColor: "#FF4D4F",
          color: "#fff",
        },
      },
      onOk: async () => {
        try {
          const response = await fetch(
            `${process.env.REACT_APP_API_APP_ENDPOINT}/api/Customer/delete/${data.customerId}`,
            {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authInfo?.token}`,
              },
              credentials: "include",
            }
          );

          if (response.ok) {
            message.success("Xóa khách hàng thành công!");
            onClose();
          } else {
            const errorText = await response.text();
            throw new Error(errorText || "Xóa khách hàng thất bại.");
          }
        } catch (error: any) {
          message.error(`Lỗi: ${error.message}`);
        }
      },
    });
  };

  const handleOpenEdit = () => {
    setEditedName(data?.customerName || "");
    setEditedPhone(data?.phone || "");
    setIsEditModalOpen(true);
  };

  const handleUpdate = async () => {
    if (!data) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}/api/Customer/update/${data.customerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authInfo?.token}`,
          },
          credentials: "include",
        }
      );
      if (res.ok) {
        message.success("Cập nhật thông tin thành công!");
        setIsEditModalOpen(false);
        onClose(); // hoặc reload lại data tùy nhu cầu
      } else {
        const err = await res.text();
        throw new Error(err);
      }
    } catch (error: any) {
      message.error(`Lỗi: ${error.message}`);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={500}
      closable={true}
      centered={true}
      className="customer-detail-modal"
      bodyStyle={{ padding: "20px" }}
    >
      <div className="p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <UserOutlined className="mr-2 text-blue-500" />
          CHI TIẾT KHÁCH HÀNG
        </h2>

        {loading ? (
          <Skeleton active paragraph={{ rows: 4 }} />
        ) : data ? (
          <div className="space-y-4">
            <div className="flex items-start">
              <IdcardOutlined className="text-lg text-blue-500 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-500">ID Khách hàng</p>
                <p className="font-medium">{data.customerId}</p>
              </div>
            </div>

            <div className="flex items-start">
              <UserOutlined className="text-lg text-blue-500 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="font-medium text-lg">{data.customerName}</p>
              </div>
            </div>

            <div className="flex items-start">
              <PhoneOutlined className="text-lg text-blue-500 mr-3 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="font-medium">{data.phone}</p>
              </div>
            </div>

            <div className="flex items-start">
              <DollarOutlined className="text-lg text-blue-500 mr-3 mt-1" />
              <div className="flex-1">
                <p className="text-sm text-gray-500">Tổng chi tiêu</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium text-lg text-green-600">
                    {formatCurrency(data.totalAmountSpent)}
                  </p>
                  {status && (
                    <Tag color={status.color} className="text-xs">
                      {status.text}
                    </Tag>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleOpenEdit}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-2"
              >
                <EditOutlined />
                Cập nhật
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-2"
              >
                <DeleteOutlined />
                Xóa
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            Không tìm thấy thông tin khách hàng
          </div>
        )}
      </div>
      <Modal
        title="Cập nhật khách hàng"
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleUpdate}
        okText="Lưu"
        cancelText="Hủy"
      >
        <p>
          <strong>ID:</strong> {data?.customerId}
        </p>
        <div className="mt-3">
          <label className="block mb-1">Họ và tên</label>
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
        <div className="mt-3">
          <label className="block mb-1">Số điện thoại</label>
          <input
            type="text"
            value={editedPhone}
            onChange={(e) => setEditedPhone(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />
        </div>
      </Modal>
    </Modal>
  );
};

export default CustomerDetailModal;
