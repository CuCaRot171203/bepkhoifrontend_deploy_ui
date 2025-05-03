import React, { useState } from "react";
import { Modal, Input, Button, message } from "antd";
import { useAuth } from "../../../context/AuthContext";

interface AddMenuModalProps {
  visible: boolean;
  onClose: () => void;
}

const AddMenuCategoryModal: React.FC<AddMenuModalProps> = ({
  visible,
  onClose,
}) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [categoryTitle, setCategoryTitle] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setCategoryTitle("");
    setError(false);
  };

  const handleSubmit = async () => {
    if (!categoryTitle.trim()) {
      setError(true);
      message.error("Vui lòng nhập tên danh mục!");
      return;
    }

    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${
          process.env.REACT_APP_API_APP_ENDPOINT
        }/api/Menu/product-category?title=${encodeURIComponent(categoryTitle)}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      const result = await response.json();

      if (response.ok) {
        message.success("Thêm danh mục thành công!");
        resetForm();
        onClose();
      } else {
        message.error(result.message || "Thêm danh mục thất bại.");
      }
    } catch (error) {
      message.error("Lỗi khi kết nối đến server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Thêm danh mục"
      open={visible}
      onCancel={() => {
        resetForm();
        onClose();
      }}
      footer={null}
      width={500}
    >
      <div className="space-y-4">
        <label className="block font-medium text-gray-700">
          Tên danh mục <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Nhập tên danh mục"
          value={categoryTitle}
          onChange={(e) => {
            setCategoryTitle(e.target.value);
            setError(false);
          }}
          className={error ? "border-red-500" : ""}
        />

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={() => {
              resetForm();
              onClose();
            }}
          >
            Bỏ qua
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            Lưu
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddMenuCategoryModal;
