import React, { useRef, useState, useEffect } from "react";
import {
  Button,
  Form,
  Select,
  Space,
  Table,
  DatePicker,
  Image,
  Input,
  message,
} from "antd";

import axios, { AxiosStatic } from "axios";
import "./index.less";
import { ImgUtil } from "./utils/imgUtils";

const Example: React.FC<any> = () => {
  const [data, setData] = useState();
  const [result, setResult] = useState();
  const [tabledata, setTabledata] = useState<Record<string, any>[]>([]);

  const [form] = Form.useForm();

  useEffect(() => {
    // ip地址修改
    fetchData(
      "http://127.0.0.1:3002/dang/usermodule/findUserInfo/qyc/123",
      {},
      (v) => {
        setData(v);
      }
    );
  }, []);

  const fetchData = (
    url: string,
    params: {},
    callBack: (result: any) => void
  ) => {
    axios.get(url, params).then((res) => {
      console.log("🚀 ~ axios.get ~ res:", res);
      const { msg, data, code } = res.data || {};
      if (code === 200) {
        callBack(data);
      } else message.error(msg);
    });
  };

  const fetchPostData = (
    url: string,
    params: {},
    callBack: (result: any) => void
  ) => {
    axios.post(url, params).then((res) => {
      console.log("🚀 ~ axios.post ~ res:", res);
      const { msg, data, code } = res.data || {};
      if (code === 200) {
        callBack(data);
      } else message.error(msg);
    });
  };

  const onfilish = () => {
    form.validateFields().then((values) => {
      console.log("🚀 ~ form.validateFields ~ values:", values);
      fetchPostData(
        "http://127.0.0.1:3002/dang/usermodule/addUser/",
        {
          ...values,
        },
        (v) => {
          setResult(v);
          findAllUser();
        }
      );
    });
  };

  const findAllUser = () => {
    fetchData("http://127.0.0.1:3002/dang/usermodule/findAllUser", {}, (v) => {
      setTabledata(v);
    });
  };

  return (
    <div className="container">
      {data}
      <Image src={ImgUtil.getImg("pic1.webp")} width={300} />
      <Form form={form}>
        <Form.Item label="用户名" name="username">
          <Input />
        </Form.Item>
        <Form.Item label="密码" name="pwd">
          <Input />
        </Form.Item>
        <Form.Item label="host" name="host">
          <Input />
        </Form.Item>
        <Form.Item label="port" name="port">
          <Input />
        </Form.Item>
      </Form>
      <Button onClick={onfilish}>subject</Button>
      <Table
        columns={Object.keys(tabledata[0] || {}).map((item) => ({
          dataIndex: item,
          title: item,
        }))}
        dataSource={tabledata}
      />
    </div>
  );
};
export default Example;
