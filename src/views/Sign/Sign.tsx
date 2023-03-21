import {
  Button,
  Calendar,
  Descriptions,
  message,
  Row,
  Select,
  Space,
  Tag,
} from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Sign.module.scss";
import { RootState, useAppDispatch } from "../../store";
import { useSelector } from "react-redux";
import _ from "lodash";
import {
  getTimeAction,
  putTimeAction,
  updateInfos,
} from "../../store/modules/signs";
import type { Infos } from "../../store/modules/signs";
import type { Dayjs } from "dayjs";
import { toZero } from "../../utils/common";
// import locale from "antd/es/date-picker/locale/zh_CN";

const date = new Date();
const monthList = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

enum DetailKey {
  normal = "正常出勤",
  absent = "旷工",
  miss = "漏打卡",
  late = "迟到",
  early = "早退",
  lateAndEarly = "迟到并早退",
}

export enum DetailKeyEng {
  "正常出勤" = "Normal",
  "旷工" = "Absent",
  "漏打卡" = "Miss",
  "迟到" = "Late",
  "早退" = "Early",
  "迟到并早退" = "Late & Early",
}

const originDetailValue: Record<keyof typeof DetailKey, number> = {
  normal: 0,
  absent: 0,
  miss: 0,
  late: 0,
  early: 0,
  lateAndEarly: 0,
};

const originDetailState = {
  type: "success" as "success" | "error",
  text: "Success" as "Success" | "Error",
};

const Sign = () => {
  const [month, setMonth] = useState(date.getMonth());
  const navigate = useNavigate();
  const handleToException = () => {
    navigate(`/exception?month=${month + 1}`);
  };
  const signsInfos = useSelector((state: RootState) => state.signs.infos);
  const usersInfos = useSelector((state: RootState) => state.users.infos);
  const dispatch = useAppDispatch();

  const [detailValue, setDetailValue] = useState({ ...originDetailValue });
  const [detailState, setDetailState] = useState({ ...originDetailState });

  useEffect(() => {
    if (_.isEmpty(signsInfos)) {
      dispatch(getTimeAction({ userid: usersInfos._id as string })).then(
        (action) => {
          const { errcode, infos } = (
            action.payload as { [index: string]: unknown }
          ).data as { [index: string]: unknown };
          if (errcode === 0) {
            dispatch(updateInfos(infos as Infos));
          }
        }
      );
    }
  }, [signsInfos, dispatch, usersInfos]);

  useEffect(() => {
    if (signsInfos.detail) {
      const detailMonth = (signsInfos.detail as { [index: string]: unknown })[
        toZero(month + 1)
      ] as { [index: string]: unknown };
      for (let attr in detailMonth) {
        switch (detailMonth[attr]) {
          case DetailKey.normal:
            originDetailValue.normal++;
            break;
          case DetailKey.absent:
            originDetailValue.absent++;
            break;
          case DetailKey.miss:
            originDetailValue.miss++;
            break;
          case DetailKey.late:
            originDetailValue.late++;
            break;
          case DetailKey.early:
            originDetailValue.early++;
            break;
          case DetailKey.lateAndEarly:
            originDetailValue.lateAndEarly++;
            break;
        }
      }
      setDetailValue({ ...originDetailValue });

      for (const attr in originDetailValue) {
        if (
          attr !== "normal" &&
          originDetailValue[attr as keyof typeof originDetailValue] !== 0
        ) {
          setDetailState({
            type: "error",
            text: "Error",
          });
        }
      }
    }

    return () => {
      setDetailState({
        type: "success",
        text: "Success",
      });
      for (let attr in originDetailValue) {
        originDetailValue[attr as keyof typeof originDetailValue] = 0;
      }
    };
  }, [signsInfos, month]);

  const dateCellRender = (value: Dayjs) => {
    const month =
      signsInfos.time &&
      (signsInfos.time as { [index: string]: unknown })[
        toZero(value.month() + 1)
      ];
    const date =
      month && (month as { [index: string]: unknown })[toZero(value.date())];
    let res = "";
    if (Array.isArray(date)) {
      res = date.join(" - ");
    }
    return <div className={styles["show-time"]}>{res}</div>;
  };

  const handlePutTime = () => {
    dispatch(putTimeAction({ userid: usersInfos._id as string })).then(
      (action) => {
        const { errcode, infos } = (
          action.payload as { [index: string]: unknown }
        ).data as { [index: string]: unknown };
        if (errcode === 0) {
          dispatch(updateInfos(infos as Infos));
          message.success("Check in successful");
        }
      }
    );
  };

  return (
    <div>
      <Descriptions
        className={styles["descriptions"]}
        layout="vertical"
        size="small"
        column={{ lg: 9, md: 5 }}
        bordered
      >
        <Descriptions.Item label="Month">{monthList[month]}</Descriptions.Item>
        {Object.entries(DetailKey).map((v) => (
          <Descriptions.Item key={v[0]} label={DetailKeyEng[v[1]]}>
            {detailValue[v[0] as keyof typeof DetailKey]}
          </Descriptions.Item>
        ))}

        <Descriptions.Item label="Edit">
          <Button type="primary" ghost size="small" onClick={handleToException}>
            View
          </Button>
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag color={detailState.type}>{detailState.text}</Tag>
        </Descriptions.Item>
      </Descriptions>
      <Calendar
        dateCellRender={dateCellRender}
        headerRender={({ value, type, onChange, onTypeChange }) => {
          const monthOptions = [];
          for (let i = 0; i < 12; i++) {
            monthOptions.push(
              <Select.Option key={i} value={i}>
                {monthList[i]}
              </Select.Option>
            );
          }

          return (
            <Row
              justify={"space-between"}
              align="middle"
              className={styles["calendar-header"]}
            >
              <Button type="primary" onClick={handlePutTime}>
                Check In
              </Button>
              <Space>
                <Button>{value.year()}</Button>
                <Select
                  value={month}
                  onChange={(newMonth) => {
                    setMonth(newMonth);
                    onChange(value.clone().month(newMonth));
                  }}
                >
                  {monthOptions}
                </Select>
              </Space>
            </Row>
          );
        }}
        // locale={locale}
      />
    </div>
  );
};

export default Sign;
