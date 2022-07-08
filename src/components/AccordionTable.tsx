import React, { useState } from "react";
import { NestedTable } from "./NestedTable";
import { Payments } from "../models";

// interface TableProps {
//   data: Payments | undefined;
// }

export const AccordionTable = ({ data }: any) => {
  const [selected, setSelected] = useState<string>();

  console.log(data);
  const batchHeadings = data?.headings.batchHeadings;
  const batchData = data?.batchData;
  return (
    <div className="app-container">
      <table className="table">
        <thead>
          <tr>
            {batchHeadings?.map((heading: any) => {
              return (
                <th key={Math.floor(Math.random() * 1000000)}>
                  {heading.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {batchData?.map((record: any) => {
            return (
              <>
                <tr
                  onClick={(e) => {
                    setSelected(record.transaction.label);
                  }}
                  key={Math.floor(Math.random() * 1000000)}
                >
                  <td>{record.contractAddress.label}</td>
                  <td>{record.processedForDate.label}</td>
                  <td>{record.transaction.label}</td>
                  {/* {record.payments.successfulPayments.map((payment) => {
                  return <td>{value.value}</td>;
                })} */}
                </tr>
                <tr>
                  <NestedTable
                    data={record.payments.successfulPayments}
                    selected={selected}
                    setSelected={setSelected}
                  />
                  {/* <NestedTable data={record.payments.failedPayments} /> */}
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
