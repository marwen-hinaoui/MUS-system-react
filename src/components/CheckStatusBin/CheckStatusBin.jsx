import React, { useMemo, useState } from "react";
import { Table, Input } from "antd";
import SearchComponent from "../searchComponent/searchComponent";
import { useSelector } from "react-redux";
import { MdSearch } from "react-icons/md";
import { ICONSIZE } from "../../constant/FontSizes";
export const CheckStatusBin = ({ binData }) => {
  const [search, setSearch] = useState({});
  const searchingData = useSelector((state) => state.app.searchingData);

  const projects = useMemo(
    () => [...new Set((binData || []).map((d) => d.project))].sort(),
    [binData]
  );

  const statusFilters = useMemo(
    () =>
      [...new Set((binData || []).map((d) => d.status))]
        .filter(Boolean)
        .map((s) => ({ text: s, value: s })),
    [binData]
  );

  const columns = [
    {
      title: "Bin code",
      dataIndex: "bin_code",
      width: 200,
    },
    {
      title: "Status bin",
      dataIndex: "status",
      filters: statusFilters,
      onFilter: (value, record) => record.status === value,
      render: (text) => <p>{text}</p>,
      width: 200,
    },
  ];

  return (
    <div style={{ padding: "12px 0 0 0", width: "100%", margin: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {projects.map((project) => {
          const projectRows = binData.filter((r) => r.project === project);

          const filteredRows = projectRows.filter((r) =>
            r.bin_code
              ?.toLowerCase()
              .includes((search[project] || "").toLowerCase())
          );

          return (
            <div key={project} style={{ marginBottom: 24 }}>
              <p style={{ marginBottom: 8, fontWeight: "bold" }}>{project}</p>

              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ padding: "5px" }}>
                  <MdSearch size={ICONSIZE.PRIMARY} />
                </div>

                <Input
                  placeholder="Recherche Bin code"
                  className="searchInput"
                  value={search[project] || ""}
                  onChange={(e) =>
                    setSearch((prev) => ({
                      ...prev,
                      [project]: e.target.value,
                    }))
                  }
                />
              </div>

              <Table
                bordered
                size="small"
                dataSource={filteredRows}
                columns={columns}
                rowKey={(row) => row.id ?? `${project}-${row.bin_code}`}
                pagination={{
                  position: ["bottomCenter"],
                  showSizeChanger: true,
                  defaultPageSize: 10,
                  pageSizeOptions: ["5", "10", "25", "50", "100"],
                }}
                locale={{
                  emptyText: (
                    <p style={{ margin: 0 }}>Aucun résultat pour ce projet</p>
                  ),
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
