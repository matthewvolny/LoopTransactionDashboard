import React from "react";

export const NestedTable = ({ data }: any) => {
  console.log(data);
  console.log(data?.heading);

  return (
    <div className="app-container">
      <table className="table">
        <thead>
          <tr>
            {data?.heading.map((item: any) => {
              return (
                <th key={Math.floor(Math.random() * 1000000)}>{item.label}</th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {data?.paymentsArray.map((payment: any) => {
            return (
              <tr key={Math.floor(Math.random() * 1000000)}>
                {payment.map((value: any) => {
                  return <td>{value.label}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
