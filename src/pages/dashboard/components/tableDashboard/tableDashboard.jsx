import React, { useEffect, useState } from "react";
import { Divider, Table } from "antd";
import { Stack } from "react-bootstrap";
import { FaBoxOpen } from "react-icons/fa";
import { COLORS } from "../../../../constant/colors";
import { useDispatch, useSelector } from "react-redux";
import {
  set_data_searching,
  set_demande_data_table,
  set_drawer,
} from "../../../../redux/slices";
import { ICONSIZE } from "../../../../constant/FontSizes";
import DrawerComponent from "../../../../components/drawer/drawerComponent";
import ClickingIcon from "../../../../components/clickingIcon/clickingIcon";
const data = [
  {
    id: 1,
    numDemandeMUS: "MUS1234567",

    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117971",
    Qte_demande: 3,
    date_creation: "28-12-2025",
  },

  {
    id: 2,
    numDemandeMUS: "MUS1234567",

    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117933",
    Qte_demande: 3,
    date_creation: "28-12-2025",
  },
  {
    id: 3,
    numDemandeMUS: "MUS1234567",

    user: "Opérateur Marwen Hinaoui",
    site: "Trim1",
    projet: "MBEAM",
    sequence: "1624251117944",
    Qte_demande: 3,
    date_creation: "28-12-2025",
  },
];
const TableDashboard = () => {
  const [selectedRow, setSelectedRow] = useState(null);
  const dispatch = useDispatch();
  const searchingData = useSelector((state) => state.app.searchingData);

  const openDrawer = useSelector((state) => state.app.openDrawer);
  useEffect(() => {
    dispatch(set_demande_data_table(data));
    dispatch(set_data_searching(data));
  }, [dispatch]);

  const handleDetails = (data) => {
    setSelectedRow(data);
    dispatch(set_drawer(true));
  };
  const handleCloseDrawer = () => {
    dispatch(set_drawer(false));
  };

  const columns = [
    {
      title: "id",
      dataIndex: "id",
    },
    {
      title: "Numéro Demande",
      dataIndex: "numDemandeMUS",
    },
    {
      title: "User",
      dataIndex: "user",
    },
    {
      title: "Site",
      dataIndex: "site",
    },
    {
      title: "Projet",
      dataIndex: "projet",
    },
    {
      title: "Sequence",
      dataIndex: "sequence",
    },
    {
      title: "Quantité",
      dataIndex: "Qte_demande",
    },
    {
      title: "Date Creation",
      dataIndex: "date_creation",
    },
    {
      title: "Actions",
      dataIndex: "date_creation",
      render: () => {
        return (
          <>
            <Stack direction="row" spacing={1} justifyContent="center">
              <div onClick={() => handleDetails(data)}>
                <ClickingIcon
                  icon={<FaBoxOpen color={COLORS.Blue} size={ICONSIZE.SMALL} />}
                />
              </div>
            </Stack>
          </>
        );
      },
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={searchingData} size="midle" />
      <DrawerComponent
        open={openDrawer}
        handleCloseDrawer={handleCloseDrawer}
        row={selectedRow}
      />
    </>
  );
};
export default TableDashboard;
