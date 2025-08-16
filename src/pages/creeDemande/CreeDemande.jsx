import React, { useState, useEffect } from "react";
import {
  Input,
  Button,
  Select,
  Form,
  Table,
  message,
  Card,
  Popconfirm,
  notification,
  Spin,
} from "antd";
import { openNotification, openNotificationSuccess } from "../../components/notificationComponent/openNotification";

const { Option } = Select;

const CreeDemande = () => {
  const [data, setData] = useState(null);
  const [sequence, setSequence] = useState("");
  const [sequenceValid, setSequenceValid] = useState(false);
  const [subDemandes, setSubDemandes] = useState([]);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetch("/cms.json")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error("Failed to fetch JSON:", err));
  }, []);

  if (!data) return <Spin />;

  // validate sequence
  const handleSequenceChange = (val) => {
    setSequence(val);
    if (/^\d{12}$/.test(val)) {
      const exists = data.CMS.some((c) => c.sequence === val);
      setSequenceValid(exists);
      if (exists) {
        // initialize first row
        setSubDemandes([
          { key: Date.now(), part: "", pattern: "", material: "" },
        ]);
      } else if (val.length === 12) {
        message.error("Sequence does not exist!");
        setSubDemandes([]);
      }
    } else {
      setSequenceValid(false);
      setSubDemandes([]);
    }
  };

  const partNumbers =
    data.CMS.find((c) => c.sequence === sequence)?.partNumbers || [];

  const materialsMap = data.Materials[0];

  const handleAddRow = () => {
    setSubDemandes((prev) => [
      ...prev,
      { key: Date.now(), part: "", pattern: "", material: "" },
    ]);
  };

  // Update row ---------------------------------------------------------------
  const handleChange = (key, field, value) => {
    setSubDemandes((prev) =>
      prev.map((row) => {
        if (row.key !== key) return row;
        const updatedRow = { ...row, [field]: value };

        if (field === "pattern") {
          const partObj = partNumbers.find(
            (p) => p.partNumber === updatedRow.part
          );
          const partMaterials = partObj?.materials || [];
          const matchedMaterial =
            partMaterials.find((mat) =>
              materialsMap[mat]?.includes(Number(value))
            ) || "";
          updatedRow.material = matchedMaterial;
        }

        return updatedRow;
      })
    );
  };

  // Delete row ---------------------------------------------------------------

  const handleDelete = (key) => {
    setSubDemandes((prev) => prev.filter((row) => row.key !== key));
  };

  const columns = [
    {
      title: "Part Number",
      dataIndex: "partNumber",
      key: "partNumber",
      render: (text, record) => (
        <Select
          value={record.part || undefined}
          placeholder="Select Part"
          onChange={(val) => handleChange(record.key, "part", val)}
          showSearch
          optionFilterProp="children"
          style={{ width: "100%" }}
        >
          {partNumbers.map((p) => (
            <Option key={p.partNumber} value={p.partNumber}>
              {p.partNumber}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Pattern Number",
      dataIndex: "patternNumb",
      key: "patternNumb",
      render: (text, record) => {
        const partObj = partNumbers.find((p) => p.partNumber === record.part);
        const partMaterials = partObj?.materials || [];
        let availablePatterns = [];
        partMaterials.forEach((mat) => {
          if (materialsMap[mat])
            availablePatterns = [...availablePatterns, ...materialsMap[mat]];
        });

        return (
          <Select
            value={record.pattern || undefined}
            placeholder="Select Pattern"
            onChange={(val) => handleChange(record.key, "pattern", val)}
            disabled={!record.part}
            showSearch
            optionFilterProp="children"
            style={{ width: "100%" }}
          >
            {availablePatterns.map((pat, i) => (
              <Option key={i} value={pat}>
                {pat}
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: "Material",
      dataIndex: "material",
      key: "material",
      render: (text, record) => <Input value={record.material} readOnly />,
    },
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
      render: (_, record, index) => {
        const onlyOneRow = subDemandes.length === 1;
        return (
          <Popconfirm
            title="Supprimer sub Demande?"
            onConfirm={() => handleDelete(record.key)}
            disabled={onlyOneRow} // disables popconfirm if only one row
          >
            <Button danger disabled={onlyOneRow}>
              Delete
            </Button>
          </Popconfirm>
        );
      },
    },
  ];

  const handleSubmit = () => {
    if (!sequenceValid) {
      openNotification(api, "Sequance incorrect!");
      return;
    }
    if (subDemandes.some((row) => !row.part || !row.pattern || !row.material)) {
      message.error("All rows must have valid Part, Pattern, Material");
      return;
    }
    openNotificationSuccess(api, "Message from backend!!!!!!!");
    console.log({ sequence, subDemandes });
    setSequence("");
    setSequenceValid(false);
    setSubDemandes([]);
  };

  return (
    <div style={{ maxWidth: 800, margin: "50px auto" }}>
      {contextHolder}
      <Card title="Créer une Demande">
        <Form layout="vertical">
          <Form.Item
            label="Sequence (12 digits)"
            validateStatus={!sequenceValid && sequence ? "error" : ""}
            help={
              !sequenceValid && sequence ? "Invalid sequence or not in CMS" : ""
            }
          >
            <Input
              value={sequence}
              onChange={(e) => handleSequenceChange(e.target.value)}
              maxLength={12}
            />
          </Form.Item>

          {sequenceValid && (
            <>
              <Table
                dataSource={subDemandes}
                columns={columns}
                pagination={false}
                rowKey="key"
              />

              <Button
                type="dashed"
                onClick={handleAddRow}
                style={{ marginTop: 16 }}
              >
                Add Sub-Demande
              </Button>
            </>
          )}

          <Form.Item style={{ marginTop: 20 }}>
            <Button
              type="primary"
              onClick={handleSubmit}
              disabled={!sequenceValid || subDemandes.length === 0}
            >
              Submit Demande
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreeDemande;
