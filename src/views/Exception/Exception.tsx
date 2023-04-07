import React, { ReactElement, useEffect, useState } from "react";
import styles from "./Exception.module.scss";
import { Row, Button, Select, Space, Col, Empty, Timeline, Card } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import _ from "lodash";
import { toZero } from "../../utils/common";
import { getTimeAction, Infos, updateInfos } from "../../store/modules/signs";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../store";
import type { RootState } from "../../store";
import { DetailKeyEng } from "../Sign/Sign";
import { getApplyAction, updateApplyList } from "../../store/modules/checks";

let date = new Date();
let year = date.getFullYear();
let month = date.getMonth();

const Exception = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [month, setMonth] = useState(
    searchParams.get("month")
      ? Number(searchParams.get("month")) - 1
      : date.getMonth()
  );
  const handleChange = (value: number) => {
    setMonth(value);
    setSearchParams({ month: String(value + 1) });
  };

  const signsInfos = useSelector((state: RootState) => state.signs.infos);
  const usersInfos = useSelector((state: RootState) => state.users.infos);
  const applyList = useSelector((state: RootState) => state.checks.applyList);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (_.isEmpty(applyList)) {
      dispatch(getApplyAction({ applicantid: usersInfos._id as string })).then(
        (action) => {
          const { errcode, rets } = (
            action.payload as { [index: string]: unknown }
          ).data as { [index: string]: unknown };
          if (errcode === 0) {
            dispatch(updateApplyList(rets as Infos[]));
          }
        }
      );
    }
  }, [applyList, dispatch, usersInfos]);

  const monthOptions: ReactElement[] = [];
  for (let i = 0; i < 12; i++) {
    monthOptions.push(
      <Select.Option key={i} value={i}>
        {i + 1}
      </Select.Option>
    );
  }

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

  let details;
  if (signsInfos.detail) {
    const detailMonth = (signsInfos.detail as { [index: string]: unknown })[
      toZero(month + 1)
    ] as { [index: string]: unknown };
    details = Object.entries(detailMonth)
      .filter((v) => v[1] !== "正常出勤")
      .sort();
  }

  const applyListMonth = applyList.filter((v) => {
    const startTime = (v.time as string[])[0].split(" ")[0].split("-");
    const endTime = (v.time as string[])[1].split(" ")[0].split("-");
    return startTime[1] <= toZero(month + 1) && endTime[1] >= toZero(month + 1);
  });

  const renderTime = (date: string) => {
    const res = (
      (signsInfos.time as { [index: string]: unknown })[toZero(month + 1)] as {
        [index: string]: unknown;
      }
    )[date];
    if (Array.isArray(res)) {
      return res.join("-");
    } else {
      return "No record";
    }
  };

  return (
    <div className={styles.exception}>
      <Row justify="space-between" align="middle">
        <Link to="/apply">
          <Button type="primary">Handle Exception</Button>
        </Link>
        <Space>
          <Button>{year}</Button>
          <Select value={month} onChange={handleChange}>
            {monthOptions}
          </Select>
        </Space>
      </Row>
      <Row className={styles["exception-line"]} gutter={20}>
        <Col span={12}>
          {details ? (
            <Timeline>
              {details.map((item) => {
                return (
                  <Timeline.Item key={item[0]}>
                    <h3>
                      {year}/{month + 1}/{item[0]}
                    </h3>
                    <Card className={styles["exception-card"]}>
                      <Space>
                        <h4>
                          {DetailKeyEng[item[1] as keyof typeof DetailKeyEng]}
                        </h4>
                        <p>Status: {renderTime(item[0])}</p>
                      </Space>
                    </Card>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          ) : (
            <Empty description="No Exception" imageStyle={{ height: 200 }} />
          )}
        </Col>
        <Col span={12}>
          {applyListMonth.length ? (
            <Timeline>
              {applyListMonth.map((item) => {
                return (
                  <Timeline.Item key={item._id as string}>
                    <h3>{item.reason as string}</h3>
                    <Card className={styles["exception-card"]}>
                      <h4>{item.state as string}</h4>
                      <p className={styles["exception-content"]}>
                        Date {(item.time as string[])[0]} -{" "}
                        {(item.time as string[])[1]}
                      </p>
                      <p className={styles["exception-content"]}>
                        Info {item.note as string}
                      </p>
                    </Card>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          ) : (
            <Empty description="No Application" imageStyle={{ height: 200 }} />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Exception;
