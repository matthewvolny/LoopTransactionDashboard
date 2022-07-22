import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

export const NestedTable = ({ payments }: any) => {
  return (
    <Table size="small" aria-label="purchases">
      <TableHead>
        <TableRow>
          {payments?.heading.map((item: any) => {
            return (
              <TableCell
                align="right"
                key={Math.floor(Math.random() * 1000000)}
              >
                {item.label}
              </TableCell>
            );
          })}
        </TableRow>
      </TableHead>
      <TableBody>
        {payments?.paymentsArray.map((payment: any) => {
          return (
            <TableRow key={Math.floor(Math.random() * 1000000)}>
              {payment.map((value: any) => {
                return (
                  <TableCell
                    key={Math.floor(Math.random() * 1000000)}
                    scope="row"
                    align="right"
                  >
                    {value.label}
                  </TableCell>
                );
              })}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
