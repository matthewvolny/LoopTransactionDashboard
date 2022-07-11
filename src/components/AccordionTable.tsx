import React, { useState, useRef, useEffect } from "react";
import { NestedTable } from "./NestedTable";
import { Payments } from "../models";

// interface TableProps {
//   data: Payments | undefined;
// }

export const AccordionTable = ({ data }: any) => {
  const [visibleTransactionIds, setVisibleTransactionsId] = useState<string[]>(
    []
  );
  console.log("ACCORDIONDATA", data);
  const batchHeadings = data?.headings.batchHeadings;
  const batchData = data?.batchData;

  //open or close all transactions from a particular batch
  const toggleTransactions = (batchId: string) => {
    let visibleTransactionIdsCopy = [...visibleTransactionIds];
    let nestedTableArray = document.querySelectorAll(`.nested-table`);
    //transaction already open
    if (visibleTransactionIdsCopy.includes(batchId)) {
      nestedTableArray?.forEach((nestedTable) => {
        console.log("1");
        if (nestedTable.classList.contains(batchId)) {
          nestedTable.removeAttribute("id");
          const index = visibleTransactionIdsCopy.indexOf(batchId);
          visibleTransactionIdsCopy.splice(index, 1);
        }
      });
      //transaction not already open
    } else {
      console.log("2");
      nestedTableArray?.forEach((nestedTable) => {
        nestedTable.classList.contains(batchId) &&
          nestedTable.setAttribute("id", "visible");
      });
      visibleTransactionIdsCopy.push(batchId);
    }
    setVisibleTransactionsId(visibleTransactionIdsCopy);
    console.log("VISIBLETRANSACTIONIDS", visibleTransactionIdsCopy);
  };

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
                    // setSelected("abc" + record.transaction.label);
                    toggleTransactions("abc" + record.transaction.label);
                    // call a function instead of using useffect
                  }}
                  key={Math.floor(Math.random() * 1000000)}
                >
                  <td>{record.contractAddress.label}</td>
                  <td>{record.processedForDate.label}</td>
                  <td>{record.transaction.label}</td>
                </tr>
                <tr
                  className={
                    "abc" +
                    record.transaction.label +
                    " hidden" +
                    " nested-table"
                  }
                >
                  <div>Successful Payments</div>
                  <NestedTable data={record.payments.successfulPayments} />
                  <div>Failed Payments</div>
                  <NestedTable data={record.payments.failedPayments} />
                </tr>
              </>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
