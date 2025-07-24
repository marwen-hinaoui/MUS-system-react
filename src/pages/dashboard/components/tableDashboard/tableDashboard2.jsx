import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import Stack from "@mui/material/Stack";
import { FaBoxOpen } from "react-icons/fa";
import ButtonHeader from "../../../../components/button/buttonHeader/buttonHeader";
import DrawerComponent from "../../../../components/drawer/drawerComponent";
import { useDispatch, useSelector } from "react-redux";
import {
  set_data_searching,
  set_demande_data_table,
  set_drawer,
} from "../../../../redux/slices";
import { COLORS } from "../../../../constant/colors";
import { Empty } from "antd/lib";

function createData(
  id,
  numDemandeMUS,
  user,
  site,
  projet,
  sequence,
  Qte_demande,
  date_creation
) {
  return {
    id,
    numDemandeMUS,
    user,
    site,
    projet,
    sequence,
    Qte_demande,
    date_creation,
  };
}

const rows = [
  createData(
    1,
    "MUS1234567",
    "Opérateur Marwen Hinaoui",
    "Trim1",
    "MBEAM",
    "1624251117971",
    3,
    "28-12-2025"
  ),
  createData(
    2,
    "MUS1234568",
    "Opérateur John Doe",
    "Trim2",
    "PROJECT_X",
    "1624251117972",
    5,
    "29-12-2025"
  ),
  createData(
    3,
    "MUS1234569",
    "Opérateur Jane Smith",
    "Trim3",
    "PROJECT_Y",
    "1624251117973",
    2,
    "30-11-2025"
  ),
];

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor:COLORS.BLACK,
    color: COLORS.WHITE,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({

  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function TableDashboard2() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [selectedRow, setSelectedRow] = React.useState(null);
  const dispatch = useDispatch();
  const searchingData = useSelector((state) => state.app.searchingData);

  const openDrawer = useSelector((state) => state.app.openDrawer);

  React.useEffect(() => {
    dispatch(set_demande_data_table(rows));
    dispatch(set_data_searching(rows));
  }, [dispatch]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDetails = (row) => {
    setSelectedRow(row);
    dispatch(set_drawer(true));
  };
  const handleCloseDrawer = () => {
    dispatch(set_drawer(false));
  };

  const columns = [
    { id: "id", label: "ID", align: "left" },
    { id: "numDemandeMUS", label: "Numéro Demande", align: "left" },
    {
      id: "user",
      label: "User",
      align: "left",
    },
    {
      id: "site",
      label: "Site",
      align: "left",
    },
    {
      id: "projet",
      label: "Projet",
      align: "left",
    },
    {
      id: "sequence",
      label: "Sequence",
      align: "left",
    },
    {
      id: "Qte_demande",
      label: "Quantité",
      align: "left",
    },
    {
      id: "date_creation",
      label: "Date Creation",
      align: "left",
    },
    {
      id: "actions",

      label: "Actions",

      align: "center",

      format: (value, row) => {
        return (
          <>
            <Stack direction="row" spacing={1} justifyContent="center">
              <div onClick={() => handleDetails(row)}>
                <ButtonHeader content={"Détails"} icon={<FaBoxOpen />} />
              </div>
            </Stack>
          </>
        );
      },
    },
  ];

  return (
    <div>
      {/* <TableContainer component={Paper}> */}
      <TableContainer>
        <Table sx={{ minWidth: 700 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell key={column.id} align={column.align}>
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {searchingData.length > 0 ? (
              searchingData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <StyledTableRow key={row.id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <StyledTableCell key={column.id} align={column.align}>
                          {column.format ? column.format(value, row) : value}
                        </StyledTableCell>
                      );
                    })}
                  </StyledTableRow>
                ))
            ) : (
              <TableRow>
                <TableCell
                  className="border-none "
                  colSpan={columns.length}
                  align="center"
                >
                  <div py={4}>
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        labelRowsPerPage=""
      />
      <DrawerComponent
        open={openDrawer}
        handleCloseDrawer={handleCloseDrawer}
        row={selectedRow}
      />
    </div>
  );
}
