import React, { ReactNode, useEffect } from "react";
import {
  useLocation,
  matchRoutes,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { routes } from "../../router";
import { useAppDispatch } from "../../store";
import { Infos, infosAction, updateInfos } from "../../store/modules/users";
import type { RootState } from "../../store";
import { useSelector } from "react-redux";
import _ from "lodash";

interface BeforeEachProps {
  children?: ReactNode;
}

const BeforeEach = (props: BeforeEachProps) => {
  const dispatch = useAppDispatch();
  const token = useSelector((state: RootState) => state.users.token);
  const infos = useSelector((state: RootState) => state.users.infos);

  const location = useLocation();
  const navigate = useNavigate();

  const matches = matchRoutes(routes, location);

  useEffect(() => {
    if (Array.isArray(matches)) {
      const meta = matches[matches.length - 1].route.meta;
      const name = matches[matches.length - 1].route.name;
      if (meta?.auth && _.isEmpty(infos)) {
        if (token) {
          dispatch(infosAction()).then((action) => {
            const { errcode, infos } = (
              action.payload as { [index: string]: unknown }
            ).data as { [index: string]: unknown };
            if (errcode === 0) {
              dispatch(updateInfos(infos as Infos));
            }
          });
        } else {
          navigate("/login");
        }
      }
    }
    if (token && location.pathname === "/login") {
      navigate("/");
    }
  }, [location, infos]);

  return <>{props.children}</>;
};

export default BeforeEach;
