import React, { useState } from "react";
import { Payments } from "../models";

// interface TableProps {
//   data: Payments | undefined;
// }

export const AccordionTable = ({ data }: any) => {
  console.log(data);
  let batchHeadings = data?.headings.batchHeadings;
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
          {/* {data?.records.map((record) => {
            return (
              <tr key={record.id}>
                {record.values.map((value) => {
                  return <td>{value.value}</td>;
                })}
              </tr>
            );
          })} */}
        </tbody>
      </table>
    </div>
  );
};
