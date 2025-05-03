import React, { useEffect, useState } from "react";
import { message, Table, Tag } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import "./MenuList.css";
import MenuDetailModal from "./MenuDetailModal";
import MenuUpdateModal from "./MenuUpdateModal";
import { useAuth } from "../../../context/AuthContext";

interface MenuCategoryItem {
  productCategoryId: number;
  productCategoryTitle: string;
}

const MenuCategoryList: React.FC = ({}) => {
  const { authInfo, clearAuthInfo } = useAuth();
  const [items, setItems] = useState<MenuCategoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [page, setPage] = useState<number>(1);
  const [total, setTotal] = useState<number>(0);
  const [loadingDetail, setLoadingDetail] = useState<boolean>(false);
  //   const [detailData, setDetailData] = useState<MenuDetail | null>(null);
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  //   const [updateData, setUpdateData] = useState<MenuDetail | null>(null);

  // Function create query params
  const createQueryParams = () => {
    const params = new URLSearchParams();

    return params.toString();
  };

  const fetchMenuList = async () => {
    if (!authInfo.token) {
      message.error("Vui lòng đăng nhập lại!");
      clearAuthInfo();
      return;
    }

    setLoading(true);
    try {
      const queryParams = createQueryParams();
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
      const data = await response.json();
      setItems(data.data ?? []);
      setTotal(data.totalRecords || 0);
    } catch (error) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // API call when search, category, status, page change
  useEffect(() => {
    fetchMenuList();
  }, [page, authInfo.token]);

  // Column of table
  const columns: TableColumnsType<MenuCategoryItem> = [
    {
      title: "ID",
      dataIndex: "productCategoryId",
      key: "productCategoryId",
      width: 60,
      className: "text-[0.8vw]",
    },
    {
      title: "Tên món",
      dataIndex: "productCategoryTitle",
      key: "productCategoryTitle",
      className: "text-[0.8vw]",
      render: (text, record) => (
        <span
          className="font-medium cursor-pointer text-[0.8vw]"
          onClick={(e) => {
            e.stopPropagation();
            // handleRowClick(record);
          }}
        >
          {text}
        </span>
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
      />
    </div>
  );
};

export default MenuCategoryList;
