import React, { useEffect, useState } from "react";
import styles from "./Check.module.scss";
import {
  Button,
  Divider,
  Input,
  Radio,
  Row,
  Space,
  Table,
  message,
} from "antd";
import type { RadioChangeEvent } from "antd";
import type { ColumnsType } from "antd/es/table";
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import {
  Infos,
  getApplyAction,
  putApplyAction,
  updateCheckList,
} from "../../store/modules/checks";
import _ from "lodash";

const approverTypes = [
  { label: "All", value: "all" },
  { label: "Pending", value: "待审批" },
  { label: "Approved", value: "已通过" },
  { label: "Rejected", value: "未通过" },
];

const defaultType = approverTypes[0].value;

const Check = () => {
  const [approverType, setApproverType] = useState(defaultType);
  const [searchWord, setSearchWord] = useState("");
  const checkList = useSelector(
    (state: RootState) => state.checks.checkList
  ).filter(
    (v) =>
      (v.state === approverType || defaultType === approverType) &&
      (v.note as string).includes(searchWord)
  );
  const usersInfos = useSelector((state: RootState) => state.users.infos);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (_.isEmpty(checkList)) {
      dispatch(getApplyAction({ approverid: usersInfos._id as string })).then(
        (action) => {
          const { errcode, rets } = (
            action.payload as { [index: string]: unknown }
          ).data as { [index: string]: unknown };
          if (errcode === 0) {
            dispatch(updateCheckList(rets as Infos[]));
          }
        }
      );
    }
  }, [checkList, dispatch, usersInfos]);

  const handlePutApply = (_id: string, state: "已通过" | "未通过") => {
    return () => {
      dispatch(putApplyAction({ _id, state })).then((action) => {
        const { errcode } = (action.payload as { [index: string]: unknown })
          .data as { [index: string]: unknown };
        if (errcode === 0) {
          message.success("Update success");
          dispatch(
            getApplyAction({ approverid: usersInfos._id as string })
          ).then((action) => {
            const { errcode, rets } = (
              action.payload as { [index: string]: unknown }
            ).data as { [index: string]: unknown };
            if (errcode === 0) {
              dispatch(updateCheckList(rets as Infos[]));
            }
          });
        }
      });
    };
  };

  const columns: ColumnsType<Infos> = [
    {
      title: "Applicant",
      dataIndex: "applicantname",
      key: "applicantname ",
      width: 180,
    },
    {
      title: "Reason",
      dataIndex: "reason",
      key: "reason ",
      width: 180,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time ",
      render(_) {
        return _.join(" - ");
      },
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note ",
    },
    {
      title: "Edit",
      dataIndex: "handle",
      key: "handle ",
      width: 180,
      render(_, record) {
        return (
          <Space>
            <Button
              type="primary"
              shape="circle"
              size="small"
              style={{ background: "#67c23a", border: "1px solid #67c23a" }}
              icon={<CheckOutlined />}
              onClick={handlePutApply(record._id as string, "已通过")}
            />
            <Button
              type="primary"
              danger
              shape="circle"
              size="small"
              icon={<CloseOutlined />}
              onClick={handlePutApply(record._id as string, "未通过")}
            />
          </Space>
        );
      },
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state ",
      width: 180,
    },
  ];

  const searchWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const approverTypeChange = (e: RadioChangeEvent) => {
    setApproverType(e.target.value);
  };

  return (
    <div>
      <Row justify={"end"} className={styles["check-title"]}>
        <Space>
          {" "}
          <Input
            placeholder="Insert Keyword"
            value={searchWord}
            onChange={searchWordChange}
          />
          <Button type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
          <Divider />
          <Radio.Group
            options={approverTypes}
            optionType="button"
            buttonStyle="solid"
            value={approverType}
            onChange={approverTypeChange}
          />
        </Space>
      </Row>
      <Table
        rowKey="_id"
        className={styles["check-table"]}
        dataSource={checkList}
        columns={columns}
        bordered
        size="small"
        pagination={{ defaultPageSize: 5 }}
      />
    </div>
  );
};

export default Check;
