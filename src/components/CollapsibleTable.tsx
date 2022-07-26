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
import { NestedTable } from "./NestedTable";

function Row(props: { row: any }) {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell align="center" sx={{ width: "3rem" }}>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell sx={{ letterSpacing: "0.04rem" }} scope="row" align="right">
          {row.transaction.label}
        </TableCell>
        <TableCell sx={{ letterSpacing: "0.04rem" }} align="right">
          {row.createdAt.label}
        </TableCell>
        <TableCell sx={{ letterSpacing: "0.04rem" }} align="right">
          {row.contractAddress.label}
        </TableCell>
        {/* successfulpayments count */}
        <TableCell sx={{ letterSpacing: "0.04rem" }} align="right">
          {row.payments.successfulPayments.count}
        </TableCell>
        {/* failed payments count */}
        <TableCell sx={{ letterSpacing: "0.04rem" }} align="right">
          {row.payments.failedPayments.count}
        </TableCell>
        {/* total fees collected from successful payments */}
        <TableCell sx={{ letterSpacing: "0.04rem" }} align="right">
          {row.payments.successfulPayments.totalFeesCollected}
        </TableCell>
      </TableRow>
      {/* this could likely be put in another component */}
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 0, padding: 3, backgroundColor: "#f1eff1" }}>
              {row?.payments.successfulPayments.paymentsArray.length > 0 ? (
                <>
                  <Typography
                    sx={{ letterSpacing: "0.04rem" }}
                    variant="h6"
                    gutterBottom
                    component="div"
                  >
                    Successful Payments
                  </Typography>
                  <NestedTable payments={row?.payments.successfulPayments} />
                </>
              ) : (
                <></>
              )}
              {row?.payments.failedPayments.paymentsArray.length > 0 ? (
                <>
                  <Typography
                    sx={{ letterSpacing: "0.04rem" }}
                    variant="h6"
                    gutterBottom
                    component="div"
                  >
                    Failed Payments
                  </Typography>
                  <NestedTable payments={row?.payments.failedPayments} />
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
  console.log("BATCH DATA:", batchData);
  //state for column to 'orderBy', and whether to 'order' "asc" or "desc"

  return (
    <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
      <Table aria-label="collapsible table">
        <TableHead>
          <TableRow>
            <TableCell />
            {batchHeadings?.map((heading: any) => {
              return (
                <TableCell
                  align="right"
                  sx={{
                    color: "white",
                    fontWeight: "600",
                    letterSpacing: "0.04rem",
                  }}
                  key={Math.floor(Math.random() * 1000000)}
                >
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
