import React, { useState } from "react";
import { SuccessfulPayments } from "../models";

interface TableProps {
  data: SuccessfulPayments | undefined;
}

export const Table = ({ data }: TableProps) => {
  console.log(data);
  console.log(data?.records);

  return (
    <div className="app-container">
      <table className="table">
        <thead>
          <tr>
            {data?.headings.map((heading) => {
              return <th>{heading.label}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data?.records.map((record) => {
            return (
              <tr key={record.id}>
                {record.values.map((value) => {
                  return <td>{value.value}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
