import { BellOutlined } from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import styles from "../Home.module.scss";
import { RootState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { clearToken } from "../../../store/modules/users";

const items1: MenuProps["items"] = [
  {
    key: "1",
    label: <div>Nothing</div>,
  },
];

const HomeHeader = () => {
  const name = useSelector(
    (state: RootState) => state.users.infos.name
  ) as string;
  const head = useSelector(
    (state: RootState) => state.users.infos.head
  ) as string;
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch(clearToken());
    setTimeout(() => {
      window.location.replace("/login");
    }, 500);
  };

  const items2: MenuProps["items"] = [
    {
      key: "1",
      label: <div>Profile</div>,
    },
    {
      key: "2",
      label: <div onClick={handleLogout}>Logout</div>,
    },
  ];

  return (
    <div className={styles["home-header"]}>
      <span className={styles["home-header-title"]}>Attendance Management</span>
      <Space size="large">
        <Dropdown menu={{ items: items1 }} arrow placement="bottom">
          <Badge dot>
            <BellOutlined style={{ fontSize: 20 }} />
          </Badge>
        </Dropdown>
        <Dropdown menu={{ items: items2 }} arrow placement="bottom">
          <Space>
            <Avatar
              style={{ backgroundColor: "black" }}
              src={head}
              size="large"
            />{" "}
            {name}
          </Space>
        </Dropdown>
      </Space>
    </div>
  );
};

export default HomeHeader;
