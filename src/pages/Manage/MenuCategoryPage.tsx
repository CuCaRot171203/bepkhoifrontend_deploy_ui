import React, { useState } from "react";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
// import AddMenuModal from "../../components/Manage/Menu/AddMenuModal";
import "./MenuPage.css";
import MenuCategoryList from "../../components/Manage/Menu/MenuCategoryList";
import AddMenuCategoryModal from "../../components/Manage/Menu/AddMenuCategoryModal";

const MenuCategoryPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  return (
    <div className="flex w-full h-full px-[15vw] font-sans screen-menu-page">
      <div className="flex flex-1 p-[1vw] gap-[0.5vw]">
        <main className="flex-1 overflow-auto">
          <div className="flex justify-between items-center mb-[1vw]">
            <h1 className="text-[1.8vw] font-bold">Danh mục sản phẩm</h1>
            <div className="flex gap-[0.5vw]">
              <div className="flex items-center font-semibold button-up-of-list">
                <Button
                  type="default"
                  onClick={() => setIsAddModalOpen(true)}
                  style={{
                    fontSize: "0.9vw",
                    padding: "0.5vw 1vw",
                    height: "auto",
                    borderRadius: "0.6vw",
                  }}
                >
                  <PlusOutlined
                    className="icon-of-menu-list-button"
                    style={{ fontSize: "0.9vw" }}
                  />
                  Thêm mới
                </Button>
              </div>
            </div>
          </div>
          <MenuCategoryList />
        </main>
      </div>
      {isAddModalOpen && (
        <AddMenuCategoryModal
          visible={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}
    </div>
  );
};

export default MenuCategoryPage;
