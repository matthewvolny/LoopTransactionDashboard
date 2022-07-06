import React, { useEffect, useState } from "react";
import { Transactions } from "../models";
// import * as S from "./style";

// interface TableProps {
//   data: Transactions | undefined; //why wouldn't this just be accepted as 'Transactions'
// }

interface TableProps {
  data: Transactions | undefined;
}

export const Table = ({ data }: TableProps) => {
  //   const [tableHeadings, setTableHeadings] = useState<string[]>([]);
  //!would be nice to destructure data

  //   useEffect(() => {
  //     let keyArr = [];
  //     for (let key in successfulPayments[0]) {
  //       keyArr.push(key);
  //     }
  //     console.log(keyArr);
  //     // setTableHeadings(keyArr);
  //   }, [successfulPayments]);

  console.log(data);
  return (
    <div className="app-container">
      <table className="table">
        <thead>
          {/* {tableHeadings.map((heading) => {
            return (
              <tr>
                <th>{heading}</th>
                <th>{successfulPayments[0].contractAddress}</th>
                <th>{successfulPayments[0].feeAmount}</th>
                <th>{successfulPayments[0].netAmount}</th>
                <th>{successfulPayments[0].paymentToken}</th>
                <th>{successfulPayments[0].processedForDate}</th>
                <th>{successfulPayments[0].processor}</th>
                <th>{successfulPayments[0].transaction}</th>
              </tr>
            );
          })} */}
        </thead>
        <tbody>
          {data?.records.map((transaction) => {
            return (
              <tr>
                <td>{transaction.values.accountProcessed}</td>
                <td>{transaction.contractAddress}</td>
                <td>{transaction.feeAmount}</td>
                <td>{transaction.netAmount}</td>
                <td>{transaction.paymentToken}</td>
                <td>{transaction.processedForDate}</td>
                <td>{transaction.processor}</td>
                <td>{transaction.transaction}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

//!Roccos code begins
/*
Incoming `data` prop should take the following form:
{
    headings: [
        { label: `Column Heading 1`, sortable: true },
        { label: `Column Heading 2`, sortable: false },
        // ...
    ],
    records: [
        {
            id: [any unique identifier],
            values: [
                {label: `Some number`, value: 123},
                {label: `Some string`, value: `xyz`},
                // ...
            ]
        }
    ]
}
Notes:
- Length of `headings` must matches the number of `records.values`
- Sorts by string only - revisit when TS is added and sort by type
*/

// const isAscendingDefault = true;

// export const Table = ({ data, onColumnSort = () => false, ...props }) => {
//   const [records, setRecords] = useState(data?.records || []);

//   useEffect(() => {
//     setRecords([...data.records]);
//   }, [data.records]);

//   const direction = useRef({
//     column: null,
//     isAscending: isAscendingDefault,
//   });

//   const handleClickColumnHeading = (event) => {
//     const colIndex = Number(event.currentTarget.dataset.col);

//     // Invert direction if the same column, else set the default direction on the new column
//     if (colIndex === direction.current.column) {
//       direction.current.isAscending = !direction.current.isAscending;
//     } else {
//       direction.current = {
//         column: colIndex,
//         isAscending: isAscendingDefault,
//       };
//     }

//     const sortedData = [...records];
//     const col = direction.current.column;
//     if (direction.current.isAscending) {
//       sortedData.sort((a, b) =>
//         a.values[col].value < b.values[col].value
//           ? -1
//           : a.values[col].value > b.values[col].value
//           ? 1
//           : 0
//       );
//     } else {
//       sortedData.sort((a, b) =>
//         b.values[col].value < a.values[col].value
//           ? -1
//           : b.values[col].value > a.values[col].value
//           ? 1
//           : 0
//       );
//     }

//     setRecords([...sortedData]);
//   };

//   return records.length ? (
//     <S.OverflowWrapper>
//       <S.Table {...props}>
//         <thead>
//           <tr>
//             {data.headings.map(({ label, sortable }, colIndex) => (
//               <th
//                 key={label}
//                 onClick={handleClickColumnHeading}
//                 data-col={colIndex}
//               >
//                 {label}
//                 {` `}
//                 {sortable && (
//                   <S.Sort>
//                     <S.SortArrow
//                       asc
//                       active={
//                         direction.current.isAscending &&
//                         colIndex === direction.current.column
//                       }
//                     />
//                     <S.SortArrow
//                       active={
//                         !direction.current.isAscending &&
//                         colIndex === direction.current.column
//                       }
//                     />
//                   </S.Sort>
//                 )}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {records.map(({ id, values }) => (
//             <tr key={id}>
//               {values.map(({ label, value }, col) => (
//                 <th
//                   key={`${data.headings[col].label}`}
//                   data-label={data.headings[col].label}
//                 >
//                   <data value={value}>{label || <>&nbsp;</>}</data>
//                 </th>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </S.Table>
//     </S.OverflowWrapper>
//   ) : (
//     <p>Nothing to see here</p>
//   );
// };
