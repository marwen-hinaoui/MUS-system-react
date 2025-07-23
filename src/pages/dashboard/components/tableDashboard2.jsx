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
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { FaBoxOpen } from "react-icons/fa"; // Keep if you still use FaBoxOpen, otherwise remove
import ButtonHeader from "../../../components/button/buttonHeader/buttonHeader";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function TableDashboard2() {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDetails = (rowId) => {
    console.log(`handleDetails button clicked for row ID: ${rowId}`);
    // Implement your details logic here
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

      label: "Actions", // Changed label to plural as it will contain multiple actions

      align: "center", // Center align actions for better UX

      format: (value, row) => {
        return (
          <Stack direction="row" spacing={1} justifyContent="center">
            <ButtonHeader content={"Détails"} icon={<FaBoxOpen />} />
          </Stack>
        );
      },
    },
  ];

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
      "30-12-2025"
    ),
  ];

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
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
            {rows
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
              ))}
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
        // This style will hide the "Rows per page:" text
        labelRowsPerPage="" // Set to an empty string to remove the label
      />
    </div>
  );
}
