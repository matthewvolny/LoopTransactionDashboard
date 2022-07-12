import React from "react";

interface NestedTableProps {
  data: any;
  selected: string;
  setSelected: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const NestedTable = ({ data, selected, setSelected }: any) => {
  // console.log("INNESTEDTABLE");
  // console.log(data);
  // console.log(data?.heading);
  //map these payments I
  // console.log(data?.payments);
  //inside of each there a transactionId and paymentsArray

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
