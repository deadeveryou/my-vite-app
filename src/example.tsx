import React, { useRef, useState, useEffect } from "react";
import { Button, Form, Select, Space, Table, DatePicker } from "antd";
import * as echarts from "echarts";
import moment from "moment";
import axios from "axios";
import "./index.less";

const { Option } = Select;
const { RangePicker } = DatePicker;
const Example: React.FC<any> = () => {
  const [province, setProvince] = useState<string[]>([]);

  const [data, setData] = useState({}); // chart数据
  const [tableData, setTableData] = useState<any[]>([]); // table数据

  const [form] = Form.useForm();
  const chartRef = useRef(null);

  useEffect(() => {
    // ip地址修改
    fetchData("http://43.143.34.210:6001/file/province/get", {}, setProvince);
  }, []);

  useEffect(() => {
    initChart();
  }, [data]);

  const initChart = () => {
    const date = new Set();
    Object.entries(data).forEach(([key, values]) => {
      if (values && Array.isArray(values)) {
        values.forEach((item) => {
          if (item && !date.has(item.date)) {
            date.add(item.date);
          }
        });
      }
    });

    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);
      const option = {
        tooltip: {
          trigger: "axis",
          valueFormatter: (value: string) => value + "元/公斤",
        },
        legend: {
          type:"scroll",
          left:100,
          top:"auto",
          right:"auto",
          width:"auto",
          trigger: "item",
          position:"bottom",
          show: true,
        },
        title: {
          left: "left",
          text: "价格走势",
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: Array.from(date),
        },
        yAxis: {
          type: "value",
          name: "元/公斤",
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 10,
          },
          {
            start: 0,
            end: 10,
          },
        ],
        series: Object.entries(data).map(([key, values]) => {
          return {
            name: key || "eeee",
            type: "line",
            data: (values as []).map((item: { price: number }) => item.price),
          };
        }),
      };
      console.log(data, date);
      myChart.setOption(option);
    }
  };

  const columns = [
    { title: "日期", dataIndex: "time" },
    { title: "省份", dataIndex: "province", width: 300 },
    { title: "价格/(元/公斤)", dataIndex: "value", width: 300 },
  ];

  const fetchData = (
    url: string,
    params: {},
    callBack: (result: any) => void
  ) => {
    axios.post(url, params).then((res) => {
      console.log(res);
      if (res?.data?.data) {
        callBack(res?.data?.data);
      }
    });
  };

  const resetData = (result: any) => {
    const newTableData: { time: any; province: string; value: number }[] = [];
    Object.entries(result).forEach(([key, values = []]) => {
      if (values && Array.isArray(values)) {
        values.forEach((item) => {
          item.date = moment(item.date).format("YYYY-MM-DD")
          const obj = {
            time: item.date,
            province: key,
            value: item.price,
          };
          newTableData.push(obj);
        });
      }
    });

    setData(result);
    setTableData(newTableData);
  };

  const handleSumbit = (values: any) => {
    console.log(values);
    // type： 类型；枚举值为 beef：牛肉；beefGuess：牛肉预测；
    // startDate：开始时间；
    // endDate：结束时间；
    // provinceList
    const params = {
      provinceList: values.provinceList,
      type: values.type,
      startDate: values.RangePicker[0],
      endDate: values.RangePicker[1],
    };
    // ip地址修改
    fetchData("http://43.143.34.210:6001/file/data/get", params, resetData);
  };

  const reset = () => {
    form.resetFields();
  };

  return (
    <div className="container">
      <Form form={form} onFinish={handleSumbit} layout="inline">
        <Space wrap>
          <Form.Item
            name="type"
            label="类型"
            required
            rules={[{ required: true, message: "请选择类型" }]}
          >
            <Select placeholder="请选择" style={{ width: 200 }}>
              <Option value="beef" label="beef">
                牛肉
              </Option>
              <Option value="beefGuess" label="beefGuess">
                牛肉预测
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="provinceList"
            label="省份"
            required
            rules={[{ required: true, message: "请选择省份" }]}
          >
            <Select
              mode="multiple"
              placeholder="请选择"
              style={{ minWidth: 200 }}
              maxTagCount={4}
            >
              {province.map((item: string) => {
                return (
                  <Option value={item} label={item}>
                    {item}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="RangePicker"
            shouldUpdate
            required
            rules={[{ required: true, message: "请选择时间范围" }]}
          >
            <RangePicker picker="date" />
          </Form.Item>
          <Button htmlType="submit" type="primary">
            查询
          </Button>
          <Button onClick={reset}>重置</Button>
        </Space>
      </Form>
      <div className="chartContainer">
        <div ref={chartRef} style={{ width: "100%", height: 500 }}></div>
      </div>

      <div className="chartContainer">
        <Table dataSource={tableData} columns={columns} />
      </div>
    </div>
  );
};
export default Example;
