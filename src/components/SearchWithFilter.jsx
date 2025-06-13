import { Input, Button, Dropdown, Menu } from "antd";
import { SearchOutlined, FilterOutlined } from "@ant-design/icons";
import { useState } from "react";

const gameFilters = ["ML", "PUBG", "Free Fire", "Valorant", "Test"];

const SearchWithFilter = ({ onSearch }) => {
  const [searchText, setSearchText] = useState("");

  const handleMenuClick = ({ key }) => {
    onSearch(searchText, key); // Memanggil pencarian dengan kategori filter
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {gameFilters.map((game) => (
        <Menu.Item key={game}>{game}</Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "32px" }}>
      <Input
        placeholder="Cari akun..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        onPressEnter={() => onSearch(searchText, null)}
        prefix={<SearchOutlined />}
      />
      <Dropdown overlay={menu} trigger={["click"]}>
        <Button icon={<FilterOutlined />} />
      </Dropdown>
    </div>
  );
};

export default SearchWithFilter;
