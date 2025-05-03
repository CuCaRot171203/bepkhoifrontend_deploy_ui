import React, { useCallback, useEffect, useState } from "react";
import { message, Table, Popconfirm } from "antd";
import type { TableColumnsType } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import "./MenuList.css";
import { useAuth } from "../../../context/AuthContext";

interface MenuCategoryItem {
  productCategoryId: number;
  productCategoryTitle: string;
}

const MenuCategoryList: React.FC = () => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [items, setItems] = useState<MenuCategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);

  const fetchMenuCategoryList = useCallback(async () => {
    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}/api/product-categories/get-all-categories`,
        {
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
          },
          method: "GET",
          credentials: "include",
        }
      );
      if (response.status === 401) {
        message.error("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        clearAuthInfo();
        return;
      }
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: MenuCategoryItem[] = await response.json();
      setItems(data);
      setTotal(data.length);
    } catch (error) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [authInfo.token, clearAuthInfo]);

  useEffect(() => {
    fetchMenuCategoryList();
  }, [page, fetchMenuCategoryList]);

  const handleDelete = async (id: number) => {
    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_APP_ENDPOINT}/api/Menu/product-category/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${authInfo.token}`,
          },
          credentials: "include",
        }
      );
      const result = await res.json();
      if (res.ok) {
        message.success("Xóa danh mục thành công!");
        fetchMenuCategoryList(); // refresh lại
      } else {
        message.error(result.message || "Xóa thất bại!");
      }
    } catch (error) {
      message.error("Không thể kết nối đến server.");
    }
  };

  const columns: TableColumnsType<MenuCategoryItem> = [
    {
      title: "ID",
      dataIndex: "productCategoryId",
      key: "productCategoryId",
      width: 60,
      className: "text-[0.8vw]",
    },
    {
      title: "Tên danh mục",
      dataIndex: "productCategoryTitle",
      key: "productCategoryTitle",
      className: "text-[0.8vw]",
    },
    {
      title: "",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.productCategoryId)}
            okText="OK"
            cancelText="Hủy"
            okButtonProps={{
              className: "bg-blue-500 hover:bg-blue-600 text-white border-none",
            }}
          >
            <DeleteOutlined className="text-red-600 cursor-pointer text-[1vw]" />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-[0.5vw] custom-table-wrapper">
      <Table<MenuCategoryItem>
        rowKey="productCategoryId"
        loading={loading}
        columns={columns}
        dataSource={items}
        pagination={{
          pageSize: 10,
          total: total,
          current: page,
          onChange: (page) => setPage(page),
        }}
        locale={{ emptyText: "Không có dữ liệu phù hợp." }}
        className="custom-table"
        rowClassName={() => "group"} // Dùng cho hover
      />
    </div>
  );
};

export default MenuCategoryList;
