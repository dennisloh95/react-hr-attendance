import React, { useEffect, useState } from "react";
import styles from "./Apply.module.scss";
import {
  Row,
  Button,
  Space,
  Input,
  Divider,
  Radio,
  RadioChangeEvent,
  Table,
  Modal,
  Form,
  DatePicker,
  Select,
  message,
} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  Infos,
  getApplyAction,
  postApplyAction,
  updateApplyList,
} from "../../store/modules/checks";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../../store";
import _ from "lodash";
import dayjs from "dayjs";
import type { Info } from "../../store/modules/news";
import { putRemindAction } from "../../store/modules/news";
import { updateInfo } from "../../store/modules/news";

interface FormInfos {
  approvername: string;
  note: string;
  reason: string;
  time: [string, string];
}

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
    title: "Approver",
    dataIndex: "approvername",
    key: "approvername ",
    width: 180,
  },
  {
    title: "State",
    dataIndex: "state",
    key: "state ",
    width: 180,
  },
];
const approverTypes = [
  { label: "All", value: "all" },
  { label: "Pending", value: "待审批" },
  { label: "Approved", value: "已通过" },
  { label: "Rejected", value: "未通过" },
];

const defaultType = approverTypes[0].value;

const Apply = () => {
  const [approverType, setApproverType] = useState(defaultType);
  const [searchWord, setSearchWord] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const usersInfos = useSelector((state: RootState) => state.users.infos);
  const applyList = useSelector(
    (state: RootState) => state.checks.applyList
  ).filter(
    (v) =>
      (v.state === approverType || defaultType === approverType) &&
      (v.note as string).includes(searchWord)
  );
  const newsinfo = useSelector((state: RootState) => state.news.info);
  const [form] = Form.useForm();
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

  useEffect(() => {
    if (newsinfo.applicant) {
      dispatch(
        putRemindAction({ userid: usersInfos._id as string, applicant: false })
      ).then((action) => {
        const { errcode, info } = (
          action.payload as { [index: string]: unknown }
        ).data as { [index: string]: unknown };
        if (errcode === 0) {
          dispatch(updateInfo(info as Info));
        }
      });
    }
  }, [newsinfo, dispatch, usersInfos]);

  const approverTypeChange = (e: RadioChangeEvent) => {
    setApproverType(e.target.value);
  };

  const searchWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    handleReset();
  };

  const onFinish = (values: FormInfos) => {
    values.time[0] = dayjs(values.time[0]).format("YYYY-MM-DD hh:mm:ss");
    values.time[1] = dayjs(values.time[1]).format("YYYY-MM-DD hh:mm:ss");
    const applyList = {
      ...values,
      applicantid: usersInfos._id as string,
      applicantname: usersInfos.name as string,
      approverid:
        Array.isArray(usersInfos.approver) &&
        usersInfos.approver.find((item) => item.name === values.approvername)
          ._id,
    };

    dispatch(postApplyAction(applyList)).then((action) => {
      const { errcode } = (action.payload as { [index: string]: unknown })
        .data as {
        [index: string]: unknown;
      };
      if (errcode === 0) {
        message.success("Add successful");
        handleCancel();
        dispatch(
          getApplyAction({ applicantid: usersInfos._id as string })
        ).then((action) => {
          const { errcode, rets } = (
            action.payload as { [index: string]: unknown }
          ).data as { [index: string]: unknown };
          if (errcode === 0) {
            dispatch(updateApplyList(rets as Infos[]));
          }
        });
      }
    });
  };

  const onFinishFailed = ({ values }: { values: FormInfos }) => {};

  const handleReset = () => {
    form.resetFields();
  };

  return (
    <div>
      <Row className={styles["apply-title"]} justify="space-between">
        <Button type="primary" onClick={showModal}>
          Add Approval
        </Button>
        <Space>
          <Input
            placeholder="Insert Keyword"
            value={searchWord}
            onChange={searchWordChange}
          />
          <Button type="primary" icon={<SearchOutlined />}>
            Search
          </Button>
          <Divider style={{ borderLeftColor: "#dedfe6" }} type="vertical" />
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
        className={styles["apply-table"]}
        dataSource={applyList}
        columns={columns}
        bordered
        size="small"
        pagination={{ defaultPageSize: 5 }}
      />
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 20 }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className={styles["apply-form"]}
          form={form}
        >
          <Form.Item
            label="Approver"
            name="approvername"
            rules={[{ required: true, message: "Please select approver" }]}
          >
            <Select placeholder="Please select approver" allowClear>
              {Array.isArray(usersInfos.approver) &&
                usersInfos.approver.map((item) => (
                  <Select.Option key={item._id} value={item.name}>
                    {item.name}
                  </Select.Option>
                ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Reason"
            name="reason"
            rules={[{ required: true, message: "Please select reason" }]}
          >
            <Select placeholder="Please select reason" allowClear>
              <Select.Option value={"年假"}>Annual leave</Select.Option>
              <Select.Option value={"事假"}>Work leave</Select.Option>
              <Select.Option value={"病假"}>Sick leave</Select.Option>
              <Select.Option value={"外出"}>Out Leave</Select.Option>
              <Select.Option value={"补签卡"}>Patch Leave</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Time"
            name="time"
            rules={[{ required: true, message: "Please select time" }]}
          >
            <DatePicker.RangePicker showTime />
          </Form.Item>

          <Form.Item
            label="Note"
            name="note"
            rules={[{ required: true, message: "Please insert note" }]}
          >
            <Input.TextArea rows={4} placeholder="Please insert note" />
          </Form.Item>
          <Row justify={"end"}>
            <Space>
              <Button onClick={handleReset}>Reset</Button>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default Apply;
