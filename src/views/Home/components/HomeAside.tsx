import { Menu } from "antd";
import React, { useEffect, useState } from "react";
import type { MenuProps } from "antd";
import { AppstoreAddOutlined } from "@ant-design/icons";
import styles from "../Home.module.scss";
import { routes } from "../../../router";
import type { RootState } from "../../../store";
import { useSelector } from "react-redux";
import _ from "lodash";
import { Link, matchRoutes, useLocation } from "react-router-dom";

const HomeAside = () => {
  const permission = useSelector(
    (state: RootState) => state.users.infos.permission
  ) as unknown[];

  const location = useLocation();
  const matches = matchRoutes(routes, location);
  const subPath = matches![0].pathnameBase || "";
  const path = matches![1].pathnameBase || "";

  const [menuItems, setMenuItems] = useState<MenuProps["items"]>([]);

  useEffect(() => {
    if (permission) {
      const menus = _.cloneDeep(routes).filter((v) => {
        v.children = v.children?.filter(
          (c) => c.meta?.menu && permission.includes(c.name)
        );
        return v.meta?.menu && permission.includes(v.name);
      });
      const items: MenuProps["items"] = menus.map((v1) => {
        const children = v1.children?.map((v2) => {
          return {
            key: v1.path! + v2.path!,
            label: <Link to={v1.path! + v2.path!}>{v2.meta?.title}</Link>,
            icon: v2.meta?.icon,
          };
        });
        return {
          key: v1.path!,
          label: v1.meta?.title,
          icon: v1.meta?.icon,
          children,
        };
      });
      setMenuItems(items);
    }
  }, [permission]);

  return (
    <Menu
      selectedKeys={[path]}
      defaultOpenKeys={[subPath]}
      // openKeys={[subPath]} /
      className={styles["home-aside"]}
      mode="inline"
      items={menuItems}
    />
  );
};

export default HomeAside;
