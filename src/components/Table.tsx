import React, { useState } from "react";
import { FormattedSuccessfulPayments } from "../models";

interface TableProps {
  data: FormattedSuccessfulPayments[];
}

export const Table = ({ data }: TableProps) => {
  console.log(data);
  //   console.log(data[0].accountProcessed.label);

  return (
    <div className="app-container">
      {/* <table className="table">
        <thead>
          <tr>
            <th>{data[0].accountProcessed.label}</th>
            <th>{data[0].contractAddress.label}</th>
            <th>{data[0].feeAmount.label}</th>
            <th>{data[0].netAmount.label}</th>
            <th>{data[0].paymentToken.label}</th>
            <th>{data[0].processedForDate.label}</th>
            <th>{data[0].processor.label}</th>
            <th>{data[0].transaction.label}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((transaction: any) => {
            return (
              <tr>
                <td>{transaction.accountProcessed.value}</td>
                <td>{transaction.contractAddress.value}</td>
                <td>{transaction.feeAmount.value}</td>
                <td>{transaction.netAmount.value}</td>
                <td>{transaction.paymentToken.value}</td>
                <td>{transaction.processedForDate.value}</td>
                <td>{transaction.processor.value}</td>
                <td>{transaction.transaction.value}</td>
              </tr>
            );
          })}
        </tbody>
      </table> */}
    </div>
  );
};
