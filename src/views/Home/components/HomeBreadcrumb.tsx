import { Breadcrumb } from "antd";
import { match } from "assert";
import React from "react";
import { matchRoutes, useLocation } from "react-router-dom";
import { routes } from "../../../router";
import styles from "../Home.module.scss";

const HomeBreadcrumb = () => {
  const location = useLocation();
  const matches = matchRoutes(routes, location);

  return (
    <Breadcrumb className={styles["home-breadcrumb"]}>
      {matches?.map((v) => (
        <Breadcrumb.Item key={v.pathnameBase}>
          {v.route.meta?.title}
        </Breadcrumb.Item>
      ))}
    </Breadcrumb>
  );
};

export default HomeBreadcrumb;
