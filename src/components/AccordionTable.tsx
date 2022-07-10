import React, { useState, useRef, useEffect } from "react";
import { NestedTable } from "./NestedTable";
import { Payments } from "../models";

// interface TableProps {
//   data: Payments | undefined;
// }

export const AccordionTable = ({ data }: any) => {
  const [selected, setSelected] = useState<any>();
  console.log(data);
  const batchHeadings = data?.headings.batchHeadings;
  const batchData = data?.batchData;

  useEffect(() => {
    let nestedTableArray = document.querySelectorAll(`.nested-table`);
    nestedTableArray?.forEach((nestedTable) => {
      if (
        nestedTable.classList.contains(selected) &&
        selected &&
        nestedTable.classList.contains("open")
      ) {
        nestedTable.removeAttribute("id");
        nestedTable.classList.remove("open");
      } else if (nestedTable.classList.contains(selected) && selected) {
        nestedTable.setAttribute("id", "visible");
        nestedTable.classList.add("open");
      }
    });
  }, [selected]);

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
                    setSelected("abc" + record.transaction.label);
                    // call a function instead of using useffect
                  }}
                  key={Math.floor(Math.random() * 1000000)}
                >
                  <td>{record.contractAddress.label}</td>
                  <td>{record.processedForDate.label}</td>
                  <td>{record.transaction.label}</td>
                </tr>
                {/* toggle visibility of nested tables on click */}
                <tr
                  className={
                    "abc" +
                    record.transaction.label +
                    " hidden" +
                    " nested-table"
                  }
                >
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
