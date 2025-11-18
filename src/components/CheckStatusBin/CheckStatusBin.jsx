import { Table, Tag } from "antd";
import { useSelector } from "react-redux";
import SearchComponent from "../../components/searchComponent/searchComponent";
import { COLORS } from "../../constant/colors";

export const CheckStatusBin = ({ binData }) => {
  const searchingData = useSelector((state) => state.app.searchingData);

  const columns = [
    { title: "Id", dataIndex: "id", width: 60 },
    {
      title: "Projet",
      dataIndex: "project",
      filters: [...new Set(binData?.map((d) => d.project))].map((projet) => ({
        text: projet,
        value: projet,
      })),
      onFilter: (value, record) => record.project === value,
    },
    {
      title: () => {
        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchComponent
              table={true}
              data={binData}
              searchFor={"bin_code"}
              placeholder={"Bin code"}
            />
          </div>
        );
      },

      dataIndex: "bin_code",
      // title: "Bin code",
      // dataIndex: "bin_code",
      // filters: [...new Set(binData?.map((d) => d.bin_code))].map((bin) => ({
      //   text: bin,
      //   value: bin,
      // })),
      // onFilter: (value, record) => record.bin_code === value,
    },

    {
      title: "Status bin",
      dataIndex: "status",
      filters: [...new Set(binData?.map((d) => d.status))].map((s) => ({
        text: s,
        value: s,
      })),
      onFilter: (value, record) => record.status === value,

      onCell: () => ({
        style: {
          padding: 0,
        },
      }),
      render: (text, row) => {
        return (
          <p
            style={{
              background:
                row.status === "Vide"
                  ? COLORS.GREEN_ALERT
                  : row.status === "Plein"
                  ? COLORS.REDWHITE
                  : COLORS.WARNIGN_ALERT_TABLE_COLUMN,
              margin: 0,
              padding: "7px",
              width: "100%",
              height: "100%",
            }}
          >
            {text}
          </p>
        );
      },
    },
  ];
  return (
    <div>
      <Table
        style={{
          padding: "13px 0 0 0",
        }}
        bordered
        dataSource={searchingData}
        columns={columns}
        pagination={{
          position: ["bottomCenter"],
          showSizeChanger: true,
          defaultPageSize: "10",
          pageSizeOptions: ["5", "10", "25", "50", "100"],
        }}
        locale={{
          emptyText: <p>Aucune donnée trouvée</p>,
        }}
        size="small"
      />
    </div>
  );
};
