import { createBrowserRouter, Navigate } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import React, { lazy, ReactNode } from "react";
import {
  CopyOutlined,
  CalendarOutlined,
  WarningOutlined,
  FileAddOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";

declare module "react-router" {
  interface IndexRouteObject {
    meta?: {
      menu?: boolean;
      title?: string;
      icon?: ReactNode;
      auth?: boolean;
    };
    name?: string;
  }
  interface NonIndexRouteObject {
    meta?: {
      menu?: boolean;
      title?: string;
      icon?: ReactNode;
      auth?: boolean;
    };
    name?: string;
  }
}

const Home = lazy(() => import("../views/Home/Home"));
const Sign = lazy(() => import("../views/Sign/Sign"));
const Exception = lazy(() => import("../views/Exception/Exception"));
const Apply = lazy(() => import("../views/Apply/Apply"));
const Check = lazy(() => import("../views/Check/Check"));
const Login = lazy(() => import("../views/Login/Login"));
const BeforeEach = lazy(() => import("../Components/BeforeEach/BeforeEach"));
const NotAuth = lazy(() => import("../views/NotAuth/NotAuth"));
const NotFound = lazy(() => import("../views/NotFound/NotFound"));
const NotServer = lazy(() => import("../views/NotServer/NotServer"));

export const routes: RouteObject[] = [
  {
    path: "/",
    element: React.createElement(Navigate, { to: "/sign" }),
  },
  {
    path: "/",
    name: "home",
    element: React.createElement(BeforeEach, null, React.createElement(Home)),
    meta: {
      menu: true,
      title: "Attendance Management",
      icon: React.createElement(CopyOutlined),
      auth: true,
    },
    children: [
      {
        path: "sign",
        name: "sign",
        element: React.createElement(Sign),
        meta: {
          menu: true,
          title: "Check In",
          icon: React.createElement(CalendarOutlined),
          auth: true,
        },
      },
      {
        path: "exception",
        name: "exception",
        element: React.createElement(Exception),
        meta: {
          menu: true,
          title: "Exception",
          icon: React.createElement(WarningOutlined),
          auth: true,
        },
      },
      {
        path: "apply",
        name: "apply",
        element: React.createElement(Apply),
        meta: {
          menu: true,
          title: "Apply",
          icon: React.createElement(FileAddOutlined),
          auth: true,
        },
      },
      {
        path: "check",
        name: "check",
        element: React.createElement(Check),
        meta: {
          menu: true,
          title: "Check",
          icon: React.createElement(ScheduleOutlined),
          auth: false,
        },
      },
    ],
  },
  {
    path: "login",
    element: React.createElement(BeforeEach, null, React.createElement(Login)),
  },
  {
    path: "/403",
    element: React.createElement(NotAuth),
  },
  {
    path: "/404",
    element: React.createElement(NotFound),
  },
  {
    path: "/500",
    element: React.createElement(NotServer),
  },
  {
    path: "*",
    element: React.createElement(Navigate, { to: "/404" }),
  },
];

const router = createBrowserRouter(routes);

export default router;
