import { BellOutlined } from "@ant-design/icons";
import { Avatar, Badge, Dropdown, Space } from "antd";
import type { MenuProps } from "antd";
import styles from "../Home.module.scss";
import { RootState, useAppDispatch } from "../../../store";
import { useSelector } from "react-redux";
import { clearToken } from "../../../store/modules/users";
import { useEffect } from "react";
import { Info, getRemindAction, updateInfo } from "../../../store/modules/news";
import { Link } from "react-router-dom";

const HomeHeader = () => {
  const name = useSelector(
    (state: RootState) => state.users.infos.name
  ) as string;
  const head = useSelector(
    (state: RootState) => state.users.infos.head
  ) as string;
  const _id = useSelector(
    (state: RootState) => state.users.infos._id
  ) as string;
  const newsInfo = useSelector((state: RootState) => state.news.info);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getRemindAction({ userid: _id })).then((action) => {
      const { errcode, info } = (action.payload as { [index: string]: unknown })
        .data as { [index: string]: unknown };
      if (errcode === 0) {
        dispatch(updateInfo(info as Info));
      }
    });
  }, [dispatch, _id]);

  const handleLogout = () => {
    dispatch(clearToken());
    setTimeout(() => {
      window.location.replace("/login");
    }, 500);
  };

  const isDot = (newsInfo.applicant || newsInfo.approver) as
    | boolean
    | undefined;

  const items1: MenuProps["items"] = [];

  if (newsInfo.applicant) {
    items1.push({
      key: "1",
      label: <Link to="/apply">Have approval result</Link>,
    });
  }
  if (newsInfo.approver) {
    items1.push({
      key: "2",
      label: <Link to="/check">Have applicant request</Link>,
    });
  }
  if (!newsInfo.applicant && !newsInfo.approver) {
    items1.push({
      key: "3",
      label: <div>No News</div>,
    });
  }

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
          <Badge dot={isDot}>
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
