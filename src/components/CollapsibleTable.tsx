import React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { NestedTable1 } from "./NestedTable1";

function Row(props: { row: any }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell scope="row" align="right">
          {row.transaction.label}
        </TableCell>
        {/* line needed for batches from failed payments (maybe change to simple createdAt date?) */}
        {row.processedForDate ? (
          <TableCell align="right">{row.processedForDate.label}</TableCell>
        ) : (
          <TableCell align="right">{row.createdAt.label}</TableCell>
        )}
        <TableCell align="right">{row.contractAddress.label}</TableCell>
      </TableRow>
      {/* this could likely be put in another component */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Successful Payments
              </Typography>
              <NestedTable1 payments={row?.payments.successfulPayments} />
              {row?.payments.failedPayments.paymentsArray.length > 0 ? (
                <>
                  <Typography variant="h6" gutterBottom component="div">
                    Failed Payments
                  </Typography>
                  <NestedTable1 payments={row?.payments.failedPayments} />
                </>
              ) : (
                <></>
              )}
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

export function CollapsibleTable({ payments }: any) {
  const batchHeadings = payments?.headings.batchHeadings;
  const batchData = payments?.batchData;

  return (
    <TableContainer component={Paper}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {batchHeadings?.map((heading: any) => {
              return (
                <TableCell key={Math.floor(Math.random() * 1000000)}>
                  {heading.label}
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {batchData?.map((record: any) => {
            return <Row key={record.transaction.value} row={record} />;
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
