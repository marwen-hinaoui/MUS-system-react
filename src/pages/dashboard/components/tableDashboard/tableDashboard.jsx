import React, { useEffect, useState } from "react";
import { Divider, Spin, Table } from "antd";
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

const TableDashboard = ({data}) => {
  const [selectedRow, setSelectedRow] = useState(null);
  const dispatch = useDispatch();
  const searchingData = useSelector((state) => state.app.searchingData);

  const openDrawer = useSelector((state) => state.app.openDrawer);
  useEffect(() => {
    dispatch(set_demande_data_table(data));
    dispatch(set_data_searching(data)); 
  }, [dispatch]);

  const handleDetails = (row) => {
    
    setSelectedRow(row);
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
      render: (text, row) => {
        return (
          <>
            <Stack direction="row" spacing={1} justifyContent="center">
              <div onClick={() => handleDetails(row)}>
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


  
  return searchingData && (
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
